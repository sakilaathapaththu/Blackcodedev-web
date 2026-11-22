import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/PageShell';
import { PageHero } from '@/components/ui/PageHero';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { StatCounter } from '@/components/ui/StatCounter';
import { approachSteps, missionVisionValues, stats, techCategories, timeline } from '@/content/about';
import '@/styles/pages/about.css';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn how BlackCode Devs grew from a university project team into a full-time software company building web, mobile and cloud products.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <PageShell scope="about">
      <PageHero title="About BlackCode" />

      <section className="story">
        <div className="story-container">
          <div className="story-content">
            <h2>Our Story</h2>
            <p>
              <strong>BlackCode Devs</strong> began in 2023 as a group of passionate undergraduates taking on
              university assignment projects. What started with simple web and mobile application builds quickly
              evolved into a mission to deliver real-world, production-grade solutions.
            </p>
            <p>
              With over 50 academic and freelance projects under our belt, our team gained valuable experience
              working across diverse platforms and stacks. This hands-on foundation laid the path to developing
              high-impact applications like the <strong>ePaddy Mobile App</strong> for smart agriculture, a
              full-featured <strong>Learning Management System (LMS)</strong>, and the official website for{' '}
              <strong>Lexicon International School</strong>.
            </p>
            <p>
              From solving student needs to serving businesses and institutions, BlackCode has become a trusted
              software partner delivering quality, reliability, and innovation. Our story is proof that even small
              beginnings can grow into something extraordinary.
            </p>
          </div>

          <div className="story-visual">
            <ScrollReveal targets=".timeline-item" from="translateX(-50px)">
              <div className="timeline">
                {timeline.map((item) => (
                  <div key={item.title} className="timeline-item" data-year={item.year}>
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                      <h4>{item.title}</h4>
                      {item.paragraphs.map((text, i) => (
                        <p key={i}>{text}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <ScrollReveal targets=".mvv-card, .approach-step, .tech-category">
        <section className="mvv">
          <div className="mvv-container">
            <div className="mvv-grid">
              {missionVisionValues.map((card) => (
                <div key={card.key} className={`mvv-card ${card.key}`}>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="stats">
          <div className="stats-container">
            <h2>Our Impact in Numbers</h2>
            <div className="stats-grid">
              {stats.map((stat) => (
                <div key={stat.label} className="stat-item">
                  <StatCounter value={stat.value} />
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="approach">
          <div className="approach-container">
            <h2>Our Approach</h2>
            <div className="approach-grid">
              {approachSteps.map((step) => (
                <div key={step.key} className="approach-step">
                  <div className="step-number">{step.key}</div>
                  <h4>{step.title}</h4>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="technologies" id="technologies">
          <div className="tech-container">
            <h2>Technologies We Master</h2>
            <div className="tech-categories">
              {techCategories.map((category) => (
                <div key={category.title} className="tech-category">
                  <h4>{category.title}</h4>
                  <div className="tech-items">
                    {category.items.map((item) => (
                      <span key={item} className="tech-item">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>
    </PageShell>
  );
}
