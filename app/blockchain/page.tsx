import JsonLd from '../../components/JsonLd';
import BlockchainIndex from '../../components/pages/blockchain/BlockchainIndex';
import { overviewDoc, coverage, metaOf } from '../../components/pages/blockchain/bcData';

const m = metaOf('/blockchain') || {};
export const metadata = { title: m.title, description: m.description };

export default function Page() {
  return <><JsonLd route="/blockchain" /><BlockchainIndex doc={overviewDoc()} all={coverage()} /></>;
}
