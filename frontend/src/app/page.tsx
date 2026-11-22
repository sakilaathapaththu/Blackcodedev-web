import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { ProjectCard } from '@/components/sections/home/ProjectCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { siteConfig } from '@/config/site';
import { cubeFaces, projects, services } from '@/content/home';
import '@/styles/pages/home.css';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/images/logo.png`,
  sameAs: [siteConfig.social.facebook, siteConfig.social.instagram, siteConfig.social.linkedin],
};

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <PageShell scope="home" particles={{ count: 50 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      <section className="hero" id="home">
        <div className="hero-background" />
        <div className="hero-content">
          <h1>BlackCode Devs</h1>
          <p>
            At <strong>BlackCode Devs</strong>, we specialize in building modern, scalable, and high-performance
            digital solutions. From web and mobile app development to enterprise software and cloud integration,
            we empower businesses to thrive in the digital age.
          </p>
          <p>
            Our team of expert developers, UI/UX designers, and tech strategists work closely with clients to
            transform innovative ideas into functional, user-centric products.
          </p>
          <a href="#services" className="cta-button">
            Explore Our Work
          </a>
        </div>
      </section>

      <section className="about" id="about">
        <div className="about-container">
          <div className="about-content">
            <h2>About BlackCode Devs</h2>
            <p>
              <strong>BlackCode Devs</strong> is a modern software development company committed to delivering
              cutting-edge digital solutions. From concept to launch, we bring your ideas to life through sleek,
              functional, and scalable applications.
            </p>
            <p>
              We specialize in full-stack development, mobile apps, cloud integration, UI/UX design, and secure
              hosting solutions. Our in-house hosting service ensures your website or application runs smoothly,
              with optimized performance, high uptime, and built-in security.
            </p>
            <p>
              Whether you&apos;re a startup, SME, or enterprise, we guide you through every technical step — from
              choosing the right architecture to deploying your app, configuring DNS, setting up databases, and
              even handling backups and SSL certificates.
            </p>
            <p>
              At BlackCode Devs, we don’t just build software — we empower businesses with reliable
              infrastructure, expert technical guidance, and long-term support to ensure your digital product
              succeeds and scales.
            </p>
          </div>

          <div className="about-visual" aria-hidden="true">
            <div className="cube">
              {cubeFaces.map(({ face, label }) => (
                <div key={face} className={`cube-face ${face}`}>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="services" id="services">
        <h2 className="section-title">Our Services</h2>
        <ScrollReveal targets=".service-card" rootMargin="0px 0px -50px 0px">
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.title} className="service-card">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="portfolio" id="portfolio">
        <div className="portfolio-container">
          <h2 className="section-title">Some of our finest work.</h2>
          <div className="portfolio-grid">
            {projects
              .filter((project) => !project.hidden)
              .map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="contact-container">
          <h2>Get In Touch</h2>
          <p>
            Have a project in mind or need expert advice? Reach out to BlackCode Devs and let&apos;s build something
            exceptional together.
          </p>
          <Link href="/contact" className="cta-btn primary">
            Contact Us
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
