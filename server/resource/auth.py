from datetime import datetime, timezone
import bcrypt
from flask import Blueprint, jsonify, make_response, request
from flask_jwt_extended import create_access_token, create_refresh_token, decode_token, get_jwt, get_jwt_identity, jwt_required, set_refresh_cookies, unset_refresh_cookies

from db.models import AuthUser, RefreshToken, Role, Session
from db.database import db

auth_blueprint = Blueprint(
    'auth',
    __name__,
    url_prefix='/auth'
)


def hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(hashed, password):
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))

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
        revoked=0,
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

@auth_blueprint.route("/register", methods=["POST"])
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


@auth_blueprint.route("/login", methods=["POST"])
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
        user_agent = request.headers.get("User-Agent", "")
        ip_address = request.remote_addr or ""
        create_session(user.id, jti, user_agent, ip_address, expires_at)
    except Exception as e:
        print("Session logging error: ", e)
    resp = make_response(
        jsonify({"access_token": access_token, "token_type": "bearer"})
    )
    set_refresh_cookies(resp, refresh_token)

    return resp


@auth_blueprint.route("/refresh", methods=["POST"])
@jwt_required(refresh=True, locations=["cookies"])
def refresh():
    identity = get_jwt_identity()
    new_access = create_access_token(identity=identity)
    return jsonify({"access_token": new_access})


@auth_blueprint.route("/logout", methods=["POST"])
@jwt_required(refresh=True, locations=["cookies"])
def logout():
    jwt_payload = get_jwt()
    jti = jwt_payload.get("jti")
    if not jti:
        print("No JTI in JWT payload")
        return jsonify({"error": "Invalid token"}), 400
    affected = revoke_jti(jti)
    session_revoked = revoke_session(jti)
    resp = jsonify({"revoked": bool(affected and session_revoked)})
    unset_refresh_cookies(resp)
    return resp, 200 if affected and session_revoked else 400


@auth_blueprint.route("/session", methods=["GET"])
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
