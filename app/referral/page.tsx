// Signature: one referral's journey: a pinned screen where one builder leaves the link and travels Referred → Pending → Qualified, one word big at a time
// Beyond: the four steps as one continuous strip under their sentences, drawn once; press a step to replay it
// V2: 8/10 one moment per section, no tiled marquee; the steps are one strip; the close ends on the card at rest; the dark room never crops on phones
import Referral from '../../components/pages/Referral';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Referrals, Social Bounties & Rewards Hub — Hanzo AI',
  description: 'Bring builders to Hanzo, complete easy social bounties across 14 networks, stack open GitHub bounties, and level up across 5 reward pillars and collectible badges.',
};

export default function Page() {
  return <><JsonLd route="/referral" /><Referral /></>;
}
