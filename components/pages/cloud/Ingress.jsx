'use client';
// Persona: a platform engineer choosing what sits on ports 80 and 443 of a cluster.
// Goal: see routes, certificates and middleware handled from what they already wrote, without restarts.
// CTA: View on GitHub (ingress.hero, ingress.close).
// Metric: cta_click ingress.hero
// Signature: globe — a turning globe where requests arc in from points around the world to the one edge and route on to a backend; drag (or swipe) to spin it.
// Beyond: Chain your own pipeline: pick and reorder Hanzo's middleware and watch a request walk it.
/* Ingress (v2, archetype A Launch).
   V2: 8/10 Motion map: globe — the pinned six-scene wipe and the board's scroll settle are gone; the hero now holds a
   turning, draggable globe (requests arc into the edge and on to backends, one backend leaves and rejoins rotation),
   the six facts are a snapping side carousel, and each main section enters its own way (side-carousel, stretch-scroll,
   inertia-drag, count-roll, curtain-rise).
   Order: statement and globe -> What happens at the edge (carousel) -> the routing board -> Paste and ship -> Chain your
   own pipeline (dark room) -> Get Ingress.
   Signature: the globe (IngressGlobe.jsx). Requests leave unlabeled points, arc into the edge and are routed to one of
   three backends; the middle backend goes hollow (out of rotation) and is put back when it recovers, the note beside it
   saying so in the page's words. Drag to spin and tilt with inertia; phones swipe sideways; arrow keys on focus; a pause
   control; reduced motion is a still frame that still turns by hand.
   Entrances (ingress/entrances.jsx), one per main section, in the map's order; no other section reveal on the page.
   Supporting: the h1's line cut-in at first paint; the routing board's idle loop; each fact's drawing plays once as its
   card comes into view.
   Beyond: "Chain your own pipeline" - press Hanzo's middleware to add it, drag (or use the arrows) to change the order,
   and a request walks the chain top to bottom each time it changes.
   Greys only (Hanzo's deck). Every word and link is Hanzo's.
   Persona: a platform engineer choosing what sits on ports 80 and 443 of a Kubernetes cluster.
   Goal: see routes, certificates and middleware handled from what they already wrote, without restarts.
   CTA: View on GitHub (hero, the sticky ask bar and the close; one solid button per screen). */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, Reorder, useInView, useReducedMotion } from 'motion/react';
import { play } from '../../../lib/sound';
import { Cta } from '../../kit';
import { useLive } from './Frame';
import { Lines, useTick } from '../../v2/LiftStage';
import ShipPrompt from '../../v2/ShipPrompt';
import GetIt from '../../v2/GetIt';
import LivePause, { usePause } from '../../v2/LivePause';
import IngressGlobe from './IngressGlobe';
import { SideCarousel, StretchScroll, InertiaDrag, RollNum, CurtainRise, useArrive } from './ingress/entrances';
import '../../v2/v2scale.css';
import './Ingress.css';

const EASE = [0.16, 1, 0.3, 1];
// every label on the board is Hanzo's own words from this page: its hostname, its files, its middleware
const ROUTES = [
  ['skill.md', ['rate limiting', 'retry']],
  ['docs/index.html', ['compression']],
  ['pricing.html', ['circuit breaking']],
];

