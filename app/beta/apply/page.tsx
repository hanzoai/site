// Persona: a builder who wants Hanzo's new releases before they ship
// Goal: apply for Beta access
// CTA: Continue, then Submit application (kit Cta beta.beta.next / beta.beta.submit)
// Metric: beta_submitted
// Signature: the Beta access pass fills in: Enso's own film stands beside one question at a time, every answer lands on the pass as a line (its option letters and words) and the film gives up room for it; a tap on a line returns to that question
// Beyond: letter keys pick, Enter continues, Esc goes back; the application survives a reload in this browser, and nothing is ever sent to Hanzo's API (hanzo.ai's signed-out next step is shown instead)
import { BetaAccess } from '../../../components/pages/BetaApply';
import JsonLd from '../../../components/JsonLd';

export const metadata = {
  title: 'Beta access — Hanzo AI',
  description: 'New releases before they ship.',
};

export default function Page() {
  return <><JsonLd route="/beta/apply" /><BetaAccess /></>;
}
