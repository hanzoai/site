'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { EASE, Count, fine, Mark, copyText } from './ui';
import A2Pause from './v2/A2Pause';
import C from '../content';
import SetupMenu from './SetupMenu';

const PROMPT = 'Build maxpower: every AI I use in one place, and faster at coding.';
const CMD = 'curl -fsSL https://hanzo.sh | sh';
const ROSTER = [['Hanzo Dev', 'Zen6', 139], ['Claude Code', 'Zen6', 142], ['Codex', 'Opus 4.8', 96], ['Gemini CLI', 'Opus 4.8', 68], ['Antigravity', 'GPT-5.6', 171], ['ChatGPT', 'Fable 5', 120], ['Cursor', 'Fable 5', 116], ['Claude Duet', 'Zen6 Max', 105], ['Claude', 'Zen6 Max', 142], ['Claude Cowork', 'Zen6', 118], ['DeepSeek', 'Opus 4.8', 121], ['Gemini', 'Opus 4.8', 112], ['Grok', 'GPT-5.6', 150], ['Grok Bot', 'GPT-5.6', 113], ['Grok Build', 'Fable 5', 99], ['Kimi', 'Zen6 Max', 118], ['Kimi K3', 'Zen6 Max', 123], ['Hermes Agent', 'Zen6', 88], ['Hanzo Design', 'Zen6', 104], ['Hanzo Bot', 'Opus 4.8', 92], ['AI Agents CLI', 'GPT-5.6', 102], ['MCP Server', 'GPT-5.6', 57], ['Muse', 'Fable 5', 71], ['OpenClaw', 'Fable 5', 110], ['nanoclaw', 'Zen6 Max', 86], ['Perplexity Computer', 'Zen6', 74], ['Manus', 'Zen6', 101], ['Paperclip', 'Opus 4.8', 89], ['OpenAI SDK', 'Opus 4.8', 94], ['Cue', 'GPT-5.6', 76], ['Qwen', 'Fable 5', 138], ['Universal SDKs', 'Fable 5', 152]];
const ICON = Object.fromEntries(C.agents.map((a) => [a.name, a.icon]));
const LOG = ['Wrote app/agents.tsx', 'Wrote lib/keys.ts', 'Ran pnpm test', '└ pass'];

/* The halftone field behind the hero: dense at the edges like Hanzo's, and it swells into a lens under the pointer. */
function Dots({ host }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, cx = cv.getContext('2d'), el = host.current;
    const G = 10, R = 170;
    let W = 0, H = 0, cols = 0, rows = 0, base = null, raf = 0, px = -1e4, py = -1e4, energy = 0, vis = true;
    const field = (x, y) => {
      const ex = Math.max(1 - x / (W * 0.3), (x - W * 0.66) / (W * 0.34), 0);
      const ey = Math.min(1, 0.3 + (y / H) * 0.95);
      const n = 0.6 + 0.4 * Math.sin(x * 0.012 + y * 0.006) * Math.cos(y * 0.014 - x * 0.005);
      return Math.max(0, Math.min(1, ex * ey * n * 1.3));
    };
    const draw = () => {
      cx.clearRect(0, 0, W, H);
      cx.fillStyle = 'rgba(10,10,10,.17)';
      cx.beginPath();
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const x = i * G, y = j * G;
        let f = base[j * cols + i];
        if (energy > 0.01) {
          const d = Math.hypot(x - px, y - py);
          if (d < R) { const k = 1 - d / R; f = Math.min(1, f + k * k * 0.85 * energy); }
        }
        if (f < 0.05) continue;
        const r = f * G * 0.4;
        cx.moveTo(x + r, y);
        cx.arc(x, y, r, 0, 6.2832);
      }
      cx.fill();
    };
    const size = () => {
      const r = el.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(W / G) + 1; rows = Math.ceil(H / G) + 1;
      base = new Float32Array(cols * rows);
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) base[j * cols + i] = field(i * G, j * G);
      draw();
    };
    const loop = () => { energy *= 0.93; draw(); raf = energy > 0.01 && vis ? requestAnimationFrame(loop) : 0; };
    const move = (e) => {
      if (!fine(e)) return;
      const r = cv.getBoundingClientRect();
      px = e.clientX - r.left; py = e.clientY - r.top; energy = 1;
      if (!raf && vis) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([en]) => { vis = en.isIntersecting; });
    io.observe(el);
    const ro = new ResizeObserver(size);
    ro.observe(el);
    el.addEventListener('pointermove', move);
    return () => { io.disconnect(); ro.disconnect(); el.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, [host]);
  return <canvas ref={ref} className="x-dots" aria-hidden="true" />;
}

