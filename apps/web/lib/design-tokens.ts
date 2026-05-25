/**
 * SIERRA BLU — DESIGN TOKENS V2.0
 * "Gold & Diamond" — خليها زي الذهب والماس
 * ─────────────────────────────────────────────────────────────
 * Light = Ivory/Tiffany · Dark = Midnight Navy · Accent = Real Gold
 */

export const TOKENS = {

  // ── GOLD (الذهب الحقيقي) ─────────────────────────────────────
  // من DESIGN.md — #e9c176 ده أقرب لذهب حقيقي، مش ذهب مطفي
  gold:        "#E9C176",   // Primary gold — warm, rich, polished
  goldDeep:    "#C8961A",   // Deep gold — engravings, details
  goldShimmer: "#F5D78E",   // Shimmer highlight — diamond flash
  goldDark:    "#987734",   // Dark gold — shadows on gold surfaces
  goldGrad:    "linear-gradient(135deg, #E9C176 0%, #C8961A 50%, #F5D78E 75%, #987734 100%)",

  // ── NAVY (الأزرق الملكي) ─────────────────────────────────────
  // Light mode → Sierra blue (فاتح ومشرق)
  // Dark mode  → Royal/Pepsi blue (ملكي غامق)
  sierraBlue:  "#1B6CA8",   // Medium bright — light mode primary
  royalBlue:   "#003087",   // Pepsi/Royal — dark mode primary
  midNavy:     "#0D2D6B",   // Mid — transitions
  deepNavy:    "#071422",   // Darkest — DESIGN.md base
  nightNavy:   "#050B14",   // Midnight hero backgrounds

  // ── TIFFANY / ICY CREAM (تلجي) ────────────────────────────────
  tiffanyPale: "#EFF8F7",   // Light bg — barely-there icy hint
  tiffanyFrost:"#DFF1EE",   // Light surface — frost glass
  tiffanyMid:  "#B8DED9",   // Borders in light mode
  iceWhite:    "#F8FDFC",   // Purest white with cold tint

  // ── LIGHT MODE SYSTEM ─────────────────────────────────────────
  light: {
    bg:         "#EFF8F7",  // Tiffany pale base
    bgCard:     "#FFFFFF",  // Pure white cards
    bgSurface:  "#DFF1EE",  // Frost surfaces
    text:       "#071422",  // Deep navy text
    textMuted:  "#3A5570",  // Mid blue-gray
    textDim:    "#6B8299",  // Dimmed metadata
    border:     "rgba(27,108,168,0.12)",
    borderGold: "rgba(200,150,26,0.25)",
    shadow:     "0 8px 40px rgba(7,20,34,0.08)",
    shadowGold: "0 0 30px rgba(233,193,118,0.2)",
  },

  // ── DARK MODE SYSTEM ──────────────────────────────────────────
  dark: {
    bg:         "#071422",  // DESIGN.md base
    bgCard:     "#0A1E35",  // Slightly lighter — card lift
    bgSurface:  "#0D2444",  // Surface container
    bgGlass:    "rgba(10,30,53,0.6)",
    text:       "#EFF8F7",  // Tiffany white text
    textMuted:  "rgba(239,248,247,0.6)",
    textDim:    "rgba(239,248,247,0.35)",
    border:     "rgba(233,193,118,0.15)",  // Gold-tinted borders
    borderGlass:"rgba(239,248,247,0.08)",
    shadow:     "0 8px 40px rgba(4,16,30,0.5)",
    shadowGold: "0 0 40px rgba(233,193,118,0.15)",
  },

  // ── TYPOGRAPHY ───────────────────────────────────────────────
  fonts: {
    serif:    "'Cormorant Garamond', 'Playfair Display', serif", // Ultra-luxury
    display:  "'Playfair Display', serif",
    body:     "'Inter', sans-serif",
    arabic:   "'Cairo', sans-serif",
    mono:     "'JetBrains Mono', 'Courier New', monospace",
  },

  // ── MOTION ───────────────────────────────────────────────────
  ease: {
    silk:   "cubic-bezier(0.16, 1, 0.3, 1)",   // Buttery smooth
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)", // Subtle spring
    sharp:  "cubic-bezier(0.4, 0, 0.2, 1)",      // Material-like
  },

  // ── GLASS ─────────────────────────────────────────────────────
  glass: {
    light: "rgba(255,255,255,0.7)",
    dark:  "rgba(10,30,53,0.6)",
    blur:  "blur(20px)",
    blurHeavy: "blur(40px)",
  },
};

// Google Fonts import string
export const GOOGLE_FONTS =
  "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&family=Cairo:wght@300;400;600&display=swap');";
