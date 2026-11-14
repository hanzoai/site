'use client';
/* Auto: the drag-canvas signature (page-local). One large plane holds Auto's parts as they relate: the published flow
   (trigger → GitHub → Postgres → Slack → done), the two ways in (POST trigger, /v1/runs), the two runs (record vs
   goroutine) and the reschedule between them, the catalog (GET /v1/pieces), draft vs published, the connection with Hanzo
   KMS and Hanzo IAM, the four figures and the container they live in. Every word is already on the page.
   Pan: drag with a mouse or a finger (Motion drag with momentum, clamped to the plane), arrow keys on the focused canvas
   (Shift for longer steps), Home or the reset button to come back, or tap the minimap to jump. Once in view it nudges
   itself sideways once so people see it moves; a token runs along the flow's wires (CSS). Reduced motion: no nudge, no
   running token, no momentum; dragging, keys and reset still work. */
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { motion, animate, useMotionValue, useTransform, useInView } from 'motion/react';
import { useCalm } from '../../../ui';
import type { Bezier } from '../../../../lib/motion';

const W = 2200;
const H = 1240;
const HOME = { x: 1010, y: 560 }; // plane point centred on arrival and on reset
const HOME_PHONE = { x: 760, y: 600 }; // phones: the GitHub node with the two runs under it
const NODES = ['trigger', 'GitHub', 'Postgres', 'Slack', 'done'];
const NX = (i: number) => 560 + i * 206; // node left
const NY = 420; // node top (56 tall)
const PIECES = ['Slack', 'GitHub', 'Notion', 'Gmail', 'Stripe', 'HubSpot', 'Jira', 'Linear', 'Discord', 'Airtable', 'Google Sheets', 'Postgres'];
const FIGS = [['Go', 'One process'], ['SQLite', 'Per replica'], ['/v1', 'Flows and runs'], ['Apache', 'Self-hosted']];
/* the blocks, for the minimap: [left, top, width, height] */
const BLOCKS = [[180, 110, 420, 150], [200, 320, 160, 200], [560, 360, 974, 116], [300, 590, 640, 340], [1640, 120, 470, 330], [1640, 600, 460, 150], [1100, 880, 520, 250], [1700, 860, 330, 230]];

interface Box {
  w: number;
  h: number;
  s: number;
}

const Tick = () => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 8.4 6.6 11.4 12.5 5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;

interface RunProps {
  k: string;
  at: number;
  left: number;
}
function Run({ k, at, left }: RunProps) {
  return (
    <div className={'au2-cv-run ' + k} style={{ left, top: 590 }}>
      <p className="l2-mono">{k}</p>
      <ol>
        {NODES.map((n, i) => <li key={n} className={i < at ? 'ok' : i === at ? 'now' : ''}><span className="au2-cv-st">{i < at && <Tick />}</span>{n}</li>)}
      </ol>
    </div>
  );
}

