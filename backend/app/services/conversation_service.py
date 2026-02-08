from typing import Optional
from sqlmodel import Session, select
from app.models.conversation import Conversation


def create_conversation(db_session: Session, user_id: str) -> Conversation:
    """Create a new conversation for a user."""
    conversation = Conversation(user_id=user_id)
    db_session.add(conversation)
    db_session.commit()
    db_session.refresh(conversation)
    return conversation


def get_conversation_by_id(db_session: Session, conversation_id: int) -> Optional[Conversation]:
    """Retrieve a conversation by its ID."""
    statement = select(Conversation).where(Conversation.id == conversation_id)
    return db_session.exec(statement).first()


def get_conversations_by_user(db_session: Session, user_id: str) -> list[Conversation]:
    """Retrieve all conversations for a specific user."""
    statement = select(Conversation).where(Conversation.user_id == user_id)
    return db_session.exec(statement).all()