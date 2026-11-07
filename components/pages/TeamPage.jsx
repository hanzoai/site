'use client';
/* Team. Its idea is the shared canvas: people and agents work on one board at once. The hero plays a real task through
   it (Zoe reports, Dev takes the card and fixes it, Qa verifies and moves it to Done) with a named cursor for each;
   the ten everyday workflows sit on a turning carousel; the code channel replays its six steps beside the diff.
   Every word is Hanzo's. The channels of the carousel that Hanzo's page gives no detail for show only what it names.
   Signature: the shared canvas, where named human and agent cursors work one card from report to Done.
   Beyond: "Go to your team's channel". Hanzo's line of ten teams (Engineering · Security · … · Growth) is a row of
   buttons: press yours and the carousel turns straight to its channel and crew instead of waiting for it to come round. */
import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { EASE, Rise, Copy } from '../ui';
import { A, SecHead, Tick, Band } from '../kit';
import './TeamPage.css';

const Lk = ({ to, children, className = '', ...r }) => (
  <A to={to} className={'x-arrow ' + className} {...r}><span>{children}</span><i aria-hidden="true">→</i></A>
);
const Btn = ({ to, children, solid, ...r }) => <A to={to} className={'x-btn' + (solid ? ' solid' : '')} {...r}>{children}</A>;
const Face = ({ n, size = 28 }) => <img className="xtm-face" src={`https://hanzo.ai/memoji/${n}.svg`} alt="" width={size} height={size} loading="lazy" decoding="async" />;
const arrowKeys = (n, set) => (e) => {
  const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
  if (!d) return;
  e.preventDefault();
  const tabs = [...e.currentTarget.querySelectorAll('[role=tab]')];
  const j = (tabs.indexOf(document.activeElement) + d + n) % n;
  tabs[j].focus(); set(j);
};

/* ---------- 1. hero: the shared canvas ---------- */
const sleepFor = (ms, live) => new Promise((ok, no) => setTimeout(() => (live.on ? ok() : no('stop')), ms));

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
      <svg viewBox="0 0 16 20" width="16" height="20"><path d="M1 1l13 8.5-6 1.4-3.2 6.2z" /></svg>
      <span>{agent && <b>◆</b>}{name}</span>
    </motion.div>
  );
}

const COLS = ['Backlog', 'Doing', 'Done'];
const TASK_TEXT = 'Checkout button fails on mobile Safari when Apple Pay dismisses.';

