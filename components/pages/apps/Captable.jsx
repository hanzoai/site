'use client';
/* Cap Table (v2, archetype A "Launch" told like a model launch; Hanzo's deck only: greys and ink, MASTER §3).
   Persona: a founder or finance lead about to raise, who needs to know what the next round does to the table
   Goal: see the founders' fully diluted share move with the price, then start with Hanzo
   CTA: Try Hanzo -> /login (the header's solid ask; the page's own are quiet kit Ctas in the hero, with thumb, and the close; data-cta captable.hero / captable.close)
   Metric: signup_start
   Signature: `calculator` (Live calculator, MOTION-MAP). Four inputs re-plan the whole page instantly: the pre-money
   price, the raise and the option pool in the hero's round card, and the exit price in the waterfall room right after
   it. Every figure follows at once: the founders' fully diluted share (88px, rolling digit by digit), the ownership
   bar, the cap table, the SAFE's conversion (cap or discount), the waterfall's payouts and the live figure on each of
   the six instruments below. Until a hand touches it the pre-money drifts by itself (first step at 450ms; its own
   pause button); any input takes over. Keyboard: every input is a native range with a label, value text and ring.
   Order: hero calculator → the waterfall (exit price) → the six instruments as a live ledger → term sheet → open
   source → plans → close. No pinned scene, no scroll scrub; one reveal (the line mask on the h1 and the close).
// Entrances: 1 pull-back → the waterfall room; 2 zoom-through → the instruments ledger; 3 inertia-drag → the term
   sheet (thrown in from the right, then draggable and thrown back); 4 split-merge → open source (the two columns
   meet); 5 count-roll → the plan prices ($50, $150). Page-local in captable/Entrances.jsx + Captable.css [data-e].
   Motion: the running round (idle) + digit roll on every live figure (state) + plan cards that open (state, BizOpen)
   + the fork drawing drawing in once; the exit price grows 64→84px while the hand is on it. Tweens only.
   All inputs are an example company's, labelled as such; the arithmetic is the real thing. Every word and link is Hanzo's.
V2: 8/10 signature: a live cap-table calculator (pre-money, raise, pool, exit) re-plans the table, bar, waterfall and all six instrument figures at once; pinned chapters removed
*/
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { A, More, Cta } from '../../kit';
import { useLive } from '../cloud/Frame';
import BizLines from '../../v2/BizLines';
import BizSheet from '../../v2/BizSheet';
import BizOpen from '../../v2/BizOpen';
import { useEnter, CountTo } from './captable/Entrances';
import { EASE_OUT_EXPO } from '../../../lib/motion';
import './Captable.css';

const DOCS = 'https://docs.hanzo.ai/docs/cli/captable';
const REPO = 'https://github.com/hanzoai/captable';
const UP = 'https://github.com/captableinc/captable';
const DEPLOY = 'https://platform.hanzo.ai/deploy';
const two = (n) => String(n).padStart(2, '0');

// the example company: inputs only; everything shown is computed from them
// the example company: the starting inputs; the pre-money, the raise, the pool and the exit price are the calculator's
const FOUND = 8_000_000, SAFE = 500_000, CAP = 8_000_000, DISC = 0.2;
const START = { pre: 12_000_000, raise: 2_000_000, pool: 1_000_000, exit: 6_000_000 };
function model(pre, raise = START.raise, pool = START.pool) {
  const preSh = FOUND + pool;
  const price = pre / preSh;
  const safePrice = Math.min(CAP / preSh, price * (1 - DISC));
  const safeSh = SAFE / safePrice;
  const newSh = raise / price;
  const total = preSh + safeSh + newSh;
  return { price, byCap: CAP / preSh <= price * (1 - DISC), safeSh, newSh, total, rows: [['Founders', FOUND, 'Common'], ['Option pool', pool, 'ISO and NSO'], ['SAFE', safeSh, 'converts'], ['New investor', newSh, 'Preferred']].map(([n, s, k]) => [n, s, s / total, k]) };
}
const USD = (v) => '$' + (v >= 1e6 ? (v / 1e6).toFixed(v >= 1e7 ? 0 : 1) + 'M' : Math.round(v).toLocaleString('en-US'));
const PCT = (v) => (v * 100).toFixed(1) + '%';
const SH = (v) => Math.round(v).toLocaleString('en-US');

