from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional

class Settings(BaseSettings):
    gemini_api_key: str
    google_cloud_project: Optional[str] = None
    google_application_credentials: Optional[str] = "vertex-ai-key.json"
    gcp_region: str = "us-central1"
    environment: str = "development"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
