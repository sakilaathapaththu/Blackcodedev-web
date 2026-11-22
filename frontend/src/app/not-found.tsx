import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { PageHero } from '@/components/ui/PageHero';
import '@/styles/pages/contact.css';

export default function NotFound() {
  return (
    <PageShell scope="contact">
      <PageHero title="Page Not Found">
        <p>The page you are looking for does not exist or has moved.</p>
        <p style={{ marginTop: 24 }}>
          <Link href="/" className="cta-btn primary">
            Back to Home
          </Link>
        </p>
      </PageHero>
    </PageShell>
  );
}
