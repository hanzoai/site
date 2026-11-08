'use client';
/* A product of Hanzo OS (/products/<name>, seven of them, one template), as an apple.com launch page: the product
   itself is the big thing. The name (it arrives large and settles to its 52px rest) and its one line and ask sit over
   a light api.hanzo.ai console, centred low and nearly the width of the page, whole on the first screen. The console
   is the one place the API is listed: Hanzo's own request types itself on the left, and Hanzo's API table answers on the
   right, every operation once, with what it does. The console is ONE panel with states: its step bar holds Hanzo's
   "Try it" and one step per sentence of Hanzo's paragraph, and each step morphs the same panel in place. Measured
   figures (memory), the seven layers of Hanzo OS, the docs, and a dark closing band with the one ask end the page. Ink,
   greys and white; each product is told apart by its own contour (Sigil seeded with its slug), request and operations.
   Persona: Developer (and the founder wiring a company of agents)
   Goal: make the first call to this layer of the API
   CTA: the hero's ask, Hanzo's words ("Try Hanzo"), again in the closing band
   Metric: signup_start (then api_key_created)
   Signature (morph-panel, MOTION-MAP 7 Nov): one console, many states. Step "Try it": the request types itself out of
   Hanzo's own block and the API table lands row by row. Step 01, 02...: the same left pane turns from the request into
   that sentence (the code lifts away as the words rise into its place, the pane label turns from "Try it" to "01 / 03"),
   and the light in the API table slides from row to row onto the operations the sentence names (one fill per
   operation, moving by transform, never cutting). After the request lands the console steps through the sentences once
   by itself and comes back to rest on "Try it" with the sound kit's faint 'done'; Pause holds it, a step takes over,
   Replay runs it again. Nothing pins and nothing scrubs: the console is a plain section and keeps its size in every state.
   Beyond: the paragraph points at the product. Each of Hanzo's sentences, stepped in the console, lights the
   operations it names in the table, so the words and the API read as one thing.
   Motion (not only scroll): time (the request types itself, rows land, the one-pass walk through the sentences),
   state (the steps morph the console; replay; pause), pointer (magnetic ask; a row fills under the pointer), arrival
   (the name cut in, large, settling), scroll (the first measured figure grows at its moment; entrances: deal (measured
   cards rise one by one out of a clip), rule (the OS layers and the links: each hairline draws left to right, then its row
   arrives), iris (the closing band opens from a rounded inset to the full room)).
   Scale (MASTER 3.1, review 15:05): the product is the big thing of the first screen; h1 52 at rest (arrives up to
   84); section heads 44; sentences 26 in the console; table 14–16; figures 64, the first measured one growing at its moment.
   Ledger: deleted the pinned Stage (console pinned over a scroll-scrubbed sentence strip; the phone swipe rail), the
   line-mask cut-in on every section heading, the dark console card, the pinned word+card chapters, the separate spec
   sheet, the repeated operation lists, the thin count, the empty no-figure card, the link-list ending and the colour.
   V2: 8/10 Apple launch layout of its own: name over a light, wide console that holds the API once and morphs through
   the paragraph's sentences; measured figures; Hanzo OS; dark closing band. */
// Signature: one console, many states: Hanzo's "Try it" and each sentence are steps of the same panel; the request types itself, then each step turns the pane into that sentence and slides the light onto the operations it names
// Beyond: the paragraph points at the product: each sentence lights the operations it names in Hanzo's API table
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useInView, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Copy, Magnetic, useCalm } from '../ui';
import { A, More } from '../kit';
import Sigil from '../Sigil';
import FamLines from '../v2/FamLines';
import FamGrow from '../v2/FamGrow';
import NoJs from '../NoJs';
import { ui } from '../v2/famUi';
import { useEnter } from './api/enter';
import { play } from '../../lib/sound';
import '../v2/fam.css';
import './ProductPage.css';

const CPS = 110; // characters a second
const READ = 3400; // how long the walk holds each sentence, ms
const slugOf = (h) => h.replace(/\/$/, '').split('/').pop();
const nn = (k) => String(k).padStart(2, '0');
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

