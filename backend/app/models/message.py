from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class Message(SQLModel, table=True):
    """
    Represents individual messages in a conversation.
    """
    id: int = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)  # Identifier for the user who sent this message
    conversation_id: int = Field(index=True)  # Reference to the parent conversation
    role: str = Field(regex="^(user|assistant)$")  # Role of the message sender ("user" or "assistant")
    content: str = Field(max_length=10000)  # The actual content of the message
    created_at: datetime = Field(default_factory=datetime.utcnow)