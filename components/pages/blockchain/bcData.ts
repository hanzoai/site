/* Server side: the /blockchain family (15 product pages, the exchange, the chain directory and the overview) read from
   Hanzo's captured pages. Each page is flattened into its words in reading order, then grouped by heading. */
import fs from 'node:fs';
import path from 'node:path';
import { load, find, findAll, textOf, tag, isN } from '../htmltree';
import type { Branch, Child, Meta } from '../htmltree';
import { codeOf } from '../models/modelsData';
import type { Anchor, Button, Card, ChainsBlock, Chip, Cover, Item, Kind, Listing, Of, Overview, Para, Product, Row, Span } from './types';

const ROOT = process.cwd();
let IDX: Record<string, Meta> | undefined;
const idx = (): Record<string, Meta> => (IDX ||= JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'pages.json'), 'utf8')));
export const metaOf = (route: string): Meta | undefined => idx()[route];
export const SLUGS = () => Object.keys(idx()).filter((p) => /^\/blockchain\/[^/]+$/.test(p)).map((p) => p.split('/')[2]);
const clean = (s: string) => (s || '').replace(/\s+/g, ' ').trim();
const raw = (rel: string) => fs.readFileSync(path.join(ROOT, 'content', 'pages', rel + '.html'), 'utf8');

/* narrow a flowed row to one kind, or to one kind with a slot, a link or a name that matches */
const is = <K extends Kind>(k: K) => (x: Row): x is Of<K> => x.k === k;
const anchor = (slot: string) => (x: Row): x is Anchor => x.k === 'a' && x.slot === slot;
const toward = (re: RegExp) => (x: Row): x is Anchor => x.k === 'a' && re.test(x.href);
const button = (slot: string) => (x: Row): x is Button => x.k === 'button' && x.slot === slot;
const para = (re: RegExp) => (x: Row): x is Para => x.k === 'p' && re.test(x.text);
const ask = (x: Row): x is Button | Anchor => x.k === 'button' || (x.k === 'a' && x.slot === 'action');
const pill = (x: Row): x is Chip | Span => x.k === 'chip' || x.k === 'span';
const named = (x: Row): x is Span => x.k === 'span' && /\.\w{1,4}$/.test(x.text);

