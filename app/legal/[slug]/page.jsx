import { notFound } from 'next/navigation';
import LegalDoc from '../../../components/pages/LegalDoc';
import JsonLd from '../../../components/JsonLd';
import { SLUGS, legalDoc, pagesIndex } from '../../../components/pages/legalData';

export const dynamicParams = false;
export const generateStaticParams = () => SLUGS.map((slug) => ({ slug }));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const m = pagesIndex()['/legal/' + slug];
  return m ? { title: m.title, description: m.description } : {};
}

export default async function Page({ params }) {
  const { slug } = await params;
  if (!SLUGS.includes(slug)) notFound();
  return <><JsonLd route={'/legal/' + slug} /><LegalDoc doc={legalDoc(slug)} peek={Object.fromEntries(SLUGS.map((x) => [x, legalDoc(x).lede]))} /></>;
}
