// Signature: the product's own console, built from its own endpoint, features and family, plays itself, then stays pinned while its facts drive it
// Beyond: Google Cloud to Hanzo in one lookup, from the 18 product pages that name their Google Cloud counterpart
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JsonLd from '../../../components/JsonLd';
import CloudProduct from '../../../components/pages/cloudfam/CloudProduct';
import { MEMBERS, cloudDoc, googlePairs, metaOf, groupOf, sigilOf, relatedSigils, previewsOf } from '../../../components/pages/cloudfam/cloudData';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => MEMBERS().map((slug) => ({ slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = metaOf('/cloud/' + slug);
  return m ? { title: m.title, description: m.description } : {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!MEMBERS().includes(slug)) notFound();
  return <><JsonLd route={'/cloud/' + slug} /><CloudProduct doc={cloudDoc(slug)} pairs={googlePairs()} group={groupOf(cloudDoc(slug))} sigil={sigilOf(slug)} cards={relatedSigils(cloudDoc(slug))} previews={previewsOf(cloudDoc(slug))} /></>;
}
