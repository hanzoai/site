// Signature: live-chat: pick an objective and Operative answers on screen while the hero desktop acts it out (components/pages/Operative.jsx)
// Beyond: pick the provider and only the one environment variable in the command changes; the container stays the same
import Operative from '../../components/pages/Operative';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/operative'].title, description: INDEX['/operative'].description };

export default function Page() {
  return <><JsonLd route="/operative" /><Operative /></>;
}
