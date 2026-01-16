# Media Orchestrator

AI-powered content generation and scheduling platform. Create photorealistic social media posts with AI-generated images and natural captions.

## Features

- **5 Versatile Templates**: Virtual Influencer, Book Blog, Aesthetic, Luxury Life, and Custom
- **Photorealistic Image Generation**: Powered by Google Vertex AI Imagen 3.0 for ultra-realistic visuals
- **Natural Captions**: Short, emoji-rich captions that sound human (using Google Gemini 2.5 Flash)
- **Custom Content**: Create anything you imagine with the custom template
- **Single Posts**: Create individual posts with optional custom prompts
- **Campaign Scheduling**: Generate and schedule 1-90 posts with daily, 2x, or 3x frequency
- **Interactive Dashboard**: View all posts in a grid, click to see full details in modal
- **Diverse Content Types**: People, objects, places, scenes - shot in real-world locations

## Tech Stack

**Backend:**
- FastAPI (Python)
- Google Gemini 2.5 Flash (text generation)
- Google Vertex AI Imagen 3.0 (image generation)
- Pydantic for data validation

**Frontend:**
- React + TypeScript
- Vite
- TailwindCSS
- Lucide Icons

## Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))
- Google Cloud Project with Vertex AI enabled
- Service Account JSON key for Vertex AI

### 1. Clone and Install

```bash
# Install Python dependencies
pip install -r requirements.txt

# Install Node dependencies
npm install
```

### 2. Configure Environment

Create a `.env` file in the root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_CLOUD_PROJECT=your_gcp_project_id
GOOGLE_APPLICATION_CREDENTIALS=vertex-ai-key.json
GCP_REGION=us-central1
```

Place your Google Cloud service account JSON file as `vertex-ai-key.json` in the root directory.

### 3. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Usage

### Create a Single Post

1. Click "Create Post"
2. Select a template (AI Model, Book Blog, Aesthetic, or Luxury Life)
3. Add custom prompt (optional)
4. Choose tone
5. Schedule or save as draft
6. Click "Generate Post"

### Create a Campaign

1. Click "Create Campaign"
2. Name your campaign
3. Select template
4. Choose frequency (1x, 2x, or 3x daily)
5. Set number of posts (1-90)
6. Pick start date
7. Click "Create Campaign"

The system will generate all posts with automatic scheduling.

## Templates

### 👤 Virtual Influencer
Photorealistic lifestyle content featuring diverse people, fashion, travel, food, and aesthetic scenes. Natural poses in real-world locations like NYC streets, Parisian cafes, Malibu beaches. Perfect for lifestyle inspiration and modern social media content.

### 📚 Book Blog
Cozy reading content with literary charm. Aesthetic book flat lays, reading nooks, coffee moments. Ideal for book recommendations, quotes, and reading insights.

### ✨ Aesthetic Blog
Minimal, dreamy content for aesthetic enthusiasts. Soft pastels, artistic compositions, modern minimalism. Great for inspiring quotes and mindful moments.

### 💎 Luxury Life
Premium lifestyle content with sophisticated elegance. High-end fashion, exotic travel, luxury cars, elegant interiors. Showcases exclusive experiences and refined living.

### ✏️ Custom
Create anything you imagine! Describe exactly what you want - person, object, scene, mood, style - and the AI will generate it. Completely flexible and user-defined.

## API Endpoints

### Templates
- `GET /api/templates` - List all templates
- `GET /api/templates/{id}` - Get template details

### Posts
- `GET /api/posts` - List all posts
- `POST /api/posts` - Create a new post
- `GET /api/posts/{id}` - Get post details
- `DELETE /api/posts/{id}` - Delete a post
- `PATCH /api/posts/{id}/status` - Update post status

### Campaigns
- `GET /api/campaigns` - List all campaigns
- `POST /api/campaigns` - Create a new campaign
- `GET /api/campaigns/{id}` - Get campaign details
- `DELETE /api/campaigns/{id}` - Delete a campaign
- `PATCH /api/campaigns/{id}/status` - Update campaign status

## Project Structure

```
orchestrator/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── config.py            # Settings
│   ├── models.py            # Pydantic models
│   ├── services/
│   │   └── gemini_service.py # AI integration
│   └── routers/
│       ├── templates.py     # Template endpoints
│       ├── posts.py         # Post endpoints
│       └── campaigns.py     # Campaign endpoints
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── CreatePost.tsx   # Post creation
│   │   └── CreateCampaign.tsx # Campaign creation
│   ├── App.tsx              # Root component
│   ├── api.ts               # API client
│   └── main.tsx             # Entry point
├── package.json
├── requirements.txt
└── README.md
```

## Deployment

See [RENDER_DEPLOY.md](./RENDER_DEPLOY.md) for quick deployment to Render.com, or [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment guide.

## Next Steps

- [x] Add image generation (Vertex AI Imagen 3.0)
- [x] Natural human-like captions
- [x] Custom template support
- [ ] Integrate social media APIs (Instagram, Facebook, Twitter)
- [ ] Add database (PostgreSQL, MongoDB) for persistent storage
- [ ] Implement user authentication
- [ ] Add analytics and performance tracking
- [ ] Build content approval workflow
- [ ] Export posts as CSV/JSON
- [ ] Add image editing capabilities

## License

MIT
