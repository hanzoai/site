// Persona: a developer who contributes to Hanzo’s public repositories
// Goal: claim Pro time for a merged pull request
// CTA: Claim a merged pull request (kit Cta founder.hero → the claim form; Send the claim founder.claim)
// Metric: lead_submit
// Signature: the merge counter scrubbed by your scroll: the count goes 0, 1, 2, 3 merged and grows from 64 to 112px while Level 1 pours to a week of Pro and Level 2 to a month, the level cards lighting as each threshold is crossed
// Beyond: your level, worked out: the + and − on merged pull requests and lines merged drive the level, shown at full size, from Hanzo’s own thresholds
// V2: 8/10 MASTER scale: the hero pull request merges once and stays merged with an outline Merge; the count grows only while it is the moment (counts 0, 1, 3 once on the phone); the open bounties keep their room while GitHub answers; questions before the claim; kit Field and Cta; sent and refused in Hanzo’s own sentences
import Founder from '../../components/pages/Founder';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Founder Program — Hanzo AI',
  description: 'A merged pull request in a public Hanzo repository earns Pro time, granted by hand by a Hanzo admin.',
};

export default function Page() {
  return <><JsonLd route="/founder" /><Founder /></>;
}
