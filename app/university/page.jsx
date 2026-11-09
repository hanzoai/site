import University from '../../components/pages/University';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/university'].title, description: INDEX['/university'].description };

export default function Page() {
  return <><JsonLd route="/university" /><University /></>;
}
