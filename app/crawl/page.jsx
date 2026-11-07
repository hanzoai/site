import Crawl from '../../components/pages/cloud/Crawl';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/crawl'].title, description: INDEX['/crawl'].description };

export default function Page() {
  return <><JsonLd route="/crawl" /><Crawl /></>;
}
