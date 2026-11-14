/* Server side: a blog post (/blog/<post>) read from Hanzo's captured page into blocks the reading room draws.
   Words, figures, code and links are Hanzo's; the GPQA dots come from the chart as hanzo.ai renders it (content/live). */
import fs from 'node:fs';
import path from 'node:path';
import { load, find, findAll, textOf, slot, tag, slugify, metaOf } from '../htmltree';
import type { Block, Chart, CodeLine, Doc, Dot, Piece, Sibling, Tree } from './types';

const ROOT = process.cwd();
const isN = (n: unknown): n is Tree => !!n && typeof n === 'object'; // a tag node, not a text leaf
const attrs = (n: Tree) => n.a ?? {}; // the slot and href tests below only pass nodes that carry attributes
const clean = (s?: string | null) => (s || '').replace(/\s+/g, ' ').trim();
export const SLUGS = () => Object.keys(JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'pages.json'), 'utf8')))
  .filter((p) => /^\/blog\/[^/]+$/.test(p)).map((p) => p.split('/')[2]);
export const meta = (slug: string) => metaOf('/blog/' + slug);

const isText = slot('text');
// a paragraph's own content: words, inline code (a nested text span), links, bold
function inline(n: Tree): Piece[] {
  return n.c.map((k): Piece => {
    if (!isN(k)) return k;
    if (k.t === 'a') return { a: k.a && k.a.href, t: clean(textOf(k)) };
    if (k.t === 'strong' || k.t === 'b') return { b: clean(textOf(k)) };
    if (k.t === 'span' && isText(k)) return { c: textOf(k) };
    return textOf(k);
  }).filter((k) => k !== '');
}
// <pre><code><span line><span data-code=kind>…</span>…</span>…</code></pre> → [[kind, text], …] per line
function code(pre: Tree): CodeLine[] {
  const c: Tree = find(pre, tag('code')) || pre;
  return c.c.filter(isN).map((line) => line.c.map((t): [string, string] => (isN(t) ? [(t.a && t.a['data-code']) || 'ink', textOf(t)] : ['ink', t.replace(/\n/g, '')]))
    .filter(([, s]) => s !== ''));
}
const lang = (lines: CodeLine[]) => { const s = lines.map((l) => l.map((t) => t[1]).join('')).join('\n'); return /\bconst\b|=>/.test(s) ? 'TypeScript' : /^(import|from) [\w.]+/m.test(s) ? 'Python' : 'Shell'; };
const cards = (grid: Tree) => grid.c.filter(isN).map((d) => findAll(d, isText).map((s) => clean(textOf(s))));
const empty = (n: string | Tree) => isN(n) && !clean(textOf(n)) && findAll(n, (k: Tree) => k !== n && k.t !== 'div').length === 0;

function blocks(sec: Tree, kind: string): Block[] {
  const out: Block[] = [];
  const walk = (n: string | Tree): void => {
    if (!isN(n)) return;
    if (n.t === 'h2') { const t = clean(textOf(n)); out.push({ k: 'h2', text: t, id: slugify(t) }); return; }
    if (n.t === 'pre') { const lines = code(n); const prev = out[out.length - 1]; const tab = { lang: lang(lines), lines }; if (prev && prev.k === 'code') prev.tabs.push(tab); else out.push({ k: 'code', tabs: [tab] }); return; }
    if (slot('grid')(n)) { out.push({ k: 'parts', cards: cards(n) }); return; }
    const acts = n.c.find((k) => isN(k) && k.c.length && k.c.every((a) => isN(a) && a.t === 'a' && slot('action')(a))) as Tree | undefined;
    if (acts) { out.push({ k: 'cta', label: clean(textOf(n.c.find((k) => isN(k) && isText(k)))), links: (acts.c as Tree[]).map((a) => ({ label: clean(textOf(a)), href: attrs(a).href, fill: 'data-fill' in attrs(a) })) }); return; }
    const refs = n.c.filter((k): k is Tree => isN(k) && k.t === 'a' && !!slot('text-link')(k));
    if (refs.length) { out.push({ k: 'sources', label: clean(textOf(n.c.find((k) => isN(k) && isText(k)))), links: refs.map((a) => ({ label: clean(textOf(a)), href: attrs(a).href })) }); return; }
    if (n.t === 'div' && n !== sec && empty(n)) { out.push({ k: 'figure', kind }); return; } // the live figure's mount (its svg or chart is drawn by the browser)
    if (n.t === 'span' && isText(n)) { out.push({ k: 'p', inl: inline(n) }); return; }
    n.c.forEach(walk);
  };
  walk(sec);
  return out;
}

