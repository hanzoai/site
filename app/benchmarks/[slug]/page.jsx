import { notFound } from 'next/navigation';
import JsonLd from '../../../components/JsonLd';
import BenchRun from '../../../components/pages/bench/BenchRun';
import { MEMBERS, benchDoc, metaOf } from '../../../components/pages/bench/benchData';
import { accentAt } from '../../../components/v2/famAccent';

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
  const near = k < 0 ? [] : [[results[k - 1], 'Previous'], [results[k + 1], 'Next']].filter(([s]) => s).map(([s, w]) => ({ href: '/benchmarks/' + s, kicker: w, title: benchDoc(s).title, seed: 'bench/' + s }))
    .concat(k < 0 ? [] : [{ href: '/benchmarks', title: 'Benchmarks', seed: 'bench/board' }]);
  return <><JsonLd route={'/benchmarks/' + slug} /><BenchRun doc={doc} acc={accentAt(all.indexOf(slug))} near={near} /></>;
}
