import JsonLd from '../../components/JsonLd';
import IntegrationsIndex from '../../components/pages/integrations/IntegrationsIndex';
import { indexDoc, metaOf } from '../../components/pages/integrations/intData';

const m = metaOf('/integrations') || {};
export const metadata = { title: m.title, description: m.description };

export default function Page() {
  return <><JsonLd route="/integrations" /><IntegrationsIndex doc={indexDoc()} /></>;
}
