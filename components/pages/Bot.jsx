'use client';
/* Bot. Signature: an org chart of bots handing work to each other, packets travelling the lines. In the ten workflows a
   person posts in a channel, the packet runs to the bot they mention, that bot hands its work to a second specialist who
   verifies it, and the thread, steps and tools of that handoff play beside the chart; every ten seconds the next channel.
   The hero plays Hanzo's sample thread (Mark asks Des for a header, then asks you before it ships).
   Beyond: "How many bots do you need?" Slide from 1 to 10 and the smallest plan that includes that many resident bots
   lights up, from Hanzo's own plan list. Every word, figure and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { EASE, Copy } from '../ui';
import { A, Go, SecHead, Faq, Tick } from '../kit';
import { WORKFLOWS, TOOLS } from './Bot.data';
import './Bot.css';

const face = (id) => `/memoji/${id === 'qa' ? 'sci' : id}.svg`;

/* A timer that steps through n beats while on screen; the server and reduced motion show the last beat. */
function useBeats(n, ms, hold = 4200) {
  const [b, setB] = useState(n);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  useEffect(() => { if (!calm) setB(0); }, [calm]);
  useEffect(() => {
    if (calm || !seen) return;
    const t = setTimeout(() => setB((v) => (v >= n ? 0 : v + 1)), b >= n ? hold : Array.isArray(ms) ? ms[b] : ms);
    return () => clearTimeout(t);
  }, [b, seen, calm]); // eslint-disable-line react-hooks/exhaustive-deps
  return [b, setB, box, calm];
}

/* ---------- hero: the sample thread ---------- */
function Msg({ on, who, children, cls = '' }) {
  return (
    <motion.div className={'xbt-msg ' + cls} initial={false} animate={{ opacity: on ? 1 : 0, y: on ? 0 : 14 }} transition={{ duration: 0.45, ease: EASE }} aria-hidden={!on}>
      {who && <img src={face(who)} alt="" className="xbt-av" />}
      <div>{children}</div>
    </motion.div>
  );
}

function Thread() {
  const [b, setB, box] = useBeats(7, [900, 1500, 1500, 1600, 1700, 1800, 2400], 5200);
  const [pick, setPick] = useState(null);
  useEffect(() => { if (b === 0) setPick(null); }, [b]);
  useEffect(() => { if (b === 6 && !pick) setPick('yes'); }, [b, pick]);
  const at = (k) => b > k;
  const desOn = b === 3; // Des works from Mark's message until her header arrives
  return (
    <div className="xbt-app" ref={box} aria-label="Hanzo Bot, playing a sample thread" role="group">
      <aside className="xbt-side">
        <div className="xbt-search">Search</div>
        <p className="xbt-side-h">Teammates <span className="x-mono">{desOn ? '2 working' : '1 working'}</span></p>
        <ul className="xbt-mates">
          {[['mark', 'Mark', true], ['des', 'Des', desOn]].map(([id, n, on]) => (
            <li key={id} className={on ? 'on' : ''}><img src={face(id)} alt="" /><span><b>{n}</b><span>{on ? 'Working' : ' '}</span></span>{on && <i className="xbt-busy" aria-hidden="true" />}</li>
          ))}
        </ul>
        <span className="xbt-hand" aria-hidden="true">{(b === 3 || b === 4) && <motion.i key={b} initial={{ y: b === 3 ? 0 : 44, opacity: 0 }} animate={{ y: b === 3 ? 44 : 0, opacity: [0, 1, 1, 0] }} transition={{ duration: 1, ease: EASE }} />}</span>
      </aside>
      <div className="xbt-main">
        <div className="xbt-main-h"><img src={face('mark')} alt="" /><b>Mark · Marketing</b><span className="xbt-plus x-mono">+<span>1</span></span></div>
        <div className="xbt-log">
          <Msg on={at(0)} cls="you"><p>Write the launch post for crypto top-ups, and ask Des for a header.</p></Msg>
          <Msg on={at(1)} who="mark"><p>Drafted. Agents can now top up in USDC or USDT over the API and pay as they go.</p></Msg>
          <Msg on={at(2)} cls="sys"><p><img src={face('des')} alt="" />Messaged Des · Designer</p></Msg>
          <Msg on={at(3)} cls="from"><p className="xbt-from"><img src={face('des')} alt="" />Message from Des · Designer</p><div className="xbt-quote"><b><img src={face('des')} alt="" />Des · Designer</b><p>Top up in USDC or USDT.</p><span className="xbt-file x-mono">header.mp4</span></div></Msg>
          <Msg on={at(4)} who="mark"><p>Des sent the header. Here is /pricing with the new line.</p><div className="xbt-card"><span className="x-mono">hanzo.ai/pricing</span><p>Agents can top up in USDC or USDT over the API.</p><span className="xbt-file x-mono">pricing.png</span></div></Msg>
          <Msg on={at(5)} cls="ask">
            <span className="xbt-answered x-mono" style={{ opacity: pick ? 1 : 0 }}>Answered</span>
            <p>Should /pricing include that sentence about crypto top-ups?</p>
            <div className="xbt-yn">
              <button type="button" className={pick === 'yes' ? 'on' : ''} onClick={() => { setPick('yes'); if (b < 6) setB(6); }} tabIndex={at(5) ? 0 : -1}>Yes, add it</button>
              <button type="button" className={pick === 'no' ? 'on' : ''} onClick={() => setPick('no')} tabIndex={at(5) ? 0 : -1}>Not yet</button>
            </div>
          </Msg>
          <Msg on={at(5) && pick !== 'no' && (b >= 6 || pick === 'yes')} who="mark"><p>Added. I will post a short update in #hanzo-marketing every weekday.</p></Msg>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="xbt-hero" aria-labelledby="xbt-h1">
      <div className="x-wrap xbt-hero-grid">
        <div>
          <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Hanzo Bot · AI teammates</motion.p>
          <h1 id="xbt-h1" className="xbt-h1">
            {['Teammates you can', 'hand real work to.'].map((t, i) => (
              <span className="x-line" key={t}><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 + i * 0.12 }}>{t}</motion.span></span>
            ))}
          </h1>
          <motion.p className="xbt-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>
            Give a bot a job. It has its own computer, signs in to your tools the way you do, and comes back when the work is done. On your machine, in our cloud, or both.
          </motion.p>
          <ul className="xbt-pts">
            {['Each bot has its own computer: a browser, a terminal and your apps', 'It signs in to your tools once and works the way you do', 'Bots hand work to each other and ask you only when it matters', 'Routines run on a schedule and stop for your yes'].map((t, i) => (
              <motion.li key={t} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.5 + i * 0.06 }}><Tick size={18} delay={0.6 + i * 0.08} />{t}</motion.li>
            ))}
          </ul>
          <motion.div className="xbt-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.7 }}>
            <A to="https://hanzo.bot" className="x-btn solid" data-thumb="Try Hanzo">Try Hanzo</A>
            <a href="#install" className="x-btn">Install on your Mac</a>
            <A to="/contact-sales" className="xbt-link">Contact sales</A>
          </motion.div>
          <motion.p className="xbt-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.85 }}>Open source. Run it on your own machine if you want to — your keys and your data stay with you.</motion.p>
        </div>
        <motion.div initial={{ opacity: 0, y: 40, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.25 }}>
          <Thread />
        </motion.div>
      </div>
    </section>
  );
}

