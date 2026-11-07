'use client';
/* Cap Table (v2, archetype A "Launch" told like a model launch; greys and ink only, JAMES.md 7).
   Persona: a founder or finance lead about to raise, who needs to know what the next round does to the table (metric signup_click)
   Goal: see the founders' fully diluted share move with the price, then start with Hanzo
   CTA: Try Hanzo -> /login (hero, sticky AskBar, phone thumb bar, close; data-thumb, data-cta)
   Signature: a round you run before you agree to it. The number is the hero: the founders' fully diluted share,
   gigantic and live, beside the example company's table it comes from. The pre-money price drifts by itself (pause it
   on its own button, or drag it), the SAFE converts at its cap or its discount, the new investor's shares appear, the
   bar and the table re-flow, and the figure rolls to its new value digit by digit. It stops off screen.
   Beyond: "The waterfall, by hand". Set an exit price and see who gets paid in what order: below the preference the
   founders' share is not their percentage, which Hanzo says is exactly where it becomes visible.
   Motion: the running round (idle, signature) + sticky chapters lighting rows (scroll) + plan cards that open
   (state, BizOpen) + headlines cut into their line; the exit price and the round answer the hand (drag).
   All inputs are an example company's, labelled as such; the arithmetic is the real thing. Every word and link is Hanzo's.
V2: 8/10 the founders' share as a gigantic live figure beside its table on the first screen at both sizes, greys only, six chapters lighting rows, term sheet in a sheet, waterfall dark room, plans that open, one ask everywhere
*/
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { A, More } from '../../kit';
import { useLive, useEvery } from '../cloud/Frame';
import BizLines from '../../v2/BizLines';
import BizChapters from '../../v2/BizChapters';
import BizSheet from '../../v2/BizSheet';
import BizOpen from '../../v2/BizOpen';
import AskBar from '../../v2/AskBar';
import { SPRING } from '../../../lib/motion';
import './Captable.css';

const DOCS = 'https://docs.hanzo.ai/docs/cli/captable';
const REPO = 'https://github.com/hanzoai/captable';
const UP = 'https://github.com/captableinc/captable';
const DEPLOY = 'https://platform.hanzo.ai/deploy';
const two = (n) => String(n).padStart(2, '0');

