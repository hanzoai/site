// Persona: a team lead choosing a Hanzo plan
// Goal: a quote and a plan
// CTA: Start Team Plan → (kit Cta buying-specialist.quote), with the conversation as the first action
// Metric: signup_start
// Signature: a sales desk where the greeting sits at display size over the live conversation, and Hanzo’s own dark quote card beside it re-prices seat by seat and takes the size you tell it
// Beyond: the quote card you can drag: its seats follow the slider and the annual and monthly rates re-price from Hanzo’s own seat prices, before you type a word
// V2: 8/10 MASTER scale: 52px greeting, the quote card with members at 64px and prices at 32px re-pricing once then resting; on the phone members and price ride under the greeting; promises as one ledger; no orb above the h1, no floating composer, kit Cta
import BuyingSpecialist from '../../components/pages/BuyingSpecialist';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'AI Buying Specialist — Hanzo AI',
  description: 'Find the right Hanzo plan for your team. Get instant pricing, seat calculations, custom quotes, and guidance from our AI buying specialist.',
};

export default function Page() {
  return <><JsonLd route="/buying-specialist" /><BuyingSpecialist /></>;
}
