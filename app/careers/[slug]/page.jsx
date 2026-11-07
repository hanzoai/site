import { notFound } from 'next/navigation';
import CareerRole from '../../../components/pages/CareerRole';
import JsonLd from '../../../components/JsonLd';
import { SLUGS, role, peers, deckNo } from '../../../components/pages/careersData';
import { metaOf } from '../../../components/pages/htmltree';

export const dynamicParams = false;
export const generateStaticParams = () => SLUGS.map((slug) => ({ slug }));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const m = metaOf('/careers/' + slug);
  return m ? { title: m.title, description: m.description } : {};
}

export default async function Page({ params }) {
  const { slug } = await params;
  if (!SLUGS.includes(slug)) notFound();
  return <><JsonLd route={'/careers/' + slug} /><CareerRole role={role(slug)} no={deckNo(slug)} peers={((all) => { const k = all.findIndex((r) => r.slug === slug); return [...all.slice(k + 1), ...all.slice(0, k)]; })(peers())} /></>;
}
