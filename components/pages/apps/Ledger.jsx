'use client';
/* Ledger (v2, archetype A "Launch"; greys and ink only, JAMES.md 7).
   Persona: a developer building payments or a marketplace who needs money to balance (metric docs_click)
   Goal: see that a one-sided entry cannot be written, then open the docs
   CTA: Read the docs -> https://docs.hanzo.ai/docs/cli/books (hero, sticky AskBar, phone thumb bar, close; data-thumb, data-cta)
   Signature: the book that balances itself. The live ledger sits beside the title on the first screen: four accounts
   (world, users:001, merchants:042, platform:fees) with huge balances, and Hanzo's own split payment posting by itself:
   new money enters from world, the split posts as one transaction, an overdraft is refused whole, a mistake is reversed
   by a transaction that points back, and a retried Idempotency-Key returns the original. The totals always meet.
   It pauses on its own button (WCAG 2.2.2) and stops off screen.
   Beyond: "Split it yourself". Type an amount and drag the split: the postings, in the asset's smallest unit, and the
   Numscript that says the same thing are written for you, and the two sides always balance.
   Motion: the book (idle, signature) + Stage (it settles as you scroll) + sticky chapters (scroll) + the capability
   switch in the dark room (state, a gliding pill); headlines cut into their line. The request lives in a sheet.
V2: 8/10 the live book on the first screen at both sizes, greys only, three sticky chapters, a dark room with a real object per capability, the splitter, one ask everywhere (hero, sticky bar, close)
*/
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE } from '../../ui';
import { A, More } from '../../kit';
import AskBar from '../../v2/AskBar';
import { Paste, Code, useLive } from '../cloud/Frame';
import BizLines from '../../v2/BizLines';
import BizStage from '../../v2/BizStage';
import BizChapters from '../../v2/BizChapters';
import BizSheet from '../../v2/BizSheet';
import './Ledger.css';

const DOCS = 'https://docs.hanzo.ai/docs/cli/books';
const GH = 'https://github.com/hanzoai';
const DEPLOY = 'https://platform.hanzo.ai/deploy';

const ACC = ['world', 'users:001', 'merchants:042', 'platform:fees'];
const STEPS = [
  ['Balanced by construction', 'A posting is a movement from one account to another, so an unbalanced entry is not rejected by a check — it cannot be written down. New money enters through one account named world; every other account must stay at or above zero, and a transaction that would push one under is refused whole.'],
  ['Nothing is edited', 'No endpoint changes a posted transaction. A mistake is corrected by a reversing transaction that points back at the original, so what happened and what you meant both survive. Entries can also be SHA-256 chained, each hashed over the one before it, which makes a later edit in the database detectable rather than invisible.'],
  ['Safe to retry', 'Send an Idempotency-Key and a repeat returns the original rather than posting again. The ledger also fingerprints what you sent, so reusing a key with different postings is caught instead of quietly accepted — which is the failure that makes retries dangerous in the first place.'],
];

const T1 = { id: 1, p: [[0, 1, 10000]] };
const T2 = { id: 2, p: [[1, 2, 9500], [1, 3, 500]], key: 'order_42_payout' };
const T3 = { id: 3, p: [[2, 1, 9500], [3, 1, 500]], back: 2 };
const B0 = [0, 0, 0, 0], B1 = [-10000, 10000, 0, 0], B2 = [-10000, 0, 9500, 500];
// the book's film: per step, frames of balances, journal and a note
const FILM = [
  [{ b: B0, j: [], n: '' }, { b: B1, j: [T1], n: 'new money enters through world' }, { b: B2, j: [T1, T2], n: 'one transaction, two postings' }, { b: B2, j: [T1, T2], n: 'users:001 → merchants:042 · 100 — refused whole', bad: true }],
  [{ b: B2, j: [T1, T2], n: 'each entry hashed over the one before it', chain: true }, { b: B1, j: [T1, T2, T3], n: 'a reversing transaction points back at the original', chain: true }],
  [{ b: B2, j: [T1, T2], n: 'Idempotency-Key: order_42_payout' }, { b: B2, j: [T1, T2], n: 'the repeat returns the original — transaction 2', hit: 2 }, { b: B2, j: [T1, T2], n: 'same key, different postings — caught', bad: true }],
];

const fmt = (v) => (v < 0 ? '−' : '') + Math.abs(v).toLocaleString('en-US');
const two = (n) => String(n).padStart(2, '0');

