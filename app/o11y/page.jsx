import O11y from '../../components/pages/cloud/O11y';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/o11y'].title, description: INDEX['/o11y'].description };

export default function Page() {
  return <><JsonLd route="/o11y" /><O11y /></>;
}
