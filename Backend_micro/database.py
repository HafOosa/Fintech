from sqlalchemy.orm import sessionmaker
from config import DATABASE
from sqlalchemy import create_engine


DATABASE_URL = (
    f"{DATABASE['drivername']}://{DATABASE['user']}:{DATABASE['password']}"
    f"@{DATABASE['host']}:{DATABASE['port']}/{DATABASE['database']}"
)

engine = create_engine(DATABASE_URL)
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()