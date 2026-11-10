import Stream from '../../components/pages/cloud/Stream';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/stream'].title, description: INDEX['/stream'].description };

export default function Page() {
  return <><JsonLd route="/stream" /><Stream /></>;
}
