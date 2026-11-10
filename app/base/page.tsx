import Base from '../../components/pages/cloud/Base';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';
import { goImport } from '../../lib/modules';

export const metadata = { title: INDEX['/base'].title, description: INDEX['/base'].description, other: goImport('base') };

export default function Page() {
  return <><JsonLd route="/base" /><Base /></>;
}
