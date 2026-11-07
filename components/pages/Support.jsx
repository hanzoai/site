'use client';
/* /support. V2: 8/10 One question at a time on Hanzo's deck: the h1 and its lede, then the help-finder (left: one
   question per screen, sliding; right: the answer card, the summary that builds), a closing Band with its email ask.
   Persona: a customer or developer who needs help now. Goal: reach the right door in one step.
   CTA: "Open Help Center" (https://hanzo.help), data-cta support.answer.1; metric: the one contact click.
   Signature: one-question. Screen 1 asks the h1's question with the search pill (free text, still answering as you
   type: each finished word, a space or 300ms, re-ranks the six ways and the best rises into the answer card, its
   words marked). Enter or the arrow slides to screen 2: the six ways as the choices, ranked by your words, best
   marked; arrow keys move, Enter or a tap picks one. The answer card on the right is the summary as it builds: your
   words, the way, its one action. Back slides to screen 1. The demo still types "support ticket", then "uptime".
   Entrances: 1 card-deal on the h1 (its words dealt from a deck at the line's end), 2 cursor-lens on the lede (a
   lens opens from the pointer and the words settle from magnified), 3 fold-out on the question screens (unfold from a
   top hinge), 4 tile-flip on the answer card (a grid of tiles flips in to form it), 5 tilt-3d-hover on the closing
   Band (arrives tilted back and levels, then leans toward a fine pointer, at most 2.5deg).
   Beyond: whatever you typed becomes the subject line of a ready-to-send email to support@hanzo.ai; when a finished
   word matches nothing on the page, the answer itself turns into that email, your words shown as its subject. */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { A, Go, Band } from '../kit';
import useArrived from './company/useArrived';
import '../v2/vc-type.css';
import './company/deck.css';
import './Support.css';

const EM = [0.16, 1, 0.3, 1]; // deck ease-emphasis
const IO = [0.4, 0, 0.2, 1]; // deck ease-in-out
const DOORS = [
  { t: 'Help Center', d: 'Search answers, browse guides, and open a support ticket. The fastest path to a resolution.', go: 'Open Help Center', to: 'https://hanzo.help' },
  { t: 'Documentation', d: 'Guides, API references, and quickstarts for every product across the Hanzo Cloud.', go: 'Read the docs', to: 'https://docs.hanzo.ai' },
  { t: 'System Status', d: 'Live uptime and incident history for every Hanzo service. Check here first if something feels off.', go: 'View status', to: 'https://status.hanzo.ai' },
  { t: 'Community', d: 'Ask questions and share what you build with other developers on the Hanzo Discord and Community.', go: 'Join the community', to: 'https://discord.gg/XthHQQj' },
  { t: 'GitHub', d: 'Report a bug, request a feature, or contribute — our SDKs and tooling are open source.', go: 'Open an issue', to: 'https://github.com/hanzoai' },
  { t: 'Email us', d: 'Prefer email? Reach the team directly and we’ll get back to you.', go: 'support@hanzo.ai', to: 'mailto:support@hanzo.ai' },
];
const H1 = 'How can we help?';
const DEMO = 'support ticket'; // Hanzo's own words, from the Help Center's line: the ask stays Open Help Center
const DEMO2 = 'uptime'; // from System Status's own line: System Status rises into the answer
// JS off: every answer readable in order, the first question only, nothing waiting on an entrance
const NOJS = { __html: '<style>.xsp-panes{display:flex!important;flex-direction:column;gap:40px}.xsp-pane{opacity:1!important;transform:none!important;visibility:visible!important;pointer-events:auto!important}.xsp-pause,.xsp-next,.xsp-q2,.xsp-tiles{display:none!important}.xsp-rail{transform:none!important}</style>' };

const words = (s) => s.toLowerCase().match(/[a-z0-9]+/g) || [];
const terms = (q) => words(q).filter((w) => w.length > 2); // one letter or two is not a search yet
// a query word matches a page word that starts with it, or (4+ letters) one it starts with: "tickets" finds "ticket"
const hits = (w, h) => h.startsWith(w) || (w.length >= 4 && h.length >= 4 && w.startsWith(h));
function rank(q) {
  const qs = terms(q);
  return DOORS.map((d, i) => {
    const hay = words(d.t + ' ' + d.d + ' ' + d.go);
    const score = qs.reduce((n, w) => n + (hay.some((h) => hits(w, h)) ? 1 : 0), 0);
    return { i, score };
  }).sort((a, b) => b.score - a.score || a.i - b.i);
}

