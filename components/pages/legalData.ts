/* Server side: reads a legal document's captured HTML into hero + contents + sections for the reading room. */
import { load, find, findAll, textOf, slot, tag, slugify, metaOf, isN } from './htmltree';
import fs from 'node:fs';
import path from 'node:path';

export const SLUGS = ['acceptable-use', 'biometric-voice', 'consumer-health', 'cookies', 'cybersecurity', 'data-deletion', 'dpa', 'privacy', 'refunds', 'research-api', 'research-contribution', 'subprocessors', 'terms'];
export const nameOf = (slug) => metaOf('/legal/' + slug).title.replace(/\s+—\s+Hanzo$/, '');

export function legalDoc(slug) {
  const root = load('legal/' + slug);
  const nodes = findAll(root, slot('document')).flatMap((d) => d.c);
  const ni = nodes.findIndex((n) => isN(n) && n.t === 'nav');
  const used = new Set();
  const sections = [];
  let cur = { id: null, title: null, nodes: [] };
  const fix = (n) => { // sub-headings carry no id on the live page; give each one so it can be linked
    if (!isN(n)) return n;
    if (n.t === 'h3' && !(n.a && n.a.id)) { let id = slugify(textOf(n)) || 'part'; while (used.has(id)) id += '-2'; n.a = { ...(n.a || {}), id }; }
    if (n.a && n.a.id) used.add(n.a.id);
    n.c.forEach(fix);
    return n;
  };
  for (const n of nodes.slice(ni + 1)) {
    if (isN(n) && n.t === 'h2') { sections.push(cur); cur = { id: n.a.id, title: textOf(n), nodes: [] }; used.add(n.a.id); } else cur.nodes.push(fix(n));
  }
  sections.push(cur);
  return {
    slug,
    kicker: textOf(find(root, (n) => n.a && 'data-label' in n.a)) || 'Legal',
    title: textOf(find(root, tag('h1'))),
    lede: textOf(find(root, slot('lede'))),
    meta: nodes.slice(0, ni),
    toc: findAll(nodes[ni], tag('a')).map((a) => ({ id: a.a.href.slice(1), label: textOf(a) })),
    sections: sections.filter((s) => s.id || s.nodes.length),
    others: SLUGS.filter((s) => s !== slug).map((s) => ({ slug: s, title: nameOf(s) })),
  };
}

/* the index: intro, status note, groups of documents, then the rest as written */
export function legalIndex() {
  const root = load('legal');
  const nodes = findAll(root, slot('document')).flatMap((d) => d.c);
  const groups = [];
  const rest = [];
  const intro = [];
  let cur = null;
  for (const n of nodes) {
    if (isN(n) && n.t === 'h2') { cur = { id: n.a.id, title: textOf(n), items: [], nodes: [], list: false }; groups.push(cur); continue; }
    if (!cur) { intro.push(n); continue; }
    cur.nodes.push(n);
  }
  const out = [];
  for (const g of groups) {
    const ul = g.nodes.find((n) => isN(n) && n.t === 'ul');
    const isDocs = ul && ul.c.every((li) => isN(li) && li.c[0] && isN(li.c[0]) && li.c[0].t === 'strong' && find(li.c[0], tag('a')));
    if (isDocs && g.id !== 'contact') {
      g.items = ul.c.map((li) => {
        const a = find(li.c[0], tag('a'));
        return { href: a.a.href, title: textOf(a), note: li.c.slice(1) };
      });
      out.push({ id: g.id, title: g.title, items: g.items });
    } else rest.push(g);
  }
  return {
    kicker: textOf(find(root, (n) => n.a && 'data-label' in n.a)) || 'Legal',
    title: textOf(find(root, tag('h1'))),
    lede: textOf(find(root, slot('lede'))),
    intro, groups: out, rest,
  };
}
export const pagesIndex = () => JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content', 'pages.json'), 'utf8'));