/* the light in the API table: one fill per operation a sentence names, sliding between rows by transform only, so the
   table never reflows (it is drawn under the rows; a row's own hover fill still answers the pointer) */
function Light({ group, lit }) {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    const g = group.current;
    if (!g) return;
    const read = () => setRows([...g.querySelectorAll('[data-row]')].map((r) => [r.offsetTop, r.offsetHeight]));
    read();
    const ro = new ResizeObserver(read);
    ro.observe(g);
    return () => ro.disconnect();
  }, [group]);
  const last = useRef([0, 0]); // a light with nothing to show stays where it was and fades, so the next one slides from there
  return [0, 1].map((k) => {
    const i = lit[k] ?? -1;
    if (i >= 0 && rows[i]) last.current[k] = i;
    const r = rows[last.current[k]] || [0, 0];
    return <span key={k} className="xpd-light" aria-hidden="true" data-on={i >= 0 && rows[i] ? '' : undefined} style={{ transform: `translateY(${r[0]}px) scaleY(${r[1]})` }} />;
  });
}

/* ---------- the signature: the light console, ONE panel whose states are Hanzo's "Try it" and each sentence ---------- */
function Console({ p, sents }) {
  const root = useRef(null);
  const group = useRef(null);
  const seen = useInView(root, { amount: 0.3 });
  const calm = useCalm();
  const [run, setRun] = useState(0);
  const [done, setDone] = useState(false); // the request has typed and the table has landed
  const [step, setStep] = useState(0); // 0: Try it; k: Hanzo's k-th sentence
  const [held, setHeld] = useState(false); // a hand (a step, or Pause) holds the console where it is
  const [walking, setWalking] = useState(false);
  const full = p.tryIt.toks.map((t) => t[1]);
  const code = full.join('');
  const { heads, ops } = p.api;
  const n = sents.length;
  const lit = step > 0 ? opsFor(sents[step - 1], ops) : [];

  // from here the browser takes over: the request is cleared and the answer held back until it is typed
  useLayoutEffect(() => {
    if (calm || !root.current) return;
    root.current.dataset.armed = '';
    root.current.querySelectorAll('[data-t]').forEach((x) => { x.textContent = ''; });
  }, [calm]);

  // the request types itself; the answer lands while it types
  useEffect(() => {
    if (calm || !seen) return;
    const el = root.current;
    const toks = [...el.querySelectorAll('[data-t]')];
    const rows = [...el.querySelectorAll('[data-row]')];
    const pane = el.querySelector('.xpd-req-b');
    if (pane) { pane.scrollTop = 0; pane.scrollLeft = 0; }
    delete el.dataset.done;
    setDone(false);
    rows.forEach((r) => r.removeAttribute('data-in'));
    toks.forEach((x) => { x.textContent = ''; });
    const timers = [];
    let raf = 0;
    const t0 = performance.now() + 150;
    // the request types in 1.8 s at most (a long one types faster), and the answer lands while it types, so the API
    // table is never empty after the first second and a half
    const cps = Math.max(CPS, code.length / 1.8);
    rows.forEach((r, i) => timers.push(setTimeout(() => r.setAttribute('data-in', ''), 500 + i * 140)));
    const tick = (now) => {
      let m = Math.max(0, Math.floor(((now - t0) / 1000) * cps));
      let cur = -1;
      for (let i = 0; i < toks.length; i++) {
        const take = Math.max(0, Math.min(full[i].length, m));
        if (toks[i].textContent.length !== take) toks[i].textContent = full[i].slice(0, take);
        if (take > 0) cur = i;
        m -= take;
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
      // the pane comes back to the top of the request once it has typed, so its first line is what rests on screen
      if (pane) pane.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      rows.forEach((r) => r.setAttribute('data-in', ''));
      timers.push(setTimeout(() => { el.dataset.done = ''; setDone(true); }, 200));
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); };
  }, [seen, run, calm]); // eslint-disable-line react-hooks/exhaustive-deps

  // the walk: once the answer has landed, the console steps through Hanzo's sentences once by itself, then rests on
  // "Try it" with the faint 'done'. Pause, or picking a step, holds it; Replay runs the whole console again.
  useEffect(() => {
    if (!done || held || calm) return;
    setWalking(true);
    const timers = sents.map((_, k) => setTimeout(() => setStep(k + 1), 1200 + k * READ));
    timers.push(setTimeout(() => { setStep(0); setWalking(false); play('done'); }, 1200 + n * READ));
    return () => { timers.forEach(clearTimeout); setWalking(false); };
  }, [done, held, calm, run]); // eslint-disable-line react-hooks/exhaustive-deps

  // on a phone the table scrolls inside its own box: a lit operation below the fold is brought into that box
  useEffect(() => {
    const box = root.current?.querySelector('.xpd-ops');
    const row = lit.length && group.current?.querySelectorAll('[data-row]')[lit[0]];
    if (!box || !row || box.scrollHeight <= box.clientHeight) return;
    const y = row.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - 40;
    if (y < box.scrollTop || y + row.offsetHeight > box.scrollTop + box.clientHeight) box.scrollTo({ top: Math.max(0, y), behavior: calm ? 'auto' : 'smooth' });
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (k) => { setHeld(true); setStep(k); };
  const keys = (e) => {
    const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    const k = (step + d + n + 1) % (n + 1);
    pick(k);
    root.current?.querySelector('#xpd-step-' + p.slug + '-' + k)?.focus();
  };
  const replay = () => { setHeld(false); setStep(0); setRun((r) => r + 1); };
  const labels = [p.tryIt.title, ...sents.map((_, k) => nn(k + 1))];
  return (
    <div className="xpd-con" ref={root} data-done={calm ? '' : undefined} data-step={step}>
      <div className="xpd-con-bar">
        <span className="x-mono xpd-host">api.hanzo.ai</span>
        <div className="xpd-steps" role="tablist" aria-label={p.api.title} onKeyDown={keys}>
          {labels.map((l, k) => (
            <button key={k} type="button" role="tab" id={'xpd-step-' + p.slug + '-' + k} aria-selected={step === k} aria-controls={'xpd-body-' + p.slug} tabIndex={step === k ? 0 : -1}
              aria-label={k ? `${ui('chapter')} ${k} ${ui('of')} ${n}` : undefined} className="xpd-step x-mono" onClick={() => pick(k)}>
              {step === k && <motion.span layoutId={'xpd-step-bg-' + p.slug} className="xpd-step-bg" transition={{ duration: calm ? 0 : 0.4, ease: [0.4, 0, 0.2, 1] }} />}
              <span>{l}</span>
            </button>
          ))}
        </div>
        <span className="xpd-con-sp" />
        <Copy text={code} />
        {walking
          ? <button type="button" className="xpd-replay" onClick={() => setHeld(true)} aria-label={ui('pause')}><svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M5.5 3.5v9M10.5 3.5v9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></button>
          : <button type="button" className="xpd-replay" onClick={replay} aria-label={ui('replay')}><svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>}
      </div>
      <div className="xpd-con-g" id={'xpd-body-' + p.slug} role="tabpanel" aria-labelledby={'xpd-step-' + p.slug + '-' + step}>
        <div className="xpd-req">
          {/* the pane's label: "Try it", or the sentence's number */}
          <div className="xpd-stack xpd-pane-l">
            <h2 className="xpd-pane-h x-mono" data-on={step === 0 ? '' : undefined}>{p.tryIt.title}</h2>
            <span className="xpd-pane-h x-mono" aria-hidden="true" data-on={step > 0 ? '' : undefined}>{nn(Math.max(1, step))} / {nn(n)}</span>
          </div>
          {/* the pane's body: the request, or one of Hanzo's sentences, in the same place (the paragraph is read whole below) */}
          <div className="xpd-stack xpd-req-s">
            <div className="xpd-req-b" tabIndex={step === 0 ? 0 : -1} data-lenis-prevent data-swipe-own data-on={step === 0 ? '' : undefined} aria-hidden={step !== 0 || undefined}>
              {/* the request whole for readers (and the copy check); the coloured tokens below type themselves */}
              <p className="x-sr">{code}</p>
              <pre aria-hidden="true"><code>{p.tryIt.toks.map(([k, t], i) => <span key={i} data-t data-k={k}>{t}</span>)}</code></pre>
            </div>
            {sents.map((t, k) => <p key={k} className="xpd-sent" aria-hidden="true" data-on={step === k + 1 ? '' : undefined}>{t}</p>)}
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
            <div role="rowgroup" className="xpd-rows" ref={group}>
              <Light group={group} lit={lit} />
              {ops.map((r, i) => (
                <div key={i} className="xpd-op" role="row" data-row data-lit={lit.includes(i) ? '' : undefined}>
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
        <h2 id="xpd-meas-h" className="xpd-sec-h">{m.title}</h2>
        <ul className="xpd-meas-g" data-enter="deal">
          {figs.map((l, k) => (
            <li key={l.href}>
              <A to={l.href} className="xpd-meas-c">
                {k === 0 ? <FamGrow to={1.6}><b className="v2f-num v2f-fig" aria-hidden="true">{l.fig}</b></FamGrow> : <b className="v2f-num v2f-fig" aria-hidden="true">{l.fig}</b>}
                <span className="x-sr">{l.text}</span><span className="xpd-meas-t" aria-hidden="true"><b>{l.name}</b>{l.rest ? ': ' + l.rest : ''}</span>
              </A>
            </li>
          ))}
        </ul>
        {!!plain.length && (
          <ul className="xpd-meas-rows" data-enter="rule">
            {plain.map((l) => <li key={l.href}><A to={l.href} className="xpd-meas-r"><span className="x-sr">{l.text}</span><span aria-hidden="true"><b>{l.name}</b>{l.rest ? ': ' + l.rest : ''}</span></A></li>)}
          </ul>
        )}
      </div>
    </section>
  );
}

export default function ProductPage({ p, peek = {} }) {
  const router = useRouter();
  useEnter('.xpd');
  const nums = [p.api.ops.length, p.os.length, ...(p.measured ? p.measured.links.flatMap((l) => (l.text.match(/\d[\d,]*(?:\.\d+)?/g) || []).map((x) => +x.replace(/,/g, ''))) : [])];
  const intro = (function flat(ns) { return ns.map((x) => (typeof x === 'string' ? x : flat(x.c || []))).join(''); })(p.intro).replace(/\s+/g, ' ').trim();
  const sents = split(intro);
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

      {/* the console: one panel, its states stepped from its own bar (not pinned, not scrubbed) */}
      <section className="xpd-stage" aria-label={p.api.title}>
        <div className="v2f-wrap"><Console p={p} sents={sents} /></div>
        {/* the paragraph, read whole once (screen readers, search, JS off); the console's sentence pane is its picture */}
        <p className="x-sr">{intro}</p>
      </section>
      <NoJs css=".xpd-stack>*{opacity:1!important;visibility:visible!important;transform:none!important;position:static!important}.xpd-stack{display:block!important}.xpd-pane-l>span{display:none}.xpd-sent{margin-top:20px}.xpd-steps{display:none}.xpd-con-g{height:auto!important}" />

      {p.measured && <Measured m={p.measured} />}

      <section className="xpd-os v2f-sec" aria-labelledby="xpd-os-h">
        <div className="v2f-wrap">
          <h2 id="xpd-os-h" className="xpd-sec-h">{p.osTitle}</h2>
          <nav aria-label={p.osTitle}>
            <ol className="xpd-os-l" data-enter="rule">
              {p.os.map((o, i) => {
                const k = slugOf(o.href), q = peek[k];
                return (
                  <li key={o.href}>
                    <A to={o.href} className="xpd-os-c" aria-current={o.current ? 'page' : undefined}>
                      <span className="xpd-os-i x-mono" aria-hidden="true">{nn(i + 1)}</span>
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
        <section className="xpd-end v2f-sec tight" data-enter="rule">
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
      <section className="x-band xpd-band" data-room="dark" data-enter="iris" aria-labelledby="xpd-band-h">
        <div className="v2f-wrap xpd-band-g">
          <h2 id="xpd-band-h" className="xpd-band-h">{p.title}</h2>
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
