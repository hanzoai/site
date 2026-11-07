import { notFound } from 'next/navigation';
import JsonLd from '../../../../components/JsonLd';
import ModelSheet from '../../../../components/pages/models/ModelSheet';
import NoScript from '../../../../components/pages/models/NoScript';
import { MODEL_PARAMS, modelDoc, metaOf, exists } from '../../../../components/pages/models/modelsData';

export const dynamicParams = false;
export const generateStaticParams = () => MODEL_PARAMS();

const routeOf = async (params) => { const p = await params; return '/models/' + decodeURIComponent(p.slug) + '/' + decodeURIComponent(p.model); };

export async function generateMetadata({ params }) {
  const m = metaOf(await routeOf(params));
  return m ? { title: m.title, description: m.description } : {};
}

export default async function Page({ params }) {
  const route = await routeOf(params);
  if (!exists(route)) notFound();
  const [, , slug, model] = route.split('/');
  return <><JsonLd route={route} /><NoScript /><ModelSheet doc={modelDoc(slug, model)} /></>;
}
