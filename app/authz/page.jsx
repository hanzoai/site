import Authz from '../../components/pages/cloud/Authz';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';
import { goImport } from '../../lib/modules';

export const metadata = { title: INDEX['/authz'].title, description: INDEX['/authz'].description, other: goImport('authz') };

export default function Page() {
  return <><JsonLd route="/authz" /><Authz /></>;
}
