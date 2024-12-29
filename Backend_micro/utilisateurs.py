from fastapi import FastAPI,Depends,HTTPException
from pydantic import BaseModel,EmailStr
from typing import Optional
from database import Session,get_db
from models import Utilisateur
from security import hash_password,verify_password
from jose import jwt,JWTError
from datetime import datetime, timedelta,timezone
from dotenv import load_dotenv
import os
from fastapi.security import OAuth2PasswordBearer

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")



class CreateUser(BaseModel):
    name : str
    email : str
    password : str
    role : str

class UpdateUser(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

    class Config:
        schema_extra = {
            "example": {
                "name": "Updated Name",
                "email": "updated.email@example.com",
                "password": "NewPassword123"
            }
        }

class UserResponse(BaseModel):
    user_id: int
    name: str
    email: str
    role: str

    class Config:
        orm_mode = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    user: UserResponse
    access_token: str
    token_type: str



def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email: str = payload.get("sub")
        if user_email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = db.query(Utilisateur).filter(Utilisateur.email == user_email).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")


app = FastAPI()


@app.get("/")
def root():
    return {"message": "Welcome to the users Microservice"}


@app.get('/users', response_model=list[UserResponse])
def get_users(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: Utilisateur = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access forbidden")
    users = db.query(Utilisateur).offset(skip).limit(limit).all()
    if not users:
        raise HTTPException(status_code=404, detail="No users found")
    return users



@app.get('/users/{user_id}', response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db), current_user: Utilisateur = Depends(get_current_user)):
    if current_user.role != "admin" and current_user.user_id != user_id:
        raise HTTPException(status_code=403, detail="Access forbidden")
    user = db.query(Utilisateur).filter(Utilisateur.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.post('/users', response_model=UserResponse)
def add_user(user: CreateUser, db: Session = Depends(get_db), current_user: Utilisateur = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access forbidden")
    existing_user = db.query(Utilisateur).filter(Utilisateur.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = hash_password(user.password)
    new_user = Utilisateur(
        name=user.name,
        email=user.email,
        password=hashed_password,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user



@app.delete('/users/{user_id}')
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: Utilisateur = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access forbidden")
    user = db.query(Utilisateur).filter(Utilisateur.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"detail": "User deleted successfully"}


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=1)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@app.post('/users/login', response_model=LoginResponse)
def login_user(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(Utilisateur).filter(Utilisateur.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({"sub": user.email, "user_id": user.user_id})
    return {
        "user": {
            "user_id": user.user_id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        },
        "access_token": access_token,
        "token_type": "bearer"
    }


@app.put('/users/{user_id}', response_model=UserResponse)
def update_user(
    user_id: int,
    user_data: UpdateUser,
    db: Session = Depends(get_db),
    current_user: Utilisateur = Depends(get_current_user)
):
    if current_user.user_id != user_id:
        raise HTTPException(status_code=403, detail="You can only update your own information")

    user = db.query(Utilisateur).filter(Utilisateur.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user_data.name:
        user.name = user_data.name
    if user_data.email:
        existing_user = db.query(Utilisateur).filter(Utilisateur.email == user_data.email).first()
        if existing_user and existing_user.user_id != user_id:
            raise HTTPException(status_code=400, detail="Email already in use")
        user.email = user_data.email
    if user_data.password:
        user.password = hash_password(user_data.password)

    db.commit()
    db.refresh(user)
    return user