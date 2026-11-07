// Signature: the product's own console on stage, settling flat as you scroll while its session types and plays itself
// Beyond: Google Cloud to Hanzo in one lookup, from the 18 product pages that name their Google Cloud counterpart
import { notFound } from 'next/navigation';
import JsonLd from '../../../components/JsonLd';
import CloudProduct from '../../../components/pages/cloudfam/CloudProduct';
import { MEMBERS, cloudDoc, googlePairs, metaOf, accentOf, sigilOf, relatedSigils } from '../../../components/pages/cloudfam/cloudData';

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
  return <><JsonLd route={'/cloud/' + slug} /><CloudProduct doc={cloudDoc(slug)} pairs={googlePairs()} tone={accentOf(slug)} sigil={sigilOf(slug)} cards={relatedSigils(cloudDoc(slug))} /></>;
}
