/* Server side: a customer story (/customers/<launch>) read from Hanzo's captured page: the header's figures, the
   platform report, the chapters with their own pictures, the gallery and the closing links. Nothing is added. */
import fs from 'node:fs';
import path from 'node:path';
import { load, find, findAll, textOf, tag, metaOf } from '../htmltree';
import type { Tree, Pic, Link, Chapter, StoryDoc, Sibling } from './types';

const ROOT = process.cwd();
const clean = (s: string | undefined) => (s || '').replace(/\s+/g, ' ').trim();
const ent = (s: string) => s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
export const SLUGS = () => Object.keys(JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'pages.json'), 'utf8')))
  .filter((p) => /^\/customers\/[^/]+$/.test(p)).map((p) => p.split('/')[2]);
// the tree reader is untyped: these give its results the tree's shape
const all = (n: Tree | undefined, f: (n: Tree) => unknown) => findAll(n, f) as Tree[];
const one = (n: Tree | undefined, f: (n: Tree) => unknown) => find(n, f) as Tree | undefined;
const hrefOf = (n: Tree | undefined) => n?.a?.href ?? '';
export const meta = (slug: string) => metaOf('/customers/' + slug);

export function story(slug: string): StoryDoc {
  const rel = 'customers/' + slug;
  const raw = fs.readFileSync(path.join(ROOT, 'content', 'pages', rel + '.html'), 'utf8');
  const root = load(rel) as Tree;
  // the tree keeps <img> but not its src/alt; the raw page lists the same images in the same order
  const pics: Pic[] = [...raw.matchAll(/<img\b([^>]*)>/g)].map((m) => ({ src: (/\ssrc="([^"]*)"/.exec(m[1]) || [])[1], alt: ent((/\salt="([^"]*)"/.exec(m[1]) || [, ''])[1]) }));
  const at = new Map(all(root, tag('img')).map((n, i): [Tree, Pic] => [n, pics[i]]));
  const img = (n: Tree | undefined) => { const i = n && one(n, tag('img')); return i ? at.get(i) : null; };
  const header = one(root, tag('header'));
  const back = one(header, tag('a'));
  const [line, lede, ...rest] = all(header, tag('p')).map((p) => clean(textOf(p)));
  const figures: StoryDoc['figures'] = [];
  for (let i = 0; i + 1 < rest.length; i += 2) figures.push({ value: rest[i], label: rest[i + 1] });
  const [year, kind] = line.split(' · ');
  const doc: StoryDoc = { slug, route: '/' + rel, back: { label: clean(textOf(back)), href: hrefOf(back) }, year, kind, name: clean(textOf(one(header, tag('h1')))), lede, cover: img(header), figures, report: null, how: null, gallery: null, links: [] };
  for (const s of all(root, tag('section'))) {
    const h2 = clean(textOf(one(s, tag('h2'))));
    const ol = one(s, tag('ol'));
    const imgs = all(s, tag('img')).map((n) => at.get(n) as Pic); // every <img> of the tree was paired with its raw twin above
    if (ol) doc.how = { h2, steps: ol.c.filter((li): li is Tree => typeof li !== 'string' && li.t === 'li').map((li): Chapter => { const [n, text] = all(li, tag('p')).map((p) => clean(textOf(p))); return { n, title: clean(textOf(one(li, tag('h3')))), text, img: img(li) }; }) };
    else if (!h2) doc.links = all(s, (n) => n.t === 'a' && n.a && n.a.href).map((a): Link => ({ label: clean(textOf(a)), href: hrefOf(a) }));
    else if (imgs.length === 1 && one(s, tag('p'))) doc.report = { h2, text: clean(textOf(one(s, tag('p')))), img: imgs[0] };
    else doc.gallery = { h2, imgs };
  }
  // where each headline figure is stated: a chapter, else the report, else the lede; if nowhere on the page, the case study PDF
  const pdf = doc.links.find((l) => /\.pdf$/.test(l.href));
  doc.figures.forEach((f) => {
    const i = doc.how ? doc.how.steps.findIndex((s) => s.text.includes(f.value)) : -1;
    f.from = i >= 0 ? { step: i } : doc.report && (doc.report.text.includes(f.value) || doc.report.img.alt.includes(f.value)) ? { report: true } : lede.includes(f.value) ? { lede: true } : pdf ? { pdf: pdf.href } : null;
  });
  return doc;
}

/* the next story, for the card that opens into it at the end of the page (its own name, picture and first figure) */
export function sibling(slug: string): Sibling | null {
  const all = SLUGS();
  const s = all[(all.indexOf(slug) + 1) % all.length];
  if (!s || s === slug) return null;
  const d = story(s);
  return { slug: s, href: d.route, name: d.name, year: d.year, kind: d.kind, cover: d.cover, figure: d.figures[0] || null };
}
