from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict
from beanie import PydanticObjectId
# We import the Enum and TestCase from the model to avoid re-defining them
from app.models.problem import Difficulty, TestCase

# Shared properties
class ProblemBase(BaseModel):
    slug: str
    title: str
    description: str
    difficulty: Difficulty = Difficulty.EASY
    tags: List[str] = []
    starter_code: str

# Input properties (When creating)
class ProblemCreate(ProblemBase):
    test_cases: List[TestCase]

# Output properties (When reading)
class ProblemRead(ProblemBase):
    id: Optional[PydanticObjectId] = Field(None, alias="_id")
    test_cases: List[TestCase]

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )