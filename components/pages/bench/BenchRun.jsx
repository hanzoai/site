'use client';
/* One benchmark (/benchmarks/<slug>, 27 pages, one template), read like a model launch (anthropic.com): the benchmark as
   hero figures, the method as chapters, the source one press away.
   Persona: researcher, and the developer weighing Hanzo's router and engines (PLAN-COMPONENTS 1.1).
   Goal: believe the figure by seeing how it was measured and reading the run behind it.
   CTA: "Start on Hanzo Cloud" (paper pages, from their own close) or the header's "Try Hanzo" (result pages), one solid
   in the hero (data-thumb), carried after it by the site's ask bar (components/Ask.jsx) at every width. Metric: signup_start; GitHub or weights click.
   Stage: the title at display size beside its lede, the page's one ask and its crumb; over a contour field seeded from
   the slug and its own numbers. The benchmark's own card (its table, with a live readout of the row being read) is the
   hero object, on the first screen at 1470×801 and 375×812, settling into place as you scroll. Result pages then put
   their latest figures up huge; the long sections of the method are sticky chapters (words pin, the section's own table
   or the live figure wipes in), the rest of each section in a sheet whose trigger previews it in Hanzo's words. Short
   sections read as a tech-spec list; the source is the one dark room; siblings are cards that open into their page.
   Signature: the table turns into its chart. The rows of Hanzo's own table (its History, its comparison or its
   results) lift out of the table and settle into the chart they make: bars to scale, a value against its baseline, or
   Kai's revisions as a line over the dates hanzo.ai plots. Turn it back with one press; a playhead then keeps reading
   the rows, and the card's readout and every chapter's figure follow it.
   Beyond: ask the source. Where the page cites a research run on api.hanzo.ai, one press reads that run live and lays
   its raw record beside the transcribed figures (id, split, questions answered, commit, end time, every measure); where
   the source is a repository, the panel hands you the exact command to run it yourself.
   Motion, not only scroll: idle (the playhead reads the rows, the readout rolls), state (table to chart re-flow, view
   switch, sheets), pointer (rows answer hover with their figure, the ask is magnetic, the sibling rail drags with
   inertia), time (the source types its reply), scroll (stage settle, chapter wipes, the latest figure grows while it is the
   moment). Scale has rhythm (MASTER.md): title 52, section heads 26, figures rest at 64; one big thing per screen.
   Colour: 0 UI hues, ink and greys.
   Ledger: deletes the crumb/kicker eyebrow over the title, the per-member accent, the invented "Source", "Table", "Chart",
   "Previous", "Next" labels (icons with names from content/ui-strings.json), and the duplicated readout rail.
   V2: 8/10 hero card on the first screen beside a display title and one magnetic ask, 0-hue ink system, chapters with Hanzo-worded sheets, sticky ask, sibling rail that drags, source room without invented labels */
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { motion, LayoutGroup, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE } from '../../ui';
import { A, Cta, DataTable, CodeBlock } from '../../kit';
import { Magnetic } from '../../ui';
import { ui } from '../../v2/famUi';
import { play } from '../../../lib/sound';
import { Nodes } from '../DocNodes';
import Sigil from '../../Sigil';
import FamLines from '../../v2/FamLines';
import FamStage from '../../v2/FamStage';
import FamChapters from '../../v2/FamChapters';
import FamDrawer from '../../v2/FamDrawer';
import FamNext from '../../v2/FamNext';
import FamGrow from '../../v2/FamGrow';
import FamRoom from '../../v2/FamRoom';
import './bench.css';

const SPRING = { type: 'spring', stiffness: 300, damping: 30 };
const textOf = (n) => (n && typeof n === 'object' ? n.c.map(textOf).join('') : n || '');
const measure = (s) => /^[~<>≈$]?\s*\d/.test(String(s).trim()) || /^[—–-]?$/.test(String(s).trim());
const clean = (s) => String(s || '').replace(/\s+/g, ' ').trim();

/* the playhead: one index the card and every chapter read. It walks the rows once (a demo plays and rests,
   PLAN-COMPONENTS 2.9) and comes back to Hanzo's first row; the card's pause control stops or replays it. It ticks
   only while the tab is visible. */
/* The playhead only lights rows; the card's big figure stays on Hanzo's own row (the page's claim) unless the reader
   picks a row, and a pick stops the walk for good. */
function makeWalk() {
  let i = 0, n = 1, id = 0, hold = 0, left = 0, on = false, pin = -1;
  const subs = new Set();
  const emit = () => subs.forEach((f) => f());
  const stop = () => { clearInterval(id); on = false; emit(); };
  return {
    get: () => i,
    pinned: () => pin,
    playing: () => on,
    sub: (f) => { subs.add(f); return () => subs.delete(f); },
    set: (k, pause = 0) => { i = k; if (pause) hold = Date.now() + pause; emit(); },
    pick: (k) => { clearInterval(id); on = false; pin = k; i = k; emit(); },
    stop,
    start: (count) => {
      n = Math.max(1, count);
      clearInterval(id);
      if (n < 2) return () => {};
      left = n; on = true; emit();
      id = setInterval(() => {
        if (document.hidden || Date.now() < hold) return;
        i = (i + 1) % n; left -= 1;
        if (left <= 0) { i = 0; stop(); play('done'); } else emit(); // the demo ends at rest, with the kit's quiet 'done'
      }, 1900);
      return () => clearInterval(id);
    },
  };
}
const useAt = (walk) => useSyncExternalStore(walk.sub, walk.get, () => 0);
const usePin = (walk) => useSyncExternalStore(walk.sub, walk.pinned, () => -1);
const usePlaying = (walk) => useSyncExternalStore(walk.sub, walk.playing, () => false);

