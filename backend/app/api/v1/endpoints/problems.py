from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from app.services.piston_service import CodeExecutionService
from app.models.problem import Problem, Difficulty

router = APIRouter()

class ExecuteRequest(BaseModel):
    language: str
    code: str

@router.get("/", response_model=List[Problem])
async def list_problems(
    difficulty: Optional[Difficulty] = None,
    tag: Optional[str] = None
):
    query = {}
    if difficulty:
        query["difficulty"] = difficulty
    if tag:
        query["tags"] = tag
    
    return await Problem.find(query).to_list()

@router.get("/{slug}", response_model=Problem)
async def get_problem(slug: str):
    problem = await Problem.find_one(Problem.slug == slug)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem

@router.post("/execute")
async def execute_code(request: ExecuteRequest):
    """
    Proxy request to CodeX API to avoid CORS issues and provide better error handling.
    """
    result = await CodeExecutionService.execute(request.language, request.code)
    return result
