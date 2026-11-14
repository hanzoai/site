'use client';
import { useEffect, useRef, useState, type PointerEvent, type ReactNode, type RefObject } from 'react';
import { motion, useInView, useReducedMotion, useSpring } from 'motion/react';
import { fine, copyText } from './ui';
import SetupMenu from './SetupMenu';
import { Desk, MORE, Phone, Term } from './home/Devices';
import { press } from '../lib/press';
import { capture, track } from '../lib/track';
import './home/demo.css';

const PROMPT = 'Build maxpower: every AI I use in one place, and faster at coding.';
const CMD = 'curl -fsSL https://hanzo.sh | sh';

/* The halftone field behind the hero: a 3D topological wave heightfield with depth layering and normal-mapped Blinn-Phong cursor gleam. */
function Dots({ host }: { host: RefObject<HTMLElement | null> }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!, cx = cv.getContext('2d')!, el = host.current!;
    const G = 10, R = 255, Z_SCALE = 68, LIGHT_Z = 108;
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, cols = 0, rows = 0, raf = 0, vis = true;
    let tx = -1e4, ty = -1e4, lx = -1e4, ly = -1e4, inside = false, energy = 0, boost = 0;
    let rgb = '255,255,255';
    const ambientAlphas = [0.095, 0.175, 0.265];
    const gleamAlphas = [0.35, 0.47, 0.59, 0.71, 0.83, 0.94];
    let ambientStyles = ambientAlphas.map((a) => `rgba(${rgb},${a})`);
    let gleamStyles = gleamAlphas.map((a) => `rgba(${rgb},${a})`);
    // the dot colour follows the page's ink (.x-dots { color: var(--ink) }) across light and dark
    const tone = () => {
      const m = getComputedStyle(cv).color.match(/[\d.]+/g) || [10, 10, 10];
      rgb = `${m[0]},${m[1]},${m[2]}`;
      ambientStyles = ambientAlphas.map((a) => `rgba(${rgb},${a})`);
      gleamStyles = gleamAlphas.map((a) => `rgba(${rgb},${a})`);
    };
    tone();

    const amb: number[][] = [[], [], []];
    const glm: number[][] = [[], [], [], [], [], []];

    const draw = (now = performance.now()) => {
      const t = 0; // the field rests; a pointer lights it
      cx.clearRect(0, 0, W, H);
      for (let b = 0; b < 3; b++) amb[b].length = 0;
      for (let b = 0; b < 6; b++) glm[b].length = 0;

      const gx1 = W * (0.18 + 0.07 * Math.sin(t * 0.52));
      const gy1 = H * (0.48 + 0.14 * Math.cos(t * 0.41));
      const gx2 = W * (0.82 + 0.07 * Math.cos(t * 0.47));
      const gy2 = H * (0.52 + 0.14 * Math.sin(t * 0.37));
      const invH = 1 / Math.max(1, H);
      const wLeft = Math.max(1, W * 0.3);
      const wRight = Math.max(1, W * 0.34);
      const lit = energy > 0.01 && lx > -5e3;
      const r2Max = R * R;

      for (let j = 0; j < rows; j++) {
        const y = j * G;
        const rawEy = 0.3 + y * invH * 0.95;
        const ey = rawEy < 1 ? rawEy : 1;
        const dey = rawEy < 1 ? invH * 0.95 : 0;

        for (let i = 0; i < cols; i++) {
          const x = i * G;
          const leftRamp = 1 - x / wLeft;
          const rightRamp = (x - W * 0.66) / wRight;
          let ex = 0.14, dex = 0;
          if (leftRamp >= rightRamp && leftRamp > 0.14) {
            ex = leftRamp; dex = -1 / wLeft;
          } else if (rightRamp > 0.14) {
            ex = rightRamp; dex = 1 / wRight;
          }

          // 3D traveling wave height + analytical partial derivatives
          const p1 = x * 0.012 + y * 0.006 - t * 1.25;
          const p2 = y * 0.014 - x * 0.005 + t * 0.9;
          const p3 = (x + y) * 0.007 + t * 0.65;
          const w1 = Math.sin(p1), c1 = Math.cos(p1);
          const w2 = Math.cos(p2), s2 = Math.sin(p2);
          const w3 = Math.sin(p3), c3 = Math.cos(p3);
          const wave = w1 * w2 * 0.65 + w3 * 0.35; // [-1, 1]
          const dwx = 0.65 * (0.012 * c1 * w2 + w1 * 0.005 * s2) + 0.35 * 0.007 * c3;
          const dwy = 0.65 * (0.006 * c1 * w2 - w1 * 0.014 * s2) + 0.35 * 0.007 * c3;

          const n = 0.56 + 0.44 * wave;
          const dnx = 0.44 * dwx;
          const dny = 0.44 * dwy;

          let f = ex * ey * n * 1.3;
          let dfx = (dex * ey * n + ex * ey * dnx) * 1.3;
          let dfy = (ex * dey * n + ex * ey * dny) * 1.3;

          const dx1 = x - gx1, dy1 = y - gy1, d1Sq = dx1 * dx1 + dy1 * dy1;
          if (d1Sq < 57600) {
            const d1 = Math.sqrt(d1Sq) || 1;
            const k1 = 1 - d1 / 240;
            f += k1 * k1 * 0.28;
            const gSlope = (-0.56 * k1) / (240 * d1);
            dfx += gSlope * dx1;
            dfy += gSlope * dy1;
          }
          const dx2 = x - gx2, dy2 = y - gy2, d2Sq = dx2 * dx2 + dy2 * dy2;
          if (d2Sq < 57600) {
            const d2 = Math.sqrt(d2Sq) || 1;
            const k2 = 1 - d2 / 240;
            f += k2 * k2 * 0.28;
            const gSlope = (-0.56 * k2) / (240 * d2);
            dfx += gSlope * dx2;
            dfy += gSlope * dy2;
          }

          const z = f < 0 ? 0 : f > 1 ? 1 : f;
          if (z < 0.05) continue;

          // Surface normal N = normalize(-Z_SCALE * df/dx, -Z_SCALE * df/dy, 1)
          const sx = -dfx * Z_SCALE, sy = -dfy * Z_SCALE;
          const invN = 1 / Math.sqrt(sx * sx + sy * sy + 1);
          const nx = sx * invN, ny = sy * invN, nz = invN;

          // Subtle 3D relief projection based on elevation & slope
          let drawX = x + nx * z * 2.6;
          let drawY = y + ny * z * 2.6;
          let r = z * G * 0.39;
          let gleamBucket = -1;

          if (lit) {
            const vx = lx - x, vy = ly - y;
            const dSq = vx * vx + vy * vy;
            if (dSq < r2Max) {
              const dist2 = Math.sqrt(dSq);
              const falloff = 1 - dist2 / R;
              const atten = falloff * falloff * (3 - 2 * falloff); // smoothstep radial falloff

              // 3D light direction from surface point (x, y, z * 44) to cursor light (lx, ly, LIGHT_Z)
              const vz = LIGHT_Z - z * 44;
              const invL = 1 / Math.sqrt(dSq + vz * vz);
              const ldx = vx * invL, ldy = vy * invL, ldz = vz * invL;

              // Lambertian facet illumination + Blinn-Phong specular ridge highlight
              const ndotl = Math.max(0, nx * ldx + ny * ldy + nz * ldz);
              const hzf = ldz + 1;
              const invHalf = 1 / Math.sqrt(ldx * ldx + ldy * ldy + hzf * hzf);
              const ndoth = Math.max(0, (nx * ldx + ny * ldy + nz * hzf) * invHalf);
              const ndoth2 = ndoth * ndoth;
              const ndoth4 = ndoth2 * ndoth2;
              const spec = ndoth4 * ndoth4 * ndoth4; // ndoth^12 crisp ridge specular

              // Depth occlusion: elevated ridges gleam brightly; deep troughs stay recessed in shadow
              const crestFactor = Math.max(0.06, Math.min(1, (wave + 0.72) * 0.68)) * (0.2 + 0.8 * z);
              const gleam = atten * energy * crestFactor * (0.42 * ndotl + 1.05 * spec);

              // Depth parallax & topological crest swell (valleys stay tight; crests lift toward light)
              const reliefLift = gleam * (0.35 + 0.65 * z);
              r = Math.min(G * 0.49, r + reliefLift * G * 0.18);
              drawX -= (vx / R) * z * 2.4 * atten * energy;
              drawY -= (vy / R) * z * 2.4 * atten * energy;

              if (gleam > 0.07) {
                gleamBucket = Math.min(5, Math.floor((gleam - 0.07) * 7.2));
              }
            }
          }

          if (gleamBucket >= 0) {
            glm[gleamBucket].push(drawX, drawY, r);
          } else {
            const ab = z < 0.28 ? 0 : z < 0.56 ? 1 : 2;
            amb[ab].push(drawX, drawY, r);
          }
        }
      }

      for (let b = 0; b < 3; b++) {
        const arr = amb[b];
        if (!arr.length) continue;
        cx.fillStyle = ambientStyles[b];
        cx.beginPath();
        for (let k = 0; k < arr.length; k += 3) {
          const dx = arr[k], dy = arr[k + 1], dr = arr[k + 2];
          cx.moveTo(dx + dr, dy);
          cx.arc(dx, dy, dr, 0, 6.2832);
        }
        cx.fill();
      }
      for (let b = 0; b < 6; b++) {
        const arr = glm[b];
        if (!arr.length) continue;
        cx.fillStyle = gleamStyles[b];
        cx.beginPath();
        for (let k = 0; k < arr.length; k += 3) {
          const dx = arr[k], dy = arr[k + 1], dr = arr[k + 2];
          cx.moveTo(dx + dr, dy);
          cx.arc(dx, dy, dr, 0, 6.2832);
        }
        cx.fill();
      }
    };

    const tick = (now: number) => {
      boost *= 0.9;
      const target = inside ? Math.min(1, 0.72 + boost * 0.28) : 0;
      energy += (target - energy) * (inside ? 0.18 : 0.08);
      if (lx < -5e3 && tx > -5e3) {
        lx = tx; ly = ty;
      } else if (tx > -5e3) {
        lx += (tx - lx) * 0.28;
        ly += (ty - ly) * 0.28;
      }
      draw(now);
      raf = (energy > 0.01 || inside) && vis ? requestAnimationFrame(tick) : 0;
    };
    const startLoop = () => {
      if (!raf && vis && (energy > 0.01 || inside)) raf = requestAnimationFrame(tick);
    };
    const size = () => {
      const r = el.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(W / G) + 1; rows = Math.ceil(H / G) + 1;
      draw(performance.now());
    };
    const move = (e: globalThis.PointerEvent) => {
      if (!fine(e)) return;
      const r = cv.getBoundingClientRect();
      const nx = e.clientX - r.left, ny = e.clientY - r.top;
      if (tx > -5e3) {
        const v = Math.hypot(nx - tx, ny - ty);
        boost = Math.min(1, boost + v * 0.025);
      } else {
        lx = nx; ly = ny; boost = 0.6;
      }
      tx = nx; ty = ny; inside = true;
      if (calm) { energy = 0.85; lx = nx; ly = ny; draw(performance.now()); }
      else startLoop();
    };
    const leave = () => {
      inside = false;
      if (calm) { energy = 0; draw(performance.now()); }
      else startLoop();
    };
    size();
    startLoop();
    const io = new IntersectionObserver(([en]) => { vis = en.isIntersecting; if (vis) startLoop(); });
    io.observe(el);
    const ro = new ResizeObserver(size);
    ro.observe(el);
    el.addEventListener('pointerenter', move);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    // the theme can change while the page is open (the device setting): redraw in the new ink
    const mo = new MutationObserver(() => { tone(); draw(performance.now()); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      io.disconnect(); ro.disconnect(); mo.disconnect();
      el.removeEventListener('pointerenter', move);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
    };
  }, [host]);
  return <canvas ref={ref} className="x-dots" aria-hidden="true" />;
}

