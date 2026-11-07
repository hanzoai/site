// Signature: a pull request merges on screen by itself and the Pro time it earns pours into a bar, a week then a month
// Beyond: your level, worked out: count merged pull requests and lines merged against Hanzo's own thresholds
import Founder from '../../components/pages/Founder';
import JsonLd from '../../components/JsonLd';

export const metadata = {
  title: 'Founder Program — Hanzo AI',
  description: 'A merged pull request in a public Hanzo repository earns Pro time, granted by hand by a Hanzo admin.',
};

export default function Page() {
  return <><JsonLd route="/founder" /><Founder /></>;
}
