/* Server side: one Hanzo Cloud product page (/cloud/<slug>, 42 of them) read from Hanzo's captured HTML, plus the
   lines hanzo.ai only draws in the browser (content/live). Nothing here is written by us: every string is Hanzo's. */
import fs from 'node:fs';
import path from 'node:path';
import { load, find, findAll, textOf, slot, tag, isN } from '../htmltree';

const ROOT = process.cwd();
let IDX;
const idx = () => (IDX ||= JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'pages.json'), 'utf8')));
export const metaOf = (route) => idx()[route];
export const MEMBERS = () => Object.keys(idx()).filter((p) => /^\/cloud\/[^/]+$/.test(p)).map((p) => p.split('/')[2]);
const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
const txt = (n) => clean(textOf(n));
const leaves = (n) => (isN(n) ? n.c.flatMap(leaves) : [clean(n)]).filter(Boolean);
const kids = (n) => (isN(n) ? n.c.filter(isN) : []);
// each service of hanzo.ai's shared example project has its own note, which its browser draws (its server copy does
// not carry them): Hanzo's words from its shared console (live, 8 Nov)
const ROW_NOTE = {
  gateway: 'Every request enters here, so the limiter does too.',
  'payments-api': 'The service the session above is changing.',
  'checkout-web': 'A build is running from the last commit on main.',
  'docs-site': 'Static, published by the same pipeline as the rest.',
};
const live = (slug) => {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'live', 'cloud', slug + '.json'), 'utf8')); } catch { return { text: [], links: [] }; }
};

