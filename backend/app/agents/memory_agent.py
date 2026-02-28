"""
LearningMemoryAgent — Background Intelligence

Runs after every N reviews to generate long-term learning summaries.
This is the "Background Agent" from the PRD:
  > Summarize multiple reviews, update profile trends, generate learning insights.

Cost: 1 LLM call per batch (~5-10 reviews). Runs asynchronously.
"""

import json
from datetime import datetime
from typing import List, Optional
from openai import AsyncOpenAI

from app.core.config import settings
from app.models.profile import Profile
from app.models.review import Review
from app.models.learning_memory import LearningMemory
from app.agents.profile_agent import ProfileAgent

# Initialize summary LLM client (cheapest model for background work)
summary_client = AsyncOpenAI(
    api_key=settings.SUMMARY_API_KEY,
    base_url=settings.SUMMARY_BASE_URL if settings.SUMMARY_BASE_URL else None
)

# Load versioned prompt
PROMPT_PATH = "app/agents/prompts/memory_v1.md"
with open(PROMPT_PATH, "r") as f:
    MEMORY_PROMPT_TEMPLATE = f.read()

# How many reviews to trigger a memory generation
MEMORY_TRIGGER_EVERY = 5


class LearningMemoryAgent:
    """
    Generates long-term learning memory from a batch of reviews.
    Triggered automatically every N reviews via background tasks.
    """

    @staticmethod
    def _format_reviews_for_prompt(reviews: List[Review]) -> str:
        """Format reviews into a compact string for the prompt."""
        lines = []
        for i, r in enumerate(reviews, 1):
            line = (
                f"Review {i}: Score={r.score}/100 | "
                f"Strengths={', '.join(r.strengths[:2])} | "
                f"Weaknesses={', '.join(r.weaknesses[:2])} | "
                f"Gaps={', '.join(r.concept_gaps[:2])} | "
                f"Style={r.thinking_style}"
            )
            lines.append(line)
        return "\n".join(lines)

    @staticmethod
    async def generate_and_store(
        profile: Profile,
        recent_reviews: List[Review]
    ) -> Optional[LearningMemory]:
        """
        Analyze recent reviews and store a learning memory record.
        Also updates the Profile's long-term patterns via ProfileAgent.

        Returns the saved LearningMemory or None on error.
        """
        if len(recent_reviews) < 2:
            return None  # Not enough data

        # 1. Update Profile patterns first (pure logic, free)
        await ProfileAgent.batch_update_profile(profile, recent_reviews)

        # 2. Format reviews for LLM
        reviews_summary = LearningMemoryAgent._format_reviews_for_prompt(recent_reviews)
        num_reviews = len(recent_reviews)

        # 3. Build prompt
        prompt = MEMORY_PROMPT_TEMPLATE.format(
            skill_level=profile.skill_level,
            primary_language=profile.primary_language,
            goal=profile.goal or "get_job",
            background=profile.background or "Not specified",
            reviews_summary=reviews_summary,
            num_reviews=num_reviews
        )

        try:
            # 4. Call LLM
            response = await summary_client.chat.completions.create(
                model=settings.SUMMARY_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a strict JSON-only API. Output only a single valid JSON object."
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                max_tokens=600,
                response_format={"type": "json_object"}
            )

            content = response.choices[0].message.content
            data = json.loads(content)

            # 5. Generate a timeframe key for this batch
            now = datetime.now()
            timeframe = f"batch_{now.strftime('%Y_%m_%d_%H%M')}"

            # 6. Save LearningMemory
            memory = LearningMemory(
                user=profile.user,
                summary=data.get("summary", "Progress recorded."),
                timeframe=timeframe,
                topics_covered=data.get("topics_covered", []),
                progress_trend=data.get("progress_trend", "stagnant"),
                key_breakthroughs=data.get("key_breakthroughs", []),
                persistent_struggles=data.get("persistent_struggles", []),
                num_reviews_analyzed=num_reviews
            )
            await memory.insert()

            print(f"[LearningMemoryAgent] Memory stored for user {profile.user.ref.id} | {timeframe}")
            return memory

        except Exception as e:
            print(f"[LearningMemoryAgent Error] {e}")
            return None

    @staticmethod
    def should_trigger(total_reviews: int) -> bool:
        """Returns True when a memory generation should be triggered."""
        return total_reviews > 0 and total_reviews % MEMORY_TRIGGER_EVERY == 0
