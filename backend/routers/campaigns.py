from fastapi import APIRouter, HTTPException
from backend.models import Campaign, CreateCampaignRequest, Post, PostStatus
from backend.services.gemini_service import gemini_service
from datetime import datetime, timedelta
import uuid

router = APIRouter()

# In-memory storage
campaigns_db = []

@router.get("/", response_model=list[Campaign])
async def get_campaigns():
    """Get all campaigns"""
    return campaigns_db

@router.post("/", response_model=Campaign)
async def create_campaign(request: CreateCampaignRequest):
    """Create a new campaign with scheduled posts"""
    try:
        # Generate content for all posts
        generated_content = await gemini_service.generate_campaign_posts(
            template_type=request.template_type,
            count=request.posts_count,
            tone="professional"
        )

        # Calculate posting schedule
        frequency_map = {
            "daily": 1,
            "twice_daily": 2,
            "three_times_daily": 3
        }
        posts_per_day = frequency_map[request.frequency]

        posts = []
        current_date = request.start_date

        for i, content in enumerate(generated_content):
            # Calculate scheduled time
            day_offset = i // posts_per_day
            post_index_in_day = i % posts_per_day

            scheduled_time = current_date + timedelta(
                days=day_offset,
                hours=8 + (post_index_in_day * (12 // posts_per_day))
            )

            # Create post
            image_url = await gemini_service.generate_image_url(content["image_prompt"])

            post = Post(
                id=str(uuid.uuid4()),
                template_type=request.template_type,
                caption=content["caption"],
                image_url=image_url,
                image_prompt=content["image_prompt"],
                hashtags=content.get("hashtags", []),
                scheduled_at=scheduled_time,
                status=PostStatus.SCHEDULED,
                created_at=datetime.now()
            )
            posts.append(post)

        # Create campaign
        campaign = Campaign(
            id=str(uuid.uuid4()),
            name=request.name,
            template_type=request.template_type,
            posts=posts,
            frequency=request.frequency,
            start_date=request.start_date,
            end_date=request.end_date,
            status="active",
            created_at=datetime.now()
        )

        campaigns_db.append(campaign)
        return campaign

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Campaign creation failed: {str(e)}")

@router.get("/{campaign_id}", response_model=Campaign)
async def get_campaign(campaign_id: str):
    """Get a specific campaign"""
    campaign = next((c for c in campaigns_db if c.id == campaign_id), None)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign

@router.delete("/{campaign_id}")
async def delete_campaign(campaign_id: str):
    """Delete a campaign"""
    global campaigns_db
    campaigns_db = [c for c in campaigns_db if c.id != campaign_id]
    return {"message": "Campaign deleted successfully"}

@router.patch("/{campaign_id}/status")
async def update_campaign_status(campaign_id: str, status: str):
    """Update campaign status (active, paused, completed)"""
    campaign = next((c for c in campaigns_db if c.id == campaign_id), None)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    if status not in ["active", "paused", "completed"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    campaign.status = status
    return campaign
