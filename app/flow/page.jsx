import Flow from '../../components/pages/apps/Flow';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/flow'].title, description: INDEX['/flow'].description };

export default function Page() {
  return <><JsonLd route="/flow" /><Flow /></>;
}
