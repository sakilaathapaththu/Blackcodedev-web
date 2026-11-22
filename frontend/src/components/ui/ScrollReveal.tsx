'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type ScrollRevealProps = {
  children: ReactNode;
  /** CSS selector for the elements (inside children) to animate in. */
  targets: string;
  /** Starting transform; elements animate to `none`-equivalent on reveal. */
  from?: 'translateY(50px)' | 'translateX(-50px)';
  threshold?: number;
  rootMargin?: string;
  /** Delay each element revealed in the same batch by `stagger` ms. */
  stagger?: number;
  /** Optional transform applied on hover (team cards tilt). */
  hoverTransform?: string;
};

/**
 * Fades/slides elements in when they enter the viewport. Wrapping with a
 * `display: contents` element keeps the original DOM/CSS layout intact while
 * letting server-rendered content stay a Server Component.
 */
export function ScrollReveal({
  children,
  targets,
  from = 'translateY(50px)',
  threshold = 0.1,
  rootMargin,
  stagger = 0,
  hoverTransform,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const elements = Array.from(root.querySelectorAll<HTMLElement>(targets));
    const rest = from.startsWith('translateX') ? 'translateX(0)' : 'translateY(0)';
    const timers: number[] = [];

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    elements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = from;
      el.style.transition = 'all 0.8s ease';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const show = () => {
            el.style.opacity = '1';
            el.style.transform = rest;
          };
          if (stagger) timers.push(window.setTimeout(show, index * stagger));
          else show();
        });
      },
      { threshold, rootMargin },
    );
    elements.forEach((el) => observer.observe(el));

    const cleanups: Array<() => void> = [];
    if (hoverTransform) {
      elements.forEach((el) => {
        const enter = () => (el.style.transform = hoverTransform);
        const leave = () => (el.style.transform = rest);
        el.addEventListener('mouseenter', enter);
        el.addEventListener('mouseleave', leave);
        cleanups.push(() => {
          el.removeEventListener('mouseenter', enter);
          el.removeEventListener('mouseleave', leave);
        });
      });
    }

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
      cleanups.forEach((fn) => fn());
    };
  }, [targets, from, threshold, rootMargin, stagger, hoverTransform]);

  return (
    <div ref={ref} style={{ display: 'contents' }}>
      {children}
    </div>
  );
}
