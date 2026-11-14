'use client';
// Signature: The org chart is the hero: a person mentions a bot, a packet runs down the chart to that bot and across to the teammate who verifies it, while the thread fills in beneath, ten channels in turn
// Beyond: How many bots do you need? Slide 1 to 10 and the smallest plan that includes that many resident bots lights up, from Hanzo's plan list
/* Hanzo Bot, v2 (Archetype A, launch: the org chart is the product).
   Persona: a founder or team lead with more routine work than people, deciding whether an AI teammate can take some of it.
   Goal: see one mention turn into finished, verified work, then start a bot.
   CTA: "Try Hanzo" (hanzo.bot), the one solid button, in the hero, the ask bar and the closing Band.
   Metric: signup_start
   V2: 8/10 round 4: no hydration mismatch under reduced motion (useCalm); the h1 cuts in by CSS from first paint and the demo carries on from the server's finished case; phone shows the @mention on the first screen with one solid; install is one object (the terminal types while the three steps light); Get Bot is a repo card, Questions arrive as messages; tool tiles fall back to monograms; the 19 kinds run as one rail. Round 5: question bubbles are buttons that answer in place (the dots resolve once into the first answer); pricing is one screen with the footnote under the plans, and the four inclusions are a drawn rack (one machine per bot on the slider, parts lighting in turn with their row); hero replies show skeleton lines the size of the coming text; the terminal's Copy says "Copied" with a role=status line
   Motion: signature = the live org chart (packets route person → bot → verifier, the thread fills beneath). Supporting:
   five pinned chapters with clip wipes (components/v2/AppScenes), line-masked headline, a magnetic ask. Greys only; colour
   comes from Hanzo's memoji and connector logos. Bot faces are Hanzo's memoji, with a drawn face beneath in case a picture
   can't load. Every word, figure and link is Hanzo's. */
import type React from 'react';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Copy, Magnetic, copyText } from '../ui';
import { A, More, Faq, Cta, Img } from '../kit';
import Sheet from '../v2/AppSheet';
import Chat from './bot/Chat';
import useEntrances from './bot/enter';
import useCalm from '../v2/useCalm';
import { WORKFLOWS, TOOLS } from './Bot.data';
import type { FaceProps } from './bot/types';
import { play } from '../../lib/sound';
import '../v2/AppType.css';
import './Bot.css';
import { PLANS as PLAN, FLOOR, checkout, usd } from '../../lib/plans';
import type { Derived } from '../../lib/plans';
import useCommercePricing from '../../lib/useCommercePricing';

const CREW = [['dev', 'Dev', 'Software'], ['qa', 'Qa', 'Quality'], ['cyber', 'Cyber', 'Security'], ['des', 'Des', 'Designer'], ['mark', 'Mark', 'Marketing'], ['su', 'Su', 'Support'], ['doc', 'Doc', 'Docs'], ['opera', 'Opera', 'Operations'], ['sci', 'Sci', 'Research'], ['data', 'Data', 'Analytics'], ['sal', 'Sal', 'Sales'], ['fin', 'Fin', 'Finance'], ['law', 'Law', 'Legal']];

/* A picture that steps aside if it cannot load (the drawn version underneath stays). */
interface PicProps {
  src: string;
  alt?: string;
  className?: string;
}
function Pic({ src, alt = '', className = '' }: PicProps) {
  const ref = useRef<HTMLImageElement>(null);
  const [bad, setBad] = useState(false);
  const [ok, setOk] = useState(false); // shown only once it has really loaded, so a blocked picture never flashes a broken icon
  useEffect(() => { const i = ref.current; if (i && i.complete) (i.naturalWidth ? setOk(true) : setBad(true)); }, [src]);
  return bad ? null : <Img ref={ref} src={src} alt={alt} w={64} h={64} className={'bt-pic' + (ok ? ' ok ' : ' ') + className} onLoad={() => setOk(true)} onError={() => setBad(true)} />;
}

/* A bot's face: Hanzo's memoji for that bot, over a little drawn screen with two eyes that shows if the picture can't load. */
const memoji = (id: string) => `https://hanzo.ai/memoji/${id === 'qa' ? 'sci' : id}.svg`;
function Face({ k = '', size, id }: FaceProps) {
  return <span className={'bt-face ' + k + (id ? ' has-id' : '')} style={size ? { '--s': size + 'px' } : undefined} aria-hidden="true"><i /><i />{id && <Pic src={memoji(id)} className="bt-face-img" />}</span>;
}

/* ---------- the signature: the org chart ---------- */
const BEAT = [650, 1200, 1500, 1050, 500]; // ms from beat b to b + 1: ask, run to the bot, it answers, hand to the verifier, verified
const HOLD = 3700;
const FIRST = 4200; // the server's finished case holds cleanly on first paint before the next mention runs
const CYCLE = BEAT.reduce((a, b) => a + b, 0) + HOLD;
const R = 12;

type Point = [x: number, y: number];
function route(pts: Point[]) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
    const r = Math.min(R, Math.hypot(x1 - x0, y1 - y0) / 2, Math.hypot(x2 - x1, y2 - y1) / 2);
    d += ` L${x1 - Math.sign(x1 - x0) * r} ${y1 - Math.sign(y1 - y0) * r} Q${x1} ${y1} ${x1 + Math.sign(x2 - x1) * r} ${y1 + Math.sign(y2 - y1) * r}`;
  }
  const l = pts[pts.length - 1];
  return d + ` L${l[0]} ${l[1]}`;
}
const off = (el: HTMLElement, root: HTMLElement) => { let x = 0, y = 0, e: HTMLElement | null = el; while (e && e !== root) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent instanceof HTMLElement ? e.offsetParent : null; } return { x, y, w: el.offsetWidth, h: el.offsetHeight }; };

interface PacketProps {
  pts: Point[];
  dur: number;
  v?: boolean;
}
function Packet({ pts, dur, v }: PacketProps) {
  const len = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const tot = len.reduce((a, b) => a + b, 0) || 1;
  let s = 0;
  const times = [0, ...len.map((l: number) => (s += l) / tot)];
  return (
    <motion.span className={'bt-pk' + (v ? ' v' : '')} aria-hidden="true" initial={{ x: pts[0][0], y: pts[0][1], opacity: 0 }}
      animate={{ x: pts.map((p) => p[0]), y: pts.map((p) => p[1]), opacity: pts.map((_, i) => (i === pts.length - 1 ? 0.2 : 1)) }}
      transition={{ duration: dur, times, ease: 'linear' }} />
  );
}

