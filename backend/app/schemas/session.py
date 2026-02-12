from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
from app.models.session import Role, MessageType, SessionStatus

# Base Message structure
class MessageBase(BaseModel):
    role: Role
    content: str
    type: MessageType = MessageType.CHAT

# Output: Message with timestamp
class MessageRead(MessageBase):
    timestamp: datetime

# Input: Start a session
class SessionCreate(BaseModel):
    user_email: str
    problem_slug: str

# Output: Session status
class SessionRead(BaseModel):
    id: str = Field(alias="_id") 
    status: SessionStatus
    messages: List[MessageRead]
    created_at: datetime

    class Config:
        from_attributes = True