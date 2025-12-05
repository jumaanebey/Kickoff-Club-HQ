# Kickoff Club HQ - Folder Consolidation Plan

## Current Situation Analysis

You have **multiple Kickoff Club folders** scattered across your system. Here's what I found:

### 📁 Main Projects (Next.js - Full Platform)

#### 1. `/Users/jumaanebey/Downloads/kickoff-club-hq` ⭐ **MOST COMPLETE**
- **Type**: Next.js 14 full platform
- **Git**: ✅ Connected to `github.com/jumaanebey/Kickoff-Club-HQ`
- **Size**: ~2.96KB package.json
- **Last Updated**: Nov 23, 2025 (most recent)
- **Key Features**:
  - Antigravity's 13 game components
  - MCP configuration (.mcp.json)
  - R2 video integration
  - Supabase setup
  - YouTube integration scripts
  - Framer Motion v12.23.24
  - Next.js 14.2.33
  - Complete course/lesson system
- **Status**: ✅ **THIS IS YOUR MAIN PROJECT**

#### 2. `/Users/jumaanebey/Desktop/Kickoff-Club-HQ`
- **Type**: Next.js 14 full platform
- **Git**: ✅ Connected to SAME repo `github.com/jumaanebey/Kickoff-Club-HQ`
- **Size**: ~2.85KB package.json
- **Last Updated**: Nov 18, 2025
- **Key Difference**: Next.js 14.2.0 (older version)
- **Status**: ⚠️ **DUPLICATE - Older version of main project**

### 📁 Other Projects

#### 3. `/Users/jumaanebey/Downloads/kickoff-club-v2`
- **Type**: Vite + React prototype
- **Size**: 540 bytes package.json
- **Key Features**: Vite-based, minimal dependencies
- **Status**: 🗑️ **OLD PROTOTYPE - Can archive**

#### 4. `/Users/jumaanebey/Downloads/Kickoff Club HQ Mobile App`
- **Type**: Mobile app planning docs (no code)
- **Contents**:
  - 9-MONTH-EXECUTION-PLAN.md
  - APP-ARCHITECTURE.md
  - MASTER-PLAN-SUMMARY.md
  - SPONSORSHIP-PITCH-DECK.md
  - Some component files (Footer.tsx, Navigation.tsx, etc.)
- **Status**: 📱 **MOBILE APP PLANNING/COMPONENTS**

#### 5. `/Users/jumaanebey/Downloads/kickoff-club-prototype`
- **Type**: Early prototype
- **Status**: 🗑️ **OLD - Can archive**

#### 6. `/Users/jumaanebey/Downloads/kickoff-club-enhanced`
- **Type**: Unknown (need to check)
- **Status**: 🔍 **NEEDS INVESTIGATION**

### 📁 Content/Utility Folders

- `/Users/jumaanebey/Downloads/kickoff-shorts` - Video shorts content
- `/Users/jumaanebey/Downloads/kickoff-youtube-uploads` - YouTube upload content
- `/Users/jumaanebey/Downloads/kickoff-youtube-clean` - Cleaned YouTube content
- `/Users/jumaanebey/Downloads/kickoff-videos-clean` - Cleaned video files

---

## 🎯 Recommended Consolidation Structure

Create ONE umbrella folder with this structure:

```
/Users/jumaanebey/Projects/Kickoff-Club/
├── kickoff-club-hq/                    # Main web app (from Downloads)
│   ├── app/
│   ├── components/
│   ├── database/
│   ├── .mcp.json
│   └── ...all existing files
│
├── mobile-app/                          # Mobile app planning & components
│   ├── docs/
│   │   ├── 9-MONTH-EXECUTION-PLAN.md
│   │   ├── APP-ARCHITECTURE.md
│   │   ├── MASTER-PLAN-SUMMARY.md
│   │   └── SPONSORSHIP-PITCH-DECK.md
│   └── components/
│       ├── Footer.tsx
│       ├── Navigation.tsx
│       └── ...
│
├── content/                             # All content files
│   ├── shorts/
│   ├── youtube-uploads/
│   ├── youtube-clean/
│   └── videos-clean/
│
├── archive/                             # Old versions
│   ├── kickoff-club-v2/                # Vite prototype
│   ├── kickoff-club-prototype/
│   ├── kickoff-club-enhanced/
│   └── Desktop-Kickoff-Club-HQ/        # Duplicate from Desktop
│
└── README.md                            # Master overview
```

---

## 📋 Step-by-Step Consolidation Commands

### Step 1: Create the umbrella folder
```bash
mkdir -p ~/Projects/Kickoff-Club
cd ~/Projects/Kickoff-Club
```

### Step 2: Move the main project (MOST IMPORTANT)
```bash
# Move the Downloads version (most up-to-date)
mv ~/Downloads/kickoff-club-hq ~/Projects/Kickoff-Club/kickoff-club-hq

# Or if you prefer to copy first (safer)
cp -R ~/Downloads/kickoff-club-hq ~/Projects/Kickoff-Club/kickoff-club-hq
```

