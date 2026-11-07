'use client';
/* Comparison: buy it, or run it. Its idea is the bill.
   Signature: a bill builder — the open-source stacks on
   the left, a receipt on the right that prints them line by line when you arrive and re-stacks as you take stacks
   out or put them back, the total rolling to the new figure; open a line to see the images in it and what each one
   reserves. Below it, the part that is not a line item, as the lines the receipt cannot price. Figures are Hanzo's:
   each stack's compose footprint and compute cost, as api.hanzo.ai/v1/blueprint/sbom serves them.
   Beyond: "The same image, more than once". The receipt notices when your selection runs one image in several stacks
   (postgres:16-alpine sits under four of them) and adds up what those copies reserve, from the same compose figures;
   beside it, Hanzo's own line on upgrades, because each copy is one more to roll. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, animate, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { EASE, Rise } from '../ui';
import { SecHead } from '../kit';
import './Comparison.css';

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

function Total({ cents }) {
  const mv = useMotionValue(cents);
  const txt = useTransform(mv, (v) => usd(Math.round(v)));
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!cents) { mv.set(0); return; }
    const c = animate(mv, cents, { duration: 0.8, ease: EASE });
    return () => c.stop();
  }, [cents, mv]);
  return <motion.b className="xcm-total-v x-mono">{txt}</motion.b>;
}

function Builder() {
  const [on, setOn] = useState(() => STACKS.map(() => true));
  const [open, setOpen] = useState(-1);
  const [printed, setPrinted] = useState(STACKS.length); // the HTML carries the full bill; the browser prints it line by line
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  const calm = useReducedMotion();
  const started = useRef(false);
  useEffect(() => { if (!calm) setPrinted(0); }, [calm]);
  useEffect(() => {
    if (!seen || calm || started.current) return;
    started.current = true;
    let i = 0;
    const t = setInterval(() => { i += 1; setPrinted(i); if (i >= STACKS.length) clearInterval(t); }, 170);
    return () => clearInterval(t);
  }, [seen, calm]);
  const lines = STACKS.map((s, i) => ({ ...s, i })).filter((s) => on[s.i] && s.i < printed);
  const cents = lines.reduce((a, s) => a + s.c, 0);
  const all = on.every(Boolean);
  // Beyond: images the selection runs more than once, and what the copies reserve together
  const twice = Object.entries(lines.flatMap((s) => s.imgs).reduce((a, [, img, c, g]) => { const x = (a[img] ||= { k: 0, c: 0, g: 0 }); x.k += 1; x.c += c; x.g += g; return a; }, {})).filter(([, x]) => x.k > 1);
  const flip = (i) => setOn((o) => o.map((v, k) => (k === i ? !v : v)));
  return (
    <div className="xcm-build" ref={ref}>
      <div className="xcm-menu">
        <div className="xcm-tw">
          <table className="xcm-t">
            <thead><tr><th scope="col">Stack</th><th scope="col">Images it runs</th><th scope="col">vCPU</th><th scope="col">GB</th><th scope="col">Compute</th></tr></thead>
            <tbody>
              {STACKS.map((s, i) => (
                <tr key={s.name} className={on[i] ? 'on' : ''}>
                  <th scope="row"><div className="xcm-th">
                    <label className="xcm-sw">
                      <input type="checkbox" checked={on[i]} onChange={() => flip(i)} aria-label={(on[i] ? 'Take out ' : 'Add ') + s.name} />
                      <i aria-hidden="true" />
                      <span>{s.name}</span>
                    </label>
                    <button type="button" className="xcm-more" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)} aria-label={'Images in ' + s.name}>
                      <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.3, ease: EASE }}>+</motion.span>
                    </button>
                  </div></th>
                  <td className="xcm-img">
                    <span>{s.imgs.map((m) => m[1]).join(' · ')}</span>
                    <motion.span className="xcm-imgs" initial={false} animate={open === i ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} aria-hidden={open !== i}>
                      {s.imgs.map(([svc, img, c, g]) => <span key={svc + img}><b>{svc}</b> {img} <em>{n(c)} vCPU · {n(g)} GB</em></span>)}
                    </motion.span>
                  </td>
                  <td className="x-mono">{n(s.cpu)}</td>
                  <td className="x-mono">{n(s.gb)}</td>
                  <td className="x-mono xcm-c"><span>{usd(s.c)}</span><i aria-hidden="true"><b style={{ width: (s.c / MAX) * 100 + '%' }} /></i></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <aside className="xcm-receipt" aria-label="The bill">
        <div className="xcm-paper">
          <p className="xcm-r-h"><span>Run it yourself</span><span className="x-mono">{lines.length} / {STACKS.length}</span></p>
          <div className="xcm-stackbar" aria-hidden="true">
            {lines.map((s) => <motion.i key={s.name} layout initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} style={{ flexGrow: s.c }} title={s.name} />)}
          </div>
          <ol className="xcm-lines">
            <AnimatePresence initial={false}>
              {lines.map((s) => (
                <motion.li key={s.name} layout initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }} transition={{ type: 'spring', stiffness: 380, damping: 32 }}>
                  <span>{s.name}</span><i aria-hidden="true" /><span className="x-mono">{usd(s.c)}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
          {!lines.length && printed >= STACKS.length && <p className="xcm-empty">Nothing running, nothing to pay. Add a stack back.</p>}
          {twice.length > 0 && (
            <div className="xcm-twice">
              {twice.map(([img, x]) => <p key={img} className="x-mono"><b>{img} ×{x.k}</b><span>{n(x.c)} vCPU · {n(x.g)} GB</span></p>)}
              <p className="xcm-twice-d">{DUTIES[0][1]}</p>
            </div>
          )}
          <div className="xcm-total">
            <span>{all ? 'All of them, running' : 'Your selection'}</span>
            <Total cents={cents} />
            {/* the full figure stays in the page whatever is selected */}
            {!all && <span className="x-sr">All of them, running: {usd(ALL)}</span>}
          </div>
          {!on.every(Boolean) && <button type="button" className="xcm-reset" onClick={() => setOn(STACKS.map(() => true))}>Put them all back</button>}
        </div>
      </aside>
    </div>
  );
}

