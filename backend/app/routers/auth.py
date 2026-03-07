from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from slowapi import Limiter
from slowapi.util import get_remote_address
from jose import JWTError, jwt
import os
from dotenv import load_dotenv

from app.database import SessionLocal, engine, Base
from app.models import User
from app.schemas import UserCreate, UserResponse, Token
from app.auth import (
    hash_password, verify_password,
    create_access_token, create_refresh_token,
    SECRET_KEY, ALGORITHM
)

load_dotenv()

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

if not ADMIN_USERNAME or not ADMIN_PASSWORD:
    raise ValueError("ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env")

ADMIN_CREDS = {
    ADMIN_USERNAME: ADMIN_PASSWORD
}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

Base.metadata.create_all(bind=engine)
limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Check if registering as admin
    is_admin = (
        user.username == ADMIN_USERNAME and
        user.password == ADMIN_PASSWORD
    )

    hashed_password = hash_password(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        role="admin" if is_admin else "user"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
@limiter.limit("5/minute")
def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == form_data.username).first()
    if not db_user or not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not db_user.is_active:
        raise HTTPException(status_code=403, detail="Your account has been banned")

    if form_data.username in ADMIN_CREDS:
        if form_data.password != ADMIN_CREDS[form_data.username]:
            raise HTTPException(status_code=403, detail="Invalid admin credentials")
        db_user.role = "admin"
        db.commit()

    access_token = create_access_token(data={"sub": db_user.email})
    refresh_token = create_refresh_token(data={"sub": db_user.email})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "role": db_user.role
    }

@router.post("/refresh")
def refresh(payload: dict, db: Session = Depends(get_db)):
    token = payload.get("refresh_token")
    credentials_exception = HTTPException(status_code=401, detail="Invalid refresh token")
    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if data.get("type") != "refresh":
            raise credentials_exception
        email = data.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise credentials_exception

    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role
    }