function sections(root: Branch) {
  const out: Branch[] = [];
  const walk = (n: Child) => { if (!isN(n)) return; if (n.t === 'section') { out.push(n); return; } n.c.forEach(walk); };
  walk(root);
  return out;
}
const slotted = (n: Branch): boolean => n.c.some((k) => isN(k) && ((k.a && k.a['data-slot']) || slotted(k)));
/* a section's words in reading order: headings, paragraphs, items, links, buttons, chips, code */
function flow(sec: Branch) {
  const out: Row[] = [];
  const walk = (n: Child) => {
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
const items = (f: Row[]) => {
  const out: Item[] = [];
  f.forEach((x) => {
    if (x.k === 'h3') out.push({ title: x.text, text: '', bullets: [], link: null });
    else if (out.length && x.k === 'p' && !out[out.length - 1].text) out[out.length - 1].text = x.text;
    else if (out.length && x.k === 'li') out[out.length - 1].bullets.push(x.text);
    else if (out.length && x.k === 'a') out[out.length - 1].link = { label: x.text, href: x.href };
  });
  return out;
};
const head = (f: Row[]) => { const h3 = f.findIndex((x) => x.k === 'h3'); const pre = h3 < 0 ? f : f.slice(0, h3); return { title: f.find(is('h2'))?.text || '', lede: pre.find(is('p'))?.text || '' }; };

export function productDoc(slug: string): Product | Listing {
  return slug === 'directory' ? directoryDoc() : product(slug);
}

function product(slug: string): Product {
  const rel = 'blockchain/' + slug;
  const secs = sections(load(rel)).map(flow);
  const doc: Product = { slug, route: '/' + rel, kind: 'product', i: SLUGS().indexOf(slug), blocks: [], chains: [] };
  secs.forEach((f, i) => {
    const h2 = f.find(is('h2'))?.text || '';
    if (i === 0) {
      const cut = f.findIndex((x) => x.k === 'h2');
      const top = cut < 0 ? f : f.slice(0, cut), key = cut < 0 ? [] : f.slice(cut);
      const h1 = top.find(is('h1'));
      const h1At = h1 ? top.indexOf(h1) : -1;
      const ps = top.filter(is('p'));
      doc.hero = {
        chip: (top.find(is('chip')) || top.find((x): x is Span => x.k === 'span' && top.indexOf(x) < h1At))?.text || '',
        title: h1 ? h1.text : '', claim: (ps.find((p) => p.slot === 'claim') || ps[0])?.text || '',
        lede: (ps.find((p) => p.slot === 'lede') || ps[1])?.text || '',
        features: items(top), back: top.find(anchor('more')) || null,
        actions: top.filter(anchor('action')).map((a) => ({ label: a.text, href: a.href })),
      };
      if (key.length) {
        const sp = key.filter(is('span'));
        const trust = key.find(para(/^Trusted/));
        doc.key = {
          title: h2, sub: key.find(is('p'))?.text || '',
          stats: sp.reduce<string[][]>((a, s, k) => (k % 2 ? (a[a.length - 1].push(s.text), a) : [...a, [s.text]]), []),
          actions: key.filter(ask).map((b) => b.text),
          note: key.find(para(/credit card/i))?.text || '',
          trusted: trust ? { label: trust.text, tags: key.slice(key.indexOf(trust) + 1).filter(is('chip')).map((x) => x.text) } : null,
        };
      }
      return;
    }
    const pre = f.find(is('pre'));
    if (pre) {
      const langs = f.filter(button('more')).map((b) => b.text);
      const file = f.filter(named).map((x) => x.text)[0] || null;
      doc.blocks.push({ kind: 'code', ...head(f), langs, file, code: pre.code, items: items(f) });
    } else if (/^Supported Chains/.test(h2)) doc.blocks.push({ kind: 'chains', title: h2, chains: f.filter(pill).map((x) => x.text) });
    else if (f.some((x) => x.k === 'h3')) doc.blocks.push({ kind: 'items', ...head(f), items: items(f), cols: f.some((x) => x.k === 'li') ? 'wide' : '' });
    else if (/^Get /.test(h2)) doc.blocks.push({ kind: 'get', title: h2, text: f.find(is('p'))?.text || '', chips: f.filter(is('chip')).map((x) => x.text), github: f.find(toward(/github/)) || null, deploy: f.find(toward(/deploy/)) || null });
    else doc.blocks.push({ kind: 'band', ...head(f), links: f.filter(is('a')).map((a) => ({ label: a.text, href: a.href })), buttons: f.filter(is('button')).map((b) => b.text) });
  });
  const chains = doc.blocks.find((b): b is ChainsBlock => b.kind === 'chains');
  doc.chains = chains ? chains.chains : [];
  return doc;
}

/* the directory: filters, the product legend, and each chain with the products hanzo.ai marks it for */
export function directoryDoc(): Listing {
  const rel = 'blockchain/directory';
  const html = raw(rel);
  const f = flow(sections(load(rel))[0] || load(rel));
  const all = flow(load(rel));
  const h1 = all.find(is('h1'));
  const h1At = h1 ? all.indexOf(h1) : -1;
  const legendAt = all.findIndex((x) => x.k !== 'pre' && x.text === 'Hanzo Products:');
  const legend = all.slice(legendAt + 1).filter(is('span')).map((x) => x.text).slice(0, 10);
  const cards: Card[] = [];
  const parts = html.split(/<h3[^>]*>/).slice(1);
  for (const p of parts) {
    const name = clean(p.slice(0, p.indexOf('<')).replace(/&amp;/g, '&'));
    const body = p.slice(0, p.indexOf('</button>') < 0 ? undefined : p.indexOf('</button>'));
    const spans = [...body.matchAll(/<span[^>]*data-slot="text"[^>]*>([^<]*)<\/span>/g)].map((x) => clean(x[1]));
    const marks = [...body.matchAll(/<span class="([^"]*)" title="([^"]*)"/g)].map((x) => ({ p: x[2], on: !/neutral-800/.test(x[1]) }));
    if (marks.length) cards.push({ name, id: spans.find((s) => /^Chain ID:/.test(s)) || null, kind: spans.filter((s) => !/^Chain ID:/.test(s)).slice(-1)[0] || '', marks });
  }
  return {
    slug: 'directory', route: '/' + rel, kind: 'directory', i: SLUGS().indexOf('directory'),
    label: all.find((x): x is Span => x.k === 'span' && all.indexOf(x) < h1At)?.text || 'Chain Resource Directory',
    title: h1 ? h1.text : '', lede: all.find(is('p'))?.text || '',
    search: (/placeholder="([^"]*)"/.exec(html) || [])[1] || null,
    filters: all.filter(button('action')).map((b) => b.text),
    legendLabel: 'Hanzo Products:', legend, cards, unused: f.length,
  };
}

export function overviewDoc(): Overview {
  const secs = sections(load('blockchain')).map(flow);
  const [hero, ...rest0] = secs;
  const plain = (f: Row[]) => !f.some((x) => x.k === 'h2');
  const extras = rest0.filter(plain);
  const rest = rest0.filter((f) => !plain(f));
  const h1 = hero.find(is('h1'));
  const out: Overview = {
    chip: hero.find(is('chip'))?.text || '',
    title: h1 ? h1.parts : [], lede: hero.find(is('p'))?.text || '',
    actions: hero.filter(ask).map((b) => b.text),
    note: hero.filter(is('p')).slice(-1)[0]?.text || '',
    cats: hero.filter(is('span')).map((x) => x.text),
    facts: extras.flatMap((f) => f.filter(is('span')).map((x) => x.text)).reduce<string[][]>((a, t, k) => (k % 3 ? (a[a.length - 1].push(t), a) : [...a, [t]]), []),
    blocks: [],
  };
  for (const f of rest) {
    const h2 = f.find(is('h2'));
    const t = h2 ? h2.text : '';
    const pre = f.find(is('pre'));
    if (f.some((x) => x.k === 'a' && /^\/blockchain\//.test(x.href || '')) && f.filter(is('a')).length > 6) {
      out.blocks.push({ kind: 'pieces', ...head(f), cards: f.filter(is('a')).map((a) => ({ href: a.href, name: a.parts[0] || a.text, text: a.parts[1] || '', cta: a.parts[2] || '' })) });
    } else if (f.some((x) => x.k === 'button' && x.parts.length > 1)) {
      out.blocks.push({ kind: 'groups', ...head(f), groups: f.filter(is('button')).map((b) => ({ title: b.parts[0], text: b.parts[1] || '' })) });
    } else if (pre) {
      out.blocks.push({ kind: 'agent', chip: f.find(is('chip'))?.text || '', title: h2 ? h2.parts : [], lede: f.find(is('p'))?.text || '', bullets: f.filter(is('li')).map((x) => x.text), file: f.find(named)?.text || null, code: pre.code });
    } else if (/chains/i.test(t) && f.filter(pill).length > 8) {
      out.blocks.push({ kind: 'chains', ...head(f), chains: f.filter(pill).map((x) => x.text) });
    } else {
      out.blocks.push({ kind: 'band', ...head(f), buttons: f.filter(ask).map((b) => b.text), links: f.filter((x): x is Anchor => x.k === 'a' && x.slot !== 'action').map((a) => ({ label: a.text, href: a.href })), points: f.filter(is('span')).map((x) => x.text) });
    }
  }
  return out;
}

/* every product's supported chains, for "which products run on my chain" */
export const coverage = (): Cover[] => SLUGS().filter((s) => s !== 'directory').map((s) => { const d = product(s); return { slug: s, href: d.route, name: d.hero ? d.hero.title : s, chains: d.chains, i: d.i, claim: d.hero ? d.hero.claim : '' }; }).filter((p) => p.chains.length);
