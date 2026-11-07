'use client';
// Persona: a team onboarding users that must verify identity with a vendor.
// Goal: see that the vendor is configuration and only a proven verdict counts.
// CTA: View on GitHub (idv.hero, idv.close).
// Metric: cta_click idv.hero
// Signature: a verdict, or nothing: four calls stay put while the vendor turns and each answers its honest way.
// Beyond: Sign one, forge one: a real HMAC-SHA256 check in the browser.
/* IDV (v2, archetype A Launch).
   V2: 8/10 round 2: the switchboard paints at its final size (page-local Settle, same render on server and client) with the ask on the headline row; phone tabs one sideways rail with the verdict above the calls; the statement rests at 32px and only its closing clause grows; each of the six sheets carries its own object built from the demo (the four calls counting to 4, approved struck to refuses, the HMAC resolving, a poll ticking to the source, KMS feeding both tokens, verify beside Hanzo Risk) with the words under the heading; the forge's three actions are one segmented control and the verdict sits under them, filled with a tick or hollow with a cross; no resize grip; gaps closed; greys only, one ask.
   Signature: a verdict, or nothing. In the hero, the same four calls go to whichever vendor is configured; the vendor
   turns (Jumio, Onfido, a forged callback, Plaid, the rest) and the verdict lane shows how each answers: a signed
   webhook that proves itself, a forgery refused, a poll to the source, or a refusal until the parsing is written.
   Supporting: kinetic title lines; the intro paragraph inks in word by word as you scroll (scroll-linked type);
   the six facts as sticky sheets that stack over each other, each playing its own small object once when it arrives.
   Beyond: "Sign one, forge one" - a real HMAC-SHA256 over the raw body, in your browser: change the body or the
   signature on the way in and it is turned away; empty the secret and it is refused (Idv.sign.mjs, self-check
   Idv.sign.test.mjs). Nothing leaves the page.
   Greys only (Hanzo's deck). Every word and link is Hanzo's; the body and secret are examples.
   Server and client render the same first frame everywhere: every object's HTML is its finished state (true values,
   readable with JS off); after mount, objects below the fold rewind and play once when they arrive. Reduced motion
   keeps the finished state.
   Persona: a team onboarding users that must verify identity with a vendor (Jumio, Onfido, Plaid).
   Goal: see that the vendor is configuration, that only a proven verdict counts, and try a forged webhook.
   CTA: View on GitHub (hero, the sticky ask bar and the close; one solid button per screen). */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useInView, useReducedMotion } from 'motion/react';
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
const VENDORS = [
  ['Jumio', 'webhook', 'HMAC-SHA256 ✓', 'ok'],
  ['Onfido', 'webhook', 'HMAC-SHA256 ✓', 'ok'],
  ['forged callback', 'webhook', 'refused', 'no'],
  ['Plaid', 'polling', 'polled from the provider', 'poll'],
  ['the rest', 'refuse', 'refuses until the parsing is written', 'no'],
];

/* The hero object settles as the page moves on: the same style on server and client (motion values start at identity),
   so the first frame is the finished card; reduced motion holds it still in CSS. */
function Settle({ children, className }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.2', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 40]);
  return (
    <div ref={ref} className={className}>
      <motion.div className="iv-settle" style={{ scale, y, transformOrigin: '50% 30%' }}>{children}</motion.div>
    </div>
  );
}

/* The switchboard: the four calls stay put; the vendor under them turns; the verdict lane answers its own way. */
function Board() {
  const [ref, seen] = useLive(0.3);
  const [paused, togglePause] = usePause();
  const live = seen && !paused;
  const [v, pick] = useSteps(VENDORS.length, 3000, live);
  const [name, how, verdict, k] = VENDORS[v];
  return (
    <div className="lp-host">
    <LivePause paused={paused} onToggle={togglePause} className="iv-pause" />
    <div className="iv-board" ref={ref}>
      <div className="iv-vendors" role="tablist" aria-label="Vendor">
        {VENDORS.map(([n], i) => (
          <button key={n} type="button" role="tab" aria-selected={v === i} onClick={() => pick(i)}>
            {v === i && <motion.span layoutId="iv-v" className="iv-v-bg" transition={{ duration: 0.3, ease: EASE }} />}
            <span className="iv-v-t">{n}</span>
          </button>
        ))}
      </div>
      <div className="iv-wire" aria-hidden="true">
        <ol className="iv-calls">
          {CALLS.map((c, i) => <li key={c}><span>{String(i + 1).padStart(2, '0')}</span>{c}</li>)}
        </ol>
        <div className="iv-line"><motion.i key={v} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, ease: EASE }} /></div>
        <div className="iv-vslot">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={v} className={'iv-verdict ' + k} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10, transition: { duration: 0.16 } }} transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}>
              <p className="iv-vn">{name}</p>
              <p className="iv-how">{how}</p>
              <p className="iv-says">{verdict}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
    </div>
  );
}

