'use client';
/* Hanzo Chat, v2 (VISION.md archetype A, Launch). One idea per screen:
     1. Stage: "Ask anything. Enso picks the model." The real chat window starts close and large under the headline and
        settles into place as you scroll, already talking.
     2. Six chapters in the page's one dark room: the copy pins while each tool's own UI wipes in (AppChapters).
     3. Who answers what: Enso and the eight models it routes to, as a spec sheet you point at.
     4. One action: the page ends where it starts, in a field to ask in.
   Signature: the live chat runs itself. Hanzo's own black holes and auroras conversation types, sends and streams back,
   and with each question the router rail scans the models and lights the one that answers. Type into it and it is a
   real chat (POST https://api.hanzo.ai/v1/chat/public, model enso); the rail lights the model the answer came from.
   Supporting: the stage settles with the scroll; chapters wipe from one tool to the next; headlines rise out of masks.
   Beyond: "Who answers what". Point at (or tap) any model and its own artwork, line and tag come forward; open it and
   the picture lifts into that model's page (the synchronized.studio opener).
   Accent: the router's blue, from the chat's own focus ring and lit lane. Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { EASE, Copy } from '../ui';
import { A, Go } from '../kit';
import { useOpener } from '../Opener';
import AppLines from '../v2/AppLines';
import AppChapters from '../v2/AppChapters';
import { MODELS } from '../../lib/models';
import './ChatPage.css';

const API = 'https://api.hanzo.ai/v1/chat/public';
const RECENTS = ['Black holes and auroras', 'Email to the landlord', 'Investor update, shorter', 'Three days in Kyoto', 'Code that works, somehow', 'Support reply, API keys', 'Attention, simply', 'Sourdough starter', 'Three emails before lunch', 'Standup, for the absent', 'A fair refund', 'The fundraising deck', 'Interview notes', 'A toast for the team'];
const DEMO = [
  ['How do black holes form?', 'A star much heavier than the Sun burns through its fuel, and its core collapses under its own gravity.\n\nWhen what is left is heavy enough, nothing can stop the collapse, and not even light escapes it.'],
  ['And what makes the aurora?', 'Charged particles from the Sun reach the gas high above the poles.\n\nThe gas glows as they strike it: oxygen green and red, nitrogen blue and purple.'],
];
const DONE = DEMO.flatMap(([q, a]) => [{ role: 'user', text: q }, { role: 'ai', text: a, model: 'zen', state: 'done' }]);
const ROUTED = MODELS.filter((m) => m.slug !== 'enso');
const ENSO = MODELS[0];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const slugOf = (name) => { const n = String(name || '').toLowerCase(); return (MODELS.find((m) => n.startsWith(m.slug) || n.includes(m.slug)) || ENSO).slug; };

function useWide() {
  const [w, setW] = useState(false);
  useEffect(() => {
    const m = matchMedia('(min-width: 901px)');
    const f = () => setW(m.matches);
    f(); m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  return w;
}

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
  const who = MODELS.find((x) => x.slug === m.model) || ENSO;
  return (
    <motion.li className={'cht-a' + (m.state === 'error' ? ' err' : '')} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
      <span className="cht-who"><img src={`/models/${who.slug}.webp`} alt="" />{who.name}</span>
      {m.state === 'wait' && <span className="cht-dots" aria-label="Thinking"><i /><i /><i /></span>}
      {m.state === 'stream' && <p className="cht-text"><span ref={live} /><span className="cht-caret" aria-hidden="true" /></p>}
      {m.state === 'done' && <p className="cht-text">{m.text}</p>}
      {m.state === 'error' && <p className="cht-text">No answer came back this time. <A to="/login?next=%2Fchat">Open Hanzo Chat</A></p>}
      {m.state === 'done' && <span className="cht-tools"><Copy text={m.text} /><Listen text={m.text} /></span>}
    </motion.li>
  );
}

/* The router: Enso on top, the models it sends to below. A scan runs while it decides, then one lights.
   Any model you point at or tap says what it is for; otherwise the one that answered (or Enso) does. */
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
  const seen = useInView(box, { amount: 0.2 });
  const calm = useReducedMotion();

  // the scan: a light moving down the models while Enso decides
  useEffect(() => {
    if (route.phase !== 'scan') return;
    const t = setInterval(() => setAt((v) => (v + 1) % ROUTED.length), 140);
    return () => clearInterval(t);
  }, [route.phase]);
  useEffect(() => { const l = log.current; if (l) l.scrollTo({ top: l.scrollHeight, behavior: calm ? 'auto' : 'smooth' }); }, [msgs, calm]);

  // stream text into the answer's own text node, a few characters at a time (no React state per character)
  const stream = async (text, alive) => {
    await wait(40);
    const el = live.current;
    if (!el) return;
    for (let i = 0; i <= text.length; i += 3) {
      if (!alive()) return;
      el.textContent = text.slice(0, i);
      await wait(16);
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
        await wait(500);
        for (const [q, a] of DEMO) {
          const el = input.current;
          for (let i = 1; i <= q.length && alive(); i++) { if (el) el.value = q.slice(0, i); await wait(38); }
          if (!alive()) return;
          await wait(340);
          if (el) el.value = '';
          setMsgs((m) => [...m, { role: 'user', text: q }, { role: 'ai', state: 'wait', model: 'enso' }]);
          setRoute({ phase: 'scan', pick: null });
          await wait(1250);
          if (!alive()) return;
          setRoute({ phase: 'pick', pick: 'zen' });
          setMsgs((m) => [...m.slice(0, -1), { role: 'ai', state: 'stream', model: 'zen', text: a }]);
          await stream(a, alive);
          if (!alive()) return;
          setMsgs((m) => [...m.slice(0, -1), { role: 'ai', state: 'done', model: 'zen', text: a }]);
          await wait(1400);
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
        <div className="cht-top">
          <span className="cht-model"><img src="/models/enso.webp" alt="" />Enso</span>
          <span className={'cht-state x-mono' + (route.phase === 'scan' ? ' on' : '')} aria-hidden="true"><i />{route.phase === 'scan' ? 'routing' : route.phase === 'pick' ? (MODELS.find((m) => m.slug === route.pick) || ENSO).name.toLowerCase() : 'auto'}</span>
        </div>
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

/* 1. Stage: the window starts close and large below the headline, and settles into place as the page scrolls. */
function Stage() {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const wide = useWide();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // plain functions of the progress (not keyframe ranges), so the browser never hands these to its own scroll timeline
  const k = (v, a, b) => Math.min(1, Math.max(0, (v - a) / (b - a)));
  const y = useTransform(p, (v) => 46 * (1 - k(v, 0, 0.6)) + 'vh');
  const scale = useTransform(p, (v) => 1.16 - 0.16 * k(v, 0, 0.6));
  const copyY = useTransform(p, (v) => -150 * k(v, 0, 0.45));
  const copyO = useTransform(p, (v) => 1 - k(v, 0.04, 0.34));
  const glow = useTransform(p, (v) => 0.4 + 0.6 * k(v, 0, 0.6));
  const on = wide && !calm;
  return (
    <section className="cht-stage" ref={ref} aria-labelledby="cht-h1" data-morph-target>
      <div className="cht-frame">
        <motion.div className="cht-copy" style={on ? { y: copyY, opacity: copyO } : undefined}>
          <p className="v2a-kick">Hanzo Chat</p>
          <AppLines as="h1" id="cht-h1" className="v2a-display cht-h1" lines={['Ask anything.', 'Enso picks the model.']} soft={[1]} />
          <motion.p className="v2a-lede cht-lede" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>Hanzo Chat searches the web, runs code, reads your files and makes images, in one conversation.</motion.p>
          <motion.div className="cht-acts" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}>
            <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><A to="/login?next=%2Fchat" className="x-btn solid cht-cta" data-thumb="Open Hanzo Chat">Open Hanzo Chat</A></motion.span>
            <Go to="https://docs.hanzo.ai/docs/chat">Read the docs</Go>
          </motion.div>
        </motion.div>
        <motion.i className="cht-glow" style={on ? { opacity: glow } : undefined} aria-hidden="true" />
        <motion.div className="cht-win-wrap" style={on ? { y, scale } : undefined}>
          <Window />
        </motion.div>
      </div>
    </section>
  );
}

/* 2. The six tools, each with its own UI, in the dark room. */
const TOOLS = [
  ['The right model, every time', 'Enso sends each question to the model that answers it best. Pick one by name whenever you want to.', 'route', 'Models'],
  ['Search and code', 'It searches the web for what is current and runs code when an answer needs working out.', 'search', 'Search'],
  ['Your files', 'Add a document, a sheet or a picture and ask about it in the same conversation.', 'files', 'Files'],
  ['Voice', 'Dictate a question or talk it through, and listen to the answer.', 'voice', 'Voice'],
  ['Memory', 'Tell it what to remember, and it carries that into the next conversation.', 'memory', 'Memory'],
  ['Chat, then Dev', 'When a conversation turns into building, Dev is one press away in the same app.', 'dev', 'Dev'],
];
const ICON = {
  route: <><circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="28 6" /><circle cx="8" cy="8" r="1.6" fill="currentColor" /></>,
  search: <><circle cx="7" cy="7" r="4.3" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="m10.3 10.3 3.2 3.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></>,
  files: <path d="M4 2.5h5l3 3v8H4z M9 2.5v3h3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />,
  voice: <><rect x="6" y="2" width="4" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M3.5 8a4.5 4.5 0 0 0 9 0M8 12.5V14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></>,
  memory: <path d="M5 2.5h6v11l-3-2.2-3 2.2z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />,
  dev: <path d="m5.5 4.5-3.5 3.5 3.5 3.5M10.5 4.5 14 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />,
};
const Ico = ({ k, s = 17 }) => <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden="true">{ICON[k]}</svg>;

function Art({ k }) {
  if (k === 'route') {
    return (
      <div className="cht-art cht-art-route">
        <img className="cht-art-bg" src="/models/enso.webp" alt="" loading="lazy" />
        <div className="cht-menu">
          <div className="cht-menu-h"><img src="/models/enso.webp" alt="" /><span><b>Enso</b><em>{ENSO.tags.join(' · ')}</em></span><i className="cht-auto x-mono">auto</i></div>
          <ul>
            <i className="cht-menu-hl" />
            {ROUTED.map((m) => <li key={m.slug}><img src={`/models/${m.slug}.webp`} alt="" /><b>{m.name}</b><em className="x-mono">{m.tags[0]}</em></li>)}
          </ul>
        </div>
      </div>
    );
  }
  if (k === 'search') {
    return (
      <div className="cht-art cht-art-search">
        <div className="cht-pane">
          <p className="cht-step s1"><i />Searching the web</p>
          <div className="cht-src">{[0, 1, 2].map((j) => <span key={j} style={{ '--j': j }}><i /><b /><b /></span>)}</div>
          <p className="cht-step s2"><i />Running code</p>
          <div className="cht-cell">
            <span className="cht-cell-run">▶</span>
            {[72, 46, 88, 58, 34].map((w, j) => <b key={j} style={{ '--w': w + '%', '--j': j }} />)}
            <em />
          </div>
        </div>
      </div>
    );
  }
  if (k === 'files') {
    return (
      <div className="cht-art cht-art-files">
        <div className="cht-drop">
          {[['Document', 'doc'], ['Sheet', 'sheet'], ['Picture', 'pic']].map(([n, c], j) => (
            <span key={c} className={'cht-file ' + c} style={{ '--j': j }}><i />{n}</span>
          ))}
        </div>
        <div className="cht-art-bar"><span className="cht-chips">{['doc', 'sheet', 'pic'].map((c, j) => <i key={c} className={c} style={{ '--j': j }} />)}</span>Ask anything<b><svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 13V3M4 7l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></b></div>
      </div>
    );
  }
  if (k === 'voice') {
    return (
      <div className="cht-art cht-art-voice">
        <span className="cht-mic"><Ico k="voice" s={30} /></span>
        <div className="cht-wave">{Array.from({ length: 36 }).map((_, j) => <i key={j} style={{ animationDelay: -j * 0.083 + 's', animationDuration: 0.55 + (j % 6) * 0.11 + 's' }} />)}</div>
        <span className="cht-listen dark"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 6v4h2.5L9 13V3L5.5 6H3Z" fill="currentColor" /></svg>Listen</span>
      </div>
    );
  }
  if (k === 'memory') {
    return (
      <div className="cht-art cht-art-memory">
        <div className="cht-convo"><b /><b /><b className="pin"><Ico k="memory" s={14} /></b><b /></div>
        <span className="cht-carry"><Ico k="memory" s={22} /></span>
        <div className="cht-convo two"><b className="pin"><Ico k="memory" s={14} /></b><b /><b /></div>
      </div>
    );
  }
  return (
    <div className="cht-art cht-art-dev">
      <div className="cht-switch"><span>Chat</span><span>Dev</span><i /></div>
      <div className="cht-dev-pane">
        <div className="chat"><b /><b /><b /></div>
        <div className="code">{[38, 70, 56, 82, 30, 64].map((w, j) => <b key={j} style={{ width: w + '%' }} />)}</div>
      </div>
    </div>
  );
}

function Tools() {
  return (
    <AppChapters
      className="cht-ch"
      dark
      label="What Hanzo Chat does"
      head={(
        <div className="v2a-wrap cht-ch-head">
          <AppLines as="h2" view className="v2a-display md cht-ch-h" lines={['A chat that does the work,', 'not just the talking']} soft={[1]} />
        </div>
      )}
      items={TOOLS.map(([title, body, k, short]) => ({ key: k, title, body, short, icon: <Ico k={k} />, art: <Art k={k} /> }))}
    />
  );
}

/* 3. Beyond: who answers what. Enso and the eight models it routes to; the picture comes forward as you point. */
function Who() {
  const [k, setK] = useState('enso');
  const opener = useOpener();
  const pic = useRef(null);
  const m = MODELS.find((x) => x.slug === k) || ENSO;
  const go = (e, slug) => { setK(slug); if (opener && pic.current) opener.open(e, { el: pic.current, src: `/models/${slug}.webp`, href: '/' + slug, key: slug }); };
  return (
    <section className="v2a-sec cht-who-sec" aria-labelledby="cht-who-h">
      <div className="v2a-wrap v2a-grid cht-who-grid">
        <div className="cht-who-l">
          <div className="cht-pic" ref={pic}>
            {MODELS.map((x) => <img key={x.slug} src={`/models/${x.slug}.webp`} alt="" loading="lazy" className={x.slug === k ? 'on' : ''} />)}
            <p className="cht-pic-cap"><b>{m.name}</b><span className="x-mono">{m.tags.join(' · ')}</span></p>
          </div>
        </div>
        <div className="cht-who-r">
          <p className="v2a-kick">{ENSO.name}</p>
          <h2 className="v2a-head cht-who-h" id="cht-who-h">{ENSO.desc}</h2>
          <ul className="cht-roster" onPointerLeave={(e) => { if (e.pointerType === 'mouse') setK('enso'); }}>
            {MODELS.map((x) => (
              <li key={x.slug} className={x.slug === k ? 'on' : ''}>
                <A to={'/' + x.slug} className="cht-row" onPointerEnter={(e) => { if (e.pointerType === 'mouse') setK(x.slug); }} onFocus={() => setK(x.slug)} onClick={(e) => go(e, x.slug)}>
                  <img className="cht-row-pic" src={`/models/${x.slug}.webp`} alt="" loading="lazy" />
                  <b className="cht-row-n">{x.name}</b>
                  <span className="cht-row-d">{x.desc}</span>
                  <span className="cht-row-t x-mono">{x.tags[0]}</span>
                  <i className="cht-row-go" aria-hidden="true">→</i>
                </A>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* 4. The page ends where it starts: a field to ask in, which takes you back up to the live chat. */
function Again() {
  const go = () => {
    const w = document.getElementById('cht-try');
    if (!w) return;
    const y = w.getBoundingClientRect().top + scrollY - (innerHeight - w.offsetHeight) / 2;
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.4 }); else scrollTo({ top: y, behavior: 'smooth' });
    setTimeout(() => w.querySelector('input[aria-label="Ask anything"]')?.focus({ preventScroll: true }), 1300);
  };
  return (
    <section className="v2a-sec cht-again">
      <div className="v2a-wrap">
        <motion.button type="button" className="cht-again-field" onClick={go} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
          <span className="cht-again-ph">Ask anything</span>
          <span className="cht-again-go" aria-hidden="true"><svg viewBox="0 0 16 16" width="22" height="22"><path d="M8 13V3M4 7l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
        </motion.button>
        <div className="cht-again-acts">
          <Go to="/login?next=%2Fchat" solid>Open Hanzo Chat</Go>
          <Go to="https://docs.hanzo.ai/docs/chat">Read the docs</Go>
        </div>
      </div>
    </section>
  );
}

export default function ChatPage() {
  return (
    <main className="cht">
      <Stage />
      <Tools />
      <Who />
      <Again />
    </main>
  );
}
