# Supabase Migration Guide

This project has been migrated from MongoDB to Supabase. Follow these steps to complete the setup:

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

## 2. Set Up Environment Variables

Update your `.env` file with:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Run Database Migration

Execute the SQL commands in `supabase-migration.sql` in your Supabase SQL editor:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-migration.sql`
4. Run the query

## 4. Install Dependencies

```bash
npm install
```

## 5. Start the Server

```bash
npm run dev
```

## Changes Made

- Replaced `mongodb` with `@supabase/supabase-js`
- Updated database connection in `src/db/supabase.js`
- Modified store persistence to use Supabase tables
- Updated environment configuration
- Simplified session storage (using memory store for now)

## Notes

- Session storage is currently using memory store. For production, consider implementing a proper session store with Supabase.
- The app_state table stores all application data as JSONB columns for easy migration from the existing store structure.
- Row Level Security (RLS) is enabled on the table with basic policies.