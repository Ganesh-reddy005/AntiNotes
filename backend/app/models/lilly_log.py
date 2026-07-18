from typing import Optional, Dict, Any
from datetime import datetime
from beanie import Document, Link
from pydantic import Field
from app.models.user import User

class LillyLog(Document):
    """
    Dedicated log for Lilly's contextual intelligence and recommendations.
    (Onboarding logs remain in AILog).
    """
    user: Optional[Link[User]] = None
    lilly_feature: str  # "dashboard_nudge", "roadmap_chat", etc.
    model_used: str
    
    prompt_context: str
    raw_response: Optional[str] = None
    extracted_json: Optional[Dict[str, Any]] = None
    
    tokens_used: Optional[int] = None
    latency_ms: Optional[float] = None
    
    created_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "lilly_logs"
