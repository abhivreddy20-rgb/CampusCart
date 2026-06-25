ALTER TABLE public.parent_profiles
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'parent_profiles_user_id_key'
      AND conrelid = 'public.parent_profiles'::regclass
  ) THEN
    ALTER TABLE public.parent_profiles
    ADD CONSTRAINT parent_profiles_user_id_key UNIQUE (user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS parent_profiles_user_id_idx
ON public.parent_profiles(user_id);

ALTER TABLE public.parent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pre_registrations ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.pre_registrations TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.parent_profiles TO authenticated;
GRANT SELECT, INSERT ON public.orders TO authenticated;

DROP POLICY IF EXISTS "Anyone can create prototype orders" ON public.orders;
DROP POLICY IF EXISTS "Parents can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Parents can read their own orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create prototype parent profiles" ON public.parent_profiles;
DROP POLICY IF EXISTS "Anyone can read prototype parent profiles" ON public.parent_profiles;
DROP POLICY IF EXISTS "Anyone can update prototype parent profiles" ON public.parent_profiles;
DROP POLICY IF EXISTS "Parents can create their own profile" ON public.parent_profiles;
DROP POLICY IF EXISTS "Parents can read their own profile" ON public.parent_profiles;
DROP POLICY IF EXISTS "Parents can update their own profile" ON public.parent_profiles;
DROP POLICY IF EXISTS "Anyone can create pre registrations" ON public.pre_registrations;

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

CREATE POLICY "Parents can create their own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.parent_profiles
    WHERE parent_profiles.id = orders.parent_profile_id
      AND parent_profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Parents can read their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.parent_profiles
    WHERE parent_profiles.id = orders.parent_profile_id
      AND parent_profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Anyone can create pre registrations"
ON public.pre_registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(parent_name) BETWEEN 1 AND 120
  AND parent_email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
  AND parent_phone ~ '^[0-9]{10}$'
  AND length(college_name) BETWEEN 1 AND 120
);

ALTER TABLE public.pre_registrations
DROP CONSTRAINT IF EXISTS pre_registrations_parent_name_length,
ADD CONSTRAINT pre_registrations_parent_name_length
CHECK (length(parent_name) BETWEEN 1 AND 120) NOT VALID;

ALTER TABLE public.pre_registrations
DROP CONSTRAINT IF EXISTS pre_registrations_parent_email_format,
ADD CONSTRAINT pre_registrations_parent_email_format
CHECK (parent_email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$') NOT VALID;

ALTER TABLE public.pre_registrations
DROP CONSTRAINT IF EXISTS pre_registrations_parent_phone_format,
ADD CONSTRAINT pre_registrations_parent_phone_format
CHECK (parent_phone ~ '^[0-9]{10}$') NOT VALID;

ALTER TABLE public.orders
DROP CONSTRAINT IF EXISTS orders_parent_email_format,
ADD CONSTRAINT orders_parent_email_format
CHECK (parent_email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$') NOT VALID;

ALTER TABLE public.orders
DROP CONSTRAINT IF EXISTS orders_parent_phone_format,
ADD CONSTRAINT orders_parent_phone_format
CHECK (parent_phone ~ '^[0-9]{10}$') NOT VALID;

ALTER TABLE public.orders
DROP CONSTRAINT IF EXISTS orders_student_phone_format,
ADD CONSTRAINT orders_student_phone_format
CHECK (student_phone ~ '^[0-9]{10}$') NOT VALID;

NOTIFY pgrst, 'reload schema';
