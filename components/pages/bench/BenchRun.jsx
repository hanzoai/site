'use client';
/* One benchmark (/benchmarks/<slug>, 27 pages, one template), read like a model launch (anthropic.com): the benchmark as
   hero figures, the method as chapters, the source one press away.
   Stage: the title at display size over a contour field seeded from the slug and its numbers; the benchmark's own
   card (its table, with a live readout of the row being read) is the hero object, close and big, settling into place
   as you scroll. Paper pages then lay their facts out as a spec line; result pages put their latest figures up huge.
   The long sections of the method are sticky chapters: the words pin on the left while the section's own table (or
   the live readout) wipes in on the right; the rest of each section sits in a sheet you open. Short sections read as
   a tech-spec list; the source is the one dark room; siblings are cards that open into their page.
   Signature: the table turns into its chart. The rows of Hanzo's own table (its History, its comparison or its
   results) lift out of the table and settle into the chart they make: bars to scale, a value against its baseline, or
   Kai's revisions as a line over the dates hanzo.ai plots. Turn it back with one press; a playhead then keeps reading
   the rows, and the card's readout and every chapter's figure follow it.
   Beyond: ask the source. Where the page cites a research run on api.hanzo.ai, one press reads that run live and lays
   its raw record beside the transcribed figures (id, split, questions answered, commit, end time, every measure); where
   the source is a repository, the panel hands you the exact command to run it yourself.
   Motion: signature (layout re-flow; the line wipes in left to right) · stage settle (scroll scale) · kinetic title
   (masked words) · sigil field. Chapters swap on scroll with clip wipes (scene changes, part of the stage scroll).
   V2: 8/10 stage hero with the chart card as the settling hero object, display-size title, live readout, method as sticky chapters with sheets, tech-spec list, open-card siblings, one accent per benchmark */
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { motion, LayoutGroup, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Copy } from '../../ui';
import { A } from '../../kit';
import { Nodes } from '../DocNodes';
import Sigil from '../../Sigil';
import FamLines from '../../v2/FamLines';
import FamStage from '../../v2/FamStage';
import FamChapters from '../../v2/FamChapters';
import FamDrawer from '../../v2/FamDrawer';
import FamNext from '../../v2/FamNext';
import './bench.css';

const SPRING = { type: 'spring', stiffness: 300, damping: 30 };
const textOf = (n) => (n && typeof n === 'object' ? n.c.map(textOf).join('') : n || '');
const clean = (s) => String(s || '').replace(/\s+/g, ' ').trim();

/* the playhead: one index the card and every chapter read; ticks only while the tab is visible */
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
      id = setInterval(() => { if (document.hidden || Date.now() < hold) return; i = (i + 1) % n; emit(); }, 1900);
      return () => clearInterval(id);
    },
  };
}
const useAt = (walk) => useSyncExternalStore(walk.sub, walk.get, () => 0);

