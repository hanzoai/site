'use client';
// Persona: a developer or platform engineer putting a service behind api.hanzo.ai.
// Goal: see in one request that the token is checked once at the edge and identity is written, not trusted.
// CTA: Read the docs (gateway.hero, gateway.close).
// Metric: cta_click gateway.hero
// Signature: the gate, running: one request at a time checked, stripped, stamped or turned away (429) across a full-width lane.
// Beyond: Forge one yourself: pick a credential and fake headers, see what the service behind the gate receives.
/* Gateway (v2, archetype A Launch).
   V2: 8/10 One request at a time checked, stripped, stamped or turned away (429) at the gate across a full-width lane; the six rules pinned beside a request inspector; forge-one-yourself as the dark room; greys only, 52px h1, one ask.
   Signature: the gate, running across the whole screen. One request at a time arrives from the left carrying a token and
   a forged X-Org-Id; at the gate the token is checked against JWKS, the forged header is torn off, the real identity is
   stamped on from the claims and the request walks through to Hanzo Cloud. A token bucket on the gate drains with each
   one, and when it is empty the next caller is turned back with a 429 and a Retry-After.
   Supporting: kinetic title lines; the lane settles from huge into place on scroll (Stage); the six rules as pinned
   chapters whose request inspector changes with each rule.
   Beyond: "Forge one yourself" - build a request (a JWT, an opaque API key or nothing, plus whichever identity headers
   you want to fake) and see what the service behind the gate receives under Hanzo's two rules.
   Greys only (Hanzo's deck). Every word and link is Hanzo's; header values are examples.
   Persona: a developer or platform engineer putting a service behind api.hanzo.ai.
   Goal: see, in one request, that the token is checked once at the edge and identity is written, not trusted.
   CTA: Read the docs (hero, the sticky ask bar and the close; one solid button per screen). */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { A, Cta } from '../../kit';
