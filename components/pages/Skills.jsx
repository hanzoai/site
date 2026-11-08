'use client';
/* Skills.
   V2: 8/10 a paper page where a word wakes a gateway: the skill file is the hero (it tilts toward the pointer), then one pinned five-point stage that shows something new at each point (the frontmatter close up, one gateway pulling its two named files, the install, the trade, a new file), a grey highlighter, a dark thread room that opens from a card and is point 05's one home, and a close that types the install.
   Persona: a developer tuning a coding agent's context. Goal: add the skills. CTA: View on GitHub (skills.hero).
   Metric: cta_click on skills.hero and skills.close (data-cta; the event layer is the conductor's).
   Signature: say a word, a gateway wakes. The hero is a markdown skill file beside an agent's context tray. A prompt
   types a word on its own (Postgres, then comptime); the gateway that notices it (discover-database, discover-zig)
   lights, and its specific files fly into the tray while everything else stays on the shelf.
   Then the trade, scrubbed by scroll: one monolithic guide against five focused reads, each drawn as a small file
   against one long one (relative lengths, never a token count). Five points scroll past on the left while one
   pinned panel on the right shows each point's own object, none a copy of the hero (under 900px each point carries
   it, capped small); a grey highlighter strikes each key line once as it reaches the screen. The one dark room is
   the thread and carries point 05's heading and words (told once, not twice): API design → rate limiting → Redis,
   three files read one after another, each with its name and a piece of point 05's sentence; hovering a step lifts
   its file and dims the rest. The close types the install command once and lands on its done line.
   Every word and link is Hanzo's; named lines are ink, the rest of a file is drawn as blank lines. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Copy } from '../ui';
import { A } from '../kit';
import Lines from './skills/Lines'; // page-local A2Lines without the reduced-motion hydration mismatch (docs/build-notes/requests/skills.md)
import A2Paste from '../v2/A2Paste';
import { T, EMPH } from '../v2/A2Motion';
import '../v2/A2.css';
import './Skills.css';

const GH = 'https://github.com/hanzoai';
const CMD = 'npx skills add https://hanzoskills.com/hanzo.md';
const WAKE = [['Postgres', 'discover-database'], ['comptime', 'discover-zig']];
const SHELF = ['discover-database', 'discover-zig', '', '', '']; // Hanzo names two gateways; the rest of the shelf is drawn blank
const cx = (...c) => c.filter(Boolean).join(' ');
const pad = (n) => String(n).padStart(2, '0');

/* the small arrow an outbound ask carries; it nudges on hover */
const Arw = () => <svg className="xsk-arw" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M3.5 8.5l5-5M4.5 3.5h4v4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* One clock: type the word, wake the gateway, pull the files, rest; then the next word. */
function useWake(ref) {
  const seen = useInView(ref, { amount: 0.3 });
  const calm = useReducedMotion();
  const typed = useRef(null);
  const [w, setW] = useState(0);
  const [phase, setPhase] = useState(3); // 0 typing, 1 awake, 2 pulled, 3 rest (the server shows the pulled state)
  useEffect(() => {
    if (!seen || calm) return;
    let alive = true, t = 0, i = 0;
    const word = WAKE[w][0];
    setPhase(0);
    const typing = () => {
      if (!alive) return;
      i += 1;
      if (typed.current) typed.current.textContent = word.slice(0, i);
      if (i < word.length) t = setTimeout(typing, 90);
      else t = setTimeout(() => { setPhase(1); t = setTimeout(() => { setPhase(2); t = setTimeout(() => { setPhase(3); t = setTimeout(() => setW((v) => (v + 1) % WAKE.length), 1400); }, 2200); }, 900); }, 300);
    };
    if (typed.current) typed.current.textContent = '';
    t = setTimeout(typing, 500);
    return () => { alive = false; clearTimeout(t); if (typed.current) typed.current.textContent = word; };
  }, [seen, calm, w]);
  return [typed, w, phase];
}

/* the hero's pieces (the shelf is also scene 06's) */
function FileCard() {
  return (
    <div className="xsk-file">
      <div className="xsk-file-top x-mono"><span>hanzo.md</span><span>markdown</span></div>
      <pre className="xsk-fm x-mono"><span className="d">---</span>{'\n'}<span className="k">name:</span> hanzo{'\n'}<span className="k">description:</span> Development knowledge your coding agent loads only when it needs it{'\n'}<span className="d">---</span></pre>
      <div className="xsk-prose"><b># A skill is a markdown file</b><span>Frontmatter carries a name and a description. Below it is prose, code, and links to related skills.</span></div>
      <div className="xsk-links x-mono">{['discover-database', 'discover-zig'].map((l) => <span key={l}>→ {l}</span>)}</div>
    </div>
  );
}

