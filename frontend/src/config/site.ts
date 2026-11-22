/**
 * Single source of truth for site-wide constants (brand, contact details,
 * navigation, social links). Change values here instead of in components.
 */
export const siteConfig = {
  name: 'BlackCode Devs',
  url: 'https://blackcodedev.com',
  description:
    'BlackCode Devs builds modern, scalable web and mobile applications. Hire us for full-stack development, cloud, and AI integrations.',
  tagline:
    'Transforming ideas into exceptional digital experiences with modern technology and innovative thinking.',
  copyrightYear: 2025,
  contact: {
    email: 'helloblackcodedev@gmail.com',
    phoneDisplay: '+94 71 478 2241',
    phoneHref: 'tel:+94714782241',
    location: 'Colombo, Sri Lanka',
    office: 'Pothuhera, Kurunegala',
  },
  social: {
    instagram: 'https://www.instagram.com/blackcodedevs',
    linkedin: 'https://www.linkedin.com/company/blackcodedevs/',
    facebook: 'https://www.facebook.com/blackcodedev',
  },
} as const;

export type NavLink = {
  href: string;
  label: string;
  /** Only render the link on this pathname (e.g. in-page anchors). */
  onlyOn?: string;
};

export const mainNav: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/#services', label: 'Services', onlyOn: '/' },
  { href: '/about', label: 'About Us' },
  { href: '/team', label: 'Our Team' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];

export const footerNav: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/team', label: 'Our Team' },
  { href: '/contact', label: 'Contact' },
];
