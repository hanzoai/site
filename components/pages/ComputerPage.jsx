'use client';
// Signature: A black stage where a virtual desktop settles in under the headline and an agent cursor works software with no API, the desktop switching between reading pixels, OCR boxes, Set-of-Mark labels, voice and running as you
// Beyond: A pre-flight checklist built only from Hanzo's own warnings: a fresh account or VM, the two macOS permissions, page-text redirects
/* Hanzo Computer, v2 (Archetype A, launch: the desktop is the product).
   V2: 8/10 the hero is the page's one dark room, a 7/5 headline over a full-bleed desktop that settles as you scroll and works by itself through six modes; three pinned lenses (pixels, OCR and marks, hands and voice); the pre-flight checklist as the Beyond; an editorial close
   Motion: signature = the agent desktop (cursor travels and clicks, the overlay for each mode comes on). Supporting: Stage
   settle, pinned chapters with clip wipes (components/v2/AppScenes), line-masked headline. Accent: violet, from the
   agent's marks. The desktop's windows are drawn as shapes, not invented software. Every word and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { Copy, Magnetic } from '../ui';
import { A, Go } from '../kit';
import Lines from '../v2/AppLines';
import Stage from '../v2/AppStage';
import Scenes from '../v2/AppScenes';
import '../v2/AppType.css';
import './ComputerPage.css';

const EASE = [0.16, 1, 0.3, 1];
const SLIDES = [
  ['It reads pixels', 'No DOM, no accessibility tree, no selectors to maintain. A native app, a canvas, a remote desktop and a web page all look the same to it — like a screenshot.'],
  ['Mouse and keyboard', 'Mac, Windows, and Linux with an X server. On macOS the terminal asks for Screen Recording and Accessibility the first time, because those are exactly the permissions this needs.'],
  ['OCR when clicking is hard', 'Add -with-ocr to the model and it reads text off the screen to build a map of clickable elements — the fix for a button a model can see but keeps missing by twenty pixels.'],
  ['Set-of-Mark prompting', 'Add -with-som and the screenshot arrives pre-labelled, so the model names a marked element instead of guessing a coordinate.'],
  ['Say it out loud', 'operate --voice takes the objective by microphone. Needs the audio extras and portaudio installed; it is not in the base install.'],
  ['It has whatever you have', 'This runs as you, on your machine, with your logged-in sessions. Give it a fresh user account or a VM before you give it anything that matters — and remember that text on a web page can try to redirect it.'],
];
// where the agent's cursor goes in each mode, in % of the desktop
const PATHS = [
  [[30, 30], [72, 52], [40, 66]],
  [[22, 30], [22, 30], [43, 74]],
  [[13, 22], [24, 44], [43, 74]],
  [[58, 44], [70, 57], [43, 74]],
  [[50, 58], [50, 58], [50, 58]],
  [[60, 50], [90, 3.5], [90, 3.5]],
];
const ROWS = [0, 1, 2, 3, 4];
const MARKS = [[9, 27.5], [37, 73], [56, 40], [68, 52.5], [80, 65], [45.5, 89.5]];
const DWELL = 4800;

/* ---------- the signature: the desktop the agent works ---------- */
function Desktop({ at, live, small }) {
  const path = PATHS[at];
  return (
    <div className={'cp-desk m' + at + (live ? ' live' : '') + (small ? ' small' : '')} aria-hidden="true">
      <img className="cp-wall" src="/models/mori.webp" alt="" />
      <div className="cp-menu"><i /><span /><span /><span /><b className="cp-you">you</b></div>
      <div className="cp-win a">
        <div className="cp-wbar"><i /><i /><i /></div>
      </div>
      <span className="cp-el cp-title" style={{ left: '9%', top: '20.5%', width: '22%' }} />
      <span className="cp-el cp-field" style={{ left: '9%', top: '26%', width: '34%' }}><b /></span>
      {ROWS.map((r) => (
        <span key={r} className="cp-el cp-row" style={{ top: 35 + r * 6.6 + '%' }}><i /><i /><i /></span>
      ))}
      <span className="cp-el cp-btn" style={{ left: '37%', top: '71%' }} />
      <div className="cp-win b"><div className="cp-wbar"><i /><i /><i /></div></div>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((c) => <span key={c} className="cp-el cp-cell" style={{ left: 55 + (c % 3) * 12 + '%', top: 38 + Math.floor(c / 3) * 12.5 + '%' }} />)}
      <div className="cp-dock">{[0, 1, 2, 3, 4, 5].map((d) => <i key={d} />)}</div>

      {/* one layer per mode */}
      <span className="cp-pix" />
      <span className="cp-scan" />
      <div className="cp-ocr">
        {[[8.5, 19.5, 23.5, 4.2], [8.5, 34.4, 15, 4.2], [8.5, 41, 15, 4.2], [8.5, 47.6, 15, 4.2], [36.3, 70.2, 12.4, 6.6]].map(([x, y, w, h], i) => <i key={i} style={{ left: x + '%', top: y + '%', width: w + '%', height: h + '%', '--i': i }} />)}
        <em className="x-mono" style={{ left: '8.5%', top: '14.6%' }}>-with-ocr</em>
      </div>
      <div className="cp-som">
        {MARKS.map(([x, y], i) => <b key={i} className="x-mono" style={{ left: x + '%', top: y + '%', '--i': i }}>{i + 1}</b>)}
        <em className="x-mono" style={{ left: '55%', top: '31.5%' }}>-with-som</em>
      </div>
      <div className="cp-voice"><span className="cp-mic" /><span className="cp-bars">{Array.from({ length: 14 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</span><em className="x-mono">operate --voice</em></div>

      {/* the lane is the desktop's size, so moving it n% moves the cursor n% across the desktop (transform only) */}
      <motion.span className="cp-lane" initial={false}
        animate={{ x: path.map((p) => p[0] + '%'), y: path.map((p) => p[1] + '%') }}
        transition={live ? { duration: 2.4, ease: [0.45, 0, 0.2, 1], times: [0, 0.5, 1] } : { duration: 0 }}>
        <span className="cp-cur">
          <svg viewBox="0 0 24 24" width="26" height="26"><path d="M4 2.5 19 13l-6.6 1.3L9 20.8z" fill="#0a0a0a" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" /></svg>
          {live && <motion.i key={at} initial={{ scale: 0, opacity: 0.9 }} animate={{ scale: 2.6, opacity: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 2.35 }} />}
        </span>
      </motion.span>
    </div>
  );
}

function Machine() {
  const [at, setAtS] = useState(0);
  const [mine, setMine] = useState(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const live = seen && !calm;
  const pick = (i) => { setAtS(i); setMine(true); };
  useEffect(() => {
    if (mine || !live) return;
    const t = setTimeout(() => setAtS((v) => (v + 1) % SLIDES.length), DWELL);
    return () => clearTimeout(t);
  }, [at, mine, live]);
  const key = (e, i) => {
    const n = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!n) return;
    const j = (i + n + SLIDES.length) % SLIDES.length; pick(j);
    e.currentTarget.parentElement.parentElement.children[j]?.querySelector('button')?.focus();
  };
  return (
    <div className="cp-obj" ref={box}>
      <Desktop at={at} live={live} />
      <div className="cp-cap">
        <div className="cp-cap-top">
          <span className="cp-cap-k">If a person can click it, so can this</span>
          <span className="cp-count x-mono av-num">{String(at + 1).padStart(2, '0')} / 06</span>
        </div>
        <ol className="cp-tabs" role="tablist" aria-label="What it does">
          {SLIDES.map(([t], i) => (
            <li key={t}>
              <button type="button" role="tab" aria-selected={i === at} tabIndex={i === at ? 0 : -1} onClick={() => pick(i)} onKeyDown={(e) => key(e, i)}>
                {i === at && <motion.span layoutId="cp-tab" className="cp-tab-bg" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                <span>{t}</span>
                {i === at && !mine && !calm && <i key={'t' + at} className={'cp-tab-t' + (live ? '' : ' paused')} aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="cp-hero av-dark" data-room="dark" aria-labelledby="cp-h1">
      <div className="av-wrap av-grid cp-top">
        <div className="cp-top-l">
          <p className="av-kick"><b>computer.hanzo.ai</b></p>
          <Lines as="h1" id="cp-h1" className="av-display cp-h1" lines={['Hanzo', 'Computer']} now delay={0.1} />
        </div>
        <div className="cp-top-r">
          <p className="av-lede cp-lede">An agent that uses the computer in front of it</p>
          <div className="av-acts">
            <Magnetic strength={0.25}><Go to="https://computer.hanzo.ai" solid>Try Hanzo Computer</Go></Magnetic>
            <i hidden data-thumb="Try Hanzo Computer" data-href="https://computer.hanzo.ai" />
            <Go to="https://docs.hanzo.ai">Documentation</Go>
          </div>
        </div>
      </div>
      <Stage className="cp-stage" data-morph-target="">
        <Machine />
      </Stage>
    </section>
  );
}

/* ---------- three lenses on the desktop, pinned ---------- */
const SAME = ['native app', 'canvas', 'remote desktop', 'web page'];
function Pixels({ on }) {
  return (
    <div className={'cp-vis cp-px' + (on ? ' on' : '')} aria-hidden="true">
      <div className="cp-px-grid">
        {SAME.map((t, i) => (
          <div key={t} className={'cp-px-t t' + i}>
            <span className="cp-px-art"><i /><i /><i /><i /></span>
            <em className="x-mono">{t}</em>
          </div>
        ))}
        <span className="cp-px-mesh" />
        <span className="cp-px-sweep" />
      </div>
      <p className="cp-px-k x-mono">like a screenshot</p>
    </div>
  );
}

function Marks({ on }) {
  return (
    <div className={'cp-vis cp-mk' + (on ? ' on' : '')} aria-hidden="true">
      <div className="cp-mk-win">
        <div className="cp-wbar"><i /><i /><i /></div>
        <div className="cp-mk-body">
          <span className="cp-mk-h" />
          <span className="cp-mk-f" />
          {[64, 48, 56].map((w, i) => <span key={i} className="cp-mk-l" style={{ width: w + '%' }} />)}
          <span className="cp-mk-b" />
          <span className="cp-mk-b2" />
        </div>
        <div className="cp-mk-ocr">{['h', 'f', 'l0', 'l1', 'l2', 'b'].map((k, i) => <i key={k} className={'o-' + k} style={{ '--i': i }} />)}</div>
        <div className="cp-mk-som">{['f', 'b', 'b2', 'h'].map((k, i) => <b key={k} className={'x-mono s-' + k} style={{ '--i': i }}>{i + 1}</b>)}</div>
        <span className="cp-mk-miss"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 2.5 19 13l-6.6 1.3L9 20.8z" fill="#0a0a0a" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" /></svg></span>
      </div>
      <div className="cp-mk-flags x-mono"><span className="f-ocr">-with-ocr</span><span className="f-som">-with-som</span></div>
    </div>
  );
}

function Hands({ on }) {
  return (
    <div className={'cp-vis cp-hd' + (on ? ' on' : '')} aria-hidden="true">
      <div className="cp-hd-os x-mono">{['Mac', 'Windows', 'Linux'].map((o) => <span key={o}>{o}</span>)}</div>
      <div className="cp-hd-perm">
        {['Screen Recording', 'Accessibility'].map((t, i) => (
          <div key={t} className="cp-hd-row" style={{ '--i': i }}>
            <span className="cp-hd-ic" />
            <b>{t}</b>
            <span className="cp-hd-sw"><i /></span>
          </div>
        ))}
      </div>
      <div className="cp-hd-voice">
        <span className="cp-mic" />
        <span className="cp-bars">{Array.from({ length: 22 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</span>
        <em className="x-mono">operate --voice</em>
      </div>
    </div>
  );
}

const Sub = ({ t, d }) => <div className="cp-sub"><p className="cp-sub-t">{t}</p><p className="av-body">{d}</p></div>;
const LENSES = [
  { kick: 'Pixels', title: SLIDES[0][0], body: <p className="av-body cp-sc-b">{SLIDES[0][1]}</p>, visual: (on) => <Pixels on={on} /> },
  { kick: '-with-ocr · -with-som', title: SLIDES[2][0], body: <><p className="av-body cp-sc-b">{SLIDES[2][1]}</p><Sub t={SLIDES[3][0]} d={SLIDES[3][1]} /></>, visual: (on) => <Marks on={on} /> },
  { kick: 'Hands and voice', title: SLIDES[1][0], body: <><p className="av-body cp-sc-b">{SLIDES[1][1]}</p><Sub t={SLIDES[4][0]} d={SLIDES[4][1]} /></>, visual: (on) => <Hands on={on} /> },
];

/* ---------- Beyond: the pre-flight, three of Hanzo's own warnings, ticked off by you ---------- */
const CHECKS = [
  ['A fresh user account or a VM', 'Give it a fresh user account or a VM before you give it anything that matters.'],
  ['Screen Recording and Accessibility', 'On macOS the terminal asks for Screen Recording and Accessibility the first time, because those are exactly the permissions this needs.'],
  ['Text on a web page can redirect it', 'Remember that text on a web page can try to redirect it.'],
];

function Preflight() {
  const [done, setDone] = useState([]);
  const all = done.length === CHECKS.length;
  const flip = (i) => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));
  return (
    <section className="av-sec cp-pre" aria-labelledby="cp-pre-h">
      <div className="av-wrap av-grid">
        <div className="cp-pre-l">
          <p className="av-kick"><b>Before you run it</b></p>
          <h2 id="cp-pre-h" className="av-head">{SLIDES[5][0]}</h2>
          <p className="av-body">{SLIDES[5][1]}</p>
          <div className="cp-meter">
            <span className="cp-meter-n av-num"><b>{done.length}</b> / {CHECKS.length}</span>
            <span className="cp-meter-bar"><motion.i animate={{ scaleX: done.length / CHECKS.length }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} /></span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={all ? 'y' : 'n'} className={'cp-meter-t x-mono' + (all ? ' ok' : '')} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
                {all ? 'Start with: hanzo desktop' : 'Tick each one'}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
        <ul className="cp-checks">
          {CHECKS.map(([t, d], i) => {
            const on = done.includes(i);
            return (
              <li key={t}>
                <button type="button" role="checkbox" aria-checked={on} className={'cp-check' + (on ? ' on' : '')} onClick={() => flip(i)}>
                  <span className="cp-check-n x-mono av-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="cp-check-t"><b>{t}</b><span>{d}</span></span>
                  <span className="cp-box" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="24" height="24"><motion.path d="M6 12.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" initial={false} animate={{ pathLength: on ? 1 : 0 }} transition={{ duration: 0.35, ease: EASE }} /></svg>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ---------- for the software with no API: the editorial close ---------- */
const PASTE = 'Read https://hanzo.ai/skill.md and use Hanzo Computer in my project. Start with: hanzo desktop';

function NoApi() {
  return (
    <section className="av-sec cp-noapi">
      <div className="av-wrap">
        <h2 className="av-display m cp-big">For the software <span className="cp-big-ac">with no API</span></h2>
        <div className="av-grid cp-noapi-g">
          <p className="av-lede cp-noapi-l">The vendor portal that exports one CSV at a time. The desktop tool from 2009. The internal app nobody will reopen. Those.</p>
          <div className="av-acts cp-noapi-r">
            <Go to="https://computer.hanzo.ai" solid>Try Hanzo Computer</Go>
            <Go to="https://github.com/hanzoai/computer">View on GitHub</Go>
          </div>
        </div>
      </div>
    </section>
  );
}

function Ship() {
  return (
    <section className="av-sec tight cp-ship">
      <div className="av-wrap av-grid">
        <div className="cp-paste">
          <p className="av-title">Paste and ship</p>
          <p className="av-body">Paste this into any agent. It reads the skill manifest and calls Computer from there.</p>
          <div className="cp-prompt">
            <span className="av-kick">Agent prompt</span>
            <code className="x-mono">{PASTE}</code>
            <Copy text={PASTE} label="Copy the agent prompt" />
          </div>
        </div>
        <div className="cp-get">
          <p className="av-title">Get Computer</p>
          <p className="av-body">Computer-use for AI</p>
          <dl className="cp-meta">
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
    <main className="av cp" style={{ '--ac': '#7a5cff' }}>
      <Hero />
      <Scenes label="How it sees and acts" items={LENSES} tone={['#fff', '#f5f5f7', '#fff']} className="cp-sc" />
      <Preflight />
      <NoApi />
      <Ship />
    </main>
  );
}
