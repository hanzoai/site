'use client';
/* Realtime's living graph (the page's signature, docs/MOTION-MAP.md `graph`). The parts of one deployment as a graph
   that settles like a physics graph when it comes into view: the one store, the API that reads it, the access rule,
   one broker per org, the open stream (GET /v1/realtime), the grant that opens it, the deployment's limit, the
   subscriptions, and three clients. Records travel it by themselves (create a, update b, delete b): each change leaves
   the store, passes its org's broker and the stream, and lands on the clients; the delete of b stops at org b's broker,
   because client 3's rule cannot read b. Pointing at a node (or tapping it, or focusing it) lights its paths and names
   them, and the panel beside the graph reads out the part of "What the stream gives you" that node is. A mouse can pull
   a node; the graph settles back. One rAF loop, only while seen and unpaused; reduced motion shows it settled and still.
   Record letters and org names are drawn; every label is Hanzo's own word on this page. */
import { useEffect, useRef, useState } from 'react';
import { useFrame } from '../Frame';

/* nodes: id, label, the fact it opens (index into GIVES), shape, and where it rests (wide 760×480, tall 360×620).
   Rests are spaced so no lit link name ever crosses a node's name; on phones the stream's seven link names are left
   unsaid (its panel says them), since seven names round one hub cannot fit 360 units without touching. */
export const NODES = [
  ['del', 'delete · b', 3, 'ev', [64, 58], [52, 40]],
  ['store', 'one store', 4, 'sq', [150, 190], [180, 72]],
  ['api', 'API', 4, 'dot', [80, 400], [308, 128]],
  ['rule', 'access rule', 5, 'dia', [228, 318], [200, 176]],
  ['ba', 'org a · broker', 2, 'dot', [330, 104], [60, 262]],
  ['bb', 'org b · broker', 2, 'dot', [340, 404], [300, 262]],
  ['stream', 'GET /v1/realtime', 0, 'ring', [500, 254], [180, 420]],
  ['grant', 'grant', 6, 'dot', [508, 58], [300, 356]],
  ['dep', 'deployment', 7, 'dot', [500, 442], [304, 470]],
  ['subs', 'subscriptions', 1, 'dot', [320, 250], [72, 372]],
  ['c1', 'Client 1', 0, 'cl', [688, 120], [60, 560]],
  ['c2', 'Client 2', 0, 'cl', [700, 256], [180, 568]],
  ['c3', 'Client 3', 5, 'cl', [688, 392], [300, 560]],
];
const IDX = Object.fromEntries(NODES.map((n, i) => [n[0], i]));
/* links, each with the name it shows when lit */
export const LINKS = [
  ['store', 'api', 'reads'],
  ['store', 'ba', 'messages'],
  ['store', 'bb', 'messages'],
  ['del', 'store', 'delete'],
  ['rule', 'api', 'guards the API'],
  ['rule', 'ba', 'filters the stream'],
  ['rule', 'bb', 'filters the stream'],
  ['ba', 'stream', 'org a'],
  ['bb', 'stream', 'org b'],
  ['grant', 'stream', '?token=grant'],
  ['dep', 'stream', 'limit 2'],
  ['subs', 'stream', 'orders/ord_42'],
  ['stream', 'c1', 'text/event-stream'],
  ['stream', 'c2', 'text/event-stream'],
  ['stream', 'c3', 'text/event-stream'],
];
// a record's change, and the way it travels to each client (client 3 sits on org b's broker)
export const EVENTS = [['create', 'a'], ['update', 'b'], ['delete', 'b']];
const ROUTES = [['c1', ['store', 'ba', 'stream', 'c1']], ['c2', ['store', 'ba', 'stream', 'c2']], ['c3', ['store', 'bb', 'stream', 'c3']]];
const SIZE = { wide: [760, 480], tall: [360, 620] };
// client 3's rule cannot read record b: nothing about b reaches it, its delete included
const blocked = (ev, c) => ev[1] === 'b' && c === 'c3';