const PASTE = 'Read https://hanzo.ai/skill.md and use Hanzo Bot in my project. Start with: hanzo bot runs list';

function Paste() {
  return (
    <section className="xbt-paste-sec">
      <div className="x-wrap xbt-paste">
        <div>
          <p className="x-kick">Paste and ship</p>
          <p className="xbt-paste-l">Paste this into any agent. It reads the skill manifest and calls Bot from there.</p>
        </div>
        <div className="xbt-prompt">
          <div className="xbt-prompt-top"><span className="x-mono">Agent prompt</span><span className="xbt-api x-mono"><b>api</b> /v1/bot</span><Copy text={PASTE} label="Copy the agent prompt" /></div>
          <pre className="x-mono">{PASTE}<span className="xbt-cur" aria-hidden="true" /></pre>
        </div>
      </div>
    </section>
  );
}

/* ---------- what a bot is, jobs ---------- */
function What() {
  const items = [
    ['Its own computer', 'Each bot runs in its own sandbox with a browser, a terminal and your apps. Nothing it does touches your machine unless you let it.'],
    ['Works where you work', 'Sign it in once. It uses the same tools and websites you do, including the ones that are hard to automate.'],
    ['Comes back when it is done', 'Give it a task and go do something else. It returns with finished work and asks only when it needs your say.'],
  ];
  return (
    <section className="x-sec xbt-what">
      <div className="x-wrap">
        <SecHead kicker="What a bot is" title="A teammate with its own computer" lede="Not a chat window. A bot has a computer of its own and works while you do something else." />
        <ol className="xbt-three">
          {items.map(([t, d], i) => (
            <li key={t}>
              <span className={'xbt-pc g' + i} aria-hidden="true"><i /><b /><em /></span>
              <span className="xbt-n x-mono">{String(i + 1).padStart(2, '0')}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const JOBS = [
  ['Inbox', 'Sorts what came in, answers what it can, and parks drafts for your ok.'],
  ['Sales outreach', 'Researches accounts, drafts messages in your voice, and leaves a review list.'],
  ['Research', 'Reads, compares, and writes up what it found.'],
  ['Bug reproduction', 'Reproduces the report, finds the failing step, and files it.'],
  ['Expenses', 'Collects the receipts and files the report.'],
  ['Chief of staff', 'Keeps the other bots on task and tells you what changed.'],
];

function Jobs() {
  const [b, , box] = useBeats(JOBS.length - 1, 1600, 1600);
  return (
    <section className="x-sec xbt-jobs" ref={box}>
      <div className="x-wrap xbt-split">
        <div className="xbt-sticky"><SecHead kicker="Give each bot a job" title="One bot per job" /></div>
        <ul className="xbt-joblist">
          {JOBS.map(([t, d], i) => (
            <li key={t} className={i === b ? 'on' : ''}>
              <h3>{t}</h3>
              <p>{d}</p>
              <span className="xbt-state x-mono" aria-hidden="true">{i === b ? 'Working' : ''}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- three ways it works with others, with its own picture each ---------- */
function Trio({ kicker, title, items, link, to, art, flip }) {
  return (
    <section className={'x-sec xbt-trio' + (flip ? ' flip' : '')}>
      <div className="x-wrap xbt-trio-grid">
        <div>
          <SecHead kicker={kicker} title={title} />
          <ul className="xbt-trio-list">
            {items.map(([t, d], i) => (
              <li key={t}><h3>{t}</h3><p>{d}</p></li>
            ))}
          </ul>
          <div className="x-row-links"><A to={to} className="xbt-link">{link} →</A></div>
        </div>
        <div className="xbt-art">{art}</div>
      </div>
    </section>
  );
}

function Gateway() {
  return (
    <div className="xbt-gw" aria-hidden="true">
      <span className="xbt-gw-core x-mono">gateway</span>
      {['mark', 'des', 'dev'].map((id, i) => (
        <span key={id} className={'xbt-gw-bot b' + i}><img src={face(id)} alt="" /><i className="xbt-gw-line"><em style={{ animationDelay: i * 0.9 + 's' }} /></i></span>
      ))}
    </div>
  );
}

function Routines() {
  const [on, setOn] = useState([true, true]);
  const list = [['Daily #hanzo-marketing update', 'Weekdays around 9:00 AM'], ['Answer #hanzo-marketing mentions', 'When @mentioned']];
  return (
    <div className="xbt-rt">
      <div className="xbt-rt-tabs" aria-hidden="true"><span>Details</span><span>Library</span><span>Computer</span><span className="on">Routines</span></div>
      <ul>
        {list.map(([t, w], i) => (
          <li key={t}>
            <span><b>{t}</b><span className="x-mono">{w}</span></span>
            <button type="button" role="switch" aria-checked={on[i]} aria-label={t} className={'xbt-sw' + (on[i] ? ' on' : '')} onClick={() => setOn(on.map((v, k) => (k === i ? !v : v)))}><i /></button>
          </li>
        ))}
      </ul>
      <span className="xbt-rt-new">+ New routine</span>
      <span className="xbt-rt-tick" aria-hidden="true" />
    </div>
  );
}

function MemoryFile() {
  return (
    <div className="xbt-mem" aria-hidden="true">
      <div className="xbt-mem-top x-mono"><span className="on">MEMORY.md</span><span>SKILLS.md</span></div>
      <div className="xbt-mem-body">{[78, 52, 66, 40, 72, 58, 34, 62].map((w, i) => <i key={i} style={{ width: w + '%' }} />)}<span className="xbt-mem-find" /></div>
    </div>
  );
}

const STEPS3 = [['Name it and give it a job', 'Say what you want done, in plain words.'], ['Sign it in to your tools', 'Once. It keeps the access it needs and nothing more.'], ['Let it work', 'It comes back when it is done, or when it needs you.']];

function Start() {
  const [b, , box] = useBeats(3, 1500, 2600);
  return (
    <section className="x-sec xbt-start" ref={box}>
      <div className="x-wrap">
        <SecHead kicker="How it starts" title="Three steps" />
        <ol className="xbt-steps">
          <i className="xbt-steps-line" aria-hidden="true"><motion.b animate={{ scaleX: Math.min(b, 3) / 3 }} transition={{ duration: 0.8, ease: EASE }} /></i>
          {STEPS3.map(([t, d], i) => (
            <li key={t} className={b > i ? 'on' : ''}>
              <span className="xbt-step-n x-mono">{String(i + 1).padStart(2, '0')}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const CHANNELS = ['Desktop', 'iPhone', 'WhatsApp', 'Telegram', 'Slack', 'Discord', 'iMessage', 'Signal', 'Web chat'];

function Anywhere() {
  return (
    <section className="x-sec xbt-any">
      <div className="x-wrap">
        <SecHead kicker="Talk to it anywhere" title="Message your bots where you already are" />
      </div>
      <div className="xbt-belt">
        <ul className="xbt-belt-in">
          {[0, 1].map((k) => CHANNELS.map((c) => <li key={k + c} aria-hidden={k ? true : undefined}>{c}</li>))}
        </ul>
      </div>
      <div className="x-wrap"><div className="x-row-links"><A to="https://github.com/hanzoai/bot/blob/main/docs/install/migrate-from-openclaw.md" className="xbt-link">Coming from OpenClaw? One command moves your install →</A></div></div>
    </section>
  );
}

/* ---------- pricing, with the bots-you-need slider ---------- */
const PERKS = ['Early access to new models and features', 'Train custom models on your data', 'Hanzo Engine to run models on your own hardware', 'Dedicated support'];
const PLANS = [
  ['Pro', '$15', 1, ['3x more usage than Go', '3x higher limits than Go'], 'pro-2x'],
  ['Dev', '$45', 2, ['5x more usage than Go', '5x higher limits than Go'], 'dev-5x'],
  ['Max', '$95', 5, ['15x more usage than Go', '15x higher limits than Go'], 'max-10x'],
  ['Ultra', '$195', 10, ['Highest included usage across every model', 'Continuous usage with no window resets', 'Usage beyond what is included is paid from your prepaid balance at list price'], 'ultra'],
];
export const planFor = (n) => PLANS.findIndex((p) => p[2] >= n);

function Pricing() {
  const [n, setN] = useState(1);
  const k = planFor(n);
  return (
    <section className="x-sec xbt-price" id="pricing">
      <div className="x-wrap">
        <SecHead kicker="Pricing" title="Included in plans from $15" lede="Each plan below includes resident cloud bots. Or run Hanzo Bot free on your own machine." />
        <div className="xbt-need">
          <label htmlFor="xbt-n">How many resident bots do you need?</label>
          <input id="xbt-n" type="range" min="1" max="10" step="1" value={n} onChange={(e) => setN(+e.target.value)} aria-valuetext={`${n} ${n === 1 ? 'bot' : 'bots'}: ${PLANS[k][0]}`} />
          <output htmlFor="xbt-n" className="x-mono"><b>{n}</b> {n === 1 ? 'bot' : 'bots'} → <b>{PLANS[k][0]}</b>, {PLANS[k][1]} / month</output>
        </div>
        <div className="xbt-plans">
          {PLANS.map(([name, price, bots, lines, plan], i) => (
            <div key={name} className={'xbt-plan' + (i === k ? ' pick' : '')}>
              <h3>{name}</h3>
              <p className="xbt-p"><b>{price}</b> <span>/</span> <span>month</span></p>
              <ul>
                {lines.map((l) => <li key={l}>{l}</li>)}
                <li className="xbt-bots">Hanzo Bot: {bots} {bots === 1 ? 'bot' : 'bots'} of your own</li>
                {PERKS.map((l) => <li key={l}>{l}</li>)}
              </ul>
              <A to={`/pay/confirm/card?plan=${plan}&returnUrl=https%3A%2F%2Fhanzo.ai%2Fchat`} className={'x-btn' + (i === k ? ' solid' : '')}>Get {name}</A>
            </div>
          ))}
        </div>
        <p className="xbt-free">Every plan can run Hanzo Bot on your own Mac or Linux machine, 100% free and open source.</p>
      </div>
    </section>
  );
}

function Install() {
  return (
    <section className="x-sec xbt-install" id="install">
      <div className="x-wrap xbt-install-grid">
        <SecHead kicker="Install" title="On your Mac in two commands" lede="Node 22 or newer, on macOS or Linux. The second command walks you through your model, channels and skills, and keeps the gateway running in the background." />
        <div>
          <div className="xbt-term">
            <div className="xbt-term-bar"><i /><i /><i /><span className="x-mono">terminal</span><Copy text={'npm install -g @hanzo/bot\nhanzo-bot onboard --install-daemon'} /></div>
            <pre className="x-mono"><span className="xbt-ps">$ </span>npm install -g @hanzo/bot{'\n'}<span className="xbt-ps">$ </span>hanzo-bot onboard --install-daemon{'\n'}<span className="xbt-ps">$ </span><span className="xbt-cur" /></pre>
          </div>
          <div className="x-row-links"><A to="https://docs.hanzo.bot/docs/install" className="xbt-link">Install guide →</A><A to="https://github.com/hanzoai/bot" className="xbt-link">View on GitHub →</A></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- the signature: ten workflows on an org chart ---------- */
const CREW = ['dev', 'qa', 'cyber', 'des', 'mark', 'su', 'doc', 'opera', 'sci', 'data', 'sal', 'fin', 'law'];

function Org({ w, live }) {
  const n = CREW.length;
  const pos = (id) => (CREW.indexOf(id) + 0.5) / n * 100;
  const H = [50, 14], P = [pos(w.primary.id), 70], V = [pos(w.verifier.id), 70];
  return (
    <div className="xbt-org" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1={H[0]} y1={H[1] + 8} x2={P[0]} y2={P[1] - 9} className="xbt-wire" />
        <path d={`M ${P[0]} ${P[1] + 9} Q ${(P[0] + V[0]) / 2} 100 ${V[0]} ${V[1] + 9}`} className="xbt-wire v" />
        <line x1="0" y1={P[1]} x2="100" y2={P[1]} className="xbt-rail" />
      </svg>
      <span className="xbt-human" style={{ left: H[0] + '%', top: H[1] + '%' }}><b>{w.human.initials}</b><span>{w.human.name}</span></span>
      {CREW.map((id) => {
        const role = id === w.primary.id ? 'p' : id === w.verifier.id ? 'v' : '';
        return (
          <span key={id} className={'xbt-node ' + role} style={{ left: pos(id) + '%', top: P[1] + '%' }}>
            <img src={face(id)} alt="" />
            {role && <em className="x-mono">@{role === 'p' ? w.primary.name : w.verifier.name}</em>}
          </span>
        );
      })}
      {live && <>
        <span className="xbt-lane"><motion.i key={w.id + 'a'} initial={{ x: H[0] + '%', y: H[1] + 8 + '%', opacity: 0 }} animate={{ x: [H[0] + '%', P[0] + '%'], y: [H[1] + 8 + '%', P[1] - 9 + '%'], opacity: [0, 1, 1, 0] }} transition={{ duration: 1.2, ease: EASE, delay: 0.3, repeat: Infinity, repeatDelay: 1.6 }} /></span>
        <span className="xbt-lane"><motion.i key={w.id + 'b'} className="v" initial={{ x: P[0] + '%', y: P[1] + 9 + '%', opacity: 0 }} animate={{ x: [P[0] + '%', (P[0] + V[0]) / 2 + '%', V[0] + '%'], y: [P[1] + 9 + '%', '92%', V[1] + 9 + '%'], opacity: [0, 1, 1, 0] }} transition={{ duration: 1.3, ease: 'easeInOut', delay: 1.6, repeat: Infinity, repeatDelay: 1.5 }} /></span>
      </>}
    </div>
  );
}

function Workflows() {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.25 });
  const calm = useReducedMotion();
  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setTimeout(() => setAt((a) => (a + 1) % WORKFLOWS.length), 9500);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen]);
  const w = WORKFLOWS[at];
  const go = (i) => { setAt(i); setMine(true); };
  return (
    <section className="x-sec xbt-wf" id="use-cases" data-room="dark" ref={box}>
      <div className="x-wrap">
        <div className="xbt-wf-head">
          <p className="xbt-chip x-mono"><b>10 KILLER WORKFLOWS</b><span>Engineering · Security · Launch · Support · Ops · Research · Sales · Finance · Legal · Growth</span></p>
          <h2>Ten everyday workflows your team hands off in a single mention.</h2>
          <p>A human opens a channel or posts a quick explanation, mentions the right teammate, and gets finished work back — verified end-to-end by a second specialist before you merge or send.</p>
        </div>
        <div className="xbt-wf-grid">
          <nav className="xbt-chans" aria-label="Channels">
            <p className="xbt-chans-h"><img src={face('dev')} alt="" /><b>Hanzo</b><span className="x-mono">10 channels</span></p>
            <div role="tablist" aria-label="Workflows" aria-orientation="vertical">
              {WORKFLOWS.map((x, i) => (
                <button key={x.id} type="button" role="tab" aria-selected={i === at} aria-controls="xbt-wf-p" onClick={() => go(i)} className={i === at ? 'on' : ''}>
                  <span className="x-mono">{x.num}</span><span className="xbt-hash"># <span>{x.channel}</span></span>
                  <span className="xbt-pair" aria-hidden="true"><img src={face(x.primary.id)} alt="" /><img src={face(x.verifier.id)} alt="" /></span>
                  {i === at && !mine && <motion.i className="xbt-prog" key={at} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 9.5, ease: 'linear' }} />}
                </button>
              ))}
            </div>
            <p className="xbt-crew-h x-mono">ACTIVE CREW</p>
            <span className="xbt-crew" aria-hidden="true">{CREW.map((id) => <img key={id} src={face(id)} alt="" className={id === w.primary.id || id === w.verifier.id ? 'on' : ''} />)}</span>
          </nav>
          <div className="xbt-wf-main" id="xbt-wf-p" role="tabpanel">
            <Org w={w} live={seen} />
            {/* all ten stay in the page, stacked in one cell: the tallest sets the height, so nothing below jumps */}
            <div className="xbt-cases">
              {WORKFLOWS.map((w, i) => (
              <motion.div key={w.id} className="xbt-case" initial={false} animate={i === at ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }} transition={{ duration: 0.45, ease: EASE }} aria-hidden={i !== at} inert={i !== at}>
                  <div className="xbt-case-top">
                    <span className="x-mono">#{w.channel} · {w.category}</span>
                    <span className="x-mono">USE CASE {w.num}</span>
                  </div>
                  <h3>{w.title}</h3>
                  <p className="xbt-sum">{w.summary}</p>
                  <div className="xbt-chat">
                    <div className="xbt-line"><span className="xbt-ini">{w.human.initials}</span><div><p className="xbt-meta"><b>{w.human.name}</b> <span>{w.human.time}</span></p><p>{w.human.before}<b className="xbt-at">{w.human.mention}</b>{w.human.after}</p></div></div>
                    <div className="xbt-line"><img src={face(w.primary.id)} alt="" /><div><p className="xbt-meta"><b>{w.primary.name}</b> <span>{w.primary.role} · {w.primary.time}</span></p><p>{w.primary.reply}</p><p className="xbt-art2 x-mono">{w.primary.codeOrArtifact}</p></div></div>
                    <div className="xbt-line"><img src={face(w.verifier.id)} alt="" /><div><p className="xbt-meta"><b>{w.verifier.name}</b> <span>{w.verifier.role} · {w.verifier.time}</span></p><span className="xbt-badge x-mono">{w.verifier.badge}</span><p>{w.verifier.reply}</p></div></div>
                  </div>
                  <div className="xbt-case-foot">
                    <div>
                      <p className="xbt-k x-mono">AUTOMATED WORKFLOW <span>{w.steps.length} / {w.steps.length} steps complete</span></p>
                      <ol className="xbt-wsteps">{w.steps.map((s, i) => <li key={s}><Tick size={16} delay={0.2 + i * 0.15} />{s}</li>)}</ol>
                    </div>
                    <div>
                      <p className="xbt-k x-mono">TOOLS &amp; SANDBOXES USED</p>
                      <ul className="xbt-tools">{w.tools.map((t) => <li key={t}>{t}</li>)}</ul>
                    </div>
                  </div>
                  <div className="xbt-run">
                    <span className="xbt-pair" aria-hidden="true"><img src={face(w.primary.id)} alt="" /><img src={face(w.verifier.id)} alt="" /></span>
                    <span>Run <b className="x-mono"># <span>{w.channel}</span></b> with <b>{w.primary.name}</b> &amp; <b>{w.verifier.name}</b> in your workspace:</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="xbt-run-links">
              <A to="/team" className="xbt-pill">Learn more about Team</A>
              <A to="/bot" className="xbt-pill">Learn more about Bot</A>
              <A to="https://hanzo.bot" className="xbt-pill solid">Open Hanzo Bot</A>
              <A to="https://hanzo.team" className="xbt-pill">Open Hanzo Team</A>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- the tools it signs in to ---------- */
function Tools() {
  const [cat, setCat] = useState(0);
  const [mine, setMine] = useState(false);
  const [b, , box, calm] = useBeats(10, 260, 1800);
  useEffect(() => { if (!mine && !calm && b === 10) { const t = setTimeout(() => setCat((c) => (c + 1) % TOOLS.length), 1700); return () => clearTimeout(t); } }, [b, mine, calm]);
  const signed = mine || calm ? 10 : b;
  return (
    <section className="x-sec xbt-tools-sec" ref={box}>
      <div className="x-wrap">
        <SecHead kicker="Works where you work" title="Sign it in to the tools you use" lede="You log in once in the bot's own browser. It keeps the session and works in the same tools and sites you do." />
        <div className="xbt-cats" role="tablist" aria-label="Kinds of tools">
          {TOOLS.map(([c], i) => (
            <button key={c} type="button" role="tab" aria-selected={i === cat} aria-controls={'xbt-tc' + i} onClick={() => { setCat(i); setMine(true); }} className={i === cat ? 'on' : ''}>{c}</button>
          ))}
        </div>
        <div className="xbt-logos">
          {TOOLS.map(([c, list], i) => (
            <ul key={c} id={'xbt-tc' + i} role="tabpanel" aria-label={c} hidden={i !== cat}>
              {list.map(([f, n], k) => (
                <li key={f} className={k < signed ? 'in' : ''}>
                  <img src={`/connectors/${f}.png`} alt={n} loading="lazy" />
                  <span>{n}</span>
                  <i aria-hidden="true">✓</i>
                </li>
              ))}
            </ul>
          ))}
        </div>
        <p className="xbt-fine">200 tools. Each mark belongs to its owner and is shown to say what Hanzo connects to — not to imply any partnership or endorsement.</p>
      </div>
    </section>
  );
}

function More() {
  const feats = [
    ['Dedicated Cloud Sandbox', 'Each extra bot runs in its own isolated Linux environment with dedicated memory and compute.'],
    ['Isolated Browser & Shell', 'Independent Chromium browser sessions and private bash terminals with separate logins and cookies.'],
    ['Independent Markdown Memory', 'Private workspace memory files (MEMORY.md) so multiple bots never pollute each other’s context.'],
    ['Parallel Schedules & Cron', 'Run background jobs simultaneously across multiple bots without hitting single-bot queues.'],
  ];
  return (
    <section className="x-sec xbt-more" id="additional-bots">
      <div className="x-wrap xbt-more-grid">
        <div>
          <SecHead kicker="Included with your plan" title="Need more than one resident bot?" lede="Each plan includes the resident cloud bots it lists. For more bots, choose a plan that includes more." />
          <Go to="/pricing" solid>See the plans</Go>
        </div>
        <ul className="xbt-feats">
          {feats.map(([t, d], i) => (
            <li key={t}><span className="xbt-stack" aria-hidden="true" style={{ '--k': i }}><i /><i /><i /></span><h3>{t}</h3><p>{d}</p></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const WHY = [
  ['Compute Floor', 'Why a $100/mo entry floor?', 'Not a chat window. A resident cloud computer.', 'Standard chat models terminate compute as soon as tokens finish streaming. A resident Hanzo Bot lives in an active cloud sandbox with its own Chromium browser, bash terminal, isolated filesystem, and scheduled cron jobs. The $100/month floor covers continuous cloud sandboxing and dedicated container resources.'],
  ['Token Economics', 'Routine work at 1/5th the token cost', 'Intelligent routing through Enso & Sol 6.1.', 'Up to 90% of a resident bot’s daily work consists of triaging inboxes, summarizing documents, parsing receipts, and scraping pages. Rather than burning expensive frontier reasoning on routine tasks, Hanzo Bot executes routine loops on Enso & Sol 6.1 at ~1/5th the token price, leaving your monthly AI allowance intact for the tasks that need it.'],
  ['Frontier Autonomy', 'Zen Ultra for complex reasoning ($800/mo)', 'Extended capacity for non-stop autonomous loops.', 'When your bot needs to perform deep multi-hour research, autonomous software engineering, or multi-step strategic analysis, the Ultra tier ($800/mo) includes Zen Ultra and Astra Ultra frontier models with unlimited capacity, no hourly rate caps, continuous execution as long as you have funds, and an automatic 20% discount on all usage exceeding $800.'],
  ['Auditable Memory', 'Plain Markdown files you can inspect & edit', 'No black-box fine-tuning or opaque vector locks.', 'Hanzo Bot records what it learns in human-readable Markdown files in its workspace (`MEMORY.md`, `SKILLS.md`). You can open them, audit them, version-control them in Git, or delete them anytime. The bot begins every session from what you leave.'],
];

function Why() {
  const [open, setOpen] = useState(0);
  return (
    <section className="x-sec xbt-why" id="pricing-model">
      <div className="x-wrap">
        <SecHead kicker="Agent Architecture & Pricing Model" title="Why Hanzo Bot is built and priced this way" lede="Designed around the real economics of autonomous resident agents: dedicated sandboxes, cost-efficient model tiering, and transparent, auditable memory." />
        <div className="xbt-why-row">
          {WHY.map(([k, t, s, d], i) => (
            <div key={k} className={'xbt-why-c' + (open === i ? ' on' : '')}>
              <button type="button" aria-expanded={open === i} onClick={() => setOpen(i)} onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(i)}>
                <span className="x-mono">{k}</span>
                <h3>{t}</h3>
                <span className="xbt-why-s">{s}</span>
              </button>
              <div className="xbt-why-d" aria-hidden={open !== i}><p>{d}</p></div>
            </div>
          ))}
        </div>
        <div className="xbt-own">
          <div><h3>Prefer running on your own machine? It’s 100% free.</h3><p>Hanzo Bot is open source under the MIT license. You can run the exact same gateway, sandboxes, and skills on your own Mac or Linux machine with your own API keys at zero subscription cost.</p></div>
          <span className="xbt-mit x-mono">MIT Open Source</span>
        </div>
      </div>
    </section>
  );
}

const QA = [
  ['What is Hanzo Bot?', 'An AI teammate. It runs behind a gateway on your machine, in our cloud, or both. You message it on the chat apps you already use, and it does the work with its own browser, terminal and tools.'],
  ['Is it open source?', 'Yes, MIT licensed, at github.com/hanzoai/bot. Run it on your own machine and your keys and data stay there.'],
  ['What does it run on?', 'macOS or Linux, and Windows through WSL2, with Node 22 or newer. A Mac is only needed for macOS-only tools; a small server works for everything else.'],
  ['Which models does it use?', 'The ones you choose: API keys for the providers you use, or a local model so your data stays on your device. hanzo-bot models manages the choice and the sign-in.'],
  ['Can it work on a schedule?', 'Yes. Cron jobs run it every morning or at a set time, survive a restart, and can post the result to a chat.'],
  ['Does it remember what I tell it?', 'It writes what it learns to Markdown files in its workspace and searches them when it needs them. If you want something to stick, ask it to write it down.'],
  ['I use OpenClaw. Can I move over?', 'hanzo-bot migrate openclaw shows what would move and writes nothing. Add --apply to move config, credentials, workspace, sessions, skills and cron jobs. It never changes ~/.openclaw.'],
  ['What does Hanzo Bot cost?', 'Running Hanzo Bot on your own machine is 100% free and open source (MIT licensed). In our cloud, resident bots come with the plans listed under Pricing, each with the number of bots it states — compute is metered per bot-hour beyond the included allowance, with auto-reload to keep going.'],
  ['Why is there a $15/mo floor for cloud resident bots?', 'Unlike simple chat prompts where compute ends as soon as generation stops, a resident bot has an always-on dedicated cloud environment. It runs an isolated sandbox container, headless browser, terminal, filesystem, and active cron listeners. The $15/mo floor covers dedicated compute and guarantees uptime.'],
  ['How do model token costs work for bots?', 'Routine tasks (sorting inboxes, web scraping, scheduling, receipt parsing) execute on fast, cost-effective Enso and Sol 6.1 models at ~1/5th the token cost of frontier models, preserving 85-90% of your plan allowance. Higher tiers include Zen Ultra and Astra Ultra frontier models for complex multi-step reasoning.'],
];

function Questions() {
  return (
    <section className="x-sec xbt-qa" id="faq">
      <div className="x-wrap xbt-split">
        <div className="xbt-sticky">
          <SecHead kicker="FAQ" title="Questions" />
          <span className="xbt-typing" aria-hidden="true"><img src={face('su')} alt="" /><i /><i /><i /></span>
        </div>
        <Faq items={QA} />
      </div>
    </section>
  );
}

function Close() {
  return (
    <section className="x-sec xbt-close">
      <div className="x-wrap">
        <div className="xbt-meet">
          <span className="xbt-meet-faces" aria-hidden="true">{CREW.slice(0, 7).map((id, i) => <img key={id} src={face(id)} alt="" style={{ animationDelay: i * 0.25 + 's' }} />)}</span>
          <h2>Meet your first bot</h2>
          <p>A teammate you can trust with real work.</p>
          <div className="xbt-acts"><Go to="/login" solid>Try Hanzo</Go><Go to="/contact-sales">Contact sales</Go></div>
        </div>
        <div className="xbt-related">
          <p className="x-kick">Related capabilities</p>
          <div className="xbt-rel">
            {[['/cloud/chat', 'Chat', 'Conversational AI'], ['/search', 'Search', 'Retrieval & answers'], ['/crawl', 'Crawl', 'Web crawler']].map(([to, t, d], i) => (
              <div key={t}><A to={to} className="xbt-rel-a"><b>{t}</b><span>{d}</span><i aria-hidden="true">→</i></A></div>
            ))}
          </div>
        </div>
        <div className="xbt-get">
          <div><h2>Get Bot</h2><p>Connect your AI agents to every messaging channel</p></div>
          <dl className="xbt-meta2"><div><dt>License:</dt><dd>MIT</dd></div><div><dt>Source</dt><dd><A to="https://github.com/hanzoai/bot">hanzoai/bot</A> <span className="x-mono">5 stars</span></dd></div></dl>
          <Go to="https://platform.hanzo.ai/deploy" solid>Deploy to Cloud</Go>
        </div>
      </div>
    </section>
  );
}

export default function Bot() {
  return (
    <main className="xbt">
      <Hero />
      <Paste />
      <What />
      <Jobs />
      <Trio kicker="Work with many at once" title="Bots that hand work to each other" link="How multi-agent works" to="https://docs.hanzo.bot/docs/concepts/multi-agent" art={<Gateway />}
        items={[['One gateway, many bots', 'Each bot has its own workspace, sign-ins and history, and each message goes to the bot it is meant for.'], ['Sub-agents', 'A bot can start background runs that work in parallel and post what they found back in the chat that asked.'], ['Bots message bots', 'One bot can read another’s session and send it a message, so a handoff needs no copy and paste.']]} />
      <Trio flip kicker="Show it how it is done" title="Teach it a routine once" link="Skills in the docs" to="https://docs.hanzo.bot/docs/tools/skills" art={<Routines />}
        items={[['Skills', 'Write the steps in a plain Markdown skill, and the bot uses it whenever the job comes up.'], ['On a schedule', 'Every morning, or in twenty minutes. Scheduled jobs survive a restart and can post the result to a chat.'], ['Your say at each step', 'A multi-step routine can stop at the steps you mark and wait for your yes before it goes on.']]} />
      <Trio kicker="Gets better as it goes" title="It remembers what it learns" link="How memory works" to="https://docs.hanzo.bot/docs/concepts/memory" art={<MemoryFile />}
        items={[['Memory is files', 'Decisions, preferences and running notes go into Markdown files in its workspace, not into the model.'], ['It looks things up', 'It searches those notes when it needs them, so what you told it last week still counts.'], ['Yours to read and fix', 'Open the files, correct them or delete them. The next session starts from what you left.']]} />
      <Start />
      <Anywhere />
      <Pricing />
      <Install />
      <Workflows />
      <Tools />
      <More />
      <Why />
      <Questions />
      <Close />
    </main>
  );
}
