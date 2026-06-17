import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.roadmap import InteractiveWidget
from app.core.config import settings

async def check_types():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    await init_beanie(database=client[settings.DB_NAME], document_models=[InteractiveWidget])
    
    widgets = await InteractiveWidget.find_all().to_list()
    types = set(w.type for w in widgets)
    print(f"Widget types in DB: {types}")

if __name__ == "__main__":
    asyncio.run(check_types())
