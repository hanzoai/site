'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { DAYS, FROM, TO, FIRST_WEEKDAY } from '../lib/commits';
import O from '../content/live/_oss.json';
import repoCard from './home/repoCard';
import { EASE, Head, Arrow, Count } from './ui';
import C from '../content';

// the figures hanzo.ai's home shows, from the same snapshot (content/live/_oss.json, refreshed by scripts/live.mjs)
const G = Object.values(O.groups);
const sum = (k) => G.reduce((a, g) => a + g[k], 0);
const TILES = [
  ['Commits', O.estate.commits, 'In the past year', 'https://git.hanzo.ai/explore/repos', 0],
  ['Merges', O.estate.merges, 'In the past year', 'https://git.hanzo.ai/explore/repos', 1],
  ['Commits', O.calendar.week, 'In the past 7 days', 'https://git.hanzo.ai/explore/repos'],
  [`${O.estate.orgs} organizations`, sum('repos'), 'Original repositories', 'https://github.com/hanzoai'],
  ['GitHub stars', sum('stars'), 'as GitHub counts them', 'https://github.com/hanzoai'],
  ['GitHub forks', sum('forks'), 'as GitHub counts them', 'https://github.com/hanzoai'],
];
const CARDS = O.groups.hanzo.top.slice(0, 12).map(repoCard);
const WAYS = [
  ['Read the docs', 'Complete SDK documentation, client libraries, API references, guides, and architectural blueprints.', 'Read the docs', 'https://docs.hanzo.ai/docs/sdks/app'],
  ['Build your own apps', 'Create native desktop, web, and CLI experiences using the Hanzo platform and starter templates.', 'Build your own apps', 'https://docs.hanzo.ai/docs/dev/web'],
  ['Mod Hanzo', 'Every layer of the stack is open, hackable, and modifiable. Fork repositories and build your own stack.', 'Fork on GitHub', 'https://github.com/hanzoai'],
];

/* Hanzo's commit calendar, rebuilt from its own numbers. Point at any day (or move with the arrow keys) for Hanzo's
   readout; the days around it swell like a lens. While nobody is pointing, a light sweeps the year week by week. */
const LEAD = FIRST_WEEKDAY; // Hanzo's grid opens with blank days so the weeks line up (Sunday first)
const LV = (() => { const s = DAYS.map((x) => x.c).sort((a, b) => a - b); return [0.2, 0.4, 0.6, 0.8].map((q) => s[Math.floor(q * (s.length - 1))]); })();
const level = (c) => LV.filter((t) => c > t).length;
const MONTHS = (() => { const out = []; DAYS.forEach((x, i) => { if (x.d === 1 || i === 0) out.push([x.label.slice(0, 3), Math.floor((i + LEAD) / 7)]); }); return out; })();

