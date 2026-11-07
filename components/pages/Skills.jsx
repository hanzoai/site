'use client';
/* Skills. The page is the trade Hanzo describes: coverage costs context. The hero is an agent with almost nothing loaded;
   say a word and the gateway that notices it wakes, hands over its files and gets out of the way. The six points are
   a deck of markdown files; then a thread followed file to file, linked instead of repeated.
   Signature: Gateway wake-up: say a word (Postgres, comptime) and its gateway skill (discover-database, discover-zig) wakes, pulls its markdown cards and slots them into the agent, whose context bar grows only by what it loaded.
   Beyond: Follow a thread: API design → rate limiting → Redis, three files read, the paragraphs they share linked rather than repeated.
   Every word and link is Hanzo's; file contents are drawn as blank lines because Hanzo does not list them, and the bars
   are relative, never a token count. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { EASE, Rise, Copy } from '../ui';
import { A, More } from '../kit';
import { useLive, useEvery, useSteps, Paste, Get } from './cloud/Frame';
import './Skills.css';

const WORDS = [
  { say: 'Postgres', gate: 'discover-database' },
  { say: 'comptime', gate: 'discover-zig' },
];
const FILES = 2; // cards each gateway hands over in this demo
const pad = (n) => String(n).padStart(2, '0');
const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
const Gh = () => <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;

/* A markdown file drawn as its shape: frontmatter (name, description), then prose as blank lines. */
function Md({ id, tone }) {
  return (
    <motion.span layoutId={id} className={'xsk-md ' + tone} transition={{ type: 'spring', stiffness: 260, damping: 28 }} aria-hidden="true">
      <span className="xsk-md-fm"><i>---</i><i><em>name:</em><b /></i><i><em>description:</em><b className="l" /></i><i>---</i></span>
      <span className="xsk-md-p"><b /><b /><b className="s" /></span>
    </motion.span>
  );
}

// auto plays both words, the first word's files staying loaded while the second runs; a chosen word plays alone
const phase = (mode, step) => (mode === 'auto' ? { w: step < 6 ? 0 : 1, ls: step % 6, keep: step >= 6 } : { w: mode, ls: step, keep: false });

function Wake() {
  const [ref, live, calm] = useLive(0.3);
  const [mode, setMode] = useState('auto');
  const [step, setStep] = useState(0);
  const typed = useRef(null);
  const { w, ls, keep } = phase(mode, step);
  const loaded = (u, j) => (u === w ? ls >= 2 + j : keep && u === 0);
  const awake = (u) => u === w && ls >= 1 && ls <= 3;
  const done = (u) => u === w ? ls >= 4 : keep && u === 0;
  useEffect(() => { if (calm) setStep(mode === 'auto' ? 11 : 5); }, [calm, mode]);
  useEvery(700, live, () => setStep((s) => (mode === 'auto' ? (s + 1) % 12 : Math.min(5, s + 1))));
  // the word types into the agent's prompt, written to the text node
  useEffect(() => {
    const el = typed.current, word = WORDS[w].say;
    if (!el) return;
    if (ls !== 0 || calm) { el.textContent = word; return; }
    let i = 0, t = 0;
    const tick = () => { el.textContent = word.slice(0, ++i); if (i < word.length) t = setTimeout(tick, 70); };
    el.textContent = '';
    t = setTimeout(tick, 80);
    return () => clearTimeout(t);
  }, [w, ls, mode, calm]);
  const say = (i) => { setMode(i); setStep(calm ? 5 : 0); };
  const segs = WORDS.flatMap((x, u) => Array.from({ length: FILES }, (_, j) => loaded(u, j) && { k: u + '-' + j, u })).filter(Boolean);
  return (
    <div className="xsk-stage" ref={ref}>
      <div className="xsk-say" role="radiogroup" aria-label="Say a word">
        <span className="x-mono">Say</span>
        {WORDS.map((x, i) => (
          <button key={x.say} type="button" role="radio" aria-checked={w === i} className={'t' + i} onClick={() => say(i)}>{x.say}</button>
        ))}
        {mode !== 'auto' && <button type="button" className="xsk-both" onClick={() => { setMode('auto'); setStep(calm ? 11 : 0); }}>Both</button>}
      </div>
      <LayoutGroup>
        <div className="xsk-shelf">
          {WORDS.map((x, u) => (
            <div key={x.gate} className={'xsk-gate t' + u + (awake(u) ? ' awake' : '') + (done(u) ? ' rest' : '')}>
              <span className="xsk-gate-h">
                <i className="xsk-eye" aria-hidden="true" />
                <b className="x-mono">{x.gate}</b>
                <em className="x-mono">{awake(u) ? 'wakes up' : done(u) ? 'out of the way' : 'noticing'}</em>
              </span>
              <span className="xsk-gate-w x-mono">“{x.say}”</span>
              <span className="xsk-gate-f">
                {Array.from({ length: FILES }, (_, j) => (
                  <span key={j} className="xsk-gate-slot">{!loaded(u, j) && <Md id={`md-${u}-${j}`} tone={'t' + u} />}</span>
                ))}
              </span>
            </div>
          ))}
        </div>
        <div className="xsk-agent">
          <div className="xsk-agent-h">
            <img src="/models/kai.webp" alt="" />
            <span><b>Your coding agent</b><em className="x-mono">loads only what it needs</em></span>
          </div>
          <p className="xsk-input x-mono"><span aria-hidden="true">›</span><span ref={typed}>{WORDS[0].say}</span><i className="xsk-caret" aria-hidden="true" /></p>
          <div className="xsk-slots">
            {WORDS.flatMap((x, u) => Array.from({ length: FILES }, (_, j) => (loaded(u, j) ? <Md key={`${u}-${j}`} id={`md-${u}-${j}`} tone={'t' + u} /> : null)))}
            {!segs.length && <span className="xsk-empty">Nothing loaded yet</span>}
          </div>
          <div className="xsk-ctx">
            <span className="xsk-ctx-k x-mono">context</span>
            <span className="xsk-ctx-bar">
              <AnimatePresence initial={false}>
                {segs.map((s) => <motion.i key={s.k} className={'t' + s.u} initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} exit={{ scaleX: 0, opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} />)}
              </AnimatePresence>
            </span>
            <span className="xsk-ghost"><i /><span className="x-mono">one monolithic guide</span></span>
          </div>
        </div>
      </LayoutGroup>
    </div>
  );
}

