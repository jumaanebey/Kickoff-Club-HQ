# Kickoff Club HQ — Task List

---

## Blocked / Needs You

- [ ] **Legal review** — Privacy policy + Terms updated with liability limits, CCPA, dispute resolution. Need lawyer review.
- [ ] **Resend domain verification** — kickoffclubhq.com needs DNS records for email sending. DNS is at Hostinger (ns1/ns2.dns-parking.com), not Vercel; no Resend records exist as of 2026-09-07. RESEND_API_KEY + EMAIL_FROM are already in Vercel.
- [ ] **Content** — Upload course videos, thumbnails, instructor photos
- [x] **Admin role** — done 2026-09-07 (profiles.role='admin' for jumaanebey@gmail.com)

## Needs Attention

- [ ] **Repo cleanup** — 4 stale copies archived (prefixed ARCHIVE-). Active repo is `Projects/Kickoff-Club/kickoff-club-hq`
- [x] **Multiple Claude branches on remote** — cleaned 2026-09-07: three `claude/*` branches tagged `archive/<name>` and deleted; `feat/hail-mary-game` kept for review. Originally:
  - `claude/kickoff-club-app-build`
  - `claude/mobile-fixes-v2`
  - `feature/hq-buildings-learn-tiers`
  - `claude/antigravity-query-prompt`
  - Others

## Ready to Build

- [ ] Database: Create `lesson_comments` table + RLS policies
- [ ] Course search + filtering by category/difficulty
- [ ] User profile customization (avatar upload)
- [ ] Push notifications for new courses
- [ ] Error tracking (Sentry)

## Marketing

- [ ] Google Search Console — verify, submit sitemap
- [ ] Social media accounts (content strategy)
- [ ] Email marketing setup
- [ ] Blog for content marketing
- [ ] Promotional videos

## Future Backlog

- [ ] Mobile app (React Native — may already be in progress on branches)
- [ ] Affiliate/referral program
- [ ] Live chat support
- [ ] A/B testing on landing page
- [ ] CDN for video delivery
- [ ] Automated backups

---

## Recently Completed

- [x] Privacy policy updated (third-party services, cookies, CCPA, COPPA, breach notification, data retention)
- [x] Terms of service updated (liability cap, indemnification, dispute resolution, warranty disclaimer)
- [x] Blitz Rush game rebuild
- [x] Mobile fixes
- [x] Stripe subscription flow (Basic $19/mo, Premium $49/mo)
- [x] Course reviews and ratings
- [x] Certificate generation
- [x] Video player with progress tracking
- [x] Admin dashboard
- [x] Legal pages (privacy, terms, cookies, refund)

## Key Info

- **Live site:** kickoffclubhq.com
- **Active repo:** `~/Projects/Kickoff-Club/kickoff-club-hq`
- **Remote:** github.com/jumaanebey/Kickoff-Club-HQ
- **Stripe:** Basic ($19/mo), Premium ($49/mo) — already configured