// the example company: inputs only; everything shown is computed from them
const FOUND = 8_000_000, POOL = 1_000_000, SAFE = 500_000, CAP = 8_000_000, DISC = 0.2, RAISE = 2_000_000;
const PRE_SH = FOUND + POOL;
function model(pre) {
  const price = pre / PRE_SH;
  const safePrice = Math.min(CAP / PRE_SH, price * (1 - DISC));
  const safeSh = SAFE / safePrice;
  const newSh = RAISE / price;
  const total = PRE_SH + safeSh + newSh;
  return { price, byCap: CAP / PRE_SH <= price * (1 - DISC), safeSh, total, rows: [['Founders', FOUND, 'Common'], ['Option pool', POOL, 'ISO and NSO'], ['SAFE', safeSh, 'converts'], ['New investor', newSh, 'Preferred']].map(([n, s, k]) => [n, s, s / total, k]) };
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
const HL = [[0, 3], [1], [2], [2, 3], [0, 1, 2, 3], [0, 3]]; // which rows each step lights

/* A figure whose characters roll to their new value one by one (transform and opacity only). */
function Roll({ text, className = '' }) {
  return (
    <span className={'ct-roll ' + className}>
      <span className="x-sr">{text}</span>
      {[...text].map((c, i) => (
        <span className="ct-roll-s" key={i + '/' + text.length} aria-hidden="true">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span key={c} initial={{ y: '62%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-62%', opacity: 0 }} transition={SPRING.toggle}>{c}</motion.span>
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

function Hero({ pre, setPre, mine, setMine }) {
  const [ref, live, calm] = useLive(0.3);
  const dir = useRef(1);
  useEvery(1300, live && !mine, () => {
    let n = pre + dir.current * 500_000;
    if (n > 24_000_000 || n < 6_000_000) { dir.current *= -1; n = pre + dir.current * 500_000; }
    setPre(n);
  });
  const m = model(pre);
  return (
    <section className="ct-hero" ref={ref} aria-labelledby="ct-h1">
      <div className="bz-wrap bz-grid ct-hero-grid">
        <div className="ct-copy">
          <BizLines as="h1" id="ct-h1" className="bz-display sm" lines={['Hanzo Cap Table']} now />
          <p className="ct-cat x-mono">Equity Management Platform</p>
        </div>
        <div className="ct-big">
          <Roll text={PCT(m.rows[0][2])} className="bz-fig ct-big-n" />
          <p className="ct-big-s"><span className="ct-big-k x-mono">Founders, fully diluted</span><span>at a <b className="x-mono">{USD(pre)}</b> pre-money price</span></p>
        </div>
        <p className="bz-lede ct-lede">Who owns what, and what happens to that when you raise again.</p>
        <div className="ct-acts">
          <A to="/login" className="x-btn solid" data-thumb="Try Hanzo" data-cta="primary">Try Hanzo</A>
          <More to={DOCS}>Documentation</More>
        </div>
        <div className="ct-obj bz-obj">
          <div className="ct-slide">
            <div className="ct-slide-k">
              <label htmlFor="ct-pre" className="ct-slide-l x-mono">Pre-money price</label>
              {!calm && <button type="button" className="ct-pause" onClick={() => setMine(!mine)} aria-pressed={mine} aria-label={mine ? 'Play' : 'Pause'}><PauseIcon on={mine} /></button>}
            </div>
            <b className="bz-fig ct-slide-v" aria-hidden="true">{USD(pre)}</b>
            <input id="ct-pre" type="range" min="6000000" max="24000000" step="250000" value={pre} onChange={(e) => { setMine(true); setPre(+e.target.value); }} style={{ '--f': (pre - 6e6) / 18e6 }} aria-valuetext={USD(pre) + ' pre-money'} />
          </div>
          <Bar rows={m.rows} />
          <Table rows={m.rows} />
          <p className="ct-terms x-mono">raise {USD(RAISE)} · SAFE {USD(SAFE)}, cap {USD(CAP)}, discount {DISC * 100}% · converts at its {m.byCap ? 'cap' : 'discount'}</p>
          <p className="ct-eg">Example company. Every number in it is an input you would give your own.</p>
        </div>
      </div>
    </section>
  );
}

/* Chapter stage: the same table, pinned, with the rows the chapter is about lit, and what it reads out. */
function Stage({ at, pre }) {
  const m = model(pre);
  const read = [
    ['Founders · New investor', 'Common · Preferred'],
    ['Option pool', 'ISO and NSO · ' + SH(POOL)],
    ['SAFE', USD(SAFE) + ' · cap ' + USD(CAP) + ' · ' + DISC * 100 + '%'],
    ['converts at its ' + (m.byCap ? 'cap' : 'discount'), SH(m.safeSh)],
    ['Fully diluted', SH(m.total)],
    ['1x preference', 'not participating'],
  ][at];
  return (
    <div className="ct-stage bz-obj">
      <p className="ct-stage-k"><span className="bz-kick">A round, run first</span><span className="x-mono">{two(at + 1)} / 06</span></p>
      <Bar rows={m.rows} lit={HL[at]} />
      <Table rows={m.rows} lit={HL[at]} />
      <div className="ct-read">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p key={at} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }} transition={{ duration: 0.4 }}>
            <span className="x-mono">{read[0]}</span><b>{read[1]}</b>
          </motion.p>
        </AnimatePresence>
        <span className="ct-read-p x-mono">{USD(pre)} pre-money</span>
      </div>
    </div>
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
  return (
    <section className="bz-sec ct-ts" aria-labelledby="ct-ts-h">
      <div className="bz-wrap bz-grid">
        <div className="ct-doc">
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
            <span className="ct-sign" aria-hidden="true"><i>×</i></span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Beyond: the waterfall at an exit price, preferences paid first (1x, non-participating, as an example). */
function payout(exit, rows) {
  const pref = { 2: SAFE, 3: RAISE };
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

function Waterfall({ pre }) {
  const [exit, setExit] = useState(6_000_000);
  const m = model(pre);
  const pay = payout(exit, m.rows);
  const order = [3, 2, 0, 1];
  return (
    <section className="bz-sec ct-wf" data-room="dark" aria-labelledby="ct-wf-h">
      <div className="bz-wrap bz-grid">
        <div className="ct-wf-copy">
          <h2 id="ct-wf-h" className="bz-headline">At an exit price, who gets paid and in what order.</h2>
          <p className="bz-body">Preferences mean the founders&apos; share is not their percentage, and this is where that becomes visible.</p>
          <label className="ct-exit">
            <span className="ct-exit-k x-mono">Exit price</span>
            <b className="bz-fig">{USD(exit)}</b>
            <input type="range" min="1000000" max="60000000" step="500000" value={exit} onChange={(e) => setExit(+e.target.value)} style={{ '--f': (exit - 1e6) / 59e6 }} aria-valuetext={USD(exit) + ' exit'} />
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
                <span className="ct-pc-p"><b className="bz-fig">{p}</b>{per && <em>{per}</em>}</span>
                <span className="ct-pc-d">{d}</span>
              </>
            ),
            panel: (
              <div className="ct-pp">
                <div className="ct-pp-l">
                  <h3 className="bz-display sm">{t}</h3>
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

/* Where it comes from and the ways in: quiet rows before the close. */
function Ways() {
  return (
    <section className="bz-sec ct-more" aria-labelledby="ct-oss-h">
      <div className="bz-wrap bz-grid">
        <div className="ct-oss">
          <h2 id="ct-oss-h" className="bz-title">Built on Open Source</h2>
          <p className="bz-body">Hanzo Cap Table is built on <A to={UP}>Captable, Inc.</A> (OpenCap), the open-source alternative to Carta, Pulley, and AngelList. We contribute back to the community and extend it with Hanzo IAM integration, e-signing, and enterprise features.</p>
          <div className="ct-links"><More to={REPO}>hanzoai/captable</More><More to={UP}>Upstream: captableinc/captable</More></div>
          <div className="ct-get">
            <h3 className="ct-get-h">Get Captable</h3>
            <p>Cap table + equity management</p>
            <div className="ct-chips">
              <span className="ct-chip"><span>License:</span> Apache-2.0</span>
              <A to={REPO} className="ct-chip"><Gh />hanzoai/captable<em>3 stars</em></A>
            </div>
            <More to={DEPLOY}>Deploy to Cloud</More>
          </div>
        </div>
        <ul className="ct-ways">
          <li><A to={DOCS} className="ct-way"><b>Documentation</b><span>Explore our guides and API references</span><em>View Docs →</em></A></li>
          <li><A to={REPO} className="ct-way"><b>For Developers</b><span>Self-host or integrate via API</span><em>View on GitHub →</em></A></li>
          <li><A to="/contact-sales" className="ct-way"><b>Need a Custom Solution?</b><span>Our team can help you set up and migrate your cap table with advanced compliance and security features.</span><em>Contact Sales →</em></A></li>
        </ul>
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
            <A to="/login" className="x-btn solid" data-cta="primary">Try Hanzo</A>
            <p><b>Get Started</b><span>Set up your cap table in minutes</span></p>
          </div>
        </div>
        <A to={DOCS} className="ct-row"><span>Get started with Cap Table</span><em>Read the docs<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></em></A>
      </div>
    </section>
  );
}

export default function Captable() {
  const [pre, setPre] = useState(12_000_000);
  const [mine, setMine] = useState(false);
  return (
    <main className="bz ct">
      <Hero pre={pre} setPre={setPre} mine={mine} setMine={setMine} />
      <BizChapters label="A round, run first" className="ct-ch" items={STEPS.map(([t, d]) => ({ t, d }))} stage={(at) => <Stage at={at} pre={pre} />}>
        <header className="bz-wrap bz-grid ct-ch-head">
          <h2 className="bz-display md">The instruments, modelled</h2>
          <p className="bz-lede">A spreadsheet can hold these numbers. It cannot tell you what they become at the next price.</p>
        </header>
      </BizChapters>
      <TermSheet />
      <Waterfall pre={pre} />
      <Plans />
      <Ways />
      <End />
      <AskBar title="Cap Table" label="Try Hanzo" to="/login" />
    </main>
  );
}
