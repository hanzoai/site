import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JsonLd from '../../../components/JsonLd';
import Solution from '../../../components/pages/solutions/Solution';
import { SLUGS, solutionDoc, allSolutions, metaOf } from '../../../components/pages/solutions/solData';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => SLUGS().map((slug) => ({ slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = metaOf('/solutions/' + slug);
  return m ? { title: m.title, description: m.description } : {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!SLUGS().includes(slug)) notFound();
  const doc = solutionDoc(slug);
  const all = allSolutions();
  const near = Object.fromEntries((doc.more ? doc.more.links : []).map((l) => l.href.split('/').pop() ?? '').filter((s) => all[s]).map((s): [string, { products: string[] }] => [s, { products: all[s].products }]));
  return <><JsonLd route={'/solutions/' + slug} /><Solution doc={doc} data={near} /></>;
}
