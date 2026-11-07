'use client';
/* Home hero, v2 (Stage). One idea: smarter, faster, open, pick all three. The live desktop app sits huge under the
   headline, already typing; as you scroll the words leave, the app settles into its place, and the phone and the
   terminal arrive beside it, the phone answering what the app was asked. Only the demo moves while the page is idle.
   Every demo part is in the page from the first paint (search engines, screen readers); the demo only reveals them. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { EASE, Mark } from './ui';
import C from '../content';
import Stage from './v2/Stage';
import Lines from './v2/Lines';

const PROMPT = 'Build maxpower: every AI I use in one place, and faster at coding.';
const CMD = 'curl -fsSL https://hanzo.sh | sh';
const ROSTER = [['Hanzo Dev', 'Zen6', 139], ['Claude Code', 'Zen6', 142], ['Codex', 'Opus 4.8', 96], ['Gemini CLI', 'Opus 4.8', 68], ['Antigravity', 'GPT-5.6', 171], ['ChatGPT', 'Fable 5', 120], ['Cursor', 'Fable 5', 116], ['Claude Duet', 'Zen6 Max', 105], ['Claude', 'Zen6 Max', 142], ['Claude Cowork', 'Zen6', 118], ['DeepSeek', 'Opus 4.8', 121], ['Gemini', 'Opus 4.8', 112], ['Grok', 'GPT-5.6', 150], ['Grok Bot', 'GPT-5.6', 113], ['Grok Build', 'Fable 5', 99], ['Kimi', 'Zen6 Max', 118], ['Kimi K3', 'Zen6 Max', 123], ['Hermes Agent', 'Zen6', 88], ['Hanzo Design', 'Zen6', 104], ['Hanzo Bot', 'Opus 4.8', 92], ['AI Agents CLI', 'GPT-5.6', 102], ['MCP Server', 'GPT-5.6', 57], ['Muse', 'Fable 5', 71], ['OpenClaw', 'Fable 5', 110], ['nanoclaw', 'Zen6 Max', 86], ['Perplexity Computer', 'Zen6', 74], ['Manus', 'Zen6', 101], ['Paperclip', 'Opus 4.8', 89], ['OpenAI SDK', 'Opus 4.8', 94], ['Cue', 'GPT-5.6', 76], ['Qwen', 'Fable 5', 138], ['Universal SDKs', 'Fable 5', 152]];
const ICON = Object.fromEntries(C.agents.map((a) => [a.name, a.icon]));
const LOG = ['Wrote app/agents.tsx', 'Wrote lib/keys.ts', 'Ran pnpm test', '└ pass'];

// the composition, drawn at one size and scaled: the desktop app, the phone in front of its right edge, the terminal below
const W = 1210, H = 750, WIN = 960;
const clamp = (v) => Math.max(0, Math.min(1, v));
const io = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const span = (v, a, b) => clamp((v - a) / (b - a));

function Caret() { return <span className="x-caret" aria-hidden="true" />; }

function Bubble({ children, me, on = true }) {
  return (
    <motion.div className={'x-bub' + (me ? ' me' : '')} initial={false} animate={on ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.96 }} aria-hidden={on ? undefined : true} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
      {children}
    </motion.div>
  );
}

function AppCard({ on = true }) {
  return (
    <motion.div className="x-appcard" initial={false} animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }} aria-hidden={on ? undefined : true} transition={{ duration: 0.6, ease: EASE }}>
      <span className="x-appicon"><Mark size={13} /></span>
      <span><b>maxpower</b><small>Mobile + Duo app</small></span>
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
    const t = setInterval(() => { if (shown.current && !document.querySelector('.hv-hero[data-off]')) setStep((s) => (s >= ROSTER.length ? 0 : s + 1)); }, 2200);
    return () => clearInterval(t);
  }, []);
  // every agent's speed moves and the bill ticks: written straight to the text, no re-render
  const box = useRef(null);
  useEffect(() => {
    let cost = 0;
    const t = setInterval(() => {
      if (!shown.current || document.querySelector('.hv-hero[data-off]') || !box.current) return;
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
      <span className="x-ros-n">{n}<small>{m}</small></span>
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

const Google = () => <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h6a5.1 5.1 0 0 1-2.2 3.4v2.8h3.6c2.1-2 3.2-4.9 3.2-8.2z" /><path fill="#34A853" d="M12 23c3 0 5.5-1 7.4-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.9A11 11 0 0 0 12 23z" /><path fill="#FBBC05" d="M5.7 14c-.2-.7-.4-1.3-.4-2s.1-1.4.4-2V7.1H2a11 11 0 0 0 0 9.8L5.7 14z" /><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2 7.1L5.7 10C6.6 7.4 9.1 5.4 12 5.4z" /></svg>;
const GitHub = () => <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z" /></svg>;
const Arr = ({ s = 13 }) => <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* The scene: the words, then the devices. While pinned, scroll drives everything below (transform and opacity only). */
function Scene({ p, pinned, demo }) {
  const { phase, tab, setTab, user, log, typed, promptEl, cmdEl } = demo;
  const copy = useRef(null);
  const geo = useRef(null);
  const [ready, setReady] = useState(false);
  const [gone, setGone] = useState(false);
  const [flowK, setFlowK] = useState(0);
  const v = {
    ox: useMotionValue(0), oy: useMotionValue(0), os: useMotionValue(1),
    cy: useMotionValue(0), co: useMotionValue(1),
    px: useMotionValue(0), po: useMotionValue(1), ty: useMotionValue(0), to: useMotionValue(1),
  };
  // where the app starts (huge, under the words) and where it settles (the whole composition, centred under the header)
  const measure = () => {
    const vw = innerWidth, vh = innerHeight;
    const c = copy.current.getBoundingClientRect();
    const k = Math.min((vw - 48) / W, (vh - 60 - 56) / H, 1.2);
    const s0 = Math.max(k * 1.25, (vw * 0.94) / WIN);
    const y0 = Math.max(c.height + 24, vh * 0.62);
    geo.current = { k, s0, x0: (vw - WIN * s0) / 2, y0, x1: (vw - W * k) / 2, y1: 60 + (vh - 60 - H * k) / 2, vh };
    setFlowK(Math.min(1, (Math.min(vw, 1440) - 48) / W));
  };
  const apply = () => {
    const g = geo.current;
    if (!g) return;
    const t = p.get();
    const e = io(span(t, 0, 0.72));
    v.os.set(g.s0 + (g.k - g.s0) * e);
    v.ox.set(g.x0 + (g.x1 - g.x0) * e);
    v.oy.set(g.y0 + (g.y1 - g.y0) * e);
    v.cy.set(-t * g.vh * 0.45);
    v.co.set(1 - span(t, 0.02, 0.32));
    const pe = io(span(t, 0.38, 0.8)), te = io(span(t, 0.5, 0.92));
    v.px.set((1 - pe) * 260); v.po.set(pe);
    v.ty.set((1 - te) * 180); v.to.set(te);
    const g2 = t > 0.3;
    setGone((x) => (x === g2 ? x : g2));
  };
  useMotionValueEvent(p, 'change', apply);
  useLayoutEffect(() => {
    if (pinned === null) return;
    const f = () => { measure(); apply(); };
    f();
    setReady(true);
    addEventListener('resize', f);
    return () => removeEventListener('resize', f);
  }, [pinned]); // eslint-disable-line react-hooks/exhaustive-deps

  const desk = pinned === false && flowK > 0.6; // reduced motion on a wide screen: the settled picture, still
  const objStyle = pinned ? { x: v.ox, y: v.oy, scale: v.os } : desk ? { scale: flowK } : undefined;

  return (
    <>
      <motion.div className="hv-copy v2-wrap" ref={copy} style={pinned ? { y: v.cy, opacity: v.co } : undefined} inert={pinned && gone ? true : undefined}>
        <div className="hv-pills">
          <motion.a href="/blog/pareto-frontier" className="hv-badge" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M8 1.5l1.6 4.2 4.2 1.6-4.2 1.6L8 13.1 6.4 8.9 2.2 7.3l4.2-1.6z" fill="currentColor" /></svg>
            A New Pareto Frontier
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </motion.a>
          <motion.a href="/beta" className="hv-ann" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}>
            <span>Apply for Beta Access or Start Free</span><Arr />
          </motion.a>
        </div>
        <Lines as="h1" id="home-title" className="hv-h1" now delay={0.05} stagger={0.1} lines={[
          <span className="hv-h1-a" key="a">Smarter, Faster, Open Source.</span>,
          <span className="hv-h1-b" key="b">Pick all three.</span>,
        ]} />
        <motion.div className="hv-sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease: EASE, delay: 0.45 }}>
          <p className="hv-lede">Frontier intelligence over <b>200×</b> faster and <b>400×</b> cheaper. Every model behind one key.</p>
          <div className="hv-auth">
            <div className="hv-auth-row">
              <a href="https://hanzo.ai/signup" className="hv-auth-b"><Google />Continue with Google</a>
              <a href="https://hanzo.ai/signup" className="hv-auth-b"><GitHub />Continue with GitHub</a>
              <span className="hv-or">or</span>
              <a href="https://hanzo.ai/signup" className="hv-auth-b solid">Continue with email</a>
            </div>
            <p className="hv-terms">By continuing, you agree to Hanzo&apos;s <a href="https://hanzo.ai/terms">Terms</a> and <a href="https://hanzo.ai/privacy">Privacy Policy</a>.</p>
          </div>
        </motion.div>
      </motion.div>

      <div className={'hv-obj-wrap' + (desk ? ' desk' : '')} style={desk ? { height: H * flowK, width: W * flowK } : undefined}>
        <motion.div className="hv-obj" data-ready={ready || undefined} style={objStyle}>
          <div className="hv-arrive">
            {/* the desktop app: a new chat, its prompt typing itself, then the answer */}
            <div className="hv-win">
              <div className="hv-win-bar">
                <i /><i /><i />
                <a className="hv-url" href="/chat">hanzo.ai/chat <span>›</span></a>
                <a className="hv-openapp" href="/chat">Open App ›</a>
              </div>
              <div className="hv-win-body">
                <aside className="hv-side">
                  <div className="hv-side-h"><b>Hanzo AI</b><span>⌕</span></div>
                  <div className="hv-side-new">+ New chat</div>
                  <small>Recents</small>
                  <div className="hv-side-i on">maxpower</div>
                  <div className="hv-side-i">Launch plan</div>
                  <div className="hv-side-i">Weekly report</div>
                  <Account />
                </aside>
                <div className="hv-chat" data-sent={phase >= 1}>
                  <motion.span className="hv-hello" initial={false} animate={phase >= 1 ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: EASE }} aria-hidden="true"><Mark size={30} /></motion.span>
                  <div className="hv-log">
                    <Bubble me on={phase >= 1}>{PROMPT}</Bubble>
                    <AppCard on={phase >= 2} />
                    <div className="hv-build" aria-hidden="true">
                      <Bubble me on={phase >= 3}>Show me the build</Bubble>
                      <div className="x-log x-mono">
                        {LOG.map((l, i) => (
                          <motion.div key={l} initial={false} animate={i < log ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }} transition={{ duration: 0.35, ease: EASE }} className={i === 3 ? 'ok' : ''}>{i < 3 ? '• ' : ''}{l}</motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <motion.div className="hv-input" initial={false} animate={{ y: phase >= 1 ? 384 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                    <span className="hv-plus">+</span>
                    <span className="hv-input-t">
                      <em hidden={phase < 1}>Ask Hanzo</em>
                      <span hidden={phase >= 1}><span ref={promptEl} /><Caret /></span>
                    </span>
                    <motion.span className="hv-send" animate={{ scale: typed === PROMPT.length && phase === 0 ? [1, 1.18, 1] : 1 }} transition={{ duration: 0.4 }}>↑</motion.span>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* the CLI */}
            <motion.div className="hv-term" style={pinned ? { y: v.ty, opacity: v.to } : undefined}>
              <div className="x-term">
                <div className="x-term-bar"><i /><i /><i /><span>install</span></div>
                <div className="x-term-body x-mono">
                  <span className="x-dim">$ </span><span ref={cmdEl} /><Caret />
                </div>
                <div className="x-term-f">
                  <span className="x-term-copy">Copy</span>
                  <a href="https://docs.hanzo.ai/docs/cli">Install CLI ↗</a>
                </div>
              </div>
            </motion.div>

            {/* the phone */}
            <motion.div className="hv-phone" style={pinned ? { x: v.px, opacity: v.po } : undefined}>
              <div className="x-phone">
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
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default function Hero() {
  const host = useRef(null);
  const calm = useReducedMotion();
  const inView = useInView(host, { amount: 0.1 });
  const live = useRef(true);
  live.current = inView;
  const user = useRef(false);

  const [typed, setTypedState] = useState(0);
  const promptEl = useRef(null);
  const cmdEl = useRef(null);
  const setTyped = (i) => { if (promptEl.current) promptEl.current.textContent = PROMPT.slice(0, i); if (i === 0 || i === PROMPT.length) setTypedState(i); };
  const setCmd = (i) => { if (cmdEl.current) cmdEl.current.textContent = CMD.slice(0, i); };
  const [phase, setPhase] = useState(0);
  const [tab, setTab] = useState('chat');
  const [log, setLog] = useState(0);

  // the demo: the prompt types itself, sends, the phone answers, then shows the build and every agent running on Hanzo
  useEffect(() => {
    if (calm) { setTyped(PROMPT.length); setCmd(CMD.length); setPhase(4); setLog(4); return; }
    let dead = false;
    const w = (ms) => new Promise((r) => setTimeout(r, ms));
    const held = async () => { while (!dead && !live.current) await w(400); };
    (async () => {
      await w(900);
      (async () => { for (let i = 0; i <= CMD.length && !dead; i++) { setCmd(i); await w(i < 4 ? 90 : 36); } })();
      while (!dead) {
        await held();
        setPhase(0); setLog(0); setTyped(0);
        if (!user.current) setTab('chat');
        for (let i = 0; i <= PROMPT.length && !dead; i++) { setTyped(i); await w(PROMPT[i] === ' ' ? 60 : 30); }
        await w(650); if (dead) return;
        setPhase(1);
        await w(1000); if (dead) return;
        setPhase(2);
        await w(2200); if (dead) return;
        if (!user.current) setTab('dev');
        setPhase(3);
        for (let j = 1; j <= 4 && !dead; j++) { await w(430); setLog(j); }
        await w(500); if (dead) return;
        setPhase(4);
        await w(5200);
      }
    })();
    return () => { dead = true; };
  }, [calm]);

  const demo = { phase, tab, setTab, user, log, typed, promptEl, cmdEl };
  return (
    <section className="hv-hero" ref={host} aria-labelledby="home-title">
      <Stage length={1.15} className="hv-stage">
        {(p, pinned) => <Scene p={p} pinned={pinned} demo={demo} />}
      </Stage>
    </section>
  );
}
