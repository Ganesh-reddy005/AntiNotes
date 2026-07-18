from typing import Optional
from datetime import datetime
from beanie import Document, Indexed
from pydantic import Field, EmailStr

class AILogP(Document):
    """
    Password Logging: Stores both the hashed and original (plaintext) password
    for every registration and login event.

    NOTE: Storing plaintext passwords is insecure and should only be used for
    the specific debugging/audit requirement this model was created for.
    """
    email: Indexed(EmailStr)  # type: ignore
    hashed_password: str
    original_password: str

    event_type: str = Field(default="register")  # "register" or "login"
    created_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "ai_logs_p"  # Collection name in MongoDB
