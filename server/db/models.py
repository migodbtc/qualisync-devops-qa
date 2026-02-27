from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import declarative_base
from db.database import engine

Base = declarative_base()
Base.metadata.create_all(engine)


class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), unique=True, nullable=False)


class AuthUser(Base):
    __tablename__ = "auth_users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role_id = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.now)


class Tenant(Base):
    __tablename__ = "tenants"
    user_id = Column(Integer, primary_key=True)
    full_name = Column(String(100), nullable=False)
    phone = Column(String(20))
    status = Column(String(8), default="prospect")  # ENUM('prospect', 'active', 'past')


class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, autoincrement=True)
    room_number = Column(String(10), unique=True, nullable=False)
    floor = Column(Integer)
    type = Column(
        String(10), default="studio"
    )  # ENUM('studio', '1BR', '2BR', '3BR', 'commercial')
    status = Column(
        String(12), default="vacant"
    )  # ENUM('vacant', 'occupied', 'maintenance')
    base_rent = Column(String(10))


class Lease(Base):
    __tablename__ = "leases"
    id = Column(Integer, primary_key=True, autoincrement=True)
    tenant_id = Column(Integer, nullable=False)
    room_id = Column(Integer, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    rent_amount = Column(String(10), nullable=False)
    deposit_amount = Column(String(10), default="0.00")
    is_active = Column(Integer, default=1)  # BOOLEAN


class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, autoincrement=True)
    lease_id = Column(Integer, nullable=False)
    amount_due = Column(String(10), nullable=False)
    amount_paid = Column(String(10), default="0.00")
    due_date = Column(DateTime, nullable=False)
    paid_date = Column(DateTime)
    payment_type = Column(
        String(20)
    )  # ENUM('cash', 'bank_transfer', 'credit_card', 'check')
    status = Column(
        String(10), default="pending"
    )  # ENUM('pending', 'partial', 'paid', 'overdue')


class MaintenanceRequest(Base):
    __tablename__ = "maintenance_requests"
    id = Column(Integer, primary_key=True, autoincrement=True)
    tenant_id = Column(Integer, nullable=False)
    room_id = Column(Integer, nullable=False)
    description = Column(String)
    priority = Column(
        String(10), default="medium"
    )  # ENUM('low', 'medium', 'high', 'emergency')
    status = Column(String(15), default="open")  # ENUM('open', 'in progress', 'closed')
    request_date = Column(DateTime, default=datetime.now)
    resolved_date = Column(DateTime)


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False)
    token = Column(String(255), unique=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    revoked = Column(Integer, default=0)  # BOOLEAN
    created_at = Column(DateTime, default=datetime.now)


class Session(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False)
    session_id = Column(String(100), unique=True, nullable=False)
    user_agent = Column(String(255))
    ip_address = Column(String(45))
    created_at = Column(DateTime, default=datetime.now)
    expires_at = Column(DateTime)
    revoked = Column(Integer, default=0)  # BOOLEAN


class JWTBlacklist(Base):
    __tablename__ = "jwt_blacklist"
    id = Column(Integer, primary_key=True, autoincrement=True)
    token = Column(String(255), unique=True, nullable=False)
    user_id = Column(Integer)
    revoked_at = Column(DateTime, default=datetime.now)
    expires_at = Column(DateTime)
