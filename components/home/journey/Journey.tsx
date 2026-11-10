'use client';
/* The products section as a journey (desktop, motion allowed, WebGL present). The section pins; scrolling carries a
   camera through space from App to Team in dock order, each product a faceted graphite slab carrying its own screen.
   The left panel is real HTML: the product's existing name, address and links (Download or Learn more, Open), exactly
   as on its stage window. The dock stays as the index: choosing a product scrolls the journey to it. A counter, the
   address tied to the slab by a hairline and a gesture hint sit round the edge. This file and three.js are imported
   only when the section comes near (components/home/Platform.jsx). */
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue } from 'motion/react';
import { Head, mod } from '../../ui';
import { A } from '../../kit';
import { DockItem } from '../Platform';
import { createScene } from './scene';

const pad = (n) => String(n).padStart(2, '0');
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const ease = (x) => x * x * (3 - 2 * x);
const art = (p, theme) => `/home/products/${p.name.toLowerCase()}-${theme}.webp`;
const addrHref = (p) => (p.addr.startsWith('hanzo.ai/') ? p.addr.slice(8) : 'https://' + p.addr);
function webgl() {
  try {
    const c = document.createElement('canvas'), g = c.getContext('webgl2') || c.getContext('webgl');
    g?.getExtension('WEBGL_lose_context')?.loseContext();
    return !!g;
  } catch { return false; }
}

