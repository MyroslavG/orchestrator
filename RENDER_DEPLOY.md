# Quick Deploy to Render.com

## Step-by-Step Deployment

**Note**: Render's Blueprint doesn't support static sites in YAML, so we'll deploy services manually. This is actually easier!

### 1. Push to GitHub

First, initialize Git and push your code:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create main branch
git branch -M main

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

### 2. Deploy Backend on Render.com

1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Click **"New"** → **"Web Service"**
3. Click **"Connect a repository"** and select your GitHub repo
4. Configure the service:
   - **Name**: `orchestrator-backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free (or select paid for no cold starts)
5. Click **"Create Web Service"**

### 3. Configure Backend Environment Variables

Wait for the backend to build (it will fail first time - that's expected):

1. In the **orchestrator-backend** service dashboard
2. Click **"Environment"** on the left sidebar
3. Add these variables:

   | Key | Value | Example |
   |-----|-------|---------|
   | `GEMINI_API_KEY` | Your Gemini API key | AIzaSy... |
   | `GOOGLE_CLOUD_PROJECT` | Your GCP project ID | your-project-id |
   | `GCP_REGION` | us-central1 | us-central1 |

4. Click **"Save Changes"**

### 4. Add Google Cloud Credentials (Secret File)

This is the most important step for image generation!

1. Still in **orchestrator-backend** service settings
2. Scroll down to **"Secret Files"** section
3. Click **"Add Secret File"**
4. Configure:
   - **Filename**: `/etc/secrets/vertex-ai-key.json`
   - **Contents**: Open your local `vertex-ai-key.json` file and paste the entire JSON content
5. Click **"Save"**

### 5. Deploy Frontend

Now let's deploy the frontend as a static site:

1. Go back to [Render Dashboard](https://dashboard.render.com)
2. Click **"New"** → **"Static Site"**
3. Select your GitHub repository
4. Configure:
   - **Name**: `orchestrator-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: Your backend URL (e.g., `https://orchestrator-backend.onrender.com`)
6. Click **"Create Static Site"**

### 6. Test Your Deployment

#### Backend Health Check
Visit: `https://orchestrator-backend.onrender.com/health`

Should return:
```json
{"status": "healthy"}
```

#### API Documentation
Visit: `https://orchestrator-backend.onrender.com/docs`

You should see the interactive FastAPI documentation.

#### Frontend
Visit: `https://orchestrator-frontend.onrender.com`

You should see your application!

## Common Issues

### ❌ Issue: CORS errors in browser console

**Solution**:
1. Go to backend service on Render
2. Click **"Manual Deploy"** → **"Clear build cache & deploy"**
3. Wait for redeploy

### ❌ Issue: "Configure Vertex AI" placeholder images

**Solution**:
1. Double-check the Secret File is configured correctly
2. Filename must be exactly: `/etc/secrets/vertex-ai-key.json`
3. Contents must be valid JSON from Google Cloud
4. Redeploy backend service

### ❌ Issue: API calls fail from frontend

**Solution**:
1. Check `VITE_API_URL` in frontend environment variables
2. Make sure it matches your backend URL exactly
3. Redeploy frontend after changing

### ❌ Issue: Backend service keeps restarting

**Solution**:
1. Check the logs in Render dashboard
2. Look for Python errors or missing dependencies
3. Verify all environment variables are set

## Free Tier Notes

- **Cold starts**: Backend may sleep after 15 minutes of inactivity
- First request after sleep will be slow (10-30 seconds)
- Frontend is always active
- This is normal for free tier

## Upgrade Options

For better performance:
- Upgrade backend to paid plan ($7/month) to avoid cold starts
- Add PostgreSQL database for persistent storage
- Add custom domain

## Next Steps

1. Test all features (create posts, campaigns, etc.)
2. Monitor logs for any errors
3. Consider adding a database for production use
4. Set up monitoring/alerts

## Need Help?

- Full deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Render docs: [https://render.com/docs](https://render.com/docs)
- Check service logs in Render dashboard for errors
