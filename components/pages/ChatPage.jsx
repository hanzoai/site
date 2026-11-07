'use client';
/* Hanzo Chat, v3 (JAMES.md, PLAN-COMPONENTS 5.7). Persona: consumer choosing a chat app. Goal: open Hanzo Chat.
   CTA: "Open Hanzo Chat" (/login?next=%2Fchat), one solid ask in hero, sticky bar and close. Metric: first_chat.
   One idea per screen:
     1. Hero: "Ask anything. Enso picks the model." over the chat window at 100%, which runs Hanzo's own black holes and
        auroras conversation by itself once, then rests (pause and replay in its title bar).
     2. Six chapters in the one dark middle room: the copy pins while each tool's own UI wipes in and plays its scene.
     3. Who answers what: Enso and the eight models it routes to, a spec sheet you point at; a model opens into its page.
     4. Close (dark): the page ends where it starts, in a field to ask in.
   Signature: the live chat. The question types, Enso scans the models, the one that answers lights, and the answer
   streams. The public try-before-signup is parked (PLAN-COMPONENTS 7): typing hands off to Hanzo Chat instead of
   sending anything, and "Open Hanzo Chat" shows its handoff state before it leaves.
   Motion mix (JAMES.md 9): time (the conversation), arrival (headline cut-in, window rise), state (chapter pill, the
   handoff ring, the rail lane), pointer (magnetic ask, rail and roster previews), scroll (the pinned chapters only).
   Beyond: "Who answers what". Point at (or tap) any model and its own artwork, line and tag come forward; open it and
   the picture lifts into that model's page (the synchronized.studio opener).
   Greys only: colour arrives through Hanzo's own model artwork. Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { EASE, Copy, Magnetic, Btn } from '../ui';
import { A, Img } from '../kit';
import { useOpener } from '../Opener';
import { href } from '../../lib/route';
import AppLines from '../v2/AppLines';
import AppChapters from '../v2/AppChapters';
import { useDemo, DemoCtl } from '../v2/AppDemo';
import { MODELS } from '../../lib/models';
import './ChatPage.css';

const OPEN = '/login?next=%2Fchat';
const DOCS = 'https://docs.hanzo.ai/docs/chat';
const RECENTS = ['Black holes and auroras', 'Email to the landlord', 'Investor update, shorter', 'Three days in Kyoto', 'Code that works, somehow', 'Support reply, API keys', 'Attention, simply', 'Sourdough starter', 'Three emails before lunch', 'Standup, for the absent', 'A fair refund', 'The fundraising deck', 'Interview notes', 'A toast for the team'];
const DEMO = [
  ['How do black holes form?', 'A star much heavier than the Sun burns through its fuel, and its core collapses under its own gravity.\n\nWhen what is left is heavy enough, nothing can stop the collapse, and not even light escapes it.'],
  ['And what makes the aurora?', 'Charged particles from the Sun reach the gas high above the poles.\n\nThe gas glows as they strike it: oxygen green and red, nitrogen blue and purple.'],
];
const DONE = DEMO.flatMap(([q, a]) => [{ role: 'user', text: q }, { role: 'ai', text: a, model: 'zen', state: 'done' }]);
const ROUTED = MODELS.filter((m) => m.slug !== 'enso');
const ENSO = MODELS[0];
const pic = (slug) => `/models/${slug}.webp`;

/* The one ask, with its handoff state: the press answers at once (the kit's ring turns in place of the label), then
   it leaves for Hanzo Chat. */
function Open({ className = '', slot = 'hero' }) {
  const [busy, setBusy] = useState(false);
  const go = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    setBusy(true);
    setTimeout(() => { window.location.href = href(OPEN); }, 280);
  };
  return (
    <Magnetic strength={0.18}>
      <Btn href={href(OPEN)} solid busy={busy} className={'cht-open ' + className} onClick={go} data-thumb="Open Hanzo Chat" data-cta={'chat.' + slot}>
        <span>Open Hanzo Chat</span>
        <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </Btn>
    </Magnetic>
  );
}

