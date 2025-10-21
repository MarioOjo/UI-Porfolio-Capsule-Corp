# Capsule Corp — UI Portfolio

This repository contains a full-stack demo: a Vite + React frontend and a Node.js/Express backend with a MySQL database. It’s configured for easy deployment to Render (frontend + backend) and can use Railway for MySQL hosting.

Quick links

Quick start (dev)
  - cd frontend
  - npm install
  - npm run dev
  - cd backend
  - npm install
  - npm start (or `npm run dev` during local development if you use nodemon)


  Backend image uploads
This repository contains a full-stack demo: a Vite + React frontend and a Node.js/Express backend with a MySQL database.
  - The backend accepts multipart/form-data for product images (field name `image`).
  - If `CLOUDINARY_URL` is set (e.g. `cloudinary://API_KEY:API_SECRET@CLOUD_NAME`), uploads are forwarded to Cloudinary and the returned secure URL is stored in the product `image` field.
  - If `CLOUDINARY_URL` is not set, you can provide an `imageUrl` in the request body and the server will store that URL.


Render quick checklist
- Create a Web Service in Render → Root Directory `backend` → Start Command `npm start`.
- Set backend env vars on Render:
  - `MYSQL_URL` (paste literal Railway connection string if using Railway MySQL)
  - `FRONTEND_ORIGINS` (comma-separated URLs with scheme)
  - `NODE_ENV=production`
  - `CLOUDINARY_URL` (optional)
- For frontend static site on Render set build envs:
  - VITE_API_BASE, VITE_FIREBASE_* (these are build-time; redeploy after changing them)

If anything important from the previous docs is missing, tell me what to keep and I will re-add it here. This `README.md` is the single source of truth for the repo.

---
Generated on 2025-10-16
