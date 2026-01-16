# Deploy to Railway

## Quick Deployment Guide

Railway offers $5 free credit per month, perfect for hosting full-stack apps!

---

## Step 1: Push to GitHub

```bash
# Commit all changes
git add .
git commit -m "Configure for Railway deployment"

# Push to GitHub
git push -u origin main
```

---

## Step 2: Deploy on Railway

### A. Create Account & New Project

1. Go to [railway.app](https://railway.app/)
2. Click **"Start a New Project"**
3. Sign in with GitHub
4. Click **"Deploy from GitHub repo"**
5. Select your `orchestrator` repository
6. Click **"Deploy Now"**

Railway will automatically detect it's a Python + Node.js project and start building.

---

## Step 3: Add Environment Variables

After deployment starts:

1. Click on your project
2. Click **"Variables"** tab
3. Add these environment variables:

### Required Variables:

| Variable Name | Value |
|--------------|-------|
| `GEMINI_API_KEY` | Your Gemini API key |
| `GOOGLE_CLOUD_PROJECT` | Your GCP project ID |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | Paste entire contents of vertex-ai-key.json |
| `GCP_REGION` | us-central1 |
| `PORT` | 8000 |

4. Click **"Add"** for each variable

---

## Step 4: Get Your Deployment URL

1. Go to **"Settings"** tab
2. Scroll to **"Domains"**
3. Click **"Generate Domain"**
4. Copy your Railway URL (e.g., `https://orchestrator-production.up.railway.app`)

---

## Step 5: Update Frontend API URL

Since Railway deploys both frontend and backend together:

1. Go back to **"Variables"** tab
2. Add one more variable:
   - **Name**: `VITE_API_URL`
   - **Value**: Your Railway URL from Step 4
3. Click **"Add"**
4. Railway will automatically redeploy

---

## Step 6: Test Your Deployment

### Health Check
Visit: `https://your-app.up.railway.app/health`

Should return:
```json
{"status": "healthy"}
```

### API Documentation
Visit: `https://your-app.up.railway.app/docs`

### Frontend
Visit: `https://your-app.up.railway.app/`

---

## Troubleshooting

### Issue: Build fails with "mise ERROR"

**Solution**: The `nixpacks.toml` and `railway.json` files should fix this. If still failing:

1. Go to **"Settings"** → **"Deploy"**
2. Set **Builder** to: `NIXPACKS`
3. Redeploy

### Issue: "Module not found" errors

**Solution**:
1. Check that both `requirements.txt` and `package.json` are in the root
2. Verify the build command includes both: `pip install -r requirements.txt && npm install`

### Issue: Frontend loads but API calls fail

**Solution**:
1. Make sure `VITE_API_URL` is set to your Railway domain
2. Check that backend routes are prefixed with `/api`
3. Look at Railway logs for errors

### Issue: Image generation fails

**Solution**:
1. Verify `GOOGLE_APPLICATION_CREDENTIALS_JSON` contains the full JSON
2. Check Railway logs for Vertex AI errors
3. Ensure GCP project has Vertex AI API enabled

---

## Railway Features

### ✅ Advantages:
- **$5 free credit/month** (enough for hobby projects)
- **Automatic HTTPS**
- **GitHub integration** (auto-deploy on push)
- **Easy environment variables**
- **Built-in metrics and logs**
- **No sleep/cold starts** (unlike free Render)

### ⚠️ Limitations:
- Free credit runs out ($5/month usage)
- After free credit: ~$0.01/hour (~$7/month)

---

## Monitoring Usage

1. Go to Railway Dashboard
2. Click your project
3. View **"Usage"** tab
4. Monitor your $5 credit

**Tip**: Railway shows estimated monthly cost. If exceeding $5, consider:
- Upgrading to paid plan
- Using Vercel (more generous free tier)
- Optimizing to reduce usage

---

## Automatic Deployments

Railway automatically deploys when you push to GitHub:
- Push to `main` branch → Production deployment
- All branches → Preview deployments

---

## Custom Domain (Optional)

1. Go to **"Settings"** → **"Domains"**
2. Click **"Custom Domain"**
3. Add your domain
4. Update DNS records as shown
5. Update `VITE_API_URL` to your custom domain

---

## Environment Management

### View Logs
1. Click your project
2. Click **"Deployments"** tab
3. Click latest deployment
4. View **"Logs"** for debugging

### Restart Service
1. Go to **"Settings"**
2. Click **"Restart"**

---

## Updating Your App

Just push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push
```

Railway automatically detects changes and redeploys!

---

## Adding a Database (Optional)

Railway makes it easy to add databases:

1. Click **"New"** in your project
2. Select **"Database"** → Choose type (PostgreSQL, MySQL, Redis, etc.)
3. Railway automatically adds connection URL to environment variables
4. Update your backend to use the database

---

## Cost Optimization Tips

1. **Monitor usage regularly** in the Usage tab
2. **Optimize image sizes** - large responses cost more bandwidth
3. **Cache responses** where possible
4. **Set usage limits** in Railway settings
5. **Consider Vercel** if approaching $5 limit (Vercel has higher free tier)

---

## Need Help?

- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status](https://status.railway.app/)

---

## Comparison: Railway vs Vercel

| Feature | Railway | Vercel |
|---------|---------|--------|
| Free tier | $5 credit/month | Generous free tier |
| Backend | Full server | Serverless functions |
| Database | Easy to add | External only |
| Cold starts | No | Yes (serverless) |
| Best for | Full-stack apps | JAMstack/Serverless |

**Recommendation**:
- Use **Railway** if you need persistent server + easy database
- Use **Vercel** if you're okay with serverless + want more free usage
