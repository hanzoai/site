'use client';
// Persona: an engineer moving secrets out of files and repos.
// Goal: see a secret sealed on the client, rotated deliberately and every read recorded.
// CTA: Open KMS (kms.hero, kms.mid, kms.close).
// Metric: cta_click kms.hero
// Signature: a secret, sealed and rotated: the vault seals, rotates, refuses a stale writer and records the read.
// Beyond: Seal one yourself: real AES-256-GCM under an HKDF-SHA256 key in the browser.
/* KMS (v2, archetype A Launch).
   V2: 8/10 Round 2: the vault holds one height through its loop (fixed version stack and log, rows slide by transform,
   no layout re-flow) and tilts 2.5 degrees to a fine pointer; "What it holds" pins a rule panel that redraws per rule
   (seal chain, kms run, refused write, the agent's read, the clients, will not boot) with a masked 01 / 06 caption,
   rows hover-fill and take the panel, 44svh each; captions moved under their headings; the dark room opens from a
   rounded card, its one big figure is "Every read recorded" and the rest count in small; GitHub is a text link.
   Signature: a secret, sealed and rotated. DATABASE_PASSWORD goes through Hanzo's chain (Argon2id, HKDF-SHA256,
   AES-256-GCM) and comes out as ciphertext; then it is rotated - each write names the version it replaces, so a second
   writer holding the old version is refused - and the read lands in the append-only record under the agent's name.
   Supporting: kinetic title lines; the vault settles on scroll (Stage); the six rules scroll past one pinned panel that
   redraws for the rule you are reading; the dark room opens from a card as it is reached.
   Beyond: "Seal one yourself" - type a value and your browser seals it with AES-256-GCM under a key derived with
   HKDF-SHA256 (WebCrypto), so you watch the ciphertext and the key never leaves the page; Argon2id, the passphrase step,
   is named but not run here, and that is said.
   Greys only, from Hanzo's deck. Every word and link is Hanzo's. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { A, Cta, CodeBlock } from '../../kit';
import { Console, useLive } from './Frame';
import { Lines, Lift } from '../../v2/LiftStage';
import GetIt from '../../v2/GetIt';
import LivePause, { usePause } from '../../v2/LivePause';
import '../../v2/v2scale.css';
import './Kms.css';

const EASE = [0.16, 1, 0.3, 1];
const CHAIN = ['Argon2id', 'HKDF-SHA256', 'AES-256-GCM'];
const HEX = '0123456789abcdef';
const noise = (n, s) => Array.from({ length: n }, (_, i) => HEX[(s * 31 + i * 17 + ((s + i) * (i + 3)) % 13) % 16]).join('');
const ROW = 60; // one version row (52px) plus its 8px gap

/* The version stack: three rows that slide by transform inside a fixed box, so the vault never changes height. */
function Versions({ v, top }) {
  // every version that can show stays mounted; each slides to its slot (above the box, 0, 1, 2, below the box)
  const rows = [top, top - 1, top - 2, top - 3];
  return (
    <div className="km-vers-in">
      {rows.map((n) => {
        const i = v - n;
        const shown = i >= 0 && i <= 2;
        return (
          <motion.div
            key={n}
            className={'km-ver' + (i === 0 ? ' cur' : '')}
            initial={false}
            animate={{ y: i * ROW, opacity: shown ? 1 - i * 0.3 : 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <b>v{n}</b><span>{noise(10, n)}</span>{i === 0 && <em>current</em>}
          </motion.div>
        );
      })}
    </div>
  );
}

/* The vault: seal, rotate, refuse a stale writer, record the read. */
function Vault() {
  const [ref, seen, calm] = useLive(0.3);
  const [paused, togglePause] = usePause();
  const live = seen && !paused;
  const [t, setT] = useState(0); // 0..3 sealing, 4 rotated, 5 stale writer refused, 6 read recorded
  const ver = 3;
  useEffect(() => { if (calm) setT(6); }, [calm]);
  useEffect(() => {
    if (calm || !live) return;
    const id = setTimeout(() => {
      if (t === 6) setT(0); else setT(t + 1);
    }, [1000, 900, 900, 1000, 1600, 1800, 2400][t]);
    return () => clearTimeout(id);
  }, [t, live, calm]);
  const sealed = t >= 3;
  const v = t >= 4 ? ver + 1 : ver;
  // pointer: the card leans up to 2.5 degrees toward a mouse (never on touch, never under reduced motion)
  const lean = (e) => {
    if (calm || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.setProperty('--km-ry', (px * 5).toFixed(2) + 'deg');
    e.currentTarget.style.setProperty('--km-rx', (-py * 5).toFixed(2) + 'deg');
  };
  const rest = (e) => { e.currentTarget.style.setProperty('--km-ry', '0deg'); e.currentTarget.style.setProperty('--km-rx', '0deg'); };
  return (
    <div className="lp-host km-tilt" onPointerMove={lean} onPointerLeave={rest}>
    <LivePause paused={paused} onToggle={togglePause} className="km-pause" />
    <div className="km-vault" ref={ref} aria-hidden="true">
      <div className="km-secret">
        <p className="km-host">kms.hanzo.ai</p>
        <p className="km-path">DATABASE_PASSWORD <span>production</span></p>
        <p className={'km-val' + (sealed ? ' sealed' : '')}>{sealed ? noise(32, v) : '••••••••••••••••'}</p>
        <div className="km-chain">
          {CHAIN.map((c, i) => <span key={c} className={t > i ? 'on' : ''}><i />{c}</span>)}
        </div>
        <p className="km-client">the organization key stays on the client</p>
      </div>
      <div className="km-side">
        <div className="km-vers">
          <Versions v={v} top={ver + 1} />
          <AnimatePresence>
            {t === 5 && (
              <motion.div className="km-stale" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}>
                write replaces v{v - 1} · <b>refused</b>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <ul className="km-log">
          {t >= 6 && <li key={'r' + ver} className="in"><i className="a" />read · agent checkout-web</li>}
          {t >= 4 && <li key={'w' + ver} className="in"><i />rotate · v{v}</li>}
          <li><i />read · payments-api</li>
        </ul>
      </div>
    </div>
    </div>
  );
}

/* Beyond: seal one yourself (WebCrypto: HKDF-SHA256 then AES-256-GCM; the key is random and never leaves). */
const b64 = (u8) => btoa(String.fromCharCode(...u8));
function Seal() {
  const [val, setVal] = useState('');
  const [out, setOut] = useState({ ct: '' });
  const [err, setErr] = useState('');
  const master = useRef(null);
  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const S = crypto.subtle;
        if (!master.current) master.current = await S.importKey('raw', crypto.getRandomValues(new Uint8Array(32)), 'HKDF', false, ['deriveKey']);
        const key = await S.deriveKey({ name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(16), info: new TextEncoder().encode('organization') }, master.current, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const ct = new Uint8Array(await S.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(val)));
        if (on) setOut({ ct: b64(ct) });
      } catch { if (on) setErr('—'); } // no WebCrypto: an em dash, not a sentence of our own
    })();
    return () => { on = false; };
  }, [val]);
  return (
    <section className="v2-sec km-seal">
      <div className="v2-wrap v2-grid">
        <div className="km-seal-l">
          <h2 className="v2-headline">Sealed on your machine</h2>
          <p className="v2-body km-seal-d">The organization key stays on the client.</p>
        </div>
        <div className="km-seal-box v2-obj">
          <label className="km-seal-k" htmlFor="km-in">DATABASE_PASSWORD</label>
          <input id="km-in" value={val} onChange={(e) => setVal(e.target.value)} maxLength={200} spellCheck={false} autoComplete="off" suppressHydrationWarning />
          <div className="km-seal-chain" aria-hidden="true">
            <span className="off">Argon2id</span><i /><span>HKDF-SHA256</span><i /><span>AES-256-GCM</span>
          </div>
          <p className="km-ct" aria-live="polite">{err || out.ct}</p>
        </div>
      </div>
    </section>
  );
}

