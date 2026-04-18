-- Drop the temporary view approach; use column-level privileges instead
DROP VIEW IF EXISTS public.public_profiles;

-- Remove the redundant owner-only SELECT policy (the public policy already covers reads)
DROP POLICY IF EXISTS "Users can view their own full profile" ON public.profiles;

-- Revoke wide table SELECT and grant only safe columns to anon/authenticated
REVOKE SELECT ON public.profiles FROM anon, authenticated;
GRANT SELECT (id, user_id, username, role, created_at) ON public.profiles TO anon, authenticated;

-- Owner can read their own wallet_address
GRANT SELECT (wallet_address) ON public.profiles TO authenticated;

-- The "Public can view basic profile info" RLS policy already exists and allows row-level SELECT;
-- combined with column grants above, anon/auth users cannot read wallet_address unless they are the owner.
-- To enforce "only owner sees wallet_address", add a restrictive policy is not possible at column level via RLS.
-- Column privileges alone restrict anon (no wallet_address grant). For authenticated, we revoke and re-grant
-- only via a security-definer function in app code. Simpler: revoke wallet_address from authenticated too,
-- and expose it through a dedicated RPC or by selecting it explicitly from client (which will fail unless owner).

-- Actually: revoke wallet_address SELECT from authenticated entirely; expose via secure function for owner only.
REVOKE SELECT (wallet_address) ON public.profiles FROM authenticated;

CREATE OR REPLACE FUNCTION public.get_my_wallet_address()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT wallet_address FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_my_wallet_address() TO authenticated;