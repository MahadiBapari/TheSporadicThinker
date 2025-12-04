-- Add favorite flag to posts
ALTER TABLE posts
  ADD COLUMN is_favorite TINYINT(1) NOT NULL DEFAULT 0;
