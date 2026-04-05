-- Check what tables exist and create missing ones
-- Run this in your Supabase SQL Editor

-- First, let's see what tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Create customer_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS customer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  loyalty_points INTEGER DEFAULT 0,
  wallet_balance DECIMAL(10,2) DEFAULT 0,
  preferred_city TEXT,
  favorite_cuisine TEXT,
  upcoming_visit TEXT,
  saved_restaurant_ids UUID[] DEFAULT '{}',
  recent_orders JSONB DEFAULT '[]',
  membership_tier TEXT DEFAULT 'Bronze',
  preferred_mood TEXT,
  celebration_date TEXT,
  total_visits INTEGER DEFAULT 0,
  reward_progress JSONB DEFAULT '{"current": 0, "nextTier": 100}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_sessions table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  data JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_customer_profiles_user_id ON customer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Enable RLS and create policies
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for customer_profiles
DROP POLICY IF EXISTS "Allow anon and service role full access to customer_profiles" ON customer_profiles;
CREATE POLICY "Allow anon and service role full access to customer_profiles" ON customer_profiles
  FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'anon');

-- Create policies for user_sessions
DROP POLICY IF EXISTS "Allow anon and service role full access to sessions" ON user_sessions;
CREATE POLICY "Allow anon and service role full access to sessions" ON user_sessions
  FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'anon');

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_customer_profiles_updated_at ON customer_profiles;
CREATE TRIGGER update_customer_profiles_updated_at BEFORE UPDATE ON customer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_sessions_updated_at ON user_sessions;
CREATE TRIGGER update_user_sessions_updated_at BEFORE UPDATE ON user_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();