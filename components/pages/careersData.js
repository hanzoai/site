/* Server side: reads the captured careers pages into plain data for the templates. */
import { load, find, findAll, textOf, slot, tag, metaOf, isN } from './htmltree';

export const SLUGS = ['ai-ml-research-engineer', 'compiler-engineer', 'mcp-protocol-engineer', 'cryptography-engineer-zkp', 'senior-backend-engineer', 'product-designer', 'academic-research-intern', 'open'];
const T = (n) => textOf(n).replace(/\s+/g, ' ').trim();
const strs = (n) => (isN(n) ? n.c.filter((k) => typeof k === 'string').join('').replace(/\s+/g, ' ').trim() : n);

export function role(slug) {
  const root = load('careers/' + slug);
  const chips = findAll(root, slot('chip')).map(T);
  const acts = findAll(root, slot('action'));
  const back = find(root, (n) => n.t === 'a' && n.a && n.a.href === '/careers');
  const share = find(root, (n) => n.t === 'span' && n.a && n.a['data-slot'] === 'sizable-text');
  // the body, read in order: headings, paragraphs, list items, "why join" cards
  const blocks = [];
  let cur = null;
  let stop = false;
  const walk = (n, parent) => {
    if (!isN(n) || stop) return;
    if (n.t === 'h2' && slot('title')(n)) {
      if (T(n) === 'Apply for this Role') { stop = true; return; }
      cur = { title: T(n), paras: [], items: [], cards: [] }; blocks.push(cur); return;
    }
    if (!cur) { n.c.forEach((k) => walk(k, n)); return; }
    if (n.t === 'p' && slot('text')(n)) {
      const bullet = parent.c[0] && isN(parent.c[0]) && parent.c[0].t === 'div' && parent.c[0].c.length === 0;
      (bullet ? cur.items : cur.paras).push(T(n)); return;
    }
    const spans = n.c.filter((k) => isN(k) && k.t === 'span' && slot('text')(k));
    if (n.t === 'div' && spans.length === 2) { cur.cards.push([T(spans[0]), T(spans[1])]); return; }
    n.c.forEach((k) => walk(k, n));
  };
  walk(root, root);
  // the "Nice to Have" list sits inside the same group as "What We're Looking For"; blocks already split by heading
  const form = find(root, tag('form'));
  const fields = [];
  let file = null, check = null, submit = '', note = null;
  for (const ch of form.c) {
    if (!isN(ch)) continue;
    const inp = find(ch, (n) => n.t === 'input' || n.t === 'textarea');
    if (ch.t === 'div' && ch.c[0] && ch.c[0].t === 'div') {
      const f = find(ch, (n) => n.t === 'input' && n.a && n.a.type === 'file');
      const c = find(ch, (n) => n.t === 'label');
      file = { at: fields.length, label: strs(ch.c[0].c[0]), hint: T(ch.c[0].c[ch.c[0].c.length - 1]), accept: f && f.a.accept };
      check = T(c);
    } else if (ch.t === 'div' && inp) {
      fields.push({ label: strs(ch.c[0]), req: !!(inp.a && 'required' in inp.a), ph: (inp.a && inp.a.placeholder) || '', type: inp.t === 'textarea' ? 'textarea' : (inp.a && inp.a.type) || 'text' });
    } else if (find(ch, tag('button'))) submit = T(ch);
    else if (find(ch, tag('a'))) { const a = find(ch, tag('a')); note = { text: strs(ch), href: a.a.href, mail: T(a) }; }
  }
  const apply = find(root, (n) => n.a && n.a.id === 'apply');
  return {
    slug, at: SLUGS.indexOf(slug),
    back: T(back), share: T(share), chips,
    title: T(find(root, tag('h1'))), lede: T(find(root, slot('lede'))),
    apply: T(acts[0]), email: { text: T(acts[1]), href: acts[1].a.href },
    blocks, form: { title: T(find(apply, tag('h2'))), intro: T(find(apply, (n) => n.t === 'span' && slot('text')(n))), fields, file, check, submit, note },
  };
}

/* every role in brief (title, chips), for the siblings at the foot of a role */
export const peers = () => SLUGS.map((s) => { const r = role(s); return { slug: s, at: r.at, title: r.title, chips: r.chips, lede: r.lede }; });

/* the number a role wears on the /careers deck (its sheet's numeral), so the role page's hero can be that same sheet */
export const deckNo = (slug) => { const i = board().pos.leaves.findIndex((l) => l.href === '/careers/' + slug); return i < 0 ? null : String(i + 1).padStart(2, '0'); };

export function board() {
  const root = load('careers');
  const secs = findAll(root, tag('section'));
  const [hero, perks, pos, intern, close] = secs;
  const steps = find(hero, slot('steps'));
  const sb = findAll(steps, (n) => n.t === 'button').map(T);
  const sd = findAll(steps, (n) => n.t === 'p').map(T);
  const heads = (s) => ({ title: T(find(s, tag('h2'))), lede: T(find(s, slot('lede'))) });
  const leaf = (l) => {
    const h3 = find(l, tag('h3'));
    const acts = findAll(l, slot('action')).map((a) => ({ text: T(a), href: a.a.href }));
    const chips = findAll(l, (n) => n.t === 'span' && slot('text')(n)).map(T);
    const p = find(l, (n) => n.t === 'p' && slot('text')(n));
    return { id: (l.a && l.a.id) || '', title: T(h3), href: acts[0] && acts[0].href, chips, desc: T(p), acts };
  };
  const h1 = find(hero, tag('h1'));
  const lines = []; let b = '';
  h1.c.forEach((k) => { if (isN(k) && k.t === 'br') { lines.push(b); b = ''; } else b += textOf(k); }); lines.push(b);
  const hacts = findAll(hero, slot('action')).map((a) => ({ text: T(a), href: a.a.href }));
  const openLeaves = findAll(pos, slot('leaf')).map(leaf);
  const dont = findAll(pos, (n) => n.t === 'p' && slot('text')(n)).pop();
  const dontA = findAll(pos, slot('action')).pop();
  const cact = findAll(close, slot('action')).map((a) => ({ text: T(a), href: a.a.href }));
  return {
    kicker: T(find(hero, (n) => n.a && 'data-label' in n.a)), lines, lede: T(find(hero, slot('lede'))), hacts,
    how: { title: T(find(steps, (n) => n.t === 'span' && slot('text')(n))), steps: sb.map((t, i) => [t, sd[i]]) },
    perks: { ...heads(perks), items: findAll(perks, tag('h3')).map((h, i) => [T(h), T(findAll(perks, (n) => n.t === 'p' && slot('text')(n))[i])]) },
    pos: { ...heads(pos), leaves: openLeaves, dont: T(dont), dontA: { text: T(dontA), href: dontA.a.href } },
    intern: { ...heads(intern), leaves: findAll(intern, slot('leaf')).map((l) => ({ ...leaf(l), perks: l.c && findAll(l, (n) => n.t === 'span' && slot('text')(n)).map(T) })) },
    close: { ...heads(close), acts: cact },
  };
}
export const pagesIndex = () => ({ get: metaOf });
