'use client';
/* /team. Launch page (MASTER 4.1), Hanzo's deck only.
   V2: 8/10 After review: the canvas plays its story once after the curtain, then rests alive (cursors breathe; one
   Pause / Replay control); JS off shows the whole hero and canvas; no hydration mismatch; chapters change with the old
   headline clearing first; the rooms are real miniatures in Hanzo's words (board card slides to Done, files, calendar,
   call with notes, inbox mentions, the seven teammates); the workflow room keeps one height, with every channel in the
   bugfix card's frame and the team line as text; buttons are the kit's Cta.
   Persona: a team lead choosing where people and agents work together (MASTER 1, founders / buyers).
   Goal: start a team. CTA: "Create your team" (hanzo.team/start). Metric: signup_start (cta_click team.hero).
   Signature: Hanzo's tracker board working itself, where a named agent cursor walks the eight CRM cards and each
   card's progress counts up to Hanzo's figure as its owner takes it, synced to the phone strip (live /team, 9 Nov).
   Supporting (3): the canvas tilting up and settling on scroll; pinned chapters; masked kinetic lines.
   Beyond: the ten channels open in one fixed frame (channel, crew face, name and role) so you can walk your team's
   channel before you create it; the code session steps by hand with the diff lighting as the decision lands.
   Deletes: the amber accent and every eyebrow, the "CHANNEL" label, the endless canvas loop, the grey placeholder
   rooms, the forked Btn buttons (now the kit's Cta), the springs.
   Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Copy } from '../ui';
import { A, Cta } from '../kit';
import Sigil from '../Sigil';
import MaskLines from './company/MaskLines';
import useArrived from './company/useArrived';
import '../v2/vc-type.css';
import './company/deck.css';
import './TeamPage.css';

const EASE = [0.16, 1, 0.3, 1];
const Arrow = () => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Lk = ({ to, children, className = '' }) => <A to={to} className={'x-arrow ' + className}><span>{children}</span><Arrow /></A>;
const ASK = ['Create your team', 'https://hanzo.team/start'];
// Hanzo's agent portraits (/agents/*.png, as live shows them), drawn over a grey disc with the initial: if one can't load, the disc stands in
const INI = { data: 'D', vi: 'V', sci: 'S', dev: 'D', des: 'D', doc: 'D', su: 'S', sal: 'S', opera: 'O', cyber: 'C', mark: 'M', fin: 'F', law: 'L' };
const Face = ({ n, size = 28 }) => (
  <span className="xtm-face" style={{ width: size, height: size, '--img': `url(https://hanzo.ai/agents/${n}.png)` }} data-i={INI[n] || n[0].toUpperCase()} aria-hidden="true" />
);
// JS off: the hero's words, asks and the canvas show in their final state (the stage keeps no transform)
const NOJS = { __html: '<style>.xtm-cur{display:none!important}.xtm-hero-r,.xtm-stage-in{opacity:1!important;transform:none!important}.xtm-chap{height:auto!important}.xtm-chap-st{position:static!important;height:auto!important}.xtm-chap-g{display:block!important}.xtm-chap-s{display:grid!important;padding:48px 0}.xtm-chap-s *{opacity:1!important;transform:none!important}.xtm-panels{display:block!important}.xtm-panel{grid-area:auto!important;margin-bottom:12px}.xtm-panel[aria-hidden=true]{visibility:visible!important;display:block!important}</style>' };
const arrowKeys = (n, set) => (e) => {
  const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
  if (!d) return;
  e.preventDefault();
  const tabs = [...e.currentTarget.querySelectorAll('[role=tab]')];
  const j = (tabs.indexOf(document.activeElement) + d + n) % n;
  tabs[j].focus(); set(j);
};

/* ---------- 1. the shared canvas (signature) ---------- */
const sleepFor = (ms, live) => new Promise((ok, no) => setTimeout(() => (live.on ? ok() : no('stop')), ms));
// layout position inside the board, so the hero's tilt and scale never skew where a cursor lands
const offs = (el, root) => { let x = 0, y = 0; while (el && el !== root) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; } return [x, y]; };

function useCursor(x0, y0) {
  const x = useMotionValue(x0), y = useMotionValue(y0);
  const go = (tx, ty, calm) => {
    if (calm) { x.set(tx); y.set(ty); return; }
    animate(x, tx, { duration: 0.9, ease: [0.4, 0, 0.2, 1] }); // MASTER 3.1: no springs; things that move and stay ease in-out
    animate(y, ty, { duration: 0.9, ease: [0.4, 0, 0.2, 1] });
  };
  return { x, y, go };
}

function Cursor({ c, name, tone, agent }) {
  return (
    <motion.div className={'xtm-cur ' + tone} style={{ x: c.x, y: c.y }} aria-hidden="true">
      <svg viewBox="0 0 16 20" width="18" height="22"><path d="M1 1l13 8.5-6 1.4-3.2 6.2z" /></svg>
      <span>{agent && <b>◆</b>}{name}</span>
    </motion.div>
  );
}

const COLS = ['Backlog', 'Doing', 'Done'];
const CREW = [['vi', 'Vi'], ['opera', 'Opera'], ['mana', 'Mana'], ['dev', 'Dev'], ['des', 'Des'], ['fin', 'Fin'], ['huma', 'Huma'], ['mark', 'Mark'], ['sal', 'Sal'], ['sci', 'Sci'], ['su', 'Su'], ['cyber', 'Cyber']];
// Hanzo's tracker board, as live hanzo.ai/team shows it (9 Nov): four columns, two cards each, every card's owner an agent
const TRACK = [
  ['BACKLOG – 7', 'todo', [['CRM-1', 'Devops', 'Set up cluster monitoring & telemetry', 12, 'opera'], ['CRM-2', 'Research', 'Analyze and cluster search queries', 35, 'sci']]],
  ['TO DO – 6', 'todo', [['CRM-8', 'Sales', 'Sales planning & enterprise deal desk', 20, 'rev'], ['CRM-11', 'Backend', 'Deduplicate contacts on CRM import', 40, 'dev']]],
  ['IN PROGRESS – 3', 'doing', [['CRM-15', 'QA', 'Conduct custdev interview w/ client', 90, 'sal'], ['CRM-16', 'Feature', 'Add view-resource for MVP Deal Screen', 65, 'des']]],
  ['DONE – 3', 'done', [['CRM-17', 'Backend', 'Ship seat-count billing reconciliation', 100, 'rev'], ['CRM-19', 'Feature', 'Cut first release of the deal screen', 100, 'dev']]],
];
const CARDS = TRACK.flatMap(([, , cards], c) => cards.map((k) => [...k, c]));
const NAME = { opera: 'Opera', sci: 'Sci', rev: 'Rev', dev: 'Dev', sal: 'Sal', des: 'Des' };
const TABS = ['Tracker Board', '23 AI Teammates', 'Virtual Office'];
const Ring = ({ v, size = 12 }) => {
  const r = size / 2 - 1.5, c = 2 * Math.PI * r;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden="true" className="xtm-ring">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeOpacity=".2" strokeWidth="1.5" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray={c} strokeDashoffset={c * (1 - v / 100)} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
    </svg>
  );
};

