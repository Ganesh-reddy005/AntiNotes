from typing import Optional
from datetime import datetime
from beanie import Document, Link
from pydantic import Field
from app.models.user import User
from app.models.problem import Problem

class Revision(Document):
    """
    Tracks individual revision events in the spaced repetition system.
    Each record represents a user revising a specific topic/concept.
    """
    # References
    user: Link[User]
    problem: Optional[Link[Problem]] = None  # Problem solved during revision (optional)
    
    # Revision details
    topic: str = Field(description="Topic/concept being revised (e.g., 'arrays', 'dynamic programming')")
    revision_number: int = Field(ge=1, description="Which revision is this? (1st, 2nd, 3rd, etc.)")
    
    # Performance tracking
    success: bool = Field(default=True, description="Did the user successfully complete the revision?")
    score: Optional[float] = Field(None, ge=0, le=100, description="Score if a problem was solved")
    time_spent_seconds: Optional[int] = Field(None, description="Time spent on revision")
    
    # Spaced repetition metadata
    days_since_last_seen: int = Field(description="Days since user last saw this topic")
    scheduled_interval_days: int = Field(description="Scheduled interval (1, 3, 7, 14 days)")
    
    # Notes
    notes: Optional[str] = Field(None, description="User notes or reflection on revision")
    
    # Metadata
    revised_at: datetime = Field(default_factory=datetime.now)
    created_at: datetime = Field(default_factory=datetime.now)
    
    class Settings:
        name = "revisions"
        indexes = [
            "user",
            "topic",
            "revised_at",
            [("user", 1), ("topic", 1), ("revised_at", -1)]  # Compound index for user topic history
        ]
    
    class Config:
        json_schema_extra = {
            "example": {
                "topic": "hash tables",
                "revision_number": 2,
                "success": True,
                "score": 85.0,
                "days_since_last_seen": 3,
                "scheduled_interval_days": 3
            }
        }
