'use client';
/* Ingress (v2, archetype A Launch).
   V2: 8/10 Ports 80 and 443 as hero figures over a live routing board; the six edge facts as full-screen scenes that wipe up over each other; chain-your-own-pipeline as the dark room.
   Signature: the routing board, live. Requests arrive by hostname and path, pass the middleware named in annotations
   and land on backends; a backend that stops answering health checks drops out of rotation and comes back when it
   recovers; a new hostname fetches its own certificate; a docs path is served from disk with no pod at all.
   Supporting: kinetic title lines; the board settles from huge on scroll (Stage); the six facts as scroll-scrubbed
   clip-path scene changes (WipeScenes), each scene in its own tint.
   Beyond: "Chain your own pipeline" - press Hanzo's middleware to add it, drag (or use the arrows) to change the order,
   and a request walks the chain top to bottom each time it changes.
   Accent: blue, from the port light. Every word and link is Hanzo's; hostnames are examples. */
import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { A } from '../../kit';
import { useLive, useEvery } from './Frame';
import { Lines, Lift } from '../../v2/LiftStage';
import WipeScenes from '../../v2/WipeScenes';
import ShipPrompt from '../../v2/ShipPrompt';
import GetIt from '../../v2/GetIt';
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
  const [ref, live, calm] = useLive(0.3);
  const [tick, setTick] = useState(0);
  useEvery(1000, live, () => setTick((t) => t + 1));
  const phase = Math.floor(tick / 5) % 4; // 0 normal, 1 a backend fails, 2 new hostname gets a certificate, 3 recovered
  const req = tick % 3;
  const down = phase === 1 || phase === 2;
  const cert = phase >= 2 || calm;
  return (
    <div className="ig-board" ref={ref} aria-hidden="true">
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

/* each scene's drawing, from its own words */
function Draw({ k }) {
  if (k === 'sources') return (
    <div className="ig-d-src">
      <p className="main">networking.k8s.io/v1 Ingress</p>
      {['IngressRoute', 'Gateway API', 'TOML or YAML from disk'].map((t) => <p key={t}>{t}</p>)}
      <p className="cls">default IngressClass</p>
    </div>
  );
  if (k === 'cert') return (
    <div className="ig-d-cert">
      <svg viewBox="0 0 48 48" width="64" height="64" aria-hidden="true"><rect x="10" y="21" width="28" height="21" rx="5" fill="currentColor" /><path d="M16 21v-5a8 8 0 0 1 16 0v5" fill="none" stroke="currentColor" strokeWidth="3.5" /></svg>
      <p className="t">Let's Encrypt</p>
      <p>provisioning and renewal</p>
      <p className="w">wildcards included</p>
    </div>
  );
  if (k === 'mw') return <div className="ig-d-mw">{MW.map((m, i) => <span key={m} style={{ '--d': i }}>{m}</span>)}</div>;
  if (k === 'live') return (
    <div className="ig-d-live">
      <p className="t">no reload, no dropped connection</p>
      <div className="pods">{[0, 1, 2, 3].map((i) => <i key={i} className={i === 2 ? 'out' : ''} />)}</div>
      <p>out of rotation · put back when it recovers</p>
    </div>
  );
  if (k === 'files') return <ul className="ig-d-files">{['pricing.html', 'docs/index.html', 'hashed asset chunks', 'a 404 page'].map((f) => <li key={f}>{f}</li>)}</ul>;
  return <div className="ig-d-ports"><b>80</b><b>443</b><p>every Linux capability dropped except the one that lets it</p></div>;
}

/* Beyond: chain your own pipeline. Pick middleware, drag to reorder; the request walks the chain again on every change. */
function Pipeline() {
  const [chain, setChain] = useState(['IP allowlists', 'rate limiting', 'retry']);
  const toggle = (m) => setChain((c) => (c.includes(m) ? c.filter((x) => x !== m) : [...c, m]));
  const move = (i, d) => setChain((c) => { const n = [...c]; [n[i], n[i + d]] = [n[i + d], n[i]]; return n; });
  return (
    <section className="ig-pipe v2-dark" data-room="dark">
      <div className="v2-wrap v2-grid">
        <div className="ig-pipe-l">
          <p className="v2-kick acc">Middleware you compose by annotation</p>
          <h2 className="v2-display s">Chain your own pipeline</h2>
          <p className="v2-lede">Name one in an annotation, or chain several into a named pipeline and name that.</p>
          <div className="ig-pipe-pick" role="group" aria-label="Middleware">
            {MW.map((m) => <button key={m} type="button" aria-pressed={chain.includes(m)} onClick={() => toggle(m)}>{m}</button>)}
          </div>
        </div>
        <div className="ig-pipe-run">
          <p className="ig-pipe-end">request</p>
          <Reorder.Group as="ol" axis="y" values={chain} onReorder={setChain} className="ig-pipe-chain" data-swipe-own="">
            {chain.map((m, i) => (
              <Reorder.Item as="li" key={m} value={m} data-cursor="Drag" whileDrag={{ scale: 1.03, boxShadow: '0 18px 40px -18px rgba(0,0,0,.6)' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                <span className="ig-pipe-n">{String(i + 1).padStart(2, '0')}</span>{m}
                <span className="ig-pipe-mv">
                  <button type="button" aria-label={'Move ' + m + ' up'} disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
                  <button type="button" aria-label={'Move ' + m + ' down'} disabled={i === chain.length - 1} onClick={() => move(i, 1)}>↓</button>
                </span>
              </Reorder.Item>
            ))}
          </Reorder.Group>
          {chain.length === 0 && <p className="ig-pipe-none">No middleware: straight to the backend.</p>}
          <p className="ig-pipe-end">backend</p>
          <span key={chain.join('|')} className="ig-pipe-walk" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

export default function Ingress() {
  return (
    <main className="v2 ig">
      <section className="ig-hero">
        <div className="v2-wrap v2-grid ig-hero-t">
          <div className="ig-hero-l">
            <p className="v2-kick acc">hanzoai/ingress</p>
            <Lines as="h1" className="v2-display ig-h1" lines={['Hanzo', 'Ingress']} data-morph-target="" />
          </div>
          <div className="ig-ports" aria-hidden="true"><span>:80</span><span>:443</span></div>
          <div className="ig-hero-b">
            <p className="v2-lede ig-sub">The entry point of a Kubernetes cluster</p>
            <A to="https://github.com/hanzoai" className="v2-btn solid">View on GitHub</A>
          </div>
        </div>
        <Lift className="v2-wrap ig-lift" from={1.12} y={30} origin="50% 0%" offset={['start end', 'start 0.18']}>
          <Board />
        </Lift>
      </section>

      <section className="ig-intro">
        <div className="v2-wrap"><h2 className="v2-display m">What happens at the edge</h2></div>
      </section>

      <WipeScenes
        className="ig-ws"
        label="What happens at the edge"
        items={FACTS}
        scene={([t, d, k], i) => (
          <div className={'ig-scene s' + (i % 3)}>
            <div className="v2-wrap v2-grid ig-scene-g">
              <div className="ig-scene-l">
                <p className="v2-kick acc">{String(i + 1).padStart(2, '0')} / 06</p>
                <h3 className="v2-headline">{t}</h3>
                <p className="v2-body">{d}</p>
              </div>
              <div className="ig-scene-r" aria-hidden="true"><Draw k={k} /></div>
            </div>
          </div>
        )}
      />

      <Pipeline />

      <ShipPrompt name="Ingress" prompt="Read https://hanzo.ai/skill.md and use Hanzo Ingress in my project. Start with: hanzo ingress routes list" flip />

      <GetIt name="Ingress" tag="K8s ingress + static plugin" seed="ingress" data={[80, 443, 6]} lead="Get started with Hanzo Ingress" />
    </main>
  );
}
