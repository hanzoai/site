import { notFound } from 'next/navigation';
import LegalDoc from '../../../components/pages/LegalDoc';
import JsonLd from '../../../components/JsonLd';
import { SLUGS, legalDoc, pagesIndex } from '../../../components/pages/legalData';
import { accentAt } from '../../../components/v2/famAccent';

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
  return <><JsonLd route={'/legal/' + slug} /><LegalDoc doc={legalDoc(slug)} acc={accentAt(SLUGS.indexOf(slug) + 3)} /></>;
}
