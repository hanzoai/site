// Signature: the hero hexagram walking Hanzo's sixty-four; press any line and it becomes the pattern that change makes.
import Philosophy from '../../components/pages/Philosophy';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'The Zen of Hanzo — Hanzo AI',
  description: '64 patterns for exploration, progress, and continuous improvement. Modern Hanzo interpretations inspired by the I Ching.',
};

export default function Page() {
  return <><JsonLd route="/philosophy" /><Philosophy /></>;
}