const INTRO = 'Hanzo IDV is one interface in front of the identity-verification vendors, so which vendor you use is a line of configuration rather than a rewrite of your onboarding. It does not verify anybody itself. It starts a check with the provider you chose, reads the verdict back, and proves that a callback came from them and not from someone who guessed the URL. Jumio and Onfido work end to end today; Plaid works by polling; the rest refuse until their response parsing is written, which is stated here because a verification service that guesses is worse than one that says it cannot tell.';
const WORDS = INTRO.split(' ');
const END = WORDS.indexOf('which', WORDS.indexOf('written,')); // the closing clause: the one part that grows

/* Hanzo's intro, inked in word by word with the scroll (one CSS variable; no per-word state). It rests at section size;
   only the closing clause grows while it is the moment, then settles. */
function Statement() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.82', 'end 0.45'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => ref.current?.style.setProperty('--p', p.toFixed(3)));
  const word = (w, i) => <span key={i} style={{ '--i': (i / WORDS.length).toFixed(3) }}>{w} </span>;
  return (
    <section className="v2-sec iv-say">
      <div className="v2-wrap">
        <p className="iv-say-p" ref={ref} style={{ '--p': 0 }}>
          {WORDS.slice(0, END).map(word)}
          <span className="iv-say-end">{WORDS.slice(END).map((w, j) => word(w, END + j))}</span>
        </p>
      </div>
    </section>
  );
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

const HEX = '836569430a75d8364e317947bb7196c6e0d3f17849c92db00ffd60ca351cc470'; // HMAC-SHA256('example-signing-secret', BODY), as the forge computes it
const RISK = ['Sanctions lists', 'transaction monitoring', 'cases', 'the five-year record clock'];

