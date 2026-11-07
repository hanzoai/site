'use client';
// Signature: calculator
// Entrances: stack-drop, velocity-skew, spring-snap, word-shuffle, inertia-drag
/* Ledger (v2, archetype A "Launch"; greys and ink only, JAMES.md 7).
   Persona: a developer building payments or a marketplace who needs money to balance
   Metric: api_key_created (developers, MASTER §1); on this page counted through the docs clicks data-cta="ledger.hero" / "ledger.close"
   Goal: see that a one-sided entry cannot be written, then open the docs
   CTA: Read the docs -> https://docs.hanzo.ai/docs/cli/books (hero and the closing Band; data-cta ledger.hero / ledger.close, data-thumb
   on the hero). No floating bar: between them the header's own ask carries it, and it draws as an outline while either is on screen.
   Signature (motion map: calculator): "Split it yourself", the second screen. One amount and one split slider reprice the whole
   page at once: the live book's balances and journal (world → users:001, then the split), the three step scenes, the dark
   room's Numscript, precision and balances objects, the curl request in the sheet and every USD/2 readout. Only the page's own
   logic: amounts are whole numbers in USD/2 (dollars × 100), merchants:042 takes the slider's share rounded down and
   platform:fees the rest, so the two sides always meet (Σ 0). Defaults are Hanzo's figures: 100.00 → 10000, 95 / 5 →
   9,500 + 500. Typing, dragging, touch and the arrow keys all drive it; an emptied amount keeps the book on its last total.
   The book (first screen) still posts by itself: new money enters from world, the split posts as one transaction, an
   overdraft is refused whole, a mistake is reversed by a transaction that points back, a retried Idempotency-Key returns
   the original. It pauses on its own button (WCAG 2.2.2) and stops off screen. A journal row or an account reads itself
   back on hover; a tap or Enter pins the reading.
   Entrances (LedgerEnter.jsx, each once, transform/opacity only; JS off, reduced motion or already on screen = final layout):
   1 hero: stack-drop, the book's frame, journal, accounts and bar drop and stack onto each other on load (CSS)
   2 the calculator: velocity-skew, it leans with the speed it was scrolled in at and straightens when the scroll stops
   3 Every cent lands somewhere: spring-snap, each step snaps in from alternate sides and overshoots on a spring
   4 the dark room: word-shuffle, the heading's words and the three tabs land in the wrong slots and swap into place
   5 Get Ledger: inertia-drag, the receipt is thrown in from the left and the prompt from the right with inertia; the
     receipt can then be dragged sideways and thrown, and springs back to its place
   Kept: the book's film and its pointer read-back, the split sliding to 95 / 5 once when seen, the capability pill glide,
   every idle hairline, the hero's line-masked title and the Band opening to full width (now once when it is reached).
   Replaced: the pinned BizChapters scene (now three plain steps, each scene beside its words) and the BizStage scroll
   settle (now the stack-drop). The Numscript copy rides beside the splitter (sticky on desktop); while its sheet is open
   the column rises to z 1000 (Ledger.css), so the sheet and its scrim cover the header and the splitter.
V2: 9/10 motion-map pass: one calculator reprices the book, steps, dark room and request; five distinct entrances in map order; no pinned scenes; the request sheet opens above everything
*/
import { createContext, memo, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, Fragment } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useMotionValue, animate } from 'motion/react';
import { EASE } from '../../ui';
import { A, More, Cta } from '../../kit';
import { Code, useLive } from '../cloud/Frame';
import BizPaste from '../../v2/BizPaste';
import BizLines from '../../v2/BizLines';
import BizSheet from '../../v2/BizSheet';
import { useEntrance, useSkew, useShuffle } from './LedgerEnter';
import './Ledger.css';

