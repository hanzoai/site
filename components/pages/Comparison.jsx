'use client';
// Persona: an engineer or CTO weighing running the open-source stack themselves against buying Hanzo (arrives from /compare's "Buy it, or run it", pricing or search)
// Goal: see what running it yourself costs, line by line, and what that bill leaves out
// CTA: Try Hanzo -> https://hanzo.ai/signup (hero, sticky AskBar and thumb bar, close) · metric cta_click (data-cta="try-hanzo")
// Signature: a receipt that feeds out of a slot under the headline — a tall slip prints the open-source stacks line by line and rolls its total digit by digit; every line is a switch, so strike a stack out or put it back and the bill re-adds itself.
// Beyond: "The same image, more than once" — the receipt notices when your selection runs one image in several stacks (postgres:16-alpine sits under four of them) and adds up what those copies reserve, from the same compose figures, beside Hanzo's own line on upgrades.
/* Comparison: buy it, or run it. Its idea is the bill.
   1. First screen: "Buy it, or run it" centred and cut into its lines (Hanzo's "Comparison" sits under it as a
      caption), the one ask, and beneath it a slot the receipt feeds out of: a tall centred slip that prints the eleven
      stacks line by line once the page has arrived, its total rolling digit by digit to $225.57/mo.
   2. Every line of the slip is a switch: strike a stack out and the bill re-adds itself; put it back. Each stack's
      images, vCPU and GB wait in a sheet. Phones keep the total under the thumb as they scroll the slip.
   3. The one dark room wipes in: the part that is not a line item, one duty per screen, each printed on a second
      receipt that cannot price it ($ ?), then Hanzo's closing line and the one ask again.
   Colour: none of its own (JAMES.md): paper white, ink and its alpha steps.
   Motion: time (the slip feeds and prints, the total rolls), state (lines strike and return, the stack bar regrows,
   the sheet rises), pointer (lines slide, boxes swell, presses give), scroll (the dark room's wipe, the duty chapters).
   Figures are Hanzo's: each stack's compose footprint and compute cost, as api.hanzo.ai/v1/blueprint/sbom serves them.
   V2: 8/10 centred headline with the receipt feeding out of a slot beneath it as a tall slip (prints after arrival, odometer total, every line a switch), images in a sheet, unpriced duties as a dark-room chapter receipt closing on the one ask; greys only, legible with JS off. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { A } from '../kit';
import MaskLines from '../v2/MaskLines';
import PinScenes from '../v2/PinScenes';
import DetailSheet from '../v2/DetailSheet';
import SceneWipe from '../v2/SceneWipe';
import AskBar from '../v2/AskBar';
import '../v2/ProofScale.css';
import './Comparison.css';

const EASE = [0.16, 1, 0.3, 1];
// [stack, [[service, image, vcpu, gb]], cents a month]
const STACKS = [
  ['qdrant', [['qdrant', 'qdrant/qdrant:v1.12.4', 0.25, 0.5]], 438],
  ['traefik', [['traefik', 'traefik:v3.2', 0.5, 0.5]], 657],
  ['redis', [['cache', 'redis:7-alpine', 0.5, 1]], 876],
  ['grafana', [['grafana', 'grafana/grafana:11.3.0', 0.25, 0.5], ['loki', 'grafana/loki:3.2.0', 0.25, 0.5], ['prometheus', 'prom/prometheus:v3.0.0', 0.25, 0.5]], 1314],
  ['postgres', [['db', 'postgres:16-alpine', 1, 2]], 1752],
  ['wordpress', [['db', 'mariadb:11', 1, 1], ['wordpress', 'wordpress:6-php8.2-apache', 0.5, 0.5]], 1971],
  ['gitea', [['db', 'postgres:16-alpine', 1, 2], ['gitea', 'gitea/gitea:1.22', 0.25, 0.5]], 2190],
  ['keycloak', [['db', 'postgres:16-alpine', 1, 2], ['keycloak', 'quay.io/keycloak/keycloak:26.0', 0.25, 0.5]], 2190],
  ['ghost', [['db', 'mysql:8', 1, 2], ['ghost', 'ghost:5-alpine', 0.5, 0.5]], 2409],
  ['n8n', [['db', 'postgres:16-alpine', 1, 2], ['n8n', 'n8nio/n8n:1.60.1', 1, 2]], 3504],
  ['ollama', [['ollama', 'ollama/ollama:0.5.4', 2, 8]], 5256],
].map(([name, imgs, c]) => ({ name, imgs, c, cpu: imgs.reduce((a, i) => a + i[2], 0), gb: imgs.reduce((a, i) => a + i[3], 0) }));
const ALL = STACKS.reduce((a, s) => a + s.c, 0); // 22,557 cents
const usd = (c) => '$' + (c / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '/mo';
const n = (v) => String(+v.toFixed(2));
const MAX = Math.max(...STACKS.map((s) => s.c));
const ASK = { label: 'Try Hanzo', to: 'https://hanzo.ai/signup', cta: 'try-hanzo' };
// JS off: the slip stands fed out and printed, every block in place
const NOJS = '<style>.xcm-in,.xcm-slip,.xcm-lines li,.xcm-twice,.xcm-twice.wait{opacity:1!important;transform:none!important}.xcm-stackbar i{transform:none!important}</style>';

const DUTIES = [
  ['Upgrades', 'Every image above has a release cadence, and a CVE in any of them is yours to notice and roll.'],
  ['Backups', 'Taking one is a cron. Proving a restore works is a rehearsal, and it is the half that gets skipped.'],
  ['Availability', 'One replica of each is a single point of failure. A second is roughly twice the compute plus the state problem.'],
  ['Identity', 'Each of these has its own users and its own idea of an admin. Joining them is a project.'],
  ['On-call', 'Someone answers when it pages at 3am, and that person is on your payroll.'],
];
const Arrow = ({ s = 15 }) => <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* The rolling total: every digit is a strip that rolls to its new place, the right-hand digits settling first.
   The figure itself is in the text for readers and search; the strips are drawn for the eye. */
