from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

import os
from datetime import timedelta
from resource.auth import auth_blueprint
from flask_jwt_extended import JWTManager

load_dotenv()

# the flask is flasking (Flask API initial config)
REQUIRED_FLASK_VARS = [
    "FLASK_API_HOST",
    "FLASK_API_PORT",
    "FLASK_DEBUG",
    "FLASK_PERMANENT_SESSION_MINUTES",
]
flask_env = {var: os.getenv(var) for var in REQUIRED_FLASK_VARS}
missing = [k for k, v in flask_env.items() if not v]
if missing:
    raise ValueError(f"Missing required Flask API env vars: {', '.join(missing)}")
app = Flask(__name__)
app.config["DEBUG"] = os.getenv("FLASK_DEBUG")
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(
    minutes=int(os.getenv("FLASK_PERMANENT_SESSION_MINUTES"))
)

# the jawot config (JWT config)
REQUIRED_JWT_VARS = [
    "JWT_SECRET_KEY",
    "JWT_TOKEN_LOCATION",
    "JWT_COOKIE_SECURE",
    "JWT_COOKIE_SAMESITE",
    "JWT_REFRESH_COOKIE_NAME",
]
jwt_env = {var: os.getenv(var) for var in REQUIRED_JWT_VARS}
missing = [k for k, v in jwt_env.items() if not v]
if missing:
    raise ValueError(f"Missing required JWT env vars: {', '.join(missing)}")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_TOKEN_LOCATION"] = os.getenv("JWT_TOKEN_LOCATION").split(",")
app.config["JWT_COOKIE_SECURE"] = os.getenv("JWT_COOKIE_SECURE").lower() in (
    "1",
    "true",
    "yes",
)
app.config["JWT_COOKIE_SAMESITE"] = os.getenv("JWT_COOKIE_SAMESITE")
app.config["JWT_REFRESH_COOKIE_NAME"] = os.getenv("JWT_REFRESH_COOKIE_NAME")

# stream corsonada by adie (CORS config)
allowed_origins = os.environ.get("CORS_ALLOWED_ORIGINS").split(",")
if allowed_origins is None:
    raise ValueError(
        f"Missing allowed_origins environment variable (must at least be one)."
    )
CORS(app, supports_credentials=True, origins=allowed_origins)

jwt = JWTManager(app)


@jwt.invalid_token_loader
def invalid_token_callback(error_string):
    return jsonify({"error": "Invalid token"}), 401


@jwt.unauthorized_loader
def missing_token_callback(error_string):
    return jsonify({"error": "Missing token"}), 401


@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({"error": "Token has expired"}), 401


app.register_blueprint(auth_blueprint)


@app.route("/", methods=["GET"])
def index():
    return jsonify({"message": "API running"}), 200


if __name__ == "__main__":
    app.run(host=os.getenv("FLASK_API_HOST"), port=os.getenv("FLASK_API_PORT"))
