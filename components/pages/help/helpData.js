/* Server side: a help article (/help/<topic>/<question>) read from Hanzo's captured page: the kicker, the question, the
   lede, the contents and the document as blocks; plus the setting the article explains (its name and the steps to it,
   per platform) for the live settings panel. Every word is Hanzo's; nothing is added. */
import fs from 'node:fs';
import path from 'node:path';
import { load, find, findAll, textOf, slot, tag, isN, metaOf } from '../htmltree';

const ROOT = process.cwd();
const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
export const SLUGS = () => Object.keys(JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'pages.json'), 'utf8')))
  .filter((p) => p.startsWith('/help/')).map((p) => p.slice('/help/'.length));
export const meta = (slug) => metaOf('/help/' + slug);

const MAIL = /([\w.+-]+@[\w-]+\.[\w.]+)/;
let CF = null; // the link Hanzo's page gives a Cloudflare-protected address; kept in the HTML, made a direct mailto in the browser
// a run of words: plain text, bold, links; an e-mail address (Cloudflare-hidden in the capture) becomes a mailto link
function inline(n) {
  const out = [];
  n.c.forEach((k) => {
    if (!isN(k)) {
      k.split(MAIL).forEach((s, i) => { if (!s) return; out.push(i % 2 ? { a: 'mailto:' + s, t: s, ...(CF ? { cf: CF } : {}) } : s); });
    } else if (k.t === 'a') out.push({ a: k.a && k.a.href, t: clean(textOf(k)) });
    else if (k.t === 'strong' || k.t === 'b') out.push({ b: clean(textOf(k)) });
    else out.push(...inline(k));
  });
  // tidy the spaces the capture leaves around comments and tags
  return out.map((x, i) => (typeof x === 'string' ? x.replace(/\s+/g, ' ') : x)).filter((x) => x !== '');
}
const plain = (inl) => clean(inl.map((x) => (typeof x === 'string' ? x : x.b || x.t)).join(''));

export function article(slug) {
  const raw = fs.readFileSync(path.join(ROOT, 'content', 'pages', 'help', slug + '.html'), 'utf8');
  CF = ((/<a\b[^>]*data-cfemail[^>]*>/.exec(raw) || [''])[0].match(/\shref="([^"#]+)/) || [])[1] || null;
  const root = load('help/' + slug);
  const fold = find(root, slot('fold'));
  const doc = find(root, slot('document'));
  const nav = find(doc, tag('nav'));
  const out = {
    slug, route: '/help/' + slug,
    kicker: clean(textOf(find(fold, slot('text')))),
    title: clean(textOf(find(fold, tag('h1')))),
    lede: clean(textOf(find(fold, slot('lede')))),
    contents: { label: clean(textOf(find(nav, tag('h2')))), items: findAll(nav, tag('a')).map((a) => ({ id: a.a.href.slice(1), text: clean(textOf(a)) })) },
    sections: [],
  };
  let sec = null;
  doc.c.filter(isN).forEach((n) => {
    if (n === nav) return;
    if (n.t === 'h2') { sec = { id: n.a && n.a.id, title: clean(textOf(n)), blocks: [] }; out.sections.push(sec); return; }
    if (!sec) return;
    if (n.t === 'h3') sec.blocks.push({ k: 'h3', text: clean(textOf(n)) });
    else if (n.t === 'p') sec.blocks.push({ k: 'p', inl: inline(n) });
    else if (n.t === 'ol' || n.t === 'ul') {
      sec.blocks.push({ k: n.t, items: n.c.filter((li) => isN(li) && li.t === 'li').map((li) => {
        const inl = inline(li);
        // "<strong>Lead.</strong> rest": the lead stands apart
        return inl.length > 1 && inl[0].b && /\.$/.test(inl[0].b) ? { lead: inl[0].b, inl: inl.slice(1).map((x, i) => (i === 0 && typeof x === 'string' ? x.replace(/^\s+/, '') : x)).filter((x) => x !== '') } : { inl };
      }) });
    }
  });

  // the setting the article explains: its name (the first bold words), and the steps to it on each platform (an h3 then a numbered list)
  const first = out.sections[0] && out.sections[0].blocks.find((b) => b.k === 'p');
  const name = first && (first.inl.find((x) => x.b) || {}).b;
  const flows = [];
  out.sections.forEach((s) => s.blocks.forEach((b, i) => {
    const h = s.blocks[i - 1];
    if (b.k === 'ol' && h && h.k === 'h3') {
      flows.push({ label: h.text, sec: s.id, steps: b.items.map((it) => ({
        inl: it.inl,
        // what the hand presses in this step: the avatar, a named item, or the switch itself
        targets: /avatar/i.test(plain(it.inl)) ? ['avatar'] : it.inl.filter((x) => x.b).map((x) => (x.b === name ? 'switch' : x.b)),
      })) });
    }
  }));
  if (name && flows.length) {
    const sentences = first ? plain(first.inl).split(/(?<=\.)\s+/) : [];
    const offSec = out.sections.find((s) => /turning it off/i.test(s.title));
    const flowSec = out.sections.find((s) => s.id === flows[0].sec);
    const lastOl = flowSec.blocks.map((b) => b.k).lastIndexOf('ol');
    const saved = flowSec.blocks.slice(lastOl + 1).find((b) => b.k === 'p');
    out.setting = {
      name, flows,
      on: sentences.find((t) => /^When it is on/i.test(t)) || null,
      offTitle: offSec ? offSec.title : null,
      off: offSec ? (offSec.blocks.find((b) => b.k === 'ul') || { items: [] }).items.map((it) => plain(it.inl)) : [],
      saved: saved ? plain(saved.inl) : null,
    };
  }
  return out;
}
