import Dashboards from '../../components/pages/cloud/Dashboards';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';
import { goImport } from '../../lib/modules';

export const metadata = { title: INDEX['/dashboards'].title, description: INDEX['/dashboards'].description, other: goImport('dashboards') };

export default function Page() {
  return <><JsonLd route="/dashboards" /><Dashboards /></>;
}