/* the chart's own pixels: its size, where the ask leaves from, and each bot's column (x, top and bottom of its face) */
interface Geometry {
  W: number;
  H: number;
  hx: number;
  hy: number;
  ns: { x: number; top: number; bot: number }[];
}
function Org() {
  const [at, setAt] = useState(0);
  const [b, setB] = useState(5); // the server paints the finished handoff; the demo carries on from it, never wipes it
  const [first, setFirst] = useState(true); // the first case is the server's: it stays, then the next case plays
  const [mine, setMine] = useState(false);
  const [paused, setPaused] = useState(false);
  const [g, setG] = useState<Geometry | null>(null);
  const box = useRef<HTMLDivElement>(null), chart = useRef<HTMLDivElement>(null), ask = useRef<HTMLDivElement>(null), row = useRef<HTMLOListElement>(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useCalm(); // false on the server and the first client render, so both match
  const live = seen && !calm && !paused;
  const w = WORKFLOWS[at];
  const pi = CREW.findIndex((c) => c[0] === w.primary.id), vi = CREW.findIndex((c) => c[0] === w.verifier.id);

  useEffect(() => {
    if (!live) return;
    if (b < 5) { const t = setTimeout(() => { setB(b + 1); if (b === 4 && mine) play('done'); }, BEAT[b]); return () => clearTimeout(t); }
    if (mine) return;
    const t = setTimeout(() => { setAt((a) => (a + 1) % WORKFLOWS.length); setB(0); setFirst(false); }, first ? FIRST : HOLD);
    return () => clearTimeout(t);
  }, [b, live, mine, first]);
  // measure the chart in its own (unscaled) pixels, so the wires stay true at any size
  useEffect(() => {
    const c = chart.current; if (!c) return;
    const m = () => {
      if (innerWidth <= 900) return setG(null);
      const a = off(ask.current!, c);
      const lis = [...row.current!.children] as HTMLElement[]; // an <ol>'s children are its <li>s
      const ns = lis.map((n) => { const f = off(n.querySelector<HTMLElement>('.bt-face')!, c), q = off(n, c); return { x: f.x + f.w / 2, top: f.y, bot: q.y + q.h }; });
      setG({ W: c.offsetWidth, H: c.offsetHeight, hx: a.x + a.w / 2, hy: a.y + a.h + 6, ns });
    };
    m();
    const ro = new ResizeObserver(m); ro.observe(c);
    return () => ro.disconnect();
  }, [at]);

  const pick = (i: number) => { setAt(i); setB(calm ? 5 : 0); setMine(true); setFirst(false); };
  const key = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!n) return;
    const j = (i + n + WORKFLOWS.length) % WORKFLOWS.length; pick(j);
    e.currentTarget.parentElement?.parentElement?.children[j]?.querySelector('button')?.focus();
  };

  let wires = '', r1: Point[] = [], r2: Point[] = [];
  if (g) {
    const bus = g.ns[0].top - 30, P = g.ns[pi], V = g.ns[vi];
    const lane = Math.max(P.bot, V.bot) + 16;
    r1 = [[g.hx, g.hy], [g.hx, bus], [P.x, bus], [P.x, P.top - 4]];
    r2 = [[P.x, P.bot + 4], [P.x, lane], [V.x, lane], [V.x, V.bot + 4]];
    wires = `M${g.hx} ${g.hy} L${g.hx} ${bus} M${g.ns[0].x} ${bus} L${g.ns[12].x} ${bus} ` + g.ns.map((n) => `M${n.x} ${bus} L${n.x} ${n.top - 4}`).join(' ');
  }
  return (
    <div className="bt-org av-obj" ref={box} role="group" aria-label="Ten workflows on Hanzo's org chart of bots">
      <div className="bt-org-bar">
        <button type="button" className="bt-pause" aria-pressed={paused} aria-label={paused ? 'Play' : 'Pause'} onClick={() => setPaused((p) => !p)}>
          {paused
            ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4.5 3v10l8.5-5z" fill="currentColor" /></svg>
            : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="4" y="3" width="2.6" height="10" rx="1" fill="currentColor" /><rect x="9.4" y="3" width="2.6" height="10" rx="1" fill="currentColor" /></svg>}
        </button>
        <span className="bt-ws"><b><span>Hanzo Bot · AI teammates</span></b><span className="bt-ch-name"># <span>{w.channel}</span></span><span className="bt-cat">{w.category}</span></span>
        <span className="bt-uc x-mono"><i className={live ? 'on' : ''} />USE CASE {w.num}</span>
      </div>
      <div className="bt-chart" ref={chart}>
        {g && (
          <svg className="bt-wires" width={g.W} height={g.H} viewBox={`0 0 ${g.W} ${g.H}`} aria-hidden="true">
            <path d={wires} className="bt-w" />
            <path d={route(r1)} className={'bt-w-on' + (b >= 1 ? ' on' : '')} />
            <path d={route(r2)} className={'bt-w-on v' + (b >= 3 ? ' on' : '')} />
          </svg>
        )}
        <motion.div key={'ask' + at} className="bt-ask" ref={ask} initial={first || calm ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
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
              </li>
            );
          })}
        </ol>
        {g && live && b === 1 && <Packet key={'a' + at} pts={r1} dur={1.1} />}
        {g && live && b === 3 && <Packet key={'b' + at} pts={r2} dur={0.95} v />}
      </div>
      <div className="bt-log">
        <div className={'bt-msg' + (b >= 2 ? ' on' : '')}>
          <Face k="p" size={34} id={w.primary.id} />
          <div className="bt-msg-in">
            <p className="bt-meta"><b>{w.primary.name}</b> <span>{w.primary.role} · {w.primary.time}</span></p>
            <span className="bt-dots" aria-hidden="true"><i /><i /><i /></span>
            <div className="bt-reply">
              <p>{w.primary.reply}</p>
              <p className="bt-art x-mono">{w.primary.codeOrArtifact}</p>
            </div>
          </div>
        </div>
        <div className={'bt-msg' + (b >= 4 ? ' on' : '')}>
          <Face k="v" size={34} id={w.verifier.id} />
          <div className="bt-msg-in">
            <p className="bt-meta"><b>{w.verifier.name}</b> <span>{w.verifier.role} · {w.verifier.time}</span></p>
            <span className="bt-dots" aria-hidden="true"><i /><i /><i /></span>
            <div className="bt-reply">
              <p><span className="bt-badge x-mono">{w.verifier.badge}</span></p>
              <p>{w.verifier.reply}</p>
            </div>
          </div>
        </div>
        {/* Synced iPhone hanzo.bot mobile preview alongside the desktop org chart */}
        <div className="bt-hero-ph" aria-label="Hanzo Bot mobile iPhone app synced live">
          <div className="bt-hph-scr">
            <div className="bt-hph-st" aria-hidden="true">
              <b>9:41</b>
              <span className="bt-hph-isl" />
              <span className="bt-hph-sys">iOS</span>
            </div>
            <div className="bt-hph-hd">
              <span className="x-mono">hanzo.bot</span>
              <span className="bt-hph-sync"><i className={live ? 'on' : ''} />Synced</span>
            </div>
            <div className="bt-hph-bd">
              <div className="bt-hph-ch x-mono"># {w.channel} · Mobile</div>
              <div className="bt-hph-card">
                <div className="bt-hph-who">
                  <Face k={b >= 2 ? 'p' : ''} size={22} id={w.primary.id} />
                  <div>
                    <b>{w.primary.name}</b>
                    <span>{w.primary.role}</span>
                  </div>
                </div>
                <div className="bt-hph-art x-mono">{w.primary.codeOrArtifact}</div>
                <div className="bt-hph-ver">
                  <Face k={b >= 4 ? 'v' : ''} size={16} id={w.verifier.id} />
                  <span className="x-mono">{b >= 4 ? w.verifier.badge : b >= 2 ? `→ @${w.verifier.name}` : `Routing ${w.human.mention}`}</span>
                </div>
              </div>
            </div>
            <i className="bt-hph-home" aria-hidden="true" />
          </div>
        </div>
      </div>
      <ol className="bt-tabs" role="tablist" aria-label="Channels">
        {WORKFLOWS.map((x, i) => (
          <li key={x.id}>
            <button type="button" role="tab" aria-selected={i === at} tabIndex={i === at ? 0 : -1} onClick={() => pick(i)} onKeyDown={(e) => key(e, i)}>
              {i === at && <motion.span layoutId="bt-tab" className="bt-tab-bg" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />}
              <span className="bt-tab-c"># {x.channel}</span>
              {i === at && !mine && !calm && <i key={'t' + at} className={'bt-tab-t' + (live ? '' : ' paused')} style={{ animationDuration: (first ? FIRST : CYCLE) + 'ms' }} aria-hidden="true" />}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* Phones keep the header's "Try Hanzo" solid; while the hero's own solid is on screen the header's reads as an outline
   (the shell's html[data-ask=quiet], as /bounty does), so one solid shows at a time. */
function useOneSolidOnPhone() {
  useEffect(() => {
    const H = document.documentElement;
    const mq = matchMedia('(max-width: 700px)');
    const el = document.querySelector('main.bt [data-cta="bot-hero-try"]');
    if (!el) return;
    let mine = false, vis = false;
    const apply = () => {
      if (mq.matches && vis) { H.dataset.ask = 'quiet'; mine = true; }
      else if (mine) { delete H.dataset.ask; mine = false; }
    };
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; apply(); });
    io.observe(el);
    const timers = [300, 1400].map((ms) => setTimeout(apply, ms));
    mq.addEventListener('change', apply);
    return () => { io.disconnect(); timers.forEach(clearTimeout); mq.removeEventListener('change', apply); if (mine) delete H.dataset.ask; };
  }, []);
}

const H1 = ['Teammates', 'you can hand', 'real work to.'];

function Hero() {
  useOneSolidOnPhone();
  return (
    <section className="bt-hero" aria-labelledby="bt-h1">
      <div className="av-wrap bt-hero-g">
        <div className="bt-hero-l">
          {/* the h1 cuts in line by line from first paint (CSS), so it never waits for hydration */}
          <h1 id="bt-h1" className="bt-h1">
            <span className="x-sr">{H1.join(' ')}</span>
            {H1.map((l, i) => <span key={l} className="bt-h1-ln" aria-hidden="true"><span style={{ '--i': i }}>{l}</span></span>)}
          </h1>
          <p className="bt-lede">Give a bot a job. It has its own computer, signs in to your tools the way you do, and comes back when the work is done. On your machine, in our cloud, or both.</p>
          <div className="bt-ask-row">
            <Magnetic strength={0.2}><Cta to="https://hanzo.bot" id="bot-hero-try" thumb size="lg">Try Hanzo</Cta></Magnetic>
          </div>
          <div className="bt-links">
            <a href="#install" className="x-arrow" data-cta="bot-hero-install"><span>Install on your Mac</span><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
            <Cta to="/contact-sales" kind="link" id="bot-hero-sales">Contact sales</Cta>
          </div>
          <p className="bt-note">Open source. Run it on your own machine if you want to — your keys and your data stay with you.</p>
        </div>
        <div className="bt-hero-r" data-morph-target="">
          <Org />
        </div>
      </div>
    </section>
  );
}

/* ---------- the ten workflows, in one drawer; and what every bot has ---------- */
interface CaseProps {
  w: (typeof WORKFLOWS)[number];
}
function Case({ w }: CaseProps) {
  return (
    <article className="bt-case">
      <h3 className="bt-case-t">{w.title}</h3>
      <p className="bt-case-k x-mono"><span>#{w.channel} · {w.category}</span><span>USE CASE {w.num}</span></p>
      <p className="bt-case-sum">{w.summary}</p>
      <div className="bt-thread">
        <div className="bt-line"><span className="bt-ini">{w.human.initials}</span><div><p className="bt-meta"><b>{w.human.name}</b> <span>{w.human.time}</span></p><p>{w.human.before}<b className="bt-at">{w.human.mention}</b>{w.human.after}</p></div></div>
        <div className="bt-line"><Face k="p" size={36} id={w.primary.id} /><div><p className="bt-meta"><b>{w.primary.name}</b> <span>{w.primary.role} · {w.primary.time}</span></p><p>{w.primary.reply}</p><p className="bt-art x-mono">{w.primary.codeOrArtifact}</p></div></div>
        <div className="bt-line"><Face k="v" size={36} id={w.verifier.id} /><div><p className="bt-meta"><b>{w.verifier.name}</b> <span>{w.verifier.role} · {w.verifier.time}</span></p><span className="bt-badge x-mono">{w.verifier.badge}</span><p>{w.verifier.reply}</p></div></div>
      </div>
      <p className="bt-case-h x-mono"><span className="bt-case-k">AUTOMATED WORKFLOW</span> <span>{w.steps.length} / {w.steps.length} steps complete</span></p>
      <ol className="bt-steps">{w.steps.map((s) => <li key={s}><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M7.5 12.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>{s}</li>)}</ol>
      <p className="bt-case-h x-mono">TOOLS &amp; SANDBOXES USED</p>
      <ul className="bt-chips">{w.tools.map((t) => <li key={t}>{t}</li>)}</ul>
      <p className="bt-run">Run <b className="x-mono"># <span>{w.channel}</span></b> with <b>{w.primary.name}</b> &amp; <b>{w.verifier.name}</b> in your workspace:</p>
    </article>
  );
}

const PTS = ['Each bot has its own computer: a browser, a terminal and your apps', 'It signs in to your tools once and works the way you do', 'Bots hand work to each other and ask you only when it matters', 'Routines run on a schedule and stop for your yes'];

function Cases() {
  return (
    <section className="av-sec bt-cases" id="use-cases" data-enter="tile-flip">
      <div className="av-wrap">
        <div className="av-grid bt-cases-top">
          <div className="bt-cases-l">
            <h2 className="av-head bt-cases-h">Ten everyday workflows your team hands off in a single mention.</h2>
            <p className="av-body">A human opens a channel or posts a quick explanation, mentions the right teammate, and gets finished work back — verified end-to-end by a second specialist before you merge or send.</p>
          </div>
          <div className="bt-cases-r">
            <Sheet trigger="bt-wall" kick="10 KILLER WORKFLOWS"
              label={<><span className="bt-pairs" aria-hidden="true" data-tiles="">{WORKFLOWS.map((w) => <span key={w.id} className="bt-pair" data-tile=""><span className="bt-pair-f"><Face size={30} id={w.primary.id} /><Face size={30} id={w.verifier.id} /></span><b># {w.channel}</b></span>)}</span><span className="bt-wall-t">See all ten workflows</span></>} title="Ten everyday workflows your team hands off in a single mention.">
              <div className="bt-all">
                <p className="bt-dom x-mono">Engineering · Security · Launch · Support · Ops · Research · Sales · Finance · Legal · Growth</p>
                <p className="bt-crewline"><Face size={26} id="dev" /><b>Hanzo</b><span className="x-mono">10 channels</span></p>
                {WORKFLOWS.map((w) => <Case key={w.id} w={w} />)}
                <div className="bt-run-links">
                  <A to="https://hanzo.bot" className="x-btn solid">Open Hanzo Bot</A>
                  <A to="https://hanzo.team" className="x-btn">Open Hanzo Team</A>
                  <More to="/team">Learn more about Team</More>
                  <More to="/bot">Learn more about Bot</More>
                </div>
              </div>
            </Sheet>
          </div>
        </div>
        <ol className="bt-pts">
          {PTS.map((t, i) => <li key={t}><span className="x-mono av-num">{String(i + 1).padStart(2, '0')}</span><p>{t}</p></li>)}
        </ol>
      </div>
    </section>
  );
}

/* ---------- five chapters, each with its own live product UI, filled with Hanzo's own lines ---------- */
interface OnProps {
  on: boolean;
}
function Sandbox({ on }: OnProps) {
  return (
    <div className={'bt-vis bt-box' + (on ? ' on' : '')} aria-hidden="true">
      <div className="bt-win">
        <div className="bt-win-bar"><i /><i /><i /><span className="x-mono">sandbox · ubuntu-24.04</span><Face k="p" size={26} id="mark" /></div>
        <div className="bt-win-body">
          <div className="bt-br">
            <span className="bt-url x-mono">hanzo.ai/pricing</span>
            <p className="bt-br-h">{`Included in plans from $${PLAN.pro.price}`}</p>
            <p className="bt-br-p bt-type">Agents can top up in USDC or USDT over the API.</p>
            <span className="bt-file x-mono">pricing.png</span>
            <span className="bt-cur" />
          </div>
          <div className="bt-term x-mono">
            <span className="bt-tl"><b>$</b>npm install -g @hanzo/bot</span>
            <span className="bt-tl"><b>$</b><span>hanzo-bot onboard --install-daemon</span></span>
            <span className="bt-tl"><b>$</b>hanzo bot runs list</span>
            <span className="bt-tl bt-tl-one">$ hanzo-bot run --browser --channel #hanzo-marketing</span>
            <span className="bt-tl o">#hanzo-marketing · Weekdays around 9:00 AM</span>
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
const JOB_FACE = ['su', 'sal', 'sci', 'dev', 'fin', 'opera'];

function Board({ on }: OnProps) {
  return (
    <div className={'bt-vis bt-board' + (on ? ' on' : '')} aria-hidden="true">
      <ul>
        {JOBS.map(([t], i) => (
          <li key={t} style={{ '--i': i }}><Face size={40} id={JOB_FACE[i]} /><b>{t}</b><em className="x-mono">Working</em></li>
        ))}
      </ul>
    </div>
  );
}

interface MsgProps {
  on: boolean;
  children: ReactNode;
  cls?: string;
  face?: string;
}
function Msg({ on, children, cls = '', face }: MsgProps) {
  return (
    <div className={'bt-tm ' + cls + (on ? ' on' : '')} aria-hidden={!on}>
      {face && <Face k={face === 'des' ? 'v' : 'p'} size={30} id={face} />}
      <div>{children}</div>
    </div>
  );
}

/* Hanzo's sample thread: Mark asks Des for a header, then asks you before it ships. */
function Thread({ on }: OnProps) {
  const calm = useReducedMotion();
  const [b, setB] = useState(7);
  const [pick, setPick] = useState<string | null>(null);
  useEffect(() => { if (on && !calm) { setB(0); setPick(null); } }, [on, calm]);
  useEffect(() => {
    if (!on || calm || b >= 7) return;
    const t = setTimeout(() => { setB((v) => v + 1); if (b === 6) play('done'); }, [700, 1300, 1300, 1400, 1500, 1600, 1800][b]);
    return () => clearTimeout(t);
  }, [b, on, calm]);
  useEffect(() => { if (b === 7 && !pick) setPick('yes'); }, [b, pick]);
  const at = (k: number) => b > k;
  const desOn = b === 3;
  return (
    <div className="bt-vis bt-app">
      <aside className="bt-side">
        <p className="bt-app-t x-mono">hanzo.bot · Web App</p>
        <div className="bt-search">Search</div>
        <p className="bt-side-h">Teammates <span className="x-mono"><i className="bt-live" aria-hidden="true" />{desOn ? '2 working' : '1 working'}</span></p>
        <ul className="bt-mates">
          {([['mark', 'Mark', true], ['des', 'Des', desOn]] satisfies [string, string, boolean][]).map(([id, n, w]) => (
            <li key={id} className={w ? 'on' : ''}><Face k={w ? (id === 'des' ? 'v' : 'p') : ''} size={30} id={id} /><span><b>{n}</b><span>{w ? 'Working' : ' '}</span></span></li>
          ))}
        </ul>
      </aside>
      <div className="bt-main">
        <div className="bt-main-h"><Face k="p" size={26} id="mark" /><b><span>Mark · Marketing</span></b><span className="bt-plus x-mono">+<span>1</span></span></div>
        <div className="bt-tlog">
          <Msg on={at(0)} cls="you"><p>Write the launch post for crypto top-ups, and ask Des for a header.</p></Msg>
          <Msg on={at(1)} face="mark"><p>Drafted. Agents can now top up in USDC or USDT over the API and pay as they go.</p></Msg>
          <Msg on={at(2)} cls="sys"><p>Messaged Des · Designer</p></Msg>
          <Msg on={at(3)} cls="from"><p className="bt-from">Message from Des · Designer</p><div className="bt-quote"><b>Des · Designer</b><p>Top up in USDC or USDT.</p><span className="bt-file x-mono">header.mp4</span></div></Msg>
          <Msg on={at(4)} face="mark"><p>Des sent the header. Here is /pricing with the new line.</p><div className="bt-card"><span className="x-mono">hanzo.ai/pricing</span><p>Agents can top up in USDC or USDT over the API.</p><span className="bt-file x-mono">pricing.png</span></div></Msg>
          <Msg on={at(5)} cls="ask">
            {/* hanzo.ai's ask card: 'Waiting for you' until you pick, then 'Answered'; both share one cell, so nothing moves */}
            <span className={'bt-answered x-mono' + (pick ? '' : ' wait')}><span hidden={!!pick || undefined}>Waiting for you</span><span hidden={!pick || undefined}>Answered</span></span>
            <p>Should /pricing include that sentence about crypto top-ups?</p>
            <div className="bt-yn">
              <button type="button" data-sound="tick" className={pick === 'yes' ? 'on' : ''} onClick={() => { setPick('yes'); if (b < 7) setB(7); }} tabIndex={at(5) ? 0 : -1}>Yes, add it</button>
              <button type="button" data-sound="tick" className={pick === 'no' ? 'on' : ''} onClick={() => setPick('no')} tabIndex={at(5) ? 0 : -1}>Not yet</button>
            </div>
          </Msg>
          <Msg on={at(5) && pick !== 'no' && (b >= 7 || pick === 'yes')} face="mark"><p>Added. I will post a short update in #hanzo-marketing every weekday.</p></Msg>
        </div>
      </div>
    </div>
  );
}

function Routines({ on }: OnProps) {
  const [sw, setSw] = useState([true, true]);
  const list = [['Daily #hanzo-marketing update', 'Weekdays around 9:00 AM'], ['Answer #hanzo-marketing mentions', 'When @mentioned']];
  return (
    <div className={'bt-vis bt-rt' + (on ? ' on' : '')}>
      <div className="bt-rt-stage">
        <div className="bt-rt-card">
          <div className="bt-rt-top"><Face k="p" size={40} id="mark" /><b><span>Mark · Marketing</span></b></div>
          <div className="bt-rt-tabs" aria-hidden="true"><span>Details</span><span>Library</span><span>Computer</span><span className="on">Routines</span></div>
          <ul>
            {list.map(([t, wh], i) => (
              <li key={t} style={{ '--i': i }}>
                <span><b><span>{t}</span></b><span className="x-mono">{wh}</span></span>
                <button type="button" role="switch" aria-checked={sw[i]} aria-label={t} className={'bt-sw' + (sw[i] ? ' on' : '')} onClick={() => setSw(sw.map((v, k) => (k === i ? !v : v)))}><i /></button>
              </li>
            ))}
          </ul>
          <span className="bt-rt-new">+ New routine</span>
        </div>
        {/* Synced iPhone hanzo.bot mobile handset beside the web app */}
        <div className="bt-rt-phone" aria-label="Hanzo Bot mobile app synced with web routines">
          <div className="bt-hph-scr">
            <div className="bt-hph-st" aria-hidden="true">
              <b>9:41</b>
              <span className="bt-hph-isl" />
              <span className="bt-hph-sys">5G</span>
            </div>
            <div className="bt-hph-hd">
              <span className="x-mono">hanzo.bot</span>
              <span className="bt-hph-sync"><i className="on" />Live</span>
            </div>
            <div className="bt-hph-bd">
              <div className="bt-hph-who">
                <Face k="p" size={24} id="mark" />
                <div>
                  <b>Mark · Mobile</b>
                  <span>{sw.filter(Boolean).length} of 2 routines on</span>
                </div>
              </div>
              <div className="bt-rt-ph-list">
                {list.map(([t, wh], i) => (
                  <div key={t} className={'bt-rt-ph-it' + (sw[i] ? ' on' : '')}>
                    <b>{t}</b>
                    <span className="x-mono">{sw[i] ? wh : 'Paused'}</span>
                  </div>
                ))}
              </div>
            </div>
            <i className="bt-hph-home" aria-hidden="true" />
          </div>
        </div>
      </div>
      <p className="bt-rt-ph-c">Desktop + iPhone stay synced live — tap any teammate to hand off from phone or web</p>
    </div>
  );
}

const MEMO = [
  ['#', 'MEMORY.md'],
  ['-', 'Daily #hanzo-marketing update · Weekdays around 9:00 AM'],
  ['-', 'Answer #hanzo-marketing mentions · When @mentioned'],
  ['-', 'Should /pricing include that sentence about crypto top-ups? Yes, add it'],
  ['-', 'Agents can top up in USDC or USDT over the API.'],
  ['-', 'Des · Designer: header.mp4'],
  ['#', 'SKILLS.md'],
  ['-', 'Write the launch post for crypto top-ups, and ask Des for a header.'],
];

function Memory({ on }: OnProps) {
  return (
    <div className={'bt-vis bt-mem' + (on ? ' on' : '')} aria-hidden="true">
      <div className="bt-mem-file">
        <div className="bt-mem-top x-mono"><span className="on">MEMORY.md</span><span>SKILLS.md</span></div>
        <div className="bt-mem-body x-mono">
          {MEMO.map(([m, t], i) => <span key={i} className={'bt-mem-l' + (m === '#' ? ' h' : '')} style={{ '--i': i }}><i>{i + 1}</i><b>{m} {t}</b></span>)}
          <span className="bt-mem-find" />
        </div>
      </div>
    </div>
  );
}

interface ItemsProps {
  lede?: string;
  items: string[][];
  link?: string;
  to?: string;
}
const Items = ({ lede, items, link, to }: ItemsProps) => (
  <div className="bt-chb">
    {lede && <p className="av-body bt-chb-lede">{lede}</p>}
    {items && <dl className="bt-dl">{items.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}</dl>}
    {link && <More to={to}>{link}</More>}
  </div>
);

interface ChapterData {
  kick: string;
  title: string;
  body: ReactNode;
  visual: (on: boolean) => ReactNode;
}
const CHAPTERS: ChapterData[] = [
  { kick: 'What a bot is', title: 'A teammate with its own computer', body: <Items lede="Not a chat window. A bot has a computer of its own and works while you do something else." items={[['Its own computer', 'Each bot runs in its own sandbox with a browser, a terminal and your apps. Nothing it does touches your machine unless you let it.'], ['Works where you work', 'Sign it in once. It uses the same tools and websites you do, including the ones that are hard to automate.'], ['Comes back when it is done', 'Give it a task and go do something else. It returns with finished work and asks only when it needs your say.']]} />, visual: (on) => <Sandbox on={on} /> },
  { kick: 'Give each bot a job', title: 'One bot per job', body: <Items items={JOBS} />, visual: (on) => <Board on={on} /> },
  { kick: 'Work with many at once', title: 'Bots that hand work to each other', body: <Items items={[['One gateway, many bots', 'Each bot has its own workspace, sign-ins and history, and each message goes to the bot it is meant for.'], ['Sub-agents', 'A bot can start background runs that work in parallel and post what they found back in the chat that asked.'], ['Bots message bots', 'One bot can read another’s session and send it a message, so a handoff needs no copy and paste.']]} link="How multi-agent works" to="https://docs.hanzo.bot/docs/concepts/multi-agent" />, visual: (on) => <Thread on={on} /> },
  { kick: 'Show it how it is done', title: 'Teach it a routine once', body: <Items items={[['Skills', 'Write the steps in a plain Markdown skill, and the bot uses it whenever the job comes up.'], ['On a schedule', 'Every morning, or in twenty minutes. Scheduled jobs survive a restart and can post the result to a chat.'], ['Your say at each step', 'A multi-step routine can stop at the steps you mark and wait for your yes before it goes on.']]} link="Skills in the docs" to="https://docs.hanzo.bot/docs/tools/skills" />, visual: (on) => <Routines on={on} /> },
  { kick: 'Gets better as it goes', title: 'It remembers what it learns', body: <Items items={[['Memory is files', 'Decisions, preferences and running notes go into Markdown files in its workspace, not into the model.'], ['It looks things up', 'It searches those notes when it needs them, so what you told it last week still counts.'], ['Yours to read and fix', 'Open the files, correct them or delete them. The next session starts from what you left.']]} link="How memory works" to="https://docs.hanzo.bot/docs/concepts/memory" />, visual: (on) => <Memory on={on} /> },
];

/* Five plain sections (no pin): words on one side, the live picture on the other, alternating. Each picture runs only
   while it is on screen. They enter with the page's `ripple` (components/pages/bot/enter.css). */
function Chapter({ it, i }: { it: ChapterData; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { amount: 0.4 });
  return (
    <div ref={ref} className={'av-wrap av-grid bt-ch' + (i % 2 ? ' alt' : '')} data-enter="ripple">
      <div className="bt-cht">
        <h3 className="av-head">{it.title}</h3>
        {it.body}
        <p className="x-mono bt-cap">{it.kick}</p>
      </div>
      <div className="bt-chv">{it.visual(on)}</div>
    </div>
  );
}

function Chapters() {
  return (
    <section className="av-sec bt-chs" aria-label="What a bot does">
      {CHAPTERS.map((it, i) => <Chapter key={it.title} it={it} i={i} />)}
    </section>
  );
}

/* ---------- the signature: ask it, and it answers live (components/pages/bot/Chat.jsx) ---------- */
function Ask() {
  return (
    <section className="av-sec bt-askq" id="faq" aria-labelledby="bt-q-h">
      <div className="av-wrap av-grid">
        <div className="bt-qa">
          <h2 className="av-head" id="bt-q-h">Questions</h2>
          <p className="av-body">{QA.slice(0, 3).map(([q]) => q).join(' ')}</p>
          <Sheet trigger="bt-open" label="Read all ten answers" kick="FAQ" title="Questions">
            <Faq items={QA} />
          </Sheet>
        </div>
        <div className="bt-chat-w">
          <Chat qa={QA} Face={Face} />
        </div>
      </div>
    </section>
  );
}

/* ---------- the tools it signs in to, and where you talk to it ---------- */
const CHANNELS = ['Desktop', 'iPhone', 'WhatsApp', 'Telegram', 'Slack', 'Discord', 'iMessage', 'Signal', 'Web chat'];

/* Bot.data.ts infers each row of TOOLS as (string | string[][])[]: a kind and its [file, name] marks */
const TOOL_KINDS = TOOLS as unknown as [kind: string, tools: [file: string, name: string][]][];

function Tools() {
  const [cat, setCat] = useState(0);
  return (
    <section className="av-sec bt-tools">
      <div className="av-wrap av-grid">
        <div className="bt-tools-l">
          <h2 className="av-head">Sign it in to the tools you use</h2>
          <p className="av-body">You log in once in the bot&apos;s own browser. It keeps the session and works in the same tools and sites you do.</p>
          <p className="bt-200 av-num" aria-hidden="true">200</p>
          <p className="bt-fine">200 tools. Each mark belongs to its owner and is shown to say what Hanzo connects to — not to imply any partnership or endorsement.</p>
        </div>
        <div className="bt-tools-r" data-enter="grid-wave">
          <div className="bt-cats" role="tablist" aria-label="Kinds of tools">
            {TOOL_KINDS.map(([c], i) => (
              <button key={c} type="button" role="tab" aria-selected={i === cat} aria-controls={'bt-tc' + i} id={'bt-tt' + i} onClick={() => setCat(i)}>{c}</button>
            ))}
          </div>
          {TOOL_KINDS.map(([c, list], i) => (
            <ul key={c} id={'bt-tc' + i} role="tabpanel" aria-labelledby={'bt-tt' + i} className="bt-names" hidden={i !== cat}>
              {list.map(([f, n]) => <li key={f} data-cell=""><span className="bt-logo"><b aria-hidden="true">{n.replace(/[^A-Za-z0-9]/g, '').slice(0, 1)}</b><Pic src={`https://hanzo.ai/connectors/${f}.png`} alt={n} /></span><span>{n}</span><i aria-hidden="true">✓</i></li>)}
            </ul>
          ))}
        </div>
      </div>
      <div className="av-wrap bt-any">
        <h2 className="av-head bt-any-h">Message your bots where you already are</h2>
        <ul className="bt-any-list">{CHANNELS.map((c) => <li key={c}>{c}</li>)}</ul>
        <div className="bt-any-f">
          <span className="x-mono bt-cap">Talk to it anywhere</span>
          <More to="https://github.com/hanzoai/bot/blob/main/docs/install/migrate-from-openclaw.md">Coming from OpenClaw? One command moves your install</More>
        </div>
      </div>
    </section>
  );
}

/* ---------- install: three steps, two commands, one prompt ---------- */
const STEPS3 = [['Name it and give it a job', 'Say what you want done, in plain words.'], ['Sign it in to your tools', 'Once. It keeps the access it needs and nothing more.'], ['Let it work', 'It comes back when it is done, or when it needs you.']];
const PASTE = 'Read https://hanzo.ai/skill.md and use Hanzo Bot in my project. Start with: hanzo bot runs list';

/* One object that changes: the terminal types the two commands while the three steps light in turn
   (step 1 with the install, step 2 with the onboard, step 3 as the caret waits). The server paints every line typed;
   a visitor only ever sees it type, because it empties itself on mount while still below the fold. */
const CMDS = ['npm install -g @hanzo/bot', 'hanzo-bot onboard --install-daemon'];
const TYPE_MS = 38;

/* The terminal's copy button: it says "Copied" the moment the clipboard takes the text (a role=status line), never on failure. */
interface TermCopyProps {
  text: string;
}
function TermCopy({ text }: TermCopyProps) {
  const [ok, setOk] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  const go = async () => {
    if (!(await copyText(text))) return;
    setOk(true); play('done');
    clearTimeout(t.current);
    t.current = setTimeout(() => setOk(false), 1800);
  };
  return (
    <>
      <button type="button" className={'x-copy bt-copy' + (ok ? ' ok' : '')} onClick={go} aria-label="Copy">
        {ok
          ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="5" y="5" width="8.5" height="8.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M10.5 3.2V3a.8.8 0 0 0-.8-.8H3a.8.8 0 0 0-.8.8v6.7c0 .44.36.8.8.8h.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>}
        <span aria-hidden="true">{ok ? 'Copied' : 'Copy'}</span>
      </button>
      <span className="x-sr" role="status">{ok ? 'Copied' : ''}</span>
    </>
  );
}

function InstallStage() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { amount: 0.45 });
  const calm = useCalm();
  const [k, setK] = useState(3); // characters typed: 3 = all done (the server's frame)
  const [n, setN] = useState([CMDS[0].length, CMDS[1].length]);
  const [step, setStep] = useState(-1);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top > innerHeight) { setK(0); setN([0, 0]); setStep(0); }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready || !seen || calm || k >= 3) return;
    if (k < 2) {
      const want = CMDS[k].length;
      if (n[k] < want) { const t = setTimeout(() => setN((v) => v.map((x, j) => (j === k ? x + 1 : x))), n[k] === 0 ? 500 : TYPE_MS); return () => clearTimeout(t); }
      const t = setTimeout(() => { setK(k + 1); setStep(k + 1); }, 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { setK(3); play('done'); }, 1600);
    return () => clearTimeout(t);
  }, [ready, seen, calm, k, n]);
  const again = () => { if (calm) return; setK(0); setN([0, 0]); setStep(0); };
  const lit = (i: number) => (k >= 3 ? true : i <= step);
  return (
    <div className="av-grid bt-inst" ref={ref}>
      <div className="bt-inst-l">
        <h2 className="av-head">On your Mac in two commands</h2>
        <p className="av-body">Node 22 or newer, on macOS or Linux. The second command walks you through your model, channels and skills, and keeps the gateway running in the background.</p>
        <div className="bt-inst-links"><More to="https://docs.hanzo.bot/docs/install">Install guide</More><More to="https://github.com/hanzoai/bot">View on GitHub</More></div>
        <div className="bt-start">
          <h3 className="bt-start-h">Three steps</h3>
          <span className="x-mono bt-cap">How it starts</span>
          <ol className="bt-start-r">
            {STEPS3.map(([t, d], i) => (
              <li key={t} className={(lit(i) ? 'lit' : '') + (k < 3 && i === step ? ' now' : '')}>
                <span className="x-mono av-num">{String(i + 1).padStart(2, '0')}</span><b><span>{t}</span></b><span>{d}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className={'bt-term-big' + (k < 3 ? ' run' : '')} data-fold="">
        <div className="bt-term-bar"><i /><i /><i /><span className="x-mono">terminal</span>
          <button type="button" className="bt-again" onClick={again} aria-label="Type it again" data-sound="tick" disabled={k < 3}>
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.5-3.55M13 2.5V5h-2.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <TermCopy text={CMDS.join('\n')} />
        </div>
        <pre className="x-mono">
          <span className="bt-ps">$ </span>{CMDS[0].slice(0, n[0])}{k === 0 && <i className="bt-caret on" />}{'\n'}
          {(k >= 1) && <><span className="bt-ps">$ </span>{CMDS[1].slice(0, n[1])}{k === 1 && <i className="bt-caret on" />}{'\n'}</>}
          {(k >= 2) && <><span className="bt-ps">$ </span><i className="bt-caret" /></>}
        </pre>
      </div>
    </div>
  );
}

function Install() {
  return (
    <section className="av-sec bt-inst-sec" id="install" data-enter="fold-out">
      <div className="av-wrap">
        <InstallStage />
        <div className="bt-paste">
          <div className="bt-paste-l">
            <p className="av-title">Paste and ship</p>
            <p className="av-body">Paste this into any agent. It reads the skill manifest and calls Bot from there.</p>
          </div>
          <div className="bt-prompt" data-fold="2">
            <p className="bt-prompt-k x-mono"><span>Agent prompt</span><span className="bt-api"><b>api</b> /v1/bot</span></p>
            <code className="x-mono">{PASTE}</code>
            <Copy text={PASTE} label="Copy the agent prompt" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- pricing: every paid plan from Go upward includes unlimited bots on hanzo.bot ---------- */
const PERKS = ['Early access to new models and features', 'Train custom models on your data', 'Hanzo Engine to run models on your own hardware', 'Dedicated support'];
type PlanRow = [name: string, price: string, mult: string, lines: string[], id: string, perks: boolean];
const botPlansOf = (P: Derived['plans']): PlanRow[] => [
  [P.go.name, '$' + P.go.price, '1x', ['Usage included on every model', 'Priority inference and priority support'], P.go.id, false],
  [P.pro.name, '$' + P.pro.price, '3x', ['3x more usage than Go', '3x higher limits than Go', ...(P.pro.hasTeam ? ['Hanzo Team (hanzo.team) workspace included'] : [])], P.pro.id, true],
  [P.dev.name, '$' + P.dev.price, '5x', ['5x more usage than Go', '5x higher limits than Go', ...(P.dev.hasTeam ? ['Hanzo Team (hanzo.team) workspace included'] : [])], P.dev.id, true],
  [P.max.name, '$' + P.max.price, '15x', ['15x more usage than Go', '15x higher limits than Go', ...(P.max.hasTeam ? ['Hanzo Team (hanzo.team) workspace included'] : [])], P.max.id, true],
  [P.ultra.name, '$' + P.ultra.price, '∞', ['Unlimited usage across every model', '25x higher limits than Go & priority queue', ...(P.ultra.hasTeam ? ['Hanzo Team (hanzo.team) workspace included'] : [])], P.ultra.id, true],
];
const FEATS = [
  ['Dedicated Cloud Sandbox', 'Each bot runs in its own isolated Linux environment with dedicated memory and compute.'],
  ['Isolated Browser & Shell', 'Independent Chromium browser sessions and private bash terminals with separate logins and cookies.'],
  ['Independent Markdown Memory', 'Private workspace memory files (MEMORY.md) so multiple bots never pollute each other’s context.'],
  ['Parallel Schedules & Cron', 'Run background jobs simultaneously across unlimited bots without hitting single-bot queues.'],
];
const whyOf = (P: Derived['plans'], F: Derived['floor']) => [
  ['Compute Floor', `Why a ${usd(F.bot)}/mo entry floor?`, 'Not a chat window. A resident cloud computer.', `Standard chat models terminate compute as soon as tokens finish streaming. A resident Hanzo Bot lives in an active cloud sandbox with its own Chromium browser, bash terminal, isolated filesystem, and scheduled cron jobs. The ${usd(F.bot)}/month floor unlocks hanzo.bot with unlimited bots.`],
  ['Token Economics', 'Routine work at 1/5th the token cost', 'Intelligent routing through Enso & Kai.', 'Up to 90% of a resident bot’s daily work consists of triaging inboxes, summarizing documents, parsing receipts, and scraping pages. Rather than burning expensive frontier reasoning on routine tasks, Hanzo Bot routes routine loops through Enso Flash & Kai at a fraction of frontier token cost.'],
  ['Frontier Autonomy', `Ultra tier for massive workloads (${usd(P.ultra.price)}/mo)`, 'Unlimited usage across every model, 25x higher rate limits.', `When your bots need deep multi-hour research, autonomous software engineering, or multi-step strategic analysis, the Ultra tier (${usd(P.ultra.price)}/mo) includes unlimited usage across every model with 25x higher rate limits than Go and priority queue access.`],
  ['Auditable Memory', 'Plain Markdown files you can inspect & edit', 'No black-box fine-tuning or opaque vector locks.', 'Hanzo Bot records what it learns in human-readable Markdown files in its workspace (`MEMORY.md`, `SKILLS.md`). You can open them, audit them, version-control them in Git, or delete them anytime. The bot begins every session from what you leave.'],
];

function Pricing() {
  const { plans: LP, floor: LF } = useCommercePricing();
  const PLANS = botPlansOf(LP);
  const WHY = whyOf(LP, LF);
  const [k, setK] = useState(1);
  const [hl, setHl] = useState(0); // which included part the drawn machines light
  const [hold, setHold] = useState(false);
  const rack = useRef<HTMLDivElement>(null);
  const racked = useInView(rack, { amount: 0.4 });
  const calm = useCalm();
  // while the machines are on screen, their four parts light in turn; pointing at a row holds it
  useEffect(() => {
    if (!racked || hold || calm) return;
    const t = setTimeout(() => setHl((v) => (v + 1) % FEATS.length), 2400);
    return () => clearTimeout(t);
  }, [racked, hold, calm, hl]);
  const n = [2, 4, 6, 8, 10][k] || 4;
  return (
    <section className="av-sec bt-price" id="pricing">
      <div className="av-wrap av-grid" data-enter="grow-from-point">
        <div className="bt-price-l">
          <h2 className="av-head">{`Included in plans from $${LF.bot}`}</h2>
          <p className="av-body">{`Create unlimited bots on hanzo.bot starting at $${LF.bot}. Plans from $${LF.team} upward also include hanzo.team. Or run Hanzo Bot free on your own machine.`}</p>
          <div className="bt-need" style={{ '--f': k / (PLANS.length - 1) }}>
            <label htmlFor="bt-n">Choose your usage tier (all include unlimited bots)</label>
            <div className="bt-need-fig" aria-hidden="true">
              <span className="av-num">{PLANS[k][2]}</span>
              <span className="bt-need-faces">{CREW.slice(0, 10).map(([id], i) => <span key={id} className={'bt-nf' + (i < n ? ' on' : '')}><Face size={24} id={id} /></span>)}</span>
            </div>
            <input id="bt-n" data-sound="tick" type="range" min="0" max={PLANS.length - 1} step="1" value={k} onChange={(e) => setK(+e.target.value)} aria-valuetext={`${PLANS[k][0]}: unlimited bots`} />
            <output htmlFor="bt-n" className="x-mono"><b>Unlimited bots</b> → <b>{PLANS[k][0]}</b>, {PLANS[k][1]} / month</output>
          </div>
        </div>
        <div className="bt-plans-w">
          <ul className="bt-plans">
            {PLANS.map(([name, price, mult, lines, plan, proPerks], i) => (
              <li key={name} className={i === k ? 'pick' : ''}>
                {i === k && <motion.span layoutId="bt-plan" className="bt-plan-bg" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />}
                <div className="bt-plan-top">
                  <h3>{name}</h3>
                  <p className="bt-plan-p"><b className="av-num">{price}</b> <span>/</span> <span>month</span></p>
                  <span className="bt-plan-n x-mono">{mult}</span>
                  <A to={checkout(plan)} className="x-btn" data-cta={'bot-plan-' + name.toLowerCase()}>Get {name}</A>
                </div>
                <ul className="bt-plan-l">
                  <li className="bt-bots">Hanzo Bot (hanzo.bot) — unlimited bots</li>
                  {lines.map((l) => <li key={l}>{l}</li>)}
                  {proPerks && PERKS.map((l) => <li key={l}>{l}</li>)}
                </ul>
              </li>
            ))}
          </ul>
          <p className="bt-free">Every plan can run Hanzo Bot on your own Mac or Linux machine, 100% free and open source.</p>
        </div>
      </div>
      <div className="av-wrap av-grid bt-fleet">
        <div className="bt-fleet-c">
          <div className="bt-fleet-l" id="additional-bots">
            <h3 className="av-title">Unlimited bots, zero per-bot limits</h3>
            <p className="av-body">Every paid plan unlocks hanzo.bot so you can spin up as many specialized bots as your workflows need — scaled only by your plan’s usage and rate-limit tier.</p>
            <div className="bt-fleet-acts">
              <More to="/pricing">See the plans</More>
              <Sheet label="Why Hanzo Bot is built and priced this way" kick="Agent Architecture & Pricing Model" title="Why Hanzo Bot is built and priced this way">
                <div className="bt-why" id="pricing-model">
                  <p className="bt-why-lede">Designed around the real economics of autonomous resident agents: dedicated sandboxes, cost-efficient model tiering, and transparent, auditable memory.</p>
                  {WHY.map(([k2, t, s, d]) => (
                    <div key={k2} className="bt-why-i">
                      <h3>{t}</h3>
                      <p className="bt-why-k x-mono">{k2}</p>
                      <p className="bt-why-s">{s}</p>
                      <p>{d}</p>
                    </div>
                  ))}
                  <div className="bt-own">
                    <h3>Prefer running on your own machine? It’s 100% free.</h3>
                    <p>Hanzo Bot is open source under the MIT license. You can run the exact same gateway, sandboxes, and skills on your own Mac or Linux machine with your own API keys at zero subscription cost.</p>
                    <span className="bt-mit x-mono">MIT Open Source</span>
                  </div>
                </div>
              </Sheet>
            </div>
          </div>
        </div>
        {/* what each resident bot gets, drawn: one small machine per bot you chose on the slider, its four parts
            (sandbox, browser and shell, memory, schedules) lit from the row you point at */}
        <div className="bt-rack" data-hl={hl} ref={rack}>
          <div className="bt-rack-m" aria-hidden="true">
            {CREW.slice(0, 10).map(([id], i) => (
              <span key={id} className={'bt-mc' + (i < n ? ' on' : '')} style={{ '--i': i }}>
                <Face size={22} id={id} />
                <i className="z0" /><i className="z1"><b /><b /></i><i className="z2"><b /><b /><b /></i><i className="z3"><b /></i>
              </span>
            ))}
          </div>
          <dl className="bt-feats">
            {FEATS.map(([t, d], i) => (
              <div key={t} className={hl === i ? 'on' : ''} onMouseEnter={() => { setHl(i); setHold(true); }} onMouseLeave={() => setHold(false)}>
                <dt><span className="x-mono av-num">{String(i + 1).padStart(2, '0')}</span><span>{t}</span></dt><dd>{d}</dd>
              </div>
            ))}
          </dl>
          <span className="x-mono bt-cap">Included with your plan</span>
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
  ['What does Hanzo Bot cost?', 'Running Hanzo Bot on your own machine is 100% free and open source (MIT licensed). In our cloud, every paid plan from Go upward unlocks hanzo.bot with unlimited bots — compute and tokens scale with your plan’s usage tier, with prepaid auto-reload to keep going.'],
  [`Why is there a ${usd(FLOOR.bot)}/mo floor for cloud resident bots?`, `Unlike simple chat prompts where compute ends as soon as generation stops, a resident bot has an always-on dedicated cloud environment. It runs an isolated sandbox container, headless browser, terminal, filesystem, and active cron listeners. The ${usd(FLOOR.bot)}/mo floor covers dedicated compute and guarantees uptime.`],
  ['How do model token costs work for bots?', 'Routine tasks (sorting inboxes, web scraping, scheduling, receipt parsing) execute on fast, cost-effective Enso and Sol 6.1 models at ~1/5th the token cost of frontier models, preserving 85-90% of your plan allowance. Higher tiers include Zen Ultra and Astra Ultra frontier models for complex multi-step reasoning.'],
];

/* ---------- before the close: the repo and Deploy to Cloud, then related ---------- */
function More2() {
  return (
    <section className="av-sec tight bt-more2">
      <div className="av-wrap av-grid">
        <div className="bt-get">
          <div className="bt-repo">
            <div className="bt-repo-top">
              <svg viewBox="0 0 16 16" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
              <p className="av-title">Get Bot</p>
            </div>
            <p className="av-body">Connect your AI agents to every messaging channel</p>
            <span className="bt-repo-f" aria-hidden="true">{CREW.map(([id]) => <Face key={id} size={30} id={id} />)}</span>
            <dl className="bt-meta2"><div><dt>License:</dt><dd>MIT</dd></div><div><dt>Source</dt><dd><A to="https://github.com/hanzoai/bot" className="bt-src">hanzoai/bot</A> <span className="x-mono bt-star"><svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M8 1.5l1.9 4 4.3.5-3.2 2.9.9 4.3L8 11l-3.9 2.2.9-4.3L1.8 6l4.3-.5z" fill="currentColor" /></svg>5 stars</span></dd></div></dl>
            <Cta to="https://platform.hanzo.ai/deploy" kind="link" id="bot-deploy">Deploy to Cloud</Cta>
          </div>
        </div>
        <div className="bt-rel">
          <p className="x-mono bt-cap">Related capabilities</p>
          {[['/cloud/chat', 'Chat', 'Conversational AI'], ['/search', 'Search', 'Retrieval & answers'], ['/crawl', 'Crawl', 'Web crawler']].map(([to, t, d]) => (
            <A key={t} to={to} className="bt-rel-a"><b>{t}</b><span>{d}</span><i aria-hidden="true">→</i></A>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- the one closing Band ---------- */
function Close() {
  const ref = useRef<HTMLElement>(null);
  const calm = useCalm(); // after mount only, so the server's clip-path and the first client render match
  // the black room arrives as a rounded card inside the gutters and opens to the full width as it is reached
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.2'] });
  const clip = useTransform(scrollYProgress, [0, 1], ['inset(0% 3% 0% 3% round 24px)', 'inset(0% 0% 0% 0% round 0px)']);
  return (
    <motion.section ref={ref} className="x-band bt-band" data-room="dark" style={calm ? undefined : { clipPath: clip }}>
      <div className="av-wrap">
        <span className="bt-meet-f" aria-hidden="true">{CREW.map(([id]) => <Face key={id} size={44} id={id} />)}</span>
        <h2 className="bt-band-h">Meet your first bot</h2>
        <p>A teammate you can trust with real work.</p>
        <div className="x-band-act">
          <Cta to="/login" id="bot-band-try" size="lg">Try Hanzo</Cta>
          <Cta to="/contact-sales" kind="link" id="bot-band-sales">Contact sales</Cta>
        </div>
      </div>
    </motion.section>
  );
}

export default function Bot() {
  const main = useRef<HTMLElement>(null);
  useEntrances(main); // the five page-local entrances (components/pages/bot/enter.js)
  return (
    <main ref={main} className="av bt" style={{ '--ac': '#0a0a0a' }}>
      <Hero />
      <Ask />
      <Cases />
      <Chapters />
      <Tools />
      <Install />
      <Pricing />
      <More2 />
      <Close />
    </main>
  );
}
