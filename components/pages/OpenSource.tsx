'use client';
// Persona: a developer, contributor or researcher checking how much of Hanzo is open and where to contribute (arrives from the header, GitHub or /oss)
// Goal: see the scale of what Hanzo publishes, open an organization, and go to Hanzo's GitHub
// CTA: View on GitHub -> https://github.com/hanzoai (hero, header thumb bar; the closing band keeps Hanzo's "Start Contributing") · data-cta="open-source.hero", "open-source.band"
// Metric: github_click (MASTER §1, researchers: a GitHub or weights click)
// Signature: h-gallery Sideways gallery. "What Hanzo is built on" is the second screen: on desktop vertical scroll drives its twelve credit panels sideways for one stretch, then releases; on phones it is a native snap rail with a 16% peek. The glyph row above marks the panel in view and jumps to a panel on a press.
// Beyond: "Contribute in your language". Pick a language: the featured repositories written in it across Hanzo, Lux and Zoo, and its share of each ecosystem's repositories, from Hanzo's own language shares.
/* Open source. Its idea is the scale of it, made literal: a catalogue of 2,247 repositories you can open.
   V2: 8/10 Motion map: h-gallery — "Built on" moved up to the second screen as a scroll-driven sideways track (phone snap rail); sticky Totals/Charter/Contribute columns, line masks, list rises and the invented "Article" labels removed; five entrances (snap-sections, magnet-gather, scroll-tilt, letter-cascade, ripple); glyphs in colour; phone pause moved off the figures.
   Before: Round 2: the list rise (xos-in) now lands on opacity 1, so Totals with its count-up, all six charter articles and the Contribute repositories show at both sizes; hero lede white 78% on black; hero 1,733 rests at 64px so the h1 is the one big thing; one ask per screen (the local band drops its GitHub button on desktop, the band carries data-thumb); "Built on" gains a monochrome mark row of Hanzo's twelve glyphs that lights the credit under the pointer, two credits a row on phone; secondary links and the sheet trigger answer hover with a fill, closing ask hovers #262626; tighter seams between paper sections. Copy rule: every invented string removed (the pointer hint, the "Charter" caption, card index numbers, composed sheet labels and share sentences, typed arrows and star/fork glyphs now drawn as icons, invented aria-labels); sheets open from "Read more" (ui-strings).
   Supporting: the sky drifting and twinkling by itself (idle), the ecosystem and galaxy tabs whose pill glides while
   the year of commits re-lights cell by cell (state), and the charter signed with a drawn line (arrival).
   Every figure is Hanzo's, as its build read GitHub and its forge. */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, FocusEvent as RFocusEvent, KeyboardEvent as RKeyboardEvent, PointerEvent as RPointerEvent } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { A, More } from '../kit';
import { Count } from '../ui';
import { href } from '../../lib/route';
import DetailSheet from '../v2/x-pascal/DetailSheet';
import { SnapIn, Gather, Tilt, Cascade, Ripple } from './openSource/entrances';
import SNAP from './openSource/snapshot';
import { OSSData, useOSS } from './openSource/live';
import type { SnapEcosystem, SnapOrg } from './openSource/types.ts';
import '../v2/ProofRhythm.css';
import './OpenSource.css';

const EMPH: [number, number, number, number] = [0.16, 1, 0.3, 1];
const PILL = { duration: 0.3, ease: EMPH };
/* a card leans toward the pointer, 2.5° at most (MASTER §3.1), fine pointers only */
const lean = (e: RPointerEvent<HTMLElement>) => {
  if (e.pointerType !== 'mouse') return;
  const el = e.currentTarget, r = el.getBoundingClientRect();
  el.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 5).toFixed(2) + 'deg');
  el.style.setProperty('--rx', ((0.5 - (e.clientY - r.top) / r.height) * 5).toFixed(2) + 'deg');
};
const rest = (e: RPointerEvent<HTMLElement>) => { e.currentTarget.style.setProperty('--rx', '0deg'); e.currentTarget.style.setProperty('--ry', '0deg'); };

/* stars and forks are drawn beside Hanzo's figures, never typed as glyphs */
const Star = () => <svg className="xos-ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5l1.9 4 4.4.5-3.3 3 .9 4.4L8 11.2l-3.9 2.2.9-4.4-3.3-3 4.4-.5z" fill="currentColor" /></svg>;
const Fork = () => <svg className="xos-ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 3v2.5c0 1.4 1.1 2.5 2.5 2.5h2c1.4 0 2.5-1.1 2.5-2.5V3M8 8v5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="4.5" cy="2.5" r="1.3" fill="currentColor" /><circle cx="11.5" cy="2.5" r="1.3" fill="currentColor" /><circle cx="8" cy="13.5" r="1.3" fill="currentColor" /></svg>;

const num = (s: string | number) => parseInt(String(s).replace(/,/g, ''), 10) || 0;
const NAMES = ['Hanzo', 'Lux', 'Zoo'];
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* ---------- the constellation ---------- */
type Cluster = SnapOrg & { g: string; x: number; y: number; r: number; n: number };
type Dot = [number, number, number, number, number]; // x, y, light, twinkle phase, cluster

