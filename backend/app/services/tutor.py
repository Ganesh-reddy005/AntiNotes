"""
Tutor Service - Socratic Teaching
Uses fast, cheap model (GPT-4o-mini) for conversational hints.
Cost: ~$0.0001 per message
"""

from typing import List, Dict
from openai import AsyncOpenAI
from app.core.config import settings
from app.models.problem import Problem

# Initialize Tutor AI client (GPT-4o-mini or similar)
tutor_client = AsyncOpenAI(
    api_key=settings.TUTOR_API_KEY,
    base_url=settings.TUTOR_BASE_URL if settings.TUTOR_BASE_URL else None
)

SOCRATIC_SYSTEM_PROMPT = """You're a Socratic tutor on Antinotes.

Student: Level {skill_level} | Knows: {known_concepts}

Rules:
1. Never give code/solutions
2. If they ask for code, ask WHY instead
3. Keep responses SHORT (2-3 sentences)
4. Don't mention concepts they don't know
5. Use Socratic method

Problem: {title}
{description}
"""

class TutorService:
    @staticmethod
    async def get_response(problem_slug: str, chat_history: List[Dict[str, str]], user_question: str) -> str:
        
        # Fetch problem
        from app.models.problem import Problem
        problem = await Problem.find_one(Problem.slug == problem_slug)
        if not problem:
            return "Problem not found."

        # Fetch user profile for context
        from app.models.user import User
        from app.models.profile import Profile
        
        test_user = await User.find_one(User.email == "test@antinotes.com")
        profile = None
        if test_user:
            profile = await Profile.find_one(Profile.user == test_user)
        
        # Build context from profile (cost-optimized)
        skill_level = profile.skill_level if profile else "beginner"
        known_concepts = ", ".join(profile.known_concepts[:5]) if profile and profile.known_concepts else "basic coding"
        
        # Construct prompt
        system_instruction = SOCRATIC_SYSTEM_PROMPT.format(
            skill_level=skill_level,
            known_concepts=known_concepts,
            title=problem.title,
            description=problem.description[:200]  # Limit to save tokens
        )

        messages = [{"role": "system", "content": system_instruction}]
        messages.extend(chat_history[-4:])  # Only last 4 messages (cost control)
        messages.append({"role": "user", "content": user_question})

        try:
            response = await tutor_client.chat.completions.create(
                model=settings.TUTOR_MODEL,  # GPT-4o-mini
                messages=messages,
                temperature=0.3,
                max_tokens=300  # Good balance for explanations
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Tutor Error: {e}")
            return "I'm having trouble right now. Try rephrasing your question."