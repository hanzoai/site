'use client';
/* Parts of the /models family: the sibling field (signature), the bill comparer (beyond), the quick-start room and a
   plain drawer for any section hanzo.ai adds later. Rates are Hanzo's: printed from hanzo.ai, refreshed from
   api.hanzo.ai/v1/models in the browser, as hanzo.ai does. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Copy } from '../../ui';
import { A, Tabs, TabPanel, CodeBlock } from '../../kit';
import { href } from '../../../lib/route';
import { SNAP } from './rates';

export const money = (v) => (v == null ? '—' : v === 0 ? 'Free' : '$' + (v < 1 ? v.toFixed(3) : v.toFixed(2)));
export const rateText = (r) => (r ? `${money(r.in)} in · ${money(r.out)} out, per million tokens` : '—');
const ctxText = (t) => (t == null ? '—' : t >= 1e6 ? +(t / 1e6).toFixed(1) + 'M' : Math.round(t / 1000) + 'K');
const bill = (r, i, o) => (r ? r.in * i + r.out * o : null);
const dollars = (v) => (v == null ? '—' : v === 0 ? '$0' : '$' + (v >= 100 ? Math.round(v).toLocaleString('en-US') : v.toFixed(2)));

/* api.hanzo.ai's catalogue, asked once a page (the public GET hanzo.ai's own model pages read) */
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
// api.hanzo.ai's rate, once read, wins (it is what hanzo.ai itself prints); the captured rate and the snapshot are the first paint
export const rateFrom = (cat, id, own) => (cat && (cat[id] || cat[id.replace(/^hanzo\//, '')])) || own || SNAP[id] || SNAP[id.replace(/^hanzo\//, '')] || null;
/* a rate the page cannot print without asking api.hanzo.ai (printed rates and the snapshot need no request) */
export const missing = (id, own) => !rateFrom(null, id, own);

/* a link to a page this rebuild has (it opens by Morph); anything else opens Hanzo's live page in a new tab */
export const isLocal = (h) => !!h && !/^https?:/.test(href(h) || '');

/* One polite live region for the page: whenever a Copy button really copied (its own label turns to "Copied"),
   it is said once here, so a screen reader hears it wherever focus is (role="status"). */
export function CopyStatus() {
  const [msg, setMsg] = useState('');
  useEffect(() => {
    let t1 = 0, t2 = 0;
    const on = (e) => {
      const b = e.target && e.target.closest && e.target.closest('.x-copy');
      if (!b) return;
      clearTimeout(t1); clearTimeout(t2);
      t1 = setTimeout(() => {
        if (b.getAttribute('aria-label') !== 'Copied') return;
        setMsg('');
        t2 = setTimeout(() => { setMsg('Copied'); t2 = setTimeout(() => setMsg(''), 1800); }, 40);
      }, 260);
    };
    document.addEventListener('click', on);
    return () => { document.removeEventListener('click', on); clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return <span role="status" className="x-sr">{msg}</span>;
}

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
    // log context across, padded on both sides so no model sits on an edge (most makers' models share one or two sizes)
    const px = Math.max(0.25, (x1 - x0) * 0.18);
    x0 -= px; x1 += px;
    if (y1 - y0 < 0.4) { y0 -= 0.3; y1 += 0.3; }
    const free = ok.some((p) => p.rate.out === 0);
    const X = (v) => 10 + ((v - x0) / (x1 - x0)) * 80;
    const Y = (v) => (free ? 80 : 88) - ((v - y0) / (y1 - y0)) * (free ? 66 : 74);
    const seenAt = {};
    const dots = ok.map((p, i) => {
      let x = X(Math.log10(p.tokens)), y = p.rate.out > 0 ? Y(Math.log10(p.rate.out)) : 92;
      // models on the same spot (batch twins, one size and rate) open out on a small spiral around it, never off the plot
      const k = Math.round(x / 2) + ':' + Math.round(y / 3); const n = (seenAt[k] = (seenAt[k] || 0) + 1) - 1;
      if (n) { const a = n * 2.4, r = 1.7 * Math.sqrt(n); x += Math.cos(a) * r; y += Math.sin(a) * r * 2.2; }
      // rounded, so the server's maths and the browser's print the same style (no hydration mismatch)
      return { ...p, x: +Math.min(95, Math.max(5, x)).toFixed(2), y: +Math.min(95, Math.max(5, y)).toFixed(2), i, local: isLocal(p.href) };
    });
    // a tick at every context size the maker offers (Hanzo's own short form), else at each power of ten
    const sizes = [...new Map(ok.map((p) => [p.ctx || ctxText(p.tokens), p.tokens])).entries()].sort((a, b) => a[1] - b[1]);
    const xt = [];
    if (sizes.length <= 6) sizes.forEach(([s, t]) => xt.push({ at: +X(Math.log10(t)).toFixed(2), t: s }));
    else for (let d = Math.ceil(x0); d <= Math.floor(x1); d++) xt.push({ at: +X(d).toFixed(2), t: ctxText(10 ** d) });
    // two sizes close together ("900K", "1M") keep only the first label, so no two labels print on each other
    for (let i = xt.length - 1; i > 0; i--) if (xt[i].at - xt[i - 1].at < 7) xt[i].t = '';
    const yt = [];
    for (let d = Math.ceil(y0); d <= Math.floor(y1); d++) yt.push({ at: +Y(d).toFixed(2), t: money(10 ** d) });
    if (free) yt.push({ at: 92, t: 'Free' });
    return { dots, xt, yt };
  }, [points]);
  const H = placed.dots.find((d) => d.href === hot);
  const me = placed.dots.find((d) => d.href === here);
  return (
    <div className={'xmf-field' + (seen ? ' on' : '')} ref={ref} role="group" aria-label={label}>
      <div className="xmf-plot">
        {placed.xt.map((t, i) => <span key={'x' + i} className="xmf-gx" style={{ left: t.at + '%' }}><i>{t.t}</i></span>)}
        {placed.yt.map((t) => <span key={'y' + t.t} className="xmf-gy" style={{ top: t.at + '%' }}><i>{t.t}</i></span>)}
        <span className="xmf-sweep" aria-hidden="true"><i /></span>
        {placed.dots.map((d) => {
          const mine = d.href === here;
          const p = {
            className: 'xmf-dot' + (mine ? ' me' : '') + (d.local ? '' : ' far'),
            style: { left: d.x + '%', top: d.y + '%', '--x': (d.x / 100).toFixed(3), '--i': String(d.i) },
            'aria-label': `${d.name}: ${d.ctx || ctxText(d.tokens)} context, ${rateText(d.rate)}`,
            onPointerEnter: () => setHot(d.href), onPointerLeave: () => setHot(null),
            onFocus: () => setHot(d.href), onBlur: () => setHot(null),
          };
          // a model with a page here is a link; one without stays a readable point (it never sends you off the site)
          return d.local || mine
            ? <A key={d.href} to={d.href} {...p} aria-current={mine ? 'page' : undefined}><b aria-hidden="true" /></A>
            : <span key={d.href} {...p} role="img" tabIndex={0}><b aria-hidden="true" /></span>;
        })}
        {/* this page's own model is named at rest */}
        {me && H !== me && (
          <span className={'xmf-me-l' + (me.x > 60 ? ' l' : '')} style={{ left: me.x + '%', top: me.y + '%' }} aria-hidden="true">{me.name}</span>
        )}
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

/* ---------- the spec sheet's object: the two rates drawn to one scale ----------
   In and out per million tokens as two bars (Hanzo's own rates, nothing else); they draw in once when the sheet arrives. */
export function RateBars({ rate }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  if (!rate) return null;
  const top = Math.max(rate.in, rate.out) || 1;
  const bar = (k, v) => (
    <div className="xmf-rb-r">
      <span className="x-mono">{k}</span>
      <i aria-hidden="true"><b style={{ transform: `scaleX(${seen ? Math.max(v ? 0.02 : 0, v / top) : 0})` }} /></i>
      <em className="x-mono">{money(v)}</em>
    </div>
  );
  return (
    <div className="xmf-rb" ref={ref} aria-label={rateText(rate)} role="img">
      {bar('In', rate.in)}
      {bar('Out', rate.out)}
    </div>
  );
}

/* ---------- a limit drawn: the context a model reaches, against what it was trained on ----------
   Both numbers come from Hanzo's own spec line ("32,768 tokens (YaRN; trained: 1,024)"); the bar is to scale. */
export function Reach({ value, tokens }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const m = /trained:\s*([\d,]+)/.exec(value || '');
  const trained = m ? parseInt(m[1].replace(/,/g, ''), 10) : null;
  if (!tokens) return null;
  const reach = (value || '').split(' (')[0];
  // the reach in steps of the trained length (32,768 / 1,024 = 32 cells): the first cell is what it was trained on
  const n = trained && tokens % trained === 0 && tokens / trained <= 64 ? tokens / trained : 0;
  return (
    <figure className={'xmf-reach' + (seen ? ' on' : '')} ref={ref}>
      <div className={'xmf-reach-bar' + (n ? ' cells' : '')} aria-hidden="true">
        {n ? Array.from({ length: n }, (_, i) => <i key={i} className={i ? '' : 'tr'} style={{ '--i': String(i) }} />) : <i className="all" />}
      </div>
      <figcaption>
        {trained && <span className="x-mono tr">{m[1]}</span>}
        <span className="x-mono all">{reach}</span>
      </figcaption>
    </figure>
  );
}

/* ---------- Hanzo's other "More from" cards that are not in the rail ----------
   One line each: the name and its context; the description arrives on hover or focus (it is in the HTML throughout).
   A model this rebuild has a page for opens it; one it has not opens Hanzo's live page in a new tab and says so. */
export function Also({ cards }) {
  if (!cards.length) return null;
  return (
    <ul className="xmf-also">
      {cards.map((c) => {
        const far = !isLocal(c.href);
        return (
          <li key={c.href}>
            <A to={c.href} className={'xmf-also-a' + (far ? ' far' : '')} {...(far ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              <b>{c.name}<i aria-hidden="true">{far ? '↗' : '→'}</i>{far && <span className="x-sr"> (opens in a new tab)</span>}</b>
              {c.ctx && <span className="x-mono xmf-also-c">{c.ctx}</span>}
              {c.desc && <span className="xmf-also-d">{c.desc}</span>}
            </A>
          </li>
        );
      })}
    </ul>
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
