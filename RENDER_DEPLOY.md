# Quick Deploy to Render.com

## Step-by-Step Deployment

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

### 2. Deploy on Render.com

#### Method 1: Using Blueprint (Easiest)

1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Click **"New"** → **"Blueprint"**
3. Click **"Connect a repository"**
4. Select your GitHub repository
5. Render will detect the `render.yaml` file
6. Click **"Apply"**

This will create 2 services automatically:
- `orchestrator-backend` (Python web service)
- `orchestrator-frontend` (Static site)

#### Method 2: Manual Deploy

If you prefer manual setup, see the full [DEPLOYMENT.md](./DEPLOYMENT.md) guide.

### 3. Configure Backend Environment Variables

Once services are created:

1. Go to **orchestrator-backend** service
2. Click **"Environment"** tab
3. Add these variables:

   | Key | Value | Example |
   |-----|-------|---------|
   | `GEMINI_API_KEY` | Your Gemini API key | AIzaSyC_6qLMAWYFp4NockjUeeGgMjvEOiIlNRY |
   | `GOOGLE_CLOUD_PROJECT` | Your GCP project ID | orchestrator-484422 |
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

### 5. Configure Frontend

1. Wait for backend to finish deploying
2. Copy the backend URL (looks like: `https://orchestrator-backend.onrender.com`)
3. Go to **orchestrator-frontend** service
4. Click **"Environment"** tab
5. Update the `VITE_API_URL` variable:
   - Key: `VITE_API_URL`
   - Value: `https://orchestrator-backend.onrender.com` (your actual backend URL)
6. Click **"Save Changes"**
7. Trigger a manual deploy if needed

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