/* what the playhead reads at row i: [row, figure, what the figure is] */
function readout(c, i) {
  if (!c) return null;
  if (c.kind === 'trend') { const p = c.points[i % c.points.length]; return [p.who, p.val, p.when]; }
  if (c.kind === 'versus') { const r = c.rows[i % c.rows.length]; return [r.label, r.a.s, c.heads[0]]; }
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

/* the live readout: the row the playhead is on, its figure huge */
function Readout({ c, walk, big }) {
  const at = useAt(walk);
  const r = readout(c, at);
  if (!r) return null;
  const n = rowsOf(c);
  return (
    <div className={'xbr-ro' + (big ? ' big' : '')} aria-hidden="true">
      <span className="xbr-ro-l">{r[0]}</span>
      <span className="xbr-ro-vw">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.b key={at + '|' + r[1]} className={'xbr-ro-v v2f-num' + (r[1].length > 10 ? ' long' : r[1].length > 7 ? ' mid' : '')} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '-100%', transition: { duration: 0.28, ease: EASE } }} transition={{ duration: 0.6, ease: EASE }}>{r[1]}</motion.b>
        </AnimatePresence>
      </span>
      <span className="xbr-ro-s x-mono">{r[2]}</span>
      {n > 1 && <span className="xbr-ro-n x-mono">{String((at % n) + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>}
      {n > 1 && <i className="xbr-ro-t" key={at} />}
    </div>
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
      <span className="xbr-turn-vb" aria-hidden="true" style={{ transform: chart ? 'translateX(100%)' : 'none' }} />
      {[['Table', false], ['Chart', true]].map(([l, v]) => (
        <button key={l} type="button" aria-pressed={chart === v} onClick={() => { turned.current = true; setChart(v); }}><span>{l}</span></button>
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
        <div className="xbr-tr-axes" aria-hidden="true">
          {c.ticks.map((t) => <span key={t} className="xbr-tick" style={{ bottom: Y(parseFloat(t)) + '%' }}>{t}</span>)}
          {c.base && <span className="xbr-base" style={{ bottom: Y(c.base.v) + '%' }}><em>{c.base.s}</em></span>}
          <svg className="xbr-tr-line" viewBox="0 0 100 100" preserveAspectRatio="none"><path d={d} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" /></svg>
        </div>
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
            <li key={i} className={at % c.rows.length === i ? 'lit' : ''} onPointerEnter={(e) => e.pointerType === 'mouse' && pick(i)} onClick={() => pick(i)}>
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
        {c.kind !== 'one' && view}
      </figcaption>
      <div className="xbr-turn-g">
        {c.kind !== 'one' && <Readout c={c} walk={walk} />}
        <LayoutGroup id={id}><div className="xbr-turn-b">{body}</div></LayoutGroup>
      </div>
    </figure>
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
function Source({ doc }) {
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
      <div className="v2f-wrap v2f-grid xbr-src-g">
        <div className="xbr-src-l">
          <h2 id={'xbr-src-' + doc.slug} className="v2f-head xbr-src-h">Source</h2>
          {src ? (
            <>
              <p className="xbr-src-u x-mono"><b>GET</b> <span>{shown}</span></p>
              <div className="xbr-src-acts">
                <button type="button" className="v2f-btn acc xbr-ask" onClick={ask} disabled={st.k === 'load'} aria-describedby={'xbr-src-s-' + doc.slug}>
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
        </div>
        <div className="xbr-src-r">
          <div className="xbr-term">
            <div className="xbr-term-h" aria-hidden="true"><i /><i /><i /><span className="x-mono">{src ? 'api.hanzo.ai' : 'shell'}</span></div>
            <div className="xbr-term-b" data-lenis-prevent>
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
              {st.k === 'idle' && <div className="xbr-src-wait x-mono" aria-hidden="true">{src ? '{ "data": [ … ] }' : '$ ' + (doc.command || '')}<i className="xbr-caret" /></div>}
              {st.k === 'err' && <a className="v2f-btn" href={src.url} target="_blank" rel="noopener noreferrer">JSON</a>}
              {st.k === 'none' && <div className="xbr-src-wait x-mono" aria-hidden="true">{'{ "data": [] }'}</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* the closing parts of a paper page: Build on Hanzo Cloud, previous / next, related, every other benchmark */
function Tail({ tail, near }) {
  const a = (b) => b.t === 'a' && b.n.a && b.n.a.href;
  const pager = tail.filter((b) => (a(b) && /^(Previous|Next)/.test(clean(textOf(b.n)))) || (a(b) && b.n.a.href === '/benchmarks' && /Board/.test(textOf(b.n))));
  const ctaEnd = tail.findIndex((b) => pager.includes(b));
  const cta = tail.length ? tail.slice(0, ctaEnd < 0 ? 3 : ctaEnd) : [];
  const rest = tail.slice((ctaEnd < 0 ? 3 : ctaEnd)).filter((b) => !pager.includes(b));
  const parts = (n) => n.c.filter((k) => k && typeof k === 'object').map((k) => clean(textOf(k)));
  const seedOf = (h) => 'bench/' + h.split('/').filter(Boolean).pop();
  const cards = pager.length ? pager.map((b) => {
    const p = parts(b.n);
    const dir = /^Previous/.test(p[0]) ? 'prev' : /^Next/.test(p[0]) ? 'next' : 'all';
    return dir === 'all' ? { href: b.n.a.href, title: clean(textOf(b.n)), seed: 'bench/board' } : { href: b.n.a.href, kicker: p[0], title: p.slice(1).join(' '), seed: seedOf(b.n.a.href) };
  }) : near;
  return (
    <section className="xbr-tail v2f-sec tight">
      <div className="v2f-wrap">
        {!!cta.length && (
          <div className="xbr-cta v2f-grid">
            {cta.filter((b) => !a(b)).map((b, i) => (b.t === 'p' ? <p key={i} className="v2f-kick acc xbr-cta-k">{clean(textOf(b.n))}</p>
              : b.t === 'h3' ? <FamLines key={i} as="h3" play="view" className="v2f-display small xbr-cta-h" text={clean(textOf(b.n))} />
                : <Block key={i} b={b} />))}
            <div className="xbr-cta-acts">
              {cta.filter(a).map((b, i) => <A key={i} to={b.n.a.href} className={'v2f-btn' + (i === 0 ? ' solid' : '')}>{clean(textOf(b.n))}</A>)}
            </div>
          </div>
        )}
        <FamNext items={cards} label="Benchmarks" className="xbr-next" />
        {!!rest.length && <div className="xbr-more"><Blocks blocks={rest} /></div>}
      </div>
    </section>
  );
}

/* a section's first words, its picture (its own first table) and the rest, for a chapter */
function splitSection(s) {
  const lead = s.blocks.find((b) => b.t === 'p' || b.t === 'text');
  const table = s.blocks.find((b) => b.t === 'table');
  const rest = s.blocks.filter((b) => b !== lead && b !== table);
  return { lead, table, rest };
}

export default function BenchRun({ doc, acc, near = [] }) {
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
  const TONES = ['acc', 'card', 'line'];

  const chapter = (s, k) => {
    const { lead: l, table, rest } = splitSection(s);
    return {
      key: s.title,
      name: s.title,
      text: (
        <div className="xbr-ch-t" id={s.id || undefined}>
          <p className="v2f-kick acc">{String(k + 1).padStart(2, '0')} / {String(longs.length).padStart(2, '0')}</p>
          <h2 className="v2f-head xbr-ch-h">{s.title}</h2>
          {l && <div className="v2f-body xbr-ch-b"><Block b={l} /></div>}
          {!!rest.length && <FamDrawer label="Read the whole section" title={s.title}><div className="xbr-sheet-b"><Blocks blocks={rest} /></div></FamDrawer>}
        </div>
      ),
      visual: table ? (
        <div className="xbr-ch-v v2f-obj"><Table n={table.n} /></div>
      ) : (
        <div className={'xbr-ch-v xbr-ch-fig ' + TONES[k % TONES.length]}>{c ? <Readout c={c} walk={walk} big /> : <p className="xbr-ch-q">{s.title}</p>}</div>
      ),
    };
  };

  return (
    <main className="v2f xbr" style={{ '--acc': acc }}>
      {/* stage: the title huge, the benchmark's own card close and big, settling as you scroll */}
      <section className="xbr-stage" aria-labelledby={'xbr-h1-' + doc.slug}>
        <Sigil seed={'bench/' + doc.slug} data={seedData} className="xbr-sigil" />
        <div className="v2f-wrap">
          <div className="xbr-top">
            {doc.crumb && <p className="xbr-crumb"><Nodes nodes={doc.crumb.c} /></p>}
            {doc.kicker && <p className="xbr-kicker x-mono"><i aria-hidden="true" /><Nodes nodes={doc.kicker.c} /></p>}
          </div>
          <FamLines as="h1" id={'xbr-h1-' + doc.slug} className={'v2f-display xbr-h1' + size} text={doc.title} data-morph-target />
          <div className="v2f-grid xbr-intro">
            {doc.lede && <p className="v2f-lede xbr-lede"><Nodes nodes={doc.lede.c} /></p>}
            {(introCode || !!introRest.length) && (
              <div className="xbr-intro-r">
                {introCode && <Cmd text={clean(textOf(introCode.n))} />}
                {introRest.map((b, i) => <div key={i} className="xbr-intro-n"><Block b={b} /></div>)}
              </div>
            )}
          </div>
        </div>
        {c && (
          <div className="v2f-wrap xbr-stage-o">
            <FamStage from={1.1} span={560}><Turn c={c} walk={walk} slug={doc.slug} /></FamStage>
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
            <h2 id={'xbr-latest-' + doc.slug} className="v2f-kick acc xbr-figs-k">Latest</h2>
            <a href={lead.href} className="xbr-fig big">
              <b className="v2f-num">{lead.parts[0]}</b>
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
                {c && <div className="xbr-one-ro"><Readout c={c} walk={walk} /></div>}
              </div>
              <div className="xbr-one-r">
                {table && <div className="v2f-obj xbr-one-t"><Table n={table.n} /></div>}
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
      <Tail tail={doc.tail} near={near} />
    </main>
  );
}
