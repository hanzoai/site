'use client';
// Persona: an engineer or CTO weighing running the open-source stack themselves against buying Hanzo (arrives from /compare's "Buy it, or run it", pricing or search)
// Goal: see what running it yourself costs, line by line, and what that bill leaves out
// CTA: Try Hanzo -> https://hanzo.ai/signup (hero, the shared ask bar via data-thumb, close) · data-cta="comparison.hero" / "comparison.close"
// Metric: signup_start, read as cta_click on comparison.hero
// Signature: a receipt that feeds out of a slot under the hero — a tall slip prints the open-source stacks line by line and shows its whole total; every line is a switch, so strike a stack out or put it back and the bill re-adds itself.
// Beyond: "The same image, more than once" — the receipt notices when your selection runs one image in several stacks (postgres:16-alpine sits under four of them) and adds up what those copies reserve, from the same compose figures, beside Hanzo's own line on upgrades.
/* Comparison: buy it, or run it. Its idea is the bill.
   1. First screen: "Buy it, or run it" (52px, line-mask cut-in) on the left of the 8/5 split, Hanzo's "Comparison"
      as a caption beside it over the lede and the one ask; beneath, a slot the receipt feeds out of: a tall centred slip
      whose lines print in a 60 ms stagger once the page has arrived, its whole total ($225.57/mo) the one big figure.
   2. Every line of the slip is a switch: strike a stack out and the bill re-adds itself; put it back. Each stack's
      images, vCPU and GB wait in a sheet, so every price shows once.
   3. The one dark room wipes in: the part that is not a line item, one duty per screen, each printed on a second
      receipt that cannot price it ($ ?), then Hanzo's closing line and the one ask again.
   Colour: none of its own (JAMES.md): paper white, ink and its alpha steps.
   Scale has rhythm (MASTER 3.1): h1 52, headings 26, the total the one 84px moment; deck timings, no springs, no timers.
   Motion: time (the slip feeds, lines print), state (lines strike and return, the stack bar reflows, the total swaps,
   the sheet rises), pointer (lines fill, boxes darken, presses give), scroll (the dark room's wipe, the duty chapters).
   Figures are Hanzo's: each stack's compose footprint and compute cost, as api.hanzo.ai/v1/blueprint/sbom serves them.
   V2: 8/10 52px h1 split 8/5 with its lede and ask over a receipt slip that feeds out of a slot (lines print in a CSS stagger, every line a switch, the whole total the one 84px moment), prices once (images in a sheet), dark-room duty receipt closing on the one ask; deck greys, rhythm and timing, nothing floating, legible with JS off. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { A } from '../kit';
import MaskLines from '../v2/MaskLines';
import PinScenes from '../v2/PinScenes';
import DetailSheet from '../v2/DetailSheet';
import SceneWipe from '../v2/SceneWipe';
import AskBar from '../v2/AskBar';
import '../v2/ProofScale.css';
import '../v2/ProofRhythm.css';
import './Comparison.css';

const EASE = [0.16, 1, 0.3, 1]; // deck ease-emphasis: arrivals
const IO = [0.4, 0, 0.2, 1]; // deck ease-in-out: things that move and stay
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
const ASK = { label: 'Try Hanzo', to: 'https://hanzo.ai/signup', cta: 'comparison.hero' };
// JS off: the slip stands fed out and printed, every block in place
const NOJS = '<style>.xcm-in,.xcm-slip,.xcm-lines li,.xcm-twice{opacity:1!important;transform:none!important}.xcm-stackbar b{transform:none!important}</style>';

const DUTIES = [
  ['Upgrades', 'Every image above has a release cadence, and a CVE in any of them is yours to notice and roll.'],
  ['Backups', 'Taking one is a cron. Proving a restore works is a rehearsal, and it is the half that gets skipped.'],
  ['Availability', 'One replica of each is a single point of failure. A second is roughly twice the compute plus the state problem.'],
  ['Identity', 'Each of these has its own users and its own idea of an admin. Joining them is a project.'],
  ['On-call', 'Someone answers when it pages at 3am, and that person is on your payroll.'],
];
const Arrow = ({ s = 15 }) => <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* The total: when the bill changes, the old figure leaves upward and the new one arrives from below. Only whole,
   real figures are ever shown (never digits rolling through numbers that are not Hanzo's). */
