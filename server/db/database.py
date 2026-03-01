import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from typing import Optional

load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT", "3306") # port already has a default value 
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

missing_env_tuple = (("DB_HOST",DB_HOST),("DB_USER",DB_USER),("DB_NAME",DB_NAME))
# cant continue if host, user, and db name is missing
missing = [k for k,v in missing_env_tuple if not v]
if missing:
    raise RuntimeError(f"Missing required DB env vars: {', '.join(missing)}")

# although password is optional
auth = f"{DB_USER}:{DB_PASSWORD}@" if DB_PASSWORD else f"{DB_USER}@"
DATABASE_URL = f"mysql+pymysql://{auth}{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()