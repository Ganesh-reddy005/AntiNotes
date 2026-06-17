from enum import Enum
from typing import List, Optional, Dict, Any
from beanie import Document, Indexed
from pydantic import Field

class WidgetType(str, Enum):
    MCQ = "mcq"
    CODE_TABS = "code_tabs"
    LIVE_EDITOR = "live_editor"

class InteractiveWidget(Document):
    widget_id: Indexed(str, unique=True) # type: ignore
    topic_slug: str
    type: WidgetType
    data: Dict[str, Any] # Polymorphic data payload
    
    class Settings:
        name = "interactive_widgets"

class Topic(Document):
    slug: Indexed(str, unique=True) # type: ignore
    title: str
    description: str
    content: Optional[str] = None  # Optional, can be used for fallback or short topics
    prerequisites: List[str] = Field(default_factory=list) # Slugs of other topics
    problems: List[str] = Field(default_factory=list) # Slugs of problems
    order: int = 0
    
    class Settings:
        name = "topics"

class Roadmap(Document):
    slug: Indexed(str, unique=True) # type: ignore
    title: str
    description: str
    topics: List[str] = Field(default_factory=list) # Ordered list of topic slugs
    is_featured: bool = False
    
    class Settings:
        name = "roadmaps"
