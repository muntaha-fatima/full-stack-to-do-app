"""
Simple script to create a test user in the database.
"""

import asyncio
import os
import sys
from sqlmodel import SQLModel, select
from sqlmodel.ext.asyncio.session import AsyncSession

# Add the app directory to the path so we can import modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '.'))

from app.db.session import engine
from app.models.user import User
from app.core.security import get_password_hash


async def create_test_user():
    """
    Create a test user in the database.
    """
    async with AsyncSession(engine) as session:
        # Check if user already exists
        existing_user = await session.exec(select(User).where(User.username == "testuser"))
        user = existing_user.first()
        
        if user:
            print(f"Test user already exists with ID: {user.id}")
            return user
        
        # Create a new test user
        hashed_password = get_password_hash("testpassword123")
        test_user = User(
            username="testuser",
            email="test@example.com",
            password_hash=hashed_password,
            is_verified=True
        )
        
        session.add(test_user)
        await session.commit()
        await session.refresh(test_user)
        
        print(f"Test user created with ID: {test_user.id}")
        return test_user


if __name__ == "__main__":
    asyncio.run(create_test_user())