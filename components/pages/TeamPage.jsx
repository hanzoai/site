'use client';
/* /team. V2: 8/10 Launch page in ink and greys: the live shared canvas is the hero object (plays its story once on
   arrival, then rests, with a replay control), three pinned chapters, handoff cards, a bento of rooms, the ten
   workflows in the one dark room, the code channel as a wide product window, leaders, a spec sheet, a Sigil close.
   Persona: a team lead choosing where people and agents work together (PLAN 1.1, founder / buyer).
   Goal: start a team. CTA: "Create your team" (hanzo.team/start), metric signup_start; one solid per screen,
   the same ask in the site's shared ask bar after the hero (Ask.jsx, from data-thumb) at every width.
   Signature: the shared canvas, where named human and agent cursors work one card from report to Done (Zoe reports,
   Dev takes it and fixes it, Qa verifies and moves it to Done).
   Supporting (3): the canvas tilting up and settling on scroll; pinned chapters (PinScenes); masked kinetic lines.
   Beyond: Hanzo's line of ten teams (Engineering · Security · … · Growth) is a row of buttons: press yours and the
   workflow room switches straight to its channel and crew.
   Deletes: the amber accent and every eyebrow (moved into objects or section names); the endless canvas loop; the
   invented labels "Go to your team's channel", "Source", "Deploy"; the visible social-network words (now icons).
   Every word is Hanzo's. */
import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Copy, Btn as UiBtn } from '../ui';
import { A } from '../kit';
import Sigil from '../Sigil';
import { href as hrefOf } from '../../lib/route';
import MaskLines from './company/MaskLines';
import PinScenes from './company/PinScenes';
import '../v2/vc-type.css';
import './TeamPage.css';

const EASE = [0.16, 1, 0.3, 1];
const Arrow = () => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Lk = ({ to, children, className = '' }) => <A to={to} className={'x-arrow ' + className}><span>{children}</span><Arrow /></A>;
// the kit's Btn (press .98, hover lift); in-site paths go through lib/route like every other link
const Btn = ({ to, children, ...r }) => <UiBtn href={hrefOf(to)} {...r}>{children}</UiBtn>;
const ASK = ['Create your team', 'https://hanzo.team/start'];
// Hanzo's memoji, drawn as a background over a tinted disc with the initial: if it can't load, the disc stands in cleanly
const Face = ({ n, size = 28 }) => (
  <span className="xtm-face" style={{ width: size, height: size, '--img': `url(https://hanzo.ai/memoji/${n}.svg)` }} data-i={n[0].toUpperCase()} aria-hidden="true" />
);
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
    animate(x, tx, { type: 'spring', stiffness: 90, damping: 18 });
    animate(y, ty, { type: 'spring', stiffness: 90, damping: 18 });
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
const TASK_TEXT = 'Checkout button fails on mobile Safari when Apple Pay dismisses.';