function Shelf({ lit, extra }) {
  return (
    <ul className="xsk-shelf x-mono">
      {SHELF.map((s, i) => <li key={i} className={cx(s && s === lit && 'on', !s && 'blank')}>{s || <i />}</li>)}
      {extra}
    </ul>
  );
}

function Tray({ pulled, k = 'a' }) {
  return (
    <div className="xsk-tray">
      <span className="x-mono">context</span>
      <div className="xsk-tray-in">
        <b className="xsk-base" />
        {[0, 1].map((j) => <b key={k + '-' + j} className={cx('xsk-sheet', pulled && 'in')} style={{ transitionDelay: j * T.press + 's' }} />)}
      </div>
    </div>
  );
}

function Wake() {
  const ref = useRef(null);
  const [typed, w, phase] = useWake(ref);
  const gate = WAKE[w][1];
  return (
    <div className="xsk-wake" ref={ref} aria-hidden="true">
      <FileCard />
      <div className="xsk-agent">
        <div className="xsk-say x-mono"><span className="xsk-caret-k">›</span><span ref={typed}>{WAKE[w][0]}</span><b className="xsk-caret" /></div>
        <Shelf lit={phase >= 1 ? gate : null} />
        <span className="xsk-kai"><img src="/models/kai.webp" alt="" width="1200" height="1500" decoding="async" /></span>
        <Tray pulled={phase >= 2} k={String(w)} />
      </div>
    </div>
  );
}

/* the hero file leans up to 2.5° toward a fine pointer and eases flat on leave (300 ms ease-out in Skills.css).
   Fine pointers only; none on touch or under reduced motion, both read after mount. Writes two CSS variables. */
const TILT = 2.5;
function useTilt(ref) {
  useEffect(() => {
    const box = ref.current;
    const el = box && box.querySelector('.xsk-file');
    if (!el) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const set = (x, y) => { el.style.setProperty('--tx', x.toFixed(2) + 'deg'); el.style.setProperty('--ty', y.toFixed(2) + 'deg'); };
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const px = Math.min(1, Math.max(-1, ((e.clientX - r.left) / r.width) * 2 - 1));
      const py = Math.min(1, Math.max(-1, ((e.clientY - r.top) / r.height) * 2 - 1));
      set(px * TILT, -py * TILT);
    };
    const leave = () => set(0, 0);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, [ref]);
}

function Hero() {
  // the h1 is the moment at rest, then settles from 112px toward 84px over the first 200px of scroll (scale only).
  // Its cut-in is a CSS keyframe on the server-rendered line (Skills.css), so it plays on first paint before React.
  const { scrollY } = useScroll();
  const settle = useTransform(scrollY, [0, 200], [1, 0.75], { clamp: true });
  const obj = useRef(null);
  useTilt(obj);
  return (
    <section className="xsk-hero" aria-labelledby="xsk-h1">
      <div className="a2-wrap a2-grid xsk-hero-grid">
        <div className="xsk-hero-copy">
          <motion.div className="xsk-h1-set" style={{ scale: settle }}><Lines as="h1" id="xsk-h1" className="a2-display xsk-h1" lines={['Skills']} now /></motion.div>
          <Para className="a2-lede" parts={['Development knowledge your coding agent loads ', { h: 'only when it needs it' }]} />
          <div className="a2-acts"><A to={GH} className="x-btn solid xsk-ask" data-thumb="View on GitHub" data-cta="skills.hero">View on GitHub<Arw /></A></div>
          <p className="xsk-repo-cap x-mono"><A to={GH} className="xsk-repo">hanzoai/skills</A></p>
        </div>
        <motion.div ref={obj} className="xsk-hero-obj" initial={{ y: 40, rotate: 1.5 }} animate={{ y: 0, rotate: 0 }} transition={{ duration: T.slower, ease: EMPH, delay: 0.2 }}>
          <Wake />
        </motion.div>
      </div>
    </section>
  );
}

