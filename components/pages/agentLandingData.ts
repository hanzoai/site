/* Server side: /agent (the signed-out Hanzo Agent landing) read from Hanzo's captured page: the first screen with its
   console, the paste-and-ship prompt, how it works, the capabilities, the SDK example, the close, the crew and the
   place to get it. Every word, link and picture is Hanzo's. */
import fs from 'node:fs';
import path from 'node:path';
import { load, find, findAll, textOf, slot, tag, isN } from './htmltree';

const T = (n: never) => textOf(n).replace(/\s+/g, ' ').trim();
const ent = (s: string) => s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');
const links = (n: never, f = slot('action')) => findAll(n, (k) => k.t === 'a' && k.a && k.a.href && f(k)).map((a) => ({ label: T(a), href: a.a.href }));
const head = (s: never) => ({ eyebrow: T(find(s, slot('eyebrow'))), title: T(find(s, tag('h2'))), lede: T(find(s, slot('lede'))) });
const cards = (s: never) => findAll(s, tag('h3')).map((h) => {
  const box = findAll(s, (n) => n.t === 'div' && n.c.includes(h))[0];
  const num = find(box, (n) => n.t === 'span' && /^\d{2}$/.test(T(n)));
  return { n: num ? T(num) : '', title: T(h), text: T(find(box, (n) => n.t === 'p')) };
});
// the code as Hanzo's lines (each line's tokens joined), one string with real line breaks
const lines = (pre: never) => find(pre, tag('code')).c.filter(isN).map((line) => textOf(line).replace(/\n$/, '')).join('\n');

export function agentLanding() {
  const root = load('agent');
  const raw = fs.readFileSync(path.join(process.cwd(), 'content', 'pages', 'agent.html'), 'utf8');
  const pics = [...raw.matchAll(/<img\b([^>]*)>/g)].map((m) => ({ src: (/\ssrc="([^"]*)"/.exec(m[1]) || [])[1], alt: ent((/\salt="([^"]*)"/.exec(m[1]) || [, ''])[1]) }));
  const imgs = findAll(root, tag('img'));
  const [fold, paste, how, caps, sdk, close, crew, get] = findAll(root, tag('section'));
  const surface = find(fold, slot('surface'));
  const inSurface = (n) => findAll(surface, () => true).includes(n);
  const through = find(fold, (n) => n.t === 'div' && n.c.length > 2 && n.c.every((k) => isN(k) && k.t === 'span' && slot('text')(k)));
  const note = find(fold, (n) => n.t === 'p' && slot('text')(n) && !inSurface(n));
  const lede = find(fold, slot('lede'));
  const lic = find(get, (n) => n.t === 'span' && slot('chip')(n));
  const gh = find(get, (n) => n.t === 'a' && slot('chip')(n));
  const licKey = T(find(lic, slot('text')));
  const bar = find(surface, (n) => n.t === 'span' && slot('text')(n));
  const open = findAll(surface, (n) => n.t === 'a' && n.a && n.a.href && !find(surface, tag('nav')).c.includes(n)).pop();
  return {
    fold: {
      label: T(find(fold, (n) => n.a && 'data-label' in n.a)),
      h1: T(find(fold, tag('h1'))),
      lede: lede.c.map((k) => T(isN(k) ? k : { c: [k] })).filter(Boolean),
      actions: links(fold, (a) => slot('action')(a) && !inSurface(a)),
      note: T(note),
      through: through.c.map(T),
      console: {
        title: T(bar),
        nav: find(surface, tag('nav')).c.filter(isN).map((a) => ({ label: T(find(a, tag('em'))), href: a.a.href, current: !!a.a['aria-current'] })),
        turns: findAll(surface, slot('surface-turn')).map(T),
        endpoint: T(find(surface, tag('code'))),
        open: { label: T(open), href: open.a.href },
        caption: T(find(surface, tag('figcaption'))),
      },
    },
    paste: { eyebrow: T(find(paste, slot('eyebrow'))), lede: T(find(paste, slot('lede'))), label: T(find(paste, (n) => n.t === 'span' && slot('text')(n))), prompt: T(find(paste, tag('pre'))) },
    how: { ...head(how), cards: cards(how) },
    caps: { ...head(caps), cards: cards(caps) },
    sdk: { ...head(sdk), lang: T(find(sdk, (n) => n.t === 'span' && slot('text')(n))), code: lines(find(sdk, tag('pre'))), actions: links(sdk) },
    close: { title: T(find(close, tag('h2'))), lede: T(find(close, slot('lede'))), actions: links(close) },
    crew: {
      ...head(crew),
      people: findAll(crew, (n) => n.t === 'a' && /^\/chat\?agent=/.test((n.a || {}).href || '')).map((a) => {
        const names = findAll(a, (n) => n.t === 'span' && slot('text')(n) && n.c.every((x) => typeof x === 'string')).map(T);
        return { name: names[0], role: names[1] || '', href: a.a.href, img: pics[imgs.indexOf(find(a, tag('img')))] };
      }),
      more: links(crew, (a) => slot('text')(a))[0],
    },
    get: { title: T(find(get, tag('h2'))), lede: T(find(get, tag('p'))), license: [licKey, T(lic).replace(licKey, '').trim()], github: { label: T(gh), href: gh.a.href }, actions: links(get) },
  };
}
