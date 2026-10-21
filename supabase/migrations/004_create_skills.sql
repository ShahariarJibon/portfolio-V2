-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS skill_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Code2',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level INT NOT NULL DEFAULT 50 CHECK (level >= 0 AND level <= 100),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tech_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_tags ENABLE ROW LEVEL SECURITY;

-- Allow public read access (admin updates through server service_role key)
DROP POLICY IF EXISTS "Public read skill_categories" ON skill_categories;
DROP POLICY IF EXISTS "Admin all skill_categories" ON skill_categories;
CREATE POLICY "Public read skill_categories" ON skill_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read skills" ON skills;
DROP POLICY IF EXISTS "Admin all skills" ON skills;
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read tech_tags" ON tech_tags;
DROP POLICY IF EXISTS "Admin all tech_tags" ON tech_tags;
CREATE POLICY "Public read tech_tags" ON tech_tags FOR SELECT USING (true);

-- Seed categories
INSERT INTO skill_categories (name, icon_name, sort_order) VALUES
('Frontend', 'Layout', 0),
('Programming Languages', 'Code2', 1)
ON CONFLICT DO NOTHING;

-- Seed skills
DO $$
DECLARE front_id UUID;
DECLARE lang_id UUID;
BEGIN
  SELECT id INTO front_id FROM skill_categories WHERE name = 'Frontend';
  IF front_id IS NOT NULL THEN
    INSERT INTO skills (category_id, name, level, sort_order) VALUES
      (front_id, 'React', 92, 0),
      (front_id, 'JavaScript', 90, 1),
      (front_id, 'Tailwind CSS', 92, 2),
      (front_id, 'HTML', 95, 3),
      (front_id, 'CSS', 90, 4)
    ON CONFLICT DO NOTHING;
  END IF;

  SELECT id INTO lang_id FROM skill_categories WHERE name = 'Programming Languages';
  IF lang_id IS NOT NULL THEN
    INSERT INTO skills (category_id, name, level, sort_order) VALUES
      (lang_id, 'C++', 88, 0),
      (lang_id, 'C', 85, 1),
      (lang_id, 'Java', 85, 2),
      (lang_id, 'JavaScript', 90, 3)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Seed tech tags
INSERT INTO tech_tags (name, sort_order) VALUES
('React', 0),
('JavaScript', 1),
('Tailwind CSS', 2),
('HTML', 3),
('CSS', 4),
('C++', 5),
('C', 6),
('Java', 7)
ON CONFLICT DO NOTHING;
