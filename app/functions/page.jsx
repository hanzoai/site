import Functions from '../../components/pages/cloud/Functions';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/functions'].title, description: INDEX['/functions'].description };

export default function Page() {
  return <><JsonLd route="/functions" /><Functions /></>;
}
