import Telemetry from '../../components/pages/cloud/Telemetry';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/telemetry'].title, description: INDEX['/telemetry'].description };

export default function Page() {
  return <><JsonLd route="/telemetry" /><Telemetry /></>;
}
