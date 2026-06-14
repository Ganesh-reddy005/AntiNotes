from typing import List, Optional
from datetime import datetime
from beanie import Document, Link
from pydantic import BaseModel, Field
from enum import Enum
from app.models.user import User
from app.models.problem import Problem

class Role(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

class MessageType(str, Enum):
    CHAT = "chat"
    HINT = "hint"

class Message(BaseModel):
    role: Role
    content: str
    type: MessageType = MessageType.CHAT
    timestamp: datetime = Field(default_factory=datetime.now)

class SessionStatus(str, Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    ABANDONED = "abandoned"

class Session(Document):
    # Beanie uses Link generic to reference other Documents
    user: Link[User]
    problem: Link[Problem]
    
    status: SessionStatus = SessionStatus.ACTIVE
    messages: List[Message] = []
    
    # Metadata for metrics
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "sessions"