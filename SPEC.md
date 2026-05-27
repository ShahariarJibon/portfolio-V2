# Premium Developer Portfolio Specification

## Project Overview
- **Project Name**: Developer Portfolio 2026
- **Type**: Next.js Full-Stack Developer Portfolio Website
- **Core Functionality**: Premium, futuristic portfolio showcasing skills, projects, and experience with smooth animations and modern UI/UX
- **Target Users**: Recruiters, clients, hiring managers

---

## UI/UX Specification

### Layout Structure

**Page Sections (in order):**
1. Loading Screen (initial)
2. Navbar (sticky)
3. Hero Section
4. About Section
5. Skills Section
6. Projects Section
7. Experience Section
8. Education Section
9. Achievements Section
10. GitHub Stats Section
11. Contact Section
12. Footer

**Responsive Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Visual Design

**Color Palette:**
- Background Primary: #0a0a0b (near black)
- Background Secondary: #111113 (dark gray)
- Background Tertiary: #18181b (zinc-900)
- Card Background: rgba(255, 255, 255, 0.03)
- Glass Border: rgba(255, 255, 255, 0.08)
- Text Primary: #fafafa (zinc-50)
- Text Secondary: #a1a1aa (zinc-400)
- Text Muted: #71717a (zinc-500)
- Accent Primary: #6366f1 (indigo-500)
- Accent Secondary: #8b5cf6 (violet-500)
- Accent Gradient: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)
- Glow Accent: rgba(99, 102, 241, 0.5)
- Success: #22c55e (green-500)
- Error: #ef4444 (red-500)

**Typography:**
- Font Family Heading: "Sora", sans-serif (Google Fonts - modern, geometric)
- Font Family Body: "DM Sans", sans-serif (Google Fonts - clean, readable)
- Font Family Mono: "JetBrains Mono", monospace (for code/tech terms)
- Heading 1: 72px / 80px line-height / font-weight: 700
- Heading 2: 48px / 56px line-height / font-weight: 600
- Heading 3: 32px / 40px line-height / font-weight: 600
- Heading 4: 24px / 32px line-height / font-weight: 500
- Body Large: 20px / 32px line-height / font-weight: 400
- Body: 16px / 24px line-height / font-weight: 400
- Body Small: 14px / 20px line-height / font-weight: 400
- Caption: 12px / 16px line-height / font-weight: 500

**Spacing System:**
- Section Padding: 120px vertical (desktop), 80px (tablet), 60px (mobile)
- Container Max Width: 1280px
- Card Padding: 32px
- Card Gap: 24px
- Element Gap: 16px

**Visual Effects:**
- Card Glassmorphism: background rgba(255,255,255,0.03), backdrop-blur: 20px, border 1px solid rgba(255,255,255,0.08)
- Hover Glow: box-shadow: 0 0 40px rgba(99,102,241,0.15)
- Button Hover: scale(1.02), glow effect
- Text Gradient: background-clip: text with accent gradient
- Noise Texture Overlay: subtle grain effect on backgrounds

### Components

**1. Loading Screen:**
- Full screen with centered logo animation
- Animated ring/pulse effect
- Fade out transition to main content
- Duration: 2s

**2. Navbar:**
- Fixed position, height: 80px
- Background: rgba(10,10,11,0.8) with backdrop-blur: 20px
- Logo: Custom text with gradient
- Nav Links: Home, About, Skills, Projects, Contact
- Resume Button: Pill shape with gradient border
- Mobile: Hamburger menu with slide-in drawer

**3. Hero Section:**
- Full viewport height minus navbar
- Background: Subtle animated gradient mesh + floating orbs
- Content:
  - Greeting text: "Hello, I'm" with typing animation
  - Name: Large gradient text
  - Role: "Full-Stack Developer & SaaS Builder" with typewriter effect
  - Description paragraph
  - CTA Buttons: Primary (filled), Secondary (outline)
- Scroll indicator at bottom with bounce animation

**4. About Section:**
- Two column layout (text + visual)
- Left: Detailed text with highlighted keywords
- Right: Abstract geometric illustration or 3D element
- Stats row: Years of experience, Projects, Clients

