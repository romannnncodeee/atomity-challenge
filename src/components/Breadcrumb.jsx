// Breadcrumb – Animated navigation tracker
import { motion, AnimatePresence } from 'framer-motion';
import { tokens } from '../tokens/design-system';

const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
    <path d="M4 2.5L7.5 6L4 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HomeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M1.5 5.5L6.5 1.5L11.5 5.5V11.5H8.5V8H4.5V11.5H1.5V5.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

export const Breadcrumb = ({ crumbs, onNavigate }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-xs)',
      flexWrap: 'wrap',
      paddingBlock: 'var(--space-sm)',
    }}>
      <AnimatePresence mode="popLayout">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          const isFirst = i === 0;

          return (
            <motion.div
              key={crumb.id}
              initial={{ opacity: 0, x: -10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -8, scale: 0.88 }}
              transition={tokens.transitions.springStiff}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}
            >
              {/* Separator */}
              {!isFirst && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ color: 'var(--color-text-secondary)', opacity: 0.4 }}
                >
                  <ChevronIcon />
                </motion.span>
              )}

              {/* Crumb button */}
              <motion.button
                onClick={() => !isLast && onNavigate(i)}
                whileHover={!isLast ? { scale: 1.04 } : {}}
                whileTap={!isLast ? { scale: 0.97 } : {}}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  background: isLast
                    ? 'rgba(0,255,170,0.08)'
                    : 'transparent',
                  border: isLast
                    ? '1px solid rgba(0,255,170,0.2)'
                    : '1px solid transparent',
                  borderRadius: 'var(--radius-full)',
                  padding: '3px 10px 3px 8px',
                  cursor: isLast ? 'default' : 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: isLast
                    ? 'var(--color-accent-success)'
                    : 'var(--color-text-secondary)',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}
              >
                {isFirst && (
                  <span style={{ opacity: 0.7 }}>
                    <HomeIcon />
                  </span>
                )}
                {crumb.label}
              </motion.button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
