/* Server side: reads a captured product page into the pieces of the console. */
import { load, find, findAll, textOf, slot, tag, isN } from './htmltree';

export const SLUGS = ['company', 'agents', 'models', 'memory', 'identity', 'machines', 'record'];
const T = (n) => textOf(n).replace(/\s+/g, ' ').trim();

export function product(slug) {
  const root = load('products/' + slug);
  const secs = findAll(root, tag('section'));
  const hero = secs[0];
  const acts = findAll(hero, slot('action')).map((a) => ({ text: T(a), href: a.a.href }));
  const nav = find(hero, tag('nav'));
  const os = findAll(nav, tag('a')).map((a) => ({ href: a.a.href, name: T(find(a, tag('b'))), desc: T(find(a, tag('span'))), current: !!(a.a && a.a['aria-current']) }));
  const out = { slug, kicker: T(find(hero, (n) => n.a && 'data-label' in n.a)), title: T(find(hero, tag('h1'))), lede: T(find(hero, slot('lede'))), acts, osTitle: T(find(hero, (n) => n.t === 'span' && slot('text')(n) && n.c.length === 1 && T(n) === T(find(hero, (m) => m.a && 'data-label' in m.a)))), os };
  out.intro = findAll(secs[1], slot('document')).flatMap((d) => d.c);
  const links = (s) => findAll(s, tag('a')).map((a) => ({ href: a.a.href, text: T(a) }));
  for (const s of secs.slice(2)) {
    const h = T(find(s, tag('h2')));
    if (h === 'API') {
      const table = find(s, tag('table'));
      // the operations as plain rows (method, path, what it does), read from Hanzo's own table
      const heads = findAll(table, tag('th')).map(T);
      const ops = findAll(table, tag('tr')).filter((r) => find(r, tag('td'))).map((r) => findAll(r, tag('td')).map(T));
      out.api = { title: h, lede: T(find(s, (n) => n.t === 'p' && slot('text')(n))), table, heads, ops };
    }
    else if (h === 'Try it') {
      const toks = [];
      const w = (n, kind) => { if (typeof n === 'string') { toks.push([kind || 'ink', n]); return; } w2(n); };
      const w2 = (n) => n.c.forEach((k) => (isN(k) && k.a && k.a['data-code'] ? toks.push([k.a['data-code'], textOf(k)]) : w(k)));
      w2(find(s, tag('pre')));
      out.tryIt = { title: h, toks };
    } else if (h === 'Measured') out.measured = { title: h, links: links(s) };
    else if (h === 'Docs') out.docs = { title: h, links: links(s) };
    else if (h === 'On this site') out.site = { title: h, links: links(s) };
  }
  return out;
}