export default function Journey({ products: P, title, lede, onFail }) {
  const N = P.length;
  const track = useRef(null), stage = useRef(null), canvas = useRef(null), hit = useRef(null), panel = useRef(null);
  const label = useRef(null), wire = useRef(null);
  const api = useRef(null), activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [fine, setFine] = useState(false);
  const [peek, setPeek] = useState(null);
  const [scenes, setScenes] = useState([]);
  const mx = useMotionValue(Infinity);
  const progress = useMotionValue(0);

  useEffect(() => {
    let live = true;
    import('../scenes.json').then((m) => { if (live) setScenes(m.default); });
    return () => { live = false; };
  }, []);

  useEffect(() => {
    const mq = matchMedia('(hover: hover) and (pointer: fine)');
    const f = () => setFine(mq.matches); f(); mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, []);

  // scroll -> where the camera should be: a dwell at each product, a glide between them
  const target = useCallback(() => {
    const el = track.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect(), total = r.height - innerHeight;
    const x = clamp(-r.top / Math.max(1, total), 0, 1) * (N - 1);
    const i = Math.floor(x), f = x - i;
    return Math.min(N - 1, i + ease(clamp((f - 0.3) / 0.4, 0, 1)));
  }, [N]);

  const show = useCallback((i) => { if (i !== activeRef.current) { activeRef.current = i; setActive(i); } }, []);

  // bring product i into view (the dock switches directly; a click on a far slab glides there)
  const goTo = useCallback((i, immediate) => {
    const el = track.current;
    if (!el) return;
    show(i);
    if (immediate) api.current?.jump(i);
    const r = el.getBoundingClientRect(), total = r.height - innerHeight;
    const y = scrollY + r.top + (i / (N - 1)) * total + 1;
    if (Math.abs(y - scrollY) >= 2) {
      if (window.__lenis) window.__lenis.scrollTo(y, immediate ? { immediate: true, force: true } : { duration: 1.2 });
      else scrollTo({ top: y, behavior: immediate ? 'instant' : 'smooth' });
    }
    if (immediate) api.current?.jump(i);
  }, [N, show]);

  // a click on the slab in front opens the product, the same link as its address
  const open = useCallback(() => { panel.current?.querySelector('li.on .xpj-addr')?.click(); }, []);

  // until the scene runs (and as a fallback), the panel follows scroll on its own
  useEffect(() => {
    const on = () => { if (!api.current) show(Math.round(target())); };
    on();
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, [target, show]);

  // run the scene only while it is on screen; a window that narrows (or turns on reduced motion) gets the stage
  useEffect(() => {
    let alive = true, scene = null, io = null, ro = null, mo = null, onVis = null;
    const theme = () => (document.documentElement.classList.contains('light') ? 'light' : 'dark');
    const ink = () => getComputedStyle(stage.current).color;
    if (!webgl()) { onFail?.('stage'); return; }
    const mq = matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    const narrow = () => !mq.matches && onFail?.('stage');
    mq.addEventListener('change', narrow);
    try {
      scene = createScene(canvas.current, { items: P, art, theme: theme(), onReady: () => alive && setReady(true) });
      scene.setTheme(theme(), ink());
      api.current = scene;
      scene.bind({
        getTarget: target,
        onFrame: (o) => {
          show(o.i);
          const b = o.box, a = o.anchors[0], sr = stage.current.getBoundingClientRect();
          if (!b) return;
          Object.assign(hit.current.style, { left: b.x + 'px', top: b.y + 'px', width: b.w + 'px', height: b.h + 'px' });
          if (a && label.current) {
            const lx = clamp(a.x + 46, 12, sr.width - 220), ly = clamp(a.y - 54, 80, sr.height - 160);
            label.current.style.transform = `translate3d(${lx}px, ${ly}px, 0) translateY(-50%)`;
            const ln = wire.current;
            if (ln) { ln.setAttribute('x1', a.x); ln.setAttribute('y1', a.y); ln.setAttribute('x2', lx); ln.setAttribute('y2', ly); }
          }
        },
      });
      ro = new ResizeObserver(() => scene.resize());
      ro.observe(stage.current);
      let onScreen = false;
      io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; onScreen && !document.hidden ? scene.start() : scene.stop(); });
      io.observe(track.current);
      onVis = () => (document.hidden || !onScreen ? scene.stop() : scene.start());
      document.addEventListener('visibilitychange', onVis);
      mo = new MutationObserver(() => scene.setTheme(theme(), ink()));
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      scene.jump(target());
    } catch {
      if (alive) onFail?.('stage');
    }
    return () => {
      alive = false;
      mq.removeEventListener('change', narrow);
      io?.disconnect(); ro?.disconnect(); mo?.disconnect();
      onVis && document.removeEventListener('visibilitychange', onVis);
      api.current = null;
      scene?.dispose();
    };
  }, [P, target, show, onFail]);

  // drag turns the product in front; a click on it opens the product, a click on another flies there
  const ptr = useRef(null);
  const local = (e) => { const r = canvas.current.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const onDown = (e) => {
    if (!api.current || e.button > 0) return;
    const [x, y] = local(e);
    ptr.current = { lx: x, ly: y, moved: 0 };
    canvas.current.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e) => {
    const s = api.current;
    if (!s) return;
    const [x, y] = local(e), p = ptr.current;
    if (p) {
      p.moved += Math.hypot(x - p.lx, y - p.ly);
      s.drag(activeRef.current, x - p.lx, y - p.ly);
      p.lx = x; p.ly = y;
      canvas.current.style.cursor = 'grabbing';
    } else canvas.current.style.cursor = s.pick(x, y) >= 0 ? 'pointer' : 'grab';
  };
  const onUp = (e) => {
    const p = ptr.current, s = api.current;
    ptr.current = null;
    canvas.current.style.cursor = '';
    if (!p || !s || p.moved > 6) return;
    const [x, y] = local(e), i = s.pick(x, y);
    if (i < 0) return;
    if (i === activeRef.current) open(); else goTo(i);
  };

  // the dock keeps its keys: arrows, Home and End choose a product (and fly there)
  const onKey = (e) => {
    let i = null;
    if (e.key === 'ArrowRight') i = mod(active + 1, N);
    else if (e.key === 'ArrowLeft') i = mod(active - 1, N);
    else if (e.key === 'Home') i = 0;
    else if (e.key === 'End') i = N - 1;
    if (i === null) return;
    e.preventDefault();
    goTo(i, true);
    document.getElementById(`xp-tab-${i}`)?.focus();
  };

  const p = P[active];
  return (
    <section className="x-sec x-platform xpj-sec" id="products" data-hz-view="products" aria-labelledby="products-h" data-mode="journey">
      <div className="x-wrap"><Head title={title} lede={lede} /></div>
      <div className="xpj" ref={track} style={{ '--xpj-n': N }} data-ready={ready ? '' : undefined}>
        <div className="xpj-stage" ref={stage}>
          <div className="xpj-dots" aria-hidden="true" />
          <div className="xpj-glow" aria-hidden="true" />
          <img className="xpj-poster dk" src={art(p, 'dark')} alt="" aria-hidden="true" key={'pd-' + p.name} />
          <img className="xpj-poster lt" src={art(p, 'light')} alt="" aria-hidden="true" key={'pl-' + p.name} />
          <canvas ref={canvas} className="xpj-gl" aria-hidden="true" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={() => { ptr.current = null; }} />
          <span className="xpj-hit" ref={hit} aria-hidden="true" />
          <svg className="xpj-wires" aria-hidden="true"><line ref={wire} key={'wire-' + p.name} /></svg>
          <A className="xpj-label" ref={label} to={addrHref(p)} aria-label={`Open ${p.addr}`} key={'label-' + p.name}><i />{p.addr.toLowerCase()} ↗</A>

          <div className="xpj-panel x-wrap" ref={panel}>
            <ol className="xpj-list" id="xp-panel" role="tabpanel" aria-labelledby={`xp-tab-${active}`}>
              {P.map((x, i) => (
                <li key={x.name} className={i === active ? 'on' : i < active ? 'past' : ''} inert={i !== active}>
                  <span className="xpj-kick"><A className="xpj-addr" to={addrHref(x)} aria-label={`Open Hanzo ${x.name} at ${x.addr}`}>{x.addr.toLowerCase()} ↗</A></span>
                  <h3 className="xpj-name">{x.name}</h3>
                  <span className="xpj-acts">
                    {x.acts.map((a, k) => (
                      <motion.a key={a.label} href={a.href} className={'x-btn' + (k === x.acts.length - 1 ? ' solid' : '')} whileTap={{ scale: 0.96 }}>{a.label}{k === x.acts.length - 1 ? ' ↗' : ''}</motion.a>
                    ))}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="xpj-hint" aria-hidden="true">
            <svg viewBox="0 0 24 24"><rect x="7" y="3" width="10" height="18" rx="5" /><path className="xpj-wheel" d="M12 7v3" /></svg>
            <i />
            <svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" /><path d="M18 3v4h-4M6 21v-4h4" /></svg>
            <i />
            <svg viewBox="0 0 24 24"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V11m0-.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-.5a6 6 0 0 1-4.6-2.2L4.6 15.6a1.5 1.5 0 0 1 2.3-1.9L9 16V11" /></svg>
          </div>

          <div className="xpj-nav">
            <div
              className="xp-dock"
              role="tablist"
              aria-label="Choose a product"
              onPointerMove={(e) => { if (e.pointerType === 'mouse') mx.set(e.clientX); }}
              onPointerLeave={() => { mx.set(Infinity); setPeek(null); }}
            >
              {P.map((x, i) => (
                <DockItem
                  key={x.name}
                  i={i} on={i === active} mx={mx} fine={fine} calm={false} narrow={false} fly={null}
                  progress={progress} playing={false} peek={peek} setPeek={setPeek}
                  onPick={(k) => { setPeek(null); goTo(k, true); }} onKey={onKey} scenes={scenes[i]}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
