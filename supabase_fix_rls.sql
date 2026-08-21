-- ============================================================
-- FIX: Allow public (anon) read access to all tables
-- Run this in Supabase → SQL Editor
-- ============================================================

-- Drop existing policies if they conflict
DROP POLICY IF EXISTS "Allow public read on products" ON products;
DROP POLICY IF EXISTS "Allow public read on categories" ON categories;
DROP POLICY IF EXISTS "Allow public read on banners" ON banners;
DROP POLICY IF EXISTS "Allow public read on metal_rates" ON metal_rates;

-- ✅ Products: anyone can read (for homepage + product listing)
CREATE POLICY "Allow public read on products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

-- ✅ Categories: anyone can read (for filter dropdown)
CREATE POLICY "Allow public read on categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- ✅ Banners: anyone can read (for hero carousel)
CREATE POLICY "Allow public read on banners"
  ON banners FOR SELECT
  TO anon, authenticated
  USING (true);

-- ✅ Metal Rates: anyone can read (for live rates card on homepage)
CREATE POLICY "Allow public read on metal_rates"
  ON metal_rates FOR SELECT
  TO anon, authenticated
  USING (true);

-- ✅ Enquiries: anyone can INSERT (for contact form + product enquiry)
DROP POLICY IF EXISTS "Allow public insert on enquiries" ON enquiries;
CREATE POLICY "Allow public insert on enquiries"
  ON enquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- ✅ Admin full access: authenticated users can do everything
DROP POLICY IF EXISTS "Allow admin full access on products" ON products;
DROP POLICY IF EXISTS "Allow admin full access on categories" ON categories;
DROP POLICY IF EXISTS "Allow admin full access on banners" ON banners;
DROP POLICY IF EXISTS "Allow admin full access on enquiries" ON enquiries;
DROP POLICY IF EXISTS "Allow admin full access on metal_rates" ON metal_rates;

CREATE POLICY "Allow admin full access on products"
  ON products FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow admin full access on categories"
  ON categories FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow admin full access on banners"
  ON banners FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow admin full access on enquiries"
  ON enquiries FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow admin full access on metal_rates"
  ON metal_rates FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- ============================================================
-- Verify RLS is enabled on all tables
-- ============================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE metal_rates ENABLE ROW LEVEL SECURITY;
