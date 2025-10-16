```markdown
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

## 4) DNS at Name.com
After first deploy, copy the Render URLs:
- Frontend: `https://capsulecorp-frontend.onrender.com`
- Backend: `https://capsulecorp-backend.onrender.com`

Recommended custom domains:
- `capsulecorp.dev` and `www.capsulecorp.dev` → frontend
- `api.capsulecorp.dev` → backend

Create these records at Name.com:
(Use the CNAME targets Render gives in each service’s Custom Domains page.)

```
Type,Host,Answer,TTL,Priority
CNAME,@,capsulecorp-frontend.onrender.com,300,
CNAME,www,capsulecorp-frontend.onrender.com,300,
CNAME,api,capsulecorp-backend.onrender.com,300,
```

Note: Some registrars allow CNAME at apex; if Name.com does not, use their ALIAS/ANAME or switch apex to A/AAAA provided by Render (if offered). If that’s not available, set `www` as primary and 301 from apex to `www` via Name.com URL forwarding.

## 5) Update frontend API base
Set your frontend to call `https://api.capsulecorp.dev` in production. If your `api.js` reads env or window.location, adjust accordingly.

## 6) CORS
The backend now supports a comma-separated list in `FRONTEND_ORIGINS`. Put both apex and www.

## 7) SSL
Render provisions certificates once DNS points correctly. Test:
- https://capsulecorp.dev
- https://www.capsulecorp.dev
- https://api.capsulecorp.dev

## 8) Troubleshooting
- 404 on deep links → ensure the rewrite to `/index.html` is in the Static Site.
- CORS blocked → verify `FRONTEND_ORIGINS` includes your exact domain (with scheme).
- DB errors → confirm DB credentials and IP allowlist if using managed MySQL.

```
