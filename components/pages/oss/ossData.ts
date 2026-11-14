/* Server side: one GitHub organization's page (/oss/<org>) read from Hanzo's captured HTML. Figures, repositories and
   the monthly commit bars are Hanzo's (read from GitHub and Hanzo Forge on the date the page states). */
import fs from 'node:fs';
import path from 'node:path';
import { load, find, findAll, textOf, slot, tag } from '../htmltree';
import { attr, kids, tagOf } from '../CapturedTree.ts';
import type { Branch, Child } from '../CapturedTree.ts';
import type { Count, Figure, Near, OrgDoc, PageMeta, RepoRow } from './types.ts';

const ROOT = process.cwd();
let IDX: Record<string, PageMeta> | undefined;
const idx = (): Record<string, PageMeta> => (IDX ||= JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'pages.json'), 'utf8')) as Record<string, PageMeta>);
export const metaOf = (route: string) => idx()[route];
export const ORGS = () => Object.keys(idx()).filter((p) => /^\/oss\/[^/]+$/.test(p)).map((p) => p.split('/')[2]);
const clean = (s: string | null | undefined) => (s || '').replace(/\s+/g, ' ').trim();
const num = (s: string) => { const v = parseFloat(String(s).replace(/,/g, '')); return Number.isFinite(v) ? v : 0; };

/* the bars' heights live in hanzo.ai's atomic class names: _height-26--565 is 26.565%, _height-10037 is "100%", _height-1 is 1px */
function sparks(html: string) {
  const out: number[][] = [];
  let at = html.indexOf('data-slot="sparkline"');
  while (at >= 0) {
    const open = html.indexOf('>', at) + 1;
    const bars: number[] = [];
    let i = open;
    for (let k = 0; k < 40; k++) {
      const m = /^<div class="([^"]*)"[^>]*><\/div>/.exec(html.slice(i, i + 600));
      if (!m) break;
      const h = /_height-(\d+(?:--\d+)?)/.exec(m[1]);
      const v = !h ? 0 : h[1].includes('--') ? parseFloat(h[1].replace('--', '.')) : h[1].endsWith('37') && h[1].length > 2 ? parseInt(h[1].slice(0, -2), 10) : 0;
      bars.push(Math.round(v * 10) / 10);
      i += m[0].length;
    }
    out.push(bars);
    at = html.indexOf('data-slot="sparkline"', i);
  }
  return out;
}

function sections(root: Branch) {
  const out: Branch[] = [];
  const walk = (n: Child): void => { if (typeof n === 'string') return; if (n.t === 'section') { out.push(n); return; } n.c.forEach(walk); };
  walk(root);
  return out;
}
const figures = (sec: Branch): Figure[] => findAll(sec, (n: Branch) => n.t === 'div' && kids(n).length === 2 && tagOf(n.c[0]) === 'span' && tagOf(n.c[1]) === 'p')
  .map((d: Branch) => ({ value: clean(textOf(d.c[0])), n: num(textOf(d.c[0])), label: clean(textOf(d.c[1])) }));