/* The trade, scrubbed: one monolithic guide, then five focused reads, each a small file. Lengths are relative, never a count. */
function Trade() {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end center'] });
  // reduced motion: Skills.css pins both to their final state (no branch here, so server and client render alike)
  const mono = useTransform(p, (v) => Math.min(1, Math.max(0, (v - 0.15) / 0.3)));
  const five = useTransform(p, (v) => Math.min(1, Math.max(0, (v - 0.4) / 0.35)));
  return (
    <section className="a2-sec xsk-trade" ref={ref} aria-labelledby="xsk-trade-h">
      <div className="a2-wrap a2-grid xsk-trade-grid">
        <Lines id="xsk-trade-h" className="a2-display m xsk-trade-h" lines={['Coverage costs context.', 'This is the trade.']} />
        <div className="xsk-bars" aria-hidden="true">
          <div className="xsk-bar-row"><span className="x-mono">one monolithic guide</span><div className="xsk-track"><motion.b className="xsk-mono" style={{ scaleX: mono }}>{Array.from({ length: 9 }, (_, k) => <i key={k} />)}</motion.b></div></div>
          <div className="xsk-bar-row"><span className="x-mono">five focused reads</span><div className="xsk-track"><motion.div className="xsk-five" style={{ '--f': five }}>{[0, 1, 2, 3, 4].map((k) => <b key={k} style={{ '--k': k }}><i /><i /><i /></b>)}</motion.div></div></div>
          <p className="xsk-track-k x-mono"><span>context</span></p>
        </div>
      </div>
    </section>
  );
}

/* The five points on the stage: the words scroll past on the left, one pinned panel on the right shows each one's object.
   The thread point (Hanzo's "Cross-referenced, not duplicated") lives in the dark room after the stage, told once. */
const POINTS = [
  ['A skill is a markdown file', ['Frontmatter carries a name and a description. Below it is prose, code, and links to related skills. ', { h: 'Nothing to compile, nothing to run' }, ' — you can read one before you trust it.']],
  ['Gateway skills do the finding', ['A gateway is a small skill whose whole job is to notice. Say Postgres and discover-database wakes up; say comptime and discover-zig does. ', { h: 'It pulls the specific files and gets out of the way.' }]],
  ['Install it in one line', [{ c: CMD }, ' adds the Hanzo skill to your agent, and ', { h: 'hanzoskills.com/llms.txt lists every other one as plain markdown.' }]],
  ['Written small on purpose', ['One topic per file, a few hundred lines each. ', { h: 'Five focused reads cost less than one monolithic guide' }, ', and you get the five that matter instead of the one that covers everything badly.']],
  ['Add your own', ['Drop a markdown file in a category, give it a name and a description, and it joins discovery. ', { h: 'Your house conventions load the same way the public ones do.' }]],
];
const NUM = [1, 2, 3, 4, 6]; // Hanzo numbers six points; 05 is the thread room
const TOTAL = 6;
const CROSS = ['Cross-referenced, not duplicated', ['Skills link to the skills next to them, so an agent following a thread from API design into rate limiting into Redis ', { h: 'reads three files and never the same paragraph twice.' }]];

/* Hanzo's sentences stay one unbroken run of text (James, 8 Nov: no wording changes, copycheck reads whole lines);
   the highlight is drawn over the words with the CSS Custom Highlight API instead of wrapping them in elements.
   It sweeps in left to right once the line is in view; browsers without the API show the words plain. */
