import uuid
from datetime import datetime

from fastapi import APIRouter, HTTPException

from backend.models import CreatePostRequest, GenerateContentRequest, Post, PostStatus
from backend.services.gemini_service import gemini_service

router = APIRouter()

# In-memory storage (replace with database in production)
posts_db = []


@router.get("/", response_model=list[Post])
async def get_posts():
    """Get all posts"""
    return posts_db


@router.post("/generate")
async def generate_content(request: GenerateContentRequest):
    """Generate content using Gemini AI"""
    try:
        content = await gemini_service.generate_caption(
            template_type=request.template_type,
            custom_prompt=request.custom_prompt,
            tone=request.tone or "professional",
        )
        return content
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Content generation failed: {str(e)}"
        )


@router.post("/", response_model=Post)
async def create_post(request: CreatePostRequest):
    """Create a new post"""
    try:
        # Generate content
        content = await gemini_service.generate_caption(
            template_type=request.template_type,
            custom_prompt=request.custom_prompt,
            tone=request.tone or "professional",
        )

        # Generate image URL (placeholder for now)
        image_url = await gemini_service.generate_image_url(content["image_prompt"])

        # Create post
        post = Post(
            id=str(uuid.uuid4()),
            template_type=request.template_type,
            caption=content["caption"],
            image_url=image_url,
            image_prompt=content["image_prompt"],
            hashtags=content.get("hashtags", []),
            scheduled_at=request.schedule_at,
            status=PostStatus.SCHEDULED if request.schedule_at else PostStatus.DRAFT,
            created_at=datetime.now(),
        )

        posts_db.append(post)
        return post

    except Exception as e:
        import traceback
        print(f"ERROR: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Post creation failed: {str(e)}")


@router.get("/{post_id}", response_model=Post)
async def get_post(post_id: str):
    """Get a specific post"""
    post = next((p for p in posts_db if p.id == post_id), None)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.delete("/{post_id}")
async def delete_post(post_id: str):
    """Delete a post"""
    global posts_db
    posts_db = [p for p in posts_db if p.id != post_id]
    return {"message": "Post deleted successfully"}


@router.patch("/{post_id}/status")
async def update_post_status(post_id: str, status: PostStatus):
    """Update post status"""
    post = next((p for p in posts_db if p.id == post_id), None)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    post.status = status
    return post
