import type { Metadata } from 'next';
import Post from '../../../components/pages/post/Post';
import { notFound } from 'next/navigation';
import JsonLd from '../../../components/JsonLd';
import { SLUGS, post, meta } from '../../../components/pages/post/postData';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => SLUGS().map((slug) => ({ slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = meta(slug);
  return m ? { title: m.title, description: m.description } : {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!SLUGS().includes(slug)) notFound();
  return <><JsonLd route={'/blog/' + slug} /><Post doc={post(slug)} /></>;
}
