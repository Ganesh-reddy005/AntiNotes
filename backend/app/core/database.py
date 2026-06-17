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
from app.models.roadmap import Topic, Roadmap, InteractiveWidget

async def init_db():
    try:
        # Create client and get database
        client = AsyncIOMotorClient(settings.MONGODB_URI)
        database = client[settings.DB_NAME]
        
        # --- TELEMETRY GUARD (Monkeypatch) ---
        # Defuses the conflict where Beanie tries to call a non-existent 
        # 'append_metadata' method on the Motor client.
        if not hasattr(client, "append_metadata") or not callable(getattr(client, "append_metadata")):
            client.append_metadata = lambda x: None
        # -------------------------------------

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
                AILog,
                Topic,
                Roadmap,
                InteractiveWidget
            ],
        )
        print(f"✅ Beanie Initialized. Connected to: {settings.DB_NAME}")
    except Exception as e:
        print(f"❌ MongoDB/Beanie Error: {e}")
        raise e