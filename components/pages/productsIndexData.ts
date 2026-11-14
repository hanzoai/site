/* Server side: /products (Hanzo OS) read from Hanzo's captured page: the first screen, the seven layers, the logos Hanzo
   shows under "Backed by Techstars", the "At work" links and the closing actions. Every word and link is Hanzo's. */
import fs from 'node:fs';
import path from 'node:path';
import { load, find, findAll, textOf, slot, tag } from './htmltree';
import { attr } from './CapturedTree.ts';
import type { Branch, Child } from './CapturedTree.ts';
import type { ProductsIndex } from './ProductsTypes.ts';

const T = (n: Child | null | undefined): string => textOf(n).replace(/\s+/g, ' ').trim();
const ent = (s: string) => s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');
const isText = (n: Branch) => n.t === 'p' && slot('text')(n);

export function productsIndex(): ProductsIndex {
  const root = load('products');
  const raw = fs.readFileSync(path.join(process.cwd(), 'content', 'pages', 'products.html'), 'utf8');
  const pics = [...raw.matchAll(/<img\b([^>]*)>/g)].map((m) => {
    const at = (k: string) => (new RegExp('\\s' + k + '="([^"]*)"').exec(m[1]) || [, ''])[1];
    const h = /_height-(\d+)px/.exec(at('class'));
    return { src: at('src'), alt: ent(at('alt')), h: h ? +h[1] : 24 };
  });
  const [fold, backed, work, close] = findAll(root, tag('section'));
  const acts = (s: Branch) => findAll(s, slot('action')).map((a: Branch) => ({ label: T(a), href: attr(a, 'href') }));
  const title = T(find(fold, tag('h1')));
  return {
    kicker: T(find(fold, (n: Branch) => n.a && 'data-label' in n.a)),
    title,
    lede: T(find(fold, slot('lede'))),
    acts: acts(fold),
    // the window the layers stand in carries the product's name in its title bar
    window: T(find(fold, (n: Branch) => n.t === 'span' && slot('text')(n) && T(n) === title)),
    layers: findAll(fold, (n: Branch) => n.t === 'a' && /^\/products\//.test((n.a || {}).href || ''))
      .map((a: Branch) => ({ name: T(find(a, tag('b'))), line: T(find(a, tag('span'))), href: attr(a, 'href') })),
    backed: {
      title: T(find(backed, tag('h2'))), lede: T(find(backed, isText)), eyebrow: T(find(backed, slot('eyebrow'))),
      logos: findAll(backed, tag('a')).map((a: Branch, i) => ({ href: attr(a, 'href'), ...pics[i] })),
    },
    work: {
      title: T(find(work, tag('h2'))), lede: T(find(work, isText)),
      links: findAll(work, slot('more')).map((a: Branch) => ({ label: T(a).replace(/\s*→\s*$/, ''), href: attr(a, 'href') })),
    },
    close: findAll(close, tag('a')).map((a: Branch) => ({ label: T(a), href: attr(a, 'href') })),
  };
}
