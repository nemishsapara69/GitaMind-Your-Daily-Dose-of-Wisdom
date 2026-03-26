# 🚀 Deployment & Fix Guide

## Issues Fixed

### 1. ✅ CORS Configuration
Updated `server/server.js` with proper CORS handling:
- Added whitelist of allowed origins
- Configured proper headers and methods
- Allows requests from both localhost (development) and production domains

### 2. ✅ Environment Variables
Created/updated environment files:
- **server/.env** - MongoDB URI, JWT Secret, Google OAuth
- **client/.env** - Default development API URL
- **client/.env.production** - Production API URL pointing to Render backend

### 3. ✅ Production API URL
Set `VITE_API_URL=https://gitamind-api.onrender.com/api` in production

---

## Setup Instructions

### Local Development

**Server Setup:**
```bash
cd server
npm install
# Make sure MongoDB is running locally or update MONGODB_URI in .env
npm run dev
```

**Client Setup:**
```bash
cd client
npm install
npm run dev
```

### Production Deployment

**Render Backend (server/):**
1. Connect GitHub repository to Render
2. Set environment variables in Render dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `PORT`: 5000
   - `NODE_ENV`: production

**Vercel Frontend (client/):**
1. Connect GitHub repository to Vercel
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variables:
   - `VITE_API_URL`: `https://gitamind-api.onrender.com/api`
   - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth client ID (same as backend)

---

## Troubleshooting

### "CORS policy error"
- ✅ Already fixed in server.js with proper CORS whitelist
- Verify `VITE_API_URL` is set correctly in frontend environment

### "API not responding"
- Check MongoDB connection in server logs
- Verify backend is running on Render
- Check network tab in browser dev tools for actual API URL being used

### "Login/Google Sign-in not working"
- Ensure `VITE_GOOGLE_CLIENT_ID` matches `GOOGLE_CLIENT_ID` in backend
- Verify Google API credentials are correctly configured
- Check browser console for specific error messages

### "Cannot GET /chapters"
- Ensure server is running
- Check MongoDB connection
- Verify API URL is correct

---

## Database Setup

**MongoDB Atlas (Recommended):**
1. Create account at https://www.mongodb.com/atlas
2. Create a cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/gitamind`
4. Add `MONGODB_URI` to server/.env

**Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/gitamind
```

---

## Quick Start Checklist

- [ ] Server .env configured with MongoDB URI and JWT Secret
- [ ] Client environment variables set (VITE_API_URL)
- [ ] MongoDB running/accessible
- [ ] Backend runs: `npm run dev` in server/
- [ ] Frontend runs: `npm run dev` in client/
- [ ] No CORS errors in browser console
- [ ] Login page loads
- [ ] Can fetch chapters from API

---

## Important Files

- **server/server.js** - CORS configuration
- **server/.env** - Server environment variables
- **client/.env.production** - Production API URL
- **client/src/services/api.js** - API client configuration
