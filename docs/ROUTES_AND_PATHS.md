# Routes and paths (for debugging 404 on Vercel)

## Frontend → API

| What           | Value              |
|----------------|--------------------|
| Base URL       | `/api/v1`          |
| Login request  | `POST /api/v1/auth/login` |
| Source         | `frontend/src/api/apiPublic.ts` (baseURL) + `loginService.ts` (post `/auth/login`) |

## Backend (Express)

| Mount point    | Router / path     | Full URL example        |
|---------------|-------------------|--------------------------|
| `/api/v1`     | authRoutes        | `/api/v1/auth/login`     |
| `/api/v1/transactions` | transactionRoutes | `/api/v1/transactions` |

- Entry: `backend/api/index.js` (serverless-http wraps `backend/src/app.js`).
- Request path seen by Express: same as client, e.g. `/api/v1/auth/login`.

## Vercel (`vercel.json`)

- **Builds**
  1. Frontend: `frontend/package.json` → `@vercel/static-build` → output in `frontend/dist` (via config `distDir: "dist"`).
  2. API: `backend/api/index.js` → `@vercel/node` → one serverless function.

- **Routes (order matters)**
  1. `/api/(.*)` → `backend/api/index.js` (no leading slash in dest).
  2. `handle: filesystem` → serve static files (e.g. from build output).
  3. `/(.*)` → `/index.html` (SPA fallback).

So `POST /api/v1/auth/login` should hit route 1 and be handled by the backend function.

## If you still get 404

1. **Vercel dashboard**
   - **Root Directory**: must be empty (project root). If set to `frontend`, backend and this config are ignored.
   - **Framework**: try “Other” so custom `builds` and `routes` are used.

2. **Build logs**
   - Confirm both “frontend” and “backend/api/index.js” builds succeed.
   - If the API build fails, the function is missing and `/api/*` will 404.

3. **Where the 404 appears**
   - Opening the site (e.g. `/` or `/login`) → static/SPA routing or missing `index.html`.
   - Only when clicking “Access Account” → API routing or backend function not invoked.
