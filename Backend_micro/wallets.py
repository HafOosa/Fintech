import os
from fastapi import FastAPI,Depends,HTTPException
from dotenv import load_dotenv
from database import get_db,Session
from pydantic import BaseModel
from models import Wallets,WalletTransaction
import secrets
from datetime import datetime,timezone
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError


load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


class WalletCreate(BaseModel):
    user_id: int

class WalletResponse(BaseModel):
    wallet_id: int
    user_id: int
    balance: float
    address: str

    class Config:
        orm_mode = True

class WalletUpdate(BaseModel):
    amount: float

class HistoriqueWallet(BaseModel):
    wallet_id: int

class HistoriqueWalletInfo(BaseModel):
    transaction_id : int
    wallet_id : int
    transaction_type : str
    amount: float
    timestamp: datetime

    class Config:
        orm_mode = True

def generate_wallet_address():
    return f"wallet_{secrets.token_hex(16)}"


app = FastAPI()


@app.get("/")
def root():
    return {"message": "Welcome to the wallets Microservice"}


#Creer un protefeuille pour un user
@app.post('/wallets', response_model=WalletResponse)
def create_wallet(
    wallet_data: WalletCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    if wallet_data.user_id != user_id:
        raise HTTPException(status_code=403, detail="Operation not allowed")

    existing_wallet = db.query(Wallets).filter(Wallets.user_id == wallet_data.user_id).first()
    if existing_wallet:
        raise HTTPException(status_code=400, detail="Wallet already exists for this user")
    address = generate_wallet_address()

    # Crée le portefeuille
    new_wallet = Wallets(user_id=wallet_data.user_id, balance=0.0, address=address)
    db.add(new_wallet)
    db.commit()
    db.refresh(new_wallet)
    return new_wallet



# Consultation du solde
@app.get('/wallets/{user_id}', response_model=WalletResponse)
def get_wallet(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user)
):
    if user_id != current_user:
        raise HTTPException(status_code=403, detail="Access denied")

    wallet = db.query(Wallets).filter(Wallets.user_id == user_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    return wallet



# Dépôt de fonds
@app.put('/wallets/{user_id}/deposit', response_model=WalletResponse)
def deposit_funds(
    user_id: int,
    update: WalletUpdate,
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user)  # Vérification JWT
):
    if user_id != current_user:
        raise HTTPException(status_code=403, detail="Access denied")

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



# Retrait de fonds
@app.put('/wallets/{user_id}/withdraw', response_model=WalletResponse)
def withdraw_funds(
    user_id: int,
    update: WalletUpdate,
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user)  # Vérification JWT
):
    if user_id != current_user:
        raise HTTPException(status_code=403, detail="Access denied")

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


# Historique des transactions
@app.get('/wallets/{user_id}/history', response_model=list[HistoriqueWalletInfo])
def afficher_historique(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user)  # Vérification JWT
):
    if user_id != current_user:
        raise HTTPException(status_code=403, detail="Access denied")

    wallet = db.query(Wallets).filter(Wallets.user_id == user_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")

    transactions = db.query(WalletTransaction).filter(WalletTransaction.wallet_id == wallet.wallet_id).all()
    if not transactions:
        raise HTTPException(status_code=404, detail="No transactions found for this wallet")

    return transactions
