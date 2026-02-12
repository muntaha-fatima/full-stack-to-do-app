"""
User repository for database operations related to users.
"""
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from app.models.user import User
from app.schemas.auth import UserRegister


class UserRepository:
    """
    Repository class for user-related database operations.
    """
    
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session
    
    async def create_user(self, user_data: UserRegister) -> User:
        """
        Create a new user in the database.
        """
        from app.core.security import get_password_hash
        
        # Hash the password
        hashed_password = get_password_hash(user_data.password)
        
        # Create user instance
        user = User(
            username=user_data.username,
            email=user_data.email,
            password_hash=hashed_password,
            role="user",  # Default role
            is_verified=False,  # User needs to verify email
            is_active=True,
            failed_login_attempts=0
        )
        
        # Add to session and commit
        self.db_session.add(user)
        try:
            await self.db_session.commit()
            await self.db_session.refresh(user)
            return user
        except IntegrityError:
            await self.db_session.rollback()
            raise ValueError("Username or email already exists")
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """
        Retrieve a user by email.
        """
        stmt = select(User).where(User.email == email)
        result = await self.db_session.execute(stmt)
        return result.scalar_one_or_none()
    
    async def get_user_by_username(self, username: str) -> Optional[User]:
        """
        Retrieve a user by username.
        """
        stmt = select(User).where(User.username == username)
        result = await self.db_session.execute(stmt)
        return result.scalar_one_or_none()
    
    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        """
        Retrieve a user by ID.
        """
        stmt = select(User).where(User.id == user_id)
        result = await self.db_session.execute(stmt)
        return result.scalar_one_or_none()
    
    async def check_email_uniqueness(self, email: str, exclude_user_id: Optional[int] = None) -> bool:
        """
        Check if an email is unique (not taken by another user).
        """
        stmt = select(User).where(User.email == email)
        if exclude_user_id:
            stmt = stmt.where(User.id != exclude_user_id)
        
        result = await self.db_session.execute(stmt)
        return result.scalar_one_or_none() is None
    
    async def check_username_uniqueness(self, username: str, exclude_user_id: Optional[int] = None) -> bool:
        """
        Check if a username is unique (not taken by another user).
        """
        stmt = select(User).where(User.username == username)
        if exclude_user_id:
            stmt = stmt.where(User.id != exclude_user_id)
        
        result = await self.db_session.execute(stmt)
        return result.scalar_one_or_none() is None
    
    async def update_last_login(self, user_id: int):
        """
        Update the last login timestamp for a user.
        """
        from datetime import datetime, timezone

        user = await self.get_user_by_id(user_id)
        if user:
            user.last_login_at = datetime.now(timezone.utc)
            await self.db_session.commit()
    
    async def increment_failed_login_attempts(self, user_id: int):
        """
        Increment the failed login attempts counter for a user.
        """
        user = await self.get_user_by_id(user_id)
        if user:
            user.failed_login_attempts += 1
            await self.db_session.commit()
    
    async def reset_failed_login_attempts(self, user_id: int):
        """
        Reset the failed login attempts counter for a user.
        """
        user = await self.get_user_by_id(user_id)
        if user:
            user.failed_login_attempts = 0
            user.locked_until = None  # Also unlock if locked
            await self.db_session.commit()
    
    async def lock_user_account(self, user_id: int):
        """
        Lock a user account by setting locked_until.
        """
        from datetime import datetime, timedelta, timezone
        user = await self.get_user_by_id(user_id)
        if user:
            user.locked_until = datetime.now(timezone.utc) + timedelta(minutes=15)  # Lock for 15 minutes
            await self.db_session.commit()
    
    async def unlock_user_account(self, user_id: int):
        """
        Unlock a user account by clearing locked_until.
        """
        user = await self.get_user_by_id(user_id)
        if user:
            user.locked_until = None
            await self.db_session.commit()
    
    async def verify_user_email(self, user_id: int):
        """
        Mark a user's email as verified.
        """
        user = await self.get_user_by_id(user_id)
        if user:
            user.is_verified = True
            await self.db_session.commit()
    
    async def update_user_profile(self, user_id: int, username: Optional[str] = None, email: Optional[str] = None):
        """
        Update user profile information.
        """
        user = await self.get_user_by_id(user_id)
        if user:
            if username is not None:
                user.username = username
            if email is not None:
                user.email = email
                user.is_verified = False  # Reset verification if email changes
            await self.db_session.commit()
            await self.db_session.refresh(user)
            return user
        return None