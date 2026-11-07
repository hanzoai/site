'use client';
/* Computer. Signature: a virtual desktop with an agent cursor working software that has no API. The six things Hanzo says
   about it play on that desktop in turn: it reads the screen as pixels, drives the mouse and keyboard, reads text off the
   screen with OCR, labels what it can click (Set-of-Mark), takes the objective by voice, and runs as you.
   Beyond: a pre-flight checklist built only from Hanzo's own warnings (a fresh account or VM, the two macOS permissions,
   text on a page that can redirect it) to tick before you give it anything that matters.
   Every word and link is Hanzo's; the desktop's windows are drawn as shapes, not invented software. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Copy } from '../ui';
import { A, Go } from '../kit';
import './ComputerPage.css';

const SLIDES = [
  ['It reads pixels', 'No DOM, no accessibility tree, no selectors to maintain. A native app, a canvas, a remote desktop and a web page all look the same to it — like a screenshot.'],
  ['Mouse and keyboard', 'Mac, Windows, and Linux with an X server. On macOS the terminal asks for Screen Recording and Accessibility the first time, because those are exactly the permissions this needs.'],
  ['OCR when clicking is hard', 'Add -with-ocr to the model and it reads text off the screen to build a map of clickable elements — the fix for a button a model can see but keeps missing by twenty pixels.'],
  ['Set-of-Mark prompting', 'Add -with-som and the screenshot arrives pre-labelled, so the model names a marked element instead of guessing a coordinate.'],
  ['Say it out loud', 'operate --voice takes the objective by microphone. Needs the audio extras and portaudio installed; it is not in the base install.'],
  ['It has whatever you have', 'This runs as you, on your machine, with your logged-in sessions. Give it a fresh user account or a VM before you give it anything that matters — and remember that text on a web page can try to redirect it.'],
];
// where the agent's cursor goes on each slide, in % of the desktop
const PATHS = [
  [[30, 30], [62, 44], [44, 70]],
  [[22, 26], [70, 62], [70, 62]],
  [[40, 52], [66, 52], [66, 52]],
  [[24, 30], [74, 68], [74, 68]],
  [[50, 50], [50, 50], [50, 50]],
  [[62, 44], [62, 44], [62, 44]],
];
const MARKS = [[22, 26], [52, 30], [74, 68], [40, 70], [60, 52]];

function Desktop({ at }) {
  const path = PATHS[at];
  return (
    <div className={'xpc-desk m' + at}>
      <img className="xpc-wall" src="/models/iro.webp" alt="" />
      <div className="xpc-menubar" aria-hidden="true"><i /><span /><span /><span /><b /></div>
      <div className="xpc-win a" aria-hidden="true">
        <div className="xpc-wbar"><i /><i /><i /></div>
        <div className="xpc-wbody"><span className="t w60" /><span className="t w40" /><span className="field" /><span className="t w70" /><span className="btn">&nbsp;</span></div>
      </div>
      <div className="xpc-win b" aria-hidden="true">
        <div className="xpc-wbar"><i /><i /><i /></div>
        <div className="xpc-wbody grid">{Array.from({ length: 12 }).map((_, i) => <span key={i} className="cell" />)}</div>
      </div>
      {/* mode layers, one per slide */}
      <span className="xpc-pix" aria-hidden="true" />
      <span className="xpc-scan" aria-hidden="true" />
      <div className="xpc-marks" aria-hidden="true">{MARKS.map(([x, y], i) => <motion.b key={i} style={{ left: x + '%', top: y + '%' }} initial={false} animate={at === 3 ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0 }} transition={{ type: 'spring', stiffness: 420, damping: 24, delay: at === 3 ? 0.1 + i * 0.07 : 0 }}>{i + 1}</motion.b>)}</div>
      <div className="xpc-ocr" aria-hidden="true">{[[38, 46, 22], [58, 46, 18], [36, 56, 30]].map(([x, y, w], i) => <motion.i key={i} style={{ left: x + '%', top: y + '%', width: w + '%' }} initial={false} animate={at === 2 ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0.3 }} transition={{ duration: 0.5, ease: EASE, delay: at === 2 ? 0.5 + i * 0.25 : 0 }} />)}</div>
      <div className="xpc-voice" aria-hidden="true">{Array.from({ length: 9 }).map((_, i) => <i key={i} style={{ animationDelay: i * 0.09 + 's' }} />)}</div>
      <div className="xpc-you" aria-hidden="true"><span>you</span></div>
      {/* the lane is the desktop's size, so moving it by n% moves the cursor n% across the desktop (transform only) */}
      <motion.span className="xpc-lane" aria-hidden="true" initial={false}
        animate={{ x: path.map((p) => p[0] + '%'), y: path.map((p) => p[1] + '%') }}
        transition={{ duration: 2.4, ease: [0.45, 0, 0.2, 1], times: [0, 0.5, 1] }}>
        <span className="xpc-cursor">
          <svg viewBox="0 0 24 24" width="26" height="26"><path d="M4 2.5 19 13l-6.6 1.3L9 20.8z" fill="#0a0a0a" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" /></svg>
          <motion.i key={at} initial={{ scale: 0, opacity: 0.8 }} animate={{ scale: 2.4, opacity: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 2.3 }} />
        </span>
      </motion.span>
    </div>
  );
}

