'use client';
/* Persona: teams that send contracts (ops, sales, HR) and developers who embed signing. Goal: start signing. CTA: "Try Hanzo" → /login. Metric: signup_start.
   Sign. V2: 8/10 no pinned chapters: the desk beside the title signs the contract by itself and the five steps sit under it as one row you can pick from; every moment of the signing lands like a stamp; five sections, five different entrances; greys only; slice D: the part tiles preview their first sentence on hover, two to a row on phones, the plans ride a sideways rail on phones (the toggle brings its plans into view), the close's five rows sit as a two-column ledger so it fits one screen
   Signature: stamp. A PDF page sits on a desk beside the title and goes through Hanzo's five steps by itself; each
   thing that arrives on the paper lands with weight (a short drop, a squash onto the page, a settle): the six fields,
   the signature (the ink writes, then the field takes the pen's press), the checkbox tick, and the certificate,
   which comes down like a rubber stamp and jolts the page. The five steps under the desk are buttons (mouse, touch,
   Tab and Enter): pick one and the desk goes there. On the pad further down, pressing Sign stamps the "Signed" line.
   Entrances: 1 swing-door on the opening (title block and desk swing in on vertical hinges, the five steps after them),
   2 drop-in on "What is in it", 3 rack-focus on the signing pad (the page's one blur, 4px), 4 noise-dissolve on
   "What it costs" (an SVG noise threshold, grey grain), 5 accordion on the dark close (its rows unfold one by one).
   Each plays once when its section enters the viewport (IntersectionObserver; the opening at first paint), page-local.
   Beyond: "Sign it here". A signing pad in the page: draw your signature, press Sign, and the field takes it with the
   time stamped on its certificate line. Nothing is sent anywhere.
   Colour: none (0 UI hues); ink and greys. Self-running demos carry a pause button.
   One dark room: "Send the first one". Every word and link is Hanzo's. */
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion, useInView } from 'motion/react';
import { EASE, Magnetic } from '../../ui';
import { A, Tick, Img, Flap } from '../../kit';
import { useLive, useEvery } from '../cloud/Frame';
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

/* The page's entrances: once, when the section first enters the viewport, it gets data-in and its CSS entrance plays
   (Sign.css, "entrances"). onIn runs once at that moment for an entrance that needs a script (the noise dissolve). */
