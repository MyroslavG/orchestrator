from fastapi import APIRouter
from backend.models import Template, TemplateType

router = APIRouter()

TEMPLATES = [
    Template(
        id="virtual_influencer",
        name="Virtual Influencer",
        type=TemplateType.VIRTUAL_INFLUENCER,
        description="AI-generated human model content for virtual influencers and digital avatars",
        style_prompt="Professional fashion photography, high-end modeling aesthetics, photorealistic human portraits",
        content_guidelines="Share fashion inspiration, style trends, lifestyle content from a virtual model perspective",
        visual_style="Professional model portraits, studio fashion photography, cinematic lighting, high-fashion looks",
        icon="👤"
    ),
    Template(
        id="book_blog",
        name="Book Blog",
        type=TemplateType.BOOK_BLOG,
        description="Cozy reading content with literary charm",
        style_prompt="Warm, intellectual, cozy with aesthetic book photography",
        content_guidelines="Book recommendations, quotes, reading insights",
        visual_style="Flat lays, cozy reading nooks, vintage aesthetics",
        icon="📚"
    ),
    Template(
        id="aesthetic",
        name="Aesthetic Blog",
        type=TemplateType.AESTHETIC,
        description="Minimal, dreamy content for aesthetic enthusiasts",
        style_prompt="Dreamy, minimal, artistic with soft color palettes",
        content_guidelines="Inspiring quotes, mindful moments, aesthetic living",
        visual_style="Soft pastels, minimal compositions, artistic photography",
        icon="✨"
    ),
    Template(
        id="luxury_life",
        name="Luxury Life",
        type=TemplateType.LUXURY_LIFE,
        description="Premium lifestyle content with sophisticated elegance",
        style_prompt="Elegant, aspirational, premium with luxury aesthetics",
        content_guidelines="Luxury experiences, exclusive destinations, refined living",
        visual_style="High-end fashion, exotic locations, premium products",
        icon="💎"
    ),
    Template(
        id="custom",
        name="Custom",
        type=TemplateType.CUSTOM,
        description="Create anything you imagine! Describe your vision in the custom prompt field",
        style_prompt="Flexible, creative, personalized",
        content_guidelines="User-defined content based on custom prompt",
        visual_style="Varies based on user input",
        icon="✏️"
    ),
]

@router.get("/", response_model=list[Template])
async def get_templates():
    """Get all available templates"""
    return TEMPLATES

@router.get("/{template_id}", response_model=Template)
async def get_template(template_id: str):
    """Get a specific template by ID"""
    template = next((t for t in TEMPLATES if t.id == template_id), None)
    if not template:
        return {"error": "Template not found"}
    return template
