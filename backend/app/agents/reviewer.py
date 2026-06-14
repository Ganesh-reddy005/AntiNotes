import json
from typing import Optional, List
from openai import AsyncOpenAI
from app.core.config import settings
from app.models.problem import Problem
from app.models.submission import Submission
from app.models.profile import Profile
from app.models.learning_memory import LearningMemory
from app.models.ai_log import AILog
from app.schemas.review import ReviewOutput
import time

from pathlib import Path

# Initialize Client
review_client = AsyncOpenAI(
    api_key=settings.REVIEW_API_KEY,
    base_url=settings.REVIEW_BASE_URL
)

# Load Prompt Template
BASE_DIR = Path(__file__).resolve().parent
PROMPT_PATH = BASE_DIR / "prompts" / "reviewer_v1.md"
with open(PROMPT_PATH, "r") as f:
    REVIEWER_PROMPT_TEMPLATE = f.read()

class ReviewerAgent:
    """
    The Intelligence Layer. 
    Connects User Profile + Problem Context -> Personalized Review.
    """

    @staticmethod
    def _get_style_instructions(style: str) -> str:
        """Maps user preference to prompt engineering instructions."""
        styles = {
            "socratic": (
                "ACT SOCRATICALLY. Do not give the answer. "
                "Ask one guiding question that leads them to the bug. "
                "Focus on the 'Why', not the 'How'."
            ),
            "ruthless": (
                "ACT RUTHLESSLY. Treat this like a kernel code review. "
                "Nitpick on variable names, memory usage, and style. "
                "If the logic is O(N^2), roast them."
            ),
            "friendly": (
                "ACT SUPPORTIVELY. Use emojis. "
                "Highlight what they did right first. "
                "Gently suggest improvements using analogies."
            )
        }
        return styles.get(style, styles["socratic"])

    @staticmethod
    def _get_goal_instructions(goal: str) -> str:
        """Maps user goal to review strictness."""
        goals = {
            "faang": "Standard: Google/Meta Interview. Fail them for poor variable naming or suboptimal Big-O.",
            "get_job": "Standard: Junior Dev Interview. Focus on correctness and clean code.",
            "learn_for_fun": "Standard: Casual. Focus on making it work and having fun."
        }
        return goals.get(goal, goals["get_job"])

    @staticmethod
    async def analyze_submission(
        submission: Submission,
        problem: Problem,
        user_profile: Profile,
        memory: Optional[LearningMemory] = None
    ) -> ReviewOutput:
        
        # 1. Extract Profile Context
        # Default to "socratic" if missing
        style = user_profile.preferred_explanation_style or "socratic"
        goal = user_profile.goal or "get_job"
        
        # 1.5 Extract Memory Context
        memory_context = "No long-term memory records yet."
        if memory:
            memory_context = (
                f"Progress Summary: {memory.summary}\n"
                f"Key Breakthroughs: {', '.join(memory.key_breakthroughs)}\n"
                f"Persistent Struggles: {', '.join(memory.persistent_struggles)}"
            )

        # 2. Extract Deep Context (Lists)
        # We slice lists to prevent token overflow (Money Saving)
        known = user_profile.known_concepts[-10:] if user_profile.known_concepts else ["basics"]
        weaknesses = user_profile.weaknesses[-5:] if user_profile.weaknesses else ["none"]
        mistakes = user_profile.common_mistakes[-3:] if user_profile.common_mistakes else ["none"]

        # 3. Format Test Results
        # Minimizing tokens: "Pass: 3, Fail: 2" is cheaper than a full error log.
        test_summary = "Tests Passed" if submission.is_correct else "Tests Failed"
        if submission.test_results:
             # Just send the first failure to save tokens
            failures = [v for k, v in submission.test_results.items() if "fail" in str(v).lower()]
            if failures:
                test_summary += f" | Failure Sample: {str(failures[0])[:100]}"

        # 4. Construct the Prompt
        # This maps the Python variables to the {curly_braces} in your Markdown file
        prompt = REVIEWER_PROMPT_TEMPLATE.format(
            skill_level=user_profile.skill_level,
            language=user_profile.primary_language,
            background=user_profile.background or "Self-taught",
            goal=goal,
            goal_instruction=ReviewerAgent._get_goal_instructions(goal),
            additional_context=user_profile.additional_context or "None",
            thinking_style=user_profile.thinking_style or "Unknown",
            known_concepts=", ".join(known),
            recent_weaknesses=", ".join(weaknesses),
            common_mistakes=", ".join(mistakes),
            memory_context=memory_context,
            problem_title=problem.title,
            test_results=test_summary,
            code=submission.code[:3000],  # Limit to 3000 chars to save tokens
            style_instruction=ReviewerAgent._get_style_instructions(style)
        )

        try:
            start_time = time.time()
            # 5. Call LLM
            response = await review_client.chat.completions.create(
                model=settings.REVIEW_MODEL,
                messages=[
                    {"role": "system", "content":"""
                You are a strict JSON-only API. Your entire response must be a single valid JSON object.
                Do not include any explanations, markdown, code blocks, or extra text outside the JSON.
                Follow the exact schema provided in the user prompt."""},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2, # Low temp for consistent JSON
                max_tokens=3000,
                response_format={"type": "json_object"}
            )
            latency = (time.time() - start_time) * 1000

            # 6. Parse Response
            content = response.choices[0].message.content
            review_data = json.loads(content)
            
            # 6.5 Beta Logging
            ai_log = AILog(
                user=user_profile.user,
                agent_name="reviewer",
                model=settings.REVIEW_MODEL,
                prompt=prompt[:5000], # Reviewer prompts can be long, but let's log them
                response=content,
                context_data={"problem_title": problem.title, "submission_id": str(submission.id)},
                tokens_used=response.usage.total_tokens if response.usage else 0,
                latency_ms=latency
            )
            await ai_log.insert()

            # 7. Return Validated Pydantic Object
            return ReviewOutput(**review_data)

        except Exception as e:
            print(f"Reviewer Error: {e}")
            # Fail gracefully so the UI doesn't crash
            return ReviewOutput(
                score=0,
                strengths=[],
                weaknesses=["AI Service Unavailable"],
                thinking_style="unknown",
                concept_gaps=[],
                topics_to_revise=[],
                detailed_feedback="We couldn't analyze this submission right now."
            )