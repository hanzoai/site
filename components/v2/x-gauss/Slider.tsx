'use client';
/* Slider: a drawn range control (never the browser's own). A hairline track, an ink fill, a 20px thumb that grows on
   hover and presses to .98; drag anywhere on the track, or use arrows, Page Up/Down, Home and End.
   Usage: <Slider label="--radius" min={0} max={24} step={1} value={r} onChange={setR} />
   Styles live in Rhythm.css (.gx-slide). Owned by the Business 2 chat. */
import { useRef, type CSSProperties, type KeyboardEvent } from 'react';

interface SliderProps {
  label: string;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  className?: string;
}

export default function Slider({ label, min = 0, max = 100, step = 1, value, onChange, className = '' }: SliderProps) {
  const tr = useRef<HTMLDivElement>(null);
  const fix = (v: number) => { const n = Math.round((v - min) / step) * step + min; return Math.max(min, Math.min(max, +n.toFixed(4))); };
  const at = (x: number) => { const r = tr.current?.getBoundingClientRect(); if (!r) return value; return fix(min + ((x - r.left) / r.width) * (max - min)); };
  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step, PageUp: step * 5, PageDown: -step * 5 };
    const d = moves[e.key];
    if (d) { e.preventDefault(); onChange(fix(value + d)); } else if (e.key === 'Home') { e.preventDefault(); onChange(min); } else if (e.key === 'End') { e.preventDefault(); onChange(max); }
  };
  return (
    <div ref={tr} className={'gx-slide ' + className} role="slider" tabIndex={0} aria-label={label} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value}
      onPointerDown={(e) => { tr.current?.setPointerCapture(e.pointerId); onChange(at(e.clientX)); }} onPointerMove={(e) => { if (e.buttons) onChange(at(e.clientX)); }} onKeyDown={key}
      style={{ '--v': (value - min) / (max - min) } as CSSProperties}>
      <i className="gx-slide-t"><em /></i><b className="gx-slide-k" />
    </div>
  );
}
