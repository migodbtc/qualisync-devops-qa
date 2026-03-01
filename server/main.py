from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

import os
from datetime import timedelta
from resource.auth import auth_blueprint
from flask_jwt_extended import JWTManager

load_dotenv()

app = Flask(__name__)
app.config["DEBUG"] = os.getenv("FLASK_DEBUG").lower() in ("1", "true", "yes")
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(
    minutes=int(os.getenv("PERMANENT_SESSION_MINUTES"))
)
app.config["JWT_SECRET_KEY"] = os.getenv(
    "JWT_SECRET_KEY"
)
app.config["JWT_TOKEN_LOCATION"] = os.getenv(
    "JWT_TOKEN_LOCATION"
).split(",")
app.config["JWT_COOKIE_SECURE"] = os.getenv("JWT_COOKIE_SECURE").lower() in (
    "1",
    "true",
    "yes",
)
app.config["JWT_COOKIE_SAMESITE"] = os.getenv("JWT_COOKIE_SAMESITE")
app.config["JWT_REFRESH_COOKIE_NAME"] = os.getenv(
    "JWT_REFRESH_COOKIE_NAME"
)

allowed_origins = os.environ.get("CORS_ALLOWED_ORIGINS", "http://localhost:3000").split(',')
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
    app.run(host="0.0.0.0", port=5821)
