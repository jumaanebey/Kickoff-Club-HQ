# Kickoff Club HQ 🏈

**Professional Football Training Platform** - Master football fundamentals through expert coaching, structured courses, and progress tracking.

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17+
- npm
- Supabase account

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
kickoff-club-hq/
├── app/                    # Next.js 14 App Router
│   ├── (marketing)/       # Public pages (landing, pricing)
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── courses/          # Course catalog & viewing
│   ├── dashboard/        # User dashboard
│   ├── admin/            # Admin panel
│   └── blog/             # Blog system
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── marketing/       # Landing page components
│   ├── courses/         # Course components
│   └── dashboard/       # Dashboard components
├── lib/                 # Utilities & helpers
│   ├── db/             # Supabase & queries
│   ├── auth/           # Auth helpers
│   └── utils.ts        # Utility functions
├── types/              # TypeScript types
│   └── database.types.ts
└── public/             # Static assets
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Database**: PostgreSQL (Supabase)
- **Auth**: NextAuth.js
- **Payments**: Stripe
- **Hosting**: Vercel

## 📊 Features

### Phase 1 (Current)
- ✅ Landing page with hero & pricing
- ✅ Database schema with RLS
- ✅ TypeScript types
- ✅ UI component library
- ⏳ Authentication system (NextAuth)
- ⏳ Course catalog
- ⏳ Video player
- ⏳ User dashboard

### Phase 2 (Upcoming)
- Email notifications (Resend)
- Admin dashboard
- Blog system
- Stripe integration
- Progress tracking
- Achievement system

### Phase 3 (Future)
- Podcast integration (10 episodes ready)
- Mobile PWA
- Community features
- Live coaching sessions

## 🎨 Design System

### Colors
- **Primary Green**: `#2D7A3E` - Main brand
- **Secondary Orange**: `#FF8C00` - CTAs
- **Accent Blue**: `#1E3A8A` - Trust
- **Success**: `#10B981`
- **Warning**: `#F59E0B`

### Typography
- **Font**: Inter (system-ui fallback)
- **Headings**: Bold, tight tracking
- **Body**: Regular, relaxed line-height

## 🗄️ Database

### Tables
- `profiles` - User accounts & subscriptions
- `courses` - Course catalog
- `lessons` - Video lessons
- `user_progress` - Lesson completion tracking
- `enrollments` - Course enrollments

### Migration
```bash
# Run Supabase migration
# (Instructions for running the SQL file in Supabase dashboard)
```

## 💳 Subscription Tiers

- **Free Trial**: 14 days, 3 courses
- **Basic**: $19.99/month - All beginner courses
- **Premium**: $39.99/month - All courses + coaching

## 🚢 Deployment

### Vercel

```bash
# Deploy to Vercel
vercel --prod
```

### Environment Variables
Required in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## 📈 Success Metrics

Current (from v2):
- 127+ active users
- $288 MRR
- 12% free-to-paid conversion
- 68% lesson completion rate
- 91% would recommend

Target (6 months):
- 500+ active users
- $5,000+ MRR
- Monthly recurring revenue model
- Mobile app (PWA)

## 🤝 Contributing

This is a solo project for now.

## 📄 License

Proprietary - © 2025 Kickoff Club HQ

---

**Built with Next.js 14, TypeScript, Tailwind, and Supabase**

Love the vibe. Learn the game. 🏈