/* A light that follows the pointer across "Pick all three." */
function Three({ calm }: { calm: boolean | null }) {
  const ref = useRef<HTMLSpanElement>(null);
  const light = useRef({ x: -1e4, ink: 100, tx: -1e4, tink: 100, sweep: 0, frame: 0 });
  const paint = () => {
    const el = ref.current, l = light.current;
    if (!el) return;
    el.style.setProperty('--x', `${l.x.toFixed(1)}px`);
    el.style.setProperty('--ink-mix', `${l.ink.toFixed(1)}%`);
  };
  const run = () => {
    const l = light.current;
    if (l.frame) return;
    const step = (now: number) => {
      const el = ref.current;
      if (!el) { l.frame = 0; return; }
      if (l.sweep) {
        const w = el.getBoundingClientRect().width;
        const t = Math.min(1, Math.max(0, (now - l.sweep) / 1250));
        const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        l.tx = -0.25 * w + e * 1.5 * w;
        l.tink = t < 0.85 ? 32 : 100;
        if (t === 1) l.sweep = 0;
      }
      l.x += (l.tx - l.x) * (l.sweep ? 1 : 0.24);
      l.ink += (l.tink - l.ink) * 0.14;
      paint();
      const settled = !l.sweep && Math.abs(l.tx - l.x) < 0.5 && Math.abs(l.tink - l.ink) < 0.5;
      l.frame = settled ? 0 : requestAnimationFrame(step);
    };
    l.frame = requestAnimationFrame(step);
  };
  useEffect(() => () => cancelAnimationFrame(light.current.frame), []);
  const at = (e: { clientX: number }, ink: number) => {
    const el = ref.current, l = light.current;
    if (!el) return;
    l.sweep = 0;
    l.tx = e.clientX - el.getBoundingClientRect().left;
    l.tink = ink;
    if (calm) { l.x = l.tx; l.ink = ink; paint(); }
    else run();
  };
  return (
    <span
      ref={ref}
      className="x-flash"
      onPointerEnter={(e) => at(e, 32)}
      onPointerMove={(e) => at(e, 32)}
      onPointerLeave={(e) => at(e, 100)}
    >
      Pick all three.
    </span>
  );
}


