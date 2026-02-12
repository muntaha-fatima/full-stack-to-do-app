"""
Script to manually initialize the database with proper schema.
"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.core.config import settings
from app.db.session import Base
from app.models import *  # Import all models to register them with Base

async def init_database():
    # Create engine
    engine = create_async_engine(str(settings.DATABASE_URL))
    
    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    print("Database initialized successfully!")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(init_database())