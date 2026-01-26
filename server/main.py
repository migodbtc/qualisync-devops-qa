from flask import Flask
from flask_cors import CORS
from sqlalchemy import Column, DateTime, Integer, String, create_engine 
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime, timedelta

engine = create_engine('sqlite:///server/db/database.db')
Base = declarative_base()

class AuthUser(Base):
    __tablename__ = 'auth_users'
    auth_id = Column(Integer, primary_key=True, autoincrement=True)
    email_address = Column(String(length=255), unique=True)
    password_hash = Column(String(length=255), unique=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

Base.metadata.create_all(engine)
print("Models (tables) created!")

Session = sessionmaker(bind=engine)
session = Session()
print("Session created!")

query_auth_users = session.query(AuthUser)
print(query_auth_users)

app = Flask(__name__)

app.config['DEBUG'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=360)

CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

app.route('/ping', methods=['GET', 'POST'])
def index():

    return {"message": "pong!"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5821)