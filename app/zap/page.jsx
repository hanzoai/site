// Signature: pointer versus parser — a pointer jumps to a field in the buffer as it arrived while the JSON lane walks character by character
// Beyond: sidecars or one daemon — set how many agents you run and count the tool-server processes each topology starts
import Zap from '../../components/pages/apps/Zap';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/zap'].title, description: INDEX['/zap'].description };

export default function Page() {
  return <><JsonLd route="/zap" /><Zap /></>;
}
