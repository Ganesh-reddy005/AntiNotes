from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class ProfileRead(BaseModel):
    """
    Full cognitive profile returned to the client.
    All personalization signals the AI uses — exposed to the frontend.
    """
    # Core identity
    skill_level: str
    primary_language: str
    goal: Optional[str] = None
    background: Optional[str] = None
    additional_context: Optional[str] = None
    onboarding_completed: bool
    preferred_explanation_style: str

    # Thinking model
    thinking_style: Optional[str] = None
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    common_mistakes: List[str] = Field(default_factory=list)

    # Concept tracking
    known_concepts: List[str] = Field(default_factory=list)
    unknown_concepts: List[str] = Field(default_factory=list)
    skill_levels: Dict[str, int] = Field(default_factory=dict)

    # Spaced repetition
    topics_to_revise: List[str] = Field(default_factory=list)
    revision_count: Dict[str, int] = Field(default_factory=dict)

    # Stats
    total_submissions: int = 0
    total_reviews: int = 0
    problems_solved: int = 0
    current_streak: int = 0
    updated_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True

