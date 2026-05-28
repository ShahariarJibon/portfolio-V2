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

CREATE POLICY "Public read skill_categories" ON skill_categories FOR SELECT USING (true);
CREATE POLICY "Admin all skill_categories" ON skill_categories FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Admin all skills" ON skills FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read tech_tags" ON tech_tags FOR SELECT USING (true);
CREATE POLICY "Admin all tech_tags" ON tech_tags FOR ALL USING (true) WITH CHECK (true);

-- Seed categories
INSERT INTO skill_categories (name, icon_name, sort_order) VALUES
('Frontend', 'Layout', 0),
('Backend', 'Terminal', 1),
('Database', 'Database', 2),
('Tools', 'Wrench', 3)
ON CONFLICT DO NOTHING;

-- Seed skills
DO $$
DECLARE cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM skill_categories WHERE name = 'Frontend';
  INSERT INTO skills (category_id, name, level, sort_order) VALUES
    (cat_id, 'HTML', 95, 0),
    (cat_id, 'CSS', 90, 1),
    (cat_id, 'JavaScript', 92, 2),
    (cat_id, 'React', 95, 3),
    (cat_id, 'Next.js', 90, 4),
    (cat_id, 'Tailwind CSS', 95, 5)
  ON CONFLICT DO NOTHING;

  SELECT id INTO cat_id FROM skill_categories WHERE name = 'Backend';
  INSERT INTO skills (category_id, name, level, sort_order) VALUES
    (cat_id, 'Node.js', 88, 0),
    (cat_id, 'Express.js', 85, 1)
  ON CONFLICT DO NOTHING;

  SELECT id INTO cat_id FROM skill_categories WHERE name = 'Database';
  INSERT INTO skills (category_id, name, level, sort_order) VALUES
    (cat_id, 'MongoDB', 85, 0),
    (cat_id, 'Supabase', 80, 1)
  ON CONFLICT DO NOTHING;

  SELECT id INTO cat_id FROM skill_categories WHERE name = 'Tools';
  INSERT INTO skills (category_id, name, level, sort_order) VALUES
    (cat_id, 'Git', 90, 0),
    (cat_id, 'GitHub', 92, 1),
    (cat_id, 'VS Code', 95, 2),
    (cat_id, 'Figma', 75, 3)
  ON CONFLICT DO NOTHING;
END $$;

-- Seed tech tags
INSERT INTO tech_tags (name, sort_order) VALUES
('React', 0),
('Next.js', 1),
('TypeScript', 2),
('Node.js', 3),
('MongoDB', 4),
('PostgreSQL', 5),
('AWS', 6),
('Docker', 7)
ON CONFLICT DO NOTHING;
