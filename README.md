# Capsule Corp — UI Portfolio

This repository contains a full-stack demo: a Vite + React frontend and a Node.js/Express backend with MongoDB. It's configured for easy deployment to Render (frontend + backend).

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
  - `MONGO_URI` (MongoDB Atlas connection string)
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


## 🚀 Database Sync to Production (NEW!)

**No more manual SQL scripts!** We now have automated database sync.

### Quick Sync
```powershell
# From repo root
.\scripts\sync-to-production.ps1
```



### Load Helper Commands
```powershell
# Get shortcuts: sync, dbtest, dbbackup
. .\scripts\sync-helpers.ps1

# Then use shortcuts
sync              # Full sync
sync -DryRun      # Preview only
sync -Fast        # Quick (skip backup)
dbtest            # Check local DB health
dbbackup          # Manual backup
```

**📖 Full documentation:** See [scripts/SYNC_README.md](scripts/SYNC_README.md)

---

## Bootstrapping dependencies (recommended)

This repo keeps frontend and backend projects separate. To make local setup reliable and avoid accidentally committing `node_modules`, follow the steps below.

- Install dependencies once per machine:

  PowerShell (Windows):

  ```powershell
  # from repo root
  .\scripts\bootstrap.ps1
  ```

  POSIX/macOS/Linux:

  ```bash
  # from repo root
  ./scripts/bootstrap.sh
  ```

- These scripts will run `npm ci` if a lockfile exists, otherwise `npm install` for each project (`frontend` and `backend`).

- If you prefer to keep `node_modules` versioned (not recommended), see the project lead for instructions — by default `node_modules` is ignored.
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
  "VITE_API_BASE": "https://your-backend-app.onrender.com"
}
```

This tells the client to call the backend at the correct hostname. The frontend is already configured to fetch `/env.json` at startup and will use `VITE_API_BASE` from that file.

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
