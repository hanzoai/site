import UniversityPortal from '../../../components/pages/UniversityPortal';
import JsonLd from '../../../components/JsonLd';
import INDEX from '../../../content/pages.json';

export const metadata = { title: INDEX['/university/portal'].title, description: INDEX['/university/portal'].description };

export default function Page() {
  return <><JsonLd route="/university/portal" /><UniversityPortal /></>;
}
