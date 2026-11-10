import Hsm from '../../components/pages/cloud/Hsm';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';
import { goImport } from '../../lib/modules';

export const metadata = { title: INDEX['/hsm'].title, description: INDEX['/hsm'].description, other: goImport('hsm') };

export default function Page() {
  return <><JsonLd route="/hsm" /><Hsm /></>;
}
