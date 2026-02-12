from typing import Dict, List, Optional
from pydantic import BaseModel, Field

# ========== PROFILE SCHEMAS ==========

class ProfileBase(BaseModel):
    skill_levels: Dict[str, int] = Field(default_factory=dict)
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    common_mistakes: List[str] = Field(default_factory=list)
    thinking_style: Optional[str] = None
    preferred_explanation_style: Optional[str] = None

class ProfileRead(ProfileBase):
    id: str = Field(alias="_id")
    total_submissions: int
    total_reviews: int
    
    class Config:
        populate_by_name = True