/* The routing board: host and path, middleware, backends; a failing backend, a new certificate, a recovery. */
function Board() {
  const [ref, seen, calm] = useLive(0.3);
  const [paused, togglePause] = usePause();
  const live = seen && !paused;
  const [tick, setTick] = useState(0);
  useTick(1000, live, () => setTick((t) => t + 1));
  const phase = Math.floor(tick / 5) % 4; // 0 normal, 1 a backend fails, 2 new hostname gets a certificate, 3 recovered
  const req = tick % 3;
  const down = phase === 1 || phase === 2;
  const cert = phase !== 1 || calm; // opens on the issued certificate; only the middle of the loop waits for one
  return (
    <div className="lp-host">
    <LivePause paused={paused} onToggle={togglePause} className="ig-pause" />
    <div className="ig-board" ref={ref} aria-hidden="true">
      <p className="ig-board-t"><i />hanzoai/ingress</p>
      <div className="ig-col">
        <p className="ig-k">hostname</p>
        {ROUTES.map(([p], i) => (
          <div key={p} className={'ig-host' + (req === i ? ' hit' : '')}>
            <span className={'ig-lock' + (i === 2 && !cert ? ' wait' : '')}><svg viewBox="0 0 16 16" width="14" height="14"><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" /></svg></span>
            <em>hanzo.ai/</em><b>{p}</b>
            {i === 2 && <span className={'ig-cert' + (cert ? ' on' : '')}>Let's Encrypt</span>}
          </div>
        ))}
      </div>
      <div className="ig-col mid">
        <p className="ig-k">middleware</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={req} className="ig-chain" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE }}>
            {ROUTES[req][1].map((m) => <span key={m}>{m}</span>)}
          </motion.div>
        </AnimatePresence>
        <div className="ig-wire"><motion.i key={tick} initial={{ x: '-20%', opacity: 0 }} animate={{ x: '520%', opacity: [0, 1, 1, 0] }} transition={{ duration: 0.9, ease: 'linear' }} /></div>
      </div>
      <div className="ig-col">
        <p className="ig-k">backend</p>
        <div className={'ig-svc' + (req === 0 ? ' hit' : '')}><span className="ig-pods"><i /><i className={down ? 'down' : ''} /><i /></span></div>
        <div className={'ig-svc' + (req === 1 ? ' hit' : '')}><b>static</b><span className="ig-disk">from disk</span></div>
        <div className={'ig-svc' + (req === 2 ? ' hit' : '')}><span className="ig-pods"><i /><i /></span></div>
        <p className={'ig-note' + (down ? ' down' : '')}>{down ? 'out of rotation' : phase === 3 ? 'put back when it recovers' : 'no reload, no dropped connection'}</p>
      </div>
    </div>
    </div>
  );
}

const FACTS = [
  ['It reads what you already wrote', "Standard networking.k8s.io/v1 Ingress is the primary source, alongside IngressRoute for the things a plain Ingress can't say, Gateway API, and TOML or YAML from disk. It registers as the cluster's default IngressClass, so an Ingress that names none is still picked up.", 'sources'],
  ['Certificates it fetches itself', "Let's Encrypt provisioning and renewal, wildcards included. A new hostname gets a certificate without anyone filing a ticket for one.", 'cert'],
  ['Middleware you compose by annotation', 'Rate limiting, retry with exponential backoff, circuit breaking, compression, header rewriting, IP allowlists, redirects, prefix stripping. Name one in an annotation, or chain several into a named pipeline and name that.', 'mw'],
  ['Routes change without a restart', 'Edit an Ingress and the routing table follows — no reload, no dropped connection. A backend that stops answering health checks is taken out of rotation and put back when it recovers.', 'live'],
  ['It can serve the files itself', 'The static middleware serves a site export straight from disk or from object storage — pricing.html, docs/index.html, hashed asset chunks, a 404 page. A SPA or a docs bundle needs no pod of its own.', 'files'],
  ['One binary, on the port', 'No runtime dependencies. It runs in host-network mode and binds 80 and 443 directly, with every Linux capability dropped except the one that lets it.', 'ports'],
];

const MW = ['rate limiting', 'retry', 'circuit breaking', 'compression', 'header rewriting', 'IP allowlists', 'redirects', 'prefix stripping'];

/* each fact's drawing, from its own words; it plays once when its card is half in view, then rests.
   With JS off or reduced motion it is simply its final frame. */
