import json
from typing import Any, Dict, Optional

import google.genai as genai
from google.genai import types

from backend.config import settings
from backend.models import TemplateType
from backend.services.imagen_service import imagen_service


class GeminiService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.gemini_api_key)
        # Use model verified from client.models.list()
        self.text_model_id = "models/gemini-2.5-flash"

    def get_template_config(self, template_type: TemplateType) -> Dict:
        """Get configuration for each template type"""
        configs = {
            TemplateType.VIRTUAL_INFLUENCER: {
                "style": "professional, modern, fashion-forward",
                "tone": "confident, inspiring, aspirational",
                "visual_keywords": "hyper-realistic lifestyle content - can be people (men or women of various ages and ethnicities), fashion items, accessories, travel destinations, cityscapes, food, interior design, or aesthetic scenes. For people: professional portrait with natural skin texture, realistic features, natural poses. For objects/scenes: detailed product photography or lifestyle scenes. Always photorealistic, shot on location in real-world settings (urban streets, cafes, beaches, parks, rooftops, natural outdoor settings), natural lighting or golden hour, shot with professional DSLR camera, 85mm lens, f/1.8 aperture, shallow depth of field, real photograph quality from Instagram or professional portfolio",
                "content_focus": "lifestyle inspiration, fashion, style trends, travel, aesthetics, beauty, design, confidence - diverse content that resonates with modern social media",
            },
            TemplateType.BOOK_BLOG: {
                "style": "cozy, intellectual, warm",
                "tone": "thoughtful, engaging, literary",
                "visual_keywords": "aesthetic book flat lay, coffee, cozy reading nook, vintage books, natural lighting, minimal",
                "content_focus": "book recommendations, reading insights, literary quotes, author spotlights",
            },
            TemplateType.AESTHETIC: {
                "style": "dreamy, minimal, artistic",
                "tone": "poetic, inspiring, calm",
                "visual_keywords": "aesthetic minimal scene, soft pastels, dreamy atmosphere, artistic composition, modern minimalism",
                "content_focus": "inspiring quotes, aesthetic moments, mindful living, beauty in simplicity",
            },
            TemplateType.LUXURY_LIFE: {
                "style": "elegant, aspirational, premium",
                "tone": "sophisticated, exclusive, refined",
                "visual_keywords": "luxury lifestyle, high-end fashion, exotic travel destinations, premium cars, elegant interiors, golden hour",
                "content_focus": "luxury experiences, premium lifestyle tips, exclusive destinations, sophisticated living",
            },
            TemplateType.CUSTOM: {
                "style": "flexible, creative, user-defined",
                "tone": "adaptable based on user request",
                "visual_keywords": "photorealistic, high-quality photography, natural lighting, real-world setting",
                "content_focus": "completely based on user's custom prompt - follow their instructions closely",
            },
        }
        return configs.get(template_type, configs[TemplateType.VIRTUAL_INFLUENCER])

    async def generate_caption(
        self,
        template_type: TemplateType,
        custom_prompt: Optional[str] = None,
        tone: str = "professional",
    ) -> Dict[str, Any]:
        """Generate caption and hashtags for a post"""
        config = self.get_template_config(template_type)

        # For CUSTOM template, emphasize user's custom prompt
        if template_type == TemplateType.CUSTOM and custom_prompt:
            intro = f"""
You are a social media content creator. The user wants you to create content based on their specific request:

USER REQUEST: {custom_prompt}

Follow the user's request closely and create appropriate content that matches their vision.
"""
        else:
            intro = f"""
You are a social media content creator specializing in {template_type.value.replace('_', ' ')} content.

Style: {config['style']}
Tone: {tone}, {config['tone']}
Content Focus: {config['content_focus']}

{f"Additional guidance: {custom_prompt}" if custom_prompt else ""}
"""

        prompt = intro + """
Create an engaging social media post that sounds NATURAL and HUMAN, not AI-generated:

1. A CASUAL, SHORT caption (1-2 short sentences max, or even just a few words with emojis):
   - Use emojis naturally (2-4 emojis max)
   - Keep it SHORT and conversational like real people post
   - NO corporate speak, NO "call to action", NO overly polished language
   - Examples of good captions:
     * "mood ✨💫"
     * "living for these vibes 🌊"
     * "current situation 😌☕️"
     * "obsessed 🖤"
     * "golden hour hits different 🌅"
   - Sound like a real person, not a brand

2. 5-8 relevant hashtags (mix of popular and niche)

3. A HIGHLY DETAILED image generation prompt that describes a PHOTOREALISTIC scene that looks like a real photograph:

   CHOOSE ONE OF THESE CONTENT TYPES (vary the content to keep it interesting):

   A) PERSON/PEOPLE (any gender, age 20-40, diverse ethnicities):
      - Specific person details (age, gender, ethnicity, hair, eyes, skin tone, outfit)
      - Natural pose and authentic expression
      - Real-world location and setting

   B) LIFESTYLE SCENE (no people, just objects/places):
      - Travel destinations (cityscapes, landmarks, beaches, mountains)
      - Food/drinks (coffee, meals, aesthetic food photography)
      - Fashion items (shoes, bags, accessories, clothing flat lays)
      - Interior design (modern apartments, cozy spaces, aesthetic rooms)
      - Nature scenes (sunsets, flowers, landscapes)

   ALWAYS INCLUDE:
   - REAL-WORLD SPECIFIC LOCATION:
     * Urban: "busy NYC street corner near Times Square", "Brooklyn Bridge at sunset", "Paris cafe terrace in Montmartre"
     * Nature: "California Malibu beach at golden hour", "Central Park in autumn", "Japanese cherry blossom garden"
     * Indoor: "modern loft apartment in SoHo", "vintage bookstore in London", "minimalist Scandinavian coffee shop"
   - Natural lighting: "golden hour sunlight", "soft overcast daylight", "warm afternoon sun"
   - Camera: shot with Canon EOS R5 or Nikon D850, 85mm lens, f/1.8
   - Environmental details for realism (blurred background, natural elements, authentic atmosphere)
   - Overall mood: authentic, candid, like a real Instagram photo from a lifestyle influencer

Format your response as JSON:
{{
    "caption": "your caption here",
    "hashtags": ["hashtag1", "hashtag2", ...],
    "image_prompt": "ULTRA DETAILED photorealistic image prompt with specific visual details"
}}
"""

        response = self.client.models.generate_content(
            model=self.text_model_id,
            contents=types.Part.from_text(text=prompt),
        )

        text = (response.text or "").strip()

        try:
            # Extract JSON from response
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()

            result = json.loads(text)

            # Enhance image prompt with template-specific keywords
            result["image_prompt"] = (
                f"{config['visual_keywords']}, {result.get('image_prompt', '')}"
            )

            return result
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            return {
                "caption": text[:200],
                "hashtags": ["content", "socialmedia", template_type.value],
                "image_prompt": config["visual_keywords"],
            }

    async def generate_image_url(self, prompt: str) -> str:
        """
        Generate image using Vertex AI Imagen

        Args:
            prompt: The image generation prompt

        Returns:
            Base64 encoded image data URL or placeholder URL
        """
        return await imagen_service.generate_image(prompt)

    async def generate_campaign_posts(
        self, template_type: TemplateType, count: int, tone: str = "professional"
    ) -> list:
        """Generate multiple posts for a campaign"""
        posts = []

        for i in range(count):
            variation_prompt = (
                f"Create variation {i+1} of {count}. Make it unique and engaging."
            )
            content = await self.generate_caption(template_type, variation_prompt, tone)
            posts.append(content)

        return posts


gemini_service = GeminiService()
