from typing import Dict, List, Optional
from datetime import datetime
from beanie import Document, Link
from pydantic import Field
from app.models.user import User

class Profile(Document):
    """
    Evolving cognitive profile for each learner.
    This is the core of personalization - tracks how a student thinks, not just what they know.
    """
    user: Link[User]

    # 1. The Language they code in (NEW)
    primary_language: str = "python"
    
    # === SKILL LEVEL (from onboarding) ===
    skill_level: str = "beginner"  # "beginner", "intermediate", "advanced"
    onboarding_completed: bool = False
    onboarding_score: Optional[float] = None
    
    # === CONCEPT TRACKING (grows over time) ===
    known_concepts: List[str] = Field(default_factory=list)  # ["arrays", "hash_tables", "recursion"]
    unknown_concepts: List[str] = Field(default_factory=list)  # identified gaps
    
    # === REVISION SYSTEM (spaced repetition) ===
    topics_to_revise: List[str] = Field(default_factory=list)  # Topics due for revision
    last_seen_topics: Dict[str, datetime] = Field(default_factory=dict)  # {"arrays": "2024-01-15", ...}
    revision_count: Dict[str, int] = Field(default_factory=dict)  # How many times revised each topic
    
    # === GOAL TRACKING ===
    goal: Optional[str] = None  # "get_job", "faang", "service_based", etc.
    
    # === SKILL LEVELS PER TOPIC ===
    skill_levels: Dict[str, int] = Field(default_factory=dict)  # {"arrays": 7, "dp": 3}
    
    # Identified strengths and weaknesses
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    
    # Pattern recognition
    common_mistakes: List[str] = Field(default_factory=list)
    
    # Learning style classification
    thinking_style: Optional[str] = None  # e.g., "bottom-up", "top-down", "visual"
    preferred_explanation_style: str = "socratic" # e.g., "concrete examples", "theory-first"

    # background
    background: Optional[str] = None  # e.g., "CS grad", "Bootcamp", "Self-taught"
    # 4. Any extra context (NEW)
    additional_context: Optional[str] = None


    # Metadata
    total_submissions: int = 0
    total_reviews: int = 0
    problems_solved: int = 0
    current_streak: int = 0
    updated_at: datetime = Field(default_factory=datetime.now)
    created_at: datetime = Field(default_factory=datetime.now)
    
    class Settings:
        name = "profiles"
