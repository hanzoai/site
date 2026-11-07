// Signature: a sales desk where the greeting sits at display size over the live conversation, and Hanzo’s own dark quote card beside it re-prices seat by seat and takes the size you tell it
// Beyond: the quote card you can drag: its seats follow the slider and the annual and monthly rates re-price from Hanzo’s own seat prices, before you type a word
// V2: 8/10 grey deck; Hanzo’s own quote card (its exact words) as the dark hero object, re-pricing by itself; the chat sends the same requests; the six promises as a rail you throw; one solid ask, sticky after the hero
import BuyingSpecialist from '../../components/pages/BuyingSpecialist';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'AI Buying Specialist — Hanzo AI',
  description: 'Find the right Hanzo plan for your team. Get instant pricing, seat calculations, custom quotes, and guidance from our AI buying specialist.',
};

export default function Page() {
  return <><JsonLd route="/buying-specialist" /><BuyingSpecialist /></>;
}
