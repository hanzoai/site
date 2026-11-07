import Versus from '../../../components/pages/compare/Ledger';
import { SLUGS, compareDoc, meta } from '../../../components/pages/compare/compareData';
import { notFound } from 'next/navigation';
import JsonLd from '../../../components/JsonLd';

export const dynamicParams = false;
export const generateStaticParams = () => SLUGS().map((slug) => ({ slug }));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const m = meta(slug);
  return m ? { title: m.title, description: m.description } : {};
}

export default async function Page({ params }) {
  const { slug } = await params;
  if (!SLUGS().includes(slug)) notFound();
  return <><JsonLd route={'/compare/' + slug} /><Versus doc={compareDoc(slug)} /></>;
}