const RULES = [
  ['Sealed before it leaves you', "Argon2id turns a passphrase into a key, HKDF-SHA256 turns that into the organization's key, and AES-256-GCM seals the value. The organization key stays on the client. Sharing with a colleague wraps that same key to their public key using a hybrid post-quantum exchange, so nobody has to send anybody a secret to share one."],
  ['Into the process, not into a file', 'Run a command with the secrets already in its environment, export a dotenv when a tool insists on one, or let the Kubernetes operator keep a Secret in step with what KMS holds. The CLI also reads your repository and its git history looking for values that escaped.'],
  ['Replacing one is deliberate', 'Rotate is a command, and a write states the version it means to replace — so a second writer who read the old value is refused rather than quietly winning. Signing keys generate, sign and rotate through the same API, backed by threshold MPC.'],
  ['Who read it, when, and why', "Reads and writes land in an append-only record written by a single writer off the request path, so keeping it never slows a fetch. An AI agent's read is attributed to that agent by name, not to whichever human's key it borrowed."],
  ['One key, several languages', 'A CLI for a laptop and for CI. SDKs in Go, Node and Python over the same routes. In-cluster callers can take the binary ZAP transport instead of HTTP, and it enforces the identical token and role checks.'],
  ['Fail closed, or do not start', 'Every call carries a Hanzo IAM token verified against a cached JWKS; HMAC and alg none are refused outright. The organization comes from the verified token, never from a field the caller sets. Outside development the daemon will not boot without an issuer, an audience and a JWKS URL — there is no accidental open mode. A secret can be marked so that any agent read waits for a person to approve it, or is refused.'],
];

