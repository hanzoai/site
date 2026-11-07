'use client';
/* A product of Hanzo OS (/products/<name>, seven of them, one template), as an apple.com launch page.
   The product's name runs at display size beside its one line; under it the product itself, a live api.hanzo.ai
   console, starts close and settles into place as you scroll (Stage). Then one idea per screen: its paragraph lights
   word by word as you read it, its API is a spec sheet whose rows light as they pass the middle of the screen while the
   heading and the operation count stay pinned, Hanzo's measurements stand as hero figures, and the seven layers of
   Hanzo OS close the page as cards that open into their own page. One accent per product, from its place in the seven.
   Signature: the console runs itself. The request types out of Hanzo's own "Try it", then the API answers: each of
   the product's operations lands in turn and the count settles. It replays on its own while it is on screen.
   Beyond: peek the seven. The Hanzo OS stack shows every layer's operation count from its own API table and its line,
   so you can choose the next product without opening six pages; each opens into its page.
   V2: 8/10 rebuilt as a launch page: display-size name, live console as the Stage hero object, scroll-lit statement,
   pinned API spec sheet, measured figures as heroes, Hanzo OS layers as open cards; one accent per product. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion, useScroll, useMotionValueEvent } from 'motion/react';
import { Copy } from '../ui';
import { A, More } from '../kit';
import Sigil from '../Sigil';
import FamLines from '../v2/FamLines';
import FamStage from '../v2/FamStage';
import { accentAt } from '../v2/famAccent';
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
  const full = p.tryIt.toks.map((t) => t[1]);
  const code = full.join('');
  const ops = p.api.ops;

  // from here the browser takes over: the request is cleared and the answer held back until it is typed
  useLayoutEffect(() => {
    if (calm || !root.current) return;
    const pre = root.current.querySelector('pre');
    pre.style.minHeight = pre.offsetHeight + 'px';
    root.current.dataset.armed = '';
    root.current.querySelectorAll('[data-t]').forEach((n) => { n.textContent = ''; });
  }, [calm]);

  useEffect(() => {
    if (calm || !seen) return;
    const el = root.current;
    const toks = [...el.querySelectorAll('[data-t]')];
    const rows = [...el.querySelectorAll('[data-row]')];
    delete el.dataset.done;
    rows.forEach((r) => r.removeAttribute('data-in'));
    toks.forEach((n) => { n.textContent = ''; });
    const timers = [];
    let raf = 0;
    const t0 = performance.now() + 450;
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
      if (now - t0 < (code.length / CPS) * 1000 + 40) { raf = requestAnimationFrame(tick); return; }
      toks.forEach((t, i) => { t.textContent = full[i]; t.removeAttribute('data-cur'); });
      rows.forEach((r, i) => timers.push(setTimeout(() => r.setAttribute('data-in', ''), 320 + i * 170)));
      timers.push(setTimeout(() => { el.dataset.done = ''; }, 320 + rows.length * 170));
      // it runs again by itself while it stays on screen
      timers.push(setTimeout(() => setRun((k) => k + 1), 320 + rows.length * 170 + 6500));
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
        <button type="button" className="xpd-replay" onClick={() => setRun((r) => r + 1)} aria-label="Replay the request">
          <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span>Replay</span>
        </button>
      </div>
      <div className="xpd-con-g">
        <div className="xpd-req">
          <h2 className="xpd-pane-h x-mono">{p.tryIt.title}</h2>
          <pre tabIndex={0} data-swipe-own><code>{p.tryIt.toks.map(([k, t], i) => <span key={i} data-t data-k={k}>{t}</span>)}</code></pre>
        </div>
        <div className="xpd-res" aria-hidden="true">
          <p className="xpd-pane-h x-mono">{p.api.title}</p>
          <ol className="xpd-ans">
            {ops.map((r, i) => (
              <li key={i} data-row><b className="xpd-m x-mono" data-m={r[0]}>{r[0]}</b><span className="x-mono">{r[1]}</span></li>
            ))}
          </ol>
          <p className="xpd-ans-n"><b className="v2f-num">{ops.length}</b><span>operations</span></p>
        </div>
      </div>
    </div>
  );
}

/* the paragraph, lit word by word as it is read (scroll-linked; reduced motion shows it lit) */
function Statement({ text }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.82', 'end 0.42'] });
  const words = text.split(/\s+/).filter(Boolean);
  useMotionValueEvent(scrollYProgress, 'change', (v) => { ref.current && ref.current.style.setProperty('--p', (v * (words.length + 6)).toFixed(2)); });
  return (
    <p ref={ref} className="xpd-say-p" style={{ '--p': 0 }}>
      {words.map((w, k) => <span key={k} style={{ '--k': k }}>{w}{k < words.length - 1 ? ' ' : ''}</span>)}
    </p>
  );
}

