from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from database import DATABASE_URL
from models import Base


#wallets:port7000
#users:port3000
#trasncations:port9000
#main:normal port

engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/')
def home():
    return {"message" : "Finetech project"}


