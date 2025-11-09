# Dark Mode Button Hover State Issue

## Problem
Multiple buttons have white-on-white text in dark mode, making them invisible or difficult to read.

## Affected Buttons
1. **Homepage**: "Watch Sample Lesson" button (`components/sections/hero-section.tsx:80`)
2. **Homepage**: "Browse All Courses" button (`app/home-client.tsx:79`)
3. **Sign-in page**: "Continue with Google" button (`app/auth/sign-in/page.tsx:157`)
4. **Sign-up page**: "Continue with Google" button (`app/auth/sign-up/page.tsx:192`)

## Current State
All buttons use:
```typescript
variant="outline"
className={cn("border-2 [&]:hover:bg-orange-500/10 [&]:hover:text-current", colors.cardBorder, colors.text)}
```

The custom hover classes `[&]:hover:bg-orange-500/10 [&]:hover:text-current` are intended to:
- Add an orange tint on hover (`bg-orange-500/10`)
- Preserve text color on hover (`text-current`)

## Root Cause
The Button component (`components/ui/button.tsx`) uses CVA (class-variance-authority) for variant management. CSS specificity conflicts are preventing the custom Tailwind classes from taking effect.

Multiple approaches attempted:
1. ✗ Using `hover:` classes → overridden by CVA
2. ✗ Using `[&]:hover:` syntax for higher specificity → didn't work
3. ✗ Removing hover styles from CVA outline variant → still not working

## Attempted Solutions
### Attempt 1: Simple hover classes
- Added `hover:bg-orange-500/10` to buttons
- **Failed**: CVA outline variant's hover styles took precedence

### Attempt 2: Higher specificity with `[&]:` syntax
- Changed to `[&]:hover:bg-orange-500/10 [&]:hover:text-current`
- **Failed**: Still overridden by CVA

### Attempt 3: Remove CVA hover styles
- Modified `components/ui/button.tsx` line 15-16
- Changed from: `outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"`
- Changed to: `outline: "border border-input bg-background"`
- **Failed**: Still not working in production

## Additional Issue
Dark mode input text was also wrong (`lib/themes.ts:114`):
- Changed from `inputText: 'text-white'` to `inputText: 'text-black'`
- This fixed the newsletter email input readability

## Next Steps for Manual Fix

### Option 1: Use !important (not ideal but might work)
```typescript
className={cn("border-2 ![&]:hover:bg-orange-500/10 ![&]:hover:text-current", colors.cardBorder, colors.text)}
```

### Option 2: Create custom button variant
Add a new variant to the Button component specifically for dark mode:
```typescript
// components/ui/button.tsx
variants: {
  variant: {
    default: "bg-primary-500 text-white hover:bg-primary-600",
    // ... other variants
    outlineDark: "border border-input bg-background hover:bg-orange-500/10",
  }
}
```

### Option 3: Inline styles
Replace className approach with inline styles for hover (using onMouseEnter/onMouseLeave):
```typescript
const [isHovered, setIsHovered] = useState(false)
<Button
  style={isHovered ? { backgroundColor: 'rgba(249, 115, 22, 0.1)' } : {}}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>
```

### Option 4: Separate CSS file with higher specificity
Create a separate CSS module with higher specificity:
```css
/* styles/dark-mode-buttons.module.css */
.darkModeButton:hover {
  background-color: rgba(249, 115, 22, 0.1) !important;
  color: currentColor !important;
}
```

## Testing
After applying fix, test all 4 buttons in dark mode:
1. Switch to dark mode
2. Verify button text is visible (not white-on-white)
3. Hover over each button
4. Verify orange tint appears on hover
5. Verify text remains visible on hover

## Production URL
https://kickoff-club-d3p5y51xp-jumaane-beys-projects.vercel.app

## Files to Review
- `components/ui/button.tsx` - Button component with CVA variants
- `components/sections/hero-section.tsx:80` - Watch Sample Lesson button
- `app/home-client.tsx:79` - Browse All Courses button
- `app/auth/sign-in/page.tsx:157` - Sign-in Google button
- `app/auth/sign-up/page.tsx:192` - Sign-up Google button
- `lib/themes.ts` - Theme color definitions
