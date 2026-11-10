import Search from '../../components/pages/cloud/Search';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/search'].title, description: INDEX['/search'].description };

export default function Page() {
  return <><JsonLd route="/search" /><Search /></>;
}