export function orgDoc(org: string, withNear = true): OrgDoc {
  const rel = 'oss/' + org;
  const html = fs.readFileSync(path.join(ROOT, 'content', 'pages', rel + '.html'), 'utf8');
  const root = load(rel);
  const bars = sparks(html);
  const secs = sections(root);
  const fold = secs.find((s) => s.a && s.a['data-slot'] === 'fold') || secs[0];
  const doc: OrgDoc = {
    org, route: '/' + rel,
    label: clean(textOf(find(fold, (n: Branch) => n.a && 'data-label' in n.a))),
    name: clean(textOf(find(fold, tag('h1')))),
    lede: clean(textOf(find(fold, slot('lede')))),
    links: findAll(fold, (n: Branch) => n.t === 'a' && n.a && n.a.href).map((a: Branch) => ({ label: clean(textOf(a)), href: attr(a, 'href') })),
    counts: [], repos: null, extra: [], key: [], spark: null, i: 0, near: [],
  };
  let b = 0;
  for (const sec of secs) {
    if (sec === fold) continue;
    const h2 = clean(textOf(find(sec, tag('h2'))));
    const list = find(sec, slot('repos'));
    if (list) {
      const input = find(sec, tag('input'));
      const items = kids(list).map((li): RepoRow => {
        const a = find(li, (n: Branch) => n.t === 'a' && n.a && /github\.com/.test(n.a.href || ''));
        const forge = find(li, (n: Branch) => n.t === 'a' && n.a && /git\.hanzo\.ai/.test(n.a.href || ''));
        const stars = find(li, (n: Branch) => n.a && n.a['data-slot'] === 'count-stars');
        const forks = find(li, (n: Branch) => n.a && n.a['data-slot'] === 'count-forks');
        const counts = find(li, (n: Branch) => n.a && n.a['data-slot'] === 'counts');
        const langNode = counts ? findAll(li, (n: Branch) => n.t === 'span' && n.a && n.a['data-slot'] === 'text').find((s: Branch) => !find(counts, (k: Branch) => k === s) && !find(s, tag('time')) && !/commits this year$/.test(textOf(s)) && clean(textOf(s)) !== 'Archived' && clean(textOf(s))) : null;
        const time = find(li, tag('time'));
        const commits = findAll(li, (n: Branch) => n.t === 'span').map((s: Branch) => clean(textOf(s))).find((t: string) => /commits? this year$/.test(t)) || '';
        const hasSpark = !!find(li, slot('sparkline'));
        const p = find(li, tag('p'));
        return {
          name: a ? clean(textOf(a)) : clean(li.a && li.a['data-repo']),
          href: a ? attr(a, 'href') : null,
          forge: forge ? attr(forge, 'href') : null, forgeLabel: forge ? clean(textOf(forge)) : null,
          lang: langNode ? clean(textOf(langNode)) : null,
          stars: stars ? num(textOf(stars)) : null, forks: forks ? num(textOf(forks)) : null,
          desc: p ? clean(textOf(p)) : '',
          pushed: time ? clean(textOf(time)) : null, at: time ? (time.a || {}).datetime || null : null,
          commits, nCommits: num(commits),
          archived: findAll(li, (n: Branch) => n.t === 'span' && n.a && n.a['data-slot'] === 'text').some((s: Branch) => clean(textOf(s)) === 'Archived') ? 'Archived' : null,
          spark: hasSpark ? bars[b++] || [] : null,
        };
      });
      doc.repos = { title: h2, search: input ? attr(input, 'placeholder') : null, items, total: (/(\d[\d,]*)/.exec(input ? attr(input, 'placeholder') : '') || [])[1] || null, more: (/>(Show all[^<]*)</.exec(html) || [])[1] || null };
    } else if (/^Counted /.test(h2)) {
      const hasSpark = !!find(sec, slot('sparkline'));
      const notes = findAll(sec, tag('p')).filter((p: Branch) => !figures(sec).some((f) => f.label === clean(textOf(p)))).map((p: Branch) => clean(textOf(p)));
      doc.counts.push({ title: h2, figures: figures(sec), notes, spark: hasSpark ? bars[b++] || [] : null });
    } else doc.extra.push({ title: h2, nodes: sec.c });
  }
  const fig = (k: string) => doc.counts.flatMap((c) => c.figures).find((f) => f.label.startsWith(k));
  doc.key = ['public repositories', 'stars', 'forks', 'commits in the past year'].map(fig).filter((f): f is Figure => !!f);
  doc.spark = (doc.counts.find((c) => c.spark) || {}).spark || null;
  // its place in the family and the next organizations, as cards that open into their page (each with its own line)
  const all = ORGS();
  doc.i = all.indexOf(org);
  doc.near = withNear ? [1, 2, 3, 4].map((k) => all[(doc.i + k) % all.length]).map((o): Near => {
    const d = orgDoc(o, false);
    return { org: o, i: d.i, name: d.name, lede: d.lede, repos: d.key[0] || null, commits: d.key.find((f) => /^commits/.test(f.label)) || null, data: d.key.map((f) => f.n) };
  }) : [];
  return doc;
}
