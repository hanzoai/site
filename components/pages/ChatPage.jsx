'use client';
/* Hanzo Chat. Signature: the question visibly routes through Enso. The chat window runs itself (Hanzo's own black
   holes and auroras conversation types, sends, and streams back), and with every question the router rail on the
   right lights up: Enso scans the models and the one that answers lights. It is a real chat too: ask anything and
   it goes to Hanzo's public chat (POST https://api.hanzo.ai/v1/chat/public, model enso), and the rail lights the
   model the answer came from. Below, a dark room shows what the chat does, tool by tool, turned by hand.
   Beyond: "Who answers what". Every model on the router opens: point at it (or tap it) and the rail says what that
   model is for, in Hanzo's own line, with the way to its page; left alone, it explains whichever model just answered.
   Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Rise, Copy, Words } from '../ui';
import { A, Go } from '../kit';
import { MODELS } from '../../lib/models';
import './ChatPage.css';

const API = 'https://api.hanzo.ai/v1/chat/public';
const RECENTS = ['Black holes and auroras', 'Email to the landlord', 'Investor update, shorter', 'Three days in Kyoto', 'Code that works, somehow', 'Support reply, API keys', 'Attention, simply', 'Sourdough starter', 'Three emails before lunch', 'Standup, for the absent', 'A fair refund', 'The fundraising deck', 'Interview notes', 'A toast for the team'];
const DEMO = [
  ['How do black holes form?', 'A star much heavier than the Sun burns through its fuel, and its core collapses under its own gravity.\n\nWhen what is left is heavy enough, nothing can stop the collapse, and not even light escapes it.'],
  ['And what makes the aurora?', 'Charged particles from the Sun reach the gas high above the poles.\n\nThe gas glows as they strike it: oxygen green and red, nitrogen blue and purple.'],
];
const DONE = DEMO.flatMap(([q, a]) => [{ role: 'user', text: q }, { role: 'ai', text: a, model: 'enso', state: 'done' }]);
const ROUTED = MODELS.filter((m) => m.slug !== 'enso');
const ENSO = MODELS[0];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
const slugOf = (name) => { const n = String(name || '').toLowerCase(); return (MODELS.find((m) => n.startsWith(m.slug) || n.includes(m.slug)) || ENSO).slug; };

/* Speak an answer aloud with the browser's own voice. */
function Listen({ text }) {
  const [on, setOn] = useState(false);
  const go = () => {
    const s = typeof window !== 'undefined' && window.speechSynthesis;
    if (!s) return;
    if (on) { s.cancel(); setOn(false); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.onend = u.onerror = () => setOn(false);
    s.cancel(); s.speak(u); setOn(true);
  };
  useEffect(() => () => { if (on && typeof window !== 'undefined') window.speechSynthesis?.cancel(); }, [on]);
  return (
    <button type="button" className={'cht-listen' + (on ? ' on' : '')} onClick={go} aria-pressed={on}>
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 6v4h2.5L9 13V3L5.5 6H3Z" fill="currentColor" /><path d="M11 5.5a3.5 3.5 0 0 1 0 5M12.8 3.6a6 6 0 0 1 0 8.8" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
      <span>Listen</span>
    </button>
  );
}

function Msg({ m, live }) {
  if (m.role === 'user') return <motion.li className="cht-q" initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4, ease: EASE }}>{m.text}</motion.li>;
  return (
    <motion.li className={'cht-a' + (m.state === 'error' ? ' err' : '')} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
      <span className="cht-who"><img src={`/models/${m.model || 'enso'}.webp`} alt="" />{(MODELS.find((x) => x.slug === m.model) || ENSO).name}</span>
      {m.state === 'wait' && <span className="cht-dots" aria-label="Thinking"><i /><i /><i /></span>}
      {m.state === 'stream' && <p className="cht-text"><span ref={live} /><span className="cht-caret" aria-hidden="true" /></p>}
      {m.state === 'done' && <p className="cht-text">{m.text}</p>}
      {m.state === 'error' && <p className="cht-text">No answer came back this time. <A to="/login?next=%2Fchat">Open Hanzo Chat</A></p>}
      {m.state === 'done' && <span className="cht-tools"><Copy text={m.text} /><Listen text={m.text} /></span>}
    </motion.li>
  );
}

