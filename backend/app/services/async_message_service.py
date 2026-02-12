from typing import Optional, List
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from app.models.message import Message


async def create_message(
    db_session: AsyncSession,
    user_id: str,
    conversation_id: int,
    role: str,
    content: str
) -> Message:
    """Create a new message in a conversation."""
    message = Message(
        user_id=user_id,
        conversation_id=conversation_id,
        role=role,
        content=content
    )
    db_session.add(message)
    await db_session.commit()
    await db_session.refresh(message)
    return message


async def get_messages_by_conversation(db_session: AsyncSession, conversation_id: int) -> List[Message]:
    """Retrieve all messages for a specific conversation."""
    statement = select(Message).where(Message.conversation_id == conversation_id)
    result = await db_session.execute(statement)
    return result.scalars().all()


async def get_message_by_id(db_session: AsyncSession, message_id: int) -> Optional[Message]:
    """Retrieve a message by its ID."""
    statement = select(Message).where(Message.id == message_id)
    result = await db_session.execute(statement)
    return result.scalar_one_or_none()