function build() {
  const centers = [[0, 0], [-380, -260], [330, 290]]; // Hanzo, Lux above-left of it, Zoo below-right
  const clusters: Cluster[] = [], dots: Dot[] = [];
  SNAP.orgs.forEach((g, gi) => {
    const placed: { x: number; y: number; r: number }[] = [];
    [...g.orgs].sort((a, b) => num(b.repos) - num(a.repos)).forEach((o) => {
      const n = num(o.repos), r = Math.sqrt(n) * 5.2 + 7;
      let x = 0, y = 0;
      for (let k = 0; k < 6000; k++) {
        const a = k * 0.42, d = Math.sqrt(k) * 9;
        x = Math.cos(a) * d; y = Math.sin(a) * d * 0.82;
        if (placed.every((p) => Math.hypot(p.x - x, p.y - y) > p.r + r + 7)) break;
      }
      placed.push({ x, y, r });
      const cx = centers[gi][0] + x, cy = centers[gi][1] + y;
      const lit = Math.min(3, Math.floor(Math.log10(num(o.commits) + 1)));
      clusters.push({ ...o, g: g.name, x: cx, y: cy, r, n });
      const sp = (r - 3) / Math.sqrt(n);
      for (let i = 0; i < n; i++) {
        const rr = sp * Math.sqrt(i + 0.5), th = i * 2.39996;
        dots.push([cx + Math.cos(th) * rr, cy + Math.sin(th) * rr, lit, (i * 7919) % 97, clusters.length - 1]);
      }
    });
  });
  const gal = SNAP.orgs.map((g, gi) => {
    const mine = clusters.filter((c) => c.g === g.name);
    const top = Math.min(...mine.map((c) => c.y - c.r));
    return { name: g.name, sub: g.sub, x: centers[gi][0], y: top - 26 };
  });
  return { clusters, dots, gal };
}

/* The sky. On arrival the camera pulls back from inside Hanzo to all three galaxies (2.8s, once); then it drifts. */
interface SkyState {
  ox: number; oy: number; vx: number; vy: number; drag: { x: number; y: number } | null; moved: number; hot: number;
  s: number; z: number; w: number; h: number; t: number; cx: number; cy: number; phone: boolean; base: number; redraw?: () => void;
}

