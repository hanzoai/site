// Signature: the same record landing on three client screens at once — created, updated, deleted — with the delete reaching only clients whose rule can read it
// Beyond: rule switch — flip each client's access rule and replay the create, update and delete to see who hears about record b
import Realtime from '../../components/pages/cloud/Realtime';
import JsonLd from '../../components/JsonLd';
import INDEX from '../../content/pages.json';

export const metadata = { title: INDEX['/realtime'].title, description: INDEX['/realtime'].description };

export default function Page() {
  return <><JsonLd route="/realtime" /><Realtime /></>;
}
