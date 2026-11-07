// Signature: the four steps of a grant sit round a dial a hand sweeps, like the weekly review, the step it points at opening
// Beyond: your application as Hanzo files it: a filing card beside the form shows the track, role and every field sent
import Grants from '../../components/pages/Grants';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Open Source & Research Credit Grants — Hanzo AI',
  description: 'Free API credits, GPU compute, and Hanzo Team access for open-source contributors, academic PhD researchers, and research interns.',
};

export default function Page() {
  return <><JsonLd route="/grants" /><Grants /></>;
}
