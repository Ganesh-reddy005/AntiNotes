"""
Lilly Endpoint — AI Companion Routes

Phase 1: Onboarding chat (conversational interview)
Phase 2+: Dashboard nudge, roadmap chat, revision chat (stubs)
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import StreamingResponse
from bson import ObjectId

from app.schemas.lilly import (
    LillyOnboardingRequest,
    LillyOnboardingResponse,
    ExtractedProfile,
    LillyNudgeResponse,
    LillyRoadmapRequest,
    LillyRevisionRequest,
    LillyChatResponse,
    LillyTopicChatRequest,
    LillyPersonalRequest,
)
from app.services.lilly import LillyService
from app.models.user import User
from app.models.profile import Profile
from app.core.dependencies import get_current_user

router = APIRouter()


# ─── Phase 1: Onboarding Chat ───────────────────────────────────────

@router.post("/onboarding/chat", response_model=LillyOnboardingResponse)
async def lilly_onboarding_chat(
    request: LillyOnboardingRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Conversational onboarding with Lilly.

    - Requires authentication.
    - Lilly conducts a 4-5 exchange interview to build the user's profile.
    - When is_complete is True, the profile is created/updated automatically.
    """
    # 1. Convert history to plain dicts for the service
    history = [{"role": msg.role, "content": msg.content} for msg in request.history]

    # 2. Get Lilly's response
    result = await LillyService.onboarding_chat(
        user=current_user,
        user_message=request.user_message,
        history=history,
    )

    # 3. If interview complete — create/update Profile (mirrors onboarding.py)
    extracted_profile = None
    if result["is_complete"] and result.get("extracted_data"):
        data = result["extracted_data"]

        # Find or create profile using raw ObjectId query (Beanie Link fix)
        profile = await Profile.find_one({"user.$id": ObjectId(str(current_user.id))})
        if not profile:
            profile = Profile(user=current_user)

        # Core calibration
        profile.skill_level = data.get("skill_level", "beginner")
        profile.primary_language = data.get("primary_language", "python")
        profile.preferred_explanation_style = data.get("preferred_explanation_style", "socratic")

        # Goal and context
        profile.goal = data.get("goal", "get_job")
        profile.background = data.get("background")
        profile.additional_context = data.get("additional_context")

        # Lilly-specific fields
        profile.onboarding_summary = result["reply"]

        # Onboarding complete
        profile.onboarding_completed = True

        # Initialize known_concepts as empty (they grow based on submissions)
        if not profile.known_concepts:
            profile.known_concepts = []

        # Save (insert if new, update if existing)
        if profile.id:
            await profile.save()
        else:
            await profile.insert()

        # Build response model
        extracted_profile = ExtractedProfile(
            skill_level=data.get("skill_level", "beginner"),
            primary_language=data.get("primary_language", "python"),
            goal=data.get("goal", "get_job"),
            background=data.get("background"),
            preferred_explanation_style=data.get("preferred_explanation_style", "socratic"),
            additional_context=data.get("additional_context"),
        )

    return LillyOnboardingResponse(
        reply=result["reply"],
        is_complete=result["is_complete"],
        extracted_profile=extracted_profile,
    )


# ─── Phase 2 Stubs ──────────────────────────────────────────────────

