// Signature: timeline. The five operating laws on a strip you drag; the law in hand takes the panel and a hexagram gains a line per law.
import Philosophy from '../../components/pages/Philosophy';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'The Zen of Hanzo — 64 patterns for intelligent systems',
  description: 'Systems philosophy for open, decentralized AI. Architectural patterns for understandable, adaptive, and human-aligned intelligence.',
};

export default function Page() {
  return <><JsonLd route="/philosophy" /><Philosophy /></>;
}
