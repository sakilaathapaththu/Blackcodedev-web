import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/PageShell';
import { LeaderCard } from '@/components/sections/team/LeaderCard';
import { PageHero } from '@/components/ui/PageHero';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { culture, leaders } from '@/content/team';
import '@/styles/pages/team.css';

export const metadata: Metadata = {
  title: 'Our Team',
  description: 'Meet the founders and culture behind BlackCode Devs, a software development company in Sri Lanka.',
  alternates: { canonical: '/team' },
};

export default function TeamPage() {
  return (
    <PageShell scope="team">
      <PageHero title="Meet Our Team">
        <p>The brilliant minds behind BlackCode Devs innovative solutions and exceptional results</p>
      </PageHero>

      <ScrollReveal targets=".leader-card" stagger={100} hoverTransform="translateY(-10px) rotateX(5deg)">
        <section className="leadership">
          <div className="leadership-container">
            <h2>Leadership Team</h2>
            <div className="leadership-row single-center">
              {leaders.map((leader) => (
                <LeaderCard key={leader.name} leader={leader} />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal targets=".culture-item" stagger={100}>
        <section className="culture">
          <div className="culture-container">
            <h2>Our Culture</h2>
            <div className="culture-grid">
              {culture.map((item) => (
                <div key={item.title} className="culture-item">
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>
    </PageShell>
  );
}
