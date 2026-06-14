from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings

# Import your models
from app.models.user import User
from app.models.problem import Problem
from app.models.session import Session
from app.models.profile import Profile
from app.models.submission import Submission
from app.models.review import Review
from app.models.learning_memory import LearningMemory
from app.models.revision import Revision
from app.models.ai_log import AILog

async def init_db():
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URI)
        database = client.get_database(settings.DB_NAME)

        await init_beanie(
            database=database,
            document_models=[
                User,
                Problem,
                Session,
                Profile,
                Submission,
                Review,
                LearningMemory,
                Revision,
                AILog
            ],
        )
        print(f"✅ Database Connected: {settings.DB_NAME}")
    except Exception as e:
        print(f"❌ MongoDB Connection Error: {e}")
        raise e