**5. Skills Section:**
- Category tabs or filter
- Skill cards in responsive grid (4 columns desktop, 2 mobile)
- Each card: Icon, name, subtle progress indicator
- Hover: Glow effect, slight lift
- Categories: Frontend, Backend, Database, Tools

**6. Projects Section:**
- Bento grid layout (2-3 columns)
- Project cards with:
  - Cover image/gradient placeholder
  - Title and description
  - Tech stack badges
  - Links (Live, GitHub)
- Hover: Scale up, reveal overlay

**7. Experience Section:**
- Vertical timeline layout
- Timeline line with gradient
- Each item: Date, company, role, description
- Alternating left/right on desktop
- Stacked on mobile

**8. Education Section:**
- Simple card grid (2-3 columns)
- Each card: Institution, degree, year, relevant courses

**9. Achievements Section:**
- Horizontal scrolling carousel or grid
- Achievement cards with icon, title, date

**10. GitHub Stats Section:**
- Contribution graph (custom or react-github-calendar)
- Stats cards: Total commits, contributions, stars
- Languages pie/bar chart
- Profile link

**11. Contact Section:**
- Split layout: Info + Form
- Contact info: Email, LinkedIn, GitHub with icons
- Form fields: Name, Email, Message (glassmorphism style)
- Submit button with loading state

**12. Footer:**
- Three columns: Navigation, Social, Copyright
- Social icons with hover effects

---

## Functionality Specification

### Core Features

1. **Smooth Scrolling**: CSS scroll-behavior: smooth + Lenis for enhanced smoothness
2. **Page Transitions**: Framer Motion exit/enter animations
3. **Scroll Reveals**: Elements fade in as they enter viewport
4. **Typing Animation**: Hero text typewriter effect for role
5. **Mouse Glow Effect**: Subtle spotlight following cursor on hero
6. **Loading Screen**: Initial animation while app loads
7. **Mobile Menu**: Slide-in drawer with backdrop
8. **Form Validation**: Client-side validation with error messages
9. **SEO**: Meta tags, Open Graph, JSON-LD structured data

### User Interactions

- Navbar scroll effect (adds background on scroll)
- Button hover animations
- Card hover lift and glow
- Timeline items animate in sequence
- Smooth scroll to sections on nav click
- Form field focus states
- Social icon hover effects

### Performance Optimizations

- Next.js Image component for images
- Dynamic imports for heavy components
- Framer Motion lazy motion
- Optimized font loading (next/font)
- Code splitting per page section

---

## Acceptance Criteria

1. ✅ Website loads with animated loading screen
2. ✅ Navbar is sticky with blur effect, changes on scroll
3. ✅ Hero section has typing animation and CTA buttons
4. ✅ All sections have scroll reveal animations
5. ✅ Skills display in categorized animated cards
6. ✅ Projects show in bento grid with hover effects
7. ✅ Timeline section is interactive and animated
8. ✅ GitHub stats display correctly
9. ✅ Contact form is functional with validation
10. ✅ All sections are fully responsive (mobile, tablet, desktop)
11. ✅ Smooth scroll works throughout
12. ✅ Page has premium, unique aesthetic
13. ✅ Dark theme is consistent throughout
14. ✅ No console errors on load
15. ✅ Fast loading performance

---

## File Structure

```
portfolio/
├── app/
│   ├── layout.js
│   ├── page.js
│   └── globals.css
├── components/
│   ├── LoadingScreen.jsx
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── About.jsx
│   ├── Skills.jsx
│   ├── Projects.jsx
│   ├── Experience.jsx
│   ├── Education.jsx
│   ├── Achievements.jsx
│   ├── GitHubStats.jsx
│   ├── Contact.jsx
│   └── Footer.jsx
├── lib/
│   └── utils.js
├── public/
│   └── (empty - use external images)
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```

---

## Tech Stack Details

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 11
- **Scroll**: @studio-freight/lenis
- **Icons**: Lucide React
- **Fonts**: Google Fonts via next/font (Sora, DM Sans, JetBrains Mono)