import Comparison from '../../components/pages/Comparison';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'What it costs to run it yourself — Hanzo',
  description: 'The open-source stacks people reach for, priced from the compute their own compose files reserve, and the operating work that is not a line item.',
};

export default function Page() {
  return <><JsonLd route="/comparison" /><Comparison /></>;
}
