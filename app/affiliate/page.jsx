// Persona: a partner who refers organizations to Hanzo
// Goal: apply to become an affiliate
// CTA: Apply (mailto hello@hanzo.ai, subject Affiliate application)
// Metric: contact_click
// Signature: sticky chapters: Hanzo’s four affiliate step sentences pin on the left while one object turns from the apply request into the reply, the code and link, and an org landing on the link
// Beyond: the rule, drawn: first touch, one affiliate per org, never your own, each a small self-playing diagram with no words but Hanzo’s
// V2: 8/10 the affiliate link itself is the one big thing (64px mono, written once), steps in Hanzo’s own sentences, the three rules drawn in the dark room; MASTER scale, greys, kit Cta
import Affiliate from '../../components/pages/Affiliate';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Affiliates — Hanzo AI',
  description: 'Apply to refer customers to Hanzo. Every application is reviewed, and the terms are agreed with each affiliate approved.',
};

export default function Page() {
  return <><JsonLd route="/affiliate" /><Affiliate /></>;
}
