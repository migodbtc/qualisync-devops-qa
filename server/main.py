import random
import string
import bcrypt
from datetime import timezone
from flask import Flask, jsonify, make_response, request
from flask_cors import CORS
from sqlalchemy import Column, DateTime, Integer, String, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime, timedelta
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
    decode_token,
    set_refresh_cookies,
    unset_refresh_cookies,
)

engine = create_engine("mysql+pymysql://root:@localhost/fuchsia_atms_db")
Base = declarative_base()


def to_json(obj):
    return {c.name: getattr(obj, c.name) for c in obj.__table__.columns}


# sqlalchemy


# ORM Models mapped from migrations
class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), unique=True, nullable=False)


class AuthUser(Base):
    __tablename__ = "auth_users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role_id = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.now)


class Tenant(Base):
    __tablename__ = "tenants"
    user_id = Column(Integer, primary_key=True)
    full_name = Column(String(100), nullable=False)
    phone = Column(String(20))
    status = Column(String(8), default="prospect")  # ENUM('prospect', 'active', 'past')


class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, autoincrement=True)
    room_number = Column(String(10), unique=True, nullable=False)
    floor = Column(Integer)
    type = Column(
        String(10), default="studio"
    )  # ENUM('studio', '1BR', '2BR', '3BR', 'commercial')
    status = Column(
        String(12), default="vacant"
    )  # ENUM('vacant', 'occupied', 'maintenance')
    base_rent = Column(String(10))


class Lease(Base):
    __tablename__ = "leases"
    id = Column(Integer, primary_key=True, autoincrement=True)
    tenant_id = Column(Integer, nullable=False)
    room_id = Column(Integer, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    rent_amount = Column(String(10), nullable=False)
    deposit_amount = Column(String(10), default="0.00")
    is_active = Column(Integer, default=1)  # BOOLEAN


class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, autoincrement=True)
    lease_id = Column(Integer, nullable=False)
    amount_due = Column(String(10), nullable=False)
    amount_paid = Column(String(10), default="0.00")
    due_date = Column(DateTime, nullable=False)
    paid_date = Column(DateTime)
    payment_type = Column(
        String(20)
    )  # ENUM('cash', 'bank_transfer', 'credit_card', 'check')
    status = Column(
        String(10), default="pending"
    )  # ENUM('pending', 'partial', 'paid', 'overdue')


