'use client';
/* Payments (v2, archetype A "Launch"; Hanzo's deck only: greys and ink, MASTER §3).
   Persona: a developer or payments lead tied to one processor, who wants to route, retry and switch without a rewrite
   Goal: watch one checkout settle through the routing and the cascade, then start with Hanzo
   CTA: Try Hanzo -> /login (the header's solid ask; the page's own are quiet kit Ctas in the hero, with thumb, and the close; data-cta payments.hero / payments.close)
   Metric: signup_start
   Signature: a live calculator on the second screen, "Move a percentage first": type the order's amount and how many
   payments, drag the split by percentage and the soft-decline share, and every figure reprices at once: each
   processor's payments and value, how many fall through to the backup instead of to a customer, a hundred dots
   re-routing, and the amount on the hero phone and in the code sample. Computed only from the page's own figures
   (amount: 2000, usd; a hundred payments; the split; the cascade) and the visitor's inputs; no invented rates.
   Beyond: a checkout settling on one phone under the centred title (method, vault token, rule, soft decline, backup,
   `succeeded`), self-running with its own pause (WCAG 2.2.2); a tap on a step holds it.
   Entrances (docs/MOTION-MAP.md), one per main section, in page order, each once and page-local: 1 stretch-scroll on
   the calculator room (its content arrives stretched tall from the top and relaxes as it scrolls in), 2 curtain-rise
   on "What sits behind" (heading and rows rise from behind a clip), 3 word-shuffle on "One API in front of all of
   them" (its words start in each other's places and swap home), 4 side-carousel on the checkout (the method list
   rides in from the right in snapping steps), 5 stack-drop on the cases (the four tiles drop and stack in turn).
   The server render is the final state (JS off legible); reduced motion keeps the final state.
   Motion: the calculator (input), the checkout (idle) + cards that open (state, BizOpen). No pinned chapters: what
   sat behind the one integration is now a plain row list. Tweens only, deck timings. Every word and link is Hanzo's.
V2: 8/10 on the deck: h1 52, headings 26, figures 64; one phone runs the checkout on the first screen at both sizes, the calculator is the one black room under it; slice D: methods beside Hanzo's three lines (a method lights its line), tax cards draw their tick and cut VAT/GST in on arrival with their three lines at rest, tighter bands; five motion-map entrances (stretch-scroll, curtain-rise, word-shuffle, side-carousel, stack-drop)
*/
// Signature: a live calculator, "Move a percentage first": amount, payments, the split and the soft-decline share reprice every figure on the page at once, from Hanzo's own figures and the visitor's inputs.
import { useEffect, useRef, useState, Fragment } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { EASE_OUT_EXPO as EASE } from '../../../lib/motion';
import { A, More, Cta } from '../../kit';
import { useLive } from '../cloud/Frame';
import { Copy } from '../../ui';
import BizLines from '../../v2/BizLines';
import BizSheet from '../../v2/BizSheet';
import BizOpen from '../../v2/BizOpen';
import './Payments.css';

const API = 'https://docs.hanzo.ai/docs/openapi';
const QUICK = 'https://docs.hanzo.ai/docs/quickstart';
const GH = 'https://github.com/hanzoai';
const DEPLOY = 'https://platform.hanzo.ai/deploy';
const two = (n) => String(n).padStart(2, '0');

const METHODS = ['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay', 'Google Pay', 'iDEAL', 'Bancontact', 'SOFORT'];
const STEPS = [
  ['One integration', 'Cards, wallets, bank debits, buy-now-pay-later and crypto through the same API'],
  ['No card data', 'Numbers are tokenized in the vault, so this service never holds one'],
  ['Route on outcome', 'Send each payment to the processor most likely to approve it'],
  ['Retry elsewhere', 'A decline cascades to a backup rather than to your customer'],
];
const DUR = [3400, 3400, 3400, 5600];
const PICK = [4, 3, 6, 0];
const Lock = () => <svg viewBox="0 0 16 16" width="1em" height="1em" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>;
const Check = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* The page's entrances (see the top comment). useEnter: the section gets data-in once it first enters view and its CSS
   entrance plays (Payments.css, "entrances"); only under html.js, so with JS off nothing is ever hidden. Reduced
   motion (or no IntersectionObserver) sets data-in at once, and the CSS keeps every final state there. */
const still = () => typeof IntersectionObserver === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches;
function useEnter(threshold = 0.15, onIn) {
  const ref = useRef(null);
  const f = useRef(onIn);
  f.current = onIn;
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (still()) { el.dataset.in = '1'; return undefined; }
    const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; io.disconnect(); el.dataset.in = '1'; f.current?.(el); }, { threshold, rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}

