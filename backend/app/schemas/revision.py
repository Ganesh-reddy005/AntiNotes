from typing import List
from pydantic import BaseModel, Field
from datetime import datetime

# ========== REVISION SCHEMAS ==========

class RevisionTopicBase(BaseModel):
    """Base schema for revision topics"""
    topic: str = Field(description="Topic name")
    
class RevisionTopicsDueResponse(BaseModel):
    """Response for topics due for revision"""
    topics: List[str] = Field(default_factory=list)
    count: int = Field(description="Number of topics due")

class RevisionSuggestionsResponse(BaseModel):
    """Response for revision suggestions"""
    suggestions: List[str] = Field(default_factory=list)
    message: str = Field(description="Motivational message")

class RevisionMarkRequest(BaseModel):
    """Request to mark a topic as revised"""
    topic: str = Field(description="Topic to mark as revised")

class RevisionMarkResponse(BaseModel):
    """Response after marking topic as revised"""
    success: bool
    message: str

class RevisionStats(BaseModel):
    """Revision statistics for a user"""
    total_topics_tracked: int = Field(description="Total topics being tracked")
    topics_due_count: int = Field(description="Topics currently due for revision")
    topics_mastered: int = Field(description="Topics revised 4+ times")
    next_revision_topic: str | None = Field(description="Next topic to revise")
    next_revision_date: datetime | None = Field(description="Date of next revision")
