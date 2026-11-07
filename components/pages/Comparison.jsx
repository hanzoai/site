'use client';
// Signature: a receipt that prints itself — the open-source stacks run down the left as switches, a paper bill pinned on the right prints them line by line and rolls its total digit by digit to the new figure as you take stacks out or put them back.
// Beyond: "The same image, more than once" — the receipt notices when your selection runs one image in several stacks (postgres:16-alpine sits under four of them) and adds up what those copies reserve, from the same compose figures, beside Hanzo's own line on upgrades.
/* Comparison: buy it, or run it. Its idea is the bill.
   1. First screen: "Buy it, or run it" cut into its lines (Hanzo's "Comparison" sits under it as a caption), one ask,
      and the receipt, which prints itself line by line once the page has arrived, its total rolling digit by digit.
   2. The stacks are switches beside it while the receipt stays pinned; open a line to see the images in it and what
      each reserves. Phones get the receipt first and a total that follows the thumb.
   3. The one dark room wipes in: the part that is not a line item, one duty per screen, each printed on a second
      receipt that cannot price it ($ ?), then Hanzo's own closing line.
   Colour: none of its own (JAMES.md): paper white, ink and its alpha steps.
   Motion: time (the receipt prints, the total rolls), state (switches spring, lines re-stack, image lists open),
   pointer (switches swell, rows slide, the plus turns, presses give), scroll (the dark room's wipe, the duty chapters).
   One ask, Hanzo's "Try Hanzo": in the hero, sticky after it (AskBar on desktop, the thumb bar on phones).
   Figures are Hanzo's: each stack's compose footprint and compute cost, as api.hanzo.ai/v1/blueprint/sbom serves them.
   V2: 8/10 the receipt is the hero (prints after arrival, odometer total, pinned beside the stack switches), unpriced duties as a dark-room chapter receipt; greys only, no labels above headlines, one sticky ask. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { A } from '../kit';
import MaskLines from '../v2/MaskLines';
import PinScenes from '../v2/PinScenes';
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
const ASK = { label: 'Try Hanzo', to: 'https://hanzo.ai/signup' };

const DUTIES = [
  ['Upgrades', 'Every image above has a release cadence, and a CVE in any of them is yours to notice and roll.'],
  ['Backups', 'Taking one is a cron. Proving a restore works is a rehearsal, and it is the half that gets skipped.'],
  ['Availability', 'One replica of each is a single point of failure. A second is roughly twice the compute plus the state problem.'],
  ['Identity', 'Each of these has its own users and its own idea of an admin. Joining them is a project.'],
  ['On-call', 'Someone answers when it pages at 3am, and that person is on your payroll.'],
];

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

function Bill() {
  const [on, setOn] = useState(() => STACKS.map(() => true));
  const [open, setOpen] = useState(-1);
  // the HTML carries every line of the bill (waiting, unprinted) and the full figure; the browser prints it line by line
  const [printed, setPrinted] = useState(0);
  const ref = useRef(null); // the receipt: it prints once it is on screen (first screen on desktop, under the hero on phones)
  const seen = useInView(ref, { once: true, amount: 0.25 });
  const calm = useReducedMotion();
  useEffect(() => { if (calm) setPrinted(STACKS.length); }, [calm]);
  useEffect(() => {
    if (!seen || calm) return;
    let i = 0, t, t0;
    const run = () => { t0 = setTimeout(() => { t = setInterval(() => { i += 1; setPrinted(i); if (i >= STACKS.length) clearInterval(t); }, 150); }, 450); };
    // on a first visit the arrival curtain is still up: print once it lifts, so the printing is seen
    const H = document.documentElement;
    if (H.classList.contains('x-arriving')) addEventListener('hz-arrived', run, { once: true }); else run();
    return () => { removeEventListener('hz-arrived', run); clearTimeout(t0); clearInterval(t); };
  }, [seen, calm]);
  // every switched-on stack keeps its line on the paper from the start (no jump as the bill prints); a line not yet
  // printed waits invisible in its place
  const act = STACKS.map((s, i) => ({ ...s, i })).filter((s) => on[s.i]);
  const lines = act.filter((s) => s.i < printed);
  const done = printed >= STACKS.length;
  const cents = lines.reduce((a, s) => a + s.c, 0);
  const all = on.every(Boolean);
  // Beyond: images the selection runs more than once, and what the copies reserve together
  const twice = Object.entries(act.flatMap((s) => s.imgs).reduce((a, [, img, c, g]) => { const x = (a[img] ||= { k: 0, c: 0, g: 0 }); x.k += 1; x.c += c; x.g += g; return a; }, {})).filter(([, x]) => x.k > 1);
  const flip = (i) => setOn((o) => o.map((v, k) => (k === i ? !v : v)));

  return (
    <section className="xcm-bill" aria-labelledby="xcm-h1">
      <div className="pf-wrap xcm-grid">
        <div className="xcm-left">
          <header className="xcm-hero">
            <MaskLines as="h1" id="xcm-h1" className="pf-display" lines={['Buy it,', 'or run it']} />
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}>
              <p className="pf-kick xcm-cap">Comparison</p>
              <p className="pf-lede xcm-lede">Everything Hanzo does is open source, so the honest question is not whether you could run it — you could — but what that costs. These are real numbers from real compose files.</p>
              <A to={ASK.to} className="pf-btn solid xcm-ask" data-thumb={ASK.label}>{ASK.label}<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></A>
            </motion.div>
          </header>

          <div className="xcm-menu">
          <div className="xcm-menu-h" id="stacks">
            <h2 className="pf-head">Run it yourself, and here is the bill</h2>
            <p className="pf-body">The open-source stacks people reach for, priced from the compute their own compose files reserve.</p>
          </div>
          <table className="xcm-t">
            <thead><tr><th scope="col">Stack</th><th scope="col">Images it runs</th><th scope="col">vCPU</th><th scope="col">GB</th><th scope="col">Compute</th></tr></thead>
            <tbody>
              {STACKS.map((s, i) => (
                <tr key={s.name} className={on[i] ? 'on' : ''}>
                  <th scope="row">
                    <label className="xcm-sw">
                      <input type="checkbox" checked={on[i]} onChange={() => flip(i)} aria-label={(on[i] ? 'Take out ' : 'Add ') + s.name} />
                      <i aria-hidden="true" />
                      <span>{s.name}</span>
                    </label>
                  </th>
                  <td className="xcm-img">
                    <button type="button" className="xcm-more" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)} aria-label={'Images in ' + s.name}>
                      <span className="xcm-img-l">{s.imgs.map((m) => m[1]).join(' · ')}</span>
                      <span className="xcm-plus" aria-hidden="true"><motion.i animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.3, ease: EASE }}>+</motion.i></span>
                    </button>
                    <motion.span className="xcm-imgs" initial={false} animate={open === i ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} aria-hidden={open !== i}>
                      {s.imgs.map(([svc, img, c, g]) => <span key={svc + img}><b>{svc}</b> {img} <em>{n(c)} vCPU · {n(g)} GB</em></span>)}
                    </motion.span>
                  </td>
                  <td className="pf-mono xcm-fig" data-k="vCPU">{n(s.cpu)}</td>
                  <td className="pf-mono xcm-fig" data-k="GB">{n(s.gb)}</td>
                  <td className="pf-mono xcm-c"><span>{usd(s.c)}</span><i aria-hidden="true"><b style={{ transform: `scaleX(${s.c / MAX})` }} /></i></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="xcm-note">Compute only, from each stack’s own compose file: DigitalOcean droplet retail + Hanzo platform margin (estimate). One replica of each, at the footprint the file reserves. Storage, egress and anything with a GPU are not in it — serving a model is a GPU, and no compose file above asks for one.</p>
          <div className="xcm-mini" aria-hidden="true">
            <span>{all ? 'All of them, running' : 'Your selection'}</span>
            <Odo cents={cents} />
          </div>
          </div>
        </div>

        <aside className="xcm-right" aria-label="The bill">
          <div className="xcm-receipt" data-morph-target ref={ref}>
            <noscript><style>{'.xcm-lines li,.xcm-twice{opacity:1!important;transform:none!important}.xcm-stackbar i{transform:none!important}'}</style></noscript>
            <div className="xcm-paper">
              <p className="xcm-r-h"><span>Run it yourself</span><span className="pf-mono">{lines.length} / {STACKS.length}</span></p>
              <div className="xcm-stackbar" aria-hidden="true">
                {act.map((s) => <motion.i key={s.name} layout initial={{ scaleY: 0 }} animate={{ scaleY: s.i < printed ? 1 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} style={{ flexGrow: s.c }} />)}
              </div>
              <ol className="xcm-lines">
                <AnimatePresence initial={false}>
                  {act.map((s) => (
                    <motion.li key={s.name} layout initial={{ opacity: 0, y: -12 }} animate={s.i < printed ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }} exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }} transition={{ type: 'spring', stiffness: 380, damping: 32 }}>
                      <span>{s.name}</span><i aria-hidden="true" /><span className="pf-mono">{usd(s.c)}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ol>
              {!act.length && done && <p className="xcm-empty">Nothing running, nothing to pay. Add a stack back.</p>}
              {twice.length > 0 && (
                <div className={'xcm-twice' + (done ? '' : ' wait')}>
                  {twice.map(([img, x]) => <p key={img} className="pf-mono"><b>{img} ×{x.k}</b><span>{n(x.c)} vCPU · {n(x.g)} GB</span></p>)}
                  <p className="xcm-twice-d">{DUTIES[0][1]}</p>
                </div>
              )}
              <div className="xcm-total">
                <span>{all ? 'All of them, running' : 'Your selection'}</span>
                <Odo cents={cents} className="big" />
                {/* the full figure stays in the page whatever is selected */}
                {(!all || !done) && <span className="x-sr">All of them, running: {usd(ALL)}</span>}
              </div>
              {!all && <button type="button" className="xcm-reset" onClick={() => setOn(STACKS.map(() => true))}><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 8a4.5 4.5 0 1 0 1.4-3.3M3.5 2.5v2.6h2.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>Put them all back</button>}
            </div>
          </div>
        </aside>
      </div>
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
      </div>
    </SceneWipe>
  );
}

export default function Comparison() {
  return (
    <main className="xcm">
      <Bill />
      <Holding />
      <AskBar title="Buy it, or run it" label={ASK.label} to={ASK.to} hero=".xcm-hero" />
    </main>
  );
}
