import Jin from '../../components/pages/apps/Jin';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/jin'].title, description: INDEX['/jin'].description };

export default function Page() {
  return <><JsonLd route="/jin" /><Jin /></>;
}