/* The signature: the book, posting by itself while it is on screen. */
function Book() {
  const [ref, seen, calm] = useLive(0.2);
  const [held, setHeld] = useState(false);
  const live = seen && !held;
  const [at, setAt] = useState(0);
  const [f, setF] = useState(2);
  useEffect(() => { if (calm) { setAt(0); setF(2); } }, [calm]);
  useEffect(() => {
    if (!live) return;
    const last = f >= FILM[at].length - 1;
    const t = setTimeout(() => { if (!last) setF(f + 1); else { setAt((at + 1) % 3); setF(0); } }, last ? 2600 : 1500);
    return () => clearTimeout(t);
  }, [f, at, live]);
  const fr = FILM[at][Math.min(f, FILM[at].length - 1)];
  const lastTx = fr.j[fr.j.length - 1];
  const hot = new Set(lastTx && !fr.bad ? lastTx.p.flatMap(([s, d]) => [s, d]) : []);
  return (
    <div className="ld-book bz-obj" ref={ref} data-cursor="Watch">
      <div className="ld-bar">
        <span className="ld-bar-t"><i aria-hidden="true" />Double-Entry Ledger</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={at} className="ld-bar-s" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE }}>{STEPS[at][0]}</motion.span>
        </AnimatePresence>
        <span className="ld-bar-r">
          <span className="ld-bar-n x-mono">{two(at + 1)} / 03</span>
          {!calm && (
            <button type="button" className="ld-pause" onClick={() => setHeld(!held)} aria-pressed={held} aria-label={held ? 'Play the ledger' : 'Pause the ledger'}>
              {held ? <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /></svg> : <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" fill="currentColor" /></svg>}
            </button>
          )}
        </span>
      </div>
      <div className="ld-body">
        <div className="ld-accts">
          {ACC.map((a, i) => (
            <div key={a} className={'ld-acct' + (i === 0 ? ' world' : '') + (hot.has(i) ? ' hot' : '')}>
              <span className="x-mono">@{a}</span>
              <span className="ld-bal">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.b key={fr.b[i]} className="bz-fig" initial={{ y: '60%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-60%', opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>{fmt(fr.b[i])}</motion.b>
                </AnimatePresence>
              </span>
              <em>{i === 0 ? 'may go below zero' : 'stays at or above zero'}</em>
            </div>
          ))}
        </div>
        <div className="ld-journal">
          <p className="ld-jk x-mono"><span>journal</span><span>USD/2</span></p>
          <ol>
            <AnimatePresence initial={false}>
              {fr.j.map((t, k) => (
                <motion.li key={t.id} layout="position" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} className={(fr.hit === t.id ? 'hit' : '') + (t.back ? ' back' : '')}>
                  <span className="ld-tx x-mono">tx {t.id}{t.back ? ` ↩ ${t.back}` : ''}</span>
                  <div className="ld-posts">
                    {t.p.map(([s, d, v], i) => (
                      <p key={i} className="x-mono"><span>@{ACC[s]}</span><i>→</i><span>@{ACC[d]}</span><b>{fmt(v)}</b></p>
                    ))}
                  </div>
                  <span className="ld-even x-mono">Σ 0</span>
                  {fr.chain && k > 0 && <i className="ld-link" aria-hidden="true" />}
                  {fr.chain && <span className="ld-hash x-mono">sha256</span>}
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={at + '-' + f} className={'ld-note x-mono' + (fr.bad ? ' bad' : '')} initial={{ opacity: 0, y: 8 }} animate={{ opacity: fr.n ? 1 : 0, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.4, ease: EASE }}>{fr.n || ' '}</motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* The hero paragraph is one paragraph in the HTML (Hanzo's words, untouched) but two places on screen: its first
   sentence under the title, the rest beside the book (desktop) or under it (phone), via display: contents. */
function Hero() {
  return (
    <section className="ld-hero" aria-labelledby="ld-h1">
      <div className="bz-wrap ld-hero-grid">
        <BizLines as="h1" id="ld-h1" className="bz-display md ld-h1" lines={['Hanzo', 'Ledger']} now delay={0.05} />
        <p className="ld-copy"><span className="bz-lede ld-one">A double-entry ledger you post to over HTTP.</span> <span className="bz-body ld-more">Money here only ever moves: a posting names a source account, a destination account, an amount and an asset. There is no way to write a debit without its credit, because a one-sided entry is not something the API can express.</span></p>
        <div className="bz-acts ld-acts">
          <A to={DOCS} className="x-btn solid" data-thumb="Read the docs" data-cta="primary">Read the docs</A>
          <More to={GH}>GitHub</More>
        </div>
        <BizStage from={1.03} over={560} lift={40} className="ld-stage"><Book /></BizStage>
      </div>
    </section>
  );
}

/* Chapter stages: one big idea each, drawn from the step it explains. */
const Arrow = () => <svg viewBox="0 0 64 16" aria-hidden="true"><path d="M0 8h60M53 2l7 6-7 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

function Scenes({ at }) {
  return (
    <div className="ld-scenes">
      <div className={'ld-scene ld-post' + (at === 0 ? ' on' : '')} aria-hidden={at !== 0}>
        <div className="ld-post-row">
          <p><span className="bz-kick">source</span><b className="x-mono">@users:001</b></p>
          <span className="ld-post-arrow"><Arrow /><i className="ld-dot" /></span>
          <p><span className="bz-kick">destination</span><b className="x-mono">@merchants:042</b></p>
        </div>
        <div className="ld-post-row two">
          <p><span className="bz-kick">amount</span><b className="bz-fig">9500</b></p>
          <p><span className="bz-kick">asset</span><b className="bz-fig">USD/2</b></p>
        </div>
        <p className="ld-seal"><b className="bz-fig">Σ 0</b><span>debit and credit, one movement</span></p>
      </div>
      <div className={'ld-scene ld-chain' + (at === 1 ? ' on' : '')} aria-hidden={at !== 1}>
        {[T1, T2, T3].map((t, i) => (
          <div key={t.id} className={'ld-link-row' + (t.back ? ' back' : '')}>
            <span className="ld-chain-tx bz-fig">tx {t.id}</span>
            <div className="ld-chain-p x-mono">{t.p.map(([s, d, v], j) => <p key={j}>@{ACC[s]} → @{ACC[d]} <b>{fmt(v)}</b></p>)}</div>
            <span className="ld-chain-h x-mono">{i ? 'sha256 of tx ' + i : 'sha256'}</span>
          </div>
        ))}
        <svg className="ld-back" viewBox="0 0 40 160" aria-hidden="true"><path d="M6 150 C 38 150, 38 84, 6 84" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M12 78 L5 84 L12 90" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
        <p className="ld-chain-n">a reversing transaction points back at the original</p>
      </div>
      <div className={'ld-scene ld-retry' + (at === 2 ? ' on' : '')} aria-hidden={at !== 2}>
        {[['POST', 'order_42_payout', 'tx 2', ''], ['POST', 'order_42_payout', 'the original — tx 2', 'hit'], ['POST', 'order_42_payout', 'different postings — caught', 'bad']].map(([m, k, r, c], i) => (
          <div key={i} className={'ld-req ' + c}>
            <span className="x-mono ld-req-m">{m}</span>
            <span className="x-mono ld-req-k">Idempotency-Key: {k}</span>
            <span className="ld-req-r">{r}</span>
          </div>
        ))}
        <p className="ld-seal"><b className="bz-fig">1</b><span>transaction 2, posted once</span></p>
      </div>
    </div>
  );
}

const CAPS = [
  ['send', 'Numscript', 'Describe the movement instead of computing it. Send an amount from an account and split it across destinations by percentage, nesting splits inside splits. The whole flow posts as one transaction, so a fee that cannot be taken takes the payment with it.'],
  ['USD/2', 'Assets carry their own precision', "An asset is a code plus the number of decimal places it uses — USD/2 for cents, and the same shape for points, credits or a token with eighteen. Amounts are whole numbers in the asset's smallest unit, so nothing rounds on the way in."],
  ['Σ users:*', 'Balances arrive with the transaction', 'Each transaction records the balances it produced for the accounts it touched, so a balance is read rather than recomputed from the whole history. Aggregate across a subtree of accounts in one query.'],
];

/* The one dark room: the capability you pick is shown working, on the same split payment as the book. */
const NS = `send [USD/2 10000] (
  source = @users:001
  destination = { 95% to @merchants:042
                   5% to @platform:fees }
)`;
function CapObject({ i }) {
  if (i === 0) return (
    <div className="ld-cobj">
      <pre className="ld-cobj-code x-mono">{NS}</pre>
      <div className="ld-cobj-out x-mono"><p><span>@merchants:042</span><b>9,500</b></p><p><span>@platform:fees</span><b>500</b></p><p className="sum"><span>tx 2</span><b>Σ 0</b></p></div>
    </div>
  );
  if (i === 1) return (
    <div className="ld-cobj ld-prec">
      <p><b className="bz-fig">10000</b><span className="x-mono">USD/2</span></p>
      <i aria-hidden="true" />
      <p><b className="bz-fig">100.00</b><span className="x-mono">USD</span></p>
    </div>
  );
  return (
    <div className="ld-cobj ld-bals">
      <p className="ld-bals-tx x-mono">tx 2</p>
      {[['users:001', '0'], ['merchants:042', '9,500'], ['platform:fees', '500']].map(([a, v]) => <p key={a} className="x-mono"><span>@{a}</span><b>{v}</b></p>)}
      <p className="sum x-mono"><span>Σ users:*</span><b>0</b></p>
    </div>
  );
}

function Caps() {
  const [i, setI] = useState(0);
  const key = (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); setI((i + 1) % 3); } if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); setI((i + 2) % 3); } };
  return (
    <section className="bz-sec ld-caps" data-room="dark" aria-labelledby="ld-caps-h">
      <div className="bz-wrap">
        <header className="ld-caps-head">
          <h2 id="ld-caps-h" className="bz-headline">What the API gives you</h2>
          <p className="ld-caps-k x-mono">Capabilities</p>
        </header>
        <div className="ld-caps-tabs" role="tablist" aria-label="Capabilities" onKeyDown={key}>
          {CAPS.map(([g], k) => (
            <button key={g} type="button" role="tab" id={'ld-cap-t' + k} aria-selected={i === k} aria-controls={'ld-cap-p' + k} tabIndex={i === k ? 0 : -1} onClick={() => setI(k)} className="x-mono">
              {i === k && <motion.span layoutId="ld-cap-pill" className="ld-caps-pill" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
              <span>{g}</span>
            </button>
          ))}
        </div>
        {CAPS.map(([g, t, d], k) => (
          <div key={t} className="ld-cap" role="tabpanel" id={'ld-cap-p' + k} aria-labelledby={'ld-cap-t' + k} hidden={i !== k}>
            <div className="ld-cap-copy">
              <span className="ld-glyph x-mono" aria-hidden="true">{g}</span>
              <h3 className="bz-title">{t}</h3>
              <p className="bz-body">{d}</p>
            </div>
            <CapObject i={k} />
          </div>
        ))}
      </div>
    </section>
  );
}

const CODE = `# A split payment: the vendor is paid and the platform takes its cut,
# in one transaction that lands whole or not at all.

curl -X POST http://localhost:3068/v2/main/transactions \\
  -H 'Content-Type: application/json' \\
  -H 'Idempotency-Key: order_42_payout' \\
  -d '{
    "postings": [
      { "source": "users:001", "destination": "merchants:042", "amount": 9500, "asset": "USD/2" },
      { "source": "users:001", "destination": "platform:fees", "amount": 500, "asset": "USD/2" }
    ],
    "metadata": { "order": "ord_42" }
  }'

# Or say it once in Numscript and let the ledger do the arithmetic:
#
#   send [USD/2 10000] (
#     source = @users:001
#     destination = { 95% to @merchants:042
#                      5% to @platform:fees }
#   )`;

/* Beyond: type an amount, drag the split; the postings and the Numscript are written for you and always balance. */
function Splitter() {
  const [amt, setAmt] = useState('100.00');
  const [pct, setPct] = useState(95);
  const units = Math.max(0, Math.round((parseFloat(amt) || 0) * 100));
  const vend = Math.floor((units * pct) / 100);
  const fee = units - vend;
  const ok = units > 0;
  return (
    <div className="ld-split bz-obj">
      <p className="ld-split-k"><span className="bz-kick">Split it yourself</span><span className="ld-split-ok x-mono">{ok ? 'Σ 0' : '—'}</span></p>
      <label className="ld-amt">
        <span className="bz-kick">Amount, USD</span>
        <span className="ld-amt-in"><i aria-hidden="true">$</i><input className="bz-fig" inputMode="decimal" value={amt} onChange={(e) => setAmt(e.target.value.replace(/[^0-9.]/g, '').slice(0, 10))} aria-describedby="ld-units" /></span>
      </label>
      <label className="ld-pct">
        <span>to @merchants:042 <b className="x-mono">{pct}%</b></span>
        <input type="range" min="50" max="100" value={pct} onChange={(e) => setPct(+e.target.value)} style={{ '--p': ((pct - 50) / 50) * 100 + '%' }} />
      </label>
      <div className="ld-split-bar" aria-hidden="true"><i style={{ transform: `scaleX(${pct / 100})` }} /></div>
      <p id="ld-units" className="ld-units x-mono">{ok ? `${units.toLocaleString('en-US')} in USD/2, the smallest unit: whole numbers, nothing rounds on the way in` : 'Type an amount above zero'}</p>
      <div className="ld-split-out">
        <div className="ld-posting x-mono">
          <p><span>@users:001</span><i>→</i><span>@merchants:042</span><b>{vend.toLocaleString('en-US')}</b></p>
          <p><span>@users:001</span><i>→</i><span>@platform:fees</span><b>{fee.toLocaleString('en-US')}</b></p>
          <p className="sum"><span>sent</span><b>{units.toLocaleString('en-US')}</b><span>received</span><b>{(vend + fee).toLocaleString('en-US')}</b></p>
        </div>
        <pre className="ld-ns x-mono">{`send [USD/2 ${units}] (
  source = @users:001
  destination = { ${pct}% to @merchants:042
                  ${100 - pct}% to @platform:fees }
)`}</pre>
      </div>
    </div>
  );
}

function Numscript() {
  return (
    <section className="bz-sec ld-nsec" aria-labelledby="ld-ns-h">
      <div className="bz-wrap bz-grid">
        <div className="ld-nsec-copy">
          <p className="bz-kick">Numscript</p>
          <BizLines id="ld-ns-h" className="bz-display sm" lines={['One transaction,', 'however many', 'parties']} />
          <BizSheet label="See the request" kick="bash" title="One transaction, however many parties">
            <Code tabs={[{ k: 'bash', code: CODE }]} light mark="Idempotency-Key: order_42_payout" />
          </BizSheet>
        </div>
        <div className="ld-nsec-obj"><Splitter /></div>
      </div>
    </section>
  );
}

const Gh = () => <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;

/* The close: one sentence at Display size, the same one ask, and one full-width row for the secondary. */
function End() {
  return (
    <section className="bz-sec ld-end" aria-labelledby="ld-get">
      <div className="bz-wrap">
        <div className="bz-grid">
          <div className="ld-end-get">
            <BizLines id="ld-get" className="bz-display md" lines={['Get Ledger']} />
            <p className="bz-lede">Double-entry accounting ledger</p>
            <div className="ld-chips">
              <span className="ld-chip"><span>License:</span> Apache-2.0</span>
              <A to={GH} className="ld-chip"><Gh />hanzoai</A>
            </div>
            <div className="bz-acts"><A to={DOCS} className="x-btn solid" data-cta="primary">Read the docs</A></div>
          </div>
          <div className="ld-end-start">
            <h3 className="bz-title">Get started with Ledger</h3>
            <p className="bz-body">Post your first transaction over HTTP, or describe the whole split once in Numscript and let the ledger do the arithmetic.</p>
            <div className="ld-links"><More to={GH}>View on GitHub</More></div>
            <Paste name="Ledger" prompt="Read https://hanzo.ai/skill.md and use Hanzo Ledger in my project." className="ld-paste" />
          </div>
        </div>
        <A to={DEPLOY} className="ld-row" data-cta="secondary"><span>Deploy to Cloud</span><svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></A>
      </div>
    </section>
  );
}

export default function Ledger() {
  return (
    <main className="bz ld">
      <Hero />
      <BizChapters label="Every cent lands somewhere" className="ld-ch" items={STEPS.map(([t, d]) => ({ t, d }))} stage={(at) => <Scenes at={at} />}>
        <header className="bz-wrap ld-ch-head">
          <BizLines className="bz-display md" lines={['Every cent', 'lands somewhere']} />
        </header>
      </BizChapters>
      <Caps />
      <Numscript />
      <End />
      <AskBar title="Hanzo Ledger" label="Read the docs" to={DOCS} />
    </main>
  );
}
