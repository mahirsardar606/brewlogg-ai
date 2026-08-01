-- BrewLog.ai Database Schema
-- Run this in your Supabase SQL editor

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  brewery_name TEXT,
  role TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'brewer', 'admin')),
  brewery_id UUID,
  invited_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paddle_customer_id TEXT,
  paddle_subscription_id TEXT,
  plan_tier TEXT NOT NULL DEFAULT 'free' CHECK (plan_tier IN ('free', 'pro')),
  paddle_price_id TEXT,
  subscription_status TEXT CHECK (subscription_status IN ('active', 'past_due', 'canceled', 'paused')),
  ai_analyses_used INTEGER NOT NULL DEFAULT 0,
  ai_limit INTEGER NOT NULL DEFAULT 0,
  approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'approved', 'rejected')),
  last_login TIMESTAMPTZ
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can view brewery team profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles AS self
      WHERE self.id = auth.uid()
        AND self.brewery_id = public.profiles.brewery_id
    )
  );

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. AUTO-CREATE PROFILE ON SIGNUP
-- Owners (self-signup) get a new brewery_id; Brewers (invited) use the inviting owner's brewery_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  meta_data JSONB;
BEGIN
  meta_data := NEW.raw_user_meta_data;

  IF meta_data ? 'role' AND meta_data->>'role' = 'brewer' THEN
    INSERT INTO public.profiles (id, email, role, brewery_id, invited_by)
    VALUES (
      NEW.id,
      NEW.email,
      'brewer',
      (meta_data->>'brewery_id')::UUID,
      (meta_data->>'invited_by')::UUID
    );
  ELSE
    INSERT INTO public.profiles (id, email, role, brewery_id, brewery_name, approval_status, verification_status)
    VALUES (
      NEW.id,
      NEW.email,
      'owner',
      gen_random_uuid(),
      COALESCE(meta_data->>'brewery_name', ''),
      'pending',
      'unverified'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. BATCHES TABLE
CREATE TABLE IF NOT EXISTS public.batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  beer_name TEXT NOT NULL,
  batch_number INTEGER NOT NULL,
  og NUMERIC(5,3),
  fg NUMERIC(5,3),
  abv NUMERIC(4,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own batches"
  ON public.batches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own batches"
  ON public.batches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own batches"
  ON public.batches FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own batches"
  ON public.batches FOR DELETE
  USING (auth.uid() = user_id);

-- 4. BATCH LIMIT TRIGGER (Free trial max 2 batches)
CREATE OR REPLACE FUNCTION public.check_batch_limit()
RETURNS TRIGGER AS $$
DECLARE
  current_plan TEXT;
  batch_count INTEGER;
BEGIN
  SELECT plan_tier INTO current_plan FROM public.profiles WHERE id = NEW.user_id;

  IF current_plan = 'free' THEN
    SELECT COUNT(*) INTO batch_count FROM public.batches WHERE user_id = NEW.user_id;

    IF batch_count >= 2 THEN
      RAISE EXCEPTION 'Free plan limit reached: max 2 batches. Upgrade to Pro for unlimited batches.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_batch_limit ON public.batches;
CREATE TRIGGER enforce_batch_limit
  BEFORE INSERT ON public.batches
  FOR EACH ROW EXECUTE FUNCTION public.check_batch_limit();

-- 5. AUTO-UPDATE updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.batches;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.batches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 6. INDEXES
CREATE INDEX IF NOT EXISTS idx_batches_user_id ON public.batches(user_id);
CREATE INDEX IF NOT EXISTS idx_batches_date ON public.batches(date DESC);
CREATE INDEX IF NOT EXISTS idx_batches_user_date ON public.batches(user_id, date DESC);

-- ========================================
-- INVENTORY TABLES (added without modifying existing schema)
-- ========================================

-- 7. INGREDIENTS TABLE
CREATE TABLE IF NOT EXISTS public.ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('malt', 'hops', 'yeast', 'other')),
  quantity NUMERIC(10,2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'kg',
  reorder_level NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ingredients"
  ON public.ingredients FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own ingredients"
  ON public.ingredients FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ingredients"
  ON public.ingredients FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ingredients"
  ON public.ingredients FOR DELETE
  USING (auth.uid() = user_id);

-- 8. BATCH_INGREDIENTS TABLE (links ingredients to batches)
CREATE TABLE IF NOT EXISTS public.batch_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES public.ingredients(id) ON DELETE RESTRICT,
  quantity_used NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.batch_ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own batch ingredients"
  ON public.batch_ingredients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.batches WHERE id = batch_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own batch ingredients"
  ON public.batch_ingredients FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.batches WHERE id = batch_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own batch ingredients"
  ON public.batch_ingredients FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.batches WHERE id = batch_id AND user_id = auth.uid()
    )
  );

-- 9. AUTO-DECREMENT STOCK TRIGGER
CREATE OR REPLACE FUNCTION public.decrement_ingredient_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.ingredients
  SET quantity = quantity - NEW.quantity_used,
      updated_at = NOW()
  WHERE id = NEW.ingredient_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_batch_ingredient_insert ON public.batch_ingredients;
CREATE TRIGGER on_batch_ingredient_insert
  AFTER INSERT ON public.batch_ingredients
  FOR EACH ROW EXECUTE FUNCTION public.decrement_ingredient_stock();

-- 10. RESTORE STOCK ON DELETE
CREATE OR REPLACE FUNCTION public.restore_ingredient_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.ingredients
  SET quantity = quantity + OLD.quantity_used,
      updated_at = NOW()
  WHERE id = OLD.ingredient_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_batch_ingredient_delete ON public.batch_ingredients;
