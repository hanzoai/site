/* Server-side reader for the captured pages in content/pages/: turns Hanzo's HTML into a small JSON tree
   (strings and {t, a, c} nodes) that the family templates re-draw in the new design. Not shipped to the browser. */
import fs from 'node:fs';
import path from 'node:path';

const VOID = new Set(['br', 'img', 'input', 'hr', 'meta', 'link', 'source', 'wbr']);
const SKIP = new Set(['svg', 'script', 'style']);
const KEEP = ['href', 'id', 'data-slot', 'data-code', 'data-label', 'aria-current', 'colspan', 'rowspan', 'placeholder', 'required', 'type', 'name', 'accept'];
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…', mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”' };
const decode = (s) => s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) => {
  if (e[0] === '#') return String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
  return ENT[e.toLowerCase()] ?? m;
});
// Cloudflare hides e-mail addresses as a hex string XOR-ed with its first byte; the page ships them decoded
const cf = (h) => { const k = parseInt(h.slice(0, 2), 16); let o = ''; for (let i = 2; i < h.length; i += 2) o += String.fromCharCode(parseInt(h.slice(i, i + 2), 16) ^ k); return o; };
const STRUCT = new Set(['ul', 'ol', 'table', 'thead', 'tbody', 'tr', 'div', 'section', 'nav', 'blockquote', 'main', 'form', 'pre']);

export function parse(html) {
  const root = { t: 'root', c: [] };
  const stack = [root];
  const L = html.length;
  let i = 0;
  const skipTo = (needle) => { const e = html.indexOf(needle, i); i = e < 0 ? L : e + needle.length; };
  while (i < L) {
    const top = stack[stack.length - 1];
    if (html[i] !== '<') {
      let e = html.indexOf('<', i); if (e < 0) e = L;
      const s = decode(html.slice(i, e)); i = e;
      if (!stack.some((k) => k.t === 'pre') && (/^\s*\n\s*$/.test(s) || (STRUCT.has(top.t) && !s.trim()))) continue;
      top.c.push(s);
    } else if (html.startsWith('<!--', i)) { skipTo('-->'); }
    else if (html[i + 1] === '/') {
      const e = html.indexOf('>', i); const name = html.slice(i + 2, e < 0 ? L : e).trim().toLowerCase(); i = e < 0 ? L : e + 1;
      for (let k = stack.length - 1; k > 0; k--) if (stack[k].t === name) { stack.length = k; break; }
    } else if (/[a-zA-Z]/.test(html[i + 1] || '')) {
      let j = i + 1; while (j < L && !/[\s/>]/.test(html[j])) j++;
      const name = html.slice(i + 1, j).toLowerCase(); const a = {}; let self = false;
      for (;;) {
        while (j < L && /\s/.test(html[j])) j++;
        if (j >= L) break;
        if (html[j] === '>') { j++; break; }
        if (html[j] === '/') { self = true; j++; continue; }
        let k = j; while (k < L && !/[\s=>/]/.test(html[k])) k++;
        const an = html.slice(j, k); j = k; let v = '';
        if (html[j] === '=') {
          j++;
          if (html[j] === '"' || html[j] === "'") { const q = html[j]; const e = html.indexOf(q, j + 1); v = html.slice(j + 1, e < 0 ? L : e); j = e < 0 ? L : e + 1; }
          else { k = j; while (k < L && !/[\s>]/.test(html[k])) k++; v = html.slice(j, k); j = k; }
        }
        if (KEEP.includes(an) || an === 'data-cfemail') a[an] = decode(v);
      }
      i = j;
      if (SKIP.has(name)) { if (!self) skipTo('</' + name); if (!self) skipTo('>'); continue; }
      if (a['data-cfemail']) { top.c.push(cf(a['data-cfemail'])); if (!self && !VOID.has(name)) { skipTo('</' + name); skipTo('>'); } continue; }
      if (a.href && a.href.includes('email-protection#')) a.href = 'mailto:' + cf(a.href.split('#')[1]);
      const n = { t: name, c: [] };
      if (Object.keys(a).length) n.a = a;
      top.c.push(n);
      if (!self && !VOID.has(name)) stack.push(n);
    } else { top.c.push('<'); i++; }
  }
  return root;
}
export function load(rel) {
  return parse(fs.readFileSync(path.join(process.cwd(), 'content', 'pages', rel + '.html'), 'utf8'));
}
export const isN = (n) => n && typeof n === 'object';
export function findAll(n, f, out = []) {
  if (!isN(n)) return out;
  if (f(n)) out.push(n);
  n.c.forEach((k) => findAll(k, f, out));
  return out;
}
export const find = (n, f) => findAll(n, f)[0];
export const textOf = (n) => (isN(n) ? n.c.map(textOf).join('') : n || '');
export const slot = (s) => (n) => n.a && n.a['data-slot'] === s;
export const tag = (t) => (n) => n.t === t;
export const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
/* the page's title (without the site name) from content/pages.json */
export function metaOf(route) {
  const idx = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content', 'pages.json'), 'utf8'));
  return idx[route];
}
