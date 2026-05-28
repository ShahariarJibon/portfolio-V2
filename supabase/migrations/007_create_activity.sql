CREATE TABLE IF NOT EXISTS activity_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'GitCommit',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activity_languages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  percentage INT NOT NULL DEFAULT 0 CHECK (percentage >= 0 AND percentage <= 100),
  color TEXT NOT NULL DEFAULT '#f7df1e',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE activity_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read activity_stats" ON activity_stats FOR SELECT USING (true);
CREATE POLICY "Admin all activity_stats" ON activity_stats FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read activity_languages" ON activity_languages FOR SELECT USING (true);
CREATE POLICY "Admin all activity_languages" ON activity_languages FOR ALL USING (true) WITH CHECK (true);

INSERT INTO activity_stats (label, value, icon_name, sort_order) VALUES
('Total Commits', '1,200+', 'GitCommit', 0),
('Contributions', '500+', 'Users', 1),
('Stars Earned', '50+', 'Star', 2)
ON CONFLICT DO NOTHING;

INSERT INTO activity_languages (name, percentage, color, sort_order) VALUES
('JavaScript', 45, '#f7df1e', 0),
('TypeScript', 30, '#3178c6', 1),
('Python', 15, '#3776ab', 2),
('CSS', 10, '#264de4', 3)
ON CONFLICT DO NOTHING;
