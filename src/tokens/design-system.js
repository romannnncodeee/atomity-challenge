
// Atomity Design System – Centralized Token Map
// All values mirror :root CSS variables


export const tokens = {
  colors: {
    bgPrimary:       'var(--color-bg-primary)',
    bgSecondary:     'var(--color-bg-secondary)',
    textPrimary:     'var(--color-text-primary)',
    textSecondary:   'var(--color-text-secondary)',
    accentSuccess:   'var(--color-accent-success)',
    accentWarn:      'var(--color-accent-warn)',
    accentDanger:    'var(--color-accent-danger)',
    accentBlue:      'var(--color-accent-blue)',
    surfaceCard:     'var(--color-surface-card)',
    surfaceElevated: 'var(--color-surface-elevated)',
    borderMuted:     'var(--color-border-muted)',
    borderActive:    'var(--color-border-active)',
    glowSuccess:     'var(--color-glow-success)',
  },
  transitions: {
    springStiff: { type: 'spring', stiffness: 600, damping: 30 },
    springDamp:  { type: 'spring', stiffness: 180, damping: 24 },
    springLazy:  { type: 'spring', stiffness: 80,  damping: 18 },
    easeOut:     { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
    easeIn:      { duration: 0.25, ease: [0.55, 0, 1, 0.45] },
  },
  radii: {
    sm:  'var(--radius-sm)',
    md:  'var(--radius-md)',
    lg:  'var(--radius-lg)',
    xl:  'var(--radius-xl)',
    full:'var(--radius-full)',
  },
  spacing: {
    xs:  'var(--space-xs)',
    sm:  'var(--space-sm)',
    md:  'var(--space-md)',
    lg:  'var(--space-lg)',
    xl:  'var(--space-xl)',
    xxl: 'var(--space-xxl)',
  },
  font: {
    display: 'var(--font-display)',
    mono:    'var(--font-mono)',
    body:    'var(--font-body)',
  },
};

export const CSS_VARIABLES = `
  :root {
    /* Colors */
    --color-bg-primary:       #070707;
    --color-bg-secondary:     #ffffff;
    --color-text-primary:     #dee9de;
    --color-text-secondary:   #6b8c7d;
    --color-accent-success:   #00ffaa;
    --color-accent-warn:      #f0c040;
    --color-accent-danger:    #ff4e6a;
    --color-accent-blue:      #3b9eff;
    --color-surface-card:     rgba(10, 20, 30, 0.85);
    --color-surface-elevated: rgba(14, 28, 42, 0.95);
    --color-border-muted:     rgba(0, 255, 170, 0.08);
    --color-border-active:    rgba(0, 255, 170, 0.45);
    --color-glow-success:     rgba(0, 255, 170, 0.18);

    /*Radii*/
    --radius-sm:   4px;
    --radius-md:   8px;
    --radius-lg:   14px;
    --radius-xl:   22px;
    --radius-full: 9999px;

    /*Spacing */
    --space-xs:  4px;
    --space-sm:  8px;
    --space-md:  16px;
    --space-lg:  24px;
    --space-xl:  40px;
    --space-xxl: 64px;

    /*Typography  */
    --font-display: 'DM Mono', 'Fira Code', monospace;
    --font-mono:    'DM Mono', 'Courier New', monospace;
    --font-body:    'DM Sans', 'Segoe UI', sans-serif;

    /* Fluid Type */
    --text-xs:  clamp(0.65rem, 0.6rem + 0.25vw, 0.75rem);
    --text-sm:  clamp(0.78rem, 0.72rem + 0.3vw,  0.875rem);
    --text-base:clamp(0.9rem,  0.85rem + 0.35vw, 1rem);
    --text-lg:  clamp(1rem,    0.95rem + 0.5vw,  1.25rem);
    --text-xl:  clamp(1.2rem,  1.1rem  + 0.8vw,  1.75rem);
    --text-2xl: clamp(1.5rem,  1.3rem  + 1.2vw,  2.5rem);
    --text-3xl: clamp(2rem,    1.6rem  + 2vw,    3.5rem);
  }
`;
