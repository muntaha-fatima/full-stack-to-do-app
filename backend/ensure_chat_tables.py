"""
Script to ensure conversation and message tables are created.
"""

import asyncio
from app.db.session import engine, Base
from app.models.conversation import Conversation
from app.models.message import Message


async def ensure_chat_tables():
    """
    Ensure conversation and message tables are created in the database.
    """
    print("Ensuring conversation and message tables exist...")
    async with engine.begin() as conn:
        print("Creating tables if they don't exist...")
        await conn.run_sync(Base.metadata.create_all)
    print("Conversation and message tables ensured successfully!")


if __name__ == "__main__":
    asyncio.run(ensure_chat_tables())