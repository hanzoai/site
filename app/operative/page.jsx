// Signature: the container comes apart: six slabs pressed into one box explode upward, then each layer lifts out and opens as you scroll (components/pages/Operative.jsx)
// Beyond: pick the provider and only the one environment variable in the command changes; the container stays the same
import Operative from '../../components/pages/Operative';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/operative'].title, description: INDEX['/operative'].description };

export default function Page() {
  return <><JsonLd route="/operative" /><Operative /></>;
}
