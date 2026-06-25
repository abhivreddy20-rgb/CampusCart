CREATE TABLE IF NOT EXISTS public.pre_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL UNIQUE,
  parent_phone TEXT NOT NULL,
  college_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS pre_registrations_parent_email_idx
ON public.pre_registrations(parent_email);

CREATE INDEX IF NOT EXISTS pre_registrations_college_name_idx
ON public.pre_registrations(college_name);

ALTER TABLE public.pre_registrations ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.pre_registrations TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can create pre registrations" ON public.pre_registrations;
DROP POLICY IF EXISTS "Anyone can update pre registrations" ON public.pre_registrations;

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

NOTIFY pgrst, 'reload schema';