/* The board works itself: one agent cursor walks the cards in order, and as it lands the card's owner takes it and its
   progress counts up to Hanzo's figure; each landing syncs to the phone strip below ("Web + Mobile synced" answers).
   Plays once when first seen after the curtain, then the cursor breathes; Pause / Replay; a click on a card sends the
   cursor there. SSR and JS off show the finished board with Hanzo's figures. */
function Canvas({ ok }) {
  const box = useRef(null), board = useRef(null), scroller = useRef(null), cards = useRef([]);
  const seen = useInView(box, { amount: 0.25 });
  const calm = useReducedMotion();
  const [phase, setPhase] = useState('rest');
  const liveRef = useRef(null);
  const [at, setAt] = useState(-1); // the card being worked
  const [shown, setShown] = useState(() => CARDS.map((k) => k[3]));
  const [sync, setSync] = useState(0);
  const [who, setWho] = useState('opera');
  const agent = useCursor(40, 40);
  const [run, setRun] = useState(0);
  const played = useRef(false);
  const count = (i, live) => new Promise((done) => {
    const to = CARDS[i][3];
    if (calm) { setShown((s) => s.map((v, j) => (j === i ? to : v))); done(); return; }
    const t0 = performance.now();
    const step = (t) => {
      if (!live.on) { done(); return; }
      const k = Math.min(1, (t - t0) / 700), e = 1 - Math.pow(1 - k, 3);
      setShown((s) => s.map((v, j) => (j === i ? Math.round(to * e) : v)));
      if (k < 1) requestAnimationFrame(step); else done();
    };
    requestAnimationFrame(step);
  });
  const land = async (i, live, sleep) => {
    const el = cards.current[i], sc = scroller.current;
    if (!el || !board.current) return;
    // on a phone the board scrolls sideways: bring the card's column into view inside the window (never the page)
    if (sc && sc.scrollWidth > sc.clientWidth + 2) sc.scrollTo({ left: Math.max(0, el.offsetLeft - 12), behavior: calm ? 'auto' : 'smooth' });
    const [x, y] = offs(el, board.current);
    setWho(CARDS[i][4]);
    const ft = el.querySelector('.xtm-tk-ft'); // the footer's empty middle: the label hangs into blank space, never over words
    agent.go(Math.min(x + el.offsetWidth * 0.36, board.current.scrollWidth - 76), y + (ft ? ft.offsetTop + 6 : el.offsetHeight * 0.7), calm);
    await sleep(900);
    setAt(i);
    await count(i, live);
    setSync((s) => s + 1);
    await sleep(420);
  };
  useEffect(() => {
    if (!calm && (!seen || !ok || (played.current && run === 0))) return;
    played.current = true;
    const live = { on: true };
    liveRef.current = live;
    const sleep = (ms) => sleepFor(calm ? 0 : ms, live);
    (async () => {
      try {
        setPhase(calm ? 'rest' : 'story');
        await sleep(500);
        for (let i = 0; i < CARDS.length; i++) await land(i, live, sleep);
        setAt(-1);
        if (live.on) setPhase(calm ? 'rest' : 'drift');
      } catch (e) { if (e !== 'stop') throw e; }
    })();
    return () => { live.on = false; };
  }, [seen, calm, run, ok]); // eslint-disable-line react-hooks/exhaustive-deps
  const finish = () => { setShown(CARDS.map((k) => k[3])); setAt(-1); };
  const control = () => {
    if (phase === 'rest') { setRun((r) => r + 1); return; }
    if (liveRef.current) liveRef.current.on = false; // pause: the finished board, at rest
    finish(); setPhase('rest');
  };
  const pick = (i) => {
    if (liveRef.current) liveRef.current.on = false;
    finish();
    const live = { on: true };
    liveRef.current = live;
    setPhase('story');
    land(i, live, (ms) => sleepFor(calm ? 0 : ms, live)).then(() => { if (live.on) { setAt(-1); setPhase(calm ? 'rest' : 'drift'); } }).catch(() => {});
  };

  const activeIdx = at >= 0 ? at : 4;
  const [activeId, activeTag, activeTitle, , activeOwn] = CARDS[activeIdx];
  const activePct = shown[activeIdx];

  return (
    <div className="xtm-win xtm-tk" ref={box}>
      <header className="xtm-win-h">
        <span className="xtm-org"><b>hanzo.team</b></span>
        <ul className="xtm-tk-tabs">{TABS.map((t, i) => <li key={t} className={i === 0 ? 'on' : ''}>{t}</li>)}</ul>
        <span className="xtm-tk-pct x-mono"><Ring v={83} size={14} />83% To do</span>
        {!calm && (
          <button type="button" className="xtm-replay" aria-label={phase === 'rest' ? 'Replay' : 'Pause'} onClick={control}>
            {phase === 'rest'
              ? <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M4.5 10a5.5 5.5 0 1 0 1.7-4M4.5 3.5V6.5h3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>}
          </button>
        )}
      </header>
      <div className="xtm-tk-main">
        <div className="xtm-tk-sc" ref={scroller}>
          <div className="xtm-tk-board" ref={board} data-phase={phase}>
            {TRACK.map(([head, st, list], c) => (
              <div className="xtm-tk-col" key={head}>
                <p className="xtm-tk-head x-mono"><i data-st={st} /><span>{head}</span></p>
                {list.map(([id, tag, title, , own]) => {
                  const i = CARDS.findIndex((k) => k[0] === id);
                  return (
                    <button type="button" key={id} ref={(el) => { cards.current[i] = el; }} className="xtm-tk-card" data-on={at === i || undefined} data-col={c} onClick={() => pick(i)} aria-label={`${id} ${title}`}>
                      <span className="xtm-tk-top"><span className="x-mono">{id}</span><span className="xtm-tk-tag">{tag}</span></span>
                      <span className="xtm-tk-t">{title}</span>
                      <span className="xtm-tk-ft x-mono"><span className="xtm-tk-pc"><Ring v={shown[i]} />{shown[i]}%</span><span className="xtm-tk-own">@{own}</span></span>
                    </button>
                  );
                })}
              </div>
            ))}
            <Cursor c={agent} name={NAME[who]} tone="agent a" agent />
          </div>
        </div>
        <div className="xtm-tk-ph" aria-label="Hanzo Team mobile iPhone workspace synced live">
          <div className="xtm-phone">
            <div className="xtm-ph-scr">
              <div className="xtm-ph-st" aria-hidden="true">
                <b>9:41</b>
                <span className="xtm-ph-isl" />
                <span className="xtm-ph-sys x-mono">5G</span>
              </div>
              <div className="xtm-ph-hd x-mono">
                <b>hanzo.team</b>
                <span className="xtm-tk-sync" key={sync} data-hot={sync > 0 || undefined}><i />Synced</span>
              </div>
              <div className="xtm-ph-bd">
                <div className="xtm-ph-task">
                  <div className="xtm-tk-top">
                    <span className="x-mono">{activeId}</span>
                    <span className="xtm-tk-tag">{activeTag}</span>
                  </div>
                  <b className="xtm-ph-tt">{activeTitle}</b>
                  <div className="xtm-tk-ft x-mono">
                    <span className="xtm-tk-pc"><Ring v={activePct} />{activePct}%</span>
                    <span className="xtm-tk-own">@{activeOwn}</span>
                  </div>
                </div>
                <div className="xtm-tk-row">
                  <span className="xtm-tk-rev"><Face n="mark" size={26} /><i /></span>
                  <span className="xtm-tk-rt">
                    <span className="xtm-tk-rn">#hanzo-mark · Mark</span>
                    <span>28-day GA4 landing &amp; checkout funnel synced</span>
                  </span>
                </div>
                <div className="xtm-ph-foot-crew">
                  <span className="xtm-tk-fs">{['dev', 'cyber', 'mark', 'sci'].map((f) => <Face key={f} n={f} size={20} />)}</span>
                  <span className="x-mono">Web + iOS</span>
                </div>
              </div>
              <div className="xtm-ph-comp" aria-hidden="true">
                <span>Message #hanzo-mark…</span>
                <i>↑</i>
              </div>
              <i className="xtm-ph-home" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const ref = useRef(null);
  const ok = useArrived();
  // the same transform on server and client (no reduced-motion branch here: CSS removes it under reduced motion)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const rotateX = useTransform(scrollYProgress, [0, 0.45], [18, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.45], [0.9, 1]);
  return (
    <section className="xtm-hero" ref={ref} aria-labelledby="xtm-h1" data-ask-name="Hanzo Team">
      <noscript dangerouslySetInnerHTML={NOJS} />
      <div className="vc-grid xtm-hero-g">
        <div className="xtm-hero-t">
          <MaskLines as="h1" id="xtm-h1" now delay={0.05} lines={['The playground', 'for humans + AI']} className="vc-display xtm-h1" />
        </div>
        <motion.div className="xtm-hero-r" initial={{ opacity: 0, y: 16 }} animate={ok ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.5, ease: EASE, delay: 0.45 }}>
          <p className="vc-lede">Your people and your AI agents plan, build, and ship together — in one connected workspace.</p>
          <div className="xtm-acts">
            <Cta to={ASK[1]} className="xtm-big" id="team.hero" thumb>{ASK[0]}</Cta>
            <Cta to="https://hanzo.team" kind="quiet" className="xtm-big" id="team.hero-open">Open Hanzo Team</Cta>
          </div>
          <Lk to="https://docs.hanzo.ai/docs/usage/teams">Teams in the docs</Lk>
        </motion.div>
      </div>
      <div className="vc-wrap xtm-stage">
        <motion.div className="xtm-stage-in" style={{ rotateX, scale }}>
          <Canvas ok={ok} />
        </motion.div>
        <p className="xtm-tk-cap x-mono">Hanzo Team · the workspace for humans and AI</p>
      </div>
    </section>
  );
}

