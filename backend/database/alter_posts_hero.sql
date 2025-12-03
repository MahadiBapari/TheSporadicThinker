-- Add hero flags to posts
ALTER TABLE posts
  ADD COLUMN is_hero TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN hero_order INT NULL;
