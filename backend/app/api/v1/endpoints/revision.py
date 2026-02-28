"""
Revision Endpoints — Spaced repetition system.
Returns RevisionTopic objects matching the frontend's expected shape.
"""

from fastapi import APIRouter, Depends
from app.models.user import User
from app.models.profile import Profile
from app.agents.revision import RevisionAgent
from app.core.dependencies import get_current_user
from bson import ObjectId
from datetime import datetime

router = APIRouter()


@router.get("/due")
async def get_topics_due_for_revision(current_user: User = Depends(get_current_user)):
    """
    Returns list of RevisionTopic objects shaped for the frontend:
    { topic, last_seen_days, interval_days, revision_number, score }
    """
    profile = await Profile.find_one({"user.$id": ObjectId(str(current_user.id))})
    if not profile:
        return []

    now = datetime.now()
    result = []

    for topic, last_seen in profile.last_seen_topics.items():
        revision_count = profile.revision_count.get(topic, 0)

        if RevisionAgent.should_revise_topic(last_seen, revision_count):
            # Compute the interval that was supposed to be respected
            if revision_count == 0:
                interval = 1
            elif revision_count == 1:
                interval = 3
            elif revision_count == 2:
                interval = 7
            else:
                interval = 14

            days_since = max(0, (now - last_seen).days)

            result.append({
                "topic": topic,
                "last_seen_days": days_since,
                "interval_days": interval,
                "revision_number": revision_count,
                "score": profile.skill_levels.get(topic, 50),
            })

    # Sort by most overdue first
    result.sort(key=lambda x: x["last_seen_days"] - x["interval_days"], reverse=True)
    return result


@router.get("/suggestions")
async def get_revision_suggestions(current_user: User = Depends(get_current_user)):
    """Returns RevisionTopic objects for upcoming topics (not yet overdue but approaching)."""
    profile = await Profile.find_one({"user.$id": ObjectId(str(current_user.id))})
    if not profile:
        return []

    now = datetime.now()
    result = []

    for topic, last_seen in profile.last_seen_topics.items():
        revision_count = profile.revision_count.get(topic, 0)

        if revision_count == 0:
            interval = 1
        elif revision_count == 1:
            interval = 3
        elif revision_count == 2:
            interval = 7
        else:
            interval = 14

        days_since = max(0, (now - last_seen).days)

        # Include ALL known topics as suggestions (not just overdue ones)
        result.append({
            "topic": topic,
            "last_seen_days": days_since,
            "interval_days": interval,
            "revision_number": revision_count,
            "score": profile.skill_levels.get(topic, 50),
        })

    # Sort by most recently seen (most familiar, easiest to recall)
    result.sort(key=lambda x: x["last_seen_days"])
    return result[:6]


@router.post("/mark-revised/{topic}")
async def mark_topic_as_revised(
    topic: str,
    current_user: User = Depends(get_current_user)
):
    profile = await Profile.find_one({"user.$id": ObjectId(str(current_user.id))})
    if not profile:
        return {"success": False}

    await RevisionAgent.mark_topic_revised(profile, topic)
    return {"success": True, "message": f"'{topic}' marked as revised."}
