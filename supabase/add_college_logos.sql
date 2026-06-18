ALTER TABLE public.colleges
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Add or update each college logo URL like this:
-- UPDATE public.colleges
-- SET logo_url = 'https://example.com/college-logo.png'
-- WHERE name = 'Stanford University';
