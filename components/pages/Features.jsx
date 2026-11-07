'use client';
/* Platform features. Its idea is the instrument you play to chat, build and ship.
   Signature: Hanzo's ten features are keycaps on one keyboard, set in three clusters (Hanzo Chat, Hanzo Dev, Hanzo
   Design & Cloud). It plays itself, a key pressing every couple of seconds and its feature lighting on the display
   above; press a key, tap it, or type 1 to 0 to play it yourself.
   Beyond: find the feature for a job. Type what you need (a PDF, a refactor, your voice) and the keys whose own
   descriptions say it light up; Enter plays the first.
   The chat is real: ask Hanzo anything (POST https://api.hanzo.ai/v1/chat/public), by typing or by voice.
   Every word is Hanzo's. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE } from '../ui';
import { A, Go, SecHead } from '../kit';
import './Features.css';

const API = 'https://api.hanzo.ai/v1/chat/public';
const GROUPS = [
  ['Hanzo Chat', 'Default', [
    ['Enso Model Routing', 'Enso dynamically routes each prompt to the frontier model that answers it best, optimizing for quality, speed, and cost.'],
    ['Live Web Search & Code', 'Searches the real-time web for current facts, runs code in isolated sandboxes, and verifies computational answers automatically.'],
    ['Deep File & Document Analysis', 'Upload PDFs, documents, sheets, or codebases directly to ask complex questions, parse data tables, and extract insights.'],
    ['Bidirectional Voice', 'Dictate prompts, listen to realistic spoken answers, and converse naturally in real-time with zero-latency speech interfaces.'],
  ]],
  ['Hanzo Dev', 'CLI + Web', [
    ['Repo-Scale Coding Agent', 'Hanzo Dev scans entire codebases, identifies cross-file dependencies, writes refactors, and runs automated tests autonomously.'],
    ['Multi-Agent Acceleration', 'Accelerate Claude Code, Codex, Cursor, and Antigravity with unified API keys, team telemetry, and faster inference.'],
    ['Sandboxed Execution', 'Safe, ephemeral Linux execution containers that run build commands, migrations, and test suites with zero setup.'],
    ['Instant Headless API', 'Let autonomous background agents authenticate via crypto wallets, provision API keys, and top up balance without humans in the loop.'],
  ]],
  ['Hanzo Design & Cloud', null, [
    ['Multi-Modal Visual Canvas', 'Compose multi-step agent graphs, connect specialized models, and chain tools together in an interactive visual workspace.'],
    ['Context & Memory Systems', 'Persistent agent memory stores instructions, project rules, and codebase context across all your sessions and team members.'],
  ]],
];
const KEYS = GROUPS.flatMap(([g, tag, fs], gi) => fs.map(([t, d]) => ({ g, tag, gi, t, d })));
const CAP = (i) => String((i + 1) % 10);
const words = (s) => s.toLowerCase().match(/[a-z0-9]+/g) || [];

function Instrument() {
  const [at, setAt] = useState(0);
  const [down, setDown] = useState(-1);
  const [mine, setMine] = useState(false);
  const [q, setQ] = useState('');
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.05 }); // the keyboard is tall on a phone: a sliver in view is enough
  const calm = useReducedMotion();
  const hits = useMemo(() => {
    const w = words(q).filter((x) => x.length > 1);
    if (!w.length) return null;
    return KEYS.map((k, i) => [i, words(k.t + ' ' + k.d + ' ' + k.g)]).filter(([, kw]) => w.every((x) => kw.some((y) => y.startsWith(x)))).map(([i]) => i);
  }, [q]);
  const press = (i, hand) => { setAt(i); setDown(i); if (hand) setMine(true); setTimeout(() => setDown((d) => (d === i ? -1 : d)), 180); };
  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setTimeout(() => press((at + 1) % KEYS.length), 2100);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const key = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName) || !seen) return;
      const n = '1234567890'.indexOf(e.key);
      if (n >= 0) press(n, true);
    };
    addEventListener('keydown', key);
    return () => removeEventListener('keydown', key);
  }, [seen]); // eslint-disable-line react-hooks/exhaustive-deps
  const k = KEYS[at];
  return (
    <div className="xft-inst" ref={box}>
      <div className="xft-screen" aria-live="polite">
        <div className="xft-screen-top">
          <span className="x-mono">{k.g}{k.tag ? ` · ${k.tag}` : ''}</span>
          <span className="x-mono">{CAP(at)} / 0</span>
        </div>
        <div className="xft-screen-body">
          {KEYS.map((f, i) => (
            <motion.div key={f.t} className="xft-feat" initial={false} animate={i === at ? { opacity: 1, y: 0 } : { opacity: 0, y: i < at ? -16 : 16 }} transition={{ duration: 0.45, ease: EASE }} aria-hidden={i !== at}>
              <h3>{f.t}</h3>
              <p>{f.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <form className="xft-find" role="search" onSubmit={(e) => { e.preventDefault(); if (hits?.length) press(hits[0], true); }}>
        <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="m13.2 13.2 3.6 3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
        <input value={q} onChange={(e) => { setMine(true); setQ(e.target.value); }} placeholder="Find a feature: PDF, refactor, voice…" aria-label="Find a feature" maxLength={80} />
        <span className="xft-find-n x-mono" aria-live="polite">{hits ? `${hits.length} of 10` : ''}</span>
      </form>
      <div className="xft-board">
        {GROUPS.map(([g, tag, fs], gi) => (
          <div key={g} className={'xft-cluster c' + gi}>
            <p className="xft-cl-h"><b>{g}</b>{tag && <span>{tag}</span>}</p>
            <div className="xft-keys">
              {fs.map(([t]) => {
                const i = KEYS.findIndex((x) => x.t === t);
                const lit = hits ? hits.includes(i) : false;
                return (
                  <button key={t} type="button" className={'xft-key' + (i === at ? ' on' : '') + (i === down ? ' down' : '') + (hits && !lit ? ' dim' : '') + (lit ? ' hit' : '')} onClick={() => press(i, true)} aria-pressed={i === at} aria-keyshortcuts={CAP(i)}>
                    <span className="xft-cap x-mono" aria-hidden="true">{CAP(i)}</span>
                    <span className="xft-key-t">{t}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  const line = (t, d) => <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>;
  return (
    <section className="xft-hero" aria-labelledby="xft-h1">
      <div className="x-wrap">
        <div className="xft-top">
          <div>
            <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Platform Features</motion.p>
            <h1 id="xft-h1" className="xft-h1">{line('Everything you need to', 0.05)}{line('chat, build and ship.', 0.16)}</h1>
          </div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>
            <p className="xft-lede">Explore Hanzo Chat, Dev, and Studio — intelligent model routing, repo-scale coding agents, and unified cloud APIs.</p>
            <div className="xft-acts">
              <Go to="/chat?skip=login" solid>Open Chat</Go>
              <Go to="/dev">Launch Dev</Go>
              <Go to="/signup">Try Hanzo</Go>
            </div>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.25 }}>
          <Instrument />
        </motion.div>
      </div>
    </section>
  );
}

const ASKS = ['How does Enso route a prompt?', 'What can Hanzo Dev do in my repository?', 'What is sandboxed execution?'];
const clean = (t) => t.replace(/\*\*(.*?)\*\*/g, '$1').replace(/^#{1,4}\s+/gm, '').replace(/`/g, '');

/* Ask Hanzo, here: typed or spoken; a spoken question is answered aloud. */
function Ask() {
  const [state, setState] = useState('idle'); // idle | wait | stream | done | error
  const [q, setQ] = useState('');
  const [ear, setEar] = useState(null); // null: no voice in this browser
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const input = useRef(null);
  const out = useRef(null);
  const full = useRef('');
  const rec = useRef(null);
  const run = useRef(0);
  const calm = useReducedMotion();
  useEffect(() => { setEar(!!(window.SpeechRecognition || window.webkitSpeechRecognition)); return () => { run.current++; rec.current?.abort?.(); window.speechSynthesis?.cancel(); }; }, []);

  const ask = async (text, aloud) => {
    const question = (text || input.current?.value || '').trim().slice(0, 2000);
    if (!question || state === 'wait' || state === 'stream') return;
    const id = ++run.current;
    window.speechSynthesis?.cancel(); setSpeaking(false);
    setQ(question); setState('wait');
    if (input.current) input.current.value = '';
    try {
      const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'enso', messages: [{ role: 'user', content: question }] }) });
      if (!res.ok) throw new Error(String(res.status));
      const d = await res.json();
      const a = clean(d?.choices?.[0]?.message?.content || '');
      if (!a) throw new Error('empty');
      if (id !== run.current) return;
      full.current = a; setState('stream');
      await new Promise((r) => requestAnimationFrame(r));
      for (let i = 0; i <= a.length && !calm; i += 3) {
        if (id !== run.current) return;
        if (out.current) out.current.textContent = a.slice(0, i);
        await new Promise((r) => requestAnimationFrame(r));
      }
      if (out.current) out.current.textContent = a;
      setState('done');
      if (aloud && window.speechSynthesis) { const u = new SpeechSynthesisUtterance(a); u.onend = u.onerror = () => setSpeaking(false); setSpeaking(true); window.speechSynthesis.speak(u); }
    } catch { if (id === run.current) setState('error'); }
  };

  const talk = () => {
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); }
    if (listening) { rec.current?.stop(); return; }
    const R = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!R) return;
    const r = new R(); rec.current = r;
    r.lang = navigator.language || 'en-US'; r.interimResults = true;
    r.onresult = (e) => { const t = [...e.results].map((x) => x[0].transcript).join(''); if (input.current) input.current.value = t; if (e.results[e.results.length - 1].isFinal) { r.stop(); ask(t, true); } };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    setListening(true); r.start();
  };
  const says = listening ? 'Listening — click to stop' : speaking ? 'Speaking — talk to interrupt' : 'Talk to Hanzo';
  return (
    <section className="x-sec xft-ask" data-room="dark" aria-label="Try Hanzo">
      <div className="x-wrap xft-ask-in">
        <SecHead dark kicker="Hanzo Chat" title="Try Hanzo" />
        <form className={'xft-prism' + (state === 'wait' ? ' busy' : '')} onSubmit={(e) => { e.preventDefault(); ask(); }}>
          <i className="xft-prism-ring" aria-hidden="true" />
          <input ref={input} placeholder="Ask Hanzo anything" aria-label="Ask Hanzo anything" maxLength={2000} />
          {ear && (
            <motion.button type="button" className={'xft-ctl talk' + (listening ? ' on' : '')} onClick={talk} aria-pressed={listening} aria-label={says} title={says} whileTap={{ scale: 0.9 }}>
              <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><rect x="5.5" y="1.5" width="5" height="8.5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M3 8a5 5 0 0 0 10 0M8 13v2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </motion.button>
          )}
          <motion.button type="submit" className="xft-ctl send" aria-label="Send" disabled={state === 'wait'} whileTap={{ scale: 0.9 }}>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 13V3M4 7l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </motion.button>
        </form>
        {state === 'idle' && (
          <div className="xft-asks">
            {ASKS.map((t) => <button key={t} type="button" onClick={() => ask(t)}>{t}</button>)}
          </div>
        )}
        <AnimatePresence>
          {state !== 'idle' && (
            <motion.div className="xft-answer" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE }} aria-live="polite">
              <p className="xft-q">{q}</p>
              <span className="xft-who"><img src="/models/enso.webp" alt="" />Enso</span>
              {state === 'wait' && <span className="xft-dots" aria-label="Thinking"><i /><i /><i /></span>}
              {(state === 'stream' || state === 'done') && <p className="xft-a"><span ref={out}>{state === 'done' ? full.current : ''}</span>{state === 'stream' && <b className="xft-caret" aria-hidden="true" />}</p>}
              {state === 'error' && <p className="xft-a">No answer came back this time. <A to="/chat?skip=login">Open Hanzo Chat</A></p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default function Features() {
  return (
    <main className="xft">
      <Hero />
      <Ask />
    </main>
  );
}
