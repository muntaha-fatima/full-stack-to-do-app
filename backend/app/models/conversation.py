from sqlmodel import SQLModel, Field
from datetime import datetime
import uuid


class Conversation(SQLModel, table=True):
    """
    Represents a user's conversation with the AI chatbot.
    """
    id: int = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)  # Identifier for the user who owns this conversation
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    def __init__(self, user_id: str, **kwargs):
        super().__init__(user_id=user_id, **kwargs)