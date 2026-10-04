-- Required before enabling authentication or paid AI on an existing database.
-- Safe to apply repeatedly; no application accounts or content are modified.
BEGIN;

CREATE TABLE IF NOT EXISTS public.rate_limit_buckets (
  key text PRIMARY KEY,
  hits integer NOT NULL CHECK (hits >= 0),
  reset_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS rate_limit_buckets_reset_at_idx
  ON public.rate_limit_buckets (reset_at);

-- Backend-only storage: no client policies. The backend database owner keeps
-- access, while RLS denies client rows even if default privileges grant DML.
ALTER TABLE public.rate_limit_buckets ENABLE ROW LEVEL SECURITY;
REVOKE ALL PRIVILEGES ON TABLE public.rate_limit_buckets FROM PUBLIC;

-- Plain PostgreSQL installations may not have the Supabase client roles.
DO $$
DECLARE
  client_role text;
BEGIN
  FOREACH client_role IN ARRAY ARRAY['anon', 'authenticated'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = client_role) THEN
      EXECUTE format(
        'REVOKE ALL PRIVILEGES ON TABLE public.rate_limit_buckets FROM %I',
        client_role
      );
    END IF;
  END LOOP;
END
$$;

COMMIT;
