"""
Import problems from problems.jsonl to MongoDB
"""

import json
import asyncio
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.problem import Problem
from app.core.config import settings


async def import_problems(limit=50):
    """Import first N problems from problems.jsonl"""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    await init_beanie(
        database=client[settings.DB_NAME],
        document_models=[Problem]
    )
    
    # Read and import problems
    jsonl_path = Path(__file__).parent.parent.parent / "problems.jsonl"
    
    imported = 0
    skipped = 0
    
    with open(jsonl_path, 'r') as f:
        for line in f:
            if imported >= limit:
                break
            
            data = json.loads(line.strip())
            
            # Extract fields from jsonl format
            task_id = data.get('task_id', '')
            difficulty = data.get('difficulty', 'Medium')
            
            # Check if problem already exists
            existing = await Problem.find_one(Problem.slug == task_id)
            if existing:
                skipped += 1
                continue
            
            # Parse test cases from input_output field (it's a list of dicts)
            test_cases = []
            input_output = data.get('input_output', [])
            
            if isinstance(input_output, list) and input_output:
                # input_output is a list like [{'input': '...', 'output': '...'}, ...]
                for i, test in enumerate(input_output[:10]):  # Max 10 tests
                    test_cases.append({
                        "input": test.get('input', ''),
                        "output": test.get('output', ''),  # Changed from expected_output
                        "is_hidden": i >= 3  # First 3 visible, rest hidden
                    })

            
            # Extract description from problem_description or query
            description = data.get('problem_description', '')
            if not description or len(description) < 50:
                # Fallback to query field
                query = data.get('query', '')
                if '###' in query:
                    parts = query.split('###')
                    if len(parts) > 1:
                        description = parts[1].split('Format')[0].strip()
                else:
                    description = query[:800]
            
            # Get tags (convert to list if string)
            tags = data.get('tags', ["algorithms"])
            if isinstance(tags, str):
                tags = [t.strip() for t in tags.split(',')]
            
            # Create problem from jsonl data
            problem = Problem(
                slug=task_id,
                title=task_id.replace('-', ' ').title(),
                description=description,
                difficulty=difficulty,
                tags=tags if tags else ["algorithms"],
                starter_code=data.get('starter_code', f"def {task_id.replace('-', '_')}():\n    pass"),
                test_cases=test_cases
            )
            
            await problem.insert()
            print(f"✅ {problem.title} ({difficulty}) - {len(test_cases)} tests")
            imported += 1
    
    print(f"\n🎉 Imported: {imported} new | Skipped: {skipped} existing")


if __name__ == "__main__":
    asyncio.run(import_problems(limit=1500))
