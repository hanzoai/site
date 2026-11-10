import World from '../../components/pages/cloud/World';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/world'].title, description: INDEX['/world'].description };

export default function Page() {
  return <><JsonLd route="/world" /><World /></>;
}