export default function Hero() {
  const host = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const calm = useReducedMotion();
  const inView = useInView(host, { amount: 0.2 });
  const live = useRef(true);
  live.current = inView;
  // the terminal's Copy copies the active CLI command it shows, and says so
  const [copied, setCopied] = useState(false);
  const copyT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const copy = async (cmdText = CMD) => {
    const line = typeof cmdText === 'string' && cmdText ? cmdText : CMD;
    if (!(await copyText(line))) return;
    capture('home_copied', { block: 'hero', command: line });
    setCopied(true);
    clearTimeout(copyT.current);
    copyT.current = setTimeout(() => setCopied(false), 1600);
  };

  // the landing is counted once, when the hero is first drawn; a press on Download App is read where the page transition reads it
  useEffect(() => { capture('home_viewed'); }, []);
  useEffect(() => press('.x-phone-dl', () => track('hero_demo', { control: 'phone-download' })), []);

  // Safari fallback for CSS tan(atan2(100cqw, var(--sw))): keep --k-js synced with the stage's live width
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const sync = () => {
      const w = el.clientWidth;
      if (!w) return;
      const rawSw = parseFloat(getComputedStyle(el).getPropertyValue('--sw'));
      const sw = rawSw > 0 ? rawSw : (window.innerWidth <= 640 ? 360 : 720);
      const k = Math.min(1.15, w / sw);
      el.style.setProperty('--k-js', k.toFixed(4));
    };
    sync();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(sync) : null;
    ro?.observe(el);
    window.addEventListener('resize', sync, { passive: true });
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, []);

  // Start populated on SSR and first paint so Desktop and Phone never flash blank white on load or loop wrap
  const [typed, setTypedState] = useState(PROMPT.length);
  const promptEl = useRef<HTMLSpanElement>(null);
  const setTyped = (i: number) => { if (promptEl.current) promptEl.current.textContent = PROMPT.slice(0, i); if (i === 0 || i === PROMPT.length) setTypedState(i); };
  const [phase, setPhase] = useState(4);
  // scene -1 is the opening maxpower build; then the rest of Hanzo's day plays: one scene every 6.5 s, wrapping back to -1
  const [sc, setSc] = useState(-1);
  const [navPick, setNavPick] = useState<string | null>(null);
  const [side, setSide] = useState(true);
  const holdUntilRef = useRef(0);

  const selectScene = (nextSc: number, navId: string | null = null) => {
    holdUntilRef.current = Date.now() + 12000;
    setTyped(PROMPT.length);
    setPhase(4);
    setSc(nextSc);
    setNavPick(navId);
  };

  useEffect(() => {
    if (calm) return;
    holdUntilRef.current = Date.now() + 5200;
    const t = setInterval(() => {
      if (!live.current || Date.now() < holdUntilRef.current) return;
      setNavPick(null);
      setSc((n) => ((n + 2) % (MORE.length + 1)) - 1);
    }, 6200);
    return () => clearInterval(t);
  }, [calm]);


  // pointer: the three devices turn toward it, each at its own depth
  const rx = useSpring(0, { stiffness: 90, damping: 18 });
  const ry = useSpring(0, { stiffness: 90, damping: 18 });
  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!fine(e)) return;
    const r = host.current!.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 6);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 4);
  };

  const line = (content: ReactNode, idx: string) => (
    <span className="x-line">
      <span className="x-line-in"><span data-line={idx}>{content}</span></span>
    </span>
  );

  return (
    <section className="x-hero" data-slot="hero" ref={host} onPointerMove={onMove} onPointerLeave={() => { rx.set(0); ry.set(0); }} aria-labelledby="home-title">
      <Dots host={host} />
      <div className="x-wrap x-hero-grid">
        <div className="x-hero-copy">
          <a href="/blog/pareto-frontier" className="x-badge">
            <span className="x-badge-shine" aria-hidden="true" />
            <svg className="x-badge-spark" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M8 1.5l1.6 4.2 4.2 1.6-4.2 1.6L8 13.1 6.4 8.9 2.2 7.3l4.2-1.6z" fill="currentColor" /></svg>
            <span className="x-badge-t">A New Pareto Frontier</span>
            <svg className="x-badge-chev" viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
          <h1 id="home-title" className="x-h1">
            <span className="x-h1-a">{line('Smarter, Faster, Open Source.', '1')}</span>
            <span className="x-h1-b">{line(<Three calm={calm} />, '2')}</span>
          </h1>
          <p className="x-hero-lede">
            Frontier intelligence over <b>200×</b> faster and <span className="x-nowrap"><b>400×</b> cheaper.</span> Agentic OS for organizations of every size.
          </p>
          <div className="x-auth">
            <div className="x-auth-row">
              <a href="https://hanzo.ai/signup?provider=google" className="x-auth-b">
                <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h6a5.1 5.1 0 0 1-2.2 3.4v2.8h3.6c2.1-2 3.2-4.9 3.2-8.2z" /><path fill="currentColor" d="M12 23c3 0 5.5-1 7.4-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.9A11 11 0 0 0 12 23z" /><path fill="currentColor" d="M5.7 14c-.2-.7-.4-1.3-.4-2s.1-1.4.4-2V7.1H2a11 11 0 0 0 0 9.8L5.7 14z" /><path fill="currentColor" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2 7.1L5.7 10C6.6 7.4 9.1 5.4 12 5.4z" /></svg>
                Continue with Google
              </a>
              <a href="https://hanzo.ai/signup?provider=github" className="x-auth-b">
                <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z" /></svg>
                Continue with GitHub
              </a>
            </div>
            <div className="x-or"><span>or</span></div>
            <div className="x-auth-mag">
              <a href="https://hanzo.ai/signup" className="x-auth-b solid">Continue with email</a>
            </div>
          </div>
        </div>

        <div className="x-hero-stage" ref={stageRef}>
          <div className="x-fit">
            <motion.div className="x-3d" style={{ rotateX: rx, rotateY: ry }}>
              <Desk sc={sc} navPick={navPick} onSelectScene={selectScene} phase={phase} side={side} onSide={() => setSide((v) => !v)} promptEl={promptEl} full={typed === PROMPT.length} />
              <Term onSelectScene={selectScene} calm={calm} inView={inView} copy={copy} copied={copied} />
              <Phone sc={sc} navPick={navPick} onSelectScene={selectScene} phase={phase} />
            </motion.div>
          </div>
          <SetupMenu up />
        </div>
      </div>
    </section>
  );
}

