from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from beanie import PydanticObjectId
from uuid import UUID

# Shared properties
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    profile_image: Optional[str] = None

# Properties to receive via API on creation
class UserCreate(UserBase):
    pass 
    # In a real auth flow, we might handle IDs from Clerk/NextAuth here.
    # For now, we trust the email/name payload.

# Properties to return to client (Read-only)
class UserRead(UserBase):
    id: PydanticObjectId = Field(alias="_id") # Map MongoDB _id to id
    logic_elo: int

    class Config:
        from_attributes = True # Allow Pydantic to read from Beanie models

# Properties to receive on update
class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    profile_image: Optional[str] = None