import Gui from '../../components/pages/apps/Gui';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/gui'].title, description: INDEX['/gui'].description };

export default function Page() {
  return <><JsonLd route="/gui" /><Gui /></>;
}
