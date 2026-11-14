// V2: 8/10 Catalogue on the Hanzo deck: three-line kinetic headline with its one ask beside a live film reel that walks all seventeen once after the curtain (pause control); Teams, Industries and Use cases as huge words with a gliding pill over a numbered wall of model films that re-flows and opens each tile into its page; the reserved tier as the one black room over a film
// Persona: a team lead or buyer in the Evaluate journey, looking for what Hanzo does for their team or industry
// Goal: find their solution and open it, then try Hanzo or talk to sales
// CTA: "Try Hanzo" (/signup) in the hero and the shared sticky ask bar (data-thumb), data-cta solutions.hero; metric signup_start
// Signature: a numbered wall of model-film tiles in rows of 6 + 3 + 3; press Teams, Industries or Use cases and a pill glides to it while the tiles leave and glide into the gap; a tile's film plays under the pointer and the tile opens into the solution's page
// Beyond: each tile lists that solution's actual jobs, so you can tell Finance from Financial services before you open either
// Deletes: the crimson accent, the kicker over the h1, the invented "All" chip, the group label on every tile, the endless reel loop, raw img/video, springs, data-morph (openTile instead)
import JsonLd from '../../components/JsonLd';
import SolutionsIndex from '../../components/pages/solutions/SolutionsIndex';
import { indexDoc, allSolutions, metaOf } from '../../components/pages/solutions/solData';

const m = metaOf('/solutions');
export const metadata = { title: m?.title, description: m?.description };

export default function Page() {
  const all = allSolutions();
  const data = Object.fromEntries(Object.values(all).map((s) => [s.slug, { film: s.film, steps: s.steps }]));
  return <><JsonLd route="/solutions" /><SolutionsIndex doc={indexDoc()} data={data} /></>;
}
