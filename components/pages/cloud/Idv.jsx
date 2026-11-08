'use client';
// Persona: a team onboarding users that must verify identity with a vendor.
// Goal: see that the vendor is configuration and only a proven verdict counts.
// CTA: View on GitHub (idv.hero, idv.close).
// Metric: cta_click idv.hero
// Signature: a verdict, or nothing: four calls stay put while the vendor turns and each answers its honest way.
// Beyond: a real HMAC-SHA256 check in the browser, played as you scroll: a changed body, a forgery, an empty signing secret.
/* IDV (v2, archetype A Launch).
   V2: 8/10 round 5: the stacked sheets are all one height on a desk, so an outgoing sheet is covered whole and only its 16px edge peeks, dimmed and stepped back with its words kept (never an empty slab); three sheet shapes (01 one huge counting 4, 03 the signature full width over a split, the rest 8/5 splits) and no repeated four-call list; sheet titles cut into their line; the lede finishes in full ink and leads on a phone; all four vendors always visible (two rows of two on a phone) with a hover that names how each answers; "the rest" strikes only "approved"; the forge opens under Hanzo's own title at 26px as a rounded card that opens to full width, reads data, choice, verdict in order, and each verdict leads with its word (accepted, polled, refusal) over Hanzo's sentence; deck greys only, one ask.
   Signature: a verdict, or nothing. In the hero, the same four calls go to whichever vendor is configured; the vendor
   turns (Jumio, Onfido, Plaid, the rest) and the verdict lane shows how each answers: a signed webhook that proves
   itself, a poll to the source, or a refusal until the parsing is written.
   Supporting: kinetic title lines; Hanzo's intro inks in word by word just after load (staged type); the six facts
   as sticky sheets that stack over each other, each playing its own small object once when it arrives.
   Beyond: a real HMAC-SHA256 over the raw body, in your browser (Idv.sign.mjs, self-check Idv.sign.test.mjs). The
   secret is "a key everybody knows" and the body is "rejected", both Hanzo's words; changing the body to "approved" or
   forging the signature is not accepted, and an empty signing secret is refused. Nothing leaves the page.
   Greys only (Hanzo's deck). Every word and link is Hanzo's.
   Server and client render the same first frame everywhere: every object's HTML is its finished state (true values,
   readable with JS off); after mount, objects below the fold rewind and play once when they arrive. Reduced motion
   keeps the finished state, the forge does not pin and nothing plays on scroll.
   Persona: a team onboarding users that must verify identity with a vendor (Jumio, Onfido, Plaid).
   Goal: see that the vendor is configuration, that only a proven verdict counts, and try a forged webhook.
   CTA: View on GitHub (hero, the sticky ask bar and the close; one solid button per screen). */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useMotionValueEvent, useInView, useReducedMotion, animate } from 'motion/react';
import { Cta } from '../../kit';
import { useLive, useSteps } from './Frame';
import { hmac, verify } from './Idv.sign.mjs';
import { Lines } from '../../v2/LiftStage';
import ShipPrompt from '../../v2/ShipPrompt';
import GetIt from '../../v2/GetIt';
import LivePause, { usePause } from '../../v2/LivePause';
import '../../v2/v2scale.css';
import './Idv.css';

const EASE = [0.16, 1, 0.3, 1];
const CALLS = ['start a verification', 'check its status', 'parse a webhook', 'name yourself'];
// [vendor, how it answers, the verdict line, kind]: every phrase is Hanzo's (the intro and the six facts)
const VENDORS = [
  ['Jumio', 'webhook', 'HMAC-SHA256', 'ok'],
  ['Onfido', 'webhook', 'HMAC-SHA256', 'ok'],
  ['Plaid', 'polling', 'polled from the provider', 'poll'],
  ['the rest', 'refuse', 'refuse until their response parsing is written', 'no'],
];
// what each vendor's answer is, shown under its tab on hover (the "how" words, all Hanzo's)
const HOW = Object.fromEntries(VENDORS.map(([n, h]) => [n, h]));
const TICK = <svg className="iv-tk" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M4 10.5l4 4 8-9" /></svg>;
const CROSS = <svg className="iv-tk" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" /></svg>;

/* The hero object settles as the page moves on: the same style on server and client (motion values start at identity),
   so the first frame is the finished card; reduced motion holds it still in CSS. */