export default function RtGraph({ sel, onPick, onPeek, run, calm, ev, evAt }) {
  const svg = useRef(null);
  const [mode, setMode] = useState('wide');
  const [hov, setHov] = useState(null);
  const pos = useRef(NODES.map((n) => ({ x: n[4][0], y: n[4][1], vx: 0, vy: 0 })));
  const sim = useRef({ hot: 0, drag: -1, armed: false });
  const els = useRef({ n: [], l: [], t: [], p: [] });
  const [w, h] = SIZE[mode];
  const k = mode === 'wide' ? 4 : 5;

  // phones get the tall layout (chosen after hydration; the box's height is fixed in CSS, so nothing moves around it)
  useEffect(() => {
    const m = matchMedia('(max-width: 699px)');
    const f = () => setMode(m.matches ? 'tall' : 'wide');
    f(); m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  // the settle: while the graph is still below the fold it gathers at the middle, then flies out and settles when seen
  const gather = () => pos.current.forEach((p, i) => { p.x = w / 2 + Math.cos(i * 2.4) * 18; p.y = h / 2 + Math.sin(i * 2.4) * 18; p.vx = 0; p.vy = 0; });
  useEffect(() => {
    const el = svg.current; if (!el || calm) return;
    if (el.getBoundingClientRect().top < innerHeight * 0.85) return;
    sim.current.armed = true;
  }, [calm]);
  // a layout (re)chosen: gather if the settle is still to come, else rest in place
  useEffect(() => {
    if (sim.current.armed && !calm) gather();
    else pos.current.forEach((p, i) => { p.x = NODES[i][k][0]; p.y = NODES[i][k][1]; p.vx = 0; p.vy = 0; });
    write(performance.now());
  }, [mode, calm]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (run && sim.current.armed) { sim.current.armed = false; sim.current.hot = 1; } }, [run]);

  // one step of the physics: a pull to each node's rest, links that keep their length, nodes that push apart
  function step(dt) {
    const P = pos.current, S = sim.current;
    const n = P.length;
    const fx = new Array(n).fill(0), fy = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      const [rx, ry] = NODES[i][k];
      fx[i] += (rx - P[i].x) * 24; fy[i] += (ry - P[i].y) * 24;
      for (let j = i + 1; j < n; j++) {
        const dx = P[j].x - P[i].x, dy = P[j].y - P[i].y, d2 = Math.max(80, dx * dx + dy * dy);
        if (d2 > 160 * 160) continue;
        const f = 9000 / d2, d = Math.sqrt(d2);
        fx[i] -= (dx / d) * f; fy[i] -= (dy / d) * f; fx[j] += (dx / d) * f; fy[j] += (dy / d) * f;
      }
    }
    for (const [a, b] of LINKS) {
      const i = IDX[a], j = IDX[b];
      const L = Math.hypot(NODES[j][k][0] - NODES[i][k][0], NODES[j][k][1] - NODES[i][k][1]);
      const dx = P[j].x - P[i].x, dy = P[j].y - P[i].y, d = Math.max(1, Math.hypot(dx, dy));
      const f = (d - L) * 6;
      fx[i] += (dx / d) * f; fy[i] += (dy / d) * f; fx[j] -= (dx / d) * f; fy[j] -= (dy / d) * f;
    }
    let e = 0;
    // heavy damping: the graph eases into place with no bounce past it
    const damp = Math.pow(0.00001, dt);
    for (let i = 0; i < n; i++) {
      if (i === S.drag) continue;
      P[i].vx = (P[i].vx + fx[i] * dt) * damp; P[i].vy = (P[i].vy + fy[i] * dt) * damp;
      P[i].x += P[i].vx * dt; P[i].y += P[i].vy * dt;
      P[i].x = Math.max(16, Math.min(w - 16, P[i].x)); P[i].y = Math.max(16, Math.min(h - 24, P[i].y));
      e += Math.abs(P[i].vx) + Math.abs(P[i].vy);
    }
    if (e < 0.6 && S.drag < 0) S.hot = 0;
  }

  // write positions and the travelling records straight to the SVG (no React render per frame)
  function write(now) {
    const P = pos.current, E = els.current;
    NODES.forEach((_, i) => E.n[i]?.setAttribute('transform', `translate(${P[i].x.toFixed(1)} ${P[i].y.toFixed(1)})`));
    LINKS.forEach(([a, b], i) => {
      const A = P[IDX[a]], B = P[IDX[b]], l = E.l[i], t = E.t[i];
      if (l) { l.setAttribute('x1', A.x.toFixed(1)); l.setAttribute('y1', A.y.toFixed(1)); l.setAttribute('x2', B.x.toFixed(1)); l.setAttribute('y2', B.y.toFixed(1)); }
      if (t) { t.setAttribute('x', ((A.x + B.x) / 2).toFixed(1)); t.setAttribute('y', ((A.y + B.y) / 2 - 6).toFixed(1)); }
    });
    // each record rides its route: 1.6 s from the store to the client (stopping at the broker when its rule says no)
    ROUTES.forEach(([c, route], r) => {
      const dot = E.p[r]; if (!dot) return;
      const T = calm || !evAt ? -1 : (now - evAt) / 1600 - r * 0.06;
      if (T < 0 || T > 1.25) { dot.setAttribute('opacity', '0'); return; }
      const stop = blocked(ev, c) ? 1 / 3 : 1;
      const u = Math.min(T, stop) * 3, seg = Math.min(2, Math.floor(u)), f = u - seg;
      const A = P[IDX[route[seg]]], B = P[IDX[route[Math.min(3, seg + 1)]]];
      const e = f < 0 ? 0 : 1 - Math.pow(1 - Math.min(1, f), 3);
      dot.setAttribute('cx', (A.x + (B.x - A.x) * e).toFixed(1));
      dot.setAttribute('cy', (A.y + (B.y - A.y) * e).toFixed(1));
      dot.setAttribute('opacity', T > 1 ? String(Math.max(0, 1 - (T - 1) * 4)) : '1');
      dot.setAttribute('class', 'rg-rec' + (stop < 1 && T >= stop ? ' stop' : ''));
    });
  }

  useFrame(run, (t, dt) => { if (sim.current.hot) step(dt); write(t * 1000); });
  useEffect(() => { if (!run) write(performance.now()); }); // a still frame whenever the loop is not running

  // the hand: point (lights paths), tap or Enter (also opens the node's words), and a mouse can pull a node
  const at = (e) => {
    const r = svg.current.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * w, ((e.clientY - r.top) / r.height) * h];
  };
  const down = (i) => (e) => {
    onPick(i);
    if (e.pointerType !== 'mouse' || calm) return;
    sim.current.drag = i; sim.current.hot = 1;
    svg.current.setPointerCapture?.(e.pointerId);
  };
  const move = (e) => {
    const S = sim.current; if (S.drag < 0) return;
    const [x, y] = at(e); const p = pos.current[S.drag];
    p.x = Math.max(16, Math.min(w - 16, x)); p.y = Math.max(16, Math.min(h - 24, y)); p.vx = 0; p.vy = 0;
    if (!run) { step(1 / 60); write(performance.now()); }
  };
  const up = () => { sim.current.drag = -1; };

  const lit = hov ?? sel;
  const id = lit != null ? NODES[lit][0] : null;
  const on = (l) => id && (l[0] === id || l[1] === id);
  const near = new Set(id ? LINKS.filter(on).flatMap((l) => [l[0], l[1]]) : []);
  const told = (c) => (blocked(ev, c) ? 'not told' : 'told');

  return (
    <svg ref={svg} className="rg" viewBox={`0 0 ${w} ${h}`} data-mode={mode} data-lit={id || undefined}
      onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={() => { up(); setHov(null); onPeek?.(null); }}
      role="group" aria-label="The parts of one deployment, as a graph">
      <g aria-hidden="true">
        {LINKS.map((l, i) => <line key={i} ref={(el) => (els.current.l[i] = el)} className={'rg-l' + (on(l) ? ' on' : '') + (ev[0] === 'delete' && l[1] === 'store' && l[0] === 'del' ? ' ev' : '')} />)}
        {ROUTES.map((_, r) => <circle key={r} ref={(el) => (els.current.p[r] = el)} r="5" className="rg-rec" opacity="0" />)}
        {/* a name shared by several lit links (text/event-stream to each client) is said once */}
        {LINKS.map((l, i) => <text key={i} ref={(el) => (els.current.t[i] = el)} className={'rg-ln' + (on(l) && !(mode === 'tall' && id === 'stream') && LINKS.findIndex((m) => on(m) && m[2] === l[2]) === i ? ' on' : '')} textAnchor="middle">{l[2]}</text>)}
      </g>
      {NODES.map(([nid, label, fact, shape], i) => {
        const p = NODES[i][k];
        const anchor = p[0] < 80 ? 'start' : p[0] > w - 80 ? 'end' : 'middle';
        const tx = anchor === 'start' ? -12 : anchor === 'end' ? 12 : 0;
        const isC = shape === 'cl';
        return (
          <g key={nid} ref={(el) => (els.current.n[i] = el)} transform={`translate(${p[0]} ${p[1]})`}
            className={'rg-n ' + shape + (lit === i ? ' sel' : '') + (id && !near.has(nid) && lit !== i ? ' dim' : '') + (isC && blocked(ev, nid) ? ' no' : '')}
            tabIndex={0} role="button" aria-pressed={sel === i} aria-label={label}
            onPointerEnter={(e) => { if (e.pointerType === 'mouse') { setHov(i); onPeek?.(i); } }} onPointerLeave={() => { setHov(null); onPeek?.(null); }}
            onPointerDown={down(i)} onFocus={() => onPick(i)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onPick(i))}>
            <circle className="rg-hit" r="24" />
            {shape === 'sq' && <rect className="rg-s" x="-9" y="-9" width="18" height="18" rx="3" />}
            {shape === 'dia' && <rect className="rg-s" x="-8" y="-8" width="16" height="16" rx="2" transform="rotate(45)" />}
            {shape === 'ring' && <><circle className="rg-s ring" r="11" /><circle className="rg-s" r="5" /></>}
            {shape === 'ev' && <circle className="rg-s ev" r="7" />}
            {shape === 'dot' && <circle className="rg-s" r="7" />}
            {isC && <rect className="rg-s" x="-12" y="-9" width="24" height="18" rx="4" />}
            <text className="rg-t" x={tx} y={isC || shape === 'ring' ? 30 : 26} textAnchor={anchor}>{label}</text>
            {isC && <text className="rg-st" x={tx} y={46} textAnchor={anchor}>{told(nid)}</text>}
          </g>
        );
      })}
    </svg>
  );
}
