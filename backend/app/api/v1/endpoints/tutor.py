"""
Tutor Endpoint — Socratic AI Tutoring (Protected)

Connects the authenticated student's profile with the TutorService.
Optionally ties responses to a chat Session for persistence.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Optional

from app.services.tutor import TutorService
from app.models.user import User
from app.models.profile import Profile
from app.models.session import Session, SessionStatus
from app.core.dependencies import get_current_user

router = APIRouter()


class ChatRequest(BaseModel):
    problem_slug: str
    user_message: str
    history: List[Dict[str, str]] = []   # [{"role": "user", "content": "..."}]
    session_id: Optional[str] = None     # If given, messages are saved to this session


@router.post("/ask")
async def ask_tutor(
    request: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Send a message to the personalized Socratic Tutor.

    - **Requires authentication** — response is personalized to the logged-in user's profile.
    - If `session_id` is provided, the exchange is saved to that session.
    """
    # 1. Get this student's cognitive profile
    profile = await Profile.find_one(Profile.user.id == current_user.id)
    if not profile:
        raise HTTPException(
            status_code=400,
            detail="Profile not found. Please complete onboarding first."
        )

    if not profile.onboarding_completed:
        raise HTTPException(
            status_code=400,
            detail="Please complete onboarding before using the tutor."
        )

    # 2. Resolve session if provided
    session = None
    if request.session_id:
        from beanie import PydanticObjectId
        try:
            obj_id = PydanticObjectId(request.session_id)
            session = await Session.get(obj_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid session_id format")

        if not session:
            raise HTTPException(status_code=404, detail="Session not found")

        if session.user.id != current_user.id:
            raise HTTPException(status_code=403, detail="Not your session")

        if session.status != SessionStatus.ACTIVE:
            raise HTTPException(status_code=400, detail="This session is no longer active")

    # 3. Get Socratic response
    reply = await TutorService.get_response(
        problem_slug=request.problem_slug,
        chat_history=request.history,
        user_question=request.user_message,
        profile=profile,
        session=session
    )

    return {
        "reply": reply,
        "session_id": request.session_id
    }