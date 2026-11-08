'use client';
// Persona: a consumer choosing a chat app (MASTER 1: consumers).
// Goal: open Hanzo Chat. Metric: first_chat.
// CTA: "Open Hanzo Chat" -> /login?next=%2Fchat (hero, header ask bar, closing Band).
// Signature: the live chat runs itself once; each question visibly routes through Enso to the model that answers.
// Beyond: who answers what, Enso's card that opens into each model's page.
/* Hanzo Chat, v4 (JAMES.md, MASTER 4.1). Persona: consumer choosing a chat app. Goal: open Hanzo Chat.
   One idea per screen:
     1. Hero: "Ask anything. Enso picks the model." over the chat window at 100%. The window paints with the first
        question already in it; the run (route, answer, second question, answer) takes about 7 s, then rests with
        replay in its title bar. The h1 cuts into its lines in CSS from the server's first paint.
     2. Six chapters in the dark room: each panel plays a short scene on arrival and keeps a quiet idle after.
        Chapter 01 is the routing moment (a question, Enso, the one model that answers), not the model list.
     3. Proof: the card of whoever answers. Point at a name and the card swaps; open the card and it lifts into
        that model's page. The model list is said once in full here (names), once live in the hero rail.
     4. Close: "Ask anything" as a real prompt (type, press Enter, land in Hanzo Chat), and the three personal plans
        with their own checkouts (Go, Pro) beside it.
   8 Nov (Zack's pages, the home page's bar): every section reads in one frame; Hanzo's halftone lit from one corner;
   the six tools become the page's one dark room (a bento that opens like a curtain); a prompt to try it in the hero
   and the close; working upgrade links (Go and Pro checkouts, the plan ids live hanzo.ai uses). Frame.css is shared.
   Every "Open Hanzo Chat" press shows its hand-off state (aria-busy, ~320 ms) before it leaves.
   Demo words: /chat's own recents and copy, and Hanzo's own black holes and aurora exchange and Dev session from
   hanzo.ai's home (content/live/index.json). Greys only: colour arrives through Hanzo's model artwork. */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { EASE, Copy, Magnetic } from '../ui';
import { A, Img, Cta } from '../kit';
import { useOpener } from '../Opener';
import { href } from '../../lib/route';
import { useDemo } from '../v2/AppDemo';
import { MODELS } from '../../lib/models';
import '../v2/AppLines.css';
import './Frame.css'; // the shared v2a type and wrap (it came in with AppLines before the grid replaced the chapters)
import './ChatPage.css';
import { PLANS, checkout } from '../../lib/plans';

const OPEN = '/login?next=%2Fchat';
const DOCS = 'https://docs.hanzo.ai/docs/chat';
const GO = checkout(PLANS.go.id);
const PRO = checkout(PLANS.pro.id);
const RECENTS = ['Black holes and auroras', 'Email to the landlord', 'Investor update, shorter', 'Three days in Kyoto', 'Code that works, somehow', 'Support reply, API keys', 'Attention, simply', 'Sourdough starter', 'Three emails before lunch', 'Standup, for the absent', 'A fair refund', 'The fundraising deck', 'Interview notes', 'A toast for the team'];
// Hanzo's own exchange (hanzo.ai home, content/live/index.json)
const DEMO = [
  ['How do black holes form?', 'A massive star runs out of fuel and gravity collapses its core into a singularity.'],
  ['What causes the aurora?', 'Solar particles hit gases high over the poles and make them glow.'],
];
// Hanzo Dev's own session (hanzo.ai home, content/live/index.json)
const DEV_CMD = 'dev "Require a bearer token on every API route"';
const DEV_FILE = 'src/middleware/auth.ts';
const DIFF = [
  ['ctx', 'function guard(req) {'],
  ['del', 'return next(req)'],
  ['add', 'const token = bearer(req)'],
  ['add', 'if (!token) return deny()'],
  ['add', 'req.user = await verify(token)'],
  ['add', 'return next(req)'],
];
const DEV_TEST = 'pnpm test src/middleware/auth.test.ts';
const DEV_OK = '14 passed (42ms)';

