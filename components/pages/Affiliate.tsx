'use client';
/* Affiliates. Its idea is the link that remembers who sent it.
   Persona: a partner who refers organizations to Hanzo. Goal: apply. CTA: "Apply" (mailto hello@hanzo.ai, Hanzo's own
   subject line). Metric: contact_click (no dedicated id in MASTER section 1 for affiliate applications).
   V2: 8/10 grey deck, MOTION-MAP signature `one-question`: "How it works" is one step per screen, sliding to the next
   (arrows, swipe, arrow keys, the counter), with the answer so far summarised beside it as it builds (the request, the
   reply, the link, attributed to you); it never submits anything, the ask stays the Apply mailto. The pinned chapter
   scene is gone. Five entrances (components/pages/affiliate/enter.*), in page order: depth-parallax (hero),
   focus-pull-scroll (the link band), iris (the one-question flow), noise-dissolve (the dark rule room), glitch-in (the
   close). Kept: the link writing itself with its idle caret and code re-mark, its lean to the pointer, Apply showing
   where it goes, the rule tabs and their self-drawing diagrams, one solid from the first paint.
   Signature: one question at a time: Hanzo's four step sentences, one per screen, each with its object, sliding to the
   next while a summary of the answers so far builds beside them.
   Beyond: the rule, drawn: first touch, one affiliate per org, never your own, each as a small diagram that plays
   itself, with no words but Hanzo's.
   Motion: the one-question slide (state, pointer/touch/keys) + the link writing itself (time, idle) + the link leaning
   to the pointer (pointer) + the rule diagrams (idle) + five page-local entrances. Copy is Hanzo's only; 0 UI hues. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Copy, Mark, useTilt } from '../ui';
import { A, Cta, Tabs, TabPanel } from '../kit';
import { NoJs } from '../v2/LineReveal';
import { useEntrances } from './affiliate/enter';
import '../v2/ProgramScale.css';
import './Affiliate.css';
import './affiliate/enter.css';

const MAIL = 'mailto:hello@hanzo.ai?subject=Affiliate%20application';
const LINK = 'https://hanzo.ai/?aff=<code>';
const RULES = ['first touch', 'one affiliate per org', 'never your own'];
const pad = (n) => String(n).padStart(2, '0');

/* The hero object, in its own section: the affiliate link itself. It writes itself once from the first paint, then
   rests with its code marked; it leans toward the pointer. */
function Link() {
  const box = useRef(null);
  const seen = useInView(box, { once: true, amount: 0.4 });
  const tilt = useTilt(2.5, 'rgba(255,255,255,0)');
  return (
    <section className="xaf-link" aria-label={LINK} data-enter="focus-pull">
      <noscript><style>{'.xaf-lnk-t,.xaf-lnk-code{animation:none!important}.xaf-caret{display:none}.xaf-ln{opacity:1!important;stroke-dasharray:none!important;stroke-dashoffset:0!important}.xaf-ln.dash{stroke-dasharray:.005 .025!important}'}</style></noscript>
      <div className="xp-wrap xaf-band" ref={box}>
        <motion.div className={'xaf-link-in' + (seen ? ' on' : '')} style={{ rotateX: tilt.rx, rotateY: tilt.ry, transformPerspective: 1600 }} {...tilt.on} aria-hidden="true">
          <span className="xaf-lnk"><span className="xaf-lnk-t">{LINK.slice(0, 22)}</span><b className="xaf-caret" /></span>
          <span className="xaf-lnk-code">&lt;code&gt;</span>
        </motion.div>
        <p className="xaf-link-k"><span>Affiliates</span></p>
      </div>
    </section>
  );
}

/* One solid at a time, from the first paint: Affiliate.css draws the header's ask outlined on this route unless
   <html> carries data-xaf-solid. After mount this hook sets that flag only while none of the page's own solid Apply
   buttons is on screen, so the header's ask is solid exactly when the page's is not (at every width). */
