"""
Tutor Service — Personalized Socratic Teaching

Loads the versioned prompt from tutor_v1.md.
Accepts the authenticated user's Profile for deep personalization.
Persists conversation to the Session document when session_id is given.
Cost: ~$0.0001/message (GPT-4o-mini class models)
"""

from typing import List, Dict, Optional
from openai import AsyncOpenAI
from app.core.config import settings
from app.models.problem import Problem
from app.models.profile import Profile
from app.models.session import Session, Message, Role, MessageType
from datetime import datetime

# Load client
tutor_client = AsyncOpenAI(
    api_key=settings.TUTOR_API_KEY,
    base_url=settings.TUTOR_BASE_URL if settings.TUTOR_BASE_URL else None
)

# Load versioned prompt (hot-reloadable on file change, not on startup)
PROMPT_PATH = "app/agents/prompts/tutor_v1.md"
with open(PROMPT_PATH, "r") as f:
    TUTOR_PROMPT_TEMPLATE = f.read()


def _get_teaching_style_instruction(style: str) -> str:
    """Maps teaching_style preference to a concrete instruction for the LLM."""
    styles = {
        "socratic": (
            "Use pure Socratic method. Never give answers. "
            "Ask one probing question that makes them think about what they already know."
        ),
        "friendly": (
            "Be warm and encouraging. Celebrate small wins. "
            "Use analogies from real life. Still guide with questions, not answers."
        ),
        "ruthless": (
            "Be demanding. Don't accept vague answers. "
            "Point out when their reasoning is sloppy. Push them to be precise."
        ),
    }
    return styles.get(style, styles["socratic"])


class TutorService:

    @staticmethod
    async def get_response(
        problem_slug: str,
        chat_history: List[Dict[str, str]],
        user_question: str,
        profile: Profile,
        session: Optional[Session] = None
    ) -> str:
        """
        Generate a Socratic tutor response personalized to this specific student.

        Args:
            problem_slug: The problem being worked on
            chat_history: Previous messages in this conversation
            user_question: The student's latest message
            profile: The authenticated student's cognitive profile
            session: If provided, save the exchange to this session
        """
        # 1. Fetch problem
        problem = await Problem.find_one(Problem.slug == problem_slug)
        if not problem:
            return "I can't find that problem. Try refreshing the page."

        # 2. Extract profile context (token-optimized slices)
        skill_level = profile.skill_level
        primary_language = profile.primary_language
        background = profile.background or "Not specified"
        goal = profile.goal or "get_job"
        known_concepts = ", ".join(profile.known_concepts[-8:]) if profile.known_concepts else "basic coding"
        recent_weaknesses = ", ".join(profile.weaknesses[-5:]) if profile.weaknesses else "none identified yet"
        common_mistakes = ", ".join(profile.common_mistakes[-3:]) if profile.common_mistakes else "none identified yet"
        thinking_style = profile.thinking_style or "unknown"
        additional_context = profile.additional_context or "None"
        teaching_style_instruction = _get_teaching_style_instruction(
            profile.preferred_explanation_style or "socratic"
        )

        # 3. Build system prompt from versioned template
        system_instruction = TUTOR_PROMPT_TEMPLATE.format(
            skill_level=skill_level,
            primary_language=primary_language,
            background=background,
            goal=goal,
            known_concepts=known_concepts,
            recent_weaknesses=recent_weaknesses,
            common_mistakes=common_mistakes,
            thinking_style=thinking_style,
            teaching_style_instruction=teaching_style_instruction,
            additional_context=additional_context,
            problem_title=problem.title,
            problem_description=problem.description[:500]  # Token limit
        )

        # 4. Build message list (last 6 messages for context, cost control)
        messages = [{"role": "system", "content": system_instruction}]
        messages.extend(chat_history[-6:])
        messages.append({"role": "user", "content": user_question})

        try:
            # 5. Call LLM
            response = await tutor_client.chat.completions.create(
                model=settings.TUTOR_MODEL,
                messages=messages,
                temperature=0.4,    # Slightly creative but consistent
                max_tokens=350      # Keep responses concise
            )
            reply = response.choices[0].message.content

            # 6. Persist to session if given
            if session:
                user_msg = Message(
                    role=Role.USER,
                    content=user_question,
                    type=MessageType.CHAT
                )
                assistant_msg = Message(
                    role=Role.ASSISTANT,
                    content=reply,
                    type=MessageType.HINT
                )
                session.messages.extend([user_msg, assistant_msg])
                session.updated_at = datetime.now()
                await session.save()

            return reply

        except Exception as e:
            print(f"[TutorService Error] {e}")
            return "I'm having a moment. Try again — what were you working on?"