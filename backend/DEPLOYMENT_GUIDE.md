# Deployment Guide — Backend + MySQL on Railway (Private network)

This guide explains how to host the backend and MySQL database on Railway using a private network, how to wire the frontend to the backend, and how to migrate your local XAMPP (phpMyAdmin) database to Railway.

Prerequisites
- Railway account and Railway CLI (optional)
- Access to your project repository (this repo)
- Local access to XAMPP/phpMyAdmin to export the SQL dump

Notes about the code
- The backend already accepts a single connection string environment variable (e.g. `MYSQL_URL` or `DATABASE_URL`) as well as the split env vars (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`).
- If your DB provider requires SSL, set `DB_SSL=true` and optionally `DB_SSL_CA_B64` with the CA certificate base64 encoded.

1) Create Railway project + MySQL plugin
- In Railway, create a new project.
- Add the MySQL plugin (Add Plugin -> MySQL). Wait for deployment. Railway will generate a connection string like:

  mysql://railway_user:railway_pass@gondola.proxy.railway.net:3306/railway_db

2) Add backend service (in same Railway project)
- Add a new service and connect your backend code (either by selecting the repo and pointing Railway at the `backend/` directory, or add the repo root and set the service's "Root Directory" to `backend`).
- If Railway does not provide a root-directory option, set the Start Command to run from the backend folder. Example Start Command:

  npm --prefix backend install; npm --prefix backend start

or explicitly in PowerShell style (if required by your deploy environment):

  npm --prefix backend install; npm --prefix backend start

(Railway will usually run `npm start` in the detected package.json; ensure it uses the `backend/package.json`.)

3) Set environment variables for backend
- Add the connection string Railway gave you as `MYSQL_URL` (or `DATABASE_URL`) in the backend service's Environment tab. The backend code will parse this URL.
- Also add (example):
  - `NODE_ENV` = `production`
  - `FRONTEND_ORIGINS` = `https://your-frontend-url` (or a comma-separated list)
  - Any other keys you use (email, cloudinary keys, etc.)

4) Ensure private networking
- If Railway shows a private or internal connection variable or toggle, use that for the backend. Creating both the DB plugin and the backend service in the same Railway project typically allows internal/private connectivity. If Railway marks the DB as "private", the backend should be able to connect without making the DB publicly accessible.

5) Deploy backend and verify
- Deploy the backend service in Railway. Open logs and look for the successful DB connection message (the backend prints something like "Database connected (...) to 'railway_db'" and then "Server successfully listening on port ...").
- Health check: request `GET /health` on your backend URL. You should get a JSON response `{ ok: true, db: 'up' }`.

6) Deploy frontend and set `VITE_API_BASE`
- Deploy the frontend on Railway or any static host (Vercel, Netlify, Render). In the frontend service environment variables set:
  - `VITE_API_BASE` = `https://your-backend-service-url` (no trailing slash)
- Rebuild the frontend after changing env vars so Vite picks up `VITE_API_BASE` at build time.

7) Migrating your local XAMPP MySQL to Railway
- Export from phpMyAdmin (or `mysqldump`):

  # Using mysqldump on Windows PowerShell (example)
  mysqldump -u root -p capsule_db > capsule_db_dump.sql

- Option A — Import via Railway dashboard/console
  - Railway dashboard often provides a "Connect" or SQL console UI you can use to run the SQL dump contents directly. Paste the SQL or upload if they support it.

- Option B — Import with mysql CLI (if DB allows public connection)
  - If Railway's DB is publicly accessible (or if you temporarily enable public access for the import), run:

  mysql -h <DB_HOST> -P <DB_PORT> -u <DB_USER> -p <DB_NAME> < capsule_db_dump.sql

  Replace `<DB_HOST>`, `<DB_PORT>`, `<DB_USER>`, and `<DB_NAME>` with the values from Railway. You will be prompted for the password.

- Option C — If the DB is private-only and you cannot connect from your machine
  - Use Railway's console/import feature, or use the Railway CLI (if available) to run a one-off migration inside Railway's network. The Railway dashboard "Connect" button gives guidance.

8) Troubleshooting
- If backend logs show `ECONNREFUSED`:
  - Confirm `MYSQL_URL` is correct and service can reach host/port. Check Railway network settings and that the backend and DB are in same project for private networking.
- If `Unknown database` or `ER_BAD_DB_ERROR`:
  - Ensure the DB name in the URL is correct. The backend attempts to create the database if missing but that requires the DB user to have sufficient privileges.
- If SSL required errors occur:
  - Set `DB_SSL=true` in env vars. If the provider requires a CA, provide `DB_SSL_CA_B64` with the CA in base64 or `DB_SSL_CA` with the raw CA.

9) Final checks
- After import and successful backend deployment, open your frontend and confirm API routes (e.g., `/api/products`) return data.
- Use the network tab in devtools to confirm the frontend uses the backend URL and not localhost.

If you'd like, I can also:
- Add a short startup log in `server.js` to print the resolved DB host and port (with password masked) so you can confirm which host it tries to connect to in logs.
- Help import your SQL dump into Railway if you upload it or paste the connection string (mask the password) and I can tell you exact import commands.

---
End of guide.
