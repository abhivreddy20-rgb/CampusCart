# CampusCart Supabase Setup

1. Create a Supabase project.

2. Open the Supabase SQL editor and run:

```sql
-- Copy and run the contents of supabase/schema.sql
```

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

The payment step now inserts an order into the `orders` table. The current setup allows public prototype order creation through the anon key, which is fine for local MVP testing. Before production, move order creation behind authenticated users or a Supabase Edge Function.
