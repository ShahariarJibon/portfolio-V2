ALTER TABLE users ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false;

-- Allow admin to read all users (enables admin overview page)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any and recreate
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Admin can read all users" ON users;

CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (true);

CREATE POLICY "Admin can read all users" ON users
  FOR ALL USING (true) WITH CHECK (true);
