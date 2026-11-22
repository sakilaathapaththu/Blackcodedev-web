import type { StaticImageData } from 'next/image';
import dissanayake from '@/assets/images/projects/dissanayake-restaurant.jpeg';
import spotmyad from '@/assets/images/projects/spotmyad.png';
import courseMinistry from '@/assets/images/projects/course-ministry-lms.png';
import lexicon from '@/assets/images/projects/lexicon-school.png';
import epaddy from '@/assets/images/projects/epaddy.png';

export type Service = { title: string; description: string };

export type Project = {
  title: string;
  category: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
  tech: string[];
  liveUrl?: string;
  /** Set to true to keep the project in the data but not show it on the site. */
  hidden?: boolean;
};

/** Toggle the "Live Demo" buttons on project cards. */
export const showLiveDemoLinks = false;

export const services: Service[] = [
  {
    title: 'Web Development',
    description:
      'We craft dynamic, responsive websites using HTML, CSS, JavaScript, and modern frameworks. From business sites to web portals, we ensure performance, SEO, and scalability.',
  },
  {
    title: 'Mobile App Development',
    description:
      'We develop powerful Android and iOS apps using native and cross-platform technologies like Flutter and React Native — tailored for your business goals.',
  },
  {
    title: 'UI/UX Design',
    description:
      'We design clean, user-centered interfaces that offer smooth navigation and strong brand identity — enhancing engagement and usability.',
  },
  {
    title: 'Hosting & Deployment',
    description:
      'We provide secure, high-speed hosting and deployment services including domain setup, SSL configuration, and cloud server management (cPanel, VPS, Firebase, AWS, etc.).',
  },
  {
    title: 'Custom Software Solutions',
    description:
      'We build custom desktop and web-based software tailored to your unique business workflows, from inventory systems to customer portals and dashboards.',
  },
  {
    title: 'Tech Consulting & Support',
    description:
      'We offer expert guidance on technology stacks, infrastructure setup, version control, security, and long-term support for your digital growth.',
  },
];

const mernStack = ['React', 'Node.js', 'MongoDB', 'MUI', 'Express.js'];

export const projects: Project[] = [
  {
    title: 'Dissanayake Restaurant and Bakers',
    category: 'Web Application',
    description:
      'BlackCode Devs designed and built a complete e-commerce and operations portal for Dissanayake Restaurant & Bakers, enabling customers to browse the menu, customize orders, and pay online, while the business manages inventory, pricing, promotions, and deliveries from a single dashboard.',
    image: dissanayake,
    imageAlt: 'Dissanayake Restaurant and Bakers website preview',
    tech: [...mernStack, 'Hosting'],
    liveUrl: 'https://dissanayakerestaurant.lk/',
  },
  {
    title: 'SpotMyAd — The Student-First Marketplace for Campus & Community',
    category: 'Web Application',
    description:
      'BlackCode Devs built SpotMyAd to solve a common campus challenge: students need quick access to trustworthy help and everyday services—without bouncing across dozens of apps. SpotMyAd centralizes it all: study support, creative work, food, gigs, rentals, and general classifieds.',
    image: spotmyad,
    imageAlt: 'SpotMyAd marketplace preview',
    tech: [...mernStack, 'Hosting'],
    liveUrl: 'https://spotmyad.blackcodedev.com/',
  },
  {
    title: 'Course Ministry LMS',
    category: 'Web Application',
    description:
      'A modern Learning Management System built to simplify digital education and course delivery. Course Ministry includes role-based access for admins, instructors, and students, along with course creation, assignment management, session scheduling, lesson organization, and student progress monitoring in a clean, responsive interface.',
    image: courseMinistry,
    imageAlt: 'Course Ministry LMS preview',
    tech: mernStack,
    liveUrl: 'https://courseministry.blackcodedev.com/',
  },
  {
    title: 'Lexicon International School',
    category: 'Web Design',
    description:
      'Developed a dynamic school website for Lexicon International School using Laravel, featuring an admin panel, student portal, and responsive design.',
    image: lexicon,
    imageAlt: 'Lexicon International School website preview',
    tech: ['Laravel', 'Bootstrap', 'MySQL'],
    hidden: true,
  },
  {
    title: 'ePaddy',
    category: 'Mobile App & Web Site',
    description:
      'Developed the ePaddy mobile app and web platform using Flutter, integrating paddy disease identification, pest detection, automated water control, soil quality monitoring, and AI-powered crop prediction for smart farming.',
    image: epaddy,
    imageAlt: 'ePaddy smart farming app preview',
    tech: ['Python', 'Flask', 'Flutter', 'Firebase'],
    hidden: true,
  },
];

export const cubeFaces = [
  { face: 'front', label: 'Solutions' },
  { face: 'back', label: 'WEB' },
  { face: 'right', label: 'APP' },
  { face: 'left', label: 'UI' },
  { face: 'top', label: 'hosting' },
  { face: 'bottom', label: 'DEV' },
] as const;
