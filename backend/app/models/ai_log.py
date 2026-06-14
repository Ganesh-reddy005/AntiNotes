from typing import Optional, Dict, Any
from datetime import datetime
from beanie import Document, Link
from pydantic import Field
from app.models.user import User

class AILog(Document):
    """
    Beta Logging: Tracks every LLM interaction for quality monitoring.
    """
    user: Optional[Link[User]] = None
    agent_name: str  # "tutor" or "reviewer"
    model: str
    
    prompt: str
    response: Optional[str] = None
    
    # Context for debugging
    context_data: Dict[str, Any] = Field(default_factory=dict) # e.g., {"problem_slug": "..."}
    tokens_used: Optional[int] = None
    latency_ms: Optional[float] = None
    
    created_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "ai_logs"
