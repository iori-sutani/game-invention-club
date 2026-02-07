-- =============================================
-- Remove default tags (optional)
-- =============================================
-- Run this SQL in Supabase Dashboard -> SQL Editor
-- Only if you want to start with an empty tag list

-- Delete all tags that have no games associated with them
DELETE FROM tags
WHERE usage_count = 0;

-- Or to delete ALL default tags regardless of usage:
-- DELETE FROM tags
-- WHERE name IN (
--   'React', 'Vue.js', 'Angular', 'Next.js', 'TypeScript',
--   'WebGL', 'Canvas', 'Three.js', 'Phaser', '顔認識',
--   'Web Audio API', 'WebSocket', 'TensorFlow.js', 'Matter.js',
--   'Tailwind', 'Redux'
-- );
