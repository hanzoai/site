/* Server side: the /blockchain family (15 product pages, the exchange, the chain directory and the overview) read from
   Hanzo's captured pages. Each page is flattened into its words in reading order, then grouped by heading. */
import fs from 'node:fs';
import path from 'node:path';
import { load, find, findAll, textOf, tag, isN } from '../htmltree';
import { codeOf } from '../models/modelsData';

const ROOT = process.cwd();
let IDX;
const idx = () => (IDX ||= JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'pages.json'), 'utf8')));
export const metaOf = (route) => idx()[route];
export const SLUGS = () => Object.keys(idx()).filter((p) => /^\/blockchain\/[^/]+$/.test(p)).map((p) => p.split('/')[2]);
const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
const raw = (rel) => fs.readFileSync(path.join(ROOT, 'content', 'pages', rel + '.html'), 'utf8');

function sections(root) {
  const out = [];
  const walk = (n) => { if (!isN(n)) return; if (n.t === 'section') { out.push(n); return; } n.c.forEach(walk); };
  walk(root);
  return out;
}
const slotted = (n) => n.c.some((k) => isN(k) && ((k.a && k.a['data-slot']) || slotted(k)));
/* a section's words in reading order: headings, paragraphs, items, links, buttons, chips, code */
function flow(sec) {
  const out = [];
  const walk = (n) => {
    if (!isN(n)) return;
    const s = n.a && n.a['data-slot'];
    if (n.t === 'pre') { out.push({ k: 'pre', code: codeOf(n) }); return; }
    if (n.t === 'h1' || n.t === 'h2' || n.t === 'h3') { out.push({ k: n.t, text: clean(textOf(n)), parts: n.c.map((c) => clean(textOf(c))).filter(Boolean) }); return; }
    if (n.t === 'a' && n.a && n.a.href) { out.push({ k: 'a', text: clean(textOf(n)), href: n.a.href, slot: s, parts: findAll(n, (x) => x.a && x.a['data-slot'] === 'text').map((x) => clean(textOf(x))) }); return; }
    if (n.t === 'button') { out.push({ k: 'button', text: clean(textOf(n)), slot: s, parts: findAll(n, (x) => x.t === 'h3' || x.t === 'p').map((x) => clean(textOf(x))) }); return; }
    if (n.t === 'p') { out.push({ k: 'p', text: clean(textOf(n)), slot: s }); return; }
    if (n.t === 'li') { out.push({ k: 'li', text: clean(textOf(n)) }); return; }
    if (s === 'chip') { out.push({ k: 'chip', text: clean(textOf(n)), parts: findAll(n, (x) => x.a && x.a['data-slot'] === 'text').map((x) => clean(textOf(x))) }); return; }
    if (n.t === 'span' && s === 'text' && !slotted(n)) { const t = clean(textOf(n)); if (t) out.push({ k: 'span', text: t }); return; }
    n.c.forEach(walk);
  };
  walk(sec);
  return out;
}
/* h3 + its sentence + its bullets + its link, as items */
const items = (f) => {
  const out = [];
  f.forEach((x) => {
    if (x.k === 'h3') out.push({ title: x.text, text: '', bullets: [], link: null });
    else if (out.length && x.k === 'p' && !out[out.length - 1].text) out[out.length - 1].text = x.text;
    else if (out.length && x.k === 'li') out[out.length - 1].bullets.push(x.text);
    else if (out.length && x.k === 'a') out[out.length - 1].link = { label: x.text, href: x.href };
  });
  return out;
};
const head = (f) => { const h3 = f.findIndex((x) => x.k === 'h3'); const pre = h3 < 0 ? f : f.slice(0, h3); return { title: (f.find((x) => x.k === 'h2') || {}).text || '', lede: (pre.find((x) => x.k === 'p') || {}).text || '' }; };

