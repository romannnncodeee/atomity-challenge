// ─────────────────────────────────────────────────────────────
// AnimatedCounter – Smooth number counting animation
// ─────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../utils/motion';

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export const AnimatedCounter = ({
  value,
  duration = 900,
  prefix = '',
  suffix = '',
  decimals = 0,
  style = {},
}) => {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const startValRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }
    const startVal = display;
    startValRef.current = startVal;
    startRef.current = null;

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = startValRef.current + (value - startValRef.current) * eased;
      setDisplay(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [value]);

  const formatted =
    decimals > 0
      ? display.toFixed(decimals)
      : Math.round(display).toLocaleString();

  return (
    <span style={{ fontVariantNumeric: 'tabular-nums', ...style }}>
      {prefix}{formatted}{suffix}
    </span>
  );
};
