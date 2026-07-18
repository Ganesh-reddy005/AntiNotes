"""
Lilly AI Companion — Request/Response Schemas

Covers all Lilly interaction surfaces:
- Onboarding chat (conversational interview replacing static MCQs)
- Dashboard nudge (contextual motivation)
- Roadmap chat (topic-specific guidance)
- Revision chat (spaced-repetition coaching)
"""

from pydantic import BaseModel
from typing import List, Dict, Optional


# ─── Shared Message Format ───────────────────────────────────────────

class ChatMessage(BaseModel):
    """Single message in a conversation history."""
    role: str       # "user" or "assistant"
    content: str


# ─── Onboarding ──────────────────────────────────────────────────────

class ExtractedProfile(BaseModel):
    """Profile data extracted by Lilly after the onboarding interview."""
    skill_level: str                    # "beginner", "intermediate", "advanced"
    primary_language: str               # "python", "cpp", "java", "javascript"
    goal: str                           # "get_job", "faang", "startup", "learn_for_fun"
    background: Optional[str] = None    # "CS grad", "Bootcamp", "Self-taught"
    preferred_explanation_style: str     # "socratic", "friendly", "ruthless"
    additional_context: Optional[str] = None


class LillyOnboardingRequest(BaseModel):
    """Incoming message for the onboarding chat."""
    user_message: str
    history: List[ChatMessage] = []


class LillyOnboardingResponse(BaseModel):
    """Lilly's reply during onboarding — includes completion flag and extracted profile."""
    reply: str
    is_complete: bool
    extracted_profile: Optional[ExtractedProfile] = None


# ─── Dashboard Nudge ─────────────────────────────────────────────────

class LillyNudgeResponse(BaseModel):
    """Contextual nudge shown on the user's dashboard."""
    message: str
    recommendation_title: str
    action_type: str        # "start_problem", "continue_session", "revision", etc.
    action_label: str       # Button text, e.g. "Let's go!"
    action_link: str        # Frontend route, e.g. "/problems/two-sum"


# ─── Roadmap Chat ────────────────────────────────────────────────────

class LillyRoadmapRequest(BaseModel):
    """Message for topic-specific roadmap guidance."""
    user_message: str
    history: List[ChatMessage] = []
    topic_slug: str


# ─── Revision Chat ───────────────────────────────────────────────────

class LillyRevisionRequest(BaseModel):
    """Message for spaced-repetition revision coaching."""
    user_message: str
    history: List[ChatMessage] = []
    topic: str


# ─── Generic Chat Response (for roadmap / revision stubs) ────────────

class LillyChatResponse(BaseModel):
    """Simple reply wrapper used by roadmap and revision endpoints."""
    reply: str


# ─── Roadmap Topic Chat (Streaming) ──────────────────────────────────

class LillyTopicChatRequest(BaseModel):
    """Request for Lilly's in-topic roadmap chat (streaming)."""
    user_message: str
    history: List[ChatMessage] = []
    topic_title: str
    topic_description: str = ""


# ─── Personalization Chat (Streaming) ────────────────────────────────

class LillyPersonalAction(BaseModel):
    """A single profile mutation Lilly wants to apply."""
    type: str   # set_skill_level, set_goal, set_preferred_explanation_style,
                # set_primary_language, set_background, add_context,
                # set_recommended_tags, invalidate_nudge
    value: object = None  # str | List[str] | None


class LillyPersonalRequest(BaseModel):
    """Incoming message for the personalization chat."""
    user_message: str
    history: List[ChatMessage] = []
    conversation_id: Optional[str] = None  # resume an existing session


class LillyPersonalResponse(BaseModel):
    """Lilly's reply + any profile actions applied this turn."""
    reply: str
    actions: List[LillyPersonalAction] = []
    conversation_id: str
    profile_updated: bool = False