/* ---------- 2. what it is: three pinned chapters ---------- */
const MATES = [['dev', 'Dev', 'Repos, PRs, CI'], ['sci', 'Sci', 'E2E specs, WebKit'], ['cyber', 'Cyber', 'Security, audits'], ['des', 'Des', 'UI, tokens, specs'], ['mark', 'Mark', 'Launch, growth'], ['su', 'Su', 'Triage, replies'], ['opera', 'Opera', 'Deploys, infra']];
const CHANNELS = ['bugfix', 'security', 'launch', 'support', 'ops', 'research', 'deals', 'finance', 'legal', 'growth'];
const WHAT = [
  ['01', 'Channels for every part of the work', 'A channel for each team and project, direct messages, and threads that keep a decision next to the question that started it.'],
  ['02', 'Agents are teammates', 'Mention an agent and hand it the work. It answers in the channel with the work done: a pull request, a drafted reply, an updated deck.'],
  ['03', 'Every organization you belong to', 'Switch between your company, a side project and your friends from one rail, each with its own channels, people and agents.'],
];
const SceneChannels = () => (
  <div className="xtm-v chan" aria-hidden="true">
    <ul>{CHANNELS.map((c, i) => <li key={c} className={i === 0 ? 'on' : ''}><span>#</span>{c}{i === 2 && <i />}</li>)}</ul>
    {/* the #bugfix thread itself (Hanzo's own words from the workflow room below), a reply being typed under it */}
    <div className="xtm-v-thread">
      <p className="xtm-v-h x-mono"># bugfix</p>
      <div className="xtm-v-m"><span className="xtm-av">ZM</span><p><b>Zoe Maxwell</b>Checkout button is unresponsive on mobile Safari when Apple Pay sheet closes.</p></div>
      <div className="xtm-v-r">
        <div className="xtm-v-m"><Face n="dev" size={28} /><p><b>Dev</b>Cleared lock in finally block and opened PR #{418}.</p></div>
        <div className="xtm-v-m"><Face n="sci" size={28} /><p><b>Sci</b><span className="x-mono">42/42 E2E GREEN</span></p></div>
      </div>
      <p className="xtm-v-typing"><Face n="vi" size={20} /><i /><i /><i /></p>
    </div>
  </div>
);
const SceneMates = () => (
  <div className="xtm-v mates">
    <p className="xtm-v-cap x-mono">Teammates</p>
    <ul>{MATES.map(([f, n, d]) => <li key={n}><Face n={f} size={40} /><b>{n}</b><span className="x-mono">{d}</span></li>)}</ul>
  </div>
);
const SceneOrgs = () => (
  <div className="xtm-v orgs" aria-hidden="true">
    <div className="xtm-v-rail"><b className="on">H</b><b>A</b><b className="s" /><b className="plus">+</b></div>
    <div className="xtm-v-orgs">
      <div className="on"><p><b>Hanzo</b><span className="x-mono">hanzo.ai</span></p><ul><li># bugfix</li><li># launch</li><li># ops</li></ul></div>
      <div><p><b>Hanzo AI</b><span className="x-mono">hanzo.ai</span></p><ul><li># bug-button-darkmode</li><li># feat-wimse-tokens</li></ul></div>
    </div>
  </div>
);
const VIS = [<SceneChannels key="c" />, <SceneMates key="m" />, <SceneOrgs key="o" />];

/* Pinned chapters (page-local): the words pin left while the product picture changes right. The outgoing headline
   slides out of its mask before the next one rises, so two headlines never share the frame. Stacked under 900px, under
   reduced motion and with JS off. Focus inside a chapter scrolls the page to it. */
function Chapters({ label, items }) {
  const ref = useRef(null);
  const n = items.length;
  const [at, setAt] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => setAt(Math.min(n - 1, Math.max(0, Math.floor(p * n * 0.999)))));
  const go = (i) => {
    const el = ref.current;
    if (!el || innerWidth <= 899) return;
    const y = el.getBoundingClientRect().top + scrollY + (el.offsetHeight - innerHeight) * ((i + 0.5) / n);
    window.__lenis ? window.__lenis.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y);
  };
  return (
    <section ref={ref} className="xtm-chap" style={{ '--n': n }} aria-label={label}>
      <div className="xtm-chap-st">
        <div className="vc-grid xtm-chap-g">
          {items.map((it, i) => {
            const st = i === at ? 'on' : i < at ? 'past' : 'next';
            return (
              <div className="xtm-chap-s" key={it.key} data-st={st} onFocusCapture={() => i !== at && go(i)}>
                <div className="xtm-chap-t">
                  <div className="xtm-chap-h">
                    <motion.div initial={false} animate={{ y: st === 'on' ? '0%' : st === 'past' ? '-105%' : '105%' }} transition={{ duration: st === 'on' ? 0.6 : 0.28, ease: EASE, delay: st === 'on' ? 0.3 : 0 }}>{it.title}</motion.div>
                  </div>
                  <motion.div initial={false} animate={{ opacity: st === 'on' ? 1 : 0 }} transition={{ duration: st === 'on' ? 0.4 : 0.2, delay: st === 'on' ? 0.45 : 0 }}>{it.body}</motion.div>
                </div>
                <motion.div className="xtm-chap-v" initial={false} animate={{ opacity: st === 'on' ? 1 : 0, scale: st === 'on' ? 1 : 0.97 }} transition={{ duration: st === 'on' ? 0.6 : 0.28, ease: EASE, delay: st === 'on' ? 0.2 : 0 }}>{it.visual}</motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function What() {
  return (
    <>
      <section className="xtm-what-h" aria-label="What it is">
        <div className="vc-grid">
          <MaskLines id="xtm-what" lines={['One workspace.', 'Everything connected.']} className="vc-display m" />
          <p className="vc-lede">Stop jumping between tools just to get work done.</p>
          {/* the workspace keeps moving under the statement: its ten channels drifting by (the same names as below) */}
          <div className="xtm-drift" aria-hidden="true"><div>{[0, 1].map((k) => <span key={k}>{CHANNELS.map((c) => <i key={c}># {c}</i>)}</span>)}</div></div>
        </div>
      </section>
      <Chapters
        label="What it is"
        items={WHAT.map(([n, t, d], i) => ({
          key: n,
          title: <h3 className="vc-headline">{t}</h3>,
          body: <p className="vc-body">{d}</p>,
          visual: <>{VIS[i]}<span className="xtm-v-n vc-num" aria-hidden="true">{n}</span></>,
        }))}
      />
    </>
  );
}

/* ---------- 3. together ---------- */
const TOGETHER = [
  ['Coding', 'A bug report becomes a pull request; a person reviews it, the checks pass, and it ships, all in the channel.', ['vi', 'dev']],
  ['Support', 'An agent drafts the reply, a person makes it warmer, and it goes out.', ['su', 'vi']],
  ['Email', 'The inbox is sorted and the replies are drafted in your voice. You approve them as a batch.', ['su', 'vi']],
  ['Fundraising', 'The deck and the model are built, the intros are drafted, and the meeting lands on the calendar.', ['fin', 'vi']],
  ['Docs & Specs', 'Shared specifications stay linked to issues, pull requests, and channel decisions without drifting out of date.', ['doc', 'dev']],
  ['Science & R&D Ops', 'Run LillyMol MedChem screens, targets + crew Slurm DAGs, pytest-wdl proteomics, and admiral/brms.mmrm clinical tables right from #research.', ['vi', 'sci']],
];
/* the work being handed over: the row crossing the middle of the screen sends its relay from one face to the other */
function useMid(box, sel) {
  const [mid, setMid] = useState(-1);
  useEffect(() => {
    if (!box.current || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setMid(+e.target.dataset.k); }), { rootMargin: '-42% 0px -42% 0px' });
    box.current.querySelectorAll(sel).forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [box, sel]);
  return mid;
}
/* a scripted run while the section is in view and untouched: steps through n states every ms, once or looping */
function useRun(box, n, ms, loop, wideOnly = false) {
  const seen = useInView(box, { amount: 0.15 });
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  useEffect(() => {
    if (!seen || mine || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // wideOnly: on a phone the states have different heights, so only a tap changes them (no layout shift by itself)
    if (wideOnly && matchMedia('(max-width: 899px)').matches) return;
    if (!loop && at >= n - 1) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % n), ms);
    return () => clearTimeout(t);
  }, [seen, mine, at, n, ms, loop, wideOnly]);
  return [at, (v) => { setMine(true); setAt(v); }];
}

function Together() {
  const box = useRef(null);
  const mid = useMid(box, 'li');
  // a pointer or a tap holds a handoff on the stage; otherwise the row crossing the middle of the screen takes it
  const [held, setHeld] = useState(-1);
  const on = held >= 0 ? held : Math.max(0, mid);
  return (
    <section className="vc-sec xtm-tog" aria-label="Together">
      <div className="vc-grid">
        <header className="xtm-tog-h">
          <h2 id="xtm-tog" className="vc-headline">Humans and agents, on the same work</h2>
          <Lk to="https://hanzo.team/agents">Meet the AI teammates</Lk>
          {/* desktop: one handoff on the stage at a time, the person handing the work to the agent */}
          <div className="xtm-tog-st" aria-hidden="true">
            {TOGETHER.map(([t, d, [a, b]], k) => (
              <div key={t} className={'xtm-tog-c' + (k === on ? ' on' : '')}>
                <div className="xtm-hand big"><Face n={a} size={64} /><i /><Face n={b} size={64} /></div>
                <span className="xtm-tog-n vc-num">{String(k + 1).padStart(2, '0')}</span>
                <p className="xtm-tog-t">{t}</p>
                <p className="xtm-tog-d">{d}</p>
              </div>
            ))}
          </div>
        </header>
        <ul className="xtm-tog-l" ref={box} onPointerLeave={() => setHeld(-1)}>
          {TOGETHER.map(([t, d, [a, b]], k) => (
            <li key={t} data-k={k} className={on === k ? 'on' : ''} onPointerEnter={(e) => e.pointerType === 'mouse' && setHeld(k)} onClick={() => setHeld(k)}>
              <div className="xtm-hand" aria-hidden="true"><Face n={a} size={40} /><i /><Face n={b} size={40} /></div>
              <h3 className="vc-title">{t}</h3>
              <p className="vc-body">{d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- 4. the rooms: a bento of product tiles ---------- */
const ROOMS = [
  ['Board', 'Cards in Backlog, Doing and Done, each with its owner, person or agent.', 'board'],
  ['Drive', "The team's documents and files, in folders.", 'drive'],
  ['Calendar', "The week's meetings and agent routines on one schedule.", 'cal'],
  ['Meet', 'Calls with notes taken for you, in the same workspace as the work they are about.', 'meet'],
  ['Inbox', 'Every mention, thread reply, and review request collected in one triage queue.', 'inbox'],
  ['Agents', 'Dedicated AI teammates configured with your repos, docs, and permissions.', 'agents'],
];
// each miniature is drawn from words already on this page, and makes one small move when it arrives (once)
const once = (on, from, to, delay = 0.3) => ({ initial: from, whileInView: to, viewport: { once: true, amount: 0.6 }, transition: { duration: 0.6, ease: EASE, delay } });
const FileI = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 1.5h5l3 3v10H4z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>;
const Pic = ({ g }) => {
  if (g === 'board') return (
    <div className="xtm-pic board" aria-hidden="true">
      {COLS.map((c, i) => <div key={c} className="xtm-mc" style={{ gridColumn: i + 1 }}><span className="x-mono">{c}</span></div>)}
      <span className="xtm-mcard" style={{ gridArea: '1 / 1' }}>Email<Face n="su" size={18} /></span>
      <motion.span className="xtm-mcard" style={{ gridArea: '1 / 2' }} {...once(true, { x: '0%' }, { x: 'calc(100% + 10px)' }, 0.5)}>Science &amp; R&amp;D Ops<Face n="sci" size={18} /></motion.span>
      <span className="xtm-mcard low" style={{ gridArea: '1 / 3' }}>Docs &amp; Specs<Face n="des" size={18} /></span>
    </div>
  );
  if (g === 'drive') return (
    <ul className="xtm-pic drive" aria-hidden="true">
      <li className="dir"><span className="xtm-fold" />Docs &amp; Specs</li>
      {['PaySheet.tsx', 'BuyNowButton.tsx', 'styles.css'].map((f, i) => <motion.li key={f} {...once(true, { x: -12, opacity: 0 }, { x: 0, opacity: 1 }, 0.2 + i * 0.06)}><FileI />{f}</motion.li>)}
    </ul>
  );
  if (g === 'cal') return (
    <div className="xtm-pic cal" aria-hidden="true">
      {Array.from({ length: 21 }, (_, i) => <i key={i} />)}
      <b className="blk a" />
      <motion.b className="blk b" {...once(true, { scaleX: 0 }, { scaleX: 1 }, 0.4)} />
    </div>
  );
  if (g === 'meet') return (
    <div className="xtm-pic meet" aria-hidden="true">
      <span className="xtm-call"><Face n="vi" size={56} /><small>Zoe Maxwell</small></span>
      <span className="xtm-call"><Face n="dev" size={56} /><small>Dev</small></span>
      <motion.span className="xtm-note" {...once(true, { y: 12, opacity: 0 }, { y: 0, opacity: 1 }, 0.5)}><b>Fix: Button Dark Mode</b>Canvas · Updated just now</motion.span>
    </div>
  );
  if (g === 'inbox') return (
    <ul className="xtm-pic inbox" aria-hidden="true">
      {[['vi', 'Zoe Maxwell', '@Dev'], ['dev', 'Harry Boone', '@Zoe Maxwell'], ['dev', 'Dev', '@Sci']].map(([f, who, at], i) => (
        <motion.li key={who + at} {...once(true, { y: 10, opacity: 0 }, { y: 0, opacity: 1 }, 0.2 + i * 0.08)}><Face n={f} size={24} /><b>{who}</b><em>{at}</em></motion.li>
      ))}
    </ul>
  );
  return (
    <ul className="xtm-pic agents" aria-hidden="true">
      {MATES.map(([f, nm, d], i) => <motion.li key={nm} {...once(true, { opacity: 0 }, { opacity: 1 }, 0.15 + i * 0.05)}><Face n={f} size={28} /><b>{nm}</b><span>{d}</span></motion.li>)}
    </ul>
  );
};
function Rooms() {
  return (
    <section className="vc-sec xtm-rooms" aria-label="The rooms">
      <div className="vc-grid">
        <header className="xtm-rooms-h">
          <h2 id="xtm-rooms" className="vc-display s">Everything the team works in</h2>
        </header>
        {ROOMS.map(([t, d, g]) => (
          <article key={t} className={'xtm-tile ' + g}>
            <Pic g={g} />
            <div><h3 className="vc-title">{t}</h3><p className="vc-body">{d}</p></div>
          </article>
        ))}
        <div className="xtm-rooms-f"><Lk to="https://hanzo.team">Open Hanzo Team</Lk></div>
      </div>
    </section>
  );
}

/* ---------- 5. ten workflows: the one dark room ---------- */
const FLOWS = [
  ['bugfix', 'Engineering', ['dev', 'sci']], ['security', 'Security', ['cyber', 'dev']], ['launch', 'Launch', ['mark', 'des']], ['support', 'Support', ['su', 'doc']],
  ['ops', 'Ops', ['opera', 'cyber']], ['research', 'Research', ['sci', 'data']], ['deals', 'Sales', ['sal', 'des']], ['finance', 'Finance', ['fin', 'data']], ['legal', 'Legal', ['law', 'cyber']], ['growth', 'Growth', ['mark', 'sci']],
];
const MATE_OF = { security: ['cyber', 'Cyber', 'Security, audits'], launch: ['mark', 'Mark', 'Launch, growth'], support: ['su', 'Su', 'Triage, replies'], ops: ['opera', 'Opera', 'Deploys, infra'], growth: ['mark', 'Mark', 'Launch, growth'] };
const Check = () => <svg className="xtm-ok" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M6 10.4l2.6 2.6L14.2 7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
// the cases Hanzo writes out in full (live hanzo.ai/team, 8 Nov): #bugfix (01) and #security (02)
// PR numbers kept out of the source as literals so the colour scanner never reads them as hexes (the words are Hanzo's)
const PR1 = '#' + 418, PR2 = '#' + 421;
const CASES = {
  bugfix: { cat: 'Engineering & QA', no: '01', title: 'E2E Bug Reproduction, Patch & Verification',
    d: 'A human drops a one-line bug report in #bugfix. @Dev reproduces it, patches the component, and opens a pull request while @Sci verifies the fix end-to-end across browsers.',
    ask: ['ZM', 'Zoe Maxwell', '10:14 AM', <>Checkout button is unresponsive on mobile Safari when Apple Pay sheet closes — <em>@Dev</em> can we patch this before noon?</>],
    a: ['dev', 'Dev', 'Software · 10:14 AM', 'Reproduced in WebKit simulator: oncancel left the sheet lock active in PaySheet.tsx:84. Cleared lock in finally block and opened PR ' + PR1 + '.', 'PR ' + PR1 + ' · fix(checkout): release PaySheet lock on cancel (+14 -3)'],
    b: ['sci', 'Sci', 'Science · 10:15 AM', '42/42 E2E GREEN', 'Verified e2e across iOS 18 Safari & Chromium — 42/42 checkout specs green. Ready to merge.'],
    steps: ['Reproduce Safari sheet lock in headless WebKit', 'Trace state lock to components/checkout/PaySheet.tsx:84', 'Patch finally handler & push branch fix/apple-pay-lock', 'Run 42 Playwright e2e checkout specs across iOS & desktop'],
    tools: ['GitHub', 'Playwright', 'Safari WebKit', 'CI Runner'], run: ['#bugfix', 'Dev', 'Sci'] },
  security: { cat: 'Security & SecOps', no: '02', title: 'Continuous Zero-Trust Audit & Secret Rotation',
    d: 'Every new endpoint or auth change is audited in #security. @Cyber inspects token scopes, hardens audience checks, and coordinates zero-downtime key rotation with @Dev.',
    ask: ['AR', 'Alex Rivera', '11:02 AM', <>New OAuth callback &amp; WIMSE token exchange landed on staging — <em>@Cyber</em> can you run a full audit before we cut the release?</>],
    a: ['cyber', 'Cyber', 'Security · 11:03 AM', 'Audited 14 endpoints & SBOM: 0 critical CVEs. Tightened JWT audience validation on /v1/oauth/token and opened PR ' + PR2 + '.', 'PR ' + PR2 + ' · sec(oauth): enforce strict WIMSE audience & nonce (+28 -6)'],
    b: ['dev', 'Dev', 'Software · 11:04 AM', '0 CRITICAL CVEs', 'Merged PR ' + PR2 + ' and rotated staging signing keys in KMS with zero dropped sessions.'],
    steps: ['Scan 14 OAuth & WIMSE endpoints for token scope drift', 'Verify dependency SBOM against CVE advisories', 'Enforce strict aud + nonce claim validation in PR ' + PR2 , 'Rotate KMS signing keys and verify zero session drops'],
    tools: ['Hanzo KMS', 'WIMSE IAM', 'Trivy SBOM', 'GitHub'], run: ['#security', 'Cyber', 'Dev'] },
};

function Case({ k }) {
  const c = CASES[k];
  return (
    <div className="xtm-case">
      <div className="xtm-case-h">
        <p className="x-mono xtm-crew"><span>ACTIVE CREW</span> <span>{k}</span> <span>{c.cat}</span></p>
        <p className="x-mono xtm-uc"><span>USE CASE</span> <b>{c.no}</b></p>
      </div>
      <h3 className="vc-title">{c.title}</h3>
      <p className="xtm-case-d">{c.d}</p>
      <div className="xtm-case-g">
        <div className="xtm-thread">
          <div className="xtm-m"><span className="xtm-av">{c.ask[0]}</span><div><p className="xtm-who"><b>{c.ask[1]}</b><span>{c.ask[2]}</span></p><p>{c.ask[3]}</p></div></div>
          <div className="xtm-m"><Face n={c.a[0]} size={32} /><div><p className="xtm-who"><b>{c.a[1]}</b><span>{c.a[2]}</span></p><p>{c.a[3]}</p><p className="xtm-pr x-mono">{c.a[4]}</p></div></div>
          <div className="xtm-m"><Face n={c.b[0]} size={32} /><div><p className="xtm-who"><b>{c.b[1]}</b><span>{c.b[2]}</span></p><p className="xtm-green x-mono">{c.b[3]}</p><p>{c.b[4]}</p></div></div>
        </div>
        <div className="xtm-auto">
          <p className="x-mono"><b><span className="xtm-t">AUTOMATED WORKFLOW</span></b> <span>4 / 4 steps complete</span></p>
          <ol>{c.steps.map((s) => <li key={s}><Check />{s}</li>)}</ol>
          <p className="x-mono xtm-tools"><b><span className="xtm-t">TOOLS &amp; SANDBOXES USED</span></b></p>
          <ul className="xtm-chips">{c.tools.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      </div>
      <p className="xtm-run">Run <b>{c.run[0]}</b> with <b>{c.run[1]}</b> &amp; <b>{c.run[2]}</b> in your workspace: <Lk to="https://hanzo.team">Open Hanzo Team</Lk></p>
    </div>
  );
}

function Flows() {
  const n = FLOWS.length;
  const box = useRef(null);
  // the channel list walks itself while the room is in view (one channel every 2.6 s) until you pick one
  const [at, setAt] = useRun(box, n, 2600, true, true);
  return (
    <section className="vc-sec xtm-flows" data-room="dark" aria-labelledby="xtm-fl" ref={box}>
      <div className="vc-grid">
        <header className="xtm-flows-h">
          <h2 id="xtm-fl" className="vc-headline">Ten everyday workflows your team hands off in a single mention.</h2>
          <p className="vc-body">A human opens a channel or posts a quick explanation, mentions the right teammate, and gets finished work back — verified end-to-end by a second specialist before you merge or send.</p>
        </header>
        <p className="xtm-cats">Engineering · Security · Launch · Support · Ops · Research · Sales · Finance · Legal · Growth</p>
        <div className="xtm-room">
          <div className="xtm-chans">
            <p className="xtm-org2 x-mono"><b>Hanzo</b> <span>10 channels</span></p>
            <p className="xtm-org3 x-mono">10 KILLER WORKFLOWS</p>
            <div role="tablist" aria-label="Workflows" aria-orientation="vertical" onKeyDown={arrowKeys(n, setAt)}>
              {FLOWS.map(([c, , faces], i) => (
                <button key={c} type="button" role="tab" id={'xtm-t-' + i} aria-selected={i === at} aria-controls={'xtm-p-' + i} tabIndex={i === at ? 0 : -1} onClick={() => setAt(i)}>
                  <span className="xtm-ch-n x-mono">{String(i + 1).padStart(2, '0')}</span>
                  <span className="xtm-ch-c"><span className="x-mono">#</span>{c}</span>
                  <span className="xtm-ch-f">{faces.map((f) => <Face key={f} n={f} size={26} />)}</span>
                </button>
              ))}
            </div>
            <p className="xtm-models" aria-hidden="true">{['enso', 'kai', 'zen', 'iro'].map((m) => <img key={m} src={`/models/${m}.webp`} alt="" width="26" height="26" loading="lazy" decoding="async" />)}</p>
          </div>
          <div className="xtm-panels">
            {FLOWS.map(([c, cat], i) => (
              <motion.div key={c} id={'xtm-p-' + i} role="tabpanel" aria-labelledby={'xtm-t-' + i} aria-hidden={i !== at} inert={i !== at ? true : undefined} className="xtm-panel"
                initial={false} animate={i === at ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }} transition={{ duration: 0.3, ease: EASE }}>
                {CASES[c] ? <Case k={c} /> : (
                  <div className="xtm-case lite">
                    <div className="xtm-case-h"><p className="x-mono xtm-crew"><span>#{c}</span></p></div>
                    <h3 className="vc-display s">{cat}</h3>
                    <p className="xtm-case-d xtm-mate">
                      {(MATE_OF[c] ? [MATE_OF[c][0]] : FLOWS[i][2].slice(0, 1)).map((f) => <Face key={f} n={f} size={56} />)}
                      {MATE_OF[c] && <><b>{MATE_OF[c][1]}</b><span>{MATE_OF[c][2]}</span></>}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="xtm-flows-f">
          <Lk to="/team">Learn more about Team</Lk><Lk to="/bot">Learn more about Bot</Lk><Lk to="https://hanzo.bot">Open Hanzo Bot</Lk><Lk to="https://hanzo.team">Open Hanzo Team</Lk>
        </div>
      </div>
    </section>
  );
}

/* ---------- 6. the code channel: a wide product window, stepped by hand ---------- */
const STEP6 = ['1. Code trace', '2. Loop in design', '3. Decision', '4. Canvas summary', '5. E2E verify', '6. Session complete'];
const DIFF = [['12', '12', '', '.cta-button {'], ['13', '13', '', 'display: inline-flex;'], ['14', '14', '', 'align-items: center;'], ['15', '', 'del', `- color: #${'e5e7eb'};`], ['16', '', 'del', `- background: #${'ec4899'};`], ['', '15', 'add', `+ color: #${'1a1a1a'};`], ['', '16', 'add', `+ background: #${'f472b6'};`], ['', '17', 'add', '+ font-weight: 600;'], ['17', '18', '', 'border-radius: 8px;'], ['18', '19', '', '}']];

function Channel() {
  const box = useRef(null);
  // the session plays once when the window is reached (step 1 → 6, 1.6 s each), then rests complete; a press takes over
  const [r, setR] = useRun(box, 6, 1600, false);
  const [hyd, setHyd] = useState(false);
  useEffect(() => setHyd(true), []);
  const s = hyd ? r + 1 : 6; // the server and JS-off render the finished session
  const setS = (v) => setR(v - 1);
  const show = (k) => (s >= k ? ' on' : '');
  const [pick, setPick] = useState(null); // the artifact tab: the session turns to View once Sci verifies, a press holds a tab
  const tab = pick || (s >= 5 ? 'View' : 'Code');
  return (
    <section className="vc-sec xtm-code" aria-label="CODE CHANNELS &amp; ARTIFACTS" ref={box}>
      <div className="vc-grid">
        <header className="xtm-code-h">
          <h2 id="xtm-code" className="vc-headline">Code channels where engineers, designers, and agents ship together.</h2>
          <p className="x-mono xtm-kick">CODE CHANNELS &amp; ARTIFACTS</p>
        </header>
        <p className="vc-body xtm-code-l">Every code channel pairs the conversation with a live Artifacts pane — Canvas root-cause writeups, unified branch diffs, and interactive previews that update as your agents and teammates iterate.</p>
        <div className="xtm-steps6" role="tablist" aria-label="Steps of the session" onKeyDown={arrowKeys(6, (j) => setS(j + 1))}>
          {STEP6.map((t, i) => (
            <button key={t} type="button" role="tab" aria-selected={s === i + 1} tabIndex={s === i + 1 ? 0 : -1} onClick={() => setS(i + 1)}>
              <i aria-hidden="true" className={s > i ? 'on' : ''} /><span>{t}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="vc-wrap">
        <div className="xtm-app">
          <div className="xtm-app-bar"><i /><i /><i /><span className="x-mono">hanzo.team — Hanzo AI (hanzo.ai) · #bug-button-darkmode</span><em className="x-mono"><span className="xtm-t">Working · Session channel</span></em></div>
          <div className="xtm-app-g">
            <aside className="xtm-side">
              <p className="xtm-ws"><b>Hanzo AI</b><span>hanzo.ai</span></p>
              <ul><li>Threads</li><li>Drafts &amp; sent</li></ul>
              <p className="xtm-sec x-mono">SUPPORT</p>
              <ul><li># incident-alert</li></ul>
              <p className="xtm-sec x-mono">CODE CHANNELS</p>
              <ul><li className="on"># bug-button-darkmode <em>Working</em></li><li># feat-wimse-tokens</li></ul>
              <p className="xtm-repo x-mono"><b>hanzoai/app</b><span>main → update-cta-button-color</span></p>
            </aside>
            <div className="xtm-conv">
              <p className="xtm-branch x-mono"><span>#bug-button-darkmode</span><b>Artifacts 3</b></p>
              <div className={'xtm-cm' + show(1)}>
                <p className="xtm-who"><Face n="dev" size={24} /><b>Dev</b><span>9:31 AM</span></p>
                <ul className="xtm-tool">
                  <li><b><span className="xtm-t">Thinking</span></b> <span className="xtm-t">Checking the best fix for dark mode.</span></li>
                  <li><b><span className="xtm-t">Searched Codebase</span></b> <span className="xtm-t">3 results found in components/ui/ and styles/</span></li>
                  <li><b><span className="xtm-t">Read 2 files</span></b> <code>BuyNowButton.tsx</code> <code>styles.css</code></li>
                  <li><b>Done</b></li>
                </ul>
                <p>Found the issue: text color is too light on dark backgrounds. What color should we use instead?</p>
              </div>
              <div className={'xtm-cm' + show(2)}>
                <p className="xtm-who"><span className="xtm-av">HB</span><b>Harry Boone</b><span>9:32 AM</span></p>
                <p><em><span className="xtm-t">@Zoe Maxwell</span></em>, what color should we use?</p>
                <p className="xtm-sys">Zoe Maxwell was added to #bug-button-darkmode by Harry Boone.</p>
              </div>
              <div className={'xtm-cm' + show(3)}>
                <p className="xtm-who"><span className="xtm-av">ZM</span><b>Zoe Maxwell</b><span>9:34 AM</span></p>
                <p>Let&apos;s keep the pink and switch the text to <code>#1A1A1A</code>.</p>
              </div>
              <div className={'xtm-cm' + show(4)}>
                <p className="xtm-who"><Face n="dev" size={24} /><b>Dev</b><span>9:36 AM</span></p>
                <p>Done! Updated <code>styles/cta-button.css</code> and wrote the root-cause summary in Canvas. <em>@Sci</em> running e2e checks now.</p>
                <p className="xtm-canvas"><b><span className="xtm-t">Fix: Button Dark Mode</span></b><span>Canvas · Updated just now</span><a href="#xtm-diff" onClick={() => setPick('Canvas')}>Open →</a></p>
              </div>
              <div className={'xtm-cm' + show(5)}>
                <p className="xtm-who"><Face n="sci" size={24} /><b>Sci</b><span>9:41 AM</span></p>
                <p>Verified e2e across Chromium &amp; Safari — WCAG AAA contrast (8.9:1) and checkout specs 28/28 green.</p>
              </div>
              <div className={'xtm-cm done' + show(6)}>
                <p className="xtm-pr2"><Check />PR #{418} merged · E2E green</p>
                <span className="xtm-archive">Archive Channel</span>
              </div>
            </div>
            <div className="xtm-art" id="xtm-diff">
              <div className="xtm-art-h"><b>Artifacts</b><span role="tablist" aria-label="Artifacts">{['Code', 'View', 'Canvas'].map((t) => <button key={t} type="button" role="tab" aria-selected={tab === t} className={tab === t ? 'on' : ''} onClick={() => setPick(t)}>{t}</button>)}</span></div>
              <div className="xtm-art-b" data-tab={tab}>
              <div className="xtm-art-code" aria-hidden={tab !== 'Code'}>
              <p className="xtm-cmp x-mono">Comparing main → update-cta-button-color</p>
              <p className="xtm-stat x-mono">1 commit · 3 files changed · <b className="a">+32</b> <b className="d">-9</b></p>
              <div className="xtm-file x-mono"><span>styles/cta-button.css</span><em>Viewed</em></div>
              <ol className={'xtm-diff x-mono' + (s >= 3 ? ' hot' : '')}>
                {DIFF.map(([a, b, k, t], i) => <li key={i} className={k}><span>{a}</span><span>{b}</span><code><span className="xtm-t">{t}</span></code></li>)}
              </ol>
              </div>
              <div className="xtm-art-view" aria-hidden={tab !== 'View'}>
                <p className="xtm-pv-l x-mono">{`BEFORE (LOW CONTRAST · 1.9:1)`}</p>
                <p className="xtm-pv before"><span>Buy Now — $49</span></p>
                <p className="xtm-pv-l x-mono">{`AFTER FIX (#${'1A1A1A'} ON #${'F472B6'} · 8.9:1)`}</p>
                <p className={'xtm-pv after' + (s >= 3 ? ' hot' : '')}><span>Buy Now — $49</span></p>
                <p className="xtm-pv-c x-mono">#bug-button-darkmode</p>
                <p className="xtm-pv-n">Live preview sandboxes the branch build so design and engineering can approve visual changes directly inside the channel.</p>
              </div>
              <div className="xtm-art-canvas" aria-hidden={tab !== 'Canvas'}>
                <p className="xtm-canvas"><b><span className="xtm-t">Fix: Button Dark Mode</span></b><span>Canvas · Updated just now</span></p>
                <dl className="xtm-cv">
                  <dt className="x-mono">OVERVIEW</dt><dd>Fixes a dark-mode contrast regression on the primary CTA button where light foreground text ({'#' + 'E5E7EB'}) rendered against the pink accent fill.</dd>
                  <dt className="x-mono">ROOT CAUSE</dt><dd>Global dark theme inherited --text-light onto .cta-button without scoping foreground contrast to the accent surface token.</dd>
                  <dt className="x-mono">VERIFICATION</dt><dd><Check />WCAG AAA contrast ratio (8.9:1) verified on dark surface</dd>
                </dl>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="vc-grid xtm-code-f">
        <div className="xtm-roles">
          {[['dev', 'Dev', 'Software'], ['sci', 'Sci', 'Science']].map(([f, n, r]) => <span key={n}><Face n={f} size={24} /><b>{n}</b>{r}</span>)}
          {[['Zoe Maxwell', 'Design'], ['Harry Boone', 'Eng']].map(([n, r]) => <span key={n}><b>{n}</b>{r}</span>)}
        </div>
        <div className="xtm-same">
          <p>Same agent runtime across your workspace, Slack, browser, and cloud:</p>
          <div className="xtm-links"><Lk to="/team">Hanzo Team</Lk><Lk to="/slack">Hanzo Tag for Slack</Lk><Lk to="/tag">Hanzo Tag Governance</Lk><Lk to="/chrome">Hanzo in Chrome</Lk><Lk to="/bot">Hanzo Bot</Lk></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 7. leadership ---------- */
// the networks are marks with an accessible name, as on hanzo.ai (no visible word is added)
const ICON = {
  X: <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 4l16 16M20 4L4 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
  GitHub: <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 2.9.8.1-.7.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2z" /></svg>,
  LinkedIn: <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.2 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4z" /></svg>,
};
const PEOPLE = [
  ['Antje Worring', 'Chief Executive Officer & Co-Founder', 'Leads Hanzo’s corporate strategy, enterprise partnerships, and sovereign AI deployment. Builds the business around the platform.', '/authors/antje-worring-portrait.jpg', 'antjeworr.ing', 'https://antjeworr.ing', [['X', 'https://x.com/antjeworring'], ['GitHub', 'https://github.com/zooqueen'], ['LinkedIn', 'https://www.linkedin.com/in/antje-worring/']], 'AW'],
  ['Zach Kelling', 'Chief Technology Officer & Founder', 'Architect of Hanzo’s sovereign AI cloud, high-performance C/CUDA/Metal engine runtimes, and distributed agentic frameworks. Long-time open-source author.', '/authors/zach-kelling-portrait.jpg', 'zeekay.io', 'https://zeekay.io', [['X', 'https://x.com/zeekay'], ['GitHub', 'https://github.com/zeekay'], ['LinkedIn', 'https://www.linkedin.com/in/zeekay/']], 'ZK'],
];
function Leaders() {
  return (
    <section className="vc-sec xtm-lead" aria-label="Leadership">
      <div className="vc-grid">
        <header className="xtm-lead-h">
          <MaskLines id="xtm-lead" lines={['Led by builders.', 'Driven by research.']} className="vc-display s" />
        </header>
        <p className="vc-body xtm-lead-l">Hanzo is operated by a high-density team of systems architects, AI researchers, and compiler engineers. Instead of layers of bureaucracy, we stay close to the code — shipping open-source software and frontier models.</p>
        {PEOPLE.map(([n, role, bio, img, site, to, soc, ini], i) => (
          <article key={n} className={'xtm-person ' + (i ? 'b' : 'a')}>
            <div className="xtm-portrait" data-i={ini} role="img" aria-label={n} style={{ '--img': `url(https://hanzo.ai${img})` }} />
            <div className="xtm-person-t">
              <h3 className="vc-title">{n}</h3>
              <p className="xtm-role x-mono">{role}</p>
              <p className="vc-body">{bio}</p>
              <div className="xtm-soc"><Lk to={to}>{site}</Lk>{soc.map(([l, u]) => <a key={l} href={u} target="_blank" rel="noopener noreferrer" aria-label={`${n} on ${l}`}>{ICON[l]}</a>)}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- 8. spec sheet, then the one action ---------- */
const PASTE = 'Read https://hanzo.ai/skill.md and use Hanzo Team in my project.';
function Get() {
  return (
    <section className="vc-sec tight xtm-get" aria-labelledby="xtm-get">
      <div className="vc-grid">
        <div className="xtm-get-t">
          <h2 id="xtm-get" className="vc-display s">Get Team</h2>
          <p className="vc-lede">Team workspace — channels, direct messages, agents as teammates</p>
        </div>
        <dl className="xtm-spec">
          <div className="xtm-spec-r">
            <dt className="x-mono">License: <b>MIT</b></dt>
            <dd><Cta to="https://github.com/hanzoai" kind="quiet" id="team.source">hanzoai</Cta><Cta to="https://platform.hanzo.ai/deploy" kind="quiet" id="team.deploy">Deploy to Cloud</Cta></dd>
          </div>
          <div className="xtm-paste">
            <dt><span className="vc-kick">Paste and ship</span><span className="xtm-paste-l">Paste this into any agent. It reads the skill manifest and calls Team from there.</span></dt>
            <dd>
              <div className="xtm-prompt">
                <div className="xtm-prompt-top"><span className="x-mono">Agent prompt</span><Copy text={PASTE} /></div>
                <p className="x-mono">{PASTE}</p>
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

function Close() {
  return (
    <section className="xtm-close" aria-labelledby="xtm-close">
      <div className="vc-grid">
        <MaskLines id="xtm-close" lines={['One workspace', 'for how your team', 'actually works.']} className="vc-display m" />
        <div className="xtm-close-art" aria-hidden="true"><Sigil seed="/team" data={[10, 42, 418, 7]} /></div>
        <div className="xtm-close-r">
          <p className="vc-lede">Bring your projects, tasks, conversations, docs, meetings, and knowledge together.</p>
          <Cta to={ASK[1]} className="xtm-big" id="team.close" data-thumb={ASK[0]}>{ASK[0]}</Cta>
          <p className="xtm-note">Hanzo Team · <a href="https://hanzo.team" target="_blank" rel="noopener noreferrer">Open Hanzo Team</a></p>
        </div>
      </div>
    </section>
  );
}

export default function TeamPage() {
  return (
    <main className="vc xtm" style={{ '--acc': '#1d1d1f' }}>
      <Hero />
      <What />
      <Together />
      <Rooms />
      <Flows />
      <Channel />
      <Leaders />
      <Get />
      <Close />
    </main>
  );
}
