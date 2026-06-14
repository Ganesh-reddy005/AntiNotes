from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
from beanie import PydanticObjectId
from app.models.session import Role, MessageType, SessionStatus

# Base Message structure
class MessageBase(BaseModel):
    role: Role
    content: str
    type: MessageType = MessageType.CHAT

# Input: A message to add to a session
class MessageCreate(MessageBase):
    pass

# Output: Message with timestamp
class MessageRead(MessageBase):
    timestamp: datetime

# Input: Start a session (only need the problem slug; user comes from auth token)
class SessionCreate(BaseModel):
    problem_slug: str

# Output: Session status
class SessionRead(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    status: SessionStatus
    messages: List[MessageRead]
    created_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True