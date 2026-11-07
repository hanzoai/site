import Idv from '../../components/pages/cloud/Idv';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/idv'].title, description: INDEX['/idv'].description };

export default function Page() {
  return <><JsonLd route="/idv" /><Idv /></>;
}
