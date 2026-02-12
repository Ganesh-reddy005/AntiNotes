"""
Onboarding - Simple Form Approach

Quick questions to calibrate AI teaching style.
"""

from pydantic import BaseModel
from typing import Optional


class OnboardingForm(BaseModel):
    """User's onboarding responses"""
    
    # 1. Critical for Calibration
    coding_level: str  # "beginner", "intermediate", "advanced"
    
    # 2. Critical for Context
    goal: str  # "get_job", "faang", "startup", "learn_for_fun"
    
    # 3. Critical for Tone
    teaching_style: str  # "socratic", "friendly", "ruthless"
    
    # 4. Critical for Syntax (NEW)
    primary_language: str # "python", "cpp", "java", "javascript"
    
    # 5. Optional Context (Replaces topics_interested)
    background: Optional[str] = None  # "CS grad", "Bootcamp", "Self-taught"
    additional_context: Optional[str] = None # "I struggle with recursion", etc.

class OnboardingResult(BaseModel):
    """Result after onboarding"""
    skill_level: str
    teaching_style: str
    goal: str
    message: str


# No pre-defined questions needed - it's just a form!