function Hero() {
  const [at, setAtState] = useState(0);
  const [mine, setMine] = useState(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const setAt = (i) => { setAtState(i); setMine(true); };
  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setTimeout(() => setAtState((v) => (v + 1) % SLIDES.length), 4600);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen]);
  const key = (e, i) => {
    const n = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!n) return;
    const j = (i + n + SLIDES.length) % SLIDES.length;
    setAt(j);
    e.currentTarget.parentElement.children[j]?.focus();
  };
  return (
    <section className="xpc-hero" ref={box} aria-labelledby="xpc-h1">
      <div className="x-wrap">
        <div className="xpc-top">
          <div>
            <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>computer.hanzo.ai</motion.p>
            <h1 id="xpc-h1" className="xpc-h1"><span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}>Hanzo Computer</motion.span></span></h1>
            <motion.p className="xpc-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}>An agent that uses the computer in front of it</motion.p>
          </div>
          <motion.div className="xpc-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}>
            <A to="https://computer.hanzo.ai" className="x-btn solid" data-thumb="Try Hanzo Computer">Try Hanzo Computer</A>
            <A to="https://docs.hanzo.ai" className="x-btn">Documentation</A>
          </motion.div>
        </div>
        <motion.div className="xpc-stage" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}>
          <Desktop at={at} />
          <div className="xpc-panel">
            <div className="xpc-panel-top">
              <span>If a person can click it, so can this</span>
              <span className="x-mono">{String(at + 1).padStart(2, '0')} / 06</span>
            </div>
            <div className="xpc-caps">
              {SLIDES.map(([t, d], i) => (
                <motion.div key={t} id={'xpc-p' + i} role="tabpanel" aria-labelledby={'xpc-t' + i} className="xpc-cap" initial={false}
                  animate={i === at ? { opacity: 1, y: 0 } : { opacity: 0, y: i < at ? -12 : 12 }} transition={{ duration: 0.45, ease: EASE }} aria-hidden={i !== at}>
                  <h2>{t}</h2>
                  <p>{d}</p>
                </motion.div>
              ))}
            </div>
            <div className="xpc-tabs" role="tablist" aria-label="What it does">
              {SLIDES.map(([t], i) => (
                <button key={t} type="button" role="tab" id={'xpc-t' + i} aria-controls={'xpc-p' + i} aria-selected={i === at} tabIndex={i === at ? 0 : -1} onClick={() => setAt(i)} onKeyDown={(e) => key(e, i)}>
                  <span className="xpc-tab-t">{t}</span>
                  <i aria-hidden="true">{i === at && !mine && <motion.b key={at} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 4.6, ease: 'linear' }} />}</i>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const CHECKS = [
  ['A fresh user account or a VM', 'Give it a fresh user account or a VM before you give it anything that matters.'],
  ['Screen Recording and Accessibility', 'On macOS the terminal asks for Screen Recording and Accessibility the first time, because those are exactly the permissions this needs.'],
  ['Text on a web page can redirect it', 'Remember that text on a web page can try to redirect it.'],
];

/* Before you run it: three of Hanzo's own warnings, ticked off by you. */
function Preflight() {
  const [done, setDone] = useState([]);
  const all = done.length === CHECKS.length;
  const flip = (i) => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));
  return (
    <section className="x-sec xpc-pre" data-room="dark" aria-labelledby="xpc-pre-h">
      <div className="x-wrap xpc-pre-grid">
        <div>
          <p className="x-kick">It has whatever you have</p>
          <h2 id="xpc-pre-h" className="xpc-pre-h">This runs as you, on your machine, with your logged-in sessions.</h2>
          <div className="xpc-meter">
            <span className="x-mono">{done.length} / {CHECKS.length}</span>
            <i><motion.b animate={{ scaleX: done.length / CHECKS.length }} transition={{ type: 'spring', stiffness: 200, damping: 26 }} /></i>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={all ? 'y' : 'n'} className={'xpc-meter-t' + (all ? ' ok' : '')} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
                {all ? 'Start with: hanzo desktop' : 'Before you run it'}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
        <ul className="xpc-checks">
          {CHECKS.map(([t, d], i) => {
            const on = done.includes(i);
            return (
              <li key={t}>
                <button type="button" role="checkbox" aria-checked={on} className={'xpc-check' + (on ? ' on' : '')} onClick={() => flip(i)}>
                  <span className="xpc-box" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22"><motion.path d="M6 12.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" initial={false} animate={{ pathLength: on ? 1 : 0 }} transition={{ duration: 0.35, ease: EASE }} /></svg>
                  </span>
                  <span><b>{t}</b><span>{d}</span></span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

const PASTE = 'Read https://hanzo.ai/skill.md and use Hanzo Computer in my project. Start with: hanzo desktop';

function Paste() {
  return (
    <section className="x-sec xpc-paste-sec">
      <div className="x-wrap xpc-paste">
        <div>
          <p className="x-kick">Paste and ship</p>
          <p className="xpc-paste-l">Paste this into any agent. It reads the skill manifest and calls Computer from there.</p>
        </div>
        <div className="xpc-prompt">
          <div className="xpc-prompt-top"><span className="x-mono">Agent prompt</span><Copy text={PASTE} label="Copy the agent prompt" /></div>
          <pre className="x-mono">{PASTE}<span className="xpc-cur" aria-hidden="true" /></pre>
        </div>
      </div>
    </section>
  );
}

function NoApi() {
  return (
    <section className="x-sec xpc-noapi">
      <div className="x-wrap">
        <h2 className="xpc-big">For the software with no API</h2>
        <div className="xpc-noapi-row">
          <p className="xpc-noapi-l">The vendor portal that exports one CSV at a time. The desktop tool from 2009. The internal app nobody will reopen. Those.</p>
          <div className="xpc-acts">
            <Go to="https://computer.hanzo.ai" solid>Try Hanzo Computer</Go>
            <Go to="https://github.com/hanzoai/computer">View on GitHub</Go>
          </div>
        </div>
        <div className="xpc-get">
          <div>
            <h2>Get Computer</h2>
            <p>Computer-use for AI</p>
          </div>
          <dl className="xpc-meta">
            <div><dt>License:</dt><dd>Apache-2.0</dd></div>
            <div><dt>Source</dt><dd><A to="https://github.com/hanzoai/computer">hanzoai/computer</A> <span className="x-mono">3 stars</span></dd></div>
          </dl>
          <Go to="https://platform.hanzo.ai/deploy" solid>Deploy to Cloud</Go>
        </div>
      </div>
    </section>
  );
}

export default function ComputerPage() {
  return (
    <main className="xpc">
      <Hero />
      <Preflight />
      <Paste />
      <NoApi />
    </main>
  );
}
