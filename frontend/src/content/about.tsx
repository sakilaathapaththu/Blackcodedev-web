import type { ReactNode } from 'react';

export type TimelineItem = { year: string; title: string; paragraphs: ReactNode[] };
export type InfoCard = { key: string; title: string; text: string };
export type Stat = { value: number; label: string };
export type TechCategory = { title: string; items: string[] };

export const timeline: TimelineItem[] = [
  {
    year: '2022',
    title: 'Campus Origins',
    paragraphs: ['Started as a group of IT students building assignment-based projects for web and mobile platforms.'],
  },
  {
    year: '2024',
    title: 'Project Milestone',
    paragraphs: ['Completed over 50 academic and freelance projects, gaining real-world development experience.'],
  },
  {
    year: '2025',
    title: 'First Real Products',
    paragraphs: [
      <>
        Developed major apps like <strong>ePaddy</strong> (smart farming) and launched our custom-built{' '}
        <strong>LMS</strong> platform.
      </>,
      <>
        Delivered the official website for <strong>Lexicon International School</strong> and expanded services to
        NGOs and SMEs.
      </>,
    ],
  },
  {
    year: '2025',
    title: 'Scaling Up',
    paragraphs: [
      'Transitioned from student-led projects to a full-time software company delivering scalable, industry-ready products.',
    ],
  },
];

export const missionVisionValues: InfoCard[] = [
  {
    key: 'mission',
    title: 'Our Mission',
    text: 'To build innovative, reliable, and user-centric software solutions that help businesses, institutions, and communities grow in the digital age. We aim to bridge the gap between ideas and execution through clean code and scalable systems.',
  },
  {
    key: 'vision',
    title: 'Our Vision',
    text: 'To become a globally trusted software development partner known for transforming ideas into impactful technology — empowering startups, enterprises, and educational institutions with smart, sustainable digital products.',
  },
  {
    key: 'values',
    title: 'Our Values',
    text: 'At BlackCode, we believe in integrity, innovation, teamwork, and continuous growth. We commit to transparency, deliver excellence in every line of code, and treat every client project like our own.',
  },
];

export const stats: Stat[] = [
  { value: 50, label: 'Projects Completed' },
  { value: 50, label: 'Happy Clients' },
  { value: 99, label: 'Client Satisfaction' },
  { value: 3, label: 'Years of Excellence' },
];

export const approachSteps: InfoCard[] = [
  {
    key: '01',
    title: 'Discovery & Planning',
    text: 'Every great product starts with understanding. We collaborate closely with clients to define goals, identify challenges, and create a tailored roadmap for success.',
  },
  {
    key: '02',
    title: 'Design & Architecture',
    text: 'We craft intuitive UI/UX designs and system architecture that combine usability with scalability — ensuring a smooth foundation before development begins.',
  },
  {
    key: '03',
    title: 'Development & Testing',
    text: 'Our expert developers build, integrate, and rigorously test your solution using agile workflows, ensuring high performance, clean code, and bug-free functionality.',
  },
  {
    key: '04',
    title: 'Launch & Ongoing Support',
    text: 'We deploy your product with precision and provide long-term maintenance, updates, and technical support to keep your solution running flawlessly.',
  },
];

export const techCategories: TechCategory[] = [
  { title: 'Frontend', items: ['React', 'Vue.js', 'Angular', 'Next.js', 'TypeScript', 'Tailwind CSS', 'MUI'] },
  {
    title: 'Backend',
    items: ['Node.js', 'Express.js', 'Python (Django / FastAPI)', 'Java (Spring Boot)', '.NET Core', 'PHP (Laravel)'],
  },
  { title: 'Mobile', items: ['Flutter', 'React Native', 'Android (Java/Kotlin)', 'iOS (Swift)', 'Ionic'] },
  {
    title: 'Cloud & DevOps',
    items: ['AWS', 'Azure', 'Firebase', 'Docker', 'Kubernetes', 'GitHub Actions / CI/CD'],
  },
  { title: 'Databases', items: ['MongoDB', 'MySQL', 'PostgreSQL', 'Firebase Firestore', 'SQLite'] },
  {
    title: 'Hosting & Infrastructure',
    items: ['cPanel', 'VPS', 'Linux (Ubuntu)', 'Apache / Nginx', 'SSL Configuration', 'Domain & DNS Setup'],
  },
];
