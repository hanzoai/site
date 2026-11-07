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

/* Life objects for a post that already holds the Game of Life (its own board and rules, no new words):
   'collide' runs two gliders into each other on a small board with dead edges, so the debris settles, then starts again;
   'emblem' is the glider alone in its 3×3 box (the hacker emblem), turning through its four phases. */
const GL = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
function sim(w, h, wrap) {
  return (g) => {
    const n = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      let c = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        let X = x + dx, Y = y + dy;
        if (wrap) { X = (X + w) % w; Y = (Y + h) % h; } else if (X < 0 || Y < 0 || X >= w || Y >= h) continue;
        c += g[Y * w + X];
      }
      n[y * w + x] = c === 3 || (c === 2 && g[y * w + x]) ? 1 : 0;
    }
    return n;
  };
}
const SHOWS = {
  collide: () => {
    const w = 22, h = 14, g = new Uint8Array(w * h);
    GL.forEach(([x, y]) => { g[(y + 1) * w + x + 1] = 1; g[(y + 1) * w + (w - 2 - x)] = 1; }); // one heading right, its mirror heading left
    return { w, h, start: g, next: sim(w, h, false), turns: 72, ms: 200 };
  },
  emblem: () => {
    const w = 8, h = 8, g = new Uint8Array(w * h);
    GL.forEach(([x, y]) => { g[(y + 2) * w + x + 2] = 1; });
    return { w, h, start: g, next: sim(w, h, true), turns: 0, ms: 700, crop: 3 };
  },
};
// the live cells' 3×3 box, so the emblem stays put while the glider turns
function crop(g, w, h, k) {
  let x0 = w, y0 = h;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (g[y * w + x]) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); }
  const out = new Uint8Array(k * k);
  for (let y = 0; y < k; y++) for (let x = 0; x < k; x++) out[y * k + x] = g[((y0 + y) % h) * w + ((x0 + x) % w)];
  return out;
}
function LifeShow({ kind }) {
  const ref = useRef(null), cells = useRef([]);
  const s = useRef(null);
  if (!s.current) s.current = SHOWS[kind]();
  const { w, h, crop: k } = s.current;
  const cols = k || w, rows = k || h;
  useEffect(() => {
    const el = ref.current, S = s.current;
    let g = S.start, n = 0, raf = 0, last = 0, on = false;
    const paint = () => { const v = S.crop ? crop(g, S.w, S.h, S.crop) : g; cells.current.forEach((c, i) => { if (c) c.dataset.on = v[i] ? '1' : ''; }); };
    paint();
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const loop = (t) => {
      if (t - last >= S.ms) { last = t; n += 1; if (S.turns && n > S.turns) { g = S.start; n = 0; } else g = S.next(g); paint(); }
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      el.dataset.on = String(e.isIntersecting);
      if (e.isIntersecting && !on && !calm) { on = true; raf = requestAnimationFrame(loop); }
      else if (!e.isIntersecting && on) { on = false; cancelAnimationFrame(raf); }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  const v = k ? crop(s.current.start, w, h, k) : s.current.start;
  return (
    <div className={'xbg-gist life ' + kind} ref={ref} aria-hidden="true">
      <div className="xbg-gist-board" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {Array.from({ length: cols * rows }, (_, i) => <i key={i} ref={(el) => { cells.current[i] = el; }} data-on={v[i] ? '1' : ''} />)}
      </div>
    </div>
  );
}

export default function Gist({ g }) {
  if (g.kind === 'collide' || g.kind === 'emblem') return <LifeShow kind={g.kind} />;
  return <GistDrawn g={g} />;
}

function GistDrawn({ g }) {
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
