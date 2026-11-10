/* Server side: the /solutions family (18 pages and the index) read from Hanzo's captured pages; the reserved tier's
   capacity rows are drawn by hanzo.ai's script, so they come from what the live page showed. */
import fs from 'node:fs';
import path from 'node:path';
import { load, find, findAll, textOf, slot, tag, isN } from '../htmltree';

const ROOT = process.cwd();
let IDX;
const idx = () => (IDX ||= JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'pages.json'), 'utf8')));
export const metaOf = (route) => idx()[route];
export const SLUGS = () => Object.keys(idx()).filter((p) => /^\/solutions\/[^/]+$/.test(p)).map((p) => p.split('/')[2]);
const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
const live = (rel) => { const f = path.join(ROOT, 'content', 'live', rel + '.json'); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')).text : []; };
const link = (a) => ({ label: clean(textOf(a)), href: a.a.href });
// the film's model is named in an attribute htmltree does not keep
const filmOf = (rel) => (/data-slug="([^"]+)"/.exec(fs.readFileSync(path.join(ROOT, 'content', 'pages', rel + '.html'), 'utf8')) || [])[1] || null;

function sections(root) {
  const out = [];
  const walk = (n) => { if (!isN(n)) return; if (n.t === 'section') { out.push(n); return; } n.c.forEach(walk); };
  walk(root);
  return out;
}

/* the hero's reel: the film, the label, each job (title + sentence), the product names */
function reel(fold) {
  const steps = find(fold, slot('steps'));
  if (!steps) return null;
  const panes = findAll(steps, (n) => n.t === 'div' && n.c.filter(isN).length === 2 && n.c[0].t === 'span' && n.c[1].t === 'p')
    .map((d) => ({ title: clean(textOf(d.c[0])), text: clean(textOf(d.c[1])) }));
  const items = findAll(steps, tag('li')).map((li) => clean(textOf(li)));
  const ol = find(steps, tag('ol'));
  const chipsBox = ol ? (() => { let p = null; const w = (n, par) => { if (!isN(n)) return; if (n === ol) p = par; n.c.forEach((k) => w(k, n)); }; w(steps, null); return p ? p.c.filter(isN).find((k) => k !== ol) : null; })() : null;
  const label = findAll(steps, (n) => n.t === 'span' && n.a && n.a['data-slot'] === 'text').map((s) => clean(textOf(s)))[0];
  return {
    label,
    steps: panes.length ? panes : items.map((t) => ({ title: t, text: '' })),
    names: chipsBox ? findAll(chipsBox, tag('span')).map((s) => clean(textOf(s))).filter(Boolean) : [],
  };
}

const BASE = {};
function baseDoc(slug) {
  if (BASE[slug]) return BASE[slug];
  const rel = 'solutions/' + slug;
  const root = load(rel);
  const lt = live(rel);
  const secs = sections(root);
  const fold = secs.find((s) => s.a && s.a['data-slot'] === 'fold') || secs[0];
  const doc = {
    slug, route: '/' + rel,
    label: clean(textOf(find(fold, (n) => n.a && 'data-label' in n.a))),
    title: clean(textOf(find(fold, tag('h1')))),
    lede: clean(textOf(find(fold, slot('lede')))),
    actions: findAll(fold, slot('action')).map(link),
    reel: reel(fold) && { ...reel(fold), slug: filmOf(rel) },
    runs: null, security: null, capacity: null, more: null, band: null, extra: [],
  };
  for (const sec of secs) {
    if (sec === fold) continue;
    const h2 = clean(textOf(find(sec, tag('h2'))));
    const grid = find(sec, slot('grid'));
    const links = findAll(sec, (n) => n.t === 'a' && n.a && n.a.href);
    const p = findAll(sec, tag('p')).map((x) => clean(textOf(x)));
    if (/^What it runs on/.test(h2)) {
      doc.runs = { title: h2, lede: p[0] || '', items: grid ? grid.c.filter((k) => isN(k) && k.t === 'a').map((a) => { const s = findAll(a, slot('text')).map((x) => clean(textOf(x))); return { href: a.a.href, name: s[0], text: s[1] || '' }; }) : [], links: links.filter((a) => !grid || !find(grid, (k) => k === a)).map(link) };
    } else if (/^Security/.test(h2)) {
      doc.security = { title: h2, items: grid ? grid.c.filter(isN).map((d) => { const s = findAll(d, slot('text')).map((x) => clean(textOf(x))); return { title: s[0], text: s[1] || '' }; }) : [], links: links.map(link) };
    } else if (/^Capacity/.test(h2)) {
      // drawn after load on hanzo.ai: header cells, then rows of three, as the live page showed them
      const i = lt.indexOf('Memory'), j = lt.indexOf('What it runs on');
      const cells = i > 0 ? lt.slice(i + 2, j > i ? j : undefined) : [];
      const rows = [];
      for (let k = 0; k + 2 < cells.length + 1 && /^\d+x /.test(cells[k] || ''); k += 3) rows.push(cells.slice(k, k + 3));
      doc.capacity = { title: h2, lede: p[0] || '', head: i > 0 ? ['', lt[i], lt[i + 1]] : [], rows };
    } else if (/^More /.test(h2)) {
      doc.more = { title: h2, links: links.map(link) };
    } else if (find(sec, slot('action')) || /^Put it to work/.test(h2)) {
      doc.band = { title: h2, lede: p[0] || '', actions: links.map(link) };
    } else doc.extra.push({ title: h2, nodes: sec.c });
  }
  return (BASE[slug] = doc);
}

