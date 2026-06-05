
// FeatureSection – Scroll-managed container with elevation reveal


import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { tokens } from '../tokens/design-system';
import { DrillDownDashboard } from './DrillDownDashboard';
import { prefersReducedMotion } from '../utils/motion';

//  Section header
const SectionHeader = ({ isInView }) => {
  const reduced = prefersReducedMotion();

  const line1Variants = {
    hidden:  { opacity: 0, y: reduced ? 0 : 32 },
    visible: { opacity: 1, y: 0, transition: { ...tokens.transitions.springDamp, delay: 0.05 } },
  };
  const line2Variants = {
    hidden:  { opacity: 0, y: reduced ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { ...tokens.transitions.springDamp, delay: 0.18 } },
  };
  const badgeVariants = {
    hidden:  { opacity: 0, scale: reduced ? 1 : 0.8 },
    visible: { opacity: 1, scale: 1, transition: { ...tokens.transitions.springStiff, delay: 0 } },
  };

  return (
    <div style={{ marginBlockEnd: 'var(--space-xl)', paddingInline: 'var(--space-md)' }}>
      {/* Badge */}
      <motion.div
        variants={badgeVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(0,255,170,0.06)',
          border: '1px solid rgba(0,255,170,0.2)',
          borderRadius: 'var(--radius-full)',
          padding: '4px 14px 4px 10px',
          marginBlockEnd: 'var(--space-md)',
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent-success)', display: 'inline-block', boxShadow: '0 0 8px var(--color-glow-success)' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent-success)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          
        </span>
      </motion.div>

      <motion.h2
        variants={line1Variants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-3xl)',
          color: 'var(--color-text-primary)',
          lineHeight: 1.1,
          margin: '0 0 var(--space-sm)',
          letterSpacing: '-0.02em',
        }}
      >
        Cluster{' '}
        <span style={{
          background: 'linear-gradient(135deg, var(--color-accent-success), var(--color-accent-blue))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Intelligence
        </span>
      </motion.h2>

      <motion.p
        variants={line2Variants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-base)',
          color: 'var(--color-text-secondary)',
          margin: 0,
          maxWidth: 560,
          lineHeight: 1.6,
        }}
      >
        Drill down from cluster to namespace to pod with spatial morphing transitions.
        Every metric updates live from real infrastructure telemetry.
      </motion.p>
    </div>
  );
};

// Stats strip 
const StatsStrip = ({ isInView }) => {
  const stats = [
    { label: 'Active Clusters', value: '6', unit: '' },
    { label: 'Total Pods', value: '247', unit: '' },
    { label: 'Avg CPU', value: '54', unit: '%' },
    { label: 'Monthly Cost', value: '$12.4k', unit: '' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion() ? 0 : 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ ...tokens.transitions.springDamp, delay: 0.3 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: 1,
        marginBlockEnd: 'var(--space-xl)',
        background: 'var(--color-border-muted)',
        border: '1px solid var(--color-border-muted)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.35 + i * 0.07 }}
          style={{
            padding: 'var(--space-md)',
            background: 'var(--color-surface-card)',
            backdropFilter: 'blur(12px)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)' }}>
            {stat.value}
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{stat.unit}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Main 
export const FeatureSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px 0px' });
  const reduced = prefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const dashboardY   = useTransform(scrollYProgress, [0, 0.3], reduced ? [0, 0] : [40, 0]);
  const dashboardOp  = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  const dashboardShadow = useTransform(
    scrollYProgress,
    [0, 0.4],
    ['0 0 0px rgba(0,255,170,0)', '0 0 60px rgba(0,255,170,0.06)']
  );

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        paddingBlock: 'var(--space-xxl)',
        paddingInline: 'clamp(var(--space-md), 4vw, var(--space-xxl))',
        maxWidth: 1200,
        marginInline: 'auto',
        position: 'relative',
      }}
    >
      {/* Background grid glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(0,255,170,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <SectionHeader isInView={isInView} />
      <StatsStrip isInView={isInView} />

      {/* Dashboard card – elevates on scroll */}
      <motion.div
        style={{
          y: dashboardY,
          opacity: dashboardOp,
          boxShadow: dashboardShadow,
          background: 'var(--color-surface-card)',
          border: '1px solid var(--color-border-muted)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(var(--space-md), 3vw, var(--space-xl))',
          backdropFilter: 'blur(24px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Corner accent */}
        <div style={{
          position: 'absolute',
          insetBlockStart: 0,
          insetInlineStart: 0,
          insetInlineEnd: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent 5%, var(--color-border-active) 30%, var(--color-accent-success) 50%, var(--color-border-active) 70%, transparent 95%)',
          opacity: 0.6,
        }} />

        <DrillDownDashboard />
      </motion.div>

      {/* Scroll hint */}
  
    </section>
  );
};
