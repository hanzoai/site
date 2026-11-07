// Signature: Teams × Industries × Use cases as a three-way selector — point at any one and the preview becomes that solution, its model's film crossfading in; left alone it walks all seventeen
// Beyond: the preview lists each solution's actual jobs, so you can tell Finance from Financial services before you open either
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
