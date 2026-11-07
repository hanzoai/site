import Insights from '../../components/pages/cloud/Insights';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/insights'].title, description: INDEX['/insights'].description };

export default function Page() {
  return <><JsonLd route="/insights" /><Insights /></>;
}
