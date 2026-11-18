import { ogCard, OG_SIZE } from '@/lib/og';

export const alt = 'Harshit Arora — Full-stack & AI/ML engineer';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogCard({
    title: 'Engineer Dreamer',
    accent: 'Reader.',
    footer: 'Harshit Arora · Full-stack & AI/ML',
  });
}