class MaintenanceRequest(Base):
    __tablename__ = "maintenance_requests"
    id = Column(Integer, primary_key=True, autoincrement=True)
    tenant_id = Column(Integer, nullable=False)
    room_id = Column(Integer, nullable=False)
    description = Column(String)
    priority = Column(
        String(10), default="medium"
    )  # ENUM('low', 'medium', 'high', 'emergency')
    status = Column(String(15), default="open")  # ENUM('open', 'in progress', 'closed')
    request_date = Column(DateTime, default=datetime.now)
    resolved_date = Column(DateTime)


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False)
    token = Column(String(255), unique=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    revoked = Column(Integer, default=0)  # BOOLEAN
    created_at = Column(DateTime, default=datetime.now)


class Session(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False)
    session_id = Column(String(100), unique=True, nullable=False)
    user_agent = Column(String(255))
    ip_address = Column(String(45))
    created_at = Column(DateTime, default=datetime.now)
    expires_at = Column(DateTime)
    revoked = Column(Integer, default=0)  # BOOLEAN


class JWTBlacklist(Base):
    __tablename__ = "jwt_blacklist"
    id = Column(Integer, primary_key=True, autoincrement=True)
    token = Column(String(255), unique=True, nullable=False)
    user_id = Column(Integer)
    revoked_at = Column(DateTime, default=datetime.now)
    expires_at = Column(DateTime)


Base.metadata.create_all(engine)


# Avoid naming conflict: use SessionLocal for factory, db for instance
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

# flask app + configs

app = Flask(__name__)
app.config["DEBUG"] = True
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(minutes=360)
app.config["JWT_SECRET_KEY"] = "super-secret-key"  # Change this in production!
app.config["JWT_TOKEN_LOCATION"] = ["headers", "cookies"]
app.config["JWT_COOKIE_SECURE"] = False
app.config["JWT_COOKIE_SAMESITE"] = "Lax"
app.config["JWT_REFRESH_COOKIE_NAME"] = "refresh_token_cookie"

CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

jwt = JWTManager(app)

# --- Token/JWT Helper Functions ---


def hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(hashed, password):
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


# --- Token Storage (Refresh Token JTI) ---
def store_jti(user_id, jti, expires_at_str):
    # Store refresh token JTI in DB
    token = RefreshToken(
        user_id=user_id,
        token=jti,
        expires_at=datetime.strptime(expires_at_str, "%Y-%m-%d %H:%M:%S"),
    )
    db.add(token)
    db.commit()


def revoke_jti(jti):
    # Revoke refresh token by JTI
    token = db.query(RefreshToken).filter_by(token=jti).first()
    if token:
        token.revoked = 1
        db.commit()
        return True
    return False


def find_by_jti(jti):
    return db.query(RefreshToken).filter_by(token=jti).first()

def create_session(user_id, session_id, user_agent, ip_address, expires_at):
    new_session = Session(
        user_id=user_id,
        session_id=session_id,
        user_agent=user_agent,
        ip_address=ip_address,
        created_at=datetime.now(),
        expires_at=expires_at,
        revoked=0
    )
    db.add(new_session)
    db.commit()
    return new_session

def revoke_session(session_id):
    sess = db.query(Session).filter_by(session_id=session_id, revoked=0).first()
    if sess:
        sess.revoked = 1
        db.commit()
        return True
    return False


# --- AUTH ROUTES ---
@app.route("/auth/register", methods=["POST"])
def register():
    payload = request.get_json() or {}
    email = payload.get("email")
    password = payload.get("password")
    role = payload.get("role", "tenant")
    username = payload.get("username") or email
    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400
    if role not in ("tenant", "admin", "staff"):
        return jsonify({"error": "invalid role"}), 400
    existing = db.query(AuthUser).filter_by(email=email).first()
    if existing:
        return jsonify({"error": "user already exists"}), 400
    pw_hash = hash_password(password)
    role_obj = db.query(Role).filter_by(name=role).first()
    role_id = role_obj.id if role_obj else 1
    user = AuthUser(
        username=username,
        email=email,
        password_hash=pw_hash,
        role_id=role_id,
        created_at=datetime.now(),
    )
    db.add(user)
    db.commit()
    return jsonify({"id": user.id}), 201


@app.route("/auth/login", methods=["POST"])
def login():
    payload = request.get_json() or {}
    email = payload.get("email")
    password = payload.get("password")
    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400
    user = db.query(AuthUser).filter_by(email=email).first()
    if not user or not verify_password(user.password_hash, password):
        return jsonify({"error": "invalid credentials"}), 401
    identity = str(user.id)
    # Add role and email as claims
    role_obj = db.query(Role).filter_by(id=user.role_id).first()
    additional_claims = {
        "role": role_obj.name if role_obj else "tenant",
        "email": user.email,
    }
    access_token = create_access_token(
        identity=identity, additional_claims=additional_claims
    )
    refresh_token = create_refresh_token(identity=identity)
    decoded = decode_token(refresh_token)
    jti = decoded.get("jti")
    exp = decoded.get("exp")
    expires_at = datetime.fromtimestamp(exp, timezone.utc)
    expires_at_str = expires_at.strftime("%Y-%m-%d %H:%M:%S")
    try:
        store_jti(user.id, jti, expires_at_str)
        user_agent = request.headers.get('User-Agent', '')
        ip_address = request.remote_addr or ''
        create_session(user.id, jti, user_agent, ip_address, expires_at)
    except Exception as e:
        print("Session logging error: ", e)
    resp = make_response(
        jsonify({"access_token": access_token, "token_type": "bearer"})
    )
    set_refresh_cookies(resp, refresh_token)

    return resp


@app.route("/auth/refresh", methods=["POST"])
@jwt_required(refresh=True, locations=["cookies"])
def refresh():
    identity = get_jwt_identity()
    new_access = create_access_token(identity=identity)
    return jsonify({"access_token": new_access})


@app.route("/auth/logout", methods=["POST"])
@jwt_required(refresh=True, locations=["cookies"])
def logout():
    jwt_payload = get_jwt()
    jti = jwt_payload.get("jti")
    if not jti:
        print("No JTI in JWT payload")
        return jsonify({"error": "Invalid token"}), 400
    affected = revoke_jti(jti)
    session_revoked = revoke_session(jti)
    resp = jsonify({'revoked': bool(affected and session_revoked)})
    unset_refresh_cookies(resp)
    return resp, 200 if affected and session_revoked else 400


@app.route("/auth/session", methods=["GET"])
@jwt_required(refresh=True, locations=["cookies"])
def session_info():
    identity = get_jwt_identity()
    user = db.query(AuthUser).filter_by(id=identity).first()
    if not user:
        print("No user found, returning 401")
        return jsonify({"authenticated": False}), 401
    role_obj = db.query(Role).filter_by(id=user.role_id).first()
    resp = {
        "authenticated": True,
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "role": role_obj.name if role_obj else None,
        },
    }
    return jsonify(resp)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5821)