export default function Canvas() {
  const vp = useRef<HTMLDivElement>(null);
  const seen = useInView(vp, { amount: 0.4, once: true });
  const calm = useCalm();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [box, setBox] = useState<Box>({ w: 0, h: 0, s: 1 });
  const [moved, setMoved] = useState(false);

  const lim = (b: Box) => ({ left: Math.min(0, b.w - W * b.s), right: 0, top: Math.min(0, b.h - H * b.s), bottom: 0 });
  const clamp = (v: number, lo: number) => Math.min(0, Math.max(lo, v));
  const home = (b: Box) => {
    const h = b.w < 700 ? HOME_PHONE : HOME;
    return { x: clamp(b.w / 2 - h.x * b.s, lim(b).left), y: clamp(b.h / 2 - h.y * b.s, lim(b).top) };
  };
  const go = (tx: number, ty: number, b: Box = box) => {
    const c = lim(b);
    const opt: { duration: number; ease?: Bezier } = calm ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] };
    animate(x, clamp(tx, c.left), opt);
    animate(y, clamp(ty, c.top), opt);
  };

  useEffect(() => {
    const el = vp.current;
    if (!el) return;
    let first = true;
    const measure = () => {
      const b = { w: el.clientWidth, h: el.clientHeight, s: 1 }; // full size on phones too: text stays readable, you pan further
      setBox(b);
      if (first) { const p = home(b); x.set(p.x); y.set(p.y); first = false; }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* one sideways nudge on first arrival, so the plane reads as movable */
  useEffect(() => {
    if (!seen || calm || moved || !box.w) return;
    const x0 = x.get();
    const c = animate(x, [x0, x0 - 70 * box.s, x0], { duration: 1.6, ease: 'easeInOut', delay: 0.3 });
    return () => c.stop();
  }, [seen]); // eslint-disable-line react-hooks/exhaustive-deps

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = (e.shiftKey ? 320 : 120) * box.s;
    const k = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] }[e.key];
    if (k) { e.preventDefault(); setMoved(true); go(x.get() + k[0], y.get() + k[1]); }
    if (e.key === 'Home' || e.key === '0') { e.preventDefault(); const p = home(box); go(p.x, p.y); }
  };
  const reset = () => { const p = home(box); go(p.x, p.y); };

  /* minimap: the plane at 1/12, the viewport as a moving frame; tap to jump there */
  const M = box.w && box.w < 700 ? 1 / 20 : 1 / 12;
  const fx = useTransform(x, (v: number) => (-v / box.s) * M);
  const fy = useTransform(y, (v: number) => (-v / box.s) * M);
  const jump = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / M;
    const py = (e.clientY - r.top) / M;
    setMoved(true);
    go(box.w / 2 - px * box.s, box.h / 2 - py * box.s);
  };

  return (
    <div className="au2-cv">
      <div ref={vp} className="au2-cv-vp" tabIndex={0} role="region" aria-label="Auto canvas" onKeyDown={onKey}>
        <motion.div
          className="au2-cv-plane"
          style={{ x, y, width: W * box.s || W, height: H * box.s || H }}
          drag
          dragConstraints={lim(box)}
          dragElastic={0.08}
          dragMomentum={!calm}
          dragTransition={{ power: 0.25, timeConstant: 220 }}
          onDragStart={() => setMoved(true)}
        >
          <div className="au2-cv-in" style={{ width: W, height: H, transform: box.s !== 1 ? `scale(${box.s})` : undefined }}>
            <svg className="au2-cv-wires" viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden="true">
              <path d={`M360 352 C460 352 470 448 ${NX(0)} 448`} />
              <path d={`M360 492 C460 492 470 448 ${NX(0)} 448`} />
              <path d={`M${NX(2) + 75} 476 C${NX(2) + 75} 640 1500 680 1640 675`} />
              <path d={`M1360 880 C1360 700 ${NX(3) + 75} 620 ${NX(3) + 75} 476`} />
              <path d={`M390 260 C390 330 420 330 420 590`} className="soft" />
              <path d={`M1700 960 C1560 960 1560 760 1660 750`} className="soft" />
              {NODES.slice(0, -1).map((n, i) => <path key={n} className="flow" d={`M${NX(i) + 150} 448 H${NX(i + 1)}`} />)}
            </svg>
            <i className="au2-cv-token" aria-hidden="true" />

            <div className="au2-cv-pub" style={{ left: 180, top: 110 }}>
              <div><p className="l2-mono">draft</p><span>trigger</span><span>GitHub</span><span>Postgres</span><span className="new">Slack</span></div>
              <svg viewBox="0 0 24 12" width="24" height="12" aria-hidden="true"><path d="M1 6h20M16 1.5 21 6l-5 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <div><p className="l2-mono">published</p><span>trigger</span><span>GitHub</span><span>Postgres</span></div>
            </div>

            <span className="au2-cv-chip l2-mono" style={{ left: 200, top: 330 }}>POST trigger</span>
            <span className="au2-cv-chip l2-mono" style={{ left: 200, top: 470 }}>/v1/runs</span>

            <p className="au2-cv-cap l2-mono" style={{ left: NX(0), top: 372 }}>React Flow · SSE<span className="au2-pub"><i />published</span></p>
            {NODES.map((n, i) => (
              <div key={n} className={'au2-cv-node' + (i === 2 ? ' now' : i < 2 ? ' ok' : '')} style={{ left: NX(i), top: NY }}>
                <span className="au2-h l" /><span className="au2-h r" />{n}
              </div>
            ))}

            <Run k="record" at={3} left={300} />
            <Run k="goroutine" at={0} left={640} />
            <p className="au2-cv-cut l2-mono" style={{ left: 300, top: 900 }}><i /><b>pod rescheduled</b><i /></p>

            <ul className="au2-cv-figs" style={{ left: 1640, top: 120 }}>
              {FIGS.map(([k, d]) => <li key={k}><b>{k}</b><span className="l2-mono">{d}</span></li>)}
            </ul>

            <div className="au2-cv-ctr" style={{ left: 1640, top: 610 }}>
              <span className="l2-mono">container</span><b>auto</b><i className="l2-mono">:port</i><em className="l2-mono">state.sqlite</em>
            </div>

            <div className="au2-cv-cat" style={{ left: 1100, top: 880 }}>
              <p className="l2-mono">GET /v1/pieces</p>
              <ul>{PIECES.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>

            <div className="au2-cv-key" style={{ left: 1700, top: 860 }}>
              <p className="l2-mono">connection</p>
              <span><Tick />Hanzo IAM</span>
              <span><Tick />Hanzo KMS</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="au2-cv-ui">
        <div className="au2-cv-map" onClick={jump} aria-hidden="true" style={{ width: W * M, height: H * M }}>
          {BLOCKS.map(([l, t, w, h], i) => <i key={i} style={{ left: l * M, top: t * M, width: w * M, height: h * M }} />)}
          <motion.b style={{ x: fx, y: fy, width: (box.w / box.s) * M || 0, height: (box.h / box.s) * M || 0 }} />
        </div>
        <button type="button" className="au2-cv-reset" onClick={reset} aria-label="Reset view">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="8" cy="8" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
        </button>
      </div>
    </div>
  );
}
