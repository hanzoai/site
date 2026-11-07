'use client';
/* McpCompare (page-local to /mcp): the page's signature, a before / after slider.
   One client, two states: on the left its .mcp.json before Hanzo MCP is added (an empty mcpServers) and the slots
   where tools would be; on the right the same client with Hanzo's own .mcp.json block and the tools it then carries
   (Hanzo's names, from the runtime copy). A divider splits them; drag it (pointer or finger, anywhere on the panel),
   or focus the handle and use the arrow keys (role=slider, aria-valuenow). Clip-path only, so nothing reflows.
   Entrance (cursor-trail): when the panel first reaches the screen, a cursor glides in from the right edge and drags
   the divider to the middle, leaving a fading trail of dots; after that, on a hover pointer, the trail follows the
   visitor's cursor across the panel. Reduced motion: the divider rests at 50%, no cursor, no trail. */
import { useEffect, useRef, useState } from 'react';

const N = 12; // trail dots
const clamp = (v) => Math.max(0, Math.min(100, v));

export default function McpCompare({ json, tools, client }) {
  const [pos, setPos] = useState(50);
  const [drag, setDrag] = useState(false);
  const box = useRef(null);
  const dots = useRef([]);
  const cur = useRef(null);
  const st = useRef({ tx: 0, ty: 0, pts: null, alive: 0, raf: 0, intro: false, user: false });

  /* the trail: each dot eases toward the one ahead of it; the loop runs only while something is moving */
  const wake = () => {
    const s = st.current;
    if (s.raf) return;
    const step = () => {
      const s2 = st.current;
      if (!s2.pts) s2.pts = Array.from({ length: N }, () => [s2.tx, s2.ty]);
      s2.pts.forEach((p, i) => {
        const [ax, ay] = i ? s2.pts[i - 1] : [s2.tx, s2.ty];
        p[0] += (ax - p[0]) * (i ? 0.42 : 0.6);
        p[1] += (ay - p[1]) * (i ? 0.42 : 0.6);
      });
      s2.alive = Math.max(0, s2.alive - 0.018);
      dots.current.forEach((d, i) => {
        if (!d) return;
        const [x, y] = s2.pts[i];
        d.style.transform = `translate(${x}px, ${y}px) scale(${1 - i / (N * 1.4)})`;
        d.style.opacity = String(Math.min(1, s2.alive) * (1 - i / N) * 0.9);
      });
      if (cur.current) cur.current.style.transform = `translate(${s2.tx}px, ${s2.ty}px)`;
      s2.raf = s2.alive > 0 ? requestAnimationFrame(step) : 0;
    };
    s.raf = requestAnimationFrame(step);
  };

  /* the entrance: once, when the panel is first on screen */
  useEffect(() => {
    const el = box.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const s = st.current;
    const below = el.getBoundingClientRect().top > innerHeight * 0.92;
    if (below) setPos(96);
    let raf = 0;
    const run = () => {
      if (s.user) return;
      s.intro = true;
      el.classList.add('intro');
      const r = el.getBoundingClientRect();
      const t0 = performance.now(), D = 1400;
      s.tx = r.width * 0.98; s.ty = r.height * 0.78; s.pts = null;
      const go = (now) => {
        if (s.user) { el.classList.remove('intro'); s.intro = false; return; }
        const k = Math.min(1, (now - t0) / D);
        const e = 1 - Math.pow(1 - k, 3);
        const x = 0.96 + (0.5 - 0.96) * e; // 96% to 50%
        s.tx = r.width * x;
        s.ty = r.height * (0.78 - 0.3 * Math.sin(e * Math.PI * 0.5) + 0.08 * Math.sin(e * Math.PI * 2));
        s.alive = 1.4;
        setPos(x * 100);
        wake();
        if (k < 1) raf = requestAnimationFrame(go);
        else { s.intro = false; setTimeout(() => el.classList.remove('intro'), 500); }
      };
      raf = requestAnimationFrame(go);
    };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); setTimeout(run, 120); } }, { threshold: 0.45 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); cancelAnimationFrame(s.raf); s.raf = 0; };
  }, []);

  const at = (e) => {
    const r = box.current.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top, r.width];
  };
  const onDown = (e) => {
    if (e.button) return;
    st.current.user = true;
    box.current.setPointerCapture?.(e.pointerId);
    setDrag(true);
    if (e.pointerType === 'mouse') { const [x, , w] = at(e); setPos(clamp((x / w) * 100)); }
    st.current.x0 = e.clientX;
  };
  const onMove = (e) => {
    const [x, y, w] = at(e);
    if (drag) setPos(clamp((x / w) * 100));
    // the trail follows a hover pointer (not a finger), once the entrance has played
    if (e.pointerType === 'mouse' && !st.current.intro && matchMedia('(hover: hover)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const s = st.current;
      if (!s.pts) s.pts = Array.from({ length: N }, () => [x, y]);
      s.tx = x; s.ty = y; s.alive = 1.2; wake();
    }
  };
  const onUp = () => setDrag(false);
  const onKey = (e) => {
    const big = e.shiftKey || e.key === 'PageUp' || e.key === 'PageDown' ? 10 : 5;
    const k = { ArrowLeft: -big, ArrowDown: -big, PageDown: -big, ArrowRight: big, ArrowUp: big, PageUp: big }[e.key];
    if (k) { e.preventDefault(); st.current.user = true; setPos((p) => clamp(Math.round(p + k))); }
    else if (e.key === 'Home') { e.preventDefault(); st.current.user = true; setPos(0); }
    else if (e.key === 'End') { e.preventDefault(); st.current.user = true; setPos(100); }
  };

  const p = Math.round(pos * 10) / 10;
  const without = '{\n  "mcpServers": {}\n}';
  return (
    <div className={'mcp-cmp' + (drag ? ' drag' : '')} ref={box} style={{ '--p': p + '%' }}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
      {/* before: the client as it is */}
      <div className="mcp-cmp-l before">
        <p className="mcp-cmp-side">Without Hanzo MCP</p>
        <div className="mcp-cmp-in">
          <div className="mcp-cmp-code"><span className="x-mono">.mcp.json</span><pre className="x-mono">{without}</pre></div>
          <div className="mcp-cmp-tools">
            <p className="mcp-cmp-bar x-mono"><span>{client}</span></p>
            <ul aria-hidden="true">{tools.map((t) => <li key={t} className="x-mono">{t}</li>)}</ul>
          </div>
        </div>
      </div>
      {/* after: the same client with Hanzo's block, and the tools it now has */}
      <div className="mcp-cmp-l after" style={{ clipPath: `inset(0 0 0 ${p}%)` }}>
        <p className="mcp-cmp-side">With Hanzo MCP</p>
        <div className="mcp-cmp-in">
          <div className="mcp-cmp-code"><span className="x-mono">.mcp.json</span><pre className="x-mono">{json}</pre></div>
          <div className="mcp-cmp-tools">
            <p className="mcp-cmp-bar x-mono"><span>{client}</span><span className="mcp-cmp-live"><span className="mcp-live" />hanzo mcp<span>stdio</span></span></p>
            <ul>{tools.map((t, k) => <li key={t} className="x-mono" style={{ '--k': k }}>{t}</li>)}</ul>
          </div>
        </div>
      </div>
      <div className="mcp-cmp-div" aria-hidden="true" />
      <button type="button" className="mcp-cmp-h" role="slider" aria-label="Without and with Hanzo MCP" aria-valuemin={0} aria-valuemax={100}
        aria-valuenow={Math.round(p)} aria-valuetext={`${Math.round(100 - p)}% with Hanzo MCP`} aria-orientation="horizontal" onKeyDown={onKey}>
        <span aria-hidden="true">‹</span><span aria-hidden="true">›</span>
      </button>
      <span className="mcp-cmp-cur" ref={cur} aria-hidden="true" />
      <span className="mcp-cmp-trail" aria-hidden="true">{Array.from({ length: N }, (_, i) => <i key={i} ref={(d) => { dots.current[i] = d; }} />)}</span>
    </div>
  );
}
