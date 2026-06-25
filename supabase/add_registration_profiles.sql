CREATE TABLE IF NOT EXISTS public.parent_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL UNIQUE,
  parent_phone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS parent_profile_id UUID REFERENCES public.parent_profiles(id);

CREATE INDEX IF NOT EXISTS parent_profiles_parent_email_idx ON public.parent_profiles(parent_email);
CREATE INDEX IF NOT EXISTS parent_profiles_user_id_idx ON public.parent_profiles(user_id);
CREATE INDEX IF NOT EXISTS orders_parent_profile_id_idx ON public.orders(parent_profile_id);

ALTER TABLE public.parent_profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON public.parent_profiles TO authenticated;

DROP POLICY IF EXISTS "Anyone can create prototype parent profiles" ON public.parent_profiles;
DROP POLICY IF EXISTS "Anyone can read prototype parent profiles" ON public.parent_profiles;
DROP POLICY IF EXISTS "Anyone can update prototype parent profiles" ON public.parent_profiles;
DROP POLICY IF EXISTS "Parents can create their own profile" ON public.parent_profiles;
DROP POLICY IF EXISTS "Parents can read their own profile" ON public.parent_profiles;
DROP POLICY IF EXISTS "Parents can update their own profile" ON public.parent_profiles;

CREATE POLICY "Parents can create their own profile"
ON public.parent_profiles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Parents can read their own profile"
ON public.parent_profiles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Parents can update their own profile"
ON public.parent_profiles
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