function Draw({ k, on }) {
  const c = (name) => name + (on ? ' play' : '');
  if (k === 'sources') return (
    <div className={c('ig-d ig-d-src')}>
      <p className="main">networking.k8s.io/v1 Ingress</p>
      {['IngressRoute', 'Gateway API', 'TOML or YAML from disk'].map((t, i) => <p key={t} className="src" style={{ '--d': i }}>{t}</p>)}
      <p className="cls"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path pathLength="1" d="M3 8.5 6.5 12 13 4.5" /></svg>default IngressClass</p>
    </div>
  );
  if (k === 'cert') return (
    <div className={c('ig-d ig-d-cert')}>
      <p className="h"><span>hanzo.ai</span></p>
      <svg viewBox="0 0 48 48" width="64" height="64" aria-hidden="true"><path className="sh" pathLength="1" d="M16 21v-5a8 8 0 0 1 16 0v5" fill="none" stroke="currentColor" strokeWidth="3.5" /><rect x="10" y="21" width="28" height="21" rx="5" fill="currentColor" /></svg>
      <p className="t">Let's Encrypt</p>
      <p className="r">provisioning and renewal</p>
      <p className="w">wildcards included</p>
    </div>
  );
  if (k === 'mw') return <div className={c('ig-d ig-d-mw')}>{MW.map((m, i) => <span key={m} style={{ '--d': i, '--k': i / 3 }}>{m}</span>)}</div>;
  if (k === 'live') return (
    <div className={c('ig-d ig-d-live')}>
      <p className="t">no reload, no dropped connection</p>
      <div className="pods">{[0, 1, 2, 3].map((i) => <i key={i} className={i === 2 ? 'out' : ''} style={{ '--d': i }} />)}</div>
      <p className="cap">out of rotation · put back when it recovers</p>
    </div>
  );
  if (k === 'files') return <ul className={c('ig-d ig-d-files')}>{['pricing.html', 'docs/index.html', 'hashed asset chunks', 'a 404 page'].map((f, i) => <li key={f}><span className="ty" style={{ '--c': f.length, '--d': i }}>{f}</span></li>)}</ul>;
  return <div className={c('ig-d ig-d-ports')}><b>80</b><b>443</b><p>every Linux capability dropped except the one that lets it</p></div>;
}

function FactDraw({ k }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const seen = useInView(ref, { amount: 0.5, once: true });
  return <div ref={ref} className="ig-fact-r" aria-hidden="true"><Draw k={k} on={calm || seen} /></div>;
}

/* the globe's note: the page's own words for where the backend loop is */
const NOTE = ['no reload, no dropped connection', 'out of rotation', 'out of rotation', 'put back when it recovers'];

/* Beyond: chain your own pipeline. Pick middleware, drag to reorder; a request walks the chain again on every change,
   lighting each step as it passes. Its entrance is count-roll: the step numbers roll up into their values. */
