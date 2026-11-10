// Persona: a researcher who wants Hanzo's research models and checkpoints before release
// Goal: apply for Research access
// CTA: Continue, then Submit application (kit Cta beta.research.next / beta.research.submit)
// Metric: beta_submitted
// Signature: the Research access pass fills in: Zen's own film stands beside one question at a time, every answer lands on the pass as a line and the film gives up room for it, so the evaluation plan reads back as you write it; a tap on a line returns to that question
// Beyond: long answers (what you will evaluate, your research goals) keep Shift+Enter for new lines while Enter moves on; the application survives a reload in this browser, and nothing is ever sent to Hanzo's API
import { ResearchAccess } from '../../../components/pages/BetaApply';
import JsonLd from '../../../components/JsonLd';

export const metadata = {
  title: 'Research access — Hanzo AI',
  description: 'Research models and checkpoints to evaluate before release.',
};

export default function Page() {
  return <><JsonLd route="/beta/research" /><ResearchAccess /></>;
}
