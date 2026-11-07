import ModelPage from '../../components/ModelPage';
import Creative from '../../components/pages/model/Creative';
import Oto from '../../components/pages/model/Oto';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: "Oto — Give every moment its sound. | Hanzo Creative AI", description: "Film Foley, immersive sound effects, environmental audio and synchronized scene sound. Request research access and studio workflows." };

export default function Page() {
  return <><JsonLd route="/oto" /><ModelPage slug="oto"><Creative slug="oto"><Oto /></Creative></ModelPage></>;
}