function Pipeline() {
  const [chain, setChain] = useState(['IP allowlists', 'rate limiting', 'retry']);
  const toggle = (m) => setChain((c) => (c.includes(m) ? c.filter((x) => x !== m) : [...c, m]));
  const move = (i, d) => setChain((c) => { const n = [...c]; [n[i], n[i + d]] = [n[i + d], n[i]]; return n; });
  const [room] = useArrive();
  const run = useRef(null);
  const calm = useReducedMotion();
  const seen = useInView(run, { amount: 0.5, once: true });
  // the walk: -2 resting, -1 at "request", 0..n-1 on a step, n at "backend"
  const [at, setAt] = useState(-2);
  const [y, setY] = useState(0);
  const sig = chain.join('|');
  useEffect(() => {
    if (!seen || calm) return;
    let i = -1, t;
    setAt(-1);
    const step = () => { i += 1; setAt(i); t = setTimeout(i < chain.length ? step : () => setAt(-2), i < chain.length ? 300 : 700); };
    t = setTimeout(step, 300);
    return () => clearTimeout(t);
  }, [sig, seen, calm]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const box = run.current;
    if (!box || at < -1) return;
    const ends = box.querySelectorAll('.ig-pipe-end');
    const el = at === -1 ? ends[0] : at >= chain.length ? ends[1] : box.querySelectorAll('.ig-pipe-chain > li')[at];
    if (!el) return;
    const a = box.getBoundingClientRect(), b = el.getBoundingClientRect();
    setY(Math.round(b.top - a.top + b.height / 2 - 4));
  }, [at, sig]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <section ref={room} className="ig-pipe v2-dark" data-room="dark">
      <div className="v2-wrap v2-grid">
        <div className="ig-pipe-l">
          <h2 className="v2-headline ig-pipe-h">Name one in an annotation, or chain several into a named pipeline and name that.</h2>
          <div className="ig-pipe-pick" role="group" aria-label="Middleware">
            {MW.map((m) => <button key={m} type="button" data-sound="tick" aria-pressed={chain.includes(m)} onClick={() => toggle(m)}>{m}</button>)}
          </div>
        </div>
        <div className="ig-pipe-run" ref={run}>
          <p className={'ig-pipe-end' + (at === -1 ? ' lit' : '')}>hanzo.ai</p>
          <Reorder.Group as="ol" axis="y" values={chain} onReorder={setChain} className="ig-pipe-chain" data-swipe-own="">
            {chain.map((m, i) => (
              <Reorder.Item as="li" key={m} value={m} className={at === i ? 'lit' : ''} onDragEnd={() => play('tick')} whileDrag={{ scale: 1.03, boxShadow: '0 18px 40px -18px rgba(0,0,0,.6)' }} transition={{ duration: 0.3, ease: EASE }}>
                <span className="ig-pipe-n"><RollNum value={String(i + 1).padStart(2, '0')} /></span>{m}
                <span className="ig-pipe-mv">
                  <button type="button" data-sound="tick" aria-label={'Move ' + m + ' up'} disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
                  <button type="button" data-sound="tick" aria-label={'Move ' + m + ' down'} disabled={i === chain.length - 1} onClick={() => move(i, 1)}>↓</button>
                </span>
              </Reorder.Item>
            ))}
          </Reorder.Group>
          {chain.length === 0 && <p className="ig-pipe-none" aria-hidden="true">—</p>}
          <p className={'ig-pipe-end' + (at >= chain.length ? ' lit' : '')}>backend</p>
          <span className={'ig-pipe-walk' + (at >= -1 ? ' on' : '')} style={{ transform: `translateY(${y}px)` }} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

export default function Ingress() {
  const [phase, setPhase] = useState(0);
  return (
    <main className="v2 ig">
      <section className="ig-hero">
        <div className="v2-wrap v2-grid ig-hero-t">
          <div className="ig-hero-l">
            <Lines as="h1" className="v2-display ig-h1" lines={['Hanzo', 'Ingress']} data-morph-target="" />
          </div>
          <div className="ig-ports" aria-hidden="true"><span>:80</span><span>:443</span></div>
          <div className="ig-hero-b">
            <p className="v2-lede ig-sub" id="ig-lede">The entry point of a Kubernetes cluster</p>
            <Cta to="https://github.com/hanzoai" id="ingress.hero" thumb>View on GitHub</Cta>
          </div>
        </div>
        {/* the signature: the globe, with a legend in the page's own words */}
        <div className="v2-wrap ig-stage">
          <div className="ig-stage-l">
            <ul className="ig-legend">
              <li><i className="dot" aria-hidden="true" />hostname</li>
              <li><i className="edge" aria-hidden="true" />hanzoai/ingress</li>
              <li><i className="back" aria-hidden="true" />backend</li>
            </ul>
            <p className={'ig-stage-note' + (phase === 1 || phase === 2 ? ' down' : '')} aria-hidden="true">{NOTE[phase]}</p>
          </div>
          <IngressGlobe onPhase={setPhase} />
        </div>
      </section>

      {/* entrance 1, side-carousel */}
      <section className="ig-facts" aria-labelledby="ig-edge-h">
        <div className="v2-wrap ig-facts-h">
          <h2 className="v2-display m ig-edge" id="ig-edge-h">What happens at the edge</h2>
        </div>
        <SideCarousel
          label="What happens at the edge"
          items={FACTS}
          render={([t, d, k], i) => (
            <article className={'ig-fact s' + (i % 2)}>
              <div className="ig-fact-l">
                <h3 className="v2-headline">{t}</h3>
                <p className="v2-kick acc">{String(i + 1).padStart(2, '0')} / 06</p>
                <p className="v2-body">{d}</p>
              </div>
              <FactDraw k={k} />
            </article>
          )}
        />
      </section>

      {/* entrance 2, stretch-scroll */}
      <section className="ig-board-s">
        <StretchScroll className="v2-wrap"><Board /></StretchScroll>
      </section>

      {/* entrance 3, inertia-drag */}
      <InertiaDrag target=".sp-card" from={-1}>
        <ShipPrompt name="Ingress" prompt="Read https://hanzo.ai/skill.md and use Hanzo Ingress in my project. Start with: hanzo ingress routes list" flip />
      </InertiaDrag>

      {/* entrance 4, count-roll */}
      <Pipeline />

      {/* entrance 5, curtain-rise */}
      <CurtainRise>
        <GetIt name="Ingress" tag="K8s ingress + static plugin" seed="ingress" data={[80, 443, 6]} lead="Get started with Hanzo Ingress" ask={['View on GitHub', 'https://github.com/hanzoai', 'ingress.close']} />
      </CurtainRise>
    </main>
  );
}
