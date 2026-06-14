from typing import List
from beanie import Document, Indexed
from pydantic import BaseModel
from enum import Enum

class Difficulty(str, Enum):
    EASY = "Easy"
    MEDIUM = "Medium"
    HARD = "Hard"

class TestCase(BaseModel):
    input: str
    output: str
    is_hidden: bool = False 

# CRITICAL: This must inherit from Document, NOT BaseModel
class Problem(Document):
    slug: Indexed(str, unique=True) # type: ignore
    title: str
    description: str 
    difficulty: Difficulty = Difficulty.EASY
    tags: List[str] = []
    starter_code: str 
    test_cases: List[TestCase]

    class Settings:
        name = "problems" # Collection name in MongoDB