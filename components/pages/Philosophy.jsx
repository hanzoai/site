'use client';
// Persona: a builder, founder or researcher deciding whether to trust Hanzo's stack, who wants to know how Hanzo thinks (arrives from About, Research, the footer or a shared link)
// Goal: understand how Hanzo reads the 64 patterns, then find the one that fits their problem and see how it applies to AI research, an experiment and an organization
// CTA: Explore the patterns -> #explore (hero, data-cta="philosophy.hero", data-thumb) · closing link: Explore Hanzo Science -> /science (data-cta="philosophy.close")
// Metric: cta_click on philosophy.close (Story: the page's own closing link), with philosophy.hero as the lead indicator
// Signature: one hexagram walking the sixty-four in the hero; press any line and it flips, becoming the pattern that change makes (its number, name, principle and perspective read from Hanzo's own sixty-four).
/* Philosophy: the Zen of Hanzo, as hanzo.ai/philosophy now publishes it (re-read from live, 9 Nov): an introduction, the 64
   patterns to explore (filter by the eight categories, pick any number, read its three applications), the eight
   categories in King Wen order, and the close. Every word is Hanzo's (philosophy/patterns.js is their data, verbatim).
   One idea per screen, one big thing each: the hero hexagram (huge, centred, its name and principle either side, the
   lines that changed marked with a dot, any line you press flips) over the 52px headline; the introduction as a moment;
   the explorer (an 8 x 8 index of numbers beside the chosen pattern, its hexagram large); the eight categories as quiet
   ledgers whose every pattern opens in a sheet; the close in the one dark room, 1 → 2 → 8 → 64.
   Motion: idle, the hero walk (with its pause control); pointer, lines part their strokes under the pointer, index cells
   and rows fill; state, the filter pill glides (300 ms), the sheet rises; arrival, the h1 cut-in and the hexagram's draw
   on CSS from first paint. Deck timings only: 150 ms hover, 300 ms state, 800 ms line art; no springs, no overshoot.
   Ink only: hierarchy is alpha steps of black and white.
   V2: 8/10 slice D, 9 Nov: rebuilt on Hanzo's new philosophy copy (live re-read): the explorer, the eight categories and the close; the hero walk now reads Hanzo's 64.
   Entrances (MOTION-MAP, philosophy/enter.js + enter.css, in order): venetian-type (the introduction), fold-out (the
   explorer), invert-flash (the explorer's chosen pattern, after the fold), side-carousel (each category's rows), typewriter (the close's
   statement); each plays once, none scroll-linked. Every entrance moves boxes only: the text in the page is always whole. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { A, More } from '../kit';
import SceneWipe from './proof/SceneWipe';
import NoJs from '../NoJs';
import '../v2/ProofScale.css';
import '../v2/ProofRhythm.css';
import '../v2/DetailSheet.css';
import { GROUPS, PATTERNS, CHAPTERS, PATH, word, hebrew, chapterOf, hebrewLocale } from './philosophy/patterns';
import './Philosophy.css';
import { useEnter } from './philosophy/enter';
import './philosophy/enter.css';

const pad = (n) => String(n).padStart(2, '0');
const title = (p) => `${p[3]} — ${p[4]}`; // "The Creative — Origination", as Hanzo prints it
const groupOf = (p) => GROUPS[p[2] - 1];
const hexOf = (ls) => PATTERNS.findIndex((p) => p[1].every((v, k) => v === ls[k]));
const APPS = ['AI research', 'Scientific experimentation', 'Organizational improvement'];
const TABS = ['All', ...GROUPS.map((g) => g[1])];
const HE_TABS = ['הכל', ...CHAPTERS.map((c) => c.hebrew)];

/* Six lines, bottom to top. A whole line is one stroke; an open line parts in the middle (each half scales, transform only).
   press(i): the lines become buttons that change themselves. */