export function productDoc(slug) {
  const rel = 'blockchain/' + slug;
  if (slug === 'directory') return directoryDoc();
  const secs = sections(load(rel)).map(flow);
  const doc = { slug, route: '/' + rel, kind: 'product', blocks: [] };
  secs.forEach((f, i) => {
    const h2 = (f.find((x) => x.k === 'h2') || {}).text || '';
    if (i === 0) {
      const cut = f.findIndex((x) => x.k === 'h2');
      const top = cut < 0 ? f : f.slice(0, cut), key = cut < 0 ? [] : f.slice(cut);
      const h1 = top.find((x) => x.k === 'h1');
      const ps = top.filter((x) => x.k === 'p');
      doc.hero = {
        chip: (top.find((x) => x.k === 'chip') || top.find((x) => x.k === 'span' && top.indexOf(x) < top.indexOf(h1)) || {}).text || '',
        title: h1 ? h1.text : '', claim: (ps.find((p) => p.slot === 'claim') || ps[0] || {}).text || '',
        lede: (ps.find((p) => p.slot === 'lede') || ps[1] || {}).text || '',
        features: items(top), back: top.find((x) => x.k === 'a' && x.slot === 'more') || null,
        actions: top.filter((x) => x.k === 'a' && x.slot === 'action').map((a) => ({ label: a.text, href: a.href })),
      };
      if (key.length) {
        const sp = key.filter((x) => x.k === 'span');
        const tIdx = key.findIndex((x) => x.k === 'p' && /^Trusted/.test(x.text));
        doc.key = {
          title: key[0].text, sub: (key.find((x) => x.k === 'p') || {}).text || '',
          stats: sp.reduce((a, s, k) => (k % 2 ? (a[a.length - 1].push(s.text), a) : [...a, [s.text]]), []),
          actions: key.filter((x) => x.k === 'button' || (x.k === 'a' && x.slot === 'action')).map((b) => b.text),
          note: (key.find((x) => x.k === 'p' && /credit card/i.test(x.text)) || {}).text || '',
          trusted: tIdx >= 0 ? { label: key[tIdx].text, tags: key.slice(tIdx + 1).filter((x) => x.k === 'chip').map((x) => x.text) } : null,
        };
      }
      return;
    }
    const pre = f.find((x) => x.k === 'pre');
    if (pre) {
      const langs = f.filter((x) => x.k === 'button' && x.slot === 'more').map((b) => b.text);
      const file = f.filter((x) => x.k === 'span' && /\.\w{1,4}$/.test(x.text)).map((x) => x.text)[0] || null;
      doc.blocks.push({ kind: 'code', ...head(f), langs, file, code: pre.code, items: items(f) });
    } else if (/^Supported Chains/.test(h2)) doc.blocks.push({ kind: 'chains', title: h2, chains: f.filter((x) => x.k === 'chip' || x.k === 'span').map((x) => x.text) });
    else if (f.some((x) => x.k === 'h3')) doc.blocks.push({ kind: 'items', ...head(f), items: items(f), cols: f.some((x) => x.k === 'li') ? 'wide' : '' });
    else if (/^Get /.test(h2)) doc.blocks.push({ kind: 'get', title: h2, text: (f.find((x) => x.k === 'p') || {}).text || '', chips: f.filter((x) => x.k === 'chip' && !/github/.test(x.href || '')).map((x) => x.text), github: f.find((x) => x.k === 'a' && /github/.test(x.href)) || null, deploy: f.find((x) => x.k === 'a' && /deploy/.test(x.href)) || null });
    else doc.blocks.push({ kind: 'band', ...head(f), links: f.filter((x) => x.k === 'a').map((a) => ({ label: a.text, href: a.href })), buttons: f.filter((x) => x.k === 'button').map((b) => b.text) });
  });
  const chains = doc.blocks.find((b) => b.kind === 'chains');
  doc.chains = chains ? chains.chains : [];
  return doc;
}

/* the directory: filters, the product legend, and each chain with the products hanzo.ai marks it for */
export function directoryDoc() {
  const rel = 'blockchain/directory';
  const html = raw(rel);
  const f = flow(sections(load(rel))[0] || load(rel));
  const all = flow(load(rel));
  const h1 = all.find((x) => x.k === 'h1');
  const legendAt = all.findIndex((x) => x.text === 'Hanzo Products:');
  const legend = all.slice(legendAt + 1).filter((x) => x.k === 'span').map((x) => x.text).slice(0, 10);
  const cards = [];
  const parts = html.split(/<h3[^>]*>/).slice(1);
  for (const p of parts) {
    const name = clean(p.slice(0, p.indexOf('<')).replace(/&amp;/g, '&'));
    const body = p.slice(0, p.indexOf('</button>') < 0 ? undefined : p.indexOf('</button>'));
    const spans = [...body.matchAll(/<span[^>]*data-slot="text"[^>]*>([^<]*)<\/span>/g)].map((x) => clean(x[1]));
    const marks = [...body.matchAll(/<span class="([^"]*)" title="([^"]*)"/g)].map((x) => ({ p: x[2], on: !/neutral-800/.test(x[1]) }));
    if (marks.length) cards.push({ name, id: spans.find((s) => /^Chain ID:/.test(s)) || null, kind: spans.filter((s) => !/^Chain ID:/.test(s)).slice(-1)[0] || '', marks });
  }
  return {
    slug: 'directory', route: '/' + rel, kind: 'directory',
    label: (all.find((x) => x.k === 'span' && all.indexOf(x) < all.indexOf(h1)) || {}).text || 'Chain Resource Directory',
    title: h1 ? h1.text : '', lede: (all.find((x) => x.k === 'p') || {}).text || '',
    search: (/placeholder="([^"]*)"/.exec(html) || [])[1] || null,
    filters: all.filter((x) => x.k === 'button' && x.slot === 'action').map((b) => b.text),
    legendLabel: 'Hanzo Products:', legend, cards, unused: f.length,
  };
}

