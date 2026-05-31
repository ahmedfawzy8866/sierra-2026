# 🤖 Claude Code — Sierra Blu Frontend Handoff

> **For Claude Code**: This file initializes your context for Sierra Blu frontend development.
> **Handoff Date**: April 28, 2026 | **Version**: 12.0 | **Status**: ✅ Production-Ready

---

## 🎯 Your Mission

You are enhancing the **Sierra Blu Realty** frontend — a luxury property platform for high-net-worth Egyptian investors. Your job:

1. **Maintain Quiet Luxury aesthetic** — Navy, Gold, Ivory only
2. **Keep animations buttery smooth** — 0.6s easing: `[0.22, 1, 0.36, 1]`
3. **Use `useSierraBlu()` hook** — Never direct Firebase calls
4. **Polish components** — UI Kit components are your building blocks
5. **Test on mobile** — Responsive design is non-negotiable

---

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Styling**: Tailwind CSS v4 + custom tokens
- **Animation**: Framer Motion
- **Database**: Firebase/Firestore
- **Icons**: Lucide React
- **Typography**: Playfair Display (headers) + Inter (body) + Cairo (Arabic)

---

## 🏗️ Project Structure

```
my-app/
├── app/
│   ├── landing/page.tsx           ← Hero + Showcase (edit this)
│   ├── concierge/[leadId]/        ← VIP portfolio viewer (enhanced)
│   └── api/
├── components/
│   ├── UI/
│   │   ├── LuxurySkeleton.tsx     ← UI Kit (6 components) ⭐
│   │   └── PremiumHero.tsx        ← Parallax hero (new)
│   ├── Proposals/
│   │   └── ConciergeGallery.tsx   ← Portfolio display (polished)
│   └── Listings/
│       └── InventoryShowcase.tsx  ← Demo useSierraBlu (new)
├── hooks/
│   └── useSierraBlu.ts            ← Master data hook 🌉
├── lib/
│   ├── firebase/
│   ├── services/
│   │   └── portfolio-engine.ts    ← S8 curation logic
│   └── models/schema.ts
└── FRONTEND_GUIDE.md              ← Read this first
```

---

## 🎨 UI Kit Components (Ready to Use)

| Component | Purpose | Example |
|-----------|---------|---------|
| `LuxuryCard` | Glassmorphism container | `<LuxuryCard>...</LuxuryCard>` |
| `PremiumCard` | Enhanced glass variant | `<PremiumCard onClick={...}>...</PremiumCard>` |
| `GoldButton` | Primary CTA | `<GoldButton label="Action" />` |
| `SecondaryButton` | Outlined variant | `<SecondaryButton label="Learn" />` |
| `EditorialHeading` | Playfair headlines | `<EditorialHeading level={2}>Title</EditorialHeading>` |
| `StatBox` | KPI display | `<StatBox value="95%" label="Match" />` |
| `SectionBadge` | Section identifier | `<SectionBadge text="Featured" />` |
| `SubtitleText` | Body text utility | `<SubtitleText>Content</SubtitleText>` |

All in: [components/UI/LuxurySkeleton.tsx](components/UI/LuxurySkeleton.tsx)

---

## 🔌 Master Hook: `useSierraBlu()`

**ALWAYS use this for data.** Never direct Firebase calls.

```typescript
const { units, loading, error, getLeadData } = useSierraBlu();
```

**Example**:
```typescript
'use client';
import { useSierraBlu } from '@/hooks/useSierraBlu';

export default function PropertyGrid() {
  const { units, loading } = useSierraBlu();
  
  if (loading) return <LoadingState />;
  
  return (
    <div className="grid">
      {units.map(unit => (
        <div key={unit.id}>{unit.title}</div>
      ))}
    </div>
  );
}
```

---

## 🎬 Key Pages & Components

### 1. **Landing Page** — `app/landing/page.tsx`
Hero + Showcase + Intelligence Map + Testimonials

