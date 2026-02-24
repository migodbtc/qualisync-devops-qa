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

app.register_blueprint(auth_blueprint)


@app.route("/", methods=["GET"])
def index():
    return jsonify({"message": "API running"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5821)
