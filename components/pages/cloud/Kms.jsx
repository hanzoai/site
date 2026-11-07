'use client';
// Persona: an engineer moving secrets out of files and repos.
// Goal: see a secret sealed on the client, rotated deliberately and every read recorded.
// CTA: Open KMS (kms.hero, kms.mid, kms.close).
// Metric: cta_click kms.hero
// Signature: a secret, sealed and rotated: the vault seals, rotates, refuses a stale writer and records the read.
// Beyond: Seal one yourself: real AES-256-GCM under an HKDF-SHA256 key in the browser.
/* KMS (v2, archetype A Launch).
   V2: 8/10 A vault seals, rotates, refuses a stale writer and records the read; seal-one-yourself with real AES-256-GCM; rules past a rolling numeral; the CLI in the dark room; greys only, one ask.
   Signature: a secret, sealed and rotated. DATABASE_PASSWORD goes through Hanzo's chain (Argon2id, HKDF-SHA256,
   AES-256-GCM) and comes out as ciphertext; then it is rotated - each write names the version it replaces, so a second
   writer holding the old version is refused - and the read lands in the append-only record under the agent's name.
   Supporting: kinetic title lines; the vault settles on scroll (Stage); the six rules scroll past one pinned numeral
   that rolls to the number of the rule you are reading (01 to 06 only).
   Beyond: "Seal one yourself" - type a value and your browser seals it with AES-256-GCM under a key derived with
   HKDF-SHA256 (WebCrypto), so you watch the ciphertext and the key never leaves the page; Argon2id, the passphrase step,
   is named but not run here, and that is said.
   Accent: gold, from the key. Every word and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { A, Cta, CodeBlock } from '../../kit';
import { Console, useLive } from './Frame';
import { Lines, Lift } from '../../v2/LiftStage';
import ShipPrompt from '../../v2/ShipPrompt';
import GetIt from '../../v2/GetIt';
import LivePause, { usePause } from '../../v2/LivePause';
import '../../v2/v2scale.css';
import './Kms.css';

const EASE = [0.16, 1, 0.3, 1];
const CHAIN = ['Argon2id', 'HKDF-SHA256', 'AES-256-GCM'];
const HEX = '0123456789abcdef';
const noise = (n, s) => Array.from({ length: n }, (_, i) => HEX[(s * 31 + i * 17 + ((s + i) * (i + 3)) % 13) % 16]).join('');

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
  return (
    <div className="lp-host">
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
          <AnimatePresence initial={false}>
            {[v, v - 1, v - 2].map((n, i) => (
              <motion.div key={n} layout className={'km-ver' + (i === 0 ? ' cur' : '')} initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1 - i * 0.3, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
                <b>v{n}</b><span>{noise(10, n)}</span>{i === 0 && <em>current</em>}
              </motion.div>
            ))}
          </AnimatePresence>
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
  const [val, setVal] = useState('correct horse battery staple');
  const [out, setOut] = useState({ ct: '', iv: '' });
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
        if (on) setOut({ ct: b64(ct), iv: b64(iv) });
      } catch { if (on) setErr('This browser cannot seal here.'); }
    })();
    return () => { on = false; };
  }, [val]);
  return (
    <section className="v2-sec km-seal">
      <div className="v2-wrap v2-grid">
        <div className="km-seal-l">
          <p className="v2-kick acc">Sealed before it leaves you</p>
          <h2 className="v2-headline">Seal one yourself</h2>
          <p className="v2-body">Your browser seals what you type with AES-256-GCM, under a key derived with HKDF-SHA256 that never leaves this page. Nothing is sent. KMS starts one step earlier, with Argon2id turning a passphrase into the key; browsers do not offer Argon2id, so here the key is random.</p>
        </div>
        <div className="km-seal-box v2-obj">
          <label className="km-seal-k" htmlFor="km-in">value</label>
          <input id="km-in" value={val} onChange={(e) => setVal(e.target.value)} maxLength={200} spellCheck={false} autoComplete="off" />
          <div className="km-seal-chain" aria-hidden="true">
            <span className="off">Argon2id</span><i /><span>HKDF-SHA256</span><i /><span>AES-256-GCM</span>
          </div>
          <p className="km-seal-k">ciphertext</p>
          <p className="km-ct" aria-live="polite">{err || out.ct}</p>
          <p className="km-seal-k">iv <span>{out.iv}</span></p>
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

/* The pinned numeral: rolls to the number of the rule at the middle of the screen (only 01 to 06, never in-between digits). */
function Roll({ to }) {
  const t = String(to).padStart(2, '0');
  return (
    <span className="km-roll">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={t} initial={{ y: '60%', opacity: 0 }} animate={{ y: '0%', opacity: 1 }} exit={{ y: '-60%', opacity: 0 }} transition={{ duration: 0.5, ease: EASE }}>{t}</motion.span>
      </AnimatePresence>
    </span>
  );
}

