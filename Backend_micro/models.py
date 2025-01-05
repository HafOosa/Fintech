from sqlalchemy import ForeignKey, Column, String, Integer,DateTime,Enum,Float
from sqlalchemy.orm import declarative_base
from datetime import datetime,timezone

Base = declarative_base()


class Utilisateur(Base):
    __tablename__ = "utilisateur"

    user_id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True, index=True)
    password = Column(String)
    role = Column(Enum('admin', 'user', name="user_roles"), nullable=False)
    address = Column(String, nullable=True)  # Adresse du wallet, nullable
    private_key = Column(String, nullable=True)



class Wallets(Base):
    __tablename__ = "wallets"

    wallet_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, unique=True)
    address = Column(String, nullable=False, unique=True)
    balance = Column(Float, default=0.0)


class WalletTransaction(Base):
    __tablename__ = "wallet_transactions"

    transaction_id = Column(Integer, primary_key=True, index=True)
    wallet_id = Column(Integer, ForeignKey("wallets.wallet_id", ondelete="CASCADE"))
    transaction_type = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String(255), nullable=True)
    timestamp = Column(DateTime, default=datetime.now(timezone.utc))


class Blockchain(Base):
    __tablename__ = "blockchain"

    blockchain_id = Column(Integer, primary_key=True)
    blockchain_name = Column(String, nullable=False)
    blockchain_type = Column(String, nullable=False)
    network_id = Column(String, nullable=True)
    explorer_url = Column(String, nullable=True)


class Transaction(Base):
    __tablename__ = "transaction"

    transaction_id = Column(Integer, primary_key=True)
    transaction_type = Column(String, nullable=False)
    montant = Column(Float, nullable=False)
    user_id = Column(Integer, ForeignKey("utilisateur.user_id", ondelete="CASCADE"), nullable=False)  # Correction du nom de la table Utilisateur
    wallet_id = Column(Integer, ForeignKey("wallets.wallet_id", ondelete="CASCADE"), nullable=True)  # Correction du nom de la table Wallets
    blockchain_id = Column(Integer, ForeignKey("blockchain.blockchain_id", ondelete="CASCADE"), nullable=True)  # Correction du nom de la table Blockchain
    date = Column(DateTime)
    destination_address = Column(String, nullable=False)
    gas_fee = Column(Float)
    recipient = Column(String, nullable=True)



class SmartContract(Base):
    __tablename__ = "smart_contract"

    contract_id = Column(Integer, primary_key=True)
    adresse_contract = Column(String, nullable=False)
    type_contract = Column(Enum('payment', 'stacking', 'asset_management', name="type_contract"), nullable=False)
    blockchain_id = Column(Integer, ForeignKey("blockchain.blockchain_id"), nullable=False)  # Correction du nom de la table Blockchain
    montant_verouille = Column(Float)
    deployed_at = Column(DateTime)


class APIGateway(Base):
    __tablename__ = "api_gateway"

    gateway_id = Column(Integer, primary_key=True)
    URL = Column(String, nullable=False)
    authentication_method = Column(String)


class Microservices(Base):
    __tablename__ = "microservices"

    service_id = Column(Integer, primary_key=True)
    nom_service = Column(String, nullable=False)
    url_service = Column(String, nullable=False)
    version = Column(String, nullable=False)
    getaway_id = Column(Integer, ForeignKey("api_gateway.gateway_id", ondelete="CASCADE"))  # Correction du nom de la table APIGateway
    status = Column(Enum('active', 'inactive', name="micro_status"), nullable=False)


class Monitoring(Base):
    __tablename__ = "monitoring"

    monitoring_id = Column(Integer, primary_key=True)
    service_id = Column(Integer, ForeignKey("microservices.service_id", ondelete="CASCADE"))  # Correction du nom de la table Microservices
    service_monitore = Column(String, nullable=False)
    outil = Column(Enum('Prometheus', 'Grafana', 'AWS CloudWatch', name="monitoring_outil"))
    data_performance = Column(String)
    data_logs = Column(String)


class Dashboard(Base):
    __tablename__ = "dashboard"  # Nom en minuscule

    dashboard_id = Column(Integer, primary_key=True)
    titre = Column(String)
    type_donnee = Column(String)
    donnee_financiere = Column(String)
    user_id = Column(Integer, ForeignKey("utilisateur.user_id", ondelete="CASCADE"))
    date_maj = Column(DateTime)


class Beneficiary(Base):
    __tablename__ = "beneficiaries"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("utilisateur.user_id"), nullable=False)
    name = Column(String, nullable=False)
    wallet_address = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))





