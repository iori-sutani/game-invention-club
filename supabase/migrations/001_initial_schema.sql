-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Users table
-- =============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  github_id VARCHAR NOT NULL UNIQUE,
  username VARCHAR NOT NULL,
  avatar_url VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Tags table
-- =============================================
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL UNIQUE,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default tags removed - users can now add tags dynamically
-- To add default tags, uncomment below:
-- INSERT INTO tags (name, usage_count) VALUES
--   ('React', 0),
--   ('Vue.js', 0),
--   ('Next.js', 0),
--   ('TypeScript', 0);

-- =============================================
-- Games table
-- =============================================
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  screenshot_url VARCHAR NOT NULL,
  vercel_url VARCHAR NOT NULL,
  github_url VARCHAR,
  qiita_url VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_games_user_id ON games(user_id);
CREATE INDEX idx_games_created_at ON games(created_at DESC);

-- =============================================
-- Game Tags (junction table)
-- =============================================
CREATE TABLE game_tags (
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, tag_id)
);

CREATE INDEX idx_game_tags_tag_id ON game_tags(tag_id);

-- =============================================
-- Likes table
-- =============================================
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, game_id)
);

CREATE INDEX idx_likes_game_id ON likes(game_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);

-- =============================================
-- Functions
-- =============================================

-- Function to update tag usage count
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tags SET usage_count = usage_count - 1 WHERE id = OLD.tag_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for tag usage count
CREATE TRIGGER trigger_update_tag_usage_count
AFTER INSERT OR DELETE ON game_tags
FOR EACH ROW
EXECUTE FUNCTION update_tag_usage_count();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_games_updated_at
BEFORE UPDATE ON games
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Row Level Security (RLS)
-- =============================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users are viewable by everyone"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = github_id);

-- Games policies
CREATE POLICY "Games are viewable by everyone"
  ON games FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create games"
  ON games FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own games"
  ON games FOR UPDATE
  USING (user_id IN (SELECT id FROM users WHERE github_id = auth.uid()::text));

CREATE POLICY "Users can delete own games"
  ON games FOR DELETE
  USING (user_id IN (SELECT id FROM users WHERE github_id = auth.uid()::text));

-- Tags policies
CREATE POLICY "Tags are viewable by everyone"
  ON tags FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create tags"
  ON tags FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Game Tags policies
CREATE POLICY "Game tags are viewable by everyone"
  ON game_tags FOR SELECT
  USING (true);

CREATE POLICY "Game owner can manage game tags"
  ON game_tags FOR INSERT
  WITH CHECK (
    game_id IN (
      SELECT g.id FROM games g
      JOIN users u ON g.user_id = u.id
      WHERE u.github_id = auth.uid()::text
    )
  );

CREATE POLICY "Game owner can delete game tags"
  ON game_tags FOR DELETE
  USING (
    game_id IN (
      SELECT g.id FROM games g
      JOIN users u ON g.user_id = u.id
      WHERE u.github_id = auth.uid()::text
    )
  );

-- Likes policies
CREATE POLICY "Likes are viewable by everyone"
  ON likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create likes"
  ON likes FOR INSERT
  WITH CHECK (
    user_id IN (SELECT id FROM users WHERE github_id = auth.uid()::text)
  );

CREATE POLICY "Users can delete own likes"
  ON likes FOR DELETE
  USING (
    user_id IN (SELECT id FROM users WHERE github_id = auth.uid()::text)
  );

-- =============================================
-- Additional Users policy (INSERT)
-- =============================================

-- Allow authenticated users to create their own user record
CREATE POLICY "Authenticated users can create own profile"
ON users FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND github_id = auth.uid()::text
);

-- =============================================
-- Storage bucket for game screenshots
-- =============================================

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