function Settle({ children, className }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.2', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 32]);
  return (
    <div ref={ref} className={className}>
      <motion.div className="iv-settle" style={{ scale, y, transformOrigin: '50% 30%' }}>{children}</motion.div>
    </div>
  );
}

/* The switchboard: the four calls stay put; the vendor under them turns; the verdict lane answers its own way.
   A hover on a vendor previews its verdict without taking over; the board leans (2.5° at most) toward a fine pointer. */
function Board() {
  const [ref, seen] = useLive(0.3);
  const [paused, togglePause] = usePause();
  const live = seen && !paused;
  const [v, pick] = useSteps(VENDORS.length, 3000, live);
  const [peek, setPeek] = useState(null);
  const shown = peek ?? v;
  const [name, how, verdict, k] = VENDORS[shown];
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const lean = (e) => {
    if (e.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 5);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 5);
  };
  const rest = () => { animate(rx, 0, { duration: 0.4, ease: EASE }); animate(ry, 0, { duration: 0.4, ease: EASE }); };
  // on a phone the vendors are one sideways rail: keep the vendor being shown in view (the rail scrolls, never the page)
  const rail = useRef(null);
  useEffect(() => {
    const r = rail.current, b = r && r.children[v];
    if (!r || !b || r.scrollWidth <= r.clientWidth) return;
    const inView = b.offsetLeft >= r.scrollLeft && b.offsetLeft + b.offsetWidth <= r.scrollLeft + r.clientWidth * 0.82;
    if (inView) return;
    r.scrollTo({ left: v === 0 ? 0 : Math.max(0, b.offsetLeft - 16), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }, [v]);
  return (
    <div className="lp-host">
    <LivePause paused={paused} onToggle={togglePause} className="iv-pause" />
    <motion.div className="iv-board" ref={ref} style={{ rotateX: rx, rotateY: ry, transformPerspective: 1400 }} onPointerMove={lean} onPointerLeave={rest}>
      <div className="iv-vendors" role="tablist" aria-label="identity-verification vendors" ref={rail}>
        {VENDORS.map(([n], i) => (
          <button key={n} type="button" role="tab" aria-selected={v === i} onClick={() => pick(i)}
            onPointerEnter={(e) => e.pointerType === 'mouse' && setPeek(i)} onPointerLeave={() => setPeek(null)}>
            {v === i && <motion.span layoutId="iv-v" className="iv-v-bg" transition={{ duration: 0.3, ease: EASE }} />}
            <span className="iv-v-t">{n}</span>
            <span className="iv-v-hint" aria-hidden="true">{HOW[n]}</span>
          </button>
        ))}
      </div>
      <div className="iv-wire" aria-hidden="true">
        <ol className="iv-calls">
          {CALLS.map((c, i) => <li key={c}><span>{String(i + 1).padStart(2, '0')}</span>{c}</li>)}
        </ol>
        <div className="iv-line"><motion.i key={shown} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, ease: EASE }} /></div>
        <div className="iv-vslot">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={shown} className={'iv-verdict ' + k} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10, transition: { duration: 0.12 } }} transition={{ duration: 0.45, ease: EASE, delay: peek === null ? 0.2 : 0.05 }}>
              <p className="iv-vn">{name}</p>
              <p className="iv-how">{how}</p>
              {/* the rest: only "approved" (what they used to return) is struck; Hanzo's true statement stays in ink */}
              {k === 'no' && <p className="iv-was"><span>approved</span></p>}
              <p className="iv-says">{k === 'ok' && TICK}<span>{verdict}</span></p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
    </div>
  );
}

const INTRO = 'Hanzo IDV is one interface in front of the identity-verification vendors, so which vendor you use is a line of configuration rather than a rewrite of your onboarding. It does not verify anybody itself. It starts a check with the provider you chose, reads the verdict back, and proves that a callback came from them and not from someone who guessed the URL. Jumio and Onfido work end to end today; Plaid works by polling; the rest refuse until their response parsing is written, which is stated here because a verification service that guesses is worse than one that says it cannot tell.';
const WORDS = INTRO.split(' ');
const FIRST = WORDS.indexOf('onboarding.') + 1; // the first sentence: in ink from the first paint

/* Hanzo's intro is the hero lede: one paragraph (as Hanzo wrote it, one flowing line of text with no break of ours),
   the first sentence in ink from the first paint, the rest inked in word by word over 1.4 s after load (one CSS
   variable; no per-word state). The closing clause inks last. Reduced motion: all ink at once (CSS). */
