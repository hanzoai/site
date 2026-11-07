'use client';
/* Affiliates. Its idea is the link that remembers who sent it.
   V2: 8/10 chaptered: display hero over a huge self-writing address bar, the four steps as sticky chapters whose one object changes (request, reply, code, landed org), the attribution check as the dark room, one closing Apply.
   Signature: sticky chapters: the words of each step pin on the left while one object on the right turns from the
   apply request into the reply, the code and link, and finally an org landing under your name.
   Beyond: the attribution check. Pick a case (your link first, another affiliate first, your own org) and see who the
   org is attributed to, worked only from Hanzo's rule: first touch, one affiliate per org, never your own.
   Motion: chapters (signature) + line-masked hero type + the address bar writing itself + a spring that follows the
   chosen case. Accent: signal orange. Every word and figure is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { Copy } from '../ui';
import { A } from '../kit';
import LineReveal from '../v2/LineReveal';
import Chaptered from '../v2/Chaptered';
import '../v2/ProgramScale.css';
import './Affiliate.css';

const EASE = [0.16, 1, 0.3, 1];
const MAIL = 'mailto:hello@hanzo.ai?subject=Affiliate%20application';
const LINK = 'https://hanzo.ai/?aff=<code>';
const RULES = ['first touch', 'one affiliate per org', 'never your own'];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* The hero object: a browser address bar, huge, that writes the affiliate link by itself while it is on screen. */
function Bar() {
  const box = useRef(null);
  const out = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const [done, setDone] = useState(true);
  useEffect(() => {
    if (calm || !seen) { if (out.current) out.current.textContent = LINK; setDone(true); return; }
    let live = true;
    (async () => {
      while (live) {
        setDone(false);
        for (let i = 0; i <= LINK.length && live; i++) { if (out.current) out.current.textContent = LINK.slice(0, i); await wait(i < 18 ? 38 : 82); }
        if (!live) return;
        setDone(true);
        await wait(4200);
      }
    })();
    return () => { live = false; };
  }, [seen, calm]);
  return (
    <motion.div ref={box} className="xaf-bar xp-obj" aria-hidden="true" initial={{ opacity: 0, y: 60, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.3, ease: EASE, delay: 0.35 }}>
      <span className="xaf-dots"><i /><i /><i /></span>
      <span className="xaf-url">
        <span className="xaf-lock" />
        <span ref={out} className="xaf-typed">{LINK}</span>
        <b className={'xaf-caret' + (done ? '' : ' on')} />
      </span>
      <motion.span className="xaf-tag" initial={false} animate={done ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }} transition={{ duration: 0.5, ease: EASE }}>your code</motion.span>
    </motion.div>
  );
}

function Hero() {
  return (
    <section className="xaf-hero" aria-labelledby="xaf-h1">
      <div className="xp-wrap">
        <div className="xp-grid xaf-top">
          <div className="xaf-copy">
            <p className="xp-kick">Affiliates</p>
            <LineReveal as="h1" id="xaf-h1" className="xp-display" lines={['Refer customers', 'to Hanzo']} />
          </div>
          <motion.div className="xaf-side" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}>
            <p className="xp-lede">Apply to become an affiliate. Every application is reviewed, and the terms are agreed with each affiliate we approve.</p>
            <a href={MAIL} className="xp-cta" data-thumb="Apply">Apply<i aria-hidden="true">→</i></a>
          </motion.div>
        </div>
        <Bar />
      </div>
    </section>
  );
}

/* One object, four states: the request, the reply, the code, the landed org. */
function Stage({ at, still }) {
  const views = [
    <div className="xaf-s xaf-req" key="0">
      <div className="xaf-req-top"><span className="xaf-verb">POST</span><span>/v1/affiliate/apply</span></div>
      <div className="xaf-req-or">or</div>
      <div className="xaf-mail"><span className="xaf-mail-i">@</span><span><b>hello@hanzo.ai</b><small>Affiliate application</small></span></div>
    </div>,
    <div className="xaf-s xaf-reply" key="1">
      <div className="xaf-row"><span className="xaf-av">You</span><span><b>Affiliate application</b><small>to hello@hanzo.ai</small></span></div>
      <motion.div className="xaf-row in" initial={still ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.35 }}>
        <span className="xaf-av h">H</span><span><b>Re: Affiliate application</b><small>reviewed</small></span>
      </motion.div>
    </div>,
    <div className="xaf-s xaf-code" key="2">
      <span className="xaf-code-k">your code</span>
      <span className="xaf-code-v">&lt;code&gt;</span>
      <span className="xaf-code-l">https://hanzo.ai/?aff=<em>&lt;code&gt;</em></span>
    </div>,
    <div className="xaf-s xaf-land" key="3">
      <motion.span className="xaf-org" initial={still ? false : { y: -90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.25 }}>
        <span className="xaf-org-i">Org</span>signs up through the link
      </motion.span>
      <span className="xaf-you">attributed to you</span>
      <ul>{RULES.map((r, i) => <motion.li key={r} initial={still ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.6 + i * 0.12 }}>{r}</motion.li>)}</ul>
    </div>,
  ];
  if (still) return <div className="xaf-stage xp-obj">{views[at]}</div>;
  return (
    <div className="xaf-stage xp-obj">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div key={at} className="xaf-s-wrap" initial={{ opacity: 0, y: 44, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -30, scale: 0.98, transition: { duration: 0.25 } }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
          {views[at]}
        </motion.div>
      </AnimatePresence>
      <span className="xaf-step x-mono">{String(at + 1).padStart(2, '0')} / 04</span>
    </div>
  );
}

