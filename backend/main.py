from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import campaigns, posts, templates

app = FastAPI(
    title="Media Orchestrator API",
    description="AI-powered content generation and scheduling",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://orchestrator-frontend.onrender.com",
        "*"  # Allow all origins for production (or specify your frontend URL)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(templates.router, prefix="/api/templates", tags=["templates"])
app.include_router(posts.router, prefix="/api/posts", tags=["posts"])
app.include_router(campaigns.router, prefix="/api/campaigns", tags=["campaigns"])


@app.get("/")
async def root():
    return {"message": "Media Orchestrator API", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
