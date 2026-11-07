// V2: 8/10 Catalogue: three-line kinetic headline beside a live film reel walking all seventeen; Teams, Industries and Use cases as huge words that re-flow a wall of model-film tiles, each opening into its page; reserved tier as the one dark room
// Signature: a wall of model-film tiles in rows of 6 + 3 + 3; press Teams, Industries or Use cases and the tiles leave and glide into the gap; a tile's film plays under the pointer and its name opens into the solution's page
// Beyond: each tile lists that solution's actual jobs, so you can tell Finance from Financial services before you open either
import JsonLd from '../../components/JsonLd';
import SolutionsIndex from '../../components/pages/solutions/SolutionsIndex';
import { indexDoc, allSolutions, metaOf } from '../../components/pages/solutions/solData';

const m = metaOf('/solutions') || {};
export const metadata = { title: m.title, description: m.description };

export default function Page() {
  const all = allSolutions();
  const data = Object.fromEntries(Object.values(all).map((s) => [s.slug, { film: s.film, steps: s.steps }]));
  return <><JsonLd route="/solutions" /><SolutionsIndex doc={indexDoc()} data={data} /></>;
}
