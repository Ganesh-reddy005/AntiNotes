"""
Revision Endpoints

Spaced repetition system for topics.
"""

from fastapi import APIRouter, Depends
from app.models.user import User
from app.models.profile import Profile
from app.agents.revision import RevisionAgent
from app.core.dependencies import get_current_user
from typing import List

router = APIRouter()


@router.get("/due")
async def get_topics_due_for_revision(current_user: User = Depends(get_current_user)):
    """
    Get topics that need revision based on spaced repetition.
    
    Requires: Authentication
    """
    profile = await Profile.find_one(Profile.user == current_user)
    if not profile:
        return {"topics": []}
    
    topics_due = await RevisionAgent.get_topics_due_for_revision(profile)
    
    return {
        "topics": topics_due,
        "count": len(topics_due)
    }


@router.get("/suggestions")
async def get_revision_suggestions(current_user: User = Depends(get_current_user)):
    """
    Get suggested problem topics for revision.
    Frontend can use this to filter problems.
    
    Requires: Authentication
    """
    profile = await Profile.find_one(Profile.user == current_user)
    if not profile:
        return {"suggestions": []}
    
    suggestions = await RevisionAgent.suggest_revision_problems(profile)
    
    return {
        "suggestions": suggestions,
        "message": "Practice these topics to maintain your knowledge!"
    }


@router.post("/mark-revised/{topic}")
async def mark_topic_as_revised(topic: str, current_user: User = Depends(get_current_user)):
    """
    Mark a topic as revised (user completed revision problem).
    
    Requires: Authentication
    """
    profile = await Profile.find_one(Profile.user == current_user)
    if not profile:
        return {"success": False}
    
    await RevisionAgent.mark_topic_revised(profile, topic)
    
    return {
        "success": True,
        "message": f"Great! '{topic}' marked as revised."
    }
