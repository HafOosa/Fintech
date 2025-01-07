from fastapi import Depends, HTTPException, APIRouter
from dotenv import load_dotenv
from database import get_db, Session
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import os
from models import Utilisateur
from models import CryptoWallets  


load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email = payload.get("sub")
        if user_email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = db.query(Utilisateur).filter(Utilisateur.email == user_email).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        print(user.user_id)
        return user.user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Pydantic schemas
class CryptoWalletBase(BaseModel):
    wallet_id: str
    user_id: int
    private_key: str

    pass

class CryptoWallet(CryptoWalletBase):
    class Config:
        orm_mode = True



def create_crypto_wallet(wallet_id: str, private_key: str, db: Session, user_id: int):
    # Check if the user already has a wallet
    existing_wallet = db.query(CryptoWallets).filter(CryptoWallets.user_id == user_id).first()
    if existing_wallet:
        print(f"User {user_id} already has a wallet: {existing_wallet.wallet_id}")
        raise HTTPException(status_code=400, detail="User already has a wallet")

    # Create the new wallet
    db_wallet = CryptoWallets(wallet_id=wallet_id, private_key=private_key, user_id=user_id)
    db.add(db_wallet)
    db.commit()
    db.refresh(db_wallet)
    print(f"Wallet created for user {user_id}: {db_wallet.wallet_id}")
    return db_wallet



def read_crypto_wallet( user_id: int,db: Session = Depends(get_db)):
    wallet = db.query(CryptoWallets).filter(CryptoWallets.user_id == user_id).first()
    if wallet is None:
        raise HTTPException(status_code=404, detail="Wallet not found")
    print(wallet)
    return wallet

