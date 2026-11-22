import { siteConfig } from '@/config/site';

export type Faq = { question: string; answer: string };
export type ContactMethod = { title: string; lines: string[]; action?: { label: string; href: string } };

export const projectTypes = [
  { value: 'web-development', label: 'Web Development' },
  { value: 'mobile-app', label: 'Mobile Application' },
  { value: 'ui-ux-design', label: 'UI/UX Design' },
  { value: 'e-commerce', label: 'E-Commerce Solution' },
  { value: 'ai-ml', label: 'AI/ML Development' },
  { value: 'consulting', label: 'Technical Consulting' },
  { value: 'other', label: 'Other' },
] as const;

export const contactMethods: ContactMethod[] = [
  { title: 'Email Us', lines: [siteConfig.contact.email] },
  { title: 'Call Us', lines: [siteConfig.contact.phoneDisplay, 'Mon - Fri, 9AM - 6PM EST'] },
  { title: 'Visit Us', lines: [siteConfig.contact.office] },
  { title: 'Live Chat', lines: ['Available 24/7'], action: { label: 'Start Chat', href: '#' } },
];

export const socialConnect = [
  { label: 'LinkedIn', href: siteConfig.social.linkedin },
  { label: 'GitHub', href: '#' },
  { label: 'Twitter', href: '#' },
  { label: 'Instagram', href: siteConfig.social.instagram },
];

export const faqs: Faq[] = [
  {
    question: 'How long does a typical BlackCode project take?',
    answer:
      "Our project timelines vary based on the complexity and requirements. Standard web or mobile apps take 2–6 weeks. Advanced systems like LMS, eCommerce, or AI-based solutions may take 2–4 months. You'll receive a full timeline during our initial consultation.",
  },
  {
    question: 'What is BlackCode’s development process?',
    answer:
      'We follow an agile methodology. Our flow includes: discovery → wireframing & design → development → testing → deployment. We ensure regular client feedback and transparent updates using tools like Trello, Slack, or WhatsApp.',
  },
  {
    question: 'Do you provide ongoing maintenance and support?',
    answer:
      'Yes! We offer support packages based on your needs. This includes bug fixes, uptime monitoring, content updates, server management, and feature improvements for both web and mobile applications.',
  },
  {
    question: 'Can BlackCode work with our in-house team?',
    answer:
      'Absolutely. We frequently collaborate with internal developers, designers, and marketing teams. We can also offer consultation-only roles or take over entire modules as your technical partner.',
  },
  {
    question: 'Which technologies does BlackCode specialize in?',
    answer:
      'We specialize in modern tech stacks including React, Node.js, Spring Boot, Flutter, Firebase, MongoDB, and AWS. For CMS-based projects, we use Laravel, WordPress, and custom PHP. We also support hosting on VPS with cPanel or Linux Ubuntu.',
  },
  {
    question: 'How will BlackCode communicate with me during the project?',
    answer:
      'You’ll have a dedicated project manager for updates via email, WhatsApp, or Zoom. We share milestones, demo previews, and task status through Google Docs or Trello to keep everything transparent and on track.',
  },
];
