'use client';
/* IDV. Signature: a verdict, or nothing. One check goes out through the same four calls to whichever vendor is
   configured; Jumio and Onfido answer by a signed webhook that has to prove itself (a forged one is turned away), Plaid
   is polled, and the rest refuse rather than guess. The six facts sit on a checkerboard, light and dark in turn.
   Beyond: "Sign one, forge one" - a real HMAC-SHA256 over the raw body, in your browser: change the body or the
   signature on the way in and it is turned away; empty the secret and it is refused (Idv.sign.mjs, self-check
   Idv.sign.test.mjs). Every word and link is Hanzo's; the body and secret are examples. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { Hero, Paste, Get, useLive, useSteps } from './Frame';
import { hmac, verify } from './Idv.sign.mjs';
import './Idv.css';

const CALLS = ['start a verification', 'check its status', 'parse a webhook', 'name yourself'];
// [vendor, how the verdict arrives, what the board shows]
const VENDORS = [
  ['Jumio', 'webhook', 'HMAC-SHA256 ✓'],
  ['Onfido', 'webhook', 'HMAC-SHA256 ✓'],
  ['forged callback', 'webhook', 'refused'],
  ['Plaid', 'polling', 'polled from the provider'],
  ['the rest', 'refuse', 'refuses until the parsing is written'],
];

function Board() {
  const [ref, live] = useLive(0.3);
  const [at, choose] = useSteps(VENDORS.length, 3000, live);
  const [v, how, res] = VENDORS[at];
  const bad = res.startsWith('refus');
  return (
    <div className="iv-board" ref={ref}>
      <div className="iv-calls" aria-hidden="true">
        <p className="iv-k">the same four calls</p>
        {CALLS.map((c, i) => <motion.span key={c + at} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.12 }}>{c}</motion.span>)}
      </div>
      <div className="iv-vendors" role="tablist" aria-label="Vendor">
        {VENDORS.map(([name], i) => (
          <button key={name} type="button" role="tab" aria-selected={at === i} onClick={() => choose(i)} className={at === i ? 'on' : ''}>
            {at === i && <motion.span layoutId="iv-v" className="iv-v-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span>{name}</span>
          </button>
        ))}
      </div>
      <div className="iv-out" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={at} className={'iv-verdict' + (bad ? ' bad' : '')} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }} transition={{ duration: 0.4, ease: EASE }}>
            <span className="iv-how">{how === 'polling' ? '↻ polling' : how === 'refuse' ? '— no answer' : '← webhook'}</span>
            <b>{v}</b>
            <span className="iv-res">{res}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const FACTS = [
  ['Four calls, whichever vendor', 'Start a verification, check its status, parse a webhook, name yourself. Every provider implements the same four, so swapping one for another is configuration and not a rewrite of your onboarding.'],
  ['A verdict, or nothing', 'A provider whose response we do not parse refuses rather than answering. Two of them used to return approved without reading the reply — one for any response that was not an error, the other including a rejected document. Anything gating on that would have admitted an unverified person, so both now refuse until the parsing is written.'],
  ['A webhook has to prove it is one', 'Signatures are HMAC-SHA256 over the raw body, compared in constant time, with the header matched case-insensitively because the wire spelling and the canonical spelling differ. An empty signing secret is a refusal, never a skip — an HMAC under a key everybody knows is one anybody can compute.'],
  ['Polling where a callback cannot be trusted', 'Every result is verified before it counts. A webhook whose signature we can check is accepted; anything else is polled from the provider directly, so the verdict always comes from the source.'],
  ['Credentials come from KMS', "The API token bills per check and the webhook token is what separates a provider's verdict from a forgery, so neither is a literal in the code and neither falls back to an environment variable. A missing secret fails at construction rather than producing a provider that quietly runs without one."],
  ['Verification is not screening', 'Proving somebody is who they say is a different job from watching what they do afterwards. Sanctions lists, transaction monitoring, cases and the five-year record clock live in Hanzo Risk, and this does not duplicate them.'],
];

const BODY = '{"status":"rejected"}';
const SAYS = {
  accepted: 'Accepted: the signature is HMAC-SHA256 over this raw body.',
  'turned away': 'Turned away: a forged one is turned away.',
  refused: 'Refused: an empty signing secret is a refusal, never a skip.',
};

/* Sign one, forge one: the provider signs the raw body; the receiver checks what actually arrived. */
function Forge() {
  const [secret, setSecret] = useState('example-signing-secret');
  const [got, setGot] = useState(BODY);
  const [sig, setSig] = useState('');
  const [forged, setForged] = useState(false);
  const [verdict, setVerdict] = useState('');
  const [err, setErr] = useState('');
  useEffect(() => { // the provider's signature, over the body it sent
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
  return (
    <section className="x-sec iv-forge" data-room="dark">
      <div className="x-wrap">
        <p className="x-kick">A webhook has to prove it is one</p>
        <h2 className="iv-forge-h">Sign one, forge one</h2>
        <div className="iv-forge-grid">
          <div className="iv-forge-p">
            <p className="iv-forge-k">The provider sends</p>
            <label className="iv-forge-l" htmlFor="iv-secret">signing secret</label>
            <input id="iv-secret" className="iv-forge-in" value={secret} onChange={(e) => setSecret(e.target.value)} spellCheck={false} autoComplete="off" />
            <p className="iv-forge-l">raw body</p>
            <code className="iv-forge-code">{BODY}</code>
            <p className="iv-forge-l">signature header</p>
            <code className="iv-forge-code sig">{sig || '—'}</code>
          </div>
          <div className="iv-forge-p in">
            <p className="iv-forge-k">You receive</p>
            <label className="iv-forge-l" htmlFor="iv-got">raw body, as it arrived</label>
            <textarea id="iv-got" className="iv-forge-in" rows={2} value={got} onChange={(e) => setGot(e.target.value)} spellCheck={false} />
            <p className="iv-forge-l">signature header, as it arrived</p>
            <code className={'iv-forge-code sig' + (forged ? ' bad' : '')}>{header || '—'}</code>
            <div className="iv-forge-acts">
              <button type="button" onClick={() => setGot(got.replace('rejected', 'approved'))} disabled={!got.includes('rejected')}>Change rejected to approved</button>
              <button type="button" aria-pressed={forged} onClick={() => setForged(!forged)}>Forge the signature</button>
              <button type="button" onClick={() => setSecret('')} disabled={!secret}>Empty the secret</button>
              <button type="button" className="iv-forge-x" onClick={reset}>Reset</button>
            </div>
            <p className={'iv-forge-v ' + (verdict === 'accepted' ? 'ok' : 'no')} aria-live="polite">{err || SAYS[verdict] || ' '}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Idv() {
  return (
    <main className="iv">
      <Hero
        look="stack"
        title="Hanzo IDV"
        lede="Hanzo IDV is one interface in front of the identity-verification vendors, so which vendor you use is a line of configuration rather than a rewrite of your onboarding. It does not verify anybody itself. It starts a check with the provider you chose, reads the verdict back, and proves that a callback came from them and not from someone who guessed the URL. Jumio and Onfido work end to end today; Plaid works by polling; the rest refuse until their response parsing is written, which is stated here because a verification service that guesses is worse than one that says it cannot tell."
        acts={[['View on GitHub', 'https://github.com/hanzoai']]}
      >
        <Board />
      </Hero>
      <section className="x-sec iv-what">
        <div className="x-wrap">
          <div className="iv-what-h"><h2>What it is</h2><span className="x-mono">01 / 06 — 06 / 06</span></div>
          <ol className="iv-check">
            {FACTS.map(([t, d], i) => (
              <Rise as="li" key={t} delay={(i % 3) * 0.06} y={20}>
                <span className="iv-n">{String(i + 1).padStart(2, '0')} / 06</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </Rise>
            ))}
          </ol>
        </div>
      </section>
      <Forge />
      <section className="x-sec iv-paste">
        <div className="x-wrap">
          <h2 className="iv-start">Get started with IDV</h2>
          <Paste name="Identity verification" prompt="Read https://hanzo.ai/skill.md and use Hanzo Identity verification in my project." />
        </div>
      </section>
      <Get name="IDV" tag="Identity verification" />
    </main>
  );
}
