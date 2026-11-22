import Link from 'next/link';
import { footerNav, siteConfig } from '@/config/site';
import { ExternalLink } from '@/components/ui/ExternalLink';
import { SocialIcon } from '@/components/ui/SocialIcon';
import './footer.css';

const services = ['Web Development', 'Mobile App Development', 'UI/UX Design', 'Technical Consulting'];

export function Footer() {
  const { contact, social } = siteConfig;

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-info">
          <div className="footer-section">
            <h4>{siteConfig.name}</h4>
            <p>{siteConfig.tagline}</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              {footerNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4>Services</h4>
            <ul>
              {services.map((service) => (
                <li key={service}>
                  <Link href="/#services">{service}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>
              📧 <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </p>
            <p>
              📞 <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
            </p>
            <p>📍 {contact.location}</p>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <ExternalLink href={social.instagram} aria-label="Instagram">
                <SocialIcon network="instagram" />
              </ExternalLink>
              <ExternalLink href={social.linkedin} aria-label="LinkedIn">
                <SocialIcon network="linkedin" />
              </ExternalLink>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {siteConfig.copyrightYear} <strong>BlackcodeDevs</strong>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
