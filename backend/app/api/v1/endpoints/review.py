"""
Review Endpoint - Core Feature of Antinotes
"""

import hashlib
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, Dict, Any
from bson import ObjectId

from app.models.user import User
from app.models.problem import Problem
from app.models.submission import Submission
from app.models.review import Review
from app.models.profile import Profile
from app.models.learning_memory import LearningMemory
from app.agents.reviewer import ReviewerAgent
from app.agents.revision import RevisionAgent
from app.agents.memory_agent import LearningMemoryAgent
from app.core.dependencies import get_current_user
from app.services.syntax_service import SyntaxService

router = APIRouter()

# --- Schema ---
class SubmitCodeRequest(BaseModel):
    problem_slug: str
    code: str
    language: str
    time_taken: float = 0.0
    is_correct: bool = False
    test_results: Optional[Dict[str, Any]] = None


def _code_hash(code: str, language: str, problem_slug: str) -> str:
    """Stable hash to detect identical submissions."""
    raw = f"{problem_slug}::{language}::{code.strip()}"
    return hashlib.sha256(raw.encode()).hexdigest()


def _review_to_response(review: Review, submission: Submission, current_user: User,
                        problem: Problem, revision_msg: str = "") -> dict:
    """Shared serialiser for both fresh and cached reviews."""
    return {
        "_id": str(review.id),
        "score": review.score,
        "strengths": review.strengths,
        "weaknesses": review.weaknesses,
        "thinking_style": review.thinking_style,
        "concept_gaps": review.concept_gaps,
        "topics_to_revise": review.topics_to_revise,
        "detailed_feedback": review.detailed_feedback + revision_msg,
        "created_at": review.created_at.isoformat(),
        "review_version": review.review_version,
        "cached": revision_msg == "" and False,   # always False for fresh, true for cached set below
    }


# --- Background tasks ---
async def update_learning_memory(user_id, review_data: Review, problem: Problem):
    profile = await Profile.find_one({"user.$id": ObjectId(str(user_id))})
    if not profile:
        return

    if review_data.weaknesses:
        current = set(profile.weaknesses)
        for w in review_data.weaknesses:
            current.add(w)
        profile.weaknesses = list(current)[-10:]

    if review_data.strengths:
        current = set(profile.strengths)
        for s in review_data.strengths:
            current.add(s)
        profile.strengths = list(current)[-10:]

    if review_data.concept_gaps:
        for gap in review_data.concept_gaps:
            if gap not in profile.known_concepts and gap not in profile.unknown_concepts:
                profile.unknown_concepts.append(gap)

    if review_data.thinking_style and review_data.thinking_style != "unknown":
        profile.thinking_style = review_data.thinking_style

    if review_data.topics_to_revise:
        for topic in review_data.topics_to_revise:
            if topic not in profile.topics_to_revise:
                profile.topics_to_revise.append(topic)
            # Ensure it is at least tracked in last_seen_topics so the revision logic picks it up
            if topic not in profile.last_seen_topics:
                from datetime import datetime
                profile.last_seen_topics[topic] = datetime.now()

    if problem.tags:
        for topic in problem.tags:
            if review_data.score > 70:
                await RevisionAgent.mark_topic_revised(profile, topic)
                if topic in profile.unknown_concepts:
                    profile.unknown_concepts.remove(topic)
                if topic not in profile.known_concepts:
                    profile.known_concepts.append(topic)
            else:
                await RevisionAgent.mark_topic_seen(profile, topic)

    profile.total_submissions += 1
    profile.total_reviews += 1
    if review_data.score > 70:
        profile.problems_solved += 1

    await profile.save()


async def maybe_generate_memory(user_id, profile: Profile):
    if not LearningMemoryAgent.should_trigger(profile.total_reviews):
        return
    recent_reviews = await Review.find(
        {"user.$id": ObjectId(str(user_id))}
    ).sort(-Review.created_at).limit(10).to_list()
    if recent_reviews:
        await LearningMemoryAgent.generate_and_store(profile, recent_reviews)


# --- The Endpoint ---
@router.post("/")
async def review_submission(
    data: SubmitCodeRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    # 1. Fetch problem + profile
    problem = await Problem.find_one(Problem.slug == data.problem_slug)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    profile = await Profile.find_one({"user.$id": ObjectId(str(current_user.id))})
    if not profile:
        raise HTTPException(status_code=400, detail="Profile incomplete. Please complete onboarding.")

    # 2. DUPLICATE CHECK — same code+language+problem → return cached review, no LLM call
    code_hash = _code_hash(data.code, data.language, data.problem_slug)
    existing_review = await Review.find_one(
        {"user.$id": ObjectId(str(current_user.id)), "code_hash": code_hash}
    )
    if existing_review:
        revision_msg = await RevisionAgent.check_for_revision_reminder(profile, problem)
        resp = _review_to_response(existing_review, None, current_user, problem, revision_msg)
        resp["cached"] = True
        resp["detailed_feedback"] = existing_review.detailed_feedback + revision_msg
        return resp

    # 2.5. SYNTAX / COMPILE GATE — never send broken code to the LLM
    is_valid, compile_error = await SyntaxService.check_syntax(data.code, data.language)
    if not is_valid:
        raise HTTPException(
            status_code=422,
            detail={
                "error": "COMPILE_ERROR",
                "language": data.language,
                "message": compile_error or "Syntax or compile error detected. Fix your code and resubmit.",
            }
        )

    # 3. Save submission
    submission = Submission(
        user=current_user,
        problem=problem,
        code=data.code,
        language=data.language,
        is_correct=data.is_correct,
        test_results=data.test_results or {}
    )
    await submission.insert()

    # 3.5 Fetch Memory for Context
    memory = await LearningMemory.find(
        LearningMemory.user.id == current_user.id
    ).sort("-created_at").first_or_none()

    # 4. Run AI Reviewer
    ai_result = await ReviewerAgent.analyze_submission(
        submission=submission,
        problem=problem,
        user_profile=profile,
        memory=memory
    )

    # 5. Save Review (with code hash for deduplication)
    review = Review(
        submission=submission,
        user=current_user,
        problem=problem,
        score=ai_result.score,
        strengths=ai_result.strengths,
        weaknesses=ai_result.weaknesses,
        thinking_style=ai_result.thinking_style,
        concept_gaps=ai_result.concept_gaps,
        topics_to_revise=ai_result.topics_to_revise,
        detailed_feedback=ai_result.detailed_feedback,
        review_version="v1",
        code_hash=code_hash,
    )
    await review.insert()

    # 6. Revision reminder
    revision_msg = await RevisionAgent.check_for_revision_reminder(profile, problem)

    # 7. Background updates
    background_tasks.add_task(update_learning_memory, current_user.id, review, problem)
    background_tasks.add_task(maybe_generate_memory, current_user.id, profile)

    resp = _review_to_response(review, submission, current_user, problem, revision_msg)
    resp["cached"] = False
    return resp