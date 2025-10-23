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

## Runtime env.json (optional)

This project supports a runtime `env.json` file served from the frontend root (useful for static hosts where build-time VITE_* vars aren't available). Place a file at `frontend/public/env.json` (or generate it during deployment) with the same shape as `frontend/public/env.template.json`.

Security note: Do not commit secrets (private keys) to the repository. The template contains only placeholders for public client keys (Firebase client config) and the public `VITE_API_BASE` URL.

Local testing checklist
1. Start the backend (from the `backend` folder):

```powershell
cd backend
npm install    # if you haven't already
npm run dev    # or `npm start`
```

2. Confirm the backend serves runtime values (provided by the server) and the products API:

```powershell
# check runtime env served by backend
curl -sS -D - "http://localhost:5000/env.json" -o /dev/stdout

# check products endpoint
curl -sS -D - "http://localhost:5000/api/products" -o /dev/stdout
```

3. Start the frontend dev server (from the `frontend` folder):

```powershell
cd frontend
npm install
npm run dev
```

4. Open `http://localhost:5173` in your browser. The app will fetch `/env.json` at startup (no-build required) and use the values for `VITE_API_BASE` and Firebase client config.

If you prefer to provide values at build time, set `VITE_API_BASE` and the `VITE_FIREBASE_*` env vars in your CI/hosting build step and rebuild the frontend.

Fastest fix for deployed site (no rebuild)
---------------------------------------
If your deployed frontend is returning index.html for `/api/*` requests, point the frontend to the running backend using a runtime `env.json` file. Create a file named `env.json` at the root of your deployed frontend (same place as `index.html`) with this content:

```json
{
  "VITE_API_BASE": "https://invigorating-mercy-production-9989.up.railway.app"
}
```

This tells the client to call the backend at the correct Railway hostname. The frontend is already configured to fetch `/env.json` at startup and will use `VITE_API_BASE` from that file.

Quick CI/PowerShell snippet (generate env.json during deploy)

```powershell
# Example: in your CI or deploy step, write env.json from secure env var FRONTEND_API
$envJson = @{ VITE_API_BASE = $env:FRONTEND_API } | ConvertTo-Json
Set-Content -Path "frontend/dist/env.json" -Value $envJson -Encoding utf8
```

Or in a Unix-like CI shell:

```sh
echo "{ \"VITE_API_BASE\": \"${FRONTEND_API}\" }" > frontend/dist/env.json
```

Notes
- Keep `frontend/public/env.template.json` as the template, but do not commit actual `env.json` to the repo.
- I added `.gitignore` to ignore `frontend/public/env.json` to prevent accidental commits.
