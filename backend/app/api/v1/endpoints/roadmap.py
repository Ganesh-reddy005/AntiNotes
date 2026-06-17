from typing import List
from fastapi import APIRouter, HTTPException
from app.models.roadmap import Topic as TopicModel, Roadmap as RoadmapModel, InteractiveWidget as WidgetModel
from app.schemas.roadmap import TopicRead, RoadmapRead, RoadmapDetail, TopicCreate, RoadmapCreate, InteractiveWidgetRead

router = APIRouter()

@router.get("/roadmaps", response_model=List[RoadmapRead])
async def list_roadmaps():
    return await RoadmapModel.find_all().to_list()

@router.get("/roadmaps/{slug}", response_model=RoadmapDetail)
async def get_roadmap(slug: str):
    roadmap = await RoadmapModel.find_one(RoadmapModel.slug == slug)
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    
    # Fetch topic details
    topics = []
    for topic_slug in roadmap.topics:
        topic = await TopicModel.find_one(TopicModel.slug == topic_slug)
        if topic:
            topics.append(topic)
    
    # Combine data
    result = RoadmapDetail(
        **roadmap.model_dump(),
        topic_details=[TopicRead(**t.model_dump()) for t in topics]
    )
    return result

@router.get("/topics/{slug}", response_model=TopicRead)
async def get_topic(slug: str):
    topic = await TopicModel.find_one(TopicModel.slug == slug)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic

@router.get("/topics/{slug}/widgets", response_model=List[InteractiveWidgetRead])
async def get_topic_widgets(slug: str):
    widgets = await WidgetModel.find(WidgetModel.topic_slug == slug).to_list()
    return widgets

# Admin endpoints (can be protected later)
@router.post("/topics", response_model=TopicRead)
async def create_topic(topic_in: TopicCreate):
    existing = await TopicModel.find_one(TopicModel.slug == topic_in.slug)
    if existing:
        raise HTTPException(status_code=400, detail="Topic slug already exists")
    topic = TopicModel(**topic_in.model_dump())
    await topic.insert()
    return topic

@router.post("/roadmaps", response_model=RoadmapRead)
async def create_roadmap(roadmap_in: RoadmapCreate):
    existing = await RoadmapModel.find_one(RoadmapModel.slug == roadmap_in.slug)
    if existing:
        raise HTTPException(status_code=400, detail="Roadmap slug already exists")
    roadmap = RoadmapModel(**roadmap_in.model_dump())
    await roadmap.insert()
    return roadmap