function Caret() { return <span className="x-caret" aria-hidden="true" />; }

// Every demo part is in the page from the first paint (search engines, screen readers); the demo only reveals them.
function Bubble({ children, me, on = true }) {
  return (
    <motion.div className={'x-bub' + (me ? ' me' : '')} initial={false} animate={on ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.96 }} aria-hidden={on ? undefined : true} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>
      {children}
    </motion.div>
  );
}

function AppCard({ on = true }) {
  return (
    <motion.div className="x-appcard" initial={false} animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }} aria-hidden={on ? undefined : true} transition={{ duration: 0.6, ease: EASE }}>
      <span className="x-appicon"><Mark size={13} /></span>
      <span><b>maxpower</b><small><span>Mobile + Duo app</span></small></span>
      <span className="x-open">Open</span>
    </motion.div>
  );
}

function Roster({ on }) {
  const shown = useRef(on);
  shown.current = on;
  // the list steps up one agent at a time, then rests: alive, without repainting the phone every frame
  const [step, setStep] = useState(0);
  useEffect(() => {
    // row 32 looks exactly like row 0, so the jump back to 0 is invisible
    const t = setInterval(() => { if (shown.current && !document.querySelector('.x-hero[data-off]')) setStep((s) => (s >= ROSTER.length ? 0 : s + 1)); }, 2200);
    return () => clearInterval(t);
  }, []);
  // like Hanzo's demo, every agent's speed moves and the bill ticks: written straight to the text, no re-render
  const box = useRef(null);
  useEffect(() => {
    let cost = 0;
    const t = setInterval(() => {
      if (!shown.current || document.querySelector('.x-hero[data-off]') || !box.current) return;
      box.current.querySelectorAll('[data-tps]').forEach((el) => { if (Math.random() < 0.45) { const b = +el.dataset.tps; el.textContent = Math.max(1, Math.round(b * (0.82 + Math.random() * 0.36))) + '/s'; } });
      cost += 0.0001 + Math.random() * 0.0004;
      const c = box.current.querySelector('[data-cost]');
      if (c) c.textContent = '$' + cost.toFixed(4);
    }, 700);
    return () => clearInterval(t);
  }, []);
  const rows = (k) => ROSTER.map(([n, m, s]) => (
    <div className="x-ros" key={k + n} aria-hidden={k ? true : undefined}>
      <span className="x-ros-i" dangerouslySetInnerHTML={{ __html: ICON[n] || `<b>${n[0]}</b>` }} />
      <span className="x-ros-n"><span>{n}</span><small>{m}</small></span>
      <span className="x-ros-s" data-tps={s}>{s}/s</span>
      <i className="x-ros-bar"><b style={{ width: (s / 171) * 100 + '%' }} /></i>
    </div>
  ));
  return (
    <motion.div className="x-roster" ref={box} initial={false} animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }} aria-hidden={on ? undefined : true} transition={{ duration: 0.7, ease: EASE }}>
      <div className="x-ros-h"><b>maxpower</b><span>All on</span></div>
      <div className="x-ros-view">
        <motion.div animate={{ y: (-step * (100 / (ROSTER.length * 2))) + '%' }} transition={step === 0 ? { duration: 0 } : { type: 'spring', stiffness: 170, damping: 24 }}>
          {rows(0)}{rows(1)}
        </motion.div>
      </div>
      <div className="x-ros-f"><span className="x-mono" data-cost="">$0.0000</span><span className="x-demo">demo</span></div>
    </motion.div>
  );
}

