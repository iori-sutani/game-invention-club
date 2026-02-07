-- =============================================
-- Storage bucket for game screenshots
-- =============================================
-- Run this SQL in Supabase Dashboard -> SQL Editor

-- 1. Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('screenshots', 'screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Policy: Allow public read access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'screenshots');

-- 3. Policy: Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'screenshots'
  AND auth.role() = 'authenticated'
);

-- 4. Policy: Allow users to update their own uploads
CREATE POLICY "Users can update own uploads"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'screenshots'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 5. Policy: Allow users to delete their own uploads
CREATE POLICY "Users can delete own uploads"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'screenshots'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- File naming convention: {user_id}/{timestamp}.{extension}
