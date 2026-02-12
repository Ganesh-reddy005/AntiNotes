"""
Onboarding Endpoint - Simple Form

Collects user preferences to calibrate AI.
No quiz, just direct questions.
"""

from fastapi import APIRouter, HTTPException, Depends
from app.schemas.onboarding import OnboardingForm, OnboardingResult
from app.models.user import User
from app.models.profile import Profile
from app.core.dependencies import get_current_user

router = APIRouter()


@router.post("/submit")
async def submit_onboarding(
    form: OnboardingForm,
    current_user: User = Depends(get_current_user)
) -> OnboardingResult:
    """
    Submit onboarding form and create/update profile.
    Cost: $0 (no AI, just data storage)
    
    Requires: Authentication
    """
    
    # Find or create profile
    profile = await Profile.find_one(Profile.user == current_user)
    if not profile:
        profile = Profile(user=current_user)
    
    # Set profile from form
    profile.skill_level = form.coding_level
    profile.onboarding_completed = True
    profile.preferred_explanation_style = form.teaching_style
    # 2. AI Personality & Context
    profile.primary_language = form.primary_language  # (NEW)
    profile.additional_context = form.additional_context  # (NEW)
    
    # Set initial known concepts based on skill level
    if form.coding_level == "beginner":
        profile.known_concepts = ["variables", "loops", "conditionals", "functions"]
    elif form.coding_level == "intermediate":
        profile.known_concepts = ["arrays", "strings", "hash_tables", "recursion", "sorting"]
    else:  # advanced
        profile.known_concepts = ["algorithms", "data_structures", "dynamic_programming", "graphs", "trees"]
    
    # Store goal and other metadata
    # We can add custom fields or use a JSON field for flexibility
    
    if profile.id:
        await profile.save()
    else:
        await profile.insert()
    
    # Create friendly response
    messages = {
        "beginner": f"Welcome! We'll start with the basics of {form.primary_language}.",
        "intermediate": f"Great! Let's optimize your {form.primary_language} skills.",
        "advanced": "Excellent! Get ready for complex architectural challenges."
    }
    
    return OnboardingResult(
        skill_level=form.coding_level,
        teaching_style=form.teaching_style,
        goal=form.goal,
        primary_language=form.primary_language,
        additional_context=form.additional_context,
        message=messages.get(form.coding_level, "Let's get started!")
    )