function Lede() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.style.setProperty('--p', '1'); return; }
    const p = animate(0, 1, { duration: 1.4, delay: 0.35, ease: [0.4, 0, 0.2, 1], onUpdate: (v) => el.style.setProperty('--p', v.toFixed(3)) });
    return () => p.stop();
  }, []);
  // --i runs 0 to 0.88 so the last word reaches full ink before --p reaches 1 (at rest nothing stays grey)
  const word = (w, i) => <span key={i} className={i < FIRST ? 'on' : undefined} style={{ '--i': (0.88 * (i - FIRST) / (WORDS.length - FIRST)).toFixed(3) }}>{w} </span>;
  return <p className="iv-lede" ref={ref} style={{ '--p': 0 }}>{WORDS.map(word)}</p>;
}

/* One sheet object's little script: it renders finished (server and first client frame), rewinds after mount while
   still unseen, and plays once to the finish when half of it is on screen. Reduced motion stays finished. */
function useStage(max, ms) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const calm = useReducedMotion();
  const [s, setS] = useState(max);
  useEffect(() => {
    if (calm) { setS(max); return; }
    if (!seen) { setS(0); return; }
    let k = 0, t;
    const step = () => { k += 1; setS(k); if (k < max) t = setTimeout(step, ms); };
    t = setTimeout(step, 220);
    return () => clearTimeout(t);
  }, [seen, calm, max, ms]);
  return [ref, s];
}

// The demo's secret and body are Hanzo's own words; HEX is HMAC-SHA256(SECRET, BODY), the value the forge computes live.
const SECRET = 'a key everybody knows';
const BODY = 'rejected';
const TAMPER = 'approved';
const HEX = '3e0a3f07e38a0f77005d918935b9cc388c685af72cf9bd0274457e042aa2e2cd';
const RISK = ['Sanctions lists', 'transaction monitoring', 'cases', 'the five-year record clock'];

/* 01: one big figure that counts up to 4 (the HTML holds 4; reduced motion stays at 4). The four calls themselves are
   the hero's; this sheet does not list them again. */
function Four() {
  const [ref, s] = useStage(4, 320);
  return (
    <figure className="iv-o iv-o-four" ref={ref}>
      <p className="iv-o-n" aria-hidden="true">{s}</p>
      <figcaption className="v2-kick iv-o-cap">What it is</figcaption>
    </figure>
  );
}

/* 02: approved is struck through, and the provider refuses instead. */
function Refuses() {
  const [ref, s] = useStage(2, 650);
  return (
    <figure className="iv-o iv-o-ref" ref={ref} aria-hidden="true" data-s={s}>
      <p className="iv-o-tag">the rest</p>
      <p className="iv-o-was"><span>approved</span><i /></p>
      <p className="iv-o-now">refuses</p>
    </figure>
  );
}

/* 03: the signature resolves four characters at a time: the real HMAC of the forge's body under its secret. */
function Hex() {
  const [ref, s] = useStage(16, 70);
  const n = s * 4;
  return (
    <figure className="iv-o iv-o-hex" ref={ref} aria-hidden="true">
      <p className="iv-o-tag">HMAC-SHA256</p>
      <code className="iv-o-code">{HEX.slice(0, n)}<span>{'·'.repeat(HEX.length - n)}</span></code>
      <p className="iv-o-tick" data-on={s >= 16 || undefined}>{TICK}<span>compared in constant time</span></p>
    </figure>
  );
}

/* 04: a poll walks to the provider and back with the verdict from the source. */
function Poll() {
  const [ref, s] = useStage(4, 520);
  return (
    <figure className="iv-o iv-o-poll" ref={ref} aria-hidden="true">
      <div className="iv-o-track">
        <span className="iv-o-end">Plaid</span>
        <span className="iv-o-ticks">{[0, 1, 2].map((k) => <i key={k} data-on={s > k || undefined} />)}</span>
        <span className="iv-o-end">polled</span>
      </div>
      <p className="iv-o-tick" data-on={s >= 4 || undefined}>polled from the provider</p>
    </figure>
  );
}