/* The router: Enso on top, the models it sends to below; a scan runs while it decides, then one lights.
   Beyond: any model you point at or tap says what it is for; otherwise the one that answered (or Enso) does. */
function Rail({ route, at }) {
  const [peek, setPeek] = useState(null);
  const shown = MODELS.find((m) => m.slug === peek) || (route.phase === 'pick' && MODELS.find((m) => m.slug === route.pick)) || ENSO;
  return (
    <aside className="cht-rail" aria-label="How Enso routes this question">
      <div className={'cht-hub' + (route.phase === 'scan' ? ' busy' : '')}>
        <span className="cht-hub-o"><img src="/models/enso.webp" alt="" /></span>
        <span><b>{ENSO.name}</b><span>{ENSO.desc}</span></span>
      </div>
      <ul className="cht-lanes" onPointerLeave={(e) => { if (e.pointerType === 'mouse') setPeek(null); }}>
        {ROUTED.map((m, i) => {
          const lit = route.phase === 'pick' && route.pick === m.slug;
          const scan = route.phase === 'scan' && at === i;
          return (
            <li key={m.slug} className={(lit ? 'lit' : '') + (scan ? ' scan' : '') + (peek === m.slug ? ' peek' : '')}>
              {(scan || lit) && <motion.span layoutId="cht-lane" className="cht-lane-bg" transition={{ type: 'spring', stiffness: 520, damping: 36 }} />}
              <button type="button" className="cht-lane-b" aria-pressed={peek === m.slug} aria-controls="cht-peek" onPointerEnter={(e) => { if (e.pointerType === 'mouse') setPeek(m.slug); }} onFocus={() => setPeek(m.slug)} onClick={() => setPeek(m.slug)}>
                <img src={`/models/${m.slug}.webp`} alt="" />
                <b>{m.name}</b>
                <span className="cht-tag">{m.tags[0]}</span>
                <i className="cht-live" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
      <p className="cht-peek" id="cht-peek" aria-live={peek ? 'polite' : 'off'}><b>{shown.name}</b><span>{shown.desc}</span><A to={'/' + shown.slug} data-morph>{shown.name} →</A></p>
    </aside>
  );
}

function Window() {
  const [msgs, setMsgs] = useState(DONE);
  const [route, setRoute] = useState({ phase: 'pick', pick: 'zen' });
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const [sel, setSel] = useState(0);
  const [busy, setBusy] = useState(false);
  const [find, setFind] = useState(null);
  const input = useRef(null);
  const live = useRef(null);
  const log = useRef(null);
  const run = useRef(0);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.25 });
  const calm = useReducedMotion();

  // the scan: a light moving down the models while Enso decides
  useEffect(() => {
    if (route.phase !== 'scan') return;
    const t = setInterval(() => setAt((v) => (v + 1) % ROUTED.length), 150);
    return () => clearInterval(t);
  }, [route.phase]);
  useEffect(() => { const l = log.current; if (l) l.scrollTo({ top: l.scrollHeight, behavior: calm ? 'auto' : 'smooth' }); }, [msgs, calm]);

  // stream text into the answer node, a few characters a frame
  const stream = async (text, alive) => {
    await frame();
    const el = live.current;
    if (!el) return;
    for (let i = 0; i <= text.length; i += 3) {
      if (!alive()) return;
      el.textContent = text.slice(0, i);
      await new Promise((r) => requestAnimationFrame(r));
    }
  };

  // the conversation plays itself while it is on screen, until you use it
  useEffect(() => {
    if (mine || sel !== 0 || !seen || calm) return;
    const id = ++run.current;
    const alive = () => run.current === id;
    (async () => {
      while (alive()) {
        setMsgs([]); setRoute({ phase: 'idle', pick: null });
        await wait(700);
        for (const [q, a] of DEMO) {
          const el = input.current;
          for (let i = 1; i <= q.length && alive(); i++) { if (el) el.value = q.slice(0, i); await wait(42); }
          if (!alive()) return;
          await wait(380);
          if (el) el.value = '';
          setMsgs((m) => [...m, { role: 'user', text: q }, { role: 'ai', state: 'wait', model: 'enso' }]);
          setRoute({ phase: 'scan', pick: null });
          await wait(1300);
          if (!alive()) return;
          setRoute({ phase: 'pick', pick: 'zen' });
          setMsgs((m) => [...m.slice(0, -1), { role: 'ai', state: 'stream', model: 'zen', text: a }]);
          await stream(a, alive);
          if (!alive()) return;
          setMsgs((m) => [...m.slice(0, -1), { role: 'ai', state: 'done', model: 'zen', text: a }]);
          await wait(1500);
        }
        await wait(5200);
      }
    })();
    return () => { run.current++; };
  }, [mine, sel, seen, calm]); // eslint-disable-line react-hooks/exhaustive-deps

  const takeOver = () => { if (!mine) { run.current++; setMine(true); if (input.current) input.current.value = ''; setMsgs([]); setRoute({ phase: 'idle', pick: null }); } };

  const ask = async (e) => {
    e.preventDefault();
    const q = (input.current?.value || '').trim().slice(0, 2000);
    if (!q || busy) return;
    run.current++;
    const id = run.current;
    const alive = () => run.current === id;
    setMine(true); setSel(-1); setBusy(true);
    input.current.value = '';
    const history = (mine ? msgs : []).filter((m) => m.state === 'done' || m.role === 'user');
    setMsgs([...history, { role: 'user', text: q }, { role: 'ai', state: 'wait', model: 'enso' }]);
    setRoute({ phase: 'scan', pick: null });
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'enso', messages: [...history.map((m) => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })), { role: 'user', content: q }] }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const d = await res.json();
      const text = d?.choices?.[0]?.message?.content;
      if (!text) throw new Error('empty');
      const slug = slugOf(d.model);
      setRoute({ phase: 'pick', pick: slug });
      setMsgs((m) => [...m.slice(0, -1), { role: 'ai', state: 'stream', model: slug, text }]);
      if (!calm) await stream(text, alive);
      setMsgs((m) => [...m.slice(0, -1), { role: 'ai', state: 'done', model: slug, text }]);
    } catch {
      setRoute({ phase: 'idle', pick: null });
      setMsgs((m) => [...m.slice(0, -1), { role: 'ai', state: 'error', model: 'enso' }]);
    } finally { setBusy(false); }
  };

  const open = (i) => {
    run.current++;
    setSel(i);
    if (i === 0) { setMine(false); setMsgs(DONE); setRoute({ phase: 'pick', pick: 'zen' }); }
    else { setMine(true); setMsgs([]); setRoute({ phase: 'idle', pick: null }); }
  };
  const fresh = () => { run.current++; setMine(true); setSel(-1); setMsgs([]); setRoute({ phase: 'idle', pick: null }); input.current?.focus(); };
  const list = RECENTS.map((t, i) => [t, i]).filter(([t]) => !find || t.toLowerCase().includes(find.toLowerCase()));

  return (
    <div className="cht-win" ref={box} id="cht-try">
      <nav className="cht-side" aria-label="Conversations">
        <button type="button" className="cht-new" onClick={fresh}><span aria-hidden="true">＋</span>New chat</button>
        {find === null
          ? <button type="button" className="cht-find" onClick={() => setFind('')}><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>Search</button>
          : <input className="cht-find-in" autoFocus value={find} onChange={(e) => setFind(e.target.value)} onBlur={() => !find && setFind(null)} placeholder="Search" aria-label="Search conversations" />}
        <p className="cht-recents-k">Recents</p>
        <ul className="cht-recents" data-lenis-prevent>
          {list.map(([t, i]) => (
            <li key={t}>
              <button type="button" className={sel === i ? 'on' : ''} onClick={() => open(i)} aria-current={sel === i}>{t}</button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="cht-main">
        <div className="cht-top"><span className="cht-model"><img src="/models/enso.webp" alt="" />Enso</span></div>
        <div className="cht-log" ref={log} data-lenis-prevent aria-live="polite">
          {sel > 0 ? (
            <div className="cht-empty">
              <p className="cht-empty-t">{RECENTS[sel]}</p>
              <Go to="/login?next=%2Fchat" solid>Open Hanzo Chat</Go>
            </div>
          ) : msgs.length === 0 && mine ? (
            <div className="cht-empty"><p className="cht-empty-t">Ask anything</p></div>
          ) : (
            <ul className="cht-msgs">{msgs.map((m, i) => <Msg key={i} m={m} live={live} />)}</ul>
          )}
        </div>
        <form className="cht-composer" onSubmit={ask}>
          <input ref={input} type="text" placeholder="Ask anything" aria-label="Ask anything" maxLength={2000} onFocus={takeOver} onPointerDown={takeOver} disabled={busy} />
          <motion.button type="submit" className="cht-send" aria-label="Send" disabled={busy} whileTap={{ scale: 0.9 }}>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 13V3M4 7l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </motion.button>
        </form>
      </div>
      <Rail route={route} at={at} />
    </div>
  );
}

function Hero() {
  const line = (t, d) => (
    <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>
  );
  return (
    <section className="cht-hero" aria-labelledby="cht-h1">
      <div className="x-wrap cht-hero-copy">
        <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Hanzo Chat</motion.p>
        <h1 id="cht-h1" className="cht-h1">{line('Ask anything.', 0.05)}{line('Enso picks the model.', 0.17)}</h1>
        <motion.p className="cht-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>Hanzo Chat searches the web, runs code, reads your files and makes images, in one conversation.</motion.p>
        <motion.div className="cht-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}>
          <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><A to="/login?next=%2Fchat" className="x-btn solid" data-thumb>Open Hanzo Chat</A></motion.span>
          <Go to="https://docs.hanzo.ai/docs/chat">Read the docs</Go>
        </motion.div>
      </div>
      <motion.div className="cht-win-wrap" initial={{ opacity: 0, y: 70, rotateX: 8 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 1.3, ease: EASE, delay: 0.3 }}>
        <Window />
      </motion.div>
    </section>
  );
}

/* What it does, tool by tool, in a composer you can press. */
const TOOLS = [
  ['The right model, every time', 'Enso sends each question to the model that answers it best. Pick one by name whenever you want to.', 'route'],
  ['Search and code', 'It searches the web for what is current and runs code when an answer needs working out.', 'search'],
  ['Your files', 'Add a document, a sheet or a picture and ask about it in the same conversation.', 'files'],
  ['Voice', 'Dictate a question or talk it through, and listen to the answer.', 'voice'],
  ['Memory', 'Tell it what to remember, and it carries that into the next conversation.', 'memory'],
  ['Chat, then Dev', 'When a conversation turns into building, Dev is one press away in the same app.', 'dev'],
];
const ICON = {
  route: <><circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="28 6" /><circle cx="8" cy="8" r="1.6" fill="currentColor" /></>,
  search: <><circle cx="7" cy="7" r="4.3" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="m10.3 10.3 3.2 3.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></>,
  files: <path d="M4 2.5h5l3 3v8H4z M9 2.5v3h3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />,
  voice: <><rect x="6" y="2" width="4" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M3.5 8a4.5 4.5 0 0 0 9 0M8 12.5V14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></>,
  memory: <path d="M5 2.5h6v11l-3-2.2-3 2.2z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />,
  dev: <path d="m5.5 4.5-3.5 3.5 3.5 3.5M10.5 4.5 14 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />,
};

function ToolArt({ k, on }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (k !== 'route' || !on) return;
    const t = setInterval(() => setI((v) => (v + 1) % ROUTED.length), 900);
    return () => clearInterval(t);
  }, [k, on]);
  if (k === 'route') {
    return (
      <div className="cht-art cht-art-route" aria-hidden="true">
        <span className="cht-art-enso"><img src="/models/enso.webp" alt="" /></span>
        <div className="cht-art-models">
          {ROUTED.map((m, j) => (
            <span key={m.slug} className={i === j ? 'on' : ''}>
              {i === j && <motion.i layoutId="cht-ring" className="cht-ring" transition={{ type: 'spring', stiffness: 300, damping: 28 }} />}
              <img src={`/models/${m.slug}.webp`} alt="" /><em>{m.name}</em>
            </span>
          ))}
        </div>
      </div>
    );
  }
  if (k === 'search') {
    return (
      <div className="cht-art cht-art-search" aria-hidden="true">
        <div className="cht-res">{[0, 1, 2].map((j) => <span key={j} style={{ animationDelay: j * 0.25 + 's' }}><i /><b /><b /></span>)}</div>
        <div className="cht-code"><span className="cht-run">▶</span>{[70, 48, 86, 56].map((w, j) => <b key={j} style={{ width: w + '%', animationDelay: j * 0.18 + 's' }} />)}<em /></div>
      </div>
    );
  }
  if (k === 'files') {
    return (
      <div className="cht-art cht-art-files" aria-hidden="true">
        {[['Document', 'doc'], ['Sheet', 'sheet'], ['Picture', 'pic']].map(([n, c], j) => <span key={c} className={c} style={{ animationDelay: j * 0.5 + 's' }}><i />{n}</span>)}
        <div className="cht-art-bar">Ask anything</div>
      </div>
    );
  }
  if (k === 'voice') {
    return (
      <div className="cht-art cht-art-voice" aria-hidden="true">
        <span className="cht-mic"><svg viewBox="0 0 16 16" width="26" height="26">{ICON.voice}</svg></span>
        <div className="cht-wave">{Array.from({ length: 28 }).map((_, j) => <i key={j} style={{ animationDelay: -j * 0.09 + 's', animationDuration: 0.6 + (j % 5) * 0.12 + 's' }} />)}</div>
      </div>
    );
  }
  if (k === 'memory') {
    return (
      <div className="cht-art cht-art-memory" aria-hidden="true">
        <div className="cht-convo"><b /><b /><b className="pin" /></div>
        <span className="cht-carry"><svg viewBox="0 0 16 16" width="20" height="20">{ICON.memory}</svg></span>
        <div className="cht-convo two"><b className="pin" /><b /></div>
      </div>
    );
  }
  return (
    <div className="cht-art cht-art-dev" aria-hidden="true">
      <div className="cht-switch"><span>Chat</span><span>Dev</span><i /></div>
      <div className="cht-dev-pane"><div className="chat"><b /><b /><b /></div><div className="code">{[40, 72, 58, 84, 36].map((w, j) => <b key={j} style={{ width: w + '%' }} />)}</div></div>
    </div>
  );
}

