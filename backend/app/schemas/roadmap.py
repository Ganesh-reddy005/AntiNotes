from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class TopicBase(BaseModel):
    slug: str
    title: str
    description: str
    content: Optional[str] = None
    prerequisites: List[str] = []
    problems: List[str] = []
    order: int = 0

class TopicCreate(TopicBase):
    pass

class TopicRead(TopicBase):
    pass

class RoadmapBase(BaseModel):
    slug: str
    title: str
    description: str
    topics: List[str] = []
    is_featured: bool = False

class RoadmapCreate(RoadmapBase):
    pass

class RoadmapRead(RoadmapBase):
    pass

class RoadmapDetail(RoadmapRead):
    topic_details: List[TopicRead] = []

class InteractiveWidgetRead(BaseModel):
    widget_id: str
    topic_slug: str
    type: str
    data: Dict[str, Any]

