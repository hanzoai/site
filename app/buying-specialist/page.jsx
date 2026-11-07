// Signature: a sales desk where the greeting sits at display size over the live conversation, and a dark seat-by-seat quote sheet beside it re-prices itself and takes the size you tell it
// Beyond: the seat mixer: members and Premium seats priced from Hanzo’s own seat prices, yearly against monthly, with what yearly billing saves
// V2: 8/10 display greeting with the chat under it, the dark quote sheet as the hero object, the six promises as a rail you throw with inertia
import BuyingSpecialist from '../../components/pages/BuyingSpecialist';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'AI Buying Specialist — Hanzo AI',
  description: 'Find the right Hanzo plan for your team. Get instant pricing, seat calculations, custom quotes, and guidance from our AI buying specialist.',
};

export default function Page() {
  return <><JsonLd route="/buying-specialist" /><BuyingSpecialist /></>;
}