// the build's CSS parser does not know ::highlight() yet, so its three rules are added at runtime, once
const HL_CSS = '::highlight(xsk-hl){background-color:light-dark(#e4e4e7, var(--border-strong));color:light-dark(#0a0a0a, var(--primary))}::highlight(xsk-hl-d){background-color:#404040;color:#fafafa}::highlight(xsk-code){background-color:light-dark(#f5f5f5, var(--secondary));color:light-dark(#0a0a0a, var(--foreground))}';
const reg = (name) => { if (typeof CSS === 'undefined' || !CSS.highlights || typeof Highlight === 'undefined') return null; if (!document.getElementById('xsk-hl-css')) { const st = document.createElement('style'); st.id = 'xsk-hl-css'; st.textContent = HL_CSS; document.head.appendChild(st); } let h = CSS.highlights.get(name); if (!h) { h = new Highlight(); CSS.highlights.set(name, h); } return h; };
function useHl(ref, marks, name, sweep = true) {
  const seen = useInView(ref, { once: true, amount: 0.5, margin: '0px 0px -15% 0px' });
  const calm = useReducedMotion();
  useEffect(() => {
    const el = ref.current, h = reg(name);
    if (!el || !h || !marks.length || (sweep && !seen)) return;
    const texts = [...el.childNodes].filter((n) => n.nodeType === 3);
    const rs = marks.map((m) => { const n = texts.find((t) => t.data.includes(m)); if (!n) return null; const a = n.data.indexOf(m); if (a < 0) return null; const r = new Range(); try { r.setStart(n, a); r.setEnd(n, sweep && !calm ? a : a + m.length); } catch { return null; } h.add(r); return [r, n, m]; }).filter(Boolean);
    let raf = 0;
    if (sweep && !calm) {
      const t0 = performance.now(), ease = (x) => 1 - Math.pow(1 - x, 4);
      const step = (t) => { const k = ease(Math.min(1, (t - t0) / 900)); rs.forEach(([r, n, m]) => { const a = n.data.indexOf(m); if (a < 0 || !n.isConnected) return; try { r.setStart(n, a); r.setEnd(n, a + Math.round(m.length * k)); } catch {} }); CSS.highlights.set(name, h); if (k < 1) raf = requestAnimationFrame(step); };
      raf = requestAnimationFrame(step);
    }
    return () => { cancelAnimationFrame(raf); rs.forEach(([r]) => h.delete(r)); };
  }, [seen, calm, name, sweep]); // eslint-disable-line react-hooks/exhaustive-deps
}
function Para({ parts, className, dark }) {
  const ref = useRef(null);
  const list = Array.isArray(parts) ? parts : [parts];
  useHl(ref, list.filter((x) => x && x.h).map((x) => x.h), dark ? 'xsk-hl-d' : 'xsk-hl');
  useHl(ref, list.filter((x) => x && x.c).map((x) => x.c), 'xsk-code', false);
  return <p ref={ref} className={className}>{list.map((x) => (typeof x === 'string' ? x : x.h || x.c))}</p>;
}

/* 01 the frontmatter close up, 02 one gateway pulling its two named files, 03 the install, 04 the trade,
   05 a new file joining the shelf. None repeats the hero; the thread's links are drawn in the dark room. */
const ZOOM = [
  ['d', '---'], ['k', 'name:', ' hanzo'], ['k', 'description:', ' Development knowledge your coding agent loads only when it needs it'], ['d', '---'],
  ['b', 88], ['b', 64], ['l', '→ discover-database'],
];
function Scene({ k }) {
  if (k === 0) return (
    <div className="xsk-sc xsk-sc-zoom"><div className="xsk-zoom">
      <p className="xsk-zoom-top x-mono">hanzo.md</p>
      <ol className="xsk-zoom-ln x-mono">
        {ZOOM.map(([c, a, b], j) => (
          <li key={j} className={c} style={{ '--k': j }}>
            {c === 'd' || c === 'l' ? a : c === 'b' ? <i style={{ width: a + '%' }} /> : <><span>{a}</span>{b}</>}
          </li>
        ))}
      </ol>
    </div></div>
  );
  if (k === 1) return (
    <div className="xsk-sc xsk-sc-gate">
      <span className="xsk-gw-word x-mono"><span className="xsk-caret-k">›</span> Postgres</span>
      <b className="xsk-gw-v" />
      <span className="xsk-gw x-mono">discover-database</span>
      <b className="xsk-gw-v two" />
      <b className="xsk-gw-rail" />
      <div className="xsk-gw-files">{[0, 1, 2, 3, 4].map((j) => j % 2 === 1
        ? <span key={j} className="pull" style={{ '--k': j }}><em>{WAKE[0][1]}</em><i /><i /></span>
        : <span key={j} style={{ '--k': j }}><i /><i /><i /></span>)}</div>
    </div>
  );
  if (k === 2) return (
    <div className="xsk-sc xsk-sc-term"><div className="xsk-term">
      <div className="xsk-term-top"><i /><i /><i /></div>
      <p className="xsk-term-cmd x-mono"><span className="d">$</span> <span className="xsk-term-type">{CMD}</span></p>
      <div className="xsk-term-out">{[58, 72, 44].map((v, j) => <i key={j} style={{ width: v + '%', '--k': j }} />)}</div>
      <p className="xsk-term-done x-mono"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg><span>hanzo.md</span></p>
    </div></div>
  );
  if (k === 3) return (
    <div className="xsk-sc xsk-sc-bars">
      <span className="x-mono">one monolithic guide</span>
      <div className="xsk-track"><b className="xsk-sc-mono">{Array.from({ length: 7 }, (_, j) => <i key={j} />)}</b></div>
      <span className="x-mono">five focused reads</span>
      <div className="xsk-track"><div className="xsk-sc-five">{[0, 1, 2, 3, 4].map((j) => <b key={j} style={{ '--k': j }}><i /><i /></b>)}</div></div>
    </div>
  );
  return (
    <div className="xsk-sc xsk-sc-new">
      <div className="xsk-sc-drop"><span className="x-mono">.md</span><i /><i /><i /></div>
      <div className="xsk-agent"><Shelf extra={<li className="blank xsk-sc-row"><i /></li>} /></div>
    </div>
  );
}

