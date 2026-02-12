"""
Script to ensure all database tables are created including conversation and message.
"""

import asyncio
from app.db.session import engine, Base
from app.models import (
    # Import all models to ensure they're registered with Base
    analytics,  # This contains UserActivity and ProductivityMetric
    category,
    collaboration,  # This contains TaskAssignment and TaskComment
    conversation,  # This contains Conversation
    login_history,
    message,  # This contains Message
    password_reset_token,
    refresh_token,
    task,
    user,
    verification_token
)


async def ensure_all_tables():
    """
    Ensure all tables are created in the database.
    """
    print("Ensuring all tables exist...")
    async with engine.begin() as conn:
        print("Creating tables if they don't exist...")
        await conn.run_sync(Base.metadata.create_all)
    print("All tables ensured successfully!")


if __name__ == "__main__":
    asyncio.run(ensure_all_tables())