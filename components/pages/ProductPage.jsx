'use client';
/* A product of Hanzo OS (/products/<name>, seven of them, one template), as an apple.com launch page: the product
   itself is the big thing. The name (it arrives large and settles to its 52px rest) and its one line and ask sit over
   a light api.hanzo.ai console, centred low and nearly the width of the page, whole on the first screen. The console
   is the one place the API is listed: Hanzo's own request types itself on the left, and Hanzo's API table answers on the
   right, every operation once, with what it does. Then the console pins and Hanzo's paragraph scrubs past beneath it,
   one sentence at a time, each lighting the operations it names. Measured figures (memory), the seven layers of Hanzo
   OS, the docs, and a dark closing band with the one ask end the page. Ink, greys and white; each product is told apart
   by its own contour (Sigil seeded with its slug), request and operations.
   Persona: Developer (and the founder wiring a company of agents)
   Goal: make the first call to this layer of the API
   CTA: the hero's ask, Hanzo's words ("Try Hanzo"), again in the closing band
   Metric: signup_start (then api_key_created)
   Signature: the console runs itself. The request types out of Hanzo's own "Try it", the API table lands row by row,
   then each operation lights once in turn and the console rests with the sound kit's faint 'done' (Replay runs it
   again).
   Beyond: the paragraph points at the product. As each of Hanzo's sentences passes under the pinned console, the
   operations it names light up in the table, so the words and the API read as one thing.
   Motion (not only scroll): time (the request types itself, rows land, a one-pass walk), state (a sentence lights its operations;
   replay), pointer (magnetic ask; a row fills under the pointer), arrival (the name cut in, large, settling), scroll
   (the pinned console and the sentence strip).
   Scale (MASTER 3.1, review 15:05): the product is the big thing of the first screen; h1 52 at rest (arrives up to
   84); section heads 44; sentences 32; table 15–16; figures 64, the first measured one growing at its moment.
   Ledger: deleted the dark console card, the pinned word+card chapters, the separate spec sheet (raw <table>), the
   repeated operation lists, the thin count, the empty no-figure card, the link-list ending and the console's colour.
   V2: 8/10 Apple launch layout of its own: name over a light, wide console that holds the API once; the paragraph
   scrubs under the pinned console lighting its operations; measured figures; Hanzo OS; dark closing band. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion, useScroll, useTransform, useMotionValueEvent, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Copy, Magnetic } from '../ui';
import { A, More } from '../kit';
import Sigil from '../Sigil';
import FamLines from '../v2/FamLines';
import FamGrow from '../v2/FamGrow';
import { ui } from '../v2/famUi';
import { play } from '../../lib/sound';
import '../v2/fam.css';
import './ProductPage.css';

const CPS = 110; // characters a second
const slugOf = (h) => h.replace(/\/$/, '').split('/').pop();
/* a path breaks only after a slash, never mid-word (no characters added: <wbr> only) */
const wb = (path) => path.split('/').map((seg, i, a) => <span key={i}>{seg}{i < a.length - 1 ? <>/<wbr /></> : null}</span>);

