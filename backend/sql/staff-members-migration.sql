-- ============================================================
-- Staff Members Table Migration
-- Run this in your Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS staff_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  shift TEXT NOT NULL DEFAULT 'Evening',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  status TEXT DEFAULT 'Active',
  score INTEGER DEFAULT 90,
  photo_url TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_staff_members_restaurant_id ON staff_members(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_staff_members_status ON staff_members(status);

-- Enable RLS
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;

-- RLS policy
DROP POLICY IF EXISTS "Allow anon and service role full access to staff_members" ON staff_members;
CREATE POLICY "Allow anon and service role full access to staff_members" ON staff_members
  FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'anon');

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_staff_members_updated_at ON staff_members;
CREATE TRIGGER update_staff_members_updated_at BEFORE UPDATE ON staff_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
