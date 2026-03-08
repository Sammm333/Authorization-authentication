import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

SQL_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./users.db")

if SQL_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(SQL_DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(SQL_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()