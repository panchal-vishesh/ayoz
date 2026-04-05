-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- First, create users table without the restaurant_id foreign key
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role TEXT NOT NULL CHECK (role IN ('admin', 'restaurant', 'customer')),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  login_id TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  restaurant_id UUID, -- No foreign key constraint yet
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID, -- No foreign key constraint yet
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  cuisine TEXT NOT NULL,
  description TEXT,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  login_id TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'Live onboarding',
  seating_capacity INTEGER DEFAULT 72,
  service_model TEXT DEFAULT 'Smart dine-in service',
  operating_hours TEXT DEFAULT '12:30 PM - 11:00 PM',
  stats JSONB DEFAULT '{}',
  menu JSONB DEFAULT '[]',
  recent_orders JSONB DEFAULT '[]',
  staff JSONB DEFAULT '[]',
  zones JSONB DEFAULT '[]',
  inventory_alerts JSONB DEFAULT '[]',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Now add the foreign key constraints to users table
ALTER TABLE users 
ADD CONSTRAINT fk_users_restaurant_id 
FOREIGN KEY (restaurant_id) REFERENCES restaurants(id);

ALTER TABLE users 
ADD CONSTRAINT fk_users_created_by 
FOREIGN KEY (created_by) REFERENCES users(id);

-- Customer profiles table
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

-- Sessions table (for proper session management)
CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  data JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_login_id ON users(login_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_restaurant_id ON users(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_login_id ON restaurants(login_id);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_user_id ON customer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text OR auth.role() = 'service_role');

CREATE POLICY "Allow service role full access to users" ON users
  FOR ALL USING (auth.role() = 'service_role');

-- Create policies for restaurants table
CREATE POLICY "Allow service role full access to restaurants" ON restaurants
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Restaurant users can view their restaurant" ON restaurants
  FOR SELECT USING (auth.uid()::text IN (
    SELECT id::text FROM users WHERE restaurant_id = restaurants.id
  ) OR auth.role() = 'service_role');

-- Create policies for customer_profiles table
CREATE POLICY "Users can view their own profile" ON customer_profiles
  FOR SELECT USING (auth.uid()::text = user_id::text OR auth.role() = 'service_role');

CREATE POLICY "Allow service role full access to customer_profiles" ON customer_profiles
  FOR ALL USING (auth.role() = 'service_role');

-- Create policies for user_sessions table
CREATE POLICY "Allow service role full access to sessions" ON user_sessions
  FOR ALL USING (auth.role() = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_profiles_updated_at BEFORE UPDATE ON customer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_sessions_updated_at BEFORE UPDATE ON user_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();