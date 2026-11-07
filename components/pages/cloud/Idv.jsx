'use client';
/* IDV (v2, archetype A Launch).
   V2: 8/10 A switchboard hero where the four calls stay put while the vendor under them changes and each answers its own honest way; Hanzo's long intro read as a statement that inks in word by word with the scroll; the six facts as sheets that stack; sign-one-forge-one as the dark room.
   Signature: a verdict, or nothing. In the hero, the same four calls go to whichever vendor is configured; the vendor
   turns (Jumio, Onfido, a forged callback, Plaid, the rest) and the verdict lane shows how each answers: a signed
   webhook that proves itself, a forgery refused, a poll to the source, or a refusal until the parsing is written.
   Supporting: kinetic title lines; the intro paragraph inks in word by word as you scroll (scroll-linked type);
   the six facts as sticky sheets that stack over each other.
   Beyond: "Sign one, forge one" - a real HMAC-SHA256 over the raw body, in your browser: change the body or the
   signature on the way in and it is turned away; empty the secret and it is refused (Idv.sign.mjs, self-check
   Idv.sign.test.mjs). Nothing leaves the page.
   Accent: teal, from the verified tick. Every word and link is Hanzo's; the body and secret are examples. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { A } from '../../kit';
import { useLive, useSteps } from './Frame';
import { hmac, verify } from './Idv.sign.mjs';
import { Lines, Lift } from '../../v2/LiftStage';
import ShipPrompt from '../../v2/ShipPrompt';
import GetIt from '../../v2/GetIt';
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

/* The switchboard: the four calls stay put; the vendor under them turns; the verdict lane answers its own way. */
function Board() {
  const [ref, live] = useLive(0.3);
  const [v, pick] = useSteps(VENDORS.length, 3000, live);
  const [name, how, verdict, k] = VENDORS[v];
  return (
    <div className="iv-board" ref={ref}>
      <div className="iv-vendors" role="tablist" aria-label="Vendor">
        {VENDORS.map(([n], i) => (
          <button key={n} type="button" role="tab" aria-selected={v === i} onClick={() => pick(i)}>
            {v === i && <motion.span layoutId="iv-v" className="iv-v-bg" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
            <span className="iv-v-t">{n}</span>
          </button>
        ))}
      </div>
      <div className="iv-wire" aria-hidden="true">
        <ol className="iv-calls">
          {CALLS.map((c, i) => <li key={c}><span>{String(i + 1).padStart(2, '0')}</span>{c}</li>)}
        </ol>
        <div className="iv-line"><motion.i key={v} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, ease: EASE }} /></div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={v} className={'iv-verdict ' + k} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10, transition: { duration: 0.16 } }} transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}>
            <p className="iv-vn">{name}</p>
            <p className="iv-how">{how}</p>
            <p className="iv-says">{verdict}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const INTRO = 'Hanzo IDV is one interface in front of the identity-verification vendors, so which vendor you use is a line of configuration rather than a rewrite of your onboarding. It does not verify anybody itself. It starts a check with the provider you chose, reads the verdict back, and proves that a callback came from them and not from someone who guessed the URL. Jumio and Onfido work end to end today; Plaid works by polling; the rest refuse until their response parsing is written, which is stated here because a verification service that guesses is worse than one that says it cannot tell.';

/* Hanzo's intro, inked in word by word with the scroll (one CSS variable; no per-word state). */
function Statement() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.82', 'end 0.45'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => ref.current?.style.setProperty('--p', p.toFixed(3)));
  const words = INTRO.split(' ');
  return (
    <section className="v2-sec iv-say">
      <div className="v2-wrap">
        <p className="v2-kick acc">What it is</p>
        <p className="iv-say-p" ref={ref} style={{ '--p': 0 }}>
          {words.map((w, i) => <span key={i} style={{ '--i': (i / words.length).toFixed(3) }}>{w} </span>)}
        </p>
      </div>
    </section>
  );
}