const Docs = ({ dark }) => (
  <A to={DOCS} className={'cht-link' + (dark ? ' dark' : '')}>
    <span>Read the docs</span>
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </A>
);

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
  if (m.role === 'user') return <motion.li className="cht-q" initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4, ease: EASE }}>{m.text}</motion.li>;
  const who = MODELS.find((x) => x.slug === m.model) || ENSO;
  return (
    <motion.li className="cht-a" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
      <span className="cht-who"><Img src={pic(who.slug)} alt="" w={18} h={18} />{who.name}</span>
      {m.state === 'wait' && <span className="cht-dots" role="img" aria-label={ENSO.name}><i /><i /><i /></span>}
      {m.state === 'stream' && <p className="cht-text"><span ref={live} /><span className="cht-caret" aria-hidden="true" /></p>}
      {m.state === 'done' && <p className="cht-text">{m.text}</p>}
      {m.state === 'done' && <span className="cht-tools"><Copy text={m.text} /><Listen text={m.text} /></span>}
    </motion.li>
  );
}

/* The router: Enso on top, the models it sends to below; a scan runs while it decides, then one lights.
   Any model you point at or tap says what it is for; otherwise the one that answered (or Enso) does. */
function Rail({ route, at }) {
  const [peek, setPeek] = useState(null);
  const shown = MODELS.find((m) => m.slug === peek) || (route.phase === 'pick' && MODELS.find((m) => m.slug === route.pick)) || ENSO;
  return (
    <aside className="cht-rail" aria-label={ENSO.desc}>
      <div className={'cht-hub' + (route.phase === 'scan' ? ' busy' : '')}>
        <span className="cht-hub-o"><Img src={pic('enso')} alt="" w={46} h={46} /></span>
        <span><b>{ENSO.name}</b><span>{ENSO.desc}</span></span>
      </div>
      <ul className="cht-lanes" onPointerLeave={(e) => { if (e.pointerType === 'mouse') setPeek(null); }}>
        {ROUTED.map((m, i) => {
          const lit = route.phase === 'pick' && route.pick === m.slug;
          const scan = route.phase === 'scan' && at === i;
          return (
            <li key={m.slug} className={(lit ? 'lit' : '') + (scan ? ' scan' : '') + (peek === m.slug ? ' peek' : '')}>
              {(scan || lit) && <motion.span layoutId="cht-lane" className="cht-lane-bg" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
              <button type="button" className="cht-lane-b" aria-pressed={peek === m.slug} aria-controls="cht-peek" onPointerEnter={(e) => { if (e.pointerType === 'mouse') setPeek(m.slug); }} onFocus={() => setPeek(m.slug)} onClick={() => setPeek(m.slug)}>
                <Img src={pic(m.slug)} alt="" w={26} h={26} />
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

/* The window: Hanzo's own conversation plays once, then rests. Focus the composer and it is yours; send, and the
   press hands off to Hanzo Chat (nothing is sent from this page). */
function Window() {
  const [msgs, setMsgs] = useState(DONE);
  const [route, setRoute] = useState({ phase: 'pick', pick: 'zen' });
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const [sel, setSel] = useState(0);
  const [busy, setBusy] = useState(false);
  const [find, setFind] = useState(null);
  const [side, setSide] = useState(false); // desktop: the recents drawer, closed by default so the chat has the room
  const input = useRef(null);
  const live = useRef(null);
  const log = useRef(null);
  const box = useRef(null);

  const demo = useDemo(box, async (sleep) => {
    setMine(false); setSel(0);
    setMsgs([]); setRoute({ phase: 'idle', pick: null });
    await sleep(500);
    for (const [q, a] of DEMO) {
      const el = input.current;
      for (let i = 1; i <= q.length; i++) { if (el) el.value = q.slice(0, i); await sleep(36 + (i % 4) * 9); }
      await sleep(320);
      if (el) el.value = '';
      setMsgs((m) => [...m, { role: 'user', text: q }, { role: 'ai', state: 'wait', model: 'enso' }]);
      setRoute({ phase: 'scan', pick: null });
      await sleep(1200);
      setRoute({ phase: 'pick', pick: 'zen' });
      setMsgs((m) => [...m.slice(0, -1), { role: 'ai', state: 'stream', model: 'zen', text: a }]);
      await sleep(40);
      for (let i = 0; i <= a.length; i += 3) { if (live.current) live.current.textContent = a.slice(0, i); await sleep(16); }
      setMsgs((m) => [...m.slice(0, -1), { role: 'ai', state: 'done', model: 'zen', text: a }]);
      await sleep(1100);
    }
  }, { amount: 0.3 });

  // the scan: a light moving down the models while Enso decides (only while the conversation runs)
  useEffect(() => {
    if (route.phase !== 'scan') return;
    const t = setInterval(() => setAt((v) => (v + 1) % ROUTED.length), 140);
    return () => clearInterval(t);
  }, [route.phase]);
  useEffect(() => { const l = log.current; if (l) l.scrollTo({ top: l.scrollHeight, behavior: demo.calm ? 'auto' : 'smooth' }); }, [msgs, demo.calm]);

  const takeOver = () => {
    if (mine) return;
    demo.stop(); setMine(true); setSel(-1);
    if (input.current) input.current.value = '';
    setMsgs([]); setRoute({ phase: 'idle', pick: null });
  };
  const send = (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setTimeout(() => { window.location.href = href(OPEN); }, 280);
  };
  const open = (i) => {
    demo.stop(); setSel(i);
    if (i === 0) { setMine(false); setMsgs(DONE); setRoute({ phase: 'pick', pick: 'zen' }); }
    else { setMine(true); setMsgs([]); setRoute({ phase: 'idle', pick: null }); }
  };
  const fresh = () => { demo.stop(); setMine(true); setSel(-1); setMsgs([]); setRoute({ phase: 'idle', pick: null }); input.current?.focus(); };
  const list = RECENTS.map((t, i) => [t, i]).filter(([t]) => !find || t.toLowerCase().includes(find.toLowerCase()));

  return (
    <div className={'cht-win' + (side ? ' side' : '')} ref={box} id="cht-try">
      <div className="cht-bar">
        <span className="cht-dots3" aria-hidden="true"><i /><i /><i /></span>
        <button type="button" className="cht-side-t" aria-label="Recents" aria-expanded={side} aria-controls="cht-side" onClick={() => setSide(!side)}>
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect x="1.8" y="2.8" width="12.4" height="10.4" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M6 3v10" stroke="currentColor" strokeWidth="1.4" /></svg>
        </button>
        <p className="cht-name">Hanzo Chat</p>
        <span className="cht-model"><Img src={pic('enso')} alt="" w={22} h={22} />Enso</span>
        <DemoCtl demo={demo} className="cht-ctl" />
      </div>
      <div className="cht-body">
        <nav className="cht-side" id="cht-side" aria-label="Recents">
          <button type="button" className="cht-new" onClick={fresh}><span aria-hidden="true">＋</span>New chat</button>
          {find === null
            ? <button type="button" className="cht-find" onClick={() => setFind('')}><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>Search</button>
            : <input className="cht-find-in" autoFocus value={find} onChange={(e) => setFind(e.target.value)} onBlur={() => !find && setFind(null)} placeholder="Search" aria-label="Search" />}
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
          <div className="cht-log" ref={log} data-lenis-prevent aria-live="polite">
            {sel > 0 ? (
              <div className="cht-empty">
                <p className="cht-empty-t">{RECENTS[sel]}</p>
                <A to={OPEN} className="x-btn cht-empty-b">Open Hanzo Chat</A>
              </div>
            ) : msgs.length === 0 && mine ? (
              <div className="cht-empty"><p className="cht-empty-t">Ask anything</p></div>
            ) : (
              <ul className="cht-msgs">{msgs.map((m, i) => <Msg key={i} m={m} live={live} />)}</ul>
            )}
          </div>
          <form className="cht-composer" onSubmit={send}>
            <input ref={input} type="text" placeholder="Ask anything" aria-label="Ask anything" maxLength={2000} onFocus={takeOver} onPointerDown={takeOver} enterKeyHint="send" />
            <motion.button type="submit" className={'cht-send' + (busy ? ' busy' : '')} aria-label="Open Hanzo Chat" aria-busy={busy || undefined} whileTap={{ scale: 0.92 }}>
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 13V3M4 7l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </motion.button>
          </form>
        </div>
        <Rail route={route} at={at} />
      </div>
    </div>
  );
}

/* 1. Hero: the headline on the left cuts into its lines; on the right the whole window, at 100%, already talking. */
function Hero() {
  return (
    <section className="cht-hero" aria-labelledby="cht-h1" data-morph-target data-ask-name="Hanzo Chat">
      <div className="v2a-wrap cht-hero-in">
        <div className="cht-copy">
          <AppLines as="h1" id="cht-h1" className="v2a-display cht-h1" lines={['Ask anything.', 'Enso picks', 'the model.']} />
          <motion.p className="v2a-lede cht-lede" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}>Hanzo Chat searches the web, runs code, reads your files and makes images, in one conversation.</motion.p>
          <motion.div className="cht-acts" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.4 }}>
            <Open slot="hero" />
            <Docs />
          </motion.div>
        </div>
        <motion.div className="cht-win-wrap" initial={{ opacity: 0, x: 48 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}>
          <Window />
        </motion.div>
      </div>
    </section>
  );
}

/* 2. The six tools, each with its own UI, in the dark room. Each art plays its short scene when its chapter comes in. */
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
const Ico = ({ k, s = 17 }) => <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden="true">{ICON[k]}</svg>;

// The scenes are the app itself, in Hanzo's own words: its recents, its conversation, its "Listen", and the code of
// Hanzo Dev's sample session (an illustration, as on /dev).
const RETRY = [
  ['ctx', 'export async function retry(fn, tries = 3) {'],
  ['del', '  for (let i = 1; i < tries; i++) {'],
  ['add', '  for (let i = 0; i < tries; i++) {'],
  ['ctx', '    try { return await fn(); } catch (e) { last = e; }'],
  ['ctx', '  }'],
];
const GLOW = DEMO[1][1].split('\n\n')[1].split(': ');
const Line = ({ c, s, j }) => <span className={'cht-ln ' + c} style={{ '--j': j }}><i>{c === 'del' ? '-' : c === 'add' ? '+' : ' '}</i>{s}</span>;

function Art({ k }) {
  if (k === 'route') {
    return (
      <div className="cht-art cht-art-route">
        <Img className="cht-art-bg" src={pic('enso')} alt="" w={1200} h={1500} />
        <div className="cht-menu">
          <div className="cht-menu-h"><Img src={pic('enso')} alt="" w={36} h={36} /><span><b>Enso</b><em>{ENSO.tags.join(' · ')}</em></span></div>
          <ul>
            <i className="cht-menu-hl" />
            {ROUTED.map((m) => <li key={m.slug}><Img src={pic(m.slug)} alt="" w={26} h={26} /><b>{m.name}</b><em className="x-mono">{m.tags[0]}</em></li>)}
          </ul>
        </div>
      </div>
    );
  }
  if (k === 'search') {
    return (
      <div className="cht-art cht-art-chat">
        <div className="cht-mini">
          <p className="cht-mini-q">{RECENTS[4]}</p>
          <p className="cht-mini-who"><Img src={pic('zen')} alt="" w={18} h={18} />Zen</p>
          <div className="cht-mini-code x-mono">
            <span className="cht-mini-run"><i>▶</i>retry.ts</span>
            {RETRY.filter(([c]) => c !== 'del').map(([c, s], j) => <Line key={j} c={c === 'add' ? 'ctx' : c} s={s} j={j} />)}
          </div>
          <p className="cht-mini-ok"><span aria-hidden="true">✓</span>{RECENTS[4]}</p>
        </div>
      </div>
    );
  }
  if (k === 'files') {
    return (
      <div className="cht-art cht-art-files">
        <div className="cht-attach">
          <span className="cht-chip doc" style={{ '--j': 0 }}><i />{RECENTS[11]}</span>
          <span className="cht-chip sheet" style={{ '--j': 1 }}><i />{RECENTS[2]}</span>
          <span className="cht-chip pic" style={{ '--j': 2 }}><Img src={pic('iro')} alt="" w={40} h={50} /></span>
        </div>
        <div className="cht-art-bar"><span className="cht-art-ph">Ask anything</span><b><svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 13V3M4 7l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></b></div>
      </div>
    );
  }
  if (k === 'voice') {
    return (
      <div className="cht-art cht-art-voice">
        <div className="cht-say">
          <p className="cht-mini-who"><Img src={pic('zen')} alt="" w={18} h={18} />Zen</p>
          <p className="cht-say-t">{DEMO[1][1].split('\n\n')[0]}</p>
          <span className="cht-listen dark on"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 6v4h2.5L9 13V3L5.5 6H3Z" fill="currentColor" /></svg>Listen</span>
          <div className="cht-wave">{Array.from({ length: 44 }).map((_, j) => <i key={j} style={{ '--h': (0.18 + Math.abs(Math.sin(j * 1.7)) * 0.82).toFixed(2), '--j': j }} />)}</div>
        </div>
      </div>
    );
  }
  if (k === 'memory') {
    return (
      <div className="cht-art cht-art-memory">
        <div className="cht-convo">
          <p className="cht-convo-t">{RECENTS[0]}</p>
          <p className="cht-convo-a">{GLOW[0]}: <mark>{GLOW[1]}</mark></p>
        </div>
        <span className="cht-carry"><Ico k="memory" s={22} /></span>
        <div className="cht-convo two">
          <p className="cht-convo-t"><span aria-hidden="true">＋</span>New chat</p>
          <p className="cht-convo-pin"><Ico k="memory" s={14} /><span>{GLOW[1]}</span></p>
          <p className="cht-convo-ph">Ask anything</p>
        </div>
      </div>
    );
  }
  return (
    <div className="cht-art cht-art-dev">
      <div className="cht-switch"><span>Chat</span><span>Dev</span><i /></div>
      <div className="cht-dev-pane">
        <div className="chat"><p className="cht-mini-q">{RECENTS[4]}</p></div>
        <div className="code x-mono">{RETRY.map(([c, s], j) => <Line key={j} c={c} s={s} j={j} />)}</div>
      </div>
    </div>
  );
}

function Tools() {
  return (
    <AppChapters
      className="cht-ch"
      dark
      id="cht-tools"
      label="A chat that does the work, not just the talking"
      head={(
        <div className="v2a-wrap cht-ch-head">
          <AppLines as="h2" view className="v2a-display md cht-ch-h" lines={['A chat that does the work,', 'not just the talking']} soft={[1]} />
        </div>
      )}
      items={TOOLS.map(([title, body, k]) => ({ key: k, title, body, icon: <Ico k={k} />, art: <Art k={k} /> }))}
    />
  );
}

/* 3. Beyond: who answers what. Enso and the eight models it routes to; the picture comes forward as you point, and a
   model opens into its own page with its picture (the WebGL opener). */
function Who() {
  const [k, setK] = useState('enso');
  const opener = useOpener();
  const frame = useRef(null);
  const m = MODELS.find((x) => x.slug === k) || ENSO;
  const go = (e, slug) => { setK(slug); if (opener && frame.current) opener.open(e, { el: frame.current, src: pic(slug), href: '/' + slug, key: slug }); };
  return (
    <section className="v2a-sec cht-who-sec" aria-labelledby="cht-who-h">
      <div className="v2a-wrap v2a-grid cht-who-grid">
        <div className="cht-who-l">
          <div className="cht-pic" ref={frame}>
            {MODELS.map((x) => <Img key={x.slug} src={pic(x.slug)} alt="" w={1200} h={1500} className={x.slug === k ? 'on' : ''} />)}
            <p className="cht-pic-cap" aria-hidden="true"><b>{m.name}</b><span className="x-mono">{m.tags.join(' · ')}</span></p>
          </div>
        </div>
        <div className="cht-who-r">
          <h2 className="v2a-head cht-who-h" id="cht-who-h">{ENSO.desc}</h2>
          <ul className="cht-roster" onPointerLeave={(e) => { if (e.pointerType === 'mouse') setK('enso'); }}>
            {MODELS.map((x) => (
              <li key={x.slug} className={x.slug === k ? 'on' : ''}>
                <A to={'/' + x.slug} className="cht-row" data-card={x.slug} onPointerEnter={(e) => { if (e.pointerType === 'mouse') setK(x.slug); }} onFocus={() => setK(x.slug)} onClick={(e) => go(e, x.slug)}>
                  <Img className="cht-row-pic" src={pic(x.slug)} alt="" w={44} h={44} />
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

/* 4. The close: the page ends where it starts, in a field to ask in, which takes you back up to the live chat. */
function Close() {
  const go = () => {
    const w = document.getElementById('cht-try');
    if (!w) return;
    const y = w.getBoundingClientRect().top + scrollY - Math.max(80, (innerHeight - w.offsetHeight) / 2);
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.2 }); else scrollTo({ top: y, behavior: 'smooth' });
    setTimeout(() => w.querySelector('input[aria-label="Ask anything"]')?.focus({ preventScroll: true }), 1200);
  };
  return (
    <section className="cht-close" data-room="dark" aria-label="Ask anything">
      <div className="v2a-wrap">
        <motion.button type="button" className="cht-field" onClick={go} whileTap={{ scale: 0.99 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
          <span className="cht-field-ph">Ask anything</span>
          <span className="cht-field-go" aria-hidden="true"><svg viewBox="0 0 16 16" width="22" height="22"><path d="M8 13V3M4 7l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
        </motion.button>
        <div className="cht-close-acts">
          <Open className="on-dark" slot="close" />
          <Docs dark />
        </div>
      </div>
    </section>
  );
}

export default function ChatPage() {
  return (
    <main className="cht">
      <Hero />
      <Tools />
      <Who />
      <Close />
    </main>
  );
}
