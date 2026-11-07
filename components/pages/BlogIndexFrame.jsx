/* The cover plate's first frame, drawn on the server: the same contour field the living Sigil canvas draws at t = 0
   (lib/sigil.mjs), as one static SVG, so the plate is never an empty black box before scripts run. BlogIndex removes it
   once the canvas has drawn (the canvas's own effect runs first). With JS off it simply stays. */
import { sigilParams, field, levels, contour } from '../../lib/sigil.mjs';

const W = 480, H = 344;

export default function BlogIndexFrame({ seed, className = '' }) {
  const P = sigilParams(seed, []);
  const cols = Math.ceil(W / P.cell) + 1, rows = Math.ceil(H / P.cell) + 1;
  const v = new Float32Array(cols * rows);
  field(P, v, cols, rows, P.cell, W, H, 0, { x: 0.5, y: 0.5, s: 0 });
  const lv = levels(P, v);
  const r = (n) => Math.round(n * 10) / 10;
  return (
    <svg className={className} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      {lv.map((l, k) => {
        let d = '';
        contour({ moveTo: (x, y) => { d += `M${r(x)} ${r(y)}`; }, lineTo: (x, y) => { d += `L${r(x)} ${r(y)}`; } }, v, cols, rows, P.cell, l);
        const focus = k === P.focus;
        return <path key={k} d={d} fill="none" stroke="currentColor" strokeWidth={focus ? 1.4 : 1} strokeOpacity={focus ? 0.9 : 0.16 + (k / lv.length) * 0.22} vectorEffect="non-scaling-stroke" />;
      })}
    </svg>
  );
}
