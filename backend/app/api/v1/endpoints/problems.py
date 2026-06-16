from typing import List
from fastapi import APIRouter, HTTPException

# 1. Import the DB Model explicitly
from app.models.problem import Problem as ProblemModel 

# 2. Import the Pydantic Schemas
from app.schemas.problem import ProblemCreate, ProblemRead

router = APIRouter()

@router.api_route("/", methods=["GET", "HEAD"])
async def list_problems():
    """Get all problems"""
    problems = await ProblemModel.find_all().to_list()
    return problems

@router.post("/")
async def create_problem(problem_in: ProblemCreate):
    # 3. Use ProblemModel for database queries
    existing = await ProblemModel.find_one(ProblemModel.slug == problem_in.slug)
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    
    # 4. create the document
    # Note: We dump the Pydantic object to a dict to pass it to the Model
    problem = ProblemModel(**problem_in.model_dump())
    await problem.insert()
    
    return problem

@router.get("/{slug}")
async def get_problem(slug: str):
    # Use ProblemModel here too
    problem = await ProblemModel.find_one(ProblemModel.slug == slug)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    return problem