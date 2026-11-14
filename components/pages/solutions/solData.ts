/* Server side: the /solutions family (18 pages and the index) read from Hanzo's captured pages; the reserved tier's
   capacity rows are drawn by hanzo.ai's script, so they come from what the live page showed. */
import fs from 'node:fs';
import path from 'node:path';
import { load, find, findAll, textOf, slot, tag } from '../htmltree';
import type { BaseDoc, Brief, IndexDoc, Link, PageMeta, Reel, Sibling, SolutionDoc, Tree } from './types';

const ROOT = process.cwd();
let IDX: Record<string, PageMeta> | undefined;
const idx = () => (IDX ||= JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'pages.json'), 'utf8')) as Record<string, PageMeta>);
export const metaOf = (route: string): PageMeta | undefined => idx()[route];
// the tree reader is untyped: these give its results the tree's shape
const isN = (n: unknown): n is Tree => !!n && typeof n === 'object';
const all = (n: Tree | undefined, f: (n: Tree) => unknown) => findAll(n, f) as Tree[];
const one = (n: Tree | undefined, f: (n: Tree) => unknown) => find(n, f) as Tree | undefined;
export const SLUGS = () => Object.keys(idx()).filter((p) => /^\/solutions\/[^/]+$/.test(p)).map((p) => p.split('/')[2]);
const clean = (s: string | undefined) => (s || '').replace(/\s+/g, ' ').trim();
const live = (rel: string): string[] => { const f = path.join(ROOT, 'content', 'live', rel + '.json'); return fs.existsSync(f) ? (JSON.parse(fs.readFileSync(f, 'utf8')) as { text: string[] }).text : []; };
const hrefOf = (n: Tree | undefined) => n?.a?.href ?? '';
const link = (a: Tree | undefined): Link => ({ label: clean(textOf(a)), href: hrefOf(a) });
// the film's model is named in an attribute htmltree does not keep
const filmOf = (rel: string) => (/data-slug="([^"]+)"/.exec(fs.readFileSync(path.join(ROOT, 'content', 'pages', rel + '.html'), 'utf8')) || [])[1] || null;

function sections(root: Tree) {
  const out: Tree[] = [];
  const walk = (n: Tree | string) => { if (!isN(n)) return; if (n.t === 'section') { out.push(n); return; } n.c.forEach(walk); };
  walk(root);
  return out;
}

/* the hero's reel: the film, the label, each job (title + sentence), the product names */
function reel(fold: Tree): Omit<Reel, 'slug'> | null {
  const steps = one(fold, slot('steps'));
  if (!steps) return null;
  const panes = all(steps, (n) => { const [a, b] = n.c; return n.t === 'div' && n.c.filter(isN).length === 2 && isN(a) && a.t === 'span' && isN(b) && b.t === 'p'; })
    .map((d) => ({ title: clean(textOf(d.c[0])), text: clean(textOf(d.c[1])) }));
  const items = all(steps, tag('li')).map((li) => clean(textOf(li)));
  const ol = one(steps, tag('ol'));
  const chipsBox = ol ? (() => { let p = null as Tree | null; const w = (n: Tree | string, par: Tree | null) => { if (!isN(n)) return; if (n === ol) p = par; n.c.forEach((k) => w(k, n)); }; w(steps, null); return p ? p.c.filter(isN).find((k) => k !== ol) : null; })() : null;
  const label = all(steps, (n) => n.t === 'span' && n.a && n.a['data-slot'] === 'text').map((s) => clean(textOf(s)))[0];
  return {
    label,
    steps: panes.length ? panes : items.map((t) => ({ title: t, text: '' })),
    names: chipsBox ? all(chipsBox, tag('span')).map((s) => clean(textOf(s))).filter(Boolean) : [],
  };
}

