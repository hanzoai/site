/* Server side: one benchmark page (/benchmarks/<slug>, 27 of them) read from Hanzo's captured HTML, flattened into
   blocks the template re-draws, plus the chart hanzo.ai draws in the browser (content/live). The chart's numbers are
   parsed from Hanzo's own table cells; its labels are Hanzo's strings, never ours. */
// content files are read at render time; the GPQA list-price date follows hanzo.ai (Nov 7 on 8 Nov)
import fs from 'node:fs';
import path from 'node:path';
import { load, find, findAll, textOf, tag, isN } from '../htmltree';
import type { Branch, Child, Meta } from '../htmltree';
import type { Block, Grid, Measure, Column, TrendPoint, VersusRow, BarsChart, Chart, Section, BenchDoc } from './types';

/* a versus row carries its source cells (r) only while the labels are being settled */
interface Settled extends VersusRow { r?: string[] }

const ROOT = process.cwd();
let IDX: Record<string, Meta> | undefined;
const idx = (): Record<string, Meta> => (IDX ||= JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'pages.json'), 'utf8')));
export const metaOf = (route: string) => idx()[route];
export const MEMBERS = () => Object.keys(idx()).filter((p) => /^\/benchmarks\/[^/]+$/.test(p)).map((p) => p.split('/')[2]);
const clean = (s?: string | null) => (s || '').replace(/\s+/g, ' ').trim();
const txt = (n: Child | null | undefined) => clean(textOf(n));
const live = (slug: string): string[] => {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'live', 'benchmarks', slug + '.json'), 'utf8')).text.map(clean); } catch { return []; }
};

/* the page as a flat list of blocks, in reading order */
const BLOCK = new Set(['p', 'h1', 'h2', 'h3', 'table', 'dl', 'pre', 'ul', 'ol']);
function flatten(n: Branch, out: Block[] = []): Block[] {
  for (const c of n.c) {
    if (!isN(c)) { if (clean(c)) out.push({ t: 'text', s: clean(c) }); continue; }
    if (BLOCK.has(c.t) || c.t === 'code' || c.t === 'a') out.push({ t: c.t, n: c });
    else if (c.t === 'span' && c.a && c.a['data-slot'] === 'text') out.push({ t: 'span', n: c });
    else flatten(c, out);
  }
  return out;
}

/* a table as rows of strings */
function grid(tb: Branch): Grid {
  const head = findAll(tb, tag('th')).map((th) => txt(th));
  // a row's name without its "run" link (gpqa: <strong>enso</strong> <a>run</a>)
  const bare = (n: Child): string => (isN(n) ? (n.t === 'a' ? '' : n.c.map(bare).join(' ')) : n);
  const rows = findAll(tb, tag('tr')).filter((r) => find(r, tag('td'))).map((r) => findAll(r, tag('td')).map((td, j) => (j ? txt(td) : clean(bare(td)) || txt(td))));
  return { head, rows };
}

/* hanzo.ai re-reads some figures when the page opens (gpqa re-prices a run at today's list); take the live figure
   where a row's cells line up with the live page and exactly one figure moved.
   shortcut: needs two exact cells before the moved one (live text is de-duplicated); widen if a page re-reads more */
function freshen(tb: Branch, liveText: string[]) {
  for (const tr of findAll(tb, tag('tr'))) {
    const tds = findAll(tr, tag('td'));
    if (!tds.length) continue;
    const k = liveText.indexOf(clean(textOf(tds[0].c.find((c) => !isN(c) || c.t === 'strong') || tds[0])));
    if (k < 0) continue;
    for (let j = 1; j < tds.length; j++) {
      const was = txt(tds[j]), now = liveText[k + j];
      if (was === now) continue;
      const a = measure(was), b = now && measure(now);
      if (j >= 3 && a && b && a.dim === b.dim && !tds[j].c.some(isN)) tds[j].c = [now];
      break;
    }
  }
}

