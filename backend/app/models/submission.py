from typing import Dict, Optional
from datetime import datetime
from beanie import Document, Link
from pydantic import Field
from app.models.user import User
from app.models.problem import Problem

class Submission(Document):
    """
    Tracks all code submissions for problems.
    Each submission is a learning signal that feeds the review system.
    """
    user: Link[User]
    problem: Link[Problem]
    
    # The code itself
    code: str
    language: str = "python"
    
    # Test execution results
    test_results: Dict = Field(default_factory=dict)  # {"test_1": "pass", "test_2": "fail"}
    is_correct: bool = False
    execution_time_ms: Optional[float] = None
    
    # Metadata
    submitted_at: datetime = Field(default_factory=datetime.now)
    
    class Settings:
        name = "submissions"
        
    class Config:
        json_schema_extra = {
            "example": {
                "code": "def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        if target - num in seen:\n            return [seen[target - num], i]\n        seen[num] = i",
                "language": "python",
                "is_correct": True
            }
        }