function Canvas() {
  const box = useRef(null), board = useRef(null), taskEl = useRef(null), chat = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const [stage, setStage] = useState(3); // the finished picture is what the page's HTML shows
  const [said, setSaid] = useState(3);
  const [steps, setSteps] = useState(3);
  const zoe = useCursor(60, 40), dev = useCursor(300, 300), qa = useCursor(420, 330);

  useEffect(() => {
    if (!seen && !calm) return;
    const live = { on: true };
    const sleep = (ms) => sleepFor(calm ? 0 : ms, live);
    const near = (el, fx = 0.72, fy = 0.62) => {
      const r = el.getBoundingClientRect(), b = board.current.getBoundingClientRect();
      return [r.left - b.left + r.width * fx, r.top - b.top + r.height * fy];
    };
    const at = (c, el, fx, fy) => c.go(...near(el, fx, fy), calm);
    (async () => {
      try {
        do {
          setStage(0); setSaid(0); setSteps(0);
          await sleep(400);
          zoe.go(...near(taskEl.current), calm); await sleep(1300);
          setSaid(1); await sleep(1500);
          zoe.go(200, 20, calm);
          at(dev, taskEl.current); await sleep(1400);
          setStage(1); await sleep(700);
          at(dev, taskEl.current); setSaid(2); await sleep(900);
          for (let i = 1; i <= 3; i++) { setSteps(i); await sleep(950); }
          qa.go(...near(taskEl.current, 0.4, 0.8), calm); await sleep(1300);
          setStage(2); await sleep(700);
          at(qa, taskEl.current, 0.4, 0.8); setSaid(3);
          dev.go(300, 300, calm); await sleep(1200);
          qa.go(430, 340, calm);
          if (calm) return;
          await sleep(4200);
        } while (live.on);
      } catch (e) { if (e !== 'stop') throw e; }
    })();
    return () => { live.on = false; };
  }, [seen, calm]); // eslint-disable-line react-hooks/exhaustive-deps

  const card = (key, title, who) => (
    <div className="xtm-card" key={key}><span>{title}</span><Face n={who} size={20} /></div>
  );
  const task = (
    <motion.div className="xtm-card task" layoutId="xtm-task" ref={taskEl} transition={{ type: 'spring', stiffness: 220, damping: 28 }}>
      <span>{TASK_TEXT}</span>
      <span className="xtm-task-f"><Face n="vi" size={20} />{stage >= 1 && <Face n="dev" size={20} />}{stage >= 2 && <Face n="sci" size={20} />}</span>
    </motion.div>
  );
  const msg = (n, who, time, children) => (
    <motion.div className={'xtm-msg' + (said >= n ? ' on' : '')} initial={false} animate={said >= n ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }} transition={{ duration: 0.5, ease: EASE }}>
      <Face n={who[0]} size={26} />
      <div><p className="xtm-who"><b>{who[1]}</b><span>{time}</span></p>{children}</div>
    </motion.div>
  );
  return (
    <motion.div className="xtm-win" ref={box} initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}>
      <aside className="xtm-rail" aria-hidden="true"><b>H</b><i /><i /><i /></aside>
      <div className="xtm-main">
        <header className="xtm-win-h">
          <span className="xtm-org"><b>Hanzo</b><span className="x-mono">hanzo.ai</span></span>
          <ul>{['bugfix', 'security', 'launch', 'ops'].map((c, i) => <li key={c} className={i === 0 ? 'on' : ''}><span className="x-mono">#</span>{c}</li>)}</ul>
        </header>
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
        <div className="xtm-chat" ref={chat}>
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
    </motion.div>
  );
}

const MATES = [['dev', 'Dev', 'Repos, PRs, CI'], ['sci', 'Qa', 'E2E specs, WebKit'], ['cyber', 'Cyber', 'Security, audits'], ['des', 'Des', 'UI, tokens, specs'], ['mark', 'Mark', 'Launch, growth'], ['su', 'Su', 'Triage, replies'], ['opera', 'Opera', 'Deploys, infra']];

