// MetricCard – Adaptive card using @container queries

import { motion } from 'framer-motion';
import { AnimatedCounter } from './AnimatedCounter';
import { fadeSlideUp } from '../utils/motion';

const BAR_COLORS = {
  cpu:    { fill: 'var(--color-accent-blue)',    glow: 'rgba(59,158,255,0.3)' },
  memory: { fill: 'var(--color-accent-success)', glow: 'rgba(0,255,170,0.3)' },
  cost:   { fill: 'var(--color-accent-warn)',    glow: 'rgba(240,192,64,0.3)' },
};

const MiniBar = ({ value, max = 100, type = 'cpu', animated = true }) => {
  const pct = Math.min((value / max) * 100, 100);
  const colors = BAR_COLORS[type] || BAR_COLORS.cpu;

  return (
    <div style={{
      width: '100%',
      height: 4,
      background: 'rgba(255,255,255,0.06)',
      borderRadius: 'var(--radius-full)',
      overflow: 'hidden',
    }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 22, delay: 0.1 }}
        style={{
          height: '100%',
          background: colors.fill,
          borderRadius: 'var(--radius-full)',
          boxShadow: `0 0 8px ${colors.glow}`,
        }}
      />
    </div>
  );
};

export const MetricCard = ({ label, value, unit = '', subValue, subLabel, barValue, barMax, barType, icon, status, statusColor }) => {
  return (
    <motion.div
      variants={fadeSlideUp}
      className="metric-card-container"
      style={{ containerType: 'inline-size', containerName: 'metric-card' }}
    >
      <div className="metric-card" style={{
        background: 'var(--color-surface-card)',
        border: '1px solid var(--color-border-muted)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-md)',
        backdropFilter: 'blur(12px)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}>
        {/* Top glow accent */}
        <div style={{
          position: 'absolute',
          insetBlockStart: 0,
          insetInlineStart: 0,
          insetInlineEnd: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${statusColor || 'var(--color-border-active)'}, transparent)`,
        }} />

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-sm)' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            {label}
          </span>
          {status && (
            <span style={{
              fontSize: 'var(--text-xs)',
              fontFamily: 'var(--font-mono)',
              color: statusColor || 'var(--color-accent-success)',
              background: `${statusColor || 'var(--color-accent-success)'}18`,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              border: `1px solid ${statusColor || 'var(--color-accent-success)'}33`,
            }}>
              {status}
            </span>
          )}
          {icon && !status && (
            <span style={{ fontSize: '1rem', opacity: 0.6 }}>{icon}</span>
          )}
        </div>

        {/* Value */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-xl)',
          color: 'var(--color-text-primary)',
          lineHeight: 1.1,
          marginBlockEnd: 'var(--space-xs)',
        }}>
          <AnimatedCounter value={typeof value === 'number' ? value : parseFloat(value) || 0} decimals={typeof value === 'number' && value % 1 !== 0 ? 2 : 0} />
          {unit && (
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginInlineStart: 4 }}>
              {unit}
            </span>
          )}
        </div>

        {/* Sub value */}
        {subValue !== undefined && (
          <div style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-mono)',
            marginBlockEnd: barValue !== undefined ? 'var(--space-sm)' : 0,
          }}>
            {subLabel && <span style={{ marginInlineEnd: 4 }}>{subLabel}</span>}
            <AnimatedCounter value={typeof subValue === 'number' ? subValue : parseFloat(subValue) || 0} />
          </div>
        )}

        {/* Mini bar */}
        {barValue !== undefined && (
          <MiniBar value={barValue} max={barMax} type={barType} />
        )}
      </div>
    </motion.div>
  );
};
