'use client';
// Persona: a platform engineer choosing what sits on ports 80 and 443 of a cluster.
// Goal: see routes, certificates and middleware handled from what they already wrote, without restarts.
// CTA: View on GitHub (ingress.hero, ingress.close).
// Metric: cta_click ingress.hero
// Signature: the routing board, live: requests by host and path, a backend leaving and rejoining rotation, a certificate arriving.
// Beyond: Chain your own pipeline: pick and reorder Hanzo's middleware and watch a request walk it.
/* Ingress (v2, archetype A Launch).
   V2: 8/10 Ports 80 and 443 as figures over a live routing board; the six edge facts as scenes that wipe up; chain-your-own-pipeline in the dark room; greys only, one ask.
   Signature: the routing board, live. Requests arrive by hostname and path, pass the middleware named in annotations
   and land on backends; a backend that stops answering health checks drops out of rotation and comes back when it
   recovers; a new hostname fetches its own certificate; a docs path is served from disk with no pod at all.
   Supporting: kinetic title lines; the board settles from huge on scroll (Stage); the six facts as scroll-scrubbed
   clip-path scene changes (WipeScenes), each scene in its own tint.
   Beyond: "Chain your own pipeline" - press Hanzo's middleware to add it, drag (or use the arrows) to change the order,
   and a request walks the chain top to bottom each time it changes.
   Greys only (Hanzo's deck). Every word and link is Hanzo's; hostnames are examples.
   Persona: a platform engineer choosing what sits on ports 80 and 443 of a Kubernetes cluster.
   Goal: see routes, certificates and middleware handled from what they already wrote, without restarts.
   CTA: View on GitHub (hero, the sticky ask bar and the close; one solid button per screen). */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, Reorder, useInView, useScroll, useTransform } from 'motion/react';
import { play } from '../../../lib/sound';
import { A, Cta } from '../../kit';
import { useLive } from './Frame';
import { Lines, Lift, useTick } from '../../v2/LiftStage';
import WipeScenes from '../../v2/WipeScenes';
import ShipPrompt from '../../v2/ShipPrompt';
import GetIt from '../../v2/GetIt';
import LivePause, { usePause } from '../../v2/LivePause';
import '../../v2/v2scale.css';
import './Ingress.css';

const EASE = [0.16, 1, 0.3, 1];
const ROUTES = [
  ['api.example.com', '/', 'api', ['rate limiting', 'retry']],
  ['example.com', '/docs', 'static', ['compression']],
  ['shop.example.com', '/', 'shop', ['circuit breaking']],
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
  const cert = phase >= 2 || calm;
  return (
    <div className="lp-host">
    <LivePause paused={paused} onToggle={togglePause} className="ig-pause" />
    <div className="ig-board" ref={ref} aria-hidden="true">
      <p className="ig-board-t"><i />hanzoai/ingress</p>
      <div className="ig-col">
        <p className="ig-k">host · path</p>
        {ROUTES.map(([h, p], i) => (
          <div key={h} className={'ig-host' + (req === i ? ' hit' : '')}>
            <span className={'ig-lock' + (i === 2 && !cert ? ' wait' : '')}><svg viewBox="0 0 16 16" width="14" height="14"><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" /></svg></span>
            <b>{h}</b><em>{p}</em>
            {i === 2 && <span className={'ig-cert' + (cert ? ' on' : '')}>{cert ? "Let's Encrypt" : 'certificate…'}</span>}
          </div>
        ))}
      </div>
      <div className="ig-col mid">
        <p className="ig-k">middleware</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={req} className="ig-chain" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE }}>
            {ROUTES[req][3].map((m) => <span key={m}>{m}</span>)}
          </motion.div>
        </AnimatePresence>
        <div className="ig-wire"><motion.i key={tick} initial={{ x: '-20%', opacity: 0 }} animate={{ x: '520%', opacity: [0, 1, 1, 0] }} transition={{ duration: 0.9, ease: 'linear' }} /></div>
      </div>
      <div className="ig-col">
        <p className="ig-k">backends</p>
        <div className={'ig-svc' + (req === 0 ? ' hit' : '')}><b>api</b><span className="ig-pods"><i /><i className={down ? 'down' : ''} /><i /></span></div>
        <div className={'ig-svc' + (req === 1 ? ' hit' : '')}><b>static</b><span className="ig-disk">from disk · no pod</span></div>
        <div className={'ig-svc' + (req === 2 ? ' hit' : '')}><b>shop</b><span className="ig-pods"><i /><i /></span></div>
        <p className={'ig-note' + (down ? ' down' : '')}>{down ? 'health check failed · out of rotation' : phase === 3 ? 'recovered · back in rotation' : 'no reload, no dropped connection'}</p>
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

