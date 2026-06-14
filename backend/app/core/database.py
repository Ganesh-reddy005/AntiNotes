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
        # Create client and get database
        client = AsyncIOMotorClient(settings.MONGODB_URI)
        database = client[settings.DB_NAME]

        # Initialize Beanie
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
        print(f"✅ Beanie Initialized. Connected to: {settings.DB_NAME}")
    except Exception as e:
        print(f"❌ MongoDB/Beanie Error: {e}")
        raise e