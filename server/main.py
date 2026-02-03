import random
import string
import bcrypt
from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import Column, DateTime, Integer, String, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime, timedelta

engine = create_engine("sqlite:///db/database.db")
Base = declarative_base()


# helper functions for data generation
def random_email():
    domains = ["example.com", "mail.com", "test.org", "demo.net"]
    name = "".join(random.choices(string.ascii_lowercase, k=8))
    return f"{name}@{random.choice(domains)}"


def random_hash(length=32):
    return "".join(random.choices(string.ascii_letters + string.digits, k=length))


def to_json(obj):
    return {c.name: getattr(obj, c.name) for c in obj.__table__.columns}


# sqlalchemy
class AuthUser(Base):
    __tablename__ = "auth_users"
    auth_id = Column(Integer, primary_key=True, autoincrement=True)
    email_address = Column(String(length=255), unique=True)
    password_hash = Column(String(length=255), unique=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)


Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()


# mock data
def add_mock_user(email):
    if not session.query(AuthUser).filter_by(email_address=email).first():
        user = AuthUser(
            email_address=email,
            password_hash=random_hash(),
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )
        session.add(user)


add_mock_user("admin@edutechplatform.com")
add_mock_user("teacher.jane@virtualclassroom.edu")
add_mock_user("student.mike@onlinelearning.org")
add_mock_user("support@lmshelpdesk.net")
add_mock_user("principal@smartschool.edu")
add_mock_user("instructor.lisa@elearninghub.com")
add_mock_user("student.raj@campusconnect.org")
add_mock_user("parent.maria@schoolportal.net")
add_mock_user("it.support@edtechsolutions.com")
add_mock_user("registrar@digitalacademy.edu")
add_mock_user("counselor.john@virtualguidance.org")
add_mock_user("librarian@onlinelibrary.edu")
add_mock_user("admin@remoteschooling.net")
add_mock_user("teacher.anna@blendedclassroom.com")
session.commit()

# flask app + configs
app = Flask(__name__)

app.config["DEBUG"] = True
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(minutes=360)

CORS(app, supports_credentials=True, origins=["http://localhost:3000"])


@app.route("/ping", methods=["GET", "POST"])
def index():
    return {"message": "pong!"}


# AUTH_USERS ROUTES


# INDEX
@app.route("/auth_users", methods=["GET"])
def get_auth_users():
    try:
        users = session.query(AuthUser).all()
        users_json = []

        for user in users:
            users_json.append(to_json(user))

        response = jsonify(
            {
                "message": "success",
                "data": users_json,
            }
        )
        return response, 200
    except Exception as e:
        print(f"Error occured on get_auth_users(): {str(e)}")
        return jsonify({"error": str(e)}), 400


# CREATE
@app.route("/auth_users", methods=["POST"])
def post_auth_user():
    try:

        data = request.get_json()

        req_email = data["email_address"]
        req_pass = data["password_hash"]

        if session.query(AuthUser).filter_by(email_address=req_email).first():
            return (
                jsonify({"error": "Email address already exists within the database"}),
                409,
            )

        hashed_password = bcrypt.hashpw(
            req_pass.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

        new_user = AuthUser(
            email_address=req_email,
            password_hash=hashed_password,
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )
        session.add(new_user)
        session.commit()
        new_user = (
            session.query(AuthUser.auth_id)
            .filter_by(email_address=req_email)
            .first()
            ._asdict()
        )

        print(new_user)

        response = jsonify(
            {
                "message": "User successfully registered within the database",
                "data": new_user,
            }
        )
        return response, 200
    except Exception as e:
        print(f"Error occured on post_auth_user(): {str(e)}")
        return jsonify({"error": str(e)}), 400


# FETCH
@app.route("/auth_users/<int:id>", methods=["GET"])
def get_auth_user(id):
    try:
        user = to_json(session.query(AuthUser).filter_by(auth_id=id).first())

        if not user:
            return jsonify({"error": "User not found"}), 404

        response = jsonify(
            {
                "message": "success",
                "data": user,
            }
        )
        return response, 200
    except Exception as e:
        print(f"Error occured on get_auth_user(): {str(e)}")
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5821)
