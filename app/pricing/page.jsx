// Signature: one plan panel, many states: tabs and the plan rail morph a single panel (height, name, rolling price, Hanzo's lines) with no cut, and the Pro row walks its ladder
// Beyond: the compare sheet: every personal plan's own lines side by side with what each inherits, opened out of the panel
import Pricing from '../../components/pages/Pricing';
import JsonLd from '../../components/JsonLd';
import { QA } from '../../components/pages/Pricing.faq';
import { goImport } from '../../lib/modules';

export const metadata = {
  title: 'Pricing — start free, every model on one bill — Hanzo AI',
  description: 'Start free with no card. Pro, Max and Team cover every model, Kai and Hanzo Dev on one bill, with a budget on every key. Pay by card, Apple Pay or Google Pay, or fund usage in USDC or USDT.',
  other: goImport('pricing'),
};

export default function Page() {
  return <><JsonLd route="/pricing" faq={QA} /><Pricing /></>;
}