export function overviewDoc() {
  const secs = sections(load('blockchain')).map(flow);
  const [hero, ...rest0] = secs;
  const plain = (f) => !f.some((x) => x.k === 'h2');
  const extras = rest0.filter(plain);
  const rest = rest0.filter((f) => !plain(f));
  const h1 = hero.find((x) => x.k === 'h1');
  const out = {
    chip: (hero.find((x) => x.k === 'chip') || {}).text || '',
    title: h1 ? h1.parts : [], lede: (hero.find((x) => x.k === 'p') || {}).text || '',
    actions: hero.filter((x) => x.k === 'button' || (x.k === 'a' && x.slot === 'action')).map((b) => b.text),
    note: (hero.filter((x) => x.k === 'p').slice(-1)[0] || {}).text || '',
    cats: hero.filter((x) => x.k === 'span').map((x) => x.text),
    facts: extras.flatMap((f) => f.filter((x) => x.k === 'span').map((x) => x.text)).reduce((a, t, k) => (k % 3 ? (a[a.length - 1].push(t), a) : [...a, [t]]), []),
    blocks: [],
  };
  for (const f of rest) {
    const h2 = f.find((x) => x.k === 'h2');
    const t = h2 ? h2.text : '';
    if (f.some((x) => x.k === 'a' && /^\/blockchain\//.test(x.href || '')) && f.filter((x) => x.k === 'a').length > 6) {
      out.blocks.push({ kind: 'pieces', ...head(f), cards: f.filter((x) => x.k === 'a').map((a) => ({ href: a.href, name: a.parts[0] || a.text, text: a.parts[1] || '', cta: a.parts[2] || '' })) });
    } else if (f.some((x) => x.k === 'button' && x.parts.length > 1)) {
      out.blocks.push({ kind: 'groups', ...head(f), groups: f.filter((x) => x.k === 'button').map((b) => ({ title: b.parts[0], text: b.parts[1] || '' })) });
    } else if (f.some((x) => x.k === 'pre')) {
      out.blocks.push({ kind: 'agent', chip: (f.find((x) => x.k === 'chip') || {}).text || '', title: h2 ? h2.parts : [], lede: (f.find((x) => x.k === 'p') || {}).text || '', bullets: f.filter((x) => x.k === 'li').map((x) => x.text), file: (f.find((x) => x.k === 'span' && /\.\w{1,4}$/.test(x.text)) || {}).text || null, code: f.find((x) => x.k === 'pre').code });
    } else if (/chains/i.test(t) && f.filter((x) => x.k === 'span' || x.k === 'chip').length > 8) {
      out.blocks.push({ kind: 'chains', ...head(f), chains: f.filter((x) => x.k === 'span' || x.k === 'chip').map((x) => x.text) });
    } else {
      out.blocks.push({ kind: 'band', ...head(f), buttons: f.filter((x) => x.k === 'button' || (x.k === 'a' && x.slot === 'action')).map((b) => b.text), links: f.filter((x) => x.k === 'a' && x.slot !== 'action').map((a) => ({ label: a.text, href: a.href })), points: f.filter((x) => x.k === 'span').map((x) => x.text) });
    }
  }
  return out;
}

/* every product's supported chains, for "which products run on my chain" */
export const coverage = () => SLUGS().filter((s) => s !== 'directory').map((s) => { const d = productDoc(s); return { slug: s, href: d.route, name: d.hero ? d.hero.title : s, chains: d.chains }; }).filter((p) => p.chains.length);
