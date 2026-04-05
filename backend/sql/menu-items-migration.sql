-- ============================================================
-- Menu Items Table Migration
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  prep_minutes INTEGER NOT NULL,
  description TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  is_veg BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  demand TEXT DEFAULT 'Medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_is_available ON menu_items(is_available);

-- Enable RLS
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- RLS policy: allow anon + service_role full access (same pattern as other tables)
DROP POLICY IF EXISTS "Allow anon and service role full access to menu_items" ON menu_items;
CREATE POLICY "Allow anon and service role full access to menu_items" ON menu_items
  FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'anon');

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_menu_items_updated_at ON menu_items;
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Supabase Storage: Create a public bucket for menu images
-- Run these in the Supabase SQL Editor as well
-- ============================================================

-- Create the storage bucket (public so images are accessible via CDN URL)
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read images (public bucket)
DROP POLICY IF EXISTS "Public read access for menu images" ON storage.objects;
CREATE POLICY "Public read access for menu images" ON storage.objects
  FOR SELECT USING (bucket_id = 'menu-images');

-- Allow authenticated/anon uploads (our backend handles auth)
DROP POLICY IF EXISTS "Allow uploads to menu images" ON storage.objects;
CREATE POLICY "Allow uploads to menu images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'menu-images');

-- Allow deletes
DROP POLICY IF EXISTS "Allow deletes from menu images" ON storage.objects;
CREATE POLICY "Allow deletes from menu images" ON storage.objects
  FOR DELETE USING (bucket_id = 'menu-images');
