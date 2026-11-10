import fs from 'node:fs';
import path from 'node:path';
import { notFound } from 'next/navigation';
import JsonLd from '../../../components/JsonLd';
import Ported from '../../../components/Ported';
import ProviderShelf from '../../../components/pages/models/ProviderShelf';
import { PROVIDERS, providerDoc, metaOf } from '../../../components/pages/models/modelsData';
import NoScript from '../../../components/pages/models/NoScript';

export const dynamicParams = false;
export const generateStaticParams = () => PROVIDERS().map((slug) => ({ slug }));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const m = metaOf('/models/' + decodeURIComponent(slug));
  return m ? { title: m.title, description: m.description } : {};
}

export default async function Page({ params }) {
  const slug = decodeURIComponent((await params).slug);
  if (!PROVIDERS().includes(slug)) notFound();
  const route = '/models/' + slug;
  const ld = <JsonLd route={route} />;
  // shortcut: /models/enso is Enso's research report, not a maker's shelf; drawn as captured until it gets its own room
  if (slug === 'enso') return <>{ld}<main className="x-ported"><Ported html={fs.readFileSync(path.join(process.cwd(), 'content', 'pages', 'models', 'enso.html'), 'utf8')} /></main></>;
  return <>{ld}<NoScript /><ProviderShelf doc={providerDoc(slug)} /></>;
}
