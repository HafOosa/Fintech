from fastapi import Depends, HTTPException, APIRouter
from dotenv import load_dotenv
import os
from pydantic import BaseModel
from services.blockchain_service import BlockchainService
from fastapi.security import OAuth2PasswordBearer

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# BlockchainService initialization
blockchain_service = BlockchainService(
    rpc_url="http://127.0.0.1:7545",
    contract_address="0x71F9dEb6e7f0A61c4818c76DeC5686D4f2a83C1f",
    abi_path="MADTToken_ABI.json",
    private_key="0x8e00b136573b30486fd998366d4078eaa109ae00e9950e2995d833f4d678f0a0",
)

# Define input models
class MintRequest(BaseModel):
    to: str
    amount: float

class TransferRequest(BaseModel):
    to: str
    amount: float

from pydantic import BaseModel

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
def create_wallet():
    try:
        wallet = blockchain_service.create_wallet()
        return {
            "message": "Wallet created successfully.",
            "address": wallet["address"],
            "private_key": wallet["private_key"]
        }
    except Exception as e:
        print(f"Error creating wallet: {e}")
        raise HTTPException(status_code=500, detail="Failed to create wallet.")
@router.post("/transfer_from")
def transfer_tokens_from(request: TransferFromRequest):
    print("Incoming Request Data:", request.dict())
    try:
        tx_hash = blockchain_service.transfer_tokens_from(
            request.from_address,
            request.private_key,
            request.to_address,
            request.amount
        )
        return {"transaction_hash": tx_hash}
    except Exception as e:
        print(f"Error in transfer_tokens_from: {e}")
        raise HTTPException(status_code=400, detail=str(e))