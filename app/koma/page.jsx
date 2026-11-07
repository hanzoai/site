import ModelPage from '../../components/ModelPage';
import Creative from '../../components/pages/model/Creative';
import Koma from '../../components/pages/model/Koma';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: "Koma — Every frame tells a story. | Hanzo Creative AI", description: "Cinematic video generation, character continuity, motion, animation, and shot-level creative control. Request research access and studio workflows." };

export default function Page() {
  return <><JsonLd route="/koma" /><ModelPage slug="koma"><Creative slug="koma"><Koma /></Creative></ModelPage></>;
}
