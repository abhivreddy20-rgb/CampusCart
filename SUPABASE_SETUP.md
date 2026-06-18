# CampusCart Supabase Setup

1. Create a Supabase project.

2. Open the Supabase SQL editor and run:

```sql
-- Copy and run the contents of supabase/schema.sql
```

For an existing Supabase database that already has `orders`, run `supabase/add_registration_profiles.sql` once to add the registration table and order link.

3. Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

4. Fill in your Supabase project values:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. Start the app:

```bash
npm run dev
```

The registration step now upserts a parent profile into `parent_profiles`, and the payment step inserts an order into `orders` linked by `parent_profile_id`. The current setup allows public prototype registration and order creation through the anon key, which is fine for local MVP testing. Before production, move these writes behind authenticated users or a Supabase Edge Function.