function useQuietHeader() {
  useEffect(() => {
    const H = document.documentElement;
    const asks = [...document.querySelectorAll('.xaf [data-cta^="affiliate."]')];
    if (!asks.length || typeof IntersectionObserver === 'undefined') return;
    const vis = new Set();
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting ? vis.add(e.target) : vis.delete(e.target)));
      if (vis.size) delete H.dataset.xafSolid; else H.dataset.xafSolid = '';
    });
    asks.forEach((a) => io.observe(a));
    return () => { io.disconnect(); delete H.dataset.xafSolid; };
  }, []);
}

function Hero() {
  useQuietHeader();
  return (
    <section className="xaf-hero" aria-labelledby="xaf-h1" data-enter="depth">
      <div className="xp-wrap">
        <div className="xp-grid xaf-top">
          <div className="xaf-copy xaf-d1">
            <h1 id="xaf-h1" className="xp-display"><span className="xaf-h1-l">Refer customers</span> <span className="xaf-h1-l">to Hanzo</span></h1>
          </div>
          <div className="xaf-side">
            <p className="xp-lede xaf-d2">Apply to become an affiliate. Every application is reviewed, and the terms are agreed with each affiliate we approve.</p>
            <span className="xaf-apply xaf-d3">
              <Cta to={MAIL} id="affiliate.hero" thumb className="xp-cta" aria-describedby="xaf-to">Apply</Cta>
              <span className="xaf-to x-mono" id="xaf-to">hello@hanzo.ai</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Each step's object: the request, the reply, the code, the org landing on the link. */
function Stage({ at }) {
  const views = [
    <div className="xaf-s xaf-req" key="0">
      <div className="xaf-req-top"><span className="xaf-verb">POST</span><span>/v1/affiliate/apply</span></div>
      <div className="xaf-req-or">or</div>
      <div className="xaf-mail"><span className="xaf-mail-i">@</span><b>hello@hanzo.ai</b></div>
    </div>,
    <div className="xaf-s xaf-reply" key="1">
      <div className="xaf-row"><span className="xaf-av">@</span><span className="xaf-mt"><b>Affiliate application</b><small>hello@hanzo.ai</small></span><span className="xaf-out" aria-hidden="true">↗</span></div>
      <div className="xaf-row in"><span className="xaf-av h"><Mark size={16} /></span><span className="xaf-mt"><b>Affiliate application</b><small>hello@hanzo.ai</small></span><span className="xaf-out" aria-hidden="true">↩</span></div>
    </div>,
    <div className="xaf-s xaf-code" key="2">
      <span className="xaf-code-v">&lt;code&gt;</span>
      <span className="xaf-code-l">https://hanzo.ai/?aff=<em>&lt;code&gt;</em></span>
    </div>,
    <div className="xaf-s xaf-land" key="3">
      <span className="xaf-org"><span className="xaf-org-i">org</span>signs up through the link</span>
      <span className="xaf-you">attributed to you</span>
    </div>,
  ];
  return <div className="xaf-stage xp-obj">{views[at]}<span className="xaf-step xp-count">{pad(at + 1)} / 04</span></div>;
}

const STEPS = [
  { title: <>Apply with <span className="xaf-keep"><code className="xaf-code-in">POST /v1/affiliate/apply</code><Copy text="POST /v1/affiliate/apply" />,</span> or write to <a href={MAIL}>hello@hanzo.ai</a>.</>,
    sum: <code className="xaf-sum-code">POST /v1/affiliate/apply</code> },
  { title: 'We review the application and reply.',
    sum: <span className="xaf-sum-reply"><span className="xaf-sum-av"><Mark size={12} /></span>Affiliate application <span aria-hidden="true">↩</span></span> },
  { title: <>Once approved you have a code and a link, <code className="xaf-code-in">{LINK}</code>.</>,
    sum: <code className="xaf-sum-code">https://hanzo.ai/?aff=<b>&lt;code&gt;</b></code> },
  { title: 'An org that signs up through the link is attributed to you: first touch, one affiliate per org, never your own.',
    sum: <span className="xaf-sum-you">attributed to you</span> },
];

/* The signature, one question at a time: one step per screen, sliding to the next; the answers so far build up in the
   summary beside it. Arrows, the arrow keys, a swipe or a summary row move it. It never submits anything. Server HTML
   (and JS off) shows all four steps and the whole summary; the slider takes over once mounted. */
function Flow() {
  const [at, setAt] = useState(0);
  const [max, setMax] = useState(0);
  const [ready, setReady] = useState(false);
  const x0 = useRef(null);
  const n = STEPS.length;
  useEffect(() => { setReady(true); }, []);
  const go = (i) => { const j = Math.max(0, Math.min(n - 1, i)); setAt(j); setMax((m) => Math.max(m, j)); };
  const keys = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(at + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(at - 1); }
  };
  const down = (e) => { x0.current = e.clientX; };
  const up = (e) => {
    if (x0.current == null) return;
    const dx = e.clientX - x0.current; x0.current = null;
    if (Math.abs(dx) > 48) go(at + (dx < 0 ? 1 : -1));
  };
  return (
    <section className="xp-sec xaf-q-sec" aria-labelledby="xaf-how-h" data-enter="iris">
      <div className="xp-wrap">
        <h2 id="xaf-how-h" className="xp-head xaf-how-h">How it works</h2>
        <div className={'xaf-q' + (ready ? ' ready' : '')}>
          <div className="xaf-q-main" role="group" aria-roledescription="carousel" aria-label="How it works" onKeyDown={keys}>
            <div className="xaf-q-view" onPointerDown={down} onPointerUp={up} onPointerCancel={() => { x0.current = null; }}>
              <ol className="xaf-q-track" style={{ '--at': at }}>
                {STEPS.map((s, i) => (
                  <li key={i} className={'xaf-q-step' + (i === at ? ' on' : '')} aria-roledescription="slide" aria-label={`${pad(i + 1)} / 04`} aria-hidden={ready && i !== at ? true : undefined} inert={ready && i !== at ? true : undefined}>
                    <div className="xaf-q-obj"><Stage at={i} /></div>
                    <h3 className="xaf-q-t">{s.title}</h3>
                  </li>
                ))}
              </ol>
            </div>
            <div className="xaf-q-ctl">
              <button type="button" className="xaf-q-btn" onClick={() => go(at - 1)} disabled={ready && at === 0} aria-label={`${pad(Math.max(1, at))} / 04`}><span aria-hidden="true">←</span></button>
              <span className="xaf-q-n xp-count" aria-live="polite">{pad(at + 1)} / 04</span>
              <button type="button" className="xaf-q-btn next" onClick={() => go(at + 1)} disabled={ready && at === n - 1} aria-label={`${pad(Math.min(n, at + 2))} / 04`}><span aria-hidden="true">→</span></button>
            </div>
          </div>
          <ol className="xaf-q-sum" aria-label="How it works">
            {STEPS.map((s, i) => {
              const filled = !ready || i <= max;
              return (
                <li key={i} className={'xaf-q-row' + (filled ? ' filled' : '') + (ready && i === at ? ' here' : '')}>
                  <button type="button" onClick={() => go(i)} disabled={!filled} aria-current={ready && i === at ? 'step' : undefined}>
                    <span className="xaf-q-i xp-count">{pad(i + 1)}</span>
                    <span className="xaf-q-a">{s.sum}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* The rule, drawn: each of Hanzo's three rules as a diagram with no words but the link. They play themselves. */
function Diagram({ k, play }) {
  const T = { duration: 1.1, ease: [0.76, 0, 0.24, 1] };
  const run = (d) => (play ? { pathLength: 1, opacity: 1, transition: { ...T, delay: d } } : { pathLength: 1, opacity: 1, transition: { duration: 0 } });
  const from = { pathLength: 0, opacity: 0 };
  return (
    <svg className="xaf-dia" viewBox="0 0 520 300" aria-hidden="true">
      {k === 0 && <>
        <motion.path d="M70 70 C 210 70, 250 150, 380 150" className="xaf-ln" initial={from} animate={run(0.2)} />
        <motion.path d="M70 230 C 210 230, 250 150, 330 150" className="xaf-ln dash" initial={from} animate={run(0.9)} />
        <circle cx="70" cy="70" r="22" className="xaf-node on" /><circle cx="70" cy="230" r="22" className="xaf-node" />
        <text x="70" y="75" className="xaf-t">1</text><text x="70" y="235" className="xaf-t dim">2</text>
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: play ? 1.9 : 0 } }}><path d="M318 138l24 24M342 138l-24 24" className="xaf-x" /></motion.g>
      </>}
      {k === 1 && <>
        <motion.path d="M70 150 L 380 150" className="xaf-ln" initial={from} animate={run(0.2)} />
        <motion.path d="M70 60 C 200 60, 250 120, 340 140" className="xaf-ln dash" initial={from} animate={run(0.7)} />
        <motion.path d="M70 240 C 200 240, 250 180, 340 160" className="xaf-ln dash" initial={from} animate={run(0.9)} />
        <circle cx="70" cy="150" r="22" className="xaf-node on" /><circle cx="70" cy="60" r="16" className="xaf-node" /><circle cx="70" cy="240" r="16" className="xaf-node" />
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: play ? 1.8 : 0 } }}><path d="M300 118l20 20M320 118l-20 20M300 162l20 20M320 162l-20 20" className="xaf-x" /></motion.g>
      </>}
      {k === 2 && <>
        <motion.path d="M90 150 C 200 40, 330 40, 400 120" className="xaf-ln dash" initial={from} animate={run(0.2)} />
        <circle cx="90" cy="150" r="22" className="xaf-node on" />
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: play ? 1.3 : 0 } }}><path d="M388 108l24 24M412 108l-24 24" className="xaf-x" /></motion.g>
        <path d="M90 172 L 90 230 L 430 230 L 430 172" className="xaf-own" />
      </>}
      <g className="xaf-orgnode"><rect x="380" y="122" width="112" height="56" rx="28" /><text x="436" y="156" className="xaf-t inv">org</text></g>
    </svg>
  );
}

