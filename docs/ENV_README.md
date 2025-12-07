Runtime env.json usage

This project supports two ways to provide public environment values used by the frontend:

1) Build-time Vite envs (recommended for production)
   - Set VITE_API_BASE and VITE_FIREBASE_* environment variables in your CI/hosting build environment.
   - Rebuild the frontend so values are embedded into import.meta.env.

2) Runtime /env.json (quick/no-rebuild)
   - Place a JSON file at the root of your static site named `env.json` (this file will be fetched by the app at startup).
   - Example: copy `public/env.template.json` to `public/env.json` and fill in real values before serving.
   - The app reads `/env.json` on startup and exposes the values as `window.__RUNTIME_CONFIG__`. This is useful for test deployments or when you want to avoid rebuilds.

Security notes
- Firebase client config values are public-safe and can be exposed in `env.json`.
- Never put server secrets (DB passwords, private keys) into `env.json`. Use secure environment variables in your hosting provider instead.

Local testing
- To test runtime config locally, create `frontend/public/env.json` (copy `env.template.json`) and start the dev server:

  cd frontend
  npm install
  npm run dev

- Visit http://localhost:5173/env.json to confirm the runtime config is served.

Deployment
- If using Render/Netlify/Vercel: either set the VITE_* variables in the project settings (build-time) or ensure your deploy process copies a secure `env.json` to the static root after build.
- If using a Docker-based build: pass VITE_* as build args or set them as ENV before running `npm run build` in the Dockerfile.
