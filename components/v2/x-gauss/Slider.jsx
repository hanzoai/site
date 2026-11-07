'use client';
/* Slider: a drawn range control (never the browser's own). A hairline track, an ink fill, a 20px thumb that grows on
   hover and presses to .98; drag anywhere on the track, or use arrows, Page Up/Down, Home and End.
   Usage: <Slider label="--radius" min={0} max={24} step={1} value={r} onChange={setR} />
   Styles live in Rhythm.css (.gx-slide). Owned by the Business 2 chat. */
import { useRef } from 'react';

export default function Slider({ label, min = 0, max = 100, step = 1, value, onChange, className = '' }) {
  const tr = useRef(null);
  const fix = (v) => { const n = Math.round((v - min) / step) * step + min; return Math.max(min, Math.min(max, +n.toFixed(4))); };
  const at = (x) => { const r = tr.current.getBoundingClientRect(); return fix(min + ((x - r.left) / r.width) * (max - min)); };
  const key = (e) => {
    const d = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step, PageUp: step * 5, PageDown: -step * 5 }[e.key];
    if (d) { e.preventDefault(); onChange(fix(value + d)); } else if (e.key === 'Home') { e.preventDefault(); onChange(min); } else if (e.key === 'End') { e.preventDefault(); onChange(max); }
  };
  return (
    <div ref={tr} className={'gx-slide ' + className} role="slider" tabIndex={0} aria-label={label} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value}
      onPointerDown={(e) => { tr.current.setPointerCapture(e.pointerId); onChange(at(e.clientX)); }} onPointerMove={(e) => { if (e.buttons) onChange(at(e.clientX)); }} onKeyDown={key}
      style={{ '--v': (value - min) / (max - min) }}>
      <i className="gx-slide-t"><em /></i><b className="gx-slide-k" />
    </div>
  );
}
