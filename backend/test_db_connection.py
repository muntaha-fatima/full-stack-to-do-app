"""
Test database connection to Neon PostgreSQL
"""
import asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from app.core.config import settings

async def test_connection():
    """Test database connection"""
    try:
        print(f"Testing connection to: {str(settings.DATABASE_URL).split('@')[1]}")
        engine = create_async_engine(str(settings.DATABASE_URL), echo=False)

        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT version()"))
            version = result.scalar()
            print(f"\n[SUCCESS] Database connection successful!")
            print(f"PostgreSQL version: {version}")

        await engine.dispose()
        return True
    except Exception as e:
        print(f"\n[ERROR] Database connection failed!")
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_connection())
    exit(0 if success else 1)
