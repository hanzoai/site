'use client';
// Persona: a developer trying computer use safely.
// Goal: run the container.
// CTA: Get Started (operative.hero, to the docker run on this page); the close is Deploy to Cloud in the Band.
// Metric: cta_click operative.hero
// Signature: live-chat (Live conversation): pick an objective from this page's words and Operative answers on screen; its steps stream in while the hero desktop acts each one out.
// Beyond: pick the provider and only the one environment variable in the command changes; the container stays the same.
/* Operative.
   V2: 8/10 Motion map: live-chat — the hero desktop grew a conversation (three objectives, scripted steps that stream while the desktop's hands act them out), the 400svh pinned explode became a plain section whose stack explodes once in view (tap to replay), sections reordered (run, inside, the loop, read, providers) and each enters its own way: iris, accordion, zoom-through, deal, orbit-in.
   Signature: live conversation. Beside the hero desktop, "Say what you want" offers three objectives in Hanzo's own
   words (Star on GitHub, Read the Blog, Pull the image). Pick one: it types into the desktop's field, then
   Operative's answer streams in a step at a time (the loop's verb, the hand it uses, what it works on) while the
   cursor, the reading chip, the scan and the keys act out each step. Until the visitor picks, the three take turns.
   No call leaves the page. One docker run types itself and the four ports light. Inside the container the six
   slabs explode once as the section arrives; a row lifts its layer out. The one dark room is the loop: plans,
   acts, looks at the result, goes again, and you can stop it. Get Operative closes the box.
   Entrances (entrances.jsx + Operative.css): Run iris, Inside accordion, the loop zoom-through, Read deal (rules draw, words rise),
   Where the model comes from orbit-in.
   Beyond: choose the provider and only the one environment variable in the command changes; the container, desktop
   and tools stay identical, as Hanzo says. Every word, port and command is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, animate, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { Copy, Mark, Rise, Magnetic } from '../ui';
import { A, Cta, Img, Film } from '../kit';
import A2Lines from '../v2/A2Lines';
import A2Pause from '../v2/A2Pause';
import A2Room from '../v2/A2Room';
import A2Grow from '../v2/A2Grow';
import { T, EMPH, INOUT, MOVE } from '../v2/A2Motion';
import { useEnter } from './operative/entrances';
import HeroDither from './HeroDither';
import '../v2/A2.css';
import './Operative.css';

const HANDS = ['Screen Vision', 'Multimodal Models', 'Cursor Control', 'Keyboard Actions'];
const AIM = [[0.2, 0.3], [0.62, 0.24], [0.7, 0.64], [0.34, 0.7]]; // where the cursor goes, as fractions of the screen
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

function useLive(ref, amount = 0.2) {
  const seen = useInView(ref, { amount });
  const calm = useReducedMotion();
  return [seen && !calm, calm];
}

/* The desktop inside the box, worked by one hand at a time; a hovered hand shows as a ghost.
   It is a working screen at every moment: the objective (Hanzo's own words on this page) types itself in the first
   second and stays, the caret sits at the end of what is typed, the window's button and the keys carry Hanzo's words,
   and each hand's cursor goes to the real thing it works (measured, so it lands on the button at any width). With
   JavaScript off or reduced motion it rests finished: the objective typed and the reading chip showing. */
const GO = 'Run it and watch'; // the window's button

/* The signature, live-chat: three objectives taken from this page's own words. Pick one and Operative answers on
   screen: its steps stream in (the loop's verb, the hand it uses, what it works on) while the desktop above acts each
   one out. Scripted from Hanzo's text only; no call leaves the page. */
const ASK = [
  { q: 'Star on GitHub', btn: 'Star on GitHub', keys: ['Star', 'on', 'GitHub'], steps: [
    ['plans', 0, 'localhost:8501'], ['plans', 1, 'Open Source on GitHub'], ['acts', 2, 'Star on GitHub'], ['looks at the result', 0, 'GitHub']] },
  { q: 'Read the Blog', btn: 'Read the Blog', keys: ['Read', 'the', 'Blog'], steps: [
    ['plans', 0, 'localhost:6080'], ['plans', 1, 'Read the Blog'], ['acts', 2, 'Read the Blog'], ['looks at the result', 0, 'Watch it work']] },
  { q: 'Pull the image', btn: GO, keys: ['docker', 'pull'], steps: [
    ['plans', 1, 'Bash and a file editor too'], ['acts', 3, 'docker pull ghcr.io/hanzoai/operative:latest'], ['looks at the result', 0, 'Xvfb'], ['goes again', 1, 'ghcr.io/hanzoai/operative:latest']] },
];

