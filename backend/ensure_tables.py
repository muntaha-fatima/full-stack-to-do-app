"""
Script to ensure all database tables are created.
"""

import asyncio
from app.db.session import engine, Base
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.analytics import Analytics
from app.models.category import Category
from app.models.collaboration import TaskAssignment, TaskComment
from app.models.login_history import LoginHistory
from app.models.password_reset_token import PasswordResetToken
from app.models.refresh_token import RefreshToken
from app.models.task import Task
from app.models.user import User
from app.models.verification_token import VerificationToken


async def ensure_tables():
    """
    Ensure all tables are created in the database.
    """
    print("Ensuring all tables exist...")
    async with engine.begin() as conn:
        print("Creating tables if they don't exist...")
        await conn.run_sync(Base.metadata.create_all)
    print("Tables ensured successfully!")


if __name__ == "__main__":
    asyncio.run(ensure_tables())