CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Admin all achievements" ON achievements FOR ALL USING (true) WITH CHECK (true);

INSERT INTO achievements (title, description, sort_order) VALUES
('Hackathon Winner', 'First place at TechHacks 2023', 0),
('GitHub Contributor', '500+ contributions in 2023', 1),
('SaaS Launch', '10,000+ users across products', 2)
ON CONFLICT DO NOTHING;
