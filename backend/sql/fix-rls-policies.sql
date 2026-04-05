-- Temporarily allow anon role to insert data for initialization
-- Run this in Supabase SQL Editor

-- Update policies to allow anon role for INSERT operations (for initialization)
DROP POLICY IF EXISTS "Allow service role full access to users" ON users;
CREATE POLICY "Allow anon and service role full access to users" ON users
  FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Allow service role full access to restaurants" ON restaurants;
CREATE POLICY "Allow anon and service role full access to restaurants" ON restaurants
  FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Allow service role full access to customer_profiles" ON customer_profiles;
CREATE POLICY "Allow anon and service role full access to customer_profiles" ON customer_profiles
  FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Allow service role full access to sessions" ON user_sessions;
CREATE POLICY "Allow anon and service role full access to sessions" ON user_sessions
  FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'anon');