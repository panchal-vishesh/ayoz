# AyoZ

India's smartest dining platform — guests order before they arrive, GPS alerts the kitchen at the perfect moment.

## Structure

```
ayoz/
├── frontend/   # React + Vite (deployed to ayoz.in via Vercel)
└── backend/    # Node.js + Express + Supabase
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_URL` in `frontend/.env` to your backend URL.

## Backend

```bash
cd backend
npm install
npm start
```

Copy `backend/.env.example` → `backend/.env` and fill in your Supabase credentials.