/* 1 stretch-scroll: while the room scrolls in, its content is stretched tall from the top (scaleY up to 1.12) and
   relaxes to 1 by the time the room's top reaches 55% of the screen. Set on the client only, so the server render
   and JS off are the final state; nothing under reduced motion. */
function useStretch() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || still()) return undefined;
    let raf = 0;
    const set = () => {
      raf = 0;
      const top = el.parentElement.getBoundingClientRect().top, h = innerHeight;
      const p = Math.min(1, Math.max(0, (h - top) / (h * 0.45)));
      const e = 1 - (1 - p) * (1 - p) * (1 - p);
      el.style.transform = p >= 1 ? '' : `scaleY(${(1 + 0.12 * (1 - e)).toFixed(4)})`;
      el.style.opacity = p >= 1 ? '' : String((0.35 + 0.65 * e).toFixed(3));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(set); };
    set();
    addEventListener('scroll', on, { passive: true });
    addEventListener('resize', on);
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf); el.style.transform = ''; el.style.opacity = ''; };
  }, []);
  return ref;
}

/* 3 word-shuffle: a heading whose words sit in each other's places until it is reached, then swap home. The words are
   real text in order (server, JS off, screen readers); only transforms move, measured on the client. */
const SHUF = [3, 5, 0, 6, 1, 7, 2, 4];
function Shuffle({ as: Tag = 'h2', text, id, className }) {
  const words = text.split(' ');
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || still()) return undefined;
    const ws = [...el.querySelectorAll('.pay-w')];
    if (el.getBoundingClientRect().top < innerHeight * 0.85) return undefined; // already on screen: leave it be
    const place = () => {
      const r = ws.map((w) => w.getBoundingClientRect());
      ws.forEach((w, i) => {
        const j = SHUF.filter((k) => k < ws.length)[i] ?? i;
        w.style.transition = 'none';
        w.style.transform = `translate(${(r[j].left - r[i].left).toFixed(1)}px, ${(r[j].top - r[i].top).toFixed(1)}px)`;
        w.style.opacity = '.3';
      });
    };
    place();
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      ws.forEach((w, i) => {
        w.style.transition = `transform .75s cubic-bezier(.16, 1, .3, 1) ${i * 55}ms, opacity .5s cubic-bezier(.16, 1, .3, 1) ${i * 55}ms`;
        w.style.transform = '';
        w.style.opacity = '';
      });
      setTimeout(() => ws.forEach((w) => { w.style.transition = ''; }), 1400);
    }, { threshold: 1, rootMargin: '0px 0px -12% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [text]);
  return <Tag id={id} className={className} ref={ref}>{words.map((w, i) => <Fragment key={i}><span className="pay-w">{w}</span>{i < words.length - 1 ? ' ' : ''}</Fragment>)}</Tag>;
}

