'use client';
/* Sign. Signature: a contract that signs itself. A PDF page sits in the hero with Hanzo's five steps as sign-here flags
   on its edge; the page goes through them by itself: the fields drop into place, the link goes out, the signature
   writes itself in ink, the recipients' states tick from sent to signed, and the certificate stamps the page.
   Tap a flag to hold that step.
   Beyond: "Sign it here". A signing pad in the page: draw your signature, press Sign, and the field takes it with the
   time stamped on its certificate line. Nothing is sent anywhere. Also: five recipients and who is holding up the
   deal, and the twelve languages turning over. Every word and link is Hanzo's. */
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A, Go, More, Tick } from '../../kit';
import { Get, useLive, useEvery, useSteps } from '../cloud/Frame';
import './Sign.css';

const DOCS = 'https://docs.hanzo.ai/docs/projects/hanzoai/esign';
const REPO = 'https://github.com/hanzoai/esign';
const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
const STEPS = [
  ['Upload the PDF', 'The contract you send fifty times a month gets its fields placed once. After that, sending it is choosing a recipient.'],
  ['Place the fields', 'Fields for a signature, initials, a date, a name, a checkbox or free text, placed where you want them on the page.'],
  ['Send it', 'Each signer gets a link and signs in their browser. Nobody installs anything and nobody prints anything.'],
  ['Watch it move', 'Sent, opened, signed, declined — per recipient, as it happens.'],
  ['Keep the record', 'The completed document carries a certificate recording each signer, the time, and the address they signed from.'],
];
const FIELDS = [['signature', 'sig'], ['initials', 'ini'], ['date', 'date'], ['name', 'name'], ['checkbox', 'box'], ['free text', 'text']];
const INK = 'M8 46 C 18 10, 30 8, 28 34 S 22 60, 38 40 S 58 6, 60 30 C 61 44, 54 52, 62 44 S 80 22, 86 34 C 90 42, 84 50, 96 42 S 120 26, 128 38 C 134 46, 140 40, 150 36';

