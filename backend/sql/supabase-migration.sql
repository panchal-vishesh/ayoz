-- Create the app_state table for storing application data
CREATE TABLE IF NOT EXISTS app_state (
  id TEXT PRIMARY KEY,
  meta JSONB DEFAULT '{}',
  users JSONB DEFAULT '[]',
  restaurants JSONB DEFAULT '[]',
  "customerProfiles" JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on the id column for faster lookups
CREATE INDEX IF NOT EXISTS idx_app_state_id ON app_state(id);

-- Enable Row Level Security (RLS)
ALTER TABLE app_state ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
-- You may want to restrict this further based on your security requirements
CREATE POLICY "Allow all operations for authenticated users" ON app_state
  FOR ALL USING (auth.role() = 'authenticated');

-- Optional: Create a policy for service role (for server-side operations)
CREATE POLICY "Allow all operations for service role" ON app_state
  FOR ALL USING (auth.role() = 'service_role');