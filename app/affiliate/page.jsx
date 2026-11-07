// Signature: an address bar that writes the affiliate link by itself while an org rides down it to land under your name
// Beyond: the attribution check: pick a case and see who the org is attributed to, worked from Hanzo's own rule
import Affiliate from '../../components/pages/Affiliate';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Affiliates — Hanzo AI',
  description: 'Apply to refer customers to Hanzo. Every application is reviewed, and the terms are agreed with each affiliate approved.',
};

export default function Page() {
  return <><JsonLd route="/affiliate" /><Affiliate /></>;
}
