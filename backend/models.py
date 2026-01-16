from datetime import datetime
from enum import Enum
from typing import List, Literal, Optional

from pydantic import BaseModel, Field


class TemplateType(str, Enum):
    VIRTUAL_INFLUENCER = "virtual_influencer"
    BOOK_BLOG = "book_blog"
    AESTHETIC = "aesthetic"
    LUXURY_LIFE = "luxury_life"
    CUSTOM = "custom"


class Template(BaseModel):
    id: str
    name: str
    type: TemplateType
    description: str
    style_prompt: str
    content_guidelines: str
    visual_style: str
    icon: str


class PostStatus(str, Enum):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    PUBLISHED = "published"
    FAILED = "failed"


class GenerateContentRequest(BaseModel):
    template_type: TemplateType
    custom_prompt: Optional[str] = None
    tone: Optional[str] = "professional"
    include_hashtags: bool = True


class Post(BaseModel):
    id: str
    template_type: TemplateType
    caption: str
    image_url: Optional[str] = None
    image_prompt: Optional[str] = None
    hashtags: List[str] = []
    scheduled_at: Optional[datetime] = None
    status: PostStatus = PostStatus.DRAFT
    created_at: datetime = Field(default_factory=datetime.now)


class CreatePostRequest(BaseModel):
    template_type: TemplateType
    custom_prompt: Optional[str] = None
    tone: Optional[str] = "professional"
    schedule_at: Optional[datetime] = None


class Campaign(BaseModel):
    id: str
    name: str
    template_type: TemplateType
    posts: List[Post] = []
    frequency: Literal["daily", "twice_daily", "three_times_daily"]
    start_date: datetime
    end_date: Optional[datetime] = None
    status: Literal["active", "paused", "completed"] = "active"
    created_at: datetime = Field(default_factory=datetime.now)


class CreateCampaignRequest(BaseModel):
    name: str
    template_type: TemplateType
    frequency: Literal["daily", "twice_daily", "three_times_daily"]
    start_date: datetime
    end_date: Optional[datetime] = None
    posts_count: int = Field(ge=1, le=90)
