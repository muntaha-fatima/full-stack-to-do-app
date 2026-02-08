"""
Authentication API endpoints.
"""

from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api.deps import get_current_user
from app.db.session import get_db
from app.core.security import verify_password
from app.models.user import User
from app.schemas.auth import (
    UserRegister,
    UserLogin,
    TokenResponse,
    UserResponse,
    PasswordResetRequest,
    PasswordResetConfirm,
    PasswordChange,
    ProfileUpdate
)
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.core.config import settings

router = APIRouter()


@router.post("/register", status_code=201)
async def register_user(
    user_in: UserRegister,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Register a new user.
    """
    user_repo = UserRepository(db)
    auth_service = AuthService(user_repo)

    try:
        user = await auth_service.register(user_in)
        return {"message": "Registration successful. Please check your email to verify your account."}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )


@router.get("/verify-email")
async def verify_email(
    token: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Verify user's email using the provided token.
    """
    user_repo = UserRepository(db)
    auth_service = AuthService(user_repo)

    success = await auth_service.verify_email(token)

    if success:
        return {"message": "Email verified successfully. You can now log in."}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token",
        )


@router.post("/login", response_model=TokenResponse)
async def login(
    user_login: UserLogin,
    response: Response,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    """
    Login user and return access and refresh tokens.
    """
    user_repo = UserRepository(db)
    auth_service = AuthService(user_repo)

    try:
        token_data, refresh_token_str = await auth_service.login(
            user_login.email_or_username,
            user_login.password
        )

        # Set refresh token in httpOnly cookie
        response.set_cookie(
            key="refresh_token",
            value=refresh_token_str,
            httponly=True,
            secure=settings.ENVIRONMENT == "production",  # Use secure cookies in production
            samesite="strict",
            max_age=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS).total_seconds()
        )

        return TokenResponse(**token_data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_access_token(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    """
    Refresh access token using refresh token from cookie.
    """
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No refresh token provided",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_repo = UserRepository(db)
    auth_service = AuthService(user_repo)

    token_data = await auth_service.refresh_token(refresh_token)

    if not token_data:
        # Clear the invalid refresh token cookie
        response.delete_cookie("refresh_token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Update the cookie with the new refresh token
    new_refresh_token = token_data.get('new_refresh_token')
    if new_refresh_token:
        response.set_cookie(
            key="refresh_token",
            value=new_refresh_token,
            httponly=True,
            secure=settings.ENVIRONMENT == "production",
            samesite="strict",
            max_age=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS).total_seconds()
        )

    # Prepare response data for refresh token endpoint
    # Note: refresh response doesn't include user data like login does
    refresh_response_data = {
        "access_token": token_data.get("access_token"),
        "token_type": token_data.get("token_type", "bearer"),
        "expires_in": token_data.get("expires_in", settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60),
        # Don't include user in refresh response
    }

    return TokenResponse(**refresh_response_data)


@router.post("/logout")
async def logout(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Logout user and invalidate refresh token.
    """
    refresh_token = request.cookies.get("refresh_token")

    if refresh_token:
        user_repo = UserRepository(db)
        auth_service = AuthService(user_repo)

        await auth_service.logout(refresh_token)

    # Clear the refresh token cookie
    response.delete_cookie("refresh_token")

    return {"message": "Logged out successfully"}


@router.post("/password-reset-request")
async def request_password_reset(
    reset_request: PasswordResetRequest,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Request password reset - sends reset email if user exists.
    """
    user_repo = UserRepository(db)
    auth_service = AuthService(user_repo)

    # This always returns success for security (don't reveal if email exists)
    await auth_service.request_password_reset(reset_request.email)

    return {"message": "If an account exists with this email, a password reset link has been sent."}


@router.post("/password-reset-confirm")
async def confirm_password_reset(
    reset_confirm: PasswordResetConfirm,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Confirm password reset with token and new password.
    """
    user_repo = UserRepository(db)
    auth_service = AuthService(user_repo)

    success = await auth_service.confirm_password_reset(
        reset_confirm.token,
        reset_confirm.new_password
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
        )

    return {"message": "Password reset successfully. Please log in with your new password."}


@router.post("/password-change")
async def change_password(
    password_change: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Change user's password.
    """
    user_repo = UserRepository(db)
    auth_service = AuthService(user_repo)

    success = await auth_service.change_password(
        current_user.id,
        password_change.current_password,
        password_change.new_password
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    return {"message": "Password changed successfully"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user),
) -> UserResponse:
    """
    Get current user profile.
    """
    return UserResponse.from_orm(current_user)


@router.patch("/profile", response_model=UserResponse)
async def update_user_profile(
    profile_update: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    """
    Update user profile information.
    """
    user_repo = UserRepository(db)
    auth_service = AuthService(user_repo)

    updated_user = await auth_service.update_profile(
        current_user.id,
        profile_update.username,
        profile_update.email
    )

    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update profile",
        )

    return UserResponse.from_orm(updated_user)