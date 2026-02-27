from datetime import datetime, timezone
import bcrypt
from flask import Blueprint, jsonify, make_response, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
    set_refresh_cookies,
    unset_refresh_cookies,
    verify_jwt_in_request,
)

from db.models import AuthUser, RefreshToken, Role, Session
from db.database import db

# === BLUEPRINT DECLARATION ===
auth_blueprint = Blueprint("auth", __name__, url_prefix="/auth")

# === HELPER FUNCTIONS ===


def hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(hashed, password):
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


def store_jti(user_id, jti, expires_at_str):
    token = RefreshToken(
        user_id=user_id,
        token=jti,
        expires_at=datetime.strptime(expires_at_str, "%Y-%m-%d %H:%M:%S"),
    )
    db.add(token)
    db.commit()


def revoke_jti(jti):
    token = db.query(RefreshToken).filter_by(token=jti).first()
    if token:
        token.revoked = 1
        db.commit()
        return True
    return False


def find_by_jti(jti):
    return db.query(RefreshToken).filter_by(token=jti).first()


def create_session(user_id, session_id, user_agent, ip_address, expires_at):
    if not all([user_id, session_id, user_agent, ip_address, expires_at]):
        raise ValueError("All parameters are required for session creation")
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


def unpack_register_payload(payload):
    email = payload.get("email")
    password = payload.get("password")
    username = payload.get("username") or email
    role = payload.get("role", "tenant")
    if not email:
        raise ValueError("Email missing from payload")
    if not password:
        raise ValueError("Password missing from payload")
    return email, password, username, role


def unpack_login_payload(payload):
    email = payload.get("email")
    password = payload.get("password")
    if not email:
        raise ValueError("Email missing from payload")
    if not password:
        raise ValueError("Password missing from payload")
    return email, password


def validate_register(email, password, role):
    errors = []
    if not email or not password:
        raise ValueError("email and password are required")
    if role not in ("tenant", "admin", "staff"):
        raise ValueError("invalid role")
    return errors


def validate_login(email, password):
    if not email or not password:
        raise ValueError("email and password are required")
    return []


def generate_tokens_and_claims(user):
    if not user or not hasattr(user, "id") or user.id is None:
        raise ValueError("Invalid user object for token generation")
    try:
        identity = str(user.id)
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
        if not all([access_token, refresh_token, jti, exp]):
            raise ValueError("Token generation failed: missing values")
        expires_at = datetime.fromtimestamp(exp, timezone.utc)
        expires_at_str = expires_at.strftime("%Y-%m-%d %H:%M:%S")
        return access_token, refresh_token, jti, expires_at, expires_at_str
    except Exception as e:
        raise ValueError(f"Token generation failed: {e}")


# === ROUTES ===


@auth_blueprint.route("/register", methods=["POST"])
def register():
    try:
        payload = request.get_json() or {}
        email, password, username, role = unpack_register_payload(payload)
        errors = validate_register(email, password, role)
        if errors:
            return jsonify({"error": errors}), 400

        # Check if the user already exists
        existing = db.query(AuthUser).filter_by(email=email).first()
        if existing:
            return jsonify({"error": "User already exists"}), 400

        # Hash the password and create the user
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

        return jsonify({"id": user.id}), 201  # Return 201 Created
    except (ValueError, TypeError, KeyError) as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:

        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@auth_blueprint.route("/login", methods=["POST"])
def login():
    try:
        payload = request.get_json() or {}
        email, password = unpack_login_payload(payload)
        errors = validate_login(email, password)
        if errors:
            return jsonify({"error": errors}), 400
        user = db.query(AuthUser).filter_by(email=email).first()
        if not user or not verify_password(user.password_hash, password):
            return jsonify({"error": "invalid credentials"}), 401
        access_token, refresh_token, jti, expires_at, expires_at_str = (
            generate_tokens_and_claims(user)
        )
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
    except (ValueError, TypeError, KeyError) as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@auth_blueprint.route("/refresh", methods=["POST"])
@jwt_required(refresh=True, locations=["cookies"])
def refresh():
    try:
        identity = get_jwt_identity()
        new_access = create_access_token(identity=identity)
        return jsonify({"access_token": new_access})
    except (ValueError, TypeError, KeyError) as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@auth_blueprint.route("/logout", methods=["POST"])
@jwt_required(refresh=True, locations=["cookies"])
def logout():
    try:
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
    except (ValueError, TypeError, KeyError) as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@auth_blueprint.route("/session", methods=["GET"])
@jwt_required(refresh=True, locations=["cookies"])
def session_info():
    try:
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
    except (ValueError, TypeError, KeyError) as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@auth_blueprint.route("/me", methods=["GET"])
@jwt_required()
def me():
    try:
        identity = get_jwt_identity()
        user = db.query(AuthUser).filter_by(id=identity).first()
        if not user:
            return jsonify({"authenticated": False}), 401
        role_obj = db.query(Role).filter_by(id=user.role_id).first()
        return jsonify(
            {
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "role": role_obj.name if role_obj else None,
            }
        )
    except (ValueError, TypeError, KeyError) as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@auth_blueprint.route("/delete", methods=["DELETE"])
def delete_user():
    try:
        payload = request.get_json() or {}
        email = payload.get("email")
        password = payload.get("password")

        if not email:
            return jsonify({"error": "Email is required"}), 400

        user = db.query(AuthUser).filter_by(email=email).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        auth_header = request.headers.get("Authorization", "")

        # Path 1: credential-based deletion — email + password, no JWT required
        if not auth_header:
            if not password:
                return (
                    jsonify({"error": "Password required when no token is provided"}),
                    400,
                )
            if not verify_password(user.password_hash, password):
                return jsonify({"error": "Invalid credentials"}), 401
            db.delete(user)
            db.commit()
            msg = {"message": f"User with email {email} deleted successfully"}
            return jsonify(msg), 200

        # Path 2: JWT-based deletion
        verify_jwt_in_request()
        identity = get_jwt_identity()

        if str(user.id) != identity:
            role_obj = db.query(Role).filter_by(id=user.role_id).first()
            if not role_obj or role_obj.name != "admin":
                return jsonify({"error": "Unauthorized"}), 403

        db.delete(user)
        db.commit()
        msg = {"message": f"User with email {email} deleted successfully"}
        return jsonify(msg), 200

    except (ValueError, TypeError, KeyError) as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
