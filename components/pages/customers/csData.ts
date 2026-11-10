/* Server side: the customer stories (/customers/<case>) and the launches index, read from Hanzo's captured pages. */
import fs from 'node:fs';
import path from 'node:path';
import { load, find, findAll, textOf, tag, isN } from '../htmltree';

const ROOT = process.cwd();
let IDX;
const idx = () => (IDX ||= JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'pages.json'), 'utf8')));
export const metaOf = (route) => idx()[route];
export const SLUGS = () => Object.keys(idx()).filter((p) => /^\/customers\/[^/]+$/.test(p)).map((p) => p.split('/')[2]);
const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
const raw = (rel) => fs.readFileSync(path.join(ROOT, 'content', 'pages', rel + '.html'), 'utf8');
const imgs = (rel) => [...raw(rel).matchAll(/<img([^>]*)>/g)].map((m) => ({ src: (/src="([^"]*)"/.exec(m[1]) || [])[1], alt: (/alt="([^"]*)"/.exec(m[1]) || [])[1] || '' })).map((i) => ({ ...i, alt: i.alt.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"') }));

export function caseDoc(slug) {
  const rel = 'customers/' + slug;
  const root = load(rel);
  const pics = imgs(rel);
  const header = find(root, tag('header'));
  const hp = findAll(header, tag('p')).map((p) => clean(textOf(p)));
  const back = find(header, tag('a'));
  // header paragraphs: the meta line, the lede, then value/label pairs
  const [meta, lede, ...rest] = hp;
  const stats = [];
  for (let i = 0; i + 1 < rest.length; i += 2) stats.push([rest[i], rest[i + 1]]);
  const secs = findAll(root, tag('section')).map((s) => {
    const h2 = clean(textOf(find(s, tag('h2'))));
    const steps = findAll(s, tag('li')).map((li) => ({ n: clean(textOf(find(li, tag('p')))), title: clean(textOf(find(li, tag('h3')))), text: clean(textOf(findAll(li, tag('p'))[1] || '')) }));
    return { h2, text: clean(textOf(findAll(s, tag('p')).find((p) => !find(p, tag('a'))) || '')), steps, links: findAll(s, (n) => n.t === 'a' && n.a && n.a.href).map((a) => ({ label: clean(textOf(a)), href: a.a.href })) };
  });
  const used = new Set();
  const pic = (re) => { const p = pics.find((x) => !used.has(x.src) && re.test(x.src)); if (p) used.add(p.src); return p || null; };
  const cover = pics[0] ? (used.add(pics[0].src), pics[0]) : null;
  const report = secs.find((s) => !s.steps.length && /report/i.test(s.h2));
  const how = secs.find((s) => s.steps.length);
  if (report) report.img = pic(/platform|report/);
  if (how) how.steps.forEach((st) => { st.img = pics.filter((p) => !used.has(p.src))[0] || null; if (st.img) used.add(st.img.src); });
  const gallery = secs.find((s) => s !== report && s !== how && s.h2);
  if (gallery) gallery.imgs = pics.filter((p) => !used.has(p.src));
  const links = [...secs.filter((s) => !s.h2).flatMap((s) => s.links), ...findAll(root, (n) => n.t === 'a' && n.a && n.a.href && /\.pdf$|^\/customers$/.test(n.a.href) && n !== back).map((a) => ({ label: clean(textOf(a)), href: a.a.href }))]
    .filter((l, i, a) => a.findIndex((x) => x.href === l.href && x.label === l.label) === i);
  const [year, kind] = (meta || '').split(' · ');
  return { slug, route: '/' + rel, back: back ? { label: clean(textOf(back)), href: back.a.href } : null, year, kind, name: clean(textOf(find(header, tag('h1')))), lede, cover, stats, report, how, gallery, links };
}

export function indexDoc() {
  const root = load('customers');
  const secs = findAll(root, tag('section'));
  const h = secs[0];
  const cases = findAll(root, (n) => n.t === 'a' && n.a && /^\/customers\/[^/]+$/.test(n.a.href || '')).map((a) => {
    const s = findAll(a, (x) => x.a && x.a['data-slot'] === 'text').map((x) => clean(textOf(x)));
    return { href: a.a.href, slug: a.a.href.split('/').pop(), name: s[0], year: s[1], text: s[2] };
  });
  const launches = findAll(root, (n) => n.t === 'div' && n.a && n.a.id && find(n, tag('h3'))).map((d) => {
    const own = (pred) => { const out = []; const w = (n) => { if (!isN(n)) return; if (n !== d && n.a && n.a.id && find(n, tag('h3'))) return; if (pred(n)) out.push(n); n.c.forEach(w); }; w(d); return out; };
    const spans = own((n) => n.t === 'span' && n.a && n.a['data-slot'] === 'text').map((x) => clean(textOf(x)));
    const year = spans.find((x) => /^\d{4}$/.test(x)) || null;
    const words = spans.filter((x) => x !== year);
    const dts = own(tag('dt')).map((x) => clean(textOf(x))), dds = own(tag('dd')).map((x) => clean(textOf(x)));
    return { id: d.a.id, name: clean(textOf(own(tag('h3'))[0])), year, kind: words[0] || '', text: words[1] || '', figs: dts.map((t, i) => [t, dds[i] || '']) };
  });
  const backed = secs.find((s) => /Backed/.test(textOf(find(s, tag('h2')) || '')));
  const band = secs.find((s) => /Launch with us/.test(textOf(find(s, tag('h2')) || '')));
  const logos = imgs('customers').filter((i) => /logos\/partners/.test(i.src));
  const hrefs = backed ? findAll(backed, (n) => n.t === 'a' && n.a && n.a.href).map((a) => a.a.href) : [];
  return {
    label: clean(textOf(find(h, (n) => n.a && 'data-label' in n.a))) || 'Customers',
    title: clean(textOf(find(h, tag('h1')))), lede: clean(textOf(find(h, tag('p')))),
    casesTitle: clean(textOf(find(secs.find((s) => find(s, (n) => n.t === 'a' && n.a && /^\/customers\//.test(n.a.href || ''))) || { c: [] }, tag('h2')))),
    cases: cases.map((c) => ({ ...c, cover: (imgs('customers/' + c.slug)[0] || {}).src || null })),
    launchesTitle: clean(textOf(find(secs.find((s) => find(s, (n) => n.a && n.a.id && n.t === 'div')) || { c: [] }, tag('h2')))),
    launches,
    backed: backed ? { title: clean(textOf(find(backed, tag('h2')))), logos: logos.map((l, i) => ({ ...l, href: hrefs[i] || null })) } : null,
    band: band ? { title: clean(textOf(find(band, tag('h2')))), link: (() => { const a = find(band, (n) => n.t === 'a' && n.a && n.a.href); return a ? { label: clean(textOf(a)), href: a.a.href } : null; })() } : null,
  };
}
