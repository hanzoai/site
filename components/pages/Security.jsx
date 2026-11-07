'use client';
/* Security. Its idea: security you can read, layer by layer. The hero runs the six controls as a check that passes
   itself, one line at a time. Signature moment: the controls as a readable document — a contents rail that follows
   you, and beside it a stack of six layers, from the edge down to the organization's own file, that peel back one by
   one as you read each control. Then what runs underneath (the rack hums), what comes with Enterprise (ticked off),
   and where to send what you find. Every word is Hanzo's.
   Signature: the controls as a readable document whose six layers peel back, edge to the organization's own file.
   Beyond: "Reviewer's worksheet". Tick each control as you check it; the rail keeps your count in this browser, and
   when all six are ticked the page hands you the next step, Hanzo's own security review. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useScroll } from 'motion/react';
import { EASE, Rise, Copy } from '../ui';
import { A, Go, More, SecHead, Tick, Band } from '../kit';
import './Security.css';

const CONTROLS = [
  ['Encryption at Rest and in Transit', 'At rest, each organization is its own file on Hanzo Base, and where a master key is configured each file opens under its own key, derived through HKDF-SHA256. In transit the edge speaks TLS 1.3 and offers hybrid ML-KEM-768 key exchange to clients that support it, so their traffic captured today cannot be read by a quantum computer later.'],
  ['Second Factors', 'An authenticator app, or a code by SMS or email, with recovery codes. Enrolment hands out the material and demands it back before it writes anything, and adding or dropping a factor signs the account out of every other browser — a stolen session that outlives the change is the same as not having the factor.'],
  ['Keys and Tokens', 'A key is told apart from a token by its prefix, so nothing has to guess what it was handed. Tokens are refused outright if they carry an HMAC signature or no algorithm at all, and a refresh token is single-use — presenting a spent one revokes its whole family rather than the one token.'],
  ['Who May Reach What', 'Access is a grant at a place: an organization, a workspace under it, a project under that. A check asks whether some grant the caller holds covers the path and admits the verb. One rule, no special cases, and the decision is a function call rather than a service that can be down.'],
  ['The Edge Throws Identity Away', 'Anything that arrives claiming to be an org, a user or an email is deleted at the gateway before a single handler reads it. Identity is written back only from a verified token. Inside the cluster, services reach each other over a binary protocol rather than the public internet.'],
  ['Where It Sits', 'An organization is a tenancy boundary, and on Hanzo Base it is a physical one — a different organization is a different database file, so no query can reach across two. Dedicated and self-hosted deployments pin that file to a region you choose.'],
];
const pad = (i) => String(i + 1).padStart(2, '0');

/* ---------- hero: the six controls, checked one by one ---------- */
function Check() {
  const [n, setN] = useState(0);
  const calm = useReducedMotion();
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.4 });
  useEffect(() => {
    if (calm || !live) return;
    const t = setTimeout(() => setN((v) => (v + 1) % 8), n === 7 ? 2600 : 900);
    return () => clearTimeout(t);
  }, [n, calm, live]);
  useEffect(() => { if (calm) setN(6); }, [calm]); // final state after hydration, never a different first render
  const done = Math.min(n, 6);
  return (
    <div className="xsc-check" ref={ref}>
      <div className="xsc-check-h">
        <span className="xsc-dot" aria-hidden="true" />
        <span>The controls, named</span>
        <span className="x-mono">{pad(Math.max(0, done - 1))} / 06</span>
      </div>
      <ol>
        {CONTROLS.map(([t], i) => (
          <li key={t} className={i < done ? 'ok' : i === done ? 'now' : ''}>
            <a href={'#c' + (i + 1)}>
              <span className="x-mono">{pad(i)}</span>
              <span>{t}</span>
              <i aria-hidden="true">
                <AnimatePresence initial={false}>
                  {i < done && (
                    <motion.svg key="t" viewBox="0 0 16 16" width="16" height="16" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
                      <motion.path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, ease: EASE }} />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </i>
            </a>
          </li>
        ))}
      </ol>
      <i className="xsc-check-bar" aria-hidden="true"><motion.b animate={{ scaleX: done / 6 }} transition={{ type: 'spring', stiffness: 160, damping: 24 }} /></i>
    </div>
  );
}

