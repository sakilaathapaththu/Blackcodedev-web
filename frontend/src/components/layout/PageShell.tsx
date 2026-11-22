import type { ReactNode } from 'react';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { Particles } from '@/components/ui/Particles';

export type PageScope = 'home' | 'about' | 'team' | 'careers' | 'contact';

type PageShellProps = {
  /** Matches the `.page-<scope>` class used by src/styles/pages/<scope>.css */
  scope: PageScope;
  children: ReactNode;
  particles?: { count?: number; variant?: 'default' | 'rise' };
};

/**
 * Common page frame: particles background, navbar and footer.
 * Page styles are scoped under `.page-<scope>` so pages never leak CSS into
 * each other (important because Next.js keeps recently visited pages mounted).
 */
export function PageShell({ scope, children, particles }: PageShellProps) {
  return (
    <div className={`page-${scope}`}>
      <Particles {...particles} />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
