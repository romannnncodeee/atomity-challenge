// ─────────────────────────────────────────────────────────────
// Motion Utilities
// Gracefully degrades animations if prefers-reduced-motion is set
// ─────────────────────────────────────────────────────────────
import { tokens } from '../tokens/design-system';

// ── Check reduced motion preference ────────────────────────────
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Safe transition helper ──────────────────────────────────────
// Returns instant transition if reduced motion is preferred
export const safeTransition = (transition) =>
  prefersReducedMotion() ? { duration: 0 } : transition;

// ── Safe animation variants factory ────────────────────────────
export const safeVariants = (normalVariants) => {
  if (prefersReducedMotion()) {
    // Flatten all variants to have no visible animation
    const reduced = {};
    for (const key of Object.keys(normalVariants)) {
      const v = normalVariants[key];
      reduced[key] = {
        ...v,
        transition: { duration: 0 },
        // Remove any transform/opacity animations that could be jarring
      };
    }
    return reduced;
  }
  return normalVariants;
};

// ── Stagger children utility ────────────────────────────────────
export const staggerChildren = (staggerSecs = 0.06) =>
  prefersReducedMotion()
    ? {}
    : { staggerChildren: staggerSecs, delayChildren: 0.1 };

// ── Common animation presets ────────────────────────────────────
export const fadeSlideUp = safeVariants({
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: tokens.transitions.springDamp },
  exit:    { opacity: 0, y: -16, transition: tokens.transitions.easeIn },
});

export const fadeIn = safeVariants({
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
});

export const scaleIn = safeVariants({
  hidden:  { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: tokens.transitions.springStiff },
  exit:    { opacity: 0, scale: 0.92, transition: tokens.transitions.easeIn },
});

export const containerVariants = (stagger = 0.06) =>
  safeVariants({
    hidden:  { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: 0.05 },
    },
    exit: { opacity: 0, transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  });
