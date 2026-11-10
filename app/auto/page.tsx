import Auto from '../../components/pages/apps/Auto';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/auto'].title, description: INDEX['/auto'].description };

export default function Page() {
  return <><JsonLd route="/auto" /><Auto /></>;
}