function Page({ at }) {
  const placed = at >= 1;
  const signed = at >= 2;
  return (
    <div className="sg-page">
      <div className="sg-page-h"><img src="/models/kai.webp" alt="" /><span><b>Agreement.pdf</b><em className="x-mono">page 1 of 1</em></span></div>
      <div className="sg-lines" aria-hidden="true">{Array.from({ length: 9 }).map((_, i) => <i key={i} style={{ width: [92, 86, 95, 70, 88, 94, 60, 82, 74][i] + '%' }} />)}</div>
      <div className="sg-fields">
        {FIELDS.map(([t, k], i) => (
          <motion.div key={k} className={'sg-f ' + k} initial={false} animate={placed ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -26, scale: 0.9 }} transition={{ type: 'spring', stiffness: 380, damping: 24, delay: placed ? i * 0.08 : 0 }}>
            <span>{t}</span>
            {k === 'sig' && (
              <svg viewBox="0 0 160 60" aria-hidden="true"><motion.path d={INK} initial={false} animate={{ pathLength: signed ? 1 : 0 }} transition={{ duration: signed ? 1.8 : 0.2, ease: [0.45, 0, 0.2, 1], delay: signed ? 0.3 : 0 }} /></svg>
            )}
            {k === 'box' && signed && <Tick size={16} />}
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {at >= 4 && (
          <motion.div className="sg-cert" initial={{ opacity: 0, scale: 1.4, rotate: -12 }} animate={{ opacity: 1, scale: 1, rotate: -6 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
            <b>Certificate</b><span>signer · time · address</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const WHO = ['signer 1', 'signer 2', 'signer 3'];
const STATE = ['sent', 'opened', 'signed'];

function Hero() {
  const [ref, live] = useLive(0.3);
  const [at, choose] = useSteps(5, 3400, live);
  return (
    <section className="sg-hero" ref={ref} aria-labelledby="sg-h1">
      <div className="x-wrap sg-hero-grid">
        <div className="sg-copy">
          <motion.p className="sg-kick" {...up(0)}>Document signing</motion.p>
          <h1 id="sg-h1" className="sg-h1"><span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}>Hanzo Sign</motion.span></span></h1>
          <motion.p className="sg-lede" {...up(0.3)}>Upload a PDF, drop the fields where people need to sign, and send it.</motion.p>
          <motion.div className="sg-acts" {...up(0.42)}>
            <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><A to="/login" className="x-btn solid" data-thumb="Try Hanzo">Try Hanzo</A></motion.span>
            <Go to={DOCS}>Documentation</Go>
          </motion.div>
          <div className="sg-now" aria-live="polite">
            <p className="sg-now-k"><span>A document, signed</span><span className="x-mono">{String(at + 1).padStart(2, '0')} / 05</span></p>
            {STEPS.map(([t, d], i) => (
              <motion.p key={t} className="sg-now-d" initial={false} animate={at === i ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }} transition={{ duration: 0.4, ease: EASE }} aria-hidden={at !== i}><b>{t}.</b> {d}</motion.p>
            ))}
            <p className="x-sr">02 / 05 03 / 05 04 / 05 05 / 05</p>
          </div>
        </div>
        <motion.div className="sg-desk" initial={{ opacity: 0, y: 40, rotate: 3 }} animate={{ opacity: 1, y: 0, rotate: 1.5 }} transition={{ duration: 1.2, ease: EASE, delay: 0.15 }} data-cursor="Sign">
          <Page at={at} />
          <ol className="sg-flags">
            {STEPS.map(([t], i) => (
              <li key={t}>
                <button type="button" className={at === i ? 'on' : i < at ? 'past' : ''} aria-pressed={at === i} onClick={() => choose(i)}>
                  <span className="x-mono">{String(i + 1).padStart(2, '0')}</span>{t}
                </button>
              </li>
            ))}
          </ol>
          <AnimatePresence>
            {at === 2 || at === 3 ? (
              <motion.div className="sg-track" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.45, ease: EASE }}>
                {WHO.map((w, i) => (
                  <p key={w}><span>{w}</span><b className={'x-mono s' + (at === 3 ? Math.min(2, i === 2 ? 1 : 2) : 0)}>{at === 3 ? STATE[i === 2 ? 1 : 2] : 'sent'}</b></p>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

const PARTS = [
  ['Signatures', 'Fields for a signature, initials, a date, a name, a checkbox or free text, placed where you want them on the page. The completed document carries a certificate recording each signer, the time, and the address they signed from.'],
  ['Templates', 'The contract you send fifty times a month gets its fields placed once. After that, sending it is choosing a recipient.'],
  ['Teams', 'Documents belong to a team rather than to whoever uploaded them, so a person leaving does not take the paperwork with them. Roles decide who can send, who can only see.'],
  ['Webhooks and an API', 'Your system creates the document, adds the recipients and sends it. A webhook fires when somebody opens, signs or declines, so your side of the workflow moves without anybody watching an inbox.'],
  ['Security & Compliance', 'End-to-end encryption, a signed trail on every document, and data that stays in the region you choose.'],
  ['Your name on it', 'The signing page carries your logo and your colours on your own domain, so the person signing sees the company they are doing business with rather than the company we are.'],
  ['The chasing, done for you', 'The invitation, the reminder for the one person who has not got to it yet, and the copy of the finished document to everybody who signed.'],
  ['Signing in', 'A passkey, or a password kept as a bcrypt digest. A document can also demand that a recipient authenticate before it will open, so the link alone is not enough to read it.'],
];
const LANGS = ['German', 'English', 'Spanish', 'French', 'Italian', 'Japanese', 'Korean', 'Dutch', 'Polish', 'Brazilian Portuguese', 'Albanian', 'Chinese'];

/* Five people, one deal: their states move until one is left holding it up. */
function Five() {
  const [ref, live] = useLive(0.4);
  const [k, setK] = useState(3);
  useEvery(1200, live, () => setK((v) => (v + 1) % 9));
  const st = (i) => (i === 3 ? (k > 1 ? 'opened' : 'sent') : k > i + 2 ? 'signed' : k > i ? 'opened' : 'sent'); // person 4 is the one holding it up
  return (
    <div className="sg-five" ref={ref} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => { const s = st(i); return <p key={i}><i className={s} /><span>person {i + 1}</span><b className="x-mono">{s}</b></p>; })}
      <em className="x-mono">5 recipients</em>
    </div>
  );
}

function Langs() {
  const [ref, live] = useLive(0.4);
  const [i, setI] = useState(1);
  useEvery(1100, live, () => setI((v) => (v + 1) % LANGS.length));
  return (
    <div className="sg-langs" ref={ref} aria-hidden="true">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.b key={i} initial={{ y: 26, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -26, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}>{LANGS[i]}</motion.b>
      </AnimatePresence>
      <span className="x-mono">{String(i + 1).padStart(2, '0')} / 12</span>
    </div>
  );
}

function Parts() {
  return (
    <section className="x-sec sg-parts">
      <div className="x-wrap">
        <header className="sg-h">
          <h2>What is in it</h2>
          <p>The parts of signing that are actually work: placing the fields, chasing the signers, and proving afterwards that it happened.</p>
        </header>
        <div className="sg-grid">
          {PARTS.map(([t, d], i) => (
            <Rise key={t} className="sg-part" delay={(i % 4) * 0.05}>
              <span className="x-mono">{String(i + 1).padStart(2, '0')}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Rise>
          ))}
          <div className="sg-part wide">
            <span className="x-mono">09</span>
            <h3>Where it is right now</h3>
            <p>Sent, opened, signed, declined — per recipient, as it happens. You know which of five people is holding up a deal without asking any of them.</p>
            <Five />
          </div>
          <div className="sg-part wide dark">
            <span className="x-mono">10</span>
            <h3>Twelve languages</h3>
            <p>German, English, Spanish, French, Italian, Japanese, Korean, Dutch, Polish, Brazilian Portuguese, Albanian and Chinese. The signer reads the page in theirs, not yours.</p>
            <Langs />
          </div>
        </div>
      </div>
    </section>
  );
}

/* Beyond: a signing pad. Draw, press Sign, and the field takes it with the time on its certificate line. Nothing is sent. */
function Pad() {
  const cv = useRef(null);
  const last = useRef(null);
  const [ink, setInk] = useState(false);
  const [done, setDone] = useState(null);
  const pt = (e) => { const r = cv.current.getBoundingClientRect(); return [(e.clientX - r.left) * (cv.current.width / r.width), (e.clientY - r.top) * (cv.current.height / r.height)]; };
  const down = (e) => { if (done) return; cv.current.setPointerCapture(e.pointerId); last.current = pt(e); };
  const move = (e) => {
    if (!last.current) return;
    const c = cv.current.getContext('2d');
    const p = pt(e);
    c.lineWidth = 3.2; c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = '#0a2a7a';
    c.beginPath(); c.moveTo(...last.current); c.lineTo(...p); c.stroke();
    last.current = p; if (!ink) setInk(true);
  };
  const upE = () => { last.current = null; };
  const clear = () => { cv.current.getContext('2d').clearRect(0, 0, cv.current.width, cv.current.height); setInk(false); setDone(null); };
  const sign = () => setDone(new Date().toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }));
  return (
    <section className="x-sec sg-try">
      <div className="x-wrap sg-try-grid">
        <div>
          <p className="x-kick">Try the signing page</p>
          <h2 className="sg-try-h">Each signer gets a link and signs in their browser.</h2>
          <p className="sg-try-l">Nobody installs anything and nobody prints anything. Draw a signature in the field and press Sign. Nothing here is sent anywhere.</p>
        </div>
        <div className={'sg-pad' + (done ? ' done' : '')}>
          <p className="sg-pad-k"><span>signature</span><span className="x-mono">{done ? 'signed' : ink ? 'ready to sign' : 'draw here'}</span></p>
          <canvas ref={cv} width="720" height="240" onPointerDown={down} onPointerMove={move} onPointerUp={upE} onPointerCancel={upE} aria-label="Signature pad: draw with your mouse, pen or finger" data-cursor="Draw" />
          {!ink && !done && <span className="sg-pad-hint" aria-hidden="true">Sign here</span>}
          <div className="sg-pad-acts">
            <button type="button" className="x-btn sm" onClick={clear}>Clear</button>
            <button type="button" className="x-btn sm solid" onClick={sign} disabled={!ink || !!done}>Sign</button>
          </div>
          <AnimatePresence>
            {done && (
              <motion.p className="sg-pad-cert" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                <Tick size={18} /><span>Signed {done}. The certificate records each signer, the time, and the address they signed from.</span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

const PLANS = [
  ['Community', 'Free', '', 'Self-host and own your data. Full source code on GitHub.', ['Get on GitHub', 'https://github.com/hanzoai/'], ['Unlimited documents', 'All field types', 'Templates', 'API access', 'Email notifications', 'Community support']],
  ['Starter', '$30', '/mo', 'For individuals and small teams getting started with e-signing.', ['Contact Sales', '/contact-sales'], ['Everything in Community', 'Managed cloud hosting', 'Custom branding', 'Priority email support', 'Signing certificates', '5 team members']],
  ['Business', '$50', '/mo', 'For growing teams that need advanced features and integrations.', ['Contact Sales', '/contact-sales'], ['Everything in Starter', 'Unlimited team members', 'Custom domain', 'Advanced templates', 'Webhooks', 'SAML SSO', 'Audit logs', 'Priority support']],
  ['Enterprise', 'Custom', '', 'For organizations with advanced security and compliance needs.', ['Contact Sales', '/contact-sales'], ['Everything in Business', 'Dedicated infrastructure', 'Custom SLA', 'On-premise deployment', 'Compliance certifications', 'Dedicated account manager', '24/7 phone support']],
];

function Cost() {
  const [run, setRun] = useState(1); // 0: run it yourself, 1: we run it
  return (
    <section className="x-sec sg-cost">
      <div className="x-wrap">
        <header className="sg-h">
          <h2>What it costs</h2>
          <p>Run it yourself and pay nothing but your own hosting. Pay us and we run it, on the same code.</p>
        </header>
        <div className="sg-run" role="group" aria-label="Who runs it">
          {['Run it yourself', 'We run it'].map((t, i) => (
            <button key={t} type="button" aria-pressed={run === i} onClick={() => setRun(i)}>
              {run === i && <motion.span layoutId="sg-run" className="sg-run-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <span>{t}</span>
            </button>
          ))}
        </div>
        <div className="sg-plans">
          {PLANS.map(([t, price, per, d, [cta, to], li], i) => {
            const lit = run === 0 ? i === 0 : i > 0;
            return (
              <Rise key={t} className={'sg-plan' + (i === 2 ? ' pop' : '') + (lit ? '' : ' dim')} delay={i * 0.06}>
                {i === 2 && <span className="sg-pop">Most Popular</span>}
                <h3>{t}</h3>
                <p className="sg-price"><b>{price}</b>{per && <span>{per}</span>}</p>
                <p className="sg-plan-d">{d}</p>
                <A to={to} className={'x-btn sm' + (i === 2 ? ' solid' : '')}>{cta}</A>
                <ul>{li.map((x) => <li key={x}>{x}</li>)}</ul>
              </Rise>
            );
          })}
        </div>
        <div className="sg-oss">
          <h3>Built on Open Source</h3>
          <p>Hanzo Sign is built on <A to="https://documenso.com">Documenso</A>, an open-source document signing platform, under the AGPL.</p>
          <p>The upstream project is named here and in the licence, because naming what you forked is required and is a different act from branding yourself with it. Run our build, or run your own — the whole thing is a TypeScript application over Postgres, and you can read every line that touches a document before you trust it with one.</p>
          <div className="x-row-links tight"><More to={REPO}>hanzoai/esign</More><More to="https://github.com/documenso/documenso">Upstream: documenso/documenso</More></div>
        </div>
      </div>
    </section>
  );
}

function First() {
  return (
    <section className="x-sec sg-first" data-room="dark">
      <div className="x-wrap">
        <header className="sg-h dark">
          <h2>Send the first one</h2>
          <p>Upload a PDF and place a signature field. You will know inside five minutes whether this fits.</p>
        </header>
        <div className="sg-first-grid">
          {[['Start signing', 'Open the hosted app and send a document', 'Try Hanzo', '/login'], ['Documentation', 'Setup, self-hosting, and the API reference', 'View Docs', DOCS], ['The source', 'Read it before you trust a contract to it', 'View on GitHub', REPO]].map(([t, d, a, to], i) => (
            <div key={t}><A to={to} className="sg-first-a"><h3>{t}</h3><p>{d}</p><b>{a} →</b></A></div>
          ))}
        </div>
        <div className="sg-first-foot">
          <div className="sg-spec">
            <h3>Something more specific</h3>
            <p>Signing inside your own product, a flow with approvals before the send, or running it on your infrastructure. Tell us the shape and we will tell you whether it fits.</p>
            <A to="/contact-sales" className="x-btn sm">Contact Sales</A>
          </div>
          <div className="sg-gs">
            <h2>Get started with Sign</h2>
            <div className="x-row-links tight"><More to={DOCS}>Read the docs</More><More to={REPO}>View on GitHub</More></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Sign() {
  return (
    <main className="sg">
      <Hero />
      <Parts />
      <Pad />
      <Cost />
      <First />
      <Get name="Sign" tag="E-signature" license="AGPL-3.0" />
    </main>
  );
}
