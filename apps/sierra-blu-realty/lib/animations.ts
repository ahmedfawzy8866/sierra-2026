import { Variants } from "framer-motion";

/**
 * Cinematic Luxury Animation Library (Sierra Blu Intel)
 * Derived from 'magic-animator' and 'luxury-ui' skill signatures.
 */

// 1. Staggered Entrance (High-end reveal)
export const cinematicEntrance: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 100
    }
  }
};

// 2. Gold Glow Pulse (Strategic Intensity Indicator)
export const strategicPulse: Variants = {
  idle: { scale: 1, boxShadow: "0 0 0px rgba(201, 162, 74, 0)" },
  pulsing: {
    scale: [1, 1.02, 1],
    boxShadow: [
      "0 0 0px rgba(201, 162, 74, 0)",
      "0 0 20px rgba(201, 162, 74, 0.4)",
      "0 0 0px rgba(201, 162, 74, 0)"
    ],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// 3. Card Hover (Cinematic Surface)
export const cinematicHover: Variants = {
  initial: { scale: 1, zIndex: 1 },
  hover: { 
    scale: 1.02, 
    zIndex: 10,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 200
    }
  }
};

// 4. Modal Overlays (Slow-burn luxury)
export const slowReveal: Variants = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: { 
    opacity: 1, 
    backdropFilter: "blur(12px)",
    transition: { duration: 0.8, ease: "circOut" }
  }
};