/* numbers inside Hanzo's cells: "92.9%", "$5.58", "0.13 ms", "477 bytes", "~1 MB", "184 of 198", "99.9 [ 99.8 , 99.9 ]" */
const UNIT: Record<string, readonly [string, number]> = { ns: ['t', 1e-9], 'µs': ['t', 1e-6], us: ['t', 1e-6], ms: ['t', 1e-3], s: ['t', 1], bytes: ['b', 1], B: ['b', 1], KB: ['b', 1e3], MB: ['b', 1e6], GB: ['b', 1e9], TB: ['b', 1e12] };
const NUM = /(\$)?(\d[\d,]*(?:\.\d+)?|\.\d+)\s*(%|×|ns|µs|us|ms|s|bytes|B|KB|MB|GB|TB|tok\/s|t\/s)?(?![\w])/;
export function measure(s: string, loose = false): Measure | null {
  const c = String(s).replace(/^[~<>≈≤≥\s]+/, '');
  const m = NUM.exec(c);
  if (!m || (!loose && m.index > 0 && !(m.index === 1 && c[0] === '$'))) return null;
  if (/\d{4}-\d\d-\d\d|[A-Z][a-z]{2} \d{1,2}, \d{4}/.test(c)) return null; // a date, not a measurement
  const v = parseFloat(m[2].replace(/,/g, ''));
  const u = m[1] ? '$' : m[3] || '';
  const [dim, k] = UNIT[u] || [u, 1];
  return Number.isFinite(v) ? { v: v * k, dim } : null;
}

/* the columns of a table that can be drawn: two or more cells measuring the same kind of thing */
function drawable(g: Grid): Column[] {
  return g.head.map((h, j): Column | null => {
    if (j === 0 || /measured|date|tag|status|result|verdict|interval|subject|metric|^n$|^k$|prompt tokens/i.test(h)) return null;
    const ms = g.rows.map((r) => measure(r[j] || ''));
    const dims: Record<string, number> = {};
    ms.forEach((m) => { if (m) dims[m.dim] = (dims[m.dim] || 0) + 1; });
    const [dim, n] = Object.entries(dims).sort((a, b) => b[1] - a[1])[0] || [];
    return n >= 2 ? { j, name: h, dim, vals: ms.map((m) => (m && m.dim === dim ? m.v : null)) } : null;
  }).filter((c): c is Column => c !== null);
}

