'use client';
/* Skills.
   V2: 8/10 a paper page where a word wakes a gateway: the skill file is the hero, then one pinned stage that shows something new at each point (the frontmatter close up, one gateway pulling two files, the install, the trade, one file's links drawn out, a new file), a grey highlighter, and a dark thread room that opens from a card.
   Persona: a developer tuning a coding agent's context. Goal: add the skills. CTA: View on GitHub (skills.hero).
   Metric: cta_click on skills.hero and skills.close (data-cta; the event layer is the conductor's).
   Signature: say a word, a gateway wakes. The hero is a markdown skill file beside an agent's context tray. A prompt
   types a word on its own (Postgres, then comptime); the gateway that notices it (discover-database, discover-zig)
   lights, and its specific files fly into the tray while everything else stays on the shelf.
   Then the trade, scrubbed by scroll: one monolithic guide against five focused reads, each drawn as a small file
   against one long one (relative lengths, never a token count). The six points scroll past on the left while one
   pinned panel on the right shows each point's own object, none a copy of the hero (under 900px each point carries
   it, capped small); a grey highlighter strikes each key line once as it reaches the screen. The one dark room is
   the thread, labelled by point 05's heading (Hanzo prints it once): API design → rate limiting → Redis, three files
   read one after another; hovering a step lifts its file and dims the rest. The close shows the install's done line.
   Every word and link is Hanzo's; file contents are drawn as blank lines. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Copy } from '../ui';
import { A } from '../kit';
import Lines from './skills/Lines'; // page-local A2Lines without the reduced-motion hydration mismatch (docs/requests/skills.md)
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
        <Tray pulled={phase >= 2} k={String(w)} />
      </div>
    </div>
  );
}

function Hero() {
  // the h1 is the moment at rest, then settles from 112px toward 84px over the first 200px of scroll (scale only)
  const { scrollY } = useScroll();
  const settle = useTransform(scrollY, [0, 200], [1, 0.75], { clamp: true });
  return (
    <section className="xsk-hero" aria-labelledby="xsk-h1">
      <div className="a2-wrap a2-grid xsk-hero-grid">
        <div className="xsk-hero-copy">
          <motion.div className="xsk-h1-set" style={{ scale: settle }}><Lines as="h1" id="xsk-h1" className="a2-display xsk-h1" lines={['Skills']} now /></motion.div>
          <p className="a2-lede">Development knowledge your coding agent loads <mark>only when it needs it</mark></p>
          <div className="a2-acts"><A to={GH} className="x-btn solid xsk-ask" data-thumb="View on GitHub" data-cta="skills.hero">View on GitHub<Arw /></A></div>
          <p className="xsk-repo-cap x-mono"><A to={GH} className="xsk-repo">hanzoai/skills</A></p>
        </div>
        <motion.div className="xsk-hero-obj" initial={{ opacity: 0, y: 40, rotate: 1.5 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: T.slower, ease: EMPH, delay: 0.2 }}>
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

/* The six points: the words scroll past on the left, one pinned panel on the right rebuilds the hero's pieces for each. */
const POINTS = [
  ['A skill is a markdown file', <>Frontmatter carries a name and a description. Below it is prose, code, and links to related skills. <Hl>Nothing to compile, nothing to run</Hl> — you can read one before you trust it.</>],
  ['Gateway skills do the finding', <>A gateway is a small skill whose whole job is to notice. Say Postgres and discover-database wakes up; say comptime and discover-zig does. <Hl>It pulls the specific files and gets out of the way.</Hl></>],
  ['Install it in one line', <><code>{CMD}</code> adds the Hanzo skill to your agent, and <Hl>hanzoskills.com/llms.txt lists every other one as plain markdown.</Hl></>],
  ['Written small on purpose', <>One topic per file, a few hundred lines each. <Hl>Five focused reads cost less than one monolithic guide</Hl>, and you get the five that matter instead of the one that covers everything badly.</>],
  ['Cross-referenced, not duplicated', <>Skills link to the skills next to them, so an agent following a thread from API design into rate limiting into Redis <Hl>reads three files and never the same paragraph twice.</Hl></>],
  ['Add your own', <>Drop a markdown file in a category, give it a name and a description, and it joins discovery. <Hl>Your house conventions load the same way the public ones do.</Hl></>],
];

function Hl({ children }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5, margin: '0px 0px -15% 0px' });
  return <mark ref={ref} className={cx('xsk-hl', seen && 'on')}>{children}</mark>;
}