import { Console, useLive } from './Frame';
import { Lines, Lift } from '../../v2/LiftStage';
import PinChapters from '../../v2/x-hypatia/PinChapters';
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
  const [ref, seen] = useLive(0.25);
  const [paused, togglePause] = usePause();
  const live = seen && !paused;
  const [n, setN] = useState(0);
  const [phase, setPhase] = useState(0);
  const [bucket, setBucket] = useState(4);
  const limited = bucket === 0;
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
    <div className="gw-lane" ref={ref} aria-hidden="true">
      <div className="gw-gate"><span className="gw-gate-k">Gateway</span><i /></div>
      <p className="gw-side l">client</p>
      <p className="gw-side r">Hanzo Cloud <b>/v1</b></p>
      <ul className="gw-queue">{[1, 2, 3].map((k) => <li key={n + k} style={{ opacity: 1 - k * 0.22 }}>{CALLERS[(n + k) % CALLERS.length]}</li>)}</ul>
      <ul className="gw-log">
        <AnimatePresence initial={false}>
          {Array.from({ length: Math.min(3, n) }).map((_, k) => {
            const m = n - 1 - k;
            const no = m % 5 === 4;
            return (
              <motion.li key={m} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1 - k * 0.3, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}>
                <b>{CALLERS[m % CALLERS.length]}</b><span className={no ? 'x' : ''}>{no ? '429' : 'X-Org-Id ✓'}</span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
      <div className="gw-bucket">
        <span>Token bucket</span>
        <div>{[0, 1, 2, 3].map((i) => <motion.i key={i} animate={{ opacity: i < left ? 1 : 0.14, scaleY: i < left ? 1 : 0.5 }} transition={{ duration: 0.3, ease: EASE }} />)}</div>
      </div>
      <AnimatePresence>
        <motion.div
          key={n}
          className="gw-req"
          initial={{ x: '-280%', opacity: 0 }}
          animate={{ x, opacity: gone ? 0 : 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          transition={{ x: { duration: phase === 0 ? 1.0 : 0.95, ease: EASE }, opacity: { duration: gone ? 0.7 : 0.4, delay: gone ? 0.25 : 0 } }}
        >
          <p className="gw-req-top"><b>GET</b> api.hanzo.ai/v1/…<span>{who}</span></p>
          <p className={'gw-h' + (phase >= 1 && !limited ? ' ok' : '')}>Authorization: Bearer <em>JWT</em>
            {phase >= 1 && !limited && <motion.span className="gw-chip" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, ease: EASE }}>✓ JWKS</motion.span>}
          </p>
          <AnimatePresence>
            {(phase < 2 || limited) && (
              <motion.p className="gw-h forged" exit={{ opacity: 0, y: 40, rotate: -8, transition: { duration: 0.5, ease: [0.4, 0, 1, 1] } }}>X-Org-Id: <em>anything</em></motion.p>
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

/* What each rule looks like at work, drawn from that rule's own words. */
const PROOF = [
  [['JWT', 'JWKS ✓', 'ok'], ['API key', 'to its issuer', '']],
  [['X-User-Id', 'stripped → sub', 'ok'], ['X-Org-Id', 'stripped → owner', 'ok'], ['X-Roles', 'stripped → roles', 'ok'], ['X-IAM-*', 'stripped', 'x']],
  [['api.hanzo.ai/*', 'Hanzo Cloud', 'ok'], ['/v1 mount table', 'Hanzo Cloud', '']],
  [['client IP', 'bucket', 'ok'], ['the edge', 'bucket', 'ok'], ['empty', '429 · Retry-After', 'x']],
  [['health', 'process up', 'ok'], ['backends', 'dialed lazily', '']],
  [['own service', 'one hop', ''], ['inside the cloud binary', 'no hop', 'ok']],
];

/* the figure each rule comes down to, in its own words */
const BIG = ['JWKS ✓', 'sub · owner · roles', '/* → Hanzo Cloud', '429 · Retry-After', 'process up', 'no hop'];

function Inspector({ at }) {
  return (
    <div className="gw-insp v2-obj" aria-hidden="true">
      <div className="gw-insp-bar"><span className="gw-insp-dots"><i /><i /><i /></span><span>api.hanzo.ai</span><b>{String(at + 1).padStart(2, '0')}</b></div>
      <div className="gw-insp-body">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={at} className="gw-insp-in" initial="in" animate="on" exit="out" variants={{ out: { opacity: 0, y: -14, transition: { duration: 0.18 } } }}>
            <motion.p className={'gw-big' + (at === 3 ? ' x' : '')} variants={{ in: { opacity: 0, y: 30 }, on: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}>{BIG[at]}</motion.p>
            <ul className="gw-insp-rows">
            {PROOF[at].map(([a, b, k], j) => (
              <motion.li key={a} className={k} variants={{ in: { opacity: 0, y: 22 }, on: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.06 + j * 0.06 } } }}>
                <span className="gw-k">{a}</span>
                <motion.i className="gw-lead" variants={{ in: { scaleX: 0 }, on: { scaleX: 1, transition: { duration: 0.7, ease: EASE, delay: 0.15 + j * 0.06 } } }} />
                <b>{b}</b>
              </motion.li>
            ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const FAKE = [['X-User-Id', 'sub'], ['X-Org-Id', 'owner'], ['X-Roles', 'roles'], ['X-IAM-*', '']];
const CRED = ['JWT', 'API key', 'None'];

/* Beyond: forge one yourself. What you send, and what the service behind the gate receives. */
function Forge() {
  const [cred, setCred] = useState(0);
  const [fake, setFake] = useState([true, true, false, false]);
  const jwt = cred === 0;
  return (
    <section className="gw-forge v2-dark" data-room="dark">
      <div className="v2-wrap">
        <div className="gw-forge-head v2-grid">
          <div className="gw-forge-hl">
            <h2 className="v2-display s">Forge one yourself</h2>
            <p className="v2-kick acc gw-forge-cap">Identity headers are written, not trusted</p>
          </div>
          <div className="gw-forge-pick" role="radiogroup" aria-label="Credential">
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
            <p className="v2-kick">You send</p>
            <ul className="gw-forge-hs">
              {cred < 2 && <li className="gw-forge-auth">Authorization: Bearer <em>{jwt ? 'JWT' : 'API key'}</em></li>}
              {FAKE.map(([h], i) => (
                <li key={h}>
                  <label className="gw-tog">
                    <input type="checkbox" checked={fake[i]} onChange={() => setFake((f) => f.map((v, k) => (k === i ? !v : v)))} />
                    <span className="gw-tog-ui" aria-hidden="true" />
                    <span>{h}: <em>anything</em></span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="gw-arrow" aria-hidden="true"><span>Gateway</span><i /></div>
          <div className="gw-pane out" aria-live="polite">
            <p className="v2-kick">The service behind it receives</p>
            <ul className="gw-forge-hs">
              <AnimatePresence initial={false}>
                {FAKE.map(([h], i) => fake[i] && (
                  <motion.li key={h} className="gone" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>{h}: anything <span>stripped</span></motion.li>
                ))}
                {jwt && FAKE.filter(([, c]) => c).map(([h, c], i) => (
                  <motion.li key={'w' + h} className="set" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE, delay: 0.05 * i }}>{h} <em>← {c}</em></motion.li>
                ))}
              </AnimatePresence>
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
  return (
    <main className="v2 gw">
      <section className="gw-hero">
        <div className="v2-wrap v2-grid gw-hero-top">
          <div className="gw-hero-t">
            <Lines as="h1" className="v2-display gw-h1" lines={['Hanzo', 'Gateway']} data-morph-target="" />
          </div>
          <div className="gw-hero-r">
            <p className="v2-lede gw-sub v2-in" style={{ animationDelay: '.3s' }}>The trust boundary in front of the API</p>
            <div className="v2-acts v2-in" style={{ animationDelay: '.42s' }}>
              <Cta to="https://docs.hanzo.ai/docs/projects/hanzoai/gateway" id="gateway.hero" thumb>Read the docs</Cta>
              <Cta to="https://github.com/hanzoai" kind="quiet" id="gateway.view-on-github">View on GitHub</Cta>
            </div>
          </div>
        </div>
        <Lift className="gw-lift" from={1.08} y={24} origin="50% 30%" offset={['start end', 'start 0.4']}>
          <Lane />
        </Lift>
      </section>

      <section className="v2-sec gw-say">
        <div className="v2-wrap v2-grid">
          <h2 className="v2-display m gw-say-h">Nothing downstream has to ask who is calling</h2>
          <p className="v2-lede gw-say-l">Gateway answers that once, at the edge, so every service behind it can read an org id and believe it.</p>
        </div>
      </section>

      <PinChapters className="gw-ch" label="How Gateway decides" items={RULES} look="right" visual={(at) => <Inspector at={at} />} />

      <ShipPrompt
        name="Gateway"
        api="/v1/gateway"
        prompt="Read https://hanzo.ai/skill.md and use Hanzo Gateway in my project. Start with: hanzo gateway config get"
        related={[['Gateway docs →', 'https://docs.hanzo.ai/docs/projects/hanzoai/gateway'], ['DNS', '/dns', 'Authoritative DNS + DNSSEC'], ['Service Mesh', '/cloud/service-mesh'], ['Nodes', '/cloud/nodes']]}
      />

      <Forge />

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
    </main>
  );
}
