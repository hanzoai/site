'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { DAYS } from '../lib/commits';
import { Arrow, Count } from './ui';
import C from '../content';
import Lines from './v2/Lines';

const TILES = [
  ['Commits', 805254, 'In the past year', 'https://git.hanzo.ai/explore/repos', 0],
  ['Merges', 81988, 'In the past year', 'https://git.hanzo.ai/explore/repos', 1],
  ['Commits', 1265, 'In the past 7 days', 'https://git.hanzo.ai/explore/repos'],
  ['123 organizations', 2247, 'Original repositories', 'https://github.com/hanzoai'],
  ['GitHub stars', 6041, 'as GitHub counts them', 'https://github.com/hanzoai'],
  ['GitHub forks', 4579, 'as GitHub counts them', 'https://github.com/hanzoai'],
];
const WAYS = [
  ['Read the docs', 'Complete SDK documentation, client libraries, API references, guides, and architectural blueprints.', 'Read the docs', 'https://docs.hanzo.ai/docs/sdks/app'],
  ['Build your own apps', 'Create native desktop, web, and CLI experiences using the Hanzo platform and starter templates.', 'Build your own apps', 'https://docs.hanzo.ai/docs/dev/web'],
  ['Mod Hanzo', 'Every layer of the stack is open, hackable, and modifiable. Fork repositories and build your own stack.', 'Fork on GitHub', 'https://github.com/hanzoai'],
];

/* Home, open source (v2). The year's commits are the hero figure; beside it the other counts sit on one hairline.
   Hanzo's commit calendar, rebuilt from its own numbers: point at any day (or move with the arrow keys) for Hanzo's
   readout, and the days around it swell like a lens. The repositories ride a rail you can throw. */
const LEAD = 6; // Hanzo's grid opens with six blank days so the weeks line up
const LV = (() => { const s = DAYS.map((x) => x.c).sort((a, b) => a - b); return [0.2, 0.4, 0.6, 0.8].map((q) => s[Math.floor(q * (s.length - 1))]); })();
const level = (c) => LV.filter((t) => c > t).length;
const MONTHS = (() => { const out = []; DAYS.forEach((x, i) => { if (x.d === 1 || i === 0) out.push([x.label.slice(0, 3), Math.floor((i + LEAD) / 7)]); }); return out; })();

function Calendar() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  const calm = useReducedMotion();
  const [hot, setHot] = useState(null);
  // decided after mount, so the server's HTML and the first browser render agree
  const [lit, setLit] = useState(false);
  useEffect(() => { if (seen || calm) setLit(true); }, [seen, calm]);
  const pick = (e) => {
    const g = e.currentTarget.getBoundingClientRect();
    const col = Math.floor(((e.clientX - g.left) / g.width) * 53), row = Math.floor(((e.clientY - g.top) / g.height) * 7);
    const i = col * 7 + row - LEAD;
    setHot(i >= 0 && i < DAYS.length ? i : null);
  };
  const key = (e) => {
    const d = { ArrowRight: 7, ArrowLeft: -7, ArrowDown: 1, ArrowUp: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    setHot((h) => Math.max(0, Math.min(DAYS.length - 1, (h ?? DAYS.length - 1) + d)));
  };
  const h = hot !== null ? DAYS[hot] : null;
  const hc = hot !== null ? Math.floor((hot + LEAD) / 7) : 0, hr = hot !== null ? (hot + LEAD) % 7 : 0;
  return (
    <div className="x-cal hv-cal">
      <div className="x-cal-months" aria-hidden="true">{MONTHS.map(([m, c]) => <span key={m + c} style={{ gridColumn: c + 1 }}>{m}</span>)}</div>
      <div
        ref={ref}
        className={'x-cal-grid2' + (lit ? ' on' : '')}
        role="img"
        tabIndex={0}
        aria-label={`Commits a day over the past year across every repository, private ones counted: 805,254 in all. Use the arrow keys to read each day.`}
        onPointerMove={pick}
        onPointerLeave={() => setHot(null)}
        onKeyDown={key}
        onBlur={() => setHot(null)}
      >
        {Array.from({ length: LEAD }).map((_, i) => <i key={'b' + i} className="blank" />)}
        {DAYS.map((x, i) => {
          const col = Math.floor((i + LEAD) / 7), row = (i + LEAD) % 7;
          const dist = hot !== null ? Math.hypot(col - hc, (row - hr) * 1.1) : 9;
          const s = hot !== null ? (dist < 0.5 ? 1.55 : dist < 2.6 ? 1 + (2.6 - dist) * 0.12 : 1) : 1;
          return <i key={x.label} className={'l' + level(x.c) + (i === hot ? ' hot' : '')} style={{ '--i': i, '--s': s }} />;
        })}
        <AnimatePresence>
          {h && (
            <motion.span
              className="x-cal-tip"
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1, left: `${((hc + 0.5) / 53) * 100}%`, top: `${(hr / 7) * 100}%` }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ type: 'spring', stiffness: 500, damping: 38 }}
            >
              <b>{h.c.toLocaleString('en-US')} commits</b> {h.label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <p className="hv-cal-k">Commits a day</p>
      <div className="x-cal-f">
        <span aria-live="polite">{h ? `${h.label} · ${h.c.toLocaleString('en-US')} commits across ${h.r.toLocaleString('en-US')} repositories` : 'Commits a day, from Nov 7, 2025 to Nov 6, 2026'}</span>
        <span className="x-cal-key">Less <i className="l0" /><i className="l1" /><i className="l2" /><i className="l3" /><i className="l4" /> More</span>
      </div>
    </div>
  );
}