/* A description with the words the query matched marked (the mark is drawn, so no word moves). */
function Lit({ text, q }) {
  const qs = terms(q);
  if (!qs.length) return text;
  return text.split(/(\s+)/).map((p, k) => {
    const w = p.toLowerCase().replace(/[^a-z0-9]/g, '');
    return w && qs.some((x) => hits(x, w)) ? <mark key={k}>{p}</mark> : p;
  });
}

const Arrow = ({ back }) => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" style={back ? { transform: 'scaleX(-1)' } : undefined}><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Mail = () => <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><rect x="2.5" y="4.5" width="15" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="m3 5.5 7 5.5 7-5.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>;
const Lens = ({ size = 18 }) => <svg viewBox="0 0 20 20" width={size} height={size} aria-hidden="true"><circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="m13.5 13.5 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;

function mailTo(subject) { return 'mailto:support@hanzo.ai' + (subject ? '?subject=' + encodeURIComponent(subject) : ''); }

/* go: at once on a return visit; 550ms after the arrival curtain starts lifting on a first visit (the top is clear). */
function useGo() {
  const [curtain] = useState(() => typeof document !== 'undefined' && document.documentElement.classList.contains('x-arriving'));
  const ok = useArrived();
  const [go, setGo] = useState(false);
  useEffect(() => {
    if (!ok) return;
    const t = setTimeout(() => setGo(true), curtain ? 550 : 0);
    return () => clearTimeout(t);
  }, [ok, curtain]);
  return go;
}

/* Page-local entrance: marks the section data-in the first time a quarter of it is on screen (after `gate`); the CSS
   under html.js plays that section's own entrance from there. before(el) runs just before, to aim it. */
const ptr = { x: -1, y: -1 };
function useEnter(gate = true, before) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !gate || el.hasAttribute('data-in')) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      before?.(el);
      el.setAttribute('data-in', '');
      io.disconnect();
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, [gate]); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}

/* 2. cursor-lens: the lens opens where the pointer last was (clamped into the lede), else at its start */
function aimLens(el) {
  const r = el.getBoundingClientRect();
  const x = ptr.x < 0 ? 0 : Math.min(Math.max(ptr.x - r.left, 0), r.width);
  const y = ptr.y < 0 ? r.height / 2 : Math.min(Math.max(ptr.y - r.top, 0), r.height);
  el.style.setProperty('--lx', x + 'px');
  el.style.setProperty('--ly', y + 'px');
}

