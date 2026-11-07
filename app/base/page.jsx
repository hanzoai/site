import Base from '../../components/pages/cloud/Base';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/base'].title, description: INDEX['/base'].description };

export default function Page() {
  return <><JsonLd route="/base" /><Base /></>;
}
