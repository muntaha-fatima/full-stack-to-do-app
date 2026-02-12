"""
Script to manually initialize the database.
"""

import asyncio
from app.db.session import engine, Base
from app.models import (
    analytics,
    category,
    collaboration,
    login_history,
    password_reset_token,
    refresh_token,
    task,
    user,
    verification_token,
    conversation,  # Add conversation model
    message        # Add message model
)


async def init_db():
    """
    Initialize the database by creating all tables.
    """
    print("Initializing database...")
    async with engine.begin() as conn:
        print("Dropping existing tables...")
        await conn.run_sync(Base.metadata.drop_all)
        print("Creating tables...")
        await conn.run_sync(Base.metadata.create_all)
    print("Database initialized successfully!")


if __name__ == "__main__":
    asyncio.run(init_db())