function Desk({ at, peek, rest, live, goal, btnLabel, keys, run }) {
  const box = useRef(null), typed = useRef(null), chip = useRef(null), btn = useRef(null), caret = useRef(null);
  const [aim, setAim] = useState(AIM);
  const read = useRef(() => {});
  useEffect(() => { read.current(); }, [at, peek, btnLabel]); // the caret moves as it types: measure again when a hand moves
  useEffect(() => { // each objective types itself into the field when its run starts; an interrupted run leaves it whole
    const el = typed.current;
    if (!el) return;
    if (!live) { el.textContent = goal; read.current(); return; }
    let i = 0, t;
    el.textContent = '';
    const step = () => { i += 1; el.textContent = goal.slice(0, i); if (i < goal.length) t = setTimeout(step, 55); else read.current(); };
    t = setTimeout(step, 55);
    return () => { clearTimeout(t); el.textContent = goal; };
  }, [live, goal, run]);
  useEffect(() => { // where each hand's cursor goes, as fractions of the screen
    const b = box.current;
    if (!b) return;
    const at2 = (el, fx, fy) => { const r = el.getBoundingClientRect(), o = b.getBoundingClientRect(); return [clamp((r.left + r.width * fx - o.left) / o.width), clamp((r.top + r.height * fy - o.top) / o.height)]; };
    const next = () => {
      const v = [AIM[0], at2(chip.current, 0.2, 0.55), at2(btn.current, 0.55, 0.6), at2(caret.current, 0.5, 0.7)];
      setAim((o) => (o.every((p, i) => p[0] === v[i][0] && p[1] === v[i][1]) ? o : v));
    };
    read.current = next;
    next();
    const ro = new ResizeObserver(next);
    ro.observe(b);
    return () => ro.disconnect();
  }, []);
  const [x, y] = aim[at];
  const g = aim[peek ?? at];
  return (
    <div className={'xov-desk h' + at + (peek != null && peek !== at ? ' pk' + peek : '') + (rest ? ' rest' : '')} aria-hidden="true">
      <div className="xov-desk-bar"><i /><i /><i /><span className="x-mono">Xvfb</span><span className="x-mono xov-desk-r">localhost:8501</span></div>
      <div className="xov-desk-in" ref={box}>
        <Img className="xov-wall" src="/models/iro.webp" alt="" w={1200} h={1500} sizes="(max-width: 900px) 100vw, 1152px" priority />
        <div className="xov-win">
          <div className="xov-win-bar"><i /><i /><i /></div>
          <div className="xov-win-body">
            <p className="xov-win-h">Say what you want</p>
            <p className="xov-win-p">Type an objective and it plans, acts, looks at the result, and goes again.</p>
            <div className="xov-field"><span className="xov-typed x-mono" ref={typed}>{goal}</span><b ref={caret} /></div>
            <div className="xov-win-btn" ref={btn}>{btnLabel}</div>
          </div>
        </div>
        <div className="xov-scan" />
        <div className="xov-read" ref={chip}><Mark size={14} /><span>Multimodal Models</span></div>
        <div className="xov-keys" key={run}>{keys.map((w, i) => <b key={w} className="x-mono" style={{ '--k': i }}>{w}</b>)}</div>
        {/* the layer is the screen's size, so a % translate is a % of the screen: the cursor moves by transform only */}
        <motion.div className={'xov-aim-w xov-ghost-w' + (peek != null && peek !== at ? ' on' : '')} animate={{ x: g[0] * 100 + '%', y: g[1] * 100 + '%' }} transition={{ duration: T.slow, ease: EMPH }}>
          <span className="xov-aim"><svg viewBox="0 0 20 20" width="22" height="22"><path d="M3 2l12 7-5.2 1.3L7 16z" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" /></svg></span>
        </motion.div>
        <motion.div className="xov-aim-w" animate={{ x: x * 100 + '%', y: y * 100 + '%' }} transition={{ duration: T.slower, ease: EMPH }}>
          <span className="xov-aim"><svg viewBox="0 0 20 20" width="22" height="22"><path d="M3 2l12 7-5.2 1.3L7 16z" fill="#0a0a0a" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" /></svg><span className="xov-ring" key={at} /></span>
        </motion.div>
      </div>
    </div>
  );
}

