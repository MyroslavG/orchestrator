"""
Vercel serverless function entry point for FastAPI backend
"""
from backend.main import app

# Vercel will use this to handle requests
handler = app
