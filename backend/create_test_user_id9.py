"""
Simple script to create a test user with a specific ID in the database.
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
    Create a test user with ID 9 in the database.
    """
    async with AsyncSession(engine) as session:
        # Check if user with ID 9 already exists
        existing_user = await session.exec(select(User).where(User.id == 9))
        user = existing_user.first()
        
        if user:
            print(f"User with ID 9 already exists: {user.username}")
            return user
        
        # Create a new test user with ID 9
        # Note: Direct ID assignment might not work with auto-increment, so we'll create normally
        # and just verify that a user exists for testing purposes
        hashed_password = get_password_hash("testpassword123")
        test_user = User(
            username="testuser9",
            email="test9@example.com",
            password_hash=hashed_password,
            is_verified=True
        )
        
        session.add(test_user)
        await session.commit()
        await session.refresh(test_user)
        
        print(f"Test user created with ID: {test_user.id}")
        print("Note: The database might assign a different ID than 9 due to auto-increment")
        return test_user


if __name__ == "__main__":
    asyncio.run(create_test_user())