/* 05: KMS feeds both tokens; the environment-variable fallback is struck out. */
function Kms() {
  const [ref, s] = useStage(3, 420);
  return (
    <figure className="iv-o iv-o-kms" ref={ref} aria-hidden="true" data-s={s}>
      <p className="iv-o-root">KMS</p>
      <ul>
        <li data-on={s >= 1 || undefined}><i />API token</li>
        <li data-on={s >= 2 || undefined}><i />webhook token</li>
        <li className="off" data-on={s >= 3 || undefined}><i /><span>environment variable</span></li>
      </ul>
    </figure>
  );
}

/* 06: verification on one side, screening on the other, a line between them. */
function Split() {
  const [ref, s] = useStage(5, 260);
  return (
    <figure className="iv-o iv-o-split" ref={ref} aria-hidden="true" data-s={s}>
      <div className="iv-o-side">
        <p className="iv-o-big">Hanzo IDV</p>
      </div>
      <i className="iv-o-rule" />
      <div>
        <p className="iv-o-tag">Hanzo Risk</p>
        <ul>{RISK.map((r, k) => <li key={r} data-on={s > k || undefined}>{r}</li>)}</ul>
      </div>
    </figure>
  );
}

const FACTS = [
  ['Four calls, whichever vendor', 'Start a verification, check its status, parse a webhook, name yourself. Every provider implements the same four, so swapping one for another is configuration and not a rewrite of your onboarding.', Four],
  ['A verdict, or nothing', 'A provider whose response we do not parse refuses rather than answering. Two of them used to return approved without reading the reply — one for any response that was not an error, the other including a rejected document. Anything gating on that would have admitted an unverified person, so both now refuse until the parsing is written.', Refuses],
  ['A webhook has to prove it is one', 'Signatures are HMAC-SHA256 over the raw body, compared in constant time, with the header matched case-insensitively because the wire spelling and the canonical spelling differ. An empty signing secret is a refusal, never a skip — an HMAC under a key everybody knows is one anybody can compute.', Hex],
  ['Polling where a callback cannot be trusted', 'Every result is verified before it counts. A webhook whose signature we can check is accepted; anything else is polled from the provider directly, so the verdict always comes from the source.', Poll],
  ['Credentials come from KMS', "The API token bills per check and the webhook token is what separates a provider's verdict from a forgery, so neither is a literal in the code and neither falls back to an environment variable. A missing secret fails at construction rather than producing a provider that quietly runs without one.", Kms],
  ['Verification is not screening', 'Proving somebody is who they say is a different job from watching what they do afterwards. Sanctions lists, transaction monitoring, cases and the five-year record clock live in Hanzo Risk, and this does not duplicate them.', Split],
];

/* One fact sheet. The sheets still stack (each sticks a little lower than the last), but nothing is ever sliced: a
   sheet's words and object fade out (and the sheet sinks a touch) while the next sheet is still rising below it, before
   its edge can reach them. The timing comes from a marker in the flow just above the next sheet (sticky sheets cannot
   be measured themselves). Server and first client render are identical (opacity 1, no transform); phones and reduced
   motion drop the stacking in CSS, so every sheet and its object read whole. */
function Sheet({ i, t, d, Obj, next }) {
  const { scrollYProgress } = useScroll({ target: next, offset: ['start end', 'start start'] });
  const last = i === FACTS.length - 1;
  // the outgoing sheet keeps its words and object: it dims and steps back (0.94) while the next one covers it, so it is
  // never an empty slab; every sheet is the same height on desktop, so only a 16px edge of it peeks above the next
  const dim = useTransform(scrollYProgress, [0.45, 0.95], [1, last ? 1 : 0.35]);
  const sink = useTransform(scrollYProgress, [0.3, 0.95], [1, last ? 1 : 0.94]);
  const title = useRef(null);
  const seen = useInView(title, { once: true, amount: 0.6 });
  return (
    <motion.article className={'iv-sheet s' + (i + 1)} style={{ '--k': i, scale: sink }}>
      <motion.div className="iv-sheet-in" style={{ opacity: dim }}>
        <div className="iv-sheet-l">
          {/* the title cuts into its line once (line mask, CSS); its words are in the HTML and JS-off shows them */}
          <h3 className="v2-headline iv-cut" id={'iv-f' + i} ref={title} data-in={seen || undefined}><span><span>{t}</span></span></h3>
          <p className="v2-kick acc iv-sheet-n">{String(i + 1).padStart(2, '0')} / 06</p>
          <p className="v2-body">{d}</p>
        </div>
        <div className="iv-sheet-r"><Obj /></div>
      </motion.div>
    </motion.article>
  );
}