function Point({ i, t, d, on, onSeen }) {
  const ref = useRef(null);
  const mid = useInView(ref, { margin: '-46% 0px -46% 0px' });
  const near = useInView(ref, { amount: 0.35 });
  useEffect(() => { if (mid) onSeen(i); }, [mid, i, onSeen]);
  return (
    <li ref={ref} className={cx('xsk-pt', 'p' + i, on && 'on')}>
      <div className="xsk-pt-copy">
        <h2 className="a2-headline" id={'xsk-pt-h' + i}>{t}</h2>
        <p className="a2-kick show xsk-cap">{pad(NUM[i])} / {pad(TOTAL)}</p>
        <Para className="a2-body" parts={d} />
        {i === 2 && <div className="xsk-cmd"><code className="x-mono">{CMD}</code><Copy text={CMD} /></div>}
      </div>
      <div className={cx('xsk-pt-vis', near && 'on')} aria-hidden="true"><Scene k={i} /></div>
    </li>
  );
}

/* one pinned stage over a run of points; its six ticks count Hanzo's six points across the page (the thread room is 05) */
function Essay({ list, last }) {
  const [at, setAt] = useState(list[0]);
  return (
    <section className={cx('a2-sec', 'xsk-essay', last && 'last')} aria-labelledby={'xsk-pt-h' + list[0]}>
      <div className="a2-wrap xsk-essay-grid">
        <ol className="xsk-points" start={NUM[list[0]]}>
          {list.map((i) => <Point key={i} i={i} t={POINTS[i][0]} d={POINTS[i][1]} on={at === i} onSeen={setAt} />)}
        </ol>
        <div className="xsk-stage" aria-hidden="true">
          <div className="xsk-stage-in">
            <div className="xsk-scenes">
              {list.map((i) => <div key={i} className={cx('xsk-scene', at === i && 'on', at > i && 'past')}><Scene k={i} /></div>)}
              <div className="xsk-ticks">{Array.from({ length: TOTAL }, (_, j) => <b key={j} className={cx(j < NUM[at] && 'on')} />)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* The one dark room: the thread, file to file, and point 05's one home (its heading and words lead the room).
   It enters as a rounded card inside the gutters and opens to full width as it arrives. Each file carries its name
   and one piece of point 05's own sentence in ink; its link line is struck as it is read. Hovering a step lifts its file. */
const THREAD = ['API design', 'rate limiting', 'Redis'];
const THREAD_LN = ['Skills link to the skills next to them', 'an agent following a thread', 'never the same paragraph twice'];

function Thread() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.4 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.2'] });
  const open = useTransform(scrollYProgress, [0, 1], [0, 1], { clamp: true });
  const calm = useReducedMotion();
  const [at, setAt] = useState(2);
  const [mine, setMine] = useState(false);
  const [peek, setPeek] = useState(-1);
  useEffect(() => {
    if (!seen || calm || mine) return;
    let t = 0;
    setAt(0);
    const step = () => { setAt((v) => (v + 1) % 4); t = setTimeout(step, 1300); };
    t = setTimeout(step, 1300);
    return () => clearTimeout(t);
  }, [seen, calm, mine]);
  return (
    <motion.section className="a2-sec a2-dark xsk-thread" data-room="dark" ref={ref} aria-labelledby="xsk-thread-h" style={{ '--o': open }}>
      <div className="a2-wrap a2-grid xsk-thread-grid">
        <div className="xsk-thread-copy">
          <Lines id="xsk-thread-h" className="a2-display m xsk-thread-h" lines={[CROSS[0]]} />
          <p className="a2-kick show xsk-cap">{pad(5)} / {pad(TOTAL)}</p>
          <Para className="a2-body xsk-thread-lede" parts={CROSS[1]} dark />
          <div className="xsk-thread-nav">
          <div className="xsk-steps" role="group" aria-labelledby="xsk-thread-h" onPointerLeave={() => setPeek(-1)}>
            {THREAD.map((t, i) => (
              <button key={t} type="button" aria-pressed={at >= i} onClick={() => { setMine(true); setAt(i); }}
                onPointerEnter={(e) => { if (e.pointerType === 'mouse') setPeek(i); }} onFocus={() => setPeek(i)} onBlur={() => setPeek(-1)}>
                <span>{t}</span>
              </button>
            ))}
          </div>
          <b className="xsk-rail" aria-hidden="true" style={{ '--r': Math.min(at + 1, 3) / 3 }} />
          </div>
        </div>
        <div className={cx('xsk-files', peek >= 0 && 'peeking')} aria-hidden="true">
          {THREAD.map((t, i) => (
            <div key={t} className={cx('xsk-f', at >= i && 'on', peek === i && 'peek')} style={{ '--i': i }}>
              <span className="x-mono">{t}</span>
              <p className="xsk-f-ln">{THREAD_LN[i]}</p>
              {[70, 52].map((v, k) => <i key={k} style={{ width: v + '%' }} />)}
              {i < 2 && <em className="x-mono">→ {THREAD[i + 1]}</em>}
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* the close: the install types itself once when the card arrives (the same command the Copy block copies), then the
   output draws and the done line lands; hovering the card lifts the tick row. The server prints the whole command;
   with motion allowed it is cleared after mount (the card is below the fold) and typed three characters a tick. */
function Done() {
  const ref = useRef(null);
  const typed = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const [done, setDone] = useState(false);
  useEffect(() => {
    const el = typed.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setDone(true); return; }
    if (!seen) { el.textContent = ''; return; }
    let i = 0, t = 0;
    const step = () => {
      i = Math.min(CMD.length, i + 3);
      el.textContent = CMD.slice(0, i);
      t = i < CMD.length ? setTimeout(step, 90) : setTimeout(() => setDone(true), 150);
    };
    t = setTimeout(step, 150);
    return () => { clearTimeout(t); el.textContent = CMD; };
  }, [seen]);
  return (
    <div ref={ref} className={cx('xsk-get-done', seen && 'seen', done && 'on')} aria-hidden="true">
      <p className="xsk-gd-cmd x-mono"><span className="d">$</span><span className="xsk-gd-type"><span ref={typed}>{CMD}</span><b className="xsk-caret" /></span></p>
      <div className="xsk-gd-out">{[64, 46, 56].map((v, j) => <i key={j} style={{ width: v + '%', '--k': j }} />)}</div>
      <p className="xsk-gd-ok x-mono"><span className="xsk-gd-row"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg><span>hanzo.md</span></span></p>
    </div>
  );
}

function Get() {
  return (
    <section className="a2-sec xsk-get" aria-labelledby="xsk-get-h">
      <div className="a2-wrap xsk-get-in">
        <Lines id="xsk-get-h" className="a2-display s xsk-get-h" lines={['Get started', 'with Skills']} />
        <div className="xsk-get-card">
          <div className="xsk-get-copy">
            <h3>Get Skills</h3>
            <p>Reusable agent skills</p>
            <p className="xsk-get-meta x-mono"><span><span>License:</span> Apache-2.0</span><A to={GH}>hanzoai</A></p>
          </div>
          <div className="xsk-get-shelf"><Done /></div>
          <A to="https://platform.hanzo.ai/deploy" className="x-btn xsk-ask xsk-deploy" data-cta="skills.close">Deploy to Cloud<Arw /></A>
        </div>
      </div>
    </section>
  );
}

export default function Skills() {
  return (
    <main className="a2 xsk">
      <Hero />
      <Trade />
      <Essay list={[0, 1, 2, 3]} />
      <Thread />
      <Essay list={[4]} last />
      <A2Paste name="Skills" text="Read https://hanzo.ai/skill.md and use Hanzo Skills in my project. Start with: hanzo tools skills list" />
      <Get />
    </main>
  );
}
