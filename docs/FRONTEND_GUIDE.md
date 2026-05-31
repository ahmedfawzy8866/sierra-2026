# 🎨 SIERRA BLU FRONTEND — INTEGRATION GUIDE V12.0

> **Status**: Production-Ready | **Last Updated**: April 28, 2026
> **Aesthetic**: Quiet Luxury (Navy #0A1628, Gold #C9A84C, Ivory #F4F0E8)

---

## 📋 Overview

The Sierra Blu frontend is a **Next.js 16 + React 19** application with **Framer Motion** animations and **Tailwind CSS** styling. It follows the "Quiet Luxury" design philosophy: minimal, elegant, high-fidelity.

### Key Principles
- **Cinematic**: Smooth parallax, buttery animations
- **Editorial**: Playfair Display for headlines, Inter for body
- **Data-Driven**: All UI components pull from `useSierraBlu()` hook
- **Mobile-First**: Responsive across all devices
- **Accessible**: ARIA labels, semantic HTML, keyboard navigation

---

## 🏗️ Architecture

```
app/
├── landing/                 # Landing page (hero + showcase)
├── concierge/[leadId]/     # VIP portfolio viewer
├── api/
│   ├── concierge/          # Portfolio retrieval
│   ├── leads/              # Lead operations
│   └── matching/           # AI matching orchestration
components/
├── UI/
│   ├── LuxurySkeleton.tsx  # ⭐ UI Kit (6 components)
│   ├── PremiumHero.tsx     # Parallax hero section
│   └── ...
├── Proposals/
│   └── ConciergeGallery.tsx # S8 portfolio display
├── Listings/
│   └── InventoryShowcase.tsx # Demo of useSierraBlu hook
hooks/
└── useSierraBlu.ts         # 🌉 Master data hook
lib/
├── firebase/               # Firebase SDK config
├── services/
│   ├── portfolio-engine.ts # S8 curation logic
│   └── ...
└── models/
    └── schema.ts           # TypeScript interfaces
```

---

## 🔌 The Master Hook: `useSierraBlu()`

**Location**: [hooks/useSierraBlu.ts](hooks/useSierraBlu.ts)

This is the **single source of truth** for data. All components use this hook instead of direct Firebase calls.

### API

```typescript
const { 
  units,              // Array<Unit> — Live inventory
  loading,            // boolean
  error,              // string | null
  getLeadData,        // (leadId: string) => Promise<Lead>
  triggerAgent        // (agent, action, payload) => Promise<any>
} = useSierraBlu();
```

### Usage Example

```typescript
'use client';
import { useSierraBlu } from '@/hooks/useSierraBlu';

export default function MyComponent() {
  const { units, loading } = useSierraBlu();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {units.map(unit => (
        <div key={unit.id}>{unit.title}</div>
      ))}
    </div>
  );
}
```

---

## 🎨 UI Kit Components

**Location**: [components/UI/LuxurySkeleton.tsx](components/UI/LuxurySkeleton.tsx)

Pre-built, battle-tested components ready to use:

### 1. **LuxuryCard**
Borderless card with glassmorphism effect
```typescript
<LuxuryCard className="p-8">
  <p>Premium content here</p>
</LuxuryCard>
```

### 2. **PremiumCard**
Enhanced glass effect with hover animations
```typescript
<PremiumCard onClick={() => alert('Clicked')}>
  Content
</PremiumCard>
```

### 3. **GoldButton**
Primary CTA button with gold gradient
```typescript
<GoldButton 
  label="Request Viewing" 
  onClick={handleClick}
/>
```

### 4. **SecondaryButton**
Outlined button for secondary actions
```typescript
<SecondaryButton label="Learn More" />
```

### 5. **EditorialHeading**
Playfair Display headlines with Italian elegance
```typescript
<EditorialHeading level={1}>
  Smarter Decisions
</EditorialHeading>
```

### 6. **StatBox**
KPI display with glassmorphism
```typescript
<StatBox value="1,200+" label="Properties" />
```

### 7. **SectionBadge**
Luxury section identifier
```typescript
<SectionBadge text="Curated Portfolio" />
```

---

## 🎬 Key Pages

### Landing Page (`app/page.tsx`)

**Sections**:
1. Hero with parallax (Premium luxury vibes)
2. Featured listings showcase (3-card grid)
3. Intelligence Map (Live data visualization)
4. Insights section (Blog-style articles)
5. Testimonials carousel

**Features**:
- Bilingual (Arabic/English)
- Smooth scroll animations
- Real-time data sync from Firestore
- Responsive hero image with parallax
- `/landing` reuses this same canonical page for the public marketing route

---

### Concierge Gallery (`app/concierge/[leadId]/page.tsx`)

**Purpose**: Display curated 3-5 property portfolio for a specific lead (VIP experience)

**Features**:
- ✨ Leila's personalized note at top
- 🖼️ Large hero image with match score overlay
- 📊 Financial metrics (ROI, yield)
- 📍 Property description + reasoning
- 🎯 "Request Viewing" button
- 📱 Mobile-optimized swipe navigation

**Data Flow**:
```
GET /api/concierge/[leadId]
  ↓
Firestore: concierge_selections/{portfolioId}
  ↓
ConciergeGallery component renders
```

---

## 🚀 Claude Code Todo List

### Immediate (Next Session)
- [ ] **Test landing page on mobile** — Ensure parallax works smoothly
- [ ] **Create testimonials carousel** — Add swipe gestures with react-use-gesture
- [ ] **Build property detail modal** — Click card → show full details
- [ ] **Implement Arabic text optimization** — Font loading, RTL fixes

### High Priority
- [ ] **Add form validation to lead capture** — Email regex, phone formatting
- [ ] **Create admin dashboard KPI cards** — Real-time stats from Firestore
- [ ] **Build email templates** — Viewing request confirmation
- [ ] **Optimize images** — Use Next.js Image component for all pictures

### Medium Priority
- [ ] **Add search/filter to inventory** — Budget, location, ROI range
- [ ] **Create "Match Score" explanation modal** — How AI matching works
- [ ] **Build live chat widget** — WhatsApp integration
- [ ] **Add analytics tracking** — Mixpanel/Segment events

---

## 🎯 Quick Start for Claude Code

### 1. Create a New Component Using UI Kit

```typescript
'use client';
import { LuxuryCard, EditorialHeading, GoldButton } from '@/components/UI/LuxurySkeleton';

export default function MyFeature() {
  return (
    <LuxuryCard>
      <EditorialHeading level={2}>My Feature</EditorialHeading>
      <p>Content here</p>
      <GoldButton label="Action" />
    </LuxuryCard>
  );
}
```

### 2. Fetch Real Data from Firestore

```typescript
'use client';
import { useSierraBlu } from '@/hooks/useSierraBlu';

export default function PropertyList() {
  const { units, loading } = useSierraBlu();

  return (
    <div>
      {units.map(unit => (
        <div key={unit.id}>{unit.title}</div>
      ))}
    </div>
  );
}
```

### 3. Add Smooth Animation

```typescript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  Content animates in on scroll
</motion.div>
```

---

## 🎨 Design Tokens

```typescript
// Colors (Quiet Luxury Palette)
--navy: #0A1628
--gold: #C9A84C
--ivory: #F4F0E8
--white: #FFFFFF
--dark-text: #0A1628
--light-text: rgba(10, 22, 40, 0.7)

// Typography
--font-serif: 'Playfair Display' (headers)
--font-sans: 'Inter' (body)
--font-arabic: 'Cairo' (Arabic text)

// Spacing (8px base)
--gap: 8px
--p: 8px, 16px, 24px, 32px, 40px

// Shadows (Luxury minimal)
--shadow-sm: 0 2px 8px rgba(0,0,0,0.08)
--shadow-md: 0 4px 16px rgba(0,0,0,0.12)
--shadow-lg: 0 8px 32px rgba(0,0,0,0.16)
--shadow-xl: 0 16px 48px rgba(0,0,0,0.2)
```

---

## ✅ Quality Checklist

Before shipping a component:

- [ ] **Responsive**: Works on mobile, tablet, desktop
- [ ] **Accessible**: ARIA labels, semantic HTML, keyboard nav
- [ ] **Performant**: Lazy loading, image optimization, code splitting
- [ ] **Data-Ready**: Uses `useSierraBlu()` for real data
- [ ] **Animated**: Framer Motion transitions (not jarring)
- [ ] **Consistent**: Follows Quiet Luxury palette & typography
- [ ] **Tested**: Works in Chrome, Safari, Firefox

---

## 🔗 File References

| File | Purpose |
|------|---------|
| [hooks/useSierraBlu.ts](hooks/useSierraBlu.ts) | Master data hook |
| [components/UI/LuxurySkeleton.tsx](components/UI/LuxurySkeleton.tsx) | UI components |
| [components/UI/PremiumHero.tsx](components/UI/PremiumHero.tsx) | Parallax hero |
| [app/landing/page.tsx](app/landing/page.tsx) | Landing page |
| [app/concierge/[leadId]/page.tsx](app/concierge/[leadId]/page.tsx) | Portfolio viewer |
| [components/Proposals/ConciergeGallery.tsx](components/Proposals/ConciergeGallery.tsx) | Gallery component |
| [components/Listings/InventoryShowcase.tsx](components/Listings/InventoryShowcase.tsx) | Inventory grid |

---

## 📞 Troubleshooting

**Issue**: Component not rendering
- Check `use client` at top
- Verify imports are correct
- Check console for TypeScript errors

**Issue**: Data not loading
- Verify Firebase config in [lib/firebase/config.ts](lib/firebase/config.ts)
- Check Firestore collection names match
- Confirm Firestore rules allow reads

**Issue**: Animations not smooth
- Ensure `transition` prop is set on motion divs
- Check `useScroll()` is not causing layout thrashing
- Use `viewport={{ once: true }}` for entrance animations

---

**Last Updated**: April 28, 2026 | **Version**: 12.0 | **Status**: 🟢 Production
