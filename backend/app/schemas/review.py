from typing import List
from pydantic import BaseModel, Field
from beanie import PydanticObjectId

# ========== REVIEW SCHEMAS ==========

class ReviewOutput(BaseModel):
    """
    Structured output from the ReviewerAgent.
    This is what the AI must return in JSON format.
    """
    score: float = Field(ge=0, le=100, description="Quality score 0-100")
    strengths: List[str] = Field(description="What the student did well")
    weaknesses: List[str] = Field(description="What needs improvement")
    thinking_style: str = Field(description="Observed problem-solving approach")
    concept_gaps: List[str] = Field(description="Missing knowledge areas")
    topics_to_revise: List[str] = Field(description="Recommended study topics")
    detailed_feedback: str = Field(description="Full analysis in markdown")

class ReviewRead(ReviewOutput):
    """Response when reading a review from DB"""
    id: PydanticObjectId = Field(alias="_id")
    review_version: str
    
    class Config:
        populate_by_name = True
        from_attributes = True
