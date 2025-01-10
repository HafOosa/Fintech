from fastapi import APIRouter,Depends,HTTPException
from pydantic import BaseModel,EmailStr
from typing import Optional
from database import Session,get_db
from models import Utilisateur
from security import hash_password,verify_password
from jose import jwt,JWTError
from datetime import datetime, timedelta,timezone
from dotenv import load_dotenv
import os
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.sql import func, case
from models import Transaction 


load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")


class CreateUser(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str

    @property
    def name(self):
        # Combiner `first_name` et `last_name` pour former `name`
        return f"{self.first_name} {self.last_name}".strip()

class UpdateUser(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

    class Config:
        schema_extra = {
            "example": {
                "name": "Updated Name",
                "email": "updated.email@example.com",
                "password": "NewPassword123"
            }
        }

class UserResponse(BaseModel):
    user_id: int
    name: str
    email: str
    role: str

    class Config:
        orm_mode = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    user: UserResponse
    access_token: str
    token_type: str


class PasswordUpdateRequest(BaseModel):
    new_password: str



def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)): # type: ignore
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email: str = payload.get("sub")
        if user_email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = db.query(Utilisateur).filter(Utilisateur.email == user_email).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")


router = APIRouter()


@router.get('/users', response_model=list[UserResponse])
def get_users(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db), # type: ignore
    current_user: Utilisateur = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access forbidden")
    users = db.query(Utilisateur).offset(skip).limit(limit).all()
    if not users:
        raise HTTPException(status_code=404, detail="No users found")
    return users



