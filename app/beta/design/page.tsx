// Persona: a team that wants to build with Hanzo, not just use it
// Goal: apply for Design partner
// CTA: Continue, then Submit application (kit Cta beta.partner.next / beta.partner.submit)
// Metric: beta_submitted
// Signature: the Design partner pass fills in: every answer lands on a black pass as a line, and a tap on a line returns to that question
// Beyond: the application survives a reload in this browser, and nothing is ever sent to Hanzo's API
import { DesignPartner } from '../../../components/pages/BetaApply';
import JsonLd from '../../../components/JsonLd';

export const metadata = {
  title: 'Design partner — Hanzo AI',
  description: 'Build it with the team. Chosen from applications.',
};

export default function Page() {
  return <><JsonLd route="/beta/design" /><DesignPartner /></>;
}
