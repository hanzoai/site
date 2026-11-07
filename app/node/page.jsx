import Node from '../../components/pages/cloud/Node';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/node'].title, description: INDEX['/node'].description };

export default function Page() {
  return <><JsonLd route="/node" /><Node /></>;
}
