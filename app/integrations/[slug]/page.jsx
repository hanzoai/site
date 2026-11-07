import { notFound } from 'next/navigation';
import JsonLd from '../../../components/JsonLd';
import Guide from '../../../components/pages/integrations/Guide';
import { SLUGS, guideDoc, indexDoc, metaOf } from '../../../components/pages/integrations/intData';

export const dynamicParams = false;
export const generateStaticParams = () => SLUGS().map((slug) => ({ slug }));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const m = metaOf('/integrations/' + slug);
  return m ? { title: m.title, description: m.description } : {};
}

export default async function Page({ params }) {
  const { slug } = await params;
  if (!SLUGS().includes(slug)) notFound();
  const emojis = Object.fromEntries(indexDoc().groups.flatMap((g) => g.cards).map((c) => [c.slug, c.emoji]));
  return <><JsonLd route={'/integrations/' + slug} /><Guide doc={guideDoc(slug)} emojis={emojis} /></>;
}