/* Hanzo's own row: the first row that names Hanzo or one of its models, else the table's first row */
const HANZO = /hanzo|\bzen|enso|\bkai/i;
function anchorOf(c) {
  if (!c) return 0;
  const labels = c.kind === 'trend' ? c.points.map((p) => p.who) : c.kind === 'one' ? [c.label] : c.rows.map((r) => r.label);
  const k = labels.findIndex((l) => HANZO.test(String(l)));
  return k < 0 ? 0 : k;
}

/* what the card reads at row i: [row, figure, what the figure is]; on a multi-column table, the column in view */
function readout(c, i, col = 0) {
  if (!c) return null;
  if (c.kind === 'trend') { const p = c.points[i % c.points.length]; return [p.who, p.val, p.when]; }
  if (c.kind === 'versus') { const r = c.rows[i % c.rows.length]; return [r.label, r.a.s, c.heads[0]]; }
  if (c.kind === 'bars') { const r = c.rows[i % c.rows.length]; const k = Math.min(col, r.cells.length - 1); return [r.label, r.cells[k].s, c.cols[k].name]; }
  return [c.label, c.s, c.head];
}
const rowsOf = (c) => (!c ? 0 : c.kind === 'trend' ? c.points.length : c.kind === 'one' ? 1 : c.rows.length);

/* bar widths: to scale from zero, or on a log scale when the figures span orders of magnitude */
function scaler(vals) {
  const v = vals.filter((x) => x != null && x > 0);
  if (!v.length) return () => 0;
  const lo = Math.min(...v), hi = Math.max(...v);
  if (hi / lo > 50) { const a = Math.log10(lo), b = Math.log10(hi); return (x) => (x > 0 ? (Math.log10(x) - a + 0.25) / (b - a + 0.25) : 0); }
  return (x) => (x > 0 ? x / hi : 0);
}
const isLog = (vals) => { const v = vals.filter((x) => x != null && x > 0); return v.length > 1 && Math.max(...v) / Math.min(...v) > 50; };

/* the card's figure: Hanzo's own row, huge; a row the reader points at or picks takes its place. It rolls only when
   the reader changes the row or the column, never by itself. */
/* the row being read: the one the reader points at, else the one they picked, else Hanzo's own */
function useLook(c, walk) {
  const pin = usePin(walk);
  const [hover, setHover] = useState(-1);
  useEffect(() => { const f = (e) => setHover(e.detail); addEventListener('xbr-hover', f); return () => removeEventListener('xbr-hover', f); }, []);
  return hover >= 0 ? hover : pin >= 0 ? pin : anchorOf(c);
}
function Readout({ c, walk, col = 0 }) {
  const k = useLook(c, walk);
  const r = readout(c, k, col);
  if (!r) return null;
  return (
    <div className="xbr-ro" aria-hidden="true">
      <span className="xbr-ro-l">{r[0]}</span>
      <span className="xbr-ro-vw">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.b key={k + '|' + col + '|' + r[1]} className={'xbr-ro-v v2f-num' + (r[1].length > 10 ? ' long' : r[1].length > 7 ? ' mid' : '')} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '-100%', transition: { duration: 0.28, ease: EASE } }} transition={{ duration: 0.6, ease: EASE }}>{r[1]}</motion.b>
        </AnimatePresence>
      </span>
      <span className="xbr-ro-s x-mono">{r[2]}</span>
    </div>
  );
}
const hoverRow = (k) => dispatchEvent(new CustomEvent('xbr-hover', { detail: k }));