function Sheets() {
  const marks = useRef(FACTS.map(() => ({ current: null }))).current;
  // on a desk-size screen every sheet takes the tallest sheet's height, so a sheet is always fully covered by the next
  // (only its 16px top edge peeks); phones and reduced motion unstack and keep their natural heights
  const wrap = useRef(null);
  useEffect(() => {
    const w = wrap.current;
    if (!w) return;
    const mq = matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)');
    const fit = () => {
      w.style.removeProperty('--iv-h');
      if (!mq.matches) return;
      const h = Math.max(...[...w.querySelectorAll('.iv-sheet')].map((s) => s.offsetHeight));
      w.style.setProperty('--iv-h', h + 'px');
    };
    fit();
    let t;
    const later = () => { clearTimeout(t); t = setTimeout(fit, 150); };
    addEventListener('resize', later);
    mq.addEventListener('change', fit);
    document.fonts?.ready?.then(fit);
    return () => { clearTimeout(t); removeEventListener('resize', later); mq.removeEventListener('change', fit); };
  }, []);
  return (
    <section className="iv-sheets" aria-label="What it is">
      <div className="v2-wrap" ref={wrap}>
        {FACTS.map(([t, d, Obj], i) => [
          i > 0 && <i key={'m' + i} className="iv-mark" ref={marks[i]} aria-hidden="true" />,
          <Sheet key={t} i={i} t={t} d={d} Obj={Obj} next={marks[Math.min(i + 1, FACTS.length - 1)]} />,
        ])}
      </div>
    </section>
  );
}

// what each verdict means: a short state word, then Hanzo's own sentence as the second line (facts 03 and 04)
const SAYS = {
  accepted: ['accepted', 'A webhook whose signature we can check is accepted'],
  'turned away': ['polled', 'anything else is polled from the provider directly, so the verdict always comes from the source.'],
  refused: ['refusal', 'An empty signing secret is a refusal, never a skip'],
};
// the four states the room plays as you scroll: as sent, a changed body, a forgery, an empty signing secret
const SCENES = [
  { secret: SECRET, body: BODY, forgery: false },
  { secret: SECRET, body: TAMPER, forgery: false },
  { secret: SECRET, body: BODY, forgery: true },
  { secret: '', body: BODY, forgery: false },
];

/* Beyond: the provider signs the raw body; the receiver checks what actually arrived. The room pins and plays its four
   states as you scroll; touching any control hands it to you (Reset gives it back to the scroll). */
