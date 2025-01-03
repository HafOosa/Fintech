from fastapi import Depends, HTTPException, APIRouter
from dotenv import load_dotenv
from database import get_db, Session
from pydantic import BaseModel
from models import Wallets, WalletTransaction
import secrets
from datetime import datetime, timezone
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import os
from models import Utilisateur



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
        return user.user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# Schémas Pydantic
class WalletResponse(BaseModel):
    wallet_id: int
    user_id: int
    balance: float
    address: str

    class Config:
        orm_mode = True


class WalletUpdate(BaseModel):
    amount: float


class HistoriqueWalletInfo(BaseModel):
    transaction_id: int
    wallet_id: int
    transaction_type: str
    amount: float
    timestamp: datetime

    class Config:
        orm_mode = True


def generate_wallet_address():
    return f"wallet_{secrets.token_hex(16)}"


# Initialisation du router
router = APIRouter()



@router.post('/wallets', response_model=WalletResponse)
def create_wallet(
        db: Session = Depends(get_db),
        user_id: int = Depends(get_current_user)
):
    existing_wallet = db.query(Wallets).filter(Wallets.user_id == user_id).first()
    if existing_wallet:
        raise HTTPException(status_code=400, detail="Wallet already exists for this user")

    address = generate_wallet_address()
    new_wallet = Wallets(user_id=user_id, balance=0.0, address=address)
    db.add(new_wallet)
    db.commit()
    db.refresh(new_wallet)
    return new_wallet


@router.get('/wallets', response_model=WalletResponse)
def get_wallet(
        db: Session = Depends(get_db),
        user_id: int = Depends(get_current_user)
):
    wallet = db.query(Wallets).filter(Wallets.user_id == user_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    return wallet


@router.put('/wallets/deposit', response_model=WalletResponse)
def deposit_funds(
        update: WalletUpdate,
        db: Session = Depends(get_db),
        user_id: int = Depends(get_current_user)
):
    # Dépôt dans le wallet
    wallet = db.query(Wallets).filter(Wallets.user_id == user_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    if update.amount <= 0:
        raise HTTPException(status_code=400, detail="Deposit amount must be positive")

    wallet.balance += update.amount
    transaction = WalletTransaction(
        wallet_id=wallet.wallet_id,
        transaction_type="deposit",
        amount=update.amount,
        timestamp=datetime.now(timezone.utc)
    )
    db.add(transaction)
    db.commit()
    db.refresh(wallet)
    return wallet


@router.put('/wallets/withdraw', response_model=WalletResponse)
def withdraw_funds(
        update: WalletUpdate,
        db: Session = Depends(get_db),
        user_id: int = Depends(get_current_user)
):
    wallet = db.query(Wallets).filter(Wallets.user_id == user_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    if update.amount <= 0:
        raise HTTPException(status_code=400, detail="Withdrawal amount must be positive")
    if wallet.balance < update.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    wallet.balance -= update.amount
    transaction = WalletTransaction(
        wallet_id=wallet.wallet_id,
        transaction_type="withdraw",
        amount=update.amount,
        timestamp=datetime.now(timezone.utc)
    )
    db.add(transaction)
    db.commit()
    db.refresh(wallet)
    return wallet


@router.get('/wallets/history', response_model=list[HistoriqueWalletInfo])
def afficher_historique(
        db: Session = Depends(get_db),
        user_id: int = Depends(get_current_user)
):
    wallet = db.query(Wallets).filter(Wallets.user_id == user_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")

    transactions = db.query(WalletTransaction).filter(WalletTransaction.wallet_id == wallet.wallet_id).all()
    if not transactions:
        raise HTTPException(status_code=404, detail="No transactions found for this wallet")
    return transactions
