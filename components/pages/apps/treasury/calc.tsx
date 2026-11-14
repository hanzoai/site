'use client';
/* Treasury's signature, the live calculator (MOTION-MAP `calculator`). One split, set by the visitor: the amount
   @users:001 sends (USD/2, default 10,000), the share to @merchants:042 (90%) and to @fees:processing (5%); the remaining
   goes to @platform:revenue, as Numscript works it out. Every figure on the page reads this one split, so the hero's
   streams, the postings, the balances, the wallet and the close all re-plan at once and always balance.
   Sliders are page-drawn (no browser control): pointer, touch (horizontal drag; vertical still scrolls) and keyboard
   (arrows, Page Up/Down, Home/End), role="slider" with value text. The labels are Hanzo's own account names. */
import type React from 'react';
import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useRef, useState } from 'react';

export const fmt = (v: number) => v.toLocaleString('en-US');
export const DEF = { a: 10000, p0: 90, p1: 5 };
const Ctx = createContext(null);

export function split({ a, p0, p1 }) {
  const m = Math.round((a * p0) / 100);
  const f = Math.round((a * p1) / 100);
  return [m, f, a - m - f]; // remaining: whatever is left, so the three always meet the amount
}

interface CalcProviderProps {
  children: ReactNode;
}
export function CalcProvider({ children }: CalcProviderProps) {
  const [s, setS] = useState(DEF);
  const v = useMemo(() => {
    const parts = split(s);
    return { ...s, parts, set: (k, x) => setS((o) => {
      const n = { ...o, [k]: x };
      if (n.p0 + n.p1 > 100) { if (k === 'p0') n.p1 = 100 - n.p0; else n.p0 = 100 - n.p1; }
      return n;
    }) };
  }, [s]);
  return <Ctx.Provider value={v}>{children}</Ctx.Provider>;
}
export const useCalc = () => useContext(Ctx) || { ...DEF, parts: split(DEF), set: () => {} };

function Slider({ label, value, min, max, step, onChange, show, big }) {
  const tr = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const f = (value - min) / (max - min);
  const at = (x: number) => {
    const r = tr.current!.getBoundingClientRect();
    const k = Math.min(1, Math.max(0, (x - r.left) / r.width));
    onChange(Math.round((min + k * (max - min)) / step) * step);
  };
  const key = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    const d = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step, PageUp: step * 10, PageDown: -step * 10 }[e.key];
    if (d !== undefined) { e.preventDefault(); onChange(Math.min(max, Math.max(min, value + d))); }
    else if (e.key === 'Home') { e.preventDefault(); onChange(min); }
    else if (e.key === 'End') { e.preventDefault(); onChange(max); }
  };
  return (
    <div className={'tc-sl' + (big ? ' big' : '')}>
      <div className="tc-sl-h"><span className="x-mono">{label}</span><b className="x-mono">{show(value)}</b></div>
      <div className="tc-tr" ref={tr}
        onPointerDown={(e) => { drag.current = true; e.currentTarget.setPointerCapture(e.pointerId); at(e.clientX); }}
        onPointerMove={(e) => drag.current && at(e.clientX)}
        onPointerUp={() => { drag.current = false; }} onPointerCancel={() => { drag.current = false; }}>
        <i className="tc-fill" style={{ transform: `scaleX(${f})` }} />
        <span role="slider" tabIndex={0} className="tc-th" style={{ left: f * 100 + '%' }} aria-label={label}
          aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} aria-valuetext={show(value)} onKeyDown={key} />
      </div>
    </div>
  );
}

const ACC = ['@merchants:042', '@fees:processing', '@platform:revenue'];

/* The calculator panel: three sliders on the left, the transaction they write on the right. */
export function Calculator({ Postings }) {
  const c = useCalc();
  const [m, f, r] = c.parts;
  return (
    <div className="tc">
      <div className="tc-in">
        <p className="tc-code x-mono" aria-live="polite">send [USD/2 {c.a}] (</p>
        <Slider big label="source = @users:001" value={c.a} min={1000} max={100000} step={500} onChange={(x) => c.set('a', x)} show={fmt} />
        <Slider label={ACC[0]} value={c.p0} min={0} max={100} step={1} onChange={(x) => c.set('p0', x)} show={(x: string) => x + '%'} />
        <Slider label={ACC[1]} value={c.p1} min={0} max={100} step={1} onChange={(x) => c.set('p1', x)} show={(x: string) => x + '%'} />
        <div className="tc-rem"><span className="x-mono">remaining to {ACC[2]}</span><b className="x-mono">{fmt(r)}</b></div>
        <div className="tc-bar" aria-hidden="true">
          {[m, f, r].map((v, i) => <i key={i} style={{ flexGrow: Math.max(v, 0.0001) }} />)}
        </div>
      </div>
      <div className="tc-out"><Postings on /></div>
    </div>
  );
}
