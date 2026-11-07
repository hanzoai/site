import { notFound } from 'next/navigation';
import JsonLd from '../../../components/JsonLd';
import OrgPage from '../../../components/pages/oss/OrgPage';
import { ORGS, orgDoc, metaOf } from '../../../components/pages/oss/ossData';

export const dynamicParams = false;
export const generateStaticParams = () => ORGS().map((slug) => ({ slug }));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const m = metaOf('/oss/' + slug);
  return m ? { title: m.title, description: m.description } : {};
}

export default async function Page({ params }) {
  const { slug } = await params;
  if (!ORGS().includes(slug)) notFound();
  return <><JsonLd route={'/oss/' + slug} /><OrgPage doc={orgDoc(slug)} /></>;
}