/* 01: the four calls light one by one and the figure counts to 4. */
function Four() {
  const [ref, s] = useStage(4, 380);
  return (
    <figure className="iv-o iv-o-four" ref={ref}>
      <div className="iv-o-row">
        <p className="iv-o-n" aria-hidden="true">{s}</p>
        <ol className="iv-o-calls" aria-hidden="true">
          {CALLS.map((c, i) => <li key={c} data-on={s > i || undefined}><span>{String(i + 1).padStart(2, '0')}</span>{c}</li>)}
        </ol>
      </div>
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

/* 03: the signature resolves character by character, the real HMAC over the forge's example body. */
function Hex() {
  const [ref, s] = useStage(16, 70);
  const n = s * 4;
  return (
    <figure className="iv-o iv-o-hex" ref={ref} aria-hidden="true">
      <p className="iv-o-tag">HMAC-SHA256</p>
      <code className="iv-o-code">{HEX.slice(0, n)}<span>{'·'.repeat(HEX.length - n)}</span></code>
      <p className="iv-o-tick" data-on={s >= 16 || undefined}>HMAC-SHA256 ✓</p>
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
      <div>
        <p className="iv-o-tag">Hanzo IDV</p>
        <ul>{CALLS.map((c) => <li key={c}>{c}</li>)}</ul>
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

const BODY = '{"status":"rejected"}';
const SAYS = {
  accepted: 'Accepted: the signature is HMAC-SHA256 over this raw body.',
  'turned away': 'Turned away: a forged one is turned away.',
  refused: 'Refused: an empty signing secret is a refusal, never a skip.',
};

/* Beyond: sign one, forge one. The provider signs the raw body; the receiver checks what actually arrived. */
function Forge() {
  const [secret, setSecret] = useState('example-signing-secret');
  const [got, setGot] = useState(BODY);
  const [sig, setSig] = useState('');
  const [forged, setForged] = useState(false);
  const [verdict, setVerdict] = useState('');
  const [err, setErr] = useState('');
  useEffect(() => {
    let on = true;
    if (!secret) { setSig(''); return; }
    hmac(secret, BODY).then((s) => on && setSig(s), () => on && setErr('This browser cannot compute an HMAC here.'));
    return () => { on = false; };
  }, [secret]);
  const header = forged && sig ? sig.slice(0, -1) + (sig.endsWith('0') ? '1' : '0') : sig;
  useEffect(() => {
    let on = true;
    verify(secret, got, header).then((v) => on && setVerdict(v), () => on && setErr('This browser cannot compute an HMAC here.'));
    return () => { on = false; };
  }, [secret, got, header]);
  const reset = () => { setSecret('example-signing-secret'); setGot(BODY); setForged(false); };
  const ok = verdict === 'accepted';
  return (
    <section className="iv-forge v2-dark" data-room="dark">
      <div className="v2-wrap">
        <div className="iv-forge-h">
          <h2 className="v2-display s">Sign one, forge one</h2>
          <p className="v2-kick acc iv-forge-cap">A webhook has to prove it is one</p>
        </div>
        <div className="iv-forge-grid">
          <div className="iv-pane">
            <p className="v2-kick">The provider sends</p>
            <label className="iv-l" htmlFor="iv-secret">signing secret</label>
            <input id="iv-secret" className="iv-in" value={secret} onChange={(e) => setSecret(e.target.value)} spellCheck={false} autoComplete="off" />
            <p className="iv-l">raw body</p>
            <code className="iv-code">{BODY}</code>
            <p className="iv-l">signature header</p>
            <code className="iv-code sig">{sig || '—'}</code>
          </div>
          <div className="iv-pane in">
            <p className="v2-kick">You receive</p>
            <label className="iv-l" htmlFor="iv-got">raw body, as it arrived</label>
            <textarea id="iv-got" className="iv-in" rows={2} value={got} onChange={(e) => setGot(e.target.value)} spellCheck={false} suppressHydrationWarning />
            <p className="iv-l">signature header, as it arrived</p>
            <code className={'iv-code sig' + (forged ? ' bad' : '')}>{header || '—'}</code>
            <div className="iv-seg" role="group" aria-label="You receive">
              <button type="button" onClick={() => setGot(got.replace('rejected', 'approved'))} disabled={!got.includes('rejected')}>Change rejected to approved</button>
              <button type="button" aria-pressed={forged} onClick={() => setForged(!forged)}>Forge the signature</button>
              <button type="button" onClick={() => setSecret('')} disabled={!secret}>Empty the secret</button>
            </div>
            <div className={'iv-stamp ' + (ok ? 'ok' : 'no')} aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p key={verdict + err} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.12 } }} transition={{ duration: 0.3, ease: EASE }}>
                  <svg className="iv-mark" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
                    {ok ? <path d="M4 10.5l4 4 8-9" /> : <path d="M5 5l10 10M15 5L5 15" />}
                  </svg>
                  <span>{err || SAYS[verdict] || ' '}</span>
                </motion.p>
              </AnimatePresence>
            </div>
            <button type="button" className="iv-x" onClick={reset}>Reset</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Idv() {
  return (
    <main className="v2 iv">
      <section className="iv-hero">
        <div className="v2-wrap v2-grid iv-hero-t">
          <Lines as="h1" className="v2-display iv-h1" lines={['Hanzo IDV']} data-morph-target="" />
          <div className="iv-hero-r">
            <Cta to="https://github.com/hanzoai" id="idv.hero" thumb className="v2-in" style={{ animationDelay: '.3s' }}>View on GitHub</Cta>
          </div>
        </div>
        <Settle className="v2-wrap iv-lift">
          <Board />
        </Settle>
      </section>

      <Statement />

      <section className="iv-sheets" aria-label="What it is">
        <div className="v2-wrap">
          {FACTS.map(([t, d, Obj], i) => (
            <article key={t} className="iv-sheet" style={{ '--k': i }}>
              <div className="iv-sheet-l">
                <h3 className="v2-headline">{t}</h3>
                <p className="v2-kick acc iv-sheet-n">{String(i + 1).padStart(2, '0')} / 06</p>
                <p className="v2-body">{d}</p>
              </div>
              <div className="iv-sheet-r"><Obj /></div>
            </article>
          ))}
        </div>
      </section>

      <ShipPrompt name="Identity verification" prompt="Read https://hanzo.ai/skill.md and use Hanzo Identity verification in my project." />

      <Forge />

      <GetIt name="IDV" tag="Identity verification" seed="idv" data={[256, 4, 6]} lead="Get started with IDV" ask={['View on GitHub', 'https://github.com/hanzoai', 'idv.close']} />
    </main>
  );
}
