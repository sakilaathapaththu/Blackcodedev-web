import type { ReactNode } from 'react';

type PageHeroProps = {
  title: string;
  children?: ReactNode;
  id?: string;
};

/** Full-height hero used at the top of each marketing page. */
export function PageHero({ title, children, id }: PageHeroProps) {
  return (
    <section className="hero" id={id}>
      <div className="hero-background" />
      <div className="hero-content">
        <h1>{title}</h1>
        {children}
      </div>
    </section>
  );
}
