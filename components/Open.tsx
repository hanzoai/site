'use client';
import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DAYS, FROM, TO, FIRST_WEEKDAY, LAST7, WEEKS, level } from '../lib/commits';
import O from '../content/live/_oss.json';
import repoCard from './home/repoCard';
import spark from './home/spark';
import { Head, Arrow, Count } from './ui';

// the figures hanzo.ai's home shows, from the same snapshot (content/live/_oss.json, refreshed by scripts/live.mjs)
const G = Object.values(O.groups);
const sum = (k: 'repos' | 'stars' | 'forks') => G.reduce((a, g) => a + g[k], 0);
// label, figure, caption, link, and the sparkline drawn above it where there is one
type TileData = [string, number, string, string, string?];
const TILES: TileData[] = [
  ['Commits', O.estate.commits, 'In the past year', 'https://git.hanzo.ai/explore/repos', spark(WEEKS, 'Commits a week over the past year', 28)],
  ['Merges', O.estate.merges, 'In the past year', 'https://git.hanzo.ai/explore/repos', spark(O.estate.mergeMonths, 'Merges a month over the past year', 28)],
  ['Commits', O.calendar.week, 'In the past 7 days', 'https://git.hanzo.ai/explore/repos', spark(LAST7, 'Commits a day over the past 7 days', 28)],
  [`${O.estate.orgs} organizations`, sum('repos'), 'Original repositories', 'https://github.com/hanzoai'],
  ['GitHub stars', sum('stars'), 'as GitHub counts them', 'https://github.com/hanzoai'],
  ['GitHub forks', sum('forks'), 'as GitHub counts them', 'https://github.com/hanzoai'],
];
// four across on a laptop; a phone shows eight, two by two (Home.css)
const CARDS = O.groups.hanzo.top.slice(0, 8).map(repoCard);
/* Hanzo's commit calendar, rebuilt from its own numbers. Point at any day (or move with the arrow keys) for Hanzo's
   readout; the days around it swell like a lens. At rest nothing moves. */
const LEAD = FIRST_WEEKDAY; // Hanzo's grid opens with blank days so the weeks line up (Sunday first)
const MONTHS = (() => { const out: [string, number][] = []; DAYS.forEach((x, i) => { if (x.d === 1 || i === 0) out.push([x.label.slice(0, 3), Math.floor((i + LEAD) / 7)]); }); return out; })();

function Calendar() {
  const ref = useRef<HTMLDivElement>(null);
  const [hot, setHot] = useState<number | null>(null);
  const pick = (e: PointerEvent<HTMLDivElement>) => {
    const g = e.currentTarget.getBoundingClientRect();
    const col = Math.floor(((e.clientX - g.left) / g.width) * 53), row = Math.floor(((e.clientY - g.top) / g.height) * 7);
    const i = col * 7 + row - LEAD;
    setHot(i >= 0 && i < DAYS.length ? i : null);
  };
  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    const d = ({ ArrowRight: 7, ArrowLeft: -7, ArrowDown: 1, ArrowUp: -1 } as Record<string, number | undefined>)[e.key];
    if (!d) return;
    e.preventDefault();
    setHot((h) => Math.max(0, Math.min(DAYS.length - 1, (h ?? DAYS.length - 1) + d)));
  };
  const h = hot !== null ? DAYS[hot] : null;
  const hc = hot !== null ? Math.floor((hot + LEAD) / 7) : 0, hr = hot !== null ? (hot + LEAD) % 7 : 0;
  return (
    <div className="x-cal" data-tilt="">
      <p className="x-race-k">Commits a day</p>
      <div className="x-cal-months" aria-hidden="true">{MONTHS.map(([m, c]) => <span key={m + c} style={{ gridColumn: c + 1 }}>{m}</span>)}</div>
      <div
        ref={ref}
        className="x-cal-grid2"
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
          const s = hot !== null ? (dist < 0.5 ? 1.55 : dist < 2.6 ? 1 + (2.6 - dist) * 0.12 : 1) : 1;
          return <i key={x.label} className={'l' + level(x.c) + (i === hot ? ' hot' : '')} style={{ '--s': s } as CSSProperties} />;
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

function Tile({ t, i }: { t: TileData; i: number }) {
  const [label, n, sub, href, bars] = t;
  return (
    <a href={href} className="x-tile" data-tilt="">
      <span className="x-tile-k">{label}</span>
      <Count className="x-tile-n" to={n} duration={1.6} delay={i * 0.06} />
      <span className="x-tile-s">{sub}</span>
      {bars && <span className="x-tile-spark" dangerouslySetInnerHTML={{ __html: bars }} />}
    </a>
  );
}

export default function Open() {
  return (
    <section className="x-sec x-oss" id="open-source" data-hz-view="open-source" aria-labelledby="open-source-h">
      <div className="x-wrap">
        <Head id="open-source-h" title="We ship every day. Fork anything. Build your own." />
        <div className="x-tiles">{TILES.map((t, i) => <Tile key={i} t={t} i={i} />)}</div>
        <Calendar />
        <div className="x-repos">{CARDS.map((h, i) => <div key={i} className="x-repo" dangerouslySetInnerHTML={{ __html: h }} />)}</div>
        <div className="x-row-links"><Arrow href="/open-source">Explore every repository</Arrow></div>
      </div>
    </section>
  );
}