// hanzo.ai/chat's own window conversation (live, 8 Nov), word for word: it is there from the first paint, as on live
const CONVO = [
  ['How do black holes form?', ['A star much heavier than the Sun burns through its fuel, and its core collapses under its own gravity.', 'When what is left is heavy enough, nothing can stop the collapse, and not even light escapes it.']],
  ['And what makes the aurora?', ['Charged particles from the Sun reach the gas high above the poles.', 'The gas glows as they strike it: oxygen green and red, nitrogen blue and purple.']],
];
const DONE = CONVO.flatMap(([q, a]) => [{ role: 'user', text: q }, { role: 'ai', text: a, model: 'zen', state: 'done' }]);
const ROUTED = MODELS.filter((m) => m.slug !== 'enso');
const ENSO = MODELS[0];
const ZEN = MODELS.find((m) => m.slug === 'zen');
const pic = (slug) => `/models/${slug}.webp`;

/* The one ask is the kit's Cta inside the prompt. The page holds each press for ~320 ms in its busy state before it leaves (Hand-off). */
const Docs = () => <Cta to={DOCS} kind="link" id="chat.docs">Read the docs</Cta>;
const Plan = ({ slot }) => <Cta to={GO} kind="link" id={'chat.go-' + slot}>{`Go is $${PLANS.go.price}/month, every model`}</Cta>;

/* The prompt: the page's way in. Type, press Enter (or the button) and it hands off to Hanzo Chat, as the window's own
   composer does; nothing is sent from this page. The button is the page's one solid ask, "Open Hanzo Chat". */
function Prompt({ slot, big }) {
  const [busy, setBusy] = useState(false);
  const go = (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setTimeout(() => { window.location.href = href(OPEN); }, 280);
  };
  return (
    <form className={'cht-prompt' + (big ? ' big' : '') + (busy ? ' busy' : '')} onSubmit={go}>
      <span className="cht-prompt-o" aria-hidden="true"><Img src={pic('enso')} alt="" w={30} h={30} priority={slot === 'hero'} /></span>
      <input type="text" placeholder="Ask anything" aria-label="Ask anything" maxLength={2000} enterKeyHint="go" autoComplete="off" />
      <Magnetic strength={0.12}><Cta to={OPEN} id={'chat.' + slot} thumb size={big ? 'lg' : 'md'}>Open Hanzo Chat</Cta></Magnetic>
    </form>
  );
}

/* Hand-off (MASTER 2: a cross-origin hand-off shows a pressed state, aria-busy, 200 to 400 ms). Any plain press on a
   link to Hanzo Chat inside the page is held, shown busy, then followed. New-tab presses go straight through. */
function useHandoff() {
  return (e) => {
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!a.getAttribute('href').includes('/login?next=%2Fchat')) return;
    e.preventDefault();
    if (a.hasAttribute('data-leaving')) return;
    a.setAttribute('data-leaving', '');
    a.setAttribute('aria-busy', 'true');
    setTimeout(() => { window.location.href = a.href; }, 320);
    setTimeout(() => { a.removeAttribute('data-leaving'); a.removeAttribute('aria-busy'); }, 2500); // back from the app
  };
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

