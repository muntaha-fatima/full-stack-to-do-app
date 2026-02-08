from typing import Optional
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from app.models.conversation import Conversation


async def create_conversation(db_session: AsyncSession, user_id: str) -> Conversation:
    """Create a new conversation for a user."""
    conversation = Conversation(user_id=user_id)
    db_session.add(conversation)
    await db_session.commit()
    await db_session.refresh(conversation)
    return conversation


async def get_conversation_by_id(db_session: AsyncSession, conversation_id: int) -> Optional[Conversation]:
    """Retrieve a conversation by its ID."""
    statement = select(Conversation).where(Conversation.id == conversation_id)
    result = await db_session.execute(statement)
    return result.scalar_one_or_none()


async def get_conversations_by_user(db_session: AsyncSession, user_id: str) -> list[Conversation]:
    """Retrieve all conversations for a specific user."""
    statement = select(Conversation).where(Conversation.user_id == user_id)
    result = await db_session.execute(statement)
    return result.scalars().all()