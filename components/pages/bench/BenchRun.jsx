'use client';
/* One benchmark (/benchmarks/<slug>, 27 pages, one template): a lab sheet. The title runs the full width like a paper's;
   under it the benchmark's own numbers sit in a card as the table Hanzo prints, over a contour field seeded from the
   slug and those numbers. Every section of the method keeps a reading rail beside it, so the results stay in view
   while you read how they were measured.
   Signature: the table turns into its chart. The rows of Hanzo's own table (its History, its comparison or its
   results) lift out of the table and settle into the chart they make: bars to scale, a value against its baseline, or
   Kai's revisions as a line over the dates hanzo.ai plots. Turn it back with one press; a playhead then keeps reading
   the rows, in the card and in every rail down the page.
   Beyond: ask the source. Where the page cites a research run on api.hanzo.ai, one press reads that run live and lays
   its raw record beside the transcribed figures (id, split, questions answered, commit, end time, every measure); where
   the source is a repository, the panel hands you the exact command to run it yourself. */
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { motion, LayoutGroup, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Copy } from '../../ui';
import { A } from '../../kit';
import { Nodes } from '../DocNodes';
import Sigil from '../../Sigil';
import './bench.css';

const up = (d) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
const SPRING = { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 };
const textOf = (n) => (n && typeof n === 'object' ? n.c.map(textOf).join('') : n || '');
const clean = (s) => String(s || '').replace(/\s+/g, ' ').trim();

/* the playhead: one index the card and every rail read; ticks only while the tab is visible */
function makeWalk() {
  let i = 0, n = 1, id = 0, hold = 0;
  const subs = new Set();
  const emit = () => subs.forEach((f) => f());
  return {
    get: () => i,
    sub: (f) => { subs.add(f); return () => subs.delete(f); },
    set: (k, pause = 0) => { i = k; if (pause) hold = Date.now() + pause; emit(); },
    start: (count) => {
      n = Math.max(1, count);
      clearInterval(id);
      id = setInterval(() => { if (document.hidden || Date.now() < hold) return; i = (i + 1) % n; emit(); }, 1700);
      return () => clearInterval(id);
    },
  };
}
const useAt = (walk) => useSyncExternalStore(walk.sub, walk.get, () => 0);

