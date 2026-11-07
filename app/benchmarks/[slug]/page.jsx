import { notFound } from 'next/navigation';
import JsonLd from '../../../components/JsonLd';
import BenchRun from '../../../components/pages/bench/BenchRun';
import { MEMBERS, benchDoc, metaOf } from '../../../components/pages/bench/benchData';

export const dynamicParams = false;
export const generateStaticParams = () => MEMBERS().map((slug) => ({ slug }));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const m = metaOf('/benchmarks/' + slug);
  return m ? { title: m.title, description: m.description } : {};
}

export default async function Page({ params }) {
  const { slug } = await params;
  if (!MEMBERS().includes(slug)) notFound();
  return <><JsonLd route={'/benchmarks/' + slug} /><BenchRun doc={benchDoc(slug)} /></>;
}