function Rule({ i, t, d, onAt }) {
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && onAt(i), { rootMargin: '-45% 0px -45% 0px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [i, onAt]);
  return (
    <li ref={ref} className="km-rule">
      <span className="km-rule-n">{String(i + 1).padStart(2, '0')}</span>
      <h3 className="v2-headline">{t}</h3>
      <p className="v2-body">{d}</p>
    </li>
  );
}

function Holds() {
  const [at, setAt] = useState(0);
  return (
    <section className="v2-sec km-holds">
      <div className="v2-wrap v2-grid">
        <div className="km-holds-l">
          <div className="km-pin">
            <h2 className="v2-title km-holds-h">What it holds and how it holds it</h2>
            <p className="km-num v2-num" aria-hidden="true"><Roll to={at + 1} /></p>
            <p className="v2-body km-holds-lede">A secret is a value under a path, a name and an environment, inside one organization. That is the whole model.</p>
          </div>
        </div>
        <ol className="km-rules">
          {RULES.map(([t, d], i) => <Rule key={t} i={i} t={t} d={d} onAt={setAt} />)}
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

      <section className="km-disk v2-dark" data-room="dark">
        <div className="v2-wrap">
          <ul className="km-figs">
            {FIGS.map(([a, b]) => <li key={a}><b>{a}</b>{b && <span>{b}</span>}</li>)}
          </ul>
          <div className="km-disk-g">
            <div className="km-disk-l">
              <h2 className="v2-display s">Nothing lands on disk</h2>
              <h3 className="v2-title km-out-h">Take them out of the repo</h3>
              <p className="v2-body">Use it hosted, or run the same binary yourself. The source is MIT and the client is where the encryption happens either way.</p>
              <div className="v2-acts"><Cta to="https://kms.hanzo.ai" id="kms.mid">Open KMS</Cta><Cta to="https://github.com/hanzoai/kms" kind="quiet" id="kms.view-on-github">View on GitHub</Cta></div>
            </div>
            <CodeBlock code={CLI} label="terminal" className="km-cli" />
          </div>
        </div>
      </section>

      <section className="v2-sec km-proj">
        <div className="v2-wrap v2-grid">
          <div className="km-proj-c"><Console light name="KMS" api="/v1/kms" cap="The service the session above is changing." side={[['KMS', '/kms'], ['IAM', '/iam'], ['Authz', '/authz'], ['Secrets', '/cloud/secrets'], ['Audit', '/cloud/audit'], ['Zero Trust', '/cloud/zero-trust']]} /></div>
          <div className="km-proj-t">
            <p className="v2-kick acc">Example project</p>
            <p className="v2-title">Example project. Every name in it is one you would give your own.</p>
          </div>
        </div>
      </section>

      <ShipPrompt
        name="KMS"
        api="/v1/kms"
        prompt="Read https://hanzo.ai/skill.md and use Hanzo KMS in my project. Start with: hanzo kms secrets create"
        related={[['IAM', '/iam', 'OIDC identity & orgs'], ['Authz', '/authz', 'Fine-grained access'], ['Secrets', '/cloud/secrets', 'Store once, sync everywhere']]}
      />

      <GetIt name="KMS" tag="Secrets + key management" seed="kms" data={[256, 3, 6]} repo={['hanzoai/kms', 'https://github.com/hanzoai/kms']} stars="3 stars" ask={['Open KMS', 'https://kms.hanzo.ai', 'kms.close']} />
    </main>
  );
}
