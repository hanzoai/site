'use client';
/* Affiliates. Its idea is the link that remembers who sent it.
   Persona: a partner who refers organizations to Hanzo. Goal: apply. CTA: "Apply" (mailto hello@hanzo.ai, Hanzo's own
   subject line). Metric: contact_click (no dedicated id in MASTER section 1 for affiliate applications).
   V2: 8/10 grey deck: h1 rests at 52px and the affiliate link (64px mono, the hero object) now sits whole in the first screen at 1470x801; writes itself once and rests with its code marked (it leans to the pointer); the four steps are sticky chapters told in Hanzo's own sentences with one object changing beside them (a swipe rail on phones); the dark room is Hanzo's three rules as the headline, each drawn as a diagram that runs itself; one Apply, sticky from the end of the hero.
   Signature: sticky chapters: Hanzo's four step sentences pin on the left while one object on the right turns from the
   apply request into the reply, the code and link, and an org landing on the link.
   Beyond: the rule, drawn: first touch, one affiliate per org, never your own, each as a small diagram that plays
   itself, with no words but Hanzo's.
   Motion: chapters (scroll, the signature) + the link writing itself once (time) + the link leaning to the pointer and
   Apply showing where it goes (pointer) + the rule tabs and their diagrams (state, idle). Copy is Hanzo's only; 0 UI hues. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { Copy, Mark, useTilt } from '../ui';
import { A, Cta, Tabs, TabPanel } from '../kit';
import LineReveal, { NoJs } from '../v2/LineReveal';
import Chaptered from '../v2/Chaptered';
import '../v2/ProgramScale.css';
import './Affiliate.css';

const EASE = [0.16, 1, 0.3, 1];
const MAIL = 'mailto:hello@hanzo.ai?subject=Affiliate%20application';
const LINK = 'https://hanzo.ai/?aff=<code>';
const RULES = ['first touch', 'one affiliate per org', 'never your own'];

/* The hero object, in its own section: the affiliate link itself at display size. It writes itself once when it is
   reached, then rests with its code marked; it leans toward the pointer. */
function Link() {
  const box = useRef(null);
  const seen = useInView(box, { once: true, amount: 0.4 });
  const tilt = useTilt(2.5, 'rgba(255,255,255,0)');
  // the link writes itself once (CSS, from an empty first frame, so nothing is wiped and retyped); it waits until it is seen
  return (
    <section className="xaf-link" aria-label={LINK}>
      <noscript><style>{'.xaf-lnk-t,.xaf-lnk-code{animation:none!important}.xaf-caret{display:none}'}</style></noscript>
      <div className="xp-wrap" ref={box}>
        <motion.div className={'xaf-link-in' + (seen ? ' on' : '')} style={{ rotateX: tilt.rx, rotateY: tilt.ry, transformPerspective: 1600 }} {...tilt.on} aria-hidden="true">
          <span className="xaf-lnk"><span className="xaf-lnk-t">{LINK.slice(0, 22)}</span><b className="xaf-caret" /></span>
          <span className="xaf-lnk-code">&lt;code&gt;</span>
        </motion.div>
        <p className="xaf-link-k"><span>Affiliates</span></p>
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section className="xaf-hero" aria-labelledby="xaf-h1">
      <div className="xp-wrap">
        <div className="xp-grid xaf-top">
          <div className="xaf-copy">
            <LineReveal as="h1" id="xaf-h1" className="xp-display" lines={['Refer customers', 'to Hanzo']} />
          </div>
          <div className="xaf-side">
            <p className="xp-lede">Apply to become an affiliate. Every application is reviewed, and the terms are agreed with each affiliate we approve.</p>
            <span className="xaf-apply">
              <Cta to={MAIL} id="affiliate.hero" thumb className="xp-cta" aria-describedby="xaf-to">Apply</Cta>
              <span className="xaf-to x-mono" id="xaf-to">hello@hanzo.ai</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* One object, four states: the request, the reply, the code, the org landing on the link. */
function Stage({ at, still }) {
  const views = [
    <div className="xaf-s xaf-req" key="0">
      <div className="xaf-req-top"><span className="xaf-verb">POST</span><span>/v1/affiliate/apply</span></div>
      <div className="xaf-req-or">or</div>
      <div className="xaf-mail"><span className="xaf-mail-i">@</span><b>hello@hanzo.ai</b></div>
    </div>,
    <div className="xaf-s xaf-reply" key="1">
      <div className="xaf-row"><span className="xaf-av">@</span><span className="xaf-mt"><b>Affiliate application</b><small>hello@hanzo.ai</small></span><span className="xaf-out" aria-hidden="true">↗</span></div>
      <motion.div className="xaf-row in" initial={still ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}>
        <span className="xaf-av h"><Mark size={16} /></span><span className="xaf-mt"><b>Affiliate application</b><small>hello@hanzo.ai</small></span><span className="xaf-out" aria-hidden="true">↩</span>
      </motion.div>
    </div>,
    <div className="xaf-s xaf-code" key="2">
      <span className="xaf-code-v">&lt;code&gt;</span>
      <span className="xaf-code-l">https://hanzo.ai/?aff=<em>&lt;code&gt;</em></span>
    </div>,
    <div className="xaf-s xaf-land" key="3">
      <motion.span className="xaf-org" initial={still ? false : { y: -90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}>
        <span className="xaf-org-i">org</span>signs up through the link
      </motion.span>
      <span className="xaf-you">attributed to you</span>
    </div>,
  ];
  if (still) return <div className="xaf-stage xp-obj">{views[at]}<span className="xaf-step xp-count">{String(at + 1).padStart(2, '0')} / 04</span></div>;
  return (
    <div className="xaf-stage xp-obj">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div key={at} className="xaf-s-wrap" initial={{ opacity: 0, y: 44, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -30, scale: 0.98, transition: { duration: 0.25 } }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
          {views[at]}
        </motion.div>
      </AnimatePresence>
      <span className="xaf-step xp-count">{String(at + 1).padStart(2, '0')} / 04</span>
    </div>
  );
}

function How() {
  const chapters = [
    { title: <>Apply with <span className="xaf-keep"><code className="xaf-code-in">POST /v1/affiliate/apply</code><Copy text="POST /v1/affiliate/apply" />,</span> or write to <a href={MAIL}>hello@hanzo.ai</a>.</> },
    { title: 'We review the application and reply.' },
    { title: <>Once approved you have a code and a link, <code className="xaf-code-in">{LINK}</code>.</> },
    { title: 'An org that signs up through the link is attributed to you: first touch, one affiliate per org, never your own.' },
  ];
  return <Chaptered label="How it works" statement head={<h2 className="xp-head xaf-how-h">How it works</h2>} chapters={chapters} stage={(i, still) => <Stage at={i} still={still} />} />;
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
      <g className="xaf-orgnode"><rect x={k === 2 ? 380 : 380} y="122" width="112" height="56" rx="28" /><text x="436" y="156" className="xaf-t inv">org</text></g>
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
    <section className="xp-sec xp-dark xaf-rule" data-room="dark" ref={box} aria-labelledby="xaf-rule-h">
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
    <section className="xp-sec xaf-close" aria-labelledby="xaf-close-h">
      <div className="xp-wrap xp-grid">
        <div className="xaf-close-l">
          <LineReveal onView as="p" id="xaf-close-h" className="xp-head xaf-close-h" lines={['Apply to become', 'an affiliate.']} />
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
  return (
    <main className="xp xaf" data-ask-name="Affiliates">
      <NoJs />
      <Hero />
      <Link />
      <How />
      <Rule />
      <Close />
    </main>
  );
}
