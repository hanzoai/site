'use client';
/* Cap Table. Signature: a round you run before you agree to it. An example company's table sits in the hero, fully
   diluted; drag the pre-money price and the SAFE converts at its cap or its discount, the new investor's shares appear,
   and everyone's ownership re-flows in the bar and the table, with the founders' share as the big number. Left alone,
   the price drifts by itself so the table is always being run.
   Beyond: "The waterfall, by hand". Set an exit price and see who gets paid in what order: below the preference the
   founders' share is not their percentage, which Hanzo says is exactly where it becomes visible.
   All inputs are an example company's, labelled as such; the arithmetic is the real thing.
   Every word and link is Hanzo's. */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A, Go, More } from '../../kit';
import { Get, useLive, useEvery, useSteps } from '../cloud/Frame';
import './Captable.css';

const DOCS = 'https://docs.hanzo.ai/docs/cli/captable';
const REPO = 'https://github.com/hanzoai/captable';
const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });

// the example company: inputs only; everything shown is computed from them
const FOUND = 8_000_000, POOL = 1_000_000, SAFE = 500_000, CAP = 8_000_000, DISC = 0.2, RAISE = 2_000_000;
const PRE_SH = FOUND + POOL;
function model(pre) {
  const price = pre / PRE_SH;
  const safePrice = Math.min(CAP / PRE_SH, price * (1 - DISC));
  const safeSh = SAFE / safePrice;
  const newSh = RAISE / price;
  const total = PRE_SH + safeSh + newSh;
  return { price, safePrice, byCap: CAP / PRE_SH <= price * (1 - DISC), rows: [['Founders', FOUND, 'Common'], ['Option pool', POOL, 'ISO and NSO'], ['SAFE', safeSh, 'converts'], ['New investor', newSh, 'Preferred']].map(([n, s, k]) => [n, s, s / total, k]), total };
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

function Hero() {
  const [ref, live] = useLive(0.3);
  const [pre, setPre] = useState(12_000_000);
  const [mine, setMine] = useState(false);
  const [dir, setDir] = useState(1);
  const [at, choose] = useSteps(6, 3400, false); // the price drifting is the one idle motion; the six steps turn by hand
  useEvery(140, live && !mine, () => {
    const n = pre + dir * 90_000;
    if (n > 24_000_000 || n < 6_000_000) setDir(-dir);
    setPre(Math.max(6_000_000, Math.min(24_000_000, n)));
  });
  const m = model(pre);
  let x = 0;
  return (
    <section className="ct-hero" ref={ref} aria-labelledby="ct-h1">
      <div className="x-wrap">
        <div className="ct-top">
          <div>
            <motion.p className="ct-kick" {...up(0)}>Equity Management Platform</motion.p>
            <h1 id="ct-h1" className="ct-h1"><span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}>Hanzo Cap Table</motion.span></span></h1>
            <motion.p className="ct-lede" {...up(0.3)}>Who owns what, and what happens to that when you raise again.</motion.p>
            <motion.div className="ct-acts" {...up(0.42)}>
              <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><A to="/login" className="x-btn solid" data-thumb>Try Hanzo</A></motion.span>
              <Go to={DOCS}>Documentation</Go>
            </motion.div>
          </div>
          <motion.div className="ct-big" {...up(0.2)} aria-live="polite">
            <span>Founders, fully diluted</span>
            <b className="x-mono">{PCT(m.rows[0][2])}</b>
            <em>at a {USD(pre)} pre-money price</em>
          </motion.div>
        </div>
        <motion.div className="ct-model" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}>
          <svg className="ct-bar" viewBox="0 0 1000 56" preserveAspectRatio="none" aria-hidden="true">
            {m.rows.map(([n, , p], i) => {
              const w = p * 1000; const r = <motion.rect key={n} className={'ct-s' + i + (HL[at].includes(i) ? ' on' : '')} initial={false} animate={{ x: x + (i ? 2 : 0), width: Math.max(0, w - (i ? 2 : 0)) }} transition={{ type: 'spring', stiffness: 160, damping: 26 }} y="0" height="56" rx="6" />; x += w; return r;
            })}
          </svg>
          <div className="ct-grid">
            <label className="ct-slide">
              <span>Pre-money price <b className="x-mono">{USD(pre)}</b></span>
              <input type="range" min="6000000" max="24000000" step="250000" value={pre} onChange={(e) => { setMine(true); setPre(+e.target.value); }} aria-valuetext={USD(pre) + ' pre-money'} />
              <span className="ct-terms x-mono">raise {USD(RAISE)} · SAFE {USD(SAFE)}, cap {USD(CAP)}, discount {DISC * 100}% · converts at its {m.byCap ? 'cap' : 'discount'}</span>
            </label>
            <table className="ct-table">
              <thead><tr><th>Holder</th><th>Class</th><th>Shares</th><th>Fully diluted</th></tr></thead>
              <tbody>
                {m.rows.map(([n, s, p, k], i) => (
                  <tr key={n} className={HL[at].includes(i) ? 'on' : ''}>
                    <td><i className={'ct-s' + i} />{n}</td><td>{k}</td><td className="x-mono">{SH(s)}</td><td className="x-mono">{PCT(p)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="ct-eg">Example company. Every number in it is an input you would give your own.</p>
        </motion.div>
        <div className="ct-steps">
          <p className="ct-steps-k"><span>A round, run first</span><span className="x-mono">{String(at + 1).padStart(2, '0')} / 06</span></p>
          <ol>
            {STEPS.map(([t, d], i) => (
              <li key={t} className={at === i ? 'on' : ''}>
                <button type="button" aria-pressed={at === i} onClick={() => choose(i)}><span className="x-mono">{String(i + 1).padStart(2, '0')}</span><b>{t}</b></button>
                <p>{d}</p>
              </li>
            ))}
          </ol>
          <p className="x-sr">02 / 06 03 / 06 04 / 06 05 / 06 06 / 06</p>
        </div>
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

/* The instruments as a term sheet: numbered clauses on a page. */
function Terms() {
  return (
    <section className="x-sec ct-terms-sec">
      <div className="x-wrap">
        <header className="ct-h">
          <h2>The instruments, modelled</h2>
          <p>A spreadsheet can hold these numbers. It cannot tell you what they become at the next price.</p>
        </header>
        <Rise className="ct-sheet">
          <p className="ct-sheet-k x-mono"><span>Term sheet</span><span>Hanzo Cap Table</span></p>
          <ol className="ct-clauses">
            {CLAUSES.map(([t, d], i) => (
              <li key={t}>
                <span className="x-mono">{i < 4 ? '1' : '2'}.{(i % 4) + 1 + (i >= 8 ? 4 : 0)}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </Rise>
      </div>
    </section>
  );
}

/* Beyond: the waterfall at an exit price, preferences paid first (1x, non-participating, as an example). */
function payout(exit, rows) {
  const pref = { 2: SAFE, 3: RAISE };
  let conv = new Set([0, 1, 2, 3]);
  for (let k = 0; k < 3; k++) {
    const prefPaid = [...[2, 3]].filter((i) => !conv.has(i)).reduce((a, i) => a + Math.min(pref[i], exit), 0);
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

function Waterfall() {
  const [exit, setExit] = useState(6_000_000);
  const m = model(12_000_000);
  const pay = payout(exit, m.rows);
  const order = [3, 2, 0, 1];
  return (
    <section className="x-sec ct-wf" data-room="dark">
      <div className="x-wrap ct-wf-grid">
        <div>
          <p className="x-kick">Waterfall</p>
          <h2 className="ct-wf-h">At an exit price, who gets paid and in what order.</h2>
          <p className="ct-wf-l">Preferences mean the founders' share is not their percentage, and this is where that becomes visible.</p>
          <label className="ct-slide dark">
            <span>Exit price <b className="x-mono">{USD(exit)}</b></span>
            <input type="range" min="1000000" max="60000000" step="500000" value={exit} onChange={(e) => setExit(+e.target.value)} aria-valuetext={USD(exit) + ' exit'} />
          </label>
          <p className="ct-wf-note">The example company after the round above at {USD(12_000_000)} pre-money, with the new investor and the SAFE taking a 1x preference, not participating.</p>
        </div>
        <div className="ct-falls">
          {order.map((i, k) => (
            <div key={i} className="ct-fall">
              <p><span className="x-mono">{k + 1}</span><b>{m.rows[i][0]}</b><em className="x-mono">{PCT(m.rows[i][2])} owned</em></p>
              <i className="ct-fall-bar"><motion.b className={'ct-s' + i} style={{ originX: 0 }} animate={{ scaleX: exit ? pay[i] / exit : 0 }} transition={{ type: 'spring', stiffness: 160, damping: 24 }} /></i>
              <p className="ct-fall-n"><AnimatePresence mode="popLayout" initial={false}><motion.span key={Math.round(pay[i] / 1000)} className="x-mono" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.2 }}>{USD(pay[i])}</motion.span></AnimatePresence><em className="x-mono">{exit ? PCT(pay[i] / exit) : '0%'} of the exit</em></p>
            </div>
          ))}
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

function Pricing() {
  return (
    <section className="x-sec ct-price">
      <div className="x-wrap">
        <header className="ct-h">
          <h2>Simple, Transparent Pricing</h2>
          <p>Free and open source forever. Self-host or use our managed cloud.</p>
        </header>
        <div className="ct-stairs">
          {PLANS.map(([t, p, per, d, [cta, to], li], i) => (
            <Rise key={t} className={'ct-stair' + (i === 2 ? ' pop' : '')} delay={i * 0.08} style={{ '--i': i }}>
              {i === 2 && <span className="ct-popular">Most Popular</span>}
              <h3>{t}</h3>
              <p className="ct-price-n"><b>{p}</b>{per && <span>{per}</span>}</p>
              <p className="ct-price-d">{d}</p>
              <A to={to} className={'x-btn sm' + (i === 2 ? ' solid' : '')}>{cta}</A>
              <ul>{li.map((x) => <li key={x}>{x}</li>)}</ul>
            </Rise>
          ))}
        </div>
        <div className="ct-oss">
          <h3>Built on Open Source</h3>
          <p>Hanzo Cap Table is built on <A to="https://github.com/captableinc/captable">Captable, Inc.</A> (OpenCap), the open-source alternative to Carta, Pulley, and AngelList. We contribute back to the community and extend it with Hanzo IAM integration, e-signing, and enterprise features.</p>
          <div className="x-row-links tight"><More to={REPO}>hanzoai/captable</More><More to="https://github.com/captableinc/captable">Upstream: captableinc/captable</More></div>
        </div>
      </div>
    </section>
  );
}

function Start() {
  return (
    <section className="x-sec ct-start">
      <div className="x-wrap ct-start-grid">
        <div>
          <h2>Put the current table in, then model the round</h2>
          <p>Import what you have today. The useful part starts when you ask what the next price does to it.</p>
          <div className="ct-gs">
            <h2>Get started with Cap Table</h2>
            <div className="x-row-links tight"><More to={DOCS}>Read the docs</More><More to={REPO}>View on GitHub</More></div>
          </div>
        </div>
        <ul className="ct-start-list">
          {[['Get Started', 'Set up your cap table in minutes', 'Try Hanzo', '/login'], ['Documentation', 'Explore our guides and API references', 'View Docs', DOCS], ['For Developers', 'Self-host or integrate via API', 'View on GitHub', REPO]].map(([t, d, a, to], i) => (
            <li key={t}><A to={to} className="ct-start-a"><span><h3>{t}</h3><p>{d}</p></span><b>{a} →</b></A></li>
          ))}
          <li className="ct-custom">
            <h3>Need a Custom Solution?</h3>
            <p>Our team can help you set up and migrate your cap table with advanced compliance and security features.</p>
            <A to="/contact-sales" className="x-btn sm">Contact Sales</A>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default function Captable() {
  return (
    <main className="ct">
      <Hero />
      <Terms />
      <Waterfall />
      <Pricing />
      <Start />
      <Get name="Captable" tag="Cap table + equity management" repo={['hanzoai/captable', REPO]} stars="3 stars" />
    </main>
  );
}