function Rule() {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % RULES.length), 4200);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen]);
  return (
    <section className="xp-sec xp-dark xaf-rule" data-room="dark" ref={box} aria-labelledby="xaf-rule-h" data-enter="noise">
      <div className="xp-wrap">
        <h2 id="xaf-rule-h" className="x-sr">first touch, one affiliate per org, never your own</h2>
        <div className="xaf-rule-tabs">
          <Tabs id="xaf-rule" label="first touch, one affiliate per org, never your own" tabs={RULES} value={at} onChange={(i) => { setMine(true); setAt(i); }} />
        </div>
        {RULES.map((r, i) => (
          <TabPanel key={r} id="xaf-rule" i={i} value={at} className="xaf-rule-p">
            <div className="xaf-dia-wrap">{at === i && <Diagram k={i} play={!calm} />}</div>
          </TabPanel>
        ))}
      </div>
    </section>
  );
}

function Close() {
  return (
    <section className="xp-sec xaf-close" aria-labelledby="xaf-close-h" data-enter="glitch">
      <div className="xp-wrap xp-grid">
        <div className="xaf-close-l">
          <p id="xaf-close-h" className="xp-head xaf-close-h"><span className="xaf-h1-l">Apply to become</span> <span className="xaf-h1-l">an affiliate.</span></p>
        </div>
        <div className="xaf-close-act">
          <Cta to={MAIL} id="affiliate.close" className="xp-cta">Apply</Cta>
          <p className="xp-body">A <A to="/referral" className="x-link">referral</A> on its own pays nothing.</p>
        </div>
      </div>
    </section>
  );
}

export default function Affiliate() {
  const root = useRef(null);
  useEntrances(root);
  return (
    <main className="xp xaf" data-ask-name="Affiliates" ref={root}>
      <NoJs />
      <Hero />
      <Link />
      <Flow />
      <Rule />
      <Close />
    </main>
  );
}
