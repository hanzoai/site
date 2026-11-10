import Edge from '../../components/pages/cloud/Edge';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/edge'].title, description: INDEX['/edge'].description };

export default function Page() {
  return <><JsonLd route="/edge" /><Edge /></>;
}
