-- =============================================
-- Add INSERT policy for users table
-- =============================================
-- Run this SQL in Supabase Dashboard -> SQL Editor

-- Allow authenticated users to create their own user record
CREATE POLICY "Authenticated users can create own profile"
ON users FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND github_id = auth.uid()::text
);
