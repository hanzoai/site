'use client';
/* Ingress. Signature: the routing table, live. Requests arrive by hostname and path, pass a chain of middleware named in
   annotations, and land on backends; a backend that stops answering health checks drops out of rotation and returns
   when it recovers; a new hostname fetches its own certificate; a docs path is served from disk with no pod at all.
   The six facts are cards fanned like a hand you can flip through. Beyond: "Chain your own pipeline" - press Hanzo's
   middleware to add it, drag to change the order, and a request walks the chain top to bottom each time it changes.
   Every word and link is Hanzo's; hostnames are examples. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { Hero, Paste, Get, useLive, useEvery } from './Frame';
import './Ingress.css';

const ROUTES = [
  ['api.example.com', '/', 'api', ['rate limiting', 'retry']],
  ['example.com', '/docs', 'static', ['compression']],
  ['shop.example.com', '/', 'shop', ['circuit breaking']],
];

function Table() {
  const [ref, live, calm] = useLive(0.3);
  const [tick, setTick] = useState(0);
  useEvery(900, live, () => setTick((t) => t + 1));
  const phase = Math.floor(tick / 5) % 4; // 0 normal, 1 a backend fails, 2 new hostname gets a certificate, 3 recovered
  const req = tick % 3;
  const down = phase === 1 || phase === 2;
  const cert = phase >= 2 || calm;
  return (
    <div className="ig-table" ref={ref} aria-hidden="true">
      <div className="ig-hosts">
        <p className="ig-k">host · path</p>
        {ROUTES.map(([h, p], i) => (
          <div key={h} className={'ig-host' + (req === i ? ' hit' : '')}>
            <span className={'ig-lock' + (i === 2 && !cert ? ' wait' : '')}><svg viewBox="0 0 16 16" width="13" height="13"><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" /></svg></span>
            <b>{h}</b><em>{p}</em>
            {i === 2 && <span className={'ig-cert' + (cert ? ' on' : '')}>{cert ? "Let's Encrypt" : 'certificate…'}</span>}
          </div>
        ))}
      </div>
      <div className="ig-mid">
        <p className="ig-k">middleware</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={req} className="ig-chain" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25, ease: EASE }}>
            {ROUTES[req][3].map((m) => <span key={m}>{m}</span>)}
          </motion.div>
        </AnimatePresence>
        <div className="ig-pkt"><motion.i key={tick} initial={{ x: '-10%', opacity: 0 }} animate={{ x: '110%', opacity: [0, 1, 1, 0] }} transition={{ duration: 0.8, ease: 'linear' }} /></div>
      </div>
      <div className="ig-back">
        <p className="ig-k">backends</p>
        <div className={'ig-svc' + (req === 0 ? ' hit' : '')}>
          <b>api</b>
          <span className="ig-pods"><i /><i className={down ? 'down' : ''} /><i /></span>
        </div>
        <div className={'ig-svc static' + (req === 1 ? ' hit' : '')}><b>static</b><span className="ig-disk">from disk · no pod</span></div>
        <div className={'ig-svc' + (req === 2 ? ' hit' : '')}><b>shop</b><span className="ig-pods"><i /><i /></span></div>
        <p className="ig-note">{down ? 'health check failed · out of rotation' : phase === 3 ? 'recovered · back in rotation' : 'no reload, no dropped connection'}</p>
      </div>
    </div>
  );
}

const FACTS = [
  ['It reads what you already wrote', "Standard networking.k8s.io/v1 Ingress is the primary source, alongside IngressRoute for the things a plain Ingress can't say, Gateway API, and TOML or YAML from disk. It registers as the cluster's default IngressClass, so an Ingress that names none is still picked up."],
  ['Certificates it fetches itself', "Let's Encrypt provisioning and renewal, wildcards included. A new hostname gets a certificate without anyone filing a ticket for one."],
  ['Middleware you compose by annotation', 'Rate limiting, retry with exponential backoff, circuit breaking, compression, header rewriting, IP allowlists, redirects, prefix stripping. Name one in an annotation, or chain several into a named pipeline and name that.'],
  ['Routes change without a restart', 'Edit an Ingress and the routing table follows — no reload, no dropped connection. A backend that stops answering health checks is taken out of rotation and put back when it recovers.'],
  ['It can serve the files itself', 'The static middleware serves a site export straight from disk or from object storage — pricing.html, docs/index.html, hashed asset chunks, a 404 page. A SPA or a docs bundle needs no pod of its own.'],
  ['One binary, on the port', 'No runtime dependencies. It runs in host-network mode and binds 80 and 443 directly, with every Linux capability dropped except the one that lets it.'],
];

/* The six as a fanned hand: the chosen card comes to the front, the rest stay fanned behind it. */
function Hand() {
  const [at, setAt] = useState(0);
  const [ref, live] = useLive(0.4);
  const [mine, setMine] = useState(false);
  useEffect(() => {
    if (!live || mine) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % FACTS.length), 4200);
    return () => clearTimeout(t);
  }, [at, live, mine]);
  const pick = (i) => { setAt(i); setMine(true); };
  return (
    <section className="x-sec ig-hand-sec" ref={ref} data-room="dark">
      <div className="x-wrap">
        <div className="ig-hand-h">
          <Rise as="h2">What happens at the edge</Rise>
          <div className="ig-nav">
            <span className="x-mono">{String(at + 1).padStart(2, '0')} / 06</span>
            <button type="button" aria-label="Previous" onClick={() => pick((at + 5) % 6)}>←</button>
            <button type="button" aria-label="Next" onClick={() => pick((at + 1) % 6)}>→</button>
          </div>
        </div>
        <div className="ig-hand">
          {FACTS.map(([t, d], i) => {
            const off = (i - at + 6) % 6;
            return (
              <motion.article key={t} className={'ig-card' + (off === 0 ? ' top' : '')} onClick={() => pick(i)} animate={{ x: off * 28, y: off * -10, rotate: off * 2.2, scale: 1 - off * 0.04, zIndex: 10 - off, opacity: off > 3 ? 0 : 1 }} transition={{ type: 'spring', stiffness: 220, damping: 28 }} aria-hidden={off !== 0}>
                <span className="ig-card-n">{String(i + 1).padStart(2, '0')} / 06</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const MW = ['rate limiting', 'retry', 'circuit breaking', 'compression', 'header rewriting', 'IP allowlists', 'redirects', 'prefix stripping'];

/* Chain your own: pick middleware, drag to reorder; the request walks the chain again on every change. */
function Pipeline() {
  const [chain, setChain] = useState(['IP allowlists', 'rate limiting', 'retry']);
  const toggle = (m) => setChain((c) => (c.includes(m) ? c.filter((x) => x !== m) : [...c, m]));
  const move = (i, d) => setChain((c) => { const n = [...c]; [n[i], n[i + d]] = [n[i + d], n[i]]; return n; });
  return (
    <section className="x-sec ig-pipe">
      <div className="x-wrap ig-pipe-grid">
        <div>
          <p className="x-kick">Middleware you compose by annotation</p>
          <h2>Chain your own pipeline</h2>
          <p className="ig-pipe-l">Name one in an annotation, or chain several into a named pipeline and name that.</p>
          <div className="ig-pipe-pick" role="group" aria-label="Middleware">
            {MW.map((m) => <button key={m} type="button" aria-pressed={chain.includes(m)} onClick={() => toggle(m)}>{m}</button>)}
          </div>
        </div>
        <div className="ig-pipe-run">
          <p className="ig-pipe-end">request</p>
          <Reorder.Group as="ol" axis="y" values={chain} onReorder={setChain} className="ig-pipe-chain" data-swipe-own="">
            {chain.map((m, i) => (
              <Reorder.Item as="li" key={m} value={m} data-cursor="Drag" whileDrag={{ scale: 1.03, boxShadow: '0 18px 40px -18px rgba(0,0,0,.35)' }}>
                <span className="x-mono">{String(i + 1).padStart(2, '0')}</span>{m}
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
    <main className="ig">
      <Hero
        kick="hanzoai/ingress"
        title="Hanzo Ingress"
        sub="The entry point of a Kubernetes cluster"
        acts={[['View on GitHub', 'https://github.com/hanzoai']]}
      >
        <Table />
      </Hero>
      <Hand />
      <Pipeline />
      <section className="x-sec ig-paste">
        <div className="x-wrap">
          <Rise as="h2" className="ig-start">Get started with Hanzo Ingress</Rise>
          <Paste name="Ingress" prompt="Read https://hanzo.ai/skill.md and use Hanzo Ingress in my project. Start with: hanzo ingress routes list" />
        </div>
      </section>
      <Get name="Ingress" tag="K8s ingress + static plugin" />
    </main>
  );
}
