import { notFound } from 'next/navigation';
import ProductPage from '../../../components/pages/ProductPage';
import JsonLd from '../../../components/JsonLd';
import { SLUGS, product } from '../../../components/pages/productsData';
import { metaOf } from '../../../components/pages/htmltree';

export const dynamicParams = false;
const opsOf = (q) => ((q.api && q.api.table.c.find((k) => k.t === 'tbody')) || { c: [] }).c.length;
export const generateStaticParams = () => SLUGS.map((slug) => ({ slug }));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const m = metaOf('/products/' + slug);
  return m ? { title: m.title, description: m.description } : {};
}

export default async function Page({ params }) {
  const { slug } = await params;
  if (!SLUGS.includes(slug)) notFound();
  // each of the seven: its line and its operation count, read from its own captured page
  const peek = Object.fromEntries(SLUGS.map((s) => { const q = product(s); return [s, { lede: q.lede, ops: opsOf(q) }]; }));
  return <><JsonLd route={'/products/' + slug} /><ProductPage p={product(slug)} peek={peek} /></>;
}
