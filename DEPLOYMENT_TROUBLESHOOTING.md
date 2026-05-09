# Deployment Troubleshooting Guide

## Issue: Login Works Locally but Not After Deployment

### Common Causes & Solutions:

---

## 1. **API URL Mismatch**

**Problem:** Frontend is still calling `localhost:8000` instead of your Render URL

**Check:**
- Open your deployed Vercel site
- Press F12 → Network tab
- Try to login
- Look at the API request URL in Network tab
- It should be `https://btms-backend.onrender.com/api/auth/login`

**Fix:**
1. Update `project for nextweb.solutions/api-integration.js` line 4:
```javascript
const API_BASE_URL = 'https://btms-backend.onrender.com/api';
```

2. Commit and push:
```bash
git add .
git commit -m "Fix API URL for production deployment"
git push
```

3. Wait for Vercel to redeploy (check Vercel dashboard)

---

## 2. **CORS Error**

**Problem:** Browser blocks request due to CORS policy

**Check in Browser Console (F12):**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Fix:**
1. Go to Render Dashboard → Your Backend Service
2. Click "Environment" tab
3. Update `FRONTEND_URL` to match your Vercel domain exactly:
   ```
   FRONTEND_URL=https://your-vercel-domain.vercel.app
   ```
4. Click "Save" (service redeploys automatically)
5. Wait 2-3 minutes for restart

**Check backend code** (`backend/server.js` line 15-18):
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

---

## 3. **MongoDB Connection Issue**

**Problem:** Backend can't connect to MongoDB on Render

**Check:**
1. Go to Render Dashboard → Your Backend Service
2. Click "Logs" tab
3. Look for error messages like:
   ```
   MongoError: connect ECONNREFUSED
   MongoNetworkError
   ```

**Fix:**
1. Verify `MONGODB_URI` in Render environment variables
2. Make sure the URI is correct:
   ```
   mongodb+srv://hssahil2913_db_user:cVm7jcS9WjomVWsm@cluster0.wuwkgr9.mongodb.net/?appName=Cluster0
   ```
3. Check MongoDB Atlas:
   - Go to https://cloud.mongodb.com
   - Sign in
   - Click your cluster
   - Check if IP whitelist allows Render's IP (usually use "Allow access from anywhere" for testing)

---

## 4. **Backend Not Responding (Cold Start)**

**Problem:** First request times out or fails

**This is normal for Render Free Tier!**

**Render free tier sleeps after 15 minutes of inactivity**
- First request after sleep takes 30-50 seconds
- This is expected behavior

**Solutions:**
- **Temporary:** Wait 50 seconds after clicking login, try again
- **Permanent:** Upgrade to Starter Plan ($7/month) on Render for persistent uptime

---

## 5. **Environment Variables Not Loading**

**Problem:** Backend crashes because environment variables are undefined

**Check Render Logs:**
1. Go to Render Dashboard → Backend Service
2. Click "Logs"
3. Look for errors like:
   ```
   TypeError: Cannot read property 'MONGODB_URI' of undefined
   ```

**Fix:**
1. Verify all variables are set in Render:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRE`
   - `NODE_ENV` (set to `production`)
   - `FRONTEND_URL`

2. After adding/updating, click "Save"

3. Render redeploys automatically

---

## 6. **Port Configuration Issue**

**Problem:** Backend running on wrong port

**Check `backend/package.json`:**
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

**Check `backend/server.js`:**
```javascript
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Render automatically assigns a PORT via environment variable**
- Your code should read `process.env.PORT`
- Don't hardcode port 8000 in production

---

## 7. **Frontend Build Issues (Vercel)**

**Problem:** Frontend deployed but shows 404 or wrong directory

**Check Vercel Settings:**
1. Go to Vercel Dashboard → Your Project
2. Click "Settings" → "Build & Development Settings"
3. Verify:
   - **Root Directory:** `project for nextweb.solutions`
   - This should match your folder structure

**If incorrect:**
1. Change it to correct path
2. Click "Save"
3. Vercel redeploys automatically

---

## 8. **Token Not Saving to LocalStorage**

**Problem:** Login succeeds but token doesn't persist

**Check in Browser Console (F12):**
```javascript
// Run this in console:
localStorage.getItem('btms_token')
```

**Should return your JWT token**

**If empty:**
1. Check `api-integration.js` line 17-19:
```javascript
setToken(token) {
  localStorage.setItem('btms_token', token);
  this.token = token;
}
```

2. Verify login API response has `token` field

---

## Step-by-Step Debugging:

### **1. Test Backend Directly:**
```bash
# Replace with your Render URL
curl -X POST https://btms-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://your-vercel-domain.vercel.app" \
  -d '{
    "email": "testuser1@bahria.edu.pk",
    "password": "Test@1234"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { "firstName": "Test", ... }
}
```

### **2. Check Browser Network Tab:**
- Open deployed site in browser
- Press F12 → Network tab
- Try to login
- Click on the login POST request
- Check:
  - URL is correct (should be your Render URL)
  - Status should be 200 (not 401, 403, 500)
  - Response body has `success: true`

### **3. Check Browser Console:**
- Press F12 → Console tab
- Look for red error messages
- Common errors:
  - `CORS policy blocked`
  - `Cannot read property 'user' of undefined`
  - `fetch failed`

### **4. Check Render Logs:**
1. Go to https://render.com
2. Click your backend service
3. Click "Logs" tab
4. Scroll to see recent errors
5. Look for:
   - MongoDB connection errors
   - CORS validation errors
   - Environment variable errors

---

## Quick Checklist:

- [ ] API URL in frontend points to Render backend (not localhost)
- [ ] `FRONTEND_URL` in Render environment matches Vercel domain
- [ ] All environment variables set in Render (MONGODB_URI, JWT_SECRET, etc)
- [ ] MongoDB Atlas whitelist allows Render IP
- [ ] Render service is running (check status: should be "Live")
- [ ] Vercel deployment shows "Ready" status
- [ ] No CORS errors in browser console
- [ ] Backend responds to direct curl request
- [ ] Token saves to localStorage after login

---

## Need More Help?

**Check These Files:**
- Render Logs: Dashboard → Service → Logs
- Vercel Logs: Dashboard → Deployments → Select deployment → Logs
- Browser Console: F12 → Console tab
- Browser Network: F12 → Network tab (after login attempt)
