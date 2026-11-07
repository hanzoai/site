// Signature: a sales desk where a seat-by-seat quote sheet beside the chat re-prices itself and takes the size you tell it
// Beyond: the seat mixer: members and Premium seats priced from Hanzo's own seat prices, yearly against monthly
import BuyingSpecialist from '../../components/pages/BuyingSpecialist';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'AI Buying Specialist — Hanzo AI',
  description: 'Find the right Hanzo plan for your team. Get instant pricing, seat calculations, custom quotes, and guidance from our AI buying specialist.',
};

export default function Page() {
  return <><JsonLd route="/buying-specialist" /><BuyingSpecialist /></>;
}
