'use client';

import { useEffect, useRef } from 'react';

type ParticlesProps = {
  count?: number;
  /** `rise` = careers page style (random size, starts near the bottom). */
  variant?: 'default' | 'rise';
};

/**
 * Decorative floating particles. Generated after mount (random values would
 * cause hydration mismatches if rendered on the server) and appended
 * imperatively, since they never need React state.
 */
export function Particles({ count = 30, variant = 'default' }: ParticlesProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDelay = `${Math.random() * 6}s`;
      if (variant === 'rise') {
        const size = 1 + Math.random() * 3;
        p.style.top = `${80 + Math.random() * 20}vh`;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.animationDuration = `${3 + Math.random() * 4}s`;
      } else {
        p.style.animationDuration = `${Math.random() * 3 + 3}s`;
      }
      fragment.appendChild(p);
    }
    container.appendChild(fragment);
    return () => container.replaceChildren();
  }, [count, variant]);

  return <div className="particles" ref={ref} aria-hidden="true" />;
}
