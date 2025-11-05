# Kickoff Club HQ - Outstanding Tasks

## 🔴 Critical - Required for Production

### 1. Database Setup
- [ ] Create `lesson_comments` table in Supabase
  ```sql
  CREATE TABLE lesson_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    lesson_id UUID NOT NULL REFERENCES lessons(id),
    parent_id UUID REFERENCES lesson_comments(id),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );
  ```
- [ ] Add RLS policies for `lesson_comments` (see below)
- [ ] Verify all existing tables have proper RLS policies
- [ ] Add indexes for performance:
  ```sql
  CREATE INDEX idx_comments_lesson ON lesson_comments(lesson_id);
  CREATE INDEX idx_comments_user ON lesson_comments(user_id);
  CREATE INDEX idx_comments_parent ON lesson_comments(parent_id);
  ```

### 2. Email Configuration
- [x] Add Resend API key to `.env.local`: `RESEND_API_KEY=re_fY2HPuNE_JjQoFCARffhtM9UjWGUEXA9h`
- [ ] **Verify domain with Resend** (kickoffclubhq.com)
  - Go to: https://resend.com/domains
  - Add domain: kickoffclubhq.com
  - Add DNS records to your domain registrar
  - Wait for verification
- [ ] Update `FROM_EMAIL` in `.env.local` to verified domain email
- [ ] Test email sending with real users

### 3. Domain & Deployment
- [ ] Purchase/configure domain: kickoffclubhq.com
- [ ] Deploy to production (Vercel recommended)
- [ ] Set production environment variables
- [ ] Configure custom domain in hosting platform
- [ ] Set up SSL certificate (usually automatic)

---

## 🟡 High Priority - User Experience

### 4. Content & Media
- [ ] Create Open Graph image (`/public/og-image.png`) - 1200x630px
- [ ] Add logo files (`/public/logo.png`)
- [ ] Upload course thumbnail images
- [ ] Add instructor profile photos
- [ ] Record/upload course videos
- [ ] Create course descriptions and marketing copy

### 5. Admin Role Setup
- [ ] Manually set admin role in database:
  ```sql
  UPDATE profiles
  SET role = 'admin'
  WHERE email = 'your-admin-email@example.com';
  ```
- [ ] Test admin dashboard access
- [ ] Document admin user management process

### 6. Payment Integration (Stripe)
- [x] Create Stripe account
- [x] Add Stripe API keys to environment variables
- [x] Implement subscription checkout flow
- [x] Set up webhooks for subscription events
- [x] Create Basic ($19/mo) and Premium ($49/mo) products in Stripe
- [x] Test subscription flow end-to-end
- [x] Add billing portal for users

### 7. Search Engine Optimization
- [ ] Get Google Search Console verification code
- [ ] Add verification code to `.env.local`
- [ ] Get Yandex verification code (if targeting Russian market)
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics (optional)

---

## 🟢 Medium Priority - Enhancement

### 8. Testing
- [ ] Test user signup flow
- [ ] Test course enrollment flow
- [ ] Test video playback and progress tracking
- [ ] Test review submission
- [ ] Test comment posting and replies
- [ ] Test certificate generation
- [ ] Test email notifications (all types)
- [ ] Test admin dashboard functionality
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile responsiveness testing

### 9. Performance Optimization
- [ ] Add image optimization (convert to WebP)
- [ ] Implement lazy loading for images
- [ ] Add caching headers for static assets
- [ ] Optimize video delivery (consider CDN)
- [ ] Test page load speeds with Lighthouse
- [ ] Implement rate limiting for API endpoints

### 10. Security Hardening
- [ ] Review all RLS policies
- [ ] Add rate limiting for auth endpoints
- [ ] Implement CSRF protection
- [ ] Add input sanitization for user comments
- [ ] Set up security headers (HSTS, CSP, etc.)
- [ ] Configure CORS properly
- [ ] Add API route protection

---

## 🔵 Low Priority - Nice to Have

### 11. Additional Features
- [ ] Course search functionality
- [ ] Course filtering by category/difficulty
- [ ] User profile customization (avatar upload)
- [ ] Course recommendations based on completed courses
- [ ] Discussion forum/community page
- [ ] Live chat support widget
- [ ] Push notifications for new courses
- [ ] Mobile app (React Native)

### 12. Marketing & Growth
- [ ] Create social media accounts (Twitter, Facebook, Instagram)
- [ ] Set up email marketing (Mailchimp/ConvertKit)
- [ ] Create affiliate program
- [ ] Add referral system
- [ ] Create blog for content marketing
- [ ] Set up A/B testing for landing page
- [ ] Create promotional videos

### 13. Analytics & Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Set up uptime monitoring
- [ ] Create admin analytics dashboard
- [ ] Track user engagement metrics
- [ ] Monitor email delivery rates
- [ ] Set up automated backups

### 14. Legal & Compliance
- [x] Create Privacy Policy page
- [x] Create Terms of Service page
- [x] Create Cookie Policy page
- [x] Add cookie consent banner
- [x] Add GDPR compliance features
- [x] Create refund policy
- [ ] Consult lawyer for legal review (optional)

---

## 📝 RLS Policies for lesson_comments

```sql
-- Enable RLS
ALTER TABLE lesson_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read comments
CREATE POLICY "Comments are viewable by everyone"
  ON lesson_comments FOR SELECT
  USING (true);

-- Users can create their own comments
CREATE POLICY "Users can create comments"
  ON lesson_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update own comments"
  ON lesson_comments FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own comments, admins can delete any
CREATE POLICY "Users can delete own comments"
  ON lesson_comments FOR DELETE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

---

## 🎯 Immediate Next Steps (This Week)

1. **Set up database table for comments**
   - Run SQL commands in Supabase SQL editor
   - Test comment creation/deletion

2. **Verify Resend domain**
   - Add domain in Resend dashboard
   - Configure DNS records
   - Wait for verification

3. **Create content**
   - Upload at least 1-2 demo courses
   - Add course thumbnails and descriptions
   - Record or find sample videos

4. **Set up admin user**
   - Update your user role to 'admin' in database
   - Access admin dashboard
   - Test course/user management

5. **Deploy to staging**
   - Deploy to Vercel or similar platform
   - Test all features in production-like environment
   - Invite beta users for feedback

---

## 📞 Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Resend Docs**: https://resend.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Stripe Integration**: https://stripe.com/docs/payments/checkout

---

## ✅ Completed Features

- ✅ Course reviews and ratings system
- ✅ Professional landing page
- ✅ SEO meta tags and Open Graph
- ✅ Progress analytics dashboard
- ✅ Email notification system (templates ready)
- ✅ Admin dashboard (overview, courses, users, reviews)
- ✅ Discussion/comments on lessons (with replies)
- ✅ Video player with progress tracking
- ✅ Course enrollment system
- ✅ Certificate generation
- ✅ User authentication (Supabase Auth)
- ✅ Subscription tiers (Free, Basic, Premium)
- ✅ Course progress tracking
- ✅ Saved courses functionality

---

**Last Updated**: November 4, 2025
**Status**: Ready for production deployment after completing critical tasks
