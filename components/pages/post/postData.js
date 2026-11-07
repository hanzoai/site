/* Server side: a blog post (/blog/<post>) read from Hanzo's captured page into blocks the reading room draws.
   Words, figures, code and links are Hanzo's; the GPQA dots come from the chart as hanzo.ai renders it (content/live). */
import fs from 'node:fs';
import path from 'node:path';
import { load, find, findAll, textOf, slot, tag, isN, slugify, metaOf } from '../htmltree';

const ROOT = process.cwd();
const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
export const SLUGS = () => Object.keys(JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'pages.json'), 'utf8')))
  .filter((p) => /^\/blog\/[^/]+$/.test(p)).map((p) => p.split('/')[2]);
export const meta = (slug) => metaOf('/blog/' + slug);

const isText = slot('text');
// a paragraph's own content: words, inline code (a nested text span), links, bold
function inline(n) {
  return n.c.map((k) => {
    if (!isN(k)) return k;
    if (k.t === 'a') return { a: k.a && k.a.href, t: clean(textOf(k)) };
    if (k.t === 'strong' || k.t === 'b') return { b: clean(textOf(k)) };
    if (k.t === 'span' && isText(k)) return { c: textOf(k) };
    return textOf(k);
  }).filter((k) => k !== '');
}
// <pre><code><span line><span data-code=kind>…</span>…</span>…</code></pre> → [[kind, text], …] per line
function code(pre) {
  const c = find(pre, tag('code')) || pre;
  return c.c.filter(isN).map((line) => line.c.map((t) => (isN(t) ? [(t.a && t.a['data-code']) || 'ink', textOf(t)] : ['ink', t.replace(/\n/g, '')]))
    .filter(([, s]) => s !== ''));
}
const lang = (lines) => { const s = lines.map((l) => l.map((t) => t[1]).join('')).join('\n'); return /\bconst\b|=>/.test(s) ? 'TypeScript' : /^(import|from) [\w.]+/m.test(s) ? 'Python' : 'Shell'; };
const cards = (grid) => grid.c.filter(isN).map((d) => findAll(d, isText).map((s) => clean(textOf(s))));
const empty = (n) => isN(n) && !clean(textOf(n)) && findAll(n, (k) => k !== n && k.t !== 'div').length === 0;

function blocks(sec, kind) {
  const out = [];
  const walk = (n) => {
    if (!isN(n)) return;
    if (n.t === 'h2') { const t = clean(textOf(n)); out.push({ k: 'h2', text: t, id: slugify(t) }); return; }
    if (n.t === 'pre') { const lines = code(n); const prev = out[out.length - 1]; const tab = { lang: lang(lines), lines }; if (prev && prev.k === 'code') prev.tabs.push(tab); else out.push({ k: 'code', tabs: [tab] }); return; }
    if (slot('grid')(n)) { out.push({ k: 'parts', cards: cards(n) }); return; }
    const acts = n.c.find((k) => isN(k) && k.c.length && k.c.every((a) => isN(a) && a.t === 'a' && slot('action')(a)));
    if (acts) { out.push({ k: 'cta', label: clean(textOf(n.c.find((k) => isN(k) && isText(k)))), links: acts.c.map((a) => ({ label: clean(textOf(a)), href: a.a.href, fill: 'data-fill' in a.a })) }); return; }
    const refs = n.c.filter((k) => isN(k) && k.t === 'a' && slot('text-link')(k));
    if (refs.length) { out.push({ k: 'sources', label: clean(textOf(n.c.find((k) => isN(k) && isText(k)))), links: refs.map((a) => ({ label: clean(textOf(a)), href: a.a.href })) }); return; }
    if (n.t === 'div' && n !== sec && empty(n)) { out.push({ k: 'figure', kind }); return; } // the live figure's mount (its svg or chart is drawn by the browser)
    if (n.t === 'span' && isText(n)) { out.push({ k: 'p', inl: inline(n) }); return; }
    n.c.forEach(walk);
  };
  walk(sec);
  return out;
}

/* the GPQA chart: each dot's own sentence from hanzo.ai, then its short label on the next line */
function frontier(slug) {
  const f = path.join(ROOT, 'content', 'live', 'blog', slug + '.json');
  if (!fs.existsSync(f)) return null;
  const text = JSON.parse(fs.readFileSync(f, 'utf8')).text.map(clean);
  const dots = [];
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

export function post(slug) {
  const root = load('blog/' + slug);
  const secs = root.c.flatMap((k) => (isN(k) && k.t === 'section' ? [k] : findAll(k, tag('section')).filter((s) => !findAll(s, tag('section')).some((x) => x !== s))));
  const [hero, ...rest] = secs;
  const back = find(hero, (n) => n.t === 'a' && n.a && n.a.href);
  const when = findAll(hero, (n) => n.t === 'span' && isText(n)).map((s) => clean(textOf(s))).filter((t) => t && t !== clean(textOf(back)));
  const facts = rest.filter((s) => !find(s, tag('h2')) && find(s, slot('grid'))).flatMap((s) => cards(find(s, slot('grid'))));
  // the post's one live figure: hanzo.ai marks its chart with data-chart; the other draws a Game of Life board
  const kind = /data-chart="([\w-]+)"/.exec(fs.readFileSync(path.join(ROOT, 'content', 'pages', 'blog', slug + '.html'), 'utf8'))?.[1] || 'life';
  const body = rest.filter((s) => find(s, tag('h2'))).flatMap((s) => blocks(s, kind));
  const read = when.find((t) => /min read$/.test(t)) || '';
  return {
    slug, route: '/blog/' + slug,
    back: { label: clean(textOf(back)), href: back.a.href },
    chip: clean(textOf(find(hero, slot('chip')))),
    date: when.find((t) => /\d{4}$/.test(t)) || '', read, minutes: parseInt(read, 10) || 0,
    title: clean(textOf(find(hero, tag('h1')))), lede: clean(textOf(find(hero, slot('lede')))),
    facts, body, frontier: body.some((b) => b.k === 'figure' && b.kind === 'gpqa') ? frontier(slug) : null,
  };
}
