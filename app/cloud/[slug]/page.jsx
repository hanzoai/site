import { notFound } from 'next/navigation';
import JsonLd from '../../../components/JsonLd';
import CloudProduct from '../../../components/pages/cloudfam/CloudProduct';
import { MEMBERS, cloudDoc, googlePairs, metaOf } from '../../../components/pages/cloudfam/cloudData';

export const dynamicParams = false;
export const generateStaticParams = () => MEMBERS().map((slug) => ({ slug }));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const m = metaOf('/cloud/' + slug);
  return m ? { title: m.title, description: m.description } : {};
}

export default async function Page({ params }) {
  const { slug } = await params;
  if (!MEMBERS().includes(slug)) notFound();
  return <><JsonLd route={'/cloud/' + slug} /><CloudProduct doc={cloudDoc(slug)} pairs={googlePairs()} /></>;
}
