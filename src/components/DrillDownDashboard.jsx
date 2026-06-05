// DrillDownDashboard – Spatial Morphing Drill-Down Chart


import { useState, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { tokens } from '../tokens/design-system';
import { useClusters, useNamespaces, usePods } from '../hooks/useMetricsData';
import { Breadcrumb } from './Breadcrumb';
import { AnimatedCounter } from './AnimatedCounter';
import { LoadingState, ErrorState } from './States';
import { containerVariants, fadeSlideUp, scaleIn, prefersReducedMotion } from '../utils/motion';

//  Cluster Bar
const ClusterBar = ({ cluster, isSelected, onClick }) => {
  const cpuPct = cluster.cpu;

  return (
    <motion.div
      layoutId={`cluster-${cluster.id}`}
      onClick={onClick}
      whileHover={{ scale: prefersReducedMotion() ? 1 : 1.015 }}
      whileTap={{ scale: prefersReducedMotion() ? 1 : 0.98 }}
      style={{
        background: isSelected ? 'var(--color-surface-elevated)' : 'var(--color-surface-card)',
        border: `1px solid ${isSelected ? 'var(--color-border-active)' : 'var(--color-border-muted)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-md)',
        cursor: 'pointer',
        backdropFilter: 'blur(16px)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
    >
      {/* Active glow line */}
      {isSelected && (
        <motion.div
          layoutId={`glow-${cluster.id}`}
          style={{
            position: 'absolute',
            insetBlockStart: 0,
            insetInlineStart: 0,
            insetInlineEnd: 0,
            height: 2,
            background: 'linear-gradient(90deg, transparent, var(--color-accent-success), transparent)',
          }}
        />
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <div style={{
            width: 8, height: 8,
            borderRadius: '50%',
            background: cluster.statusColor,
            boxShadow: `0 0 8px ${cluster.statusColor}`,
            flexShrink: 0,
          }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}>
            {cluster.name}
          </span>
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-secondary)',
          background: 'rgba(255,255,255,0.04)',
          padding: '2px 8px',
          borderRadius: 'var(--radius-full)',
        }}>
          {cluster.region}
        </span>
      </div>

      {/* CPU bar */}
      <div style={{ marginBlockEnd: 'var(--space-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBlockEnd: 4 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>CPU</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent-blue)' }}>
            <AnimatedCounter value={cpuPct} suffix="%" />
          </span>
        </div>
        <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${cpuPct}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.15 }}
            style={{
              height: '100%',
              background: `linear-gradient(90deg, var(--color-accent-blue), #7eb8ff)`,
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 0 10px rgba(59,158,255,0.4)',
            }}
          />
        </div>
      </div>

      {/* Footer stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-sm)' }}>
        {[
          { label: 'MEM', value: cluster.memory, suffix: '%', color: 'var(--color-accent-success)' },
          { label: 'PODS', value: cluster.pods, suffix: '', color: 'var(--color-accent-warn)' },
          { label: 'COST', value: cluster.cost, suffix: '', prefix: '$', color: '#c084fc', decimals: 0 },
        ].map(({ label, value, suffix, prefix, color, decimals }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBlockEnd: 2 }}>
              {label}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', color }}>
              <AnimatedCounter value={value} prefix={prefix || ''} suffix={suffix} decimals={decimals || 0} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Namespace Row 
const NamespaceRow = ({ ns, index, isSelected, onClick }) => (
  <motion.div
    key={ns.id}
    layoutId={`ns-${ns.id}`}
    variants={fadeSlideUp}
    initial="hidden"
    animate="visible"
    exit="exit"
    custom={index}
    onClick={onClick}
    whileHover={{ x: prefersReducedMotion() ? 0 : 4, scale: prefersReducedMotion() ? 1 : 1.008 }}
    whileTap={{ scale: prefersReducedMotion() ? 1 : 0.99 }}
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto auto auto auto',
      alignItems: 'center',
      gap: 'var(--space-md)',
      padding: 'var(--space-md)',
      background: isSelected ? 'var(--color-surface-elevated)' : 'var(--color-surface-card)',
      border: `1px solid ${isSelected ? 'var(--color-border-active)' : 'var(--color-border-muted)'}`,
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      backdropFilter: 'blur(12px)',
      transition: 'border-color 0.2s',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: ns.statusColor, boxShadow: `0 0 6px ${ns.statusColor}`, flexShrink: 0 }} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
        {ns.name}
      </span>
    </div>
    {[
      { label: 'CPU', value: ns.cpu, suffix: '%', color: 'var(--color-accent-blue)' },
      { label: 'MEM', value: ns.memory, suffix: '%', color: 'var(--color-accent-success)' },
      { label: 'PODS', value: ns.pods, color: 'var(--color-accent-warn)' },
      { label: 'COST', value: ns.cost, prefix: '$', color: '#c084fc', decimals: 0 },
    ].map(({ label, value, suffix, prefix, color, decimals }) => (
      <div key={label} style={{ textAlign: 'right', minWidth: 56 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', color }}>
          <AnimatedCounter value={value} prefix={prefix || ''} suffix={suffix || ''} decimals={decimals || 0} />
        </div>
      </div>
    ))}
  </motion.div>
);

// Pod Row 
const PodRow = ({ pod, index }) => (
  <motion.div
    key={pod.id}
    variants={fadeSlideUp}
    custom={index}
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto auto auto auto auto',
      alignItems: 'center',
      gap: 'var(--space-md)',
      padding: 'var(--space-sm) var(--space-md)',
      background: 'rgba(10,20,30,0.5)',
      border: '1px solid var(--color-border-muted)',
      borderRadius: 'var(--radius-md)',
      backdropFilter: 'blur(8px)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: pod.statusColor, boxShadow: `0 0 5px ${pod.statusColor}`, flexShrink: 0 }} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)' }}>
        {pod.name}
      </span>
    </div>
    {[
      { label: 'CPU', value: pod.cpu, suffix: '%', color: 'var(--color-accent-blue)' },
      { label: 'MEM', value: pod.memory, suffix: '%', color: 'var(--color-accent-success)' },
      { label: 'UP', value: pod.uptime, suffix: '%', color: pod.uptime > 90 ? 'var(--color-accent-success)' : 'var(--color-accent-warn)' },
      { label: 'RST', value: pod.restarts, color: pod.restarts > 3 ? 'var(--color-accent-danger)' : 'var(--color-text-secondary)' },
      { label: '$', value: pod.cost, prefix: '$', color: '#c084fc', decimals: 2 },
    ].map(({ label, value, suffix, prefix, color, decimals }) => (
      <div key={label} style={{ textAlign: 'right', minWidth: 44 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-text-secondary)', opacity: 0.7 }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xs)', color }}>
          <AnimatedCounter value={value} prefix={prefix || ''} suffix={suffix || ''} decimals={decimals || 0} />
        </div>
      </div>
    ))}
  </motion.div>
);

// Level Views 

const ClusterView = ({ clusters, selectedCluster, onSelect }) => (
  <motion.div
    key="cluster-view"
    variants={containerVariants(0.06)}
    initial="hidden"
    animate="visible"
    exit="exit"
    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-md)' }}
  >
    {clusters.map((cluster) => (
      <motion.div key={cluster.id} variants={fadeSlideUp}>
        <ClusterBar
          cluster={cluster}
          isSelected={selectedCluster?.id === cluster.id}
          onClick={() => onSelect(cluster)}
        />
      </motion.div>
    ))}
  </motion.div>
);

const NamespaceView = ({ cluster, namespaces, isLoading, isError, selectedNs, onSelect }) => (
  <motion.div
    key="ns-view"
    variants={containerVariants(0.07)}
    initial="hidden"
    animate="visible"
    exit="exit"
  >
    {/* Morphed cluster header */}
    <motion.div
      layoutId={`cluster-${cluster.id}`}
      style={{
        background: 'var(--color-surface-elevated)',
        border: '1px solid var(--color-border-active)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-md)',
        marginBlockEnd: 'var(--space-lg)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <motion.div
        layoutId={`glow-${cluster.id}`}
        style={{
          position: 'absolute', insetBlockStart: 0, insetInlineStart: 0, insetInlineEnd: 0, height: 2,
          background: 'linear-gradient(90deg, transparent, var(--color-accent-success), transparent)',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: cluster.statusColor, boxShadow: `0 0 10px ${cluster.statusColor}` }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)' }}>
            {cluster.name}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', padding: '2px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-full)' }}>
            {cluster.region}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          {[
            { label: 'CPU', value: cluster.cpu, suffix: '%', color: 'var(--color-accent-blue)' },
            { label: 'MEM', value: cluster.memory, suffix: '%', color: 'var(--color-accent-success)' },
            { label: 'TOTAL COST', value: cluster.cost, prefix: '$', color: '#c084fc', decimals: 0 },
          ].map(({ label, value, suffix, prefix, color, decimals }) => (
            <div key={label} style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', color }}>
                <AnimatedCounter value={value} prefix={prefix || ''} suffix={suffix || ''} decimals={decimals || 0} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>

    {/* Namespace list */}
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBlockEnd: 'var(--space-md)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Namespaces
        </span>
        <div style={{ flex: 1, height: 1, background: 'var(--color-border-muted)' }} />
      </div>

      {isLoading && <LoadingState message="Loading namespaces…" />}
      {isError && <ErrorState message="Failed to load namespaces." />}
      {namespaces && (
        <motion.div
          variants={containerVariants(0.07)}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}
        >
          {namespaces.map((ns, i) => (
            <NamespaceRow
              key={ns.id}
              ns={ns}
              index={i}
              isSelected={selectedNs?.id === ns.id}
              onClick={() => onSelect(ns)}
            />
          ))}
        </motion.div>
      )}
    </div>
  </motion.div>
);

const PodView = ({ cluster, namespace, pods, isLoading, isError }) => (
  <motion.div
    key="pod-view"
    variants={containerVariants(0.06)}
    initial="hidden"
    animate="visible"
    exit="exit"
  >
    {/* Namespace header */}
    <motion.div
      layoutId={`ns-${namespace.id}`}
      style={{
        background: 'var(--color-surface-elevated)',
        border: '1px solid var(--color-border-active)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-md)',
        marginBlockEnd: 'var(--space-lg)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: namespace.statusColor, boxShadow: `0 0 8px ${namespace.statusColor}` }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)' }}>
            {namespace.name}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', padding: '2px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-full)' }}>
            in {cluster.name}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          {[
            { label: 'CPU', value: namespace.cpu, suffix: '%', color: 'var(--color-accent-blue)' },
            { label: 'MEM', value: namespace.memory, suffix: '%', color: 'var(--color-accent-success)' },
            { label: 'NS COST', value: namespace.cost, prefix: '$', color: '#c084fc', decimals: 0 },
          ].map(({ label, value, suffix, prefix, color, decimals }) => (
            <div key={label} style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', color }}>
                <AnimatedCounter value={value} prefix={prefix || ''} suffix={suffix || ''} decimals={decimals || 0} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>

    {/* Pod list */}
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBlockEnd: 'var(--space-md)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Pods
        </span>
        <div style={{ flex: 1, height: 1, background: 'var(--color-border-muted)' }} />
      </div>

      {isLoading && <LoadingState message="Scheduling pod view…" />}
      {isError && <ErrorState message="Failed to load pods." />}
      {pods && (
        <motion.div
          variants={containerVariants(0.06)}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}
        >
          {pods.map((pod, i) => (
            <PodRow key={pod.id} pod={pod} index={i} />
          ))}
        </motion.div>
      )}
    </div>
  </motion.div>
);

//Main Dashboard 
export const DrillDownDashboard = () => {
  const { data: clusters, isLoading: clustersLoading, isError: clustersError } = useClusters();
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [selectedNs, setSelectedNs] = useState(null);

  const { data: namespaces, isLoading: nsLoading, isError: nsError } = useNamespaces(selectedCluster);
  const { data: pods, isLoading: podsLoading, isError: podsError } = usePods(selectedNs);

  const level = selectedNs ? 2 : selectedCluster ? 1 : 0;

  const breadcrumbs = [
    { id: 'root', label: 'global' },
    ...(selectedCluster ? [{ id: 'cluster', label: selectedCluster.name }] : []),
    ...(selectedNs ? [{ id: 'ns', label: selectedNs.name }] : []),
  ];

  const handleBreadcrumbNav = useCallback((index) => {
    if (index === 0) { setSelectedCluster(null); setSelectedNs(null); }
    if (index === 1) { setSelectedNs(null); }
  }, []);

  const handleClusterSelect = useCallback((cluster) => {
    setSelectedCluster(cluster);
    setSelectedNs(null);
  }, []);

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBlockEnd: 'var(--space-md)' }}>
        <Breadcrumb crumbs={breadcrumbs} onNavigate={handleBreadcrumbNav} />
      </div>

      {/* Level indicator */}
      <div style={{ display: 'flex', gap: 6, marginBlockEnd: 'var(--space-lg)', alignItems: 'center' }}>
        {['Clusters', 'Namespaces', 'Pods'].map((lbl, i) => (
          <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: i < level ? 6 : i === level ? 8 : 6,
              height: i < level ? 6 : i === level ? 8 : 6,
              borderRadius: '50%',
              background: i === level ? 'var(--color-accent-success)' : i < level ? 'rgba(0,255,170,0.4)' : 'rgba(255,255,255,0.1)',
              boxShadow: i === level ? '0 0 10px var(--color-glow-success)' : 'none',
              transition: 'all 0.3s',
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: i === level ? 'var(--color-accent-success)' : 'var(--color-text-secondary)',
              opacity: i === level ? 1 : 0.5,
            }}>
              {lbl}
            </span>
            {i < 2 && <div style={{ width: 20, height: 1, background: 'rgba(255,255,255,0.1)' }} />}
          </div>
        ))}
      </div>

      {/* Main content */}
      <LayoutGroup>
        <AnimatePresence mode="wait">
          {clustersLoading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingState />
            </motion.div>
          )}

          {clustersError && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ErrorState />
            </motion.div>
          )}

          {clusters && level === 0 && (
            <ClusterView
              key="cluster-view"
              clusters={clusters}
              selectedCluster={selectedCluster}
              onSelect={handleClusterSelect}
            />
          )}

          {clusters && level === 1 && selectedCluster && (
            <NamespaceView
              key="ns-view"
              cluster={selectedCluster}
              namespaces={namespaces}
              isLoading={nsLoading}
              isError={nsError}
              selectedNs={selectedNs}
              onSelect={setSelectedNs}
            />
          )}

          {clusters && level === 2 && selectedNs && (
            <PodView
              key="pod-view"
              cluster={selectedCluster}
              namespace={selectedNs}
              pods={pods}
              isLoading={podsLoading}
              isError={podsError}
            />
          )}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
};
