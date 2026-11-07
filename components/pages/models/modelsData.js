/* Server side: the /models family read from Hanzo's captured pages (content/pages) and what hanzo.ai showed once its
   scripts ran (content/live: the live rates). Every figure here is Hanzo's; nothing is computed except unit parsing. */
import fs from 'node:fs';
import path from 'node:path';
import { load, find, findAll, textOf, slot, tag, isN } from '../htmltree';

const ROOT = process.cwd();
let IDX;
const idx = () => (IDX ||= JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'pages.json'), 'utf8')));
export const metaOf = (route) => idx()[route];

export const PROVIDERS = () => Object.keys(idx()).filter((p) => /^\/models\/[^/]+$/.test(p)).map((p) => p.split('/')[2]);
export const MODEL_PARAMS = () => Object.keys(idx()).filter((p) => /^\/models\/[^/]+\/[^/]+$/.test(p)).map((p) => { const [, , slug, model] = p.split('/'); return { slug, model }; });
export const exists = (route) => !!idx()[route];

function live(rel) {
  const f = path.join(ROOT, 'content', 'live', rel + '.json');
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')).text : null;
}
const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

/* "200K" -> 200000, "1M" -> 1000000 */
export const tokens = (s) => { const m = /^([\d.]+)\s*([KM])$/i.exec(clean(s)); return m ? Math.round(parseFloat(m[1]) * (m[2].toUpperCase() === 'M' ? 1e6 : 1e3)) : null; };
/* "$5.57 in · $27.83 out, per million tokens" -> { in: 5.57, out: 27.83 }; "Free" is 0; "No published rate" is null */
export function rate(s) {
  if (!s) return null;
  const m = /^(Free|\$[\d.,]+) in · (Free|\$[\d.,]+) out/.exec(s);
  if (!m) return null;
  const n = (x) => (x === 'Free' ? 0 : parseFloat(x.slice(1).replace(/,/g, '')));
  return { in: n(m[1]), out: n(m[2]) };
}
const after = (text, label) => { const i = text ? text.indexOf(label) : -1; return i >= 0 ? text[i + 1] : null; };

/* top-level sections of a captured page */
function sections(root) {
  const out = [];
  const walk = (n) => { if (!isN(n)) return; if (n.t === 'section') { out.push(n); return; } n.c.forEach(walk); };
  walk(root);
  return out;
}
const link = (a) => ({ label: clean(textOf(a)), href: a.a.href });

/* the cards on a provider page: name, context, the first lines of its description, its modalities */
function cardOf(a) {
  const p = find(a, tag('p'));
  const spans = findAll(a, slot('text')).filter((s) => s.t === 'span').map((s) => clean(textOf(s))).filter(Boolean);
  const name = spans[0] || '';
  const ctx = spans.find((s, i) => i > 0 && /^[\d.]+[KM]$/.test(s)) || null;
  const last = a.c.filter(isN).slice(-1)[0];
  const tags = last && last !== p && last.t === 'div' ? findAll(last, slot('text')).map((s) => clean(textOf(s))).filter(Boolean) : [];
  return { href: a.a.href, name, ctx, desc: p ? clean(textOf(p)) : '', tags };
}

const providerCache = new Map();
export function providerCards(slug) {
  if (providerCache.has(slug)) return providerCache.get(slug);
  let cards = [];
  try {
    const root = load('models/' + slug);
    cards = findAll(root, (n) => n.t === 'a' && n.a && n.a['data-slot'] === 'leaf' && n.a.href && n.a.href.startsWith('/models/' + slug + '/')).map(cardOf);
  } catch { /* a provider without a page */ }
  // each sibling's live rate, as hanzo.ai printed it
  cards.forEach((c) => { const t = live(c.href.slice(1)); const pr = after(t, 'Price'); c.price = pr || null; c.rate = rate(pr); c.tokens = tokens(c.ctx); c.id = c.href.split('/').slice(2).join('/'); });
  providerCache.set(slug, cards);
  return cards;
}

/* the facts grids of a specs section, each under its own heading */
function factGroups(sec) {
  const groups = [];
  let cur = null;
  const open = (title) => { cur = { title, notes: [], facts: [] }; groups.push(cur); };
  const walk = (n) => {
    if (typeof n === 'string') { if (clean(n)) (cur || (open(null), cur)).notes.push(clean(n)); return; }
    if (n.t === 'h2') { open(clean(textOf(n))); return; }
    if (n.a && n.a['data-slot'] === 'grid' && !n.c.some((k) => find(k, (x) => x.t === 'h2' || (x.a && x.a['data-slot'] === 'grid')))) {
      if (!cur || cur.facts.length) open(null);
      cur.facts = n.c.filter(isN).map((cell) => {
        const parts = cell.c.filter(isN);
        const v = clean(textOf(parts[1])); // hanzo.ai prints "…" until its script reads the rate
        return { label: clean(textOf(parts[0])), value: v === '…' || !v ? null : v };
      });
      return;
    }
    n.c.forEach(walk);
  };
  walk(sec);
  return groups.filter((g) => g.facts.length || g.notes.length);
}