/* One rule as a picture, built from the vault's own parts and the rule's own words. Lines arrive one by one. */
function Scene({ i }) {
  const L = (k, cls, body) => <p key={k} className={'km-sc-l ' + (cls || '')} style={{ '--d': k }}>{body}</p>;
  const pages = [
    [
      <div key="c" className="km-sc-chain">{CHAIN.map((c, k) => <span key={c} style={{ '--d': k }}><i />{c}</span>)}</div>,
      L(3, 'q', 'the organization key stays on the client'),
    ],
    [
      L(0, 'cmd', <><span className="km-sc-pr">$</span>kms run -- npm start</>),
      L(1, 'env', <>DATABASE_PASSWORD<b>=••••••••</b></>),
      L(2, 'q', 'kms export --format=dotenv'),
    ],
    [
      L(0, 'ver cur', <><b>v4</b>{noise(10, 4)}<em>current</em></>),
      L(1, 'ver', <><b>v3</b>{noise(10, 3)}</>),
      L(2, 'stale', <>write replaces v3 · <b>refused</b></>),
    ],
    [
      L(0, 'log', <><i />read · payments-api</>),
      L(1, 'log', <><i />rotate · v4</>),
      L(2, 'log on', <><i className="a" />read · agent checkout-web</>),
    ],
    [
      <div key="k" className="km-sc-chips">{['CLI', 'Go', 'Node', 'Python', 'ZAP'].map((c, k) => <span key={c} style={{ '--d': k }}>{c}</span>)}</div>,
      L(5, 'q', 'kms.hanzo.ai'),
    ],
    [
      L(0, 'chk', <><i />issuer</>),
      L(1, 'chk', <><i />audience</>),
      L(2, 'chk', <><i />JWKS URL</>),
      L(3, 'stop', <>daemon · <b>will not boot</b></>),
    ],
  ];
  return <div className={'km-sc km-sc-' + i}>{pages[i]}</div>;
}

/* The caption under the panel: the rule number cuts in through a mask, never two digits over each other. */
function Roll({ to }) {
  const t = String(to).padStart(2, '0');
  return (
    <span className="km-roll">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={t} initial={{ y: '105%' }} animate={{ y: '0%' }} exit={{ y: '-105%' }} transition={{ duration: 0.4, ease: EASE }}>{t}</motion.span>
      </AnimatePresence>
    </span>
  );
}

function Rule({ i, t, d, on, onAt }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.35 }); // phones: the rule's picture draws when it is reached
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && onAt(i), { rootMargin: '-45% 0px -45% 0px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [i, onAt]);
  return (
    <li ref={ref} className={'km-rule' + (on ? ' on' : '') + (seen ? ' seen' : '')} onPointerEnter={(e) => e.pointerType === 'mouse' && onAt(i)}>
      <span className="km-rule-n">{String(i + 1).padStart(2, '0')}</span>
      <h3 className="v2-headline">{t}</h3>
      <p className="v2-body">{d}</p>
      <div className="km-rule-pic" aria-hidden="true"><Scene i={i} /></div>
    </li>
  );
}

