// Signature: an index of papers, specifications and standards filtered by kind or search, where the title page of the row under your pointer follows it as a tilting live preview
// Beyond: when it was published — the papers' own dates as one bar per month; press a month and the index narrows to what Hanzo published then
import Research from '../../components/pages/Research';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Work we publish — Hanzo AI',
  description: 'Hanzo builds infrastructure that has to hold up under audit, regulation and adversaries.',
};

export default function Page() {
  return <><JsonLd route="/research" /><Research /></>;
}