/* the chart this page draws: its own trend (the History hanzo.ai plots), its own comparison, or its own table as bars */
function chartOf(blocks: Block[], liveText: string[], slug: string): Chart | null {
  const tables = blocks.filter((b) => b.t === 'table').map((b) => ({ g: grid(b.n!), b }));
  const titleOf = (b: Block) => { const i = blocks.indexOf(b); for (let k = i - 1; k >= 0; k--) if (['h2', 'h3'].includes(blocks[k].t)) return txt(blocks[k].n); return ''; };
  // 1. a trend: hanzo.ai plots the first metric of the History table over the revisions measured
  const hist = tables.find((t) => t.g.head[0] === 'Measured');
  if (hist) {
    const h = liveText.indexOf('History');
    const end = liveText.indexOf('Measured', h);
    const drawn = h >= 0 && end > h ? liveText.slice(h + 2, end) : [];
    const ticks = drawn.filter((t: string) => /^\d+(?:\.\d+)?%$/.test(t));
    const dates = drawn.filter((t: string) => /^\d\d-\d\d$/.test(t));
    const pts = drawn.filter((t: string) => /: \d+(?:\.\d+)?%, [A-Z][a-z]{2} \d{1,2}, \d{4}$/.test(t));
    if (pts.length >= 2) {
      const col = (k: string) => hist.g.head.indexOf(k);
      const metric = hist.g.rows.find((r) => pts[pts.length - 1].includes(r[col('Value')]))?.[col('Metric')] || '';
      const base = hist.g.rows.find((r) => r[col('Metric')] === metric)?.[col('Baseline')] || '';
      const bm = measure(base, true);
      return {
        kind: 'trend', title: 'History', metric, ticks, dates,
        lo: parseFloat(ticks[0]), hi: parseFloat(ticks[ticks.length - 1]),
        base: bm ? { s: base, v: bm.v } : null,
        points: pts.map((s): TrendPoint => {
          const [who, rest] = s.split(/: (?=\d)/);
          const [val, ...when] = rest.split(', ');
          return { s, who, val, when: when.join(', '), v: parseFloat(val) };
        }),
      };
    }
  }
  // 2. a comparison the page makes itself: Hanzo's figure against a published one, a value against its baseline,
  //    or Hanzo's column against the other engine's
  for (const t of tables) {
    const H = t.g.head, col = (k: string) => H.indexOf(k);
    let mine = -1, other = H.findIndex((h, j) => j > 0 && /published|baseline/i.test(h));
    if (other > 0) mine = /baseline/i.test(H[other]) ? col('Value') : other - 1;
    else {
      const cols = drawable(t.g);
      const m = cols.find((c) => /hanzo/i.test(c.name));
      const o = m && cols.find((c) => c !== m && c.dim === m.dim);
      if (m && o) { mine = m.j; other = o.j; }
    }
    if (mine < 1 || other < 1) continue;
    const pair = (r: string[]) => { const a = measure(r[mine] || ''), b = measure(r[other] || '', true); return a && b && a.dim === b.dim ? { a: { s: r[mine], v: a.v }, b: { s: r[other], v: b.v } } : null; };
    const metric = col('Metric');
    const first = metric >= 0 && t.g.rows[0] ? t.g.rows[0][metric] : null;
    // a long history keeps its first metric (zen-6's nine decode speedups); a short one keeps every row
    const same = first != null && t.g.rows.filter((r) => r[metric] === first && pair(r)).length >= 3;
    const rows = t.g.rows.filter((r) => !same || r[metric] === first).map((r): Settled | null => {
      const p = pair(r);
      return p && { label: metric >= 0 ? (same ? r[col('Subject')] : r[metric]) : r[0], ...p, r };
    }).filter((x): x is Settled => x !== null);
    // rows that share a first cell (inference: CUDA, CUDA, CUDA) are named by every setting before the figures
    if (new Set(rows.map((x) => x.label)).size < rows.length) rows.forEach((x) => { x.label = x.r!.slice(0, Math.min(mine, other)).join(' · '); });
    rows.forEach((x) => delete x.r);
    if (rows.length) return { kind: 'versus', title: same && first != null ? first : titleOf(t.b), heads: [H[mine], H[other]], rows };
  }
  // 3. the page's own table as bars, every drawable column a view; the first table whose figures differ wins
  let pick: BarsChart | null = null;
  for (const t of tables) {
    // one row reads across: its columns become the bars (LoCoMo subject scope: scoped F1 against the flat index)
    const g: Grid = t.g.rows.length === 1 ? { head: [t.g.head[0], t.g.rows[0][0]], rows: t.g.head.slice(1).map((h, j) => [h, t.g.rows[0][j + 1]]).filter((r: string[]) => !/^n$/i.test(r[0])) } : t.g;
    const label = g.head.indexOf('Metric');
    const cols = drawable(g);
    if (!cols.length) continue;
    const c: BarsChart = { kind: 'bars', title: titleOf(t.b), head0: g.head[Math.max(0, label)], cols: cols.map((x) => ({ name: x.name, dim: x.dim })), rows: g.rows.map((r, i) => ({ label: r[Math.max(0, label)], cells: cols.map((x) => ({ s: r[x.j], v: x.vals[i] })) })) };
    const vs = cols[0].vals.filter((v) => v != null);
    if (new Set(vs).size > 1) return c;
    pick ||= c;
  }
  if (pick) return pick;
  // 4. a single figure: the page's one measured row, read out
  const one = tables.find((t) => t.g.rows.length === 1);
  if (one) { const j = one.g.rows[0].findIndex((c, k) => k > 0 && measure(c)); if (j > 0) return { kind: 'one', title: titleOf(one.b), label: one.g.rows[0][0], head: one.g.head[j], s: one.g.rows[0][j] }; }
  return null;
}

/* a page's one headline figure, as Hanzo wrote it: its latest result, else its card's figure on Hanzo's own row
   (the first row naming Hanzo or one of its models, else the first row) */
