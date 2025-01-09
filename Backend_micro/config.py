import os

DATABASE = {
    "drivername": "postgresql",
    "host": os.getenv("DB_HOST", "localhost"),
    "port": os.getenv("DB_PORT", "5432"),
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", "0000"),
    "database": os.getenv("DB_NAME", "finetech_project8")
}

DEBUG = os.getenv("DEBUG", True)
SECRET_KEY = os.getenv("SECRET_KEY", "change_me")