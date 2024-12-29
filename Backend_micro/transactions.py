from fastapi import FastAPI,Depends,HTTPException
from typing import Optional
from pydantic import BaseModel,field_validator
from database import Session,get_db
from models import Transaction
from enum import Enum
from datetime import datetime,timezone
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import os
from dotenv import load_dotenv


load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

app = FastAPI()


class TransactionModel(BaseModel):
    transaction_id: int
    transaction_type: str
    montant: float
    user_id: int
    date: Optional[datetime]
    destination_address: str
    gas_fee: Optional[float]

    class Config:
        orm_mode = True


class TransactionType(str, Enum):
    PAYMENT = "payment"
    TRANSFER = "transfer"
    DEPOSIT = "deposit"


class TransactionCreate(BaseModel):
    transaction_type: TransactionType
    montant: float
    destination_address: str

    @field_validator("montant")
    def validate_montant(cls, value):
        if value <= 0:
            raise ValueError("Amount must be positive")
        return value


class TransactionUpdate(BaseModel):
    montant : Optional[float]
    destination_address : Optional[str]


class TransactionsResponse(BaseModel):
    total: int
    transactions: list[TransactionModel]

    class Config:
        from_attributes = True


@app.get("/")
def root():
    return {"message": "Welcome to the Transactions Microservice"}



@app.get('/transactions', response_model=dict)
def get_all_transactions(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user)
):
    total = db.query(Transaction).filter(Transaction.user_id == current_user).count()
    transactions = db.query(Transaction).filter(Transaction.user_id == current_user).offset(skip).limit(limit).all()

    transactions_list = [
        {
            "transaction_id": transaction.transaction_id,
            "transaction_type": transaction.transaction_type,
            "montant": transaction.montant,
            "user_id": transaction.user_id,
            "date": transaction.date.isoformat() if transaction.date else None,
            "destination_address": transaction.destination_address,
            "gas_fee": transaction.gas_fee,
        }
        for transaction in transactions
    ]

    return {"total": total, "transactions": transactions_list}


@app.post('/transactions', response_model=TransactionModel)
def add_transaction(
    transaction_data: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user)
):
    new_transaction = Transaction(
        **transaction_data.model_dump(),
        user_id=current_user,
        date=datetime.now(timezone.utc)
    )
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction


@app.put('/transactions/{id}', response_model=TransactionModel)
def modify_transaction(
    id: int,
    transaction_mod: TransactionUpdate,
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user)
):
    transaction = db.query(Transaction).filter(Transaction.transaction_id == id, Transaction.user_id == current_user).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    for key, value in transaction_mod.model_dump(exclude_unset=True).items():
        setattr(transaction, key, value)
    db.commit()
    db.refresh(transaction)
    return transaction


@app.delete('/transactions/{id}')
def remove_transaction(
    id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user)
):
    transaction = db.query(Transaction).filter(Transaction.transaction_id == id, Transaction.user_id == current_user).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.delete(transaction)
    db.commit()
    return {"message": "Transaction deleted successfully"}