function Hero() {
  const line = (t, d) => <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>;
  return (
    <section className="xsc-hero" aria-labelledby="xsc-h1">
      <div className="x-wrap xsc-hero-g">
        <div>
          <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Security Architecture</motion.p>
          <h1 id="xsc-h1" className="xsc-h1">{line('What protects your data,', 0.05)}{line('and how.', 0.16)}</h1>
          <motion.p className="xsc-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>Clear security mechanisms: which key encrypts your data, where tenancy boundaries are enforced, and how every request is verified.</motion.p>
          <motion.div className="xsc-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}>
            <Go to="/contact" solid>Talk to Security Team</Go>
            <Go to="https://docs.hanzo.ai/docs/cli/security">Security Documentation</Go>
          </motion.div>
          <motion.p className="xsc-audit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.7 }}>
            <Tick size={18} delay={0.8} /> Continual internal audits, with the report on request. <More to="/trust">The controls, and how to check them</More>
          </motion.p>
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.25 }}>
          <Check />
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- the controls: a document whose layers peel back as you read ---------- */
/* Six plates, one per control in reading order; the ones you have read lift away, the one you are reading is lit,
   and the last is the organization's own file. */
function Layers({ at }) {
  return (
    <div className="xsc-layers" aria-hidden="true">
      <div className="xsc-iso">
        {CONTROLS.map(([t], i) => {
          const gone = i < at, lit = i === at, k = i - at;
          return (
            <motion.div key={t} className={'xsc-plate' + (lit ? ' lit' : '') + (i === 5 ? ' core' : '')} style={{ zIndex: 10 - i }}
              initial={false}
              animate={{ y: gone ? -150 : k * 34, x: gone ? 70 : 0, opacity: gone ? 0 : 1 - k * 0.1, scale: gone ? 0.94 : 1 }}
              transition={{ type: 'spring', stiffness: 130, damping: 20 }}>
              {i === 5 && <img src="/models/koma.webp" alt="" />}
              <span className="x-mono">{pad(i)}</span><span>{t}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

const KEY = 'hz-security-checked';

function Controls() {
  const [at, setAt] = useState(0);
  const [ok, setOk] = useState([]); // the reviewer's ticks, kept in this browser only
  const box = useRef(null);
  useEffect(() => { try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); if (Array.isArray(v)) setOk(v.filter((i) => i >= 0 && i < 6)); } catch {} }, []);
  const tick = (i) => setOk((o) => {
    const v = o.includes(i) ? o.filter((k) => k !== i) : [...o, i];
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {}
    return v;
  });
  useEffect(() => {
    const els = [...box.current.querySelectorAll('[data-c]')];
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setAt(+e.target.dataset.c)), { rootMargin: '-45% 0px -50% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const { scrollYProgress } = useScroll({ target: box, offset: ['start center', 'end center'] });
  return (
    <section className="x-sec xsc-doc" id="controls" aria-labelledby="xsc-ctl">
      <div className="x-wrap">
        <div className="xsc-doc-g" ref={box}>
          <aside className="xsc-rail">
            <p className="x-kick" id="xsc-ctl">The controls, named</p>
            <nav aria-label="The controls">
              <ol>
                {CONTROLS.map(([t], i) => (
                  <li key={t} className={ok.includes(i) ? 'ok' : ''}><a href={'#c' + (i + 1)} aria-current={at === i ? 'true' : undefined}><span className="x-mono">{pad(i)}</span>{t}</a></li>
                ))}
              </ol>
              <i className="xsc-rail-p" aria-hidden="true"><motion.b style={{ scaleY: scrollYProgress }} /></i>
            </nav>
            <Layers at={at} />
            <p className="xsc-count x-mono" aria-hidden="true">{pad(at)} / 06</p>
            <p className="xsc-sheet x-mono" aria-live="polite">{ok.length} / 6 checked</p>
            {ok.length === 6 && <More to="/contact-sales">Schedule Security Review</More>}
          </aside>
          <div className="xsc-arts">
            {CONTROLS.map(([t, d], i) => (
              <article key={t} id={'c' + (i + 1)} data-c={i} className={at === i ? 'on' : ''}>
                <p className="xsc-art-n x-mono">{pad(i)} / 06</p>
                <h2>{t}</h2>
                <p className="xsc-art-p">{d}</p>
                <button type="button" className={'xsc-tick' + (ok.includes(i) ? ' on' : '')} aria-pressed={ok.includes(i)} onClick={() => tick(i)}>
                  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {ok.includes(i) ? 'Checked' : 'Mark as checked'}
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- infrastructure: the rack ---------- */
const RACK = ['Hardware-virtualised machines, one tenant to a boundary', 'Errors, traces and release health watched around the clock', 'Replicated, with failover that does not need a person', 'Every image pinned to a version, every deploy reconciled'];
const OPTIONS = [['Run it where you like', 'Our cloud, your cluster, your rack'], ['Scales to nothing', 'Idle should cost what idle is worth'], ['Your region', 'Pin the data and keep it there']];

function Infra() {
  return (
    <section className="x-sec xsc-infra">
      <div className="x-wrap">
        <div className="xsc-infra-g">
          <div>
            <SecHead kicker="Infrastructure" title="What runs underneath" lede="Workloads sit in hardware-virtualised machines on managed Kubernetes, in data centres with physical access control and redundant power. Secrets never reach a manifest — they are fetched from Hanzo KMS at boot, and outside development a service refuses to start without a verified issuer, audience and key set rather than falling back to running open." />
          </div>
          <ul className="xsc-rack">
            {RACK.map((t, i) => (
              <Rise as="li" key={t} delay={i * 0.08} y={16}>
                <span className="xsc-leds" aria-hidden="true"><i style={{ animationDelay: i * 0.37 + 's' }} /><i style={{ animationDelay: i * 0.61 + 0.2 + 's' }} /><i /></span>
                <span className="xsc-u x-mono" aria-hidden="true">U{i + 1}</span>
                <span>{t}</span>
              </Rise>
            ))}
          </ul>
        </div>
        <div className="xsc-none">
          <div>
            <h3>Or none of our infrastructure at all</h3>
            <p>Every piece named on this page is a binary you can run yourself. The strongest answer to a question about our infrastructure is that you do not have to use it.</p>
          </div>
          <ul>
            {OPTIONS.map(([t, d], i) => <Rise as="li" key={t} delay={i * 0.08}><span className="x-mono">{pad(i)}</span><b>{t}</b><span>{d}</span></Rise>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- enterprise: the sign-off ---------- */
const COMES = ['Single sign-on through Hanzo IAM', 'Federation to your own OpenID Connect issuer', 'SCIM 2.0 provisioning from your directory', 'A named engineer who knows your deployment', 'Priority incident response', 'Retention set by you, not by us', 'Audit records exported where you want them', 'Security questionnaire support'];

function Enterprise() {
  return (
    <section className="x-sec xsc-ent">
      <div className="x-wrap xsc-ent-g">
        <div>
          <SecHead kicker="Enterprise" title="If you are the one who has to sign off" />
          <p className="xsc-big">Bring the control you are required to demonstrate and we will show you the code that implements it, or tell you plainly that it does not exist yet. A control we cannot point at is one you should not put your name to.</p>
          <p className="xsc-p">Where a requirement is not met, the honest options are usually self-hosting, a dedicated deployment, or waiting. Our engineers will say which one applies rather than selling you the gap.</p>
        </div>
        <div className="xsc-comes">
          <h3>What comes with Enterprise</h3>
          <p>An engineer who has read your deployment, retention you set rather than inherit, and somebody to answer the questionnaire your procurement team is about to send.</p>
          <ul>{COMES.map((t, i) => <li key={t}><Tick size={20} delay={i * 0.06} /><span>{t}</span></li>)}</ul>
          <Go to="/contact-sales" solid>Contact Sales</Go>
        </div>
      </div>
    </section>
  );
}

function Found() {
  return (
    <section className="xsc-found">
      <div className="x-wrap">
        <div className="xsc-found-c">
          <div>
            <h3>Found something</h3>
            <p>Email us rather than opening a public issue, and include a reproduction if you have one. A real report from a stranger is worth more than an internal review, and we answer quickly.</p>
          </div>
          <div className="xsc-mail">
            <a href="mailto:security@hanzo.ai">security@hanzo.ai</a>
            <Copy text="security@hanzo.ai" label="Copy address" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Security() {
  return (
    <main className="xsc">
      <Hero />
      <Controls />
      <Infra />
      <Enterprise />
      <Found />
      <Band
        title="Ask us the hard question"
        lede="Bring the requirement you cannot get past, and we will show you the code or tell you it is not built. Both answers are more useful than a brochure."
        action="Schedule Security Review"
        to="/contact-sales"
        note={<p className="x-band-note"><A to="/login">Try Hanzo</A> · <A to="https://docs.hanzo.ai/docs/cli/security">Read the security documentation</A></p>}
      />
    </main>
  );
}
