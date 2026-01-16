from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional
import os
import json

class Settings(BaseSettings):
    gemini_api_key: str
    google_cloud_project: Optional[str] = None
    google_application_credentials: Optional[str] = "vertex-ai-key.json"
    google_application_credentials_json: Optional[str] = None
    gcp_region: str = "us-central1"
    environment: str = "development"

    class Config:
        env_file = ".env"

    def get_credentials_path(self) -> Optional[str]:
        """Get the credentials path, handling both file and JSON string for Vercel"""
        # If running on Vercel and have JSON credentials
        if self.google_application_credentials_json:
            # Write JSON to temp file
            temp_path = "/tmp/vertex-ai-key.json"
            try:
                with open(temp_path, 'w') as f:
                    # Handle if it's already a dict or a JSON string
                    if isinstance(self.google_application_credentials_json, str):
                        credentials = json.loads(self.google_application_credentials_json)
                    else:
                        credentials = self.google_application_credentials_json
                    json.dump(credentials, f)
                return temp_path
            except Exception as e:
                print(f"Error writing credentials: {e}")
                return None

        # Otherwise use file path
        return self.google_application_credentials

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
