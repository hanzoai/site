import Home from '../components/pages/Home';
import JsonLd from '../components/JsonLd';
import { SNAPSHOT } from '../components/home/snapshot';

export default function Page() {
  return <><JsonLd route="/" /><Home figures={SNAPSHOT} /></>;
}