function product(root, slug) {
  const secs = findAll(root, tag('section'));
  const fold = secs.find((s) => s.a && s.a['data-slot'] === 'fold') || secs[0];
  const h1 = find(fold, tag('h1'));
  const col = findAll(fold, (n) => n.c.includes(h1))[0];
  const after = kids(col).slice(kids(col).indexOf(h1) + 1);
  const nav = find(fold, tag('nav'));
  const fig = find(fold, (n) => n.t === 'figure');
  const win = fig && find(fig, slot('surface-window'));
  const ship = secs.find((s) => find(s, tag('pre')));
  const about = secs.find((s) => s !== fold && s !== ship && !find(s, slot('leaf')) && !find(s, slot('eyebrow')));
  const rel = secs.find((s) => find(s, slot('leaf')));
  const lab = find(fold, (n) => n.a && 'data-label' in n.a);
  const doc = {
    slug, kind: 'product',
    crumb: nav ? kids(nav).filter((n) => txt(n) !== '/').map((n) => ({ label: txt(n), href: n.a && n.a.href })) : [],
    label: txt(lab), name: txt(h1),
    lede: txt(after.find((n) => n.a && n.a['data-slot'] === 'lede')),
    actions: findAll(col, (n) => n.t === 'a' && n.a && n.a['data-slot'] === 'action').map((a) => ({ label: txt(a), href: a.a.href })),
    badges: (after.find((n) => n.t === 'div' && !find(n, tag('a')) && find(n, tag('span'))) || { c: [] }).c.filter(isN).map(txt).filter(Boolean),
    meta: (() => { const dl = find(col, tag('dl')); return dl ? findAll(dl, tag('dt')).map((dt, i) => ({ k: txt(dt), v: txt(findAll(dl, tag('dd'))[i]) })) : []; })(),
    window: null, ship: null, desc: [], features: [], motto: '', related: null, live: [],
  };
  if (win) {
    const bar = kids(win)[0];
    const title = find(bar, (n) => n.t === 'span' && n.a && n.a['data-slot'] === 'text');
    const code = find(win, tag('code'));
    const inNav = new Set(findAll(win, tag('nav')).flatMap((v) => findAll(v, tag('a'))));
    const out = findAll(win, (n) => n.t === 'a' && n.a && n.a.href && !inNav.has(n));
    doc.window = {
      title: title ? title.c.filter((c) => !isN(c)).map(clean).filter(Boolean) : [doc.name],
      siblings: [...inNav].map((a) => ({ label: txt(a), href: a.a.href, current: a.a['aria-current'] === 'page' })),
      // three kinds of example on hanzo.ai: a project's services, a conversation with the agent, or a CLI session
      rows: findAll(win, slot('surface-row')).map((b) => { const name = txt(find(b, slot('surface-name'))); return { name, state: txt(findAll(b, (n) => n.t === 'span' && n.a && n.a['data-slot'] === 'text').pop()), note: ROW_NOTE[name] || '' }; }),
      turns: findAll(win, slot('surface-turn')).map(txt),
      lines: findAll(win, slot('surface-line')).map((b) => { const [g, ...rest] = leaves(b); return { g, text: rest.join(' ') }; }),
      caption: txt(find(win, (n) => n.t === 'p')),
      host: code ? code.c.filter((c) => !isN(c) || c.t === 'span').map((c) => clean(textOf(c))).filter(Boolean) : [],
      console: out.length ? { label: txt(out[out.length - 1]), href: out[out.length - 1].a.href } : null,
      note: txt(find(fig, tag('figcaption'))),
    };
  }
  if (ship) {
    const btns = findAll(ship, tag('button'));
    const spans = findAll(ship, (n) => n.t === 'span' && n.a && n.a['data-slot'] === 'text' && !btns.some((b) => find(b, (k) => k === n)));
    doc.ship = {
      eyebrow: txt(find(ship, slot('eyebrow'))), lede: txt(find(ship, slot('lede'))),
      label: txt(spans[0]), api: spans[1] ? spans[1].c.map((c) => clean(textOf(c))).filter(Boolean) : [],
      prompt: txt(find(ship, tag('pre'))),
    };
  }
  if (about) {
    const ps = kids(about).filter((k) => k.t === 'p');
    const grid = find(about, slot('grid'));
    doc.features = grid ? findAll(grid, (n) => n.t === 'span').map(txt).filter(Boolean) : [];
    doc.motto = ps.length ? txt(ps[ps.length - 1]) : '';
    doc.desc = ps.slice(0, -1).map(txt);
  }
  if (rel) {
    doc.related = {
      eyebrow: txt(find(rel, slot('eyebrow'))),
      more: findAll(rel, slot('more')).map((a) => ({ href: a.a.href, label: txt(a) })),
      items: findAll(rel, slot('leaf')).map((a) => ({ href: a.a.href, label: txt(find(a, slot('lift'))), desc: txt(find(a, (n) => n.t === 'span' && n.a && n.a['data-slot'] === 'text')) })),
    };
  }
  return doc;
}

// /cloud/local is a different page on hanzo.ai: a boot story and a terminal session, so it keeps its own shape
function local(root, slug) {
  const fold = find(root, (n) => n.t === 'section' && n.a && n.a['data-slot'] === 'fold');
  const boot = find(root, (n) => n.t === 'section' && n.a && n.a.id === 'boot');
  const grids = findAll(boot, slot('grid'));
  const lines = findAll(boot, (n) => n.t === 'div' && n.a && n.a['data-slot'] === 'text' && kids(n).length && !kids(n).some((k) => k.t === 'div'));
  return {
    slug, kind: 'local',
    label: txt(find(fold, (n) => n.a && 'data-label' in n.a)), name: txt(find(fold, tag('h1'))), lede: txt(find(fold, slot('lede'))),
    boot: {
      id: 'boot', eyebrow: txt(find(boot, slot('eyebrow'))), title: txt(find(boot, slot('title'))), lede: txt(findAll(boot, slot('lede'))[0]),
      figures: kids(grids[1]).map((d) => ({ value: txt(find(d, tag('span'))), label: txt(find(d, tag('p'))) })),
      actions: findAll(boot, (n) => n.t === 'a' && n.a && n.a['data-slot'] === 'action').map((a) => ({ label: txt(a), href: a.a.href })),
      cwd: txt(findAll(boot, (n) => n.t === 'span' && n.a && n.a['data-slot'] === 'text' && txt(n).startsWith('~'))[0]),
      lines: lines.map((l) => {
        const sp = kids(l);
        const cmd = sp[0] && txt(sp[0]) === '$';
        return { cmd, text: txt(cmd ? sp[1] : sp[0]), time: !cmd && sp[1] ? txt(sp[1]) : '' };
      }),
    },
  };
}