/* the API as a spec sheet: the heading and the count stay pinned, each row lights as it crosses the middle */
function Spec({ api }) {
  const list = useRef(null);
  useEffect(() => {
    const rows = [...list.current.querySelectorAll('tbody tr')];
    const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? e.target.setAttribute('data-lit', '') : e.target.removeAttribute('data-lit'))), { rootMargin: '-42% 0px -42% 0px' });
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);
  return (
    <section className="xpd-spec v2f-sec" aria-labelledby="xpd-api">
      <div className="v2f-wrap v2f-grid">
        <div className="xpd-spec-l">
          <h2 id="xpd-api" className="v2f-kick acc">{api.title}</h2>
          <FamLines as="p" play="view" text={api.lede} className="v2f-head xpd-spec-h" />
          <p className="xpd-spec-n" aria-hidden="true"><b className="v2f-num">{api.ops.length}</b><span>operations</span></p>
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
        <FamLines as="h2" play="view" id="xpd-meas-h" text={m.title} className="v2f-display small xpd-meas-h" />
        <ul className="xpd-meas-g">
          {m.links.map((l) => {
            const [name, ...rest] = l.text.split(': ');
            const fig = hero(rest.join(': '));
            return (
              <li key={l.href}>
                <A to={l.href} className="xpd-meas-c">
                  {fig ? <b className="v2f-num xpd-meas-f" aria-hidden="true">{fig}</b> : <i className="xpd-meas-f none" aria-hidden="true" />}
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
  const order = Object.keys(peek);
  const acc = accentAt(Math.max(0, order.indexOf(p.slug)));
  const nums = [p.api.ops.length, p.os.length, ...(p.measured ? p.measured.links.flatMap((l) => (l.text.match(/\d[\d,]*(?:\.\d+)?/g) || []).map((x) => +x.replace(/,/g, ''))) : [])];
  const intro = (function flat(ns) { return ns.map((n) => (typeof n === 'string' ? n : flat(n.c || []))).join(''); })(p.intro).replace(/\s+/g, ' ').trim();
  return (
    <main className="v2f xpd" style={{ '--acc': acc }}>
      <section className="xpd-hero" aria-labelledby="xpd-h1">
        <Sigil seed={'/products/' + p.slug} data={nums} className="xpd-sigil" />
        <div className="v2f-wrap xpd-hero-in">
          <p className="v2f-kick xpd-kick"><span className="xpd-live" aria-hidden="true" />{p.kicker}</p>
          <div className="v2f-grid xpd-hero-g">
            <FamLines as="h1" id="xpd-h1" text={p.title} className="v2f-display xpd-h1" data-morph-target />
            <div className="xpd-hero-r">
              <p className="v2f-lede xpd-lede">{p.lede}</p>
              <div className="xpd-acts">
                <A to={p.acts[0].href} className="v2f-btn acc" data-thumb="">{p.acts[0].text}</A>
                <A to={p.acts[1].href} className="v2f-btn">{p.acts[1].text}</A>
              </div>
            </div>
          </div>
        </div>
        <FamStage className="v2f-wrap xpd-stage" from={1.1}><Console p={p} /></FamStage>
      </section>

      <section className="xpd-say v2f-sec" aria-label={p.title}>
        <div className="v2f-wrap"><Statement text={intro} /></div>
      </section>

      <Spec api={p.api} />

      {p.measured && <Measured m={p.measured} />}

      <section className="xpd-os v2f-sec" aria-labelledby="xpd-os-h">
        <div className="v2f-wrap">
          <div className="xpd-os-top">
            <h2 id="xpd-os-h" className="v2f-kick">{p.osTitle}</h2>
          </div>
          <nav aria-label={p.osTitle}>
            <ol className="xpd-os-l">
              {p.os.map((o, i) => {
                const k = slugOf(o.href), q = peek[k];
                return (
                  <li key={o.href} style={{ '--c': accentAt(Math.max(0, order.indexOf(k))) }}>
                    <A to={o.href} className="xpd-os-c" aria-current={o.current ? 'page' : undefined} data-cursor={o.current ? '' : undefined}>
                      <span className="xpd-os-i x-mono" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                      <b className="xpd-os-n" data-morph={o.current ? undefined : ''}>{o.name}</b>
                      <span className="xpd-os-d">{o.desc}</span>
                      {q && <span className="xpd-os-k"><b className="v2f-num">{q.ops}</b><span className="x-mono">operations</span></span>}
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
            <A to={p.acts[0].href} className="v2f-btn solid">{p.acts[0].text}</A>
          </div>
        </div>
      </section>
    </main>
  );
}