@router.get("/dashboard/nudge", response_model=LillyNudgeResponse)
async def lilly_dashboard_nudge(
    current_user: User = Depends(get_current_user),
):
    """
    Contextual nudge for the dashboard.
    [Phase 2] Analyzes user's activity and generates personalized nudges.
    """
    from app.models.learning_memory import LearningMemory
    from datetime import datetime, timezone, timedelta
    
    profile = await Profile.find_one({"user.$id": ObjectId(str(current_user.id))})
    memory = await LearningMemory.find({"user.$id": ObjectId(str(current_user.id))}).sort(-LearningMemory.created_at).limit(1).first_or_none()
    
    # Check cache so we don't hit the LLM on every page refresh
    if profile and profile.lilly_last_nudge and profile.lilly_nudge_date:
        now_utc = datetime.now(timezone.utc)
        nudge_date_utc = profile.lilly_nudge_date.replace(tzinfo=timezone.utc) if profile.lilly_nudge_date.tzinfo is None else profile.lilly_nudge_date
        
        # Check if a new learning memory (milestone) was created since the last nudge
        has_new_memory = False
        if memory and memory.created_at:
            memory_date_utc = memory.created_at.replace(tzinfo=timezone.utc) if memory.created_at.tzinfo is None else memory.created_at
            if memory_date_utc > nudge_date_utc:
                has_new_memory = True
        
        # Use cache if under 12 hours AND no new milestone has been reached
        if not has_new_memory and (now_utc - nudge_date_utc < timedelta(hours=12)):
            return LillyNudgeResponse(
                message=profile.lilly_last_nudge,
                recommendation_title=getattr(profile, "lilly_recommendation_title", None) or f"Recommended for {profile.skill_level}s",
                action_type="start_problem",
                action_label="Let's go!",
                action_link="/problems",
            )

    result = await LillyService.dashboard_nudge(
        user=current_user,
        profile=profile,
        memory=memory
    )
    
    # Save the nudge to cache it — but NEVER overwrite a good cached nudge
    # with a fallback (e.g. if the LLM call failed). Only cache real results.
    if profile and not result.get("is_fallback"):
        profile.lilly_last_nudge = result["message"]
        profile.lilly_recommendation_title = result["recommendation_title"]
        profile.lilly_recommended_tags = result.get("recommended_tags", [])
        profile.lilly_nudge_date = datetime.now(timezone.utc)
        await profile.save()

    return LillyNudgeResponse(
        message=result["message"],
        recommendation_title=result["recommendation_title"],
        action_type="start_problem",
        action_label="Let's go!",
        action_link="/problems",
    )


@router.post("/roadmap/chat")
async def lilly_roadmap_chat(
    request: LillyTopicChatRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Streaming Lilly response for a roadmap topic page.
    Returns text/event-stream chunks.
    """
    profile = await Profile.find_one({"user.$id": ObjectId(str(current_user.id))})

    import json as _json
    async def event_stream():
        async for token in LillyService.topic_chat_stream(
            user=current_user,
            profile=profile,
            topic_title=request.topic_title,
            topic_description=request.topic_description,
            user_message=request.user_message,
            history=[{"role": m.role, "content": m.content} for m in request.history],
        ):
            # JSON-encode token so newlines don't break SSE event boundaries
            yield f"data: {_json.dumps(token)}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@router.post("/revision/chat", response_model=LillyChatResponse)
async def lilly_revision_chat(
    request: LillyRevisionRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Revision coaching from Lilly.
    [Phase 2] Will guide spaced-repetition review sessions.
    """
    return LillyChatResponse(
        reply=f"Revision mode for {request.topic} is coming soon — I'll make sure you never forget what you've learned!"
    )


# ─── Personalization Chat (Streaming) ────────────────────────────────

@router.post("/personal/chat")
async def lilly_personal_chat(
    request: LillyPersonalRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Conversational personalization engine.
    Lilly reads the user's profile + past chat summary, streams a reply,
    and applies any profile mutations (difficulty, goals, tags, etc.).
    Returns text/event-stream chunks.
    """
    import json as _json

    async def event_stream():
        conversation_id = request.conversation_id
        async for event in LillyService.personal_chat(
            user=current_user,
            user_message=request.user_message,
            history=[{"role": m.role, "content": m.content} for m in request.history],
            conversation_id=conversation_id,
        ):
            if event["type"] == "token":
                # JSON-encode token so newlines don't break SSE boundaries
                yield f"data: {_json.dumps({'type': 'token', 'content': event['content']})}\n\n"
            elif event["type"] == "done":
                yield f"data: {_json.dumps({'type': 'done', 'reply': event['reply'], 'actions': event['actions'], 'conversation_id': event['conversation_id'], 'profile_updated': event['profile_updated'], 'invalidate_nudge': event.get('invalidate_nudge', False)})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")
