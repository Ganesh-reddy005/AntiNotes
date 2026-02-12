from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from app.services.tutor import TutorService

router = APIRouter()

# Input Schema (Simple for now)
class ChatRequest(BaseModel):
    problem_slug: str
    user_message: str
    history: List[Dict[str, str]] = [] # [{"role": "user", "content": "..."}]

@router.post("/ask")
async def ask_tutor(request: ChatRequest):
    """
    Send a message to the Socratic Tutor.
    """
    response = await TutorService.get_response(
        problem_slug=request.problem_slug,
        chat_history=request.history,
        user_question=request.user_message
    )
    
    return {"reply": response}