/* What the phone's screen shows at each of the four steps. */
function Screen({ at, live }) {
  const [m, setM] = useState(0);
  const [picked, setPicked] = useState(true);
  useEffect(() => {
    if (at !== 0 || !live) { setM(0); setPicked(true); return; }
    setPicked(false);
    const ts = PICK.map((v, i) => setTimeout(() => { setM(v); if (i === PICK.length - 1) setPicked(true); }, 150 + i * 620));
    return () => ts.forEach(clearTimeout);
  }, [at, live]);
  const inn = (d) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, ease: EASE, delay: d } });
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={at} className="pay-scr" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }} transition={{ duration: 0.45, ease: EASE }}>
        {at === 0 && (
          <>
            <ul className="pay-methods">{METHODS.map((t, i) => <li key={t} className={i === m ? (picked ? 'on' : 'hov') : ''}>{t}</li>)}</ul>
            <p className="pay-scr-api x-mono">hanzo.payments.create</p>
          </>
        )}
        {at === 1 && (
          <div className="pay-vault">
            <motion.p className="pay-field" initial={{ opacity: 1 }} animate={{ opacity: 0.4 }} transition={{ delay: 1.6, duration: 0.6 }}>
              <span>Card</span>
              <b className="x-mono">{['••••', '••••', '••••', '••••'].map((g, i) => <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.14, duration: 0.2 }}>{g}</motion.span>)}</b>
            </motion.p>
            <motion.i className="pay-down" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.6, ease: EASE, delay: 0.75 }} />
            <motion.p className="pay-tok x-mono" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, ease: EASE, delay: 1.25 }}><Lock />vault token</motion.p>
          </div>
        )}
        {at === 2 && (
          <div className="pay-rule">
            {['cost', 'success rate', 'latency'].map((t, i) => (
              <motion.p key={t} {...inn(0.1 + i * 0.1)} className={i === 1 ? 'pick' : ''}><span>{t}</span>{i === 1 && <motion.b initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, ease: EASE, delay: 0.85 }}>rule</motion.b>}</motion.p>
            ))}
            <motion.p className="pay-pick x-mono" {...inn(1.25)}>→ most likely to approve</motion.p>
          </div>
        )}
        {at === 3 && (
          <ol className="pay-try">
            <motion.li {...inn(0.1)}><span>attempt 1</span><motion.b className="x-mono pay-chip-no" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>soft decline</motion.b></motion.li>
            <motion.li {...inn(1.2)}><span>attempt 2 · backup</span><motion.b className="x-mono pay-chip-ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>&apos;succeeded&apos;</motion.b></motion.li>
            <motion.li className="pay-conn" {...inn(2.3)}><span className="x-mono">payment.connector</span><b className="x-mono">&apos;adyen&apos;</b></motion.li>
          </ol>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/* The phone: the merchant, the amount, the step's screen and the Pay button that ends on `succeeded`. */
const PauseIcon = ({ on }) => (on
  ? <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /></svg>
  : <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" fill="currentColor" /></svg>);

const USD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const usd = (cents) => USD.format(cents / 100);

function Phone({ at, live, big, held, onHold, amt = 2000 }) {
  const calm = useReducedMotion();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (at !== 3) { setOk(false); return; }
    const t = setTimeout(() => setOk(true), calm ? 0 : 2400);
    return () => clearTimeout(t);
  }, [at, calm]);
  return (
    <div className={'pay-phone' + (big ? ' big' : '')}>
      <div className="pay-phone-in">
        <i className="pay-island" aria-hidden="true" />
        {onHold && <button type="button" className="pay-pause" onClick={onHold} aria-pressed={held} aria-label={held ? 'Play' : 'Pause'}><PauseIcon on={held} /></button>}
        <div className="pay-merch"><img src="/models/enso.webp" alt="" width="48" height="48" /><span><b>Order 6735</b><em className="x-mono">usd</em></span></div>
        <p className="pay-amt"><span className="x-mono">amount: {amt}</span><b className="bz-fig">{usd(amt)}</b></p>
        <div className="pay-scr-wrap"><Screen at={at} live={live} /></div>
        <div className={'pay-btn' + (ok ? ' ok' : '')}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={ok ? 'ok' : 'pay'} initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -22, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>{ok ? <><Check />succeeded</> : 'Pay'}</motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Tracker({ at, pick, run }) {
  return (
    <div className="pay-track">
      <p className="pay-track-k"><span>A payment, routed</span><span className="x-mono">{two(at + 1)} / 04</span></p>
      <ol>
        {STEPS.map(([t], i) => (
          <li key={t} className={at === i ? 'on' : i < at ? 'past' : ''}>
            <button type="button" aria-pressed={at === i} onClick={() => pick(i)}>
              <span className="x-mono">{two(i + 1)}</span><b>{t}</b>
              <i className="pay-track-bar" aria-hidden="true">{at === i && run && <motion.b key={'b' + at} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: DUR[i] / 1000, ease: 'linear' }} />}</i>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Hero({ amt }) {
  const [ref, live] = useLive(0.25);
  const rm = useReducedMotion();
  const [calm, setCalm] = useState(false); // read after hydration, so the pause button renders the same on server and client
  useEffect(() => setCalm(!!rm), [rm]);
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => { if (calm) setAt(3); }, [calm]);
  useEffect(() => {
    if (!live || paused) return;
    const t = setTimeout(() => (held ? setHeld(false) : setAt((a) => (a + 1) % 4)), held ? 9000 : DUR[at]);
    return () => clearTimeout(t);
  }, [at, live, held, paused]);
  return (
    <section className="pay-hero" ref={ref} aria-labelledby="pay-h1">
      <div className="bz-wrap pay-head">
        <BizLines as="h1" id="pay-h1" className="bz-display" lines={['Hanzo Payments']} now />
        <p className="pay-cat x-mono">Payment orchestration</p>
      </div>
      <div className="bz-wrap bz-grid pay-hero-grid">
        <p className="bz-lede pay-lede">One integration, and the processor becomes a routing decision.</p>
        <div className="bz-stage pay-stage"><div className="bz-stage-in"><div className="pay-rise"><Phone at={at} live={live && !paused} big held={paused} onHold={calm ? null : () => setPaused(!paused)} amt={amt} /></div></div></div>
        <div className="pay-side">
          <div className="pay-acts">
            <Cta to="/login" id="payments.hero" thumb>Try Hanzo</Cta>
            <Cta kind="link" to={API} id="payments.apis">Explore APIs</Cta>
          </div>
          <Tracker at={at} pick={(i) => { setAt(i); setHeld(true); }} run={live && !held && !paused} />
        </div>
      </div>
    </section>
  );
}

/* What sits behind the one integration: the four steps the phone runs, as plain rows (the pinned chapters are gone). */
const Note = ({ t, d }) => <div className="pay-note"><p className="pay-note-t">{t}</p><p>{d}</p></div>;
const CH = [
  <Note key="w" t="Normalized webhooks" d="Every processor announces a settlement differently. You subscribe to one event shape and keep it when you add or drop a provider." />,
  null,
  <Note key="s" t="Smart routing" d="Choose the processor per payment on cost, success rate or latency. The rule lives here, so tuning it is a config change rather than a deploy." />,
  <Note key="c" t="Cascading retries" d="A soft decline is often a fact about one processor, not about the card. Failed attempts fall through to a backup automatically, and the customer sees one outcome." />,
];

function Behind() {
  const ref = useEnter(0.12);
  return (
    <section className="bz-sec pay-behind pay-curtain" aria-labelledby="pay-behind-h" ref={ref}>
      <header className="bz-wrap bz-grid pay-ch-head">
        <div className="pay-ch-h">
          <h2 id="pay-behind-h" className="bz-headline">What sits behind the one integration</h2>
        </div>
        <div className="bz-body pay-ch-body"><span className="pay-cat x-mono">Unified Payments Suite</span><p>Each processor has its own API, its own idea of an error, and its own webhook format. This normalises all three, so your code sees one shape whichever of them took the payment.</p></div>
      </header>
      <ol className="bz-wrap pay-steps" aria-label="A payment, routed">
        {STEPS.map(([t, d], i) => (
          <li key={t}>
            <span className="pay-steps-n x-mono">{two(i + 1)}</span>
            <h3 className="bz-title">{t}</h3>
            <p className="bz-body">{d}</p>
            {CH[i] || <span aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </section>
  );
}

const code = (amt) => `// Take a payment. You do not name the processor.
const payment = await hanzo.payments.create({
  amount: ${amt},
  currency: 'usd',
  customer: customer.id,
  metadata: { order_id: '6735' },
});

// The routing rule picked one, and says so.
// If it had declined, the cascade would already
// have tried the next and told you that instead.
console.log(payment.status);    // 'succeeded'
console.log(payment.connector); // 'adyen'`;

/* The code pane, page-local so each of Hanzo's code tokens stays one piece of text (the shared pane splits
   "payment.status" and "// 'succeeded'" into finer spans): a line is its command word, its plain code, its strings
   and its trailing comment, each a flat span; the comment that ends in `mark` is picked out. Styled by Frame.css. */
function PayCode({ text, mark }) {
  const line = (l) => {
    const at = l.indexOf('//');
    const src = at < 0 ? l : l.slice(0, at), com = at < 0 ? '' : l.slice(at);
    const out = [];
    src.split(/('[^']*')/).forEach((p, i) => {
      if (!p) return;
      if (i % 2) { out.push(<span key={'s' + i} className="s">{p}</span>); return; }
      const m = i === 0 && p.match(/^(\s*)([\w.]+)(.*)$/s);
      if (m && m[2]) { out.push(<span key={'k' + i} className="k">{m[1] + m[2]}</span>); if (m[3]) out.push(<span key={'r' + i}>{m[3]}</span>); } else out.push(<span key={'p' + i}>{p}</span>);
    });
    if (com) out.push(mark && com.includes(mark) ? <span key="c" className="c">{com.replace(mark, '')}<mark className="cf-mark">{mark}</mark></span> : <span key="c" className="c">{com}</span>);
    return out;
  };
  return (
    <div className="cf-code light">
      <div className="cf-code-bar"><i /><i /><i /><span className="cf-code-k">javascript</span><Copy text={text} /></div>
      <div className="cf-code-body"><pre><code>{text.split('\n').map((l, j) => <span key={j} className="cf-ln">{line(l)}{'\n'}</span>)}</code></pre></div>
    </div>
  );
}

const PIPE = ['Approval rates, cost and latency compared across processors, on one screen.', '3D Secure where the issuer asks for it, without a second integration.', 'Open source, so the routing logic is readable before you trust it.'];
const DEV = [['Easy to Implement', 'Quick integration with just a few lines of code, with SDKs for all major programming languages.'], ['Comprehensive Documentation', 'Detailed guides, API reference, and code examples to help you integrate Hanzo Payments quickly.'], ['Explore Our APIs', 'Get started with quickstart guides, examples, and developer tools.']];

function OneApi({ amt }) {
  return (
    <section className="bz-sec pay-api" aria-labelledby="pay-api-h">
      <div className="bz-wrap bz-grid">
        <div className="pay-api-copy">
          <Shuffle id="pay-api-h" className="bz-headline" text="One API in front of all of them" />
          <p className="bz-body">The connectors are the product. Each is a real implementation of one processor’s API, kept behind a single interface so your side never learns their differences.</p>
          <div className="pay-api-note">
            <h3 className="bz-title">The processor is not in your code</h3>
            <p className="bz-body">You ask for a payment. Which company took it is an answer, not an argument.</p>
          </div>
          <div className="pay-api-acts">
            <More to={API}>API Reference</More>
            <BizSheet label="See the spec" kick="Hanzo Payments" title="Explore Our APIs">
              <ul className="pay-sheet-list">
                {DEV.map(([t, d]) => <li key={t}><h3 className="bz-title">{t}</h3><p className="bz-body">{d}</p></li>)}
              </ul>
              <div className="pay-sheet-go"><More to={API}>API Reference</More></div>
            </BizSheet>
          </div>
        </div>
        <div className="pay-api-code"><PayCode text={code(amt)} mark="'adyen'" /></div>
        <div className="pay-pipe">
          <h3 className="bz-title">What you can see once it is one pipe</h3>
          <ul>{PIPE.map((t) => <li key={t}><Check /><span>{t}</span></li>)}</ul>
        </div>
      </div>
    </section>
  );
}

const FEATS = [
  ['Checkout Interface', 'Fully customizable checkout UI that matches your brand and maximizes conversions.', 'Customizable checkout flow'],
  ['Global Reach', 'Regional processors are connectors like any other, so entering a market is a routing rule rather than a new integration.'],
  ['Mobile Optimized', 'Responsive checkout flows designed for high conversion on all devices and screen sizes.'],
  ['Fully Customizable', 'Customize every aspect of the checkout experience to match your brand identity.'],
];

/* which of Hanzo's lines a method belongs to: cards and wallets are line 01; iDEAL, Bancontact and SOFORT are the local
   methods of lines 02 and 03. Pointing at a method lights its line, so the list says what it is rather than being a wall. */
const KIND = [0, 0, 0, 0, 0, 0, 1, 1, 1];
const CO_LINES = ['Cards, wallets, bank debits, buy-now-pay-later and crypto', 'Local methods handled by whichever processor supports them best', 'The method someone expects to see, in the country they are in'];

function Checkout() {
  const [ref, live] = useLive(0.4);
  const ride = useEnter(0.5);
  const [kind, setKind] = useState(-1);
  const [lit, setLit] = useState(false); // the methods light one by one the first time the list is reached, then stay
  useEffect(() => { if (live) setLit(true); }, [live]);
  return (
    <section className="bz-sec pay-co" aria-labelledby="pay-co-h" ref={ref}>
      <div className="bz-wrap">
        <div className="bz-grid pay-co-top">
          <h2 id="pay-co-h" className="bz-headline">Customizable Checkout Experiences</h2>
          <div className="pay-co-side">
            <p className="bz-body">Create beautiful, high-converting checkout flows that drive revenue growth and customer satisfaction.</p>
            <BizSheet label="See the checkout" kick="Checkout" title="Customizable Checkout Experiences">
              <ul className="pay-sheet-list">
                {FEATS.map(([t, d, tag]) => <li key={t}><h3 className="bz-title">{t}</h3><p className="bz-body">{d}</p>{tag && <span className="pay-tag x-mono">{tag}</span>}</li>)}
              </ul>
            </BizSheet>
          </div>
        </div>
        <div className="bz-grid pay-co-body" data-kind={kind < 0 ? undefined : kind}>
          <div className="pay-co-l pay-ride" ref={ride}>
            <h3 className="bz-kick pay-co-k">Global Payment Methods</h3>
            <ul className={'pay-co-methods' + (lit ? ' lit' : '')} onPointerLeave={() => setKind(-1)}>
              {METHODS.map((t, i) => <li key={t} style={{ '--i': i }} className={kind >= 0 && KIND[i] === kind ? 'on' : ''} onPointerEnter={() => setKind(KIND[i])}>{t}</li>)}
            </ul>
          </div>
          <ul className="pay-co-lines">
            {CO_LINES.map((t, i) => <li key={t} className={kind < 0 ? '' : (i === 0 ? kind === 0 : kind === 1) ? 'on' : 'off'} style={{ '--i': i }}><span className="x-mono">{two(i + 1)}</span><span className="pay-co-lt">{t}</span></li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

const Shield = () => <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 6 10 14v16c0 14 9.5 24 22 28 12.5-4 22-14 22-28V14z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" /><path className="pay-tick" pathLength="1" d="M22 32l7 7 13-14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const TAX = [
  ['tax', 'Automated Tax Management', 'Automatically handle VAT, GST, and regional taxes (including sales tax).', ['Real-time tax rate calculation', 'Tax exemption handling', 'Automated tax reporting'], <span className="pay-glyph bz-fig" key="g"><span className="pay-vg">VAT</span><br /><span className="pay-vg">GST</span></span>],
  ['fraud', 'Fraud Protection', 'Automatic fraud detection and prevention built-in to protect your business.', ['Machine learning fraud detection', 'Adaptive risk rules', 'Chargeback protection'], <span className="pay-glyph shield" key="g"><Shield /></span>],
];

/* on arrival, once: VAT then GST cut in, the shield's tick draws, and each card's three lines tick in under it */
function Tax() {
  const [ref, live] = useLive(0.35);
  const [inn, setInn] = useState(false);
  useEffect(() => { if (live) setInn(true); }, [live]);
  return (
    <section className={'bz-sec pay-tax' + (inn ? ' in' : '')} aria-labelledby="pay-tax-h" ref={ref}>
      <div className="bz-wrap bz-grid">
        <BizOpen
          label="Automatic Global Tax Compliance"
          className="pay-tax-open"
          items={TAX.map(([id, t, d, li, g]) => ({
            id,
            label: t,
            card: <>{g}<span className="pay-tc-li" aria-hidden="true">{li.map((x, i) => <span key={x} style={{ '--i': i }}><Check />{x}</span>)}</span><span className="pay-tc-t bz-title">{t}</span><span className="pay-tc-d">{d}</span></>,
            panel: (
              <div className="pay-panel">
                <div className="pay-panel-g">{g}</div>
                <div>
                  <h3 className="bz-headline">{t}</h3>
                  <p className="bz-lede">{d}</p>
                  <ul className="pay-panel-list">{li.map((x) => <li key={x}><Check />{x}</li>)}</ul>
                </div>
              </div>
            ),
          }))}
        />
        <div className="pay-tax-copy">
          <h2 id="pay-tax-h" className="bz-headline">Automatic Global Tax Compliance</h2>
          <p className="bz-body">Focus on your business while Hanzo handles the complexity of global tax regulations and compliance.</p>
        </div>
      </div>
    </section>
  );
}

/* Beyond: the traffic split. A hundred payments, each with a fixed place in the queue; the share you drag re-routes them. */
const RANK = (() => {
  const a = [...Array(100).keys()];
  let s = 11;
  for (let i = 99; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor((s / 233280) * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
})();

/* The calculator (signature). Built only from the page's own figures (the order's amount: 2000, usd; a hundred
   payments; the split by percentage; a soft decline cascading to a backup) and the visitor's own numbers. Every figure
   reprices the moment a field or slider moves, including the phone's amount and the code sample above and below. */
const RANK2 = (() => {
  const a = [...Array(100).keys()];
  let s = 29;
  for (let i = 99; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor((s / 233280) * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
})();
const fmtN = (n) => n.toLocaleString('en-US');

function Field({ k, unit, value, onChange, onBlur, mode, label }) {
  return (
    <label className="pay-calc-f">
      <span className="x-mono">{k}</span>
      <span className="pay-calc-in">
        {unit === '$' && <i aria-hidden="true">$</i>}
        <input type="text" inputMode={mode} value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} aria-label={label} autoComplete="off" spellCheck={false} />
        {unit && unit !== '$' && <i aria-hidden="true">{unit}</i>}
      </span>
    </label>
  );
}

function Move({ amt, setAmt }) {
  const [pct, setPct] = useState(20);
  const [act, setAct] = useState(false);
  const [n, setN] = useState(100);
  const [dec, setDec] = useState(0);
  const [amtS, setAmtS] = useState((amt / 100).toFixed(2));
  const [nS, setNS] = useState('100');
  const prev = useRef(20);
  const stretch = useStretch();
  const from = prev.current;
  useEffect(() => { prev.current = pct; }, [pct]);
  const onAmt = (v) => { const s = v.replace(/[^\d.]/g, ''); setAmtS(s); const c = Math.round(parseFloat(s) * 100); if (c > 0 && c <= 100000000) setAmt(c); };
  const onN = (v) => { const s = v.replace(/\D/g, '').slice(0, 7); setNS(s); const k = parseInt(s, 10); if (k > 0) setN(k); };
  // the plan: shares of the payments, their value, and how many fall through to the backup instead of to a customer
  const n2 = Math.round((n * pct) / 100), n1 = n - n2;
  const k = Math.round((n1 * dec) / 100);
  const perC = Math.round(((100 - pct) * dec) / 100); // of the hundred dots
  const casc = new Set(RANK2.filter((r) => RANK[r] >= pct).slice(0, perC));
  return (
    <section className="bz-sec pay-move" data-room="dark" aria-labelledby="pay-move-h">
      <div className="bz-wrap pay-stretch" ref={stretch}>
        <div className="bz-grid pay-move-top">
          <div className="pay-move-h">
            <h2 id="pay-move-h" className="bz-headline">Move a percentage first</h2>
          </div>
          <p className="bz-body pay-move-b">The reason nobody switches is the rewrite. When the integration is here, moving is a routing change, and you can move a percentage first.</p>
        </div>
        <div className={'pay-move-obj' + (act ? ' act' : '')}>
          <p className="pay-move-k x-mono">One traffic, two routes</p>
          <div className="pay-calc-row">
            <Field k="amount" unit="$" mode="decimal" value={amtS} onChange={onAmt} onBlur={() => setAmtS((amt / 100).toFixed(2))} label="Order amount in US dollars" />
            <Field k="payments" mode="numeric" value={nS} onChange={onN} onBlur={() => setNS(String(n))} label="Number of payments" />
            <p className="pay-calc-code x-mono" aria-hidden="true">amount: {amt}<br />currency: &apos;usd&apos;</p>
          </div>
          <div className="pay-move-figs" aria-live="polite">
            <p className="b"><span>second processor</span><b className="bz-fig">{pct}%</b><em className="x-mono">{fmtN(n2)} · {usd(n2 * amt)}</em></p>
            <p><span>current processor</span><b className="bz-fig">{100 - pct}%</b><em className="x-mono">{fmtN(n1)} · {usd(n1 * amt)}</em></p>
          </div>
          <label className="pay-move-bar">
            <span className="bz-kick">Split by percentage</span>
            <input type="range" min="0" max="100" step="5" value={pct} onChange={(e) => setPct(+e.target.value)} onPointerDown={() => setAct(true)} onPointerUp={() => setAct(false)} onPointerCancel={() => setAct(false)} onBlur={() => setAct(false)} style={{ '--f': String(pct / 100) }} aria-valuetext={pct + '% to the second processor'} />
          </label>
          <div className="pay-casc">
            <label className="pay-casc-in">
              <span className="x-mono">soft decline · current processor</span>
              <input type="range" min="0" max="50" step="1" value={dec} onChange={(e) => setDec(+e.target.value)} style={{ '--f': String(dec / 50) }} aria-label="Soft declines on the current processor, in percent" aria-valuetext={dec + '% soft decline'} />
              <b className="x-mono">{dec}%</b>
            </label>
            <p className="pay-casc-out" aria-live="polite"><span className="x-mono">attempt 2 · backup</span><b>{fmtN(k)} · {usd(k * amt)}</b><em>{k ? 'Failed attempts fall through to a backup automatically, and the customer sees one outcome.' : 'A decline cascades to a backup rather than to your customer'}</em></p>
          </div>
          <div className="pay-move-dots" aria-hidden="true">
            {RANK.map((r, i) => <i key={i} className={r < pct ? 'b' : casc.has(i) ? 'c' : ''} style={{ '--d': Math.min(600, Math.abs(r - from) * 14) + 'ms' }} />)}
          </div>
          <div className="pay-move-acts">
            <button type="button" className="pay-back" onClick={() => setPct(0)} disabled={pct === 0}>Roll back at once</button>
            <p className="pay-move-key x-mono"><span><i className="b" />second processor</span><span><i />current processor</span><span><i className="c" />backup</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}

const CASES = [
  ['Selling in several countries', 'You sell in more than one country and each one wants a different payment method. Add the connector, write the rule, leave the checkout alone.', ['Local methods', 'Currency routing', 'One checkout', 'Rules per country']],
  ['Recovering declines', 'Renewals fail for reasons that have nothing to do with the customer. Retrying through a second processor turns some of those failures back into payments.', ['Retry on a second processor', 'Decline reasons', 'Renewal recovery', 'Rules per code']],
  ['Leaving a processor', 'The reason nobody switches is the rewrite. When the integration is here, moving is a routing change, and you can move a percentage first.', ['Move a percentage first', 'No checkout rewrite', 'The same API', 'Roll back at once']],
  ['Comparing two of them', 'Run both and read the approval rates side by side. The argument about which processor is better becomes a measurement.', ['Approval rates side by side', 'Split by percentage', 'One traffic, two routes', 'Cost per authorization']],
];

function Cases() {
  const ref = useEnter(0.25); // the four cases drop and stack in turn the first time they are reached
  return (
    <section className="bz-sec pay-cases pay-stack" aria-labelledby="pay-cases-h" ref={ref}>
      <div className="bz-wrap">
        <div className="bz-grid pay-cases-top">
          <h2 id="pay-cases-h" className="bz-headline">When a switch earns its place</h2>
          <p className="bz-lede">One processor and one country does not need one. These four do.</p>
        </div>
        <BizOpen
          label="When a switch earns its place"
          className="pay-case-grid"
          items={CASES.map(([t, d, f], i) => ({
            id: 'case' + i,
            label: t,
            className: 'pay-case c' + i,
            card: <><span className="pay-case-n bz-fig">{two(i + 1)}</span><span className="pay-case-t bz-title">{t}</span><span className="pay-case-f x-mono">{f.join(' · ')}</span></>,
            panel: (
              <div className="pay-cp">
                <h3 className="bz-headline">{t}</h3>
                <p className="pay-cp-k x-mono">{two(i + 1)} / 04</p>
                <p className="bz-lede">{d}</p>
                <h4 className="pay-cp-h">Key Features</h4>
                <ul className="pay-cp-f">{f.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
            ),
          }))}
        />
      </div>
    </section>
  );
}

const Gh = () => <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;

/* Where to read further, and the Get block: quiet rows before the close. */
function Further() {
  return (
    <section className="bz-sec pay-more" aria-labelledby="pay-fur-h">
      <div className="bz-wrap bz-grid">
        <div className="pay-fur">
          <h2 id="pay-fur-h" className="bz-title">Explore Further</h2>
          <p className="bz-body">The API reference, and the guide to putting the checkout on your site.</p>
          <A to={API} className="pay-fur-a"><span className="pay-fur-t">API Reference</span><span>Detailed documentation on all Hanzo Payments APIs and integration options.</span><span className="pay-fur-go">View API Docs →</span></A>
          <A to={QUICK} className="pay-fur-a"><span className="pay-fur-t">Checkout Integration</span><span>Step-by-step guide to integrating Hanzo Payments checkout into your website or app.</span><span className="pay-fur-go">Integration Guide →</span></A>
        </div>
        <div className="pay-get">
          <h3 className="pay-get-h">Get Payments</h3>
          <p className="pay-get-t">Payments processor</p>
          <div className="pay-chips">
            <span className="pay-chip"><span>License:</span> Apache-2.0</span>
            <A to={GH} className="pay-chip"><Gh />hanzoai</A>
          </div>
          <More to={DEPLOY}>Deploy to Cloud</More>
        </div>
      </div>
    </section>
  );
}

/* The close: one sentence at Display size, the same ask, one full-width text row. */
function End() {
  return (
    <section className="bz-sec pay-end" aria-labelledby="pay-one">
      <div className="bz-wrap">
        <BizLines id="pay-one" className="bz-display md" lines={['Put one payment', 'through it']} />
        <div className="bz-grid pay-end-row">
          <p className="bz-lede">Point it at the processor you already use, send a live payment, and add the second one when you want to see the difference. Nothing has to move on day one.</p>
          <div className="pay-end-go"><Cta to="/login" id="payments.close">Try Hanzo</Cta></div>
        </div>
        <A to="/contact-sales" className="pay-row"><span>Contact Sales</span><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></A>
      </div>
    </section>
  );
}

export default function Payments() {
  const [amt, setAmt] = useState(2000); // the order's amount in cents, as Hanzo's own request sends it
  return (
    <main className="bz pay">
      <span data-ask-name="Hanzo Payments" hidden />
      <Hero amt={amt} />
      <Move amt={amt} setAmt={setAmt} />
      <Behind />
      <OneApi amt={amt} />
      <Checkout />
      <Tax />
      <Cases />
      <Further />
      <End />
    </main>
  );
}
