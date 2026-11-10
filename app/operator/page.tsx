// Signature: a card stack of Operator's six points — flick or drag the top card away (swipe on touch), one idea per card, the next rising from beneath
// Beyond: the hero cluster board — drag a Kind out of place (or tap it on a phone) and the next sweep reverts it, with the log saying created, reverted or already in sync
import Operator from '../../components/pages/Operator';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/operator'].title, description: INDEX['/operator'].description };

export default function Page() {
  return <><JsonLd route="/operator" /><Operator /></>;
}
