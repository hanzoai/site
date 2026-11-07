/* Server side: a /compare/<page> read from Hanzo's captured page into the parts the ledger draws: the fold, the side-by-
   side table (its measured rows, as the page opens on them), the note under it, "Reading this honestly", "Go deeper".
   The reported rows the page keeps one click away are the ones hanzo.ai/compare lists for this comparison (content/live/
   compare.json): each vendor's own claim, in Hanzo's words. Every word, figure and link is Hanzo's. */
import fs from 'node:fs';
import path from 'node:path';
import { load, find, findAll, textOf, slot, tag, isN, metaOf } from '../htmltree';

const ROOT = process.cwd();
const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
const T = (n) => clean(textOf(n));
export const SLUGS = () => Object.keys(JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'pages.json'), 'utf8')))
  .filter((p) => /^\/compare\/[^/]+$/.test(p)).map((p) => p.split('/')[2]);
export const meta = (slug) => metaOf('/compare/' + slug);

// a cell's verdict, read from its first words: the mark the ledger draws beside the sentence
const verdict = (s) => (/^yes\b/i.test(s) ? 'yes' : /^no\b/i.test(s) ? 'no' : /^not (published|measured)/i.test(s) ? 'none' : /^[\d,.]+\+?/.test(s) ? 'figure' : 'part');

/* "Enso: 600+. OpenRouter: 500+ (80+ providers). …" → one cell per column, in the table's column order */
function split(sentence, cols) {
  const rx = new RegExp('(?:^|\\.\\s+)(' + cols.map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + '):\\s', 'g');
  const at = [...sentence.matchAll(rx)];
  if (at.length !== cols.length) return null;
  const by = {};
  at.forEach((m, i) => {
    const from = m.index + m[0].length, to = i + 1 < at.length ? at[i + 1].index : sentence.length;
    by[m[1]] = sentence.slice(from, to).replace(/\.+$/, '').trim();
  });
  return cols.map((c) => by[c] || '');
}

function reported(h1, cols, skip) {
  const f = path.join(ROOT, 'content', 'live', 'compare.json');
  if (!fs.existsSync(f)) return [];
  const text = JSON.parse(fs.readFileSync(f, 'utf8')).text.map(clean);
  let i = text.indexOf(h1);
  if (i < 0) return [];
  while (i < text.length && !/^\d+ \/ \d+$/.test(text[i])) i++;
  const rows = [];
  for (i += 1; i + 1 < text.length; i += 2) {
    const cells = split(text[i + 1], cols);
    if (!cells) break;
    if (!skip.includes(text[i])) rows.push({ label: text[i], cells: cells.map((t) => ({ t, v: verdict(t) })) });
  }
  return rows;
}

export function compareDoc(slug) {
  const rel = 'compare/' + slug;
  const root = load(rel);
  const secs = findAll(root, tag('section'));
  const fold = secs.find(slot('fold'));
  const side = secs.find((s) => find(s, tag('table')));
  const rest = secs.filter((s) => s !== fold && s !== side);
  const doc = {
    slug, route: '/' + rel,
    label: T(find(fold, (n) => n.a && 'data-label' in n.a)), h1: T(find(fold, tag('h1'))), lede: T(find(fold, slot('lede'))),
  };
  if (side) {
    const table = find(side, tag('table'));
    const head = findAll(find(table, tag('thead')), tag('th')).map(T);
    const ps = findAll(side, (n) => n.t === 'p').filter((p) => !findAll(table, () => true).includes(p));
    const noteP = ps.find((p) => find(p, tag('strong')));
    const cols = head.slice(1, -1).map((h) => h.split(' ').pop()); // "Hanzo Enso" → Enso, as the reported rows name it
    const measured = findAll(find(table, tag('tbody')), tag('tr')).map((tr) => {
      const [th, ...tds] = tr.c.filter(isN);
      const cells = tds.map((td) => {
        const a = find(td, tag('a'));
        const words = clean(td.c.filter((k) => !(isN(k) && k.t === 'a')).map(textOf).join(''));
        return { t: words, v: verdict(words), link: a ? { href: a.a.href, label: T(a).replace(/^\[|\]$/g, '').trim() } : null };
      });
      return { label: T(th), cells: cells.slice(0, -1), mark: cells[cells.length - 1].t };
    });
    const toggles = findAll(side, slot('toggle-group-item')).map(T);
    doc.side = {
      h2: T(find(side, tag('h2'))), lede: T(ps.find((p) => p !== noteP)), toggles, corner: head[0], head: head.slice(1, -1), cols, prov: head[head.length - 1],
      measured, reported: reported(doc.h1, cols, measured.map((r) => r.label)),
      note: noteP ? { k: T(find(noteP, tag('strong'))), t: clean(T(noteP).replace(T(find(noteP, tag('strong'))), '').replace(/^\s*:\s*/, '')) } : null,
    };
  }
  const honest = rest.find((s) => find(s, slot('document')));
  if (honest) {
    const d = find(honest, slot('document'));
    doc.honest = {
      h2: T(find(honest, tag('h2'))),
      paras: d.c.filter((k) => isN(k) && k.t === 'p').map((p) => p.c.map((k) => (isN(k) ? (k.t === 'em' ? { em: T(k) } : T(k)) : k.replace(/\s+/g, ' '))).filter((k) => k !== '')),
    };
  }
  const deeper = rest.find((s) => s !== honest && find(s, tag('a')));
  if (deeper) doc.deeper = { h2: T(find(deeper, tag('h2'))), links: findAll(deeper, tag('a')).map((a) => ({ label: T(a), href: a.a.href })) };
  return doc;
}
