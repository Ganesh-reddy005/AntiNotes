"""
Lilly Service — Conversational AI Companion

Mirrors the TutorService pattern:
- Loads versioned prompt from lilly_onboarding_v1.md
- Uses AsyncOpenAI with TUTOR_API_KEY / TUTOR_BASE_URL (same model class)
- Logs every interaction to AILog for quality monitoring
- Returns structured JSON (reply, is_complete, extracted_data)
"""

import json
import time
import re
import uuid
from typing import List, Dict, AsyncGenerator, Tuple
from openai import AsyncOpenAI
from pathlib import Path

from app.core.config import settings
from app.models.ai_log import AILog
from app.models.profile import Profile
from app.models.lilly_conversation import ConversationMessage, LillyConversation
from app.models.lilly_log import LillyLog


# ─── Client (reuses tutor credentials — same model tier) ─────────────

lilly_client = AsyncOpenAI(
    api_key=settings.TUTOR_API_KEY,
    base_url=settings.TUTOR_BASE_URL if settings.TUTOR_BASE_URL else None
)

# ─── Load versioned prompt ───────────────────────────────────────────

BASE_DIR = Path(__file__).resolve().parent.parent
PROMPT_PATH = BASE_DIR / "agents" / "prompts" / "lilly_onboarding_v1.md"
with open(PROMPT_PATH, "r") as f:
    LILLY_ONBOARDING_PROMPT = f.read()

NUDGE_PROMPT_PATH = BASE_DIR / "agents" / "prompts" / "lilly_nudge_v1.md"
with open(NUDGE_PROMPT_PATH, "r") as f:
    LILLY_NUDGE_PROMPT = f.read()

TOPIC_PROMPT_PATH = BASE_DIR / "agents" / "prompts" / "lilly_topic_v1.md"
with open(TOPIC_PROMPT_PATH, "r") as f:
    LILLY_TOPIC_PROMPT = f.read()

PERSONAL_PROMPT_PATH = BASE_DIR / "agents" / "prompts" / "lilly_personal_v1.md"
with open(PERSONAL_PROMPT_PATH, "r") as f:
    LILLY_PERSONAL_PROMPT = f.read()

# After this many messages in a session, we summarize and start fresh
PERSONAL_SESSION_MSG_LIMIT = 20


