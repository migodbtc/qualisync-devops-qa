from flask import Flask, jsonify
from flask_cors import CORS

from datetime import timedelta
from resource.auth import auth_blueprint
from flask_jwt_extended import JWTManager

app = Flask(__name__)
app.config["DEBUG"] = True
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(minutes=360)
app.config["JWT_SECRET_KEY"] = "a-very-long-and-secure-secret-key-32chars"
app.config["JWT_TOKEN_LOCATION"] = ["headers", "cookies"]
app.config["JWT_COOKIE_SECURE"] = False
app.config["JWT_COOKIE_SAMESITE"] = "Lax"
app.config["JWT_REFRESH_COOKIE_NAME"] = "refresh_token_cookie"

CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

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