const DOCS = 'https://docs.hanzo.ai/docs/cli/books';
const GH = 'https://github.com/hanzoai';
const DEPLOY = 'https://platform.hanzo.ai/deploy';
const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const ACC = ['world', 'users:001', 'merchants:042', 'platform:fees'];
const STEPS = [
  ['Balanced by construction', 'A posting is a movement from one account to another, so an unbalanced entry is not rejected by a check — it cannot be written down. New money enters through one account named world; every other account must stay at or above zero, and a transaction that would push one under is refused whole.'],
  ['Nothing is edited', 'No endpoint changes a posted transaction. A mistake is corrected by a reversing transaction that points back at the original, so what happened and what you meant both survive. Entries can also be SHA-256 chained, each hashed over the one before it, which makes a later edit in the database detectable rather than invisible.'],
  ['Safe to retry', 'Send an Idempotency-Key and a repeat returns the original rather than posting again. The ledger also fingerprints what you sent, so reusing a key with different postings is caught instead of quietly accepted — which is the failure that makes retries dangerous in the first place.'],
];

const fmt = (v) => (v < 0 ? '−' : '') + Math.abs(v).toLocaleString('en-US');
const two = (n) => String(n).padStart(2, '0');

/* The calculator's one state, read by every figure on the page. u / v / f are the book's total, the merchant's share
   and the fee (the last amount above zero); units / vend / fee follow the field exactly as typed. */
const Calc = createContext(null);
const useCalc = () => useContext(Calc);
function useCalcState() {
  const [amt, setAmt] = useState('100.00');
  const [pct, setPct] = useState(95);
  const units = Math.max(0, Math.round((parseFloat(amt) || 0) * 100));
  const last = useRef(10000);
  if (units > 0) last.current = units;
  const u = last.current;
  const v = Math.floor((u * pct) / 100);
  const vend = Math.floor((units * pct) / 100);
  return { amt, setAmt, pct, setPct, units, vend, fee: units - vend, ok: units > 0, u, v, f: u - v };
}

/* the book's three transactions and its film, priced by the calculator */
function useFilm({ u, v, f }) {
  return useMemo(() => {
    const T1 = { id: 1, p: [[0, 1, u]] };
    const T2 = { id: 2, p: [[1, 2, v], [1, 3, f]], key: 'order_42_payout' };
    const T3 = { id: 3, p: [[2, 1, v], [3, 1, f]], back: 2 };
    const B0 = [0, 0, 0, 0], B1 = [-u, u, 0, 0], B2 = [-u, 0, v, f];
    const FILM = [
      [{ b: B0, j: [], n: '' }, { b: B1, j: [T1], n: 'new money enters through world' }, { b: B2, j: [T1, T2], n: 'one transaction, two postings' }, { b: B2, j: [T1, T2], n: 'users:001 → merchants:042 · 100 — refused whole', bad: true }],
      [{ b: B2, j: [T1, T2], n: 'each entry hashed over the one before it', chain: true }, { b: B1, j: [T1, T2, T3], n: 'a reversing transaction points back at the original', chain: true }],
      [{ b: B2, j: [T1, T2], n: 'Idempotency-Key: order_42_payout' }, { b: B2, j: [T1, T2], n: 'the repeat returns the original — transaction 2', hit: 2 }, { b: B2, j: [T1, T2], n: 'same key, different postings — caught', bad: true }],
    ];
    return { T1, T2, T3, B2, FILM };
  }, [u, v, f]);
}
const len = (s) => (s.length > 12 ? ' xl' : s.length > 8 ? ' l' : '');

