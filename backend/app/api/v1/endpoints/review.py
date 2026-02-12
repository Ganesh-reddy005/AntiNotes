"""
Review Endpoint - Core Feature of Antinotes

This endpoint:
1. Receives code submissions
2. Uses ReviewerAgent to analyze the submission
3. Stores the review
4. Updates the User Profile (Learning Memory) in the background
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, Dict, Any

from app.models.user import User
from app.models.problem import Problem
from app.models.submission import Submission
from app.models.review import Review
from app.models.profile import Profile
from app.agents.reviewer import ReviewerAgent
from app.agents.revision import RevisionAgent
from app.core.dependencies import get_current_user

router = APIRouter()

# --- Schema (Matches Frontend) ---
class SubmitCodeRequest(BaseModel):
    problem_slug: str
    code: str
    language: str
    time_taken: float
    is_correct: bool
    test_results: Optional[Dict[str, Any]] = None

# --- Background Logic (The "Brain" Update) ---
async def update_learning_memory(user_id, review_data: Review, problem: Problem):
    """
    Background Task: Updates the user's profile based on the AI review.
    Ensures ALL fields (Strengths, Weaknesses, Gaps) are persisted.
    """
    profile = await Profile.find_one(Profile.user.id == user_id)
    if not profile:
        return

    # 1. Update Weaknesses (Circular Buffer: Keep last 10)
    if review_data.weaknesses:
        current = set(profile.weaknesses)
        for w in review_data.weaknesses:
            current.add(w)
        profile.weaknesses = list(current)[-10:]

    # 2. Update Strengths (Circular Buffer: Keep last 10)
    if review_data.strengths:
        current = set(profile.strengths)
        for s in review_data.strengths:
            current.add(s)
        profile.strengths = list(current)[-10:]

    # 3. Update Concept Gaps (Grow Only)
    if review_data.concept_gaps:
        for gap in review_data.concept_gaps:
            if gap not in profile.known_concepts and gap not in profile.unknown_concepts:
                profile.unknown_concepts.append(gap)

    # 4. Update Thinking Style
    if review_data.thinking_style and review_data.thinking_style != "unknown":
        profile.thinking_style = review_data.thinking_style
    
    # 5. Spaced Repetition Logic
    if problem.tags:
        for topic in problem.tags:
            if review_data.score > 70:  # Success
                await RevisionAgent.mark_topic_revised(profile, topic)
                # Move from unknown -> known
                if topic in profile.unknown_concepts:
                    profile.unknown_concepts.remove(topic)
                if topic not in profile.known_concepts:
                    profile.known_concepts.append(topic)
            else:  # Failed attempt
                await RevisionAgent.mark_topic_seen(profile, topic)
    
    # 6. Update Stats
    profile.total_submissions += 1
    profile.total_reviews += 1
    if review_data.score > 70:
        profile.problems_solved += 1
        
    await profile.save()


# --- The Endpoint ---
@router.post("/")
async def review_submission(
    data: SubmitCodeRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """
    Submit code -> AI Review -> Return Feedback
    """
    
    # 1. Fetch Context
    problem = await Problem.find_one(Problem.slug == data.problem_slug)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
        
    profile = await Profile.find_one(Profile.user.id == current_user.id)
    if not profile:
        raise HTTPException(status_code=400, detail="Profile incomplete. Please complete onboarding.")

    # 2. Create Submission (Trusting Frontend Tests for Sprint 1)
    submission = Submission(
        user=current_user,
        problem=problem,
        code=data.code,
        language=data.language,
        status="success" if data.is_correct else "failed",
        is_correct=data.is_correct,
        time_taken=data.time_taken,
        test_results=data.test_results or {}
    )
    await submission.insert()

    # 3. Run AI Reviewer
    ai_result = await ReviewerAgent.analyze_submission(
        submission=submission,
        problem=problem,
        user_profile=profile
    )

    # 4. Save Review
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
        review_version="v1"
    )
    await review.insert()

    # 5. Check for Revision Bonus Message
    revision_msg = await RevisionAgent.check_for_revision_reminder(profile, problem)

    # 6. Trigger Background Updates
    background_tasks.add_task(update_learning_memory, current_user.id, review, problem)

    # 7. Return Enriched Response (The Format You Like)
    return {
        "_id": str(review.id),
        "submission": {
            "id": str(submission.id),
            "user": {
                "id": str(current_user.id),
                "email": current_user.email,
                "full_name": current_user.full_name,
                "logic_elo": current_user.logic_elo
            },
            "problem": {
                "id": str(problem.id),
                "slug": problem.slug,
                "title": problem.title,
                "description": problem.description,
                "difficulty": problem.difficulty,
                "tags": problem.tags,
                "starter_code": problem.starter_code,
                "test_cases": problem.test_cases
            },
            "code": submission.code,
            "language": submission.language,
            "test_results": submission.test_results,
            "is_correct": submission.is_correct,
            "execution_time_ms": submission.execution_time_ms,
            "submitted_at": submission.submitted_at.isoformat()
        },
        "user": {
            "id": str(current_user.id),
            "email": current_user.email,
            "full_name": current_user.full_name,
            "logic_elo": current_user.logic_elo
        },
        "problem": {
            "id": str(problem.id),
            "slug": problem.slug,
            "title": problem.title,
            "description": problem.description,
            "difficulty": problem.difficulty,
            "tags": problem.tags,
            "starter_code": problem.starter_code,
            "test_cases": problem.test_cases
        },
        "score": review.score,
        "strengths": review.strengths,
        "weaknesses": review.weaknesses,
        "thinking_style": review.thinking_style,
        "concept_gaps": review.concept_gaps,
        "topics_to_revise": review.topics_to_revise,
        "detailed_feedback": review.detailed_feedback + revision_msg,
        "created_at": review.created_at.isoformat(),
        "review_version": review.review_version
    }