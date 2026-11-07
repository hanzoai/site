'use client';
/* Parts of the /models family: the sibling field (signature), the bill comparer (beyond), the quick-start room and a
   plain drawer for any section hanzo.ai adds later. Rates are Hanzo's: printed from hanzo.ai, refreshed from
   api.hanzo.ai/v1/models in the browser when a rate was not printed. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Copy } from '../../ui';
import { A, Tabs, TabPanel, CodeBlock } from '../../kit';
import { SNAP } from './rates';

export const money = (v) => (v == null ? '—' : v === 0 ? 'Free' : '$' + (v < 1 ? v.toFixed(3) : v.toFixed(2)));
export const rateText = (r) => (r ? `${money(r.in)} in · ${money(r.out)} out, per million tokens` : '—');
const ctxText = (t) => (t == null ? '—' : t >= 1e6 ? +(t / 1e6).toFixed(1) + 'M' : Math.round(t / 1000) + 'K');
const bill = (r, i, o) => (r ? r.in * i + r.out * o : null);
const dollars = (v) => (v == null ? '—' : v === 0 ? '$0' : '$' + (v >= 100 ? Math.round(v).toLocaleString('en-US') : v.toFixed(2)));

/* api.hanzo.ai's catalogue, asked once a page and only when a rate is missing */
let CAT = null;
export function useCatalog(need) {
  const [map, setMap] = useState(null);
  useEffect(() => {
    if (!need) return;
    let gone = false;
    CAT ||= fetch('https://api.hanzo.ai/v1/models').then((r) => r.json()).then((j) => Object.fromEntries((j.data || [])
      .filter((x) => x.pricing && x.pricing.input_per_million != null)
      .map((x) => [x.id, { in: +x.pricing.input_per_million, out: +x.pricing.output_per_million }]))).catch(() => { CAT = null; return {}; });
    CAT.then((m) => { if (!gone) setMap(m); });
    return () => { gone = true; };
  }, [need]);
  return map;
}
export const rateFrom = (cat, id, own) => own || (cat && (cat[id] || cat[id.replace(/^hanzo\//, '')])) || SNAP[id] || SNAP[id.replace(/^hanzo\//, '')] || null;

/* ---------- signature: the sibling field ----------
   Every model from the same maker, placed by context window (across) and output rate (up). A light sweeps across it
   and each model it passes answers; this page's model rings. Every dot is a link (hover or focus reads it). */
export function Field({ points, here, label = 'Models by context window and output rate' }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.25 });
  const [hot, setHot] = useState(null);
  const placed = useMemo(() => {
    const ok = points.filter((p) => p.tokens && p.rate);
    if (!ok.length) return { dots: [], xt: [], yt: [] };
    const lx = ok.map((p) => Math.log10(p.tokens));
    const paid = ok.filter((p) => p.rate.out > 0).map((p) => Math.log10(p.rate.out));
    let [x0, x1] = [Math.min(...lx), Math.max(...lx)];
    let [y0, y1] = paid.length ? [Math.min(...paid), Math.max(...paid)] : [0, 1];
    if (x1 - x0 < 0.4) { x0 -= 0.3; x1 += 0.3; }
    if (y1 - y0 < 0.4) { y0 -= 0.3; y1 += 0.3; }
    const free = ok.some((p) => p.rate.out === 0);
    const X = (v) => 6 + ((v - x0) / (x1 - x0)) * 88;
    const Y = (v) => (free ? 82 : 92) - ((v - y0) / (y1 - y0)) * (free ? 74 : 84);
    const seenAt = {};
    const dots = ok.map((p, i) => {
      let x = X(Math.log10(p.tokens)), y = p.rate.out > 0 ? Y(Math.log10(p.rate.out)) : 94;
      const k = Math.round(x) + ':' + Math.round(y); const n = (seenAt[k] = (seenAt[k] || 0) + 1) - 1; // same spot (a batch twin): fan out
      if (n) { x += ((n % 2) * 2 - 1) * Math.ceil(n / 2) * 1.6; y -= Math.ceil(n / 2) * 1.2; }
      return { ...p, x, y, i };
    });
    const xt = [];
    for (let d = Math.ceil(x0); d <= Math.floor(x1); d++) xt.push({ at: X(d), t: ctxText(10 ** d) });
    const yt = [];
    for (let d = Math.ceil(y0); d <= Math.floor(y1); d++) yt.push({ at: Y(d), t: money(10 ** d) });
    if (free) yt.push({ at: 94, t: 'Free' });
    return { dots, xt, yt };
  }, [points]);
  const H = placed.dots.find((d) => d.href === hot);
  return (
    <div className={'xmf-field' + (seen ? ' on' : '')} ref={ref} role="group" aria-label={label}>
      <div className="xmf-plot">
        {placed.xt.map((t) => <span key={'x' + t.t} className="xmf-gx" style={{ left: t.at + '%' }}><i>{t.t}</i></span>)}
        {placed.yt.map((t) => <span key={'y' + t.t} className="xmf-gy" style={{ top: t.at + '%' }}><i>{t.t}</i></span>)}
        <span className="xmf-sweep" aria-hidden="true"><i /></span>
        {placed.dots.map((d) => {
          const me = d.href === here;
          return (
            <A
              key={d.href}
              to={d.href}
              className={'xmf-dot' + (me ? ' me' : '')}
              style={{ left: d.x + '%', top: d.y + '%', '--x': (d.x / 100).toFixed(3), '--i': d.i }}
              aria-label={`${d.name}: ${d.ctx || ctxText(d.tokens)} context, ${rateText(d.rate)}`}
              aria-current={me ? 'page' : undefined}
              onPointerEnter={() => setHot(d.href)} onPointerLeave={() => setHot(null)}
              onFocus={() => setHot(d.href)} onBlur={() => setHot(null)}
            >
              <b aria-hidden="true" />
            </A>
          );
        })}
        <AnimatePresence>
          {H && (
            <motion.span
              key={H.href}
              className={'xmf-tip' + (H.x > 60 ? ' l' : '') + (H.y < 30 ? ' d' : '')}
              style={{ left: H.x + '%', top: H.y + '%' }}
              initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.12 } }}
              transition={{ duration: 0.22, ease: EASE }}
              aria-hidden="true"
            >
              <b>{H.name}</b>
              <span className="x-mono">{H.ctx || ctxText(H.tokens)} · {money(H.rate.in)} in · {money(H.rate.out)} out</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="xmf-axes" aria-hidden="true"><span>Context window →</span><span>↑ Output $ / M tokens</span></div>
    </div>
  );
}

/* ---------- beyond: the bill comparer ----------
   Your month on this model next to any sibling: the two bills from Hanzo's rates, the ratio, and the context each
   gives you. Nothing is estimated; it is rate × volume. */
const STEPS = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
function Volume({ id, label, i, set }) {
  return (
    <label className="xmf-vol" htmlFor={id}>
      <span>{label}</span>
      <input id={id} type="range" min={0} max={STEPS.length - 1} step={1} value={i} onChange={(e) => set(+e.target.value)} aria-valuetext={STEPS[i] + ' million tokens a month'} style={{ '--f': (i / (STEPS.length - 1)) * 100 + '%' }} />
      <b className="x-mono">{STEPS[i].toLocaleString('en-US')}M</b>
    </label>
  );
}
export function Bill({ self, others }) {
  const priced = others.filter((o) => o.rate).sort((a, b) => a.rate.out - b.rate.out || a.rate.in - b.rate.in);
  const near = priced.length ? priced.reduce((b, o) => (Math.abs(o.rate.out - self.rate.out) < Math.abs(b.rate.out - self.rate.out) && o.name !== self.name ? o : b), priced[0]) : null;
  const [pick, setPick] = useState(near ? near.href : null);
  const [vi, setVi] = useState(3);
  const [vo, setVo] = useState(1);
  const other = priced.find((o) => o.href === pick) || null;
  const i = STEPS[vi], o = STEPS[vo];
  const a = bill(self.rate, i, o), b = other ? bill(other.rate, i, o) : null;
  const top = Math.max(a || 0, b || 0) || 1;
  const ratio = b != null && a > 0 && b > 0 ? (b > a ? b / a : a / b) : null;
  const say = b == null ? null : a === b ? 'The same bill for this mix.' : a === 0 || b === 0 ? (a === 0 ? `${self.name} is free at this volume.` : `${other.name} is free at this volume.`)
    : `${b > a ? other.name : self.name} costs ${ratio.toFixed(ratio < 10 ? 1 : 0)}× more for this mix.`;
  const ctxTop = Math.max(self.tokens || 0, (other && other.tokens) || 0) || 1;
  const row = (m, v, me) => (
    <div className={'xmf-brow' + (me ? ' me' : '')} key={m.name + (me ? '*' : '')}>
      <span className="xmf-bname">{m.name}</span>
      <span className="xmf-bar" aria-hidden="true"><motion.i initial={false} animate={{ scaleX: v == null ? 0 : Math.max(0.012, v / top) }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} /></span>
      <b className="x-mono">{dollars(v)}</b>
      <span className="xmf-bctx" aria-hidden="true"><motion.i initial={false} animate={{ scaleX: m.tokens ? m.tokens / ctxTop : 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} /></span>
      <span className="x-mono xmf-bctx-t">{m.ctx || ctxText(m.tokens)}</span>
    </div>
  );
  return (
    <div className="xmf-bill">
      {/* the month's bill is the hero figure; the sliders set it, a sibling sits beside it */}
      <div className="xmf-bill-l">
        <p className="xmf-bill-big"><b className="x-mono">{dollars(a)}</b><span>Bill a month</span></p>
        <p className="xmf-say">{say || `${dollars(a)} a month at ${i.toLocaleString('en-US')}M in and ${o.toLocaleString('en-US')}M out.`}</p>
        <div className="xmf-vols">
          <Volume id="xmf-vi" label="Input a month" i={vi} set={setVi} />
          <Volume id="xmf-vo" label="Output a month" i={vo} set={setVo} />
        </div>
      </div>
      <div className="xmf-bill-r">
      <div className="xmf-bhead" aria-hidden="true"><span>Model</span><span>Bill a month</span><span>Context</span></div>
      <div className="xmf-brows" aria-live="polite">
        {row(self, a, true)}
        {other && row(other, b, false)}
      </div>
      {priced.length > 0 && (
        <div className="xmf-pick" role="group" aria-label="Compare with" data-swipe-own data-cursor="">
          {priced.map((p) => (
            <button key={p.href} type="button" aria-pressed={p.href === pick} onClick={() => setPick(p.href)}>
              {p.href === pick && <motion.span layoutId="xmf-pick" className="xmf-pick-bg" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />}
              <span>{p.name}</span><i className="x-mono">{money(p.rate.out)}</i>
            </button>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

/* ---------- the quick-start room: the language you pick is kept for the next model page (PLAN-COMPONENTS 2.15:
   no auto-rotating snippet; the language persists) ---------- */
const LANG = 'hz-lang';
export function Codes({ samples, keyLink, title }) {
  const [on, setOn] = useState(0);
  const box = useRef(null);
  const calm = useReducedMotion();
  useEffect(() => {
    try { const k = localStorage.getItem(LANG); const j = samples.findIndex((s) => s.lang === k); if (j > 0) setOn(j); } catch { /* storage off: first tab */ }
  }, [samples]);
  const choose = (i) => { setOn(i); try { localStorage.setItem(LANG, samples[i].lang); } catch { /* storage off */ } };
  const keys = (e) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const j = (on + d + samples.length) % samples.length;
    choose(j);
    box.current.querySelectorAll('[role=tab]')[j].focus();
  };
  return (
    <div className="xmf-code" ref={box}>
      <Tabs id="xmf-lang" tabs={samples.map((x) => x.lang)} value={on} onChange={choose} label={title} />
      {samples.map((x, i) => (
        <TabPanel key={x.lang} id="xmf-lang" i={i} value={on} className="xmf-pane">
          <CodeBlock code={x.text} label={x.lang} />
        </TabPanel>
      ))}
      {keyLink && <A to={keyLink.href} className="xmf-key x-arrow">{keyLink.label}</A>}
    </div>
  );
}

/* ---------- a section drawn as written (rare: limits, notes) ---------- */
const BLOCK = new Set(['div', 'section', 'nav', 'header', 'footer', 'article', 'aside']);
export function Loose({ nodes }) {
  return nodes.map((n, i) => <Bit key={i} n={n} />);
}
function Bit({ n }) {
  if (typeof n === 'string') return n;
  const kids = <Loose nodes={n.c} />;
  const t = n.t;
  if (t === 'a') return n.a && n.a.href ? <A to={n.a.href}>{kids}</A> : <span>{kids}</span>;
  if (t === 'br') return <br />;
  if (t === 'img' || t === 'input') return null;
  if (t === 'button') return <span className="xmf-lbtn">{kids}</span>;
  if (BLOCK.has(t)) return <div>{kids}</div>;
  const T = ['h1', 'h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'code', 'pre', 'span', 'small', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'blockquote', 'sup', 'sub'].includes(t) ? (t === 'h1' ? 'h2' : t) : 'span';
  return <T>{kids}</T>;
}
