# Podcast Distribution Guide

Complete guide for submitting Kickoff Club Podcast to major podcast platforms.

## Prerequisites Checklist

Before submitting to any platform, ensure you have:

- ✅ **RSS Feed Live**: Your RSS feed must be publicly accessible
  - URL: `https://kickoffclubhq.com/api/podcast-feed`
  - Test it: Should return valid XML with all 10 episodes

- ✅ **Podcast Cover Art**:
  - Size: 3000x3000 pixels (minimum 1400x1400, max 3000x3000)
  - Format: JPG or PNG
  - RGB color space (not CMYK)
  - Location: `/public/images/podcast-cover.jpg`

- ✅ **Audio Files**:
  - All 10 episodes uploaded and accessible
  - Format: M4A or MP3
  - Good audio quality (at least 128kbps)

- ✅ **Environment Variables Set**:
  ```bash
  NEXT_PUBLIC_SITE_URL=https://kickoffclubhq.com
  PODCAST_EMAIL=podcast@kickoffclubhq.com
  ```

---

## 1. Apple Podcasts

### Requirements
- Apple ID
- Valid email address
- Cover art (3000x3000px)
- At least 1 episode in RSS feed

### Submission Steps

1. **Go to Apple Podcasts Connect**
   - URL: https://podcastsconnect.apple.com/
   - Sign in with your Apple ID

2. **Add Your Podcast**
   - Click the "+" button
   - Enter your RSS feed URL: `https://kickoffclubhq.com/api/podcast-feed`
   - Click "Validate"

3. **Verify Feed Information**
   - Apple will fetch your podcast information from the RSS feed
   - Review:
     - Podcast title: "Kickoff Club: Football for Complete Beginners"
     - Description
     - Cover artwork
     - Episodes list
     - Categories: Sports > Football, Education > How To

4. **Submit for Review**
   - Click "Submit"
   - Apple typically reviews within 5-7 business days
   - You'll receive an email when approved

### After Approval
- Your podcast will be searchable on Apple Podcasts
- Share link: Will be like `https://podcasts.apple.com/us/podcast/kickoff-club/idXXXXXXXXX`
- Analytics available in Podcasts Connect

---

## 2. Spotify for Podcasters

### Requirements
- Spotify account (free)
- Valid RSS feed
- Cover art (3000x3000px minimum)

### Submission Steps

1. **Go to Spotify for Podcasters**
   - URL: https://podcasters.spotify.com/
   - Sign in or create a Spotify account

2. **Get Started**
   - Click "Get Started" or "Add Your Podcast"
   - Select "I already have a podcast"

3. **Enter RSS Feed**
   - Paste: `https://kickoffclubhq.com/api/podcast-feed`
   - Click "Next"

4. **Verify Ownership**
   - Spotify will send a verification code to the email in your RSS feed
   - Check `podcast@kickoffclubhq.com` for the verification email
   - Enter the code

5. **Review & Submit**
   - Verify podcast information
   - Select podcast language: English
   - Choose category: Sports
   - Add country availability: Worldwide
   - Click "Submit"

6. **Wait for Approval**
   - Usually appears within 24-48 hours
   - You'll receive a confirmation email

### After Approval
- Podcast appears in Spotify search
- Access analytics dashboard
- Share link: Will be like `https://open.spotify.com/show/XXXXXXXXXXXXX`

---

## 3. Google Podcasts

### Important Note
Google Podcasts is being sunset in 2024 and migrating to YouTube Music. Follow the YouTube Music instructions below instead.

---

## 4. YouTube Music (Google's Podcast Platform)

### Requirements
- YouTube channel
- Google account
- Valid RSS feed

### Submission Steps

1. **Go to YouTube Studio**
   - URL: https://studio.youtube.com/
   - Sign in with your Google account

2. **Navigate to Podcasts**
   - In the left sidebar, click "Podcasts"
   - Click "Get Started" or "Add Podcast"

3. **Add RSS Feed**
   - Enter: `https://kickoffclubhq.com/api/podcast-feed`
   - Click "Continue"

4. **Link to YouTube Channel**
   - Select the YouTube channel to associate with podcast
   - Or create a new channel specifically for the podcast

5. **Review & Publish**
   - Review podcast information
   - Click "Publish"
   - Podcast will be available on YouTube Music

### After Publishing
- Episodes will appear on YouTube Music
- Can also appear as YouTube videos if you upload video versions
- Analytics in YouTube Studio

---

## 5. Amazon Music / Audible

### Requirements
- Amazon account
- Valid RSS feed
- Podcast cover art

### Submission Steps

1. **Go to Amazon Music for Podcasters**
   - URL: https://podcasters.amazon.com/
   - Sign in with Amazon account

