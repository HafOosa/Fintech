from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)



#Userlogin:
#User1: "email": "david.moreau@example.com","password": "password123"
#User4(admin): "email": "admin1@gmail.com","password": "NewStrongPassword123!"
#User3: "email": "louis.bernard@example.com", "password": ""