const DUTIES = [
  ['Upgrades', 'Every image above has a release cadence, and a CVE in any of them is yours to notice and roll.'],
  ['Backups', 'Taking one is a cron. Proving a restore works is a rehearsal, and it is the half that gets skipped.'],
  ['Availability', 'One replica of each is a single point of failure. A second is roughly twice the compute plus the state problem.'],
  ['Identity', 'Each of these has its own users and its own idea of an admin. Joining them is a project.'],
  ['On-call', 'Someone answers when it pages at 3am, and that person is on your payroll.'],
];

export default function Comparison() {
  const line = (t, d) => <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>;
  return (
    <main className="xcm">
      <section className="xcm-hero" aria-labelledby="xcm-h1">
        <div className="x-wrap">
          <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Comparison</motion.p>
          <h1 id="xcm-h1" className="xcm-h1">{line('Buy it,', 0.05)}{line('or run it', 0.15)}</h1>
          <motion.p className="xcm-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>Everything Hanzo does is open source, so the honest question is not whether you could run it — you could — but what that costs. These are real numbers from real compose files.</motion.p>
        </div>
      </section>
      <section className="xcm-bill" aria-labelledby="xcm-bill-h">
        <div className="x-wrap">
          <div className="xcm-bill-h">
            <SecHead title="Run it yourself, and here is the bill" lede="The open-source stacks people reach for, priced from the compute their own compose files reserve." />
            <span id="xcm-bill-h" className="x-sr">The bill</span>
          </div>
          <Builder />
          <p className="xcm-note">Compute only, from each stack’s own compose file: DigitalOcean droplet retail + Hanzo platform margin (estimate). One replica of each, at the footprint the file reserves. Storage, egress and anything with a GPU are not in it — serving a model is a GPU, and no compose file above asks for one.</p>
        </div>
      </section>
      <section className="x-sec xcm-unpriced" data-room="dark">
        <div className="x-wrap">
          <SecHead dark title="And the part that is not a line item" lede="The machines are the cheap half. This is what you are holding once they are paid for." />
          <ol className="xcm-duties">
            {DUTIES.map(([t, d], i) => (
              <Rise as="li" key={t} delay={i * 0.06} y={18}>
                <span className="xcm-d-n x-mono">{String(i + 1).padStart(2, '0')}</span>
                <b>{t}</b>
                <span className="xcm-d-t">{d}</span>
                <span className="xcm-d-p x-mono" aria-hidden="true">$ ?</span>
              </Rise>
            ))}
          </ol>
          <p className="xcm-close">We have not costed that list, and will not: an invented engineer-hours figure would be worth less than the arithmetic you can do yourself, knowing your own team. What Hanzo replaces is the whole column — one identity, one bill, one thing that pages someone else.</p>
        </div>
      </section>
    </main>
  );
}