export default function Support() {
  const [q, setQ] = useState(''); // what is in the pill
  const [dq, setDq] = useState(''); // the settled query: finished words only
  const [mine, setMine] = useState(false);
  const [done, setDone] = useState(false); // the demo has played, or was stopped
  const [peek, setPeek] = useState(-1); // a way the pointer or focus is on
  const [pick, setPick] = useState(-1); // the way chosen on screen 2
  const [step, setStep] = useState(0); // 0: your words, 1: the six ways
  const [hyd, setHyd] = useState(false);
  const go = useGo();
  const input = useRef(null);
  const form = useRef(null);
  const btn = useRef(null);
  const ways = useRef([]);
  const seen = useInView(form, { amount: 0.6 });
  const calm = useReducedMotion();
  useEffect(() => setHyd(true), []);
  useEffect(() => {
    const m = (e) => { ptr.x = e.clientX; ptr.y = e.clientY; };
    addEventListener('pointermove', m, { passive: true });
    return () => removeEventListener('pointermove', m);
  }, []);

  // the five entrances, in page order
  const e1 = useEnter(go);
  const e2 = useEnter(go, aimLens);
  const e3 = useEnter(go);
  const e4 = useEnter(go);
  const e5 = useEnter(true);

  // 1. card-deal: each word starts on the deck at the line's end and is dealt to its place
  useLayoutEffect(() => {
    const h = e1.current;
    if (!h) return;
    const cards = [...h.querySelectorAll('.xsp-card')];
    const end = cards[cards.length - 1];
    if (!end) return;
    cards.forEach((c, k) => {
      c.style.setProperty('--dx', end.offsetLeft - c.offsetLeft + 'px');
      c.style.setProperty('--dy', end.offsetTop - c.offsetTop + 'px');
      c.style.setProperty('--r', (k % 2 ? 7 : -9) + 'deg');
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 5. tilt-3d-hover: after it has levelled, the Band leans toward a fine pointer (2.5deg at most)
  const tilt = (e) => {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    const el = e5.current;
    if (!el || calm) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', (px * 5).toFixed(2) + 'deg');
    el.style.setProperty('--rx', (-py * 5).toFixed(2) + 'deg');
  };
  const level = () => { const el = e5.current; if (el) { el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg'); } };

  // a word is finished at a space, or after 300ms without typing
  useEffect(() => {
    if (/\s$/.test(q) || !q) { setDq(q); return; }
    const t = setTimeout(() => setDq(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const ranked = useMemo(() => rank(dq), [dq]);
  const typed = terms(dq).length > 0;
  const hit = typed && ranked[0].score > 0;
  const subject = q.trim();
  // the summary: a way you point at; else the one you picked; else the best match; with words that match nothing, email
  const best = peek >= 0 ? peek : pick >= 0 ? pick : hit ? ranked[0].i : mine && typed ? 5 : 0;
  const order = mine || hit ? ranked : DOORS.map((_, i) => ranked.find((r) => r.i === i));

  // the demo, once, after the headline has landed: type Hanzo's phrase, hold, clear, rest
  useEffect(() => {
    if (mine || calm || !seen || done || !go) return;
    let alive = true, timer = 0;
    const el = input.current;
    const sleep = (ms) => new Promise((r) => { timer = setTimeout(r, ms); });
    (async () => {
      await sleep(1600);
      for (let c = 1; c <= DEMO.length && alive; c++) {
        el.value = DEMO.slice(0, c);
        if (DEMO[c] === ' ' || c === DEMO.length) { setQ(el.value); setDq(el.value); }
        await sleep(60 + (c % 4) * 18);
      }
      if (!alive) return;
      await sleep(2400);
      for (let c = DEMO.length; c >= 0 && alive; c--) { el.value = DEMO.slice(0, c); await sleep(14); }
      for (let c = 1; c <= DEMO2.length && alive; c++) {
        el.value = DEMO2.slice(0, c);
        if (c === DEMO2.length) { setQ(el.value); setDq(el.value); }
        await sleep(70 + (c % 3) * 20);
      }
      if (!alive) return;
      await sleep(2600);
      for (let c = DEMO2.length; c >= 0 && alive; c--) { el.value = DEMO2.slice(0, c); await sleep(16); }
      if (alive) { setQ(''); setDq(''); setDone(true); }
    })();
    return () => { alive = false; clearTimeout(timer); };
  }, [mine, calm, seen, done, go]);

  const stop = () => { if (done || mine) return; setDone(true); if (input.current) input.current.value = ''; setQ(''); setDq(''); };
  const take = () => { if (!mine) { stop(); setMine(true); setDone(true); } };
  const playing = !mine && !done && !calm;
  const live = (mine && typed) || pick >= 0 ? DOORS[best].t : '';

  // slide to the six ways; the best for your words takes focus (no scroll: the rail is clipped, not scrolled)
  const next = () => {
    take();
    setDq(q); setPeek(-1); setStep(1);
    requestAnimationFrame(() => ways.current[0]?.focus({ preventScroll: true }));
  };
  const back = () => { setStep(0); setPeek(-1); requestAnimationFrame(() => input.current?.focus({ preventScroll: true })); };
  const choose = (i) => { setPick(i); setPeek(-1); requestAnimationFrame(() => btn.current?.focus({ preventScroll: true })); };
  const keys = (e, k) => {
    const n = DOORS.length;
    const to = { ArrowRight: k + 1, ArrowLeft: k - 1, ArrowDown: k + 2, ArrowUp: k - 2, Home: 0, End: n - 1 }[e.key];
    if (to === undefined) { if (e.key === 'Escape') back(); return; }
    e.preventDefault();
    ways.current[Math.min(Math.max(to, 0), n - 1)]?.focus({ preventScroll: true });
  };

  return (
    <main className="vc xsp" style={{ '--acc': '#0a0a0a' }} data-ask-name="Support" data-go={go || undefined}>
      <section className="xsp-hero" aria-labelledby="xsp-h1">
        <div className="vc-grid xsp-hero-g" onFocusCapture={stop}>
          <h1 id="xsp-h1" ref={e1} className="vc-display xsp-h1 xsp-deal">
            {H1.split(' ').map((w, k, a) => <span key={k}><span className="xsp-card" style={{ '--i': k }}>{w}</span>{k < a.length - 1 ? ' ' : ''}</span>)}
          </h1>
          <p ref={e2} className="vc-lede xsp-lede xsp-lens">Answers, docs, live status, and a direct line to the team.</p>

          {/* the page's ask lives on the whole help-finder (both screens and the summary), never on a pane that swaps */}
          <div className="xsp-room" onPointerEnter={stop} onPointerLeave={() => setPeek(-1)} data-thumb="Open Help Center" data-href="https://hanzo.help">
            <div ref={e3} className="xsp-ask xsp-fold" data-step={step}>
              <div className="xsp-steps" aria-hidden="true"><i className="on" /><i className={step ? 'on' : ''} /></div>
              <div className="xsp-track">
                <div className="xsp-rail" style={{ '--step': step }}>
                  <div className="xsp-q xsp-q1" {...(hyd && step !== 0 ? { 'aria-hidden': true, inert: true } : {})}>
                    <form role="search" aria-label="Support" ref={form} className="xsp-search" onSubmit={(e) => { e.preventDefault(); next(); }}>
                      <label htmlFor="xsp-q" className="x-sr">{H1}</label>
                      <Lens size={24} />
                      <input id="xsp-q" ref={input} type="search" autoComplete="off" spellCheck="false" enterKeyHint="next" placeholder={DEMO}
                        onPointerDown={take} onFocus={take} onKeyDown={take}
                        onChange={(e) => { setMine(true); setDone(true); setPick(-1); setQ(e.target.value); }} />
                      {playing ? (
                        <button type="button" className="xsp-pause" aria-label="Pause" onClick={stop}>
                          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                        </button>
                      ) : (
                        <button type="submit" className="xsp-next" aria-label="Next"><Arrow /></button>
                      )}
                    </form>
                  </div>

                  <div className="xsp-q xsp-q2" {...(hyd && step !== 1 ? { 'aria-hidden': true, inert: true } : {})}>
                    <button type="button" className="xsp-back" aria-label="Back" onClick={back}><Arrow back /></button>
                    <ol className="xsp-ways" aria-label="Support">
                      {order.map(({ i, score }, k) => (
                        <motion.li key={DOORS[i].t} layout transition={{ duration: 0.3, ease: IO }}>
                          <button type="button" ref={(el) => { ways.current[k] = el; }} aria-pressed={pick === i}
                            className={'xsp-way' + (pick === i ? ' picked' : '') + (i === best ? ' best' : typed && score ? ' match' : '')}
                            onClick={() => choose(i)} onKeyDown={(e) => keys(e, k)}
                            onPointerEnter={() => setPeek(i)} onFocus={() => setPeek(i)} onBlur={() => setPeek(-1)}>
                            <span>{DOORS[i].t}</span><Arrow />
                          </button>
                        </motion.li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* the summary as it builds: your words, the way, its one action */}
            <div ref={e4} className="xsp-answer xsp-flip">
              <p className="x-sr" aria-live={mine || pick >= 0 ? 'polite' : 'off'}>{live}</p>
              <p className={'xsp-said' + (mine && typed ? ' on' : '')} aria-hidden={!(mine && typed)}>
                {best === 5 ? <Mail /> : <Lens />}<span>“{subject}”</span>
              </p>
              <div className="xsp-panes">
                {DOORS.map((d, i) => {
                  const on = i === best;
                  const mail = i === 5;
                  const href = mail ? mailTo(mine ? subject : '') : d.to;
                  return (
                    <motion.div key={d.t} className={'xsp-pane' + (on ? ' on' : '')} initial={false}
                      animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                      transition={{ duration: on ? 0.3 : 0.15, ease: EM, delay: on ? 0.05 : 0 }}
                      {...(hyd && !on ? { 'aria-hidden': true, inert: true } : {})}>
                      <h2 className="xsp-answer-t">{d.t}</h2>
                      <p className="xsp-answer-d"><Lit text={d.d} q={dq} /></p>
                      <div className="xsp-answer-a">
                        <span className="xsp-go" data-cta={'support.answer.' + (i + 1)} ref={on ? (el) => { btn.current = el?.querySelector('a'); } : undefined}>
                          <Go to={href} solid className="xsp-big">{mail && mine && typed ? 'Email support@hanzo.ai' : d.go}</Go>
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="xsp-tiles" aria-hidden="true">{Array.from({ length: 24 }, (_, k) => <i key={k} style={{ '--d': (k % 6) + Math.floor(k / 6) }} />)}</div>
            </div>
          </div>
          <noscript dangerouslySetInnerHTML={NOJS} />
        </div>
      </section>

      <div ref={e5} className="xsp-tilt" onPointerMove={tilt} onPointerLeave={level}>
        <Band title="On an enterprise plan or need a dedicated channel?" action="Email support@hanzo.ai" to="mailto:support@hanzo.ai"
          note={<>
            <span className="xsp-note">and we’ll route you to your team.</span>
            {/* the room's object: Hanzo's six doors as one quiet row, each its own destination */}
            <span className="xsp-band-doors">{DOORS.map((d) => <A key={d.t} to={d.to}>{d.t}</A>)}</span>
          </>} />
      </div>
    </main>
  );
}
