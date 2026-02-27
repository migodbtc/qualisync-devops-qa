from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine("mysql+pymysql://root:@localhost/fuchsia_atms_db")
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()
