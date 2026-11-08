'use client';
/* The models section as a journey (desktop, motion allowed, WebGL present). The section pins; scrolling carries a
   camera through space from Enso to Mori, each a faceted solid wearing its own artwork. The left panel is real HTML:
   each model's existing kicker, name and description as a link (Tab moves through them and brings each into view,
   Enter opens it). Floating labels are the model's existing tags, tied to the solid by hairlines. A counter, a tick
   list and the section's own lede sit round the edge. This file and three.js are imported only when the section comes near (components/Models.jsx). */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useOpener } from '../Opener';
import { createScene } from './scene';

const pad = (n) => String(n).padStart(2, '0');
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const ease = (x) => x * x * (3 - 2 * x);
function webgl() {
  try {
    const c = document.createElement('canvas'), g = c.getContext('webgl2') || c.getContext('webgl');
    g?.getExtension('WEBGL_lose_context')?.loseContext();
    return !!g;
  } catch { return false; }
}

export default function Journey({ models, media, lede, onFail }) {
  const N = models.length;
  const track = useRef(null), stage = useRef(null), canvas = useRef(null), hit = useRef(null);
  const labels = useRef([]), lines = useRef([]);
  const api = useRef(null), activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const opener = useOpener();

  // scroll -> where the camera should be: a dwell at each model, a glide between them
  const target = useCallback(() => {
    const el = track.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect(), total = r.height - innerHeight;
    const x = clamp(-r.top / Math.max(1, total), 0, 1) * (N - 1);
    const i = Math.floor(x), f = x - i;
    return Math.min(N - 1, i + ease(clamp((f - 0.3) / 0.4, 0, 1)));
  }, [N]);

  const show = useCallback((i) => { if (i !== activeRef.current) { activeRef.current = i; setActive(i); } }, []);

  // bring model i into view (keyboard focus, a tick, a click on a far solid)
  const goTo = useCallback((i, immediate) => {
    const el = track.current;
    if (!el) return;
    const r = el.getBoundingClientRect(), total = r.height - innerHeight;
    const y = scrollY + r.top + (i / (N - 1)) * total + 1;
    if (Math.abs(y - scrollY) < 2) return;
    if (window.__lenis) window.__lenis.scrollTo(y, immediate ? { immediate: true, force: true } : { duration: 1.2 });
    else scrollTo({ top: y, behavior: immediate ? 'instant' : 'smooth' });
  }, [N]);

  const open = useCallback((e, i) => {
    const m = models[i];
    if (!opener) return;
    const el = ready && hit.current ? hit.current : e.currentTarget;
    opener.open(e, { el, src: media(m.slug, 'webp'), href: '/' + m.slug, key: m.slug });
  }, [models, media, opener, ready]);

  // until the scene runs (and as a fallback), the panel follows scroll on its own
  useEffect(() => {
    const on = () => { if (!api.current) show(Math.round(target())); };
    on();
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, [target, show]);

  // run the scene only while it is on screen; a window that narrows (or turns on reduced motion) gets the grid
  useEffect(() => {
    let alive = true, scene = null, io = null, pin = null, ro = null, mo = null, onVis = null;
    const theme = () => (document.documentElement.classList.contains('light') ? 'light' : 'dark');
    const ink = () => getComputedStyle(stage.current).color;
    if (!webgl()) { onFail?.('grid'); return; }
    const mq = matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    const narrow = () => !mq.matches && onFail?.('grid');
    mq.addEventListener('change', narrow);
    const boot = () => {
      try {
        scene = createScene(canvas.current, { models, media, theme: theme(), onReady: () => alive && setReady(true) });
        scene.setTheme(theme(), ink());
        api.current = scene;
        scene.bind({
          getTarget: target,
          onFrame: (o) => {
            show(o.i);
            const b = o.box, sr = stage.current.getBoundingClientRect();
            if (b && hit.current) Object.assign(hit.current.style, { left: b.x + 'px', top: b.y + 'px', width: b.w + 'px', height: b.h + 'px' });
            labels.current.forEach((lab, k) => {
              const a = o.anchors[k], ln = lines.current[k];
              if (!lab || !a || !b) return;
              const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
              let dx = a.x - cx, dy = a.y - cy;
              const len = Math.hypot(dx, dy) || 1; dx /= len; dy /= len;
              const reach = Math.max(70, b.w * 0.34);
              const lx = clamp(a.x + dx * reach, 12, sr.width - 150), ly = clamp(a.y + dy * reach * 0.7, 80, sr.height - 90);
              lab.style.transform = `translate3d(${lx}px, ${ly}px, 0) translate(${dx < 0 ? '-100%' : '0'}, -50%)`;
              if (ln) { ln.setAttribute('x1', a.x); ln.setAttribute('y1', a.y); ln.setAttribute('x2', lx); ln.setAttribute('y2', ly); }
            });
          },
        });
        ro = new ResizeObserver(() => scene.resize());
        ro.observe(stage.current);
        let onScreen = false;
        io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; onScreen && !document.hidden ? scene.start() : scene.stop(); });
        // while the journey holds the screen, its own ticks stand in for the page's section index
        pin = new IntersectionObserver(([e]) => document.documentElement.classList.toggle('x-mj-pinned', e.isIntersecting), { rootMargin: '-50% 0px -50% 0px' });
        pin.observe(track.current);
        io.observe(track.current);
        onVis = () => (document.hidden || !onScreen ? scene.stop() : scene.start());
        document.addEventListener('visibilitychange', onVis);
        mo = new MutationObserver(() => scene.setTheme(theme(), ink()));
        mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        scene.jump(target());
      } catch (err) {
        if (alive) onFail?.('grid');
      }
    };
    boot();
    return () => {
      alive = false;
      mq.removeEventListener('change', narrow);
      io?.disconnect(); pin?.disconnect(); document.documentElement.classList.remove('x-mj-pinned'); ro?.disconnect(); mo?.disconnect();
      onVis && document.removeEventListener('visibilitychange', onVis);
      api.current = null;
      scene?.dispose();
    };
  }, [models, media, target, show, onFail]);

  // drag rotates the model in front; a click on it opens its page, a click on another flies there
  const ptr = useRef(null);
  const local = (e) => { const r = canvas.current.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const onDown = (e) => {
    if (!api.current || e.button > 0) return;
    const [x, y] = local(e);
    ptr.current = { x, y, lx: x, ly: y, moved: 0, id: e.pointerId };
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
    } else {
      const i = s.pick(x, y);
      canvas.current.style.cursor = i === activeRef.current ? 'pointer' : i >= 0 ? 'pointer' : 'grab';
    }
  };
  const onUp = (e) => {
    const p = ptr.current, s = api.current;
    ptr.current = null;
    canvas.current.style.cursor = '';
    if (!p || !s || p.moved > 6) return;
    const [x, y] = local(e), i = s.pick(x, y);
    if (i < 0) return;
    if (i === activeRef.current) open(e, i); else goTo(i);
  };

  const m = models[active];
  return (
    <div className="x-mj" ref={track} style={{ '--mj-n': N }} data-ready={ready ? '' : undefined}>
      <div className="x-mj-stage" ref={stage}>
        <div className="x-mj-dots" aria-hidden="true" />
        <div className="x-mj-glow" aria-hidden="true" />
        <img className="x-mj-poster" src={media(m.slug, 'webp')} alt="" aria-hidden="true" key={m.slug} />
        <canvas
          ref={canvas}
          className="x-mj-gl"
          aria-hidden="true"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={() => { ptr.current = null; }}
        />
        <span className="x-mj-hit" ref={hit} aria-hidden="true" />

        <svg className="x-mj-wires" aria-hidden="true">
          {m.tags.map((t, k) => <line key={m.slug + t} ref={(el) => { lines.current[k] = el; }} />)}
        </svg>
        <div className="x-mj-labels" aria-hidden="true" key={m.slug}>
          {m.tags.map((t, k) => (
            <span key={t} className="x-mj-label" ref={(el) => { labels.current[k] = el; }} style={{ '--k': k }}><i />{t}</span>
          ))}
        </div>

        <div className="x-mj-panel x-wrap">
          <ol className="x-mj-list">
            {models.map((x, i) => (
              <li key={x.slug} className={i === active ? 'on' : i < active ? 'past' : ''}>
                <a
                  href={'/' + x.slug}
                  className="x-mj-link"
                  data-card={x.slug}
                  aria-label={`${x.name}: ${x.desc}`}
                  aria-current={i === active ? 'true' : undefined}
                  onFocus={() => { show(i); goTo(i, true); }}
                  onClick={(e) => open(e, i)}
                >
                  <span className="x-mj-kick"><span className="x-mj-num">{pad(i + 1)}</span>{x.kicker && <span>{x.kicker}</span>}</span>
                  <span className="x-mj-name"><span>{x.name}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                  <span className="x-mj-desc">{x.desc}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>

        <p className="x-mj-side" aria-hidden="true">{lede}</p>
        <ol className="x-mj-ticks" aria-hidden="true">
          {models.map((x, i) => (
            <li key={x.slug}><button type="button" tabIndex={-1} className={i === active ? 'on' : ''} onClick={() => goTo(i)}><span>{x.name}</span></button></li>
          ))}
        </ol>
        <div className="x-mj-count" aria-hidden="true"><b>{pad(active + 1)}</b><span>/</span>{pad(N)}</div>
        <div className="x-mj-hint" aria-hidden="true">
          <svg viewBox="0 0 24 24"><rect x="7" y="3" width="10" height="18" rx="5" /><path className="x-mj-wheel" d="M12 7v3" /></svg>
          <i />
          <svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" /><path d="M18 3v4h-4M6 21v-4h4" /></svg>
          <i />
          <svg viewBox="0 0 24 24"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V11m0-.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-.5a6 6 0 0 1-4.6-2.2L4.6 15.6a1.5 1.5 0 0 1 2.3-1.9L9 16V11" /></svg>
        </div>
      </div>
    </div>
  );
}