const FACTS = [
  ['Four calls, whichever vendor', 'Start a verification, check its status, parse a webhook, name yourself. Every provider implements the same four, so swapping one for another is configuration and not a rewrite of your onboarding.', '4'],
  ['A verdict, or nothing', 'A provider whose response we do not parse refuses rather than answering. Two of them used to return approved without reading the reply — one for any response that was not an error, the other including a rejected document. Anything gating on that would have admitted an unverified person, so both now refuse until the parsing is written.', 'refuses'],
  ['A webhook has to prove it is one', 'Signatures are HMAC-SHA256 over the raw body, compared in constant time, with the header matched case-insensitively because the wire spelling and the canonical spelling differ. An empty signing secret is a refusal, never a skip — an HMAC under a key everybody knows is one anybody can compute.', 'HMAC-SHA256'],
  ['Polling where a callback cannot be trusted', 'Every result is verified before it counts. A webhook whose signature we can check is accepted; anything else is polled from the provider directly, so the verdict always comes from the source.', 'polled'],
  ['Credentials come from KMS', "The API token bills per check and the webhook token is what separates a provider's verdict from a forgery, so neither is a literal in the code and neither falls back to an environment variable. A missing secret fails at construction rather than producing a provider that quietly runs without one.", 'KMS'],
  ['Verification is not screening', 'Proving somebody is who they say is a different job from watching what they do afterwards. Sanctions lists, transaction monitoring, cases and the five-year record clock live in Hanzo Risk, and this does not duplicate them.', 'Hanzo Risk'],
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
        <div className="v2-grid iv-forge-h">
          <div className="iv-forge-hl">
            <p className="v2-kick acc">A webhook has to prove it is one</p>
            <h2 className="v2-display s">Sign one, forge one</h2>
          </div>
          <div className={'iv-stamp ' + (ok ? 'ok' : 'no')} aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p key={verdict + err} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0.12 } }} transition={{ type: 'spring', stiffness: 300, damping: 26 }}>{err || SAYS[verdict] || ' '}</motion.p>
            </AnimatePresence>
          </div>
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
            <textarea id="iv-got" className="iv-in" rows={2} value={got} onChange={(e) => setGot(e.target.value)} spellCheck={false} />
            <p className="iv-l">signature header, as it arrived</p>
            <code className={'iv-code sig' + (forged ? ' bad' : '')}>{header || '—'}</code>
            <div className="iv-acts">
              <button type="button" onClick={() => setGot(got.replace('rejected', 'approved'))} disabled={!got.includes('rejected')}>Change rejected to approved</button>
              <button type="button" aria-pressed={forged} onClick={() => setForged(!forged)}>Forge the signature</button>
              <button type="button" onClick={() => setSecret('')} disabled={!secret}>Empty the secret</button>
              <button type="button" className="iv-x" onClick={reset}>Reset</button>
            </div>
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
            <p className="v2-kick acc">Identity verification</p>
            <A to="https://github.com/hanzoai" className="v2-btn solid">View on GitHub</A>
          </div>
        </div>
        <Lift className="v2-wrap iv-lift" from={1.1} y={30} origin="50% 0%" offset={['start end', 'start 0.2']}>
          <Board />
        </Lift>
      </section>

      <Statement />

      <section className="iv-sheets" aria-label="What it is">
        <div className="v2-wrap">
          {FACTS.map(([t, d, big], i) => (
            <article key={t} className="iv-sheet" style={{ '--k': i }}>
              <div className="iv-sheet-l">
                <p className="v2-kick acc">{String(i + 1).padStart(2, '0')} / 06</p>
                <h3 className="v2-headline">{t}</h3>
              </div>
              <div className="iv-sheet-r">
                <p className="iv-big" aria-hidden="true">{big}</p>
                <p className="v2-body">{d}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Forge />

      <ShipPrompt name="Identity verification" prompt="Read https://hanzo.ai/skill.md and use Hanzo Identity verification in my project." />

      <GetIt name="IDV" tag="Identity verification" seed="idv" data={[256, 4, 6]} lead="Get started with IDV" />
    </main>
  );
}
