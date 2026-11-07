'use client';
/* A product of Hanzo OS (/products/<name>, seven of them, one template), as an apple.com launch page.
   The product's name runs at display size with its one line and its one ask on the left; beside them, whole on the
   first screen, the product itself: a live api.hanzo.ai console that starts typing on arrival. Then one idea per
   screen: each sentence of Hanzo's paragraph pins in turn beside the operations it describes (from Hanzo's own API
   table), the API is a spec sheet whose rows light as they pass the middle of the screen, Hanzo's measurements stand
   as hero figures, and the seven layers of Hanzo OS close the page as rows that open into their own page. Ink, greys and
   white only (JAMES.md 7): each product is told apart by its own contour (Sigil seeded with its slug) and its own data.
   Persona: Developer (and the founder wiring a company of agents)
   Goal: make the first call to this layer of the API
   CTA: the hero's ask, Hanzo's words ("Try Hanzo"), riding the site ask bar after the hero
   Metric: signup_start (then api_key_created)
   Signature: the console runs itself. The request types out of Hanzo's own "Try it", then the API answers: each of
   the product's operations lands in turn and the count settles, once, then rests (Replay runs it again). Point at
   an operation and Hanzo's line for it slides in under the answer.
   Beyond: peek the seven. The Hanzo OS stack shows every layer's operation count from its own API table and its line
   on hover or focus, so you can choose the next product without opening six pages; each opens into its page.
   Motion (not only scroll): time (the console types and answers on arrival), state (point at an operation and its line
   slides in; replay), pointer (magnetic ask, counts that surface on hover), scroll (the sentence chapters wipe).
   Ledger: deleted the per-product accent colours, the green live dot, syntax hues, the kicker over the h1, the
   coloured hover stripe, the invented "operations" / "Replay" labels, the word-lit paragraph (a wall of text) and the
   Stage zoom that pushed the console under the fold.
   Scale (MASTER 3.1): h1 52, section heads 26, sentences 32, figures 64; the spec count and the first measured
   figure grow past 64 only while they cross the middle of the screen (FamGrow), then settle back.
   V2: 8/10 launch page in ink: name, line and ask beside the live console, whole on the first screen at 1470×801;
   Hanzo's paragraph as one sentence per screen beside its own operations; API spec sheet; measured figures; Hanzo OS
   layers that open. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { Copy, Magnetic } from '../ui';
import { A, More } from '../kit';
import Sigil from '../Sigil';
import FamLines from '../v2/FamLines';
import FamChapters from '../v2/FamChapters';
import FamGrow from '../v2/FamGrow';
import { ui } from '../v2/famUi';
import '../v2/fam.css';
import './ProductPage.css';

const CPS = 110; // characters a second
const slugOf = (h) => h.replace(/\/$/, '').split('/').pop();

/* ---------- the signature: the console that runs itself ---------- */
function Console({ p }) {
  const root = useRef(null);
  const seen = useInView(root, { amount: 0.35 });
  const calm = useReducedMotion();
  const [run, setRun] = useState(0);
  const [sel, setSel] = useState(-1); // an operation you point at or tap: its line shows under the answer
  const hold = useRef(0);
  const point = (i) => { clearTimeout(hold.current); setSel(i); };
  const leave = () => { clearTimeout(hold.current); hold.current = setTimeout(() => setSel(-1), 1400); };
  const full = p.tryIt.toks.map((t) => t[1]);
  const code = full.join('');
  const ops = p.api.ops;

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
    const pane = el.querySelector('.xpd-req');
    if (pane) pane.scrollTop = 0;
    delete el.dataset.done;
    rows.forEach((r) => r.removeAttribute('data-in'));
    toks.forEach((n) => { n.textContent = ''; });
    const timers = [];
    let raf = 0;
    const t0 = performance.now() + 250;
    const tick = (now) => {
      let n = Math.max(0, Math.floor(((now - t0) / 1000) * CPS));
      let cur = -1;
      for (let i = 0; i < toks.length; i++) {
        const take = Math.max(0, Math.min(full[i].length, n));
        if (toks[i].textContent.length !== take) toks[i].textContent = full[i].slice(0, take);
        if (take > 0) cur = i;
        n -= take;
      }
      toks.forEach((t, i) => (i === cur ? t.setAttribute('data-cur', '') : t.removeAttribute('data-cur')));
      // the pane follows the cursor, only once it would leave the view
      const c = cur >= 0 && toks[cur];
      if (pane && c) { const y = c.offsetTop + c.offsetHeight - pane.clientHeight + 32; if (y > pane.scrollTop) pane.scrollTop = y; }
      if (now - t0 < (code.length / CPS) * 1000 + 40) { raf = requestAnimationFrame(tick); return; }
      toks.forEach((t, i) => { t.textContent = full[i]; t.removeAttribute('data-cur'); });
      rows.forEach((r, i) => timers.push(setTimeout(() => r.setAttribute('data-in', ''), 320 + i * 170)));
      timers.push(setTimeout(() => { el.dataset.done = ''; }, 320 + rows.length * 170));
      // it runs once and settles (MASTER part 9: a demo ends at rest); the replay button runs it again
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); };
  }, [seen, run, calm]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="xpd-con" ref={root} data-done={calm ? '' : undefined}>
      <div className="xpd-con-bar">
        <span className="xpd-live" aria-hidden="true" />
        <span className="x-mono">api.hanzo.ai</span>
        <span className="xpd-con-sp" />
        <Copy text={code} />
        <button type="button" className="xpd-replay" onClick={() => setRun((r) => r + 1)} aria-label={ui('replay')}>
          <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
      <div className="xpd-con-g">
        <div className="xpd-req" data-lenis-prevent>
          <h2 className="xpd-pane-h x-mono">{p.tryIt.title}</h2>
          <pre tabIndex={0}><code>{p.tryIt.toks.map(([k, t], i) => <span key={i} data-t data-k={k}>{t}</span>)}</code></pre>
        </div>
        <div className="xpd-res" aria-hidden="true">
          <p className="xpd-pane-h x-mono">{p.api.title}</p>
          <ol className="xpd-ans" onPointerLeave={leave}>
            {ops.map((r, i) => (
              <li key={i} data-row data-sel={sel === i ? '' : undefined} onPointerEnter={(e) => e.pointerType === 'mouse' && point(i)} onClick={() => (sel === i ? setSel(-1) : point(i))}>
                <b className="xpd-m x-mono" data-m={r[0]}>{r[0]}</b><span className="x-mono">{r[1]}</span>
              </li>
            ))}
          </ol>
          <div className="xpd-ans-n">
            <b className="v2f-num v2f-fig" data-off={sel >= 0 ? '' : undefined}>{ops.length}</b>
            {ops.map((r, i) => <span key={i} className="xpd-ans-d" data-on={sel === i ? '' : undefined}>{r[2]}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Hanzo's paragraph, one sentence a screen, each beside the operations it describes (matched by the words they share in
   Hanzo's own API table); every word stays, nothing is added */
const STOP = new Set('the and for its one org org’s org\'s own any that with from are can each every what who how when this they their them into than then also not but has have had was were will just same way does did out per'.split(' '));
const stems = (t) => new Set((t.toLowerCase().match(/[a-z_]{3,}/g) || []).filter((w) => !STOP.has(w)).map((w) => w.slice(0, 5)));
const split = (t) => t.split(/(?<=[.!?]["”’)]?)\s+(?=[A-Z“"‘(])/).map((x) => x.trim()).filter(Boolean);
function opsFor(sentence, ops, k) {
  const a = stems(sentence);
  const scored = ops.map((o, i) => [i, [...stems(o[1].replace(/[{}/]/g, ' ') + ' ' + o[2])].filter((w) => a.has(w)).length]).filter((x) => x[1] > 0).sort((x, y) => y[1] - x[1]);
  return (scored.length ? scored.slice(0, 2).map((x) => x[0]).sort((x, y) => x - y) : [k % ops.length]).map((i) => ops[i]);
}
function Said({ p, text }) {
  const sents = split(text);
  const items = sents.map((t, k) => ({
    key: 's' + k,
    text: <p className="xpd-said" aria-hidden="true">{t}</p>,
    visual: (
      <div className="xpd-said-v v2f-obj" aria-hidden="true">
        <Sigil seed={'/products/' + p.slug + '/' + k} data={[t.length, p.api.ops.length]} className="xpd-said-s" still />
        <ul className="xpd-said-o">
          {opsFor(t, p.api.ops, k).map((o) => (
            <li key={o[0] + o[1]}><b className="xpd-m x-mono" data-m={o[0]}>{o[0]}</b><code className="xpd-path">{o[1]}</code><span>{o[2]}</span></li>
          ))}
        </ul>
      </div>
    ),
  }));
  // the paragraph is read whole once (screen readers, search, JS off); the sentences on screen are its picture
  return (
    <>
      <p className="x-sr">{text}</p>
      <FamChapters label={p.title} items={items} className="xpd-saych" />
    </>
  );
}

/* the API as a spec sheet: the heading and the count stay pinned, each row lights as it crosses the middle */
function Spec({ api }) {
  const list = useRef(null);
  useEffect(() => {
    list.current.setAttribute('data-armed', '');
    const rows = [...list.current.querySelectorAll('tbody tr')];
    const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? e.target.setAttribute('data-lit', '') : e.target.removeAttribute('data-lit'))), { rootMargin: '-42% 0px -42% 0px' });
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);
  return (
    <section className="xpd-spec v2f-sec" aria-labelledby="xpd-api">
      <div className="v2f-wrap v2f-grid">
        <div className="xpd-spec-l">
          <FamLines as="h2" play="view" id="xpd-api" text={api.title} className="v2f-head xpd-spec-t" />
          <p className="v2f-lede xpd-spec-h">{api.lede}</p>
          <p className="xpd-spec-n" aria-hidden="true"><FamGrow to={1.75}><b className="v2f-num v2f-fig">{api.ops.length}</b></FamGrow></p>
        </div>
        <div className="xpd-spec-r" ref={list}>
          <table className="xpd-tab">
            <thead><tr>{api.heads.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
            <tbody>
              {api.ops.map((r, i) => (
                <tr key={i}>
                  <td><b className="xpd-m x-mono" data-m={r[0]}>{r[0]}</b></td>
                  <td><code className="xpd-path">{r[1]}</code></td>
                  <td className="xpd-what">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* Hanzo's measurements as hero figures: "from A to B" stands as B, "A against B" as A; the sentence stays whole */
const hero = (s) => {
  const to = /from ([\d.,]+%?) to ([\d.,]+%?)/.exec(s);
  if (to) return to[2];
  const vs = /([\d.,]+%?) against/.exec(s);
  return vs ? vs[1] : null;
};
function Measured({ m }) {
  return (
    <section className="xpd-meas v2f-sec" aria-labelledby="xpd-meas-h">
      <div className="v2f-wrap">
        <FamLines as="h2" play="view" id="xpd-meas-h" text={m.title} className="v2f-head xpd-meas-h" />
        <ul className="xpd-meas-g">
          {m.links.map((l, k) => {
            const [name, ...rest] = l.text.split(': ');
            const fig = hero(rest.join(': '));
            return (
              <li key={l.href}>
                <A to={l.href} className="xpd-meas-c">
                  {fig ? (k === 0 ? <FamGrow to={1.75}><b className="v2f-num v2f-fig xpd-meas-f" aria-hidden="true">{fig}</b></FamGrow> : <b className="v2f-num v2f-fig xpd-meas-f" aria-hidden="true">{fig}</b>) : <i className="xpd-meas-f none" aria-hidden="true" />}
                  <span className="xpd-meas-t"><b>{name}</b>{rest.length ? ': ' + rest.join(': ') : ''}</span>
                </A>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default function ProductPage({ p, peek = {} }) {
  const nums = [p.api.ops.length, p.os.length, ...(p.measured ? p.measured.links.flatMap((l) => (l.text.match(/\d[\d,]*(?:\.\d+)?/g) || []).map((x) => +x.replace(/,/g, ''))) : [])];
  const intro = (function flat(ns) { return ns.map((n) => (typeof n === 'string' ? n : flat(n.c || []))).join(''); })(p.intro).replace(/\s+/g, ' ').trim();
  return (
    <main className="v2f xpd">
      <section className="xpd-hero" aria-labelledby="xpd-h1" data-ask-name={p.title}>
        <Sigil seed={'/products/' + p.slug} data={nums} className="xpd-sigil" still />
        <div className="v2f-wrap v2f-grid xpd-hero-g">
          <div className="xpd-hero-l">
            <FamLines as="h1" id="xpd-h1" text={p.title} className="v2f-display xpd-h1" data-morph-target />
            <p className="v2f-lede xpd-lede">{p.lede}</p>
            <div className="xpd-acts">
              <Magnetic strength={0.22}><A to={p.acts[0].href} className="v2f-btn solid" data-thumb={p.acts[0].text} data-cta="products.hero">{p.acts[0].text}</A></Magnetic>
              <A to={p.acts[1].href} className="v2f-btn">{p.acts[1].text}</A>
            </div>
          </div>
          <div className="xpd-stage"><Console p={p} /></div>
        </div>
      </section>

      <Said p={p} text={intro} />

      <Spec api={p.api} />

      {p.measured && <Measured m={p.measured} />}

      <section className="xpd-os v2f-sec" aria-labelledby="xpd-os-h">
        <div className="v2f-wrap">
          <div className="xpd-os-top">
            <FamLines as="h2" play="view" id="xpd-os-h" text={p.osTitle} className="v2f-head" />
          </div>
          <nav aria-label={p.osTitle}>
            <ol className="xpd-os-l">
              {p.os.map((o, i) => {
                const k = slugOf(o.href), q = peek[k];
                return (
                  <li key={o.href}>
                    <A to={o.href} className="xpd-os-c" aria-current={o.current ? 'page' : undefined} data-cursor={o.current ? '' : undefined}>
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
          <div className="xpd-cta">
            <A to={p.acts[0].href} className="v2f-btn solid" data-cta="products.close">{p.acts[0].text}</A>
          </div>
        </div>
      </section>
    </main>
  );
}