class LillyService:

    @staticmethod
    async def onboarding_chat(
        user,
        user_message: str,
        history: List[Dict[str, str]]
    ) -> dict:
        """
        Conduct one exchange of Lilly's onboarding interview.

        Args:
            user: The authenticated User document (has .id, .full_name)
            user_message: The student's latest message
            history: Previous messages [{role, content}, ...]

        Returns:
            dict with keys: reply (str), is_complete (bool), extracted_data (dict|None)
        """
        # 1. Resolve user's first name for prompt personalization
        first_name = "there"
        if user.full_name:
            first_name = user.full_name.split()[0]

        # 2. Build system prompt from versioned template
        system_prompt = LILLY_ONBOARDING_PROMPT.replace("{user_name}", first_name)

        # 3. Build message list (keep last 10 — onboarding is short)
        messages = [{"role": "system", "content": system_prompt}]
        messages.extend(history[-10:])
        messages.append({"role": "user", "content": user_message})

        try:
            start_time = time.time()

            # 4. Call LLM with JSON mode
            response = await lilly_client.chat.completions.create(
                model=settings.TUTOR_MODEL,
                messages=messages,
                temperature=0.6,
                max_tokens=500,
                response_format={"type": "json_object"}
            )
            latency = (time.time() - start_time) * 1000

            # 5. Parse response
            message = response.choices[0].message
            content = getattr(message, "content", None)

            # Fallback for reasoning models
            if content is None and hasattr(message, "reasoning_content"):
                content = message.reasoning_content

            if content is None:
                print(f"[LillyService Warning] Received null content from model: {settings.TUTOR_MODEL}")
                return {
                    "reply": "Hey, I lost my train of thought for a sec — could you say that again?",
                    "is_complete": False,
                    "extracted_data": None
                }

            # Remove <think>...</think> blocks if present (DeepSeek models)
            cleaned_content = re.sub(r"<think>.*?</think>", "", content, flags=re.DOTALL)

            # Use regex to extract the first JSON object in case there's conversational text
            match = re.search(r"\{.*\}", cleaned_content, re.DOTALL)
            if not match:
                print(f"[LillyService JSON Fallback] Model output plain text instead of JSON. Recovering gracefully...")
                return {
                    "reply": content.strip(),
                    "is_complete": False,
                    "extracted_data": None
                }
            
            final_json_string = match.group(0)
            parsed = json.loads(final_json_string)

            # 6. Log to AILog (same pattern as TutorService)
            ai_log = AILog(
                user=user,
                agent_name="lilly_onboarding",
                model=settings.TUTOR_MODEL,
                prompt=messages[-1]["content"],
                response=content,
                context_data={"history_len": len(history)},
                tokens_used=response.usage.total_tokens if response.usage else 0,
                latency_ms=latency
            )
            await ai_log.insert()

            # 7. Return structured response
            return {
                "reply": parsed.get("reply", ""),
                "is_complete": parsed.get("is_complete", False),
                "extracted_data": parsed.get("extracted_data", None)
            }

        except json.JSONDecodeError as e:
            print(f"[LillyService JSON Error] Failed to parse extracted JSON. Error: {e}")
            try:
                print(f"[LillyService JSON Error] Extracted string was: {final_json_string}")
            except Exception:
                pass
            return {
                "reply": "Hmm, I got a little confused there. Could you tell me that again?",
                "is_complete": False,
                "extracted_data": None
            }

        except Exception as e:
            print(f"[LillyService Error] {e}")
            return {
                "reply": "I'm having a moment — try sending that again?",
                "is_complete": False,
                "extracted_data": None
            }

    @staticmethod
    async def topic_chat_stream(
        user,
        profile,
        topic_title: str,
        topic_description: str,
        user_message: str,
        history: List[Dict[str, str]]
    ) -> AsyncGenerator[str, None]:
        """
        Streaming response from Lilly for a roadmap topic page.
        Yields text chunks as they arrive from the LLM.
        """
        first_name = "there"
        if user and user.full_name:
            first_name = user.full_name.split()[0]

        system_prompt = LILLY_TOPIC_PROMPT
        system_prompt = system_prompt.replace("{user_name}", first_name)
        system_prompt = system_prompt.replace("{skill_level}", str(getattr(profile, 'skill_level', 'intermediate')))
        system_prompt = system_prompt.replace("{goal}", str(getattr(profile, 'goal', 'learn')))
        system_prompt = system_prompt.replace("{background}", str(getattr(profile, 'background', 'Unknown')))
        system_prompt = system_prompt.replace("{preferred_explanation_style}", str(getattr(profile, 'preferred_explanation_style', 'friendly')))
        system_prompt = system_prompt.replace("{topic_title}", topic_title)
        system_prompt = system_prompt.replace("{topic_description}", topic_description)
        system_prompt = system_prompt.replace("{user_message}", user_message)

        messages = [
            {"role": "system", "content": system_prompt},
            *history,
            {"role": "user", "content": user_message}
        ]

        try:
            stream = await lilly_client.chat.completions.create(
                model=settings.TUTOR_MODEL,
                messages=messages,
                temperature=0.7,
                max_tokens=400,
                stream=True
            )
            full_response = ""
            async for chunk in stream:
                delta = chunk.choices[0].delta
                token = getattr(delta, "content", None)
                if token:
                    full_response += token
                    yield token

            # Fire-and-forget log
            from app.models.lilly_log import LillyLog
            lilly_log = LillyLog(
                user=user,
                lilly_feature="topic_chat",
                model_used=settings.TUTOR_MODEL,
                prompt_context=f"Topic: {topic_title} | User: {user_message}",
                raw_response=full_response,
            )
            await lilly_log.save()

        except Exception as e:
            print(f"[LillyService Topic Stream Error] {e}")
            yield "I'm having a moment — could you try again?"

    @staticmethod
    async def dashboard_nudge(
        user,
        profile,
        memory
    ) -> dict:
        """
        Generate a personalized nudge and recommendation title for the dashboard.
        """
        first_name = "there"
        if user.full_name:
            first_name = user.full_name.split()[0]

        system_prompt = LILLY_NUDGE_PROMPT
        system_prompt = system_prompt.replace("{user_name}", first_name)
        system_prompt = system_prompt.replace("{skill_level}", str(getattr(profile, 'skill_level', 'Unknown')))
        system_prompt = system_prompt.replace("{goal}", str(getattr(profile, 'goal', 'Unknown')))
        system_prompt = system_prompt.replace("{background}", str(getattr(profile, 'background', 'Unknown')))
        system_prompt = system_prompt.replace("{additional_context}", str(getattr(profile, 'additional_context', 'None')))
        system_prompt = system_prompt.replace("{onboarding_summary}", str(getattr(profile, 'onboarding_summary', 'None')))
        system_prompt = system_prompt.replace("{memory_summary}", getattr(memory, 'summary', 'No recent history.') if memory else 'No recent history.')
        messages = [
            {"role": "system", "content": "You are Lilly, an AI coding companion for AntiNotes. Always follow instructions exactly and output only the requested JSON format."},
            {"role": "user", "content": system_prompt}
        ]

        skill_level = getattr(profile, 'skill_level', 'you')
        goal = getattr(profile, 'goal', 'learn')

        try:
            start_time = time.time()
            response = await lilly_client.chat.completions.create(
                model=settings.TUTOR_MODEL,
                messages=messages,
                temperature=0.7,
                max_tokens=250
            )
            latency = (time.time() - start_time) * 1000

            message = response.choices[0].message
            content = getattr(message, "content", None)
            if content is None and hasattr(message, "reasoning_content"):
                content = message.reasoning_content

            if content is None:
                raise ValueError("Null content")

            cleaned_content = re.sub(r"<think>.*?</think>", "", content, flags=re.DOTALL).strip()
            match = re.search(r"\{.*\}", cleaned_content, re.DOTALL)
            if not match:
                print(f"[LillyService Nudge Warning] No JSON found. Raw content: {cleaned_content}")
                parsed = {
                    "message": cleaned_content,
                    "recommendation_title": f"Recommended for {skill_level}",
                    "recommended_tags": []
                }
            else:
                parsed = json.loads(match.group(0))

            # Defensive: the model sometimes returns the message wrapped in yet
            # another JSON string (e.g. message == '{"message": "Great..."}').
            # Unwrap it so the banner never shows raw JSON like `{ "message": ...`.
            msg = parsed.get("message", "Ready for your next challenge?")
            msg = LillyService._unwrap_json_string(msg)

            lilly_log = LillyLog(
                user=user,
                lilly_feature="dashboard_nudge",
                model_used=settings.TUTOR_MODEL,
                prompt_context=system_prompt,
                raw_response=content,
                extracted_json=parsed if match else None,
                tokens_used=getattr(response.usage, "total_tokens", 0) if hasattr(response, "usage") else 0,
                latency_ms=latency
            )
            await lilly_log.save()

            return {
                "message": msg,
                "recommendation_title": parsed.get("recommendation_title", f"Recommended for {skill_level}"),
                "recommended_tags": parsed.get("recommended_tags", []),
                "is_fallback": False,
            }

        except Exception as e:
            print(f"[LillyService Nudge Error] {e}")
            # Profile-aware fallback so the banner never shows a generic string.
            # Build a personalized nudge from the user's known attributes.
            goal_label = {
                "get_job": "land that dev job",
                "ace_interview": "ace your interviews",
                "learn_for_fun": "keep the momentum going",
                "build_project": "build something cool",
            }.get(goal, "keep learning")
            return {
                "message": f"Hey, ready to {goal_label}? Let's tackle a {skill_level}-level problem together.",
                "recommendation_title": f"Recommended for {skill_level}s",
                "recommended_tags": [],
                "is_fallback": True,
            }

    # ─── Helpers for personalization chat ────────────────────────────

    @staticmethod
    def _unwrap_json_string(value: str) -> str:
        """
        Some models return the message field as a JSON-encoded string
        (e.g. '{"message": "Great job!"}' or '{"text": "..."}').
        Detect and unwrap it so the UI never renders raw JSON like
        `{ "message": "Great..."`. Returns the cleaned plain string.
        """
        if not isinstance(value, str):
            return value
        candidate = value.strip()
        # Only attempt if it looks like a JSON object/string wrapper
        if not (candidate.startswith("{") or candidate.startswith('"')):
            return value
        try:
            inner = json.loads(candidate)
            if isinstance(inner, dict):
                # Prefer the most message-like key
                for key in ("message", "text", "content", "reply"):
                    if key in inner and isinstance(inner[key], str):
                        return LillyService._unwrap_json_string(inner[key])
                # Fall back to the first string value
                for v in inner.values():
                    if isinstance(v, str):
                        return LillyService._unwrap_json_string(v)
            elif isinstance(inner, str):
                # Double-encoded string: '{"message": "..."}' -> dict -> str
                return LillyService._unwrap_json_string(inner)
        except (json.JSONDecodeError, TypeError, ValueError):
            pass
        return value

    @staticmethod
    def _parse_actions(raw: str) -> Tuple[str, List[Dict]]:
        """
        Strip the hidden @@ACTIONS@@ ... @@END@@ block from the streamed
        reply and parse it into a list of action dicts.

        Returns (clean_reply, actions).
        """
        actions: List[Dict] = []
        clean = raw

        match = re.search(r"@@ACTIONS@@(.*?)@@END@@", raw, re.DOTALL)
        if match:
            block = match.group(1).strip()
            try:
                parsed = json.loads(block)
                actions = parsed.get("actions", [])
            except Exception as e:
                print(f"[LillyService Personal] Failed to parse actions block: {e}")
            # Remove the block (and any trailing whitespace/newlines) from the visible reply
            clean = raw[: match.start()].rstrip() + raw[match.end():].lstrip()

        return clean.strip(), actions

    @staticmethod
    async def _apply_actions(profile: Profile, actions: List[Dict]) -> Tuple[bool, bool]:
        """
        Apply the parsed profile-mutation actions to the user's Profile.
        Returns (profile_changed, invalidate_nudge).
        """
        changed = False
        invalidate_nudge = False
        for action in actions:
            atype = action.get("type")
            value = action.get("value")
            try:
                if atype == "set_skill_level" and value in ("beginner", "intermediate", "advanced"):
                    profile.skill_level = value
                    changed = True
                elif atype == "set_goal":
                    profile.goal = value
                    changed = True
                elif atype == "set_preferred_explanation_style" and value:
                    profile.preferred_explanation_style = value
                    changed = True
                elif atype == "set_primary_language" and value:
                    profile.primary_language = value
                    changed = True
                elif atype == "set_background":
                    profile.background = value
                    changed = True
                elif atype == "add_context":
                    profile.additional_context = value
                    changed = True
                elif atype == "set_recommended_tags" and isinstance(value, list):
                    profile.lilly_recommended_tags = [str(t) for t in value]
                    changed = True
                elif atype == "invalidate_nudge":
                    # Force the dashboard nudge to regenerate on next load
                    profile.lilly_nudge_date = None
                    invalidate_nudge = True
                    changed = True
            except Exception as e:
                print(f"[LillyService Personal] Error applying action {atype}: {e}")

        if changed:
            await profile.save()
        return changed, invalidate_nudge

    @staticmethod
    async def personal_chat(
        user,
        user_message: str,
        history: List[Dict[str, str]],
        conversation_id: str | None = None,
    ) -> AsyncGenerator[dict, None]:
        """
        Streaming personalization chat with Lilly.

        Yields dicts:
          {"type": "token", "content": "..."}   — streaming text chunks
          {"type": "done", "reply": "...", "actions": [...], "conversation_id": "...", "profile_updated": bool}
        """
        first_name = "there"
        if user and user.full_name:
            first_name = user.full_name.split()[0]

        # Load or create the conversation session
        if conversation_id:
            convo = await LillyConversation.find_one({"conversation_id": conversation_id, "user.$id": user.id})
        else:
            convo = await LillyConversation.find_one(
                {"user.$id": user.id},
                sort=[("updated_at", -1)],
            )

        if not convo:
            convo = LillyConversation(user=user, conversation_id=str(uuid.uuid4()))
            await convo.insert()

        # Build the past-summary context from the conversation record
        past_summary = convo.summary or "No previous context yet — this is our first real chat."

        # Load the user's current profile for the prompt
        profile = await Profile.find_one({"user.$id": user.id})

        # Load the latest LearningMemory so Lilly can see what the system has
        # actually learned from the user's coding activity (lighter context:
        # strengths/weaknesses + a memory summary, not the full cognitive dump).
        from app.models.learning_memory import LearningMemory
        memory = await LearningMemory.find(
            {"user.$id": user.id}
        ).sort(-LearningMemory.created_at).limit(1).first_or_none()

        if memory:
            mem_parts = [memory.summary] if getattr(memory, "summary", None) else []
            if getattr(memory, "persistent_struggles", None):
                mem_parts.append("Persistent struggles: " + ", ".join(memory.persistent_struggles))
            if getattr(memory, "progress_trend", None):
                mem_parts.append(f"Trend: {memory.progress_trend}")
            memory_summary = "\n".join(mem_parts) if mem_parts else "No learning history yet."
        else:
            memory_summary = "No learning history yet."

        system_prompt = LILLY_PERSONAL_PROMPT
        system_prompt = system_prompt.replace("{user_name}", first_name)
        system_prompt = system_prompt.replace("{skill_level}", str(getattr(profile, "skill_level", "intermediate")))
        system_prompt = system_prompt.replace("{goal}", str(getattr(profile, "goal", "learn_for_fun")))
        system_prompt = system_prompt.replace("{background}", str(getattr(profile, "background", "Unknown")))
        system_prompt = system_prompt.replace("{preferred_explanation_style}", str(getattr(profile, "preferred_explanation_style", "socratic")))
        system_prompt = system_prompt.replace("{primary_language}", str(getattr(profile, "primary_language", "python")))
        system_prompt = system_prompt.replace("{additional_context}", str(getattr(profile, "additional_context", "None")))
        system_prompt = system_prompt.replace("{recommended_tags}", str(getattr(profile, "lilly_recommended_tags", [])))
        system_prompt = system_prompt.replace("{strengths}", str(getattr(profile, "strengths", []) or "None identified yet"))
        system_prompt = system_prompt.replace("{weaknesses}", str(getattr(profile, "weaknesses", []) or "None identified yet"))
        system_prompt = system_prompt.replace("{memory_summary}", memory_summary)
        system_prompt = system_prompt.replace("{past_summary}", past_summary)

        messages = [
            {"role": "system", "content": system_prompt},
            *history,
            {"role": "user", "content": user_message},
        ]

        full_response = ""
        in_actions_block = False  # once True, stop emitting tokens to the client
        # Partial-match prefixes of the start marker so we suppress even a
        # half-arrived "@@ACTIONS@@" token (e.g. when it splits across chunks).
        start_prefixes = ["@", "@@", "@@A", "@@AC", "@@ACT", "@@ACTI", "@@ACTIO", "@@ACTIONS", "@@ACTIONS@"]
        try:
            stream = await lilly_client.chat.completions.create(
                model=settings.TUTOR_MODEL,
                messages=messages,
                temperature=0.7,
                max_tokens=1200,
                stream=True,
            )
            async for chunk in stream:
                delta = chunk.choices[0].delta
                token = getattr(delta, "content", None)
                if token:
                    full_response += token
                    # Suppress emitting the hidden @@ACTIONS@@ block to the client.
                    # We still accumulate it in full_response for later parsing.
                    if "@@ACTIONS@@" in full_response:
                        in_actions_block = True
                    elif not in_actions_block:
                        # Detect a partially-arrived start marker at the tail
                        tail = full_response[-12:]
                        if any(tail.endswith(p) for p in start_prefixes):
                            in_actions_block = True
                    if not in_actions_block:
                        yield {"type": "token", "content": token}

            # Parse actions from the completed response
            clean_reply, actions = LillyService._parse_actions(full_response)

            # Re-load profile (it may have been mutated by a concurrent call) then apply
            profile = await Profile.find_one({"user.$id": user.id})
            profile_updated = False
            invalidate_nudge = False
            if profile and actions:
                profile_updated, invalidate_nudge = await LillyService._apply_actions(profile, actions)

            # Persist messages
            await ConversationMessage(user=user, conversation_id=convo.conversation_id, role="user", content=user_message).insert()
            await ConversationMessage(user=user, conversation_id=convo.conversation_id, role="assistant", content=clean_reply).insert()

            convo.message_count += 2
            convo.updated_at = convo.updated_at  # touch

            # If we've hit the session limit, summarize and roll over
            if convo.message_count >= PERSONAL_SESSION_MSG_LIMIT:
                summary = await LillyService._summarize_session(user, convo)
                if summary:
                    convo.summary = summary
                    convo.session_count += 1
                convo.message_count = 0
                # Trim old raw messages to keep storage bounded
                old = await ConversationMessage.find(
                    {"user.$id": user.id, "conversation_id": convo.conversation_id}
                ).sort("created_at").to_list()
                if len(old) > PERSONAL_SESSION_MSG_LIMIT:
                    for m in old[: len(old) - PERSONAL_SESSION_MSG_LIMIT]:
                        await m.delete()

            await convo.save()

            # Fire-and-forget log
            from app.models.lilly_log import LillyLog
            lilly_log = LillyLog(
                user=user,
                lilly_feature="personal_chat",
                model_used=settings.TUTOR_MODEL,
                prompt_context=f"Personal chat | convo {convo.conversation_id} | msg: {user_message}",
                raw_response=clean_reply,
                extracted_json={"actions": actions, "profile_updated": profile_updated, "invalidate_nudge": invalidate_nudge},
            )
            await lilly_log.save()

            yield {
                "type": "done",
                "reply": clean_reply,
                "actions": actions,
                "conversation_id": convo.conversation_id,
                "profile_updated": profile_updated,
                "invalidate_nudge": invalidate_nudge,
            }

        except Exception as e:
            print(f"[LillyService Personal Chat Error] {e}")
            yield {"type": "token", "content": "I'm having a moment — could you try that again?"}
            yield {
                "type": "done",
                "reply": "I'm having a moment — could you try that again?",
                "actions": [],
                "conversation_id": convo.conversation_id,
                "profile_updated": False,
                "invalidate_nudge": False,
            }

    @staticmethod
    async def _summarize_session(user, convo) -> str | None:
        """
        Produce a rolling summary of the user's personalization chat so Lilly
        'remembers' across sessions without storing full raw history forever.
        """
        try:
            recent = await ConversationMessage.find(
                {"user.$id": user.id, "conversation_id": convo.conversation_id}
            ).sort("-created_at").limit(20).to_list()

            # Build a compact transcript (oldest -> newest)
            transcript = "\n".join(
                f"{m.role}: {m.content}" for m in reversed(recent)
            )
            prior = convo.summary or "No prior summary."
            system_prompt = (
                "You are a memory compressor for a learning app. Summarize the user's "
                "personalization chat into a tight bullet list of durable facts Lilly should "
                "remember: skill level, goals, preferences, struggles, and any requested changes. "
                "Merge with the prior summary. Keep under 120 words.\n\n"
                f"PRIOR SUMMARY:\n{prior}\n\nRECENT CHAT:\n{transcript}"
            )
            response = await lilly_client.chat.completions.create(
                model=settings.TUTOR_MODEL,
                messages=[{"role": "user", "content": system_prompt}],
                temperature=0.3,
                max_tokens=250,
            )
            content = response.choices[0].message.content
            if content is None and hasattr(response.choices[0].message, "reasoning_content"):
                content = response.choices[0].message.reasoning_content
            return content.strip() if content else None
        except Exception as e:
            print(f"[LillyService Summarize Error] {e}")
            return convo.summary