function How() {
  const chapters = [
    { kicker: 'Step 01', title: 'Apply', body: <p>Apply with <code className="xaf-code-in">POST /v1/affiliate/apply</code><Copy text="POST /v1/affiliate/apply" />, or write to <a href={MAIL}>hello@hanzo.ai</a>.</p> },
    { kicker: 'Step 02', title: 'Reviewed', body: <p>We review the application and reply.</p> },
    { kicker: 'Step 03', title: 'Your link', body: <p>Once approved you have a code and a link, <code className="xaf-code-in">{LINK}</code>.</p> },
    { kicker: 'Step 04', title: 'Attributed', body: <p>An org that signs up through the link is attributed to you: first touch, one affiliate per org, never your own.</p> },
  ];
  return <Chaptered label="How it works" head={<h2 className="xp-kick xaf-how-k">How it works</h2>} chapters={chapters} stage={(i, still) => <Stage at={i} still={still} />} />;
}

const CASES = [
  ['Your link comes first', 'An org signs up through your link.', true, 'Attributed to you.', 'first touch'],
  ['Another affiliate came first', 'The org reached Hanzo through another affiliate’s link before yours.', false, 'Not to you.', 'first touch, one affiliate per org'],
  ['It is your own org', 'You sign your own org up through your link.', false, 'Not to you.', 'never your own'],
];

/* The attribution check (the one dark room): three cases, Hanzo's rule decides each. It walks them until you choose. */
function Check() {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % CASES.length), 3600);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen]);
  const keys = (e) => {
    const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!k) return;
    e.preventDefault(); setMine(true);
    const n = (at + k + CASES.length) % CASES.length; setAt(n);
    document.getElementById('xaf-case-' + n)?.focus();
  };
  const c = CASES[at];
  return (
    <section className="xp-sec xp-dark xaf-check" data-room="dark" ref={box} aria-labelledby="xaf-check-h">
      <div className="xp-wrap">
        <div className="xp-grid">
          <div className="xaf-check-head">
            <p className="xp-kick">Attribution</p>
            <LineReveal onView className="xp-display sm" id="xaf-check-h" lines={['Who an org is', 'attributed to.']} />
          </div>
          <p className="xp-lede xaf-check-lede">One rule decides every case: first touch, one affiliate per org, never your own.</p>
        </div>
        <div className="xp-grid xaf-check-body">
          <div className="xaf-cases" role="tablist" aria-label="Choose a case" aria-orientation="vertical" onKeyDown={keys}>
            {CASES.map(([t, d], i) => (
              <button key={t} id={'xaf-case-' + i} type="button" role="tab" aria-selected={at === i} tabIndex={at === i ? 0 : -1} aria-controls="xaf-verdict" onClick={() => { setMine(true); setAt(i); }}>
                {at === i && <motion.span layoutId="xaf-case" className="xaf-case-bg" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                <b>{t}</b><span>{d}</span>
                {at === i && !mine && !calm && <i className="xaf-timer" aria-hidden="true" />}
              </button>
            ))}
          </div>
          <div className="xaf-verdict" id="xaf-verdict" role="tabpanel" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={at} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24, transition: { duration: 0.22 } }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                <span className={'xaf-mark' + (c[2] ? ' yes' : '')} aria-hidden="true">{c[2] ? '✓' : '×'}</span>
                <p className="xaf-v">{c[3]}</p>
                <p className="xaf-why">The rule: <b>{c[4]}</b>.</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Close() {
  return (
    <section className="xp-sec xaf-close" aria-label="Apply">
      <div className="xp-wrap xp-grid">
        <p className="xp-head xaf-close-h">Apply to become an affiliate.</p>
        <div className="xaf-close-act">
          <a href={MAIL} className="xp-cta">Apply<i aria-hidden="true">→</i></a>
          <p className="xp-body">A <A to="/referral">referral</A> on its own pays nothing.</p>
        </div>
      </div>
    </section>
  );
}

export default function Affiliate() {
  return (
    <main className="xp xaf">
      <Hero />
      <How />
      <Check />
      <Close />
    </main>
  );
}
