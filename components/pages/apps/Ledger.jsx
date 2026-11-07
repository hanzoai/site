'use client';
/* Ledger. Signature: the book that balances itself. Four accounts (world, users:001, merchants:042, platform:fees)
   and Hanzo's own split payment: new money enters from world, the split posts as one transaction, an overdraft is
   refused whole, a mistake is reversed by a transaction that points back, and a retried Idempotency-Key returns the
   original. Every posting shows its two sides, and the totals always meet. The three steps beside it hold on tap.
   Beyond: "Split it yourself". Type an amount and drag the split: the postings, in the asset's smallest unit, and the
   Numscript that says the same thing are written for you, and the two sides always balance.
   Every word and link is Hanzo's. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A, Go, More } from '../../kit';
import { Paste, Code, Get, useLive } from '../cloud/Frame';
import './Ledger.css';

const DOCS = 'https://docs.hanzo.ai/docs/cli/books';
const GH = 'https://github.com/hanzoai';
const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });

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
// each step is a short film: the balances, the journal and a note at each frame
const FILM = [
  [{ b: B0, j: [], n: '' }, { b: B1, j: [T1], n: 'new money enters through world' }, { b: B2, j: [T1, T2], n: 'one transaction, two postings' }, { b: B2, j: [T1, T2], n: 'users:001 → merchants:042 · 100 — refused whole', bad: true }],
  [{ b: B2, j: [T1, T2], n: 'each entry hashed over the one before it', chain: true }, { b: B1, j: [T1, T2, T3], n: 'a reversing transaction points back at the original', chain: true }],
  [{ b: B2, j: [T1, T2], n: 'Idempotency-Key: order_42_payout' }, { b: B2, j: [T1, T2], n: 'the repeat returns the original — transaction 2', hit: 2 }, { b: B2, j: [T1, T2], n: 'same key, different postings — caught', bad: true }],
];

const fmt = (v) => (v < 0 ? '−' : '') + Math.abs(v).toLocaleString('en-US');

function Book({ at, f }) {
  const fr = FILM[at][Math.min(f, FILM[at].length - 1)];
  return (
    <div className="ld-book" data-cursor="Watch">
      <div className="ld-accts">
        {ACC.map((a, i) => (
          <div key={a} className={'ld-acct' + (i === 0 ? ' world' : '')}>
            <span className="x-mono">@{a}</span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.b key={fr.b[i]} className="x-mono" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ type: 'spring', stiffness: 420, damping: 30 }}>{fmt(fr.b[i])}</motion.b>
            </AnimatePresence>
            <em>{i === 0 ? 'may go below zero' : 'stays at or above zero'}</em>
          </div>
        ))}
      </div>
      <div className="ld-journal">
        <p className="ld-jk x-mono"><span>journal</span><span>USD/2</span></p>
        <ol>
          <AnimatePresence initial={false}>
            {fr.j.map((t, k) => (
              <motion.li key={t.id} layout="position" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} className={(fr.hit === t.id ? 'hit' : '') + (t.back ? ' back' : '')}>
                <span className="ld-tx x-mono">tx {t.id}{t.back ? ` ↩ ${t.back}` : ''}</span>
                <div className="ld-posts">
                  {t.p.map(([s, d, v], i) => (
                    <p key={i} className="x-mono"><span>@{ACC[s]}</span><i>→</i><span>@{ACC[d]}</span><b>{fmt(v)}</b></p>
                  ))}
                </div>
                <span className="ld-even x-mono">Σ 0</span>
                {fr.chain && k > 0 && <motion.i className="ld-link" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.5, ease: EASE }} aria-hidden="true" />}
                {fr.chain && <span className="ld-hash x-mono">sha256</span>}
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p key={at + '-' + f} className={'ld-note' + (fr.bad ? ' bad' : '')} initial={{ opacity: 0, y: 8 }} animate={{ opacity: fr.n ? 1 : 0, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.4, ease: EASE }}>{fr.n || ' '}</motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Hero() {
  const [ref, live, calm] = useLive(0.3);
  const [at, setAt] = useState(0);
  const [f, setF] = useState(2);
  const [mine, setMine] = useState(false);
  useEffect(() => { if (calm) setF(9); }, [calm]);
  useEffect(() => {
    if (!live) return;
    const last = f >= FILM[at].length - 1;
    const t = setTimeout(() => {
      if (!last) setF(f + 1);
      else if (!mine) { setAt((at + 1) % 3); setF(0); }
      else setF(0);
    }, last ? 2600 : 1500);
    return () => clearTimeout(t);
  }, [f, at, live, mine]);
  const choose = (i) => { setAt(i); setF(0); setMine(true); };
  return (
    <section className="ld-hero" ref={ref} aria-labelledby="ld-h1">
      <div className="x-wrap ld-hero-grid">
        <motion.div className="ld-stage" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}>
          <Book at={at} f={f} />
        </motion.div>
        <div className="ld-copy">
          <motion.p className="ld-kick" {...up(0)}>Double-Entry Ledger</motion.p>
          <h1 id="ld-h1" className="ld-h1"><span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}>Hanzo Ledger</motion.span></span></h1>
          <motion.p className="ld-lede" {...up(0.3)}>A double-entry ledger you post to over HTTP. Money here only ever moves: a posting names a source account, a destination account, an amount and an asset. There is no way to write a debit without its credit, because a one-sided entry is not something the API can express.</motion.p>
          <motion.div className="ld-acts" {...up(0.42)}>
            <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><A to={DOCS} className="x-btn solid" data-thumb>Read the docs</A></motion.span>
            <Go to={GH}>GitHub</Go>
          </motion.div>
          <div className="ld-steps">
            <p className="ld-steps-k"><span>Every cent lands somewhere</span><span className="x-mono">{String(at + 1).padStart(2, '0')} / 03</span></p>
            {STEPS.map(([t, d], i) => (
              <div key={t} className={'ld-step' + (at === i ? ' on' : '')}>
                <button type="button" aria-expanded={at === i} onClick={() => choose(i)}><span className="x-mono">{String(i + 1).padStart(2, '0')}</span>{t}</button>
                <motion.p initial={false} animate={{ height: at === i ? 'auto' : 0, opacity: at === i ? 1 : 0 }} transition={{ duration: 0.45, ease: EASE }} aria-hidden={at !== i}>{d}</motion.p>
              </div>
            ))}
            <p className="x-sr">02 / 03 03 / 03</p>
          </div>
        </div>
      </div>
    </section>
  );
}

const CAPS = [
  ['send', 'Numscript', 'Describe the movement instead of computing it. Send an amount from an account and split it across destinations by percentage, nesting splits inside splits. The whole flow posts as one transaction, so a fee that cannot be taken takes the payment with it.'],
  ['USD/2', 'Assets carry their own precision', "An asset is a code plus the number of decimal places it uses — USD/2 for cents, and the same shape for points, credits or a token with eighteen. Amounts are whole numbers in the asset's smallest unit, so nothing rounds on the way in."],
  ['Σ users:*', 'Balances arrive with the transaction', 'Each transaction records the balances it produced for the accounts it touched, so a balance is read rather than recomputed from the whole history. Aggregate across a subtree of accounts in one query.'],
];

function Caps() {
  return (
    <section className="x-sec ld-caps" data-room="dark">
      <div className="x-wrap">
        <Rise as="p" className="x-kick" y={10}>Capabilities</Rise>
        <Rise as="h2" className="ld-caps-h" y={20}>What the API gives you</Rise>
        <div className="ld-caps-grid">
          {CAPS.map(([g, t, d], i) => (
            <Rise key={t} className="ld-cap" delay={i * 0.08}>
              <span className="ld-spec x-mono" aria-hidden="true">{g}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Rise>
          ))}
        </div>
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
    <div className="ld-split">
      <p className="ld-split-k">Split it yourself</p>
      <div className="ld-split-in">
        <label><span>Amount, USD</span><input inputMode="decimal" value={amt} onChange={(e) => setAmt(e.target.value.replace(/[^0-9.]/g, '').slice(0, 10))} aria-describedby="ld-units" /></label>
        <label><span>to @merchants:042 <b className="x-mono">{pct}%</b></span><input type="range" min="50" max="100" value={pct} onChange={(e) => setPct(+e.target.value)} /></label>
      </div>
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
    <section className="x-sec ld-ns-sec">
      <div className="x-wrap">
        <header className="ld-ns-h">
          <Rise as="p" className="x-kick" y={10}>Numscript</Rise>
          <Rise as="h2" y={20}>One transaction, however many parties</Rise>
        </header>
        <div className="ld-ns-grid">
          <Rise><Code tabs={[{ k: 'bash', code: CODE }]} light mark="Idempotency-Key: order_42_payout" /></Rise>
          <Rise delay={0.1}><Splitter /></Rise>
        </div>
        <div className="x-row-links"><More to={DOCS}>Read the docs</More><More to={GH}>View on GitHub</More></div>
      </div>
    </section>
  );
}

function Start() {
  return (
    <section className="x-sec ld-start">
      <div className="x-wrap ld-start-grid">
        <Paste name="Ledger" prompt="Read https://hanzo.ai/skill.md and use Hanzo Ledger in my project." className="ld-paste" />
        <Rise className="ld-first">
          <h2>Get started with Ledger</h2>
          <p>Post your first transaction over HTTP, or describe the whole split once in Numscript and let the ledger do the arithmetic.</p>
          <div className="ld-first-acts"><A to={DOCS} className="x-btn solid">Read the docs</A><A to={GH} className="x-btn">View on GitHub</A></div>
        </Rise>
      </div>
    </section>
  );
}

export default function Ledger() {
  return (
    <main className="ld">
      <Hero />
      <Caps />
      <Numscript />
      <Start />
      <Get name="Ledger" tag="Double-entry accounting ledger" />
    </main>
  );
}