@router.get('/users/{user_id}', response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db), current_user: Utilisateur = Depends(get_current_user)): # type: ignore
    if current_user.role != "admin" and current_user.user_id != user_id:
        raise HTTPException(status_code=403, detail="Access forbidden")
    user = db.query(Utilisateur).filter(Utilisateur.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get('/admin-overview/statistics')
async def get_admin_statistics(db: Session = Depends(get_db), current_user: Utilisateur = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access forbidden")
    
    try:
        # Vérification que la table existe
        if not db.query(Utilisateur).first():
            raise HTTPException(status_code=404, detail="No data available")

        # Récupération des utilisateurs
        total_users = db.query(Utilisateur).filter(Utilisateur.role == "user").count() or 0


        current_date = datetime.now()
        thirty_days_ago = current_date - timedelta(days=30)

        # Récupération des utilisateurs actifs
        active_users = (
            db.query(Utilisateur)
            .join(Transaction, Utilisateur.user_id == Transaction.user_id)
            .filter(Transaction.date >= thirty_days_ago)
            .distinct(Utilisateur.user_id)
            .count()
        )
        
        
        # Récupération des transactions totales
        total_transactions = float(
            db.query(func.coalesce(func.sum(Transaction.montant), 0)).scalar() or 0
        )
        
        
        # Répartition des utilisateurs par rôle
        user_roles = {
            "admins": db.query(Utilisateur).filter(Utilisateur.role == "admin").count(),
            "users": db.query(Utilisateur).filter(Utilisateur.role == "user").count(),
        }

        
        # Volume des transactions mensuelles
        monthly_transactions = db.query(
            func.date_trunc("month", Transaction.date).label("month"),
            func.coalesce(func.sum(Transaction.montant), 0).label("total")
        ).group_by(
            func.date_trunc("month", Transaction.date)
        ).order_by(
            func.date_trunc("month", Transaction.date)
        ).all()

        monthly_transactions_data = {
            "labels": [row[0].strftime("%B %Y") for row in monthly_transactions],
            "data": [float(row[1]) for row in monthly_transactions],
        }


        # Récupération des tendances (par mois, pour les 6 derniers mois)
        current_date = datetime.now()
        six_months_ago = current_date - timedelta(days=180)

        transaction_trends = db.query(
            func.date_trunc("month", Transaction.date).label("month"),
            func.coalesce(
                func.sum(
                    case(
                        (Transaction.transaction_type == "crypto", Transaction.montant),
                        else_=0
                    )
                ),
                0
            ).label("crypto"),
            func.coalesce(
                func.sum(
                    case(
                        (Transaction.transaction_type == "payment", Transaction.montant),
                        else_=0
                    )
                ),
                0
            ).label("traditional"),
        ).filter(
            Transaction.date >= six_months_ago
        ).group_by(
            func.date_trunc("month", Transaction.date)
        ).order_by(
            func.date_trunc("month", Transaction.date)
        ).all()

        # Gestion du cas où il n'y a pas de données pour les tendances
        if not transaction_trends:
            trends = {
                "labels": [],
                "crypto": [],
                "traditional": []
            }
        else:
            trends = {
                "labels": [row[0].strftime("%B %Y") if row[0] else "" for row in transaction_trends],
                "crypto": [float(row[1] or 0) for row in transaction_trends],
                "traditional": [float(row[2] or 0) for row in transaction_trends],
            }

        return {
            "status": "success",
            "user_stats": {"total_users": total_users,"active_users": active_users},
            "transaction_stats": {
                "total_transactions": total_transactions,
            },
            "trends": trends,
            "user_roles": user_roles,
            "monthly_transactions": monthly_transactions_data,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Une erreur s'est produite lors de la récupération des statistiques: {str(e)}"
        )



@router.post('/users', response_model=UserResponse)
def add_user(user: CreateUser, db: Session = Depends(get_db), current_user: Utilisateur = Depends(get_current_user)): # type: ignore
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access forbidden")
    existing_user = db.query(Utilisateur).filter(Utilisateur.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = hash_password(user.password)
    new_user = Utilisateur(
        name=user.name,
        email=user.email,
        password=hashed_password,
        role="user"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user



@router.delete('/users/{user_id}')
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: Utilisateur = Depends(get_current_user)): # type: ignore
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access forbidden")
    user = db.query(Utilisateur).filter(Utilisateur.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"detail": "User deleted successfully"}


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=1)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@router.post('/users/login', response_model=LoginResponse)
def login_user(credentials: LoginRequest, db: Session = Depends(get_db)): # type: ignore
    user = db.query(Utilisateur).filter(Utilisateur.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({"sub": user.email, "user_id": user.user_id, "role": user.role})
    return {
        "user": {
            "user_id": user.user_id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        },
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.put('/users/{user_id}', response_model=UserResponse)
def update_user(
    user_id: int,
    user_data: UpdateUser,
    db: Session = Depends(get_db), # type: ignore
    current_user: Utilisateur = Depends(get_current_user)
):
    if current_user.role != "admin" and current_user.user_id != user_id:
        raise HTTPException(status_code=403, detail="Access forbidden")

    user = db.query(Utilisateur).filter(Utilisateur.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user_data.name:
        user.name = user_data.name
    if user_data.email:
        existing_user = db.query(Utilisateur).filter(Utilisateur.email == user_data.email).first()
        if existing_user and existing_user.user_id != user_id:
            raise HTTPException(status_code=400, detail="Email already in use")
        user.email = user_data.email
    if user_data.password:
        user.password = hash_password(user_data.password)

    db.commit()
    db.refresh(user)
    return user



@router.post('/users/register', response_model=UserResponse)
def register_user(user: CreateUser, db: Session = Depends(get_db)): # type: ignore
    # Vérifier si l'email est déjà utilisé
    existing_user = db.query(Utilisateur).filter(Utilisateur.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hasher le mot de passe avant de le stocker
    hashed_password = hash_password(user.password)

    # Fusionner le prénom et le nom pour le champ `name` dans la BDD
    full_name = user.name

    # Créer un nouvel utilisateur
    new_user = Utilisateur(
        name=full_name,
        email=user.email,
        password=hashed_password,
        role="user"  # Par défaut, le rôle est "user".
    )

    # Ajouter l'utilisateur à la BDD
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user



@router.put('/users/{user_id}/password')
def change_password(
    user_id: int,
    request: PasswordUpdateRequest,  # Utilisation du schéma pour valider l'entrée
    db: Session = Depends(get_db), # type: ignore
    current_user: Utilisateur = Depends(get_current_user),
):
    # Extraire la nouvelle valeur de mot de passe
    new_password = request.new_password

    if current_user.user_id != user_id:
        raise HTTPException(status_code=403, detail="You can only update your own password")

    user = db.query(Utilisateur).filter(Utilisateur.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Hasher la chaîne de mot de passe et la stocker
    user.password = hash_password(new_password)
    db.commit()

    return {"detail": "Password updated successfully"}