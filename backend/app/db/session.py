"""
Database session management with async SQLAlchemy.
"""

from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base

from app.core.config import settings

# Create async engine
# For SQLite, we need to handle some differences from PostgreSQL
connect_args = {}
if str(settings.DATABASE_URL).startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_async_engine(
    str(settings.DATABASE_URL),
    echo=settings.ENVIRONMENT == "development",
    future=True,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    connect_args=connect_args,  # Needed for SQLite
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Base class for models
Base = declarative_base()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency for getting async database sessions.

    Yields:
        AsyncSession: Database session
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db() -> None:
    """
    Initialize database - create tables if they don't exist.
    In production, use Alembic migrations instead.
    """
    async with engine.begin() as conn:
        # Import all models here to ensure they are registered with Base
        from app.models import analytics, category, collaboration, task, user  # noqa: F401

        # Create tables (only for development)
        if settings.ENVIRONMENT == "development":
            await conn.run_sync(Base.metadata.create_all)
