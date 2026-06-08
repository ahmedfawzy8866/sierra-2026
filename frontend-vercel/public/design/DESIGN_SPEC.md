# Sierra Estates 2027 — Frontend Design Specification
## Current Implementation for Designer Review

---

## 🎨 COLOR SYSTEM
**Primary Palette:**
- Gold/Amber: `#E9C176` (Primary), `#C8961A` (Dark Accent)
- Navy/Blue: `#0D2035`, `#0A1520`, `#071422` (Dark Mode BG)
- Text: `#EFF8F7` (Light), `rgba(239,248,247,0.78)` (Muted)
- Surface: `rgba(255,255,255,0.055)` (Glassmorphism)

**Light Mode:**
- Background: `#D5E8E6`, `#C0D6D4`
- Text: `#071422`

---

## 🏠 HERO SECTION — Uptown Cairo Premium
**Layout:** Full-width, cinematic, left-aligned content

### Background
- Premium golf course imagery
- 2 gradient overlays for depth
- Subtle-zoom animation (20s infinite loop)
- Opacity: 60% (dark) / 20% (light)

### Content Left Side
```
[Emaar • Uptown Cairo] Badge
    ↓
h1: "Wake up to the Signature Golf Views"
    (gradient text on key words)
    ↓
p: "Elevated luxury living 200m above sea level..."
    ↓
[Find with AI ✨] Button (Gold gradient)
```

### AI Smart Filter Right Side (Desktop Only)
```
┌─────────────────────────────────┐
│ Property Type        [Villa ▼]   │
│ Desired View    [Golf Course ▼] │
│ Price Range     [Premium Tier ▼]│
│ [Find with AI ✨ →]             │
└─────────────────────────────────┘
Glassmorphic: backdrop-filter blur(16px)
Border: 1px solid rgba(233,193,118,0.18)
```

### Typography
- H1: Cormorant Garamond, 42px–84px (clamp), weight 300, line-height 1.08
- P: Jost (EN) / Cairo (AR), 16px, weight 300, line-height 1.7
- Labels: Jost, 9px, weight 600, uppercase, tracking 0.1em

### Animations
- fadeUp: 0.7–0.9s staggered (100ms–350ms delays)
- Button hover: translateY(-2px) + shadow expand
- Icon hover: translateX(4px)
- Background: subtle-zoom 20s ease-in-out infinite
- Scroll indicator: shimmer 2s infinite

---

## 📋 SECONDARY PAGES
All pages follow identical design system:

### /about
- Hero section (same style)
- 3 value cards (Precision, Integrity, Excellence)
- Mission/Vision statement
- Dark/light mode toggle
- Full RTL Arabic support

### /contact
- Contact form (name, email, phone, message)
- Contact info block
- Success state after submission
- Consistent footer

### /services
- Hero with 6 service cards
- Grid layout (2 cols tablet, 3 cols desktop)
- Icon + title + divider + description
- Hover lift effect

### /careers
- Open positions (4 jobs)
- Culture benefits section
- Apply buttons → contact form

### /projects
- 4 featured developments
- Cards with image, specs (units/yield)
- Status badges (Selling, Launching, Coming Soon)
- Grid layout (2 cols)

---

## 🗺️ MAP SECTION
**Component:** Leaflet.js interactive map

**Features:**
- 4 zone markers (Fifth Settlement, Madinaty, Mountain View, Mostakbal City)
- Custom gold markers with glow effects
- Hover popups with market stats
- Dark/light basemap (CartoDB)
- Responsive sizing

**Marker Colors:**
- #4ECDC4 (Teal)
- #E9C176 (Gold)
- #7EA8B4 (Blue-gray)
- #C084FC (Purple)

---

## 🌐 NAVIGATION
**Header:**
- Logo + "SIERRA ESTATES REALTY"
- Language toggle (EN/AR)
- Theme toggle (☀/🌙)
- Sticky on scroll
- Backdrop blur effect

**Smart Filter Bar (on scroll):**
- Rooms, Price Range, Location, Furnished filters
- Clear button
- Only visible after scroll

---

## 📱 RESPONSIVE BREAKPOINTS
- Mobile: < 768px (stacked filters, single column cards)
- Tablet: 768px–1024px (2 columns)
- Desktop: > 1024px (full layouts)

---

## ✨ INTERACTIVE EFFECTS
1. **Card Hover:** translateY(-4px) + shadow expansion
2. **Button Hover:** Scale + glow + icon animation
3. **Button Click:** Scale(0.98) for mechanical feedback
4. **Text Focus:** Border + background color shift
5. **Entrance:** FadeUp staggered animations (100–350ms delays)

---

## 🎭 BILINGUAL SUPPORT
- **Arabic:** Cairo font, RTL direction
- **English:** Jost/Inter fonts, LTR direction
- Toggle in navbar
- All content in both languages

---

## 🌓 DARK/LIGHT MODE
- Complete theme support
- Gradient backgrounds adapt
- Text colors invert
- Border opacity adjusts
- Toggle in navbar

---

## 📊 CURRENT BUILD STATUS
✅ Homepage with Uptown Cairo hero
✅ 5 secondary pages (About, Contact, Services, Careers, Projects)
✅ Leaflet map integration
✅ Dark/light modes
✅ Bilingual Arabic/English
✅ Responsive design
✅ All animations implemented
✅ Dev server running

---

**Ready for Designer Refinement:**
Share this spec + screenshots with your designer for any visual tweaks before GitHub push.
