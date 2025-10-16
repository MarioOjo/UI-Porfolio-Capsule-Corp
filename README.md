# Capsule Corp — UI Portfolio

This repository contains a full-stack demo: a Vite + React frontend and a Node.js/Express backend with a MySQL database. It’s configured for easy deployment to Render (frontend + backend) and can use Railway for MySQL hosting.

Quick links
- Frontend: `frontend/`
- Backend: `backend/`
- SQL migrations and seeds: `backend/sql/`

Quick start (dev)
- Frontend:
  - cd frontend
  - npm install
  - npm run dev
- Backend:
  - cd backend
  - npm install
  - npm start (or `npm run dev` during local development if you use nodemon)

Deployment notes
- Render:
  - The repo includes a `render.yaml` blueprint. Render can create one static service (frontend) and one web service (backend). The backend should use Root Directory `backend` and Start Command `npm start`.
  - IMPORTANT: Vite environment variables (VITE_*) are build-time. Set them in the Render static site settings and redeploy to apply changes.
- Railway MySQL:
  - Railway provides both private and public connection options. Private variable references (e.g. `${{ MySQL.MYSQL_URL }}`) only resolve inside Railway — external hosts like Render must use the expanded literal connection string (copy it from Railway and paste into Render env).

Environment variables (high-level)
- Frontend (set on Render static site):
  - VITE_API_BASE — full backend URL (including scheme)
  - VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID, etc.
- Backend (set on Render web service):
  - MYSQL_URL (or RAILWAY_MYSQL_URL / DATABASE_URL) — literal connection string from Railway if using Railway MySQL
  - FRONTEND_ORIGINS — comma-separated allowed origins for CORS (include schemes)
  - CLOUDINARY_URL (optional for image uploads)

More docs
- Detailed backend deployment instructions: `backend/RENDER_DEPLOY.md`
- Backend developer notes: `backend/README.md`

If you want, I can further shorten the `docs/archive/` contents or remove archived files entirely. I left all detailed docs accessible in `docs/archive/` to avoid data loss.

---
Generated on 2025-10-16