const STEPS = [
  ['Share classes', 'Common, preferred, and custom share classes, with authorized shares, par value and voting rights.'],
  ['Option grants', 'ISO and NSO, with the cliff and the schedule attached to the grant.'],
  ['SAFEs and notes', 'Caps, discounts and interest held as terms, not as a note in a folder.'],
  ['Run the round', 'What they convert into at a given price is a calculation you can run before you agree to it.'],
  ['Fully diluted', 'What everyone owns once the options and the notes convert.'],
  ['Waterfall', 'At an exit price, who gets paid and in what order.'],
];

/* A figure whose characters roll to their new value one by one (transform and opacity only). */
function Roll({ text, className = '' }) {
  return (
    <span className={'ct-roll ' + className}>
      <span className="x-sr">{text}</span>
      {[...text].map((c, i) => (
        <span className="ct-roll-s" key={i + '/' + text.length} aria-hidden="true">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span key={c} initial={{ y: '62%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-62%', opacity: 0 }} transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}>{c}</motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}

/* The ownership bar: each holder a segment, moved and sized by transform only. */
function Bar({ rows, lit }) {
  let x = 0;
  const segs = rows.map(([n, , p], i) => { const st = x; x += p; return [n, st, p, i]; });
  return (
    <div className="ct-bar" aria-hidden="true">
      {segs.map(([n, st, p, i]) => <i key={n} className={'ct-seg ct-s' + i + (lit && !lit.includes(i) ? ' off' : '')} style={{ transform: `translateX(${st * 100}%) scaleX(${p})` }} />)}
      {segs.slice(1).map(([n, st]) => <b key={n} className="ct-sep" style={{ transform: `translateX(${st * 100}%)` }} />)}
    </div>
  );
}

function Table({ rows, lit }) {
  return (
    <table className="ct-table">
      <thead><tr><th>Holder</th><th className="ct-k">Class</th><th className="ct-n">Shares</th><th>Fully diluted</th></tr></thead>
      <tbody>
        {rows.map(([n, s, p, k], i) => (
          <tr key={n} className={lit ? (lit.includes(i) ? 'on' : 'off') : ''}>
            <td><i className={'ct-dot ct-s' + i} />{n}</td><td className="ct-k">{k}</td><td className="ct-n x-mono">{SH(s)}</td><td className="x-mono">{PCT(p)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const PauseIcon = ({ on }) => (on
  ? <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /></svg>
  : <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" fill="currentColor" /></svg>);

/* One calculator input: a native range with its label, its value and a value text for screen readers. */
function Dial({ id, label, value, min, max, step, fmt, text, onChange, big, children }) {
  return (
    <div className={'ct-slide ct-dial' + (big ? ' big' : '')}>
      <div className="ct-dial-k">
        <label htmlFor={id} className="ct-slide-l x-mono">{label}</label>
        {children}
      </div>
      <b className="bz-fig ct-dial-v" aria-hidden="true">{fmt(value)}</b>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} style={{ '--f': (value - min) / (max - min) }} aria-valuetext={fmt(value) + ' ' + text} />
    </div>
  );
}

function Hero({ c, set, mine, setMine }) {
  const [ref, live, calm] = useLive(0.3);
  const dir = useRef(1);
  const ran = useRef(false);
  const pre = c.pre;
  useEffect(() => {
    if (!live || mine) return;
    // until a hand takes over, the pre-money drifts: first step at 450ms, then one every 1.3s
    const t = setTimeout(() => {
      ran.current = true;
      let n = pre + dir.current * 500_000;
      if (n > 24_000_000 || n < 6_000_000) { dir.current *= -1; n = pre + dir.current * 500_000; }
      set('pre', n);
    }, ran.current ? 1300 : 450);
    return () => clearTimeout(t);
  }, [pre, live, mine, set]);
  const hand = (k) => (v) => { setMine(true); set(k, v); };
  const m = model(c.pre, c.raise, c.pool);
  return (
    <section className="ct-hero" ref={ref} aria-labelledby="ct-h1">
      <div className="bz-wrap bz-grid ct-hero-grid">
        <div className="ct-copy">
          <BizLines as="h1" id="ct-h1" className="bz-display" lines={['Hanzo Cap Table']} now />
          <p className="ct-cat x-mono">Equity Management Platform</p>
        </div>
        <div className="ct-big">
          <span className="ct-big-z"><Roll text={PCT(m.rows[0][2])} className="bz-fig ct-big-n" /></span>
          <p className="ct-big-s"><span className="ct-big-k x-mono">Founders, fully diluted</span><span>at a <b className="x-mono">{USD(pre)}</b> pre-money price</span></p>
        </div>
        <p className="bz-lede ct-lede">Who owns what, and what happens to that when you raise again.</p>
        <div className="ct-acts">
          <Cta to="/login" id="captable.hero" thumb>Try Hanzo</Cta>
          <Cta kind="link" to={DOCS} id="captable.docs">Documentation</Cta>
        </div>
        <div className="ct-obj bz-obj">
          <p className="ct-calc-k bz-kick">A round, run first</p>
          <div className="ct-dials">
            <Dial id="ct-pre" label="Pre-money price" value={c.pre} min={6e6} max={24e6} step={250_000} fmt={USD} text="pre-money" onChange={hand('pre')} big>
              {!calm && <button type="button" className="ct-pause" onClick={() => setMine(!mine)} aria-pressed={mine} aria-label={mine ? 'Play' : 'Pause'}><PauseIcon on={mine} /></button>}
            </Dial>
            <Dial id="ct-raise" label="Raise" value={c.raise} min={500_000} max={8e6} step={250_000} fmt={USD} text="raise" onChange={hand('raise')} />
            <Dial id="ct-pool" label="Option pool" value={c.pool} min={250_000} max={3e6} step={50_000} fmt={SH} text="shares in the option pool" onChange={hand('pool')} />
          </div>
          <Bar rows={m.rows} />
          <Table rows={m.rows} />
          <p className="ct-terms x-mono">raise {USD(c.raise)} · SAFE {USD(SAFE)}, cap {USD(CAP)}, discount {DISC * 100}% · converts at its {m.byCap ? 'cap' : 'discount'}</p>
          <p className="ct-eg">Example company. Every number in it is an input you would give your own.</p>
        </div>
      </div>
    </section>
  );
}

/* The six instruments as a live ledger: each row carries the figure it is about, re-planned by the calculator. */
function Ledger({ c }) {
  const m = model(c.pre, c.raise, c.pool);
  const pay = payout(c.exit, m.rows, c.raise);
  const live = [
    ['Common · Preferred', 'Founders · New investor'],
    [SH(c.pool), 'Option pool · ISO and NSO'],
    [USD(SAFE), 'cap ' + USD(CAP) + ' · ' + DISC * 100 + '%'],
    [SH(m.safeSh), 'converts at its ' + (m.byCap ? 'cap' : 'discount')],
    [SH(m.total), 'Fully diluted'],
    [USD(pay[0]), 'Founders · ' + USD(c.exit)],
  ];
  const [ref, e] = useEnter(0.15); // entrance 2: zoom-through
  return (
    <section ref={ref} data-e={e} className="bz-sec ct-ins" aria-labelledby="ct-ins-h">
      <header className="bz-wrap bz-grid ct-ch-head">
        <h2 id="ct-ins-h" className="bz-headline">The instruments, modelled</h2>
        <p className="bz-lede">A spreadsheet can hold these numbers. It cannot tell you what they become at the next price.</p>
      </header>
      <div className="bz-wrap">
        <ol className="ct-ledger">
          {STEPS.map(([t, d], i) => (
            <li key={t}>
              <span className="ct-led-n x-mono">{two(i + 1)} / 06</span>
              <div className="ct-led-t"><h3>{t}</h3><p>{d}</p></div>
              <div className="ct-led-v"><Roll text={live[i][0]} className="bz-fig" /><span className="x-mono">{live[i][1]}</span></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const CLAUSES = [
  ['Ownership, fully diluted', 'The number that matters is not how many shares exist, it is what everyone owns once the options and the notes convert. That is the default view here.'],
  ['Share Classes', 'Common, preferred, and custom share classes. Track authorized shares, par value, and voting rights.'],
  ['Option grants', 'ISO and NSO, with the cliff and the schedule attached to the grant. Vested-to-date is computed from the dates rather than typed in and left to rot.'],
  ['SAFEs and notes', 'Caps, discounts and interest held as terms, not as a note in a folder. What they convert into at a given price is a calculation you can run before you agree to it.'],
  ['Equity Plans', 'Option pools and equity incentive plans. Manage board-approved pools with real-time utilization tracking.'],
  ['Built-in E-Signing', 'Integrated document signing for equity grants, board consents, and stock purchase agreements.'],
  ['Stakeholders', "Founders, employees, investors and advisors, each seeing their own holding and nobody else's. The exercise window after someone leaves is a date the system knows, not one they have to remember."],
  ['Waterfall', "At an exit price, who gets paid and in what order. Preferences mean the founders' share is not their percentage, and this is where that becomes visible."],
  ['Audit Trail', 'Complete audit history for every transaction. SOC 2 compatible controls and data integrity.'],
  ['SSO Authentication', 'Passkeys, Google SSO, and Hanzo IAM single sign-on for secure access.'],
];
const num = (i) => (i < 4 ? '1' : '2') + '.' + ((i % 4) + 1 + (i >= 8 ? 4 : 0));

/* The ten clauses as a term sheet: the page shows their titles; the sheet holds every word. */
function TermSheet() {
  const [ref, e] = useEnter(0.2); // entrance 3: inertia-drag (thrown in, then the sheet itself can be dragged and thrown)
  return (
    <section className="bz-sec ct-ts" aria-labelledby="ct-ts-h">
      <div className="bz-wrap bz-grid">
        <div ref={ref} data-e={e} className="ct-doc-in">
        <motion.div className="ct-doc" drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.32} dragTransition={{ bounceStiffness: 260, bounceDamping: 18 }}>
          <p className="ct-doc-k x-mono"><span>Term sheet</span><span>Hanzo Cap Table</span></p>
          <h2 id="ct-ts-h" className="x-sr">Term sheet</h2>
          <ol className="ct-toc">
            {CLAUSES.map(([t], i) => <li key={t}><span className="x-mono">{num(i)}</span><span className="bz-title">{t}</span></li>)}
          </ol>
          <div className="ct-doc-foot">
            <BizSheet label="Read the term sheet" kick="Term sheet" title="Hanzo Cap Table" btnClass="ct-doc-btn">
              <ol className="ct-clauses">
                {CLAUSES.map(([t, d], i) => (
                  <li key={t}>
                    <span className="x-mono">{num(i)}</span>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </li>
                ))}
              </ol>
            </BizSheet>
            <span className="ct-sign" aria-hidden="true"><em className="x-mono">Hanzo Cap Table</em></span>
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}

/* Beyond: the waterfall at an exit price, preferences paid first (1x, non-participating, as an example). */
function payout(exit, rows, raise) {
  const pref = { 2: SAFE, 3: raise };
  let conv = new Set([0, 1, 2, 3]);
  for (let k = 0; k < 3; k++) {
    const prefPaid = [2, 3].filter((i) => !conv.has(i)).reduce((a, i) => a + Math.min(pref[i], exit), 0);
    const rest = Math.max(0, exit - prefPaid);
    const sh = [...conv].reduce((a, i) => a + rows[i][1], 0);
    const next = new Set([0, 1]);
    [2, 3].forEach((i) => { if ((rows[i][1] / sh) * rest >= pref[i]) next.add(i); });
    if ([...next].join() === [...conv].join()) break;
    conv = next;
  }
  const prefPaid = [2, 3].filter((i) => !conv.has(i)).reduce((a, i) => a + Math.min(pref[i], exit), 0);
  const scale = prefPaid > exit ? exit / prefPaid : 1;
  const rest = Math.max(0, exit - prefPaid);
  const sh = [...conv].reduce((a, i) => a + rows[i][1], 0);
  return rows.map((r, i) => (conv.has(i) ? (r[1] / sh) * rest : Math.min(pref[i], exit) * scale));
}

function Waterfall({ c, set }) {
  const { pre, exit } = c;
  const setExit = (v) => set('exit', v);
  const [act, setAct] = useState(false);
  const [ref, e] = useEnter(0.25); // entrance 1: pull-back
  const m = model(c.pre, c.raise, c.pool);
  const pay = payout(exit, m.rows, c.raise);
  const order = [3, 2, 0, 1];
  return (
    <section ref={ref} data-e={e} className="bz-sec ct-wf" data-room="dark" aria-labelledby="ct-wf-h">
      <div className="bz-wrap bz-grid">
        <div className="ct-wf-copy">
          <h2 id="ct-wf-h" className="bz-headline">At an exit price, who gets paid and in what order.</h2>
          <p className="bz-body">Preferences mean the founders&apos; share is not their percentage, and this is where that becomes visible.</p>
          <label className={'ct-exit' + (act ? ' act' : '')}>
            <span className="ct-exit-k x-mono">Exit price</span>
            <b className="bz-fig">{USD(exit)}</b>
            <input id="ct-exit" type="range" min="1000000" max="60000000" step="500000" value={exit} onChange={(e) => setExit(+e.target.value)} onPointerDown={() => setAct(true)} onPointerUp={() => setAct(false)} onPointerCancel={() => setAct(false)} onBlur={() => setAct(false)} style={{ '--f': (exit - 1e6) / 59e6 }} aria-valuetext={USD(exit) + ' exit'} />
          </label>
          <p className="ct-wf-note">The example company after the round above at {USD(pre)} pre-money, with the new investor and the SAFE taking a 1x preference, not participating.</p>
        </div>
        <div className="ct-falls">
          <p className="ct-falls-k x-mono"><span>Waterfall</span><span>{USD(exit)}</span></p>
          <ol>
          {order.map((i, k) => (
            <li key={i} className={'ct-fall' + (i === 0 ? ' me' : '')} style={{ '--k': k }}>
              <p className="ct-fall-h"><span className="x-mono">{k + 1}</span><b>{m.rows[i][0]}</b><em className="x-mono">{PCT(m.rows[i][2])} owned</em></p>
              <i className="ct-fall-bar"><b className={'ct-s' + i} style={{ transform: `scaleX(${exit ? pay[i] / exit : 0})` }} /></i>
              <p className="ct-fall-n"><span className="bz-fig">{USD(pay[i])}</span><em className="x-mono">{exit ? PCT(pay[i] / exit) : '0%'} of the exit</em></p>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

const PLANS = [
  ['Community', 'Free', '', 'Self-host and own your data. Full source code on GitHub.', ['Get on GitHub', 'https://github.com/hanzoai/'], ['Unlimited stakeholders', 'Share classes & options', 'SAFEs & convertible notes', 'Vesting schedules', 'Basic reporting', 'Community support']],
  ['Startup', '$50', '/mo', 'For early-stage startups managing their first cap table.', ['Contact Sales', '/contact-sales'], ['Everything in Community', 'Managed cloud hosting', 'E-signing for grants', 'Waterfall analysis', '409A valuation tracking', 'Email support', 'Up to 25 stakeholders']],
  ['Growth', '$150', '/mo', 'For growing companies with complex equity structures.', ['Contact Sales', '/contact-sales'], ['Everything in Startup', 'Advanced equity plans', 'Board consent workflows', 'Data room integration', 'Custom branding', 'SSO / SAML', 'Priority support']],
  ['Enterprise', 'Custom', '', 'For companies with advanced compliance and security needs.', ['Contact Sales', '/contact-sales'], ['Everything in Growth', 'Dedicated infrastructure', 'Custom SLA', 'On-premise deployment', 'Compliance certifications', 'Dedicated account manager', '24/7 phone support']],
];

/* Plans: four cards, each opening into the plan's own panel. */
function Plans() {
  return (
    <section className="bz-sec ct-plans" aria-labelledby="ct-plans-h">
      <div className="bz-wrap bz-grid">
        <header className="ct-plans-head">
          <h2 id="ct-plans-h" className="bz-headline">Simple, Transparent Pricing</h2>
          <p className="bz-body">Free and open source forever. Self-host or use our managed cloud.</p>
        </header>
        <BizOpen
          label="Simple, Transparent Pricing"
          className="ct-plan-grid"
          items={PLANS.map(([t, p, per, d, [cta, to], li], i) => ({
            id: 'plan-' + t.toLowerCase(),
            label: t,
            className: 'ct-plan' + (i === 2 ? ' pop' : ''),
            card: (
              <>
                <span className="ct-pc-t"><span className="bz-kick">{t}</span>{i === 2 && <span className="ct-popular">Most Popular</span>}</span>
                <span className="ct-pc-p">{/^\$\d+$/.test(p)
                  // entrance 5: count-roll, the plan prices count up and roll into their values
                  ? <CountTo value={+p.slice(1)} prefix="$" render={(s) => <Roll text={s} className="bz-fig" />} />
                  : <b className="bz-fig">{p}</b>}{per && <em>{per}</em>}</span>
                <span className="ct-pc-d">{d}</span>
                <span className="ct-pc-f">{li.find((x) => !x.startsWith('Everything'))}</span>
              </>
            ),
            panel: (
              <div className="ct-pp">
                <div className="ct-pp-l">
                  <h3 className="bz-headline">{t}</h3>
                  <p className="ct-pp-p"><b className="bz-fig">{p}</b>{per && <em>{per}</em>}{i === 2 && <span className="ct-popular">Most Popular</span>}</p>
                  <p className="bz-body">{d}</p>
                  <More to={to}>{cta}</More>
                </div>
                <ul className="ct-pp-f">{li.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
            ),
          }))}
        />
      </div>
    </section>
  );
}

const Gh = () => <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;

/* The fork, drawn: upstream captableinc/captable runs on top, hanzoai/captable branches off it and sends work back
   (Hanzo's "we contribute back"). The two lines draw in once, when the drawing is on screen. */
function Fork() {
  const [ref, live, calm] = useLive(0.5);
  const [seen, setSeen] = useState(false);
  useEffect(() => { if (live || calm) setSeen(true); }, [live, calm]);
  const up = [40, 120, 200, 280, 360, 440];
  const me = [260, 330, 440];
  return (
    <div ref={ref} className={'ct-fork' + (seen ? ' in' : '')}>
      <div className="ct-fork-l up"><More to={UP}>Upstream: captableinc/captable</More></div>
      <svg className="ct-fork-svg" viewBox="0 0 480 104" aria-hidden="true">
        <path className="ct-fork-up" d="M8 22H472" pathLength="1" />
        <path className="ct-fork-me" d="M120 22C170 22 166 82 216 82H472" pathLength="1" />
        <path className="ct-fork-back" d="M330 82C372 82 368 22 410 22" pathLength="1" />
        {up.map((x, i) => <circle key={'u' + x} className="ct-fork-d up" cx={x} cy="22" r="6" style={{ '--i': i }} />)}
        {me.map((x, i) => <circle key={'m' + x} className="ct-fork-d me" cx={x} cy="82" r="6" style={{ '--i': i + 3 }} />)}
      </svg>
      <div className="ct-fork-l me"><More to={REPO}>hanzoai/captable</More></div>
    </div>
  );
}

/* Where it comes from and the ways in: quiet rows before the close. */
function Ways() {
  const [ref, e] = useEnter(0.2); // entrance 4: split-merge (the two columns slide in from either side and meet)
  return (
    <section ref={ref} data-e={e} className="bz-sec ct-more" aria-labelledby="ct-oss-h">
      <div className="bz-wrap bz-grid">
        <div className="ct-oss">
          <h2 id="ct-oss-h" className="bz-title">Built on Open Source</h2>
          <p className="bz-body">Hanzo Cap Table is built on <A to={UP}>Captable, Inc.</A> (OpenCap), the open-source alternative to Carta, Pulley, and AngelList. We contribute back to the community and extend it with Hanzo IAM integration, e-signing, and enterprise features.</p>
          <Fork />
        </div>
        <div className="ct-side">
          <ul className="ct-ways">
            <li><A to={DOCS} className="ct-way"><b>Documentation</b><span>Explore our guides and API references</span><em>View Docs →</em></A></li>
            <li><A to={REPO} className="ct-way"><b>For Developers</b><span>Self-host or integrate via API</span><em>View on GitHub →</em></A></li>
            <li><A to="/contact-sales" className="ct-way"><b>Need a Custom Solution?</b><span>Our team can help you set up and migrate your cap table with advanced compliance and security features.</span><em>Contact Sales →</em></A></li>
          </ul>
        </div>
        <div className="ct-get">
          <div className="ct-get-t">
            <h3 className="ct-get-h"><Gh />Get Captable</h3>
            <p>Cap table + equity management</p>
          </div>
          <div className="ct-chips">
            <span className="ct-chip"><span>License:</span> Apache-2.0</span>
            <A to={REPO} className="ct-chip"><Gh />hanzoai/captable<em>3 stars</em></A>
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
    <section className="bz-sec ct-end" aria-labelledby="ct-end-h">
      <div className="bz-wrap">
        <BizLines id="ct-end-h" className="bz-display md" lines={['Put the current', 'table in, then', 'model the round']} />
        <div className="bz-grid ct-end-row">
          <p className="bz-lede">Import what you have today. The useful part starts when you ask what the next price does to it.</p>
          <div className="ct-end-go">
            <Cta kind="quiet" to="/login" id="captable.close">Try Hanzo</Cta>
            <p><b>Get Started</b><span>Set up your cap table in minutes</span></p>
          </div>
        </div>
        <A to={DOCS} className="ct-row"><span>Get started with Cap Table</span><em>Read the docs<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></em></A>
      </div>
    </section>
  );
}

/* phones: while the hero's solid "Try Hanzo" is on screen the header's button reads as an outline (the shell's own
   html[data-ask=quiet] switch, which it already sets on desktop), so one solid fill shows at a time */
function useOneSolidOnPhone() {
  useEffect(() => {
    const H = document.documentElement, mq = matchMedia('(max-width: 700px)');
    const el = document.querySelector('[data-cta="captable.hero"]');
    if (!el) return;
    let vis = false, mine = false;
    const apply = () => { if (mq.matches && vis) { H.dataset.ask = 'quiet'; mine = true; } else if (mine) { delete H.dataset.ask; mine = false; } };
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; apply(); });
    io.observe(el);
    const t = [300, 1400].map((ms) => setTimeout(apply, ms));
    mq.addEventListener('change', apply);
    return () => { io.disconnect(); t.forEach(clearTimeout); mq.removeEventListener('change', apply); if (mine) delete H.dataset.ask; };
  }, []);
}

export default function Captable() {
  useOneSolidOnPhone();
  // the calculator: one state for the whole page; every section reads it, so any input re-plans everything at once
  const [c, setC] = useState(START);
  const set = useCallback((k, v) => setC((o) => (o[k] === v ? o : { ...o, [k]: v })), []);
  const [mine, setMine] = useState(false);
  return (
    <main className="bz ct">
      <span data-ask-name="Hanzo Cap Table" hidden />
      <Hero c={c} set={set} mine={mine} setMine={setMine} />
      <Waterfall c={c} set={set} />
      <Ledger c={c} />
      <TermSheet />
      <Ways />
      <Plans />
      <End />
    </main>
  );
}