function Forge() {
  const room = useRef(null);
  const calm = useReducedMotion();
  const [scene, setScene] = useState(0);
  const [mine, setMine] = useState(null);
  const cur = mine || SCENES[scene];
  const { scrollYProgress } = useScroll({ target: room, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => { if (!calm) setScene(Math.min(3, Math.max(0, Math.floor(p * 4.4 - 0.2)))); });
  const [sig, setSig] = useState(HEX);
  const [verdict, setVerdict] = useState('accepted');
  useEffect(() => {
    let on = true;
    if (!cur.secret) { setSig(''); return; }
    hmac(cur.secret, BODY).then((s) => on && setSig(s), () => {});
    return () => { on = false; };
  }, [cur.secret]);
  const header = cur.forgery && sig ? sig.slice(0, -1) + (sig.endsWith('0') ? '1' : '0') : sig;
  useEffect(() => {
    let on = true;
    verify(cur.secret, cur.body, header).then((v) => on && setVerdict(v), () => {});
    return () => { on = false; };
  }, [cur.secret, cur.body, header]);
  const set = (k) => setMine({ ...cur, ...k });
  // one choice at a time: the lit segment is the state the callback is in (an empty secret first, then a forgery,
  // then a changed body); pressing it again returns to the callback as sent
  const lit = !cur.secret ? 'empty' : cur.forgery ? 'forgery' : cur.body === TAMPER ? 'approved' : null;
  const choose = (c) => setMine(c === lit ? { ...SCENES[0] } : { ...SCENES[{ approved: 1, forgery: 2, empty: 3 }[c]] });
  const ok = verdict === 'accepted';
  const [word, line] = SAYS[verdict] || ['', ''];
  // the room enters as a rounded card inside the gutters and opens to full width as it is reached (clip-path only;
  // server and first client frame share the same value; reduced motion: full width, in CSS)
  const { scrollYProgress: reach } = useScroll({ target: room, offset: ['start end', 'start 0.15'] });
  // the inset stays inside the text gutter (--iv-m: 16px of 24 on a desk, 8px of 16 on a phone), so no word is cut
  const clip = useTransform(reach, (p) => { const k = (1 - Math.min(1, Math.max(0, p))).toFixed(3); return `inset(0px calc(var(--iv-m) * ${k}) round calc(var(--iv-m) * ${k} * 1.75))`; });
  return (
    <motion.section className="iv-forge v2-dark" data-room="dark" aria-labelledby="iv-forge-h" ref={room} style={{ clipPath: clip }}>
      <div className="iv-forge-pin">
        <div className="v2-wrap">
          <h2 className="iv-forge-q" id="iv-forge-h">A webhook has to prove it is one</h2>
          <div className="iv-forge-grid">
            <div className="iv-pane">
              <p className="v2-kick">the provider you chose</p>
              <label className="iv-l" htmlFor="iv-secret">signing secret</label>
              <input id="iv-secret" className="iv-in" value={cur.secret} onChange={(e) => set({ secret: e.target.value })} spellCheck={false} autoComplete="off" />
              <p className="iv-l">raw body</p>
              <code className="iv-code">{BODY}</code>
              <p className="iv-l">HMAC-SHA256</p>
              <code className="iv-code sig">{sig || '—'}</code>
            </div>
            <div className="iv-pane in">
              <p className="v2-kick">a callback</p>
              <div className="iv-fields">
                <label className="iv-l" htmlFor="iv-got">raw body</label>
                <textarea id="iv-got" className={'iv-in' + (cur.body !== BODY ? ' bad' : '')} rows={1} value={cur.body} onChange={(e) => set({ body: e.target.value })} spellCheck={false} suppressHydrationWarning />
                <p className="iv-l">HMAC-SHA256</p>
                <code className={'iv-code sig' + (cur.forgery ? ' bad' : '')}>{header || '—'}</code>
              </div>
              <div className="iv-ctl">
              <div className="iv-seg" role="group" aria-label="a callback">
                {[['approved', 'approved'], ['forgery', 'a forgery'], ['empty', 'An empty signing secret']].map(([c, label]) => (
                  <button key={c} type="button" aria-pressed={lit === c} onClick={() => choose(c)}>
                    {lit === c && <motion.span layoutId="iv-seg-pill" className="iv-seg-pill" transition={{ duration: 0.3, ease: EASE }} />}
                    <span className="iv-seg-t">{label}</span>
                  </button>
                ))}
              </div>
              <div className={'iv-stamp ' + (ok ? 'ok' : 'no')} aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={verdict} className="iv-stamp-in" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.12 } }} transition={{ duration: 0.3, ease: EASE }}>
                    <p className="iv-stamp-w">{ok ? TICK : CROSS}<span>{word}</span></p>
                    <p className="iv-stamp-l">{line}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
              <button type="button" className="iv-x" onClick={() => setMine(null)} disabled={!mine}>Reset</button>
              </div>
            </div>
          </div>
          <ol className="iv-forge-steps" aria-hidden="true">
            {SCENES.map((_, i) => <li key={i} data-on={(!mine && scene === i) || undefined} />)}
          </ol>
        </div>
      </div>
    </motion.section>
  );
}

export default function Idv() {
  return (
    <main className="v2 iv">
      <section className="iv-hero">
        <div className="v2-wrap v2-grid iv-hero-t">
          <Lines as="h1" className="v2-display iv-h1" lines={['Hanzo IDV']} data-morph-target="" />
          <div className="iv-hero-r">
            <Cta to="https://github.com/hanzoai" id="idv.hero" thumb>View on GitHub</Cta>
          </div>
        </div>
        <div className="v2-wrap iv-hero-g">
          <div className="iv-hero-l"><Lede /></div>
          <Settle className="iv-lift">
            <Board />
          </Settle>
        </div>
      </section>

      <Sheets />

      <ShipPrompt name="Identity verification" prompt="Read https://hanzo.ai/skill.md and use Hanzo Identity verification in my project." />

      <Forge />

      <GetIt name="IDV" tag="Identity verification" seed="idv" data={[256, 4, 6]} lead="Get started with IDV" ask={['View on GitHub', 'https://github.com/hanzoai', 'idv.close']} />
    </main>
  );
}