const BASE: Record<string, BaseDoc> = {};
function baseDoc(slug: string): BaseDoc {
  if (BASE[slug]) return BASE[slug];
  const rel = 'solutions/' + slug;
  const root = load(rel) as Tree;
  const lt = live(rel);
  const secs = sections(root);
  const fold = secs.find((s) => s.a && s.a['data-slot'] === 'fold') || secs[0];
  const rl = reel(fold);
  const doc: BaseDoc = {
    slug, route: '/' + rel,
    label: clean(textOf(one(fold, (n) => n.a && 'data-label' in n.a))),
    title: clean(textOf(one(fold, tag('h1')))),
    lede: clean(textOf(one(fold, slot('lede')))),
    actions: all(fold, slot('action')).map(link),
    reel: rl && { ...rl, slug: filmOf(rel) },
    runs: null, security: null, capacity: null, more: null, band: null, extra: [],
  };
  for (const sec of secs) {
    if (sec === fold) continue;
    const h2 = clean(textOf(one(sec, tag('h2'))));
    const grid = one(sec, slot('grid'));
    const links = all(sec, (n) => n.t === 'a' && n.a && n.a.href);
    const p = all(sec, tag('p')).map((x) => clean(textOf(x)));
    if (/^What it runs on/.test(h2)) {
      doc.runs = { title: h2, lede: p[0] || '', items: grid ? grid.c.filter((k): k is Tree => isN(k) && k.t === 'a').map((a) => { const s = all(a, slot('text')).map((x) => clean(textOf(x))); return { href: hrefOf(a), name: s[0], text: s[1] || '' }; }) : [], links: links.filter((a) => !grid || !one(grid, (k) => k === a)).map(link) };
    } else if (/^Security/.test(h2)) {
      doc.security = { title: h2, items: grid ? grid.c.filter(isN).map((d) => { const s = all(d, slot('text')).map((x) => clean(textOf(x))); return { title: s[0], text: s[1] || '' }; }) : [], links: links.map(link) };
    } else if (/^Capacity/.test(h2)) {
      // drawn after load on hanzo.ai: header cells, then rows of three, as the live page showed them
      const i = lt.indexOf('Memory'), j = lt.indexOf('What it runs on');
      const cells = i > 0 ? lt.slice(i + 2, j > i ? j : undefined) : [];
      const rows: string[][] = [];
      for (let k = 0; k + 2 < cells.length + 1 && /^\d+x /.test(cells[k] || ''); k += 3) rows.push(cells.slice(k, k + 3));
      doc.capacity = { title: h2, lede: p[0] || '', head: i > 0 ? ['', lt[i], lt[i + 1]] : [], rows };
    } else if (/^More /.test(h2)) {
      doc.more = { title: h2, links: links.map(link) };
    } else if (one(sec, slot('action')) || /^Put it to work/.test(h2)) {
      doc.band = { title: h2, lede: p[0] || '', actions: links.map(link) };
    } else doc.extra.push({ title: h2, nodes: sec.c });
  }
  return (BASE[slug] = doc);
}

/* one solution, with its place in the family (its accent) and what each sibling it links to opens into */
export function solutionDoc(slug: string): SolutionDoc {
  const doc = baseDoc(slug);
  const all = SLUGS();
  const sibs = (doc.more ? doc.more.links : []).map((l) => l.href.split('/').pop() ?? '').filter((s) => l2(s) && all.includes(s)).map((s): Sibling => {
    const d = baseDoc(s);
    return { slug: s, href: d.route, title: d.title, label: d.label, i: all.indexOf(s), film: d.reel ? d.reel.slug : null, first: d.reel && d.reel.steps[0] ? d.reel.steps[0].title : '', n: [d.reel ? d.reel.steps.length : 0, d.runs ? d.runs.items.length : 0] };
  });
  return { ...doc, i: all.indexOf(slug), sibs };
}
const l2 = (s: string) => !!s && s !== 'solutions';

/* what the index and the comparer need of every solution */
export const allSolutions = () => Object.fromEntries(SLUGS().map((s): [string, Brief] => { const d = baseDoc(s); return [s, { slug: s, href: d.route, title: d.title, label: d.label, film: d.reel && d.reel.slug, steps: d.reel ? d.reel.steps.map((x) => x.title) : [], names: d.reel ? d.reel.names : [], products: d.runs ? d.runs.items.map((x) => x.name) : [] }]; }));

export function indexDoc(): IndexDoc {
  const root = load('solutions') as Tree;
  const secs = sections(root);
  const fold = secs.find((s) => s.a && s.a['data-slot'] === 'fold') || secs[0];
  const lede = one(fold, slot('lede'));
  const groups = secs.filter((s) => s !== fold && all(s, (n) => n.t === 'a' && n.a && /^\/solutions\//.test(n.a.href || '')).length > 1).map((s) => ({
    title: clean(textOf(one(s, tag('h2')))),
    items: all(s, (n) => n.t === 'a' && n.a && /^\/solutions\//.test(n.a.href || '')).map((a) => { const t = all(a, slot('text')).map((x) => clean(textOf(x))); return { href: hrefOf(a), slug: hrefOf(a).split('/').pop() ?? '', name: t[0] || clean(textOf(a)), text: t[1] || '' }; }),
  }));
  const res = secs.find((s) => /Reserved tier/.test(textOf(one(s, tag('h2')) || '')));
  return {
    label: clean(textOf(one(fold, (n) => n.a && 'data-label' in n.a))),
    title: clean(textOf(one(fold, tag('h1')))),
    lede: lede ? lede.c : [],
    actions: all(fold, slot('action')).map(link),
    film: filmOf('solutions') || 'enso',
    groups,
    reserved: res ? { title: clean(textOf(one(res, tag('h2')))), text: clean(textOf(one(res, tag('p')))), link: link(one(res, (n) => n.t === 'a' && n.a && n.a.href)) } : null,
  };
}
