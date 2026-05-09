# Deployment Guide: Render (Backend) + Vercel (Frontend)

## PART 1: DEPLOY BACKEND TO RENDER

### Step 1: Prepare Backend for Production

1. Update your `.env` file for production:
```bash
cd /Users/sahilijaz/Desktop/NextWeb/WEEKLY/backend
```

2. Create a new file `.env.production` or update `.env`:
```
PORT=8000
NODE_ENV=production
MONGODB_URI=mongodb+srv://hssahil2913_db_user:cVm7jcS9WjomVWsm@cluster0.wuwkgr9.mongodb.net/?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024!@#$
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

3. Update `backend/server.js` to handle environment variables properly:
   - Make sure it reads from `process.env.FRONTEND_URL`
   - The CORS should allow the Vercel domain

4. Make sure `package.json` has a start script:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### Step 2: Create Git Repository (if not already one)

```bash
cd /Users/sahilijaz/Desktop/NextWeb/WEEKLY
git init
git add .
git commit -m "Initial commit with backend and frontend"
```

### Step 3: Push to GitHub

1. Create a new repository on GitHub (https://github.com/new)
   - Name it something like `btms-app`
   - Don't add README/gitignore

2. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/btms-app.git
git branch -M main
git push -u origin main
```

### Step 4: Deploy Backend to Render

1. Go to https://render.com and sign up (use GitHub)

2. Click "New +" → "Web Service"

3. Connect your GitHub repository
   - Select the repository you just created
   - Authorize if needed

4. Configure the Web Service:
   - **Name:** btms-backend (or any name)
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (or Starter for better uptime)

5. Add Environment Variables:
   - Click "Add from .env"
   - Or manually add:
     - `MONGODB_URI`: (your MongoDB URI)
     - `JWT_SECRET`: (your secret key)
     - `JWT_EXPIRE`: `7d`
     - `NODE_ENV`: `production`
     - `FRONTEND_URL`: (leave blank for now, update after Vercel deployment)

6. Click "Create Web Service"

7. Wait 2-3 minutes for deployment to complete

8. **Get your Render URL** - It will look like: `https://btms-backend.onrender.com`

9. Update the environment variable:
   - Go back to your Render dashboard
   - Click on the web service
   - Go to "Environment"
   - Update `FRONTEND_URL` to your Vercel domain (once you deploy it)

---

## PART 2: DEPLOY FRONTEND TO VERCEL

### Step 1: Prepare Frontend for Production

1. Update `api-integration.js` with your Render backend URL:
```bash
cd "/Users/sahilijaz/Desktop/NextWeb/WEEKLY/project for nextweb.solutions"
```

2. Edit `api-integration.js`, change line 4:
```javascript
// BEFORE:
const API_BASE_URL = 'http://localhost:8000/api';

// AFTER:
const API_BASE_URL = 'https://btms-backend.onrender.com/api';
```

3. Commit this change:
```bash
git add api-integration.js
git commit -m "Update API URL for production"
git push
```

### Step 2: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up (use GitHub)

2. Click "Add New Project"

3. Select your GitHub repository (`btms-app`)

4. Configure the project:
   - **Framework Preset:** Other (since it's static HTML)
   - **Root Directory:** `project for nextweb.solutions`
   - Leave other settings as default

5. Click "Deploy"

6. Wait 1-2 minutes for deployment

7. **Get your Vercel URL** - It will look like: `https://btms-app.vercel.app`

### Step 3: Update Backend FRONTEND_URL

1. Go back to Render dashboard
2. Click on your backend web service
3. Go to "Environment"
4. Update `FRONTEND_URL` to: `https://btms-app.vercel.app`
5. Click "Save" - the service will redeploy automatically

---

## PART 3: VERIFY DEPLOYMENT

### Test Backend API:

```bash
curl -X POST https://btms-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser1@bahria.edu.pk",
    "password": "Test@1234"
  }'
```

Expected response:
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { ... }
}
```

### Test Frontend:

1. Open https://btms-app.vercel.app in your browser
2. Try logging in with:
   - Email: `testuser1@bahria.edu.pk`
   - Password: `Test@1234`
3. Verify you see the dashboard and your name appears

---

## PART 4: TROUBLESHOOTING

### Backend Not Responding:

1. Check Render logs:
   - Go to your Render service
   - Click "Logs" tab
   - Look for errors

2. Common issues:
   - MongoDB connection fails → verify `MONGODB_URI` in environment
   - CORS errors → update `FRONTEND_URL` in backend
   - Cold start → Render free tier sleeps after 15 min of inactivity

### Frontend Shows Errors:

1. Open browser DevTools (F12)
2. Check Console tab for JavaScript errors
3. Check Network tab - verify API calls go to `https://btms-backend.onrender.com/api`

### CORS Errors:

- Make sure `FRONTEND_URL` in Render backend matches your Vercel domain exactly
- Restart the Render service after updating environment variables

---

## IMPORTANT NOTES:

### Render:
- Free tier has cold starts (sleeps after 15 min inactivity)
- First request after sleep takes 30-50 seconds
- Upgrade to Starter ($7/month) for persistent uptime
- Check logs regularly for crashes

### Vercel:
- Free tier includes unlimited deployments
- Auto-deploys when you push to GitHub
- Serverless functions work great for static sites
- Can add serverless functions later if needed

### Security:
- Never commit `.env` files with real secrets
- Use Render/Vercel environment variables
- Change JWT_SECRET in production
- Consider rate limiting and HTTPS (both platforms provide this)

---

## QUICK REFERENCE:

**After deployment:**
- Backend: `https://btms-backend.onrender.com`
- Frontend: `https://btms-app.vercel.app`
- Update API_BASE_URL in frontend pointing to Render backend
- Update FRONTEND_URL in backend pointing to Vercel frontend

**To redeploy:**
- Push to GitHub → Vercel/Render auto-deploy
- Or manually redeploy from their dashboards
