import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.roadmap import Roadmap, Topic
from app.core.config import settings

async def fix_roadmap():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    await init_beanie(database=client[settings.DB_NAME], document_models=[Roadmap, Topic])
    
    r = await Roadmap.find_one(Roadmap.slug == 'programming-foundations')
    if not r:
        print("❌ Roadmap not found")
        return

    print(f"Current topics in roadmap: {r.topics}")
    
    # We need to make sure 'classes-objects' and 'foundation-revision' (now architect) are there.
    # And we might need a NEW slug for the second revision if we want to keep the first one.
    # But usually, the user wants the "Foundation Revision" to be the milestone.
    
    # Let's ensure 'classes-objects' is in the list.
    if 'classes-objects' not in r.topics:
        r.topics.append('classes-objects')
        print("✅ Added classes-objects to roadmap")

    # If the user wants a SECOND revision, we should add 'architect-revision'
    if 'architect-revision' not in r.topics:
        r.topics.append('architect-revision')
        print("✅ Added architect-revision to roadmap")

    await r.save()

    # Now create the 'architect-revision' Topic in the database
    t = await Topic.find_one(Topic.slug == 'architect-revision')
    if not t:
        t = Topic(
            slug='architect-revision',
            title="The Architect's Milestone",
            description="Deep revision of Collections, Functions, and Classes.",
            order=9, # After Classes (8)
            problems=[]
        )
        await t.insert()
        print("✅ Created architect-revision topic")
    else:
        t.order = 9
        await t.save()

    # Update widgets to use the new slug
    from app.models.roadmap import InteractiveWidget
    await InteractiveWidget.init_beanie(database=client[settings.DB_NAME])
    widgets = await InteractiveWidget.find(InteractiveWidget.widget_id.regall(r"^arch-")).to_list()
    for w in widgets:
        w.topic_slug = "architect-revision"
        await w.save()
    print(f"✅ Re-slugged {len(widgets)} architect widgets")

if __name__ == "__main__":
    asyncio.run(fix_roadmap())
