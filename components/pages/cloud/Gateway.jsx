'use client';
/* Gateway. Signature: the gate, running. Requests arrive from the left carrying a token and a forged identity header;
   at the gate the token is checked, the forged headers are torn off and the real identity is stamped on from the
   verified claims, then the request goes on to Hanzo Cloud. A token bucket drains with each one, and when it is empty
   the next caller gets a 429 with a Retry-After. Below, the six rules are read with a sticky panel that shows the rule
   at work, and the example console keeps the live page's project list. Beyond: "Forge one yourself" - build a request
   (a JWT, an opaque API key or nothing, plus whichever identity headers you want to fake) and see what the service
   behind the gate receives under Hanzo's two rules. Every word and link is Hanzo's; header values are examples. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A } from '../../kit';
import { Hero, Paste, Related, Get, Console, useLive } from './Frame';
import './Gateway.css';

const CALLERS = ['payments-api', 'checkout-web', 'docs-site', 'payments-api', 'checkout-web', 'docs-site'];

/* One request through the gate: arrive, check, strip, stamp, forward (or 429 when the bucket is empty). */
function Gate() {
  const [ref, live] = useLive(0.3);
  const [n, setN] = useState(0);
  const [phase, setPhase] = useState(0); // 0 arrive, 1 token checked, 2 forged stripped, 3 stamped, 4 forwarded
  const [bucket, setBucket] = useState(4);
  const limited = bucket === 0;
  useEffect(() => {
    if (!live) return;
    const steps = limited ? [700, 1300, 1400] : [700, 800, 800, 900, 900];
    if (phase >= steps.length) {
      const t = setTimeout(() => { setN((v) => v + 1); setPhase(0); setBucket((b) => (b === 0 ? 4 : b - 1)); }, 200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPhase((p) => p + 1), steps[phase]);
    return () => clearTimeout(t);
  }, [phase, live, limited]);
  const who = CALLERS[n % CALLERS.length];
  return (
    <div className="gw-gate" ref={ref} aria-hidden="true">
      <div className="gw-lanes">
        <span className="gw-from">client</span>
        <span className="gw-to">Hanzo Cloud <b>/v1</b></span>
      </div>
      <div className="gw-wall"><i /><span>Gateway</span></div>
      <ul className="gw-queue">{[1, 2, 3].map((k) => <li key={n + k}>{CALLERS[(n + k) % CALLERS.length]}</li>)}</ul>
      <ul className="gw-done">
        <AnimatePresence initial={false}>
          {Array.from({ length: Math.min(3, n) }).map((_, k) => {
            const m = n - 1 - k;
            return <motion.li key={m} layout initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1 - k * 0.28, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}><b>{CALLERS[m % CALLERS.length]}</b><span className={m % 5 === 4 ? 'x' : ''}>{m % 5 === 4 ? '429' : 'X-Org-Id ✓'}</span></motion.li>;
          })}
        </AnimatePresence>
      </ul>
      <div className="gw-bucket">
        <p>Token bucket</p>
        <div>{[0, 1, 2, 3].map((i) => <motion.i key={i} animate={{ opacity: i < bucket ? 1 : 0.12, scale: i < bucket ? 1 : 0.7 }} transition={{ type: 'spring', stiffness: 400, damping: 24 }} />)}</div>
      </div>
      <AnimatePresence>
        <motion.div
          key={n}
          className="gw-track"
          initial={{ x: '-62%', opacity: 0 }}
          animate={limited
            ? { x: phase >= 1 ? '-21%' : '-34%', opacity: 1 }
            : { x: phase >= 4 ? '40%' : phase >= 1 ? '0%' : '-34%', opacity: phase >= 4 ? 0 : 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.75, ease: EASE }}
        >
        <div className={'gw-req' + (limited ? ' limited' : '')}>
          <p className="gw-req-line"><b>GET</b> api.hanzo.ai/v1/…</p>
          <p className={'gw-h jwt' + (phase >= 1 && !limited ? ' ok' : '')}>Authorization: Bearer <em>JWT</em>{phase >= 1 && !limited && <motion.span className="gw-ok" initial={{ scale: 0 }} animate={{ scale: 1 }}>✓ JWKS</motion.span>}</p>
          <AnimatePresence>
            {(phase < 2 || limited) && (
              <motion.p className="gw-h forged" exit={{ opacity: 0, y: 26, rotate: -6, transition: { duration: 0.45, ease: [0.4, 0, 1, 1] } }}>X-Org-Id: <em>anything</em></motion.p>
            )}
          </AnimatePresence>
          {!limited && phase >= 3 && (
            <motion.div className="gw-stamp" initial={{ opacity: 0, scale: 1.3 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 22 }}>
              <p className="gw-h set">X-User-Id <em>← sub</em></p>
              <p className="gw-h set">X-Org-Id <em>← owner</em></p>
              <p className="gw-h set">X-Roles <em>← roles</em></p>
            </motion.div>
          )}
          {limited && phase >= 1 && (
            <motion.p className="gw-429" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>429 · Retry-After</motion.p>
          )}
          <span className="gw-who">{who}</span>
        </div>
        </motion.div>
      </AnimatePresence>
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

/* What each rule looks like at work: drawn from that rule's own words. */
function Proof({ i }) {
  const rows = [
    [['JWT', 'JWKS ✓', 'ok'], ['API key', 'to its issuer', '']],
    [['X-User-Id', 'stripped → sub', 'ok'], ['X-Org-Id', 'stripped → owner', 'ok'], ['X-Roles', 'stripped → roles', 'ok'], ['X-IAM-*', 'stripped', 'x']],
    [['api.hanzo.ai/*', 'Hanzo Cloud', 'ok'], ['/v1 mount table', 'Hanzo Cloud', '']],
    [['client IP', 'bucket', 'ok'], ['the edge', 'bucket', 'ok'], ['empty', '429 · Retry-After', 'x']],
    [['health', 'process up', 'ok'], ['backends', 'dialed lazily', '']],
    [['own service', 'one hop', ''], ['inside the cloud binary', 'no hop', 'ok']],
  ][i];
  return (
    <motion.div key={i} className="gw-proof-in" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10, transition: { duration: 0.18 } }} transition={{ duration: 0.45, ease: EASE }}>
      <p className="gw-proof-n">{String(i + 1).padStart(2, '0')}</p>
      <ul>
        {rows.map(([a, b, k], j) => (
          <motion.li key={a} className={k} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease: EASE, delay: 0.1 + j * 0.06 }}>
            <span>{a}</span><i /><b>{b}</b>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

function Rule({ i, t, d, onLit }) {
  const ref = useRef(null);
  const lit = useInView(ref, { margin: '-45% 0px -45% 0px' });
  useEffect(() => { if (lit) onLit(i); }, [lit, i, onLit]);
  return (
    <li ref={ref} className={'gw-rule' + (lit ? ' lit' : '')}>
      <span className="gw-rule-n">{String(i + 1).padStart(2, '0')}</span>
      <div><h3>{t}</h3><p>{d}</p></div>
    </li>
  );
}

function Rules() {
  const [at, setAt] = useState(0);
  return (
    <section className="x-sec gw-rules">
      <div className="x-wrap">
        <header className="gw-rules-h">
          <Rise as="h2">Nothing downstream has to ask who is calling</Rise>
          <Rise as="p" delay={0.1}>Gateway answers that once, at the edge, so every service behind it can read an org id and believe it.</Rise>
        </header>
        <div className="gw-rules-grid">
          <div className="gw-proof" aria-hidden="true"><AnimatePresence mode="wait"><Proof i={at} /></AnimatePresence></div>
          <ol className="gw-rule-list">{RULES.map(([t, d], i) => <Rule key={t} i={i} t={t} d={d} onLit={setAt} />)}</ol>
        </div>
      </div>
    </section>
  );
}

const FAKE = [['X-User-Id', 'sub'], ['X-Org-Id', 'owner'], ['X-Roles', 'roles'], ['X-IAM-*', '']];
const CRED = ['JWT', 'API key', 'None'];

/* Forge one yourself: what you send, and what the service behind the gate receives. */
function Forge() {
  const [cred, setCred] = useState(0);
  const [fake, setFake] = useState([true, true, false, false]);
  const jwt = cred === 0;
  return (
    <section className="x-sec gw-forge">
      <div className="x-wrap">
        <p className="x-kick">Identity headers are written, not trusted</p>
        <h2 className="gw-forge-h">Forge one yourself</h2>
        <div className="gw-forge-grid">
          <div className="gw-forge-in">
            <p className="gw-forge-k">You send</p>
            <div className="gw-forge-pick" role="radiogroup" aria-label="Credential">
              {CRED.map((c, i) => <button key={c} type="button" role="radio" aria-checked={cred === i} onClick={() => setCred(i)}>{c}</button>)}
            </div>
            <ul className="gw-forge-hs">
              {cred < 2 && <li className="gw-forge-auth">Authorization: Bearer <em>{jwt ? 'JWT' : 'API key'}</em></li>}
              {FAKE.map(([h], i) => (
                <li key={h}><label><input type="checkbox" checked={fake[i]} onChange={() => setFake((f) => f.map((v, k) => (k === i ? !v : v)))} /> {h}: <em>anything</em></label></li>
              ))}
            </ul>
          </div>
          <div className="gw-forge-out" aria-live="polite">
            <p className="gw-forge-k">The service behind it receives</p>
            <ul className="gw-forge-hs">
              {FAKE.map(([h], i) => fake[i] && <li key={h} className="gone">{h}: anything <span>stripped</span></li>)}
              {jwt && FAKE.filter(([, c]) => c).map(([h, c]) => <li key={'w' + h} className="set">{h} <em>← {c}</em></li>)}
            </ul>
            <p className="gw-forge-why">{jwt
              ? "A JWT is validated against Hanzo IAM's JWKS before anything else reads the request, then the headers are written back from the verified claims — sub, owner, roles."
              : cred === 1
                ? "Opaque API keys aren't JWTs, so they go on to the service that issued them and it decides."
                : 'With no verified claims, nothing is written back. A curl flag can\'t set them.'}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Gateway() {
  const icon = <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 2v4M8 6 4 10M8 6l4 4M4 10v4M12 10v4" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>;
  return (
    <main className="gw">
      <Hero
        dark
        kick="api.hanzo.ai"
        icon={icon}
        title="Hanzo Gateway"
        sub="The trust boundary in front of the API"
        acts={[['Read the docs', 'https://docs.hanzo.ai/docs/projects/hanzoai/gateway'], ['View on GitHub', 'https://github.com/hanzoai']]}
      >
        <Gate />
      </Hero>
      <section className="gw-proj">
        <div className="x-wrap gw-proj-grid">
          <div>
            <p className="x-kick">Example project</p>
            <p className="gw-proj-l">Example project. Every name in it is one you would give your own.</p>
          </div>
          <div><Console name="Gateway" api="/v1/gateway" side={[['Gateway', '/gateway'], ['DNS', '/dns'], ['Service Mesh', '/cloud/service-mesh'], ['Nodes', '/cloud/nodes']]} /></div>
        </div>
      </section>
      <Rules />
      <Forge />
      <section className="x-sec gw-paste">
        <div className="x-wrap">
          <Paste name="Gateway" api="/v1/gateway" prompt="Read https://hanzo.ai/skill.md and use Hanzo Gateway in my project. Start with: hanzo gateway config get" />
          <Related className="gw-rel" items={[['Gateway docs →', 'https://docs.hanzo.ai/docs/projects/hanzoai/gateway'], ['DNS', '/dns', 'Authoritative DNS + DNSSEC'], ['Service Mesh', '/cloud/service-mesh'], ['Nodes', '/cloud/nodes']]} />
        </div>
      </section>
      <Get name="Gateway" tag="API gateway" self="https://docs.hanzo.ai/docs/projects/hanzoai/gateway" />
    </main>
  );
}
