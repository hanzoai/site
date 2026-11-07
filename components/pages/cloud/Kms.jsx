'use client';
/* KMS. Signature: a secret, sealed and rotated. The value is sealed on the client through Hanzo's own chain (Argon2id,
   HKDF-SHA256, AES-256-GCM), then rotated: each write names the version it replaces, so a second writer holding the
   old version is refused, while every read lands in the append-only record, an agent's read under that agent's name.
   Below: the example console, the six rules as an editorial column with a sticky vault number, a four-figure band, and
   the CLI that keeps secrets out of files. Every word and link is Hanzo's. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { Hero, Paste, Related, Get, Console, Head, Code, useLive, A } from './Frame';
import './Kms.css';

const CHAIN = ['Argon2id', 'HKDF-SHA256', 'AES-256-GCM'];
const HEX = '0123456789abcdef';
const noise = (n, s) => Array.from({ length: n }, (_, i) => HEX[(s * 31 + i * 17 + ((s + i) * (i + 3)) % 13) % 16]).join('');

function Vault() {
  const [ref, live, calm] = useLive(0.3);
  const [t, setT] = useState(calm ? 6 : 0); // 0..3 sealing, 4 rotated, 5 stale writer refused, 6 read recorded
  const [ver, setVer] = useState(3);
  useEffect(() => {
    if (calm || !live) return;
    const id = setTimeout(() => {
      if (t === 6) { setT(0); setVer((v) => v + 1); } else setT(t + 1);
    }, [900, 800, 800, 900, 1500, 1700, 2200][t]);
    return () => clearTimeout(id);
  }, [t, live, calm]);
  const sealed = t >= 3;
  const v = t >= 4 ? ver + 1 : ver;
  return (
    <div className="km-vault" ref={ref} aria-hidden="true">
      <div className="km-secret">
        <p className="km-path">DATABASE_PASSWORD <span>production</span></p>
        <p className={'km-val' + (sealed ? ' sealed' : '')}>{sealed ? noise(28, v) : '••••••••••••••••'}</p>
        <div className="km-chain">
          {CHAIN.map((c, i) => <span key={c} className={t > i ? 'on' : ''}>{c}</span>)}
        </div>
        <p className="km-client">the organization key stays on the client</p>
      </div>
      <div className="km-vers">
        <AnimatePresence initial={false}>
          {[v, v - 1, v - 2].map((n, i) => (
            <motion.div key={n} layout className={'km-ver' + (i === 0 ? ' cur' : '')} initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1 - i * 0.3, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE }}>
              <b>v{n}</b><span>{noise(10, n)}</span>{i === 0 && <em>current</em>}
            </motion.div>
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {t === 5 && (
            <motion.div className="km-stale" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>
              write replaces v{v - 1} · <b>refused</b>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ul className="km-log">
        <AnimatePresence initial={false}>
          {t >= 6 && <motion.li key={'r' + ver} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.4 }}><i className="a" />read · agent checkout-web</motion.li>}
          {t >= 4 && <motion.li key={'w' + ver} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.4 }}><i />rotate · v{v}</motion.li>}
          <li key="p"><i />read · payments-api</li>
        </AnimatePresence>
      </ul>
    </div>
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

function Holds() {
  return (
    <section className="x-sec km-holds">
      <div className="x-wrap">
        <Head title="What it holds and how it holds it" lede="A secret is a value under a path, a name and an environment, inside one organization. That is the whole model." />
        <ol className="km-rules">
          {RULES.map(([t, d], i) => (
            <Rise as="li" key={t} y={20}>
              <span className="km-rule-n">{String(i + 1).padStart(2, '0')}</span>
              <div><h3>{t}</h3><p>{d}</p></div>
            </Rise>
          ))}
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

function Disk() {
  return (
    <section className="x-sec km-disk" data-room="dark">
      <div className="x-wrap">
        <ul className="km-figs">
          {FIGS.map(([a, b], i) => (
            <Rise as="li" key={a} delay={i * 0.06}><b>{a}</b>{b && <span>{b}</span>}</Rise>
          ))}
        </ul>
        <div className="km-disk-grid">
          <div>
            <Rise as="h2" className="km-disk-h">Nothing lands on disk</Rise>
            <div className="km-out">
              <h3>Take them out of the repo</h3>
              <p>Use it hosted, or run the same binary yourself. The source is MIT and the client is where the encryption happens either way.</p>
              <div className="km-out-acts">
                <A to="https://kms.hanzo.ai" className="x-btn solid">Open KMS</A>
                <A to="https://github.com/hanzoai/kms" className="x-btn">View on GitHub</A>
              </div>
            </div>
          </div>
          <Code title="KMS CLI" tabs={[{ k: 'terminal', code: CLI }]} />
        </div>
      </div>
    </section>
  );
}

export default function Kms() {
  const icon = <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M10.5 1.5a4 4 0 0 0-3.8 5.3L1.5 12v2.5H4V13h1.5v-1.5H7l1.2-1.2A4 4 0 1 0 10.5 1.5Z M11 5.2a.3.3 0 1 0 0 .01" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>;
  return (
    <main className="km">
      <Hero
        look="flip"
        kick="kms.hanzo.ai"
        icon={icon}
        title="Hanzo KMS"
        sub="Secrets management"
        acts={[['Open KMS', 'https://kms.hanzo.ai'], ['Documentation', 'https://docs.hanzo.ai/docs/openapi/kms/']]}
      >
        <Vault />
      </Hero>
      <section className="km-con">
        <div className="x-wrap km-con-grid">
          <Rise><Console light name="KMS" api="/v1/kms" cap="The service the session above is changing." side={[['KMS', '/kms'], ['IAM', '/iam'], ['Authz', '/authz'], ['Secrets', '/cloud/secrets'], ['Audit', '/cloud/audit'], ['Zero Trust', '/cloud/zero-trust']]} /></Rise>
          <div className="km-con-side">
            <p className="km-con-note">Example project. Every name in it is one you would give your own.</p>
            <Paste name="KMS" prompt="Read https://hanzo.ai/skill.md and use Hanzo KMS in my project. Start with: hanzo kms secrets create" className="km-paste" />
          </div>
        </div>
      </section>
      <Holds />
      <Disk />
      <section className="km-rel">
        <div className="x-wrap"><Related items={[['IAM', '/iam', 'OIDC identity & orgs'], ['Authz', '/authz', 'Fine-grained access'], ['Secrets', '/cloud/secrets', 'Store once, sync everywhere']]} /></div>
      </section>
      <Get name="KMS" tag="Secrets + key management" repo={['hanzoai/kms', 'https://github.com/hanzoai/kms']} stars="3 stars" />
    </main>
  );
}
