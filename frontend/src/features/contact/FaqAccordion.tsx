'use client';

import { useId, useRef, useState } from 'react';
import type { Faq } from '@/content/contact';

export function FaqAccordion({ items }: { items: Faq[] }) {
  return (
    <div className="faq-grid">
      {items.map((faq) => (
        <FaqItem key={faq.question} faq={faq} />
      ))}
    </div>
  );
}

function FaqItem({ faq }: { faq: Faq }) {
  const answerRef = useRef<HTMLDivElement>(null);
  const answerId = useId();
  // null = never toggled, so the stylesheet's collapsed state applies.
  const [maxHeight, setMaxHeight] = useState<number | null>(null);
  const open = Boolean(maxHeight);

  const toggle = () => setMaxHeight(open ? 0 : (answerRef.current?.scrollHeight ?? 0));

  return (
    <div className={open ? 'faq-item active' : 'faq-item'}>
      <div
        className="faq-question"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-controls={answerId}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        }}
      >
        <h4>{faq.question}</h4>
        <span className="faq-toggle" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
      </div>
      <div
        id={answerId}
        ref={answerRef}
        className="faq-answer"
        style={maxHeight === null ? undefined : { maxHeight: `${maxHeight}px` }}
      >
        <p>{faq.answer}</p>
      </div>
    </div>
  );
}
