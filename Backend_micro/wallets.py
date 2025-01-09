from fastapi import Depends, HTTPException, APIRouter
from dotenv import load_dotenv
from database import get_db, Session
from pydantic import BaseModel
from models import Wallets, WalletTransaction, Beneficiary
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
    category: str | None = None  # Ajout de la catégorie


class HistoriqueWalletInfo(BaseModel):
    transaction_id: int
    wallet_id: int
    transaction_type: str
    amount: float
    category: str | None = None
    timestamp: datetime

    class Config:
        orm_mode = True


class TransferRequest(BaseModel):
    recipientWalletAddress: str
    amount: float


class BeneficiaryCreate(BaseModel):
    name: str
    wallet_address: str

class BeneficiaryResponse(BaseModel):
    id: int
    name: str
    wallet_address: str
    created_at: datetime

    class Config:
        orm_mode = True

def generate_wallet_address():
    return f"wallet_{secrets.token_hex(16)}"


class UpdateBalanceRequest(BaseModel):
    balance: float

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
        category=update.category,
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
        category=update.category,
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

    transactions = db.query(WalletTransaction) \
        .filter(WalletTransaction.wallet_id == wallet.wallet_id) \
        .order_by(WalletTransaction.timestamp.desc()) \
        .all()
    if not transactions:
        raise HTTPException(status_code=404, detail="No transactions found for this wallet")
    return transactions



@router.post('/wallets/transfer', response_model=WalletResponse)
def transfer_funds(
    transfer: TransferRequest,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    # Récupérer le wallet de l'utilisateur connecté
    sender_wallet = db.query(Wallets).filter(Wallets.user_id == user_id).first()
    if not sender_wallet:
        raise HTTPException(status_code=404, detail="Sender wallet not found")

    # Récupérer le wallet du destinataire
    recipient_wallet = db.query(Wallets).filter(Wallets.address == transfer.recipientWalletAddress).first()
    if not recipient_wallet:
        raise HTTPException(status_code=404, detail="Recipient wallet not found")

    # Vérifier que le montant est valide
    if transfer.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    if sender_wallet.balance < transfer.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    # Effectuer le transfert
    sender_wallet.balance -= transfer.amount
    recipient_wallet.balance += transfer.amount

    transaction = WalletTransaction(
        wallet_id=sender_wallet.wallet_id,
        transaction_type="transfer_out",
        amount=-transfer.amount,
        timestamp=datetime.now(timezone.utc),
        category="Virement",
    )

    db.add(transaction)
    db.commit()
    db.refresh(sender_wallet)

    return sender_wallet


@router.post("/wallets/beneficiaires", response_model=BeneficiaryResponse)
def add_beneficiary(
    beneficiary: BeneficiaryCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    # Vérifier si un bénéficiaire avec la même adresse existe déjà
    existing_beneficiary = db.query(Beneficiary).filter(
        Beneficiary.wallet_address == beneficiary.wallet_address,
        Beneficiary.user_id == user_id
    ).first()
    if existing_beneficiary:
        raise HTTPException(status_code=400, detail="Beneficiary already exists.")

    # Ajouter un nouveau bénéficiaire
    new_beneficiary = Beneficiary(
        user_id=user_id,
        name=beneficiary.name,
        wallet_address=beneficiary.wallet_address,
        created_at=datetime.now(timezone.utc),
    )
    db.add(new_beneficiary)
    db.commit()
    db.refresh(new_beneficiary)
    return new_beneficiary


@router.get("/wallets/beneficiaires", response_model=list[BeneficiaryResponse])
def get_beneficiaries(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    # Récupérer les bénéficiaires associés à l'utilisateur connecté
    beneficiaries = db.query(Beneficiary).filter(Beneficiary.user_id == user_id).all()
    return beneficiaries



@router.delete('/wallets/beneficiaires/{beneficiary_id}')
def delete_beneficiary(
        beneficiary_id: int,
        db: Session = Depends(get_db),
        user_id: int = Depends(get_current_user)
):
    # Vérifier si le bénéficiaire appartient à l'utilisateur connecté
    beneficiary = db.query(Beneficiary).filter_by(id=beneficiary_id, user_id=user_id).first()
    if not beneficiary:
        raise HTTPException(status_code=404, detail="Beneficiary not found")

    # Supprimer le bénéficiaire
    db.delete(beneficiary)
    db.commit()
    return {"message": "Beneficiary deleted successfully"}


@router.put("/wallets/update-balance")
def update_wallet_balance(request: UpdateBalanceRequest, db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    wallet = db.query(Wallets).filter(Wallets.user_id == user_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")

    wallet.balance = request.balance
    db.commit()
    db.refresh(wallet)
    return {"message": "Wallet balance updated successfully"}