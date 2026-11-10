import Kms from '../../components/pages/cloud/Kms';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/kms'].title, description: INDEX['/kms'].description };

export default function Page() {
  return <><JsonLd route="/kms" /><Kms /></>;
}
