-- Temporarily disable RLS for initialization
-- Run this in Supabase SQL Editor

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants DISABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions DISABLE ROW LEVEL SECURITY;