function useEnter(onIn) {
  const ref = useRef(null);
  const f = useRef(onIn);
  f.current = onIn;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) { el.dataset.in = '1'; return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      el.dataset.in = '1';
      f.current?.(el);
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/* Entrance 4: the section dissolves in out of grey noise. An SVG filter thresholds fractal noise into an alpha mask;
   its offset animates (SMIL, in the filter itself) from all-grain to solid in 600 ms, then the filter comes off. */
function dissolve(el) {
  const a = document.getElementById('sg-noise-a');
  if (!a || typeof a.beginElement !== 'function') return;
  el.style.filter = 'url(#sg-noise)';
  a.beginElement();
  setTimeout(() => { el.style.filter = ''; }, 680);
}

/* The page itself. at: 0 uploaded, 1 fields placed, 2 sent (ink writes), 3 moving, 4 certificate. Everything that
   arrives on the paper stamps (Sign.css, "the stamp"). */
interface PageProps {
  at: number;
}
function Page({ at }: PageProps) {
  const placed = at >= 1;
  const signed = at >= 2;
  return (
    <div className={'sg-page' + (at >= 4 ? ' thud' : '')}>
      <div className="sg-page-h"><Img src="/models/kai.webp" alt="" w={38} h={38} /><span><b>Agreement.pdf</b><em className="x-mono">page 1 of 1</em></span></div>
      <div className={'sg-lines' + (at === 0 ? ' up' : '')} key={at === 0 ? 'up' : 'set'} aria-hidden="true">{Array.from({ length: 9 }).map((_, i) => <i key={i} style={{ width: [92, 86, 95, 70, 88, 94, 60, 82, 74][i] + '%' }} />)}</div>
      <div className="sg-fields">
        {FIELDS.map(([t, k], i) => (
          <div key={k} className={'sg-f ' + k + (placed ? ' in' : '') + (k === 'sig' && signed ? ' signed' : '')} style={{ '--i': i }}>
            <span>{t}</span>
            {k === 'sig' && (
              <svg viewBox="0 0 160 60" aria-hidden="true"><motion.path d={INK} initial={false} animate={{ pathLength: signed ? 1 : 0, opacity: signed ? 1 : 0 }} transition={{ duration: signed ? 1.8 : 0.2, ease: [0.45, 0, 0.2, 1], delay: signed ? 0.3 : 0 }} /></svg>
            )}
            {k === 'box' && signed && <Tick size={16} />}
          </div>
        ))}
      </div>
      {at >= 4 && <div className="sg-cert"><b>Certificate</b><span>signer · time · address</span></div>}
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

/* The opening: the title and its ask beside the desk, which plays Hanzo's five steps by itself while it is on screen
   (each stamp lands in turn); the five steps sit under it as one row, and picking one takes the desk there and holds it
   a while before it plays on. Reduced motion: the signed, stamped final page. */
function Opening() {
  const [ref, live, calm] = useLive(0.3);
  const [paused, pauseBtn] = usePause({ position: 'relative', right: 'auto', top: 'auto' });
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState(false);
  useEffect(() => {
    if (!live || paused) return;
    const t = setTimeout(() => { setPicked(false); setStep((v) => (v + 1) % 5); }, picked ? 6000 : step === 4 ? 3200 : step === 2 ? 2600 : 1900);
    return () => clearTimeout(t);
  }, [step, live, paused, picked]);
  const at = calm ? 4 : step;
  const stepsRef = useEnter();
  const pick = (i: number) => { setStep(i); setPicked(true); };
  return (
    <section className="sg-hero" aria-labelledby="sg-h1" data-morph-target>
      <div className="w2-wrap">
        <div className="sg-hero-grid">
          <div className="sg-lead sg-door l">
            <h1 id="sg-h1" className="w2-display sg-h1">Hanzo Sign</h1>
            <div className="sg-hero-r">
              <p className="w2-lede sg-lede">Upload a PDF, drop the fields where people need to sign, and send it.</p>
              <div className="sg-acts">
                <Magnetic strength={0.25}><A to="/login" className="w2-cta" data-thumb="Try Hanzo" data-cta="sign.hero">Try Hanzo <i aria-hidden="true">→</i></A></Magnetic>
                <A to={DOCS} className="w2-ghost">Documentation</A>
              </div>
            </div>
          </div>
          <div className="sg-desk w2-object sg-door r" ref={ref}>
            <div className="sg-desk-bar"><p className="sg-desk-k x-mono">Document signing</p><span className="sg-pause">{pauseBtn}</span></div>
            <Page at={at} />
            <div className="sg-desk-r" aria-hidden="true">
              <p className="x-mono">{String(at + 1).padStart(2, '0')} / 05</p>
              <b>{STEPS[at][0]}</b>
            </div>
            <Track at={at} run={live && !paused} />
            <p className="x-sr">01 / 05 02 / 05 03 / 05 04 / 05 05 / 05</p>
          </div>
        </div>
        <div className="sg-steps-w sg-doors" ref={stepsRef}>
          <h2 className="sg-steps-t x-mono">A document, signed</h2>
          <ol className="sg-steps" aria-label="A document, signed">
            {STEPS.map(([t, d], i) => (
              <li key={t} style={{ '--i': i }}>
                <button type="button" aria-pressed={at === i} className={i < at ? 'past' : ''} onClick={() => pick(i)}>
                  <span className="x-mono">{String(i + 1).padStart(2, '0')}</span>
                  <span className="sg-step-t">{t}</span>
                  <span className="sg-step-d">{d}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
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
  const [paused, pauseBtn] = usePause({ right: 12, top: 12 });
  const [k, setK] = useState(3);
  useEvery(1200, live && !paused, () => setK((v) => (v + 1) % 9));
  const st = (i: number) => (i === 3 ? (k > 1 ? 'opened' : 'sent') : k > i + 2 ? 'signed' : k > i ? 'opened' : 'sent'); // person 4 is the one holding it up
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
  const ref = useEnter();
  return (
    <section className="w2-sec sg-parts sg-drops" ref={ref}>
      <div className="w2-wrap">
        <div className="sg-split">
          <h2 className="w2-headline">What is in it</h2>
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
        {/* hover (pointer devices): the part's first sentence previews where the number sat, so the hover says what opens */}
        <OpenCards cols={4} className="sg-cards" items={PARTS.map(([t, d], i) => ({ id: 'sg-' + i, k: String(i + 1).padStart(2, '0'), t, d: <span aria-hidden="true">{d.split(/(?<=\.) /)[0]}</span>, body: <p>{d}</p> }))} />
      </div>
    </section>
  );
}

/* Beyond: a signing pad. Draw, press Sign, and the "Signed" line stamps onto the pad with the time. Nothing is sent. */
function Pad() {
  const cv = useRef<HTMLCanvasElement>(null);
  const last = useRef<number[] | null | null>(null);
  const [ink, setInk] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const padRef = useRef<HTMLDivElement>(null);
  const padSeen = useInView(padRef, { once: true, amount: 0.6 });
  const secRef = useEnter();
  const pt = (e: React.PointerEvent<HTMLCanvasElement>) => { const r = cv.current!.getBoundingClientRect(); return [(e.clientX - r.left) * (cv.current!.width / r.width), (e.clientY - r.top) * (cv.current!.height / r.height)]; };
  const down = (e: React.PointerEvent<HTMLCanvasElement>) => { if (done) return; cv.current!.setPointerCapture(e.pointerId); last.current = pt(e); };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!last.current) return;
    const c = cv.current!.getContext('2d');
    const p = pt(e);
    c.lineWidth = 4; c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = '#1d1d1f';
    c.beginPath(); c.moveTo(...last.current); c.lineTo(...p); c.stroke();
    last.current = p; if (!ink) setInk(true);
  };
  const upE = () => { last.current = null; };
  // a keyboard user signs with Enter: the pad writes the same ink line the contract uses
  const key = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (done || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    const c = cv.current!.getContext('2d');
    c.save(); c.translate(260, 40); c.scale(4.2, 4.2);
    c.lineWidth = 1; c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = '#1d1d1f';
    c.stroke(new Path2D(INK)); c.restore(); setInk(true);
  };
  const clear = () => { cv.current!.getContext('2d').clearRect(0, 0, cv.current!.width, cv.current!.height); setInk(false); setDone(null); };
  const sign = () => setDone(new Date().toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }));
  return (
    <section className="w2-sec sg-try sg-focus" ref={secRef}>
      <div className="w2-wrap">
        <div className="sg-try-head">
          <h2 className="w2-display s sg-try-h">Each signer gets a link and signs in their browser.</h2>
          <p className="w2-lede">Nobody installs anything and nobody prints anything.</p>
        </div>
        <div ref={padRef} className={'sg-pad w2-object' + (done ? ' done' : '')}>
          <p className="sg-pad-k"><span>signature</span><span className="x-mono">{done ? 'signed' : ink ? 'ready to sign' : 'draw here'}</span></p>
          <div className="sg-pad-c">
            <canvas ref={cv} width="1200" height="320" tabIndex={0} onPointerDown={down} onPointerMove={move} onPointerUp={upE} onPointerCancel={upE} onKeyDown={key} aria-label="Signature pad: draw with your mouse, pen or finger" />
            {!ink && !done && <span className={'sg-pad-hint' + (padSeen ? ' under' : '')} aria-hidden="true">Sign here</span>}
            {/* a ghost signature writes itself once when the pad is reached, then waits; your first stroke clears it */}
            {!ink && !done && <svg className={'sg-pad-ghost' + (padSeen ? ' in' : '')} viewBox="0 0 160 60" aria-hidden="true"><path d={INK} pathLength="1" /></svg>}
          </div>
          <div className="sg-pad-foot" role="status">
            {done ? <p key={done} className="sg-pad-cert"><Tick size={18} /><span>Signed {done}</span></p> : <span />}
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
  const ref = useRef<HTMLDivElement>(null);
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
  const plansRef = useRef<HTMLDivElement>(null);
  const seen = useInView(plansRef, { once: true, amount: 0.4 }); // the prices flip in once, the first time they are reached
  const wrapRef = useEnter(dissolve);
  // on phones the plans are a sideways rail: the toggle brings the plans it means into view
  const toPlan = (k: number) => {
    const rail = plansRef.current;
    if (!rail || rail.scrollWidth <= rail.clientWidth + 1) return;
    const card = rail.children[k];
    rail.scrollTo({ left: card.offsetLeft - rail.firstElementChild.offsetLeft, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  return (
    <section className="w2-sec sg-cost">
      {/* the noise the section dissolves in from (entrance 4): grey fractal noise, thresholded into an alpha mask */}
      <svg className="sg-noise-def" width="0" height="0" aria-hidden="true" focusable="false">
        <filter id="sg-noise" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="7" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  14 0 0 0 2" result="m">
            <animate id="sg-noise-a" attributeName="values" begin="indefinite" dur="0.6s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0 0 .2 1"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  14 0 0 0 -12;0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  14 0 0 0 2" />
          </feColorMatrix>
          <feComposite in="SourceGraphic" in2="m" operator="in" />
        </filter>
      </svg>
      <div className="w2-wrap sg-noise" ref={wrapRef}>
        <div className="sg-split">
          <h2 className="w2-headline">What it costs</h2>
          <div>
            <p className="w2-lede">Run it yourself and pay nothing but your own hosting. Pay us and we run it, on the same code.</p>
            <div className="sg-run" role="group" aria-label="Who runs it">
              {['Run it yourself', 'We run it'].map((t, i) => (
                <button key={t} type="button" aria-pressed={run === i} onClick={() => { setRun(i); toPlan(i === 0 ? 0 : 1); }}><span>{t}</span></button>
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
          <h2 className="w2-headline">Built on Open Source</h2>
          <div>
            <p className="w2-body"><span>Hanzo Sign is built on </span><A to="https://documenso.com">Documenso</A><span>, an open-source document signing platform, under the AGPL.</span></p>
            <p className="w2-body">The upstream project is named here and in the licence, because naming what you forked is required and is a different act from branding yourself with it. Run our build, or run your own — the whole thing is a TypeScript application over Postgres, and you can read every line that touches a document before you trust it with one.</p>
            <div className="sg-oss-links"><A to={REPO} className="w2-ghost"><span>hanzoai/esign</span> <i aria-hidden="true">↗</i></A><A to="https://github.com/documenso/documenso" className="w2-ghost"><span>Upstream: documenso/documenso</span> <i aria-hidden="true">↗</i></A></div>
            <Fork />
          </div>
        </div>
      </div>
    </section>
  );
}

function First() {
  const ref = useEnter();
  return (
    <section className="w2-sec sg-first w2-dark sg-acc" data-room="dark" ref={ref}>
      <div className="w2-wrap">
        <div className="sg-split sg-fold" style={{ '--i': 0 }}>
          <h2 className="w2-display s">Send the first one</h2>
          <p className="w2-lede">Upload a PDF and place a signature field. You will know inside five minutes whether this fits.</p>
        </div>
        <div className="sg-first-row">
          <div className="sg-first-main sg-fold" style={{ '--i': 1 }}>
            <h3 className="w2-title">Start signing</h3>
            <p className="w2-body">Open the hosted app and send a document</p>
            <A to="/login" className="w2-cta" data-cta="sign.close">Try Hanzo <i aria-hidden="true">→</i></A>
          </div>
          {/* one ledger, quiet rows divided by hairlines: everything else Hanzo says here, never a second box or ask */}
          <ul className="sg-first-links">
            {[['Documentation', 'Setup, self-hosting, and the API reference', 'View Docs', DOCS], ['The source', 'Read it before you trust a contract to it', 'View on GitHub', REPO]].map(([t, d, a, to], i) => (
              <li key={t} className="sg-fold" style={{ '--i': i + 2 }}><h3>{t}</h3><p>{d}</p><A to={to} className="sg-tlink"><span>{a}</span> <i aria-hidden="true">→</i></A></li>
            ))}
            <li className="sg-fold" style={{ '--i': 4 }}>
              <h3>Something more specific</h3>
              <p>Signing inside your own product, a flow with approvals before the send, or running it on your infrastructure. Tell us the shape and we will tell you whether it fits.</p>
              <A to="/contact-sales" className="sg-tlink"><span>Contact Sales</span> <i aria-hidden="true">→</i></A>
            </li>
            <li className="sg-fold" style={{ '--i': 5 }}>
              <h3>Get started with Sign</h3>
              <p className="sg-row-links"><A to={DOCS} className="sg-tlink">Read the docs →</A><A to={REPO} className="sg-tlink">View on GitHub →</A></p>
            </li>
            <li className="sg-get sg-fold" style={{ '--i': 6 }}>
              <h3>Get Sign</h3>
              <p>E-signature</p>
              <span className="sg-get-meta">
                <span className="sg-chip"><span>License:</span> AGPL-3.0</span>
                <A to="https://github.com/hanzoai" className="sg-chip">hanzoai</A>
                <A to="https://platform.hanzo.ai/deploy" className="sg-tlink"><span>Deploy to Cloud</span> <i aria-hidden="true">→</i></A>
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
      <Opening />
      <Parts />
      <Pad />
      <Cost />
      <First />
    </main>
  );
}
