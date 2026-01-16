import base64
import os
from io import BytesIO
from typing import Optional

from PIL import Image

from backend.config import settings


class ImagenService:
    def __init__(self):
        """Initialize Imagen service using google-genai SDK"""
        try:
            import google.genai as genai

            # Set credentials environment variable
            credentials_path = settings.get_credentials_path()
            if credentials_path:
                os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credentials_path

            # Initialize client
            if settings.google_cloud_project:
                self.client = genai.Client(
                    vertexai=True,
                    project=settings.google_cloud_project,
                    location=settings.gcp_region,
                )
                self.enabled = True
                print("✅ Vertex AI Imagen initialized successfully")
            else:
                self.enabled = False
                print(
                    "⚠️  Warning: Vertex AI not configured. Image generation will use placeholders."
                )
        except Exception as e:
            self.enabled = False
            print(f"⚠️  Warning: Could not initialize Vertex AI: {str(e)}")

    async def generate_image(
        self, prompt: str, negative_prompt: Optional[str] = None
    ) -> str:
        """
        Generate an image using Vertex AI Imagen via google-genai SDK

        Args:
            prompt: The image generation prompt
            negative_prompt: Things to avoid in the image

        Returns:
            Base64 encoded image string or placeholder URL
        """
        if not self.enabled:
            return "https://placehold.co/1024x1024/png?text=Configure+Vertex+AI"

        try:
            import google.genai.types as types

            # Enhanced prompt for ultra-realistic photography (people, objects, places, or scenes)
            enhanced_prompt = f"{prompt}, hyper-realistic photograph, photorealistic, authentic real photography, natural lighting, real-world location, DSLR camera, 85mm lens or appropriate focal length, f/1.8 aperture, shallow depth of field with natural bokeh, realistic textures and details, authentic environmental details, professional photography quality, shot on Nikon D850 or Canon EOS R5, 8k resolution, ultra high definition, RAW unedited photo quality, looks like a real photograph from Instagram or professional photography portfolio, natural colors, lifelike"

            # Comprehensive negative prompt for maximum realism
            if not negative_prompt:
                negative_prompt = "unrealistic, fake, artificial, CGI, 3D render, cartoon, anime, illustration, drawing, painting, sculpture, low quality, blurry, distorted, deformed, mutated, disfigured, ugly, bad anatomy, extra limbs, missing limbs, floating limbs, bad proportions, gross proportions, malformed, poorly drawn face, duplicate, bad hands, bad fingers, extra fingers, missing fingers, text, watermark, logo, signature, username"

            print("🎨 Generating image with Imagen 3...")

            # Generate image using new SDK
            response = self.client.models.generate_images(
                model="imagen-3.0-generate-001",
                prompt=enhanced_prompt,
                config=types.GenerateImagesConfig(
                    negative_prompt=negative_prompt,
                    number_of_images=1,
                    aspect_ratio="1:1",
                ),
            )

            # Get the generated image
            if (
                response
                and hasattr(response, "generated_images")
                and response.generated_images
            ):
                generated_image = response.generated_images[0]

                # Convert image to base64
                if hasattr(generated_image, "image") and generated_image.image:
                    # Get image data
                    if (
                        hasattr(generated_image.image, "image_bytes")
                        and generated_image.image.image_bytes
                    ):
                        image_data = generated_image.image.image_bytes

                        # Convert to PIL Image and then to base64
                        pil_image = Image.open(BytesIO(image_data))
                        buffered = BytesIO()
                        pil_image.save(buffered, format="PNG")
                        img_str = base64.b64encode(buffered.getvalue()).decode()

                        print("✅ Image generated successfully")
                        return f"data:image/png;base64,{img_str}"

            print("❌ Image generation failed - no images returned")
            return "https://placehold.co/1024x1024/png?text=Generation+Failed"

        except Exception as e:
            print(f"❌ Image generation error: {str(e)}")
            import traceback

            traceback.print_exc()
            return "https://placehold.co/1024x1024/png?text=Error"


imagen_service = ImagenService()
