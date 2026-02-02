# DIETEC Healthcare Platform

A modern, full-stack healthcare management system built with Next.js 16, featuring AI-powered health advice, appointment booking, lab tests, and more.

## Features

- **Authentication** - Secure login/signup with Supabase Auth
- **Appointments** - Book and manage doctor appointments
- **Lab Tests** - Schedule lab tests with home collection
- **Medicines** - Browse and order medicines online
- **AI Health Advisor** - Get instant health advice powered by GPT-4
- **Voice Assistant** - Voice-based health consultations
- **Medical Records** - Track your health history
- **Billing** - View and pay invoices

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 + React 19 |
| UI | shadcn/ui, Tailwind CSS |
| Animations | GSAP, Framer Motion, Lenis |
| Database | Supabase (PostgreSQL) |
| AI | OpenAI GPT-4o-mini |
| Auth | Supabase Auth |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/nerdylua/dietec.git
cd dietec

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### Running the App

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
dietec/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── patient/           # Patient dashboard & features
│   ├── doctor/            # Doctor dashboard
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── animations.tsx    # GSAP animations
│   └── motion.tsx        # Framer Motion components
├── lib/                   # Utilities
│   └── supabase/         # Supabase client
└── supabase/             # Database migrations
```