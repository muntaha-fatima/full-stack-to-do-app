from typing import Optional, List
from sqlmodel import Session, select
from app.models.message import Message


def create_message(
    db_session: Session, 
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
    db_session.commit()
    db_session.refresh(message)
    return message


def get_messages_by_conversation(db_session: Session, conversation_id: int) -> List[Message]:
    """Retrieve all messages for a specific conversation."""
    statement = select(Message).where(Message.conversation_id == conversation_id)
    return db_session.exec(statement).all()


def get_message_by_id(db_session: Session, message_id: int) -> Optional[Message]:
    """Retrieve a message by its ID."""
    statement = select(Message).where(Message.id == message_id)
    return db_session.exec(statement).first()