/* a media query, read after hydration so the server HTML and the first client render agree */
function useMedia(q) {
  const [n, setN] = useState(false);
  useEffect(() => {
    const m = matchMedia(q);
    const f = () => setN(m.matches);
    f();
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, [q]);
  return n;
}
// phones (under 900px, where WipeScenes stacks its scenes instead of pinning them); reduced motion
const useNarrow = () => useMedia('(max-width: 900px)');
const useCalm = () => useMedia('(prefers-reduced-motion: reduce)');

/* The pinned wipe, read from the page: [ref, reach] where reach is the last scene fully wiped in (each drawing plays
   once when its scene arrives), and, when the scroll stops mid-wipe, the stage settles to the nearest whole scene so
   two scenes never rest half-drawn over each other. Desktop only; phones stack the scenes. */
const REST = 0.62; // WipeScenes finishes each wipe at 62% of its scene's span
function useWipe(n, off) {
  const ref = useRef(null);
  const [reach, setReach] = useState(-1);
  useEffect(() => {
    const el = ref.current;
    if (off || !el) return;
    const span = 1 / (n - 1);
    let raf = 0, idle = 0, down = false;
    const geo = () => { const r = el.getBoundingClientRect(); const L = el.offsetHeight - innerHeight; return { r, L, v: -r.top / L }; };
    const look = () => {
      raf = 0;
      const { r, v } = geo();
      let j = r.top < innerHeight * 0.15 ? 0 : -1;
      if (v > 0) j = Math.min(n - 1, Math.floor(v / span + (1 - REST) + 1e-3));
      if (j >= 0) setReach((x) => Math.max(x, j));
    };
    const settle = () => {
      if (down) return;
      const { r, L, v } = geo();
      if (v <= 0 || v >= 1 || L <= 0) return;
      const j = Math.floor(v / span), t = v / span - j;
      if (t >= REST) return; // resting on a whole scene
      const top = scrollY + r.top;
      const y = t < REST / 2 ? Math.floor(top + j * span * L) - 1 : Math.ceil(top + (j + REST) * span * L) + 1;
      if (Math.abs(y - scrollY) < 4) return;
      if (window.__lenis) window.__lenis.scrollTo(y, { duration: 0.6, easing: (x) => 1 - Math.pow(1 - x, 3) });
      else scrollTo({ top: y, behavior: 'smooth' });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(look); clearTimeout(idle); idle = setTimeout(settle, 180); };
    const press = () => { down = true; }, lift = () => { down = false; onScroll(); };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('pointerdown', press, { passive: true });
    addEventListener('pointerup', lift, { passive: true });
    look();
    return () => { removeEventListener('scroll', onScroll); removeEventListener('pointerdown', press); removeEventListener('pointerup', lift); cancelAnimationFrame(raf); clearTimeout(idle); };
  }, [n, off]);
  return [ref, reach];
}

/* each scene's drawing, from its own words; it plays once when its scene is fully in (`on`), then rests.
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

/* phones: a drawing plays when half of it is on screen */
function SceneDraw({ k, i, reach, narrow, calm }) {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.5, once: true });
  return <div ref={ref} className="ig-scene-r" aria-hidden="true"><Draw k={k} on={calm || (narrow ? seen : reach >= i)} /></div>;
}

/* Beyond: chain your own pipeline. Pick middleware, drag to reorder; a request walks the chain again on every change,
   lighting each step as it passes. The black room enters as a rounded card inside the gutters and opens to full width. */
