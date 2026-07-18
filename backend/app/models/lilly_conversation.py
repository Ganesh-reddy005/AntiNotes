from typing import List, Optional, Dict, Any
from datetime import datetime
from beanie import Document, Link
from pydantic import Field
from app.models.user import User


class ConversationMessage(Document):
    """
    A single message within a Lilly personalization conversation.
    Stored separately so we can cap history and summarize old sessions.
    """
    user: Link[User]
    conversation_id: str          # groups messages into one chat session
    role: str                     # "user" or "assistant"
    content: str
    created_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "lilly_conversation_messages"


class LillyConversation(Document):
    """
    Tracks a user's personalization chat sessions with Lilly.
    Holds a rolling summary of past sessions so Lilly "remembers"
    across sessions without storing the full raw history forever.
    """
    user: Link[User]
    conversation_id: str          # unique id for the current active session
    message_count: int = 0        # total messages in this session
    summary: Optional[str] = None # rolling summary of older sessions
    session_count: int = 1        # how many sessions have been summarized
    updated_at: datetime = Field(default_factory=datetime.now)
    created_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "lilly_conversations"