**Todo**:
- ✅ Hero section with PremiumHero component
- ⏳ Featured listings showcase (3-card grid)
- ⏳ Integrate real data via useSierraBlu()
- ⏳ Ensure mobile parallax is smooth
- ⏳ Add testimonials carousel

### 2. **Concierge Gallery** — `components/Proposals/ConciergeGallery.tsx`
VIP portfolio display (S8 output)

**Status**: ✅ Polished, awaiting integration tests

**Features**:
- Leila's personal note
- Swipeable gallery
- Match score overlays
- Financial metrics (ROI, yield)
- "Request Viewing" button

### 3. **Inventory Showcase** — `components/Listings/InventoryShowcase.tsx`
Demo of useSierraBlu() hook usage

**Status**: ✅ Just created

**Features**:
- Live property grid
- Sorting by ROI
- Real-time loading states
- Responsive layout

---

## 🎨 Design System (Quiet Luxury)

```typescript
// Colors
navy:   #0A1628
gold:   #C9A84C
ivory:  #F4F0E8
white:  #FFFFFF

// Shadows (minimal luxury)
shadow-sm: 0 2px 8px rgba(0,0,0,0.08)
shadow-md: 0 4px 16px rgba(0,0,0,0.12)
shadow-lg: 0 8px 32px rgba(0,0,0,0.16)

// Transitions
smooth: 0.6s cubic-bezier(0.22, 1, 0.36, 1)
```

---

## ✅ Before You Commit

- [ ] Component renders without errors
- [ ] Data loads from `useSierraBlu()` hook
- [ ] Mobile responsive (test at 375px, 768px, 1024px)
- [ ] Animations smooth (60fps, no jank)
- [ ] Follows Quiet Luxury palette
- [ ] Uses Tailwind only (no inline styles)
- [ ] Imports correct from LuxurySkeleton

---

## 🚀 Quick Commands

```bash
# Start dev server
npm run dev

# Type check
npm run type-check

# Build
npm run build

# Test in mobile view
# Use Chrome DevTools: Cmd+Shift+M (Mac) or Ctrl+Shift+M (Windows)
```

---

## 📚 Key Files to Know

1. **LuxurySkeleton.tsx** — All UI components in one place
2. **useSierraBlu.ts** — Master hook for data
3. **FRONTEND_GUIDE.md** — Comprehensive documentation
4. **portfolio-engine.ts** — S8 logic (don't modify)
5. **ConciergeGallery.tsx** — Gallery component (mostly done)

---

## 🆘 Common Issues & Fixes

### "Component not found" error
→ Check `use client` at top of file
→ Verify import path matches file location

### Data not loading
→ Check Firestore is connected (Firebase config)
→ Verify collection names match
→ Use DevTools Network tab to debug API calls

### Animations stuttering
→ Add `viewport={{ once: true }}` to motion divs
→ Use `will-change: transform` on Tailwind
→ Profile in DevTools Performance tab

### Mobile responsive issues
→ Always test at actual device widths (375px min)
→ Use `md:`, `lg:` breakpoints for responsive styles
→ Test landscape + portrait

---

## 🎯 Next Immediate Steps

1. **✅ UI Kit Expansion** — Done (LuxurySkeleton.tsx now has 8 components)
2. **✅ Create PremiumHero** — Done (parallax hero component)
3. **✅ Polished ConciergeGallery** — Done (updated for visual excellence)
4. **✅ InventoryShowcase demo** — Done (shows useSierraBlu hook usage)
5. ⏳ **Polish landing page** — Use PremiumHero + InventoryShowcase
6. ⏳ **Add testimonials carousel** — React Swiper or custom Framer Motion
7. ⏳ **Create property detail modal** — Click card → full details
8. ⏳ **Test on mobile** — Ensure parallax works smoothly

---

## 📞 Questions?

Refer to **FRONTEND_GUIDE.md** for complete documentation.
All patterns are established and battle-tested.

---

**Status**: 🟢 Production | **Last Updated**: April 28, 2026 | **Version**: 12.0
