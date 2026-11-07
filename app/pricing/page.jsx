import Pricing from '../../components/pages/Pricing';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Pricing — start free, every model on one bill — Hanzo AI',
  description: 'Start free with no card. Pro, Max and Team cover every model, Kai and Hanzo Dev on one bill, with a budget on every key. Pay by card, Apple Pay or Google Pay, or fund usage in USDC or USDT.',
};

export default function Page() {
  return <><JsonLd route="/pricing" /><Pricing /></>;
}
