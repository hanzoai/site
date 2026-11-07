// V2: 8/10 Apple-grade launch in forest green: the film lands full-bleed and settles into a cube seen from above whose near edges draw in; four pinned capability chapters, then the turning point-cloud viewport as the one dark room, a tile grid of where it fits, the studio map and the preview
// Signature: a point cloud that turns — points settle onto a surface, SDF to mesh, then the shape turns and carries your throw in wireframe, shaded or normals; the film settles into a cube whose near edges draw in
// Beyond: the studio map for space — every creative model serving spatial computing, games and architecture beside Mori, in its own words, each tile opening its model
import Mori from '../../components/pages/model/Mori';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: "Mori — Build worlds, not just images. | Hanzo Creative AI", description: "3D assets, geometry, materials, environments and spatially consistent scenes. Request research access and studio workflows." };

export default function Page() {
  return <><JsonLd route="/mori" /><Mori /></>;
}