### Step 3: Create and move mobile app folder
```bash
mkdir -p ~/Projects/Kickoff-Club/mobile-app/docs
mkdir -p ~/Projects/Kickoff-Club/mobile-app/components

# Move mobile app files
mv ~/Downloads/Kickoff\ Club\ HQ\ Mobile\ App/*.md ~/Projects/Kickoff-Club/mobile-app/docs/
mv ~/Downloads/Kickoff\ Club\ HQ\ Mobile\ App/*.tsx ~/Projects/Kickoff-Club/mobile-app/components/
```

### Step 4: Move content folders
```bash
mkdir -p ~/Projects/Kickoff-Club/content

mv ~/Downloads/kickoff-shorts ~/Projects/Kickoff-Club/content/shorts
mv ~/Downloads/kickoff-youtube-uploads ~/Projects/Kickoff-Club/content/youtube-uploads
mv ~/Downloads/kickoff-youtube-clean ~/Projects/Kickoff-Club/content/youtube-clean
mv ~/Downloads/kickoff-videos-clean ~/Projects/Kickoff-Club/content/videos-clean
```

### Step 5: Archive old projects
```bash
mkdir -p ~/Projects/Kickoff-Club/archive

mv ~/Downloads/kickoff-club-v2 ~/Projects/Kickoff-Club/archive/
mv ~/Downloads/kickoff-club-prototype ~/Projects/Kickoff-Club/archive/
mv ~/Downloads/kickoff-club-enhanced ~/Projects/Kickoff-Club/archive/
mv ~/Desktop/Kickoff-Club-HQ ~/Projects/Kickoff-Club/archive/Desktop-Kickoff-Club-HQ
```

### Step 6: Update your working directory
```bash
cd ~/Projects/Kickoff-Club/kickoff-club-hq
```

### Step 7: Create a master README
```bash
cat > ~/Projects/Kickoff-Club/README.md << 'EOF'
# Kickoff Club - Master Project

This folder contains all Kickoff Club related projects and content.

## Structure

- **kickoff-club-hq/** - Main Next.js 14 web application (production)
- **mobile-app/** - Mobile app planning docs and components
- **content/** - Video and content files
- **archive/** - Old prototypes and duplicates

## Active Development

The main development happens in `kickoff-club-hq/`. See its README for setup instructions.

## Important Files

- MCP Configuration: `kickoff-club-hq/.mcp.json`
- Environment: `kickoff-club-hq/.env.local`
- Onboarding: `kickoff-club-hq/CLAUDE_ONBOARDING_PROMPT.md`

## Git Repository

Main project: https://github.com/jumaanebey/Kickoff-Club-HQ
EOF
```

---

## ⚠️ Important Notes Before Moving

### 1. **Backup First**
```bash
# Create a backup of everything
tar -czf ~/kickoff-club-backup-$(date +%Y%m%d).tar.gz \
  ~/Downloads/kickoff-club-hq \
  ~/Desktop/Kickoff-Club-HQ \
  ~/Downloads/kickoff-club-v2 \
  ~/Downloads/"Kickoff Club HQ Mobile App"
```

### 2. **Check for Uncommitted Changes**
```bash
cd ~/Downloads/kickoff-club-hq
git status

cd ~/Desktop/Kickoff-Club-HQ
git status
```

### 3. **Desktop Version is Older**
The Desktop version has:
- Older Next.js (14.2.0 vs 14.2.33)
- No Playwright in devDependencies
- Last updated Nov 18 vs Nov 23

**Action**: Use Downloads version as primary, archive Desktop version.

### 4. **Update Claude Code Config**
After moving, update your `.mcp.json` paths if needed, and restart Claude Code to recognize the new location.

---

## 🚀 Post-Consolidation Checklist

- [ ] Backup created
- [ ] Main project moved to `~/Projects/Kickoff-Club/kickoff-club-hq`
- [ ] Mobile app docs organized
- [ ] Content folders moved
- [ ] Old projects archived
- [ ] Master README created
- [ ] Git still works (`git status` in main project)
- [ ] Dev server runs (`npm run dev` in main project)
- [ ] Claude Code `.mcp.json` still works
- [ ] Update any IDE workspace settings
- [ ] Delete old folders after verifying everything works

---

## 📊 Summary

### Keep & Use:
- ✅ `~/Projects/Kickoff-Club/kickoff-club-hq` (from Downloads) - **PRIMARY**

### Organize:
- 📱 Mobile app docs → `~/Projects/Kickoff-Club/mobile-app`
- 📁 Content files → `~/Projects/Kickoff-Club/content`

### Archive:
- 🗑️ Desktop duplicate
- 🗑️ Old prototypes (v2, prototype, enhanced)

### Result:
**ONE unified project structure** under `~/Projects/Kickoff-Club/` with clear separation between active development, planning, content, and archives.
