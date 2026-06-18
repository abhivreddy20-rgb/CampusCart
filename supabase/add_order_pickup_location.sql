ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS pickup_location TEXT;
