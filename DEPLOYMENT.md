# Deployment Guide for Render.com

This guide will help you deploy the Orchestrator application to Render.com.

## Prerequisites

1. A [Render.com](https://render.com) account (free tier available)
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. Google Cloud Project credentials (vertex-ai-key.json)
4. Gemini API key

## Option 1: Deploy Using Blueprint (Recommended)

The `render.yaml` file in the root directory defines both services. This is the easiest way to deploy.

### Steps:

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will detect the `render.yaml` file
   - Click "Apply"

3. **Configure Environment Variables**

   For the **Backend Service**:
   - Go to the backend service in Render dashboard
   - Navigate to "Environment" tab
   - Add these environment variables:
     - `GEMINI_API_KEY`: Your Gemini API key
     - `GOOGLE_CLOUD_PROJECT`: Your Google Cloud project ID (e.g., orchestrator-484422)
     - `GCP_REGION`: us-central1

   **Important**: For `GOOGLE_APPLICATION_CREDENTIALS`:
   - Go to "Secret Files" in the backend service settings
   - Click "Add Secret File"
   - Filename: `/etc/secrets/vertex-ai-key.json`
   - Contents: Paste the entire contents of your `vertex-ai-key.json` file
   - Save

4. **Update Frontend Environment Variable**
   - Once backend is deployed, copy its URL (e.g., https://orchestrator-backend.onrender.com)
   - Go to frontend service → "Environment" tab
   - Update `VITE_API_URL` to your backend URL
   - Save and redeploy

5. **Wait for Deployment**
   - Both services will build and deploy automatically
   - Backend: Python/FastAPI service
   - Frontend: Static site with React/Vite

## Option 2: Deploy Services Manually

If you prefer to deploy each service separately:

### Deploy Backend (FastAPI)

1. **Create Web Service**
   - Dashboard → "New" → "Web Service"
   - Connect your repository
   - Configure:
     - Name: `orchestrator-backend`
     - Runtime: Python 3
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

2. **Add Environment Variables** (same as above)

3. **Add Secret File** for Google Cloud credentials (same as above)

### Deploy Frontend (React/Vite)

1. **Create Static Site**
   - Dashboard → "New" → "Static Site"
   - Connect your repository
   - Configure:
     - Name: `orchestrator-frontend`
     - Build Command: `npm install && npm run build`
     - Publish Directory: `dist`

2. **Add Environment Variable**
   - `VITE_API_URL`: Your backend URL from step 1

3. **Configure Redirects/Rewrites**
   - In the Static Site settings
   - Add rewrite rule: `/*` → `/index.html` (for SPA routing)

## Post-Deployment

### Update CORS Settings

After deployment, you may need to update the CORS origins in `backend/main.py`:

```python
allow_origins=[
    "http://localhost:5173",
    "http://localhost:3000",
    "https://your-frontend-url.onrender.com",
]
```

Then redeploy the backend.

### Verify Deployment

1. **Backend Health Check**
   - Visit: `https://your-backend-url.onrender.com/health`
   - Should return: `{"status": "healthy"}`

2. **API Endpoints**
   - Visit: `https://your-backend-url.onrender.com/docs`
   - Should show FastAPI interactive documentation

3. **Frontend**
   - Visit: `https://your-frontend-url.onrender.com`
   - Should load the application interface

## Troubleshooting

### Backend Issues

1. **Image Generation Fails**
   - Check Secret Files are properly configured
   - Verify `GOOGLE_APPLICATION_CREDENTIALS` points to `/etc/secrets/vertex-ai-key.json`
   - Check logs for Vertex AI authentication errors

2. **API Key Issues**
   - Verify `GEMINI_API_KEY` is set correctly
   - Check logs for authentication errors

3. **Build Fails**
   - Check Python version (should be 3.11.0)
   - Verify all dependencies in requirements.txt are compatible

### Frontend Issues

1. **API Calls Fail**
   - Verify `VITE_API_URL` is set to correct backend URL
   - Check browser console for CORS errors
   - Make sure backend CORS allows your frontend domain

2. **Build Fails**
   - Check Node version (should be 18.x)
   - Clear cache and rebuild

## Free Tier Limitations

- **Backend**: May spin down after 15 minutes of inactivity (cold starts)
- **Frontend**: Always active
- **Build minutes**: Limited per month
- **Database**: Consider adding persistent storage if needed

## Upgrading to Paid Plans

For production use, consider:
- Paid plan to avoid cold starts
- Add PostgreSQL database for persistent storage
- Add Redis for caching
- Set up custom domain

## Environment Variables Reference

### Backend
- `GEMINI_API_KEY`: Required - Your Google Gemini API key
- `GOOGLE_CLOUD_PROJECT`: Required - Your GCP project ID
- `GOOGLE_APPLICATION_CREDENTIALS`: Required - Path to service account JSON (use Secret Files)
- `GCP_REGION`: Optional - Default: us-central1

### Frontend
- `VITE_API_URL`: Required - Your backend service URL

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
