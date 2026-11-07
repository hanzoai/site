'use client';
/* Gist: the one object a text-only chapter gets, drawn only from that chapter's own words and figures (no new copy).
   - figures with units or prices ("0.27 ms p50", "$0.021 per million tokens") become count-up tiles (kit Stat);
   - bare counts of one kind ("1,024" against "32,768") become bars at their true ratio, growing in when seen;
   - a list of three or more short steps beside a colon ("which tool, whether a test passed, whether to stop") becomes
     a step track whose light walks from step to step, the way an agent moves through them.
   gist(blocks) picks one, or none, for a chapter whose blocks are all paragraphs. It restates the chapter, so it is
   aria-hidden: screen readers get the sentence once. */
import { useEffect, useRef } from 'react';
import { Stat } from '../../kit';

const say = (inl) => inl.map((k) => (typeof k === 'string' ? k : k.c !== undefined ? k.c : k.t || k.b || '')).join('');

function figures(text) {
  const out = [];
  const re = /(\$?)(\d[\d,]*(?:\.\d+)?)/g;
  let m;
  while ((m = re.exec(text))) {
    const before = text[m.index - 1] || ' ', after = text.slice(re.lastIndex);
    if (/[\w.-]/.test(before) || /^[\w-]/.test(after)) continue; // kai-1.3, Kai-2, 306-cell
    if (!m[1] && /^(19|20)\d\d$/.test(m[2])) continue; // years
    const v = m[1] + m[2];
    if (out.some((f) => f.v === v)) continue;
    const cap = (/^\s*([^.,;:()]*)/.exec(after)[1] || '').trim().split(/\s+/).filter(Boolean).slice(0, 3).join(' ');
    out.push({ v, cap, n: parseFloat(m[2].replace(/,/g, '')), bare: !m[1] && !m[2].includes('.') });
  }
  return out;
}

function steps(text) {
  for (const s of text.split(/(?<=[.!?])\s+/)) {
    const i = s.indexOf(':');
    if (i < 0) continue;
    for (const side of [s.slice(0, i), s.slice(i + 1).replace(/[.!?]$/, '')]) {
      const items = side.split(/,\s*(?:and |or )?/).map((x) => x.trim()).filter(Boolean);
      if (items.length >= 3 && items.every((x) => x.split(/\s+/).length <= 5)) return items;
    }
  }
  return null;
}

export function gist(blocks) {
  if (!blocks.length || blocks.some(({ b }) => b.k !== 'p')) return null;
  const texts = blocks.map(({ b }) => say(b.inl));
  const figs = figures(texts.join(' '));
  if (figs.length >= 2) {
    const at = texts.findIndex((t) => t.includes(figs[figs.length - 1].v));
    return { kind: figs.every((f) => f.bare) ? 'bars' : 'figs', figs, after: Math.max(0, at) };
  }
  for (let k = 0; k < texts.length; k++) {
    const items = steps(texts[k]);
    if (items) return { kind: 'steps', items, after: k };
  }
  return null;
}

export default function Gist({ g }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { el.dataset.on = String(e.isIntersecting); }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  if (g.kind === 'steps') {
    return (
      <ol className="xbg-gist steps" ref={ref} aria-hidden="true" style={{ '--n': g.items.length }}>
        {g.items.map((x, i) => (
          <li key={x} style={{ '--i': i }}>
            <i className="xbg-gist-dot" />
            <span className="x-mono">{String(i + 1).padStart(2, '0')}</span>
            <span className="xbg-gist-t">{x}</span>
          </li>
        ))}
      </ol>
    );
  }
  if (g.kind === 'bars') {
    const top = Math.max(...g.figs.map((f) => f.n));
    return (
      <div className="xbg-gist bars" ref={ref} aria-hidden="true">
        {g.figs.map((f) => (
          <div key={f.v} className="xbg-gist-bar">
            <Stat value={f.v} className="xbg-gist-s" />
            <span className="xbg-gist-track"><i style={{ width: (100 * f.n / top).toFixed(2) + '%' }} /></span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="xbg-gist figs" ref={ref} aria-hidden="true" style={{ '--n': Math.min(g.figs.length, 3) }}>
      {g.figs.map((f) => <Stat key={f.v} value={f.v} label={f.cap || undefined} className="xbg-gist-s" />)}
    </div>
  );
}
