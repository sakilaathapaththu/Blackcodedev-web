import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/PageShell';
import { PageHero } from '@/components/ui/PageHero';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { siteConfig } from '@/config/site';
import { contactMethods, faqs, socialConnect } from '@/content/contact';
import { ContactForm } from '@/features/contact/ContactForm';
import { FaqAccordion } from '@/features/contact/FaqAccordion';
import '@/styles/pages/contact.css';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Tell BlackCode Devs about your project. We reply within 24 hours about web, mobile, cloud and AI development.',
  alternates: { canonical: '/contact' },
};

const floatingIcons = ['💻', '📱', '🚀', '⚡'];

export default function ContactPage() {
  return (
    <PageShell scope="contact">
      <PageHero title="Get In Touch">
        <p>Ready to transform your ideas into reality? Let&apos;s start a conversation about your next project.</p>
      </PageHero>

      <ScrollReveal targets=".contact-method, .faq-item, .float-element">
        <section className="contact-main">
          <div className="contact-container">
            <div className="contact-grid">
              <div className="contact-form-section">
                <h2>Start Your Project</h2>
                <p className="form-description">
                  Tell us about your project and we&apos;ll get back to you within 24 hours.
                </p>
                <ContactForm />
              </div>

              <div className="contact-info-section">
                <div className="contact-info">
                  <h3>Let&apos;s Connect</h3>
                  <p>We&apos;re here to help bring your vision to life. Reach out through any of these channels.</p>

                  <div className="contact-methods">
                    {contactMethods.map((method) => (
                      <div key={method.title} className="contact-method">
                        <div className="method-details">
                          <h4>{method.title}</h4>
                          {method.lines.map((line) => (
                            <p key={line}>{line}</p>
                          ))}
                          {method.action && (
                            <a href={method.action.href} className="chat-btn">
                              {method.action.label}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="social-connect">
                    <h4>Follow Us</h4>
                    <div className="social-links">
                      {socialConnect.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          className="social-link"
                          title={link.label}
                          {...(link.href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
                        >
                          <span className="social-label">{link.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="faq">
          <div className="faq-container">
            <h2>Frequently Asked Questions</h2>
            <FaqAccordion items={faqs} />
          </div>
        </section>

        <section className="cta">
          <div className="cta-container">
            <div className="cta-content">
              <h2>Ready to Start Your Project?</h2>
              <p>Join the 200+ businesses that trust BlackCode for their digital transformation</p>
              <div className="cta-buttons">
                <a href="#contactForm" className="cta-btn primary">
                  Get Started Now
                </a>
                <a href={siteConfig.contact.phoneHref} className="cta-btn secondary">
                  Call Us Today
                </a>
              </div>
            </div>
            <div className="cta-visual" aria-hidden="true">
              <div className="floating-elements">
                {floatingIcons.map((icon, index) => (
                  <div key={icon} className="float-element" style={{ animationDelay: `${index * 0.5}s` }}>
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </PageShell>
  );
}