function Hero() {
  const ref = useRef(null);
  const [live, calm] = useLive(ref, 0.15);
  const [paused, setPaused] = useState(false);
  const [peek, setPeek] = useState(null);
  const [ask, setAsk] = useState(0); // which objective
  const [shown, setShown] = useState(ASK[0].steps.length); // how many of its steps have streamed in (server: all of them)
  const [run, setRun] = useState(0); // a counter: each new run retypes the objective
  const [going, setGoing] = useState(false); // a run is streaming
  const [auto, setAuto] = useState(true); // until the visitor picks, the three objectives take turns by themselves
  const [hand, setHand] = useState(null); // a hand chosen by its button overrides the run's
  const started = useRef(false);
  const [ready, setReady] = useState(false); // before hydration (and with JS off) the desktop rests finished
  useEffect(() => setReady(true), []);
  const steps = ASK[ask].steps;
  useEffect(() => { // the first run starts by itself within a second of the hero being seen
    if (!live || started.current) return;
    started.current = true;
    setShown(0); setRun((r) => r + 1); setGoing(true);
  }, [live]);
  useEffect(() => { // one timeout at a time streams the next step; the pause control holds it
    if (!live || paused || !going) return;
    let t;
    if (shown < steps.length) t = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 900 : 1500);
    else if (auto) t = setTimeout(() => { setAsk((a) => (a + 1) % ASK.length); setShown(0); setRun((r) => r + 1); }, 3200);
    else setGoing(false);
    return () => clearTimeout(t);
  }, [live, paused, going, shown, auto, steps.length]);
  const pick = (i) => { // the visitor asks: the run restarts on that objective (all at once under reduced motion)
    setAuto(false); setHand(null); setAsk(i); setRun((r) => r + 1); started.current = true;
    if (calm) { setShown(ASK[i].steps.length); setGoing(false); } else { setShown(0); setGoing(true); }
  };
  const choose = (i) => { setHand(i); setAuto(false); setGoing(false); setShown(steps.length); };
  const at = hand ?? (shown > 0 ? steps[shown - 1][1] : 0);
  const said = shown > 0 ? steps[shown - 1] : null;
  const tilt = (ev) => { // a pointer tilt of 2.5° at most, fine pointers only
    if (calm || ev.pointerType !== 'mouse') return;
    const r = ev.currentTarget.getBoundingClientRect();
    ev.currentTarget.style.setProperty('--ry', ((ev.clientX - r.left) / r.width - 0.5) * 5 + 'deg');
    ev.currentTarget.style.setProperty('--rx', (0.5 - (ev.clientY - r.top) / r.height) * 5 + 'deg');
  };
  const flat = (ev) => { ev.currentTarget.style.setProperty('--rx', '0deg'); ev.currentTarget.style.setProperty('--ry', '0deg'); };
  return (
    <section className="xov-hero" ref={ref} aria-labelledby="xov-h1">
      <HeroDither />
      <div className="a2-wrap a2-grid xov-top">
        <A2Lines as="h1" id="xov-h1" className="a2-display xov-h1" lines={['Hanzo', 'Operative']} now />
        <p className="a2-kick">Computer use, in a container</p>
        <p className="a2-lede xov-lede">A container with a Linux desktop inside it, and a model driving that desktop by screenshot, mouse and keyboard.</p>
        <div className="a2-acts xov-acts">
          <Cta to="#get-started" id="operative.hero" thumb>Get Started</Cta>
          <Cta to="https://docs.hanzo.ai" kind="quiet">View Docs</Cta>
        </div>
      </div>
      <div className={'a2-wrap xov-stage' + (paused ? ' a2-paused' : '')}>
        <div className="xov-crate" onPointerMove={tilt} onPointerLeave={flat}>
          <span className="xov-crate-tag x-mono">ghcr.io/hanzoai/operative:latest</span>
          <Desk at={at} peek={peek} rest={!ready || !!calm} live={live && !paused && going} goal={ASK[ask].q} btnLabel={ASK[ask].btn} keys={ASK[ask].keys} run={run} />
          <div className={'xov-chat' + (going ? ' going' : '')} role="group" aria-labelledby="xov-chat-h">
            <p className="xov-chat-h" id="xov-chat-h"><Mark size={14} /><span className="xov-b">Say what you want</span></p>
            <div className="xov-asks">
              {ASK.map((a, i) => (
                <button key={a.q} type="button" aria-pressed={ask === i && !auto} className={ask === i ? 'on' : ''} onClick={() => pick(i)}>{a.q}</button>
              ))}
            </div>
            {/* every conversation is in the page and stacked in one cell, so the box is always the tallest one's height */}
            <div className="xov-logs">
              {ASK.map((a, k) => (
                <div key={a.q} className={'xov-log' + (k === ask ? ' on' : '')} aria-hidden={k === ask ? undefined : true}>
                  <p className="xov-you"><span>{a.q}</span></p>
                  <ol className="xov-says">
                    {a.steps.map(([verb, h, d], i) => (
                      <li key={i} className={(k === ask && i < shown ? 'on' : '') + (k === ask && going && i === shown ? ' next' : '')}>
                        <span className="xov-say"><span className="x-mono xov-verb">{verb}</span><span className="xov-b">{HANDS[h]}</span>{d && <span className="x-mono xov-code">{d}</span>}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
            <p className="xov-chat-f">You can interrupt at any point.</p>
            <p className="x-sr" aria-live="polite">{going && said ? `${said[0]} ${HANDS[said[1]]} ${said[2]}` : ''}</p>
          </div>
        </div>
        <div className="xov-hands">
          <A2Pause paused={paused} onChange={setPaused} label="Pause" className="xov-pause" />
          <p className="xov-hands-k"><span>The container&apos;s hands</span><span className="x-mono">{String(at + 1).padStart(2, '0')} / 04</span></p>
          <ul>
            {HANDS.map((h, i) => (
              <li key={h}>
                <button type="button" aria-pressed={at === i} className={at === i ? 'on' : ''} onClick={() => choose(i)}
                  onPointerEnter={(ev) => ev.pointerType === 'mouse' && setPeek(i)} onPointerLeave={() => setPeek(null)} onFocus={() => setPeek(i)} onBlur={() => setPeek(null)}>
                  <span className="x-mono">{String(i + 1).padStart(2, '0')}</span><span className="xov-b">{h}</span>{going && at === i && <i key={run + '-' + shown} />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* What is in the container: six slabs pressed into one box. The scroll explodes them, then lifts each one out in turn. */
const INSIDE = [
  ['A desktop in the image', 'Xvfb and X11 give the container a screen with no monitor attached, so a real window manager and real applications run inside it.', 'Xvfb · X11'],
  ['Watch it work', 'VNC on 5900 for a native client, noVNC on 6080 in a browser, and the control page on 8501. You see the cursor move as it moves.', '5900 · 6080 · 8501'],
  ['Say what you want', 'Type an objective and it plans, acts, looks at the result, and goes again. You can interrupt at any point.', 'objective'],
  ['Bash and a file editor too', 'Not only the screen. It can run a command or edit a file directly when that is the shorter path, instead of typing into a GUI text editor.', 'Bash · edit'],
  ['Blast radius is the container', 'Stop it and everything it touched goes with it. Give it the narrowest privileges and an allowlist of domains, and keep credentials that matter out of the image.', 'allowlist'],
  ['Where the model comes from', 'The API directly, AWS Bedrock, or Google Vertex — chosen with an environment variable. The container is the same in all three cases.', 'API · Bedrock · Vertex'],
];

function Slab({ i, k, pos, on, hov }) {
  const f = useTransform(pos, (x) => Math.max(0, 1 - Math.abs(x - i))); // how far this layer has lifted out and opened
  const s = useTransform(pos, (x) => clamp(i - x, -1, 1)); // above the open layer (+1) or below it (-1)
  const bits = k.split(' · ');
  return (
    <motion.div className={'xov-slab' + (on ? ' on' : '') + (hov ? ' hov' : '')} style={{ '--i': i, '--f': f, '--s': s }}>
      <span className={'xov-face xov-face' + i}><i /><i /><i /></span>
      <span className="xov-slab-k x-mono">{bits.map((b, j) => <b key={b} style={{ '--j': j - (bits.length - 1) / 2 }}>{b}</b>)}</span>
    </motion.div>
  );
}

/* Entrance 2, accordion: the rows unfold one after another, pleated (each folds the other way from the last).
   Then the container explodes once, a short moment, not a scroll chapter: the six slabs part upward when the
   section is in view. A row lifts its layer out (tap or Enter); clicking the stack presses it shut and opens it again. */
function Inside() {
  const [ref, enter] = useEnter(0.2);
  const stack = useRef(null);
  const calm = useReducedMotion();
  const seen = useInView(stack, { once: true, amount: 0.4 });
  const [on, setOn] = useState(0);
  const [hov, setHov] = useState(-1);
  const pos = useMotionValue(0);
  const e = useMotionValue(1); // how far apart the slabs are; the server and reduced motion show them apart
  const armed = useRef(false);
  useEffect(() => { // below the fold, close the box first so it can open when it arrives
    if (calm || seen) return;
    e.set(0); armed.current = true;
  }, [calm]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (seen && armed.current) animate(e, 1, { duration: T.scene * 1.4, ease: EMPH, delay: 0.5 });
  }, [seen, e]);
  const go = (k) => { setOn(k); if (calm) pos.set(k); else animate(pos, k, { duration: T.slower, ease: EMPH }); };
  const again = () => { // press it shut and let it come apart again
    if (calm) return;
    animate(e, 0, { duration: T.slow, ease: INOUT }).then(() => animate(e, 1, { duration: T.scene, ease: EMPH }));
  };
  return (
    <section className="a2-sec xov-inside" ref={ref} data-enter={enter} aria-labelledby="xov-in">
      <noscript><style>{'.xov-slot{display:block!important}.xov-slot p{opacity:1!important;transform:none!important;margin:0 0 12px!important}.xov-list button{color:var(--ink)!important}'}</style></noscript>
      <div>
        <div className="a2-wrap a2-grid xov-inside-grid">
          <div className="xov-inside-copy">
            <p className="a2-kick xov-fold" style={{ '--n': 0 }}>What is in the container</p>
            <h2 id="xov-in" className="a2-headline xov-fold" style={{ '--n': 1 }}>A screen, a way to watch it, and the tools the model drives it with</h2>
            <ol className="xov-list">
              {INSIDE.map(([t], i) => (
                <li key={t} className={'xov-fold' + (i === on ? ' on' : '')} style={{ '--n': i + 2 }}>
                  <button type="button" aria-current={i === on ? 'step' : undefined} aria-describedby={'xov-d' + i} onClick={() => go(i)}
                    onPointerEnter={(ev) => ev.pointerType === 'mouse' && setHov(i)} onPointerLeave={() => setHov(-1)}>
                    <span className="x-mono">{String(i + 1).padStart(2, '0')}</span><span className="xov-b">{t}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="xov-slot xov-fold" style={{ '--n': 8 }}>
              {INSIDE.map(([t, d], i) => <p key={t} id={'xov-d' + i} className={i === on ? 'on' : ''} aria-hidden={i === on ? undefined : true}>{d}</p>)}
            </div>
            <p className="xov-oss xov-fold" style={{ '--n': 9 }}>Open Source on <A to="https://github.com/hanzoai">GitHub</A></p>
          </div>
          <motion.div className="xov-stack" ref={stack} aria-hidden="true" style={{ '--e': e }} onClick={again}>
            {INSIDE.map(([t, , k], i) => <Slab key={t} i={i} k={k} pos={pos} on={i === on} hov={i === hov} />)}
            <div className="xov-base x-mono"><span>ghcr.io/hanzoai/operative:latest</span></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* One docker run: the two commands type themselves, then the four ports come up one by one. */
const PULL = 'docker pull ghcr.io/hanzoai/operative:latest';
const RUN = 'docker run -e ANTHROPIC_API_KEY -p 8501:8501 -p 6080:6080 -p 5900:5900 -p 8080:8080 -it ghcr.io/hanzoai/operative:latest';
const PORTS = [['8501', 'the control page'], ['6080', 'noVNC on 6080 in a browser'], ['5900', 'VNC on 5900 for a native client'], ['8080', '']];
const USAGE = [
  ['Watch it in a browser, no VNC client needed', 'open http://localhost:6080'],
  ['Send the model through Bedrock instead', 'docker run -e API_PROVIDER=bedrock -e AWS_PROFILE -e AWS_REGION=us-west-2 …'],
  ['Or through Vertex', 'docker run -e API_PROVIDER=vertex -e VERTEX_REGION -e VERTEX_PROJECT_ID …'],
  ['Keep the session between runs', 'docker run -v $HOME/.anthropic:/home/operative/.anthropic …'],
];
const REQ = ['Docker. Nothing else installed on the host', 'A key for the API, Bedrock, or Vertex', 'Four ports free: 8501, 6080, 5900, 8080', 'Give the container the fewest privileges that work'];

function Run() {
  const ref = useRef(null);
  const [live, calm] = useLive(ref, 0.35);
  const pull = useRef(null), run = useRef(null);
  const [lit, setLit] = useState(4);
  const [go, setGo] = useState(0);
  const done = useRef(-1);
  const [iris, enter] = useEnter(0.2); // entrance 1, iris: the terminal and its ports open from a circle at the centre
  useEffect(() => { // typing writes to text nodes, not React state
    if (!live || calm || done.current === go) return;
    let i = 0, t = 0;
    const all = PULL.length + RUN.length;
    setLit(0);
    const draw = () => { if (!pull.current) return; pull.current.textContent = PULL.slice(0, i); run.current.textContent = i > PULL.length ? RUN.slice(0, i - PULL.length) : ''; };
    const typing = () => {
      const was = i;
      i = Math.min(all, i + 2);
      draw();
      if (i < all) t = setTimeout(typing, was < PULL.length && i >= PULL.length ? 500 : 18);
      else { let k = 0; const next = () => { k += 1; setLit(k); if (k < 4) t = setTimeout(next, 420); else done.current = go; }; t = setTimeout(next, 300); }
    };
    draw();
    t = setTimeout(typing, 400);
    return () => { clearTimeout(t); setLit(4); if (pull.current) { pull.current.textContent = PULL; run.current.textContent = RUN; } };
  }, [live, calm, go]);
  return (
    <section className="a2-sec xov-run" id="get-started" ref={ref} aria-labelledby="xov-run">
      <div className="a2-wrap" ref={iris} data-enter={enter}>
        <div className="a2-grid xov-run-head">
          <h2 id="xov-run" className="a2-headline xov-run-h">One docker run</h2>
          <p className="a2-lede xov-run-l">Nothing is installed on your machine. The desktop, the tools and the agent are all inside the image</p>
        </div>
        <div className="a2-grid xov-run-grid">
          <div className="xov-term">
            <div className="xov-term-bar"><i /><i /><i /><span className="xov-b">Installation</span><button type="button" className="xov-replay" onClick={() => setGo((g) => g + 1)}>Replay</button></div>
            <ol className="xov-steps">
              <li><span className="xov-n x-mono">1</span><p id="xov-s1">Pull the image</p><div className="xov-scroll" tabIndex={0} role="region" aria-labelledby="xov-s1"><code className="x-mono xov-type"><span className="xov-ghost" aria-hidden="true">$ {PULL}</span><span><span className="xov-p">$</span> <span ref={pull}>{PULL}</span></span></code></div></li>
              <li><span className="xov-n x-mono">2</span><p id="xov-s2">Run it with your key and the four ports</p><div className="xov-scroll" tabIndex={0} role="region" aria-labelledby="xov-s2"><code className="x-mono xov-type"><span className="xov-ghost" aria-hidden="true">$ {RUN}_</span><span><span className="xov-p">$</span> <span ref={run}>{RUN}</span><i className="xov-caret" /></span></code></div></li>
              <li><span className="xov-n x-mono">3</span><p>Open localhost:8501 and type an objective</p></li>
            </ol>
            <div className="xov-term-f"><Copy text={PULL + '\n' + RUN} label="Copy Installation Commands" /></div>
          </div>
          <div className="xov-ports">
            <span className="x-mono xov-ports-k">operative</span>
            {PORTS.map(([p, what], i) => (
              <div key={p} className={'xov-port' + (i < lit ? ' on' : '')}>
                <span className="a2-fig">{p}</span>
                <span className="xov-port-w">{what && <span>{what}</span>}<span className="x-mono xov-code" aria-hidden="true">-p {p}:{p}</span></span>
                <i aria-hidden="true" />
              </div>
            ))}
          </div>
          <div className="xov-more-w">
            <details className="xov-dis">
              <summary><h3 className="a2-title">System Requirements</h3><i aria-hidden="true" /></summary>
              <ul className="xov-req">{REQ.map((r) => <li key={r}>{'• ' + r}</li>)}</ul>
            </details>
            <details className="xov-dis">
              <summary><h3 className="a2-title">Basic Usage</h3><i aria-hidden="true" /></summary>
              <ul className="xov-usage">{USAGE.map(([t, c], i) => <li key={t}><p id={'xov-u' + i}>{t}</p><div className="xov-scroll" tabIndex={0} role="region" aria-labelledby={'xov-u' + i}><span className="x-mono xov-code">{c}</span></div></li>)}</ul>
            </details>
          </div>
        </div>
        <p className="xov-warn">Computer use is beta, and instructions written into a web page or an image can try to talk to the model as if they were you. Limit outbound traffic to domains you name, and ask for a human yes before anything with consequences outside the container.</p>
      </div>
    </section>
  );
}

/* Which way in: the four providers as tabs over one panel; only the one variable in the command changes. */
const WAYS = [
  { k: 'Hanzo', by: 'The default', rec: true, pts: ['Runs through api.hanzo.ai', 'Every run shows up in the console with its cost', 'Bring a Hanzo key, or one you already have'], set: 'Pick the model in the sidebar', env: '-e HANZO_API_KEY …' },
  { k: 'Direct', by: 'Straight to the model vendor', pts: ['No Hanzo in the request path', 'Your existing key and your existing bill', 'Nothing here to log the run for you'], set: 'Set API_PROVIDER=anthropic', env: '-e API_PROVIDER=anthropic …' },
  { k: 'Bedrock', by: 'Inside your AWS account', pts: ['Reads your local AWS profile', 'Stays in the region you name', 'For when the model must not leave your account'], set: 'Set API_PROVIDER=bedrock', env: '-e API_PROVIDER=bedrock -e AWS_PROFILE …' },
  { k: 'Vertex', by: 'Inside your Google Cloud project', pts: ['Application default credentials', 'Names a region and a project id', 'Same container, same desktop, same tools'], set: 'Set API_PROVIDER=vertex', env: '-e API_PROVIDER=vertex -e VERTEX_PROJECT_ID …' },
];

function Ways() {
  const [at, choose] = useState(0); // changes only when you choose
  const [peek, setPeek] = useState(null); // a hovered provider previews its variable in the command
  const tabs = useRef([]);
  const show = peek ?? at;
  const [orbit, enter] = useEnter(0.25); // entrance 5, orbit-in: the four ways in swing round on a curve into their places
  const key = (ev, i) => { // APG tabs: arrows, Home and End move and select
    const n = WAYS.length;
    const to = { ArrowRight: (i + 1) % n, ArrowLeft: (i + n - 1) % n, Home: 0, End: n - 1 }[ev.key];
    if (to == null) return;
    ev.preventDefault();
    choose(to);
    tabs.current[to]?.focus();
  };
  return (
    <section className="a2-sec xov-ways" aria-labelledby="xov-ways">
      <div className="a2-wrap" ref={orbit} data-enter={enter}>
        <div className="a2-grid xov-ways-head">
          <h2 id="xov-ways" className="a2-headline xov-ways-h xov-orb" style={{ '--n': 0 }}>Where the model comes from</h2>
          <p className="a2-lede xov-ways-l xov-orb" style={{ '--n': 1 }}>One environment variable decides. The container, the desktop and the tools are identical in all four cases</p>
        </div>
        <div className="xov-seg" role="tablist" aria-labelledby="xov-ways">
          {WAYS.map((v, i) => (
            <button key={v.k} ref={(el) => { tabs.current[i] = el; }} type="button" role="tab" id={'xov-tab-' + i} aria-selected={at === i} aria-controls={'xov-way-' + i} tabIndex={at === i ? 0 : -1} className="xov-orb" style={{ '--n': i + 2 }}
              onClick={() => choose(i)} onKeyDown={(ev) => key(ev, i)} onPointerEnter={(ev) => ev.pointerType === 'mouse' && setPeek(i)} onPointerLeave={() => setPeek(null)}>
              {at === i && <motion.span layoutId="xov-seg" className="xov-seg-bg" transition={MOVE} />}
              <span>{v.k}</span>
            </button>
          ))}
        </div>
        <div className={'xov-cmd x-mono xov-orb' + (show !== at ? ' peek' : '')} style={{ '--n': 6 }} tabIndex={0} role="region" aria-labelledby="xov-ways">
          <span className="xov-p">$</span> docker run{' '}
          <span className="xov-env">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={show} initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={MOVE}>{WAYS[show].env}</motion.span>
            </AnimatePresence>
          </span>{' '}
          <span className="xov-same">ghcr.io/hanzoai/operative:latest</span>
        </div>
        <div className="xov-panels xov-orb" style={{ '--n': 7 }}>
          {WAYS.map((v, i) => (
            <div key={v.k} id={'xov-way-' + i} role="tabpanel" aria-labelledby={'xov-tab-' + i} tabIndex={0} hidden={at !== i} className="xov-way">
              <div className="xov-way-id">
                <p className="xov-way-k">{v.k}{v.rec && <span className="xov-rec">Recommended</span>}</p>
                <p className="xov-way-by">by {v.by}</p>
              </div>
              <ol className="xov-way-pts">{v.pts.map((p, j) => <li key={p} style={{ '--j': j }}><span className="x-mono" aria-hidden="true">{String(j + 1).padStart(2, '0')}</span><span>{p}</span></li>)}</ol>
              <div className="xov-way-set">
                <p>{v.set}</p>
                <span className="x-mono xov-code">{'docker run ' + v.env}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="xov-note">Which model a provider offers changes; the container does not. The <A to="https://docs.hanzo.ai">documentation</A> lists what each one currently accepts.</p>
      </div>
    </section>
  );
}

/* The one dark room: the loop as huge type, and a hand to stop it. */
const LOOP = ['plans', 'acts', 'looks at the result', 'goes again'];

function Action() {
  const [ref, enter] = useEnter(0.2); // entrance 3, zoom-through: the room's contents fly in from far behind the screen
  const [live] = useLive(ref, 0.3);
  const [held, setHeld] = useState(false);
  const [k, setK] = useState(0);
  const screen = useRef(null);
  useEffect(() => { // the pause control holds the film as well as the loop
    const v = screen.current?.querySelector('video');
    if (!v) return;
    if (held) v.pause(); else if (live) v.play?.().catch(() => {});
  }, [held, live]);
  useEffect(() => { // a chain of timeouts (no setInterval); the pause control stops it
    if (!live || held) return;
    const t = setTimeout(() => setK((v) => (v + 1) % 4), 1500);
    return () => clearTimeout(t);
  }, [k, live, held]);
  return (
    <A2Room className="a2-sec xov-act" aria-labelledby="xov-act">
      <div className="a2-wrap a2-grid xov-zoom" ref={ref} data-enter={enter}>
        <div className="xov-act-copy">
          <h2 id="xov-act" className="a2-headline">See Operative in Action</h2>
          <p className="a2-body">Watch as Hanzo Operative uses multimodal AI to router interfaces, complete tasks, and solve problems autonomously.</p>
          <div className="xov-act-links">
            <A2Pause paused={held} onChange={setHeld} label="Pause" />
            <A to="https://docs.hanzo.ai" className="xov-more"><span>View more examples →</span></A>
          </div>
        </div>
        <div className="xov-loop-w">
          <A2Grow to={1.3}>
            <ol className="xov-loop">
              {LOOP.map((l, i) => <li key={l} className={(i === k ? 'on' : '') + (held ? ' held' : '')}><span className="x-mono">{String(i + 1).padStart(2, '0')}</span>{l}</li>)}
            </ol>
          </A2Grow>
        </div>
        <div className="xov-browser" aria-hidden="true">
          <div className="xov-browser-bar"><i /><i /><i /><span className="x-mono">localhost:6080</span><em>Demo Video</em></div>
          <div className={'xov-screen s' + k + (held ? ' held' : '')} ref={screen}>
            <Film src="/models/koma.webm" poster="/models/koma.webp" w={1200} h={1500} />
            <div className="xov-shot" />
            <motion.div className="xov-aim-w" animate={{ x: AIM[k][0] * 100 + '%', y: AIM[k][1] * 100 + '%' }} transition={{ duration: T.slower, ease: EMPH }}>
              <span className="xov-aim"><svg viewBox="0 0 20 20" width="24" height="24"><path d="M3 2l12 7-5.2 1.3L7 16z" fill="#fff" stroke="#0a0a0a" strokeWidth="1.2" strokeLinejoin="round" /></svg></span>
            </motion.div>
          </div>
        </div>
      </div>
    </A2Room>
  );
}

const SOCIAL = [['Star on GitHub', 'https://github.com/hanzoai'], ['Join Discord Community', 'https://discord.gg/XthHQQj'], ['Read the Blog', 'https://hanzo.blog/blog/2025-04-20-hanzo-operative-launch/'], ['Follow Updates', 'https://twitter.com/hanzoai'], ['Contribute', 'https://github.com/hanzoai']];

/* Read before you run it, and the box closed again: the six layers press back into one image. */
function Watch() {
  const box = useRef(null);
  const [deal, enter] = useEnter(0.25); // entrance 4, deal: each row's rule draws across, then its words rise onto it
  const shut = useInView(box, { once: true, amount: 0.5 });
  return (
    <section className="a2-sec xov-watch" aria-labelledby="xov-read-h">
      <div className="a2-wrap a2-grid">
        <div className="xov-read-b" ref={deal} data-enter={enter}>
          <h2 id="xov-read-h" className="a2-headline">Read before you run it</h2>
          <div className="a2-acts"><Cta to="https://docs.hanzo.ai" kind="quiet">Read the docs</Cta><Cta to="https://github.com/hanzoai" kind="link">View on GitHub</Cta></div>
          <ul className="xov-social">{SOCIAL.map(([t, to], n) => <li key={t} style={{ '--n': n }}><A to={to} className="xov-soc"><span>{t}</span><i aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M4.5 11.5l7-7M5.5 4.5h6v6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></i></A></li>)}</ul>
        </div>
        <div className={'xov-get' + (shut ? ' shut' : '')} ref={box}>
          <div className="xov-get-t">
            <h2 className="a2-headline">Get Operative</h2>
            <p>Computer-use harness</p>
            <p className="xov-get-meta x-mono"><span><span>License:</span> Apache-2.0</span><A to="https://github.com/hanzoai">hanzoai</A></p>
          </div>
          <div className="xov-box" aria-hidden="true">
            {INSIDE.map(([t], i) => <i key={t} style={{ '--i': 5 - i }} />)}
            <p className="xov-get-cmd x-mono">docker pull <span>ghcr.io/hanzoai/operative:latest</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* The close, page-local: the kit Band's word reveal blurs (MASTER part 9 bans it; requested in docs/requests/operative.md),
   so the headline rises out of its line mask instead, and the ask carries its data-cta. */
function Close() {
  return (
    <section className="x-band xov-band" data-room="dark" aria-labelledby="xov-band-h">
      <div className="x-wrap">
        <A2Lines as="h2" id="xov-band-h" lines={['Run it and watch']} />
        <Rise as="p" delay={0.2}>The most useful hour you can spend with computer use is the first one, watching where it gets stuck.</Rise>
        <Rise delay={0.3} className="x-band-act">
          <Magnetic><Cta to="https://platform.hanzo.ai/deploy" id="operative.band" className="xov-band-go">Deploy to Cloud</Cta></Magnetic>
        </Rise>
      </div>
    </section>
  );
}

export default function Operative() {
  return (
    <main className="a2 xov">
      <Hero />
      <Run />
      <Inside />
      <Action />
      <Watch />
      <Ways />
      <Close />
    </main>
  );
}
