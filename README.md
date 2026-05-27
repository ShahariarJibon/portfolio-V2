# Portfolio V2 — Shahariar Hossain

A premium full-stack developer portfolio built with Next.js, Tailwind CSS, and Framer Motion. Features a cinematic black-and-white editorial aesthetic with an admin panel for managing contact messages.

## Tech Stack

- **Framework:** Next.js 16 (Turbopack)
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion, Lenis (smooth scroll)
- **Database:** Supabase (contact messages)
- **Fonts:** Playfair Display, Sora, DM Sans, JetBrains Mono
- **Icons:** Lucide React

## Features

- Cinematic hero with parallax and B&W filter
- Liquid glass navbar with scroll-driven blur
- Animated about, skills, projects, experience sections
- Contact form with Supabase persistence
- Password-protected admin dashboard at `/admin`
- Film grain overlay, vignette effects
- Fully responsive

## Getting Started

```bash
npm install
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-key
ADMIN_PASSWORD=your-admin-password
```

### Supabase Setup

Create a `messages` table in your Supabase project:

```sql
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Project Structure

```
├── app/              # Next.js App Router pages
│   ├── admin/        # Admin login & dashboard
│   └── api/          # API routes (contact, admin, messages)
├── components/       # React components
├── lib/              # Utilities (Supabase client, auth)
├── public/images/    # Static assets
└── .env.local        # Environment variables (gitignored)
```

## Links

- **Live:** [shahariarhossain.com](https://shahariarhossain.com)
- **GitHub:** [ShahariarJibon](https://github.com/ShahariarJibon)
- **LinkedIn:** [Shahariar Hossain](https://www.linkedin.com/in/shahariar-hossain-427a81404/)
