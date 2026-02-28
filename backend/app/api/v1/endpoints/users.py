from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from bson import ObjectId

from app.models.user import User
from app.models.profile import Profile
from app.models.review import Review
from app.models.learning_memory import LearningMemory
from app.schemas.user import UserRead
from app.schemas.profile import ProfileRead
from app.core.dependencies import get_current_user

router = APIRouter()

@router.get("/me", response_model=UserRead)
async def get_my_user(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/me/profile")
async def get_my_profile(current_user: User = Depends(get_current_user)):
    """
    Returns profile with LIVE-computed review/solved counts from actual DB records
    so the stats are always accurate regardless of background task timing.
    """
    profile = await Profile.find_one({"user.$id": ObjectId(str(current_user.id))})
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found. Please complete onboarding."
        )

    # Live counts — count from actual Review documents, not stale profile counters
    all_reviews = await Review.find(
        {"user.$id": ObjectId(str(current_user.id))}
    ).to_list()

    live_total_reviews = len(all_reviews)
    # Solved = distinct problems where at least one review has score > 60
    solved_slugs: set = set()
    for r in all_reviews:
        if r.score > 60:
            try:
                p = await r.problem.fetch()
                if p:
                    solved_slugs.add(p.slug)
            except Exception:
                pass

    # Return profile dict with overridden live stats
    data = profile.model_dump()
    data["id"] = str(profile.id)
    data["total_reviews"] = live_total_reviews
    data["problems_solved"] = len(solved_slugs)
    return data


@router.get("/me/history")
async def get_my_history(current_user: User = Depends(get_current_user)):
    """Returns the last 20 reviews with full details for the current user."""
    reviews = await Review.find(
        {"user.$id": ObjectId(str(current_user.id))},
        fetch_links=True
    ).sort(-Review.created_at).limit(20).to_list()

    result = []
    for r in reviews:
        try:
            # With fetch_links=True, r.problem is already the Problem object
            p = r.problem if hasattr(r.problem, "slug") else None

            # Fallback: lazy-fetch if not resolved
            if p is None and hasattr(r.problem, "fetch"):
                try:
                    p = await r.problem.fetch()
                except Exception:
                    p = None

            result.append({
                "review_id": str(r.id),
                "problem_slug": p.slug if p else "",
                "problem_title": p.title if p else "Unknown Problem",
                "difficulty": p.difficulty if p else "—",
                "score": float(r.score),
                "thinking_style": str(r.thinking_style or "—"),
                "strengths": [str(s) for s in (r.strengths or [])],
                "weaknesses": [str(w) for w in (r.weaknesses or [])],
                "concept_gaps": [str(c) for c in (r.concept_gaps or [])],
                "topics_to_revise": [str(t) for t in (r.topics_to_revise or [])],
                "detailed_feedback": str(r.detailed_feedback or ""),
                "solved_at": r.created_at.isoformat() if r.created_at else "",
            })
        except Exception as e:
            print(f"[History] Skipping review {r.id}: {e}")
    return result


@router.get("/me/recommended")
async def get_recommended_problems(current_user: User = Depends(get_current_user)):
    """Returns up to 4 unsolved problems matched to the user's skill level."""
    from bson import ObjectId
    from app.models.problem import Problem as ProblemModel
    from app.models.review import Review

    profile = await Profile.find_one({"user.$id": ObjectId(str(current_user.id))})

    difficulty_map = {"beginner": "Easy", "intermediate": "Medium", "advanced": "Hard"}
    difficulty = difficulty_map.get(profile.skill_level if profile else "beginner", "Easy")

    # Find slugs the user already has reviews for (already attempted)
    user_reviews = await Review.find(
        {"user.$id": ObjectId(str(current_user.id))}
    ).to_list()
    solved_slugs = set()
    for rev in user_reviews:
        try:
            p = await rev.problem.fetch()
            if p:
                solved_slugs.add(p.slug)
        except Exception:
            pass

    # Get problems at the right difficulty, excluding already-solved ones
    all_at_level = await ProblemModel.find(ProblemModel.difficulty == difficulty).to_list()
    unsolved = [p for p in all_at_level if p.slug not in solved_slugs]

    # Fallback: if all problems at level are solved, try next level up, then any
    if not unsolved:
        next_level = {"Easy": "Medium", "Medium": "Hard", "Hard": "Hard"}.get(difficulty, difficulty)
        all_next = await ProblemModel.find(ProblemModel.difficulty == next_level).to_list()
        unsolved = [p for p in all_next if p.slug not in solved_slugs]
    if not unsolved:
        all_problems = await ProblemModel.find_all().to_list()
        unsolved = [p for p in all_problems if p.slug not in solved_slugs]
    if not unsolved:
        # All problems solved — show any 4
        unsolved = await ProblemModel.find_all().limit(4).to_list()

    return unsolved[:4]


@router.get("/me/memory")
async def get_my_memory(current_user: User = Depends(get_current_user)):
    """Returns the latest LearningMemory snapshot (generated every 5 reviews). Returns null if none yet."""
    memory = await LearningMemory.find(
        {"user.$id": ObjectId(str(current_user.id))}
    ).sort(-LearningMemory.created_at).limit(1).first_or_none()

    if not memory:
        return None

    return {
        "summary": memory.summary,
        "timeframe": memory.timeframe,
        "topics_covered": memory.topics_covered,
        "progress_trend": memory.progress_trend,
        "key_breakthroughs": memory.key_breakthroughs,
        "persistent_struggles": memory.persistent_struggles,
        "num_reviews_analyzed": memory.num_reviews_analyzed,
        "created_at": memory.created_at.isoformat(),
    }

@router.put("/me/profile")
async def update_my_profile(
    updates: dict,
    current_user: User = Depends(get_current_user)
):
    """Update profile onboarding settings (skill level, goal, language, style)."""
    profile = await Profile.find_one({"user.$id": ObjectId(str(current_user.id))})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    allowed_fields = ["skill_level", "primary_language", "goal", "preferred_explanation_style"]
    for k, v in updates.items():
        if k in allowed_fields:
            setattr(profile, k, v)
    
    await profile.save()
    return {"message": "Profile updated successfully"}
