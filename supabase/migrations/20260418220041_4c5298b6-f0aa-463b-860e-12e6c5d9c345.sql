DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles
WITH (security_invoker = true) AS
SELECT id, user_id, username, role, created_at
FROM public.profiles;

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Allow anon/auth to read non-sensitive columns of profiles (the view uses invoker rights, so we need an RLS policy)
CREATE POLICY "Public can view basic profile info"
ON public.profiles
FOR SELECT
TO anon, authenticated
USING (true);