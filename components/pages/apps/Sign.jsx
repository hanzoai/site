'use client';
/* Persona: teams that send contracts (ops, sales, HR) and developers who embed signing. Goal: start signing. CTA: "Try Hanzo" → /login. Metric: signup_start.
   Sign. V2: 8/10 the desk signs the contract by itself under the title (the PDF loads in at once), five pinned chapters on that same page, parts open into sheets, a signing pad with a keyboard path, one dark close; greys only
   Signature: a contract that signs itself. A PDF page sits on a desk in the hero and goes through Hanzo's five steps by
   itself: the fields drop in, the link goes out, the signature writes itself in ink, the recipients tick from sent to
   signed, and the certificate stamps the page. Then the five steps become chapters you scroll through on that page.
   Beyond: "Sign it here". A signing pad in the page: draw your signature, press Sign, and the field takes it with the
   time stamped on its certificate line. Nothing is sent anywhere.
   Motion budget: signature = the self-signing page (ink line draw); supporting = Stage (Settle), Chapters
   (PinChapters), Open (sheets). Colour: none (0 UI hues); ink and greys. Self-running demos carry a pause button.
   One dark room: "Send the first one". Every word and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion, useInView } from 'motion/react';
import { EASE, Magnetic } from '../../ui';
import { A, Tick, Img, Flap } from '../../kit';
import { useLive, useEvery } from '../cloud/Frame';
import LineMask from '../../v2/x-gauss/LineMask';
import Settle from '../../v2/Settle';
import PinChapters from '../../v2/x-gauss/PinChapters';
import { OpenCards } from '../../v2/OpenSheet';
import NoJs from '../../v2/x-gauss/NoJs';
import { usePause } from '../../v2/x-gauss/Pause';
import '../../v2/Scale.css';
import '../../v2/x-gauss/Rhythm.css';
import './Sign.css';

const DOCS = 'https://docs.hanzo.ai/docs/projects/hanzoai/esign';
const REPO = 'https://github.com/hanzoai/esign';
const STEPS = [
  ['Upload the PDF', 'The contract you send fifty times a month gets its fields placed once. After that, sending it is choosing a recipient.'],
  ['Place the fields', 'Fields for a signature, initials, a date, a name, a checkbox or free text, placed where you want them on the page.'],
  ['Send it', 'Each signer gets a link and signs in their browser. Nobody installs anything and nobody prints anything.'],
  ['Watch it move', 'Sent, opened, signed, declined — per recipient, as it happens.'],
  ['Keep the record', 'The completed document carries a certificate recording each signer, the time, and the address they signed from.'],
];
const FIELDS = [['signature', 'sig'], ['initials', 'ini'], ['date', 'date'], ['name', 'name'], ['checkbox', 'box'], ['free text', 'text']];
const INK = 'M8 46 C 18 10, 30 8, 28 34 S 22 60, 38 40 S 58 6, 60 30 C 61 44, 54 52, 62 44 S 80 22, 86 34 C 90 42, 84 50, 96 42 S 120 26, 128 38 C 134 46, 140 40, 150 36';
const WHO = ['signer 1', 'signer 2', 'signer 3'];
const STATE = ['sent', 'opened', 'signed'];

/* The page itself. at: 0 uploaded, 1 fields placed, 2 sent (ink writes), 3 moving, 4 certificate. */
function Page({ at }) {
  const placed = at >= 1;
  const signed = at >= 2;
  return (
    <div className="sg-page">
      <div className="sg-page-h"><Img src="/models/kai.webp" alt="" w={38} h={38} /><span><b>Agreement.pdf</b><em className="x-mono">page 1 of 1</em></span></div>
      <div className={'sg-lines' + (at === 0 ? ' up' : '')} key={at === 0 ? 'up' : 'set'} aria-hidden="true">{Array.from({ length: 9 }).map((_, i) => <i key={i} style={{ width: [92, 86, 95, 70, 88, 94, 60, 82, 74][i] + '%' }} />)}</div>
      <div className="sg-fields">
        {FIELDS.map(([t, k], i) => (
          <motion.div key={k} className={'sg-f ' + k} initial={false} animate={placed ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -26, scale: 0.9 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: placed ? i * 0.06 : 0 }}>
            <span>{t}</span>
            {k === 'sig' && (
              <svg viewBox="0 0 160 60" aria-hidden="true"><motion.path d={INK} initial={false} animate={{ pathLength: signed ? 1 : 0, opacity: signed ? 1 : 0 }} transition={{ duration: signed ? 1.8 : 0.2, ease: [0.45, 0, 0.2, 1], delay: signed ? 0.3 : 0 }} /></svg>
            )}
            {k === 'box' && signed && <Tick size={16} />}
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {at >= 4 && (
          <motion.div className="sg-cert" initial={{ opacity: 0, scale: 1.4, rotate: -12 }} animate={{ opacity: 1, scale: 1, rotate: -6 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <b>Certificate</b><span>signer · time · address</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Who has it: three recipients, their states moving as the page goes out. */
function Track({ at, run }) {
  const [m, setM] = useState(0); // in "Watch it move" the three recipients advance one by one
  useEvery(900, run && at === 3, () => setM((v) => (v + 1) % 7));
  return (
    <div className="sg-track" aria-hidden="true">
      {WHO.map((w, i) => {
        const s = at < 2 ? '—' : at === 2 ? 'sent' : at === 3 ? STATE[Math.max(0, Math.min(2, m - i))] : 'signed';
        return <p key={w}><i className={s} /><span>{w}</span><b className="x-mono">{s}</b></p>;
      })}
    </div>
  );
}

/* The opening and the five steps are one pinned story: the desk under the title signs the contract by itself, then the
   scroll walks that same page through the five steps (Hanzo's words beside it, one at a time). */
function Story() {
  const [ref, live] = useLive(0.05);
  const [paused, pauseBtn] = usePause({ position: 'relative', right: 'auto', top: 'auto' });
  const calm = useReducedMotion();
  const [ch, setCh] = useState(0);
  // the desk plays the five steps by itself while you rest at the top; the moment you scroll it hands over to the
  // chapters by going back to the blank page while the title is still on screen, so chapter 01 continues from what
  // you see rather than jumping back to it. Back at the top, it plays again.
  const [auto, setAuto] = useState(0);
  const [top, setTop] = useState(true);
  useEffect(() => {
    const on = () => { setTop(scrollY <= 24); };
    on();
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);
  // the hand-over is a visible rewind, one step every 140 ms (03 → 02 → 01), never a cut back to the blank page
  useEffect(() => {
    if (top || auto === 0) return;
    const t = setTimeout(() => setAuto((v) => Math.max(0, v - 1)), 140);
    return () => clearTimeout(t);
  }, [top, auto]);
  useEffect(() => {
    if (!(live && !paused && ch === 0 && top)) return;
    const t = setTimeout(() => setAuto((v) => (v + 1) % 5), 1900);
    return () => clearTimeout(t);
  }, [auto, live, paused, ch, top]);
  const hero = (
    <div className="sg-lead">
      <LineMask as="h1" id="sg-h1" now className="w2-display sg-h1" lines={['Hanzo Sign']} />
      <motion.div className="sg-hero-r" initial={{ y: 14 }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>
        <p className="w2-lede sg-lede">Upload a PDF, drop the fields where people need to sign, and send it.</p>
        <div className="sg-acts">
          <Magnetic strength={0.25}><A to="/login" className="w2-cta" data-thumb="Try Hanzo" data-cta="sign.hero">Try Hanzo <i aria-hidden="true">→</i></A></Magnetic>
          <A to={DOCS} className="w2-ghost">Documentation</A>
        </div>
      </motion.div>
    </div>
  );
  return (
    <div ref={ref} data-morph-target>
      <PinChapters id="sg-steps" label="Hanzo Sign" title="A document, signed" className="sg-pin"
        chapters={[{ rail: false, node: hero }, ...STEPS.map(([t, d]) => ({ t, b: <p>{d}</p> }))]}
        visual={(at) => {
          if (at !== ch) setTimeout(() => setCh(at), 0);
          const step = calm ? 4 : at === 0 || auto > 0 ? auto : at - 1;
          return (
            <div className="sg-desk w2-object">
              <div className="sg-desk-bar"><p className="sg-desk-k x-mono">Document signing</p><span className="sg-pause">{pauseBtn}</span></div>
              <Track at={step} run={live && !paused} />
              <Page at={step} />
              <div className="sg-desk-r" aria-hidden="true">
                <p className="x-mono">{String(step + 1).padStart(2, '0')} / 05</p>
                {at === 0 && <b>{STEPS[step][0]}</b>}{/* in the chapters the step's name is the heading beside it, said once */}
              </div>
              <p className="x-sr">01 / 05 02 / 05 03 / 05 04 / 05 05 / 05</p>
            </div>
          );
        }} />
    </div>
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
  const [paused, pauseBtn] = usePause({ right: 12, top: 12 });
  const [k, setK] = useState(3);
  useEvery(1200, live && !paused, () => setK((v) => (v + 1) % 9));
  const st = (i) => (i === 3 ? (k > 1 ? 'opened' : 'sent') : k > i + 2 ? 'signed' : k > i ? 'opened' : 'sent'); // person 4 is the one holding it up
  return (
    <div className="sg-five" ref={ref}>
      {pauseBtn}
      {[0, 1, 2, 3, 4].map((i) => { const s = st(i); return <p key={i}><i className={s} /><span>person {i + 1}</span><b className="x-mono">{s}</b></p>; })}
      <em className="x-mono">5 recipients</em>
    </div>
  );
}

function Langs() {
  const [ref, live] = useLive(0.4);
  const [paused, pauseBtn] = usePause({ right: 0, top: 0 });
  const [i, setI] = useState(1);
  useEvery(1300, live && !paused, () => setI((v) => (v + 1) % LANGS.length));
  return (
    <div className="sg-langs" ref={ref}>
      {pauseBtn}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.b key={i} className={LANGS[i].length > 12 ? 'long' : ''} initial={{ y: '70%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-70%', opacity: 0 }} transition={{ duration: 0.5, ease: EASE }}>{LANGS[i]}</motion.b>
      </AnimatePresence>
      <span className="x-mono">{String(i + 1).padStart(2, '0')} / 12</span>
    </div>
  );
}

function Parts() {
  return (
    <section className="w2-sec sg-parts">
      <div className="w2-wrap">
        <div className="sg-split">
          <LineMask as="h2" className="w2-headline" lines={['What is in it']} />
          <p className="w2-lede">The parts of signing that are actually work: placing the fields, chasing the signers, and proving afterwards that it happened.</p>
        </div>
        <div className="sg-bento">
          <div className="sg-tile">
            <div>
              <h3 className="w2-title">Where it is right now</h3>
              <p className="w2-body">Sent, opened, signed, declined — per recipient, as it happens. You know which of five people is holding up a deal without asking any of them.</p>
            </div>
            <Five />
          </div>
          <div className="sg-tile acc">
            <div>
              <h3 className="w2-title">Twelve languages</h3>
              <p className="w2-body">German, English, Spanish, French, Italian, Japanese, Korean, Dutch, Polish, Brazilian Portuguese, Albanian and Chinese. The signer reads the page in theirs, not yours.</p>
            </div>
            <Langs />
          </div>
        </div>
        <OpenCards cols={4} className="sg-cards" items={PARTS.map(([t, d], i) => ({ id: 'sg-' + i, k: String(i + 1).padStart(2, '0'), t, body: <p>{d}</p> }))} />
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
    c.lineWidth = 4; c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = '#1d1d1f';
    c.beginPath(); c.moveTo(...last.current); c.lineTo(...p); c.stroke();
    last.current = p; if (!ink) setInk(true);
  };
  const upE = () => { last.current = null; };
  // a keyboard user signs with Enter: the pad writes the same ink line the contract uses
  const key = (e) => {
    if (done || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    const c = cv.current.getContext('2d');
    c.save(); c.translate(260, 40); c.scale(4.2, 4.2);
    c.lineWidth = 1; c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = '#1d1d1f';
    c.stroke(new Path2D(INK)); c.restore(); setInk(true);
  };
  const clear = () => { cv.current.getContext('2d').clearRect(0, 0, cv.current.width, cv.current.height); setInk(false); setDone(null); };
  const sign = () => setDone(new Date().toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }));
  return (
    <section className="w2-sec sg-try">
      <div className="w2-wrap">
        <div className="sg-try-head">
          <LineMask as="h2" className="w2-display s sg-try-h" lines={['Each signer gets a link and signs in their browser.']} />
          <p className="w2-lede">Nobody installs anything and nobody prints anything.</p>
        </div>
        <div className={'sg-pad w2-object' + (done ? ' done' : '')}>
          <p className="sg-pad-k"><span>signature</span><span className="x-mono">{done ? 'signed' : ink ? 'ready to sign' : 'draw here'}</span></p>
          <div className="sg-pad-c">
            <canvas ref={cv} width="1200" height="320" tabIndex={0} onPointerDown={down} onPointerMove={move} onPointerUp={upE} onPointerCancel={upE} onKeyDown={key} aria-label="Signature pad: draw with your mouse, pen or finger" />
            {!ink && !done && <span className="sg-pad-hint" aria-hidden="true">Sign here</span>}
          </div>
          <div className="sg-pad-foot" role="status">
            <AnimatePresence mode="wait" initial={false}>
              {done ? (
                <motion.p key="c" className="sg-pad-cert" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                  <Tick size={18} /><span>Signed {done}</span>
                </motion.p>
              ) : <motion.span key="n" />}
            </AnimatePresence>
            <div className="sg-pad-acts">
              <button type="button" className="w2-ghost" onClick={clear}>Clear</button>
              <button type="button" className="w2-cta solid" onClick={sign} disabled={!ink || !!done}>Sign</button>
            </div>
          </div>
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

/* The fork, drawn: upstream's line runs on, Hanzo's branch leaves it and carries on beside it (draws in once when
   reached; both ends are the two repositories named in the links above). */
function Fork() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  return (
    <div className={'sg-fork' + (seen ? ' in' : '')} ref={ref} aria-hidden="true">
      <svg viewBox="0 0 640 140">
        <path className="up" d="M8 40 H632" pathLength="1" />
        <path className="me" d="M160 40 C 230 40, 250 104, 330 104 H632" pathLength="1" />
        <circle cx="8" cy="40" r="5" className="dot" /><circle cx="160" cy="40" r="7" className="node" /><circle cx="632" cy="104" r="7" className="node me-end" />
      </svg>
      <p className="x-mono"><span>documenso/documenso</span><span>hanzoai/esign</span></p>
    </div>
  );
}

function Cost() {
  const [run, setRun] = useState(1); // 0 run it yourself, 1 we run it (the default: the hosted plans, Community stays legible)
  const plansRef = useRef(null);
  const seen = useInView(plansRef, { once: true, amount: 0.4 }); // the prices flip in once, the first time they are reached
  return (
    <section className="w2-sec sg-cost">
      <div className="w2-wrap">
        <div className="sg-split">
          <LineMask as="h2" className="w2-headline" lines={['What it costs']} />
          <div>
            <p className="w2-lede">Run it yourself and pay nothing but your own hosting. Pay us and we run it, on the same code.</p>
            <div className="sg-run" role="group" aria-label="Who runs it">
              {['Run it yourself', 'We run it'].map((t, i) => (
                <button key={t} type="button" aria-pressed={run === i} onClick={() => setRun(i)}><span>{t}</span></button>
              ))}
            </div>
          </div>
        </div>
        <div className="sg-plans" ref={plansRef}>
          {PLANS.map(([t, price, per, d, [cta, to], li], i) => {
            const lit = run === null ? true : run === 0 ? i === 0 : i > 0;
            return (
              <div key={t} className={'sg-plan' + (i === 2 ? ' pop' : '') + (lit ? '' : ' dim')}>
                {i === 2 && <span className="sg-pop">Most Popular</span>}
                <h3>{t}</h3>
                <p className="sg-price"><b className={price.startsWith('$') ? 'w2-fig' : 'sg-word'}>{seen ? <Flap value={price} className="sg-flap" /> : price}</b>{per && <span>{per}</span>}</p>
                <p className="sg-plan-d">{d}</p>
                <A to={to} className="w2-ghost sg-plan-a">{cta}</A>
                <ul>{li.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
            );
          })}
        </div>
        <div className="sg-oss">
          <LineMask as="h2" className="w2-headline" lines={['Built on Open Source']} />
          <div>
            <p className="w2-body">Hanzo Sign is built on <A to="https://documenso.com">Documenso</A>, an open-source document signing platform, under the AGPL.</p>
            <p className="w2-body">The upstream project is named here and in the licence, because naming what you forked is required and is a different act from branding yourself with it. Run our build, or run your own — the whole thing is a TypeScript application over Postgres, and you can read every line that touches a document before you trust it with one.</p>
            <div className="sg-oss-links"><A to={REPO} className="w2-ghost">hanzoai/esign <i aria-hidden="true">↗</i></A><A to="https://github.com/documenso/documenso" className="w2-ghost">Upstream: documenso/documenso <i aria-hidden="true">↗</i></A></div>
            <Fork />
          </div>
        </div>
      </div>
    </section>
  );
}

function First() {
  return (
    <section className="w2-sec sg-first w2-dark" data-room="dark">
      <div className="w2-wrap">
        <div className="sg-split">
          <LineMask as="h2" className="w2-display s" lines={['Send the first one']} />
          <p className="w2-lede">Upload a PDF and place a signature field. You will know inside five minutes whether this fits.</p>
        </div>
        <div className="sg-first-row">
          <div className="sg-first-main">
            <h3 className="w2-title">Start signing</h3>
            <p className="w2-body">Open the hosted app and send a document</p>
            <A to="/login" className="w2-cta" data-cta="sign.close">Try Hanzo <i aria-hidden="true">→</i></A>
          </div>
          {/* one ledger, quiet rows divided by hairlines: everything else Hanzo says here, never a second box or ask */}
          <ul className="sg-first-links">
            {[['Documentation', 'Setup, self-hosting, and the API reference', 'View Docs', DOCS], ['The source', 'Read it before you trust a contract to it', 'View on GitHub', REPO]].map(([t, d, a, to]) => (
              <li key={t}><h3>{t}</h3><p>{d}</p><A to={to} className="sg-tlink">{a} <i aria-hidden="true">→</i></A></li>
            ))}
            <li>
              <h3>Something more specific</h3>
              <p>Signing inside your own product, a flow with approvals before the send, or running it on your infrastructure. Tell us the shape and we will tell you whether it fits.</p>
              <A to="/contact-sales" className="sg-tlink">Contact Sales <i aria-hidden="true">→</i></A>
            </li>
            <li>
              <h3>Get started with Sign</h3>
              <p className="sg-row-links"><A to={DOCS} className="sg-tlink">Read the docs →</A><A to={REPO} className="sg-tlink">View on GitHub →</A></p>
            </li>
            <li className="sg-get">
              <h3>Get Sign</h3>
              <p>E-signature</p>
              <span className="sg-get-meta">
                <span className="sg-chip"><span>License:</span> AGPL-3.0</span>
                <A to="https://github.com/hanzoai" className="sg-chip">hanzoai</A>
                <A to="https://platform.hanzo.ai/deploy" className="sg-tlink">Deploy to Cloud <i aria-hidden="true">→</i></A>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function Sign() {
  return (
    <main id="main" className="sg w2 gx">
      <NoJs />
      <Story />
      <Parts />
      <Pad />
      <Cost />
      <First />
    </main>
  );
}
