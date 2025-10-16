# Deploy Capsule Corp on Render (Frontend + Backend)

This repo includes `render.yaml` to define two services:
- `capsulecorp-frontend`: Static site from `CAPSULE CORP` (Vite build → dist)
- `capsulecorp-backend`: Node/Express API from `backend`

## 1) Connect repo in Render
- Dashboard → New + → Blueprint → Select this repo
- Render reads `render.yaml` and creates both services

## 2) Environment variables (Backend)
Set these on `capsulecorp-backend`:
- `NODE_ENV=production`
- `FRONTEND_ORIGINS=https://capsulecorp.dev,https://www.capsulecorp.dev`
- Database: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- Email: `EMAIL_HOST`, `EMAIL_PORT=587`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO`

## 3) SPA rewrite (Frontend)
The blueprint adds a rewrite of all routes to `/index.html` so React Router works.

This file was archived to `docs/archive/DEPLOY_RENDER.md` during repository cleanup. Please open that file for full Render deployment instructions.
After first deploy, copy the Render URLs:
