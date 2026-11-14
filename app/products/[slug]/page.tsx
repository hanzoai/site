import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductPage from '../../../components/pages/ProductPage';
import JsonLd from '../../../components/JsonLd';
import { SLUGS, product } from '../../../components/pages/productsData';
import { metaOf } from '../../../components/pages/htmltree';
import type { Product } from '../../../components/pages/ProductsTypes';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
// the rows of a captured product page's API table count its operations
const opsOf = (q: Product) => { const body = q.api.table.c.find((k) => typeof k !== 'string' && k.t === 'tbody'); return typeof body === 'object' ? body.c.length : 0; };
export const generateStaticParams = () => SLUGS.map((slug) => ({ slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = metaOf('/products/' + slug);
  return m ? { title: m.title, description: m.description } : {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!SLUGS.includes(slug)) notFound();
  // each of the seven: its line and its operation count, read from its own captured page
  const peek = Object.fromEntries(SLUGS.map((s) => { const q = product(s); return [s, { lede: q.lede, ops: opsOf(q) }]; }));
  return <><JsonLd route={'/products/' + slug} /><ProductPage key={slug} p={product(slug)} peek={peek} /></>;
}