/* one solution, with its place in the family (its accent) and what each sibling it links to opens into */
export function solutionDoc(slug) {
  const doc = baseDoc(slug);
  const all = SLUGS();
  const sibs = (doc.more ? doc.more.links : []).map((l) => l.href.split('/').pop()).filter((s) => l2(s) && all.includes(s)).map((s) => {
    const d = baseDoc(s);
    return { slug: s, href: d.route, title: d.title, label: d.label, i: all.indexOf(s), film: d.reel ? d.reel.slug : null, first: d.reel && d.reel.steps[0] ? d.reel.steps[0].title : '', n: [d.reel ? d.reel.steps.length : 0, d.runs ? d.runs.items.length : 0] };
  });
  return { ...doc, i: all.indexOf(slug), sibs };
}
const l2 = (s) => !!s && s !== 'solutions';

/* what the index and the comparer need of every solution */
export const allSolutions = () => Object.fromEntries(SLUGS().map((s) => { const d = baseDoc(s); return [s, { slug: s, href: d.route, title: d.title, label: d.label, film: d.reel && d.reel.slug, steps: d.reel ? d.reel.steps.map((x) => x.title) : [], names: d.reel ? d.reel.names : [], products: d.runs ? d.runs.items.map((x) => x.name) : [] }]; }));

export function indexDoc() {
  const root = load('solutions');
  const secs = sections(root);
  const fold = secs.find((s) => s.a && s.a['data-slot'] === 'fold') || secs[0];
  const lede = find(fold, slot('lede'));
  const groups = secs.filter((s) => s !== fold && findAll(s, (n) => n.t === 'a' && n.a && /^\/solutions\//.test(n.a.href || '')).length > 1).map((s) => ({
    title: clean(textOf(find(s, tag('h2')))),
    items: findAll(s, (n) => n.t === 'a' && n.a && /^\/solutions\//.test(n.a.href || '')).map((a) => { const t = findAll(a, slot('text')).map((x) => clean(textOf(x))); return { href: a.a.href, slug: a.a.href.split('/').pop(), name: t[0] || clean(textOf(a)), text: t[1] || '' }; }),
  }));
  const res = secs.find((s) => /Reserved tier/.test(textOf(find(s, tag('h2')) || '')));
  return {
    label: clean(textOf(find(fold, (n) => n.a && 'data-label' in n.a))),
    title: clean(textOf(find(fold, tag('h1')))),
    lede: lede ? lede.c : [],
    actions: findAll(fold, slot('action')).map(link),
    film: filmOf('solutions') || 'enso',
    groups,
    reserved: res ? { title: clean(textOf(find(res, tag('h2')))), text: clean(textOf(find(res, tag('p')))), link: link(find(res, (n) => n.t === 'a' && n.a && n.a.href)) } : null,
  };
}