function Hero() {
  return (
    <section className="xsk-hero" aria-labelledby="xsk-h1">
      <div className="x-wrap xsk-hero-grid">
        <div className="xsk-intro">
          <motion.p className="xsk-repo" {...up(0)}><A to="https://github.com/hanzoai" className="x-mono"><Gh />hanzoai/skills</A></motion.p>
          <h1 id="xsk-h1" className="xsk-h1"><span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}>Skills</motion.span></span></h1>
          <motion.p className="xsk-sub" {...up(0.3)}>Development knowledge your coding agent loads only when it needs it</motion.p>
          <motion.div className="xsk-acts" {...up(0.42)}>
            <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><A to="https://github.com/hanzoai" className="x-btn solid" data-thumb="View on GitHub">View on GitHub</A></motion.span>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}>
          <Wake />
        </motion.div>
      </div>
    </section>
  );
}

const POINTS = [
  ['A skill is a markdown file', 'Frontmatter carries a name and a description. Below it is prose, code, and links to related skills. Nothing to compile, nothing to run — you can read one before you trust it.'],
  ['Gateway skills do the finding', 'A gateway is a small skill whose whole job is to notice. Say Postgres and discover-database wakes up; say comptime and discover-zig does. It pulls the specific files and gets out of the way.'],
  ['Install it in one line', <><code>npx skills add https://hanzoskills.com/hanzo.md</code> adds the Hanzo skill to your agent, and hanzoskills.com/llms.txt lists every other one as plain markdown.</>],
  ['Written small on purpose', 'One topic per file, a few hundred lines each. Five focused reads cost less than one monolithic guide, and you get the five that matter instead of the one that covers everything badly.'],
  ['Cross-referenced, not duplicated', 'Skills link to the skills next to them, so an agent following a thread from API design into rate limiting into Redis reads three files and never the same paragraph twice.'],
  ['Add your own', 'Drop a markdown file in a category, give it a name and a description, and it joins discovery. Your house conventions load the same way the public ones do.'],
];

/* The six points as a deck of markdown files: the one you read is on top, the rest wait behind it. */
function Trade() {
  const [ref, live] = useLive(0.35);
  const [at, choose] = useSteps(POINTS.length, 5200, live);
  const n = POINTS.length;
  return (
    <section className="x-sec xsk-trade" data-room="dark" ref={ref} aria-labelledby="xsk-trade-h">
      <div className="x-wrap xsk-trade-grid">
        <div className="xsk-trade-l">
          <h2 id="xsk-trade-h" className="xsk-h2">Coverage costs context. This is the trade.</h2>
          <p className="xsk-count x-mono" aria-live="polite">{pad(at + 1)} / {pad(n)}</p>
          <ul className="xsk-tabs" role="tablist" aria-label="Six points" data-swipe-own="">
            {POINTS.map(([t], i) => (
              <li key={t} role="presentation">
                <button type="button" role="tab" aria-selected={at === i} aria-controls={'xsk-card-' + i} onClick={() => choose(i)}>
                  <span className="x-mono">{pad(i + 1)}</span>{t}
                  {at === i && live && <motion.i key={at} className="xsk-tab-fill" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 5.2, ease: 'linear' }} aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ul>
          <div className="xsk-nav">
            <button type="button" aria-label="Previous point" onClick={() => choose((at + n - 1) % n)}>←</button>
            <button type="button" aria-label="Next point" onClick={() => choose((at + 1) % n)}>→</button>
          </div>
        </div>
        <div className="xsk-deck">
          {POINTS.map(([t, d], i) => {
            const k = (i - at + n) % n; // 0 is on top; the last one is the card that just left
            const gone = k === n - 1;
            return (
              <motion.article
                key={t} id={'xsk-card-' + i} role="tabpanel" className={'xsk-file' + (k === 0 ? ' on' : '')}
                initial={false}
                animate={{ y: gone ? 46 : k * -16, scale: gone ? 1.02 : 1 - k * 0.045, opacity: gone ? 0 : k > 2 ? 0 : 1 - k * 0.28, zIndex: n - k }}
                transition={{ type: 'spring', stiffness: 220, damping: 28 }}
                aria-hidden={k !== 0} inert={k !== 0}
              >
                <p className="xsk-file-bar x-mono"><span>{pad(i + 1)}</span><span>markdown</span></p>
                <div className="xsk-fm x-mono">
                  <span>---</span>
                  <div className="xsk-fm-n"><em>name:</em><h3>{t}</h3></div>
                  <span><em>description:</em><b aria-hidden="true" /></span>
                  <span>---</span>
                </div>
                <p className="xsk-file-d">{d}</p>
                {i === 2 && <Copy text="npx skills add https://hanzoskills.com/hanzo.md" label="Copy" className="xsk-copy" />}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const THREAD = ['API design', 'rate limiting', 'Redis'];

/* Beyond: the thread from the fifth point, followed file by file. Linked, the shared paragraph lives in one file and the
   others point at it; duplicated, every file carries its own copy and the agent reads it again. */
function Thread() {
  const [ref, live] = useLive(0.4);
  const [at, choose] = useSteps(THREAD.length + 1, 1500, live);
  const [dup, setDup] = useState(false);
  return (
    <section className="x-sec xsk-thread" ref={ref}>
      <div className="x-wrap">
        <header className="xsk-thread-h">
          <p className="x-kick">Follow a thread</p>
          <Rise as="h2" className="xsk-h2" y={20}>API design → rate limiting → Redis</Rise>
        </header>
        <ol className="xsk-files">
          {THREAD.map((t, i) => {
            const read = at > i, now = at === i + 1;
            return (
              <li key={t}>
                <button type="button" aria-pressed={read} className={'xsk-tf' + (read ? ' read' : '') + (now ? ' now' : '')} onClick={() => choose(i + 1)}>
                  <span className="xsk-tf-h"><span className="x-mono">{pad(i + 1)}</span><b>{t}</b>{read && <em className="x-mono">read</em>}</span>
                  <span className="xsk-tf-fm" aria-hidden="true"><i /><i className="l" /></span>
                  <span className="xsk-tf-p" aria-hidden="true"><b /><b /><b className="s" /></span>
                  {/* the paragraph a neighbour also needs: one link in the linked thread, a second copy in the duplicated one */}
                  {i < THREAD.length - 1 && (dup
                    ? <span className="xsk-tf-dup" aria-hidden="true"><b /><b className="s" /></span>
                    : <span className="xsk-tf-link x-mono">→ {THREAD[i + 1]}</span>)}
                  {i > 0 && <span className={'xsk-tf-share' + (dup ? ' twice' : '')} aria-hidden="true"><b /><b className="s" /></span>}
                </button>
                {i < THREAD.length - 1 && <span className={'xsk-wire' + (at > i + 1 ? ' on' : '')} aria-hidden="true"><i /></span>}
              </li>
            );
          })}
        </ol>
        <div className="xsk-read">
          <p className="x-mono"><span>Files read</span><b>{Math.min(at, 3)} / 3</b></p>
          <p className={'x-mono' + (dup ? ' warn' : '')}><span>Paragraphs</span><b>{dup ? 'the same one, read twice' : 'never the same paragraph twice'}</b></p>
          <button type="button" className="xsk-toggle" aria-pressed={dup} onClick={() => setDup(!dup)}>
            <i aria-hidden="true" /><span>{dup ? 'Show it linked' : 'Show it duplicated'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default function Skills() {
  return (
    <main className="xsk">
      <Hero />
      <Trade />
      <Thread />
      <section className="x-sec xsk-start">
        <div className="x-wrap">
          <div className="xsk-start-h">
            <Rise as="h2" className="xsk-h2" y={20}>Get started with Skills</Rise>
            <More to="https://github.com/hanzoai">View on GitHub</More>
          </div>
          <Paste name="Skills" prompt="Read https://hanzo.ai/skill.md and use Hanzo Skills in my project. Start with: hanzo tools skills list" />
        </div>
      </section>
      <Get name="Skills" tag="Reusable agent skills" mark={<span className="xsk-mark" aria-hidden="true"><i /><i /><i /></span>} />
    </main>
  );
}
