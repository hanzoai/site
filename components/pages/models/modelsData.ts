/* Server side: the /models family read from Hanzo's captured pages (content/pages) and what hanzo.ai showed once its
   scripts ran (content/live: the live rates). Every figure here is Hanzo's; nothing is computed except unit parsing. */
import fs from 'node:fs';
import path from 'node:path';
import { load, find, findAll, textOf, slot, tag, isN } from '../htmltree';
import type { Band, Card, Code, Crumb, FactGroup, Leaf, Link, Loose, Maker, ModelDoc, PageMeta, ProviderDoc, Rate, Sample, Sibling, Tree } from './types';

const ROOT = process.cwd();
let IDX: Record<string, PageMeta> | undefined;
const idx = () => (IDX ||= JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'pages.json'), 'utf8')) as Record<string, PageMeta>);
export const metaOf = (route: string): PageMeta | undefined => idx()[route];

export const PROVIDERS = () => Object.keys(idx()).filter((p) => /^\/models\/[^/]+$/.test(p)).map((p) => p.split('/')[2]);
export const MODEL_PARAMS = () => Object.keys(idx()).filter((p) => /^\/models\/[^/]+\/[^/]+$/.test(p)).map((p) => { const [, , slug, model] = p.split('/'); return { slug, model }; });
export const exists = (route: string) => !!idx()[route];

function live(rel: string): string | null {
  const f = path.join(ROOT, 'content', 'live', rel + '.json');
  return fs.existsSync(f) ? (JSON.parse(fs.readFileSync(f, 'utf8')) as { text: string }).text : null;
}
const clean = (s: string | null | undefined) => (s || '').replace(/\s+/g, ' ').trim();

/* "200K" -> 200000, "1M" -> 1000000 */
export const tokens = (s: string | null | undefined) => { const m = /^([\d.]+)\s*([KM])$/i.exec(clean(s)); return m ? Math.round(parseFloat(m[1]) * (m[2].toUpperCase() === 'M' ? 1e6 : 1e3)) : null; };
/* "$5.57 in · $27.83 out, per million tokens" -> { in: 5.57, out: 27.83 }; "Free" is 0; "No published rate" is null */
export function rate(s: string | null | undefined): Rate | null {
  if (!s) return null;
  const m = /^(Free|\$[\d.,]+) in · (Free|\$[\d.,]+) out/.exec(s);
  if (!m) return null;
  const n = (x: string) => (x === 'Free' ? 0 : parseFloat(x.slice(1).replace(/,/g, '')));
  return { in: n(m[1]), out: n(m[2]) };
}
const after = (text: string | null, label: string) => { const i = text ? text.indexOf(label) : -1; return text && i >= 0 ? text[i + 1] : null; };

/* top-level sections of a captured page */
function sections(root: Tree) {
  const out: Tree[] = [];
  const walk = (n: Leaf) => { if (typeof n === 'string') return; if (n.t === 'section') { out.push(n); return; } n.c.forEach(walk); };
  walk(root);
  return out;
}
/* a node's child nodes, the text left out */
const subs = (n: Tree) => n.c.filter((k): k is Tree => isN(k));
const link = (a: Tree): Link => ({ label: clean(textOf(a)), href: a.a?.href ?? '' });

/* the cards on a provider page: name, context, the first lines of its description, its modalities */
function cardOf(a: Tree): Card {
  const p: Tree | undefined = find(a, tag('p'));
  const texts: Tree[] = findAll(a, slot('text'));
  const spans = texts.filter((s) => s.t === 'span').map((s) => clean(textOf(s))).filter(Boolean);
  // a card with no picture shows the maker's initial first ("d"): the name is the first span longer than one letter
  const isId = (t: string) => /^~?[\w.-]+\/[^\s]+$/.test(t);
  const name = spans.find((t) => t.length > 1 && !isId(t)) || spans[0] || '';
  const ctx = spans.find((s, i) => i > 0 && /^[\d.]+[KM]$/.test(s)) || null;
  const last = subs(a).slice(-1)[0];
  const lastTexts: Tree[] = last && last !== p && last.t === 'div' ? findAll(last, slot('text')) : [];
  const tags = lastTexts.map((s) => clean(textOf(s))).filter(Boolean);
  // hanzo.ai prints each card's model id in mono under its name (8 Nov; "~maker/x-latest" for an alias); older captures have none
  const mid = spans.find(isId);
  return { href: a.a?.href ?? '', name, ctx, desc: p ? clean(textOf(p)) : '', tags, ...(mid ? { mid } : {}) };
}

