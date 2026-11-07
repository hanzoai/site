/* Server side: one GitHub organization's page (/oss/<org>) read from Hanzo's captured HTML. Figures, repositories and
   the monthly commit bars are Hanzo's (read from GitHub and Hanzo Forge on the date the page states). */
import fs from 'node:fs';
import path from 'node:path';
import { load, find, findAll, textOf, slot, tag, isN } from '../htmltree';

const ROOT = process.cwd();
let IDX;
const idx = () => (IDX ||= JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'pages.json'), 'utf8')));
export const metaOf = (route) => idx()[route];
export const ORGS = () => Object.keys(idx()).filter((p) => /^\/oss\/[^/]+$/.test(p)).map((p) => p.split('/')[2]);
const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
const num = (s) => { const v = parseFloat(String(s).replace(/,/g, '')); return Number.isFinite(v) ? v : 0; };

/* the bars' heights live in hanzo.ai's atomic class names: _height-26--565 is 26.565%, _height-10037 is "100%", _height-1 is 1px */
function sparks(html) {
  const out = [];
  let at = html.indexOf('data-slot="sparkline"');
  while (at >= 0) {
    const open = html.indexOf('>', at) + 1;
    const bars = [];
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

function sections(root) {
  const out = [];
  const walk = (n) => { if (!isN(n)) return; if (n.t === 'section') { out.push(n); return; } n.c.forEach(walk); };
  walk(root);
  return out;
}
const figures = (sec) => findAll(sec, (n) => n.t === 'div' && n.c.filter(isN).length === 2 && n.c[0].t === 'span' && isN(n.c[1]) && n.c[1].t === 'p')
  .map((d) => ({ value: clean(textOf(d.c[0])), n: num(textOf(d.c[0])), label: clean(textOf(d.c[1])) }));

export function orgDoc(org) {
  const rel = 'oss/' + org;
  const html = fs.readFileSync(path.join(ROOT, 'content', 'pages', rel + '.html'), 'utf8');
  const root = load(rel);
  const bars = sparks(html);
  const secs = sections(root);
  const fold = secs.find((s) => s.a && s.a['data-slot'] === 'fold') || secs[0];
  const doc = {
    org, route: '/' + rel,
    label: clean(textOf(find(fold, (n) => n.a && 'data-label' in n.a))),
    name: clean(textOf(find(fold, tag('h1')))),
    lede: clean(textOf(find(fold, slot('lede')))),
    links: findAll(fold, (n) => n.t === 'a' && n.a && n.a.href).map((a) => ({ label: clean(textOf(a)), href: a.a.href })),
    counts: [], repos: null, extra: [],
  };
  let b = 0;
  for (const sec of secs) {
    if (sec === fold) continue;
    const h2 = clean(textOf(find(sec, tag('h2'))));
    const list = find(sec, slot('repos'));
    if (list) {
      const input = find(sec, tag('input'));
      const items = list.c.filter(isN).map((li) => {
        const a = find(li, (n) => n.t === 'a' && n.a && /github\.com/.test(n.a.href || ''));
        const forge = find(li, (n) => n.t === 'a' && n.a && /git\.hanzo\.ai/.test(n.a.href || ''));
        const stars = find(li, (n) => n.a && n.a['data-slot'] === 'count-stars');
        const forks = find(li, (n) => n.a && n.a['data-slot'] === 'count-forks');
        const counts = find(li, (n) => n.a && n.a['data-slot'] === 'counts');
        const langNode = counts ? findAll(li, (n) => n.t === 'span' && n.a && n.a['data-slot'] === 'text').find((s) => !find(counts, (k) => k === s) && !find(s, tag('time')) && !/commits this year$/.test(textOf(s)) && clean(textOf(s)) !== 'Archived' && clean(textOf(s))) : null;
        const time = find(li, tag('time'));
        const commits = findAll(li, (n) => n.t === 'span').map((s) => clean(textOf(s))).find((t) => /commits? this year$/.test(t)) || '';
        const hasSpark = !!find(li, slot('sparkline'));
        const p = find(li, tag('p'));
        return {
          name: a ? clean(textOf(a)) : clean(li.a && li.a['data-repo']),
          href: a ? a.a.href : null,
          forge: forge ? forge.a.href : null, forgeLabel: forge ? clean(textOf(forge)) : null,
          lang: langNode ? clean(textOf(langNode)) : null,
          stars: stars ? num(textOf(stars)) : null, forks: forks ? num(textOf(forks)) : null,
          desc: p ? clean(textOf(p)) : '',
          pushed: time ? clean(textOf(time)) : null, at: time ? (find(li, tag('time')).a || {}).datetime || null : null,
          commits, nCommits: num(commits),
          archived: findAll(li, (n) => n.t === 'span' && n.a && n.a['data-slot'] === 'text').some((s) => clean(textOf(s)) === 'Archived') ? 'Archived' : null,
          spark: hasSpark ? bars[b++] || [] : null,
        };
      });
      doc.repos = { title: h2, search: input ? input.a.placeholder : null, items, total: (/(\d[\d,]*)/.exec(input ? input.a.placeholder : '') || [])[1] || null, more: (/>(Show all[^<]*)</.exec(html) || [])[1] || null };
    } else if (/^Counted /.test(h2)) {
      const hasSpark = !!find(sec, slot('sparkline'));
      const notes = findAll(sec, tag('p')).filter((p) => !figures(sec).some((f) => f.label === clean(textOf(p)))).map((p) => clean(textOf(p)));
      doc.counts.push({ title: h2, figures: figures(sec), notes, spark: hasSpark ? bars[b++] || [] : null });
    } else doc.extra.push({ title: h2, nodes: sec.c });
  }
  const fig = (k) => doc.counts.flatMap((c) => c.figures).find((f) => f.label.startsWith(k));
  doc.key = ['public repositories', 'stars', 'forks', 'commits in the past year'].map(fig).filter(Boolean);
  doc.spark = (doc.counts.find((c) => c.spark) || {}).spark || null;
  return doc;
}
