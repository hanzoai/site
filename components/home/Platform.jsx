'use client';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, animate, useAnimationFrame, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { EASE, Head, mod } from '../ui';
import { A } from '../kit';
import C from '../../content';
import './scenes.css';
import './platform.css';

/* The product dock and stage (James, 8 Nov: "better than the user having to drag", immersive, no scroll animation).
   A stage holds the current product window front and centre, its neighbours angled and dimmed at the sides; under it a
   dock of the nine products. Choosing one in the dock flies its window up out of the dock tile onto the stage (a Motion
   layoutId shared-element spring) while the previous window sinks back to its side slot. It plays by itself every 5 s
   (a thin line fills under the active dock item), holds while you point at or focus anything in the section and picks
   up again 3 s after you leave. Reduced motion: no autoplay, crossfades only. Drag/swipe is an extra, never required.
   9 Nov (James): on wide screens with motion and WebGL the section is now the scroll-driven 3D journey that the models
   had (home/journey/), with this dock as its index; this stage stays for phones, reduced motion and no WebGL. */

const P = C.products;
const N = P.length;
const HOLD = 5; // seconds each product holds the stage while it plays by itself
const RESUME = 3000; // ms after the pointer (or focus) leaves before it plays again
const STEP = 1.6; // each window steps through Hanzo's other scenes for its product while on stage

/* the stage glow takes each product's colour: sampled from the product's own screen when it has one (App's blue),
   else the product's accent from Hanzo's data palette (hanzo.css, both themes) */
const ACCENT = { App: 'blue', Dev: 'grass', Design: 'pink', API: 'violet', CLI: 'amber', MCP: 'cyan', Agent: 'iris', Bot: 'orange', Team: 'teal' };
const accent = (p) => `var(--data-${ACCENT[p.name] || 'gray'}-9)`;

const GLYPH = {
  App: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4 4v-4H6a2 2 0 0 1-2-2z',
  Dev: 'M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14',
  Design: 'M4 20l4-1L19 8a2.1 2.1 0 0 0-3-3L5 16zM14 7l3 3',
  API: 'M9 4C7 4 6.5 5 6.5 7v2c0 1.5-.8 3-2.5 3 1.7 0 2.5 1.5 2.5 3v2c0 2 .5 3 2.5 3M15 4c2 0 2.5 1 2.5 3v2c0 1.5.8 3 2.5 3-1.7 0-2.5 1.5-2.5 3v2c0 2-.5 3-2.5 3',
  CLI: 'M5 7l5 5-5 5M12 18h7',
  MCP: 'M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4',
  Agent: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z',
  Bot: 'M5 10a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zM12 8V4.5M9.5 13.5v.5M14.5 13.5v.5',
  Team: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M16 5.3a3 3 0 0 1 0 5.4M18 14.8c1.8.7 3 2.4 3 5.2',
};
const Glyph = ({ name }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={GLYPH[name] || 'M5 5h14v14H5z'} />
  </svg>
);

/* signed shortest offset of product i from the active one */
const off = (i, a) => { let d = mod(i - a, N); if (d > N / 2) d -= N; return d; };

/* where a window sits for offset d: centre, angled neighbours, then fading into the back */
function pose(d, W, narrow) {
  const a = Math.abs(d);
  if (narrow) return { x: d * (W + 32), z: 0, rotateY: 0, scale: a ? 0.94 : 1, opacity: a ? 0 : 1 };
  const s = Math.sign(d);
  return {
    x: s * (Math.min(a, 2) * W * 0.64 + Math.max(0, a - 2) * W * 0.28),
    z: -Math.min(a, 3) * 230,
    rotateY: Math.max(-58, Math.min(58, -d * 34)),
    scale: 1 - Math.min(a, 2) * 0.05,
    opacity: a > 2 ? 0 : 1,
  };
}

/* a product's screen: its first scene, then Hanzo's other scenes for it while it holds the stage */
function Vis({ p, scenes = [], play }) {
  const all = [p.vis, ...scenes];
  const [k, setK] = useState(0);
  useEffect(() => {
    if (!play || all.length < 2) return;
    const t = setInterval(() => setK((n) => (n + 1) % all.length), STEP * 1000);
    return () => clearInterval(t);
  }, [play, all.length]);
  if (all.length < 2) return <div className="xp-vis" dangerouslySetInnerHTML={{ __html: p.vis }} />;
  return (
    <div className="xp-vis xh-scenes">
      {all.map((h, n) => <div key={n} className={'xh-scene' + (n === k ? ' on' : '')} aria-hidden={n === k ? undefined : true} dangerouslySetInnerHTML={{ __html: h }} />)}
    </div>
  );
}

