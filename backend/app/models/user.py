from typing import Optional
from datetime import datetime
from beanie import Document, Indexed
from pydantic import Field, EmailStr

class User(Document):
    email: Indexed(EmailStr, unique=True) # type: ignore
    full_name: Optional[str] = None
    profile_image: Optional[str] = None
    
    # Authentication
    hashed_password: str
    is_active: bool = True
    email_verified: bool = False
    
    # The Core Metric: Logic Elo (Starts at 1000)
    logic_elo: int = Field(default=1000)
    
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "users" # Collection name in MongoDB