/* Messages arrive with a CSS rise, so the server's first frame paints at once. */
function Msg({ m, think }) {
  if (m.role === 'user') return <li className="cht-q">{m.text}</li>;
  const who = MODELS.find((x) => x.slug === m.model) || ENSO;
  return (
    <li className="cht-a">
      <span className="cht-who"><Img src={pic(who.slug)} alt="" w={18} h={18} priority />{who.name}</span>
      {think && <span className="cht-dots" role="img" aria-label={ENSO.name}><i /><i /><i /></span>}
      {m.state === 'done' && m.text.map((t) => <p key={t} className="cht-text">{t}</p>)}
      {m.state === 'done' && <span className="cht-tools"><Copy text={m.text.join('\n\n')} /><Listen text={m.text.join(' ')} /></span>}
    </li>
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
        <span className="cht-hub-o"><Img src={pic('enso')} alt="" w={46} h={46} priority /></span>
        <span><b>{ENSO.name}</b><span className="x-mono">{ENSO.tags.join(' · ')}</span></span>
      </div>
      <ul className="cht-lanes" onPointerLeave={(e) => { if (e.pointerType === 'mouse') setPeek(null); }}>
        {ROUTED.map((m, i) => {
          const lit = route.phase === 'pick' && route.pick === m.slug;
          const scan = route.phase === 'scan' && at === i;
          return (
            <li key={m.slug} className={(lit ? 'lit' : '') + (scan ? ' scan' : '') + (peek === m.slug ? ' peek' : '')}>
              {(scan || lit) && <motion.span layoutId="cht-lane" className="cht-lane-bg" transition={{ duration: 0.3, ease: EASE }} />}
              <button type="button" className="cht-lane-b" aria-pressed={peek === m.slug} aria-controls="cht-peek" onPointerEnter={(e) => { if (e.pointerType === 'mouse') setPeek(m.slug); }} onFocus={() => setPeek(m.slug)} onClick={() => setPeek(m.slug)}>
                <Img src={pic(m.slug)} alt="" w={26} h={26} priority />
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

/* The demo's control, as AppDemo's DemoCtl draws it, but always in the server HTML (reduced motion hides it in CSS),
   so a reduced-motion visit hydrates the same tree it was served. */
const CTL = {
  pause: <path d="M5.5 3.5v9M10.5 3.5v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />,
  play: <path d="M5 3.2v9.6L12.6 8 5 3.2Z" fill="currentColor" />,
  replay: <path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
};
function Ctl({ demo }) {
  const done = demo.state === 'done' || demo.state === 'idle';
  const k = done ? 'replay' : demo.state === 'pause' ? 'play' : 'pause';
  return (
    <button type="button" className="v2a-demo-ctl cht-ctl" onClick={demo.toggle} aria-label={done ? 'Replay' : 'Pause'} aria-pressed={done ? undefined : demo.state === 'pause'}>
      <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">{CTL[k]}</svg>
    </button>
  );
}

/* The window: Hanzo's own conversation plays once (about 7 s), then rests. Focus the composer and it is yours; send,
   and the press hands off to Hanzo Chat (nothing is sent from this page). */
function Window() {
  const [msgs, setMsgs] = useState(DONE);
  const [think, setThink] = useState(-1); // the answer Enso is routing right now (its dots show; its words stay)
  const [route, setRoute] = useState({ phase: 'scan', pick: null });
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const [sel, setSel] = useState(0);
  const [busy, setBusy] = useState(false);
  const [find, setFind] = useState(null);
  const [side, setSide] = useState(false); // desktop: the recents drawer, closed by default so the chat has the room
  const input = useRef(null);
  const log = useRef(null);
  const box = useRef(null);

  const scan = async (sleep, n) => { setRoute({ phase: 'scan', pick: null }); for (let s = 0; s < n; s++) { setAt(s % ROUTED.length); await sleep(125); } };
  // the conversation stays whole; Enso routes each answer in turn (its dots on that answer, the rail scanning), then Zen lights
  const demo = useDemo(box, async (sleep) => {
    setMine(false); setSel(0); setMsgs(DONE);
    if (input.current) input.current.value = '';
    for (let k = 0; k < CONVO.length; k++) {
      setThink(2 * k + 1);
      await scan(sleep, 9);
      setThink(-1); setRoute({ phase: 'pick', pick: 'zen' });
      await sleep(1600);
    }
  }, { amount: 0.2 });

  // reduced motion: no script runs, so show the whole final conversation from its start
  useEffect(() => { if (demo.calm) { setMsgs(DONE); setRoute({ phase: 'pick', pick: 'zen' }); } }, [demo.calm]);
  useEffect(() => { const l = log.current; if (l) l.scrollTo({ top: demo.calm ? 0 : l.scrollHeight, behavior: demo.calm ? 'auto' : 'smooth' }); }, [msgs, demo.calm]);

  const takeOver = () => {
    if (mine) return;
    demo.stop(); setMine(true); setSel(-1); setThink(-1);
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
    demo.stop(); setSel(i); setThink(-1);
    if (i === 0) { setMine(false); setMsgs(DONE); setRoute({ phase: 'pick', pick: 'zen' }); }
    else { setMine(true); setMsgs([]); setRoute({ phase: 'idle', pick: null }); }
  };
  const fresh = () => { demo.stop(); setThink(-1); setMine(true); setSel(-1); setMsgs([]); setRoute({ phase: 'idle', pick: null }); input.current?.focus(); };
  const list = RECENTS.map((t, i) => [t, i]).filter(([t]) => !find || t.toLowerCase().includes(find.toLowerCase()));

  return (
    <div className={'cht-win' + (side ? ' side' : '')} ref={box} id="cht-try">
      <div className="cht-bar">
        <span className="cht-dots3" aria-hidden="true"><i /><i /><i /></span>
        <button type="button" className="cht-side-t" aria-label="Recents" aria-expanded={side} aria-controls="cht-side" onClick={() => setSide(!side)}>
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect x="1.8" y="2.8" width="12.4" height="10.4" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M6 3v10" stroke="currentColor" strokeWidth="1.4" /></svg>
        </button>
        <p className="cht-name">Hanzo Chat</p>
        <span className="cht-model"><Img src={pic('enso')} alt="" w={22} h={22} priority />Enso</span>
        <Ctl demo={demo} />
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
                <Cta to={OPEN} kind="quiet" id="chat.recent">Open Hanzo Chat</Cta>
              </div>
            ) : msgs.length === 0 && mine ? (
              <div className="cht-empty"><p className="cht-empty-t">Ask anything</p></div>
            ) : (
              <ul className="cht-msgs">{msgs.map((m, i) => <Msg key={i} m={m} think={think === i} />)}</ul>
            )}
          </div>
          <form className="cht-composer" onSubmit={send}>
            <input ref={input} type="text" placeholder="Ask anything" aria-label="Ask anything" maxLength={2000} onFocus={takeOver} onPointerDown={takeOver} enterKeyHint="send" />
            <motion.button type="submit" className={'cht-send' + (busy ? ' busy' : '')} aria-label="Open Hanzo Chat" aria-busy={busy || undefined} whileTap={{ scale: 0.97 }}>
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 13V3M4 7l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </motion.button>
          </form>
        </div>
        <Rail route={route} at={at} />
      </div>
    </div>
  );
}

/* 1. Hero: the headline cuts into its lines (CSS, from first paint); on the right the whole window, already talking. */
function Hero() {
  const lines = ['Ask anything.', 'Enso picks the model.'];
  return (
    <section className="cht-hero zf-sec" aria-labelledby="cht-h1" data-morph-target data-ask-name="Hanzo Chat">
      <div className="v2a-wrap cht-hero-in">
        <div className="cht-copy">
          <h1 className="v2a-lines v2a-display cht-h1" id="cht-h1">
            {lines.map((l, i) => (
              <span key={i} className="v2a-line"><span className="v2a-line-in cht-cut" style={{ '--i': i }}>{l}</span>{i < lines.length - 1 ? ' ' : ''}</span>
            ))}
          </h1>
          <p className="v2a-lede cht-lede cht-up" style={{ '--d': '.3s' }}>Hanzo Chat searches the web, runs code, reads your files and makes images, in one conversation.</p>
          <div className="cht-up" style={{ '--d': '.4s' }}><Prompt slot="hero" /></div>
          <div className="cht-acts cht-up" style={{ '--d': '.5s' }}>
            <Plan slot="hero" />
            <Docs />
          </div>
        </div>
        <div className="cht-win-wrap">
          <Window />
        </div>
      </div>
    </section>
  );
}

/* 2. The six tools, each with its own UI, in the dark room. Each art plays its short scene when its chapter comes in,
   then keeps a quiet idle while you rest there. */
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
const Line = ({ c, s, j }) => <span className={'cht-ln ' + c} style={{ '--j': j }}><i>{c === 'del' ? '-' : c === 'add' ? '+' : ' '}</i>{s}</span>;
const Who = ({ m = ZEN }) => <p className="cht-mini-who"><Img src={pic(m.slug)} alt="" w={18} h={18} />{m.name}</p>;

function Art({ k }) {
  if (k === 'route') {
    // the routing moment: a question goes in, Enso turns, one model takes it
    return (
      <div className="cht-art cht-art-route">
        <span className="cht-drift"><Img className="cht-art-bg" src={pic('enso')} alt="" w={1200} h={1500} /></span>
        <div className="cht-route">
          <p className="cht-mini-q">{DEMO[0][0]}</p>
          <div className="cht-route-hub"><span className="cht-route-o"><Img src={pic('enso')} alt="" w={56} h={56} /></span><span><b>Enso</b><em className="x-mono">{ENSO.tags[0]}</em></span></div>
          <span className="cht-route-wire" aria-hidden="true"><i /></span>
          <div className="cht-route-pick"><Img src={pic('zen')} alt="" w={40} h={40} /><span><b>Zen</b><em className="x-mono">{ZEN.tags[0]}</em></span><i className="cht-live" /></div>
        </div>
      </div>
    );
  }
  if (k === 'search') {
    return (
      <div className="cht-art cht-art-chat">
        <div className="cht-mini">
          <p className="cht-mini-q">{RECENTS[4]}</p>
          <Who />
          <div className="cht-mini-code x-mono">
            <span className="cht-mini-run"><i>▶</i>{DEV_FILE}</span>
            {DIFF.filter(([c]) => c !== 'del').map(([c, s], j) => <Line key={j} c="ctx" s={(j ? '  ' : '') + s} j={j} />)}
          </div>
          <p className="cht-mini-run2 x-mono"><span>$</span>{DEV_TEST}</p>
          <p className="cht-mini-ok"><span aria-hidden="true">✓</span>{DEV_OK}</p>
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
          <Who />
          <p className="cht-say-t">{DEMO[1][1]}</p>
          <span className="cht-listen dark on"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 6v4h2.5L9 13V3L5.5 6H3Z" fill="currentColor" /></svg>Listen</span>
          <div className="cht-wave">{Array.from({ length: 44 }).map((_, j) => <i key={j} style={{ '--h': (0.18 + Math.abs(Math.sin(j * 1.7)) * 0.82).toFixed(2), '--j': j }}><b /></i>)}</div>
        </div>
      </div>
    );
  }
  if (k === 'memory') {
    return (
      <div className="cht-art cht-art-memory">
        <div className="cht-convo">
          <p className="cht-convo-t">{RECENTS[0]}</p>
          <p className="cht-convo-a">{DEMO[1][0]} <mark>{DEMO[1][1]}</mark></p>
        </div>
        <span className="cht-carry"><span className="cht-carry-in"><Ico k="memory" s={22} /></span></span>
        <div className="cht-convo two">
          <p className="cht-convo-t"><span aria-hidden="true">＋</span>New chat</p>
          <p className="cht-convo-pin"><Ico k="memory" s={14} /><span>{DEMO[1][1]}</span></p>
          <p className="cht-convo-ph">Ask anything</p>
        </div>
      </div>
    );
  }
  // chat, then dev: the conversation, the switch flips, and Dev's session lands its diff
  return (
    <div className="cht-art cht-art-dev">
      <div className="cht-switch"><span>Chat</span><span>Dev</span><i /></div>
      <div className="cht-dev-pane">
        <div className="chat">
          <p className="cht-mini-q">{RECENTS[4]}</p>
          <Who />
          <span className="cht-dots"><i /><i /><i /></span>
        </div>
        <div className="code x-mono">
          <p className="cht-dev-l cmd" style={{ '--j': 0 }}><i>›</i>{DEV_CMD}</p>
          <p className="cht-dev-l" style={{ '--j': 1 }}><b>Read</b>{DEV_FILE}</p>
          <p className="cht-dev-l" style={{ '--j': 2 }}><b>Edit</b></p>
          {DIFF.map(([c, s], j) => <Line key={j} c={c} s={(j ? '  ' : '') + s} j={j + 3} />)}
          <p className="cht-dev-l" style={{ '--j': 9 }}><b>Run</b>{DEV_TEST}</p>
          <p className="cht-dev-l ok" style={{ '--j': 10 }}><i>✓</i>{DEV_OK}<span className="cht-caret" /></p>
        </div>
      </div>
    </div>
  );
}

/* 2. What it does, as hanzo.ai/chat lays it out: one heading and six cards, three by two. Each card carries its own
   small scene (the same art the tools had), which plays once as the card comes into view and again on hover or focus. */
function Tool({ t, d, k, i }) {
  const ref = useRef(null);
  const [play, setPlay] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setPlay((n) => n || 1); io.disconnect(); } }, { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const again = () => setPlay((n) => n + 1);
  // the scene is drawn at 560 × 400 and scaled to the card, so it reads the same at every width
  const art = useRef(null);
  useEffect(() => {
    const el = art.current;
    if (!el) return;
    const ro = new ResizeObserver(() => el.style.setProperty('--k', String(Math.min(el.clientWidth / 560, el.clientHeight / 400))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <li className={'cht-tool zf-dots' + (i === 0 || i === 5 ? ' wide' : '')} ref={ref} style={{ '--i': i }} onPointerEnter={(e) => { if (e.pointerType === 'mouse') again(); }} onFocus={again} tabIndex={-1}>
      <div ref={art} className="v2a-ch-art cht-tool-art" data-play={play ? '' : undefined} aria-hidden="true">
        <div className="cht-tool-scale" key={play}><Art k={k} /></div>
      </div>
      <div className="cht-tool-b">
        <span className="cht-tool-i"><Ico k={k} /></span>
        <h3 className="cht-tool-t">{t}</h3>
        <p className="cht-tool-d">{d}</p>
      </div>
    </li>
  );
}

function Tools() {
  return (
    <section className="zf-room cht-do" aria-labelledby="cht-tools-h">
      <div className="v2a-wrap">
        <div className="zf-head cht-do-head">
          <h2 className="cht-tools-h" id="cht-tools-h">A chat that does the work, not just the talking</h2>
          <p><Cta to={OPEN} kind="link" id="chat.tools">Open Hanzo Chat</Cta></p>
        </div>
        <ul className="cht-tools-g zf-tilt">
          {TOOLS.map(([t, d, k], i) => <Tool key={k} t={t} d={d} k={k} i={i} />)}
        </ul>
      </div>
    </section>
  );
}

/* 3. Proof, who answers: Enso and the eight models it routes to, as one card. Point at (or tap) a name and the card
   swaps to that model; open the card and the picture lifts into the model's own page (the WebGL opener). */
function Answers() {
  const [k, setK] = useState('enso');
  const opener = useOpener();
  const frame = useRef(null);
  const m = MODELS.find((x) => x.slug === k) || ENSO;
  const go = (e) => { if (opener && frame.current) opener.open(e, { el: frame.current, src: pic(m.slug), href: '/' + m.slug, key: m.slug }); };
  return (
    <section className="v2a-sec cht-who-sec zf-sec" aria-labelledby="cht-who-h">
      <div className="v2a-wrap v2a-grid cht-who-grid">
        <div className="cht-who-l zf-rise">
          <A to={'/' + m.slug} className="cht-pic" ref={frame} data-card={m.slug} onClick={go}>
            {MODELS.map((x) => <Img key={x.slug} src={pic(x.slug)} alt="" w={1200} h={1500} className={x.slug === k ? 'on' : ''} />)}
            <span className="cht-pic-cap"><b>{m.name}</b><span className="x-mono">{m.tags.join(' · ')}</span><i aria-hidden="true">→</i></span>
          </A>
        </div>
        <div className="cht-who-r">
          <div className="zf-head zf-solo cht-who-head"><h2 className="cht-who-h" id="cht-who-h">{ENSO.desc}</h2></div>
          <ul className="cht-roster" onPointerLeave={(e) => { if (e.pointerType === 'mouse') setK('enso'); }}>
            {MODELS.map((x) => (
              <li key={x.slug} className={x.slug === k ? 'on' : ''}>
                <button type="button" className="cht-row" aria-pressed={x.slug === k} aria-controls="cht-who-d" onPointerEnter={(e) => { if (e.pointerType === 'mouse') setK(x.slug); }} onFocus={() => setK(x.slug)} onClick={() => setK(x.slug)}>
                  <Img className="cht-row-pic" src={pic(x.slug)} alt="" w={44} h={44} />
                  <b className="cht-row-n">{x.name}</b>
                  <span className="cht-row-t x-mono">{x.tags[0]}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="cht-who-d" id="cht-who-d" aria-live="polite">
            {k !== 'enso' && <span key={k}>{m.desc}</span>}
            <A to={'/' + m.slug} className="cht-who-go" onClick={go}>{m.name} →</A>
          </p>
        </div>
      </div>
    </section>
  );
}

/* 4. The close: "Ask anything" as a real prompt, then the three personal plans in Hanzo's words (hanzo.ai/pricing), each
   with its own way in: Free opens an account, Go and Pro go straight to their checkouts (the plan ids hanzo.ai uses).
   Pro stands lifted and inked, the one recommended. */
const PLANS3 = [
  { k: 'free', name: PLANS.free.name, d: 'Chat and build with Hanzo, free.', price: 'Free', unit: 'No card needed', to: '/signup' },
  { k: 'go', name: PLANS.go.name, d: 'Your everyday AI development toolkit, with access to every model and more included usage.', price: '$' + PLANS.go.price, unit: 'USD/month', to: GO },
  { k: 'pro', name: PLANS.pro.name, d: 'For serious builders running agents, shipping code, and needing substantially higher limits.', price: '$' + PLANS.pro.price, unit: 'USD/month', to: PRO },
];
function Close() {
  return (
    <section className="cht-close zf-close" aria-labelledby="cht-close-h">
      <div className="v2a-wrap">
        <h2 id="cht-close-h">Ask anything</h2>
        <div className="cht-close-p"><Prompt slot="close" big /></div>
        <ul className="cht-plans">
          {PLANS3.map((p) => (
            <li key={p.k} className={'cht-plan zf-lift' + (p.k === 'pro' ? ' rec' : '')}>
              <div className="cht-plan-h"><b>{p.name}</b><span className="cht-plan-p"><strong>{p.price}</strong>{p.unit}</span></div>
              <p>{p.d}</p>
              <Cta to={p.to} kind={p.k === 'pro' ? 'solid' : 'ghost'} size="sm" id={'chat.plan-' + p.k}>Try Hanzo</Cta>
            </li>
          ))}
        </ul>
        <div className="cht-close-l"><Docs /></div>
      </div>
    </section>
  );
}

/* one solid fill per viewport: while the Band's own solid "Open Hanzo Chat" is on screen the header's ask goes quiet
   (html[data-ask=quiet], the shell's own switch), said again after the shell's scroll pass */
function useQuietAtBand() {
  useEffect(() => {
    const H = document.documentElement;
    const band = document.querySelector('main.cht .cht-close');
    if (!band) return;
    let on = false, mine = false, t = 0;
    const apply = () => { if (on) { H.dataset.ask = 'quiet'; mine = true; } else if (mine) { delete H.dataset.ask; mine = false; } };
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; apply(); }, { threshold: 0.35 });
    io.observe(band);
    const onScroll = () => { clearTimeout(t); if (on) t = setTimeout(apply, 160); };
    addEventListener('scroll', onScroll, { passive: true });
    return () => { io.disconnect(); clearTimeout(t); removeEventListener('scroll', onScroll); if (mine) delete H.dataset.ask; };
  }, []);
}

export default function ChatPage() {
  const handoff = useHandoff();
  useQuietAtBand();
  return (
    <main className="cht zf" onClickCapture={handoff}>
      <Hero />
      <Tools />
      <Answers />
      <Close />
    </main>
  );
}