function Odo({ cents, className = '' }) {
  const s = usd(cents);
  const fig = s.slice(0, -3), unit = s.slice(-3);
  return (
    <span className={'xcm-odo ' + className}>
      <span className="x-sr">{s}</span>
      <span className="xcm-odo-v" aria-hidden="true">
        <span className="xcm-odo-m">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={fig} className="xcm-odo-s" initial={{ y: '85%', opacity: 0 }} animate={{ y: '0%', opacity: 1 }} exit={{ y: '-85%', opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.3, ease: EASE }}>{fig}</motion.span>
          </AnimatePresence>
        </span>
        <span className="xcm-odo-c">{unit}</span>
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
  // the HTML carries every line of the bill and the full figure; once the slip is on screen it feeds out of the slot
  // and its lines print in a 60 ms stagger (CSS transition delays, no timers)
  const [fed, setFed] = useState(false);
  const ref = useRef(null); // the feed under the slot
  const seen = useInView(ref, { once: true, amount: 'some' });
  const calm = useReducedMotion();
  useEffect(() => { if (calm) setFed(true); }, [calm]);
  useEffect(() => {
    if (!seen || calm) return;
    const run = () => setFed(true);
    // on a first visit the arrival curtain is still up: feed once it lifts, so the printing is seen
    if (document.documentElement.classList.contains('x-arriving')) addEventListener('hz-arrived', run, { once: true }); else run();
    return () => removeEventListener('hz-arrived', run);
  }, [seen, calm]);
  const act = STACKS.map((s, i) => ({ ...s, i })).filter((s) => on[s.i]);
  // the bill's figure is the whole selection from the first frame: the slip prints its lines, the total never counts up
  const cents = act.reduce((a, s) => a + s.c, 0);
  const all = on.every(Boolean);
  // Beyond: images the selection runs more than once, and what the copies reserve together
  const twice = Object.entries(act.flatMap((s) => s.imgs).reduce((a, [, img, c, g]) => { const x = (a[img] ||= { k: 0, c: 0, g: 0 }); x.k += 1; x.c += c; x.g += g; return a; }, {})).filter(([, x]) => x.k > 1);
  const flip = (i) => setOn((o) => o.map((v, k) => (k === i ? !v : v)));

  return (
    <section className="xcm-hero" aria-labelledby="xcm-h1">
      <noscript dangerouslySetInnerHTML={{ __html: NOJS }} />
      <div className="pf-wrap xcm-hero-g">
        <MaskLines as="h1" id="xcm-h1" className="pf-display xcm-h1" lines={['Buy it,', 'or run it']} />
        <motion.div className="xcm-in xcm-hero-r" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE, delay: 0.3 }}>
          <p className="pf-kick xcm-cap">Comparison</p>
          <p className="pf-lede xcm-lede">Everything Hanzo does is open source, so the honest question is not whether you could run it — you could — but what that costs. These are real numbers from real compose files.</p>
          <span data-thumb={ASK.label} data-href={ASK.to}><A to={ASK.to} className="pf-btn solid xcm-ask" data-cta="comparison.hero">{ASK.label}<Arrow /></A></span>
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
                {act.map((s) => <motion.i key={s.name} layout transition={{ layout: { duration: 0.3, ease: IO } }} style={{ flexGrow: s.c, '--i': s.i }}><b /></motion.i>)}
              </div>
              <ol className="xcm-lines">
                {STACKS.map((s, i) => (
                  <li key={s.name} className={on[i] ? 'on' : 'off'} style={{ '--i': i }}>
                    <button type="button" role="switch" aria-checked={on[i]} onClick={() => flip(i)} aria-label={(on[i] ? 'Take out ' : 'Add ') + s.name + ', ' + usd(s.c)}>
                      <i aria-hidden="true"><svg viewBox="0 0 16 16" width="11" height="11"><path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></i>
                      <span className="xcm-l-n">{s.name}</span>
                      <span className="xcm-l-d" aria-hidden="true" />
                      <span className="xcm-l-p">{usd(s.c)}</span>
                      <span className="xcm-l-i">{s.imgs.map((m) => m[1]).join(' · ')}</span>
                    </button>
                  </li>
                ))}
              </ol>
              {!act.length && <p className="xcm-empty">Nothing running, nothing to pay. Add a stack back.</p>}
              {twice.length > 0 && (
                <div className="xcm-twice">
                  {twice.map(([img, x]) => <p key={img}><b>{img} ×{x.k}</b><span>{n(x.c)} vCPU · {n(x.g)} GB</span></p>)}
                  <p className="xcm-twice-d">{DUTIES[0][1]}</p>
                </div>
              )}
              <div className="xcm-total">
                <span className="xcm-total-k"><span>{all ? 'All of them, running' : 'Your selection'}</span><span>{act.length} / {STACKS.length}</span></span>
                <Odo cents={cents} className="big" />
                {!all && <span className="x-sr">All of them, running: {usd(ALL)}</span>}
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
    body: <p className="pf-lede xcm-duty"><span>{d}</span><span className="xcm-d-p pf-mono" aria-hidden="true"> $ ?</span></p>,
  }));
  return (
    <SceneWipe className="xcm-dark" label="And the part that is not a line item">
      <div className="pf-wrap xcm-dark-h">
        <h2 className="pf-head">And the part that is not a line item</h2>
        <p className="pf-lede">The machines are the cheap half. This is what you are holding once they are paid for.</p>
      </div>
      <PinScenes className="xcm-duties" label="What you are holding" chapters={chapters} per={60} flip visual={(at) => <Unpriced at={at} />} />
      <div className="pf-wrap xcm-close-w">
        <p className="xcm-close">We have not costed that list, and will not: an invented engineer-hours figure would be worth less than the arithmetic you can do yourself, knowing your own team. What Hanzo replaces is the whole column — one identity, one bill, one thing that pages someone else.</p>
        <A to={ASK.to} className="pf-btn solid xcm-ask xcm-ask-d" data-cta="comparison.close">{ASK.label}<Arrow /></A>
      </div>
    </SceneWipe>
  );
}

export default function Comparison() {
  return (
    <main className="xcm pf-r">
      <Bill />
      <Holding />
      <AskBar title="Buy it, or run it" label={ASK.label} to={ASK.to} cta={ASK.cta} />
    </main>
  );
}