function Holds() {
  const [at, setAt] = useState(0);
  const [lap, setLap] = useState(0); // the panel redraws its rule each time the hairline finishes crossing
  const onAt = useCallback((i) => setAt(i), []);
  return (
    <section className="v2-sec km-holds">
      <div className="v2-wrap v2-grid">
        <div className="km-holds-l">
          <div className="km-pin">
            <h2 className="v2-title km-holds-h">What it holds and how it holds it</h2>
            <p className="v2-body km-holds-lede">A secret is a value under a path, a name and an environment, inside one organization. That is the whole model.</p>
            <div className="km-panel" aria-hidden="true">
              <p className="km-panel-h">DATABASE_PASSWORD <span>production</span></p>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div key={at} className="km-panel-b" initial={{ clipPath: 'inset(0% 0% 100% 0%)' }} animate={{ clipPath: 'inset(0% 0% 0% 0%)' }} exit={{ clipPath: 'inset(100% 0% 0% 0%)' }} transition={{ duration: 0.4, ease: EASE }}>
                  <Scene key={lap} i={at} />
                </motion.div>
              </AnimatePresence>
              <i key={'run' + at} className="km-panel-run" onAnimationIteration={() => setLap((n) => n + 1)} />
            </div>
            <p className="km-num" aria-hidden="true"><Roll to={at + 1} /><span className="km-num-of">/ 06</span></p>
          </div>
        </div>
        <ol className="km-rules">
          {RULES.map(([t, d], i) => <Rule key={t} i={i} t={t} d={d} on={at === i} onAt={onAt} />)}
        </ol>
      </div>
    </section>
  );
}

const FIGS = [['AES-256', 'Sealed on your machine'], ['K8s', 'Secrets kept in step'], ['Every read recorded', ''], ['MIT', 'Run it yourself']];
const CLI = `# Sign in, then point this directory at a path
kms login
kms init
# Start the process with its secrets already in the environment
kms run -- npm start
# ...or write a dotenv, for a tool that insists on one
kms export --format=dotenv
# Replace a value
kms rotate DATABASE_PASSWORD
# Find the ones that already escaped, here and in git history
kms scan`;