function Hero() {
  const line = (t, d) => (
    <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>
  );
  return (
    <section className="xtm-hero" aria-labelledby="xtm-h1">
      <div className="x-wrap xtm-hero-grid">
        <div>
          <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Hanzo Team · the workspace for humans and AI</motion.p>
          <h1 id="xtm-h1" className="xtm-h1">{line('The playground', 0.05)}{line('for humans + AI', 0.18)}</h1>
          <motion.p className="xtm-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>
            Your people and your AI agents plan, build, and ship together — in one connected workspace.
          </motion.p>
          <motion.ul className="xtm-bul" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}>
            {['A channel for each team and project, direct messages, and threads that keep a decision next to the question that started it.', 'Mention an agent and hand it the work. It answers in the channel with the work done: a pull request, a drafted reply, an updated deck.', 'Switch between your company, a side project and your friends from one rail, each with its own channels, people and agents.', 'Dedicated AI teammates configured with your repos, docs, and permissions.'].map((t, i) => <li key={t}><Tick size={18} delay={0.6 + i * 0.12} /><span>{t}</span></li>)}
          </motion.ul>
          <motion.div className="xtm-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}>
            <Btn to="https://hanzo.team" solid data-thumb="Open Hanzo Team">Open Hanzo Team</Btn>
            <Btn to="https://hanzo.team/start">Create your team</Btn>
            <Lk to="https://docs.hanzo.ai/docs/usage/teams">Teams in the docs</Lk>
          </motion.div>
        </div>
        <div>
          <Canvas />
          <div className="xtm-mates">
            <p className="x-kick">Teammates</p>
            <ul>{MATES.map(([f, n, d], i) => <li key={n} style={{ '--i': i }}><Face n={f} size={34} /><b>{n}</b><span>{d}</span></li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 2. paste and ship ---------- */
const PASTE = 'Read https://hanzo.ai/skill.md and use Hanzo Team in my project.';
function Paste() {
  return (
    <section className="xtm-paste">
      <div className="x-wrap">
        <div className="xtm-prompt">
          <div>
            <p className="x-kick">Paste and ship</p>
            <p className="xtm-prompt-l">Paste this into any agent. It reads the skill manifest and calls Team from there.</p>
          </div>
          <div className="xtm-prompt-b">
            <div className="xtm-prompt-top"><span className="x-mono">Agent prompt</span><Copy text={PASTE} /></div>
            <p className="x-mono">{PASTE}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 3. what it is ---------- */
const WHAT = [
  ['01', 'Channels for every part of the work', 'A channel for each team and project, direct messages, and threads that keep a decision next to the question that started it.'],
  ['02', 'Agents are teammates', 'Mention an agent and hand it the work. It answers in the channel with the work done: a pull request, a drafted reply, an updated deck.'],
  ['03', 'Every organization you belong to', 'Switch between your company, a side project and your friends from one rail, each with its own channels, people and agents.'],
];
function What() {
  return (
    <section className="x-sec xtm-what">
      <div className="x-wrap">
        <SecHead kicker="What it is" title="One workspace. Everything connected." lede="Stop jumping between tools just to get work done." />
        <ol className="xtm-3">
          <motion.i className="xtm-3-line" aria-hidden="true" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 1.6, ease: EASE }} />
          {WHAT.map(([n, t, d], i) => (
            <Rise as="li" key={n} delay={i * 0.12}>
              <span className="xtm-3-n x-mono">{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Rise>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- 4. together ---------- */
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
    <section className="x-sec xtm-tog">
      <div className="x-wrap">
        <SecHead kicker="Together" title="Humans and agents, on the same work" />
        <ul className="xtm-tog-l">
          {TOGETHER.map(([t, d, [a, b]], i) => (
            <Rise as="li" key={t} delay={(i % 2) * 0.1} y={22}>
              <div className="xtm-hand" aria-hidden="true"><Face n={a} size={34} /><i><b /></i><Face n={b} size={34} /></div>
              <h3>{t}</h3>
              <p>{d}</p>
            </Rise>
          ))}
        </ul>
        <div className="x-row-links"><Lk to="https://hanzo.team/agents">Meet the AI teammates</Lk></div>
      </div>
    </section>
  );
}

/* ---------- 5. the rooms ---------- */
const ROOMS = [
  ['Board', 'Cards in Backlog, Doing and Done, each with its owner, person or agent.', 'board'],
  ['Drive', "The team's documents and files, in folders.", 'drive'],
  ['Calendar', "The week's meetings and agent routines on one schedule.", 'cal'],
  ['Meet', 'Calls with notes taken for you, in the same workspace as the work they are about.', 'meet'],
  ['Inbox', 'Every mention, thread reply, and review request collected in one triage queue.', 'inbox'],
  ['Agents', 'Dedicated AI teammates configured with your repos, docs, and permissions.', 'agents'],
];
function Rooms() {
  return (
    <section className="x-sec xtm-rooms">
      <div className="x-wrap">
        <SecHead kicker="The rooms" title="Everything the team works in" />
        <ul className="xtm-rm">
          {ROOMS.map(([t, d, g], i) => (
            <li key={t}>
              <div className={'xtm-pic ' + g} aria-hidden="true"><i /><i /><i /><i /></div>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ul>
        <div className="x-row-links"><Lk to="https://hanzo.team">Open Hanzo Team</Lk></div>
      </div>
    </section>
  );
}

/* ---------- 6. ten workflows on a turning carousel ---------- */
const FLOWS = [
  ['bugfix', 'Engineering', ['dev', 'sci']], ['security', 'Security', ['cyber']], ['launch', 'Launch', ['mark']], ['support', 'Support', ['su']],
  ['ops', 'Ops', ['opera']], ['research', 'Research', ['sci']], ['deals', 'Sales', ['sal']], ['finance', 'Finance', ['fin']], ['legal', 'Legal', ['law']], ['growth', 'Growth', ['mark']],
];
const MATE_OF = { security: 'Cyber · Security, audits', launch: 'Mark · Launch, growth', support: 'Su · Triage, replies', ops: 'Opera · Deploys, infra', growth: 'Mark · Launch, growth' };
const STEPS4 = ['Reproduce Safari sheet lock in headless WebKit', 'Trace state lock to components/checkout/PaySheet.tsx:84', 'Patch finally handler & push branch fix/apple-pay-lock', 'Run 42 Playwright e2e checkout specs across iOS & desktop'];

function Bugfix() {
  return (
    <div className="xtm-case">
      <div className="xtm-case-h">
        <p className="x-mono xtm-crew"><span>ACTIVE CREW</span> bugfix · Engineering &amp; QA</p>
        <p className="x-mono xtm-uc"><span>USE CASE</span> <b>01</b></p>
      </div>
      <h3>E2E Bug Reproduction, Patch &amp; Verification</h3>
      <p className="xtm-case-d">A human drops a one-line bug report in #bugfix. @Dev reproduces it, patches the component, and opens a pull request while @Qa verifies the fix end-to-end across browsers.</p>
      <div className="xtm-thread">
        <div className="xtm-m"><span className="xtm-av">ZM</span><div><p className="xtm-who"><b>Zoe Maxwell</b><span>10:14 AM</span></p><p>Checkout button is unresponsive on mobile Safari when Apple Pay sheet closes — <em>@Dev</em> can we patch this before noon?</p></div></div>
        <div className="xtm-m"><Face n="dev" size={30} /><div><p className="xtm-who"><b>Dev</b><span>Software · 10:14 AM</span></p><p>Reproduced in WebKit simulator: oncancel left the sheet lock active in PaySheet.tsx:84. Cleared lock in finally block and opened PR #418.</p><p className="xtm-pr x-mono">PR #418 · fix(checkout): release PaySheet lock on cancel (+14 -3)</p></div></div>
        <div className="xtm-m"><Face n="sci" size={30} /><div><p className="xtm-who"><b>Qa</b><span>Quality · 10:15 AM</span></p><p className="xtm-green x-mono">42/42 E2E GREEN</p><p>Verified e2e across iOS 18 Safari &amp; Chromium — 42/42 checkout specs green. Ready to merge.</p></div></div>
      </div>
      <div className="xtm-auto">
        <p className="x-mono"><b>AUTOMATED WORKFLOW</b> <span>4 / 4 steps complete</span></p>
        <ol>{STEPS4.map((s) => <li key={s}><Tick size={18} />{s}</li>)}</ol>
        <p className="x-mono xtm-tools"><b>TOOLS &amp; SANDBOXES USED</b></p>
        <ul className="xtm-chips">{['GitHub', 'Playwright', 'Safari WebKit', 'CI Runner'].map((t) => <li key={t}>{t}</li>)}</ul>
      </div>
      <p className="xtm-run">Run <b>#bugfix</b> with <b>Dev</b> &amp; <b>Qa</b> in your workspace:</p>
    </div>
  );
}

function Flows() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.35 });
  const calm = useReducedMotion();
  const [turn, setTurn] = useState(0);
  const [mine, setMine] = useState(false);
  const n = FLOWS.length;
  const at = ((turn % n) + n) % n;
  const rot = useSpring(0, { stiffness: 60, damping: 16, mass: 0.9 });
  useEffect(() => { rot.set(-turn * 36); }, [turn]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!seen || mine || calm) return;
    const id = setTimeout(() => setTurn((v) => v + 1), 3600);
    return () => clearTimeout(id);
  }, [seen, mine, calm, turn]);
  const go = (i) => { setMine(true); let d = (((i - at) % n) + n) % n; if (d > n / 2) d -= n; setTurn(turn + d); };
  return (
    <section className="x-sec xtm-flows" data-room="dark" ref={ref} aria-labelledby="xtm-fl">
      <div className="x-wrap">
        <header className="x-head dark">
          <p className="x-kick">10 KILLER WORKFLOWS</p>
          <p className="xtm-cats x-mono">{FLOWS.map(([c, cat], i) => <Fragment key={c}>{i > 0 && ' · '}<button type="button" aria-pressed={i === at} aria-controls={'xtm-p-' + i} onClick={() => go(i)}>{cat}</button></Fragment>)}</p>
          <h2 id="xtm-fl"><span className="x-sr">Ten everyday workflows your team hands off in a single mention.</span><span aria-hidden="true">Ten everyday workflows your team hands off in a single mention.</span></h2>
          <p>A human opens a channel or posts a quick explanation, mentions the right teammate, and gets finished work back — verified end-to-end by a second specialist before you merge or send.</p>
        </header>
        <p className="xtm-org2 x-mono"><b>Hanzo</b> <span>10 channels</span></p>
        <div className="xtm-stage" onKeyDown={(e) => { if (e.key === 'ArrowRight') { setMine(true); setTurn(turn + 1); } if (e.key === 'ArrowLeft') { setMine(true); setTurn(turn - 1); } }}>
          <div className="xtm-ring-w">
            <motion.ul className="xtm-ring" style={{ rotateY: rot }}>
              {FLOWS.map(([c, cat, faces], i) => (
                <li key={c} style={{ '--a': i * 36 + 'deg' }} className={i === at ? 'on' : ''} aria-hidden={i !== at}>
                  <span className="xtm-ring-n x-mono">{String(i + 1).padStart(2, '0')}</span>
                  <span className="xtm-ring-c"><span className="x-mono">#</span>{c}</span>
                  <span className="xtm-ring-f">{faces.map((f) => <Face key={f} n={f} size={30} />)}</span>
                  <span className="xtm-ring-cat">{cat}</span>
                </li>
              ))}
            </motion.ul>
          </div>
          <div className="xtm-ctl">
            <button type="button" className="xtm-arrow" aria-label="Previous workflow" onClick={() => { setMine(true); setTurn(turn - 1); }}>←</button>
            <div className="xtm-dots" role="tablist" aria-label="Workflows">
              {FLOWS.map(([c], i) => (
                <button key={c} type="button" role="tab" aria-selected={i === at} aria-controls={'xtm-p-' + i} id={'xtm-t-' + i} tabIndex={i === at ? 0 : -1} onClick={() => go(i)} onKeyDown={arrowKeys(n, go)}>
                  <span className="x-sr">{c}</span>
                  {i === at && !mine && <i className="xtm-dot-bar" aria-hidden="true" />}
                </button>
              ))}
            </div>
            <button type="button" className="xtm-arrow" aria-label="Next workflow" onClick={() => { setMine(true); setTurn(turn + 1); }}>→</button>
          </div>
        </div>
        {FLOWS.map(([c, cat], i) => (
          <div key={c} id={'xtm-p-' + i} role="tabpanel" aria-labelledby={'xtm-t-' + i} hidden={i !== at} className="xtm-panel">
            {c === 'bugfix' ? <Bugfix /> : (
              <div className="xtm-case lite">
                <p className="x-mono xtm-crew"><span>CHANNEL</span> #{c}</p>
                <h3>{cat}</h3>
                {MATE_OF[c] && <p className="xtm-case-d">{MATE_OF[c]}</p>}
              </div>
            )}
          </div>
        ))}
        <div className="x-row-links">
          <Lk to="/team">Learn more about Team</Lk><Lk to="/bot">Learn more about Bot</Lk><Lk to="https://hanzo.bot">Open Hanzo Bot</Lk><Lk to="https://hanzo.team">Open Hanzo Team</Lk>
        </div>
      </div>
    </section>
  );
}

/* ---------- 7. code channels and artifacts ---------- */
const STEP6 = ['1. Code trace', '2. Loop in design', '3. Decision', '4. Canvas summary', '5. E2E verify', '6. Session complete'];
const DIFF = [['12', '12', '', '.cta-button {'], ['13', '13', '', 'display: inline-flex;'], ['14', '14', '', 'align-items: center;'], ['15', '', 'del', '- color: #e5e7eb;'], ['16', '', 'del', '- background: #ec4899;'], ['', '15', 'add', '+ color: #1a1a1a;'], ['', '16', 'add', '+ background: #f472b6;'], ['', '17', 'add', '+ font-weight: 600;'], ['17', '18', '', 'border-radius: 8px;'], ['18', '19', '', '}']];

function Channel() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.4 });
  const calm = useReducedMotion();
  const [s, setS] = useState(6);
  const [mine, setMine] = useState(false);
  const [began, setBegan] = useState(false);
  useEffect(() => { if (seen && !calm && !began && !mine) { setBegan(true); setS(1); } }, [seen, calm, began, mine]);
  const show = (k) => (s >= k ? ' on' : '');
  const pick = (k) => { setMine(true); setS(k); };
  return (
    <section className="x-sec xtm-code" ref={ref}>
      <div className="x-wrap">
        <SecHead kicker="CODE CHANNELS & ARTIFACTS" title="Code channels where engineers, designers, and agents ship together." lede="Every code channel pairs the conversation with a live Artifacts pane — Canvas root-cause writeups, unified branch diffs, and interactive previews that update as your agents and teammates iterate." />
        <div className="xtm-steps6" role="tablist" aria-label="Steps of the session" onKeyDown={arrowKeys(6, (j) => pick(j + 1))}>
          {STEP6.map((t, i) => (
            <button key={t} type="button" role="tab" aria-selected={s === i + 1} tabIndex={s === i + 1 ? 0 : -1} onClick={() => pick(i + 1)}>
              <span>{t}</span>
              {s === i + 1 && !mine && <i aria-hidden="true" onAnimationEnd={() => setS(s === 6 ? 1 : s + 1)} />}
            </button>
          ))}
        </div>
        <div className="xtm-app">
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
                <p className="xtm-who"><Face n="dev" size={22} /><b>Dev</b><span>9:31 AM</span></p>
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
                <p className="xtm-who"><Face n="dev" size={22} /><b>Dev</b><span>9:36 AM</span></p>
                <p>Done! Updated <code>styles/cta-button.css</code> and wrote the root-cause summary in Canvas. <em>@Qa</em> running e2e checks now.</p>
                <p className="xtm-canvas"><b>Fix: Button Dark Mode</b><span>Canvas · Updated just now</span><a href="#xtm-diff">Open →</a></p>
              </div>
              <div className={'xtm-cm' + show(5)}>
                <p className="xtm-who"><Face n="sci" size={22} /><b>Qa</b><span>9:41 AM</span></p>
                <p>Verified e2e across Chromium &amp; Safari — WCAG AAA contrast (8.9:1) and checkout specs 28/28 green.</p>
              </div>
              <div className={'xtm-cm done' + show(6)}>
                <p className="xtm-pr2"><Tick size={18} />PR #418 merged · E2E green</p>
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
        <div className="xtm-roles">
          {[['dev', 'Dev', 'Software'], ['sci', 'Qa', 'Quality']].map(([f, n, r]) => <span key={n}><Face n={f} size={22} /><b>{n}</b>{r}</span>)}
          {[['Zoe Maxwell', 'Design'], ['Harry Boone', 'Eng']].map(([n, r]) => <span key={n}><b>{n}</b>{r}</span>)}
        </div>
        <p className="xtm-same">Same agent runtime across your workspace, Slack, browser, and cloud:</p>
        <div className="x-row-links tight"><Lk to="/team">Hanzo Team</Lk><Lk to="/slack">Hanzo Tag for Slack</Lk><Lk to="/tag">Hanzo Tag Governance</Lk><Lk to="/chrome">Hanzo in Chrome</Lk><Lk to="/bot">Hanzo Bot</Lk></div>
      </div>
    </section>
  );
}

/* ---------- 8. leadership ---------- */
const PEOPLE = [
  ['Antje Worring', 'Chief Executive Officer & Co-Founder', 'Leads Hanzo’s corporate strategy, enterprise partnerships, and sovereign AI deployment. Builds the business around the platform.', '/authors/antje-worring-portrait.jpg', 'antjeworr.ing', 'https://antjeworr.ing', [['X', 'https://x.com/antjeworring'], ['GitHub', 'https://github.com/zooqueen'], ['LinkedIn', 'https://www.linkedin.com/in/antje-worring/']]],
  ['Zach Kelling', 'Chief Technology Officer & Founder', 'Architect of Hanzo’s sovereign AI cloud, high-performance C/CUDA/Metal engine runtimes, and distributed agentic frameworks. Long-time open-source author.', '/authors/zach-kelling-portrait.jpg', 'zeekay.io', 'https://zeekay.io', [['X', 'https://x.com/zeekay'], ['GitHub', 'https://github.com/zeekay'], ['LinkedIn', 'https://www.linkedin.com/in/zeekay/']]],
];
function Leaders() {
  return (
    <section className="x-sec xtm-lead">
      <div className="x-wrap">
        <SecHead kicker="Leadership" title="Led by builders. Driven by research." lede="Hanzo is operated by a high-density team of systems architects, AI researchers, and compiler engineers. Instead of layers of bureaucracy, we stay close to the code — shipping open-source software and frontier models." />
        <ul className="xtm-ppl">
          {PEOPLE.map(([n, role, bio, img, site, to, soc], i) => (
            <li key={n}>
              <img src={'https://hanzo.ai' + img} alt={n} loading="lazy" decoding="async" />
              <div>
                <h3>{n}</h3>
                <p className="xtm-role x-mono">{role}</p>
                <p>{bio}</p>
                <div className="xtm-soc"><A to={to} className="x-arrow"><span>{site}</span><i aria-hidden="true">→</i></A>{soc.map(([l, u]) => <a key={l} href={u} target="_blank" rel="noopener noreferrer" aria-label={`${n} on ${l}`}>{l}</a>)}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function TeamPage() {
  return (
    <main className="xtm">
      <Hero />
      <Paste />
      <What />
      <Together />
      <Rooms />
      <Flows />
      <Channel />
      <Leaders />
      <Band
        title="One workspace for how your team actually works."
        lede="Bring your projects, tasks, conversations, docs, meetings, and knowledge together."
        action="Create your team"
        to="https://hanzo.team/start"
        note={<p className="x-band-note">Hanzo Team · <a href="https://hanzo.team" target="_blank" rel="noopener noreferrer">Open Hanzo Team</a></p>}
      />
      <section className="x-sec xtm-get">
        <div className="x-wrap xtm-get-w">
          <div>
            <h2>Get Team</h2>
            <p>Team workspace — channels, direct messages, agents as teammates</p>
          </div>
          <div className="xtm-get-r">
            <p className="x-mono">License: <b>MIT</b></p>
            <Btn to="https://github.com/hanzoai">hanzoai</Btn>
            <Btn to="https://platform.hanzo.ai/deploy" solid>Deploy to Cloud</Btn>
          </div>
        </div>
      </section>
    </main>
  );
}
