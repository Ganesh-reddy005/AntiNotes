import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.roadmap import InteractiveWidget
from app.core.config import settings

async def fix_widget_slugs():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    await init_beanie(
        database=client[settings.DB_NAME],
        document_models=[InteractiveWidget]
    )

    print("🚀 Fixing topic_slug for all Architect widgets...")

    # All widgets starting with 'arch-' should belong to 'architect-revision'
    widgets = await InteractiveWidget.find(InteractiveWidget.widget_id.regall(r"^arch-")).to_list()
    
    for w in widgets:
        if w.topic_slug != "architect-revision":
            w.topic_slug = "architect-revision"
            await w.save()
            print(f"✅ Updated slug for: {w.widget_id}")
        else:
            print(f"ℹ️ Already correct: {w.widget_id}")

if __name__ == "__main__":
    asyncio.run(fix_widget_slugs())
