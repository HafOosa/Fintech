from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from database import DATABASE_URL
from models import Base
from wallets import router as wallets_router
from transactions import router as transactions_router
from utilisateurs import router as utilisateurs_router
from madt import router as madts_router

#main: port 8000

engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:4200','http://127.0.0.1:4200'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/')
def home():
    return {"message" : "Finetech project"}

app.include_router(wallets_router, tags=["Wallets"])
app.include_router(transactions_router, tags=["Transactions"])
app.include_router(utilisateurs_router, tags=["Utilisateurs"])
app.include_router(utilisateurs_router, tags=["Madt"])