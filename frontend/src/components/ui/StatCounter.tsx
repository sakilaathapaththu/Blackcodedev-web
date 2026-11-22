'use client';

import { useEffect, useRef, useState } from 'react';

type StatCounterProps = {
  value: number;
  /** Number of animation frames (one every 30 ms). */
  steps?: number;
};

/** Counts from 0 up to `value` the first time it scrolls into view. */
export function StatCounter({ value, steps = 50 }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: number | undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      let next = 0;
      timer = window.setInterval(() => {
        next = Math.min(value, next + value / steps);
        setCurrent(Math.floor(next));
        if (next >= value) window.clearInterval(timer);
      }, 30);
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [value, steps]);

  return (
    <div ref={ref} className="stat-number" aria-label={String(value)}>
      {current}
    </div>
  );
}
