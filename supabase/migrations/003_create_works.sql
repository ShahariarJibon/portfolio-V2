-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS works (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  image_data TEXT,
  tag_lines TEXT[] DEFAULT '{}',
  demo_url TEXT,
  code_url TEXT,
  sort_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE works ENABLE ROW LEVEL SECURITY;

-- Allow public read for published works
CREATE POLICY "Public can read published works"
  ON works FOR SELECT
  USING (published = true);

-- Allow admin full access via service_role key
CREATE POLICY "Admin full access"
  ON works FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert default featured works
INSERT INTO works (title, description, image_url, tag_lines, demo_url, code_url, sort_order, published) VALUES
('AI TRANSLATOR', 'Real-time AI-powered translation platform with support for 100+ languages, voice input, and document translation.', '/images/vasha.png', ARRAY['JavaScript', 'HTML', 'CSS', 'API'], 'https://shahariarjibon.github.io/Translator-VASHA/', 'https://github.com/ShahariarJibon/Translator-VASHA', 0, true),
('PixeLoom- Online Photo Editor', 'A powerful web-based photo editing application with filters, adjustments, layers, and export capabilities.', '/images/imagedo.png', ARRAY['React', 'Canvas API', 'Tailwind'], 'https://online-image-editor-zeta.vercel.app/', 'https://github.com/ShahariarJibon/Online-Image-Editor', 1, true),
('Territory Multiplayer game', 'Real-time multiplayer game with WebSocket, game state synchronization, and competitive matchmaking.', '/images/territory.png', ARRAY['Node.js', 'Socket.io', 'React', 'Redis'], 'https://territory-game-multiplayer-production.up.railway.app/', 'https://github.com/ShahariarJibon/Territory-Game-Multiplayer', 2, true),
('LunaQR - QR Generator', 'A sleek and modern QR code generator that creates customizable QR codes for URLs, text, and more with instant download.', '/images/lunaqr.png', ARRAY['React', 'QR Code API', 'Tailwind'], 'https://luna-qr.vercel.app/', 'https://github.com/ShahariarJibon/LunaQR', 3, true);