function Win({ i, d, W, narrow, calm, from, layoutId, scenes, play, onPick }) {
  const p = P[i];
  const on = d === 0;
  const a = Math.abs(d);
  const to = pose(d, W, narrow);
  const spring = calm
    ? { default: { duration: 0 }, opacity: { duration: 0.35, ease: 'easeOut' } }
    : { type: 'spring', stiffness: 160, damping: 25, mass: 1, layout: { type: 'spring', stiffness: 190, damping: 26, mass: 1 } };
  return (
    <motion.article
      className={'xp-win' + (on ? ' on' : '')}
      layoutId={layoutId}
      initial={from || false}
      animate={to}
      transition={spring}
      style={{ zIndex: 100 - a * 10, pointerEvents: a > 2 || (narrow && !on) ? 'none' : undefined }}
      onClick={on ? undefined : () => onPick(i)}
      {...(on
        ? { id: 'xp-panel', role: 'tabpanel', 'aria-labelledby': `xp-tab-${i}` }
        : { 'aria-hidden': true })}
    >
      <div className="xp-win-in" data-tilt="" inert={!on}>
        <Vis p={p} scenes={scenes} play={on && play} />
        <footer className="xp-win-f">
          <div><b>{p.name}</b><A className="xp-addr" to={p.addr.startsWith('hanzo.ai/') ? p.addr.slice(8) : 'https://' + p.addr} aria-label={`Open Hanzo ${p.name} at ${p.addr}`}>{p.addr}</A></div>
          <div className="xp-acts">
            {p.acts.map((x, k) => (
              <motion.a key={x.label} href={x.href} className={'x-btn sm' + (k === p.acts.length - 1 ? ' solid' : '')} whileTap={{ scale: 0.96 }}>{x.label}{k === p.acts.length - 1 ? ' ↗' : ''}</motion.a>
            ))}
          </div>
        </footer>
      </div>
      <motion.i className="xp-shade" initial={false} animate={{ opacity: Math.min(a, 1.6) * 0.34 }} transition={calm ? { duration: 0.35 } : { duration: 0.6, ease: EASE }} aria-hidden="true" />
    </motion.article>
  );
}

/* one dock item: a tile that grows as the pointer nears (macOS), its name on hover, and the autoplay line */
export function DockItem({ i, on, mx, fine, calm, narrow, fly, progress, playing, onPick, onKey }) {
  const p = P[i];
  const ref = useRef(null);
  const dist = useTransform(mx, (x) => {
    const r = ref.current?.getBoundingClientRect();
    return r && Number.isFinite(x) ? x - (r.left + r.width / 2) : Infinity;
  });
  const cfg = useRef({});
  cfg.current.base = narrow ? 22 : 46;
  cfg.current.big = narrow || calm || !fine ? cfg.current.base : 70;
  const sizeT = useTransform(dist, (x) => {
    const { base, big } = cfg.current;
    const k = Math.max(0, 1 - Math.abs(x) / 150);
    return base + (big - base) * (0.5 - Math.cos(Math.PI * k) / 2);
  });
  const size = useSpring(sizeT, { mass: 0.1, stiffness: 190, damping: 14 });
  useEffect(() => { size.jump(narrow ? 22 : 46); }, [narrow]); // eslint-disable-line react-hooks/exhaustive-deps
  const line = useTransform(progress, (v) => (on ? v : 0));
  return (
    <div className="xp-item" ref={ref}>
      <button
        type="button"
        role="tab"
        id={`xp-tab-${i}`}
        aria-selected={on}
        aria-controls={on ? 'xp-panel' : undefined}
        tabIndex={on ? 0 : -1}
        className="xp-tab"
        onClick={() => onPick(i)}
        onKeyDown={onKey}
      >
        <motion.span className="xp-tile" style={{ width: size, height: size }}>
          {fly && <motion.span key={fly} layoutId={fly} className="xp-ghost" aria-hidden="true" />}
          <Glyph name={p.name} />
        </motion.span>
        <span className="xp-name">{p.name}</span>
        <span className="xp-line" aria-hidden="true">
          {on && playing && <motion.i style={{ scaleX: line }} />}
        </span>
      </button>
    </div>
  );
}

/* the most saturated colour on a product's own screen (weighted by area), or null when the screen is greyscale */
function sample(root) {
  let best = null, score = 0;
  const els = root.querySelectorAll('*');
  for (let n = 0; n < els.length && n < 900; n++) {
    const el = els[n];
    const r = el.getBoundingClientRect();
    const area = r.width * r.height;
    if (area < 4) continue;
    const cs = getComputedStyle(el);
    for (const [c, w] of [[cs.backgroundColor, Math.sqrt(Math.min(area, 60000))], [cs.color, 4]]) {
      const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/.exec(c);
      if (!m) continue;
      const [R, G, B] = [+m[1], +m[2], +m[3]];
      const al = m[4] === undefined ? 1 : +m[4];
      const sat = (Math.max(R, G, B) - Math.min(R, G, B)) / 255;
      const s = sat * al * w;
      if (sat > 0.35 && al > 0.3 && s > score) { score = s; best = `rgb(${R}, ${G}, ${B})`; }
    }
  }
  return score > 20 ? best : null;
}

