'use client';
// Persona: a developer, contributor or evaluator checking how much of Hanzo is open and where to contribute (arrives from the header, GitHub or /oss)
// Goal: see the scale of what Hanzo publishes, open an organization, and go to Hanzo's GitHub
// CTA: View on GitHub -> https://github.com/hanzoai (hero, sticky AskBar and thumb bar; the close keeps Hanzo's "Start Contributing") · metric cta_click (data-cta="view-on-github")
/* Open source. Its idea is the scale of it, made literal: a catalogue of 2,247 repositories you can open.
   V2: 8/10 Catalogue rebuilt: a living sky of every repository as the hero (the camera pulls back on arrival, clusters open their org), the three ecosystems as a tabbed live dashboard, totals as hero figures, numbered org cards that open, a signed charter; greys only, one ask.
   Signature: cards that open. Every organization is a numbered card (01 / 37) that opens into its own page, and in the
   hero every cluster of light is one of them: point at it for its name, press it to open it.
   Supporting: the sky drifting and twinkling by itself (it pulls back from inside Hanzo to all three galaxies when
   you arrive), the ecosystem tabs whose pill glides while the year of commits re-lights cell by cell, and the
   charter signed with a drawn line.
   Beyond: "Contribute in your language". Pick a language and see the featured repositories written in it across
   Hanzo, Lux and Zoo, and how much of each ecosystem's repositories it is, from Hanzo's own language shares.
   Every figure is Hanzo's, as its build read GitHub and its forge. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { A, More } from '../kit';
import { href } from '../../lib/route';
import MaskLines from '../v2/MaskLines';
import DetailSheet from '../v2/DetailSheet';
import AskBar from '../v2/AskBar';
import { ECO, TOTAL, ORGS } from './openSourceData';
import './OpenSource.css';

const num = (s) => parseInt(String(s).replace(/,/g, ''), 10) || 0;
const NAMES = ['Hanzo', 'Lux', 'Zoo'];
const clamp = (v) => Math.max(0, Math.min(1, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* ---------- the constellation ---------- */
function build() {
  const centers = [[0, 0], [-380, -260], [330, 290]]; // Hanzo, Lux above-left of it, Zoo below-right
  const clusters = [], dots = [];
  ORGS.forEach((g, gi) => {
    const placed = [];
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
  const gal = ORGS.map((g, gi) => {
    const mine = clusters.filter((c) => c.g === g.name);
    const top = Math.min(...mine.map((c) => c.y - c.r));
    return { name: g.name, sub: g.sub, x: centers[gi][0], y: top - 26 };
  });
  return { clusters, dots, gal };
}

/* The sky. On arrival the camera pulls back from inside Hanzo to all three galaxies (2.8s, once); then it drifts. */
function Sky() {
  const wrap = useRef(null);
  const cv = useRef(null);
  const labs = useRef([]);
  const hotEl = useRef(null);
  const world = useMemo(build, []);
  const live = useInView(wrap, { amount: 0.05 });
  const calm = useReducedMotion();
  const [hot, setHot] = useState(null);
  const st = useRef({ ox: 0, oy: 0, vx: 0, vy: 0, drag: null, moved: 0, hot: -1, s: 1, z: 1, w: 0, h: 0, t: 0, cx: 0, cy: 0, phone: false });
  const born = useRef(0);

  useEffect(() => {
    const c = cv.current, ctx = c.getContext('2d');
    const S = st.current;
    const fit = () => {
      const b = wrap.current.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
      S.w = b.width; S.h = b.height;
      c.width = b.width * dpr; c.height = b.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      S.phone = b.width < 700;
      S.base = S.phone ? b.width / 980 : Math.min(b.width / 1500, b.height / 880);
    };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(wrap.current);
    const shades = ['rgba(245,245,247,.26)', 'rgba(245,245,247,.5)', 'rgba(245,245,247,.76)', 'rgba(255,255,255,.98)'];
    const draw = (t) => {
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
      const X = (x) => S.cx + (x + S.ox + drift) * s, Y = (y) => S.cy + (y + S.oy + Math.cos(t / 6100) * 8 * (calm ? 0 : 1)) * s;
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
    const loop = (t) => { draw(t); raf = requestAnimationFrame(loop); };
    if (live && !calm) raf = requestAnimationFrame(loop); else draw(0);
    S.redraw = () => draw(S.t);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [live, calm, world]);

  const pick = (e) => {
    const S = st.current, b = cv.current.getBoundingClientRect();
    const drift = calm ? 0 : Math.sin(S.t / 5200) * 14;
    const wx = (e.clientX - b.left - S.cx) / S.s - S.ox - drift, wy = (e.clientY - b.top - S.cy) / S.s - S.oy;
    let best = -1, bd = 1e9;
    world.clusters.forEach((c, i) => { const d = Math.hypot(c.x - wx, c.y - wy); if (d < c.r + 10 && d < bd) { bd = d; best = i; } });
    return best;
  };
  const down = (e) => { const S = st.current; S.drag = { x: e.clientX, y: e.clientY }; S.moved = 0; S.vx = S.vy = 0; };
  const move = (e) => {
    const S = st.current;
    if (S.drag) {
      const dx = (e.clientX - S.drag.x) / S.s, dy = (e.clientY - S.drag.y) / S.s;
      S.ox += dx; S.oy += dy; S.vx = dx * 0.6; S.vy = dy * 0.6; S.moved += Math.abs(dx) + Math.abs(dy);
      S.drag = { x: e.clientX, y: e.clientY };
      if (S.moved > 3 && e.pointerType === 'mouse') e.currentTarget.setPointerCapture?.(e.pointerId);
      if (calm) S.redraw?.();
      return;
    }
    const i = pick(e);
    if (i !== S.hot) { S.hot = i; setHot(i >= 0 ? world.clusters[i] : null); if (calm) S.redraw?.(); }
  };
  const up = (e) => {
    const S = st.current, was = S.drag; S.drag = null;
    if (was && S.moved < 6) { const i = pick(e); if (i >= 0) window.location.assign(href('/oss/' + world.clusters[i].login)); }
  };
  return (
    <div className="xos-sky" ref={wrap}>
      <canvas ref={cv} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={() => { st.current.drag = null; st.current.hot = -1; setHot(null); }}
        role="img" aria-label="Every original repository as a point of light: 2,247 of them, gathered by organization into the Hanzo, Lux and Zoo ecosystems" />
      {world.gal.map((g, i) => (
        <div key={g.name} className="xos-gal" ref={(el) => (labs.current[i] = el)} aria-hidden="true"><b>{g.name}</b><span>{g.sub}</span></div>
      ))}
      <div className={'xos-tip' + (hot ? ' on' : '')} ref={hotEl} aria-hidden="true">
        {hot && <><b>{hot.name}</b><span>{hot.login} · {hot.repos}{hot.commits ? ' · ' + hot.commits : ''}</span></>}
      </div>
    </div>
  );
}

/* ---------- hero: the sky, and the count ---------- */
const HERO_STATS = [['1,733', 'Original public repositories'], ['37', 'Organizations holding them'], ['732,288', 'Commits, past year'], ['5,125', 'GitHub stars']];

function Hero() {
  return (
    <section className="xos-hero" data-room="dark" aria-labelledby="xos-h1">
      <Sky />
      <div className="pf-wrap xos-hero-c">
        <div className="xos-hero-a">
          <MaskLines as="h1" id="xos-h1" className="pf-display xos-h1" lines={['Building in the', 'open.']} delay={0.05} />
          <p className="xos-cap xos-in" style={{ '--i': 1 }}>Open Source First</p>
          <p className="pf-lede xos-lede xos-in" style={{ '--i': 2 }}>We publish what we build, fix the bugs we find upstream instead of patching them in private, and pay the projects we depend on. The commitments below are specific enough to hold us to.</p>
          <div className="xos-acts xos-in" style={{ '--i': 3 }}>
            <A to="https://github.com/hanzoai" className="pf-btn xos-btn-l" data-thumb="View on GitHub" data-cta="view-on-github">View on GitHub</A>
            <More to="https://github.com/hanzoai">Star Our Repos</More>
          </div>
        </div>
        <div className="xos-hero-b xos-in" style={{ '--i': 4 }}>
          <dl className="xos-hstats">
            {HERO_STATS.map(([v, k]) => (
              <div key={k}><dd>{v}</dd><dt>{k}</dt></div>
            ))}
          </dl>
          <p className="xos-hint" aria-hidden="true">Drag to pan · point at a cluster · click to open it</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- what we publish: one chapter per ecosystem ---------- */
const MONTHS = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
const LANGC = ['#0a0a0a', '#3a3a3c', '#6e6e73', '#98989d', '#c7c7cc', '#e5e5ea'];

function Dash({ at }) {
  const e = ECO[at];
  let left = 0;
  const segs = e.langs.map(([l, pc], j) => { const s = { l, pc: +pc, left, c: LANGC[j] }; left += +pc; return s; });
  return (
    <figure className="pf-obj xos-dash" aria-label={NAMES[at] + ': the year of commits, the languages and the latest commits'}>
      <header className="xos-dash-h">
        <span className="xos-dash-dot" aria-hidden="true" />
        <b>{NAMES[at]}</b>
        <span className="pf-mono">{e.read}</span>
      </header>
      <div className="xos-heat">
        <div className="xos-heat-m" aria-hidden="true">{MONTHS.map((m, i) => <span key={i}>{m}</span>)}</div>
        <div className="xos-heat-g" role="img" aria-label={e.heatLabel}>
          {[...e.heat].map((c, i) => <i key={i} data-l={c} style={{ '--d': Math.floor(i / 7) * 9 + 'ms' }} />)}
        </div>
        <div className="xos-heat-f">
          <span>Commits a day</span>
          <span className="xos-leg" aria-hidden="true">Less {[0, 1, 2, 3, 4].map((l) => <i key={l} data-l={l} />)} More</span>
        </div>
      </div>
      <div className="xos-lang">
        <div className="xos-lbar" aria-hidden="true">{segs.map((s, j) => <i key={j} style={{ transform: `translateX(${s.left}%) scaleX(${s.pc / 100})`, background: s.c }} />)}</div>
        <ul className="xos-langs">{segs.map((s, j) => <li key={at + s.l} style={{ '--j': j }}><i style={{ background: s.c }} />{s.l}<b className="pf-mono">{s.pc}%</b></li>)}</ul>
      </div>
      <ol className="xos-dash-c">
        {e.commits.slice(0, 3).map(([repo, msg, when, to], j) => (
          <li key={at + to} style={{ '--j': j }}><A to={to}><span className="pf-mono xos-c-r">{repo}</span><span className="xos-c-m">{msg}</span><span className="pf-mono xos-c-t">{when}</span></A></li>
        ))}
      </ol>
    </figure>
  );
}

function EcoSheet({ e, i }) {
  return (
    <DetailSheet label={`The year in ${NAMES[i]}, every repository`} kicker={ORGS[i].sub} title={`What we publish: ${NAMES[i]}`} wide>
      <h3>Commits a day</h3>
      <p>{e.heatLabel}</p>
      <p className="xos-sh-note">Commits a day, from Nov 7, 2025 to Nov 6, 2026</p>
      <h3>Latest commits</h3>
      <ol className="xos-sh-commits">
        {e.commits.map(([repo, msg, when, to]) => (
          <li key={to}><A to={to}><span className="pf-mono">{repo}</span><span>{msg}</span><span className="pf-mono">{when} <small>UTC</small></span></A></li>
        ))}
      </ol>
      <p className="xos-sh-note"><span>{e.read}</span> · <A to={e.readTo}>Read the source →</A></p>
      <h3>What it is written in</h3>
      <ul className="xos-sh-langs">{e.langs.map(([l, pc], j) => <li key={l}><i style={{ background: LANGC[j] }} />{l}<b className="pf-mono">{pc}<small>%</small></b></li>)}</ul>
      <p className="xos-sh-note">{e.langCap}</p>
      <h3>Repositories</h3>
      <ul className="xos-sh-repos">
        {e.repos.map((r) => (
          <li key={r.name}>
            <A to={r.to}>
              <b className="pf-mono">{r.name}</b>
              <span className="xos-sh-d">{r.desc}</span>
              <span className="xos-sh-m pf-mono">
                <span>{r.lang}</span><span title="Stars">★ {r.stars}</span><span title="Forks">⑂ {r.forks}</span>
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
  const [at, setAt] = useState(0);
  const keys = (e) => {
    const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!k) return;
    const n = (at + k + 3) % 3;
    setAt(n);
    document.getElementById('xos-t-' + n)?.focus();
  };
  return (
    <section className="pf-sec xos-pub" id="publish" aria-labelledby="xos-pub-h">
      <div className="pf-wrap">
        <div className="pf-grid xos-pub-top">
          <MaskLines as="h2" id="xos-pub-h" className="pf-display s xos-pub-h" lines={['What we', 'publish']} />
          <p className="pf-lede xos-pub-l">Read from GitHub by every build: the year of commits, the languages and the repositories of each ecosystem, then every organization.</p>
        </div>
        <div className="xos-eco" role="tablist" aria-label="Ecosystem" onKeyDown={keys}>
          {NAMES.map((n, i) => (
            <button key={n} id={'xos-t-' + i} type="button" role="tab" aria-selected={at === i} aria-controls={'xos-p-' + i} tabIndex={at === i ? 0 : -1} onClick={() => setAt(i)}>
              {at === i && <motion.span layoutId="xos-eco-pill" className="xos-pill" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
              <span className="xos-eco-n">{n}</span><span className="pf-mono">{ECO[i].stats[3][1]}</span>
            </button>
          ))}
        </div>
        <div className="pf-grid xos-pub-g">
          <div className="xos-pub-a">
            {ECO.map((e, i) => (
              <div key={i} id={'xos-p-' + i} role="tabpanel" aria-labelledby={'xos-t-' + i} hidden={at !== i} className="xos-panel">
                <h3 className="pf-head xos-eco-h">{NAMES[i]}</h3>
                <p className="xos-cap">{ORGS[i].sub}</p>
                <ul className="xos-stats">
                  {e.stats.map(([k, v, sub], j) => (
                    <li key={j}><A to={e.statTo[j]}><b className="pf-mono">{v}</b><span className="xos-st-k">{k}</span><span className="xos-st-s">{sub}</span></A></li>
                  ))}
                </ul>
                <EcoSheet e={e} i={i} />
              </div>
            ))}
          </div>
          <div className="xos-pub-b"><Dash at={at} /></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- the total, as figures ---------- */
function Totals() {
  return (
    <section className="pf-sec xos-total">
      <div className="pf-wrap pf-grid">
        <header className="xos-total-h">
          <MaskLines as="h2" className="pf-head" lines={['Total across Hanzo']} />
          <p className="pf-body">Aggregate open-source activity counted from the forge and GitHub.</p>
          <p className="xos-grants"><A to="/grants">OSS &amp; research credit grants →</A></p>
        </header>
        <ul className="xos-total-n">
          {TOTAL.map(([v, k]) => <li key={k}><b className="pf-num">{v}</b><span>{k}</span></li>)}
        </ul>
      </div>
    </section>
  );
}

/* ---------- every organization: cards that open ---------- */
function Orgs() {
  const [g, setG] = useState(0);
  const keys = (e) => {
    const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!k) return;
    const n = (g + k + 3) % 3;
    setG(n);
    document.getElementById('xos-og-' + n)?.focus();
  };
  return (
    <section className="pf-sec xos-orgs" aria-labelledby="xos-orgs-h">
      <div className="pf-wrap">
        <div className="xos-orgs-top">
          <MaskLines as="h2" id="xos-orgs-h" className="pf-display s" lines={['Every organization']} />
          <div className="xos-chips" role="tablist" aria-label="Ecosystem" onKeyDown={keys}>
            {ORGS.map((x, i) => (
              <button key={x.name} id={'xos-og-' + i} type="button" role="tab" aria-selected={g === i} aria-controls={'xos-op-' + i} tabIndex={g === i ? 0 : -1} onClick={() => setG(i)}>
                {g === i && <motion.span layoutId="xos-org-pill" className="xos-pill" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
                <span className="xos-eco-n">{x.name}</span><span className="pf-mono">{x.orgs.length}</span>
              </button>
            ))}
          </div>
        </div>
        {ORGS.map((x, i) => {
          const top = [...x.orgs].sort((a, b) => num(b.repos) - num(a.repos)).slice(0, 8);
          const max = num(top[0].repos);
          return (
            <div key={x.name} id={'xos-op-' + i} role="tabpanel" aria-labelledby={'xos-og-' + i} hidden={g !== i} className="xos-opanel">
              <p className="xos-gal-sub pf-mono">{x.sub}</p>
              <ul className="xos-ocards">
                {top.map((o, j) => (
                  <li key={o.login} style={{ '--j': j }}>
                    <A to={'/oss/' + o.login} className="xos-ocard" data-cursor="Open">
                      <span className="xos-oc-i pf-mono" aria-hidden="true">{String(j + 1).padStart(2, '0')} / {x.orgs.length}</span>
                      <span className="xos-oc-top"><b data-morph>{o.name}</b><small className="pf-mono">{o.login}</small></span>
                      <span className="xos-oc-n"><b className="pf-mono">{o.repos.split(' ')[0]}</b> {o.repos.split(' ').slice(1).join(' ')}</span>
                      <span className="xos-oc-bar" aria-hidden="true"><i style={{ transform: `scaleX(${Math.max(0.02, num(o.repos) / max)})` }} /></span>
                      <span className="xos-oc-f pf-mono"><span>{o.commits || ''}</span><span title="GitHub stars">★ {o.stars}</span></span>
                      {o.desc && <span className="xos-oc-d">{o.desc}</span>}
                      <span className="xos-oc-go" aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                    </A>
                  </li>
                ))}
              </ul>
              <DetailSheet label={`All ${x.orgs.length} organizations in ${x.name}`} kicker={x.sub} title={x.name}>
                <ol className="xos-sh-orgs">
                  {x.orgs.map((o) => (
                    <li key={o.login}>
                      <A to={'/oss/' + o.login}>
                        <span><b>{o.name}</b><small className="pf-mono">{o.login}</small></span>
                        <span className="pf-mono">{o.repos}</span>
                        <span className="pf-mono">{o.commits || ''}</span>
                        <span className="pf-mono" title="GitHub stars">★ {o.stars}</span>
                        {o.desc && <span className="xos-sh-d">{o.desc}</span>}
                      </A>
                    </li>
                  ))}
                </ol>
              </DetailSheet>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- what Hanzo is built on: a wall of credits ---------- */
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

function Built() {
  return (
    <section className="pf-sec xos-built" aria-labelledby="xos-built-h">
      <div className="pf-wrap">
        <div className="xos-built-top">
          <MaskLines as="h2" id="xos-built-h" className="pf-display s" lines={['What Hanzo is', 'built on']} />
          <p className="pf-body">The projects our platform actually runs on, each with its licence and the people who maintain it.</p>
        </div>
        <ul className="xos-tiles">
          {BUILT.map(([ic, name, repo, who, site, what, lic]) => (
            <li key={name} className="pf-card xos-tile">
              <span className="xos-tile-ic" aria-hidden="true">{ic}</span>
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
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

function Charter() {
  const end = useRef(null);
  const signed = useInView(end, { once: true, amount: 1 });
  return (
    <section className="pf-sec xos-charter" aria-labelledby="xos-ch-h">
      <div className="pf-wrap pf-grid">
        <header className="xos-ch-h">
          <MaskLines as="h2" id="xos-ch-h" className="pf-display s" lines={['Our Stewardship', 'Commitments']} />
          <p className="xos-cap">Charter</p>
          <p className="pf-lede">We hold ourselves to explicit, public commitments — not vague marketing language.</p>
        </header>
        <div className="xos-ch-body">
          <ol className="xos-arts">
            {CHARTER.map(([t, d], i) => (
              <li key={t}>
                <span className="pf-mono xos-art-n">Article {ROMAN[i]}</span>
                <h3 className="pf-title">{t}</h3>
                <p className="pf-body">{d}</p>
              </li>
            ))}
          </ol>
          <div className="xos-sign" ref={end} aria-hidden="true">
            <svg viewBox="0 0 320 90" width="320" height="90">
              <motion.path d="M10 62c18-30 34-44 44-40 9 4-8 40-2 44 6 4 22-36 34-34 10 2-4 30 4 32 9 2 20-26 30-24 8 2-2 22 6 22 10 0 18-18 30-18 9 0 4 16 14 16 14 0 34-20 52-22 16-2 40 6 84 4"
                fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: signed ? 1 : 0 }} transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1] }} />
            </svg>
            <span className="xos-sign-l" />
            <span className="xos-sign-m"><svg viewBox="0 0 67 67" width="18" height="18" fill="currentColor"><path d="M22.21 67V44.6369H0V67H22.21Z" /><path d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z" /><path d="M22.21 0H0V22.3184H22.21V0Z" /><path d="M66.7198 0H44.5098V22.3184H66.7198V0Z" /><path d="M66.7198 44.6369H44.5098V67H66.7198V44.6369Z" /></svg></span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- contribute, in your language (Beyond) ---------- */
const ALL = ECO.flatMap((e, i) => e.repos.map((r) => ({ ...r, eco: NAMES[i] })));
const LANGS = Object.entries(ALL.reduce((m, r) => ((m[r.lang] = (m[r.lang] || 0) + 1), m), {})).sort((a, b) => b[1] - a[1]).map(([l]) => l);

function Contribute() {
  const [lang, setLang] = useState(LANGS[0]);
  const repos = ALL.filter((r) => r.lang === lang);
  const share = ECO.map((e, i) => { const hit = e.langs.find(([l]) => l === lang); return [NAMES[i], hit ? hit[1] : null, e.stats[3][1]]; });
  return (
    <section className="pf-sec xos-con" aria-labelledby="xos-con-h">
      <div className="pf-wrap pf-grid">
        <div className="xos-con-a">
          <MaskLines as="h2" id="xos-con-h" className="pf-display" lines={['Contribute']} />
          <p className="xos-cap">Join the Community</p>
          <p className="pf-lede">We welcome contributions of all kinds: code, documentation, bug reports and feature requests.</p>
          <div className="xos-con-acts">
            <A to="https://github.com/hanzoai" className="pf-btn solid" data-cta="start-contributing">Start Contributing</A>
          </div>
          <p className="xos-con-note"><More to="https://discord.gg/XthHQQj">Join Discord</More><More to="/founder">Founder Program</More></p>
        </div>
        <div className="xos-con-b" aria-label="Contribute in your language">
          <div className="xos-langchips" role="radiogroup" aria-label="Language">
            {LANGS.map((l) => (
              <button key={l} type="button" role="radio" aria-checked={lang === l} onClick={() => setLang(l)}>{l}</button>
            ))}
          </div>
          <p className="xos-share" aria-live="polite">
            {share.map(([n, pc, of]) => (
              pc
                ? <span key={n}><b className="pf-mono">{pc}%</b> of {n}’s {of} repositories</span>
                : <span key={n} className="off"><b className="pf-mono">—</b> not among {n}’s five main languages</span>
            ))}
          </p>
          <ul className="xos-lrepos" key={lang}>
            {repos.map((r, j) => (
              <li key={r.name} style={{ '--j': j }}>
                <A to={r.to}><span className="pf-mono">{r.name}</span><small>{r.eco} · ★ {r.stars}</small></A>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function OpenSource() {
  return (
    <main className="xos">
      {/* JS off: the tabs cannot switch, so every ecosystem and galaxy panel shows, one after another */}
      <noscript dangerouslySetInnerHTML={{ __html: '<style>.xos-panel[hidden],.xos-opanel[hidden]{display:block!important;margin-top:64px}.xos-eco,.xos-chips{display:none!important}</style>' }} />
      <Hero />
      <Publish />
      <Totals />
      <Orgs />
      <Built />
      <Charter />
      <Contribute />
      <AskBar title="Open source" label="View on GitHub" to="https://github.com/hanzoai" cta="view-on-github" />
    </main>
  );
}
