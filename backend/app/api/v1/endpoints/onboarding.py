"""
Onboarding Endpoint

Collects user preferences to calibrate the AI's personalization engine.
All fields feed directly into the reviewer and tutor system prompts.
"""

from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from app.schemas.onboarding import OnboardingForm, OnboardingResult
from app.models.user import User
from app.models.profile import Profile
from app.core.dependencies import get_current_user

router = APIRouter()


@router.post("/submit", response_model=OnboardingResult)
async def submit_onboarding(
    form: OnboardingForm,
    current_user: User = Depends(get_current_user)
):
    # Find or create profile using raw ObjectId query (Beanie Link fix)
    profile = await Profile.find_one({"user.$id": ObjectId(str(current_user.id))})
    if not profile:
        profile = Profile(user=current_user)

    # --- Core calibration ---
    profile.skill_level = form.coding_level
    profile.preferred_explanation_style = form.teaching_style
    profile.primary_language = form.primary_language

    # --- Goal and context (feeds goal_instruction in reviewer prompt) ---
    profile.goal = form.goal
    profile.background = form.background
    profile.additional_context = form.additional_context

    # --- Onboarding complete ---
    profile.onboarding_completed = True

    # --- Initialize known_concepts as empty (they grow based on submissions) ---
    profile.known_concepts = []

    # Save (insert if new, update if existing)
    if profile.id:
        await profile.save()
    else:
        await profile.insert()

    messages = {
        "beginner": f"Welcome! We'll start with the foundations of {form.primary_language} and grow from there.",
        "intermediate": f"Great! Let's identify your weak spots in {form.primary_language} and sharpen them.",
        "advanced": "Let's go deep. We'll push your reasoning and find the gaps even strong coders miss."
    }

    return OnboardingResult(
        skill_level=form.coding_level,
        teaching_style=form.teaching_style,
        goal=form.goal,
        primary_language=form.primary_language,
        additional_context=form.additional_context,
        message=messages.get(form.coding_level, "Let's get started!")
    )

