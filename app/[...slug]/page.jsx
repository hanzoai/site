import fs from 'node:fs';
import path from 'node:path';
import { notFound } from 'next/navigation';
import Ported from '../../components/Ported';
import ModelPage from '../../components/ModelPage';
import JsonLd from '../../components/JsonLd';
import { bySlug } from '../../lib/models';

const DIR = path.join(process.cwd(), 'content', 'pages');
const INDEX = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content', 'pages.json'), 'utf8'));
// HZ_ONLY=enso,kai,/pricing builds a subset while developing; unset, every page is built
const ONLY = process.env.HZ_ONLY ? process.env.HZ_ONLY.split(',').map((p) => (p.startsWith('/') ? p : '/' + p)) : null;

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(INDEX)
    .filter((p) => !fs.existsSync(path.join(process.cwd(), 'app', p.slice(1), 'page.jsx'))) // a rebuilt page lives in its own folder
    .filter((p) => !fs.existsSync(path.join(process.cwd(), 'app', p.slice(1).split('/')[0], '[slug]', 'page.jsx'))) // so does a family template
    .filter((p) => !ONLY || ONLY.some((o) => p === o || p.startsWith(o + '/')))
    .map((p) => ({ slug: p.slice(1).split('/') }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const meta = INDEX['/' + slug.join('/')];
  return meta ? { title: meta.title, description: meta.description } : {};
}

export default async function Page({ params }) {
  const { slug } = await params;
  const key = '/' + slug.join('/');
  if (!INDEX[key]) notFound();
  const html = fs.readFileSync(path.join(DIR, key.slice(1) + '.html'), 'utf8');
  const ld = <JsonLd route={key} />;
  if (slug.length === 1 && bySlug[slug[0]]) return <>{ld}<ModelPage slug={slug[0]} html={html} /></>;
  return <>{ld}<main className="x-ported"><Ported html={html} /></main></>;
}