/* The dark room: enters as a rounded card inside the gutters and opens to full width as it is reached. */
function Disk() {
  const ref = useRef(null);
  const figs = useRef(null);
  const calm = useReducedMotion();
  const counted = useInView(figs, { once: true, amount: 0.4 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.2'] });
  const clip = useTransform(scrollYProgress, (p) => {
    const k = 1 - Math.min(1, Math.max(0, p));
    return `inset(0px calc(var(--km-gut) * ${k.toFixed(3)}) round ${(24 * k).toFixed(1)}px)`;
  });
  return (
    <motion.section ref={ref} className="km-disk v2-dark" data-room="dark" style={calm ? undefined : { clipPath: clip }}>
      <div className="v2-wrap">
        <ul ref={figs} className={'km-figs' + (counted ? ' on' : '')}>
          {FIGS.map(([a, b], i) => <li key={a} className={b ? '' : 'big'} style={{ '--d': i }}><b><span>{a}</span></b>{b && <span>{b}</span>}</li>)}
        </ul>
        <div className="km-disk-g">
          <div className="km-disk-l">
            <h2 className="v2-display s">Nothing lands on disk</h2>
            <h3 className="v2-title km-out-h">Take them out of the repo</h3>
            <p className="v2-body">Use it hosted, or run the same binary yourself. The source is MIT and the client is where the encryption happens either way.</p>
            <div className="v2-acts"><Cta to="https://kms.hanzo.ai" id="kms.mid">Open KMS</Cta><Cta to="https://github.com/hanzoai/kms" kind="link" id="kms.view-on-github">View on GitHub</Cta></div>
          </div>
          <CodeBlock code={CLI} label="terminal" className="km-cli" />
        </div>
      </div>
    </motion.section>
  );
}

/* The tail as one KMS screen: the example project's console on the left with the vault's own secret under it, the
   agent prompt on the right, the related links as one hairline row under both. The secret strip follows the console:
   hover, click or Enter on a project and the strip shows that service reading DATABASE_PASSWORD v4 (the same version
   and fingerprint the vault rotated to); left alone it steps through the projects by pressing the console's own rows. */
const SVC = ['gateway', 'payments-api', 'checkout-web', 'docs-site'];
const SIDE = [['KMS', '/kms'], ['IAM', '/iam'], ['Authz', '/authz'], ['Secrets', '/cloud/secrets'], ['Audit', '/cloud/audit'], ['Zero Trust', '/cloud/zero-trust']];
const RELATED = [['IAM', '/iam', 'OIDC identity & orgs'], ['Authz', '/authz', 'Fine-grained access'], ['Secrets', '/cloud/secrets', 'Store once, sync everywhere']];
const PROMPT = 'Read https://hanzo.ai/skill.md and use Hanzo KMS in my project. Start with: hanzo kms secrets create';
const arrow = <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

function Ship() {
  const wrap = useRef(null);
  const [ref, live, calm] = useLive(0.4);
  const [paused, togglePause] = usePause();
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false); // once the hand has chosen a project, the strip stops stepping
  const [hold, setHold] = useState(false); // a mouse over the console holds the step
  const run = live && !paused && !mine && !hold;
  const follow = (e, chose) => {
    const li = e.target.closest && e.target.closest('li[role="option"]');
    if (!li || !wrap.current || !wrap.current.contains(li)) return;
    const i = SVC.indexOf(li.querySelector('.cf-name')?.textContent);
    if (i < 0) return;
    setAt(i);
    if (chose && e.nativeEvent.isTrusted) setMine(true);
  };
  useEffect(() => {
    if (!run) return;
    const id = setTimeout(() => {
      const n = (at + 1) % SVC.length;
      const rows = wrap.current ? wrap.current.querySelectorAll('li[role="option"]') : [];
      if (rows[n]) rows[n].click(); // the console's own row takes the highlight (an untrusted click: no sound)
      setAt(n);
    }, 2600);
    return () => clearTimeout(id);
  }, [at, run]);
  const svc = SVC[at];
  return (
    <section className="v2-sec km-ship">
      <div className="v2-wrap km-ship-g">
        <div className="km-ship-c" ref={ref}>
          <div
            ref={wrap}
            className="km-ship-con"
            onMouseOver={(e) => follow(e, false)}
            onClick={(e) => follow(e, true)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && follow(e, true)}
            onPointerEnter={(e) => e.pointerType === 'mouse' && setHold(true)}
            onPointerLeave={() => setHold(false)}
          >
            <Console light name="KMS" api="/v1/kms" cap="The service the session above is changing." side={SIDE} />
          </div>
          <div className="km-key">
            <LivePause paused={paused} onToggle={togglePause} dark inline className="km-key-pause" />
            <div className="km-key-in" aria-hidden="true">
              <span className="km-key-name">DATABASE_PASSWORD<em>production</em></span>
              <span className="km-key-v"><b>v4</b>{noise(10, 4)}</span>
              <span className="km-key-read">
                <i />
                <span className="km-roll km-key-roll">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span key={svc} initial={{ y: '105%' }} animate={{ y: '0%' }} exit={{ y: '-105%' }} transition={{ duration: 0.4, ease: EASE }}>
                      {svc}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </span>
            </div>
            {!calm && <i key={'run' + at + (run ? 'r' : 'h')} className={'km-key-run' + (run ? '' : ' held')} aria-hidden="true" />}
          </div>
          <div className="km-ship-cap">
            <p className="v2-title">Example project. Every name in it is one you would give your own.</p>
            <p className="v2-kick acc km-cap">Example project</p>
          </div>
        </div>
        <div className="km-ship-p">
          <h2 className="v2-headline km-ship-h">Paste and ship</h2>
          <p className="v2-body">Paste this into any agent. It reads the skill manifest and calls KMS from there.</p>
          <p className="km-api"><i>api</i>/v1/kms</p>
          <CodeBlock code={PROMPT} label="Agent prompt" className="km-prompt" />
        </div>
        <nav className="km-rel" aria-label="Related capabilities">
          <p className="v2-kick">Related capabilities</p>
          <ul>
            {RELATED.map(([t, to, d]) => (
              <li key={t}><A to={to} className="km-rel-a"><b>{t}</b><span>{d}</span>{arrow}</A></li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}

export default function Kms() {
  return (
    <main className="v2 km">
      <section className="km-hero">
        <div className="v2-wrap km-hero-t">
          <Lines as="h1" className="v2-display km-h1" lines={['Hanzo KMS']} data-morph-target="" />
          <div className="km-hero-row">
            <p className="v2-lede km-sub v2-in" style={{ animationDelay: '.3s' }}>Secrets management</p>
            <div className="v2-acts">
              <Cta to="https://kms.hanzo.ai" id="kms.hero" thumb>Open KMS</Cta>
              <Cta to="https://docs.hanzo.ai/docs/openapi/kms/" kind="quiet" id="kms.documentation">Documentation</Cta>
            </div>
          </div>
        </div>
        <Lift className="v2-wrap km-lift" from={1.1} y={40} origin="50% 0%" offset={['start end', 'start 0.25']}>
          <Vault />
        </Lift>
      </section>

      <Seal />

      <Holds />

      <Disk />

      <Ship />

      <GetIt className="km-get" name="KMS" tag="Secrets + key management" seed="kms" data={[256, 3, 6]} repo={['hanzoai/kms', 'https://github.com/hanzoai/kms']} stars="3 stars" ask={['Open KMS', 'https://kms.hanzo.ai', 'kms.close']} />
    </main>
  );
}
