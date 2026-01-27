import random
import string
from flask import Flask, jsonify
from flask_cors import CORS
from sqlalchemy import Column, DateTime, Integer, String, create_engine 
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime, timedelta

engine = create_engine('sqlite:///server/db/database.db')
Base = declarative_base()

# helper functions for data generation
def random_email():
    domains = ["example.com", "mail.com", "test.org", "demo.net"]
    name = ''.join(random.choices(string.ascii_lowercase, k=8))
    return f"{name}@{random.choice(domains)}"

def random_hash(length=32):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))


# sqlalchemy
class AuthUser(Base):
    __tablename__ = 'auth_users'
    auth_id = Column(Integer, primary_key=True, autoincrement=True)
    email_address = Column(String(length=255), unique=True)
    password_hash = Column(String(length=255), unique=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

new_user_1 = AuthUser(email_address="")

# flask app + configs
app = Flask(__name__)

app.config['DEBUG'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=360)

CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

@app.route('/ping', methods=['GET', 'POST'])
def index():
    return {"message": "pong!"}

@app.route('/auth_users', methods=['GET'])
def get_auth_users():
    try:
        pass
    except Exception as e:
        print(f"Error occured on get_auth_users(): {str(e)}")
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5821)