/* pause or replay the playhead (WCAG 2.2.2: anything that moves for more than 5 s can be stopped) */
function Walker({ walk, n }) {
  const playing = usePlaying(walk);
  const calm = useReducedMotion();
  if (calm || n < 2) return null;
  return (
    <button type="button" className="xbr-walk" aria-label={ui(playing ? 'pause' : 'replay')} aria-pressed={!playing} onClick={() => (playing ? walk.stop() : walk.start(n))}>
      {playing
        ? <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M7 4.5v11M13 4.5v11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
        : <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M15.5 10a5.5 5.5 0 1 1-1.6-3.9M15.5 4v3.6h-3.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
    </button>
  );
}

/* ---------- the signature: the table that turns into its chart ---------- */
function Turn({ c, walk, slug }) {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const [chart, setChart] = useState(false);
  const [col, setCol] = useState(0);
  const turned = useRef(false);
  const walkAt = useAt(walk);
  const pin = usePin(walk);
  const at = pin >= 0 ? pin : walkAt;
  const own = anchorOf(c);
  useEffect(() => {
    if (calm) { setChart(true); return; }
    if (!seen || turned.current) return;
    const t = setTimeout(() => { turned.current = true; setChart(true); }, 1100);
    return () => clearTimeout(t);
  }, [seen, calm]);
  const id = 'xbr-turn-' + slug;
  const view = (
    <div className="xbr-turn-v" role="group" aria-label="View">
      <span className="xbr-turn-vb" aria-hidden="true" style={{ transform: chart ? 'translateX(100%)' : 'none' }} />
      {[['table', false], ['chart', true]].map(([k, v]) => (
        <button key={k} type="button" aria-pressed={chart === v} aria-label={ui(k)} onClick={() => { turned.current = true; setChart(v); }}>
          {v ? <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M3 16.5h14M5.5 14V9M10 14V5M14.5 14v-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            : <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>}
        </button>
      ))}
    </div>
  );
  const pick = (i) => { hoverRow(-1); walk.pick(i); };
  const near = (i) => (e) => { if (e.pointerType === 'mouse') hoverRow(i); };
  const away = () => hoverRow(-1);

  let body = null;
  if (c.kind === 'trend') {
    const n = c.points.length, span = c.hi - c.lo || 1;
    const X = (i) => (n > 1 ? (i / (n - 1)) * 100 : 50), Y = (v) => ((v - c.lo) / span) * 100;
    const d = c.points.map((p, i) => (i ? 'L' : 'M') + X(i).toFixed(2) + ' ' + (100 - Y(p.v)).toFixed(2)).join(' ');
    body = (
      <div className={'xbr-tr' + (chart ? ' chart' : '')}>
        <div className="xbr-tr-axes" aria-hidden="true">
          {c.ticks.map((t) => <span key={t} className="xbr-tick" style={{ bottom: Y(parseFloat(t)) + '%' }}>{t}</span>)}
          {c.base && <span className="xbr-base" style={{ bottom: Y(c.base.v) + '%' }}><em>{c.base.s}</em></span>}
          <svg className="xbr-tr-line" viewBox="0 0 100 100" preserveAspectRatio="none"><path d={d} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" /></svg>
        </div>
        <ol className="xbr-tr-pts">
          {c.points.map((p, i) => (
            <motion.li key={p.s} layout={!calm} transition={SPRING} className={at % n === i ? 'lit' : ''} style={chart ? { left: X(i) + '%', bottom: Y(p.v) + '%' } : undefined}>
              <button type="button" aria-label={p.s} onClick={() => pick(i)} onPointerEnter={near(i)} onPointerLeave={away}>
                <motion.span layout={calm ? false : 'position'} transition={SPRING} className="xbr-tr-who">{p.who}</motion.span>
                <motion.span layout={calm ? false : 'position'} transition={SPRING} className="xbr-tr-val x-mono">{p.val}</motion.span>
                <motion.span layout={calm ? false : 'position'} transition={SPRING} className="xbr-tr-when">{p.when}</motion.span>
                <i className="xbr-dot" aria-hidden="true" />
              </button>
            </motion.li>
          ))}
        </ol>
        <div className="xbr-tr-dates x-mono" aria-hidden="true">{c.dates.map((t) => <span key={t}>{t}</span>)}</div>
      </div>
    );
  } else if (c.kind === 'versus') {
    const s = c.rows.map((r) => Math.max(r.a.v, r.b.v) || 1);
    body = (
      <div className={'xbr-bars vs' + (chart ? ' chart' : '')}>
        <div className="xbr-bars-h x-mono"><span><i className="xbr-key a" />{c.heads[0]}</span><span><i className="xbr-key b" />{c.heads[1]}</span></div>
        <ul>
          {c.rows.map((r, i) => (
            <li key={i} className={at % c.rows.length === i ? 'lit' : ''} onPointerEnter={near(i)} onPointerLeave={away} onClick={() => pick(i)}>
              <span className="xbr-bl">{r.label}</span>
              <i className="xbr-bar ba" style={{ '--xbr-w': Math.max(0.004, r.a.v / s[i]) }} /><b className="xbr-v va x-mono">{r.a.s}</b>
              <i className="xbr-bar bb" style={{ '--xbr-w': Math.max(0.004, r.b.v / s[i]) }} /><b className="xbr-v vb x-mono">{r.b.s}</b>
            </li>
          ))}
        </ul>
      </div>
    );
  } else if (c.kind === 'bars') {
    const vals = c.rows.map((r) => r.cells[col].v);
    const w = scaler(vals);
    // the value column is as wide as its longest figure, so every bar runs on the same track and no figure wraps
    const vw = Math.max(...c.rows.map((r) => String(r.cells[col].s || '').length), 3) + 1;
    body = (
      <div className={'xbr-bars' + (chart ? ' chart' : '')} style={{ '--xbr-vw': vw + 'ch' }}>
        {c.cols.length > 1 && (
          <div className="xbr-cols" role="group" aria-label={c.head0}>
            {c.cols.map((k, j) => <button key={k.name} type="button" aria-pressed={col === j} onClick={() => { setCol(j); walk.stop(); play('tick'); turned.current = true; setChart(true); }}>{k.name}</button>)}
          </div>
        )}
        <div className="xbr-bars-h x-mono"><span>{c.head0}</span><span>{c.cols[col].name}{chart && isLog(vals) ? ' · ' + ui('log') : ''}</span></div>
        <ul>
          {c.rows.map((r, i) => (
            <li key={i} className={(at % c.rows.length === i ? 'lit' : '') + (i === own ? ' own' : '') + (r.cells[col].v == null ? ' none' : '')} onPointerEnter={near(i)} onPointerLeave={away} onClick={() => pick(i)}>
              <span className="xbr-bl">{r.label}</span>
              <i className="xbr-bar ba" style={{ '--xbr-w': Math.max(0.004, w(r.cells[col].v)) }} />
              <motion.b layout={calm ? false : 'position'} transition={SPRING} className="xbr-v va x-mono">{r.cells[col].s}</motion.b>
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    body = (
      <div className="xbr-one">
        <span className="xbr-one-l">{c.label}</span>
        <b className="xbr-one-v v2f-num">{c.s}</b>
        <span className="xbr-one-h x-mono">{c.head}</span>
      </div>
    );
  }
  return (
    <figure ref={box} id={id} className={'xbr-turn v2f-obj' + (c.kind === 'one' ? ' one' : '')}>
      <figcaption className="xbr-turn-h">
        <span className="v2f-kick">{c.metric || c.title}</span>
        {c.kind !== 'one' && <div className="xbr-turn-ctl"><Walker walk={walk} n={rowsOf(c)} />{view}</div>}
      </figcaption>
      <div className="xbr-turn-g">
        {c.kind !== 'one' && <Readout c={c} walk={walk} col={col} />}
        <LayoutGroup id={id}><div className="xbr-turn-b">{body}</div></LayoutGroup>
      </div>
    </figure>
  );
}

/* ---------- a chapter whose table is the card's own: its figures are said once (on the card); the chapter shows what
   they are made of instead, and the table itself waits in the chapter's sheet ---------- */
const OF = /^(\d[\d,]*) of (\d[\d,]*)$/;
const num = (s) => parseInt(String(s).replace(/,/g, ''), 10);
/* the column whose every cell reads "x of y" (gpqa: "184 of 198"): the questions themselves */
const partsCol = (c) => (c && c.kind === 'bars' ? c.cols.findIndex((_, j) => c.rows.every((r) => OF.test(String(r.cells[j].s || '').trim()) && num(String(r.cells[j].s).split(' of ')[1]) <= 400)) : -1);
function Parts({ c, walk, j }) {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.35, once: true });
  const k = useLook(c, walk) % c.rows.length;
  const r = c.rows[k];
  const [x, y] = String(r.cells[j].s).trim().split(' of ').map(num);
  const cols = Math.ceil(Math.sqrt(y * 1.5));
  return (
    <div ref={box} className="xbr-ch-v xbr-parts" data-on={seen ? '' : undefined} aria-hidden="true">
      <div className="xbr-parts-g" style={{ '--c': cols }}>
        {Array.from({ length: y }, (_, i) => <i key={i} className={i < x ? 'on' : ''} style={{ '--i': i }} />)}
      </div>
      <div className="xbr-parts-f">
        <span className="xbr-parts-l">{r.label}</span>
        <b className="x-mono">{r.cells[j].s}</b>
        <span className="xbr-ro-s x-mono">{c.cols[j].name}</span>
      </div>
    </div>
  );
}
/* every other card table: its rows as squares whose area is the figure, nested from one corner (Hanzo's row in ink) */
function Scale({ c, walk }) {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.35, once: true });
  const k = useLook(c, walk);
  let sq = [], keys = null;
  if (c.kind === 'versus') {
    const r = c.rows[k % c.rows.length];
    const hi = Math.max(r.a.v, r.b.v) || 1;
    sq = [{ s: Math.sqrt(r.b.v / hi), t: 'b' }, { s: Math.sqrt(r.a.v / hi), t: 'a' }];
    keys = [[c.heads[0], 'a'], [c.heads[1], 'b']];
  } else if (c.kind === 'bars') {
    const vals = c.rows.map((r) => r.cells[0].v);
    const w = scaler(vals);
    const own = anchorOf(c);
    sq = c.rows.map((r, i) => ({ s: Math.sqrt(Math.max(0, w(r.cells[0].v))), t: i === k % c.rows.length ? 'a' : i === own ? 'o' : 'n' })).sort((p, q) => q.s - p.s);
  } else return null;
  const r = readout(c, k);
  return (
    <div ref={box} className="xbr-ch-v xbr-scale" data-on={seen ? '' : undefined} aria-hidden="true">
      <div className="xbr-scale-b">
        {sq.map((q, i) => <i key={i} className={'xbr-sq ' + q.t} style={{ '--s': Math.max(0.012, q.s), '--i': i }} />)}
      </div>
      <div className="xbr-parts-f">
        <span className="xbr-parts-l">{r[0]}</span>
        {keys ? <span className="xbr-scale-k x-mono">{keys.map(([h, t]) => <span key={t}><i className={'xbr-key ' + t} />{h}</span>)}</span> : <span className="xbr-ro-s x-mono">{r[2]}</span>}
      </div>
    </div>
  );
}

/* a captured table, drawn in the new design; every cell stays, wide ones scroll inside their own frame */
/* a captured table, as the kit's one DataTable: every cell as Hanzo wrote it (links included), the first column the row
   header, figures in tabular numerals; the caption is the section it belongs to (Hanzo's own heading) */
const isEl = (k) => k && typeof k === 'object';
function headsOf(n) {
  const thead = n.c.find((k) => isEl(k) && k.t === 'thead');
  const tr = thead && thead.c.find((r) => isEl(r) && r.t === 'tr');
  return tr ? tr.c.filter(isEl).map((th) => clean(textOf(th))) : [];
}
function Table({ n, caption }) {
  const rowsOf = (sec) => (sec ? sec.c.filter((r) => isEl(r) && r.t === 'tr') : []);
  const thead = n.c.find((k) => isEl(k) && k.t === 'thead');
  const tbody = n.c.find((k) => isEl(k) && k.t === 'tbody') || n;
  const head = rowsOf(thead)[0];
  const heads = head ? head.c.filter(isEl).map((th) => clean(textOf(th))) : [];
  const body = rowsOf(tbody).filter((r) => r.c.some((k) => isEl(k) && k.t === 'td'));
  const width = Math.max(heads.length, ...body.map((r) => r.c.filter(isEl).length));
  const cols = Array.from({ length: width }, (_, j) => ({ key: 'c' + j, label: heads[j] || '', num: j > 0 && body.every((r) => { const c = r.c.filter(isEl)[j]; return !c || measure(clean(textOf(c)), true); }) }));
  const rows = body.map((r) => Object.fromEntries(r.c.filter(isEl).map((td, j) => ['c' + j, <Nodes key={j} nodes={td.c} />])));
  return <DataTable caption={caption || heads.join(' · ')} cols={cols} rows={rows} className="xbr-dt" />;
}

/* a command, as the kit's one CodeBlock: copies exactly what it shows, the "$ " is drawn, not copied */
function Cmd({ text }) {
  return <CodeBlock code={text} prompt className="xbr-code" />;
}

/* one block of a section, as Hanzo wrote it */
function Block({ b }) {
  const n = b.n;
  if (b.t === 'text') return <p className="xbr-small">{b.s}</p>;
  if (b.t === 'table') return <Table n={n} />;
  if (b.t === 'code' || b.t === 'pre') return <Cmd text={clean(textOf(n))} />;
  if (b.t === 'p') {
    const els = n.c.filter((k) => k && typeof k === 'object');
    if (els.length === 1 && els[0].t === 'code' && !clean(n.c.filter((k) => typeof k === 'string').join(''))) return <Cmd text={clean(textOf(els[0]))} />;
    return <p className="xbr-p"><Nodes nodes={n.c} /></p>;
  }
  if (b.t === 'h3') return <h3 className="xbr-h3"><Nodes nodes={n.c} /></h3>;
  if (b.t === 'dl') return <Facts n={n} />;
  if (b.t === 'a') return <A to={n.a.href} className="x-arrow xbr-a"><span><Nodes nodes={n.c} /></span></A>;
  if (b.t === 'span') return <span className="xbr-chip"><Nodes nodes={n.c} /></span>;
  return <div className="xbr-p"><Nodes nodes={[n]} /></div>;
}
function Blocks({ blocks }) {
  // runs of chips (Conditions) sit together as one list
  const out = [];
  blocks.forEach((b) => {
    if (b.t === 'span' && out.length && Array.isArray(out[out.length - 1])) out[out.length - 1].push(b);
    else out.push(b.t === 'span' ? [b] : b);
  });
  return out.map((b, i) => (Array.isArray(b)
    ? <ul key={i} className="xbr-chips">{b.map((x, k) => <li key={k}><Block b={x} /></li>)}</ul>
    : <Block key={i} b={b} />));
}

/* the intro's facts: dataset, licence, introduced by, harness, our papers */
function Facts({ n }) {
  const rows = [];
  n.c.forEach((k) => { if (k && k.t === 'dt') rows.push([k, null]); else if (k && k.t === 'dd' && rows.length) rows[rows.length - 1][1] = k; });
  return (
    <dl className="xbr-facts">
      {rows.map(([dt, dd], i) => <div key={i}><dt><Nodes nodes={dt.c} /></dt><dd>{dd && <Nodes nodes={dd.c} />}</dd></div>)}
    </dl>
  );
}

/* ---------- beyond: ask the source ---------- */
const ISO = (s) => (s ? s.replace('T', ' ').replace(/:\d\dZ$/, ' UTC') : '');
const Play = () => <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M7 4.5v11l9-5.5z" fill="currentColor" /></svg>;
const Braces = () => <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M7 3.5C5 3.5 5 5 5 6.5S4.5 9 3 10c1.5 1 2 2 2 3.5s0 3 2 3M13 3.5c2 0 2 1.5 2 3s.5 2.5 2 3.5c-1.5 1-2 2-2 3.5s0 3-2 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
/* the reply, typed out once it arrives (time, not scroll): the runs' ids appear a character at a time into text nodes */
function Typed({ text, delay = 0 }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || calm) return;
    let i = 0, raf = 0, t0 = 0;
    const tick = (t) => { if (!t0) t0 = t + delay; if (t >= t0) { i = Math.min(text.length, Math.floor((t - t0) / 14)); el.firstChild.nodeValue = text.slice(0, i); } if (i < text.length) raf = requestAnimationFrame(tick); };
    el.firstChild.nodeValue = '';
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay, calm]);
  return <span ref={ref}>{text}</span>;
}
/* the reply as the page already transcribes it: the run ids the page links, then its own figures. It types itself once
   when the room is reached (a demo that plays and rests); a press replays it and, only if api.hanzo.ai answers within
   6 s, swaps in the raw record. A failed read never shows: the transcribed reply stays (MASTER part 17). */