CREATE TRIGGER on_batch_ingredient_delete
  AFTER DELETE ON public.batch_ingredients
  FOR EACH ROW EXECUTE FUNCTION public.restore_ingredient_stock();

-- 11. TRIGGER FOR ingredients updated_at
DROP TRIGGER IF EXISTS set_ingredients_updated_at ON public.ingredients;
CREATE TRIGGER set_ingredients_updated_at
  BEFORE UPDATE ON public.ingredients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 12. INDEXES FOR INVENTORY
CREATE INDEX IF NOT EXISTS idx_ingredients_user_id ON public.ingredients(user_id);
CREATE INDEX IF NOT EXISTS idx_ingredients_type ON public.ingredients(type);
CREATE INDEX IF NOT EXISTS idx_batch_ingredients_batch_id ON public.batch_ingredients(batch_id);
CREATE INDEX IF NOT EXISTS idx_batch_ingredients_ingredient_id ON public.batch_ingredients(ingredient_id);

-- ========================================
-- TEAM ACCESS (added without modifying existing policies)
-- ========================================

-- 13. BREWERY-SCOPED RLS POLICIES — batches
-- These coexist with the existing user_id policies (PostgreSQL ORs them together)
CREATE POLICY "Brewery members can view all brewery batches"
  ON public.batches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles AS viewer
      JOIN public.profiles AS owner ON viewer.brewery_id = owner.brewery_id
      WHERE viewer.id = auth.uid()
        AND owner.id = user_id
    )
  );

-- 14. BREWERY-SCOPED RLS POLICIES — ingredients
CREATE POLICY "Brewery members can view all brewery ingredients"
  ON public.ingredients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles AS viewer
      JOIN public.profiles AS owner ON viewer.brewery_id = owner.brewery_id
      WHERE viewer.id = auth.uid()
        AND owner.id = user_id
    )
  );

CREATE POLICY "Brewery members can view all brewery batch ingredients"
  ON public.batch_ingredients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.batches AS b
      JOIN public.profiles AS viewer ON 1=1
      JOIN public.profiles AS batch_owner ON b.user_id = batch_owner.id
      WHERE b.id = batch_id
        AND viewer.id = auth.uid()
        AND viewer.brewery_id = batch_owner.brewery_id
    )
  );

-- 15. INDEX FOR brewery_id lookups
CREATE INDEX IF NOT EXISTS idx_profiles_brewery_id ON public.profiles(brewery_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ========================================
-- RECIPES (added without modifying existing tables)
-- ========================================

-- 16. RECIPES TABLE
CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  style TEXT,
  malt_bill TEXT,
  hop_schedule TEXT,
  yeast TEXT,
  target_og NUMERIC(5,3),
  target_fg NUMERIC(5,3),
  target_abv NUMERIC(4,2),
  target_ibu NUMERIC(5,1),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recipes"
  ON public.recipes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Brewery members can view all brewery recipes"
  ON public.recipes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles AS viewer
      JOIN public.profiles AS owner ON viewer.brewery_id = owner.brewery_id
      WHERE viewer.id = auth.uid()
        AND owner.id = user_id
    )
  );

CREATE POLICY "Users can create own recipes"
  ON public.recipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes"
  ON public.recipes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes"
  ON public.recipes FOR DELETE
  USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS set_recipes_updated_at ON public.recipes;
CREATE TRIGGER set_recipes_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON public.recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_name ON public.recipes(name);

-- ========================================
-- AI BATCH ANALYSIS (added without modifying existing tables)
-- ========================================

-- 17. BATCH_ANALYSES TABLE
CREATE TABLE IF NOT EXISTS public.batch_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brewery_id UUID NOT NULL,
  triggered_by UUID NOT NULL REFERENCES public.profiles(id),
  batch_count INTEGER NOT NULL,
  summary TEXT NOT NULL,
  trends JSONB,
  raw_response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.batch_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brewery members can view own brewery analyses"
  ON public.batch_analyses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND brewery_id = batch_analyses.brewery_id
    )
  );

CREATE POLICY "Brewery members can create analyses"
  ON public.batch_analyses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND brewery_id = batch_analyses.brewery_id
    )
  );

CREATE INDEX IF NOT EXISTS idx_batch_analyses_brewery_id ON public.batch_analyses(brewery_id);
CREATE INDEX IF NOT EXISTS idx_batch_analyses_created_at ON public.batch_analyses(created_at DESC);

-- AI usage tracking for Pro users
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS ai_analyses_used INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_limit INTEGER NOT NULL DEFAULT 0;

-- ========================================
-- ADMIN PANEL TABLES
-- ========================================

-- 18. VERIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_number TEXT NOT NULL,
  business_type TEXT NOT NULL,
  documents JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'expired')),
  admin_notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own verification"
  ON public.verifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own verification"
  ON public.verifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all verifications"
  ON public.verifications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update verifications"
  ON public.verifications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_verifications_user_id ON public.verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_verifications_status ON public.verifications(status);

-- 19. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_tier TEXT NOT NULL DEFAULT 'free' CHECK (plan_tier IN ('free', 'pro', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'trialing', 'paused')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  paddle_subscription_id TEXT UNIQUE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions"
  ON public.subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update subscriptions"
  ON public.subscriptions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- 20. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  target_id UUID REFERENCES auth.users(id),
  target_type TEXT DEFAULT 'user',
  metadata JSONB DEFAULT '{}',
  ip TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all audit logs"
  ON public.audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target_id ON public.audit_logs(target_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);

-- ========================================
-- HELPER FUNCTIONS
-- ========================================

-- Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-update subscriptions updated_at
DROP TRIGGER IF EXISTS set_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER set_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