const providerCache = new Map<string, Sibling[]>();
export function providerCards(slug: string): Sibling[] {
  const cached = providerCache.get(slug);
  if (cached) return cached;
  let found: Card[] = [];
  try {
    const root: Tree = load('models/' + slug);
    const leaves: Tree[] = findAll(root, (n: Tree) => n.t === 'a' && n.a && n.a['data-slot'] === 'leaf' && n.a.href && n.a.href.startsWith('/models/' + slug + '/'));
    found = leaves.map(cardOf);
  } catch { /* a provider without a page */ }
  // each sibling's live rate, as hanzo.ai printed it
  const cards: Sibling[] = found.map((c) => { const t = live(c.href.slice(1)); const pr = after(t, 'Price'); return { ...c, price: pr || null, rate: rate(pr), tokens: tokens(c.ctx), id: c.href.split('/').slice(2).join('/') }; });
  // a model hanzo.ai lists that this rebuild has no page for (one added since the content capture, e.g. a :free
  // variant) opens Hanzo's own page in a new tab rather than a 404 here
  cards.forEach((c) => { if (!exists(c.href)) c.href = 'https://hanzo.ai' + c.href; });
  providerCache.set(slug, cards);
  return cards;
}

/* the facts grids of a specs section, each under its own heading */
function factGroups(sec: Tree): FactGroup[] {
  const groups: FactGroup[] = [];
  let cur: FactGroup | null = null;
  const open = (title: string | null) => { const g: FactGroup = { title, notes: [], facts: [] }; cur = g; groups.push(g); return g; };
  const walk = (n: Leaf) => {
    if (typeof n === 'string') { if (clean(n)) (cur || open(null)).notes.push(clean(n)); return; }
    if (n.t === 'h2') { open(clean(textOf(n))); return; }
    if (n.a && n.a['data-slot'] === 'grid' && !n.c.some((k) => typeof k !== 'string' && find(k, (x: Tree) => x.t === 'h2' || (x.a && x.a['data-slot'] === 'grid')))) {
      const g = !cur || cur.facts.length ? open(null) : cur;
      g.facts = subs(n).map((cell) => {
        const parts = subs(cell);
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
export function codeOf(pre: Tree): Code {
  const toks: [string, string][] = [];
  const walk = (n: Leaf, kind: string) => {
    if (typeof n === 'string') { toks.push([kind, n]); return; }
    const k = (n.a && n.a['data-code']) || kind;
    n.c.forEach((c) => walk(c, k));
  };
  walk(pre, 'ink');
  const lines: [string, string][][] = [[]];
  toks.forEach(([k, s]) => s.split('\n').forEach((part, j) => { if (j) lines.push([]); if (part) lines[lines.length - 1].push([k, part]); }));
  while (lines.length && !lines[lines.length - 1].length) lines.pop();
  return { lines, text: lines.map((l) => l.map((t) => t[1]).join('')).join('\n') };
}
/* code samples: tabs, then each sample */
function samples(sec: Tree): Sample[] {
  const buttons: Tree[] = findAll(sec, (n: Tree) => n.t === 'button' && n.a && /^tab-/.test(n.a.id || ''));
  const tabs = buttons.map((b) => clean(textOf(b)));
  const pres: Tree[] = findAll(sec, tag('pre'));
  return pres.map((pre, i) => ({ lang: tabs[i] || 'Code', ...codeOf(pre) }));
}

/* a section we do not draw specially: kept as its own tree, drawn by Loose */
const loose = (sec: Tree): Loose => ({ kind: 'loose', title: clean(textOf(find(sec, tag('h2')))), nodes: sec.c });

export function modelDoc(slug: string, model: string): ModelDoc {
  const rel = 'models/' + slug + '/' + model;
  const root: Tree = load(rel);
  const text = live(rel);
  const secs = sections(root);
  const fold = secs.find((s) => s.a && s.a['data-slot'] === 'fold') || secs[0];
  const nav: Tree | undefined = find(fold, tag('nav'));
  const crumbs: Crumb[] = nav ? subs(nav).filter((n) => n.t === 'a' || (n.t === 'span' && clean(textOf(n)) !== '/')).map((n) => (n.t === 'a' ? link(n) : { label: clean(textOf(n)) })) : [];
  const label = clean(textOf(find(fold, (n: Tree) => n.a && 'data-label' in n.a)));
  const doc: ModelDoc = {
    slug, model, route: '/' + rel,
    crumbs, label,
    name: clean(textOf(find(fold, tag('h1')))),
    lede: clean(textOf(find(fold, slot('lede')))),
    actions: findAll(fold, slot('action')).map(link),
    links: findAll(fold, (n: Tree) => n.t === 'a' && n.a && n.a.href && !['action', 'more'].includes(n.a['data-slot'])).map(link),
    facts: [], quick: null, more: null, family: null, extra: [], band: null,
    // set below, once the sections are read
    id: '', ctx: null, tokens: null, price: null, rate: null, modalities: null, siblings: [], cardCtx: null,
    provider: { slug, name: '', route: '' },
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
      const key: Tree | undefined = find(sec, (n: Tree) => n.t === 'a' && n.a && n.a.href);
      // hanzo.ai prints the rate under the samples ("<rate>. A native decision writes…"): keep the words after it
      // (the reader keeps no data-price, so: the text span whose own first child is the "…" its script fills)
      const dots = (k: Leaf | undefined) => !!k && typeof k !== 'string' && k.t === 'span' && textOf(k) === '…';
      const pr = find(sec, (n: Tree) => n.t === 'span' && n.a && n.a['data-slot'] === 'text' && dots(n.c.filter((k) => typeof k !== 'string' || k.trim())[0])) as Tree | undefined;
      const note = pr ? pr.c.filter((k) => !dots(k)).map(textOf).join('').replace(/\s+/g, ' ').trimEnd() : '';
      doc.quick = { title: h2, key: key ? link(key) : null, samples: samples(sec), price: !!pr, note };
    } else if (id === 'family') {
      const grid: Tree | undefined = find(sec, slot('grid'));
      doc.family = { title: h2, links: (grid ? subs(grid) : []).map((cell) => {
        const a = find(cell, (k: Tree) => k.t === 'a' && k.a && k.a.href) as Tree | undefined;
        const texts: Tree[] = findAll(cell, slot('text'));
        const bits = texts.filter((k) => k !== a).map((k) => clean(textOf(k))).filter(Boolean);
        return a ? { href: a.a?.href ?? null, label: clean(textOf(a)), note: bits.join(' ') } : { href: null, label: bits[0] || '', note: bits.slice(1).join(' ') };
      }) };
    } else if (findAll(sec, (n: Tree) => n.a && n.a['data-slot'] === 'leaf').length || /^More from /.test(h2)) {
      const cards = findAll(sec, (n: Tree) => n.t === 'a' && n.a && n.a['data-slot'] === 'leaf').map(cardOf);
      const all = findAll(sec, (n: Tree) => n.t === 'a' && n.a && n.a.href && !(n.a['data-slot'] === 'leaf')).map(link);
      doc.more = { title: h2, cards, all: all[0] || null };
    } else if (/ via Hanzo AI$/.test(h2) && find(sec, slot('action'))) {
      doc.band = { title: h2, lede: clean(textOf(find(sec, tag('p')))), actions: findAll(sec, slot('action')).map(link) };
    } else doc.extra.push(loose(sec));
  }
  if (!doc.band) { // older pages keep the closing words without action slots
    const last = doc.extra.find((e) => / via Hanzo AI$/.test(e.title));
    if (last) { doc.extra = doc.extra.filter((e) => e !== last); doc.band = { title: last.title, lede: '', actions: [], nodes: last.nodes }; }
  }
  const fact = (l: string) => doc.facts.flatMap((g) => g.facts).find((f) => f.label === l);
  doc.id = fact('Model ID')?.value || slug + '/' + model;
  doc.ctx = (fact('Context Window') || fact('Context reach'))?.value || null;
  doc.tokens = tokens(doc.ctx) || (doc.ctx ? parseInt(doc.ctx.replace(/,/g, ''), 10) || null : null);
  doc.price = fact('Price')?.value || null;
  doc.rate = rate(doc.price);
  doc.modalities = (fact('Modalities') || fact('Modality'))?.value || null;
  doc.siblings = providerCards(slug).filter((c) => c.href !== doc.route);
  // the context as Hanzo's own shelf card prints it ("33K"), for the hero figure when the spec value is a sentence
  doc.cardCtx = providerCards(slug).find((c) => c.href === doc.route)?.ctx || null;
  doc.provider = { slug, name: (crumbs[1] && crumbs[1].label) || slug, route: '/models/' + slug };
  return doc;
}

export function providerDoc(slug: string): ProviderDoc {
  const rel = 'models/' + slug;
  const root: Tree = load(rel);
  const text = live(rel);
  const secs = sections(root);
  const fold = secs[0];
  const h1 = clean(textOf(find(fold, tag('h1'))));
  const ps = findAll(fold, tag('p')).map((p: Tree) => clean(textOf(p))).filter(Boolean);
  const code: Tree | undefined = find(fold, tag('pre'));
  const close = secs[secs.length - 1];
  const closeH = clean(textOf(find(close, tag('h2'))));
  const cards = providerCards(slug);
  const name = (text && text[1] && text[1] !== 'Models' ? text[1] : null) || h1.replace(/ Models via Hanzo AI$/, '');
  const all = textOf(fold);
  const has = (s: string) => (all.includes(s) ? s : null);
  return {
    slug, route: '/' + rel, name, h1,
    count: ps.find((p) => /models? available$/.test(p)) || '',
    lede: ps.find((p) => /^Access /.test(p)) || ps[1] || '',
    actions: findAll(fold, (n: Tree) => n.t === 'a' && n.a && n.a.href && n.a.href !== '/models').map(link),
    guest: {
      title: has('Instant Guest API Key'), key: has('guest_temp_key'), note: has('No account or sign up required'),
      prompt: ps.find((p) => /^Test right now/.test(p)) || '',
      label: has('cURL · instant guest request'),
      code: code ? textOf(code).replace(/\n{3,}/g, '\n\n').trim() : '',
    },
    cards,
    band: close && close !== fold ? { title: closeH, lede: clean(textOf(find(close, tag('p')))), actions: findAll(close, (n: Tree) => n.t === 'a' && n.a && n.a.href).map(link) } : null,
  };
}

/* Reachability (PLAN-COMPONENTS 2.15): every maker page and every model page, named as Hanzo names them (the maker's
   shelf card name, else the page's own title before " — "), for the collapsed "Every model" list on /models. */
let INDEX: Maker[] | undefined;
export function makerIndex(): Maker[] {
  if (INDEX) return INDEX;
  const models = MODEL_PARAMS();
  INDEX = PROVIDERS().map((slug) => {
    // hanzo.ai serves the catalogue itself at /models/stealth and labels that maker "stealth" in its crumbs
    let name = slug === 'stealth' ? slug : (metaOf('/models/' + slug)?.title || slug).split(' — ')[0].replace(/ Models via Hanzo AI$/, '');
    if (slug !== 'stealth') try { name = providerDoc(slug).name || name; } catch { /* a maker page drawn differently (Enso's report) keeps its title */ }
    const cards = new Map(providerCards(slug).map((c) => [c.href, c.name]));
    const list = models.filter((m) => m.slug === slug).map(({ model }) => {
      const href = '/models/' + slug + '/' + model;
      const t = metaOf(href)?.title || model;
      return { href, name: cards.get(href) || t.split(' — ')[0] };
    });
    return { slug, name, href: '/models/' + slug, models: list };
  });
  return INDEX;
}
