// V2: Apple-grade launch in Hanzo's own black and white: the film lands full-bleed and settles into a cube seen from above whose near edges draw in; the turning point-cloud viewport as the one dark room (it grows out of and shrinks back into a card), the capabilities on a snapping side carousel, where it fits (pixel-resolve), the studio map (dealt), Hanzo's exact model cards (names decode) and a closing band
// Persona: Creative studio (researcher audience)
// Goal: request research access
// CTA: Request access (/research-access?models=mori, data-thumb)
// Metric: contact_sales_submit
// Signature: a point cloud that turns — points settle onto a surface, SDF to mesh, then the shape turns and carries your throw in wireframe, shaded or normals; the film settles into a cube whose near edges draw in
// Beyond: the studio map for space — every creative model serving spatial computing, games and architecture beside Mori, in its own words, each tile opening its model
import Mori from '../../components/pages/model/Mori';
import JsonLd from '../../components/JsonLd';

export const metadata = { title: "Mori — Build worlds, not just images. | Hanzo Creative AI", description: "3D assets, geometry, materials, environments and spatially consistent scenes. Request research access and studio workflows." };

export default function Page() {
  return <><JsonLd route="/mori" /><Mori /></>;
}
