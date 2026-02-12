from typing import Dict, Optional
from pydantic import BaseModel, Field

# ========== SUBMISSION SCHEMAS ==========

class SubmissionCreate(BaseModel):
    """Input when user submits code"""
    problem_slug: str
    code: str
    language: str = "python"

class SubmissionRead(BaseModel):
    """Output when reading a submission"""
    id: str = Field(alias="_id")
    code: str
    language: str
    test_results: Dict
    is_correct: bool
    execution_time_ms: Optional[float] = None
    
    class Config:
        populate_by_name = True
