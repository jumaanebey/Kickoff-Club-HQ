# Kickoff Club HQ — Task List

---

## Blocked / Needs You

- [ ] **Legal review** — Privacy policy + Terms updated with liability limits, CCPA, dispute resolution. Need lawyer review.
- [ ] **Resend domain verification** — kickoffclubhq.com needs DNS records for email sending. DNS is at Hostinger (ns1/ns2.dns-parking.com), not Vercel; no Resend records exist as of 2026-09-07. RESEND_API_KEY + EMAIL_FROM are already in Vercel.
- [ ] **Content** — Upload course videos, thumbnails, instructor photos
- [x] **Admin role** — done 2026-09-07 (profiles.role='admin' for jumaanebey@gmail.com). Admin link now shows in the header user menu, mobile menu, and dashboard sidebar for admin profiles (`hooks/use-is-admin.ts`); `/admin/thumbnails` is gated behind it too.

## Needs Attention

- [ ] **Repo cleanup** — 4 stale copies archived (prefixed ARCHIVE-). Active repo is `Projects/Kickoff-Club/kickoff-club-hq`
- [x] **Multiple Claude branches on remote** — cleaned 2026-09-07: three `claude/*` branches tagged `archive/<name>` and deleted; `feat/hail-mary-game` kept for review. Originally:
  - `claude/kickoff-club-app-build`
  - `claude/mobile-fixes-v2`
  - `feature/hq-buildings-learn-tiers`
  - `claude/antigravity-query-prompt`
  - Others


## Product direction — pricing restructure (added 2026-09-07)

- [ ] **Make all content free + one paid offer: $49/mo live GROUP coaching.** Jumaane's call 2026-09-07.
  - [x] Decided: **$49/month recurring, live group coaching** (not 1:1).
  - [ ] All courses free: `courses.tier_required = 'free'`, `lessons.is_free = true`; remove per-lesson locks.
  - [ ] `app/pricing/page.tsx`: drop the Pro subscription tier; keep **Free (all content) + Group Coaching $49/mo**.
  - [ ] Stripe (`payments/stripe/client.ts`): one **$49/mo recurring** coaching subscription; retire the Pro price; enable the customer portal.
  - [ ] Group mechanics: recurring call time + members-only calendar/Zoom link + coaching community space, gated behind an active $49 sub.
  - [ ] Welcome flow: on purchase, email the schedule + join link and add them to the group.
  - [ ] **Record the course videos as Jumaane** — script, shoot, upload to lessons.
  - [ ] Sweep copy/FAQ/homepage CTA that still says Pro / upgrade / 1:1.

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

## Security — 2026-09-07 audit
- [x] `public.exec(query text)` (SECURITY DEFINER, owned by postgres, callable by anon = arbitrary SQL with the publishable key) — **dropped**. Verified: REST `rpc/exec` now 404.
- [x] profiles: users could update their own `role` / `subscription_tier` — trigger `protect_profile_privileges` + `WITH CHECK` on the update policy (migration `20260907_protect_profile_privileges.sql`, applied by Jumaane in the SQL editor).
- [x] Stripe webhook used the cookie client (no session in a webhook → RLS dropped every write) — now `createAdminClient()` (service role); statuses mapped to the enum; `stripe_customer_id`, `stripe_subscription_id`, `subscription_end_date` columns added.
- [x] Rate limiter now counts in Upstash/Vercel KV when `KV_REST_API_*`/`UPSTASH_*` are set (falls back to memory). **Connect the Vercel KV store to this project** to make it real.
- [x] `'unsafe-eval'` removed from CSP 2026-09-07 (`'unsafe-inline'` stays — Next.js needs it without a nonce setup).
- [x] `app/api/test-db` deleted 2026-09-07.
- [ ] Not yet re-tested from a real user session: a signed-in non-admin PATCH on `subscription_tier` should now return 42501.

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
