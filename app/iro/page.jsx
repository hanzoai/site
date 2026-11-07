import ModelPage from '../../components/ModelPage';
import Creative from '../../components/pages/model/Creative';
import Iro from '../../components/pages/model/Iro';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: "Iro — Imagine without limits. | Hanzo Creative AI", description: "High-fidelity image generation, creative direction, editing, character design and consistent visual assets. Request research access and studio workflows." };

export default function Page() {
  return <><JsonLd route="/iro" /><ModelPage slug="iro"><Creative slug="iro"><Iro /></Creative></ModelPage></>;
}
