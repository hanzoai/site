/* Server side: reads a captured product page into the pieces of the console. */
import { load, find, findAll, textOf, slot, tag } from './htmltree';
import { attr } from './CapturedTree.ts';
import type { Branch, Child } from './CapturedTree.ts';
import type { Link, Product } from './ProductsTypes.ts';

export const SLUGS = ['company', 'agents', 'models', 'memory', 'identity', 'machines', 'record'];
const T = (n: Child | null | undefined): string => textOf(n).replace(/\s+/g, ' ').trim();

const CACHE: Record<string, Product> = {}; // each product is read once per server process (the page also peeks at all seven)
export function product(slug: string): Product {
  if (CACHE[slug]) return CACHE[slug];
  const root = load('products/' + slug);
  const secs = findAll(root, tag('section'));
  const hero = secs[0];
  const acts = findAll(hero, slot('action')).map((a: Branch) => ({ text: T(a), href: attr(a, 'href') }));
  const nav = find(hero, tag('nav'));
  const os = findAll(nav, tag('a')).map((a: Branch) => ({ href: attr(a, 'href'), name: T(find(a, tag('b'))), desc: T(find(a, tag('span'))), current: !!(a.a && a.a['aria-current']) }));
  const out: Omit<Product, 'api' | 'tryIt'> & Partial<Pick<Product, 'api' | 'tryIt'>> = { intro: [], slug, kicker: T(find(hero, (n: Branch) => n.a && 'data-label' in n.a)), title: T(find(hero, tag('h1'))), lede: T(find(hero, slot('lede'))), acts, osTitle: T(find(hero, (n: Branch) => n.t === 'span' && slot('text')(n) && n.c.length === 1 && T(n) === T(find(hero, (m: Branch) => m.a && 'data-label' in m.a)))), os };
  out.intro = findAll(secs[1], slot('document')).flatMap((d: Branch) => d.c);
  const links = (s: Branch): Link[] => findAll(s, tag('a')).map((a: Branch) => ({ href: attr(a, 'href'), text: T(a) }));
  for (const s of secs.slice(2)) {
    const h = T(find(s, tag('h2')));
    if (h === 'API') {
      const table = find(s, tag('table'));
      // the operations as plain rows (method, path, what it does), read from Hanzo's own table
      const heads = findAll(table, tag('th')).map(T);
      const ops = findAll(table, tag('tr')).filter((r) => find(r, tag('td'))).map((r) => findAll(r, tag('td')).map(T));
      out.api = { title: h, lede: T(find(s, (n: Branch) => n.t === 'p' && slot('text')(n))), table, heads, ops };
    }
    else if (h === 'Try it') {
      const toks: [string, string][] = [];
      const w = (n: Child, kind?: string): void => { if (typeof n === 'string') { toks.push([kind || 'ink', n]); return; } w2(n); };
      const w2 = (n: Branch): void => n.c.forEach((k: Child) => (typeof k !== 'string' && k.a && k.a['data-code'] ? toks.push([k.a['data-code'], textOf(k)]) : w(k)));
      w2(find(s, tag('pre')));
      out.tryIt = { title: h, toks };
    } else if (h === 'Measured') out.measured = { title: h, links: links(s) };
    else if (h === 'Docs') out.docs = { title: h, links: links(s) };
    else if (h === 'On this site') out.site = { title: h, links: links(s) };
  }
  const { api, tryIt } = out;
  if (!api || !tryIt) throw new Error(`products/${slug}: the captured page has no ${api ? 'Try it' : 'API'} section`);
  return (CACHE[slug] = { ...out, api, tryIt });
}
