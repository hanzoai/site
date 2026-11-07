/* Server side: an /agents/<page> read from Hanzo's captured page into typed sections (the fold, a roster of agents, a
   console's turns, numbered pillars, parts, code, a room screenshot, the closing actions). Every word and link is Hanzo's;
   where hanzo.ai renders a link differently from its server copy (the console button), the live link is used. */
import fs from 'node:fs';
import path from 'node:path';
import { load, find, findAll, textOf, slot, tag, isN, metaOf } from '../htmltree';

const ROOT = process.cwd();
const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
const T = (n) => clean(textOf(n));
const ent = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');
export const SLUGS = () => Object.keys(JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'pages.json'), 'utf8')))
  .filter((p) => /^\/agents\/[^/]+$/.test(p)).map((p) => p.split('/')[2]);
export const meta = (slug) => metaOf('/agents/' + slug);

const links = (n, f = slot('action')) => findAll(n, (k) => k.t === 'a' && k.a && k.a.href && f(k)).map((a) => ({ label: T(a), href: a.a.href }));
const head = (s) => ({ eyebrow: T(find(s, slot('eyebrow'))), h2: T(find(s, tag('h2'))), lede: T(find(s, slot('lede'))) });
function code(pre) {
  const c = find(pre, tag('code')) || pre;
  return c.c.filter(isN).map((line) => line.c.map((t) => (isN(t) ? [(t.a && t.a['data-code']) || 'ink', textOf(t)] : ['ink', t.replace(/\n/g, '')])).filter(([, s]) => s !== ''));
}

export function agentsDoc(slug) {
  const rel = 'agents/' + slug;
  const raw = fs.readFileSync(path.join(ROOT, 'content', 'pages', rel + '.html'), 'utf8');
  const root = load(rel);
  const pics = [...raw.matchAll(/<img\b([^>]*)>/g)].map((m) => ({ src: (/\ssrc="([^"]*)"/.exec(m[1]) || [])[1], alt: ent((/\salt="([^"]*)"/.exec(m[1]) || [, ''])[1]) }));
  const at = new Map(findAll(root, tag('img')).map((n, i) => [n, pics[i]]));
  const liveFile = path.join(ROOT, 'content', 'live', rel + '.json');
  const live = fs.existsSync(liveFile) ? JSON.parse(fs.readFileSync(liveFile, 'utf8')).links : [];
  const top = findAll(root, tag('section')).filter((s, i, all) => !all.some((o) => o !== s && findAll(o, tag('section')).includes(s)));
  const doc = { slug, route: '/' + rel, fold: null, sections: [] };
  for (const s of top) {
    if (slot('fold')(s)) {
      const surface = find(s, slot('surface'));
      const through = find(s, (n) => n.t === 'div' && n.c.length > 2 && n.c.every((k) => isN(k) && k.t === 'span' && slot('text')(k)));
      const note = find(s, (n) => n.t === 'p' && slot('text')(n) && !(surface && findAll(surface, () => true).includes(n)));
      const lede = find(s, slot('lede'));
      doc.fold = {
        label: T(find(s, (n) => n.a && 'data-label' in n.a)), h1: T(find(s, tag('h1'))),
        lede: lede ? lede.c.map((k) => T(isN(k) ? k : { c: [k] })).filter(Boolean) : [],
        actions: links(s, (a) => slot('action')(a) && !(surface && findAll(surface, () => true).includes(a))),
        note: note ? T(note) : '', install: note ? [...T(note).matchAll(/(pip install [\w-]+|cargo add [\w-]+)/g)].map((m) => m[1]) : [],
        through: through ? through.c.map(T) : [],
        console: surface && (() => {
          const bar = find(surface, (n) => n.t === 'span' && slot('text')(n));
          const foot = find(surface, tag('code'));
          const go = findAll(surface, (n) => n.t === 'a' && n.a && n.a.href && !find(surface, tag('nav')).c.includes(n)).pop();
          return {
            title: T(bar),
            nav: find(surface, tag('nav')).c.filter(isN).map((a) => ({ label: T(find(a, tag('em'))), href: a.a.href, current: !!a.a['aria-current'] })),
            turns: findAll(surface, slot('surface-turn')).map((b, i) => ({ who: i ? 'enso' : 'you', text: T(b) })),
            endpoint: T(foot), open: go && { label: T(go), href: live.includes('https://hanzo.team/') && go.a.href === '/home' ? 'https://hanzo.team/' : go.a.href },
            caption: T(find(surface, tag('figcaption'))),
          };
        })(),
      };
      continue;
    }
    const h = head(s);
    const crew = findAll(s, (n) => n.t === 'a' && n.a && /^\/chat\?agent=/.test(n.a.href || ''));
    const pre = find(s, tag('pre'));
    const shots = findAll(s, tag('img')).map((n) => at.get(n));
    const cards = findAll(s, tag('h3')).map((h3) => {
      const box = findAll(s, (n) => n.t === 'div' && n.c.includes(h3))[0];
      const num = box && find(box, (n) => n.t === 'span' && /^\d{2}$/.test(T(n)));
      return { n: num ? T(num) : '', title: T(h3), text: T(box && find(box, (n) => n.t === 'p')) };
    });
    if (crew.length) {
      doc.sections.push({ k: 'roster', ...h, agents: crew.map((a) => { const names = findAll(a, (n) => n.t === 'span' && slot('text')(n) && n.c.every((x) => typeof x === 'string')).map(T); return { name: names[0], role: names[1] || '', img: at.get(find(a, tag('img'))), href: a.a.href }; }),
        more: links(s, (a) => slot('text')(a))[0] || null });
    } else if (shots.length) {
      const url = findAll(s, (n) => n.t === 'span' && slot('text')(n)).map(T);
      doc.sections.push({ k: 'room', ...h, actions: links(s), url: url[0], caption: T(findAll(s, (n) => n.t === 'p' && slot('text')(n)).pop()), shots });
    } else if (pre) {
      const bar = find(s, (n) => n.t === 'span' && slot('text')(n) && !find(pre, (k) => k === n));
      doc.sections.push({ k: 'code', ...h, lang: T(bar), lines: code(pre), actions: links(s) });
    } else if (find(s, slot('chip'))) {
      const lic = find(s, (n) => n.t === 'span' && slot('chip')(n));
      const gh = find(s, (n) => n.t === 'a' && slot('chip')(n));
      const key = lic && T(find(lic, slot('text')));
      doc.sections.push({ k: 'get', h2: T(find(s, tag('h2'))), lede: T(find(s, tag('p'))), license: lic ? [key, clean(T(lic).replace(key, ''))] : null, github: gh ? { label: T(gh), href: gh.a.href } : null, actions: links(s) });
    } else if (cards.length) {
      doc.sections.push({ k: cards.some((c) => c.n) ? 'pillars' : 'parts', ...h, cards });
    } else {
      doc.sections.push({ k: 'close', ...h, actions: links(s) });
    }
  }
  return doc;
}