/* The desktop app's account menu: a real button; the menu is always in the page and opens with a spring. */
function Account() {
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  const btn = useRef(null);
  useEffect(() => {
    if (!open) return;
    const away = (e) => { if (!box.current.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [open]);
  return (
    <div className="x-acct" ref={box} onKeyDown={(e) => { if (e.key === 'Escape' && open) { setOpen(false); btn.current.focus(); } }}>
      <button ref={btn} type="button" className="x-acct-b" aria-label="Account" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="8" cy="5.6" r="2.7" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M2.8 13.6c.7-2.4 2.7-3.7 5.2-3.7s4.5 1.3 5.2 3.7" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
      </button>
      <div className="x-acct-m" data-open={open} inert={!open}>
        <div className="x-acct-who"><b>Developer</b><span>dev@hanzo.ai</span></div>
        <a href="https://hanzo.ai/beta" onClick={() => setOpen(false)}>Beta Dashboard</a>
        <button type="button" onClick={() => { setOpen(false); btn.current.focus(); }}>Settings</button>
        <a className="x-acct-open" href="https://hanzo.ai/beta" onClick={() => setOpen(false)}>Open /beta →</a>
      </div>
    </div>
  );
}

export default function Hero() {
  const host = useRef(null);
  const fit = useRef(null);
  const calm = useReducedMotion();
  const inView = useInView(host, { amount: 0.2 });
  const live = useRef(true);
  live.current = inView;
  const user = useRef(false);
  // the demo can be stopped (WCAG 2.2.2): the loop holds, the roster rests
  const [paused, setPaused] = useState(false);
  const stop = useRef(false);
  stop.current = paused;
  // the terminal's Copy copies exactly the command it shows, and says so
  const [copied, setCopied] = useState(false);
  const copyT = useRef(0);
  const copy = async () => { if (!(await copyText(CMD))) return; setCopied(true); clearTimeout(copyT.current); copyT.current = setTimeout(() => setCopied(false), 1600); };

  const [typed, setTypedState] = useState(0);
  const promptEl = useRef(null);
  const cmdEl = useRef(null);
  const setTyped = (i) => { if (promptEl.current) promptEl.current.textContent = PROMPT.slice(0, i); if (i === 0 || i === PROMPT.length) setTypedState(i); };
  const setCmd = (i) => { if (cmdEl.current) cmdEl.current.textContent = CMD.slice(0, i); };
  const [phase, setPhase] = useState(0);
  const [tab, setTab] = useState('chat');
  const [log, setLog] = useState(0);
  const [k, setK] = useState(1);

  // the demo: the prompt types itself, sends, the phone answers, then shows the build and every agent running on Hanzo
  useEffect(() => {
    if (calm) { setTyped(PROMPT.length); setCmd(CMD.length); setPhase(4); setLog(4); return; }
    let dead = false;
    const nap = (ms) => new Promise((r) => setTimeout(r, ms));
    const w = async (ms) => { await nap(ms); while (!dead && stop.current) await nap(300); };
    const held = async () => { while (!dead && (!live.current || stop.current)) await nap(400); };
    (async () => {
      await w(1100);
      (async () => { for (let i = 0; i <= CMD.length && !dead; i++) { setCmd(i); await w(i < 4 ? 90 : 36); } })();
      while (!dead) {
        await held();
        setPhase(0); setLog(0); setTyped(0);
        if (!user.current) setTab('chat');
        for (let i = 0; i <= PROMPT.length && !dead; i++) { setTyped(i); await w(PROMPT[i] === ' ' ? 55 : 26); }
        await w(500); if (dead) return;
        setPhase(1);
        await w(900); if (dead) return;
        setPhase(2);
        await w(2000); if (dead) return;
        if (!user.current) setTab('dev');
        setPhase(3);
        for (let j = 1; j <= 4 && !dead; j++) { await w(430); setLog(j); }
        await w(500); if (dead) return;
        setPhase(4);
        await w(9000);
      }
    })();
    return () => { dead = true; };
  }, [calm]);

  // the stage is drawn at a fixed size and scaled to fit its column
  useLayoutEffect(() => {
    const el = fit.current;
    const ro = new ResizeObserver(() => {
      const sw = parseFloat(getComputedStyle(el).getPropertyValue('--sw')) || 720;
      setK(Math.min(1.15, el.clientWidth / sw));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // pointer: the three devices turn toward it, each at its own depth
  const rx = useSpring(0, { stiffness: 90, damping: 18 });
  const ry = useSpring(0, { stiffness: 90, damping: 18 });
  const onMove = (e) => {
    if (!fine(e)) return;
    const r = host.current.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
  };

  // scroll: the copy lifts away while the devices settle back
  const { scrollYProgress: p } = useScroll({ target: host, offset: ['start start', 'end start'] });
  const copyY = useTransform(p, [0, 1], [0, -90]);
  const copyO = useTransform(p, [0, 0.6], [1, 0]);
  const stageY = useTransform(p, [0, 1], [0, 120]);
  const stageS = useTransform(p, [0, 1], [1, 0.9]);

  const line = (text, d) => (
    <span className="x-line">
      <motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{text}</motion.span>
    </span>
  );

  return (
    <section className="x-hero" ref={host} data-off={paused ? '' : undefined} onPointerMove={onMove} onPointerLeave={() => { rx.set(0); ry.set(0); }} aria-labelledby="home-title">
      <Dots host={host} />
      <div className="x-wrap x-hero-grid">
        <motion.div className="x-hero-copy" style={{ y: copyY, opacity: copyO }}>
          <motion.a href="/blog/pareto-frontier" className="x-badge" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M8 1.5l1.6 4.2 4.2 1.6-4.2 1.6L8 13.1 6.4 8.9 2.2 7.3l4.2-1.6z" fill="currentColor" /></svg>
            A New Pareto Frontier
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </motion.a>
          <h1 id="home-title" className="x-h1">
            <span className="x-h1-a">{line('Smarter, Faster, Open Source.', 0.1)}</span>
            <span className="x-h1-b">{line('Pick all three.', 0.25)}</span>
          </h1>
          <motion.p className="x-hero-lede" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.5 }}>
            Frontier intelligence over <b><Count to={200} suffix="×" duration={1.8} delay={0.6} /></b> faster and <b><Count to={400} suffix="×" duration={2} delay={0.7} /></b> cheaper. Every model behind one key.
          </motion.p>
          <motion.div className="x-auth" initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.07, delayChildren: 0.75 } } }}>
            <div className="x-auth-row">
              <motion.a variants={rise} href="https://hanzo.ai/signup" className="x-auth-b" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h6a5.1 5.1 0 0 1-2.2 3.4v2.8h3.6c2.1-2 3.2-4.9 3.2-8.2z" /><path fill="currentColor" d="M12 23c3 0 5.5-1 7.4-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.9A11 11 0 0 0 12 23z" /><path fill="currentColor" d="M5.7 14c-.2-.7-.4-1.3-.4-2s.1-1.4.4-2V7.1H2a11 11 0 0 0 0 9.8L5.7 14z" /><path fill="currentColor" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2 7.1L5.7 10C6.6 7.4 9.1 5.4 12 5.4z" /></svg>
                Continue with Google
              </motion.a>
              <motion.a variants={rise} href="https://hanzo.ai/signup" className="x-auth-b" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z" /></svg>
                Continue with GitHub
              </motion.a>
            </div>
            <motion.div variants={rise} className="x-or"><span>or</span></motion.div>
            <div className="x-auth-mag">
              <motion.a variants={rise} href="https://hanzo.ai/signup" className="x-auth-b solid" whileTap={{ scale: 0.97 }}>Continue with email</motion.a>
            </div>
            <motion.p variants={rise} className="x-terms">By continuing, you agree to Hanzo&apos;s <a href="https://hanzo.ai/terms">Terms</a> and <a href="https://hanzo.ai/privacy">Privacy Policy</a>.</motion.p>
          </motion.div>
        </motion.div>

        <motion.div className="x-hero-stage" ref={fit} style={{ y: stageY, scale: stageS, height: `calc(var(--sh) * ${k})` }}>
          <A2Pause paused={paused} onChange={setPaused} label={paused ? 'Play the demo' : 'Pause the demo'} className="xh-pause" />
          <div className="x-fit" style={{ transform: `scale(${k})` }}>
            <motion.div className="x-3d" style={{ rotateX: rx, rotateY: ry }}>
              {/* the desktop app */}
              <motion.div className="x-win" initial={{ opacity: 0, z: -260, y: 40 }} animate={{ opacity: 1, z: 0, y: 0 }} transition={{ duration: 1.3, ease: EASE, delay: 0.15 }}>
                <div className="x-win-bar">
                  <i /><i /><i />
                  <a className="x-url" href="/chat">hanzo.ai/chat <span>›</span></a>
                  <a className="x-openapp" href="/chat">Open App ›</a>
                </div>
                <div className="x-win-body">
                  <aside className="x-side">
                    <div className="x-side-h"><b>Hanzo AI</b><span>⌕</span></div>
                    <div className="x-side-new">+ New chat</div>
                    <small>Recents</small>
                    <div className="x-side-i on">maxpower</div>
                    <div className="x-side-i">Launch plan</div>
                    <div className="x-side-i">Weekly report</div>
                    <Account />
                  </aside>
                  <div className="x-chat">
                    <div className="x-chat-log">
                      <Bubble me on={phase >= 1}>{PROMPT}</Bubble>
                      <AppCard on={phase >= 2} />
                    </div>
                    <div className="x-input">
                      <span className="x-plus">+</span>
                      <span className="x-input-t">
                        <em hidden={phase < 1}>Ask Hanzo</em>
                        <span hidden={phase >= 1}><span ref={promptEl} /><Caret /></span>
                      </span>
                      <motion.span className="x-send" animate={{ scale: typed === PROMPT.length && phase === 0 ? [1, 1.18, 1] : 1 }} transition={{ duration: 0.4 }}>↑</motion.span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* the CLI */}
              <motion.div className="x-term" initial={{ opacity: 0, z: -120, y: 70 }} animate={{ opacity: 1, z: 70, y: 0 }} transition={{ duration: 1.3, ease: EASE, delay: 0.35 }}>
                <div className="x-term-bar"><i /><i /><i /><span>install</span></div>
                <div className="x-term-body x-mono">
                  <span className="x-dim">$ </span><span ref={cmdEl} className="xh-cmd" data-cmd={CMD} /><Caret />
                </div>
                <div className="x-term-f">
                  <button type="button" className="x-term-copy xh-copy" onClick={copy} data-cta="home.install_copy" data-on={copied || undefined}>{copied ? 'Copied' : 'Copy'}</button>
                  <span className="xh-sr" role="status">{copied ? 'Copied' : ''}</span>
                  <a href="https://docs.hanzo.ai/docs/cli">Install CLI ↗</a>
                </div>
              </motion.div>

              {/* the phone */}
              <motion.div className="x-phone" initial={{ opacity: 0, z: -80, x: 80 }} animate={{ opacity: 1, z: 130, x: 0 }} transition={{ duration: 1.4, ease: EASE, delay: 0.5 }}>
                <div className="x-phone-scr">
                  <div className="x-status"><b>9:41</b><span className="x-island" /><span>●●●</span></div>
                  <div className="x-tabs" role="tablist" aria-label="Phone app">
                    {['chat', 'dev'].map((t) => (
                      <button key={t} type="button" role="tab" aria-selected={tab === t} aria-controls={'phone-' + t} onClick={() => { user.current = true; setTab(t); }}>
                        {tab === t && <span className="x-tab-bg" />}
                        <span>{t === 'chat' ? 'Chat' : 'Dev'}</span>
                      </button>
                    ))}
                  </div>
                  <div className="x-phone-body">
                    <div className="x-pane" id="phone-chat" role="tabpanel" data-on={tab === 'chat'} inert={tab !== 'chat'}>
                      <Bubble me on={phase >= 1}>{PROMPT}</Bubble>
                      <AppCard on={phase >= 2} />
                    </div>
                    <div className="x-pane right" id="phone-dev" role="tabpanel" data-on={tab === 'dev'} inert={tab !== 'dev'}>
                      <Bubble me>Show me the build</Bubble>
                      <div className="x-log x-mono">
                        {LOG.map((l, i) => (
                          <motion.div key={l} initial={false} animate={i < log ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }} transition={{ duration: 0.35, ease: EASE }} className={i === 3 ? 'ok' : ''}>{i < 3 ? '• ' : ''}{l}</motion.div>
                        ))}
                      </div>
                      <Roster on={phase >= 4} />
                    </div>
                  </div>
                  <a className="x-phone-dl" href="/download">Download App</a>
                </div>
              </motion.div>
            </motion.div>
          </div>
          <SetupMenu up initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 1.1 }} />
        </motion.div>
      </div>
    </section>
  );
}

const rise = { h: { opacity: 0, y: 14 }, s: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } };
