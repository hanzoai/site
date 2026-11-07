'use client';
// Persona: a developer or platform engineer putting a service behind api.hanzo.ai.
// Goal: see in one request that the token is checked once at the edge and identity is written, not trusted.
// CTA: Read the docs (gateway.hero, gateway.close).
// Metric: cta_click gateway.hero
// Signature: the gate, running: one request at a time checked, stripped, stamped or turned away (429) across a full-width lane.
// Beyond: Forge one yourself: pick a credential and fake headers, see what the service behind the gate receives.
/* Gateway (v2, archetype A Launch).
   V2: 8/10 round 3: six chapters are six scenes that act their rule out (JWKS check, headers struck and written, an empty route map, buckets draining to a 429, a ping that stops at the process, the gateway sliding into the cloud binary); phone pins one short scene under the header while the words swap; dots name their chapter; reduced motion shows every final frame; Settle and the growing statement carry no inline style before mount (no hydration mismatch); prompt wraps under its api line; related rows preview where they go.
   Signature: the gate, running across the whole screen. One request at a time arrives from the left carrying a token and
   a forged X-Org-Id; at the gate the token is checked against JWKS, the forged header is torn off, the real identity is
   stamped on from the claims and the request walks through to Hanzo Cloud. A token bucket on the gate drains with each
   one, and when it is empty the next caller is turned back with a 429 and a Retry-After.
   Supporting: kinetic title lines; the lane recedes as you leave it (scroll); the six rules as pinned chapters, each
   acted out by its own scene (gateway/GwChapters, gateway/GwScenes).
   Beyond: "Forge one yourself" - build a request (a JWT, an opaque API key or nothing, plus whichever identity headers
   you want to fake) and see what the service behind the gate receives under Hanzo's two rules.
   Greys only (Hanzo's deck). Every word and link is Hanzo's; header values are examples.
   Persona: a developer or platform engineer putting a service behind api.hanzo.ai.
   Goal: see, in one request, that the token is checked once at the edge and identity is written, not trusted.
   CTA: Read the docs (hero, the sticky ask bar and the close; one solid button per screen). */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { A, Cta } from '../../kit';
import { Console, useLive } from './Frame';
import { Lines } from '../../v2/LiftStage';
import GwChapters from './gateway/GwChapters';
import GwScene from './gateway/GwScenes';
import ShipPrompt from '../../v2/ShipPrompt';
import GetIt from '../../v2/GetIt';
import LivePause, { usePause } from '../../v2/LivePause';
import '../../v2/v2scale.css';
import './Gateway.css';

const EASE = [0.16, 1, 0.3, 1];
const CALLERS = ['payments-api', 'checkout-web', 'docs-site'];

/* The lane: one request at a time through the gate (arrive, token checked, forged header torn off, identity stamped,
   through), or a 429 when the bucket is empty. Runs only while on screen. */
function Lane() {
  const [ref, seen, calm] = useLive(0.25);
  // a fine pointer leans the lane toward it (2.5° at most), written straight to the element; flat on leave, none with
  // reduced motion or touch
  const tilt = (e) => {
    const el = ref.current;
    if (!el || calm || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1600px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`;
  };
  const flat = () => { if (ref.current) ref.current.style.transform = ''; };
  const [paused, togglePause] = usePause();
  const live = seen && !paused;
  const [n, setN] = useState(1); // one request has already landed, so the log is never empty
  const [phase, setPhase] = useState(0);
  const [bucket, setBucket] = useState(4);
  const limited = bucket === 0;
  // reduced motion: the finished check, at rest at the gate (JWKS ticked, forged header gone, identity written)
  useEffect(() => { if (calm) { setBucket(4); setPhase(3); } }, [calm]);
  useEffect(() => {
    if (!live) return;
    const steps = limited ? [1000, 1500, 900] : [1100, 950, 900, 950, 1200];
    if (phase >= steps.length) {
      const t = setTimeout(() => { setN((v) => v + 1); setPhase(0); setBucket((b) => (b === 0 ? 4 : b - 1)); }, 120);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPhase((p) => p + 1), steps[phase]);
    return () => clearTimeout(t);
  }, [phase, live, limited]);
  const who = CALLERS[n % CALLERS.length];
  const left = limited ? bucket : bucket - (phase >= 1 ? 1 : 0);
  const x = limited ? (phase >= 2 ? '-150%' : '-108%') : phase >= 4 ? '70%' : '-108%';
  const gone = limited ? phase >= 2 : phase >= 4;
  return (
    <div className="lp-host">
    <LivePause paused={paused} onToggle={togglePause} className="gw-pause" />
    <div className="gw-lane" ref={ref} aria-hidden="true" onPointerMove={tilt} onPointerLeave={flat}>
      <div className="gw-gate"><span className="gw-gate-k">Gateway</span><i /></div>
      <p className="gw-side l">client</p>
      <p className="gw-side r">Hanzo Cloud <b>/v1</b></p>
      <ul className="gw-queue">{[1, 2, 3].map((k) => <li key={n + k} style={{ opacity: 1 - k * 0.22 }}>{CALLERS[(n + k) % CALLERS.length]}</li>)}</ul>
      <ul className="gw-log">
        <AnimatePresence initial={false}>
          {Array.from({ length: Math.min(2, n) }).map((_, k) => {
            const m = n - 1 - k;
            const no = m % 5 === 4;
            return (
              <motion.li key={m} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1 - k * 0.35, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}>
                <b>{CALLERS[m % CALLERS.length]}</b><span className={no ? 'x' : ''}>{no ? '429' : <>X-Org-Id <i className="gw-tk">✓</i></>}</span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
      <div className="gw-bucket">
        <span>Token-bucket</span>
        <div>{[0, 1, 2, 3].map((i) => <motion.i key={i} animate={{ opacity: i < left ? 1 : 0.14, scaleY: i < left ? 1 : 0.5 }} transition={{ duration: 0.3, ease: EASE }} />)}</div>
      </div>
      <AnimatePresence initial={false}>
        <motion.div
          key={n}
          className="gw-req"
          initial={{ x: '-280%', opacity: 0 }}
          animate={{ x, opacity: gone ? 0 : 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          transition={{ x: { duration: phase === 0 ? 1.0 : 0.95, ease: EASE }, opacity: { duration: gone ? 0.7 : 0.4, delay: gone ? 0.25 : 0 } }}
        >
          <p className="gw-req-top"><b>api.hanzo.ai</b> <i className="gw-tk">/*</i><span>{who}</span></p>
          <p className={'gw-h' + (phase >= 1 && !limited ? ' ok' : '')}><span><em>JWT</em></span>
            {phase >= 1 && !limited && <motion.span className="gw-chip" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, ease: EASE }}><i className="gw-tk">✓</i> JWKS</motion.span>}
          </p>
          <AnimatePresence>
            {(phase < 2 || limited) && (
              <motion.p className="gw-h forged" exit={{ opacity: 0, y: 40, rotate: -8, transition: { duration: 0.5, ease: [0.4, 0, 1, 1] } }}>X-Org-Id <em className="gw-tk">…</em></motion.p>
            )}
          </AnimatePresence>
          <div className="gw-stamps">
            {!limited && phase >= 3 && [['X-User-Id', 'sub'], ['X-Org-Id', 'owner'], ['X-Roles', 'roles']].map(([h, c], i) => (
              <motion.p key={h} className="gw-h set" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: EASE, delay: i * 0.07 }}>{h} <em>← {c}</em></motion.p>
            ))}
            {limited && phase >= 1 && (
              <motion.p className="gw-429" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, ease: EASE }}>429 <span>Retry-After</span></motion.p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
    </div>
  );
}

const RULES = [
  ['The token is checked here', "A JWT is validated against Hanzo IAM's JWKS before anything else reads the request. Opaque API keys aren't JWTs, so they go on to the service that issued them and it decides."],
  ['Identity headers are written, not trusted', 'X-User-Id, X-Org-Id, X-Roles and every X-IAM-* variant are stripped from every inbound request, then written back from the verified claims — sub, owner, roles. A curl flag can\'t set them.'],
  ['No route map, deliberately', 'For api.hanzo.ai it forwards /* straight to Hanzo Cloud, which owns the /v1 mount table. A second table here would be a second thing to keep in sync, and the first one to go stale.'],
  ['Rate limits per caller and overall', 'Token-bucket limits by client IP and across the edge as a whole, with per-endpoint overrides in config. A rejected request gets a 429 and a Retry-After, not a dropped connection.'],
  ['Liveness that consults nothing', 'The health check answers whether the process is up and asks no backend. A probe that fails when a dependency blinks restarts a healthy process and turns one outage into two — so backends are dialed lazily and degrade per request instead.'],
  ['A hop, or no hop at all', "Run it as its own service in front of the API, or mount it inside the cloud binary with one call. Same checks either way — one less network hop when you don't want one."],
];

const RELATED = [['Gateway docs →', 'https://docs.hanzo.ai/docs/projects/hanzoai/gateway'], ['DNS', '/dns', 'Authoritative DNS + DNSSEC'], ['Service Mesh', '/cloud/service-mesh'], ['Nodes', '/cloud/nodes']];
const ARROW = <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

const FAKE = [['X-User-Id', 'sub'], ['X-Org-Id', 'owner'], ['X-Roles', 'roles'], ['X-IAM-*', '']];
// the three ways a request arrives, in Hanzo's words: a JWT, an opaque API key, or only what a curl flag sets
const CRED = ['JWT', 'API key', 'curl'];

/* Beyond: chapter 02, opened. It has no heading of its own (the chapter's h3 names it, and its words are not repeated
   here): pick how the request arrives and which identity headers the client fakes; the right pane shows what every
   service behind the gate receives. Each switch really changes that pane. */
function Forge() {
  const [cred, setCred] = useState(0);
  const [fake, setFake] = useState([true, true, false, false]);
  const jwt = cred === 0;
  return (
    <section className="gw-forge v2-dark" data-room="dark" aria-labelledby="gwc-t-1">
      <div className="v2-wrap">
        <div className="gw-forge-head v2-grid">
          <div className="gw-forge-hl">
            <p className="gw-forge-n v2-kick" aria-hidden="true">02 / 06</p>
          </div>
          <div className="gw-forge-pick" role="radiogroup" aria-labelledby="gwc-t-1">
            {CRED.map((c, i) => (
              <button key={c} type="button" role="radio" data-sound="tick" aria-checked={cred === i} onClick={() => setCred(i)}>
                {cred === i && <motion.span layoutId="gw-pick" className="gw-pick-bg" transition={{ duration: 0.3, ease: EASE }} />}
                <span>{c}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="gw-forge-grid">
          <div className="gw-pane">
            <p className="v2-kick">client</p>
            <ul className="gw-forge-hs">
              {cred < 2 && <li className="gw-forge-auth"><span><em>{jwt ? 'JWT' : 'API key'}</em></span></li>}
              {FAKE.map(([h], i) => (
                <li key={h} className={fake[i] ? 'on' : ''}>
                  <button type="button" role="switch" aria-checked={fake[i]} data-sound="tick" className="gw-tog" onClick={() => setFake((f) => f.map((v, k) => (k === i ? !v : v)))}>
                    <span className="gw-tog-ui" aria-hidden="true" />
                    <span>{h} <em className="gw-tk">…</em></span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="gw-arrow" aria-hidden="true"><span>Gateway</span><i /></div>
          <div className="gw-pane out" aria-live="polite">
            <p className="v2-kick">every service behind it</p>
            <ul className="gw-forge-hs">
              <AnimatePresence initial={false}>
                {FAKE.map(([h], i) => fake[i] && (
                  <motion.li key={h} className="gone" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>{h} <span>stripped</span></motion.li>
                ))}
                {jwt && FAKE.filter(([, c]) => c).map(([h, c], i) => (
                  <motion.li key={'w' + h} className="set" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE, delay: 0.05 * i }}><span>{h} <em>← {c}</em></span></motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* The hero lane as the same inset card from first paint: no transform in the server HTML or the first client render
   (a plain element with a class, never a style object that reduced motion could render differently). After mount, as
   the hero leaves, the card recedes a little (scale and lift written straight to the element, tied to scroll only). */
function Settle({ children, className }) {
  const ref = useRef(null);
  const inner = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.3', 'end start'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const el = inner.current;
    if (!el) return;
    const k = calm ? 0 : Math.min(1, Math.max(0, p));
    el.style.transform = k ? `translateY(${(-40 * k).toFixed(1)}px) scale(${(1 - 0.06 * k).toFixed(4)})` : '';
  });
  return (
    <div ref={ref} className={className}>
      <div ref={inner} className="gw-settle">{children}</div>
    </div>
  );
}

/* The statement: it grows as it crosses the middle of the screen, then settles back, over a one-line request lane where
   a forged header is torn off at the gate and the org id that walks through is the one Gateway wrote. */
function Say() {
  const ref = useRef(null);
  const head = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  // the line cuts in once as the statement arrives (a class added after mount, so the server HTML shows it whole)
  useEffect(() => {
    const el = head.current;
    if (!el) return;
    el.classList.add('cut');
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // 44px grows toward 64px on desktop; a phone grows a little (32px toward 38px). Written after mount, so the server
  // HTML and the first client render carry no transform.
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const el = head.current;
    if (!el) return;
    const k = innerWidth < 900 ? 0.18 : 0.42;
    const s = calm ? 1 : 1 + k * Math.max(0, 1 - Math.abs(p - 0.5) / 0.3);
    el.style.transform = s === 1 ? '' : `scale(${s.toFixed(4)})`;
  });
  return (
    <section className="v2-sec gw-say" ref={ref}>
      <div className="v2-wrap v2-grid">
        <h2 ref={head} className="v2-display m gw-say-h"><span className="gw-say-in">Nothing downstream has to ask who is calling</span></h2>
        <p className="v2-lede gw-say-l">Gateway answers that once, at the edge, so every service behind it can read an org id and believe it.</p>
        <div className="gw-rail" aria-hidden="true">
          <span className="gw-rail-end">client</span>
          <span className="gw-rail-line"><i className="gw-rail-gate" /><span className="gw-rail-mov"><b className="gw-rail-dot"><em className="gw-rail-in">X-Org-Id <i className="gw-tk">…</i></em><em className="gw-rail-out">X-Org-Id <i className="gw-tk">←</i> owner</em></b></span></span>
          <span className="gw-rail-end r">Hanzo Cloud <b>/v1</b></span>
        </div>
      </div>
    </section>
  );
}

export default function Gateway() {
  return (
    <main className="v2 gw">
      <section className="gw-hero">
        <div className="v2-wrap v2-grid gw-hero-top">
          <div className="gw-hero-t">
            <Lines as="h1" className="v2-display gw-h1" lines={['Hanzo', 'Gateway']} data-morph-target="" />
          </div>
          <div className="gw-hero-r">
            <p className="v2-lede gw-sub v2-in" style={{ animationDelay: '.17s' }}>The trust boundary in front of the API</p>
            <div className="v2-acts v2-in" style={{ animationDelay: '.23s' }}>
              <Cta to="https://docs.hanzo.ai/docs/projects/hanzoai/gateway" id="gateway.hero" thumb>Read the docs</Cta>
              <Cta to="https://github.com/hanzoai" kind="quiet" id="gateway.view-on-github">View on GitHub</Cta>
            </div>
          </div>
        </div>
        <Settle className="gw-lift">
          <Lane />
        </Settle>
      </section>

      <Say />

      <GwChapters className="gw-ch" label="Gateway" items={RULES} scene={(at) => <GwScene at={at} total={RULES.length} />} />

      <Forge />

      <ShipPrompt
        name="Gateway"
        api="/v1/gateway"
        prompt="Read https://hanzo.ai/skill.md and use Hanzo Gateway in my project. Start with: hanzo gateway config get"
        className="gw-ship"
      />

      <section className="v2-sec gw-proj">
        <div className="v2-wrap v2-grid">
          <div className="gw-proj-t">
            <p className="v2-title gw-proj-l">Example project. Every name in it is one you would give your own.</p>
          </div>
          <div className="gw-proj-c">
            <Console light name="Gateway" api="/v1/gateway" side={[['Gateway', '/gateway'], ['DNS', '/dns'], ['Service Mesh', '/cloud/service-mesh'], ['Nodes', '/cloud/nodes']]} />
          </div>
        </div>
      </section>

      <GetIt name="Gateway" tag="API gateway" seed="gateway" data={[429, 6]} self="https://docs.hanzo.ai/docs/projects/hanzoai/gateway" ask={['Read the docs', 'https://docs.hanzo.ai/docs/projects/hanzoai/gateway', 'gateway.close']} />

      {/* related capabilities: the last thing before the footer (ShipPrompt's own row, composed here so it can move) */}
      <section className="sp v2-sec gw-relsec">
        <div className="v2-wrap v2-grid sp-grid">
          <nav className="sp-rel" aria-label="Related capabilities">
            <p className="v2-kick">Related capabilities</p>
            <ul>
              {RELATED.map(([t, to, d]) => (
                <li key={t}>
                  <A to={to} className="sp-rel-a"><b>{t}</b>{d && <span>{d}</span>}{!t.endsWith('→') && ARROW}</A>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </main>
  );
}