/* what the playhead reads at row i */
function readout(c, i) {
  if (!c) return null;
  if (c.kind === 'trend') { const p = c.points[i % c.points.length]; return [p.who, p.val, p.when]; }
  if (c.kind === 'versus') { const r = c.rows[i % c.rows.length]; return [r.label, r.a.s, r.b.s]; }
  if (c.kind === 'bars') { const r = c.rows[i % c.rows.length]; return [r.label, r.cells[0].s, c.cols[0].name]; }
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

/* ---------- the signature: the table that turns into its chart ---------- */
function Turn({ c, walk, slug }) {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  const [chart, setChart] = useState(false);
  const [col, setCol] = useState(0);
  const turned = useRef(false);
  const at = useAt(walk);
  useEffect(() => {
    if (calm) { setChart(true); return; }
    if (!seen || turned.current) return;
    const t = setTimeout(() => { turned.current = true; setChart(true); }, 1100);
    return () => clearTimeout(t);
  }, [seen, calm]);
  const id = 'xbr-turn-' + slug;
  const view = (
    <div className="xbr-turn-v" role="group" aria-label="View">
      {[['Table', false], ['Chart', true]].map(([l, v]) => (
        <button key={l} type="button" aria-pressed={chart === v} onClick={() => { turned.current = true; setChart(v); }}>
          {chart === v && <motion.span layoutId={'xbr-v-' + slug} className="xbr-turn-vb" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
          <span>{l}</span>
        </button>
      ))}
    </div>
  );
  const pick = (i) => walk.set(i, 8000);

  let body = null;
  if (c.kind === 'trend') {
    const n = c.points.length, span = c.hi - c.lo || 1;
    const X = (i) => (n > 1 ? (i / (n - 1)) * 100 : 50), Y = (v) => ((v - c.lo) / span) * 100;
    const d = c.points.map((p, i) => (i ? 'L' : 'M') + X(i).toFixed(2) + ' ' + (100 - Y(p.v)).toFixed(2)).join(' ');
    body = (
      <div className={'xbr-tr' + (chart ? ' chart' : '')}>
        {(
          <div className="xbr-tr-axes" aria-hidden="true">
            {c.ticks.map((t) => <span key={t} className="xbr-tick" style={{ bottom: Y(parseFloat(t)) + '%' }}>{t}</span>)}
            {c.base && <span className="xbr-base" style={{ bottom: Y(c.base.v) + '%' }}><em>{c.base.s}</em></span>}
            <svg className="xbr-tr-line" viewBox="0 0 100 100" preserveAspectRatio="none"><motion.path d={d} fill="none" stroke="currentColor" strokeWidth="1.6" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: chart ? 1 : 0 }} transition={{ duration: calm ? 0 : 1.2, ease: EASE, delay: calm || !chart ? 0 : 0.35 }} /></svg>
          </div>
        )}
        <ol className="xbr-tr-pts">
          {c.points.map((p, i) => (
            <motion.li key={p.s} layout={!calm} transition={SPRING} className={at % n === i ? 'lit' : ''} style={chart ? { left: X(i) + '%', bottom: Y(p.v) + '%' } : undefined}>
              <button type="button" aria-label={p.s} onClick={() => pick(i)} onPointerEnter={(e) => e.pointerType === 'mouse' && pick(i)}>
                <motion.span layout={calm ? false : 'position'} transition={SPRING} className="xbr-tr-who">{p.who}</motion.span>
                <motion.span layout={calm ? false : 'position'} transition={SPRING} className="xbr-tr-val x-mono">{p.val}</motion.span>
                <motion.span layout={calm ? false : 'position'} transition={SPRING} className="xbr-tr-when">{p.when}</motion.span>
                <i className="xbr-dot" aria-hidden="true" />
              </button>
            </motion.li>
          ))}
        </ol>
        {<div className="xbr-tr-dates x-mono" aria-hidden="true">{c.dates.map((t) => <span key={t}>{t}</span>)}</div>}
      </div>
    );
  } else if (c.kind === 'versus') {
    const s = c.rows.map((r) => Math.max(r.a.v, r.b.v) || 1);
    body = (
      <div className={'xbr-bars vs' + (chart ? ' chart' : '')}>
        <div className="xbr-bars-h x-mono"><span>{c.heads[0]}</span><span>{c.heads[1]}</span></div>
        <ul>
          {c.rows.map((r, i) => (
            <li key={i} className={at % c.rows.length === i ? 'lit' : ''} onPointerEnter={(e) => e.pointerType === 'mouse' && pick(i)} onClick={() => pick(i)}>
              <span className="xbr-bl">{r.label}</span>
              <i className="xbr-bar ba" style={{ '--w': Math.max(0.004, r.a.v / s[i]) }} /><b className="xbr-v va x-mono">{r.a.s}</b>
              <i className="xbr-bar bb" style={{ '--w': Math.max(0.004, r.b.v / s[i]) }} /><b className="xbr-v vb x-mono">{r.b.s}</b>
            </li>
          ))}
        </ul>
      </div>
    );
  } else if (c.kind === 'bars') {
    const vals = c.rows.map((r) => r.cells[col].v);
    const w = scaler(vals);
    body = (
      <div className={'xbr-bars' + (chart ? ' chart' : '')}>
        {c.cols.length > 1 && (
          <div className="xbr-cols" role="group" aria-label={c.head0}>
            {c.cols.map((k, j) => <button key={k.name} type="button" aria-pressed={col === j} onClick={() => { setCol(j); turned.current = true; setChart(true); }}>{k.name}</button>)}
          </div>
        )}
        <div className="xbr-bars-h x-mono"><span>{c.head0}</span><span>{c.cols[col].name}{chart && isLog(vals) ? ' · log' : ''}</span></div>
        <ul>
          {c.rows.map((r, i) => (
            <li key={i} className={(at % c.rows.length === i ? 'lit' : '') + (r.cells[col].v == null ? ' none' : '')} onPointerEnter={(e) => e.pointerType === 'mouse' && pick(i)} onClick={() => pick(i)}>
              <span className="xbr-bl">{r.label}</span>
              <i className="xbr-bar ba" style={{ '--w': Math.max(0.004, w(r.cells[col].v)) }} />
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
        <b className="xbr-one-v">{c.s}</b>
        <span className="xbr-one-h x-mono">{c.head}</span>
      </div>
    );
  }
  return (
    <motion.figure ref={box} id={id} className="xbr-turn" {...up(0.2)}>
      <figcaption className="xbr-turn-h">
        <span className="x-mono">{c.metric || c.title}</span>
        {c.kind !== 'one' && view}
      </figcaption>
      <LayoutGroup id={id}>{body}</LayoutGroup>
    </motion.figure>
  );
}

/* the rail beside each section: the playhead's current row, still reading */
function Rail({ c, walk }) {
  const at = useAt(walk);
  const r = readout(c, at);
  if (!r) return null;
  return (
    <div className="xbr-rail" aria-hidden="true">
      <span className="xbr-rail-l">{r[0]}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.b key={at + r[1]} className="xbr-rail-v x-mono" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }} transition={{ duration: 0.4, ease: EASE }}>{r[1]}</motion.b>
      </AnimatePresence>
      <i className="xbr-rail-t" />
    </div>
  );
}

/* a captured table, drawn in the new design; every cell stays, wide ones scroll inside their own frame */
function Table({ n }) {
  const head = (n.c.find((k) => k.t === 'thead') || { c: [] });
  const label = clean(textOf(head));
  return (
    <div className="xbr-tw" tabIndex={0} role="region" aria-label={label || 'Table'} data-lenis-prevent data-swipe-own>
      <table><Nodes nodes={n.c} /></table>
    </div>
  );
}

function Cmd({ text }) {
  return (
    <div className="xbr-cmd">
      <pre className="x-mono"><span aria-hidden="true">$ </span>{text}</pre>
      <Copy text={text} />
    </div>
  );
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
  blocks.forEach((b, i) => {
    if (b.t === 'span' && out.length && Array.isArray(out[out.length - 1])) out[out.length - 1].push(b);
    else out.push(b.t === 'span' ? [b] : b);
  });
  return out.map((b, i) => (Array.isArray(b)
    ? <ul key={i} className="xbr-chips">{b.map((x, k) => <li key={k}><Block b={x} /></li>)}</ul>
    : <Block key={i} b={b} />));
}

/* the intro's facts sheet: dataset, licence, introduced by, harness, our papers */
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
function Source({ doc, rail }) {
  const src = doc.source;
  const [st, setSt] = useState({ k: 'idle' });
  const ask = async () => {
    setSt({ k: 'load' });
    try {
      const r = await fetch(src.url, { headers: { accept: 'application/json' } });
      if (!r.ok) throw new Error(String(r.status));
      const j = await r.json();
      const all = Array.isArray(j.data) ? j.data : [];
      // a benchmark-wide query answers with every run; keep the runs this page links, in its order
      const want = src.ids.length > 1 ? src.ids : null;
      const runs = want ? want.map((id) => all.find((x) => x.id === id)).filter(Boolean) : all.slice(0, 6);
      setSt(runs.length ? { k: 'ok', runs } : { k: 'none' });
    } catch (e) {
      setSt({ k: 'err', e: String(e.message || e) });
    }
  };
  const shown = src ? src.url.replace(/^https:\/\//, '') : '';
  return (
    <section className="xbr-src" data-room="dark" aria-labelledby={'xbr-src-' + doc.slug}>
      <div className="x-wrap xbr-src-g">
        <div className="xbr-src-l">
          <h2 id={'xbr-src-' + doc.slug} className="xbr-src-h">Source</h2>
          {src ? (
            <>
              <p className="xbr-src-u x-mono"><b>GET</b> <span>{shown}</span></p>
              <div className="xbr-src-acts">
                <button type="button" className="x-btn solid xbr-ask" onClick={ask} disabled={st.k === 'load'} aria-describedby={'xbr-src-s-' + doc.slug}>
                  <i className={'xbr-ask-d' + (st.k === 'load' ? ' on' : '')} aria-hidden="true" />{st.k === 'ok' ? 'Read it again' : 'Read the run'}
                </button>
                <a className="x-arrow xbr-raw" href={src.url} target="_blank" rel="noopener noreferrer"><span>JSON</span></a>
              </div>
            </>
          ) : (
            doc.command && <Cmd text={doc.command} />
          )}
          <p id={'xbr-src-s-' + doc.slug} className="xbr-src-s" aria-live="polite">
            {st.k === 'load' ? 'Reading api.hanzo.ai…' : st.k === 'err' ? 'Could not read it (' + st.e + ').' : st.k === 'none' ? 'No runs came back.' : st.k === 'ok' ? st.runs.length + ' / ' + st.runs.length : ''}
          </p>
          {rail}
        </div>
        <div className="xbr-src-r">
          {st.k === 'load' && <div className="xbr-skel" aria-hidden="true">{[0, 1, 2].map((i) => <i key={i} style={{ '--k': i }} />)}</div>}
          {st.k === 'ok' && (
            <ol className="xbr-runs">
              {st.runs.map((r, i) => (
                <motion.li key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE, delay: i * 0.05 }}>
                  <p className="xbr-run-id x-mono">{r.id}</p>
                  <dl className="xbr-run-k x-mono">
                    {[['split', r.split], ['system', r.system], ['questions', r.questions != null ? r.answered + ' / ' + r.questions : ''], ['commit', (r.commit || '').slice(0, 10)], ['ended', ISO(r.ended)], ['completion', r.completion]].filter((x) => x[1]).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
                  </dl>
                  <ul className="xbr-run-m x-mono">
                    {(r.measures || []).filter((m) => m.category === 'all' || !m.category).slice(0, 8).map((m, k) => <li key={k}><span>{m.metric}</span><b>{m.value}</b></li>)}
                  </ul>
                </motion.li>
              ))}
            </ol>
          )}
          {st.k === 'idle' && src && <div className="xbr-src-wait" aria-hidden="true"><span className="x-mono">{'{ "data": [ … ] }'}</span></div>}
          {st.k === 'err' && <a className="x-btn" href={src.url} target="_blank" rel="noopener noreferrer">JSON</a>}
          
        </div>
      </div>
    </section>
  );
}

/* the closing parts of a paper page: Build on Hanzo Cloud, previous / next, related, every other benchmark */
function Tail({ tail, rail }) {
  if (!tail.length) return null;
  const a = (b) => b.t === 'a' && b.n.a && b.n.a.href;
  const pager = tail.filter((b) => a(b) && /^(Previous|Next)/.test(clean(textOf(b.n))) || (a(b) && b.n.a.href === '/benchmarks' && /Board/.test(textOf(b.n))));
  const ctaEnd = tail.findIndex((b) => pager.includes(b));
  const cta = tail.slice(0, ctaEnd < 0 ? 3 : ctaEnd);
  const rest = tail.slice((ctaEnd < 0 ? 3 : ctaEnd)).filter((b) => !pager.includes(b));
  const parts = (n) => n.c.filter((k) => k && typeof k === 'object').map((k) => clean(textOf(k)));
  return (
    <section className="xbr-tail">
      <div className="x-wrap">
        <nav className="xbr-pager" aria-label="Benchmarks">
          {pager.map((b, i) => {
            const p = parts(b.n);
            const dir = /^Previous/.test(p[0]) ? 'prev' : /^Next/.test(p[0]) ? 'next' : 'all';
            return (
              <A key={i} to={b.n.a.href} className={'xbr-pg ' + dir} data-morph={dir !== 'all' ? '' : undefined}>
                {dir === 'all' ? <span className="xbr-pg-t">{clean(textOf(b.n))}</span> : <><span className="xbr-pg-k x-mono">{p[0]}</span><span className="xbr-pg-t">{p.slice(1).join(' ')}</span></>}
                <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </A>
            );
          })}
        </nav>
        <div className="xbr-tail-g">
          <div className="xbr-cta">
            {cta.map((b, i) => (b.t === 'p' ? <p key={i} className="xbr-kick x-mono">{clean(textOf(b.n))}</p>
              : b.t === 'h3' ? <h3 key={i} className="xbr-cta-h">{clean(textOf(b.n))}</h3>
                : a(b) ? <A key={i} to={b.n.a.href} className={'x-btn' + (i === 2 ? ' solid' : '')}>{clean(textOf(b.n))}</A> : <Block key={i} b={b} />))}
          </div>
          <div className="xbr-more">{rail}<Blocks blocks={rest} /></div>
        </div>
      </div>
    </section>
  );
}

export default function BenchRun({ doc }) {
  const walk = useMemo(makeWalk, []);
  const calm = useReducedMotion();
  const c = doc.chart;
  useEffect(() => (calm || !c ? undefined : walk.start(rowsOf(c))), [walk, calm, c]);
  const seedData = (c && c.kind === 'trend' ? c.points.map((p) => p.v) : c && c.kind === 'versus' ? c.rows.map((r) => r.a.v) : c && c.kind === 'bars' ? c.rows.map((r) => r.cells[0].v) : []).filter((v) => v != null).concat(doc.figures.map((f) => parseFloat(String(f).replace(/,/g, '')))).slice(0, 7);
  const facts = doc.intro.find((b) => b.t === 'dl');
  const introCode = doc.intro.find((b) => b.t === 'code');
  const introRest = doc.intro.filter((b) => b !== facts && b !== introCode);
  // short sections (Conditions, Hardware, Source, Reproduce) sit side by side as one sheet; long ones get a rail
  const short = (s) => !s.blocks.some((b) => b.t === 'table') && s.blocks.reduce((k, b) => k + clean(textOf(b.n) || b.s).length, 0) < 420;
  const runs = [];
  doc.sections.forEach((s) => { const last = runs[runs.length - 1]; if (short(s) && last && last.sheet) last.items.push(s); else runs.push(short(s) ? { sheet: true, items: [s] } : { sheet: false, items: [s] }); });
  return (
    <main className="xbr">
      <section className="xbr-hero" aria-labelledby={'xbr-h1-' + doc.slug}>
        <Sigil seed={'bench/' + doc.slug} data={seedData} className="xbr-sigil" />
        <div className="x-wrap">
          <motion.div className="xbr-top" {...up(0)}>
            {doc.crumb && <p className="xbr-crumb"><Nodes nodes={doc.crumb.c} /></p>}
            {doc.kicker && <p className="xbr-kicker x-mono"><i aria-hidden="true" /><Nodes nodes={doc.kicker.c} /></p>}
          </motion.div>
          <motion.h1 id={'xbr-h1-' + doc.slug} className="xbr-h1" data-morph-target {...up(0.08)}>{doc.title}</motion.h1>
          <div className={'xbr-hero-g' + (c ? '' : ' solo')}>
            <div className="xbr-hero-l">
              {doc.lede && <motion.p className="xbr-lede" {...up(0.16)}><Nodes nodes={doc.lede.c} /></motion.p>}
              {introCode && <motion.div {...up(0.24)}><Cmd text={clean(textOf(introCode.n))} /></motion.div>}
              {introRest.map((b, i) => <motion.div key={i} className="xbr-intro-n" {...up(0.3)}><Block b={b} /></motion.div>)}
            </div>
            {c && <Turn c={c} walk={walk} slug={doc.slug} />}
          </div>
        </div>
      </section>

      {facts && (
        <section className="xbr-sheet0" aria-label={clean(textOf(facts.n.c.find((k) => k && k.t === 'dt')))}>
          <div className="x-wrap"><Facts n={facts.n} /></div>
        </section>
      )}

      {!!doc.latest.length && (
        <section className="xbr-latest" aria-labelledby={'xbr-latest-' + doc.slug}>
          <div className="x-wrap">
            <h2 id={'xbr-latest-' + doc.slug} className="xbr-kick x-mono">Latest</h2>
            <ul className={'xbr-lt' + (doc.latest.length > 4 ? ' many' : '')} data-swipe-own>
              {doc.latest.map((l, i) => (
                <motion.li key={i} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7, ease: EASE, delay: (i % 4) * 0.06 }}>
                  <a href={l.href} className="xbr-lt-c">
                    <b className="xbr-lt-v">{l.parts[0]}</b>
                    <span className="xbr-lt-l">{l.parts[1]}</span>
                    {l.parts[2] && <span className="xbr-lt-s">{l.parts[2]}</span>}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {runs.map((g, gi) => (g.sheet ? (
        <section key={gi} className="xbr-sheet">
          {c && <div className="x-wrap xbr-sheet-rail"><Rail c={c} walk={walk} /></div>}
          <div className="x-wrap xbr-sheet-g">
            {g.items.map((s) => (
              <div key={s.title} className="xbr-sheet-c" id={s.id || undefined}>
                <h2 className="xbr-h2s">{s.title}</h2>
                <Blocks blocks={s.blocks} />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section key={gi} className="xbr-sec" id={g.items[0].id || undefined} aria-labelledby={'xbr-s-' + doc.slug + '-' + gi}>
          <div className="x-wrap xbr-sec-g">
            <div className="xbr-sec-l">
              <h2 id={'xbr-s-' + doc.slug + '-' + gi} className="xbr-h2">{g.items[0].title}</h2>
              {c && <Rail c={c} walk={walk} />}
            </div>
            <div className="xbr-sec-r"><Blocks blocks={g.items[0].blocks} /></div>
          </div>
        </section>
      )))}

      <Source doc={doc} rail={c && <Rail c={c} walk={walk} />} />
      <Tail tail={doc.tail} rail={c && <Rail c={c} walk={walk} />} />
    </main>
  );
}
