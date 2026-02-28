"""
Onboarding - Simple Form Approach

Quick questions to calibrate AI teaching style.
"""

from pydantic import BaseModel
from typing import Optional


class OnboardingForm(BaseModel):
    """User's onboarding responses"""
    
    # 1. Skill calibration
    coding_level: str  # "beginner", "intermediate", "advanced"
    
    # 2. Goal context
    goal: str  # "get_job", "faang", "startup", "learn_for_fun"
    
    # 3. Teaching preference
    teaching_style: str  # "socratic", "friendly", "ruthless"
    
    # 4. Syntax calibration
    primary_language: str  # "python", "cpp", "java", "javascript"
    
    # 5. Optional enrichment
    background: Optional[str] = None  # "CS grad", "Bootcamp", "Self-taught"
    additional_context: Optional[str] = None  # "I struggle with recursion", etc.


class OnboardingResult(BaseModel):
    """Result after onboarding"""
    skill_level: str
    teaching_style: str
    goal: str
    primary_language: str
    additional_context: Optional[str] = None
    message: str