/* a captured <pre> as lines of [kind, text] tokens (kind from hanzo.ai's data-code), plus its plain text */
export function codeOf(pre) {
  const toks = [];
  const walk = (n, kind) => {
    if (typeof n === 'string') { toks.push([kind, n]); return; }
    const k = (n.a && n.a['data-code']) || kind;
    n.c.forEach((c) => walk(c, k));
  };
  walk(pre, 'ink');
  const lines = [[]];
  toks.forEach(([k, s]) => s.split('\n').forEach((part, j) => { if (j) lines.push([]); if (part) lines[lines.length - 1].push([k, part]); }));
  while (lines.length && !lines[lines.length - 1].length) lines.pop();
  return { lines, text: lines.map((l) => l.map((t) => t[1]).join('')).join('\n') };
}
/* code samples: tabs, then each sample */
function samples(sec) {
  const tabs = findAll(sec, (n) => n.t === 'button' && n.a && /^tab-/.test(n.a.id || '')).map((b) => clean(textOf(b)));
  return findAll(sec, tag('pre')).map((pre, i) => ({ lang: tabs[i] || 'Code', ...codeOf(pre) }));
}

/* a section we do not draw specially: kept as its own tree, drawn by Loose */
const loose = (sec) => ({ kind: 'loose', title: clean(textOf(find(sec, tag('h2')))), nodes: sec.c });

export function modelDoc(slug, model) {
  const rel = 'models/' + slug + '/' + model;
  const root = load(rel);
  const text = live(rel);
  const secs = sections(root);
  const fold = secs.find((s) => s.a && s.a['data-slot'] === 'fold') || secs[0];
  const nav = find(fold, tag('nav'));
  const crumbs = nav ? nav.c.filter(isN).filter((n) => n.t === 'a' || (n.t === 'span' && clean(textOf(n)) !== '/')).map((n) => (n.t === 'a' ? link(n) : { label: clean(textOf(n)) })) : [];
  const label = clean(textOf(find(fold, (n) => n.a && 'data-label' in n.a)));
  const doc = {
    slug, model, route: '/' + rel,
    crumbs, label,
    name: clean(textOf(find(fold, tag('h1')))),
    lede: clean(textOf(find(fold, slot('lede')))),
    actions: findAll(fold, slot('action')).map(link),
    links: findAll(fold, (n) => n.t === 'a' && n.a && n.a.href && !['action', 'more'].includes(n.a['data-slot'])).map(link),
    facts: [], quick: null, more: null, family: null, extra: [], band: null,
  };
  // the pill on hanzo.ai reads its label after scripts ran (e.g. "Hanzo · Enterprise"); keep what the captured page says otherwise
  if (text) { const h = text.indexOf(doc.name); doc.label = h > 0 && text[h - 1] !== doc.crumbs.at(-1)?.label ? text[h - 1] : label; }
  for (const sec of secs) {
    if (sec === fold) continue;
    const id = sec.a && sec.a.id;
    const h2 = clean(textOf(find(sec, tag('h2'))));
    if (id === 'specs') {
      doc.facts = factGroups(sec);
      // the rate is drawn by hanzo.ai's script; use what it printed, else the browser asks api.hanzo.ai
      doc.facts.forEach((g) => g.facts.forEach((f) => { if (f.value == null) { f.value = after(text, f.label) || null; f.live = true; } }));
    } else if (id === 'quickstart') {
      const key = find(sec, (n) => n.t === 'a' && n.a && n.a.href);
      doc.quick = { title: h2, key: key ? link(key) : null, samples: samples(sec) };
    } else if (id === 'family') {
      const grid = find(sec, slot('grid'));
      doc.family = { title: h2, links: (grid ? grid.c.filter(isN) : []).map((cell) => {
        const a = find(cell, (k) => k.t === 'a' && k.a && k.a.href);
        const bits = findAll(cell, slot('text')).filter((k) => k !== a).map((k) => clean(textOf(k))).filter(Boolean);
        return a ? { href: a.a.href, label: clean(textOf(a)), note: bits.join(' ') } : { href: null, label: bits[0] || '', note: bits.slice(1).join(' ') };
      }) };
    } else if (findAll(sec, (n) => n.a && n.a['data-slot'] === 'leaf').length || /^More from /.test(h2)) {
      const cards = findAll(sec, (n) => n.t === 'a' && n.a && n.a['data-slot'] === 'leaf').map(cardOf);
      const all = findAll(sec, (n) => n.t === 'a' && n.a && n.a.href && !(n.a['data-slot'] === 'leaf')).map(link);
      doc.more = { title: h2, cards, all: all[0] || null };
    } else if (/ via Hanzo AI$/.test(h2) && find(sec, slot('action'))) {
      doc.band = { title: h2, lede: clean(textOf(find(sec, tag('p')))), actions: findAll(sec, slot('action')).map(link) };
    } else doc.extra.push(loose(sec));
  }
  if (!doc.band) { // older pages keep the closing words without action slots
    const last = doc.extra.find((e) => / via Hanzo AI$/.test(e.title));
    if (last) { doc.extra = doc.extra.filter((e) => e !== last); doc.band = { title: last.title, lede: '', actions: [], nodes: last.nodes }; }
  }
  const fact = (l) => doc.facts.flatMap((g) => g.facts).find((f) => f.label === l);
  doc.id = (fact('Model ID') || {}).value || slug + '/' + model;
  doc.ctx = (fact('Context Window') || fact('Context reach') || {}).value || null;
  doc.tokens = tokens(doc.ctx) || (doc.ctx ? parseInt(doc.ctx.replace(/,/g, ''), 10) || null : null);
  doc.price = (fact('Price') || {}).value || null;
  doc.rate = rate(doc.price);
  doc.modalities = (fact('Modalities') || fact('Modality') || {}).value || null;
  doc.siblings = providerCards(slug).filter((c) => c.href !== doc.route);
  // the context as Hanzo's own shelf card prints it ("33K"), for the hero figure when the spec value is a sentence
  doc.cardCtx = (providerCards(slug).find((c) => c.href === doc.route) || {}).ctx || null;
  doc.provider = { slug, name: (crumbs[1] && crumbs[1].label) || slug, route: '/models/' + slug };
  return doc;
}