function Tools() {
  const [k, setK] = useState(0); // turned by hand: the chat window above is the page's one idle motion
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.4 });
  return (
    <section className="x-sec cht-dark" data-room="dark" ref={ref}>
      <div className="x-wrap">
        <header className="x-head dark cht-tools-head"><Words text="A chat that does the work, not just the talking" /></header>
        <div className="cht-stage">
          <div className="cht-copy">
            {TOOLS.map(([t, d], i) => (
              <motion.div key={t} className="cht-copy-i" initial={false} animate={i === k ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: i < k ? -16 : 16, filter: 'blur(6px)' }} transition={{ duration: 0.5, ease: EASE }} aria-hidden={i !== k} id={'cht-tool-' + i} role="tabpanel">
                <span className="cht-copy-n x-mono">{String(i + 1).padStart(2, '0')} / 06</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </motion.div>
            ))}
          </div>
          <div className="cht-art-box">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={k} className="cht-art-in" initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10, transition: { duration: 0.2 } }} transition={{ duration: 0.55, ease: EASE }}>
                <ToolArt k={TOOLS[k][2]} on={seen} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="cht-bar" role="tablist" aria-label="What Hanzo Chat does">
          {TOOLS.map(([t, , c], i) => (
            <button key={t} type="button" role="tab" aria-selected={k === i} aria-controls={'cht-tool-' + i} onClick={() => setK(i)}>
              {k === i && <motion.span layoutId="cht-tool" className="cht-tool-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <svg viewBox="0 0 16 16" width="17" height="17" aria-hidden="true">{ICON[c]}</svg>
              <span>{t}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* The page ends where it starts: a field to ask in, which takes you back up to the live chat. */
function Again() {
  const go = () => {
    const w = document.getElementById('cht-try');
    w?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => w?.querySelector('input[aria-label="Ask anything"]')?.focus({ preventScroll: true }), 700);
  };
  return (
    <section className="x-sec cht-again">
      <div className="x-wrap">
        <Rise>
          <motion.button type="button" className="cht-again-field" onClick={go} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <span className="cht-again-ph">Ask anything</span>
            <span className="cht-again-go" aria-hidden="true"><svg viewBox="0 0 16 16" width="20" height="20"><path d="M8 13V3M4 7l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
          </motion.button>
        </Rise>
        <Rise className="cht-again-acts" delay={0.15}>
          <Go to="/login?next=%2Fchat" solid>Open Hanzo Chat</Go>
          <Go to="https://docs.hanzo.ai/docs/chat">Read the docs</Go>
        </Rise>
      </div>
    </section>
  );
}

export default function ChatPage() {
  return (
    <main className="cht">
      <Hero />
      <Tools />
      <Again />
    </main>
  );
}
