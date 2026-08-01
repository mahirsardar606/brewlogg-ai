# BrewLog.ai üç∫

Mobile-first batch logging tool for craft breweries.

## Stack

- **Framework:** Next.js 14 (App Router), TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL) with Row Level Security
- **Auth:** Supabase Auth (email/password + Google OAuth)
- **Billing:** Paddle (Free: 5-batch limit, Pro: $6.99/mo)
- **Email:** Resend (transactional only)
- **PDF:** @react-pdf/renderer
- **Deploy:** Vercel + brewlog.ai

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project
- Paddle account (sandbox for dev)
- Resend API key (optional for dev)

### Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
cp .env.local.example .env.local
```

### Database Setup

Run the SQL in `supabase/schema.sql` in your Supabase project's SQL editor. This creates:

- `profiles` table (extends auth.users)
- `batches` table (core data model)
- Row Level Security policies
- Batch limit trigger (5 for free users)
- Auto-profile creation on signup

### Development

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/pricing` | Free vs Pro pricing |
| `/about` | About page |
| `/contact` | Contact page |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |
| `/login` | Login |
| `/auth/signup` | Sign up |
| `/auth/callback` | OAuth callback |
| `/dashboard` | Batch history |
| `/batches/new` | New batch form |
| `/batches/[id]` | View/edit batch |
| `/account` | Account + subscription |
| `/export/batch/[id]` | Download batch PDF |
| `/export/summary` | Download summary PDF |
| `/api/webhooks/paddle` | Paddle webhook |

## Features

- **Mobile-first** ‚Ä?built for the brewery floor
- **Batch logging** ‚Ä?date, beer name, batch #, OG, FG, ABV (auto-calc), notes
- **Dashboard** ‚Ä?view all batches, most recent first
- **PDF export** ‚Ä?single batch or date-range summary
- **Auth** ‚Ä?email/password + Google OAuth
- **Billing** ‚Ä?Free (5 batch limit) / Pro ($6.99/mo unlimited)
- **ABV auto-calculation** ‚Ä?(OG - FG) √ó 131.25

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Set the environment variables in your Vercel project settings (see `.env.local.example` for the full list).

