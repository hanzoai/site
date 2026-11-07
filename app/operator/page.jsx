// Signature: drift, reverted, said out loud — a live cluster board where a Kind drifts and the next sweep puts it back, the log saying created, reverted or already in sync
// Beyond: drift it yourself — drag a Kind out of place (or tap it on a phone) and the next sweep reverts it, with the log saying so
import Operator from '../../components/pages/Operator';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/operator'].title, description: INDEX['/operator'].description };

export default function Page() {
  return <><JsonLd route="/operator" /><Operator /></>;
}