export function providerDoc(slug) {
  const rel = 'models/' + slug;
  const root = load(rel);
  const text = live(rel);
  const secs = sections(root);
  const fold = secs[0];
  const h1 = clean(textOf(find(fold, tag('h1'))));
  const ps = findAll(fold, tag('p')).map((p) => clean(textOf(p))).filter(Boolean);
  const code = find(fold, tag('pre'));
  const close = secs[secs.length - 1];
  const closeH = clean(textOf(find(close, tag('h2'))));
  const cards = providerCards(slug);
  const name = (text && text[1] && text[1] !== 'Models' ? text[1] : null) || h1.replace(/ Models via Hanzo AI$/, '');
  const all = textOf(fold);
  const has = (s) => (all.includes(s) ? s : null);
  return {
    slug, route: '/' + rel, name, h1,
    count: ps.find((p) => /models? available$/.test(p)) || '',
    lede: ps.find((p) => /^Access /.test(p)) || ps[1] || '',
    actions: findAll(fold, (n) => n.t === 'a' && n.a && n.a.href && n.a.href !== '/models').map(link),
    guest: {
      title: has('Instant Guest API Key'), key: has('guest_temp_key'), note: has('No account or sign up required'),
      prompt: ps.find((p) => /^Test right now/.test(p)) || '',
      label: has('cURL · instant guest request'),
      code: code ? textOf(code).replace(/\n{3,}/g, '\n\n').trim() : '',
    },
    cards,
    band: close && close !== fold ? { title: closeH, lede: clean(textOf(find(close, tag('p')))), actions: findAll(close, (n) => n.t === 'a' && n.a && n.a.href).map(link) } : null,
  };
}

/* Reachability (PLAN-COMPONENTS 2.15): every maker page and every model page, named as Hanzo names them (the maker's
   shelf card name, else the page's own title before " — "), for the collapsed "Every model" list on /models. */
let INDEX;
export function makerIndex() {
  if (INDEX) return INDEX;
  const models = MODEL_PARAMS();
  INDEX = PROVIDERS().map((slug) => {
    // hanzo.ai serves the catalogue itself at /models/stealth and labels that maker "stealth" in its crumbs
    let name = slug === 'stealth' ? slug : ((metaOf('/models/' + slug) || {}).title || slug).split(' — ')[0].replace(/ Models via Hanzo AI$/, '');
    if (slug !== 'stealth') try { name = providerDoc(slug).name || name; } catch { /* a maker page drawn differently (Enso's report) keeps its title */ }
    const cards = new Map(providerCards(slug).map((c) => [c.href, c.name]));
    const list = models.filter((m) => m.slug === slug).map(({ model }) => {
      const href = '/models/' + slug + '/' + model;
      const t = (metaOf(href) || {}).title || model;
      return { href, name: cards.get(href) || t.split(' — ')[0] };
    });
    return { slug, name, href: '/models/' + slug, models: list };
  });
  return INDEX;
}
