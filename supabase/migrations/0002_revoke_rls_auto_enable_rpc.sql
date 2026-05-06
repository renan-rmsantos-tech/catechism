-- rls_auto_enable() is an EVENT_TRIGGER helper (SECURITY DEFINER) from Supabase's
-- "auto-enable RLS for new tables" pattern. It must only run via ddl_command_end,
-- not as PostgREST /rest/v1/rpc/ for anon, authenticated, or PUBLIC (same REVOKE
-- clears both linter findings: anonymous and signed-in RPC).
DO $body$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = 'rls_auto_enable'
      AND p.pronargs = 0
  ) THEN
    EXECUTE $revoke$
      REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated
    $revoke$;
  END IF;
END;
$body$;
