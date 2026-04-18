-- Fix 1: Restrict profiles SELECT - hide wallet_address from public
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Public can see basic profile info via a safe view (no wallet_address)
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT id, user_id, username, role, created_at
FROM public.profiles;

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Only the owner can read their own full profile row (incl. wallet_address)
CREATE POLICY "Users can view their own full profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Fix 2: Restrict revenue_splits UPDATE to project creators only
DROP POLICY IF EXISTS "Users can update their own splits" ON public.revenue_splits;

CREATE POLICY "Project creators can update splits"
ON public.revenue_splits
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = revenue_splits.project_id
      AND p.creator_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = revenue_splits.project_id
      AND p.creator_id = auth.uid()
  )
);

-- Also restrict revenue_splits INSERT to project creators (was: any auth user could insert their own row)
DROP POLICY IF EXISTS "Authenticated users can create splits" ON public.revenue_splits;

CREATE POLICY "Project creators can create splits"
ON public.revenue_splits
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = revenue_splits.project_id
      AND p.creator_id = auth.uid()
  )
);

-- Fix 3: Auto-create profile on signup (so new Supabase Auth users get a profile row)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();