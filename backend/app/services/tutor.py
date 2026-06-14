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
from app.models.learning_memory import LearningMemory
from app.models.ai_log import AILog
from datetime import datetime
import time

from pathlib import Path

# Load client
tutor_client = AsyncOpenAI(
    api_key=settings.TUTOR_API_KEY,
    base_url=settings.TUTOR_BASE_URL if settings.TUTOR_BASE_URL else None
)

# Load versioned prompt (hot-reloadable on file change, not on startup)
BASE_DIR = Path(__file__).resolve().parent.parent
PROMPT_PATH = BASE_DIR / "agents" / "prompts" / "tutor_v1.md"
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

        # 1.5 Fetch latest learning memory for deeper context
        memory = await LearningMemory.find(
            LearningMemory.user.id == profile.user.ref.id
        ).sort("-created_at").first_or_none()
        
        memory_context = "No long-term memory records yet."
        if memory:
            memory_context = (
                f"Progress Summary: {memory.summary}\n"
                f"Key Breakthroughs: {', '.join(memory.key_breakthroughs)}\n"
                f"Persistent Struggles: {', '.join(memory.persistent_struggles)}"
            )

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
            memory_context=memory_context,
            problem_title=problem.title,
            problem_description=problem.description[:500]  # Token limit
        )

        # 4. Build message list (last 6 messages for context, cost control)
        messages = [{"role": "system", "content": system_instruction}]
        messages.extend(chat_history[-6:])
        messages.append({"role": "user", "content": user_question})

        try:
            start_time = time.time()
            # 5. Call LLM
            response = await tutor_client.chat.completions.create(
                model=settings.TUTOR_MODEL,
                messages=messages,
                temperature=0.4,    # Slightly creative but consistent
                max_tokens=500      # Increased slightly for safety
            )
            latency = (time.time() - start_time) * 1000
            
            # Handle standard content vs reasoning content (some models)
            message = response.choices[0].message
            reply = getattr(message, "content", None)
            
            # Fallback for models that might put reasoning in a different field
            if reply is None and hasattr(message, "reasoning_content"):
                reply = message.reasoning_content
            
            if reply is None:
                print(f"[TutorService Warning] Received null content from model: {settings.TUTOR_MODEL}")
                reply = "I'm thinking... could you say that again? I missed the last part."

            # 5.5 Beta Logging
            ai_log = AILog(
                user=profile.user,
                agent_name="tutor",
                model=settings.TUTOR_MODEL,
                prompt=messages[-1]["content"],
                response=reply,
                context_data={"problem_slug": problem_slug, "history_len": len(chat_history)},
                tokens_used=response.usage.total_tokens if response.usage else 0,
                latency_ms=latency
            )
            await ai_log.insert()

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