function Tile({ t, i }) {
  const [label, n, sub, href, spark] = t;
  return (
    <a href={href} className={'hv-stat' + (i === 0 ? ' hero' : '')}>
      {i === 0 ? <Count className="v2-figure hv-stat-n" to={n} duration={2.2} /> : <span className="hv-stat-n">{n.toLocaleString('en-US')}</span>}
      <span className="hv-stat-k">{label}</span>
      <span className="hv-stat-s">{sub}</span>
      {spark !== undefined && <span className="hv-stat-spark" dangerouslySetInnerHTML={{ __html: C.spark[spark] }} />}
    </a>
  );
}

/* The repositories on a rail you can throw: drag it, swipe it, or scroll it sideways. */
function Rail() {
  const ref = useRef(null);
  const st = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const down = (e) => { if (e.pointerType !== 'mouse') return; st.current = { x: e.clientX, l: el.scrollLeft, moved: false }; el.classList.add('grab'); };
    const move = (e) => { const s = st.current; if (!s) return; const dx = e.clientX - s.x; if (Math.abs(dx) > 4) s.moved = true; el.scrollLeft = s.l - dx; };
    const up = () => { if (!st.current) return; el.classList.remove('grab'); setTimeout(() => { st.current = null; }, 0); };
    const click = (e) => { if (st.current?.moved) { e.preventDefault(); e.stopPropagation(); } };
    el.addEventListener('pointerdown', down); addEventListener('pointermove', move); addEventListener('pointerup', up); el.addEventListener('click', click, true);
    return () => { el.removeEventListener('pointerdown', down); removeEventListener('pointermove', move); removeEventListener('pointerup', up); el.removeEventListener('click', click, true); };
  }, []);
  const by = (d) => ref.current.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: 'smooth' });
  return (
    <div className="x-rail-wrap hv-rail-wrap">
      <div className="x-rail hv-rail" ref={ref} tabIndex={0} aria-label="Hanzo repositories" data-lenis-prevent-wheel="">
        {C.repos.map((h, i) => (
          <div key={i} className="x-repo hv-repo" dangerouslySetInnerHTML={{ __html: h }} />
        ))}
      </div>
      <div className="x-rail-nav">
        <motion.button type="button" className="x-round" aria-label="Previous repositories" onClick={() => by(-1)} whileTap={{ scale: 0.9 }}>‹</motion.button>
        <motion.button type="button" className="x-round" aria-label="Next repositories" onClick={() => by(1)} whileTap={{ scale: 0.9 }}>›</motion.button>
      </div>
    </div>
  );
}

function Way({ w, i }) {
  return (
    <a href={w[3]} className="hv-way" data-cta={`home.oss.way${i + 1}`}>
      <span className="hv-way-n x-mono" aria-hidden="true">0{i + 1}</span>
      <b className="v2-title">{w[0]}</b>
      <span className="hv-way-d">{w[1]}</span>
      <em>{w[2]} <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></em>
    </a>
  );
}

export default function Open() {
  return (
    <section className="hv-oss v2-sec" id="open-source" aria-labelledby="open-source-h">
      <div className="v2-wrap">
        <header className="hv-head v2-grid">
          <Lines as="h2" id="open-source-h" className="v2-display-s hv-head-t" lines={['We ship every day.', 'Fork anything.', 'Build your own.']} />
          <div className="hv-head-r"><p className="v2-lede">Every layer of the stack is open, hackable and modifiable — recursively self-upgrading AI from the ground up. Fork, remix, and build the apps only you can imagine.</p></div>
        </header>
        <div className="hv-stats">{TILES.map((t, i) => <Tile key={i} t={t} i={i} />)}</div>
        <Calendar />
      </div>
      <Rail />
      <div className="v2-wrap">
        <div className="hv-links"><Arrow href="/open-source">Explore every repository</Arrow></div>
        <div className="hv-ways">{WAYS.map((w, i) => <Way key={w[0]} w={w} i={i} />)}</div>
        <div className="hv-links">
          <Arrow href="https://git.hanzo.ai/explore/repos">Explore the forge</Arrow>
          <Arrow href="/grants">OSS &amp; research credit grants</Arrow>
        </div>
      </div>
    </section>
  );
}