function Pipeline() {
  const [chain, setChain] = useState(['IP allowlists', 'rate limiting', 'retry']);
  const toggle = (m) => setChain((c) => (c.includes(m) ? c.filter((x) => x !== m) : [...c, m]));
  const move = (i, d) => setChain((c) => { const n = [...c]; [n[i], n[i + d]] = [n[i + d], n[i]]; return n; });
  const room = useRef(null);
  const run = useRef(null);
  const calm = useCalm();
  const narrow = useNarrow();
  const flat = useRef(false);
  flat.current = calm || narrow;
  const seen = useInView(run, { amount: 0.5, once: true });
  const { scrollYProgress: p } = useScroll({ target: room, offset: ['start end', 'start 0.25'] });
  const clip = useTransform(p, (v) => {
    if (flat.current) return 'inset(0px 0px round 0px)';
    const q = 1 - Math.min(1, Math.max(0, v));
    return `inset(0px ${Math.round(q * 32)}px round ${Math.round(q * 28)}px)`;
  });
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
    <motion.section ref={room} className="ig-pipe v2-dark" data-room="dark" style={{ clipPath: clip }}>
      <div className="v2-wrap v2-grid">
        <div className="ig-pipe-l">
          <h2 className="v2-display s">Chain your own pipeline</h2>
          <p className="v2-lede">Name one in an annotation, or chain several into a named pipeline and name that.</p>
          <div className="ig-pipe-pick" role="group" aria-label="Middleware">
            {MW.map((m) => <button key={m} type="button" data-sound="tick" aria-pressed={chain.includes(m)} onClick={() => toggle(m)}>{m}</button>)}
          </div>
        </div>
        <div className="ig-pipe-run" ref={run}>
          <p className={'ig-pipe-end' + (at === -1 ? ' lit' : '')}>request</p>
          <Reorder.Group as="ol" axis="y" values={chain} onReorder={setChain} className="ig-pipe-chain" data-swipe-own="">
            {chain.map((m, i) => (
              <Reorder.Item as="li" key={m} value={m} className={at === i ? 'lit' : ''} data-cursor="Drag" onDragEnd={() => play('tick')} whileDrag={{ scale: 1.03, boxShadow: '0 18px 40px -18px rgba(0,0,0,.6)' }} transition={{ duration: 0.3, ease: EASE }}>
                <span className="ig-pipe-n">{String(i + 1).padStart(2, '0')}</span>{m}
                <span className="ig-pipe-mv">
                  <button type="button" data-sound="tick" aria-label={'Move ' + m + ' up'} disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
                  <button type="button" data-sound="tick" aria-label={'Move ' + m + ' down'} disabled={i === chain.length - 1} onClick={() => move(i, 1)}>↓</button>
                </span>
              </Reorder.Item>
            ))}
          </Reorder.Group>
          {chain.length === 0 && <p className="ig-pipe-none">No middleware: straight to the backend.</p>}
          <p className={'ig-pipe-end' + (at >= chain.length ? ' lit' : '')}>backend</p>
          <span className={'ig-pipe-walk' + (at >= -1 ? ' on' : '')} style={{ transform: `translateY(${y}px)` }} aria-hidden="true" />
        </div>
      </div>
    </motion.section>
  );
}

export default function Ingress() {
  const narrow = useNarrow();
  const calm = useCalm();
  const [wipe, reach] = useWipe(FACTS.length, narrow || calm);
  return (
    <main className="v2 ig">
      <section className="ig-hero">
        <div className="v2-wrap v2-grid ig-hero-t">
          <div className="ig-hero-l">
            <Lines as="h1" className="v2-display ig-h1" lines={['Hanzo', 'Ingress']} data-morph-target="" />
          </div>
          <div className="ig-ports" aria-hidden="true"><span>:80</span><span>:443</span></div>
          <div className="ig-hero-b">
            <p className="v2-lede ig-sub v2-in" style={{ animationDelay: '.3s' }}>The entry point of a Kubernetes cluster</p>
            <Cta to="https://github.com/hanzoai" id="ingress.hero" thumb className="v2-in" style={{ animationDelay: '.42s' }}>View on GitHub</Cta>
          </div>
        </div>
        <Lift className="v2-wrap ig-lift" from={1.05} y={20} origin="50% 0%" offset={['start end', 'start 0.4']}>
          <Board />
        </Lift>
      </section>

      <div ref={wipe}>
        <WipeScenes
          className="ig-ws"
          label="What happens at the edge"
          items={FACTS}
          scene={([t, d, k], i) => (
            <div className={'ig-scene s' + (i % 3)}>
              <div className="v2-wrap v2-grid ig-scene-g">
                <div className="ig-scene-l">
                  {i === 0 && <h2 className="v2-display m ig-edge">What happens at the edge</h2>}
                  <p className="v2-kick acc">{String(i + 1).padStart(2, '0')} / 06</p>
                  <h3 className="v2-headline">{t}</h3>
                  <p className="v2-body">{d}</p>
                </div>
                <SceneDraw k={k} i={i} reach={reach} narrow={narrow} calm={calm} />
              </div>
            </div>
          )}
        />
      </div>

      <ShipPrompt name="Ingress" prompt="Read https://hanzo.ai/skill.md and use Hanzo Ingress in my project. Start with: hanzo ingress routes list" flip />

      <Pipeline />

      <GetIt name="Ingress" tag="K8s ingress + static plugin" seed="ingress" data={[80, 443, 6]} lead="Get started with Hanzo Ingress" ask={['View on GitHub', 'https://github.com/hanzoai', 'ingress.close']} />
    </main>
  );
}