function Calendar() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  const live = useInView(ref, { amount: 0.2 });
  // read after mount, so the server's HTML and the first client render agree (reduced motion hydrated with a mismatch)
  const rm = useReducedMotion();
  const [calm, setCalm] = useState(false);
  useEffect(() => setCalm(!!rm), [rm]);
  const [hot, setHot] = useState(null);
  const [sweep, setSweep] = useState(-1);
  useEffect(() => {
    if (!seen || calm || hot !== null || !live) return;
    let w = sweep;
    const t = setInterval(() => { w = w >= 56 ? -4 : w + 1; setSweep(w); }, 90);
    return () => clearInterval(t);
  }, [seen, calm, hot, live]); // eslint-disable-line react-hooks/exhaustive-deps
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
    <div className="x-cal">
      <p className="x-race-k">Commits a day</p>
      <div className="x-cal-months" aria-hidden="true">{MONTHS.map(([m, c]) => <span key={m + c} style={{ gridColumn: c + 1 }}>{m}</span>)}</div>
      <div
        ref={ref}
        className={'x-cal-grid2' + (seen || calm ? ' on' : '')}
        role="img"
        tabIndex={0}
        aria-label={`Commits a day over the past year across every repository, private ones counted: ${O.estate.commits.toLocaleString('en-US')} in all. Use the arrow keys to read each day.`}
        onPointerMove={pick}
        onPointerLeave={() => setHot(null)}
        onKeyDown={key}
        onBlur={() => setHot(null)}
      >
        {Array.from({ length: LEAD }).map((_, i) => <i key={'b' + i} className="blank" />)}
        {DAYS.map((x, i) => {
          const col = Math.floor((i + LEAD) / 7), row = (i + LEAD) % 7;
          const dist = hot !== null ? Math.hypot(col - hc, (row - hr) * 1.1) : 9;
          const s = hot !== null ? (dist < 0.5 ? 1.55 : dist < 2.6 ? 1 + (2.6 - dist) * 0.12 : 1) : Math.abs(col - sweep) < 1 ? 1.22 : 1;
          return <i key={x.label} className={'l' + level(x.c) + (i === hot ? ' hot' : '') + (hot === null && Math.abs(col - sweep) < 1 ? ' sw' : '')} style={{ '--i': i, '--s': s }} />;
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
      <div className="x-cal-f">
        <span aria-live="polite">{h ? `${h.label} · ${h.c.toLocaleString('en-US')} commits across ${h.r.toLocaleString('en-US')} repositories` : `Commits a day, from ${FROM} to ${TO}`}</span>
        <span className="x-cal-key">Less <i className="l0" /><i className="l1" /><i className="l2" /><i className="l3" /><i className="l4" /> More</span>
      </div>
    </div>
  );
}

function Tile({ t, i }) {
  const [label, n, sub, href, spark] = t;
  return (
    <motion.a href={href} className="x-tile" whileTap={{ scale: 0.98 }}>
      <span className="x-tile-k">{label}</span>
      <Count className="x-tile-n" to={n} duration={2} delay={i * 0.06} />
      <span className="x-tile-s">{sub}</span>
      {spark !== undefined && <span className="x-tile-spark" dangerouslySetInnerHTML={{ __html: C.spark[spark] }} />}
    </motion.a>
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
    <div className="x-rail-wrap">
      <div className="x-rail" ref={ref} tabIndex={0} aria-label="Hanzo repositories" data-lenis-prevent-wheel="">
        {CARDS.map((h, i) => (
          <motion.div key={i} className="x-repo" initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease: EASE, delay: Math.min(i, 4) * 0.07 }} whileHover={{ y: -4 }} dangerouslySetInnerHTML={{ __html: h }} />
        ))}
      </div>
      <div className="x-rail-nav">
        <motion.button type="button" className="x-round" aria-label="Previous repositories" onClick={() => by(-1)} whileTap={{ scale: 0.9 }}>‹</motion.button>
        <motion.button type="button" className="x-round" aria-label="Next repositories" onClick={() => by(1)} whileTap={{ scale: 0.9 }}>›</motion.button>
      </div>
    </div>
  );
}

function Way({ w }) {
  return (
    <motion.a href={w[3]} className="x-way" whileHover={{ y: -4 }} whileTap={{ scale: 0.985 }}>
      <b><span>{w[0]}</span></b>
      <span>{w[1]}</span>
      <em><span>{w[2]} →</span></em>
    </motion.a>
  );
}

export default function Open() {
  return (
    <>
    <section className="x-sec x-oss" id="open-source" aria-labelledby="open-source-h">
      <div className="x-wrap">
        <Head title="We ship every day. Fork anything. Build your own." lede="Every layer of the stack is open, hackable and modifiable — recursively self-upgrading AI from the ground up. Fork, remix, and build the apps only you can imagine." />
        <div className="x-tiles">{TILES.map((t, i) => <Tile key={i} t={t} i={i} />)}</div>
        <Calendar />
      </div>
      <Rail />
      <div className="x-wrap">
        <div className="x-row-links"><Arrow href="/open-source">Explore every repository</Arrow></div>
      </div>
    </section>
    <section className="xw-ways">
      <div className="x-ways">{WAYS.map((w) => <Way key={w[0]} w={w} />)}</div>
      <div className="x-row-links">
        <Arrow href="https://git.hanzo.ai/explore/repos">Explore the forge</Arrow>
        <Arrow href="/grants">OSS &amp; research credit grants</Arrow>
      </div>
    </section>
    </>
  );
}
