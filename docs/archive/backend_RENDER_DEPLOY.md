```markdown
# Deploying the backend to Render and using Railway MySQL

This guide explains how to deploy the `backend/` service to Render while using a Railway-managed MySQL instance as the database.

Key points:
- Render will host and run the Node backend.
- Railway will host the MySQL database. You'll copy Railway's connection string into Render's environment variables.
- The backend already accepts URL-style connection strings (e.g. `MYSQL_URL`, `RAILWAY_MYSQL_URL`, `DATABASE_URL`) and per-part env fallbacks.

## Render service settings (create a new Web Service)

1. In the Render dashboard -> New -> Web Service.
2. Connect the GitHub repo and select the repository `UI-Porfolio-Capsule-Corp`.
3. Set the Root Directory to `backend`.
4. Branch: select the branch you want to deploy (e.g. `main`).
5. Environment: `Node` (Node 18+ is recommended).
6. Build Command: (leave empty) — this project doesn't use a separate build step for the backend.
7. Start Command: `npm start` (Render will run `npm install` then `npm start`).
8. Plan: choose Free / Standard depending on your needs.

## Environment variables to set on Render

At a minimum set the following environment variables in the Render service settings:

- `NODE_ENV` = `production`
- `PORT` = (Render sets this automatically; you can leave unset)
- `FRONTEND_ORIGINS` = comma-separated list of allowed origins for CORS (e.g. `https://yourfrontend.onrender.com`)
- `MYSQL_URL` = (see Railway section below)

Optional/advanced (if you need SSL or specific names):
- `DB_SSL=true` and `DB_SSL_CA` or `DB_SSL_CA_B64` if Railway provides CA
- `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQLPORT` (backend will accept these as fallbacks)

Important: Prefer placing the Railway connection string into `MYSQL_URL` (or `RAILWAY_MYSQL_URL`) on Render. The backend will parse it and connect automatically.

## How to copy Railway MySQL connection string

1. In Railway, open the project that contains the MySQL plugin.
2. Click the MySQL plugin tile to open the plugin details.
3. You should see a Connection String field that looks like `mysql://user:pass@host:3306/dbname`.
4. In Railway's UI you can click the copy button to copy the value.
5. In Render's service Environment -> Add Environment Variable:
   - Name: `MYSQL_URL`
   - Value: paste the Railway connection string (exactly as copied). Save it.

Notes about private networking:
- Railway private networking only works inside Railway projects (services/plugins in the same Railway project). That means Render cannot use Railway's private network—Render will connect over the public IP/host provided in the connection string. If your Railway MySQL is set to private-only, you'll need to enable a public connection or host the backend inside Railway as well.

## Verifying the connection

1. Deploy the Render service. In Render's deploy logs you should see `🔋 Database connected` and the masked `Resolved DB config` log lines.
2. After deployment, open the service URL and hit `/health` (e.g. `https://your-backend.onrender.com/health`). You should get a JSON response `{ ok: true, db: 'up' }` if successful.
3. If DB connection fails, check Render logs for errors like `ER_BAD_DB_ERROR` (missing DB) or `ECONNREFUSED` (network/host unreachable).

## If Railway database is private-only

Railway private networking restricts access to services inside that Railway project. If your MySQL is private-only, you have three options:

1. Host the backend inside Railway in the same project (recommended for private-only DB).
2. Make the MySQL plugin accept public connections (if Railway provides a public host/port). Then use that public connection string in Render.
3. Create a secure tunnel (e.g. Cloudflare Tunnel, or SSH tunnel) from Render to Railway — advanced and not covered here.

## Example Render env var values

- MYSQL_URL = mysql://dbuser:secret@db-1.railway.internal:3306/capsule_db
- FRONTEND_ORIGINS = https://your-frontend.onrender.com
- NODE_ENV = production

## Troubleshooting tips

- If you see `ECONNREFUSED`, confirm the hostname/port are reachable from Render (private Railway hosts are not).
- If you see `Unknown database`, import `backend/sql/capsule_db.sql` into the Railway MySQL console or set the `MYSQL_URL` to an existing database.
- If your repo includes `node_modules` committed at root, remove it and add to `.gitignore` — Render runs `npm install` during deploy and committed node_modules can cause build failures.

## Summary

1. Create a Render Web Service with Root Directory `backend`.
2. Set Start Command `npm start`.
3. Copy Railway connection string into Render env var `MYSQL_URL`.
4. Deploy and verify `/health`.

If you want, I can generate the exact Environment variable values based on your Railway plugin details (paste the copied connection string here) or I can prepare a short checklist of Render UI clicks tailored to screenshots you provide.
```
