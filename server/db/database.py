import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# configs for sql engine
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "very_secure_password_for_qualisync")
DB_NAME = os.getenv("DB_NAME", "fuchsia_atms_db")

# engine string
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()
