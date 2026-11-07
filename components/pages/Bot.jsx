'use client';
// Signature: The org chart is the hero: a person mentions a bot, a packet runs down the chart to that bot and across to the teammate who verifies it, while the thread fills in beneath, ten channels in turn
// Beyond: How many bots do you need? Slide 1 to 10 and the smallest plan that includes that many resident bots lights up, from Hanzo's plan list
/* Hanzo Bot, v2 (Archetype A, launch: the org chart is the product).
   V2: 8/10 centred display headline over a full-width live org chart on Stage; ten workflows open as thread drawers; five pinned chapters with live product UI; one dark room to install; the plan slider as the pricing hero
   Motion: signature = the live org chart (packets route person → bot → verifier, the thread fills beneath). Supporting: Stage
   settle, pinned chapters with clip wipes (components/v2/AppScenes), line-masked headline. Accent: tangerine, from the
   mention pill. Bot faces are Hanzo's memoji, with a drawn face beneath in case a picture can't load. Every word, figure and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Copy, Magnetic } from '../ui';
import { A, Go, More, Faq, Tick } from '../kit';
import Lines from '../v2/AppLines';
import Stage from '../v2/AppStage';
import Scenes from '../v2/AppScenes';
import Sheet from '../v2/AppSheet';
import { WORKFLOWS, TOOLS } from './Bot.data';
import '../v2/AppType.css';
import './Bot.css';

const CREW = [['dev', 'Dev', 'Software'], ['qa', 'Qa', 'Quality'], ['cyber', 'Cyber', 'Security'], ['des', 'Des', 'Designer'], ['mark', 'Mark', 'Marketing'], ['su', 'Su', 'Support'], ['doc', 'Doc', 'Docs'], ['opera', 'Opera', 'Operations'], ['sci', 'Sci', 'Research'], ['data', 'Data', 'Analytics'], ['sal', 'Sal', 'Sales'], ['fin', 'Fin', 'Finance'], ['law', 'Law', 'Legal']];

/* A picture that steps aside if it cannot load (the drawn version underneath stays). */
function Pic({ src, alt = '', className = '' }) {
  const ref = useRef(null);
  const [bad, setBad] = useState(false);
  useEffect(() => { const i = ref.current; if (i && i.complete && !i.naturalWidth) setBad(true); }, [src]);
  return bad ? null : <img ref={ref} src={src} alt={alt} className={className} loading="lazy" onError={() => setBad(true)} />;
}

/* A bot's face: Hanzo's memoji for that bot, over a little drawn screen with two eyes that shows if the picture can't load. */
const memoji = (id) => `/memoji/${id === 'qa' ? 'sci' : id}.svg`;
function Face({ k = '', size, id }) {
  return <span className={'bt-face ' + k + (id ? ' has-id' : '')} style={size ? { '--s': size + 'px' } : undefined} aria-hidden="true"><i /><i />{id && <Pic src={memoji(id)} className="bt-face-img" />}</span>;
}

/* ---------- the signature: the org chart ---------- */
const BEAT = [650, 1200, 1500, 1050, 500]; // ms from beat b to b + 1: ask, run to the bot, it answers, hand to the verifier, verified
const HOLD = 3700;
const CYCLE = BEAT.reduce((a, b) => a + b, 0) + HOLD;
const R = 14;

function route(pts) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
    const r = Math.min(R, Math.hypot(x1 - x0, y1 - y0) / 2, Math.hypot(x2 - x1, y2 - y1) / 2);
    d += ` L${x1 - Math.sign(x1 - x0) * r} ${y1 - Math.sign(y1 - y0) * r} Q${x1} ${y1} ${x1 + Math.sign(x2 - x1) * r} ${y1 + Math.sign(y2 - y1) * r}`;
  }
  const l = pts[pts.length - 1];
  return d + ` L${l[0]} ${l[1]}`;
}
const off = (el, root) => { let x = 0, y = 0, e = el; while (e && e !== root) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; } return { x, y, w: el.offsetWidth, h: el.offsetHeight }; };

function Packet({ pts, dur }) {
  const len = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const tot = len.reduce((a, b) => a + b, 0) || 1;
  let s = 0;
  const times = [0, ...len.map((l) => (s += l) / tot)];
  return (
    <motion.span className="bt-pk" aria-hidden="true" initial={{ x: pts[0][0], y: pts[0][1], opacity: 0 }}
      animate={{ x: pts.map((p) => p[0]), y: pts.map((p) => p[1]), opacity: pts.map((_, i) => (i === pts.length - 1 ? 0.2 : 1)) }}
      transition={{ duration: dur, times, ease: 'linear' }} />
  );
}

