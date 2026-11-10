import Iam from '../../components/pages/cloud/Iam';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';
import { goImport } from '../../lib/modules';

export const metadata = { title: INDEX['/iam'].title, description: INDEX['/iam'].description, other: goImport('iam') };

export default function Page() {
  return <><JsonLd route="/iam" /><Iam /></>;
}
