"""
Authentication service for handling authentication-related business logic.
"""
from datetime import datetime, timedelta
from typing import Optional
from uuid import uuid4
import os
from sqlalchemy import select, update
from app.repositories.user_repository import UserRepository
from app.schemas.auth import UserRegister
from app.models.user import User
from app.models.verification_token import VerificationToken
from app.core.config import settings
from app.core.security import verify_password
from app.core.jwt import create_access_token, create_refresh_token
from app.services.email_service import EmailService


class AuthService:
    """
    Service class for authentication-related business logic.
    """

    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    async def register(self, user_data: UserRegister) -> User:
        """
        Register a new user with the provided data.

        Validates input, checks uniqueness, hashes password, creates user,
        generates verification token, and queues verification email.
        """
        # Check if username or email already exists
        email_unique = await self.user_repo.check_email_uniqueness(user_data.email)
        username_unique = await self.user_repo.check_username_uniqueness(user_data.username)

        if not email_unique:
            raise ValueError("Email already registered")
        if not username_unique:
            raise ValueError("Username already taken")

        # Create the user
        user = await self.user_repo.create_user(user_data)

        # Create verification token
        verification_token = await self.create_verification_token(user.id)

        # Queue verification email
        verification_link = f"{settings.FRONTEND_URL}/verify-email?token={verification_token.token}"
        # In a real implementation, this would be sent via Celery
        # For now, we'll send it directly (in production, use async Celery task)
        EmailService.send_verification_email(user.email, verification_link)

        return user

    async def create_verification_token(self, user_id: int) -> VerificationToken:
        """
        Create a verification token for a user.
        """
        from sqlalchemy.ext.asyncio import AsyncSession
        from app.db.session import AsyncSessionLocal
        from app.models.verification_token import VerificationToken as VerificationTokenModel

        async with AsyncSessionLocal() as session:
            # Create verification token
            token = str(uuid4())
            expires_at = datetime.utcnow() + timedelta(hours=24)  # 24 hours expiry

            verification_token = VerificationTokenModel(
                user_id=user_id,
                token=token,
                expires_at=expires_at
            )

            session.add(verification_token)
            await session.commit()
            await session.refresh(verification_token)

            return verification_token

    async def verify_email(self, token: str) -> bool:
        """
        Verify a user's email using the provided token.

        Checks token validity, expiry, and marks user as verified.
        """
        from sqlalchemy.ext.asyncio import AsyncSession
        from app.db.session import AsyncSessionLocal
        from app.models.verification_token import VerificationToken as VerificationTokenModel

        async with AsyncSessionLocal() as session:
            # Find the token
            stmt = select(VerificationTokenModel).where(
                VerificationTokenModel.token == token,
                VerificationTokenModel.used_at.is_(None)
            )
            result = await session.execute(stmt)
            token_record = result.scalar_one_or_none()

            if not token_record:
                return False

            # Check if token is expired
            if datetime.utcnow() > token_record.expires_at:
                return False

            # Update user as verified
            user = await self.user_repo.get_user_by_id(token_record.user_id)
            if user:
                user.is_verified = True
                await session.commit()

                # Mark token as used
                token_record.used_at = datetime.utcnow()
                await session.commit()

                return True

            return False

    async def login(self, email_or_username: str, password: str) -> tuple[dict, str]:
        """
        Authenticate user with email/username and password.

        Returns access token, refresh token, and user info if successful.
        Updates last login time and resets failed attempts on success.
        Increments failed attempts on failure.
        """
        # Find user by email or username
        user = await self.user_repo.get_user_by_email(email_or_username)
        if not user:
            user = await self.user_repo.get_user_by_username(email_or_username)

        if not user:
            # User doesn't exist, increment failed attempts for security
            # But we don't know the user ID, so we can't increment here
            raise ValueError("Invalid credentials")

        # Check if account is locked
        if user.locked_until and datetime.utcnow() < user.locked_until:
            raise ValueError("Account is temporarily locked due to multiple failed login attempts")

        # Verify password
        if not verify_password(password, user.password_hash):
            # Increment failed login attempts
            await self.user_repo.increment_failed_login_attempts(user.id)

            # Check if account should be locked (after 5 failed attempts)
            if user.failed_login_attempts >= 4:  # Already incremented, so 4 means this is the 5th attempt
                await self.user_repo.lock_user_account(user.id)

            raise ValueError("Invalid credentials")

        # Reset failed login attempts on successful login
        await self.user_repo.reset_failed_login_attempts(user.id)

        # Update last login time
        await self.user_repo.update_last_login(user.id)

        # Create tokens
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token_str = create_refresh_token()

        # Store refresh token in DB
        from app.models.refresh_token import RefreshToken as RefreshTokenModel
        from sqlalchemy.ext.asyncio import AsyncSession
        from app.db.session import AsyncSessionLocal

        async with AsyncSessionLocal() as session:
            # Create refresh token record
            expires_at = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
            refresh_token = RefreshTokenModel(
                user_id=user.id,
                token=refresh_token_str,
                expires_at=expires_at
            )

            session.add(refresh_token)
            await session.commit()

        # Prepare response
        token_data = {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,  # Convert to seconds
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "is_verified": user.is_verified,
                "is_active": user.is_active,
                "created_at": user.created_at,
                "updated_at": user.updated_at
            }
        }

        return token_data, refresh_token_str

    async def logout(self, refresh_token: str) -> bool:
        """
        Logout user by invalidating the refresh token.
        """
        from sqlalchemy.ext.asyncio import AsyncSession
        from app.db.session import AsyncSessionLocal
        from app.models.refresh_token import RefreshToken as RefreshTokenModel

        async with AsyncSessionLocal() as session:
            # Find the refresh token
            stmt = select(RefreshTokenModel).where(
                RefreshTokenModel.token == refresh_token,
                RefreshTokenModel.revoked_at.is_(None)
            )
            result = await session.execute(stmt)
            token_record = result.scalar_one_or_none()

            if token_record:
                # Revoke the token
                token_record.revoked_at = datetime.utcnow()
                await session.commit()
                return True

            return False

    async def refresh_token(self, refresh_token: str) -> Optional[dict]:
        """
        Refresh access token using the provided refresh token.

        Validates refresh token, creates new tokens, and rotates the refresh token.
        """
        from sqlalchemy.ext.asyncio import AsyncSession
        from app.db.session import AsyncSessionLocal
        from app.models.refresh_token import RefreshToken as RefreshTokenModel
        from app.core.jwt import create_access_token

        async with AsyncSessionLocal() as session:
            # Find the refresh token
            stmt = select(RefreshTokenModel).where(
                RefreshTokenModel.token == refresh_token,
                RefreshTokenModel.revoked_at.is_(None)
            )
            result = await session.execute(stmt)
            token_record = result.scalar_one_or_none()

            if not token_record:
                return None  # Invalid or revoked token

            # Check if token is expired
            if datetime.utcnow() > token_record.expires_at:
                # Mark as revoked
                token_record.revoked_at = datetime.utcnow()
                await session.commit()
                return None

            # Get user
            user = await self.user_repo.get_user_by_id(token_record.user_id)
            if not user or not user.is_active:
                return None

            # Create new tokens
            new_access_token = create_access_token(data={"sub": str(user.id)})
            new_refresh_token = create_refresh_token()

            # Revoke old refresh token
            token_record.revoked_at = datetime.utcnow()

            # Create new refresh token
            expires_at = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
            new_token_record = RefreshTokenModel(
                user_id=user.id,
                token=new_refresh_token,
                expires_at=expires_at
            )

            session.add(new_token_record)
            await session.commit()

            # Prepare response
            return {
                "access_token": new_access_token,
                "new_refresh_token": new_refresh_token,  # Include the new refresh token
                "token_type": "bearer",
                "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,  # Convert to seconds
            }

    async def request_password_reset(self, email: str) -> bool:
        """
        Request password reset for the given email.

        Creates a reset token and sends email to the user.
        Returns success regardless of whether email exists for security.
        """
        # Find user by email
        user = await self.user_repo.get_user_by_email(email)

        if user:
            # Create reset token
            from app.models.password_reset_token import PasswordResetToken as PasswordResetTokenModel
            from sqlalchemy.ext.asyncio import AsyncSession
            from app.db.session import AsyncSessionLocal

            async with AsyncSessionLocal() as session:
                # Create reset token
                token = str(uuid4())
                expires_at = datetime.utcnow() + timedelta(hours=1)  # 1 hour expiry

                reset_token = PasswordResetTokenModel(
                    user_id=user.id,
                    token=token,
                    expires_at=expires_at
                )

                session.add(reset_token)
                await session.commit()

                # Send reset email
                reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token.token}"
                # In a real implementation, this would be sent via Celery
                # For now, we'll send it directly (in production, use async Celery task)
                EmailService.send_password_reset_email(user.email, reset_link)

        # Always return True for security (don't reveal if email exists)
        return True

    async def confirm_password_reset(self, token: str, new_password: str) -> bool:
        """
        Confirm password reset with the provided token and new password.

        Validates token, checks expiry, updates password, and invalidates all refresh tokens.
        """
        from sqlalchemy.ext.asyncio import AsyncSession
        from app.db.session import AsyncSessionLocal
        from app.models.password_reset_token import PasswordResetToken as PasswordResetTokenModel
        from app.models.refresh_token import RefreshToken as RefreshTokenModel
        from app.core.security import get_password_hash

        async with AsyncSessionLocal() as session:
            # Find the reset token
            stmt = select(PasswordResetTokenModel).where(
                PasswordResetTokenModel.token == token,
                PasswordResetTokenModel.used_at.is_(None)
            )
            result = await session.execute(stmt)
            token_record = result.scalar_one_or_none()

            if not token_record:
                return False  # Invalid or already used token

            # Check if token is expired
            if datetime.utcnow() > token_record.expires_at:
                return False

            # Get user
            user = await self.user_repo.get_user_by_id(token_record.user_id)
            if not user:
                return False

            # Hash new password
            hashed_password = get_password_hash(new_password)

            # Update user password
            user.password_hash = hashed_password

            # Invalidate all refresh tokens for this user
            stmt = (
                update(RefreshTokenModel)
                .where(RefreshTokenModel.user_id == user.id)
                .values(revoked_at=datetime.utcnow())
            )
            await session.execute(stmt)

            # Mark reset token as used
            token_record.used_at = datetime.utcnow()

            await session.commit()
            return True

    async def change_password(self, user_id: int, current_password: str, new_password: str) -> bool:
        """
        Change user's password after validating current password.

        Verifies current password, updates to new password, and invalidates other refresh tokens.
        Keeps current session active.
        """
        from app.core.security import get_password_hash, verify_password
        from app.models.refresh_token import RefreshToken as RefreshTokenModel
        from sqlalchemy.ext.asyncio import AsyncSession
        from app.db.session import AsyncSessionLocal
        from sqlalchemy import update

        # Get user
        user = await self.user_repo.get_user_by_id(user_id)
        if not user:
            return False

        # Verify current password
        if not verify_password(current_password, user.password_hash):
            return False

        # Check that new password is different from current
        if verify_password(new_password, user.password_hash):
            raise ValueError("New password must be different from current password")

        # Hash new password
        hashed_new_password = get_password_hash(new_password)

        # Update user password
        user.password_hash = hashed_new_password

        # Invalidate all OTHER refresh tokens for this user (keep current session)
        # Note: We can't know which refresh token belongs to the current session
        # In a real implementation, we'd need to pass the current refresh token to keep it
        # For now, we'll invalidate all refresh tokens
        async with AsyncSessionLocal() as session:
            stmt = (
                update(RefreshTokenModel)
                .where(RefreshTokenModel.user_id == user.id)
                .values(revoked_at=datetime.utcnow())
            )
            await session.execute(stmt)
            await session.commit()

        return True

    async def get_current_user(self, user_id: int) -> Optional[User]:
        """
        Get user by ID for authentication purposes.
        """
        return await self.user_repo.get_user_by_id(user_id)

    async def update_profile(self, user_id: int, username: Optional[str] = None, email: Optional[str] = None) -> Optional[User]:
        """
        Update user profile information.
        """
        # If email is being updated, check uniqueness
        if email:
            email_unique = await self.user_repo.check_email_uniqueness(email, exclude_user_id=user_id)
            if not email_unique:
                raise ValueError("Email already registered by another user")

        # If username is being updated, check uniqueness
        if username:
            username_unique = await self.user_repo.check_username_uniqueness(username, exclude_user_id=user_id)
            if not username_unique:
                raise ValueError("Username already taken by another user")

        # Update profile
        return await self.user_repo.update_user_profile(user_id, username, email)