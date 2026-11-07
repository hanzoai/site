import { notFound } from 'next/navigation';
import JsonLd from '../../../components/JsonLd';
import BenchRun from '../../../components/pages/bench/BenchRun';
import { MEMBERS, benchDoc, metaOf } from '../../../components/pages/bench/benchData';

export const dynamicParams = false;
export const generateStaticParams = () => MEMBERS().map((slug) => ({ slug }));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const m = metaOf('/benchmarks/' + slug);
  return m ? { title: m.title, description: m.description } : {};
}

export default async function Page({ params }) {
  const { slug } = await params;
  const all = MEMBERS();
  if (!all.includes(slug)) notFound();
  const doc = benchDoc(slug);
  // result pages carry no pager of their own: their neighbours among the result pages become the closing cards
  const results = all.filter((s) => benchDoc(s).kind === 'result');
  const k = results.indexOf(slug);
  const near = k < 0 ? [] : [[results[k - 1], 'prev'], [results[k + 1], 'next']].filter(([s]) => s).map(([s, w]) => ({ href: '/benchmarks/' + s, dir: w, title: benchDoc(s).title, seed: 'bench/' + s }))
    .concat(k < 0 ? [] : [{ href: '/benchmarks', title: 'Benchmarks', seed: 'bench/board' }]);
  // every member's own line and headline figure (Hanzo's words), for the sibling cards' hover preview and contour
  const T = (n) => (n && typeof n === 'object' ? n.c.map(T).join('') : n || '');
  const peek = Object.fromEntries(all.map((s) => {
    const d = benchDoc(s);
    const fig = d.latest[0] ? d.latest[0].parts[0] : '';
    return [s, { lede: T(d.lede).replace(/\s+/g, ' ').trim(), figure: fig, data: d.figures.map((f) => parseFloat(String(f).replace(/,/g, ''))).filter(Number.isFinite).slice(0, 5) }];
  }));
  return <><JsonLd route={'/benchmarks/' + slug} /><BenchRun doc={doc} near={near} peek={peek} /></>;
}
