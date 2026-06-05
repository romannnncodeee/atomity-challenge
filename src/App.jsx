
// App.jsx – Root component, injects CSS variables & global styles

import { useEffect } from 'react';
import { CSS_VARIABLES } from './tokens/design-system';
import { FeatureSection } from './components/FeatureSection';

const GLOBAL_STYLES = `
  ${CSS_VARIABLES}

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background: var(--color-bg-primary);
    color: var(--color-text-primary);
    font-family: var(--font-body);
    font-size: var(--text-base);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--color-bg-primary); }
  ::-webkit-scrollbar-thumb { background: rgba(0,255,170,0.15); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(0,255,170,0.3); }

  /* Background grid pattern */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,255,170,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,170,0.025) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
    z-index: 0;
  }

  /* Container Query: metric card layout shift  */
  @container metric-card (max-width: 200px) {
    .metric-card {
      display: flex;
      flex-direction: column;
    }
  }

  @container metric-card (min-width: 240px) {
    .metric-card {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 8px;
    }
  }

  /* Reduced motion overrides */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Selection color  */
  ::selection {
    background: rgba(0,255,170,0.2);
    color: var(--color-text-primary);
  }

  /*Focus outline */
  :focus-visible {
    outline: 2px solid rgba(0,255,170,0.5);
    outline-offset: 2px;
  }
`;

// Inject Google Fonts 
const FONT_LINK = 'https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;600&display=swap';

export default function App() {
  useEffect(() => {
    // Inject styles
    const styleEl = document.createElement('style');
    styleEl.textContent = GLOBAL_STYLES;
    document.head.appendChild(styleEl);

    // Inject fonts
    const linkEl = document.createElement('link');
    linkEl.rel = 'stylesheet';
    linkEl.href = FONT_LINK;
    document.head.appendChild(linkEl);

    return () => {
      document.head.removeChild(styleEl);
      document.head.removeChild(linkEl);
    };
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Hero spacer */}
      <div style={{
        paddingBlock: 'var(--space-xxl)',
        paddingInline: 'clamp(var(--space-md), 4vw, var(--space-xxl))',
        maxWidth: 1200,
        marginInline: 'auto',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'rgba(0,255,170,0.5)',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          marginBlockEnd: 'var(--space-lg)',
        }}>
          <span>◆</span>
          <span>Atomity</span>
          <span>◆</span>
          <span>Frontend Challenge</span>
          <span>◆</span>
          <span>Option A</span>
          <span>◆</span>
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-3xl)',
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
        }}>
          Infrastructure
          <br />
          <span style={{
            background: 'linear-gradient(135deg, var(--color-accent-success) 0%, var(--color-accent-blue) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Observability Platform
          </span>
        </h1>
        <p style={{
          marginBlockStart: 'var(--space-md)',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-base)',
          color: 'var(--color-text-secondary)',
          maxWidth: 480,
          marginInline: 'auto',
        }}>
          Scroll down to explore the interactive cluster drill-down experience.
        </p>

        {/* Scroll arrow */}
        <div style={{ marginBlockStart: 'var(--space-xl)', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            animation: 'bob 2s ease-in-out infinite',
          }}>
            <style>{`@keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }`}</style>
           
           
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <FeatureSection />

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        paddingBlock: 'var(--space-xl)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        color: 'rgba(107,140,125,0.5)',
      }}>
        Atomity Challenge
      </footer>
    </div>
  );
}