/* The book, posting by itself while it is on screen; its figures come from the calculator. */
function Book() {
  const { FILM } = useFilm(useCalc());
  const [ref, seen, calm] = useLive(0.2);
  const [held, setHeld] = useState(false);
  const [pt, setPt] = useState(null); // what the pointer is on: { tx } or { acct }
  const kind = useRef('mouse');
  const live = seen && !held && !pt; // reading a row holds the page still under the pointer
  const [at, setAt] = useState(0);
  const [f, setF] = useState(1);
  useEffect(() => { if (calm) { setAt(0); setF(2); } }, [calm]);
  // the first step comes quickly (a balance rolls inside the first second), then the film keeps its own pace
  const first = useRef(true);
  const wait = first.current ? 450 : f >= FILM[at].length - 1 ? 2600 : 1500;
  useEffect(() => {
    if (!live) return;
    const last = f >= FILM[at].length - 1;
    const t = setTimeout(() => { first.current = false; if (!last) setF(f + 1); else { setAt((at + 1) % 3); setF(0); } }, wait);
    return () => clearTimeout(t);
  }, [f, at, live, wait, FILM]);
  const fr = FILM[at][Math.min(f, FILM[at].length - 1)];
  const lastTx = fr.j[fr.j.length - 1];
  const touched = (t) => t.p.flatMap(([s, d]) => [s, d]);
  // the pointer answers: a journal row lights the accounts it touched, an account lights its postings
  const ptTx = pt?.tx && fr.j.find((t) => t.id === pt.tx);
  const hot = new Set(ptTx ? touched(ptTx) : pt?.acct != null ? [pt.acct] : lastTx && !fr.bad ? touched(lastTx) : []);
  const lit = (t) => (pt?.tx === t.id) || (pt?.acct != null && touched(t).includes(pt.acct));
  useEffect(() => { if (pt?.tx && !ptTx) setPt(null); }, [pt, ptTx]);
  const ptAcctTx = pt?.acct != null ? fr.j.filter((t) => touched(t).includes(pt.acct)) : [];
  const read = ptTx ? 'tx ' + ptTx.id + ' · ' + [...new Set(touched(ptTx))].map((i) => '@' + ACC[i]).join(' · ') + ' · Σ 0'
    : pt?.acct != null ? '@' + ACC[pt.acct] + ' · ' + fmt(fr.b[pt.acct]) + (ptAcctTx.length ? ' · ' + ptAcctTx.map((t) => 'tx ' + t.id).join(', ') : '') : null;
  const note = read || fr.n;
  // one way in for every pointer: a mouse reads on hover, a tap or Enter pins the reading (tap again to let go)
  const same = (q) => (q.tx != null ? pt?.tx === q.tx : pt?.acct === q.acct);
  const reader = (q) => ({
    tabIndex: 0,
    onPointerEnter: (e) => { if (e.pointerType === 'mouse') setPt(q); },
    onPointerLeave: (e) => { if (e.pointerType === 'mouse') setPt(null); },
    onPointerDown: (e) => { kind.current = e.pointerType; },
    onClick: () => { if (kind.current !== 'mouse') setPt(same(q) ? null : q); },
    onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPt(same(q) ? null : q); } if (e.key === 'Escape') setPt(null); },
    onBlur: () => setPt(null),
  });
  return (
    <div className="ld-book bz-obj" ref={ref}>
      <div className="ld-bar">
        <span className="ld-bar-t"><i aria-hidden="true" />Double-Entry Ledger</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={at} className="ld-bar-s" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE }}>{STEPS[at][0]}</motion.span>
        </AnimatePresence>
        {/* the time to the next posting: a hairline under the bar fills (CSS, from first paint) and restarts each step */}
        {!calm && <i key={at + '-' + f} className={'ld-tick' + (held || pt ? ' held' : '')} style={{ '--ms': wait + 'ms' }} aria-hidden="true" />}
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
            <div key={a} className={'ld-acct' + (i === 0 ? ' world' : '') + (hot.has(i) ? ' hot' : '')} style={{ '--i': i }} {...reader({ acct: i })}>
              <span className="x-mono">@{a}</span>
              <span className={'ld-bal' + len(fmt(fr.b[i]))}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.b key={fr.b[i]} className="bz-fig" initial={{ y: '60%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-60%', opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>{fmt(fr.b[i])}</motion.b>
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
                <motion.li key={t.id} layout="position" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} className={(fr.hit === t.id ? 'hit' : '') + (t.back ? ' back' : '') + (lit(t) ? ' lit' : '')} {...reader({ tx: t.id })}>
                  <span className="ld-tx x-mono">tx {t.id}{t.back ? ` ↩ ${t.back}` : ''}</span>
                  <div className="ld-posts">
                    {t.p.map(([s, d, val], i) => (
                      <p key={i} className="x-mono"><span>@{ACC[s]}</span><i>→</i><span>@{ACC[d]}</span><b>{fmt(val)}</b></p>
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
            <motion.p key={read ? 'pt-' + read : at + '-' + f} className={'ld-note x-mono' + (fr.bad && !read ? ' bad' : '') + (read ? ' read' : '')} initial={{ opacity: 0, y: 8 }} animate={{ opacity: note ? 1 : 0, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.3, ease: EASE }}>{note || ' '}</motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* The hero paragraph is one paragraph in the HTML (Hanzo's words, untouched) but two places on screen: its first
   sentence under the title, the rest beside the book (desktop) or under it (phone), via display: contents.
   Entrance 1, stack-drop: the book's layers drop and stack on load (Ledger.css). */
function Hero() {
  return (
    <section className="ld-hero" aria-labelledby="ld-h1">
      <div className="bz-wrap ld-hero-grid">
        <BizLines as="h1" id="ld-h1" className="bz-display ld-h1" lines={['Hanzo', 'Ledger']} now delay={0.05} />
        <p className="ld-copy"><span className="bz-lede ld-one">A double-entry ledger you post to over HTTP.</span> <span className="bz-body ld-more">Money here only ever moves: a posting names a source account, a destination account, an amount and an asset. There is no way to write a debit without its credit, because a one-sided entry is not something the API can express.</span></p>
        <div className="bz-acts ld-acts">
          <Cta to={DOCS} id="ledger.hero" thumb>Read the docs</Cta>
          <Cta to={GH} kind="link" id="ledger.github">GitHub</Cta>
        </div>
        <div className="ld-stage"><Book /></div>
      </div>
    </section>
  );
}

const CODE = (c) => `# A split payment: the vendor is paid and the platform takes its cut,
# in one transaction that lands whole or not at all.

curl -X POST http://localhost:3068/v2/main/transactions \\
  -H 'Content-Type: application/json' \\
  -H 'Idempotency-Key: order_42_payout' \\
  -d '{
    "postings": [
      { "source": "users:001", "destination": "merchants:042", "amount": ${c.v}, "asset": "USD/2" },
      { "source": "users:001", "destination": "platform:fees", "amount": ${c.f}, "asset": "USD/2" }
    ],
    "metadata": { "order": "ord_42" }
  }'

# Or say it once in Numscript and let the ledger do the arithmetic:
#
#   send [USD/2 ${c.u}] (
#     source = @users:001
#     destination = { ${c.pct}% to @merchants:042
#                    ${String(100 - c.pct).padStart(3)}% to @platform:fees }
#   )`;
/* The highlighter splits each line into coloured tokens, so the highlighted pane is presentation only: the request is
   also in the page line by line, whole, in a visually hidden copy beside it (what a screen reader reads). */
const SheetCode = memo(function SheetCode({ code }) {
  const ref = useRef(null);
  useEffect(() => { ref.current?.querySelectorAll('.cf-code-body pre').forEach((p) => p.setAttribute('aria-hidden', 'true')); }, [code]);
  return (
    <div ref={ref}>
      <Code tabs={[{ k: 'bash', code }]} light mark="Idempotency-Key: order_42_payout" />
      <div className="x-sr">{code.split('\n').map((l, i) => <p key={i}>{l}</p>)}</div>
    </div>
  );
});

/* The signature: type an amount, drag the split; every figure on the page follows, and the two sides always balance. */
function Splitter() {
  const { amt, setAmt, pct, setPct, units, vend, fee, ok, u, v, f } = useCalc();
  // the first time it is seen, the split slides from even to Hanzo's 95 / 5 once (ease-emphasis), so the
  // postings, the Numscript and the book visibly rewrite themselves; a hand on the slider stops it, reduced motion skips it
  const box = useRef(null);
  const seen = useInView(box, { once: true, amount: 0.5 });
  const calm = useReducedMotion();
  const touched = useRef(false);
  useEffect(() => {
    if (!seen || calm || touched.current) return;
    const run = animate(50, 95, { duration: 1.2, ease: EASE, onUpdate: (x) => { if (!touched.current) setPct(Math.round(x)); } });
    return () => run.stop();
  }, [seen, calm, setPct]);
  const book = [-u, 0, v, f];
  return (
    <div className="ld-split bz-obj" ref={box} data-skew="">
      <p className="ld-split-k"><span className="bz-kick">Split it yourself</span><span className="ld-split-ok x-mono">{ok ? 'Σ 0' : '—'}</span></p>
      <label className="ld-amt">
        <span className="bz-kick">Amount, USD</span>
        <span className="ld-amt-in"><i aria-hidden="true">$</i><input className="bz-fig" inputMode="decimal" value={amt} onChange={(e) => setAmt(e.target.value.replace(/[^0-9.]/g, '').slice(0, 10))} aria-describedby="ld-units" /></span>
      </label>
      <label className="ld-pct">
        <span>to @merchants:042 <b className="x-mono">{pct}%</b></span>
        <input type="range" min="50" max="100" value={pct} onPointerDown={() => { touched.current = true; }} onKeyDown={() => { touched.current = true; }} onChange={(e) => { touched.current = true; setPct(+e.target.value); }} style={{ '--p': ((pct - 50) / 50) * 100 + '%' }} />
      </label>
      <div className="ld-split-bar" aria-hidden="true"><i style={{ transform: `scaleX(${pct / 100})` }} /></div>
      <p id="ld-units" className="ld-units x-mono">{ok ? `${units.toLocaleString('en-US')} in USD/2, the smallest unit: whole numbers, nothing rounds on the way in` : 'Type an amount above zero'}</p>
      <div className="ld-split-out">
        <div className="ld-posting x-mono">
          <p><span>@users:001</span><i>→</i><span>@merchants:042</span><b>{vend.toLocaleString('en-US')}</b></p>
          <p><span>@users:001</span><i>→</i><span>@platform:fees</span><b>{fee.toLocaleString('en-US')}</b></p>
          <p className="sum"><span>sent</span><b>{units.toLocaleString('en-US')}</b><span>received</span><b>{(vend + fee).toLocaleString('en-US')}</b></p>
        </div>
        {/* the book's balances after tx 2, the same numbers the hero book is showing */}
        <div className="ld-mini x-mono" aria-live="polite">
          {ACC.map((a, i) => <p key={a} className={i === 0 ? 'world' : ''}><span>@{a}</span><b>{fmt(book[i])}</b></p>)}
        </div>
        <pre className="ld-ns x-mono" tabIndex={0} aria-label="Numscript">{`send [USD/2 ${units}] (
  source = @users:001
  destination = { ${pct}% to @merchants:042
                  ${100 - pct}% to @platform:fees }
)`}</pre>
      </div>
    </div>
  );
}

/* Entrance 2, velocity-skew. The words ride beside the splitter; the open sheet lifts their column above the header. */
function Numscript() {
  const ref = useRef(null);
  useSkew(ref);
  const c = useCalc();
  const code = CODE(c);
  return (
    <section ref={ref} className="bz-sec ld-nsec" aria-labelledby="ld-ns-h">
      <div className="bz-wrap bz-grid">
        <div className="ld-nsec-copy">
          <h2 id="ld-ns-h" className="bz-headline ld-ns-h" data-skew="">One transaction, however many parties</h2>
          <p className="bz-kick ld-cap-under" data-skew="">Numscript</p>
          <div data-cursor="" className="ld-sheet">
            <BizSheet label="See the request" title="One transaction, however many parties">
              <SheetCode code={code} />
            </BizSheet>
          </div>
        </div>
        <div className="ld-nsec-obj"><Splitter /></div>
      </div>
    </section>
  );
}

/* The three steps, plain: each scene sits beside its own words, priced by the calculator. */
const Arrow = () => <svg viewBox="0 0 64 16" aria-hidden="true"><path d="M0 8h60M53 2l7 6-7 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

function Scene({ i }) {
  const c = useCalc();
  const { T1, T2, T3 } = useFilm(c);
  if (i === 0) return (
    <>
      <div className="ld-post-row">
        <p><span className="bz-kick">source</span><b className="x-mono">@users:001</b></p>
        <span className="ld-post-arrow"><Arrow /><i className="ld-dot" /></span>
        <p><span className="bz-kick">destination</span><b className="x-mono">@merchants:042</b></p>
      </div>
      <div className="ld-post-row two">
        <p><span className="bz-kick">amount</span><b className={'bz-fig' + len(String(c.v))}>{c.v}</b></p>
        <p><span className="bz-kick">asset</span><b className="bz-fig">USD/2</b></p>
      </div>
      <p className="ld-seal"><b className="bz-fig">Σ 0</b><span>debit and credit, one movement</span></p>
    </>
  );
  if (i === 1) return (
    <>
      {[T1, T2, T3].map((t, k) => (
        <div key={t.id} className={'ld-link-row' + (t.back ? ' back' : '')}>
          <span className="ld-chain-tx bz-fig">tx {t.id}</span>
          <div className="ld-chain-p x-mono">{t.p.map(([s, d, val], j) => <p key={j}>@{ACC[s]} → @{ACC[d]} <b>{fmt(val)}</b></p>)}</div>
          <span className="ld-chain-h x-mono">{k ? 'sha256 of tx ' + k : 'sha256'}</span>
        </div>
      ))}
      <svg className="ld-back" viewBox="0 0 40 160" preserveAspectRatio="none" aria-hidden="true"><path d="M6 150 C 38 150, 38 84, 6 84" fill="none" stroke="currentColor" strokeWidth="1.6" vectorEffect="non-scaling-stroke" /><path d="M12 78 L5 84 L12 90" fill="none" stroke="currentColor" strokeWidth="1.6" vectorEffect="non-scaling-stroke" /></svg>
      <p className="ld-chain-n">a reversing transaction points back at the original</p>
    </>
  );
  return (
    <>
      {[['POST', 'order_42_payout', 'tx 2', ''], ['POST', 'order_42_payout', 'the original — tx 2', 'hit'], ['POST', 'order_42_payout', 'different postings — caught', 'bad']].map(([m, k, r, cl], j) => (
        <div key={j} className={'ld-req ' + cl}>
          <span className="x-mono ld-req-m">{m}</span>
          <span className="x-mono ld-req-k">Idempotency-Key: {k}</span>
          <span className="ld-req-r">{r}</span>
        </div>
      ))}
      <p className="ld-seal"><b className="bz-fig">1</b><span>transaction 2, posted once</span></p>
    </>
  );
}

/* Entrance 3, spring-snap: each step on its own, as it is reached. */
function Step({ i, t, d }) {
  const ref = useRef(null);
  const e = useEntrance(ref, '-18%');
  return (
    <li ref={ref} className="ld-step" data-e={e} style={{ '--dir': i % 2 ? -1 : 1 }}>
      <div className="ld-step-copy">
        <h3 className="bz-headline">{t}</h3>
        <p className="bz-kick"><span className="x-mono">{two(i + 1)}</span> / 03</p>
        <p className="bz-body">{d}</p>
      </div>
      <div className={'ld-scene ' + ['ld-post', 'ld-chain', 'ld-retry'][i]}><Scene i={i} /></div>
    </li>
  );
}

function Steps() {
  return (
    <section className="bz-sec ld-ch" aria-labelledby="ld-ch-h">
      <div className="bz-wrap">
        <h2 id="ld-ch-h" className="bz-headline ld-ch-h">Every cent lands somewhere</h2>
        <ol className="ld-steps">{STEPS.map(([t, d], i) => <Step key={t} i={i} t={t} d={d} />)}</ol>
      </div>
    </section>
  );
}

const CAPS = [
  ['send', 'Numscript', 'Describe the movement instead of computing it. Send an amount from an account and split it across destinations by percentage, nesting splits inside splits. The whole flow posts as one transaction, so a fee that cannot be taken takes the payment with it.'],
  ['USD/2', 'Assets carry their own precision', "An asset is a code plus the number of decimal places it uses — USD/2 for cents, and the same shape for points, credits or a token with eighteen. Amounts are whole numbers in the asset's smallest unit, so nothing rounds on the way in."],
  ['Σ users:*', 'Balances arrive with the transaction', 'Each transaction records the balances it produced for the accounts it touched, so a balance is read rather than recomputed from the whole history. Aggregate across a subtree of accounts in one query.'],
];

/* The one dark room: the capability you pick is shown working, on the calculator's split payment. */
function CapObject({ i }) {
  const { u, v, f, pct } = useCalc();
  if (i === 0) return (
    <div className="ld-cobj">
      <pre className="ld-cobj-code x-mono" tabIndex={0} aria-label="Numscript">{`send [USD/2 ${u}] (
  source = @users:001
  destination = { ${pct}% to @merchants:042
                 ${String(100 - pct).padStart(3)}% to @platform:fees }
)`}</pre>
      <div className="ld-cobj-out x-mono"><p><span>@merchants:042</span><b>{fmt(v)}</b></p><p><span>@platform:fees</span><b>{fmt(f)}</b></p><p className="sum"><span>tx 2</span><b>Σ 0</b></p></div>
    </div>
  );
  if (i === 1) return (
    <div className="ld-cobj ld-prec">
      <p><b className={'bz-fig' + len(String(u))}>{u}</b><span className="x-mono">USD/2</span></p>
      <i aria-hidden="true" />
      <p><b className={'bz-fig' + len(String(u))}>{(u / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false })}</b><span className="x-mono">USD</span></p>
    </div>
  );
  return (
    <div className="ld-cobj ld-bals">
      <p className="ld-bals-tx x-mono">tx 2</p>
      {[['users:001', '0'], ['merchants:042', fmt(v)], ['platform:fees', fmt(f)]].map(([a, val]) => <p key={a} className="x-mono"><span>@{a}</span><b>{val}</b></p>)}
      <p className="sum x-mono"><span>Σ users:*</span><b>0</b></p>
    </div>
  );
}

const CAPS_H = 'What the API gives you'.split(' ');
/* Entrance 4, word-shuffle: the heading's words and the three tabs. */
function Caps() {
  const ref = useRef(null);
  useShuffle(ref, ['.ld-caps-head h2 .ld-w', '.ld-caps-tabs > button']);
  const [i, setI0] = useState(0);
  const [moved, setMoved] = useState(false);
  const setI = (k) => { setMoved(true); setI0(k); };
  const key = (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); setI((i + 1) % 3); } if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); setI((i + 2) % 3); } };
  return (
    <section ref={ref} className="bz-sec ld-caps" data-room="dark" aria-labelledby="ld-caps-h">
      <div className="bz-wrap">
        <header className="ld-caps-head">
          <h2 id="ld-caps-h" className="bz-headline">{CAPS_H.map((w, k) => <Fragment key={k}>{k ? ' ' : ''}<span className="ld-w">{w}</span></Fragment>)}</h2>
          <p className="ld-caps-k x-mono">Capabilities</p>
        </header>
        <div className="ld-caps-tabs" role="tablist" aria-label="Capabilities" onKeyDown={key}>
          {CAPS.map(([g], k) => (
            <button key={g} type="button" role="tab" id={'ld-cap-t' + k} aria-selected={i === k} aria-controls={'ld-cap-p' + k} tabIndex={i === k ? 0 : -1} onClick={() => setI(k)} className="x-mono">
              {i === k && <motion.span layoutId="ld-cap-pill" className="ld-caps-pill" transition={{ duration: 0.3, ease: EASE }} />}
              <span>{g}</span>
            </button>
          ))}
        </div>
        {CAPS.map(([g, t, d], k) => (
          <div key={t} className={'ld-cap' + (moved ? ' moved' : '')} role="tabpanel" id={'ld-cap-p' + k} aria-labelledby={'ld-cap-t' + k} hidden={i !== k}>
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

const Gh = () => <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;

/* "Get Ledger" as the book's last entry: a receipt in hairlines (licence, source) beside the agent prompt, totalling
   Σ 0 like everything else here; then one full-width row for the secondary.
   Entrance 5, inertia-drag: both are thrown in from the sides and coast to a stop against their places; the receipt can
   then be grabbed, pulled sideways and thrown, and springs back (touch keeps vertical scroll: drag is x only). */
function Get() {
  const ref = useRef(null);
  const e = useEntrance(ref, '-20%');
  const calm = useReducedMotion();
  const x1 = useMotionValue(0), x2 = useMotionValue(0), o = useMotionValue(1);
  useIso(() => {
    if (e === 'armed') { x1.set(-360); x2.set(360); o.set(0); }
    if (e !== 'go') return;
    const runs = [
      animate(o, 1, { duration: 0.25, ease: 'linear' }),
      animate(x1, 0, { type: 'inertia', velocity: 2600, max: 0, power: 0.9, timeConstant: 320, bounceStiffness: 260, bounceDamping: 16 }),
      animate(x2, 0, { type: 'inertia', velocity: -2600, min: 0, power: 0.9, timeConstant: 320, bounceStiffness: 260, bounceDamping: 16, delay: 0.12 }),
    ];
    return () => runs.forEach((r) => r.stop());
  }, [e]);
  return (
    <section ref={ref} className="ld-get" aria-labelledby="ld-get-h">
      <div className="bz-wrap bz-grid ld-get-grid">
        <motion.div className="ld-receipt" style={{ x: x1, opacity: o }} drag={calm ? false : 'x'} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.55} dragTransition={{ bounceStiffness: 260, bounceDamping: 16 }}>
          <h2 id="ld-get-h" className="bz-headline">Get Ledger</h2>
          <p className="ld-rc-tag">Double-entry accounting ledger</p>
          <dl className="ld-rc-rows x-mono">
            <div><dt>License:</dt><dd>Apache-2.0</dd></div>
            <div><dt><Gh /></dt><dd><A to={GH} className="ld-rc-a">hanzoai</A></dd></div>
          </dl>
          <div className="ld-links"><More to={GH}>View on GitHub</More></div>
          <p className="ld-rc-sum x-mono" aria-hidden="true"><span>Σ</span><b>0</b></p>
        </motion.div>
        <motion.div className="ld-get-paste" style={{ x: x2, opacity: o }}>
          <BizPaste name="Ledger" prompt="Read https://hanzo.ai/skill.md and use Hanzo Ledger in my project." className="ld-paste" />
        </motion.div>
      </div>
      <div className="bz-wrap"><A to={DEPLOY} className="ld-row" data-cta="ledger.deploy"><span>Deploy to Cloud</span><svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></A></div>
    </section>
  );
}

/* The closing Band: the page's own sentence and the one ask, centred in the one black room after the dark capabilities.
   It arrives as a rounded card inside the gutters and opens to the full width once, when it is reached (transform only),
   then meets the footer with no gap. */
function End() {
  const calm = useReducedMotion();
  return (
    <section className="ld-band" data-room="dark" aria-labelledby="ld-start-h">
      <motion.div className="ld-band-bg" initial={{ scaleX: calm ? 1 : 0.94 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.9, ease: EASE }} aria-hidden="true" />
      <div className="bz-wrap ld-band-in">
        <BizLines id="ld-start-h" className="bz-display md" lines={['Get started', 'with Ledger']} />
        <p className="bz-lede">Post your first transaction over HTTP, or describe the whole split once in Numscript and let the ledger do the arithmetic.</p>
        <div className="bz-acts"><Cta to={DOCS} id="ledger.close">Read the docs</Cta></div>
      </div>
    </section>
  );
}

export default function Ledger() {
  const calc = useCalcState();
  // one solid fill per screen: while the page's own ask (hero or Band) is on screen, the header's ask draws as an
  // outline (Ledger.css, html:has(main.ld[data-ask-on]))
  const ref = useRef(null);
  useEffect(() => {
    const main = ref.current;
    const asks = [...main.querySelectorAll('[data-cta="ledger.hero"], [data-cta="ledger.close"]')];
    const on = new Set();
    const io = new IntersectionObserver((es) => {
      es.forEach((x) => (x.isIntersecting ? on.add(x.target) : on.delete(x.target)));
      if (on.size) main.setAttribute('data-ask-on', ''); else main.removeAttribute('data-ask-on');
    });
    asks.forEach((a) => io.observe(a));
    return () => io.disconnect();
  }, []);
  return (
    <Calc.Provider value={calc}>
      <main className="bz ld" data-ask-on="" ref={ref}>
        <span data-ask-name="Hanzo Ledger" hidden />
        <Hero />
        <Numscript />
        <Steps />
        <Caps />
        <Get />
        <End />
      </main>
    </Calc.Provider>
  );
}
