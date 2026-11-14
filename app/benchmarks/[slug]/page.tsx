import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JsonLd from '../../../components/JsonLd';
import BenchRun from '../../../components/pages/bench/BenchRun';
import type { Card } from '../../../components/pages/bench/types';
import { MEMBERS, benchDoc, metaOf, figureOf } from '../../../components/pages/bench/benchData';

// A lede is plain text or a tree of it.
type Text = string | { c: Text[] } | null | undefined;

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => MEMBERS().map((slug) => ({ slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = metaOf('/benchmarks/' + slug);
  return m ? { title: m.title, description: m.description } : {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const all = MEMBERS();
  if (!all.includes(slug)) notFound();
  const doc = benchDoc(slug);
  // result pages carry no pager of their own: their neighbours among the result pages become the closing cards
  const results = all.filter((s) => benchDoc(s).kind === 'result');
  const k = results.indexOf(slug);
  // A closing card is the neighbouring result page, or the board itself (no direction).
  const near: Card[] = k < 0 ? [] : [[results[k - 1], 'prev'], [results[k + 1], 'next']].filter(([s]) => s).map(([s, w]): Card => ({ href: '/benchmarks/' + s, dir: w as 'prev' | 'next', title: benchDoc(s).title, seed: 'bench/' + s }))
    .concat(k < 0 ? [] : [{ href: '/benchmarks', title: 'Benchmarks', seed: 'bench/board' }]);
  // every member's own line and headline figure (Hanzo's words), for the sibling cards' hover preview and contour
  const T = (n: Text): string => (n && typeof n === 'object' ? n.c.map(T).join('') : n || '');
  const peek = Object.fromEntries(all.map((s) => {
    const d = benchDoc(s);
    const fig = figureOf(d);
    return [s, { lede: T(d.lede).replace(/\s+/g, ' ').trim(), figure: fig, data: d.figures.map((f: unknown) => parseFloat(String(f).replace(/,/g, ''))).filter(Number.isFinite).slice(0, 5) }];
  }));
  return <><JsonLd route={'/benchmarks/' + slug} /><BenchRun doc={doc} near={near} peek={peek} /></>;
}