function Canvas() {
  const box = useRef(null), board = useRef(null), taskEl = useRef(null);
  const seen = useInView(box, { amount: 0.25 });
  const calm = useReducedMotion();
  const [stage, setStage] = useState(2); // the finished picture is what the page's HTML shows
  const [said, setSaid] = useState(3);
  const [steps, setSteps] = useState(3);
  const zoe = useCursor(40, 30), dev = useCursor(220, 250), qa = useCursor(300, 290);
  const [run, setRun] = useState(0); // the story plays once when first seen, then rests on Done; Replay plays it again
  const [busy, setBusy] = useState(false);
  const played = useRef(false);

  useEffect(() => {
    if (!calm && (!seen || (played.current && run === 0))) return;
    played.current = true;
    const live = { on: true };
    const sleep = (ms) => sleepFor(calm ? 0 : ms, live);
    const near = (fx = 0.72, fy = 0.62) => {
      const el = taskEl.current;
      const [x, y] = offs(el, board.current);
      return [x + el.offsetWidth * fx, y + el.offsetHeight * fy];
    };
    const home = (c, fx, fy) => c.go(board.current.offsetWidth * fx, board.current.offsetHeight * fy, calm);
    (async () => {
      try {
        setBusy(!calm);
        {
          setStage(0); setSaid(0); setSteps(0);
          await sleep(500);
          zoe.go(...near(), calm); await sleep(1300);
          setSaid(1); await sleep(1500);
          home(zoe, 0.42, 0.06);
          dev.go(...near(), calm); await sleep(1400);
          setStage(1); await sleep(700);
          dev.go(...near(), calm); setSaid(2); await sleep(900);
          for (let i = 1; i <= 3; i++) { setSteps(i); await sleep(950); }
          qa.go(...near(0.4, 0.82), calm); await sleep(1300);
          setStage(2); await sleep(700);
          qa.go(...near(0.4, 0.82), calm); setSaid(3);
          home(dev, 0.3, 0.86); await sleep(1200);
          home(qa, 0.86, 0.9);
        }
        setBusy(false);
      } catch (e) { if (e !== 'stop') throw e; }
    })();
    return () => { live.on = false; };
  }, [seen, calm, run]); // eslint-disable-line react-hooks/exhaustive-deps

  const card = (key, title, who) => <div className="xtm-card" key={key}><span>{title}</span><Face n={who} size={22} /></div>;
  const task = (
    <motion.div className="xtm-card task" layoutId="xtm-task" ref={taskEl} transition={{ type: 'spring', stiffness: 220, damping: 28 }}>
      <span>{TASK_TEXT}</span>
      <span className="xtm-task-f"><Face n="vi" size={22} />{stage >= 1 && <Face n="dev" size={22} />}{stage >= 2 && <Face n="sci" size={22} />}</span>
    </motion.div>
  );
  const msg = (n, who, time, children) => (
    <motion.div className="xtm-msg" initial={false} animate={said >= n ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }} transition={{ duration: 0.5, ease: EASE }}>
      <Face n={who[0]} size={30} />
      <div><p className="xtm-who"><b>{who[1]}</b><span>{time}</span></p>{children}</div>
    </motion.div>
  );
  return (
    <div className="xtm-win vc-obj" ref={box}>
      <aside className="xtm-rail" aria-hidden="true"><b>H</b><i /><i /><i /></aside>
      <div className="xtm-main">
        <header className="xtm-win-h">
          <span className="xtm-org"><b>Hanzo</b><span className="x-mono">hanzo.ai</span></span>
          <ul>{['bugfix', 'security', 'launch', 'ops'].map((c, i) => <li key={c} className={i === 0 ? 'on' : ''}><span className="x-mono">#</span>{c}</li>)}</ul>
          <span className="xtm-win-t x-mono">Hanzo Team · the workspace for humans and AI</span>
          <button type="button" className="xtm-replay" aria-label="Replay" disabled={busy} onClick={() => setRun((r) => r + 1)}>
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M4.5 10a5.5 5.5 0 1 0 1.7-4M4.5 3.5V6.5h3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </header>
        <div className="xtm-body">
          <div className="xtm-board" ref={board}>
            {COLS.map((c, i) => (
              <div className="xtm-col" key={c} data-col={c}>
                <p className="x-mono">{c}</p>
                {i === 0 && card('a', 'Email', 'su')}
                {stage === i && task}
                {i === 1 && card('b', 'Release Ops', 'opera')}
                {i === 2 && card('c', 'Docs & Specs', 'des')}
              </div>
            ))}
            <Cursor c={zoe} name="Zoe" tone="human" />
            <Cursor c={dev} name="Dev" tone="agent a" agent />
            <Cursor c={qa} name="Qa" tone="agent b" agent />
          </div>
          <div className="xtm-chat">
            {msg(1, ['vi', 'Zoe'], '9:42 AM', <p>{TASK_TEXT} <em>@Dev</em></p>)}
            {msg(2, ['dev', 'Dev'], '', (
              <>
                <p>Fixed unhandled promise in PaySheet.tsx:84 and opened PR #418.</p>
                <ul className="xtm-steps">
                  {['Reproduced in WebKit mobile', 'Patched PaySheet.tsx:84', 'Opened PR #418 (+18 -4)'].map((s, i) => <li key={s} className={steps > i ? 'ok' : ''}><span aria-hidden="true">{steps > i ? '✓' : '○'}</span>{s}</li>)}
                </ul>
              </>
            ))}
            {msg(3, ['sci', 'Qa'], '9:44 AM', <p>Verified e2e on iOS 18 &amp; Chromium — 42/42 specs green.</p>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const rotateX = useTransform(scrollYProgress, [0, 0.45], calm ? [0, 0] : [18, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.45], calm ? [1, 1] : [0.9, 1]);
  return (
    <section className="xtm-hero" ref={ref} aria-labelledby="xtm-h1" data-ask-name="Hanzo Team">
      <div className="vc-grid xtm-hero-g">
        <div className="xtm-hero-t">
          <MaskLines as="h1" id="xtm-h1" now delay={0.05} lines={['The playground', 'for humans + AI']} className="vc-display xtm-h1" />
        </div>
        <motion.div className="xtm-hero-r" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease: EASE, delay: 0.6 }}>
          <p className="vc-lede">Your people and your AI agents plan, build, and ship together — in one connected workspace.</p>
          <div className="xtm-acts">
            <Btn to={ASK[1]} solid className="xtm-big" data-thumb={ASK[0]} data-cta="team.hero">{ASK[0]}</Btn>
            <Btn to="https://hanzo.team" className="xtm-big" data-cta="team.hero-open">Open Hanzo Team</Btn>
          </div>
          <Lk to="https://docs.hanzo.ai/docs/usage/teams">Teams in the docs</Lk>
        </motion.div>
      </div>
      <div className="vc-wrap xtm-stage">
        <motion.div className="xtm-stage-in" style={{ rotateX, scale }} initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.3, ease: EASE, delay: 0.3 }}>
          <Canvas />
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- 2. what it is: three pinned chapters ---------- */
const MATES = [['dev', 'Dev', 'Repos, PRs, CI'], ['sci', 'Qa', 'E2E specs, WebKit'], ['cyber', 'Cyber', 'Security, audits'], ['des', 'Des', 'UI, tokens, specs'], ['mark', 'Mark', 'Launch, growth'], ['su', 'Su', 'Triage, replies'], ['opera', 'Opera', 'Deploys, infra']];
const CHANNELS = ['bugfix', 'security', 'launch', 'support', 'ops', 'research', 'deals', 'finance', 'legal', 'growth'];
const WHAT = [
  ['01', 'Channels for every part of the work', 'A channel for each team and project, direct messages, and threads that keep a decision next to the question that started it.'],
  ['02', 'Agents are teammates', 'Mention an agent and hand it the work. It answers in the channel with the work done: a pull request, a drafted reply, an updated deck.'],
  ['03', 'Every organization you belong to', 'Switch between your company, a side project and your friends from one rail, each with its own channels, people and agents.'],
];
const SceneChannels = () => (
  <div className="xtm-v chan" aria-hidden="true">
    <ul>{CHANNELS.map((c, i) => <li key={c} className={i === 0 ? 'on' : ''}><span>#</span>{c}{i === 2 && <i />}</li>)}</ul>
    <div className="xtm-v-thread"><b /><b /><b className="s" /><div><b /><b className="s" /></div><b /><b className="s" /></div>
  </div>
);
const SceneMates = () => (
  <div className="xtm-v mates">
    <p className="vc-kick">Teammates</p>
    <ul>{MATES.map(([f, n, d]) => <li key={n}><Face n={f} size={40} /><b>{n}</b><span className="x-mono">{d}</span></li>)}</ul>
  </div>
);
const SceneOrgs = () => (
  <div className="xtm-v orgs" aria-hidden="true">
    <div className="xtm-v-rail"><b className="on">H</b><b>K</b><b className="s" /><b className="plus">+</b></div>
    <div className="xtm-v-orgs">
      <div className="on"><p><b>Hanzo</b><span className="x-mono">hanzo.ai</span></p><ul><li># bugfix</li><li># launch</li><li># ops</li></ul></div>
      <div><p><b>Karma Style</b><span className="x-mono">karma.style</span></p><ul><li># bug-button-darkmode</li><li># tryon-3d-lookbook</li></ul></div>
    </div>
  </div>
);
const VIS = [<SceneChannels key="c" />, <SceneMates key="m" />, <SceneOrgs key="o" />];

function What() {
  return (
    <>
      <section className="xtm-what-h" aria-label="What it is">
        <div className="vc-grid">
          <MaskLines id="xtm-what" lines={['One workspace.', 'Everything connected.']} className="vc-display m" />
          <p className="vc-lede">Stop jumping between tools just to get work done.</p>
        </div>
      </section>
      <PinScenes
        label="What it is"
        scenes={WHAT.map(([n, t, d], i) => ({
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
  ['Release Ops', 'Changelogs, CI status, and rollout checks post straight to the room where your engineers coordinate deploys.', ['opera', 'dev']],
];
function Together() {
  return (
    <section className="vc-sec xtm-tog" aria-label="Together">
      <div className="vc-grid">
        <header className="xtm-tog-h">
          <h2 id="xtm-tog" className="vc-headline">Humans and agents, on the same work</h2>
          <Lk to="https://hanzo.team/agents">Meet the AI teammates</Lk>
        </header>
        <ul className="xtm-tog-l">
          {TOGETHER.map(([t, d, [a, b]]) => (
            <li key={t}>
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
const Pic = ({ g }) => {
  if (g === 'agents') return <div className="xtm-pic agents" aria-hidden="true">{['dev', 'sci', 'cyber', 'des', 'mark'].map((f) => <Face key={f} n={f} size={52} />)}</div>;
  const n = { board: 9, drive: 6, cal: 21, meet: 4, inbox: 5 }[g];
  return <div className={'xtm-pic ' + g} aria-hidden="true">{Array.from({ length: n }, (_, i) => <i key={i} />)}</div>;
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
  ['bugfix', 'Engineering', ['dev', 'sci']], ['security', 'Security', ['cyber']], ['launch', 'Launch', ['mark']], ['support', 'Support', ['su']],
  ['ops', 'Ops', ['opera']], ['research', 'Research', ['sci']], ['deals', 'Sales', ['sal']], ['finance', 'Finance', ['fin']], ['legal', 'Legal', ['law']], ['growth', 'Growth', ['mark']],
];
const MATE_OF = { security: ['cyber', 'Cyber', 'Security, audits'], launch: ['mark', 'Mark', 'Launch, growth'], support: ['su', 'Su', 'Triage, replies'], ops: ['opera', 'Opera', 'Deploys, infra'], growth: ['mark', 'Mark', 'Launch, growth'] };
const STEPS4 = ['Reproduce Safari sheet lock in headless WebKit', 'Trace state lock to components/checkout/PaySheet.tsx:84', 'Patch finally handler & push branch fix/apple-pay-lock', 'Run 42 Playwright e2e checkout specs across iOS & desktop'];
const Check = () => <svg className="xtm-ok" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M6 10.4l2.6 2.6L14.2 7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;

function Bugfix() {
  return (
    <div className="xtm-case">
      <div className="xtm-case-h">
        <p className="x-mono xtm-crew"><span>ACTIVE CREW</span> <span>bugfix</span> <span>Engineering &amp; QA</span></p>
        <p className="x-mono xtm-uc"><span>USE CASE</span> <b>01</b></p>
      </div>
      <h3 className="vc-title">E2E Bug Reproduction, Patch &amp; Verification</h3>
      <p className="xtm-case-d">A human drops a one-line bug report in #bugfix. @Dev reproduces it, patches the component, and opens a pull request while @Qa verifies the fix end-to-end across browsers.</p>
      <div className="xtm-case-g">
        <div className="xtm-thread">
          <div className="xtm-m"><span className="xtm-av">ZM</span><div><p className="xtm-who"><b>Zoe Maxwell</b><span>10:14 AM</span></p><p>Checkout button is unresponsive on mobile Safari when Apple Pay sheet closes — <em>@Dev</em> can we patch this before noon?</p></div></div>
          <div className="xtm-m"><Face n="dev" size={32} /><div><p className="xtm-who"><b>Dev</b><span>Software · 10:14 AM</span></p><p>Reproduced in WebKit simulator: oncancel left the sheet lock active in PaySheet.tsx:84. Cleared lock in finally block and opened PR #418.</p><p className="xtm-pr x-mono">PR #418 · fix(checkout): release PaySheet lock on cancel (+14 -3)</p></div></div>
          <div className="xtm-m"><Face n="sci" size={32} /><div><p className="xtm-who"><b>Qa</b><span>Quality · 10:15 AM</span></p><p className="xtm-green x-mono">42/42 E2E GREEN</p><p>Verified e2e across iOS 18 Safari &amp; Chromium — 42/42 checkout specs green. Ready to merge.</p></div></div>
        </div>
        <div className="xtm-auto">
          <p className="x-mono"><b>AUTOMATED WORKFLOW</b> <span>4 / 4 steps complete</span></p>
          <ol>{STEPS4.map((s) => <li key={s}><Check />{s}</li>)}</ol>
          <p className="x-mono xtm-tools"><b>TOOLS &amp; SANDBOXES USED</b></p>
          <ul className="xtm-chips">{['GitHub', 'Playwright', 'Safari WebKit', 'CI Runner'].map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      </div>
      <p className="xtm-run">Run <b>#bugfix</b> with <b>Dev</b> &amp; <b>Qa</b> in your workspace:</p>
    </div>
  );
}

function Flows() {
  const [at, setAt] = useState(0);
  const n = FLOWS.length;
  return (
    <section className="vc-sec xtm-flows" data-room="dark" aria-labelledby="xtm-fl">
      <div className="vc-grid">
        <header className="xtm-flows-h">
          <h2 id="xtm-fl" className="vc-headline">Ten everyday workflows your team hands off in a single mention.</h2>
          <p className="vc-body">A human opens a channel or posts a quick explanation, mentions the right teammate, and gets finished work back — verified end-to-end by a second specialist before you merge or send.</p>
        </header>
        <div className="xtm-go" role="group" aria-label="Go to your team's channel">
          <p className="xtm-cats">{FLOWS.map(([c, cat], i) => <Fragment key={c}>{i > 0 && <span aria-hidden="true"> · </span>}<button type="button" aria-pressed={i === at} aria-controls={'xtm-p-' + i} onClick={() => setAt(i)}>{cat}</button></Fragment>)}</p>
        </div>
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
          </div>
          <div className="xtm-panels">
            {FLOWS.map(([c, cat], i) => (
              <motion.div key={c} id={'xtm-p-' + i} role="tabpanel" aria-labelledby={'xtm-t-' + i} hidden={i !== at} className="xtm-panel"
                initial={false} animate={i === at ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }} transition={{ duration: 0.45, ease: EASE }}>
                {c === 'bugfix' ? <Bugfix /> : (
                  <div className="xtm-case lite">
                    <p className="x-mono xtm-crew"><span>CHANNEL</span> #{c}</p>
                    <h3 className="vc-display s">{cat}</h3>
                    {MATE_OF[c] && <p className="xtm-case-d xtm-mate"><Face n={MATE_OF[c][0]} size={40} /><b>{MATE_OF[c][1]}</b><span>{MATE_OF[c][2]}</span></p>}
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
const DIFF = [['12', '12', '', '.cta-button {'], ['13', '13', '', 'display: inline-flex;'], ['14', '14', '', 'align-items: center;'], ['15', '', 'del', '- color: #e5e7eb;'], ['16', '', 'del', '- background: #ec4899;'], ['', '15', 'add', '+ color: #1a1a1a;'], ['', '16', 'add', '+ background: #f472b6;'], ['', '17', 'add', '+ font-weight: 600;'], ['17', '18', '', 'border-radius: 8px;'], ['18', '19', '', '}']];

function Channel() {
  const [s, setS] = useState(6);
  const show = (k) => (s >= k ? ' on' : '');
  return (
    <section className="vc-sec xtm-code" aria-label="CODE CHANNELS &amp; ARTIFACTS">
      <div className="vc-grid">
        <header className="xtm-code-h">
          <h2 id="xtm-code" className="vc-headline">Code channels where engineers, designers, and agents ship together.</h2>
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
        <div className="xtm-app vc-obj">
          <div className="xtm-app-bar"><i /><i /><i /><span className="x-mono">hanzo.team — Karma Style (karma.style) · #bug-button-darkmode</span><em className="x-mono">Session ready</em></div>
          <div className="xtm-app-g">
            <aside className="xtm-side">
              <p className="xtm-ws"><b>Karma Style</b><span>karma.style</span></p>
              <ul><li>Threads</li><li>Drafts &amp; sent</li></ul>
              <p className="xtm-sec x-mono">SUPPORT</p>
              <ul><li># incident-alert</li></ul>
              <p className="xtm-sec x-mono">CODE CHANNELS</p>
              <ul><li className="on"># bug-button-darkmode <em>PR ready</em></li><li># tryon-3d-lookbook</li><li># karma/storefront</li></ul>
            </aside>
            <div className="xtm-conv">
              <p className="xtm-branch x-mono"><span>main → update-cta-button-color</span><span>#bug-button-darkmode</span><b>Artifacts 3</b></p>
              <div className={'xtm-cm' + show(1)}>
                <p className="xtm-who"><Face n="dev" size={24} /><b>Dev</b><span>9:31 AM</span></p>
                <ul className="xtm-tool">
                  <li><b>Thinking</b> Checking the best fix for dark mode.</li>
                  <li><b>Searched Codebase</b> 3 results found in components/ui/ and styles/</li>
                  <li><b>Read 2 files</b> <code>BuyNowButton.tsx</code> <code>styles.css</code></li>
                  <li><b>Done</b></li>
                </ul>
                <p>Found the issue: text color is too light on dark backgrounds. What color should we use instead?</p>
              </div>
              <div className={'xtm-cm' + show(2)}>
                <p className="xtm-who"><span className="xtm-av">HB</span><b>Harry Boone</b><span>9:32 AM</span></p>
                <p><em>@Zoe Maxwell</em>, what color should we use?</p>
                <p className="xtm-sys">Zoe Maxwell was added to #bug-button-darkmode by Harry Boone.</p>
              </div>
              <div className={'xtm-cm' + show(3)}>
                <p className="xtm-who"><span className="xtm-av">ZM</span><b>Zoe Maxwell</b><span>9:34 AM</span></p>
                <p>Let&apos;s keep the pink and switch the text to <code>#1A1A1A</code>.</p>
              </div>
              <div className={'xtm-cm' + show(4)}>
                <p className="xtm-who"><Face n="dev" size={24} /><b>Dev</b><span>9:36 AM</span></p>
                <p>Done! Updated <code>styles/cta-button.css</code> and wrote the root-cause summary in Canvas. <em>@Qa</em> running e2e checks now.</p>
                <p className="xtm-canvas"><b>Fix: Button Dark Mode</b><span>Canvas · Updated just now</span><a href="#xtm-diff">Open →</a></p>
              </div>
              <div className={'xtm-cm' + show(5)}>
                <p className="xtm-who"><Face n="sci" size={24} /><b>Qa</b><span>9:41 AM</span></p>
                <p>Verified e2e across Chromium &amp; Safari — WCAG AAA contrast (8.9:1) and checkout specs 28/28 green.</p>
              </div>
              <div className={'xtm-cm done' + show(6)}>
                <p className="xtm-pr2"><Check />PR #418 merged · E2E green</p>
                <span className="xtm-archive">Archive Channel</span>
              </div>
            </div>
            <div className="xtm-art" id="xtm-diff">
              <div className="xtm-art-h"><b>Artifacts</b><span role="presentation"><i>Code</i><i>View</i><i>Canvas</i></span></div>
              <p className="xtm-cmp x-mono">Comparing main → update-cta-button-color</p>
              <p className="xtm-stat x-mono">1 commit · 3 files changed · <b className="a">+32</b> <b className="d">-9</b></p>
              <div className="xtm-file x-mono"><span>styles/cta-button.css</span><em>Viewed</em></div>
              <ol className={'xtm-diff x-mono' + (s >= 3 ? ' hot' : '')}>
                {DIFF.map(([a, b, k, t], i) => <li key={i} className={k}><span>{a}</span><span>{b}</span><code>{t}</code></li>)}
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div className="vc-grid xtm-code-f">
        <div className="xtm-roles">
          {[['dev', 'Dev', 'Software'], ['sci', 'Qa', 'Quality']].map(([f, n, r]) => <span key={n}><Face n={f} size={24} /><b>{n}</b>{r}</span>)}
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
            <dd><Btn to="https://github.com/hanzoai" data-cta="team.source">hanzoai</Btn><Btn to="https://platform.hanzo.ai/deploy" data-cta="team.deploy">Deploy to Cloud</Btn></dd>
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
        <div className="xtm-close-art vc-obj" aria-hidden="true"><Sigil seed="/team" data={[10, 42, 418, 7]} /></div>
        <div className="xtm-close-r">
          <p className="vc-lede">Bring your projects, tasks, conversations, docs, meetings, and knowledge together.</p>
          <Btn to={ASK[1]} solid className="xtm-big" data-thumb={ASK[0]} data-cta="team.close">{ASK[0]}</Btn>
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
