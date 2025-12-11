# Asset Migration Tracker

**Goal:** Migrate all assets from Claude SVGs to Antigravity PNGs
**Status:** In Progress

---

## Migration Status

### Buildings ✅ INTEGRATED

| Building | L1 | L2 | L3 | L4 | L5 | Status |
|----------|----|----|----|----|----|----|
| Film Room | ✅ | ⏳ | ✅ | ⏳ | ✅ | Using fallbacks for L2, L4 |
| Practice Field | ✅ | ⏳ | ✅ | ⏳ | ✅ | Using fallbacks for L2, L4 |
| Stadium | ✅ | ⏳ | ✅ | ⏳ | ⏳ | Using fallbacks for L2, L4, L5 |
| Headquarters | ✅ | ⏳ | ✅ | ⏳ | ✅ | Using fallbacks for L2, L4 |
| Weight Room | ✅ | ⏳ | ✅ | ⏳ | ✅ | Using fallbacks for L2, L4 |

**Legend:** ✅ Antigravity PNG | ⏳ Pending (using fallback)

---

### Units 🔄 PARTIAL

| Unit | Idle | Training | Ready | Status |
|------|------|----------|-------|--------|
| Secondary | ✅ | ✅ | ✅ | Complete |
| Special Teams | ✅ | ✅ | ✅ | Complete |
| Quarterback | ⏳ | ⏳ | ⏳ | Using Secondary as fallback |
| Running Back | ⏳ | ⏳ | ⏳ | Using Secondary as fallback |
| Wide Receiver | ⏳ | ⏳ | ⏳ | Using Secondary as fallback |
| Lineman | ⏳ | ⏳ | ⏳ | Using Secondary as fallback |
| Kicker | ⏳ | ⏳ | ⏳ | Using Special Teams as fallback |

---

### Icons 🔄 HYBRID

| Icon | SVG | PNG | In Use |
|------|-----|-----|--------|
| Coins | ✅ | ✅ | SVG (smaller) |
| Energy | ✅ | ✅ | SVG (smaller) |
| XP | ✅ | ✅ | SVG (smaller) |
| Knowledge | ✅ | ❌ | SVG |
| Level | ❌ | ✅ | PNG |
| Rank Bronze | ❌ | ✅ | PNG |
| Rank Silver | ❌ | ✅ | PNG |
| Rank Gold | ❌ | ✅ | PNG |
| Rank Platinum | ❌ | ✅ | PNG |
| Rank Diamond | ❌ | ✅ | PNG |

**Strategy:** Keep SVG icons for resources (smaller), use PNG for ranks (better visuals)

---

### Decorations ✅ COMPLETE

| Decoration | Status |
|------------|--------|
| Club Fountain | ✅ PNG |
| Merch Stand | ✅ PNG |
| Parking Lot | ✅ PNG |
| Statue Legends | ✅ PNG |
| Tailgate Tent | ✅ PNG |
| Team Bus | ✅ PNG |

---

### Backgrounds ❌ NOT STARTED

| Background | SVG | PNG | Status |
|------------|-----|-----|--------|
| Field Grass | ✅ | ❌ | Need from Antigravity |
| Sky Gradient | ✅ | ❌ | Need from Antigravity |
| Stadium Crowd | ✅ | ❌ | Need from Antigravity |
| Menu Pattern | ✅ | ❌ | Need from Antigravity |

---

## File Locations

```
assets/
├── buildings/              # Antigravity PNGs (organized by building)
│   ├── film-room/
│   ├── practice-field/
│   ├── stadium/
│   ├── headquarters/
│   └── weight-room/
├── images/                 # Antigravity PNGs (flat structure)
│   ├── buildings/         # (duplicate - can remove)
│   ├── decorations/
│   ├── icons/
│   └── units/
└── svg/                    # Claude SVGs (keeping for now)
    ├── icons/
    ├── units/
    ├── backgrounds/
    └── buildings/         # (deprecated - replaced by PNG)
```

---

## Pending from Antigravity

### Priority 1 - Buildings (11 assets)
- [ ] film-room-2.png, film-room-4.png
- [ ] practice-field-2.png, practice-field-4.png
- [ ] stadium-2.png, stadium-4.png, stadium-5.png
- [ ] headquarters-2.png, headquarters-4.png
- [ ] weight-room-2.png, weight-room-4.png

### Priority 2 - Units (9 assets)
- [ ] quarterback-idle.png, quarterback-training.png, quarterback-ready.png
- [ ] running-back-idle.png, running-back-training.png, running-back-ready.png
- [ ] wide-receiver-idle.png, wide-receiver-training.png, wide-receiver-ready.png

### Priority 3 - Backgrounds (4 assets)
- [ ] field-grass.png
- [ ] sky-gradient.png
- [ ] stadium-crowd.png
- [ ] menu-pattern.png

---

## When Antigravity Delivers New Assets

1. Place raw PNGs in `temp_assets/`
2. Run compression: `node scripts/compress-images.js`
3. Copy to appropriate folders
4. Update `assets.ts` to remove fallbacks
5. Update this tracker

---

## Summary

| Category | Total | Delivered | Integrated | Using Fallback |
|----------|-------|-----------|------------|----------------|
| Buildings | 25 | 14 | 14 ✅ | 11 |
| Units | 15 | 6 | 6 ✅ | 9 |
| Decorations | 6 | 6 | 6 ✅ | 0 |
| Icons | 10 | 9 | 9 ✅ | 0 |
| Backgrounds | 4 | 0 | 0 | 4 |
| **TOTAL** | **60** | **35** | **35** | **24** |

**Progress: 58% delivered, 100% integrated with fallbacks**

---

*Last Updated: December 8, 2025*
