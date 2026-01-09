"""
User model for database.
"""

from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import Boolean, DateTime, Enum, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.security import get_password_hash
from app.db.session import Base


def utc_now() -> datetime:
    """Return current UTC time as timezone-aware datetime."""
    from datetime import timezone
    return datetime.now(timezone.utc)


class UserRole(str, PyEnum):
    """User role enumeration."""

    ADMIN = "admin"
    USER = "user"


class User(Base):
    """
    User model representing application users.
    """

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole), default=UserRole.USER, nullable=False
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    def get_password_hash(self, password: str) -> str:
        """Hash a password using bcrypt."""
        from app.core.security import get_password_hash
        return get_password_hash(password)

    def verify_password(self, plain_password: str) -> bool:
        """Verify a password against the hash."""
        from app.core.security import verify_password
        return verify_password(plain_password, self.hashed_password)

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email='{self.email}', full_name='{self.full_name}')>"