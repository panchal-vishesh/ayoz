# Backend

Run the API from inside this folder:

```bash
npm install
npm run dev
```

Default port: `4000`

Structure:

- `src/server.js` starts the Express server
- `src/app.js` wires middleware and routes
- `src/middleware/` keeps CORS, session, rate-limit, and CSRF setup
- `src/routes/` keeps auth, admin, dashboard, and public route handlers
- `src/services/` keeps dashboard data shaping
- `src/store/` keeps auth, records, and persistence helpers

Environment:

- Create `.env` from `.env.example`
- Set `MONGODB_URI` to your MongoDB server
- Set `MONGODB_DB_NAME` to the database name you want to use
- Set `SESSION_SECRET` to a strong random value
- Set `CORS_ALLOWED_ORIGINS` to your frontend URL

Notes:

- The backend now stores app data in MongoDB
- Login sessions are stored in MongoDB through `connect-mongo`
- Session cookies are `HttpOnly`, `SameSite=Lax`, 1 day, and become `Secure` in production
- Helmet, rate limiting, bcrypt, and CSRF protection are enabled for the API
