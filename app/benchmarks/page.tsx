import Benchmarks from '../../components/pages/Benchmarks';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Hanzo — Benchmarks',
  description: 'Independent AI benchmarks: Enso model routing, Zen reasoning, Kai decisions, memory retrieval latency, and engine throughput.',
};

export default function Page() {
  return <><JsonLd route="/benchmarks" /><Benchmarks /></>;
}
