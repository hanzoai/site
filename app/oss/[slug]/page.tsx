import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import OrgPage from '../../../components/pages/oss/OrgPage';
import JsonLd from '../../../components/JsonLd';
import { ORGS, orgDoc, metaOf } from '../../../components/pages/oss/ossData';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => ORGS().map((slug) => ({ slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = metaOf('/oss/' + slug);
  return m ? { title: m.title, description: m.description } : {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!ORGS().includes(slug)) notFound();
  return <><JsonLd route={'/oss/' + slug} /><OrgPage doc={orgDoc(slug)} /></>;
}
