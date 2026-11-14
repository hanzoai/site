import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JsonLd from '../../../components/JsonLd';
import BlockPage from '../../../components/pages/blockchain/BlockPage';
import Directory from '../../../components/pages/blockchain/Directory';
import { SLUGS, productDoc, coverage, metaOf } from '../../../components/pages/blockchain/bcData';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => SLUGS().map((slug) => ({ slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = metaOf('/blockchain/' + slug);
  return m ? { title: m.title, description: m.description } : {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!SLUGS().includes(slug)) notFound();
  const doc = productDoc(slug);
  return <><JsonLd route={'/blockchain/' + slug} />{doc.kind === 'directory' ? <Directory doc={doc} all={coverage()} /> : <BlockPage doc={doc} all={coverage()} />}</>;
}