/* the GPQA chart: each dot's own sentence from hanzo.ai, then its short label on the next line */
function frontier(slug: string): Chart | null {
  const f = path.join(ROOT, 'content', 'live', 'blog', slug + '.json');
  if (!fs.existsSync(f)) return null;
  const text: string[] = JSON.parse(fs.readFileSync(f, 'utf8')).text.map(clean);
  const dots: Dot[] = [];
  text.forEach((t, i) => {
    let m;
    const short = text[i + 1] || '';
    if ((m = /^(.+?) (\d+(?:\.\d+)?)%, a single model tested on the same (\d+) GPQA Diamond questions, \$([\d.,]+) per 1,000 of them$/.exec(t))) dots.push({ kind: 'run', said: t, short, acc: +m[2], cost: +m[4].replace(/,/g, '') });
    else if ((m = /^(.+?) (\d+(?:\.\d+)?)% on GPQA Diamond, reported by (.+?), (\d{4}-\d\d-\d\d); \$([\d.,]+) per 1,000 questions estimated from its list price\. (https?:\/\/\S+)$/.exec(t))) dots.push({ kind: 'reported', said: t, href: m[6], short, acc: +m[2], cost: +m[5].replace(/,/g, '') });
    else if ((m = /^(Enso.*?) at \$([\d.,]+) per 1,000, its cost on new questions: (\d+(?:\.\d+)?)% · questions it has seen$/.exec(t))) dots.push({ kind: 'enso', said: t, short, acc: +m[3], cost: +m[2].replace(/,/g, '') });
  });
  if (!dots.length) return null;
  const at = text.indexOf('GPQA Diamond %');
  return {
    dots,
    y: text.filter((t) => /^\d{2,3}$/.test(t)).map(Number),
    x: text.filter((t) => /^\$\d+$/.test(t)),
    yLabel: text[at] || '', xLabel: text[at + 1] || '',
  };
}

const sections = (root: Tree): Tree[] => root.c.flatMap((k) => (isN(k) && k.t === 'section' ? [k] : findAll(k, tag('section')).filter((s) => !findAll(s, tag('section')).some((x) => x !== s))));
const whenOf = (hero: Tree, back: Tree) => findAll(hero, (n: Tree) => n.t === 'span' && isText(n)).map((s) => clean(textOf(s))).filter((t) => t && t !== clean(textOf(back)));

// the post's film: Hanzo's own media for the first model the post is about (its chip, then its figures), if it has one
const FILMS = ['enso', 'kai', 'zen', 'iro', 'koe', 'koma', 'mori', 'oto', 'uta'];
const filmOf = (chip: string, names: string[]) => [chip, ...names].map((s) => (s || '').toLowerCase()).flatMap((s) => FILMS.filter((f) => new RegExp('\\b' + f + '\\b').test(s)))[0] || null;

/* the other posts, for "keep reading": each one's own title, chip, date and read time from its captured hero */
function siblings(slug: string): Sibling[] {
  return SLUGS().filter((s) => s !== slug).map((s) => {
    const [hero, ...rest] = sections(load('blog/' + s));
    const back = find(hero, (n: Tree) => n.t === 'a' && n.a && n.a.href);
    const when = whenOf(hero, back);
    const facts = rest.filter((x) => !find(x, tag('h2')) && find(x, slot('grid'))).flatMap((x) => cards(find(x, slot('grid'))));
    const chip = clean(textOf(find(hero, slot('chip'))));
    return { href: '/blog/' + s, film: filmOf(chip, facts.map((c) => c[1])), title: clean(textOf(find(hero, tag('h1')))), chip,
      date: when.find((t) => /\d{4}$/.test(t)) || '', read: when.find((t) => /min read$/.test(t)) || '' };
  });
}

export function post(slug: string): Doc {
  const root = load('blog/' + slug);
  const [hero, ...rest] = sections(root);
  const back: Tree = find(hero, (n: Tree) => n.t === 'a' && n.a && n.a.href);
  const when = whenOf(hero, back);
  const facts = rest.filter((s) => !find(s, tag('h2')) && find(s, slot('grid'))).flatMap((s) => cards(find(s, slot('grid'))));
  // the post's one live figure: hanzo.ai marks its chart with data-chart; the other draws a Game of Life board
  const kind = /data-chart="([\w-]+)"/.exec(fs.readFileSync(path.join(ROOT, 'content', 'pages', 'blog', slug + '.html'), 'utf8'))?.[1] || 'life';
  const body = rest.filter((s) => find(s, tag('h2'))).flatMap((s) => blocks(s, kind));
  const read = when.find((t) => /min read$/.test(t)) || '';
  return {
    slug, route: '/blog/' + slug, film: filmOf(clean(textOf(find(hero, slot('chip')))), facts.map((c) => c[1])),
    back: { label: clean(textOf(back)), href: attrs(back).href },
    chip: clean(textOf(find(hero, slot('chip')))),
    date: when.find((t) => /\d{4}$/.test(t)) || '', read, minutes: parseInt(read, 10) || 0,
    title: clean(textOf(find(hero, tag('h1')))), lede: clean(textOf(find(hero, slot('lede')))),
    facts, body, frontier: body.some((b) => b.k === 'figure' && b.kind === 'gpqa') ? frontier(slug) : null,
    next: siblings(slug),
  };
}
