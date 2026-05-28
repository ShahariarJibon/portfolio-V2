-- Run this if table + policies already exist, only inserts seed data

-- Add description column if missing (in case table was created before description was added)
ALTER TABLE works ADD COLUMN IF NOT EXISTS description TEXT;

-- Insert seed data (skips if already exists)
INSERT INTO works (title, description, image_url, tag_lines, demo_url, code_url, sort_order, published)
SELECT 'AI TRANSLATOR', 'Real-time AI-powered translation platform with support for 100+ languages, voice input, and document translation.', '/images/vasha.png', ARRAY['JavaScript', 'HTML', 'CSS', 'API'], 'https://shahariarjibon.github.io/Translator-VASHA/', 'https://github.com/ShahariarJibon/Translator-VASHA', 0, true
WHERE NOT EXISTS (SELECT 1 FROM works WHERE title = 'AI TRANSLATOR');

INSERT INTO works (title, description, image_url, tag_lines, demo_url, code_url, sort_order, published)
SELECT 'PixeLoom- Online Photo Editor', 'A powerful web-based photo editing application with filters, adjustments, layers, and export capabilities.', '/images/imagedo.png', ARRAY['React', 'Canvas API', 'Tailwind'], 'https://online-image-editor-zeta.vercel.app/', 'https://github.com/ShahariarJibon/Online-Image-Editor', 1, true
WHERE NOT EXISTS (SELECT 1 FROM works WHERE title = 'PixeLoom- Online Photo Editor');

INSERT INTO works (title, description, image_url, tag_lines, demo_url, code_url, sort_order, published)
SELECT 'Territory Multiplayer game', 'Real-time multiplayer game with WebSocket, game state synchronization, and competitive matchmaking.', '/images/territory.png', ARRAY['Node.js', 'Socket.io', 'React', 'Redis'], 'https://territory-game-multiplayer-production.up.railway.app/', 'https://github.com/ShahariarJibon/Territory-Game-Multiplayer', 2, true
WHERE NOT EXISTS (SELECT 1 FROM works WHERE title = 'Territory Multiplayer game');

INSERT INTO works (title, description, image_url, tag_lines, demo_url, code_url, sort_order, published)
SELECT 'LunaQR - QR Generator', 'A sleek and modern QR code generator that creates customizable QR codes for URLs, text, and more with instant download.', '/images/lunaqr.png', ARRAY['React', 'QR Code API', 'Tailwind'], 'https://luna-qr.vercel.app/', 'https://github.com/ShahariarJibon/LunaQR', 3, true
WHERE NOT EXISTS (SELECT 1 FROM works WHERE title = 'LunaQR - QR Generator');
