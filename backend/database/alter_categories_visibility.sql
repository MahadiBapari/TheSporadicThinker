-- Add visibility and sort_order columns to categories
aLTER TABLE categories
  ADD COLUMN is_visible TINYINT(1) NOT NULL DEFAULT 1,
  ADD COLUMN sort_order INT NOT NULL DEFAULT 0;
