# AyoZ

AyoZ now runs as a small full-stack project:

- `frontend/` keeps the current landing page as the first screen
- `backend/` adds a lightweight Node API for auth and role-based dashboards
- the navbar now supports `Log in` and `Sign up` without changing the existing visual theme

## Roles

- `Admin` can log in and add restaurants
- `Restaurant` accounts are created by admin and receive a generated login ID and password
- `Customer` users can sign up themselves and access a customer dashboard

## Default Seed Accounts

- Admin: `admin@ayoz.in` / `Admin@12345`
- Demo restaurant: `AYOZREST01` / `AyoZ@Rest01`
- Demo customer: `guest@ayoz.in` / `Guest@12345`

## Scripts

- `npm run dev` starts frontend and backend together
- `npm run dev:frontend` starts only the Vite frontend
- `npm run dev:backend` starts only the backend API on `http://localhost:4000`
- `npm run build` builds the frontend into `dist/`
- `npm run preview` previews the frontend build

## Project Structure

```text
frontend/
  index.html
  public/
  src/

backend/
  src/
    server.js
    store.js

scripts/
  dev.js
```

## Environment

Create `.env` from `.env.example` and make sure this value exists:

```bash
VITE_API_URL=http://localhost:4000
```

## Notes

- The backend now uses MongoDB for persistence
- Configure the backend with `MONGODB_URI` and `MONGODB_DB_NAME`
- Auth now uses server-side sessions with cookies instead of browser `localStorage`
- The landing page theme and marketing sections are preserved as the home page