// every product page that names its Google Cloud counterpart, for the finder; read once per build
let PAIRS;
export function googlePairs() {
  return (PAIRS ||= MEMBERS().map((s) => cloudDoc(s)).filter((d) => d.kind === 'product').flatMap((d) => {
    const g = d.meta.find((m) => m.k === 'Google Cloud');
    const api = d.meta.find((m) => m.k === 'API');
    return g ? [{ slug: d.slug, name: d.name, google: g.v, api: api ? api.v : '', group: d.label }] : [];
  }));
}

const DOCS = {};
export function cloudDoc(slug) {
  if (DOCS[slug]) return DOCS[slug];
  const root = load('cloud/' + slug);
  const doc = slug === 'local' ? local(root, slug) : product(root, slug);
  // lines hanzo.ai draws in the browser that its server copy does not carry (the console's note on the running session)
  const html = clean(textOf(root));
  const L = live(slug);
  const hrefs = new Set(findAll(root, (n) => n.t === 'a' && n.a && n.a.href).map((a) => a.a.href));
  doc.live = L.text.map(clean).filter((t) => t.length > 12 && !html.includes(t));
  // where hanzo.ai's browser sends the console button today (its server copy says /home)
  doc.liveLinks = L.links.filter((h) => /^https?:/.test(h) && !hrefs.has(h));
  return (DOCS[slug] = doc);
}

/* a product's family on hanzo.ai (its breadcrumb group); JAMES 7 rules out per-product hues, so a page is told apart
   by its own Sigil, its own console and its own words, never by a colour */
export const groupOf = (doc) => (doc.kind === 'local' ? 'Local' : (doc.crumb[1] && doc.crumb[1].label) || doc.label);

/* the numbers that shape a product's Sigil: its own figures (a family size, a feature count, numbers in its words) */
const nums = (s) => (String(s).match(/\d+(?:\.\d+)?/g) || []).map(Number);
export function sigilOf(slug) {
  const d = cloudDoc(slug);
  const data = d.kind === 'local'
    ? d.boot.figures.flatMap((f) => nums(f.value))
    : [d.window ? d.window.siblings.length : 0, d.features.length, ...nums([d.lede, ...d.desc, ...d.features].join(' '))].slice(0, 6);
  return { seed: 'cloud/' + slug, data };
}
/* what a neighbour shows when you point at it (a console sibling, a family pill, a related row): that product's own
   name, status, endpoint, lede and Google Cloud pair, read from its own page. Only /cloud/* products have one. */
export function previewsOf(doc) {
  if (doc.kind !== 'product') return {};
  const hrefs = new Set([...(doc.window ? doc.window.siblings.map((s) => s.href) : []), ...(doc.related ? doc.related.items.map((i) => i.href) : [])]);
  const out = {};
  for (const h of hrefs) {
    const m = /^\/cloud\/([^/#?]+)$/.exec(h || '');
    if (!m || !MEMBERS().includes(m[1])) continue;
    const d = cloudDoc(m[1]);
    if (d.kind !== 'product') continue;
    const api = d.meta.find((x) => x.k === 'API');
    const g = d.meta.find((x) => x.k === 'Google Cloud');
    out[h] = { name: d.name, label: d.label, lede: d.lede, api: api ? api.v : '', google: g ? g.v : '' };
  }
  return out;
}

/* a related card shows the picture its page opens with, so the card can open into that page */
export function relatedSigils(doc) {
  if (!doc.related) return {};
  return Object.fromEntries(doc.related.items.map((it) => {
    const m = /^\/cloud\/([^/#?]+)$/.exec(it.href);
    return [it.href, m && MEMBERS().includes(m[1]) ? sigilOf(m[1]) : { seed: it.href, data: [] }];
  }));
}
