from sqlalchemy import Column, DateTime, Integer, String, create_engine 
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

engine = create_engine('sqlite:///server/database.db')
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