export function figureOf(d: BenchDoc): string {
  if (d.latest[0]) return d.latest[0].parts[0] || '';
  const c = d.chart;
  if (!c) return '';
  if (c.kind === 'one') return c.s;
  const rows = c.kind === 'trend' ? c.points.map((p) => [p.who, p.val]) : c.kind === 'versus' ? c.rows.map((r) => [r.label, r.a.s]) : c.rows.map((r) => [r.label, r.cells[0].s]);
  return (rows.find((r) => /hanzo|\bzen|enso|\bkai/i.test(String(r[0]))) || rows[0] || [])[1] || '';
}

const DOCS: Record<string, BenchDoc> = {};
export function benchDoc(slug: string): BenchDoc {
  if (DOCS[slug]) return DOCS[slug];
  const root = load('benchmarks/' + slug);
  const main = find(root, tag('main')) || root;
  const liveText = live(slug);
  findAll(main, tag('table')).forEach((tb) => freshen(tb, liveText));
  const blocks = flatten(main);
  const i1 = blocks.findIndex((b) => b.t === 'h1');
  const head = blocks.slice(0, i1);
  const crumb = head.find((b) => b.t === 'p');
  const kicker = head.find((b) => b.t === 'span');
  const lede = blocks[i1 + 1] && blocks[i1 + 1].t === 'p' ? blocks[i1 + 1] : null;
  let rest = blocks.slice(i1 + (lede ? 2 : 1));
  // the closing parts of a paper page: "Build on Hanzo Cloud", previous / next, related, every other benchmark
  const ctaAt = rest.findIndex((b) => b.t === 'p' && txt(b.n) === 'Hanzo AI Cloud');
  const tail = ctaAt >= 0 ? rest.slice(ctaAt) : [];
  if (ctaAt >= 0) rest = rest.slice(0, ctaAt);
  const firstH2 = rest.findIndex((b) => b.t === 'h2');
  const intro = firstH2 < 0 ? rest : rest.slice(0, firstH2);
  const sections: Section[] = [];
  for (const b of firstH2 < 0 ? [] : rest.slice(firstH2)) {
    if (b.t === 'h2') sections.push({ title: txt(b.n), id: (b.n!.a && b.n!.a.id) || null, blocks: [] });
    else sections[sections.length - 1].blocks.push(b);
  }
  const latest = sections.find((s) => s.title === 'Latest');
  const all = [...intro, ...sections.flatMap((s) => s.blocks)];
  const links = findAll(main, (n) => n.t === 'a' && n.a && /^https:\/\/api\.hanzo\.ai\/v1\/research\/runs/.test(n.a.href || '')).map((a) => a.a!.href);
  const source = links.find((h) => !/[?&]id=/.test(h)) || links.find((h) => /[?&]id=/.test(h) && links.filter((x) => /[?&]id=/.test(x)).length === 1) || null;
  const code = intro.find((b) => b.t === 'code') || sections.find((s) => s.title === 'Reproduce')?.blocks.find((b) => b.t === 'p' || b.t === 'code');
  const doc: BenchDoc = {
    slug,
    kind: latest ? 'result' : 'paper',
    crumb: crumb ? crumb.n : null,
    kicker: kicker ? kicker.n : null,
    title: txt(blocks[i1].n),
    lede: lede ? lede.n : null,
    intro: intro.map((b) => ({ t: b.t, n: b.n, s: b.s })),
    latest: latest ? latest.blocks.filter((b) => b.t === 'a').map((b) => ({ href: b.n!.a!.href, parts: findAll(b.n, tag('span')).map(txt) })) : [],
    sections: sections.filter((s) => s !== latest).map((s) => ({ ...s, blocks: s.blocks.map((b) => ({ t: b.t, n: b.n, s: b.s })) })),
    tail: tail.map((b) => ({ t: b.t, n: b.n, s: b.s })),
    chart: chartOf(blocks, liveText, slug),
    source: source ? { url: source, ids: links.filter((h) => /[?&]id=/.test(h)).map((h) => new URL(h).searchParams.get('id')) } : null,
    command: code ? txt(code.n) : '',
    // every figure of the page's headline numbers, for its Sigil
    figures: (latest ? latest.blocks.filter((b) => b.t === 'a').map((b) => txt(find(b.n, tag('span')))) : []).concat(txt(lede && lede.n).match(/\d[\d,.]*/g) || []).slice(0, 6),
  };
  return (DOCS[slug] = doc);
}