/* 01 the frontmatter close up, 02 one gateway pulling two files, 03 the install, 04 the trade,
   05 one file's links drawn out to the files it points at, 06 a new file joining the shelf. None repeats the hero. */
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
      <div className="xsk-gw-files">{[0, 1, 2, 3, 4].map((j) => <span key={j} className={cx(j % 2 === 1 && 'pull')} style={{ '--k': j }}><i /><i /><i /></span>)}</div>
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
  if (k === 4) return (
    <div className="xsk-sc xsk-sc-link">
      <div className="xsk-lk-file">
        <span className="x-mono">{THREAD[0]}</span>
        {[92, 70, 84].map((v, j) => <i key={j} style={{ width: v + '%', '--k': j }} />)}
        <em className="x-mono">→ {THREAD[1]}</em>
      </div>
      <b className="xsk-lk-v" />
      <div className="xsk-lk-row">
        <span className="xsk-lk-stub a x-mono">{THREAD[1]}</span>
        <b className="xsk-lk-h" />
        <span className="xsk-lk-stub b x-mono">{THREAD[2]}</span>
      </div>
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
        <p className="a2-kick show xsk-cap">{pad(i + 1)} / 06</p>
        <p className="a2-body">{d}</p>
        {i === 2 && <div className="xsk-cmd"><code className="x-mono">{CMD}</code><Copy text={CMD} /></div>}
      </div>
      <div className={cx('xsk-pt-vis', near && 'on')} aria-hidden="true"><Scene k={i} /></div>
    </li>
  );
}

function Essay() {
  const [at, setAt] = useState(0);
  return (
    <section className="a2-sec xsk-essay" aria-label="Six points">
      <div className="a2-wrap xsk-essay-grid">
        <ol className="xsk-points">
          {POINTS.map(([t, d], i) => <Point key={t} i={i} t={t} d={d} on={at === i} onSeen={setAt} />)}
        </ol>
        <div className="xsk-stage" aria-hidden="true">
          <div className="xsk-stage-in">
            <div className="xsk-scenes">
              {POINTS.map((_, i) => <div key={i} className={cx('xsk-scene', at === i && 'on', at > i && 'past')}><Scene k={i} /></div>)}
              <div className="xsk-ticks">{POINTS.map((_, i) => <b key={i} className={cx(at >= i && 'on')} />)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* The one dark room: the thread, file to file. It is labelled by point 05's heading (Hanzo prints that heading once),
   enters as a rounded card inside the gutters and opens to full width as it arrives. Hovering a step lifts its file. */
const THREAD = ['API design', 'rate limiting', 'Redis'];

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
    <motion.section className="a2-sec a2-dark xsk-thread" data-room="dark" ref={ref} aria-labelledby="xsk-pt-h4" style={{ '--o': open }}>
      <div className="a2-wrap a2-grid xsk-thread-grid">
        <div className="xsk-thread-copy">
          <div className="xsk-steps" role="group" aria-labelledby="xsk-pt-h4" onPointerLeave={() => setPeek(-1)}>
            {THREAD.map((t, i) => (
              <button key={t} type="button" aria-pressed={at >= i} onClick={() => { setMine(true); setAt(i); }}
                onPointerEnter={(e) => { if (e.pointerType === 'mouse') setPeek(i); }} onFocus={() => setPeek(i)} onBlur={() => setPeek(-1)}>
                <span>{t}</span>
              </button>
            ))}
          </div>
          <b className="xsk-rail" aria-hidden="true" style={{ '--r': Math.min(at + 1, 3) / 3 }} />
        </div>
        <div className={cx('xsk-files', peek >= 0 && 'peeking')} aria-hidden="true">
          {THREAD.map((t, i) => (
            <div key={t} className={cx('xsk-f', at >= i && 'on', peek === i && 'peek')} style={{ '--i': i }}>
              <span className="x-mono">{t}</span>
              {[88, 70, 94, 52].map((v, k) => <i key={k} style={{ width: v + '%' }} />)}
              {i < 2 && <em className="x-mono">→ {THREAD[i + 1]}</em>}
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* the close: the install's done line, drawn when the card arrives; hovering the card lifts the tick row */
function Done() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  return (
    <div ref={ref} className={cx('xsk-get-done', seen && 'on')} aria-hidden="true">
      <div className="xsk-gd-cmd"><span className="x-mono">$</span><i /></div>
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
      <Essay />
      <Thread />
      <A2Paste name="Skills" text="Read https://hanzo.ai/skill.md and use Hanzo Skills in my project. Start with: hanzo tools skills list" />
      <Get />
    </main>
  );
}
