-- ============================================================
-- Migration: 002_restructure_and_create_tables
-- Description: Aligns profiles table with updated schema and
--              creates all application tables:
--              brands, products, product_variants, product_images,
--              cart_items, orders, order_items, wishlist_items
-- ============================================================

-- ─── 1. ALTER profiles ──────────────────────────────────────
-- Remove columns that are no longer part of the schema
ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS email,
  DROP COLUMN IF EXISTS phone,
  DROP COLUMN IF EXISTS updated_at;

-- Add shipping_address column
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS shipping_address JSONB;

-- Update the auto-create trigger to no longer insert email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- ─── 2. BRANDS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.brands (
  id          BIGSERIAL   PRIMARY KEY,
  name        TEXT        NOT NULL,
  logo_url    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view brands"
  ON public.brands FOR SELECT USING (true);

-- ─── 3. PRODUCTS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id            BIGSERIAL   PRIMARY KEY,
  brand_id      BIGINT      REFERENCES public.brands (id) ON DELETE SET NULL,
  model_name    TEXT        NOT NULL,
  description   TEXT,
  release_date  DATE,
  retail_price  NUMERIC(10, 2),
  resale_price  NUMERIC(10, 2),
  condition     TEXT        CHECK (condition IN ('new', 'used', 'deadstock')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT USING (true);

-- Auto-update updated_at on products
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ─── 4. PRODUCT VARIANTS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.product_variants (
  id              BIGSERIAL   PRIMARY KEY,
  product_id      BIGINT      NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  size            TEXT        NOT NULL,
  color           TEXT        NOT NULL,
  sku             TEXT        UNIQUE,
  stock_quantity  INTEGER     NOT NULL DEFAULT 0,
  price           NUMERIC(10, 2) NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product variants"
  ON public.product_variants FOR SELECT USING (true);

-- ─── 5. PRODUCT IMAGES ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.product_images (
  id          BIGSERIAL   PRIMARY KEY,
  product_id  BIGINT      NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  image_url   TEXT        NOT NULL,
  alt_text    TEXT,
  is_primary  BOOLEAN     NOT NULL DEFAULT false,
  sort_order  INTEGER     NOT NULL DEFAULT 0
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product images"
  ON public.product_images FOR SELECT USING (true);

-- ─── 6. CART ITEMS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cart_items (
  id          BIGSERIAL   PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  variant_id  BIGINT      NOT NULL REFERENCES public.product_variants (id) ON DELETE CASCADE,
  quantity    INTEGER     NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, variant_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart"
  ON public.cart_items FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── 7. ORDERS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id                  BIGSERIAL   PRIMARY KEY,
  user_id             UUID        REFERENCES auth.users (id) ON DELETE SET NULL,
  status              TEXT        NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  total_amount        NUMERIC(10, 2) NOT NULL,
  shipping_address    JSONB,
  payment_intent_id   TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Auto-update updated_at on orders
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ─── 8. ORDER ITEMS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
  id                  BIGSERIAL   PRIMARY KEY,
  order_id            BIGINT      NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
  variant_id          BIGINT      REFERENCES public.product_variants (id) ON DELETE SET NULL,
  quantity            INTEGER     NOT NULL CHECK (quantity > 0),
  price_at_purchase   NUMERIC(10, 2) NOT NULL
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

-- ─── 9. WISHLIST ITEMS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id          BIGSERIAL   PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  product_id  BIGINT      NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own wishlist"
  ON public.wishlist_items FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