function Org() {
  const [at, setAt] = useState(0);
  const [b, setB] = useState(5); // the server and reduced motion show the finished handoff
  const [mine, setMine] = useState(false);
  const [g, setG] = useState(null);
  const box = useRef(null), chart = useRef(null), ask = useRef(null), row = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const live = seen && !calm;
  const w = WORKFLOWS[at];
  const pi = CREW.findIndex((c) => c[0] === w.primary.id), vi = CREW.findIndex((c) => c[0] === w.verifier.id);

  useEffect(() => { if (!calm) setB(0); }, [calm]);
  useEffect(() => {
    if (!live) return;
    if (b < 5) { const t = setTimeout(() => setB(b + 1), BEAT[b]); return () => clearTimeout(t); }
    if (mine) return;
    const t = setTimeout(() => { setAt((a) => (a + 1) % WORKFLOWS.length); setB(0); }, HOLD);
    return () => clearTimeout(t);
  }, [b, live, mine]);
  // measure the chart in its own (unscaled) pixels, so the wires stay true while the Stage settles
  useEffect(() => {
    const c = chart.current; if (!c) return;
    const m = () => {
      if (innerWidth <= 900) return setG(null);
      const a = off(ask.current, c);
      const ns = [...row.current.children].map((n) => { const f = off(n.querySelector('.bt-face'), c), q = off(n, c); return { x: f.x + f.w / 2, top: f.y, bot: q.y + q.h }; });
      setG({ W: c.offsetWidth, H: c.offsetHeight, hx: a.x + a.w / 2, hy: a.y + a.h + 6, ns });
    };
    m();
    const ro = new ResizeObserver(m); ro.observe(c);
    return () => ro.disconnect();
  }, [at]);

  const pick = (i) => { setAt(i); setB(calm ? 5 : 0); setMine(true); };
  const key = (e, i) => {
    const n = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!n) return;
    const j = (i + n + WORKFLOWS.length) % WORKFLOWS.length; pick(j);
    e.currentTarget.parentElement.children[j]?.querySelector('button')?.focus();
  };

  let wires = null, r1 = null, r2 = null;
  if (g) {
    const bus = g.ns[0].top - 36, P = g.ns[pi], V = g.ns[vi];
    const lane = Math.max(P.bot, V.bot) + 20;
    r1 = [[g.hx, g.hy], [g.hx, bus], [P.x, bus], [P.x, P.top - 4]];
    r2 = [[P.x, P.bot + 4], [P.x, lane], [V.x, lane], [V.x, V.bot + 4]];
    wires = `M${g.hx} ${g.hy} L${g.hx} ${bus} M${g.ns[0].x} ${bus} L${g.ns[12].x} ${bus} ` + g.ns.map((n) => `M${n.x} ${bus} L${n.x} ${n.top - 4}`).join(' ');
  }
  return (
    <div className="bt-org av-obj" ref={box} role="group" aria-label="Ten workflows on Hanzo's org chart of bots">
      <div className="bt-org-bar">
        <span className="bt-ws"><b>Hanzo</b><span className="bt-ch-name"># <span>{w.channel}</span></span><span className="bt-cat">{w.category}</span></span>
        <span className="bt-uc x-mono"><span className="bt-chs">10 channels</span><i className={live ? 'on' : ''} />USE CASE {w.num}</span>
      </div>
      <div className="bt-chart" ref={chart}>
        {g && (
          <svg className="bt-wires" width={g.W} height={g.H} viewBox={`0 0 ${g.W} ${g.H}`} aria-hidden="true">
            <path d={wires} className="bt-w" />
            <path d={route(r1)} className={'bt-w-on' + (b >= 1 ? ' on' : '')} />
            <path d={route(r2)} className={'bt-w-on v' + (b >= 3 ? ' on' : '')} />
          </svg>
        )}
        <motion.div key={'ask' + at} className="bt-ask" ref={ask} initial={calm ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
          <p className="bt-who"><span className="bt-ini">{w.human.initials}</span><b>{w.human.name}</b><span>{w.human.time}</span></p>
          <p className="bt-say">{w.human.before}<b className="bt-at">{w.human.mention}</b>{w.human.after}</p>
        </motion.div>
        <p className="bt-crew-k x-mono">ACTIVE CREW</p>
        <ol className="bt-row" ref={row}>
          {CREW.map(([id, n, role], i) => {
            const k = i === pi ? 'p' : i === vi ? 'v' : '';
            const lit = (k === 'p' && b >= 2) || (k === 'v' && b >= 4);
            return (
              <li key={id} className={(k ? 'is-' + k : '') + (lit ? ' lit' : '') + (k === 'p' && b < 2 ? ' called' : '')}>
                <Face k={lit ? k : ''} id={id} />
                <b>{n}</b>
                <span>{role}</span>
                {k === 'v' && <em className={'bt-ok x-mono' + (b >= 4 ? ' on' : '') + (i < 2 ? ' s' : i > 10 ? ' e' : '')}>{w.verifier.badge}</em>}
              </li>
            );
          })}
        </ol>
        {g && live && b === 1 && <Packet key={'a' + at} pts={r1} dur={1.1} />}
        {g && live && b === 3 && <Packet key={'b' + at} pts={r2} dur={0.95} />}
      </div>
      <div className="bt-log">
        <div className={'bt-msg' + (b >= 2 ? ' on' : '')}>
          <Face k="p" size={36} id={w.primary.id} />
          <div>
            <p className="bt-meta"><b>{w.primary.name}</b> <span>{w.primary.role} · {w.primary.time}</span></p>
            <p>{w.primary.reply}</p>
            <p className="bt-art x-mono">{w.primary.codeOrArtifact}</p>
          </div>
        </div>
        <div className={'bt-msg' + (b >= 4 ? ' on' : '')}>
          <Face k="v" size={36} id={w.verifier.id} />
          <div>
            <p className="bt-meta"><b>{w.verifier.name}</b> <span>{w.verifier.role} · {w.verifier.time}</span> <span className="bt-badge x-mono">{w.verifier.badge}</span></p>
            <p>{w.verifier.reply}</p>
          </div>
        </div>
      </div>
      <ol className="bt-tabs" role="tablist" aria-label="Channels">
        {WORKFLOWS.map((x, i) => (
          <li key={x.id}>
            <button type="button" role="tab" aria-selected={i === at} tabIndex={i === at ? 0 : -1} onClick={() => pick(i)} onKeyDown={(e) => key(e, i)}>
              {i === at && <motion.span layoutId="bt-tab" className="bt-tab-bg" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
              <span className="x-mono bt-tab-n">{x.num}</span><span className="bt-tab-c"># {x.channel}</span>
              {i === at && !mine && !calm && <i key={'t' + at} className={'bt-tab-t' + (live ? '' : ' paused')} style={{ animationDuration: CYCLE + 'ms' }} aria-hidden="true" />}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

const PTS = ['Each bot has its own computer: a browser, a terminal and your apps', 'It signs in to your tools once and works the way you do', 'Bots hand work to each other and ask you only when it matters', 'Routines run on a schedule and stop for your yes'];

function Hero() {
  return (
    <section className="bt-hero" aria-labelledby="bt-h1">
      <div className="av-wrap">
        <div className="bt-top">
          <p className="av-kick"><b>Hanzo Bot</b> · AI teammates</p>
          <Lines as="h1" id="bt-h1" className="av-display bt-h1" lines={['Teammates you can', 'hand real work to.']} now delay={0.1} />
          <p className="av-lede bt-lede">Give a bot a job. It has its own computer, signs in to your tools the way you do, and comes back when the work is done. On your machine, in our cloud, or both.</p>
          <div className="av-acts bt-acts">
            <Magnetic strength={0.25}><Go to="https://hanzo.bot" solid>Try Hanzo</Go></Magnetic>
            <i hidden data-thumb="Try Hanzo" data-href="https://hanzo.bot" />
            <a href="#install" className="x-btn">Install on your Mac</a>
            <A to="/contact-sales" className="bt-link">Contact sales</A>
          </div>
        </div>
        <Stage className="bt-stage" data-morph-target="">
          <Org />
        </Stage>
        <div className="bt-pts">
          <ol className="av-grid">
            {PTS.map((t, i) => <li key={t}><span className="x-mono av-num">{String(i + 1).padStart(2, '0')}</span><p>{t}</p></li>)}
          </ol>
          <p className="bt-note">Open source. Run it on your own machine if you want to — your keys and your data stay with you.</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- the ten workflows: an index; each row opens its whole thread in a drawer ---------- */
function Case({ w }) {
  return (
    <div className="bt-case">
      <p className="bt-case-k x-mono"><span>#{w.channel} · {w.category}</span><span>USE CASE {w.num}</span></p>
      <p className="bt-case-sum">{w.summary}</p>
      <div className="bt-thread">
        <div className="bt-line"><span className="bt-ini">{w.human.initials}</span><div><p className="bt-meta"><b>{w.human.name}</b> <span>{w.human.time}</span></p><p>{w.human.before}<b className="bt-at">{w.human.mention}</b>{w.human.after}</p></div></div>
        <div className="bt-line"><Face k="p" size={36} id={w.primary.id} /><div><p className="bt-meta"><b>{w.primary.name}</b> <span>{w.primary.role} · {w.primary.time}</span></p><p>{w.primary.reply}</p><p className="bt-art x-mono">{w.primary.codeOrArtifact}</p></div></div>
        <div className="bt-line"><Face k="v" size={36} id={w.verifier.id} /><div><p className="bt-meta"><b>{w.verifier.name}</b> <span>{w.verifier.role} · {w.verifier.time}</span></p><span className="bt-badge x-mono">{w.verifier.badge}</span><p>{w.verifier.reply}</p></div></div>
      </div>
      <p className="bt-case-h x-mono">AUTOMATED WORKFLOW <span>{w.steps.length} / {w.steps.length} steps complete</span></p>
      <ol className="bt-steps">{w.steps.map((s, i) => <li key={s}><Tick size={18} delay={0.15 + i * 0.12} />{s}</li>)}</ol>
      <p className="bt-case-h x-mono">TOOLS &amp; SANDBOXES USED</p>
      <ul className="bt-chips">{w.tools.map((t) => <li key={t}>{t}</li>)}</ul>
      <p className="bt-run">Run <b className="x-mono"># <span>{w.channel}</span></b> with <b>{w.primary.name}</b> &amp; <b>{w.verifier.name}</b> in your workspace:</p>
      <div className="bt-run-links">
        <A to="https://hanzo.bot" className="x-btn solid">Open Hanzo Bot</A>
        <A to="https://hanzo.team" className="x-btn">Open Hanzo Team</A>
      </div>
    </div>
  );
}

function Cases() {
  return (
    <section className="av-sec bt-cases" id="use-cases">
      <div className="av-wrap">
        <div className="av-grid bt-cases-top">
          <div className="bt-cases-l">
            <p className="av-kick"><b>10 KILLER WORKFLOWS</b></p>
            <h2 className="av-head bt-cases-h">Ten everyday workflows your team hands off in a single mention.</h2>
          </div>
          <div className="bt-cases-r">
            <p className="av-body">A human opens a channel or posts a quick explanation, mentions the right teammate, and gets finished work back — verified end-to-end by a second specialist before you merge or send.</p>
            <p className="bt-dom x-mono">Engineering · Security · Launch · Support · Ops · Research · Sales · Finance · Legal · Growth</p>
          </div>
        </div>
        <ul className="bt-idx">
          {WORKFLOWS.map((w) => (
            <li key={w.id}>
              <Sheet trigger="bt-idx-row" title={w.title}
                label={<><span className="bt-idx-n x-mono av-num">{w.num}</span><span className="bt-idx-c x-mono"># {w.channel}</span><span className="bt-idx-t">{w.title}</span><span className="bt-idx-p"><Face k="p" size={28} id={w.primary.id} /><Face k="v" size={28} id={w.verifier.id} /><span className="x-mono">@{w.primary.name} → @{w.verifier.name}</span></span></>}>
                <Case w={w} />
              </Sheet>
            </li>
          ))}
        </ul>
        <div className="bt-idx-foot">
          <A to="/team" className="bt-link">Learn more about Team →</A>
          <A to="/bot" className="bt-link">Learn more about Bot →</A>
        </div>
      </div>
    </section>
  );
}

/* ---------- five chapters, each with its own live product UI ---------- */
function Sandbox({ on }) {
  return (
    <div className={'bt-vis bt-box' + (on ? ' on' : '')} aria-hidden="true">
      <div className="bt-win">
        <div className="bt-win-bar"><i /><i /><i /><span className="x-mono">sandbox</span><Face k="p" size={26} /></div>
        <div className="bt-win-body">
          <div className="bt-br">
            <span className="bt-url x-mono">hanzo.bot</span>
            <span className="bt-sk w70" /><span className="bt-sk w45" /><span className="bt-sk card" /><span className="bt-sk w60" />
            <span className="bt-cur" />
          </div>
          <div className="bt-term x-mono">
            <span className="bt-tl"><b>$</b> hanzo bot runs list</span>
            <span className="bt-sk w80" /><span className="bt-sk w55" /><span className="bt-sk w65" />
            <span className="bt-tl"><b>$</b><i className="bt-caret" /></span>
          </div>
        </div>
        <div className="bt-dock">{['Browser', 'Terminal', 'Apps'].map((t, i) => <span key={t} style={{ '--i': i }}><i />{t}</span>)}</div>
      </div>
    </div>
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

function Board({ on }) {
  return (
    <div className={'bt-vis bt-board' + (on ? ' on' : '')} aria-hidden="true">
      <ul>
        {JOBS.map(([t], i) => (
          <li key={t} style={{ '--i': i }}><Face size={40} /><b>{t}</b><em className="x-mono">Working</em></li>
        ))}
      </ul>
    </div>
  );
}

function Msg({ on, children, cls = '', face }) {
  return (
    <div className={'bt-tm ' + cls + (on ? ' on' : '')} aria-hidden={!on}>
      {face && <Face k={face === 'des' ? 'v' : 'p'} size={30} id={face} />}
      <div>{children}</div>
    </div>
  );
}

/* Hanzo's sample thread: Mark asks Des for a header, then asks you before it ships. */
function Thread({ on }) {
  const calm = useReducedMotion();
  const [b, setB] = useState(7);
  const [pick, setPick] = useState(null);
  useEffect(() => { if (on && !calm) { setB(0); setPick(null); } }, [on, calm]);
  useEffect(() => {
    if (!on || calm || b >= 7) return;
    const t = setTimeout(() => setB((v) => v + 1), [700, 1300, 1300, 1400, 1500, 1600, 1800][b]);
    return () => clearTimeout(t);
  }, [b, on, calm]);
  useEffect(() => { if (b === 7 && !pick) setPick('yes'); }, [b, pick]);
  const at = (k) => b > k;
  const desOn = b === 3;
  return (
    <div className="bt-vis bt-app">
      <aside className="bt-side">
        <div className="bt-search">Search</div>
        <p className="bt-side-h">Teammates <span className="x-mono">{desOn ? '2 working' : '1 working'}</span></p>
        <ul className="bt-mates">
          {[['mark', 'Mark', true], ['des', 'Des', desOn]].map(([id, n, w]) => (
            <li key={id} className={w ? 'on' : ''}><Face k={w ? (id === 'des' ? 'v' : 'p') : ''} size={30} id={id} /><span><b>{n}</b><span>{w ? 'Working' : ' '}</span></span></li>
          ))}
        </ul>
      </aside>
      <div className="bt-main">
        <div className="bt-main-h"><Face k="p" size={26} id="mark" /><b>Mark · Marketing</b><span className="bt-plus x-mono">+<span>1</span></span></div>
        <div className="bt-tlog">
          <Msg on={at(0)} cls="you"><p>Write the launch post for crypto top-ups, and ask Des for a header.</p></Msg>
          <Msg on={at(1)} face="mark"><p>Drafted. Agents can now top up in USDC or USDT over the API and pay as they go.</p></Msg>
          <Msg on={at(2)} cls="sys"><p>Messaged Des · Designer</p></Msg>
          <Msg on={at(3)} cls="from"><p className="bt-from">Message from Des · Designer</p><div className="bt-quote"><b>Des · Designer</b><p>Top up in USDC or USDT.</p><span className="bt-file x-mono">header.mp4</span></div></Msg>
          <Msg on={at(4)} face="mark"><p>Des sent the header. Here is /pricing with the new line.</p><div className="bt-card"><span className="x-mono">hanzo.ai/pricing</span><p>Agents can top up in USDC or USDT over the API.</p><span className="bt-file x-mono">pricing.png</span></div></Msg>
          <Msg on={at(5)} cls="ask">
            <span className="bt-answered x-mono" style={{ opacity: pick ? 1 : 0 }}>Answered</span>
            <p>Should /pricing include that sentence about crypto top-ups?</p>
            <div className="bt-yn">
              <button type="button" className={pick === 'yes' ? 'on' : ''} onClick={() => { setPick('yes'); if (b < 7) setB(7); }} tabIndex={at(5) ? 0 : -1}>Yes, add it</button>
              <button type="button" className={pick === 'no' ? 'on' : ''} onClick={() => setPick('no')} tabIndex={at(5) ? 0 : -1}>Not yet</button>
            </div>
          </Msg>
          <Msg on={at(5) && pick !== 'no' && (b >= 7 || pick === 'yes')} face="mark"><p>Added. I will post a short update in #hanzo-marketing every weekday.</p></Msg>
        </div>
      </div>
    </div>
  );
}

function Routines({ on }) {
  const [sw, setSw] = useState([true, true]);
  const list = [['Daily #hanzo-marketing update', 'Weekdays around 9:00 AM'], ['Answer #hanzo-marketing mentions', 'When @mentioned']];
  return (
    <div className={'bt-vis bt-rt' + (on ? ' on' : '')}>
      <div className="bt-rt-card">
        <div className="bt-rt-top"><Face k="p" size={40} id="mark" /><b>Mark · Marketing</b></div>
        <div className="bt-rt-tabs" aria-hidden="true"><span>Details</span><span>Library</span><span>Computer</span><span className="on">Routines</span></div>
        <ul>
          {list.map(([t, wh], i) => (
            <li key={t} style={{ '--i': i }}>
              <span><b>{t}</b><span className="x-mono">{wh}</span></span>
              <button type="button" role="switch" aria-checked={sw[i]} aria-label={t} className={'bt-sw' + (sw[i] ? ' on' : '')} onClick={() => setSw(sw.map((v, k) => (k === i ? !v : v)))}><i /></button>
            </li>
          ))}
        </ul>
        <span className="bt-rt-new">+ New routine</span>
      </div>
    </div>
  );
}

function Memory({ on }) {
  return (
    <div className={'bt-vis bt-mem' + (on ? ' on' : '')} aria-hidden="true">
      <div className="bt-mem-file">
        <div className="bt-mem-top x-mono"><span className="on">MEMORY.md</span><span>SKILLS.md</span></div>
        <div className="bt-mem-body">
          {[78, 52, 66, 40, 72, 58, 34, 62, 48, 70].map((wd, i) => <span key={i} className="bt-mem-l" style={{ '--w': wd + '%', '--i': i }}><i>{String(i + 1).padStart(2, ' ')}</i><b /></span>)}
          <span className="bt-mem-find" />
        </div>
      </div>
    </div>
  );
}

const Items = ({ lede, items, link, to }) => (
  <div className="bt-chb">
    {lede && <p className="av-body bt-chb-lede">{lede}</p>}
    {items && <dl className="bt-dl">{items.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}</dl>}
    {link && <More to={to}>{link}</More>}
  </div>
);

const CHAPTERS = [
  { kick: 'What a bot is', title: 'A teammate with its own computer', body: <Items lede="Not a chat window. A bot has a computer of its own and works while you do something else." items={[['Its own computer', 'Each bot runs in its own sandbox with a browser, a terminal and your apps. Nothing it does touches your machine unless you let it.'], ['Works where you work', 'Sign it in once. It uses the same tools and websites you do, including the ones that are hard to automate.'], ['Comes back when it is done', 'Give it a task and go do something else. It returns with finished work and asks only when it needs your say.']]} />, visual: (on) => <Sandbox on={on} /> },
  { kick: 'Give each bot a job', title: 'One bot per job', body: <Items items={JOBS} />, visual: (on) => <Board on={on} /> },
  { kick: 'Work with many at once', title: 'Bots that hand work to each other', body: <Items items={[['One gateway, many bots', 'Each bot has its own workspace, sign-ins and history, and each message goes to the bot it is meant for.'], ['Sub-agents', 'A bot can start background runs that work in parallel and post what they found back in the chat that asked.'], ['Bots message bots', 'One bot can read another’s session and send it a message, so a handoff needs no copy and paste.']]} link="How multi-agent works" to="https://docs.hanzo.bot/docs/concepts/multi-agent" />, visual: (on) => <Thread on={on} /> },
  { kick: 'Show it how it is done', title: 'Teach it a routine once', body: <Items items={[['Skills', 'Write the steps in a plain Markdown skill, and the bot uses it whenever the job comes up.'], ['On a schedule', 'Every morning, or in twenty minutes. Scheduled jobs survive a restart and can post the result to a chat.'], ['Your say at each step', 'A multi-step routine can stop at the steps you mark and wait for your yes before it goes on.']]} link="Skills in the docs" to="https://docs.hanzo.bot/docs/tools/skills" />, visual: (on) => <Routines on={on} /> },
  { kick: 'Gets better as it goes', title: 'It remembers what it learns', body: <Items items={[['Memory is files', 'Decisions, preferences and running notes go into Markdown files in its workspace, not into the model.'], ['It looks things up', 'It searches those notes when it needs them, so what you told it last week still counts.'], ['Yours to read and fix', 'Open the files, correct them or delete them. The next session starts from what you left.']]} link="How memory works" to="https://docs.hanzo.bot/docs/concepts/memory" />, visual: (on) => <Memory on={on} /> },
];

/* ---------- the tools it signs in to: twenty kinds, two hundred names ---------- */
function Tools() {
  const [cat, setCat] = useState(0);
  return (
    <section className="av-sec bt-tools">
      <div className="av-wrap av-grid">
        <div className="bt-tools-l">
          <p className="av-kick">Works where you work</p>
          <h2 className="av-head">Sign it in to the tools you use</h2>
          <p className="av-body">You log in once in the bot&apos;s own browser. It keeps the session and works in the same tools and sites you do.</p>
          <p className="bt-200 av-num" aria-hidden="true">200</p>
          <p className="bt-fine">200 tools. Each mark belongs to its owner and is shown to say what Hanzo connects to — not to imply any partnership or endorsement.</p>
        </div>
        <div className="bt-tools-r">
          <div className="bt-cats" role="tablist" aria-label="Kinds of tools">
            {TOOLS.map(([c], i) => (
              <button key={c} type="button" role="tab" aria-selected={i === cat} aria-controls={'bt-tc' + i} id={'bt-tt' + i} onClick={() => setCat(i)}>{c}</button>
            ))}
          </div>
          {TOOLS.map(([c, list], i) => (
            <ul key={c} id={'bt-tc' + i} role="tabpanel" aria-labelledby={'bt-tt' + i} className="bt-names" hidden={i !== cat}>
              {list.map(([f, n]) => <li key={f}><span className="bt-logo"><Pic src={`/connectors/${f}.png`} alt={n} /></span><span>{n}</span><i aria-hidden="true">✓</i></li>)}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- where you talk to it ---------- */
const CHANNELS = ['Desktop', 'iPhone', 'WhatsApp', 'Telegram', 'Slack', 'Discord', 'iMessage', 'Signal', 'Web chat'];

function Anywhere() {
  return (
    <section className="av-sec tight bt-any">
      <div className="av-wrap">
        <p className="av-kick">Talk to it anywhere</p>
        <h2 className="av-head bt-any-h">Message your bots where you already are</h2>
        <ul className="bt-any-list">{CHANNELS.map((c) => <li key={c}>{c}</li>)}</ul>
        <A to="https://github.com/hanzoai/bot/blob/main/docs/install/migrate-from-openclaw.md" className="bt-link">Coming from OpenClaw? One command moves your install →</A>
      </div>
    </section>
  );
}

/* ---------- the dark room: three steps, two commands, one prompt ---------- */
const STEPS3 = [['Name it and give it a job', 'Say what you want done, in plain words.'], ['Sign it in to your tools', 'Once. It keeps the access it needs and nothing more.'], ['Let it work', 'It comes back when it is done, or when it needs you.']];
const PASTE = 'Read https://hanzo.ai/skill.md and use Hanzo Bot in my project. Start with: hanzo bot runs list';

function Install() {
  return (
    <section className="av-sec av-dark bt-dark" id="install" data-room="dark">
      <div className="av-wrap">
        <div className="av-grid bt-start">
          <div className="bt-start-l">
            <p className="av-kick">How it starts</p>
            <h2 className="av-head">Three steps</h2>
          </div>
          <ol className="bt-start-r">
            {STEPS3.map(([t, d], i) => <li key={t}><span className="x-mono av-num">{String(i + 1).padStart(2, '0')}</span><b>{t}</b><span>{d}</span></li>)}
          </ol>
        </div>
        <div className="av-grid bt-inst">
          <div className="bt-inst-l">
            <p className="av-kick">Install</p>
            <h2 className="av-head">On your Mac in two commands</h2>
            <p className="av-body">Node 22 or newer, on macOS or Linux. The second command walks you through your model, channels and skills, and keeps the gateway running in the background.</p>
            <div className="bt-inst-links"><A to="https://docs.hanzo.bot/docs/install" className="bt-link">Install guide →</A><A to="https://github.com/hanzoai/bot" className="bt-link">View on GitHub →</A></div>
          </div>
          <div className="bt-term-big">
            <div className="bt-term-bar"><i /><i /><i /><span className="x-mono">terminal</span><Copy text={'npm install -g @hanzo/bot\nhanzo-bot onboard --install-daemon'} /></div>
            <pre className="x-mono"><span className="bt-ps">$ </span>npm install -g @hanzo/bot{'\n'}<span className="bt-ps">$ </span>hanzo-bot onboard --install-daemon{'\n'}<span className="bt-ps">$ </span><i className="bt-caret" /></pre>
          </div>
        </div>
        <div className="bt-paste">
          <div className="bt-paste-l">
            <p className="av-title">Paste and ship</p>
            <p className="av-body">Paste this into any agent. It reads the skill manifest and calls Bot from there.</p>
          </div>
          <div className="bt-prompt">
            <p className="bt-prompt-k x-mono"><span>Agent prompt</span><span className="bt-api"><b>api</b> /v1/bot</span></p>
            <code className="x-mono">{PASTE}</code>
            <Copy text={PASTE} label="Copy the agent prompt" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- pricing, with the bots-you-need slider as its hero ---------- */
const PERKS = ['Early access to new models and features', 'Train custom models on your data', 'Hanzo Engine to run models on your own hardware', 'Dedicated support'];
const PLANS = [
  ['Pro', '$15', 1, ['3x more usage than Go', '3x higher limits than Go'], 'pro-2x'],
  ['Dev', '$45', 2, ['5x more usage than Go', '5x higher limits than Go'], 'dev-5x'],
  ['Max', '$95', 5, ['15x more usage than Go', '15x higher limits than Go'], 'max-10x'],
  ['Ultra', '$195', 10, ['Highest included usage across every model', 'Continuous usage with no window resets', 'Usage beyond what is included is paid from your prepaid balance at list price'], 'ultra'],
];
const planFor = (n) => PLANS.findIndex((p) => p[2] >= n);

function Pricing() {
  const [n, setN] = useState(1);
  const k = planFor(n);
  return (
    <section className="av-sec bt-price" id="pricing">
      <div className="av-wrap av-grid">
        <div className="bt-price-l">
          <p className="av-kick">Pricing</p>
          <h2 className="av-head">Included in plans from $15</h2>
          <p className="av-body">Each plan below includes resident cloud bots. Or run Hanzo Bot free on your own machine.</p>
          <div className="bt-need">
            <label htmlFor="bt-n">How many resident bots do you need?</label>
            <div className="bt-need-fig" aria-hidden="true">
              <span className="av-num">{n}</span>
              <span className="bt-need-faces">{Array.from({ length: 10 }, (_, i) => <Face key={i} k={i < n ? 'p' : ''} size={22} />)}</span>
            </div>
            <input id="bt-n" type="range" min="1" max="10" step="1" value={n} onChange={(e) => setN(+e.target.value)} style={{ '--f': (n - 1) / 9 }} aria-valuetext={`${n} ${n === 1 ? 'bot' : 'bots'}: ${PLANS[k][0]}`} />
            <output htmlFor="bt-n" className="x-mono"><b>{n}</b> {n === 1 ? 'bot' : 'bots'} → <b>{PLANS[k][0]}</b>, {PLANS[k][1]} / month</output>
          </div>
        </div>
        <ul className="bt-plans">
          {PLANS.map(([name, price, bots, lines, plan], i) => (
            <li key={name} className={i === k ? 'pick' : ''}>
              {i === k && <motion.span layoutId="bt-plan" className="bt-plan-bg" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
              <div className="bt-plan-top">
                <h3>{name}</h3>
                <p className="bt-plan-p"><b className="av-num">{price}</b> <span>/</span> <span>month</span></p>
                <span className="bt-plan-n x-mono">{bots} × <Face k={i === k ? 'p' : ''} size={18} /></span>
                <A to={`/pay/confirm/card?plan=${plan}&returnUrl=https%3A%2F%2Fhanzo.ai%2Fchat`} className={'x-btn' + (i === k ? ' solid' : '')}>Get {name}</A>
              </div>
              <ul className="bt-plan-l">
                {lines.map((l) => <li key={l}>{l}</li>)}
                <li className="bt-bots">Hanzo Bot: {bots} {bots === 1 ? 'bot' : 'bots'} of your own</li>
                {PERKS.map((l) => <li key={l}>{l}</li>)}
              </ul>
            </li>
          ))}
        </ul>
        <p className="bt-free">Every plan can run Hanzo Bot on your own Mac or Linux machine, 100% free and open source.</p>
      </div>
    </section>
  );
}

/* ---------- more than one bot, and why it is priced this way (a drawer) ---------- */
const FEATS = [
  ['Dedicated Cloud Sandbox', 'Each extra bot runs in its own isolated Linux environment with dedicated memory and compute.'],
  ['Isolated Browser & Shell', 'Independent Chromium browser sessions and private bash terminals with separate logins and cookies.'],
  ['Independent Markdown Memory', 'Private workspace memory files (MEMORY.md) so multiple bots never pollute each other’s context.'],
  ['Parallel Schedules & Cron', 'Run background jobs simultaneously across multiple bots without hitting single-bot queues.'],
];
const WHY = [
  ['Compute Floor', 'Why a $100/mo entry floor?', 'Not a chat window. A resident cloud computer.', 'Standard chat models terminate compute as soon as tokens finish streaming. A resident Hanzo Bot lives in an active cloud sandbox with its own Chromium browser, bash terminal, isolated filesystem, and scheduled cron jobs. The $100/month floor covers continuous cloud sandboxing and dedicated container resources.'],
  ['Token Economics', 'Routine work at 1/5th the token cost', 'Intelligent routing through Enso & Sol 6.1.', 'Up to 90% of a resident bot’s daily work consists of triaging inboxes, summarizing documents, parsing receipts, and scraping pages. Rather than burning expensive frontier reasoning on routine tasks, Hanzo Bot executes routine loops on Enso & Sol 6.1 at ~1/5th the token price, leaving your monthly AI allowance intact for the tasks that need it.'],
  ['Frontier Autonomy', 'Zen Ultra for complex reasoning ($800/mo)', 'Extended capacity for non-stop autonomous loops.', 'When your bot needs to perform deep multi-hour research, autonomous software engineering, or multi-step strategic analysis, the Ultra tier ($800/mo) includes Zen Ultra and Astra Ultra frontier models with unlimited capacity, no hourly rate caps, continuous execution as long as you have funds, and an automatic 20% discount on all usage exceeding $800.'],
  ['Auditable Memory', 'Plain Markdown files you can inspect & edit', 'No black-box fine-tuning or opaque vector locks.', 'Hanzo Bot records what it learns in human-readable Markdown files in its workspace (`MEMORY.md`, `SKILLS.md`). You can open them, audit them, version-control them in Git, or delete them anytime. The bot begins every session from what you leave.'],
];

function Fleet() {
  return (
    <section className="av-sec tight bt-fleet" id="additional-bots">
      <div className="av-wrap av-grid">
        <div className="bt-fleet-l">
          <p className="av-kick">Included with your plan</p>
          <h2 className="av-head">Need more than one resident bot?</h2>
          <p className="av-body">Each plan includes the resident cloud bots it lists. For more bots, choose a plan that includes more.</p>
          <div className="av-acts">
            <Go to="/pricing" solid>See the plans</Go>
            <Sheet label="Why Hanzo Bot is built and priced this way" kick="Agent Architecture & Pricing Model" title="Why Hanzo Bot is built and priced this way">
              <div className="bt-why" id="pricing-model">
                <p className="bt-why-lede">Designed around the real economics of autonomous resident agents: dedicated sandboxes, cost-efficient model tiering, and transparent, auditable memory.</p>
                {WHY.map(([k, t, s, d]) => (
                  <div key={k} className="bt-why-i">
                    <p className="av-kick"><b>{k}</b></p>
                    <h3>{t}</h3>
                    <p className="bt-why-s">{s}</p>
                    <p>{d}</p>
                  </div>
                ))}
                <div className="bt-own">
                  <span className="bt-mit x-mono">MIT Open Source</span>
                  <h3>Prefer running on your own machine? It’s 100% free.</h3>
                  <p>Hanzo Bot is open source under the MIT license. You can run the exact same gateway, sandboxes, and skills on your own Mac or Linux machine with your own API keys at zero subscription cost.</p>
                </div>
              </div>
            </Sheet>
          </div>
        </div>
        <ul className="bt-feats">
          {FEATS.map(([t, d], i) => (
            <li key={t}><span className="bt-feat-f" aria-hidden="true">{Array.from({ length: i + 1 }, (_, j) => <Face key={j} k={j === i ? 'p' : ''} size={24} />)}</span><h3>{t}</h3><p>{d}</p></li>
          ))}
        </ul>
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
    <section className="av-sec bt-qa" id="faq">
      <div className="av-wrap av-grid">
        <div className="bt-qa-l">
          <p className="av-kick">FAQ</p>
          <h2 className="av-display s">Questions</h2>
        </div>
        <div className="bt-qa-r"><Faq items={QA} /></div>
      </div>
    </section>
  );
}

function Close() {
  return (
    <section className="av-sec bt-close">
      <div className="av-wrap">
        <div className="bt-meet">
          <span className="bt-meet-f" aria-hidden="true">{CREW.map(([id], i) => <Face key={id} k={i === 6 ? 'p' : ''} size={44} />)}</span>
          <h2 className="av-display m">Meet your first bot</h2>
          <p className="av-lede">A teammate you can trust with real work.</p>
          <div className="av-acts"><Go to="/login" solid>Try Hanzo</Go><Go to="/contact-sales">Contact sales</Go></div>
        </div>
        <div className="av-grid bt-tail">
          <div className="bt-get">
            <p className="av-title">Get Bot</p>
            <p className="av-body">Connect your AI agents to every messaging channel</p>
            <dl className="bt-meta2"><div><dt>License:</dt><dd>MIT</dd></div><div><dt>Source</dt><dd><A to="https://github.com/hanzoai/bot">hanzoai/bot</A> <span className="x-mono">5 stars</span></dd></div></dl>
            <Go to="https://platform.hanzo.ai/deploy" solid>Deploy to Cloud</Go>
          </div>
          <div className="bt-rel">
            <p className="av-kick">Related capabilities</p>
            {[['/cloud/chat', 'Chat', 'Conversational AI'], ['/search', 'Search', 'Retrieval & answers'], ['/crawl', 'Crawl', 'Web crawler']].map(([to, t, d]) => (
              <A key={t} to={to} className="bt-rel-a"><b>{t}</b><span>{d}</span><i aria-hidden="true">→</i></A>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Bot() {
  return (
    <main className="av bt" style={{ '--ac': '#ff5f1f' }}>
      <Hero />
      <Cases />
      <Scenes label="What a bot does" items={CHAPTERS} flip tone={['#fff', '#f7f6f4', '#fff', '#f7f6f4', '#fff']} className="bt-sc" />
      <Tools />
      <Anywhere />
      <Install />
      <Pricing />
      <Fleet />
      <Questions />
      <Close />
    </main>
  );
}