function Hexa({ ls, size = 80, drawn = 6, press, className = '' }) {
  return (
    <span className={'xph-hx ' + className} style={{ '--w': size + 'px' }} aria-hidden={press ? undefined : true} role={press ? 'group' : undefined} aria-label={press ? 'The hexagram, line by line' : undefined}>
      {ls.map((y, i) => {
        const cls = 'xph-hl ' + (y ? 'yang' : 'yin') + (i < drawn ? '' : ' off');
        return press
          ? <button key={i} type="button" className={cls} onClick={() => press(i)} aria-label={`Line ${i + 1}, ${y ? 'whole' : 'open'}: change it`}><i /><i /></button>
          : <span key={i} className={cls}><i /><i /></span>;
      })}
    </span>
  );
}

/* ---------- hero: one hexagram walking the sixty-four; press a line to change it ---------- */
function Hero({ he }) {
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(0); // the time of the visitor's last change: the walk waits for them
  const [steps, setSteps] = useState(0);
  const calm = useReducedMotion();
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.3 });
  useEffect(() => {
    if (calm || !live) return;
    const t = setTimeout(() => {
      if (Date.now() - held < 7000) { setHeld((h) => h - 1); return; }
      setI((v) => {
        if (he) {
          const curN = PATTERNS[v][0];
          const pathIdx = PATH.indexOf(curN);
          const nextN = PATH[(pathIdx + 1) % 64];
          return nextN - 1;
        }
        return (v + 1) % 64;
      });
      setSteps((s) => s + 1);
    }, steps ? 1800 : 900);
    return () => clearTimeout(t);
  }, [i, calm, live, held, steps, he]);
  useEffect(() => {
    if (he) setI(PATH[0] - 1);
  }, [he]);
  const press = (k) => {
    const ls = PATTERNS[i][1].map((x, j) => (j === k ? 1 - x : x));
    setI(hexOf(ls));
    setHeld(Date.now());
  };
  const p = PATTERNS[i];
  const ch = he ? chapterOf(p[0]) : undefined;
  const w = he ? word(p[0]) : undefined;
  return (
    <section className="xph-hero" ref={ref} aria-labelledby="xph-h1">
      <div className="pf-wrap xph-hero-g">
        <div className="xph-stage">
          <div className="xph-flank l" aria-live={Date.now() - held < 7000 ? 'polite' : 'off'}>
            <span className="pf-mono xph-oracle-n">{pad(p[0])} / 64{ch ? ` · ${ch.group}` : ''}</span>
            <b dir={he ? 'rtl' : undefined}>{he ? hebrew(p[0]) : p[3]}</b>
          </div>
          <Hexa ls={p[1]} size={220} press={press} className="xph-oracle-hx" />
          <div className="xph-flank r">
            <span>{he ? (w ? `${w.word} · ${w.meaning} (${p[3]})` : `${p[4]} · ${p[5]}`) : `${p[4]} · ${p[5]}`}</span>
          </div>
        </div>
        {/* the h1 cuts in on CSS from first paint, so arrival never waits for hydration (same mask and easing as MaskLines) */}
        <h1 id="xph-h1" className="pf-display xph-h1"><span className="pf-mask-l"><span className="pf-mask-in xph-cut">The Zen</span> </span><span className="pf-mask-l"><span className="pf-mask-in xph-cut" style={{ '--d': '60ms' }}>of Hanzo</span></span></h1>
        <div className="pf-grid xph-hero-foot">
          <div className="xph-hero-a">
            <p className="pf-mono xph-cap">Hanzo / Philosophy</p>
            <p className="xph-sub">64 patterns for exploration, progress, and continuous improvement.</p>
          </div>
          <p className="pf-body xph-lede">The I Ching describes change through 64 hexagrams—patterns of emergence, discovery, resistance, cooperation, transformation, and renewal.</p>
          <div className="xph-acts">
            <a href="#explore" className="pf-btn solid" data-thumb="Explore the patterns" data-cta="philosophy.hero">Explore the patterns</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- the introduction: Hanzo's reading, then the one sentence as a moment ---------- */
function Intro() {
  return (
    <section className="pf-sec xph-intro">
      <div className="pf-wrap">
        <div className="pf-grid xph-intro-g">
          <p className="pf-lede xph-intro-a">At Hanzo, we use these patterns as inspiration for building intelligent systems and advancing research.</p>
          <p className="pf-body xph-intro-b">Science progresses by asking questions, challenging assumptions, testing ideas, learning from failure, and discovering what becomes possible next.</p>
        </div>
        <p className="pf-moment xph-big" data-enter="ven"><span className="xph-ven-l">Intelligence grows through that same process.</span></p>
        <p className="pf-lede xph-intro-c">Eight categories. Sixty-four perspectives. Infinite possibilities for discovery.</p>
      </div>
    </section>
  );
}

/* ---------- one pattern, read three ways (the explorer's panel and the sheet) ---------- */
function Detail({ p, as: H = 'h3', size = 80, he = false }) {
  const g = groupOf(p);
  const ch = chapterOf(p[0]);
  const w = word(p[0]);
  return (
    <article className="xph-det">
      <div className="xph-det-h">
        <Hexa ls={p[1]} size={size} />
        <div>
          <p className={'xph-det-tri' + (he ? ' is-he' : '')}>
            {he ? <><bdi>{ch.hebrew}</bdi> · <bdi>{ch.group}</bdi>{w ? <> · <bdi>{w.word}</bdi></> : null}</> : g[1]}
          </p>
          <H className="xph-det-t"><bdi>{he ? hebrew(p[0]) : title(p)}</bdi></H>
          <p className="xph-det-s">
            {he ? (w ? <><bdi>{w.word}</bdi> · &ldquo;{w.meaning}&rdquo; · {w.gloss} ({title(p)})</> : `${title(p)} · ${p[5]}`) : p[5]}
          </p>
        </div>
      </div>
      <p className="xph-det-sum">{p[6]}</p>
      <dl className="xph-det-l">
        {APPS.map((a, k) => <div key={a}><dt>{a}</dt><dd>{p[7 + k]}</dd></div>)}
      </dl>
    </article>
  );
}

/* ---------- explore the patterns: filter by category, pick a number, read its applications ---------- */
function Explorer({ tab, setTab, at, setAt, he, toggleHe }) {
  const tabs = he ? HE_TABS : TABS;
  // on a phone the panel sits under the index: a pick brings it into view
  const pick = (i) => {
    setAt(i);
    if (matchMedia('(max-width: 900px)').matches) document.getElementById('xph-ex-d')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };
  const keys = (e) => {
    const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!k) return;
    const n = (tab + k + tabs.length) % tabs.length;
    setTab(n);
    document.getElementById('xph-tab-' + n)?.focus();
  };
  const rows = he
    ? CHAPTERS.map((c) => ({
        key: c.hebrew,
        sub: c.group,
        patterns: c.members.map((n) => PATTERNS[n - 1]),
      }))
    : GROUPS.map((g) => ({
        key: g[0],
        sub: '',
        patterns: PATTERNS.slice(g[2] - 1, g[3]),
      }));
  return (
    <section className="pf-sec xph-pat" id="explore" aria-label="Explore the patterns">
      <div className="pf-wrap">
        <p className="pf-body xph-note">
          {he
            ? 'In the Ana BeKoach order (סדר אנא בכח), the 64 patterns walk the 42-word prayer across the seven Sefirot (Chesed to Malchut — six letter-aligned words and two companions per gate) and an eighth gate of Continuation.'
            : 'These are modern Hanzo interpretations inspired by the I Ching, not claims about the text’s historical or scientific meaning. The eight categories are Hanzo’s own editorial grouping of the hexagrams in King Wen order.'}
        </p>
        <div className="xph-bar">
          <div className="xph-views xph-tabs" role="tablist" aria-label={he ? 'אנא בכח' : 'Categories'} onKeyDown={keys}>
            {tabs.map((t, n) => (
              <button key={t} type="button" role="tab" id={'xph-tab-' + n} aria-selected={tab === n} tabIndex={tab === n ? 0 : -1} aria-controls="xph-ex xph-cats" onClick={() => setTab(n)}>
                {tab === n && <motion.span layoutId="xph-view-pill" className="xph-view-bg" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />}
                <span dir={he && n > 0 ? 'rtl' : undefined}>{t}</span>
              </button>
            ))}
          </div>
          <div className="xph-order-switch" role="group" aria-label="Reading order">
            <button type="button" className={'xph-order-btn' + (!he ? ' on' : '')} aria-pressed={!he} onClick={() => toggleHe(false)}>
              King Wen
            </button>
            <button type="button" className={'xph-order-btn' + (he ? ' on' : '')} aria-pressed={he} onClick={() => toggleHe(true)} dir="rtl" lang="he">
              אנא בכח
            </button>
          </div>
        </div>
        <div className="xph-fold" data-enter="fold">
        <div className="xph-ex" id="xph-ex" role="tabpanel" aria-labelledby={'xph-tab-' + tab}>
          <div className={'xph-idx' + (he ? ' is-he' : '')} role="group" aria-label="The 64 patterns">
            {rows.map((row, r) => (
              <div key={row.key} className={'xph-idx-r' + (tab && tab !== r + 1 ? ' dim' : '')}>
                <span className="pf-mono xph-idx-k" dir={he ? 'rtl' : undefined} title={row.sub || undefined}>{row.key}</span>
                {row.patterns.map((p) => {
                  const w = he ? word(p[0]) : undefined;
                  return (
                    <button key={p[0]} type="button" className={'xph-idx-c' + (at === p[0] - 1 ? ' on' : '')} aria-pressed={at === p[0] - 1} aria-label={pad(p[0]) + ' ' + (he ? hebrew(p[0]) : title(p))} onClick={() => pick(p[0] - 1)}>
                      <Hexa ls={p[1]} size={22} />
                      {w ? <b className="xph-idx-w" dir="rtl">{w.word}</b> : null}
                      <span className="pf-mono">{pad(p[0])}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          {/* every pattern is in the page; the chosen one shows */}
          <div className="xph-ex-d" id="xph-ex-d" aria-live="polite" data-enter="invert">
            {PATTERNS.map((p, i) => <div key={p[0]} className="xph-ex-one" hidden={i !== at}><Detail p={p} he={he} /></div>)}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

/* One sheet for all sixty-four (the kit's DetailSheet look), opened by a row's "See applications"; the arrows or ← → step
   to its neighbours in King Wen order. A native <dialog> (showModal: fixed, backdrop, focus trapped, Esc closes). */
function PatternSheet({ sel, setSel, he }) {
  const open = sel !== null;
  const [shown, setShown] = useState(false);
  const dlg = useRef(null);
  const close = useRef(null);
  const back = useRef(null);
  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (!open) {
      setShown(false);
      const t = setTimeout(() => { if (d.open) d.close(); const b = back.current; b?.focus?.({ preventScroll: true }); }, 420);
      return () => clearTimeout(t);
    }
    back.current = back.current && d.open ? back.current : document.activeElement;
    if (!d.open) d.showModal();
    const raf = requestAnimationFrame(() => setShown(true));
    const l = window.__lenis;
    l?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const t = setTimeout(() => close.current?.focus({ preventScroll: true }), 60);
    const key = (e) => {
      if (e.key === 'ArrowRight') setSel((s) => (s + 1) % 64);
      else if (e.key === 'ArrowLeft') setSel((s) => (s + 63) % 64);
    };
    addEventListener('keydown', key);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); removeEventListener('keydown', key); l?.start(); document.documentElement.style.overflow = prev; };
  }, [open, setSel]);
  const p = PATTERNS[sel ?? 0];
  return (
    <dialog ref={dlg} className="pf-sheet xph-sheet" data-open={shown} aria-label={title(p)}
      onCancel={(e) => { e.preventDefault(); setSel(null); }}
      onClick={(e) => { if (e.target === dlg.current) setSel(null); }}>
      <div className="pf-sheet-panel" data-lenis-prevent>
        <div className="pf-sheet-top">
          <span className="pf-mono xph-sheet-n" aria-hidden="true">{pad(p[0])} / 64</span>
          <div className="xph-sheet-nav">
            <button type="button" className="pf-sheet-x" onClick={() => setSel((s) => (s + 63) % 64)} aria-label="Previous pattern"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3.5 5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            <button type="button" className="pf-sheet-x" onClick={() => setSel((s) => (s + 1) % 64)} aria-label="Next pattern"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            <button ref={close} type="button" className="pf-sheet-x" onClick={() => setSel(null)} aria-label="Close"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></button>
          </div>
        </div>
        <div className="pf-sheet-body">{open && <Detail p={p} as="h2" size={84} he={he} />}</div>
      </div>
    </dialog>
  );
}

/* ---------- the eight categories, in King Wen or Ana BeKoach order: quiet ledgers whose every pattern opens in the sheet ---------- */
function Categories({ tab, open, he }) {
  const sections = he
    ? CHAPTERS.map((c) => ({
        key: c.hebrew,
        title: `${c.hebrew} — ${c.name}`,
        range: `${c.group} · ${c.theme}`,
        desc: c.lede,
        patterns: c.members.map((n) => PATTERNS[n - 1]),
      }))
    : GROUPS.map((g) => ({
        key: g[0],
        title: g[1],
        range: `${pad(g[2])}–${pad(g[3])} · ${g[4]}`,
        desc: g[5],
        patterns: PATTERNS.slice(g[2] - 1, g[3]),
      }));
  return (
    <section className="pf-sec xph-cats" aria-label="The eight categories">
      <div className="pf-wrap">
        <div id="xph-cats" aria-labelledby={'xph-tab-' + tab}>
          {sections.map((s, r) => (
            <section key={s.key} className="xph-grp" aria-labelledby={'xph-g-' + r} hidden={!!tab && tab !== r + 1}>
              <div className="xph-grp-h">
                <h2 id={'xph-g-' + r} className="pf-title">{s.title}</h2>
                <p className="pf-mono xph-grp-r">{s.range}</p>
                <p className="pf-body xph-grp-l">{s.desc}</p>
              </div>
              <ol className="xph-rows" data-enter="carousel">
                {s.patterns.map((p) => {
                  const w = he ? word(p[0]) : undefined;
                  return (
                    <li key={p[0]} className="xph-row">
                      <span className="pf-mono xph-row-n">{pad(p[0])}</span>
                      <Hexa ls={p[1]} size={28} />
                      <div className="xph-row-t">
                        <h3><bdi>{he ? hebrew(p[0]) : title(p)}</bdi></h3>
                        <p className={'xph-row-p' + (he ? ' is-he' : '')}>
                          {he ? (w ? <><bdi>{w.word}</bdi> · &ldquo;{w.meaning}&rdquo; · {w.gloss} · {title(p)}</> : `${title(p)} · ${p[5]}`) : p[5]}
                        </p>
                        <p className="xph-row-s">{p[6]}</p>
                      </div>
                      <button type="button" className="xph-row-b" onClick={() => open(p[0] - 1)} aria-haspopup="dialog" aria-label={'See applications: ' + title(p)}>
                        <span>See applications</span>
                        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- the close, in the one dark room: from one line to sixty-four conditions ---------- */
const CLOSE = [
  'A model can become more capable. An experiment can reveal a better question. A failed hypothesis can redirect an entire research program. A discovery in one discipline can transform another.',
  'Progress is not a straight line, and intelligence is not a fixed destination.',
  'These 64 patterns provide different perspectives for recognizing the condition of a problem and choosing how to proceed.',
  'The same principles can inform the development of an AI model, a scientific experiment, a research laboratory, an organization, or an evolving technological ecosystem.',
];
const TRI8 = [[1, 1, 1], [1, 1, 0], [1, 0, 1], [1, 0, 0], [0, 1, 1], [0, 1, 0], [0, 0, 1], [0, 0, 0]];
function Close() {
  return (
    <SceneWipe className="xph-close" label="Intelligence is never finished.">
      <div className="pf-sec"><div className="pf-wrap">
        <div className="xph-grow" aria-hidden="true">
          <div className="xph-g1"><span className="xph-hl yang xph-one-l"><i /><i /></span></div>
          <span className="xph-gto" />
          <div className="xph-g2"><Hexa ls={[1]} size={56} /><Hexa ls={[0]} size={56} /></div>
          <span className="xph-gto" />
          <div className="xph-g8">{TRI8.map((t, k) => <Hexa key={k} ls={t} size={26} />)}</div>
          <span className="xph-gto" />
          <div className="xph-g64">{PATTERNS.map((p) => <Hexa key={p[0]} ls={p[1]} size={15} />)}</div>
        </div>
        <div data-enter="type">
          <h2 className="pf-head xph-stanza"><span className="xph-type"><span className="xph-type-t">Intelligence is never finished.</span></span></h2>
        </div>
        <div className="xph-close-t">{CLOSE.map((t) => <p key={t} className="pf-body">{t}</p>)}</div>
        <p className="xph-close-m">Explore. Form. Observe. Experiment. Adapt. Optimize. Transform. Evolve.</p>
        <p className="xph-close-m dim">And begin again.</p>
        <p className="pf-mono xph-close-sig">The Zen of Hanzo.</p>
        <div className="xph-close-acts">
          <A to="/science" className="pf-btn solid" data-cta="philosophy.close">Explore Hanzo Science</A>
          <More to="https://papers.hanzo.ai">Read the research</More>
          <More to="https://platform.hanzo.ai">Build with Hanzo</More>
        </div>
      </div></div>
    </SceneWipe>
  );
}

export default function Philosophy() {
  const [tab, setTab] = useState(0); // 0 = All, 1-8 = a category
  const [at, setAt] = useState(0); // the pattern index (0..63) in the explorer
  const [sel, setSel] = useState(null); // the pattern index in the sheet
  const [he, setHe] = useState(false);

  useEffect(() => {
    const sync = (e) => {
      const code = e?.detail || document.documentElement.dataset.lang || localStorage.getItem('hz-lang') || '';
      const q = new URLSearchParams(location.search).get('lang') || '';
      const isHe = hebrewLocale(q || code) || location.hash === '#ana-bekoach';
      setHe((prev) => {
        if (isHe && !prev) setAt(PATH[0] - 1);
        else if (!isHe && prev) setAt(0);
        return isHe;
      });
    };
    sync();
    window.addEventListener('hz-lang-change', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('hz-lang-change', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);

  const toggleHe = (next) => {
    setHe(next);
    setTab(0);
    setAt(next ? PATH[0] - 1 : 0);
    try {
      const lang = next ? 'he' : 'en-US';
      localStorage.setItem('hz-lang', lang);
      document.documentElement.dataset.lang = lang;
      window.dispatchEvent(new CustomEvent('hz-lang-change', { detail: lang }));
    } catch {}
  };

  const pickTab = (n) => {
    setTab(n);
    if (!n) return;
    if (he) {
      const members = CHAPTERS[n - 1].members;
      if (!members.includes(PATTERNS[at][0])) setAt(members[0] - 1);
    } else if (PATTERNS[at][2] !== n) {
      setAt(GROUPS[n - 1][2] - 1);
    }
  };
  useEnter('.xph');
  return (
    <main id="main" className="xph pf-r">
      {/* JavaScript off: every category is laid out, every pattern's applications are in the explorer one under another */}
      <NoJs css=".xph-ex-d [hidden],.xph-grp[hidden]{display:block!important}.xph-ex-one+.xph-ex-one{margin-top:56px}.xph-idx-r.dim{opacity:1!important}.xph-ex-d{position:static!important;max-height:none!important}" />
      <Hero he={he} />
      <Intro />
      <Explorer tab={tab} setTab={pickTab} at={at} setAt={setAt} he={he} toggleHe={toggleHe} />
      <Categories tab={tab} open={setSel} he={he} />
      <PatternSheet sel={sel} setSel={setSel} he={he} />
      <Close />
    </main>
  );
}
