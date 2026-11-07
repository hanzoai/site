import Story from '../../../components/pages/story/Story';
import { notFound } from 'next/navigation';
import JsonLd from '../../../components/JsonLd';
import { SLUGS, story, sibling, meta } from '../../../components/pages/story/storyData';

export const dynamicParams = false;
export const generateStaticParams = () => SLUGS().map((slug) => ({ slug }));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const m = meta(slug);
  return m ? { title: m.title, description: m.description } : {};
}

export default async function Page({ params }) {
  const { slug } = await params;
  if (!SLUGS().includes(slug)) notFound();
  return <><JsonLd route={'/customers/' + slug} /><Story doc={story(slug)} next={sibling(slug)} /></>;
}
