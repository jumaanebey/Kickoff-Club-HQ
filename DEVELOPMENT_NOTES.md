# Development Notes & Future Roadmap

## Recent Updates (Session: UX Enhancement & Feature Implementation)

### 1. Premium UX/UI Overhaul
We have successfully transitioned key pages to a premium, dynamic design language. This includes the use of `framer-motion` for smooth entrance animations, sophisticated gradient backgrounds, and a polished card-based layout.

**Updated Pages:**
- **Sign In (`/auth/sign-in`)**: Split-screen layout with animated form and hero section.
- **Coaching Waitlist (`/coaching/waitlist`)**: Modern, high-converting landing page with staggered animations.
- **Pricing (`/pricing`)**: Dynamic pricing cards with "Most Popular" highlighting and interactive FAQ accordion section.
- **Courses (`/courses`)**: Grid layout with animated course cards and filtering (duration removed for cleaner UI).
- **Course Detail (`/courses/[slug]`)**: Comprehensive overhaul with hero video access and curriculum breakdown.
- **Lesson Page (`/courses/[slug]/lessons/[lessonId]`)**: Cinematic video player focus with improved navigation.
- **Podcast (`/podcast`)**: Premium design with gradient backgrounds, Framer Motion animations, and enhanced episode cards.

**Recent UX Refinements:**
- **Duration Removal**: Removed timing displays (e.g., "7:00 MIN") from course cards across all pages for a cleaner, less cluttered interface.
- **Interactive FAQ**: Replaced static FAQ cards with an engaging accordion-style component featuring:
  - Expandable/collapsible questions with smooth Framer Motion animations
  - Icon-based visual indicators for each question type (RefreshCw, Shield, CreditCard, Lock, HelpCircle)
  - Dynamic hover states and active highlighting
  - Improved readability and user engagement
- **Podcast Page Premium Upgrade**:
  - Added gradient background blur effect for depth
  - Implemented staggered entrance animations for episode cards
  - Enhanced typography with gradient text in headings
  - Improved hover states with orange glow effects
  - Upgraded section headers with larger icons and better spacing

### 2. Critical Fixes
- **Server Components Render Error**: Fixed a production crash on `/courses` and `/courses/[slug]` caused by a conflict between ISR (`export const revalidate`) and cookie usage (`createServerClient`).
  - **Solution**: Removed `revalidate` and added `export const dynamic = 'force-dynamic'` to these pages, as they require user-specific data (enrollments, subscriptions) that depends on cookies.
  - **Impact**: Ensures stable rendering in production environments like Vercel.

### 3. "Nano Banana" Thumbnail Generator
A new internal tool for admins to generate course and podcast thumbnails using AI.
- **Location**: `/admin/thumbnails`
- **Features**: Prompt input, style selection (Realistic, Illustration, Minimalist, Neon), and mock generation visualization.
- **Access**: Added to the user dropdown menu in the header.

### 3. "Less Clicks" Video Access
Optimized the user journey to get to content faster.
- **Direct Links**: Course cards and detail pages now link directly to the first lesson's video player if available.
- **Smart Routing**: Logic added to determine if a user should go to the detail page or straight to the lesson.

### 4. Technical Improvements
- **TypeScript**: Resolved strict type errors in `framer-motion` variants (`as const`).
- **Theming**: Fixed inconsistencies in theme property usage (e.g., `cardBg` -> `card`).
- **Components**: Created reusable `Select` component based on Radix UI.

---

## Future Roadmap & Notes

### Immediate Next Steps
- **Podcast Page**: Apply the premium design language to `/podcast` and integrate the thumbnail generator workflow.
- **Dashboard**: Revamp the user dashboard (`/dashboard`) to match the new aesthetic.
- **Mobile Optimization**: Conduct a thorough mobile responsiveness audit for all new designs.

### Technical Debt & Maintenance
- **Type Safety**: Continue to refine TypeScript types, particularly for Supabase database responses.
- **Performance**: Monitor the bundle size impact of `framer-motion` and optimize lazy loading where possible.
- **Testing**: Update E2E tests to reflect the new UI structures and flows.

### Feature Ideas
- **Real AI Integration**: Connect the "Nano Banana" generator to a real image generation API (e.g., OpenAI DALL-E or Midjourney).
- **Gamification Expansion**: Add more interactive elements like streaks, badges, and leaderboards to the dashboard.
- **Social Features**: Implement comments and discussion threads on lesson pages.
