# Image Management Guide for Kickoff Club HQ

## Overview
This guide shows you where to place images and how they're used throughout the site.

## Directory Structure

```
public/
├── images/
│   ├── hero/
│   │   └── hero-training.jpg          # Main hero image (1200x900px)
│   ├── coaches/
│   │   ├── [coach-name].jpg           # Coach profile photos (400x400px)
│   │   └── ...
│   ├── testimonials/
│   │   ├── [student-name].jpg         # Student photos (400x400px)
│   │   └── ...
│   └── courses/
│       ├── [course-slug]/
│       │   ├── thumbnail.jpg          # Course thumbnail (800x600px)
│       │   └── lessons/
│       │       ├── [lesson-id].jpg    # Lesson thumbnails
│       │       └── ...
│       └── ...
```

## Image Requirements

### 1. Hero Section
**File**: `/public/images/hero/hero-training.jpg`
**Dimensions**: 1200x900px (4:3 ratio)
**Usage**: Main homepage hero image
**Recommended**: High-quality action shot of your training sessions

**Current placeholder**:
```
https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200
```

**To replace**: Add your image to `/public/images/hero/hero-training.jpg` and update:
- File: `components/sections/hero-section.tsx`
- Line: 129
- Change: `src="https://images.unsplash.com/..."` to `src="/images/hero/hero-training.jpg"`

---

### 2. Featured Courses (Homepage)
**Location**: Stored in Supabase `courses` table
**Field**: `thumbnail_url`
**Dimensions**: 800x600px recommended
**Usage**: Course cards on homepage

**Current setup**: Hardcoded in `components/sections/featured-courses-section.tsx`

**To use real data**: The component should fetch from your database instead of using hardcoded data. See "Database Integration" section below.

---

### 3. Coach Photos
**Directory**: `/public/images/coaches/`
**Dimensions**: 400x400px (square)
**Format**: JPG or PNG
**Usage**: Course instructor avatars

**Naming convention**:
```
mike-patterson.jpg
sarah-williams.jpg
david-thompson.jpg
james-rodriguez.jpg
```

**Current placeholders**:
```
https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400  # Mike
https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400  # Sarah
https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400  # David
https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400  # James
```

**To replace**:
1. Add photos to `/public/images/coaches/[name].jpg`
2. Update in your Supabase `instructors` or `courses` table

---

### 4. Testimonial Photos
**Directory**: `/public/images/testimonials/`
**Dimensions**: 400x400px (square)
**Format**: JPG or PNG
**Usage**: Student testimonial photos

**Option 1**: Use real student photos (with permission)
**Option 2**: Keep avatar initials (current fallback works well)

**Current placeholders**:
```
https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400
https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400
etc...
```

**To replace testimonials with real data**: See "Database Integration" section below.

---

## Database Integration

### Option 1: Update Featured Courses to Use Real Data

Currently, the featured courses are hardcoded. Here's how to make them dynamic:

1. **Fetch from Supabase** in `components/sections/featured-courses-section.tsx`
2. **Use course data** that already has `thumbnail_url` field
3. **Filter for featured courses** (add `is_featured` column to courses table)

Example structure:
```typescript
// In your Supabase courses table:
{
  id: "uuid",
  title: "QB Fundamentals: Reading Defenses",
  slug: "qb-fundamentals",
  thumbnail_url: "https://[your-storage]/courses/qb-fundamentals/thumbnail.jpg",
  instructor_name: "Coach Mike Patterson",
  instructor_avatar: "https://[your-storage]/coaches/mike-patterson.jpg",
  rating: 4.8,
  review_count: 124,
  is_featured: true  // Add this column
}
```

### Option 2: Store Images in Supabase Storage

Instead of `/public/images/`, you can use Supabase Storage:

**Buckets to create**:
- `course-thumbnails` (public)
- `coach-avatars` (public)
- `testimonial-photos` (public)
- `hero-images` (public)

**Advantages**:
- CDN delivery
- Easy uploads via admin panel
- URLs stored in database
- Version control

**Disadvantages**:
- Requires Supabase setup
- External dependency

---

## Quick Start: Replacing Placeholder Images

### Step 1: Add Your Images to Public Folder

```bash
# Create directories
mkdir -p public/images/hero
mkdir -p public/images/coaches
mkdir -p public/images/testimonials

# Add your images (example)
cp ~/Downloads/my-hero-image.jpg public/images/hero/hero-training.jpg
cp ~/Downloads/coach-mike.jpg public/images/coaches/mike-patterson.jpg
```

### Step 2: Update Component Files

**Hero Image**:
```typescript
// components/sections/hero-section.tsx (line 129)
<Image
  src="/images/hero/hero-training.jpg"  // Changed from Unsplash URL
  alt="Football training in action"
  fill
  className="object-cover"
  priority
/>
```

**Coach Photos** (in featured courses):
```typescript
// components/sections/featured-courses-section.tsx (lines 30, 45, 60, 75)
instructorAvatar: "/images/coaches/mike-patterson.jpg",
```

---

## Optimizing Images for Web

Before uploading, optimize your images:

### Tools:
- **TinyPNG** (https://tinypng.com/) - Compress JPG/PNG
- **Squoosh** (https://squoosh.app/) - Advanced compression
- **ImageOptim** (Mac) - Batch optimization

### Recommended settings:
- **Format**: JPG for photos, PNG for logos
- **Quality**: 80-85% for JPG
- **Dimensions**: See requirements above
- **File size**: Keep under 200KB per image

### Next.js Image Optimization:
Next.js automatically optimizes images when you use the `<Image>` component. It:
- Lazy loads images
- Serves WebP format when supported
- Resizes for different screen sizes
- Optimizes quality

---

## Current Status

### ✅ Using Placeholders (Working):
- Hero image
- Featured course thumbnails
- Coach avatars
- Testimonial photos

### 🔄 Next Steps:
1. **Add real hero image** to `/public/images/hero/`
2. **Add coach photos** to `/public/images/coaches/`
3. **Update featured courses** to fetch from database OR replace hardcoded URLs
4. **Optional**: Add real testimonial photos OR keep initials

### 📝 Future Enhancements:
- Add `is_featured` column to courses table
- Create Supabase storage buckets
- Build admin panel for image uploads
- Add image upload to course creation flow

---

## Need Help?

If you need help:
1. Preparing images for specific dimensions
2. Setting up Supabase Storage
3. Creating dynamic featured courses section
4. Building image upload functionality

Just let me know!
