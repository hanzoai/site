import Ledger from '../../components/pages/apps/Ledger';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/ledger'].title, description: INDEX['/ledger'].description };

export default function Page() {
  return <><JsonLd route="/ledger" /><Ledger /></>;
}
