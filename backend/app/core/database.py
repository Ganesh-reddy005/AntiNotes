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
    print(f"🔗 Connecting to MongoDB: {settings.MONGODB_URI[:20]}...")
    try:
        # Add serverSelectionTimeoutMS to prevent hanging on connection issues
        client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=10000
        )

        # Verify connection
        await client.admin.command('ping')
        print("✅ MongoDB Ping successful.")

        await init_beanie(
            database=client[settings.DB_NAME],
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
    except Exception as e:
        print(f"❌ MongoDB Connection Error: {e}")
        # In production, we might want to raise this to fail the health check
        raise e