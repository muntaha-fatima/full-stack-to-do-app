"""
Authentication schemas.
"""

from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional


class LoginRequest(BaseModel):
    """
    Schema for login request.
    """
    email: EmailStr
    password: str

    @field_validator('email')
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.lower().strip()


class TokenResponse(BaseModel):
    """
    Schema for token response.
    """
    access_token: str
    refresh_token: str
    token_type: str
    expires_in: int  # in seconds


class UserCreate(BaseModel):
    """
    Schema for user creation.
    """
    email: EmailStr
    full_name: str
    password: str

    @field_validator('email')
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.lower().strip()

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v


class UserUpdate(BaseModel):
    """
    Schema for user updates.
    """
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None

    @field_validator('email')
    @classmethod
    def normalize_email(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            return v.lower().strip()
        return v


class UserResponse(BaseModel):
    """
    Schema for user response (without sensitive data).
    """
    id: int
    email: EmailStr
    full_name: str
    is_active: bool
    created_at: str

    class Config:
        from_attributes = True