function Stage({ pending, shell }) {
  const sec = useRef(null);
  const stage = useRef(null);
  const tabs = useRef(null);
  const calm = useReducedMotion();
  const seen = useInView(sec, { amount: 0.35 });
  const [nav, setNav] = useState({ a: 0, prev: null, src: null, gen: 0, from: 0 });
  const [W, setW] = useState(560);
  const [narrow, setNarrow] = useState(false);
  const [fine, setFine] = useState(false);
  const [held, setHeld] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [glow, setGlow] = useState({});
  const [theme, setTheme] = useState('');
  const inside = useRef({ pointer: false, focus: false, t: 0 });
  const progress = useMotionValue(0);
  const nudge = useMotionValue(0);
  const mx = useMotionValue(Infinity);
  const dragged = useRef(false);
  const [scenes, setScenes] = useState([]);
  useEffect(() => { let live = true; import('./scenes.json').then((m) => { if (live) setScenes(m.default); }); return () => { live = false; }; }, []);

  useLayoutEffect(() => {
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      setNarrow(w < 700);
      setW(Math.round(Math.min(620, w * (w < 700 ? 0.88 : 0.46))));
    });
    ro.observe(stage.current);
    const mq = matchMedia('(hover: hover) and (pointer: fine)');
    const f = () => setFine(mq.matches); f(); mq.addEventListener('change', f);
    const v = () => setHidden(document.hidden); document.addEventListener('visibilitychange', v);
    const mo = new MutationObserver(() => setTheme(document.documentElement.className));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setTheme(document.documentElement.className);
    return () => { ro.disconnect(); mq.removeEventListener('change', f); document.removeEventListener('visibilitychange', v); mo.disconnect(); };
  }, []);

  const { a: active } = nav;
  const go = useCallback((i, src) => {
    progress.set(0);
    setNav((n) => (n.a === i ? n : { a: i, prev: n.a, src, gen: n.gen + 1, flyGen: n.gen, from: off(i, n.a) }));
  }, [progress]);
  const step = useCallback((d) => {
    progress.set(0);
    setNav((n) => ({ a: mod(n.a + d, N), prev: n.a, src: 'side', gen: n.gen + 1, from: d }));
  }, [progress]);

  // the glow follows the product on stage: sampled from its own screen once it is there, else its accent
  useEffect(() => {
    const t = setTimeout(() => {
      const el = stage.current?.querySelector('.xp-win.on .xp-vis');
      if (!el) return;
      const c = sample(el);
      setGlow((g) => (g[`${theme}|${active}`] === c ? g : { ...g, [`${theme}|${active}`]: c }));
    }, 80);
    return () => clearTimeout(t);
  }, [active, theme, scenes]);
  const tint = glow[`${theme}|${active}`] || accent(P[active]);

  // hold while pointed at or focused; play again 3 s after leaving
  const hold = (k, v) => {
    const s = inside.current;
    s[k] = v;
    clearTimeout(s.t);
    if (s.pointer || s.focus) setHeld(true);
    else s.t = setTimeout(() => setHeld(false), RESUME);
  };
  useEffect(() => () => clearTimeout(inside.current.t), []);

  const playing = seen && !held && !calm && !hidden && !pending;
  useAnimationFrame((_, dt) => {
    if (!playing) return;
    const v = progress.get() + dt / (HOLD * 1000);
    if (v >= 1) step(1);
    else progress.set(v);
  });

  // keep the active pill in view in the phone row (scrolls the row only, never the page)
  useEffect(() => {
    const row = tabs.current;
    const t = row?.querySelector(`#xp-tab-${active}`)?.parentElement;
    if (!row || !t || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({ left: t.offsetLeft - (row.clientWidth - t.offsetWidth) / 2, behavior: calm ? 'auto' : 'smooth' });
  }, [active, calm, narrow]);

  const onKey = (e) => {
    let i = null;
    if (e.key === 'ArrowRight') i = mod(active + 1, N);
    else if (e.key === 'ArrowLeft') i = mod(active - 1, N);
    else if (e.key === 'Home') i = 0;
    else if (e.key === 'End') i = N - 1;
    if (i === null) return;
    e.preventDefault();
    e.stopPropagation();
    go(i, 'side');
    document.getElementById(`xp-tab-${i}`)?.focus();
  };
  const onSecKey = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    if (e.target.closest('input, textarea, select, [contenteditable]')) return;
    e.preventDefault();
    step(e.key === 'ArrowRight' ? 1 : -1);
  };

  const flying = nav.src === 'dock' && !calm;
  const fromPose = (d) => (calm ? { ...pose(d, W, narrow), opacity: 0 } : pose(d, W, narrow));

  return (
    <section
      className="x-sec x-platform"
      id="products"
      data-hz-view="products"
      ref={sec}
      aria-labelledby="products-h"
      onPointerEnter={() => hold('pointer', true)}
      onPointerLeave={() => hold('pointer', false)}
      onFocus={() => hold('focus', true)}
      onBlur={(e) => { if (!sec.current.contains(e.relatedTarget)) hold('focus', false); }}
      onKeyDown={onSecKey}
      data-pending={pending ? '' : undefined}
    >
      <div className="x-wrap">
        <Head title={TITLE} lede={LEDE} />
      </div>
      {pending && <div className="xpj-shell" ref={shell} />}
      <motion.div
        className="xp-stage"
        ref={stage}
        aria-roledescription="carousel"
        aria-label="Hanzo products"
        style={{ '--xp-glow': tint }}
        onPanStart={() => { dragged.current = true; }}
        onPan={(_, info) => nudge.set(Math.max(-140, Math.min(140, info.offset.x * 0.35)))}
        onPanEnd={(_, info) => {
          const x = info.offset.x, v = info.velocity.x;
          if (x < -50 || v < -400) step(1);
          else if (x > 50 || v > 400) step(-1);
          animate(nudge, 0, { type: 'spring', stiffness: 300, damping: 30 });
          setTimeout(() => { dragged.current = false; }, 0);
        }}
        onClickCapture={(e) => { if (dragged.current) { e.preventDefault(); e.stopPropagation(); } }}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        <i className="xp-glow" aria-hidden="true" />
        <motion.div className="xp-3d" style={{ '--cw': W + 'px', x: nudge }}>
          {P.map((_, i) => {
            if (i === active) {
              return (
                <Win
                  key={`c${i}`}
                  i={i} d={0} W={W} narrow={narrow} calm={calm}
                  from={nav.src === null ? false : flying ? false : fromPose(nav.from)}
                  layoutId={flying ? `xp-fly-${i}-${nav.flyGen}` : undefined}
                  scenes={scenes[i]} play={seen && !calm} onPick={() => {}}
                />
              );
            }
            const d = off(i, active);
            return (
              <Win
                key={`s${i}`}
                i={i} d={d} W={W} narrow={narrow} calm={calm}
                from={i === nav.prev ? (calm ? { ...pose(d, W, narrow), opacity: 0 } : pose(0, W, narrow)) : false}
                scenes={scenes[i]} play={false} onPick={(k) => go(k, 'side')}
              />
            );
          })}
        </motion.div>
      </motion.div>
      <div className="x-wrap xp-nav">
        <motion.button type="button" className="x-round" aria-label="Previous product" onClick={() => step(-1)} whileTap={{ scale: 0.9 }}>‹</motion.button>
        <div
          className="xp-dock"
          ref={tabs}
          role="tablist"
          aria-label="Choose a product"
          onPointerMove={(e) => { if (e.pointerType === 'mouse') mx.set(e.clientX); }}
          onPointerLeave={() => mx.set(Infinity)}
        >
          {P.map((p, i) => (
            <DockItem
              key={p.name}
              i={i} on={i === active} mx={mx} fine={fine} calm={calm} narrow={narrow}
              fly={i !== active ? `xp-fly-${i}-${nav.gen}` : null}
              progress={progress} playing={playing}
              onPick={(k) => go(k, 'dock')} onKey={onKey}
            />
          ))}
        </div>
        <motion.button type="button" className="x-round" aria-label="Next product" onClick={() => step(1)} whileTap={{ scale: 0.9 }}>›</motion.button>
      </div>
    </section>
  );
}

const TITLE = 'Hanzo is the AI-native company platform.';
const LEDE = 'A vertically integrated agentic operating system for business — intelligence, applications, computer-use agents, developer tools, MCP, and cloud infrastructure designed together in one workspace.';

/* Wide screens with motion and WebGL get the journey (home/journey/Journey.jsx, with three.js, imported only when the
   section comes near). Phones, reduced motion and no WebGL keep the dock and stage above. Until then the server's markup
   holds the journey's place at its full height (CSS decides: home/journey/journey.css), so nothing below it moves. */
export default function Platform() {
  const [view, setView] = useState(null); // null on the server and first paint (CSS picks), then 'stage' or the Journey module
  const shell = useRef(null);
  useEffect(() => {
    const el = shell.current;
    if (!el?.offsetParent) return setView('stage');
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      import('./journey/Journey').then(setView, () => setView('stage'));
    }, { rootMargin: '100%' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Journey = view?.default;
  if (Journey) return <Journey products={P} title={TITLE} lede={LEDE} onFail={setView} />;
  return <Stage pending={!view} shell={shell} />;
}