function Odo({ cents, className = '' }) {
  const s = usd(cents);
  const chars = s.split('');
  return (
    <span className={'xcm-odo ' + className}>
      <span className="x-sr">{s}</span>
      <span className="xcm-odo-v" aria-hidden="true">
        {chars.map((ch, i) => {
          const k = chars.length - i; // keyed from the right, so cents stay put while dollars grow
          if (!/\d/.test(ch)) return <span key={'c' + k} className="xcm-odo-c">{ch}</span>;
          return (
            <span key={'d' + k} className="xcm-odo-d">
              <span style={{ transform: `translate3d(0, ${-ch * 10}%, 0)`, transitionDelay: `${Math.min(k, 8) * 0.035}s` }}>
                {'0123456789'.split('').map((d) => <i key={d}>{d}</i>)}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}

/* every stack's images and footprint, for the sheet */
function Images() {
  return (
    <table className="xcm-t">
      <thead><tr><th scope="col">Stack</th><th scope="col">Images it runs</th><th scope="col">vCPU</th><th scope="col">GB</th><th scope="col">Compute</th></tr></thead>
      <tbody>
        {STACKS.map((s) => (
          <tr key={s.name}>
            <th scope="row">{s.name}</th>
            <td className="xcm-img">
              <span className="xcm-img-l">{s.imgs.map((m) => m[1]).join(' · ')}</span>
              {s.imgs.length > 1 && <span className="xcm-imgs">{s.imgs.map(([svc, img, c, g]) => <span key={svc + img}><b>{svc}</b> {img} <em>{n(c)} vCPU · {n(g)} GB</em></span>)}</span>}
            </td>
            <td className="pf-mono xcm-fig">{n(s.cpu)}</td>
            <td className="pf-mono xcm-fig">{n(s.gb)}</td>
            <td className="pf-mono xcm-fig">{usd(s.c)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Bill() {
  const [on, setOn] = useState(() => STACKS.map(() => true));
  // the HTML carries every line of the bill (waiting, unprinted) and the full figure; the browser prints it line by line
  const [printed, setPrinted] = useState(0);
  const [fed, setFed] = useState(false);
  const ref = useRef(null); // the feed under the slot: the slip feeds and prints once that is on screen
  const seen = useInView(ref, { once: true, amount: 'some' });
  const heroRef = useRef(null); // phones: the total pill follows the thumb only once the hero has gone by
  const heroIn = useInView(heroRef, { amount: 0 });
  const calm = useReducedMotion();
  useEffect(() => { if (calm) { setPrinted(STACKS.length); setFed(true); } }, [calm]);
  useEffect(() => {
    if (!seen || calm) return;
    let i = 0, t, t0;
    const run = () => { setFed(true); t0 = setTimeout(() => { t = setInterval(() => { i += 1; setPrinted(i); if (i >= STACKS.length) clearInterval(t); }, 140); }, 380); };
    // on a first visit the arrival curtain is still up: feed once it lifts, so the printing is seen
    if (document.documentElement.classList.contains('x-arriving')) addEventListener('hz-arrived', run, { once: true }); else run();
    return () => { removeEventListener('hz-arrived', run); clearTimeout(t0); clearInterval(t); };
  }, [seen, calm]);
  const act = STACKS.map((s, i) => ({ ...s, i })).filter((s) => on[s.i]);
  const lines = act.filter((s) => s.i < printed);
  const done = printed >= STACKS.length;
  const cents = lines.reduce((a, s) => a + s.c, 0);
  const all = on.every(Boolean);
  // Beyond: images the selection runs more than once, and what the copies reserve together
  const twice = Object.entries(act.flatMap((s) => s.imgs).reduce((a, [, img, c, g]) => { const x = (a[img] ||= { k: 0, c: 0, g: 0 }); x.k += 1; x.c += c; x.g += g; return a; }, {})).filter(([, x]) => x.k > 1);
  const flip = (i) => setOn((o) => o.map((v, k) => (k === i ? !v : v)));

  return (
    <section className="xcm-hero" aria-labelledby="xcm-h1">
      <noscript dangerouslySetInnerHTML={{ __html: NOJS }} />
      <div className="pf-wrap xcm-hero-c" ref={heroRef}>
        <MaskLines as="h1" id="xcm-h1" className="pf-display" lines={['Buy it,', 'or run it']} />
        <motion.div className="xcm-in" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}>
          <p className="pf-kick xcm-cap">Comparison</p>
          <p className="pf-lede xcm-lede">Everything Hanzo does is open source, so the honest question is not whether you could run it — you could — but what that costs. These are real numbers from real compose files.</p>
          <span data-thumb={ASK.label} data-href={ASK.to}><A to={ASK.to} className="pf-btn solid xcm-ask" data-cta={ASK.cta}>{ASK.label}<Arrow /></A></span>
        </motion.div>
      </div>

      <div className="xcm-printer">
        <div className="xcm-slot" aria-hidden="true" />
        <div className="xcm-feed" ref={ref}>
          <article className="xcm-slip" data-fed={fed} data-morph-target aria-label="The bill">
            <div className="xcm-paper">
              <h2 className="xcm-slip-h">Run it yourself, and here is the bill</h2>
              <p className="xcm-slip-l">The open-source stacks people reach for, priced from the compute their own compose files reserve.</p>
              <div className="xcm-stackbar" aria-hidden="true">
                {act.map((s) => <motion.i key={s.name} layout initial={{ scaleY: 0 }} animate={{ scaleY: s.i < printed ? 1 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} style={{ flexGrow: s.c }} />)}
              </div>
              <ol className="xcm-lines">
                {STACKS.map((s, i) => (
                  <li key={s.name} className={(on[i] ? 'on' : 'off') + (i < printed ? ' in' : '')}>
                    <button type="button" role="switch" aria-checked={on[i]} onClick={() => flip(i)} aria-label={(on[i] ? 'Take out ' : 'Add ') + s.name + ', ' + usd(s.c)}>
                      <i aria-hidden="true"><svg viewBox="0 0 16 16" width="11" height="11"><path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></i>
                      <span className="xcm-l-n">{s.name}</span>
                      <span className="xcm-l-d" aria-hidden="true" />
                      <span className="xcm-l-p">{usd(s.c)}</span>
                    </button>
                  </li>
                ))}
              </ol>
              {!act.length && done && <p className="xcm-empty">Nothing running, nothing to pay. Add a stack back.</p>}
              <AnimatePresence initial={false}>
                {twice.length > 0 && (
                  <motion.div className={'xcm-twice' + (done ? '' : ' wait')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {twice.map(([img, x]) => <p key={img}><b>{img} ×{x.k}</b><span>{n(x.c)} vCPU · {n(x.g)} GB</span></p>)}
                    <p className="xcm-twice-d">{DUTIES[0][1]}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="xcm-total">
                <span className="xcm-total-k"><span>{all ? 'All of them, running' : 'Your selection'}</span><span>{act.length} / {STACKS.length}</span></span>
                <Odo cents={cents} className="big" />
                {(!all || !done) && <span className="x-sr">All of them, running: {usd(ALL)}</span>}
              </div>
              <div className="xcm-slip-f">
                <DetailSheet label="Images it runs" kicker="Stack" title="Run it yourself, and here is the bill" ghost wide>
                  <Images />
                </DetailSheet>
                {!all && <button type="button" className="xcm-reset" onClick={() => setOn(STACKS.map(() => true))}><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 8a4.5 4.5 0 1 0 1.4-3.3M3.5 2.5v2.6h2.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>Put them all back</button>}
              </div>
            </div>
          </article>
        </div>
        <div className={'xcm-mini' + (!heroIn && done ? ' on' : '')} aria-hidden="true"><span>{all ? 'All of them, running' : 'Your selection'}</span><Odo cents={cents} /></div>
      </div>
      <p className="pf-wrap xcm-note">Compute only, from each stack’s own compose file: DigitalOcean droplet retail + Hanzo platform margin (estimate). One replica of each, at the footprint the file reserves. Storage, egress and anything with a GPU are not in it — serving a model is a GPU, and no compose file above asks for one.</p>
    </section>
  );
}

/* the dark room: a receipt for what cannot be priced, one duty per screen */
function Unpriced({ at }) {
  return (
    <div className="xcm-u" aria-hidden="true">
      <p className="xcm-u-h"><span>What you are holding</span><span className="pf-mono">{String(at + 1).padStart(2, '0')} / 05</span></p>
      <ol>
        {DUTIES.map(([t], i) => (
          <li key={t} className={(i === at ? 'on ' : '') + (i <= at ? 'in' : '')}>
            <span className="pf-mono">{String(i + 1).padStart(2, '0')}</span><span>{t}</span><i /><b className="pf-mono">$ ?</b>
          </li>
        ))}
      </ol>
      <div className="xcm-u-t"><span>Total</span><b className="pf-mono">$ ?</b></div>
    </div>
  );
}

function Holding() {
  const chapters = DUTIES.map(([t, d], i) => ({
    kicker: String(i + 1).padStart(2, '0'),
    title: t,
    body: <p className="pf-lede xcm-duty">{d}<span className="xcm-d-p pf-mono" aria-hidden="true"> $ ?</span></p>,
  }));
  return (
    <SceneWipe className="xcm-dark" label="And the part that is not a line item">
      <div className="pf-wrap xcm-dark-h">
        <h2 className="pf-display s">And the part that is not a line item</h2>
        <p className="pf-lede">The machines are the cheap half. This is what you are holding once they are paid for.</p>
      </div>
      <PinScenes className="xcm-duties" label="What you are holding" chapters={chapters} per={60} flip visual={(at) => <Unpriced at={at} />} />
      <div className="pf-wrap xcm-close-w">
        <p className="xcm-close">We have not costed that list, and will not: an invented engineer-hours figure would be worth less than the arithmetic you can do yourself, knowing your own team. What Hanzo replaces is the whole column — one identity, one bill, one thing that pages someone else.</p>
        <A to={ASK.to} className="pf-btn solid xcm-ask xcm-ask-d" data-cta={ASK.cta}>{ASK.label}<Arrow /></A>
      </div>
    </SceneWipe>
  );
}

export default function Comparison() {
  return (
    <main className="xcm">
      <Bill />
      <Holding />
      <AskBar title="Buy it, or run it" label={ASK.label} to={ASK.to} cta={ASK.cta} hero=".xcm-hero-c" />
    </main>
  );
}
