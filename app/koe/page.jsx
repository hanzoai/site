import ModelPage from '../../components/ModelPage';
import Creative from '../../components/pages/model/Creative';
import Koe from '../../components/pages/model/Koe';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: "Koe — Performance in every word. | Hanzo Creative AI", description: "Directable speech synthesis, character performances, dubbing and multilingual dialogue. Request research access and studio workflows." };

export default function Page() {
  return <><JsonLd route="/koe" /><ModelPage slug="koe"><Creative slug="koe"><Koe /></Creative></ModelPage></>;
}