/* Hanzo's paragraph as sentences, and which of Hanzo's operations each one names (by the words they share) */
const STOP = new Set('the and for its one org org’s org\'s own any that with from are can each every what who how when this they their them into than then also not but has have had was were will just same way does did out per'.split(' '));
const stems = (t) => new Set((t.toLowerCase().match(/[a-z_]{3,}/g) || []).filter((w) => !STOP.has(w)).map((w) => w.slice(0, 5)));
const split = (t) => t.split(/(?<=[.!?]["”’)]?)\s+(?=[A-Z“"‘(])/).map((x) => x.trim()).filter(Boolean);
function opsFor(sentence, ops) {
  const a = stems(sentence);
  return ops.map((o, i) => [i, [...stems(o[1].replace(/[{}/]/g, ' ') + ' ' + o[2])].filter((w) => a.has(w)).length]).filter((x) => x[1] > 0).sort((x, y) => y[1] - x[1]).slice(0, 2).map((x) => x[0]);
}

/* ---------- the signature: the light console, the one place the API is listed ---------- */
function Console({ p, lit }) {
  const root = useRef(null);
  const seen = useInView(root, { amount: 0.3 });
  const calm = useReducedMotion();
  const [run, setRun] = useState(0);
  const [walk, setWalk] = useState(-1); // the one-pass walk through the operations once they have landed
  const full = p.tryIt.toks.map((t) => t[1]);
  const code = full.join('');
  const { heads, ops } = p.api;

  // from here the browser takes over: the request is cleared and the answer held back until it is typed
  useLayoutEffect(() => {
    if (calm || !root.current) return;
    root.current.dataset.armed = '';
    root.current.querySelectorAll('[data-t]').forEach((n) => { n.textContent = ''; });
  }, [calm]);

  useEffect(() => {
    if (calm || !seen) return;
    const el = root.current;
    const toks = [...el.querySelectorAll('[data-t]')];
    const rows = [...el.querySelectorAll('[data-row]')];
    const pane = el.querySelector('.xpd-req-b');
    if (pane) { pane.scrollTop = 0; pane.scrollLeft = 0; }
    delete el.dataset.done;
    setWalk(-1);
    rows.forEach((r) => r.removeAttribute('data-in'));
    toks.forEach((n) => { n.textContent = ''; });
    const timers = [];
    let raf = 0;
    const t0 = performance.now() + 150;
    // the request types in 1.8 s at most (a long one types faster), and the answer lands while it types, so the API
    // table is never empty after the first second and a half
    const cps = Math.max(CPS, code.length / 1.8);
    rows.forEach((r, i) => timers.push(setTimeout(() => r.setAttribute('data-in', ''), 500 + i * 140)));
    const tick = (now) => {
      let n = Math.max(0, Math.floor(((now - t0) / 1000) * cps));
      let cur = -1;
      for (let i = 0; i < toks.length; i++) {
        const take = Math.max(0, Math.min(full[i].length, n));
        if (toks[i].textContent.length !== take) toks[i].textContent = full[i].slice(0, take);
        if (take > 0) cur = i;
        n -= take;
      }
      toks.forEach((t, i) => (i === cur ? t.setAttribute('data-cur', '') : t.removeAttribute('data-cur')));
      // the pane follows the cursor, only once it would leave the view (the code never wraps mid-URL; it scrolls)
      const c = cur >= 0 && toks[cur];
      if (pane && c) {
        const y = c.offsetTop + c.offsetHeight - pane.clientHeight + 24; if (y > pane.scrollTop) pane.scrollTop = y;
        const x = c.offsetLeft + c.offsetWidth - pane.clientWidth + 40; pane.scrollLeft = Math.max(0, x);
      }
      if (now - t0 < (code.length / cps) * 1000 + 40) { raf = requestAnimationFrame(tick); return; }
      toks.forEach((t, i) => { t.textContent = full[i]; t.removeAttribute('data-cur'); });
      if (pane) pane.scrollLeft = 0;
      rows.forEach((r) => r.setAttribute('data-in', ''));
      const landed = 200;
      timers.push(setTimeout(() => { el.dataset.done = ''; }, landed));
      // one pass: each operation lights in turn, then the console rests
      rows.forEach((_, i) => timers.push(setTimeout(() => setWalk(i), landed + 400 + i * 700)));
      timers.push(setTimeout(() => { setWalk(-1); play('done'); }, landed + 400 + rows.length * 700)); // the demo rests: a faint chime
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); };
  }, [seen, run, calm]); // eslint-disable-line react-hooks/exhaustive-deps

  const on = (i) => walk === i || (walk < 0 && lit && lit.includes(i));
  return (
    <div className="xpd-con" ref={root} data-done={calm ? '' : undefined}>
      <div className="xpd-con-bar">
        <span className="x-mono">api.hanzo.ai</span>
        <span className="xpd-con-sp" />
        <Copy text={code} />
        <button type="button" className="xpd-replay" onClick={() => setRun((r) => r + 1)} aria-label={ui('replay')}>
          <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
      <div className="xpd-con-g">
        <div className="xpd-req">
          <h2 className="xpd-pane-h x-mono">{p.tryIt.title}</h2>
          <div className="xpd-req-b" tabIndex={0} data-lenis-prevent data-swipe-own>
            <pre><code>{p.tryIt.toks.map(([k, t], i) => <span key={i} data-t data-k={k}>{t}</span>)}</code></pre>
          </div>
        </div>
        <div className="xpd-res">
          <div className="xpd-res-h">
            <h2 className="xpd-pane-h x-mono" id={'xpd-api-' + p.slug}>{p.api.title}</h2>
            <p className="xpd-res-l">{p.api.lede}</p>
          </div>
          {/* Hanzo's API table, once: method, path and what it does (an accessible table without a raw <table>) */}
          <div className="xpd-ops" role="table" aria-labelledby={'xpd-api-' + p.slug}>
            <div className="xpd-ops-h" role="row">{heads.map((h) => <span key={h} role="columnheader" className="x-mono">{h}</span>)}</div>
            <div role="rowgroup">
              {ops.map((r, i) => (
                <div key={i} className="xpd-op" role="row" data-row data-lit={on(i) ? '' : undefined}>
                  <span role="cell"><b className="xpd-m x-mono" data-m={r[0]}>{r[0]}</b></span>
                  <span role="cell"><code className="xpd-path">{wb(r[1])}</code></span>
                  <span role="cell" className="xpd-what">{r[2]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* the console pins, and Hanzo's paragraph scrubs past beneath it, a sentence at a time, lighting what it names */
function Stage({ p, intro }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const sents = split(intro);
  const n = sents.length;
  const [at, setAt] = useState(-1);
  const [desk, setDesk] = useState(null); // unknown until mounted, so neither the desktop scrub nor the phone rail lights early
  useEffect(() => { const m = matchMedia('(min-width: 901px)'); const f = () => setDesk(m.matches && !calm); f(); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, [calm]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 72px', 'end end'] });
  const F = 0.6; // each sentence takes 60% of the strip's view, so the next one peeks in
  const x = useTransform(scrollYProgress, [0, 1], ['0%', -((n - 1) * F / n) * 100 + '%']);
  useMotionValueEvent(scrollYProgress, 'change', (v) => { if (!desk) return; const k = v <= 0.001 ? -1 : Math.min(n - 1, Math.round(v * (n - 1))); if (k !== at) setAt(k); });
  // phones: the strip is a swipe rail; the sentence in view lights its operations
  const rail = useRef(null);
  useEffect(() => {
    if (desk !== false || !rail.current) return;
    const cards = [...rail.current.querySelectorAll('[data-s]')];
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setAt(+e.target.dataset.s); }), { root: rail.current, threshold: 0.6 });
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [desk]);
  const lit = at >= 0 ? opsFor(sents[at], p.api.ops) : null;
  return (
    <section ref={ref} className="xpd-stage" style={{ '--n': n }} aria-label={p.api.title}>
      <div className="xpd-pin">
        <div className="v2f-wrap"><Console p={p} lit={lit} /></div>
        {/* the paragraph is read whole once (screen readers, search, JS off); the strip is its picture */}
        <p className="x-sr">{intro}</p>
        <div className="xpd-strip-v" ref={rail} data-swipe-own aria-hidden="true">
          <motion.ol className="xpd-strip" style={desk ? { x, width: n * 100 + '%' } : undefined} data-desk={desk ? '' : undefined}>
            {sents.map((t, k) => <li key={k} data-s={k} data-on={k === at ? '' : undefined}><span className="xpd-strip-n x-mono">{String(k + 1).padStart(2, '0')}</span><span>{t}</span></li>)}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}

/* Hanzo's measurements as figures: "from A to B" stands as B, "A against B" as A; the sentence stays whole.
   A result with no figure reads as a text row after the figures, never as an empty card */
const figOf = (s) => {
  const to = /from ([\d.,]+%?) to ([\d.,]+%?)/.exec(s);
  if (to) return to[2];
  const vs = /([\d.,]+%?) against/.exec(s);
  return vs ? vs[1] : null;
};
function Measured({ m }) {
  const all = m.links.map((l) => { const [name, ...rest] = l.text.split(': '); return { ...l, name, rest: rest.join(': '), fig: figOf(rest.join(': ')) }; });
  const figs = all.filter((x) => x.fig), plain = all.filter((x) => !x.fig);
  return (
    <section className="xpd-meas v2f-sec" aria-labelledby="xpd-meas-h">
      <div className="v2f-wrap">
        <FamLines as="h2" play="view" id="xpd-meas-h" text={m.title} className="xpd-sec-h" />
        <ul className="xpd-meas-g">
          {figs.map((l, k) => (
            <li key={l.href}>
              <A to={l.href} className="xpd-meas-c">
                {k === 0 ? <FamGrow to={1.6}><b className="v2f-num v2f-fig" aria-hidden="true">{l.fig}</b></FamGrow> : <b className="v2f-num v2f-fig" aria-hidden="true">{l.fig}</b>}
                <span className="xpd-meas-t"><b>{l.name}</b>{l.rest ? ': ' + l.rest : ''}</span>
              </A>
            </li>
          ))}
        </ul>
        {!!plain.length && (
          <ul className="xpd-meas-rows">
            {plain.map((l) => <li key={l.href}><A to={l.href} className="xpd-meas-r"><b>{l.name}</b>{l.rest ? ': ' + l.rest : ''}</A></li>)}
          </ul>
        )}
      </div>
    </section>
  );
}

export default function ProductPage({ p, peek = {} }) {
  const router = useRouter();
  const nums = [p.api.ops.length, p.os.length, ...(p.measured ? p.measured.links.flatMap((l) => (l.text.match(/\d[\d,]*(?:\.\d+)?/g) || []).map((x) => +x.replace(/,/g, ''))) : [])];
  const intro = (function flat(ns) { return ns.map((n) => (typeof n === 'string' ? n : flat(n.c || []))).join(''); })(p.intro).replace(/\s+/g, ' ').trim();
  // the other layers are fetched while you read, so a row opens its page at once (the title flies into its h1)
  useEffect(() => {
    const t = setTimeout(() => p.os.filter((o) => !o.current).forEach((o) => router.prefetch(o.href)), 1500);
    return () => clearTimeout(t);
  }, [p.slug]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <main className="v2f xpd">
      <section className="xpd-hero" aria-labelledby="xpd-h1" data-ask-name={p.title}>
        <Sigil seed={'/products/' + p.slug} data={nums} className="xpd-sigil" still />
        <div className="v2f-wrap v2f-grid xpd-hero-g">
          <div className="xpd-hero-l">
            <FamLines as="h1" id="xpd-h1" text={p.title} className="v2f-display xpd-h1" data-morph-target />
          </div>
          <div className="xpd-hero-r">
            <p className="v2f-lede xpd-lede">{p.lede}</p>
            <div className="xpd-acts">
              <Magnetic strength={0.22}><A to={p.acts[0].href} className="v2f-btn solid" data-thumb={p.acts[0].text} data-cta="products.hero">{p.acts[0].text}</A></Magnetic>
              <A to={p.acts[1].href} className="v2f-btn">{p.acts[1].text}</A>
            </div>
          </div>
        </div>
      </section>

      <Stage p={p} intro={intro} />

      {p.measured && <Measured m={p.measured} />}

      <section className="xpd-os v2f-sec" aria-labelledby="xpd-os-h">
        <div className="v2f-wrap">
          <FamLines as="h2" play="view" id="xpd-os-h" text={p.osTitle} className="xpd-sec-h" />
          <nav aria-label={p.osTitle}>
            <ol className="xpd-os-l">
              {p.os.map((o, i) => {
                const k = slugOf(o.href), q = peek[k];
                return (
                  <li key={o.href}>
                    <A to={o.href} className="xpd-os-c" aria-current={o.current ? 'page' : undefined}>
                      <span className="xpd-os-i x-mono" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                      <b className="xpd-os-n" data-morph={o.current ? undefined : ''}>{o.name}</b>
                      <span className="xpd-os-d">{o.desc}</span>
                      {q && <span className="xpd-os-k" aria-hidden="true"><b className="v2f-num">{q.ops}</b><span className="x-mono">{p.api.title}</span></span>}
                    </A>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </section>

      {(p.docs || p.site) && (
        <section className="xpd-end v2f-sec tight">
          <div className="v2f-wrap v2f-grid">
            {p.docs && (
              <div className="xpd-docs">
                <h2 className="v2f-title">{p.docs.title}</h2>
                <ul>{p.docs.links.map((l) => <li key={l.href}><More to={l.href}>{l.text}</More></li>)}</ul>
              </div>
            )}
            {p.site && (
              <div className="xpd-site">
                <h2 className="v2f-title">{p.site.title}</h2>
                <ul>{p.site.links.map((l) => <li key={l.href}><A to={l.href}>{l.text}</A></li>)}</ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* the close: one dark room, Hanzo's own name and line, the one ask */}
      <section className="x-band xpd-band" data-room="dark" aria-labelledby="xpd-band-h">
        <div className="v2f-wrap xpd-band-g">
          <FamLines as="h2" play="view" id="xpd-band-h" text={p.title} className="xpd-band-h" />
          <p className="xpd-band-l">{p.lede}</p>
          <div className="xpd-band-a">
            <Magnetic strength={0.22}><A to={p.acts[0].href} className="v2f-btn xpd-band-btn" data-cta="products.close">{p.acts[0].text}</A></Magnetic>
            <A to={p.acts[1].href} className="v2f-btn xpd-band-2">{p.acts[1].text}</A>
          </div>
        </div>
      </section>
    </main>
  );
}
