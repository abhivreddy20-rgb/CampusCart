CREATE TABLE IF NOT EXISTS public.parent_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL UNIQUE,
  parent_phone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS parent_profile_id UUID REFERENCES public.parent_profiles(id);

CREATE INDEX IF NOT EXISTS parent_profiles_parent_email_idx ON public.parent_profiles(parent_email);
CREATE INDEX IF NOT EXISTS orders_parent_profile_id_idx ON public.orders(parent_profile_id);

ALTER TABLE public.parent_profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'parent_profiles'
      AND policyname = 'Anyone can create prototype parent profiles'
  ) THEN
    CREATE POLICY "Anyone can create prototype parent profiles"
    ON public.parent_profiles
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (TRUE);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'parent_profiles'
      AND policyname = 'Anyone can read prototype parent profiles'
  ) THEN
    CREATE POLICY "Anyone can read prototype parent profiles"
    ON public.parent_profiles
    FOR SELECT
    TO anon, authenticated
    USING (TRUE);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'parent_profiles'
      AND policyname = 'Anyone can update prototype parent profiles'
  ) THEN
    CREATE POLICY "Anyone can update prototype parent profiles"
    ON public.parent_profiles
    FOR UPDATE
    TO anon, authenticated
    USING (TRUE)
    WITH CHECK (TRUE);
  END IF;
END $$;
