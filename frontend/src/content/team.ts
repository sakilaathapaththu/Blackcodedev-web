import type { StaticImageData } from 'next/image';
import sakila from '@/assets/images/team/sakila-athapaththu.png';
import praveen from '@/assets/images/team/praveen-liyanage.jpeg';
import thamindu from '@/assets/images/team/thamindu-sulakshana.png';

export type Leader = {
  name: string;
  title: string;
  image: StaticImageData;
  linkedin?: string;
  instagram?: string;
};

export type CultureValue = { title: string; text: string };

export const leaders: Leader[] = [
  {
    name: 'SAKILA ATHAPATHTHU',
    title: 'Co-Founder',
    image: sakila,
    linkedin: 'https://www.linkedin.com/in/sakila-athapaththu-412647215',
    instagram: 'https://www.instagram.com/__s_a_k_i_l_a__/',
  },
  {
    name: 'Praveen Liyanage',
    title: 'Co-Founder',
    image: praveen,
    linkedin: 'https://www.linkedin.com/in/praveendliyanage/',
    instagram: 'https://www.instagram.com/_dinethliyanage_/',
  },
  {
    name: 'Thamindu Sulakshana',
    title: 'Co-Founder',
    image: thamindu,
    linkedin: 'https://www.linkedin.com/in/thamindusulakshana',
    instagram: 'https://www.instagram.com/thamindusulakshana',
  },
];

export const culture: CultureValue[] = [
  {
    title: 'Innovation First',
    text: 'We encourage creative thinking and embrace new technologies to stay ahead of the curve.',
  },
  {
    title: 'Collaboration',
    text: "Our success comes from teamwork, open communication, and supporting each other's growth.",
  },
  {
    title: 'Continuous Learning',
    text: "We invest in our team's professional development through training, conferences, and skill development.",
  },
  {
    title: 'Work-Life Balance',
    text: 'We believe in maintaining a healthy balance between professional excellence and personal well-being.',
  },
];