function Sky({ paused = false }: { paused?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const labs = useRef<(HTMLDivElement | null)[]>([]);
  const hotEl = useRef<HTMLDivElement>(null);
  const world = useMemo(build, []);
  const live = useInView(wrap, { amount: 0.05 });
  const calm = useReducedMotion();
  const [hot, setHot] = useState<Cluster | null>(null);
  const st = useRef<SkyState>({ ox: 0, oy: 0, vx: 0, vy: 0, drag: null, moved: 0, hot: -1, s: 1, z: 1, w: 0, h: 0, t: 0, cx: 0, cy: 0, phone: false, base: 0 });
  const born = useRef(0);

  useEffect(() => {
    const c = cv.current, wr = wrap.current;
    if (!c || !wr) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const S = st.current;
    const fit = () => {
      const b = wr.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
      S.w = b.width; S.h = b.height;
      c.width = b.width * dpr; c.height = b.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      S.phone = b.width < 700;
      S.base = S.phone ? b.width / 980 : Math.min(b.width / 1500, b.height / 880);
    };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(wr);
    const shades = ['rgba(245,245,247,.26)', 'rgba(245,245,247,.5)', 'rgba(245,245,247,.76)', 'rgba(255,255,255,.98)'];
    const draw = (t: number) => {
      S.t = t;
      if (!S.drag) { S.ox += S.vx; S.oy += S.vy; S.vx *= 0.93; S.vy *= 0.93; }
      // the camera: close inside Hanzo, pulling back to the three galaxies once, on arrival
      if (!born.current && t) born.current = t;
      const e = calm || !t ? 1 : ease(clamp((t - born.current - 250) / 2800));
      S.z = (S.phone ? 1.05 : 0.62) + (S.phone ? 0.9 : 1.4) * (1 - e);
      S.s = S.base * S.z;
      S.cx = S.w * (S.phone ? 0.5 : 0.7);
      S.cy = S.h * (S.phone ? 0.5 : 0.44);
      const drift = calm ? 0 : Math.sin(t / 5200) * 14, s = S.s;
      const X = (x: number) => S.cx + (x + S.ox + drift) * s, Y = (y: number) => S.cy + (y + S.oy + Math.cos(t / 6100) * 8 * (calm ? 0 : 1)) * s;
      ctx.clearRect(0, 0, S.w, S.h);
      const sz = Math.max(1.2, 2.1 * S.base * Math.sqrt(S.z));
      const big = sz * 1.5;
      for (let lv = 0; lv < 5; lv++) {
        ctx.fillStyle = lv === 4 ? '#ffffff' : shades[lv];
        for (const d of world.dots) {
          const tw = calm ? 0 : ((Math.floor(t / 900 + d[3]) % 9) === 0 ? 1 : 0);
          const on = S.hot === d[4] ? 4 : Math.min(3, d[2] + tw);
          if (on !== lv) continue;
          const q = lv === 4 ? big : sz;
          ctx.fillRect(X(d[0]) - q / 2, Y(d[1]) - q / 2, q, q);
        }
      }
      if (S.hot >= 0) {
        const h = world.clusters[S.hot];
        ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(X(h.x), Y(h.y), h.r * s + 6, 0, Math.PI * 2); ctx.stroke();
      }
      const lo = clamp((e - 0.6) / 0.4);
      world.gal.forEach((g, i) => { const el = labs.current[i]; if (el) { el.style.transform = `translate(${X(g.x)}px, ${Y(g.y) - 30}px)`; el.style.opacity = String(lo); } });
      if (hotEl.current && S.hot >= 0) { const h = world.clusters[S.hot]; hotEl.current.style.transform = `translate(${X(h.x)}px, ${Y(h.y) - h.r * s - 14}px)`; }
    };
    let raf = 0;
    const loop = (t: number) => { draw(t); raf = requestAnimationFrame(loop); };
    if (live && !calm && !paused) raf = requestAnimationFrame(loop); else draw(S.t || 0);
    S.redraw = () => draw(S.t);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [live, calm, world, paused]);

  const pick = (e: RPointerEvent<HTMLCanvasElement>) => {
    const S = st.current, canvas = cv.current;
    if (!canvas) return -1;
    const b = canvas.getBoundingClientRect();
    const drift = calm ? 0 : Math.sin(S.t / 5200) * 14;
    const wx = (e.clientX - b.left - S.cx) / S.s - S.ox - drift, wy = (e.clientY - b.top - S.cy) / S.s - S.oy;
    let best = -1, bd = 1e9;
    world.clusters.forEach((c, i) => { const d = Math.hypot(c.x - wx, c.y - wy); if (d < c.r + 10 && d < bd) { bd = d; best = i; } });
    return best;
  };
  const down = (e: RPointerEvent<HTMLCanvasElement>) => { const S = st.current; S.drag = { x: e.clientX, y: e.clientY }; S.moved = 0; S.vx = S.vy = 0; };
  const move = (e: RPointerEvent<HTMLCanvasElement>) => {
    const S = st.current;
    if (S.drag) {
      const dx = (e.clientX - S.drag.x) / S.s, dy = (e.clientY - S.drag.y) / S.s;
      S.ox += dx; S.oy += dy; S.vx = dx * 0.6; S.vy = dy * 0.6; S.moved += Math.abs(dx) + Math.abs(dy);
      S.drag = { x: e.clientX, y: e.clientY };
      if (S.moved > 3 && e.pointerType === 'mouse') e.currentTarget.setPointerCapture?.(e.pointerId);
      if (calm || paused) S.redraw?.();
      return;
    }
    const i = pick(e);
    if (i !== S.hot) { S.hot = i; setHot(i >= 0 ? world.clusters[i] : null); if (calm || paused) S.redraw?.(); }
  };
  const up = (e: RPointerEvent<HTMLCanvasElement>) => {
    const S = st.current, was = S.drag; S.drag = null;
    if (was && S.moved < 6) { const i = pick(e); if (i >= 0) window.location.assign(href('/oss/' + world.clusters[i].login)); }
  };
  return (
    <div className="xos-sky" ref={wrap}>
      <canvas ref={cv} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={() => { st.current.drag = null; st.current.hot = -1; setHot(null); }}
        aria-hidden="true" />
      {world.gal.map((g, i) => (
        <div key={g.name} className="xos-gal" ref={(el) => { labs.current[i] = el; }} aria-hidden="true"><b>{g.name}</b><span>{g.sub}</span></div>
      ))}
      <div className={'xos-tip' + (hot ? ' on' : '')} ref={hotEl} aria-hidden="true">
        {hot && <><b>{hot.name}</b><span>{hot.login} · {hot.repos}{hot.commits ? ' · ' + hot.commits : ''}</span></>}
      </div>
    </div>
  );
}

/* ---------- hero: the sky, and the count ---------- */
function Hero() {
  const { hero } = useOSS();
  const [held, setHeld] = useState(false);
  return (
    <section className="xos-hero" data-room="dark" aria-labelledby="xos-h1">
      <button type="button" className="xos-pause" aria-label="Pause" aria-pressed={held} onClick={() => setHeld((v) => !v)}>
        {held
          ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9l7-4.5z" fill="currentColor" /></svg>
          : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>}
      </button>
      <Sky paused={held} />
      <div className="pf-wrap xos-hero-c">
        <div className="xos-hero-a">
          <h1 id="xos-h1" className="pf-display xos-h1"><span className="xos-ln"><span>Building in the</span></span><br /><span className="xos-ln"><span>open.</span></span></h1>
          <p className="xos-cap">Open Source First</p>
          <p className="pf-lede xos-lede">We publish what we build, fix the bugs we find upstream instead of patching them in private, and pay the projects we depend on. The commitments below are specific enough to hold us to.</p>
          <div className="xos-acts">
            <A to="https://github.com/hanzoai" className="pf-btn xos-btn-l" data-thumb="View on GitHub" data-cta="open-source.hero">View on GitHub</A>
            <More to="https://docs.hanzo.ai/docs/self-hosting">Self-Host Quickstart</More>
          </div>
        </div>
        <div className="xos-hero-b">
          <dl className="xos-hstats">
            {hero.map(([v, k], i) => (
              <div key={k} className={i ? '' : 'xos-hs-m'}><dd className={i ? '' : 'pf-figure'}>{v}</dd><dt>{k}</dt></div>
            ))}
          </dl>        </div>
      </div>
    </section>
  );
}

/* ---------- the sticky local band: the page's name, the live read, the ask (quiet; the solid stays in the hero) ---------- */
function Local() {
  const { eco } = useOSS();
  return (
    <div className="xos-local">
      <div className="pf-wrap xos-local-in">
        <span className="xos-local-t"><span className="xos-dash-dot" aria-hidden="true" /><span className="pf-mono">Open Source First</span></span>
        <span className="pf-mono xos-local-r">{eco[0].read}</span>
        <A to="https://github.com/hanzoai" className="pf-btn xos-local-a" data-cta="open-source.sticky">View on GitHub</A>
      </div>
    </div>
  );
}

/* ---------- what we publish: one chapter per ecosystem ---------- */
const MONTHS = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
// the language greys, ink first; in dark the ramp turns over onto Hanzo's neutrals so the first stays the brightest
const LANGC = ['light-dark(#0a0a0a, var(--neutral-200))', 'light-dark(#404040, var(--neutral-300))', 'light-dark(#737373, var(--neutral-400))', 'light-dark(#a3a3a3, var(--neutral-500))', 'light-dark(#d4d4d4, var(--neutral-600))', 'light-dark(#e4e4e7, var(--neutral-700))'];

function Dash({ at }: { at: number }) {
  const e = useOSS().eco[at];
  let left = 0;
  const segs = e.langs.map(([l, pc], j) => { const s = { l, t: pc, pc: +pc, left, c: LANGC[j] }; left += +pc; return s; });
  return (
    <figure className="pf-obj xos-dash">
      <header className="xos-dash-h">
        <span className="xos-dash-dot" aria-hidden="true" />
        <b>{NAMES[at]}</b>
        <span className="pf-mono">{e.read}</span>
      </header>
      <div className="xos-heat">
        <div className="xos-heat-m" aria-hidden="true">{MONTHS.map((m, i) => <span key={i}>{m}</span>)}</div>
        <div className="xos-heat-g" role="img" aria-label={e.window}>
          {[...e.heat].map((c, i) => <i key={i} data-l={c} style={{ '--d': Math.floor(i / 7) * 9 + 'ms' } as CSSProperties} />)}
        </div>
        <div className="xos-heat-f">
          <span>Commits a day</span>
          <span className="xos-leg" aria-hidden="true"><span>Less</span>{[0, 1, 2, 3, 4].map((l) => <i key={l} data-l={l} />)}<span>More</span></span>
        </div>
        <p className="pf-mono xos-heat-w">{e.window}</p>
      </div>
      <div className="xos-lang">
        <div className="xos-lbar" aria-hidden="true">{segs.map((s, j) => <i key={j} style={{ transform: `translateX(${s.left}%) scaleX(${s.pc / 100})`, background: s.c }} />)}</div>
        <ul className="xos-langs">{segs.map((s, j) => <li key={at + s.l} style={{ '--j': j } as CSSProperties}><i style={{ background: s.c }} /><span>{s.l} {s.t}%</span></li>)}</ul>
      </div>
      <ol className="xos-dash-c">
        {e.commits.slice(0, 3).map(([repo, msg, when, to], j) => (
          <li key={at + to} style={{ '--j': j } as CSSProperties}><A to={to}><span className="pf-mono xos-c-r">{repo}</span><span className="xos-c-m">{msg}</span><span className="pf-mono xos-c-t">{when}</span></A></li>
        ))}
      </ol>
    </figure>
  );
}

function EcoSheet({ e, i }: { e: SnapEcosystem; i: number }) {
  const { orgs } = useOSS();
  return (
    <DetailSheet label="Read more" kicker={orgs[i].sub} title={NAMES[i]} wide>
      <h3>Commits a day</h3>
      <p className="xos-sh-note">{e.window}</p>
      <h3>Latest commits</h3>
      <ol className="xos-sh-commits">
        {e.commits.map(([repo, msg, when, to]) => (
          <li key={to}><A to={to}><span className="pf-mono">{repo}</span><span>{msg}</span><span className="pf-mono">{when + ' UTC'}</span></A></li>
        ))}
      </ol>
      <p className="xos-sh-note"><span>{e.read}</span> · <A to={e.readTo}>Read the source</A></p>
      <h3>What it is written in</h3>
      <ul className="xos-sh-langs">{e.langs.map(([l, pc], j) => <li key={l}><i style={{ background: LANGC[j] }} /><span>{l} {pc}%</span></li>)}</ul>
      <p className="xos-sh-note">{e.langCap}</p>
      <h3>Repositories</h3>
      <ul className="xos-sh-repos">
        {e.repos.map((r) => (
          <li key={r.name}>
            <A to={r.to}>
              <span className="pf-mono xos-sh-n">{r.name}</span>
              <span className="xos-sh-d">{r.desc}</span>
              <span className="xos-sh-m pf-mono">
                <span>{r.lang}</span><span><Star />{r.stars}</span><span><Fork />{r.forks}</span>
                <span className="xos-av" aria-hidden="true">{[...r.av].map((a, k) => <i key={k}>{a}</i>)}{r.more && <i className="m">{r.more}</i>}</span>
              </span>
              <span className="xos-sh-f">{r.people} · {r.commits} · {r.pushed}</span>
            </A>
          </li>
        ))}
      </ul>
    </DetailSheet>
  );
}

function Publish() {
  const { eco: ECO, orgs: ORGS } = useOSS();
  const [at, setAt] = useState(0);
  const swapped = useRef(false);
  if (at) swapped.current = true;
  const keys = (e: RKeyboardEvent<HTMLDivElement>) => {
    const k = ({ ArrowRight: 1, ArrowLeft: -1 } as Record<string, number | undefined>)[e.key];
    if (!k) return;
    const n = (at + k + 3) % 3;
    setAt(n);
    document.getElementById('xos-t-' + n)?.focus();
  };
  return (
    <section className={'pf-sec xos-pub' + (swapped.current ? ' sw' : '')} id="publish" aria-labelledby="xos-pub-h">
      <SnapIn className="pf-wrap">
        <div className="pf-grid xos-pub-top">
          <h2 id="xos-pub-h" className="pf-head xos-pub-h">What we publish</h2>
          <p className="pf-lede xos-pub-l">Read from GitHub by every build: the year of commits, the languages and the repositories of each ecosystem, then every organization.</p>
        </div>
        <div className="xos-eco" role="tablist" aria-label="Ecosystem" onKeyDown={keys}>
          {NAMES.map((n, i) => (
            <button key={n} id={'xos-t-' + i} type="button" role="tab" aria-selected={at === i} aria-controls={'xos-p-' + i} tabIndex={at === i ? 0 : -1} onClick={() => setAt(i)}>
              {at === i && <motion.span layoutId="xos-eco-pill" className="xos-pill" transition={PILL} />}
              <span className="xos-eco-n">{n}</span><span className="pf-mono">{ECO[i].stats[3][1]}</span>
            </button>
          ))}
        </div>
        <div className="pf-grid xos-pub-g">
          <div className="xos-pub-a">
            {ECO.map((e, i) => (
              <div key={i} id={'xos-p-' + i} role="tabpanel" aria-labelledby={'xos-t-' + i} hidden={at !== i} className="xos-panel">
                <h3 className="pf-title xos-eco-h">{NAMES[i]}</h3>
                <p className="xos-cap">{ORGS[i].sub}</p>
                <ul className="xos-stats">
                  {e.stats.map(([k, v, sub], j) => (
                    <li key={j}><A to={e.statTo[j]}><span className="pf-mono xos-st-v">{v}</span><span className="xos-st-k">{k}</span><span className="xos-st-s">{sub}</span></A></li>
                  ))}
                </ul>
                <EcoSheet e={e} i={i} />
              </div>
            ))}
          </div>
          <div className="xos-pub-b"><Dash at={at} /></div>
        </div>
      </SnapIn>
    </section>
  );
}

/* ---------- the total, as figures ---------- */
function Totals() {
  const { total } = useOSS();
  return (
    <section className="pf-sec xos-total">
      <div className="pf-wrap pf-grid">
        <header className="xos-total-h">
          <h2 className="pf-head">Total across Hanzo</h2>
          <p className="pf-body">Aggregate open-source activity counted from the forge and GitHub.</p>
          <p className="xos-grants"><A to="/grants">OSS &amp; research credit grants</A></p>
        </header>
        <Gather className="xos-total-n" items={total}
          render={([v, k], i, style) => <li key={k} style={style}><span className={i ? 'pf-num xos-tot-s' : 'pf-moment'}>{i ? v : <Count to={num(v)} duration={1.2} />}</span><span>{k}</span></li>} />
      </div>
    </section>
  );
}

/* an organization's commits a month over the past year, the months Hanzo's build counts (13, the first and last partial) */
function Months({ m }: { m?: number[] }) {
  if (!m || !m.length) return null;
  const max = Math.max(1, ...m);
  return (
    <span className="xos-oc-mo" role="img" aria-label="Commits a month over the past year">
      {m.map((v, k) => <i key={k} data-z={v ? undefined : ''} style={{ '--h': v ? Math.max(0.08, v / max) : 0.06, '--k': k } as CSSProperties} />)}
    </span>
  );
}

/* ---------- every organization: cards that open ---------- */
function Orgs() {
  const { orgs: ORGS } = useOSS();
  const [g, setG] = useState(0);
  const keys = (e: RKeyboardEvent<HTMLDivElement>) => {
    const k = ({ ArrowRight: 1, ArrowLeft: -1 } as Record<string, number | undefined>)[e.key];
    if (!k) return;
    const n = (g + k + 3) % 3;
    setG(n);
    document.getElementById('xos-og-' + n)?.focus();
  };
  return (
    <section className="pf-sec xos-orgs" aria-labelledby="xos-orgs-h">
      <div className="pf-wrap">
        <div className="xos-orgs-top">
          <h2 id="xos-orgs-h" className="pf-head">Every organization</h2>
          <div className="xos-chips" role="tablist" aria-label="Ecosystem" onKeyDown={keys}>
            {ORGS.map((x, i) => (
              <button key={x.name} id={'xos-og-' + i} type="button" role="tab" aria-selected={g === i} aria-controls={'xos-op-' + i} tabIndex={g === i ? 0 : -1} onClick={() => setG(i)}>
                {g === i && <motion.span layoutId="xos-org-pill" className="xos-pill" transition={PILL} />}
                <span className="xos-eco-n">{x.name}</span><span className="pf-mono">{x.orgs.length}</span>
              </button>
            ))}
          </div>
        </div>
        <Tilt>
        {ORGS.map((x, i) => {
          const top = [...x.orgs].sort((a, b) => num(b.repos) - num(a.repos)).slice(0, 8);
          const max = num(top[0].repos);
          return (
            <div key={x.name} id={'xos-op-' + i} role="tabpanel" aria-labelledby={'xos-og-' + i} hidden={g !== i} className="xos-opanel">
              <p className="xos-gal-sub pf-mono">{x.sub}</p>
              <ul className="xos-ocards">
                {top.map((o, j) => (
                  <li key={o.login} style={{ '--k': j } as CSSProperties}>
                    <A to={'/oss/' + o.login} className="xos-ocard" onPointerMove={lean} onPointerLeave={rest}>
                      <span className="xos-oc-top"><span className="xos-oc-name" data-morph>{o.name}</span><span className="pf-mono xos-oc-login">{o.login}</span></span>
                      <span className="xos-oc-n">{o.repos}</span>
                      <span className="xos-oc-bar" aria-hidden="true"><i style={{ transform: `scaleX(${Math.max(0.02, num(o.repos) / max)})` }} /></span>
                      <Months m={o.months} />
                      <span className="xos-oc-f pf-mono"><span>{o.commits || ''}</span><span><Star />{o.stars}</span></span>
                      {o.desc && <span className="xos-oc-d">{o.desc}</span>}
                      <span className="xos-oc-go" aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                    </A>
                  </li>
                ))}
              </ul>
              <DetailSheet label="Read more" kicker={x.sub} title={x.name}>
                <ol className="xos-sh-orgs">
                  {x.orgs.map((o) => (
                    <li key={o.login}>
                      <A to={'/oss/' + o.login}>
                        <span><span className="xos-sh-on">{o.name}</span><span className="pf-mono xos-sh-ol">{o.login}</span></span>
                        <span className="pf-mono">{o.repos}</span>
                        <span className="pf-mono">{o.commits || ''}</span>
                        <span className="pf-mono"><Star />{o.stars}</span>
                        {o.desc && <span className="xos-sh-d">{o.desc}</span>}
                      </A>
                    </li>
                  ))}
                </ol>
              </DetailSheet>
            </div>
          );
        })}
        </Tilt>
      </div>
    </section>
  );
}

/* ---------- what Hanzo is built on: the sideways gallery (signature) ---------- */
const BUILT = [
  ['🐍', 'Python', 'https://github.com/python/cpython', 'Python Software Foundation', 'https://python.org', 'The language powering our ML/AI stack', 'PSF'],
  ['⚙️', 'Rust', 'https://github.com/rust-lang/rust', 'Rust Foundation', 'https://rust-lang.org', 'Systems language for our high-performance runtimes', 'MIT/Apache-2.0'],
  ['🐹', 'Go', 'https://github.com/golang/go', 'Go Authors / Google', 'https://go.dev', 'Powers our gateway, blockchain, and infra tooling', 'BSD-3-Clause'],
  ['🔷', 'TypeScript', 'https://github.com/microsoft/TypeScript', 'Microsoft', 'https://typescriptlang.org', 'The backbone of our developer SDKs and web apps', 'Apache-2.0'],
  ['⚛️', 'React', 'https://github.com/react/react', 'Meta Open Source', 'https://react.dev', 'Powering every UI we ship', 'MIT'],
  ['▲', 'Next.js', 'https://github.com/vercel/next.js', 'Vercel', 'https://nextjs.org', 'Every hanzo.ai product is built on Next.js', 'MIT'],
  ['🐘', 'PostgreSQL', 'https://github.com/postgres/postgres', 'PostgreSQL Global Development Group', 'https://postgresql.org', 'The database underlying all our stateful services', 'PostgreSQL License'],
  ['🔴', 'Redis', 'https://github.com/redis/redis', 'Redis Ltd. / Salvatore Sanfilippo', 'https://redis.io', 'Fast caching and pub/sub throughout our platform', 'BSD-3-Clause'],
  ['🔥', 'PyTorch', 'https://github.com/pytorch/pytorch', 'Meta AI Research', 'https://pytorch.org', 'Foundation of our ML training and inference', 'BSD-3-Clause'],
  ['☸️', 'Kubernetes', 'https://github.com/kubernetes/kubernetes', 'CNCF / Google', 'https://kubernetes.io', 'Orchestrates every workload in production', 'Apache-2.0'],
  ['🐳', 'Docker', 'https://github.com/moby/moby', 'Docker / Moby Project', 'https://docker.com', 'Containers make our MCP tools portable', 'Apache-2.0'],
  ['📊', 'OpenTelemetry', 'https://github.com/open-telemetry/opentelemetry-specification', 'CNCF', 'https://opentelemetry.io', 'Observability across every service', 'Apache-2.0'],
];

/* Desktop (fine pointer room, motion allowed): the section is as tall as the track is wide; its stage sticks for that
   stretch and the scroll position moves the track sideways, then the page releases. Phone and reduced motion: the
   same track is a native horizontal snap rail. The height lives in CSS, so nothing reflows when JS arrives. */
const PINNED = '(min-width: 900px) and (prefers-reduced-motion: no-preference)';
const goTo = (y: number) => (window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y));

/* the object: Hanzo's own twelve glyphs as one mark row, drawn in ink (text presentation where the glyph has one, a flat
   silhouette where it has not); the glyph itself stays readable as text. It marks the panel in view and the credit under the pointer */
function Built() {
  const sec = useRef<HTMLElement>(null), stage = useRef<HTMLDivElement>(null), track = useRef<HTMLUListElement>(null);
  const [hot, setHot] = useState(-1);
  const [cur, setCur] = useState(0);
  useEffect(() => {
    const mq = matchMedia(PINNED);
    const S = sec.current, T = track.current, G = stage.current;
    if (!S || !T || !G) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const lis = T.children as HTMLCollectionOf<HTMLElement>, step = lis.length > 1 ? lis[1].offsetLeft - lis[0].offsetLeft : 1;
      if (!mq.matches) { T.style.transform = ''; setCur(Math.round(T.scrollLeft / step)); return; }
      const r = S.getBoundingClientRect(), run = r.height - innerHeight;
      const p = run > 0 ? clamp(-r.top / run) : 0;
      const dist = Math.max(0, T.scrollWidth - G.clientWidth);
      T.style.transform = `translate3d(${(-p * dist).toFixed(1)}px, 0, 0)`;
      setCur(Math.round(p * (lis.length - 1)));
    };
    const ask = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener('scroll', ask, { passive: true });
    window.addEventListener('resize', ask);
    T.addEventListener('scroll', ask, { passive: true });
    mq.addEventListener('change', ask);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', ask); window.removeEventListener('resize', ask); T.removeEventListener('scroll', ask); mq.removeEventListener('change', ask); };
  }, []);
  /* bring panel i into view: on desktop by scrolling the page to its stretch, on the rail by scrolling the rail */
  const show = (i: number, smooth: boolean) => {
    const S = sec.current, T = track.current, G = stage.current;
    if (!S || !T || !G) return;
    const li = T.children[i] as HTMLElement | undefined;
    if (!li) return;
    if (!matchMedia(PINNED).matches) { T.scrollTo({ left: li.offsetLeft - parseFloat(getComputedStyle(T).scrollPaddingLeft || '0'), behavior: smooth ? 'smooth' : 'auto' }); return; }
    const dist = Math.max(1, T.scrollWidth - G.clientWidth);
    const want = Math.max(0, Math.min(dist, li.offsetLeft + li.offsetWidth / 2 - G.clientWidth / 2));
    const top = S.getBoundingClientRect().top + scrollY, run = S.offsetHeight - innerHeight;
    const y = top + (want / dist) * run;
    if (smooth && window.__lenis) window.__lenis.scrollTo(y, { duration: 0.9 }); else if (smooth) window.scrollTo({ top: y, behavior: 'smooth' }); else goTo(y);
  };
  /* keyboard: tabbing to a credit's link scrolls the page so its panel is in the stage */
  const focus = (e: RFocusEvent<HTMLUListElement>) => {
    const li = e.target.closest('.xos-tile'), T = track.current;
    if (!li || !T || !matchMedia(PINNED).matches) return;
    const i = [...T.children].indexOf(li);
    requestAnimationFrame(() => show(i, false));
  };
  return (
    <section className="xos-built xos-hg" ref={sec} aria-labelledby="xos-built-h">
      <div className="xos-hg-stage" ref={stage}>
        <div className="pf-wrap">
          <div className="xos-built-top">
            <h2 id="xos-built-h" className="pf-head">What Hanzo is built on</h2>
            <p className="pf-body">The projects our platform actually runs on, each with its licence and the people who maintain it.</p>
          </div>
          <ul className={'xos-marks' + (hot >= 0 ? ' has-hot' : '')}>
            {BUILT.map(([ic, name], i) => (
              <li key={name} className={(hot === i ? 'on' : '') + (cur === i ? ' cur' : '')} onClick={() => show(i, true)}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setHot(i)} onPointerLeave={() => setHot(-1)}><span className="x-sr">{ic}</span><span aria-hidden="true">{ic.replace('\uFE0F', '\uFE0E')}</span></li>
            ))}
          </ul>
        </div>
        <ul className="xos-tiles xos-track" ref={track} onFocus={focus} onPointerLeave={() => setHot(-1)} onBlur={() => setHot(-1)}>
          {BUILT.map(([ic, name, repo, who, site, what, lic], i) => (
            <li key={name} className={'xos-tile' + (hot === i ? ' hot' : '')} onPointerMove={lean} onPointerLeave={rest} onPointerEnter={(e) => e.pointerType === 'mouse' && setHot(i)} onFocus={() => setHot(i)}>
              <span className="xos-tile-lic pf-mono">{lic}</span>
              <A to={repo} className="xos-tile-n">{name}</A>
              <span className="xos-tile-d">{what}</span>
              <A to={site} className="xos-tile-w">{who}</A>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- the charter, signed ---------- */
const CHARTER = [
  ['We ship open source first', "Every tool we build for ourselves gets published. If it's useful to us, it belongs to the community. No internal-only forks."],
  ['We contribute upstream', 'When we find bugs or missing features in projects we depend on, we fix them upstream — not in private patches.'],
  ['We never lock in what we open', 'Anything published under MIT or Apache-2.0 stays that way. We will never relicense open repos to extract commercial value.'],
  ['We credit our foundations', 'Our platform is built on hundreds of open-source projects. We acknowledge, link to, and financially support the communities and maintainers who make this possible.'],
  ['We fund what we depend on', 'Through GitHub Sponsors, Open Collective, and direct partnerships, we invest back into the projects that power Hanzo.'],
  ['We welcome all contributors', 'Good code can come from anywhere. We maintain a contributor-friendly CONTRIBUTING.md, respond to PRs within 48 hours on active repos, and recognize every contributor.'],
];
function Charter() {
  const end = useRef<HTMLDivElement>(null);
  const signed = useInView(end, { once: true, amount: 0.6 });
  return (
    <section className="pf-sec xos-charter" aria-labelledby="xos-ch-h">
      <div className="pf-wrap pf-grid">
        <header className="xos-ch-h">
          <Cascade id="xos-ch-h" className="pf-head" text="Our Stewardship Commitments" />
          <p className="pf-lede">We hold ourselves to explicit, public commitments — not vague marketing language.</p>
        </header>
        <div className="xos-ch-body">
          <ol className="xos-arts">
            {CHARTER.map(([t, d]) => (
              <li key={t}>
                <h3 className="pf-title">{t}</h3>
                <p className="pf-body">{d}</p>
              </li>
            ))}
          </ol>
          <div className="xos-sign" ref={end} aria-hidden="true">
            <svg viewBox="0 0 320 90" width="320" height="90">
              <motion.path d="M10 62c18-30 34-44 44-40 9 4-8 40-2 44 6 4 22-36 34-34 10 2-4 30 4 32 9 2 20-26 30-24 8 2-2 22 6 22 10 0 18-18 30-18 9 0 4 16 14 16 14 0 34-20 52-22 16-2 40 6 84 4"
                fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: signed ? 1 : 0 }} transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }} />
            </svg>
            <span className="xos-sign-l" />
            <span className="xos-sign-m"><svg viewBox="0 0 67 67" width="24" height="24" fill="currentColor"><path d="M22.21 67V44.6369H0V67H22.21Z" /><path d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z" /><path d="M22.21 0H0V22.3184H22.21V0Z" /><path d="M66.7198 0H44.5098V22.3184H66.7198V0Z" /><path d="M66.7198 44.6369H44.5098V67H66.7198V44.6369Z" /></svg></span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- contribute, in your language (Beyond) ---------- */
const ALL = SNAP.eco.flatMap((e, i) => e.repos.map((r) => ({ ...r, eco: NAMES[i] })));
const LANGS = Object.entries(ALL.reduce((m, r) => ((m[r.lang] = (m[r.lang] || 0) + 1), m), {} as Record<string, number>)).sort((a, b) => b[1] - a[1]).map(([l]) => l);

function Contribute() {
  const [lang, setLang] = useState(LANGS[0]);
  const swapped = useRef(false);
  if (lang !== LANGS[0]) swapped.current = true;
  const repos = ALL.filter((r) => r.lang === lang);
  const share = SNAP.eco.map((e, i) => { const hit = e.langs.find(([l]) => l === lang); return [NAMES[i], hit ? hit[1] : null, e.stats[3][1]]; });
  return (
    <Ripple className="pf-sec xos-con" aria-labelledby="xos-con-h">
      <div className="pf-wrap pf-grid">
        <div className="xos-con-a">
          <h2 id="xos-con-h" className="pf-head">Contribute</h2>
          <p className="pf-lede">We welcome contributions of all kinds: code, documentation, bug reports and feature requests.</p>
        </div>
        <div className="xos-con-b">
          <div className="xos-langchips" role="radiogroup" aria-label="Language">
            {LANGS.map((l) => (
              <button key={l} type="button" role="radio" aria-checked={lang === l} onClick={() => setLang(l)}>{l}</button>
            ))}
          </div>
          <p className="xos-share" aria-live="polite">
            {share.map(([n, pc]) => (
              pc
                ? <span key={n}><span className="pf-mono xos-share-v">{pc}%</span> {n}</span>
                : <span key={n} className="off"><span className="pf-mono xos-share-v">—</span> {n}</span>
            ))}
          </p>
          <ul className={'xos-lrepos' + (swapped.current ? ' sw' : '')} key={lang}>
            {repos.map((r, j) => (
              <li key={r.name} style={{ '--j': j } as CSSProperties}>
                <A to={r.to}><span className="pf-mono">{r.name}</span><span className="xos-lr-m">{r.eco} · <Star />{r.stars}</span></A>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Ripple>
  );
}

/* the close: one centred black room in Hanzo's words, the one ask and its two quiet neighbours */
function Close() {
  const ref = useRef<HTMLElement>(null);
  const [st, setSt] = useState<'rest' | 'wait' | 'in'>('rest'); // the server and reduced motion show it at rest; below the fold it waits, then plays
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches || el.getBoundingClientRect().top < innerHeight * 0.9) return;
    setSt('wait');
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSt('in'); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section className="xos-close" data-room="dark" data-e={st} ref={ref} aria-labelledby="xos-close-h">
      <div className="pf-wrap">
        <h2 id="xos-close-h" className="pf-display xos-close-h"><span className="xos-ln"><span>Join the Community</span></span></h2>
        <div className="xos-close-acts">
          <A to="https://github.com/hanzoai" className="pf-btn xos-btn-l" data-cta="open-source.band">Start Contributing</A>
        </div>
        <p className="xos-con-note"><More to="https://docs.hanzo.ai/docs/self-hosting">Self-Hosting Docs</More><More to="https://discord.gg/XthHQQj">Join Discord</More><More to="/founder">Founder Program</More></p>
      </div>
    </section>
  );
}

/* JS off: the tabs cannot switch, so every ecosystem and galaxy panel shows, one after another; the gallery cannot be
   driven by scroll, so it is the native sideways rail it is on phones */
const NOSCRIPT = '<style>.xos-panel[hidden],.xos-opanel[hidden]{display:block!important;margin-top:64px}.xos-eco,.xos-chips{display:none!important}'
  + '.xos-hg{height:auto!important}.xos-hg-stage{position:static!important;height:auto!important;padding:72px 0!important;overflow:visible!important}'
  + '.xos-track{overflow-x:auto!important;scroll-snap-type:x mandatory}</style>';

export default function OpenSource() {
  return (
    <OSSData>
    <main className="xos pf-r">
      <noscript dangerouslySetInnerHTML={{ __html: NOSCRIPT }} />
      <Hero />
      <div className="xos-after">
        <Local />
        <Built />
        <Publish />
        <Totals />
        <Orgs />
        <Charter />
        <Contribute />
      </div>
      <Close />
    </main>
    </OSSData>
  );
}
