import Metrics from '../../components/pages/cloud/Metrics';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/metrics'].title, description: INDEX['/metrics'].description };

export default function Page() {
  return <><JsonLd route="/metrics" /><Metrics /></>;
}