2. **Add Podcast**
   - Click "Add Your Podcast"
   - Enter RSS feed: `https://kickoffclubhq.com/api/podcast-feed`

3. **Verify Ownership**
   - Amazon will email verification code
   - Enter code from email

4. **Submit for Review**
   - Review podcast details
   - Click "Submit"
   - Approval typically within 48 hours

---

## 6. Additional Platforms (Optional)

### Podcast Index
- URL: https://podcastindex.org/
- Open directory that feeds many smaller apps
- Submit RSS feed directly

### iHeartRadio
- URL: https://www.iheart.com/podcast/
- Submit through their creator platform

### TuneIn
- URL: https://tunein.com/podcasts/
- Email RSS feed to: podcasts@tunein.com

### Stitcher
- URL: https://www.stitcher.com/content-providers
- Submit RSS feed through their partner portal

---

## RSS Feed Validation

Before submitting anywhere, validate your RSS feed:

### Online Validators
1. **Cast Feed Validator**
   - URL: https://castfeedvalidator.com/
   - Paste: `https://kickoffclubhq.com/api/podcast-feed`
   - Check for errors

2. **Podbase**
   - URL: https://podba.se/validate/
   - Validates against Apple's requirements

3. **W3C Feed Validator**
   - URL: https://validator.w3.org/feed/
   - General RSS/XML validation

### What to Check
- ✅ Valid XML structure
- ✅ All required iTunes tags present
- ✅ Episode enclosure URLs are accessible
- ✅ Cover art URL works
- ✅ Audio files are playable
- ✅ Dates are properly formatted

---

## Troubleshooting Common Issues

### Feed Not Updating
- Most platforms cache RSS feeds (15-60 minutes)
- Force refresh in platform dashboard if available
- Check that your RSS endpoint returns `Cache-Control` headers

### Episodes Not Showing
- Verify `is_published = true` in database
- Check `audio_url` is accessible
- Ensure audio files exist and are in correct format

### Cover Art Not Appearing
- Must be exactly 3000x3000px for best results
- RGB color space (not CMYK)
- JPG or PNG format
- Hosted on HTTPS URL

### Platform Rejection
- **Apple**: Usually due to content policy or technical issues
- **Spotify**: Check RSS feed validity
- **YouTube**: Ensure compliance with YouTube policies

---

## Post-Submission Checklist

After your podcast is live on platforms:

- [ ] Add platform badges to website
- [ ] Update social media with podcast links
- [ ] Create shareable graphics with platform links
- [ ] Set up analytics tracking
- [ ] Plan promotion strategy
- [ ] Schedule social posts for new episodes
- [ ] Engage with listeners/reviews

---

## Platform Badge Images

Add these to your website to link to podcast platforms:

```html
<!-- Apple Podcasts -->
<a href="YOUR_APPLE_PODCASTS_URL">
  <img src="/images/badges/apple-podcasts-badge.svg" alt="Listen on Apple Podcasts">
</a>

<!-- Spotify -->
<a href="YOUR_SPOTIFY_URL">
  <img src="/images/badges/spotify-badge.svg" alt="Listen on Spotify">
</a>

<!-- YouTube Music -->
<a href="YOUR_YOUTUBE_MUSIC_URL">
  <img src="/images/badges/youtube-music-badge.svg" alt="Listen on YouTube Music">
</a>
```

Download official badges from:
- Apple: https://www.apple.com/itunes/marketing-on-podcasts/
- Spotify: https://developer.spotify.com/documentation/design
- YouTube: https://www.youtube.com/about/brand-resources/

---

## Maintenance & Updates

### When You Add New Episodes
1. Insert new episode in Supabase `podcasts` table
2. RSS feed automatically updates
3. Platforms will pick up new episodes within their refresh cycle (usually 24 hours)

### If You Need to Update Episode Info
1. Update record in Supabase
2. Most platforms will update within 24-48 hours
3. Some platforms allow manual refresh in dashboard

---

## Support Contacts

If you encounter issues:

- **Apple Podcasts**: https://help.apple.com/itc/podcasts_connect/
- **Spotify**: https://support.spotify.com/podcasters/
- **YouTube**: https://support.google.com/youtube/
- **Amazon**: https://www.amazon.com/podcasters/support

---

## Summary

Your RSS feed is at: **https://kickoffclubhq.com/api/podcast-feed**

This single feed works for ALL platforms. Once you submit it:
1. Apple Podcasts (5-7 days approval)
2. Spotify (24-48 hours)
3. YouTube Music (instant)
4. Amazon Music (48 hours)
5. Other platforms (varies)

Good luck with your podcast launch! 🎙️