function snapOf(doc) {
  const c = doc.chart;
  const rows = !c ? [] : c.kind === 'trend' ? c.points.map((p) => [p.who, p.val]) : c.kind === 'one' ? [[c.label, c.s]]
    : c.kind === 'versus' ? c.rows.map((r) => [r.label, r.a.s]) : c.rows.map((r) => [r.label, r.cells[0].s]);
  return { ids: (doc.source && doc.source.ids) || [], rows: rows.slice(0, 8) };
}
function Source({ doc }) {
  const src = doc.source;
  const calm = useReducedMotion();
  const room = useRef(null);
  const seen = useInView(room, { amount: 0.35, once: true });
  const snap = useMemo(() => snapOf(doc), [doc]);
  const [st, setSt] = useState({ k: 'idle', n: 0 });
  useEffect(() => { if (seen && src) setSt((s) => (s.k === 'idle' ? { k: 'ok', n: 1 } : s)); }, [seen, src]);
  const ask = async () => {
    setSt((s) => ({ k: 'ok', n: s.n + 1 }));
    const ab = new AbortController();
    const t = setTimeout(() => ab.abort(), 6000);
    try {
      const r = await fetch(src.url, { headers: { accept: 'application/json' }, signal: ab.signal });
      if (!r.ok) return;
      const j = await r.json();
      const all = Array.isArray(j.data) ? j.data : [];
      // a benchmark-wide query answers with every run; keep the runs this page links, in its order
      const want = src.ids.length > 1 ? src.ids : null;
      const runs = want ? want.map((id) => all.find((x) => x.id === id)).filter(Boolean) : all.slice(0, 6);
      if (runs.length) setSt((s) => ({ k: 'live', n: s.n, runs }));
    } catch { /* unreachable: the transcribed reply stays */ } finally { clearTimeout(t); }
  };
  const reply = '{ "data": [\n' + snap.ids.map((id) => '  "' + id + '"').join(',\n') + '\n] }';
  const figs = snap.rows.map(([l, v]) => l + '  ' + v).join('\n');
  const shown = src ? src.url.replace(/^https:\/\//, '') : '';
  return (
    <FamRoom className="xbr-src" aria-label={src ? 'api.hanzo.ai' : doc.command}>
      <div ref={room} className="v2f-wrap v2f-grid xbr-src-g">
        <div className="xbr-src-l">
          {src ? (
            <>
              <p className="xbr-src-u x-mono"><b>GET</b> <span>{shown}</span></p>
              <div className="xbr-src-acts">
                <Magnetic>
                  <button type="button" className="xbr-ask" onClick={ask} aria-label={ui('read_run')}>
                    <i className="xbr-ask-d" aria-hidden="true" /><Play />
                  </button>
                </Magnetic>
                <a className="xbr-raw" href={src.url} target="_blank" rel="noopener noreferrer" aria-label="JSON"><Braces /></a>
              </div>
            </>
          ) : (
            doc.command && <Cmd text={doc.command} />
          )}
        </div>
        <div className="xbr-src-r">
          <div className="xbr-term">
            <div className="xbr-term-h" aria-hidden="true"><i /><i /><i /><span className="x-mono">{src ? 'api.hanzo.ai' : 'shell'}</span></div>
            <div className="xbr-term-b" data-lenis-prevent>
              {src && st.k !== 'live' && (
                <div className="xbr-src-reply x-mono" key={st.n}>
                  <pre className="xbr-src-json">{st.k === 'idle' || calm ? reply : <Typed text={reply} />}</pre>
                  {!!figs && <pre className="xbr-src-figs">{st.k === 'idle' || calm ? figs : <Typed text={figs} delay={reply.length * 14 + 200} />}</pre>}
                </div>
              )}
              {st.k === 'live' && (
                <ol className="xbr-runs">
                  {st.runs.map((r, i) => (
                    <li key={r.id} style={{ '--k': i }}>
                      <p className="xbr-run-id x-mono"><Typed text={r.id} delay={i * 120} /></p>
                      <dl className="xbr-run-k x-mono">
                        {[['split', r.split], ['system', r.system], ['questions', r.questions != null ? r.answered + ' / ' + r.questions : ''], ['commit', (r.commit || '').slice(0, 10)], ['ended', ISO(r.ended)], ['completion', r.completion]].filter((x) => x[1]).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
                      </dl>
                      <ul className="xbr-run-m x-mono">
                        {(r.measures || []).filter((m) => m.category === 'all' || !m.category).slice(0, 8).map((m, k) => <li key={k}><span>{m.metric}</span><b>{m.value}</b></li>)}
                      </ul>
                    </li>
                  ))}
                </ol>
              )}
              {!src && <div className="xbr-src-wait x-mono" aria-hidden="true">{'$ ' + (doc.command || '')}<i className="xbr-caret" /></div>}
            </div>
          </div>
        </div>
      </div>
    </FamRoom>
  );
}

/* the closing parts of a paper page: Build on Hanzo Cloud, previous / next, related, every other benchmark */
const linkOf = (b) => b.t === 'a' && b.n.a && b.n.a.href;
const isPager = (b) => (linkOf(b) && /^(Previous|Next)/.test(clean(textOf(b.n)))) || (linkOf(b) && b.n.a.href === '/benchmarks' && /Board/.test(textOf(b.n)));
/* the page's one ask, in Hanzo's words: a paper page's own "Start on Hanzo Cloud", else the header's "Try Hanzo" */
export function askOf(tail) {
  const first = tail.find((b) => linkOf(b) && !isPager(b));
  return first ? { label: clean(textOf(first.n)), href: first.n.a.href } : { label: 'Try Hanzo', href: 'https://hanzo.ai/signup' };
}
function Tail({ tail, near, peek }) {
  const pager = tail.filter(isPager);
  const ctaEnd = tail.findIndex((b) => pager.includes(b));
  const cta = tail.length ? tail.slice(0, ctaEnd < 0 ? 3 : ctaEnd) : [];
  const rest = tail.slice((ctaEnd < 0 ? 3 : ctaEnd)).filter((b) => !pager.includes(b));
  const parts = (n) => n.c.filter((k) => k && typeof k === 'object').map((k) => clean(textOf(k)));
  const slugOf = (h) => h.split('/').filter(Boolean).pop();
  const cards = (pager.length ? pager.map((b) => {
    const p = parts(b.n);
    const dir = /^Previous/.test(p[0]) ? 'prev' : /^Next/.test(p[0]) ? 'next' : null;
    // the pager's own words stay in the page: "Previous"/"Next" ride as the card's hidden prefix, the title is the card
    return dir ? { href: b.n.a.href, dir, hidden: p[0], title: p.slice(1).join(' '), seed: 'bench/' + slugOf(b.n.a.href) } : { href: b.n.a.href, title: clean(textOf(b.n)), seed: 'bench/board' };
  }) : near).map((it) => ({ ...it, preview: peek[slugOf(it.href)]?.lede, data: peek[slugOf(it.href)]?.data, meta: peek[slugOf(it.href)]?.figure }));
  const h3 = cta.find((b) => b.t === 'h3');
  const notes = cta.filter((b) => b !== h3 && !linkOf(b));
  const links = cta.filter(linkOf);
  return (
    <>
      <section className="xbr-tail v2f-sec tight">
        <div className="v2f-wrap">
          <FamNext items={cards} label="Benchmarks" className="xbr-next" />
          {pager.some((b) => /^(Previous|Next)/.test(clean(textOf(b.n)))) && <p className="x-sr">{pager.map((b) => clean(textOf(b.n))).join(' · ')}</p>}
          {!!rest.length && <div className="xbr-more"><Blocks blocks={rest} /></div>}
        </div>
      </section>
      {!!cta.length && (
        <FamRoom className="xbr-band" tone="black" data-ask-hide aria-label={h3 ? clean(textOf(h3.n)) : undefined}>
          <div className="v2f-wrap v2f-grid xbr-band-g">
            {h3 && <FamLines as="h2" play="view" className="v2f-display small xbr-band-h" text={clean(textOf(h3.n))} />}
            <div className="xbr-band-r">
              <div className="xbr-band-acts">
                {links.map((b, i) => (i === 0
                  ? <Magnetic key={i}><Cta to={b.n.a.href} id="benchmarks.band" size="lg" className="xbr-band-solid">{clean(textOf(b.n))}</Cta></Magnetic>
                  : <Cta key={i} to={b.n.a.href} kind="link" id="benchmarks.band-2" className="xbr-band-link">{clean(textOf(b.n))}</Cta>))}
              </div>
              {notes.map((b, i) => <p key={i} className="v2f-kick xbr-band-k">{clean(textOf(b.n))}</p>)}
            </div>
          </div>
        </FamRoom>
      )}
    </>
  );
}

/* a section's first words, its picture (its own first table) and the rest, for a chapter */
function splitSection(s) {
  const lead = s.blocks.find((b) => b.t === 'p' || b.t === 'text');
  const table = s.blocks.find((b) => b.t === 'table');
  const rest = s.blocks.filter((b) => b !== lead && b !== table);
  return { lead, table, rest };
}
const firstWords = (bs) => { for (const b of bs) { const t = clean(b.s || textOf(b.n)); if (t) return t; } return ''; };

export default function BenchRun({ doc, near = [], peek = {} }) {
  const walk = useMemo(makeWalk, []);
  const calm = useReducedMotion();
  const c = doc.chart;
  useEffect(() => (calm || !c ? undefined : walk.start(rowsOf(c))), [walk, calm, c]);
  const seedData = (c && c.kind === 'trend' ? c.points.map((p) => p.v) : c && c.kind === 'versus' ? c.rows.map((r) => r.a.v) : c && c.kind === 'bars' ? c.rows.map((r) => r.cells[0].v) : []).filter((v) => v != null).concat(doc.figures.map((f) => parseFloat(String(f).replace(/,/g, '')))).slice(0, 7);
  const facts = doc.intro.find((b) => b.t === 'dl');
  const introCode = doc.intro.find((b) => b.t === 'code');
  const introRest = doc.intro.filter((b) => b !== facts && b !== introCode);
  // short sections (Conditions, Hardware, Source, Reproduce) read as a spec list; long ones become chapters
  const short = (s) => !s.blocks.some((b) => b.t === 'table') && s.blocks.reduce((k, b) => k + clean(textOf(b.n) || b.s).length, 0) < 420;
  const longs = doc.sections.filter((s) => !short(s));
  const specs = doc.sections.filter(short);
  const size = doc.title.length <= 16 ? '' : doc.title.length <= 30 ? ' mid' : ' small';
  const [lead, ...figs] = doc.latest;
  const TONES = ['ink', 'card', 'line'];
  const ask = askOf(doc.tail);

  const pj = partsCol(c);
  const chapter = (s, k) => {
    const { lead: l, table, rest } = splitSection(s);
    // the card already reads this section's table: say its figures once there; the table itself goes in the sheet
    const dup = !!(table && c && c.kind !== 'one' && c.kind !== 'trend' && c.title === s.title);
    const sheet = dup ? s.blocks.filter((b) => b !== l) : rest;
    const heads = dup ? headsOf(table.n).join(' · ') : '';
    return {
      key: s.title,
      name: s.title,
      text: (
        <div className="xbr-ch-t" id={s.id || undefined}>
          <h2 className="v2f-head xbr-ch-h">{s.title}</h2>
          {l && <div className="v2f-body xbr-ch-b"><Block b={l} /></div>}
          {!!sheet.length && <FamDrawer preview={firstWords(rest) || heads} title={s.title}><div className="xbr-sheet-b"><Blocks blocks={sheet} /></div></FamDrawer>}
        </div>
      ),
      visual: dup ? (pj >= 0 ? <Parts c={c} walk={walk} j={pj} /> : <Scale c={c} walk={walk} />)
        : table ? (
          <div className="xbr-ch-v v2f-obj"><Table n={table.n} caption={s.title} /></div>
        ) : (
          // no table in this section: its own contour field (seeded from the section), so each figure is said once, on the card
          <div className={'xbr-ch-v xbr-ch-fig ' + TONES[k % TONES.length]}><Sigil seed={'bench/' + doc.slug + '/' + s.title} data={seedData} className="xbr-ch-sig" /></div>
        ),
    };
  };

  return (
    <main className="v2f xbr">
      {/* stage: the title huge beside its lede and the one ask; the benchmark's own card on the first screen, settling */}
      <section className="xbr-stage" aria-labelledby={'xbr-h1-' + doc.slug}>
        <Sigil seed={'bench/' + doc.slug} data={seedData} className="xbr-sigil" />
        <div className="v2f-wrap v2f-grid xbr-top-g">
          <div className="xbr-head">
            <FamLines as="h1" id={'xbr-h1-' + doc.slug} className={'v2f-display xbr-h1' + size} text={doc.title} settle={false} data-morph-target />
            <div className="xbr-meta">
              {doc.crumb && <p className="xbr-crumb"><Nodes nodes={doc.crumb.c} /></p>}
              {doc.kicker && <p className="xbr-kicker x-mono"><Nodes nodes={doc.kicker.c} /></p>}
            </div>
          </div>
          <div className="xbr-side">
            {doc.lede && <p className="v2f-lede xbr-lede"><Nodes nodes={doc.lede.c} /></p>}
            <div className="xbr-acts">
              <Magnetic><Cta to={ask.href} id="benchmarks.hero" thumb size="lg">{ask.label}</Cta></Magnetic>
            </div>
          </div>
        </div>
        {c && (
          <div className="v2f-wrap xbr-stage-o">
            <FamStage from={1.06} span={520}><Turn c={c} walk={walk} slug={doc.slug} /></FamStage>
          </div>
        )}
        {(introCode || !!introRest.length) && (
          <div className="v2f-wrap v2f-grid xbr-intro">
            {introCode && <div className="xbr-intro-c"><Cmd text={clean(textOf(introCode.n))} /></div>}
            {introRest.map((b, i) => <div key={i} className="xbr-intro-n"><Block b={b} /></div>)}
          </div>
        )}
      </section>

      {facts && (
        <section className="xbr-facts-s" aria-label={clean(textOf(facts.n.c.find((k) => k && k.t === 'dt')))}>
          <div className="v2f-wrap"><Facts n={facts.n} /></div>
        </section>
      )}

      {lead && (
        <section className="xbr-figs v2f-sec" aria-labelledby={'xbr-latest-' + doc.slug}>
          <div className="v2f-wrap v2f-grid">
            <h2 id={'xbr-latest-' + doc.slug} className="v2f-head xbr-figs-h">Latest</h2>
            <a href={lead.href} className="xbr-fig big">
              <FamGrow to={1.75}><b className="v2f-num">{lead.parts[0]}</b></FamGrow>
              <span className="xbr-fig-l">{lead.parts[1]}</span>
              {lead.parts[2] && <span className="xbr-fig-s">{lead.parts[2]}</span>}
            </a>
            {!!figs.length && (
              <ul className={'xbr-figs-r' + (figs.length > 3 ? ' many' : '')}>
                {figs.map((l, i) => (
                  <li key={i}>
                    <a href={l.href} className="xbr-fig">
                      <b className="v2f-num">{l.parts[0]}</b>
                      <span className="xbr-fig-l">{l.parts[1]}</span>
                      {l.parts[2] && <span className="xbr-fig-s">{l.parts[2]}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {longs.length > 1 && <FamChapters label={doc.title} items={longs.map(chapter)} className="xbr-ch" />}
      {longs.length === 1 && (() => {
        const s = longs[0];
        const { lead: l, table, rest } = splitSection(s);
        return (
          <section className="xbr-one-s v2f-sec" id={s.id || undefined} aria-labelledby={'xbr-s-' + doc.slug}>
            <div className="v2f-wrap v2f-grid">
              <div className="xbr-one-l">
                <FamLines as="h2" play="view" id={'xbr-s-' + doc.slug} className="v2f-display small" text={s.title} />
                {l && <div className="v2f-body"><Block b={l} /></div>}
              </div>
              <div className="xbr-one-r">
                {table && <div className="v2f-obj xbr-one-t"><Table n={table.n} caption={s.title} /></div>}
                {!!rest.length && <Blocks blocks={rest} />}
              </div>
            </div>
          </section>
        );
      })()}

      {!!specs.length && (
        <section className="xbr-spec v2f-sec tight" aria-label={specs.map((s) => s.title).join(', ')}>
          <div className="v2f-wrap">
            {specs.map((s) => (
              <div key={s.title} className="xbr-spec-r v2f-grid" id={s.id || undefined}>
                <h2 className="xbr-spec-h">{s.title}</h2>
                <div className="xbr-spec-b"><Blocks blocks={s.blocks} /></div>
              </div>
            ))}
          </div>
        </section>
      )}

      <Source doc={doc} />
      <Tail tail={doc.tail} near={near} peek={peek} />
    </main>
  );
}
