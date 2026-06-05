

// Loading & Error State Components

import { motion } from 'framer-motion';

export const LoadingState = ({ message = 'Fetching cluster data…' }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-xxl)',
      gap: 'var(--space-md)',
    }}
  >
    {/* Pulsing grid of dots */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, width: 48 }}>
      {[...Array(9)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.15, 1, 0.15], scale: [0.8, 1.1, 0.8] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: (i % 3) * 0.12 + Math.floor(i / 3) * 0.12,
            ease: 'easeInOut',
          }}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--color-accent-success)',
          }}
        />
      ))}
    </div>
    <p style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text-secondary)',
      margin: 0,
    }}>
      {message}
    </p>
  </motion.div>
);

export const ErrorState = ({ message = 'Failed to load cluster data.', onRetry }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-md)',
      padding: 'var(--space-xl)',
      textAlign: 'center',
    }}
  >
    <div style={{
      width: 48,
      height: 48,
      borderRadius: '50%',
      background: 'rgba(255,78,106,0.1)',
      border: '1px solid rgba(255,78,106,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.4rem',
    }}>
      ⚠
    </div>
    <p style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      color: 'var(--color-accent-danger)',
      margin: 0,
    }}>
      {message}
    </p>
    {onRetry && (
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={onRetry}
        style={{
          background: 'rgba(255,78,106,0.1)',
          border: '1px solid rgba(255,78,106,0.3)',
          color: 'var(--color-accent-danger)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-sm)',
          padding: '6px 18px',
          borderRadius: 'var(--radius-full)',
          cursor: 'pointer',
        }}
      >
        Retry
      </motion.button>
    )}
  </motion.div>
);

export const SkeletonCard = () => (
  <div style={{
    background: 'var(--color-surface-card)',
    border: '1px solid var(--color-border-muted)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-md)',
    overflow: 'hidden',
    position: 'relative',
  }}>
    {[70, 40, 90, 55].map((w, i) => (
      <motion.div
        key={i}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.1 }}
        style={{
          width: `${w}%`,
          height: i === 0 ? 14 : 8,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 'var(--radius-sm)',
          marginBlockEnd: i < 3 ? 10 : 0,
        }}
      />
    ))}
  </div>
);
