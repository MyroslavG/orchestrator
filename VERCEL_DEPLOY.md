# Deploy to Vercel

## Quick Deployment Guide

Vercel provides free hosting for both frontend and backend (serverless functions). This is perfect for our full-stack app!

### Prerequisites

1. GitHub account with your code pushed
2. [Vercel account](https://vercel.com/signup) (free)
3. Your API keys ready

---

## Step 1: Push to GitHub

```bash
# Add all files
git add .

# Commit
git commit -m "Ready for Vercel deployment"

# Push to GitHub
git push -u origin main
```

---

## Step 2: Deploy on Vercel

### A. Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your `orchestrator` repository
5. Click **"Import"**

### B. Configure Project

Vercel will auto-detect the settings, but verify:

- **Framework Preset**: Vite
- **Root Directory**: `./` (leave as is)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

Click **"Deploy"** to continue (it will fail first time - that's expected, we need to add environment variables)

---

## Step 3: Add Environment Variables

After the first deploy attempt:

1. Go to your project dashboard on Vercel
2. Click **"Settings"** tab
3. Click **"Environment Variables"** in the left sidebar
4. Add these variables:

### Required Variables:

| Variable Name | Value | Where to get it |
|--------------|-------|-----------------|
| `GEMINI_API_KEY` | Your Gemini API key | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `GOOGLE_CLOUD_PROJECT` | Your GCP project ID | Google Cloud Console |
| `GCP_REGION` | `us-central1` | Default region |
| `VITE_API_URL` | Leave empty for now | We'll add this after first deploy |

5. Click **"Save"** for each variable

---

## Step 4: Add Google Cloud Credentials

This is important for Imagen image generation!

### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Link your project:
   ```bash
   vercel link
   ```

4. Add the secret file:
   ```bash
   vercel secrets add vertex-ai-key "$(cat vertex-ai-key.json)"
   ```

### Option B: Manual Setup (Alternative)

Since Vercel doesn't support file uploads in environment variables, we'll use a workaround:

1. Open your `vertex-ai-key.json` file
2. Copy the entire JSON content
3. In Vercel dashboard → Settings → Environment Variables
4. Add a new variable:
   - Name: `GOOGLE_APPLICATION_CREDENTIALS_JSON`
   - Value: Paste the entire JSON content
5. Save

Then we'll need to update the backend to handle this (I'll help with that if needed)

---

## Step 5: Update API URL

After your first successful deployment:

1. Vercel will give you a deployment URL (e.g., `https://orchestrator-abc123.vercel.app`)
2. Go back to **Settings** → **Environment Variables**
3. Update `VITE_API_URL`:
   - Set it to: `https://orchestrator-abc123.vercel.app`
   - Use your actual Vercel URL
4. Save
5. Go to **Deployments** tab
6. Click **"Redeploy"** on the latest deployment

---

## Step 6: Test Your Deployment

### Frontend
Visit your Vercel URL: `https://orchestrator-abc123.vercel.app`

### Backend API Health Check
Visit: `https://orchestrator-abc123.vercel.app/api/health`

Should return:
```json
{"status": "healthy"}
```

### API Documentation
Visit: `https://orchestrator-abc123.vercel.app/api/docs`

---

## Troubleshooting

### Issue: "Module not found" errors

**Solution**: Make sure all dependencies are in `requirements.txt` and `package.json`

### Issue: API routes not working

**Solution**:
1. Check that `vercel.json` is in the root directory
2. Make sure backend routes are prefixed with `/api`
3. Redeploy

### Issue: Image generation fails

**Solution**:
1. Verify `GOOGLE_APPLICATION_CREDENTIALS_JSON` is set
2. Check Vercel function logs for errors
3. Make sure your GCP project has Vertex AI API enabled

### Issue: Cold starts / Slow first request

**Solution**: This is normal for free tier. Vercel serverless functions sleep after inactivity. First request wakes them up (can take 10-30 seconds).

---

## Vercel Free Tier Limits

- ✅ Unlimited deployments
- ✅ Unlimited bandwidth
- ✅ 100GB bandwidth per month
- ✅ Serverless functions (10 second timeout)
- ⚠️ Functions sleep after inactivity (cold starts)

---

## Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `VITE_API_URL` to use your custom domain

---

## Automatic Deployments

Vercel automatically deploys when you push to GitHub:
- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment

---

## Next Steps

- ✅ Monitor function logs in Vercel dashboard
- ✅ Set up notifications for failed deployments
- ✅ Consider upgrading to Pro for better performance
- ✅ Add a database (Vercel offers Postgres, or use external services)

---

## Important Notes

1. **Environment Variables**: Added via Vercel dashboard, not in code
2. **Secrets**: Never commit API keys or credentials to GitHub
3. **Backend**: Runs as serverless functions (stateless)
4. **Storage**: No persistent file storage (use cloud storage for generated images)

---

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
