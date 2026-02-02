# DIETEC Healthcare Platform

A modern, full-stack healthcare management system built with Next.js 16, featuring AI-powered health advice, appointment booking, lab tests, and role-based access for patients, doctors, and admins.

## Features

### Patient Portal
- **Appointments** - Book and manage doctor appointments with success modals
- **Lab Tests** - Schedule lab tests with home collection and payment flow
- **Medicines** - Browse and order medicines online
- **AI Health Advisor** - Get instant health advice powered by GPT-4
- **Voice Assistant** - Voice-based health consultations
- **Medical Records** - Track your health history
- **Billing** - View and pay invoices

### Doctor Portal
- **Dashboard** - View today's schedule with interactive appointment management
- **Start/Complete Consultations** - Real-time status updates
- **Patient Overview** - Recent patients and pending tasks
- **Progress Tracking** - Daily completion stats

### Admin Portal
- **Dashboard** - System overview with user, revenue, and inventory stats
- **User Management** - View recent users and registrations
- **Low Stock Alerts** - Medicine inventory warnings
- **Activity Feed** - Real-time system activity

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
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Tavus (optional - for voice assistant)
TAVUS_API_KEY=your_tavus_api_key
```

**Where to find these:**
- Supabase keys: Project Settings → API
- OpenAI key: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### Running the App

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
dietec/
├── app/
│   ├── (auth)/              # Login, Signup pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── actions.ts       # Auth server actions
│   ├── patient/             # Patient dashboard & features
│   │   ├── appointments/
│   │   ├── tests/
│   │   ├── medicines/
│   │   └── ...
│   ├── doctor/              # Doctor dashboard
│   │   ├── page.tsx
│   │   └── doctor-dashboard-client.tsx
│   ├── admin/               # Admin dashboard
│   │   ├── page.tsx
│   │   └── admin-dashboard-client.tsx
│   └── api/                 # API routes
│       ├── chat/
│       └── tavus/
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── animations.tsx       # GSAP animations
│   └── motion.tsx           # Framer Motion components
├── lib/
│   └── supabase/
│       ├── server.ts        # Server client + service client
│       ├── client.ts        # Browser client
│       └── middleware.ts    # Auth middleware
└── supabase/
    └── migrations/          # Database schema
```

## Database Setup

Run the migrations in order in Supabase SQL Editor:

1. `001_core_tables.sql` - Users, patients, doctors, admins
2. `002_medical_tables.sql` - Medical conditions, allergies
3. `003_appointments_tests.sql` - Appointments, lab tests
4. `004_inventory_billing.sql` - Medicines, orders, bills
5. `005_chat_functions.sql` - Chat history, triggers
6. `006_rls_policies.sql` - Row Level Security policies