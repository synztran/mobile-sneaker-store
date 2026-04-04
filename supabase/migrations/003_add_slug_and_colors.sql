-- ============================================================
-- Migration: 003_add_slug_and_colors
-- Description: Adds missing columns required by the API:
--              - products.slug         (URL-friendly identifier)
--              - colors table          (name → hex lookup)
--              - product_variants.color_id (FK to colors)
-- ============================================================

-- ─── 1. Helper function to generate a URL slug ──────────────

CREATE OR REPLACE FUNCTION public.generate_slug(input TEXT)
RETURNS TEXT
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(TRIM(input), '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    )
  );
$$;

-- ─── 2. Add slug to products ─────────────────────────────────

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS slug TEXT;

-- Generate slugs for existing rows from model_name
UPDATE public.products
SET slug = public.generate_slug(model_name)
WHERE slug IS NULL;

-- For duplicate slugs, append the product id
UPDATE public.products p
SET slug = public.generate_slug(p.model_name) || '-' || p.id
WHERE (
  SELECT COUNT(*) FROM public.products p2
  WHERE p2.slug = public.generate_slug(p.model_name)
) > 1;

-- Add NOT NULL + UNIQUE constraints now that all rows have a value
ALTER TABLE public.products
  ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS products_slug_idx ON public.products (slug);

-- ─── 3. Colors table ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.colors (
  id           BIGSERIAL   PRIMARY KEY,
  name         TEXT        NOT NULL UNIQUE,
  color_value  TEXT        NOT NULL,
  slug         TEXT        NOT NULL UNIQUE,
  sort_order   INTEGER,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.colors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view colors"
  ON public.colors FOR SELECT USING (true);

-- Seed common sneaker colors
INSERT INTO public.colors (name, color_value, slug, sort_order) VALUES
  ('Black',  '#1a1a1a', 'black',  1),
  ('White',  '#ffffff', 'white',  2),
  ('Grey',   '#9ca3af', 'grey',   3),
  ('Gray',   '#9ca3af', 'gray',   4),
  ('Red',    '#ef4444', 'red',    5),
  ('Blue',   '#3b82f6', 'blue',   6),
  ('Green',  '#22c55e', 'green',  7),
  ('Yellow', '#eab308', 'yellow', 8),
  ('Orange', '#f97316', 'orange', 9),
  ('Pink',   '#ec4899', 'pink',   10),
  ('Purple', '#a855f7', 'purple', 11),
  ('Brown',  '#92400e', 'brown',  12),
  ('Navy',   '#1e3a5f', 'navy',   13),
  ('Beige',  '#d4b483', 'beige',  14),
  ('Tan',    '#c4a882', 'tan',    15),
  ('Cream',  '#f5f0e8', 'cream',  16)
ON CONFLICT (name) DO NOTHING;

-- ─── 4. Sizes table ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.sizes (
  id          BIGSERIAL   PRIMARY KEY,
  name        TEXT        NOT NULL UNIQUE,
  slug        TEXT        NOT NULL UNIQUE,
  sort_order  INTEGER,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.sizes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sizes"
  ON public.sizes FOR SELECT USING (true);

-- Seed standard US sneaker half-sizes 4 – 18
INSERT INTO public.sizes (name, slug, sort_order)
SELECT
  s::TEXT,
  s::TEXT,
  ROW_NUMBER() OVER (ORDER BY s)
FROM GENERATE_SERIES(4, 36) gs(s)
CROSS JOIN LATERAL (VALUES
  (gs.s::NUMERIC),
  (gs.s::NUMERIC + 0.5)
) t(s)
WHERE t.s <= 18
ON CONFLICT (name) DO NOTHING;

-- ─── 5. Add color_id FK to product_variants ──────────────────

ALTER TABLE public.product_variants
  ADD COLUMN IF NOT EXISTS color_id BIGINT REFERENCES public.colors (id) ON DELETE SET NULL;

-- Populate color_id for existing variants that match a known color name
UPDATE public.product_variants pv
SET color_id = c.id
FROM public.colors c
WHERE LOWER(pv.color) = LOWER(c.name)
  AND pv.color_id IS NULL;

-- ─── 6. Add size_id FK to product_variants ───────────────────

ALTER TABLE public.product_variants
  ADD COLUMN IF NOT EXISTS size_id BIGINT REFERENCES public.sizes (id) ON DELETE SET NULL;

-- Strip non-numeric chars from legacy size values first (e.g. "US 10" → "10")
UPDATE public.product_variants
SET size = REGEXP_REPLACE(size, '[^0-9.]', '', 'g')
WHERE size ~ '[^0-9.]';

-- Populate size_id for existing variants
UPDATE public.product_variants pv
SET size_id = s.id
FROM public.sizes s
WHERE s.name = pv.size
  AND pv.size_id IS NULL;
