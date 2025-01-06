from fastapi import Depends, HTTPException, APIRouter
from dotenv import load_dotenv
import os
from pydantic import BaseModel
from database import get_db, Session
from services.blockchain_service import BlockchainService
from fastapi.security import OAuth2PasswordBearer
from models import Utilisateur
from jose import jwt, JWTError
from cryptowallets import create_crypto_wallet,read_crypto_wallet

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Utilisateur actuel
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



# BlockchainService initialization
blockchain_service = BlockchainService(
    rpc_url="http://127.0.0.1:7545",
    contract_address="0xD637Ce17d2798Cd48673aF8F60d9504b9c43b555",
    abi_path="MADTToken_ABI.json",
    private_key="0x8964678316492d0bee9812e26ffc3bb6e86eaed6b2e5fdf7090d5d1b0533b80a",
)

# Define input models
class MintRequest(BaseModel):
    to: str
    amount: float

class TransferRequest(BaseModel):
    to: str
    amount: float

class TransferFromRequest(BaseModel):
    from_address: str
    private_key: str
    to_address: str
    amount: float

# Initialisation du router
router = APIRouter()
# Endpoints

@router.get("/balance/{address}")
def get_balance(address: str):
    try:
        balance = blockchain_service.get_balance(address)
        return {"address": address, "balance": balance}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/madt")
def read_cryptowallet(db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    wallet = read_crypto_wallet(db=db, user_id=user_id)
    if wallet is None:
        raise HTTPException(status_code=404, detail="Wallet not found")
    return wallet


@router.post("/mint")
def mint_tokens(request: MintRequest):
    print("Incoming Request Data:", request.dict())
    try:
        tx_hash = blockchain_service.mint_tokens(request.to, request.amount)
        return {"transaction_hash": tx_hash}
    except Exception as e:
        print(f"Error processing mint request: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/transfer")
def transfer_tokens(request: TransferRequest):
    print("Incoming Request Data:", request.dict())
    try:
        tx_hash = blockchain_service.transfer_tokens(request.to, request.amount)
        return {"transaction_hash": tx_hash}
    except Exception as e:
        print(f"Error in transfer_tokens: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/create_wallet")
def create_wallet(db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    try:
        wallet = blockchain_service.create_wallet()  # Assuming this generates wallet details
        create_crypto_wallet(wallet_id=wallet["address"], private_key=wallet["private_key"], db=db, user_id=user_id)
        return {
            "message": "Wallet created successfully.",
            "address": wallet["address"],
            "private_key": wallet["private_key"],
        }
    except Exception as e:
        print(f"Error creating wallet: {e}")
        raise HTTPException(status_code=500, detail="Failed to create wallet.")



@router.post("/transfer_from")
def transfer_tokens_from(request: TransferFromRequest,db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    print("Incoming Request Data:", request.dict())
    address=read_crypto_wallet(db=db, user_id=user_id)
    try:
        tx_hash = blockchain_service.transfer_tokens_from(
            address.address_id,
            address.private_key,
            request.to_address,
            request.amount
        )
        return {"transaction_hash": tx_hash}
    except Exception as e:
        print(f"Error in transfer_tokens_from: {e}")
        raise HTTPException(status_code=400, detail=str(e))