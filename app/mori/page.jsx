import ModelPage from '../../components/ModelPage';
import Creative from '../../components/pages/model/Creative';
import Mori from '../../components/pages/model/Mori';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: "Mori — Build worlds, not just images. | Hanzo Creative AI", description: "3D assets, geometry, materials, environments and spatially consistent scenes. Request research access and studio workflows." };

export default function Page() {
  return <><JsonLd route="/mori" /><ModelPage slug="mori"><Creative slug="mori"><Mori /></Creative></ModelPage></>;
}
