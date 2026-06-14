from typing import List, Optional
from datetime import datetime
from beanie import Document, Link
from pydantic import Field
from app.models.user import User
from app.models.problem import Problem
from app.models.submission import Submission

class Review(Document):
    """
    AI-generated analysis of a submission.
    This is where learning signals are extracted and structured.
    """
    # References
    submission: Link[Submission]
    user: Link[User]  # Denormalized for faster queries
    problem: Link[Problem]  # Denormalized for analytics
    
    # Core review outputs (from ReviewerAgent)
    score: float = Field(ge=0, le=100)  # 0-100 quality score
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    thinking_style: str  # Observed approach: "iterative", "recursive", "brute-force", etc.
    concept_gaps: List[str] = Field(default_factory=list)  # Missing knowledge
    topics_to_revise: List[str] = Field(default_factory=list)  # Recommended study areas
    
    # Detailed feedback
    detailed_feedback: str  # Full AI analysis in markdown
    
    # Deduplication hash (sha256 of problem_slug+language+code)
    code_hash: Optional[str] = None
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.now)
    review_version: str = "v1"  # For prompt versioning
    
    class Settings:
        name = "reviews"
        
    class Config:
        json_schema_extra = {
            "example": {
                "score": 75.0,
                "strengths": ["Correct logic", "Clean code structure"],
                "weaknesses": ["O(n²) time complexity", "No edge case handling"],
                "thinking_style": "brute-force",
                "concept_gaps": ["hash tables", "time complexity optimization"],
                "topics_to_revise": ["Hash Maps", "Two-pointer technique"]
            }
        }
