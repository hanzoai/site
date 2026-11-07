'use client';
/* Cap Table (v2, archetype A "Launch" told like a model launch, accent cobalt #2155e5).
   V2: 8/10 the number is the hero: the founders' fully diluted share, gigantic and live, beside the table it comes from; six sticky chapters light the rows they explain, the term sheet opens as a sheet, the waterfall is the dark room, plans open into their own panels, a calm close.
   Signature: a round you run before you agree to it. An example company's table sits beside the figure; the pre-money
   price drifts by itself (or you drag it), the SAFE converts at its cap or its discount, the new investor's shares
   appear, the bar and the table re-flow, and the founders' share rolls to its new value, digit by digit.
   Beyond: "The waterfall, by hand". Set an exit price and see who gets paid in what order: below the preference the
   founders' share is not their percentage, which Hanzo says is exactly where it becomes visible.
   Motion: the running round (signature) + sticky chapters + plan cards that open (BizOpen) + line-masked type.
   All inputs are an example company's, labelled as such; the arithmetic is the real thing. Every word and link is Hanzo's. */
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { A, More } from '../../kit';
import { useLive, useEvery } from '../cloud/Frame';
import BizLines from '../../v2/BizLines';
import BizChapters from '../../v2/BizChapters';
import BizSheet from '../../v2/BizSheet';
import BizOpen from '../../v2/BizOpen';
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
            <motion.span key={c} initial={{ y: '62%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-62%', opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>{c}</motion.span>
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

function Hero({ pre, setPre, mine, setMine }) {
  const [ref, live] = useLive(0.3);
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
          <p className="bz-kick">Equity Management Platform</p>
          <h1 id="ct-h1" className="bz-display sm">Hanzo Cap Table</h1>
        </div>
        <div className="ct-big">
          <p className="ct-big-k">Founders, fully diluted</p>
          <Roll text={PCT(m.rows[0][2])} className="bz-fig ct-big-n" />
          <p className="ct-big-s">at a <b className="x-mono">{USD(pre)}</b> pre-money price</p>
        </div>
        <div className="ct-intro">
          <p className="bz-lede">Who owns what, and what happens to that when you raise again.</p>
          <div className="bz-acts">
            <A to="/login" className="x-btn solid" data-thumb="Try Hanzo">Try Hanzo</A>
            <A to={DOCS} className="x-btn">Documentation</A>
          </div>
        </div>
        <div className="ct-obj bz-obj" data-cursor="Drag">
          <label className="ct-slide">
            <span className="ct-slide-k"><span className="bz-kick">Pre-money price</span><i className={'ct-pulse' + (mine ? ' held' : '')} aria-hidden="true" /></span>
            <b className="bz-fig ct-slide-v">{USD(pre)}</b>
            <input type="range" min="6000000" max="24000000" step="250000" value={pre} onChange={(e) => { setMine(true); setPre(+e.target.value); }} style={{ '--f': (pre - 6e6) / 18e6 }} aria-valuetext={USD(pre) + ' pre-money'} />
          </label>
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
          <p className="bz-kick">Waterfall</p>
          <h2 id="ct-wf-h" className="bz-headline">At an exit price, who gets paid and in what order.</h2>
          <p className="bz-body">Preferences mean the founders&apos; share is not their percentage, and this is where that becomes visible.</p>
          <label className="ct-exit">
            <span className="bz-kick">Exit price</span>
            <b className="bz-fig">{USD(exit)}</b>
            <input type="range" min="1000000" max="60000000" step="500000" value={exit} onChange={(e) => setExit(+e.target.value)} style={{ '--f': (exit - 1e6) / 59e6 }} aria-valuetext={USD(exit) + ' exit'} />
          </label>
          <p className="ct-wf-note">The example company after the round above at {USD(pre)} pre-money, with the new investor and the SAFE taking a 1x preference, not participating.</p>
        </div>
        <ol className="ct-falls">
          {order.map((i, k) => (
            <li key={i} className={'ct-fall' + (i === 0 ? ' me' : '')} style={{ '--k': k }}>
              <p className="ct-fall-h"><span className="x-mono">{k + 1}</span><b>{m.rows[i][0]}</b><em className="x-mono">{PCT(m.rows[i][2])} owned</em></p>
              <i className="ct-fall-bar"><b className={'ct-s' + i} style={{ transform: `scaleX(${exit ? pay[i] / exit : 0})` }} /></i>
              <p className="ct-fall-n"><span className="bz-fig">{USD(pay[i])}</span><em className="x-mono">{exit ? PCT(pay[i] / exit) : '0%'} of the exit</em></p>
            </li>
          ))}
        </ol>
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
                  <p className="bz-kick">Simple, Transparent Pricing{i === 2 && <span className="ct-popular">Most Popular</span>}</p>
                  <h3 className="bz-display sm">{t}</h3>
                  <p className="ct-pp-p"><b className="bz-fig">{p}</b>{per && <em>{per}</em>}</p>
                  <p className="bz-body">{d}</p>
                  <A to={to} className="x-btn solid">{cta}</A>
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

/* The calm close: one action, the ways in, and where it comes from. */
function End() {
  return (
    <section className="bz-sec ct-end" aria-labelledby="ct-end-h">
      <div className="bz-wrap bz-grid">
        <div className="ct-end-one">
          <p className="bz-kick">Get Started</p>
          <BizLines id="ct-end-h" className="bz-display md" lines={['Put the current', 'table in, then', 'model the round']} />
          <p className="bz-lede">Import what you have today. The useful part starts when you ask what the next price does to it.</p>
          <div className="ct-end-go">
            <A to="/login" className="x-btn solid">Try Hanzo</A>
            <span>Set up your cap table in minutes</span>
          </div>
        </div>
        <ul className="ct-ways">
          <li><A to={DOCS} className="ct-way"><b>Documentation</b><span>Explore our guides and API references</span><em>View Docs →</em></A></li>
          <li><A to={REPO} className="ct-way"><b>For Developers</b><span>Self-host or integrate via API</span><em>View on GitHub →</em></A></li>
          <li className="ct-way">
            <b>Need a Custom Solution?</b>
            <span>Our team can help you set up and migrate your cap table with advanced compliance and security features.</span>
            <More to="/contact-sales">Contact Sales</More>
          </li>
        </ul>
        <div className="ct-oss">
          <h3 className="bz-title">Built on Open Source</h3>
          <p className="bz-body">Hanzo Cap Table is built on <A to={UP}>Captable, Inc.</A> (OpenCap), the open-source alternative to Carta, Pulley, and AngelList. We contribute back to the community and extend it with Hanzo IAM integration, e-signing, and enterprise features.</p>
          <div className="x-row-links tight"><More to={REPO}>hanzoai/captable</More><More to={UP}>Upstream: captableinc/captable</More></div>
        </div>
        <div className="ct-get">
          <h3 className="bz-title">Get started with Cap Table</h3>
          <div className="x-row-links tight"><More to={DOCS}>Read the docs</More><More to={REPO}>View on GitHub</More></div>
          <div className="ct-get-row">
            <h2 className="ct-get-h">Get Captable</h2>
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

export default function Captable() {
  const [pre, setPre] = useState(12_000_000);
  const [mine, setMine] = useState(false);
  return (
    <main className="bz ct" style={{ '--acc': '#2155e5' }}>
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
      <End />
    </main>
  );
}
