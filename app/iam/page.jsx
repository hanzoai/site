import Iam from '../../components/pages/cloud/Iam';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/iam'].title, description: INDEX['/iam'].description };

export default function Page() {
  return <><JsonLd route="/iam" /><Iam /></>;
}
