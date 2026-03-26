# 🔴 URGENT: Fix Render Environment Variables

Your backend is crashing because environment variables are not set on Render.

## ❌ Current Issue

- **500 Errors**: Backend is crashing on API calls
- **Google Login Failing**: Missing GOOGLE_CLIENT_ID
- **Chapters Not Loading**: MongoDB not connected

## ✅ Fix: Add Render Environment Variables

### Step 1: Go to Render Dashboard
1. Visit https://render.com/dashboard
2. Find your service: **gitamind-api**
3. Click on it

### Step 2: Add Environment Variables

Click **"Environment"** → **"Add Environment Variable"**

Add these variables ONE BY ONE:

| Variable | Value | Example |
|----------|-------|---------|
| `MONGODB_URI` | Your MongoDB Atlas connection string | `mongodb+srv://username:password@cluster.mongodb.net/gitamind` |
| `JWT_SECRET` | Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` | Copy entire output |
| `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID | `561874748691-rhhn23on2di4cn71d6nlblmsq6kuktfc.apps.googleusercontent.com` |
| `PORT` | Leave as 5000 | `5000` |
| `NODE_ENV` | Set to production | `production` |

### Step 3: Deploy

- Render will auto-redeploy after you save
- Wait 2-3 minutes for the build to complete
- Test: Visit https://gitamind-api.onrender.com/health

---

## 📝 Getting Your Values

### MongoDB URI
1. Go to https://www.mongodb.com/cloud/atlas
2. Click your cluster → "Connect" → "Drivers"
3. Copy connection string: `mongodb+srv://...`
4. Replace `<username>:<password>` with your actual credentials

### JWT Secret
In your terminal, run:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy the entire output string.

### Google Client ID
Already set in your server/.env: `561874748691-rhhn23on2di4cn71d6nlblmsq6kuktfc.apps.googleusercontent.com`

---

## 🧪 Test After Setup

1. Visit: https://gitamind-api.onrender.com/health
2. Should show: `{ "status": "OK", "mongodb": "connected" }`
3. Then test your app: https://gita-mind-your-daily-dose-of-wisdom.vercel.app

---

## 💬 If Still Having Issues

Check Render logs:
1. In Render dashboard → Your service
2. Click "Logs" tab
3. Look for errors like "MONGODB_URI" or "JWT_SECRET"
4. Add missing variable and redeploy

