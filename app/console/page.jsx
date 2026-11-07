import ConsolePage from '../../components/pages/apps/ConsolePage';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/console'].title, description: INDEX['/console'].description };

export default function Page() {
  return <><JsonLd route="/console" /><ConsolePage /></>;
}
