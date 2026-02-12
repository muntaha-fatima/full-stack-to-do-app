"""
Simple script to initialize test user for the application.
"""

import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from app.db.session import Base, AsyncSession
from app.models.user import User
from app.core.security import get_password_hash

# Use the database URL from environment or default
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://todoapp:todoapp_dev_password@localhost:5432/todoapp")

async def create_test_user():
    # Create async engine
    engine = create_async_engine(DATABASE_URL)

    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Create session
    async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

    async with async_session() as session:
        # Check if test user already exists
        result = await session.execute(User.__table__.select().where(User.email == "test@example.com"))
        existing_user = result.scalar_one_or_none()

        if existing_user:
            print("Test user already exists!")
            return

        # Create test user
        test_user = User(
            email="test@example.com",
            full_name="Test User",
            hashed_password=get_password_hash("password123")  # Using a default password
        )

        session.add(test_user)
        await session.commit()
        await session.refresh(test_user)

        print(f"Created test user with ID: {test_user.id}")
        print("Email: test@example.com")
        print("Password: password123")

if __name__ == "__main__":
    asyncio.run(create_test_user())