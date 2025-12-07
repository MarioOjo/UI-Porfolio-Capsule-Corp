# Deployment Guide - Render

This application is configured to deploy on **Render** with separate services for frontend and backend.

## Prerequisites

1. **MongoDB Atlas Account** (already set up)
   - Get your connection string from Atlas dashboard
   - Format: `mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>`

2. **Render Account** (Free)
   - Sign up at https://render.com
   - Connect your GitHub repository

3. **Cloudinary Account** (for image uploads)
   - Get credentials from https://cloudinary.com/console

4. **Email Service** (Nodemailer/Resend)
   - SMTP credentials for contact form emails

## Quick Deploy

### Option 1: Blueprint (Recommended - One Click)

1. Push this code to GitHub
2. Go to Render Dashboard → New → Blueprint
3. Connect your GitHub repo: `MarioOjo/UI-Porfolio-Capsule-Corp`
4. Render will auto-detect `render.yaml` and create both services
5. Add the required environment variables (see below)

### Option 2: Manual Setup

#### Backend Service
1. New → Web Service
2. Connect GitHub repo: `MarioOjo/UI-Porfolio-Capsule-Corp`
3. Settings:
   - **Name**: `capsule-corp-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
4. Add environment variables (see below)

#### Frontend Service
1. New → Web Service
2. Connect GitHub repo: `MarioOjo/UI-Porfolio-Capsule-Corp`
3. Settings:
   - **Name**: `capsule-corp-frontend`
   - **Root Directory**: `frontend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free
4. Add environment variables:
   - `VITE_API_BASE`: `https://capsule-corp-backend.onrender.com` (your backend URL)

## Required Environment Variables

### Backend (`capsule-corp-backend`)

```env
# Required - Database
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/capsule_corp

# Required - Auth
JWT_SECRET=<generate-random-string>

# Required - Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# Required - Email (Contact Form)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your-email>
EMAIL_PASS=<your-app-password>

# Auto-set by Render
NODE_ENV=production
PORT=10000

# Frontend URL (update after frontend deploys)
FRONTEND_ORIGIN=https://capsule-corp-frontend.onrender.com
```

### Frontend (`capsule-corp-frontend`)

```env
# Required - API Connection
VITE_API_BASE=https://capsule-corp-backend.onrender.com

# Optional - Firebase (if using social auth)
VITE_FIREBASE_API_KEY=<your-key>
VITE_FIREBASE_AUTH_DOMAIN=<your-domain>
VITE_FIREBASE_PROJECT_ID=<your-project-id>

# Auto-set by Render
NODE_ENV=production
PORT=10000
```

## Deployment Steps

1. **Deploy Backend First**
   - Push code to GitHub
   - Create backend service on Render
   - Add all backend environment variables
   - Note the backend URL: `https://capsule-corp-backend.onrender.com`
   - Wait for deployment (5-10 minutes on free tier)
   - Test health check: `https://capsule-corp-backend.onrender.com/health`

2. **Deploy Frontend**
   - Create frontend service on Render
   - Set `VITE_API_BASE` to your backend URL
   - Wait for build & deployment
   - Frontend URL: `https://capsule-corp-frontend.onrender.com`

3. **Update CORS**
   - Go back to backend environment variables
   - Set `FRONTEND_ORIGIN=https://capsule-corp-frontend.onrender.com`
   - Trigger redeploy (or it will auto-redeploy)

## Important Notes

### Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month per service (enough for 24/7 uptime)

### Custom Domain (Optional)
1. Go to service Settings → Custom Domain
2. Add your domain: `capsulecorps.dev`
3. Update DNS records as instructed by Render
4. Update `FRONTEND_ORIGIN` and `VITE_API_BASE` accordingly

### Monitoring
- View logs: Service → Logs (real-time)
- Health checks: Automatic via `/health` endpoint
- Metrics: Service → Metrics tab

## Troubleshooting

### Backend won't start
- Check logs for MongoDB connection errors
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas Network Access (allow Render IPs: 0.0.0.0/0)

### Frontend can't reach backend
- Verify `VITE_API_BASE` is set correctly
- Check backend `FRONTEND_ORIGIN` matches frontend URL
- Check backend `/health` endpoint is accessible

### Build failures
- Check Node version (`>=18.0.0`)
- Review build logs in Render dashboard
- Verify all dependencies are in `package.json`

## Rollback

If deployment fails, use Render's dashboard:
1. Go to service → Events
2. Find previous successful deploy
3. Click "Rollback"

## CI/CD

Render automatically deploys when you push to the `main` branch. To disable:
1. Service Settings → Build & Deploy
2. Toggle "Auto-Deploy" off
3. Deploy manually via dashboard

## Comparison with Railway

| Feature | Railway | Render |
|---------|---------|--------|
| MongoDB Support | ✅ | ✅ |
| Free Tier | ❌ (credit-based) | ✅ 750hrs/mo |
| Auto-sleep | ✅ | ✅ |
| Custom Domains | ✅ | ✅ |
| Build Time | Faster | Slower (free tier) |
| Ease of Use | Excellent | Good |

## Next Steps

1. [ ] Push code to GitHub
2. [ ] Sign up for Render
3. [ ] Deploy backend service
4. [ ] Deploy frontend service
5. [ ] Test production site
6. [ ] Set up custom domain (optional)
7. [ ] Delete Railway services (after confirming Render works)
