'use client';
/* ExampleConsole: the live cloud pages' "Example project" console, page-local for /authz and /base (Cloud 1, brief 2).
   It replaces Frame's Console (a fork with title= tooltips, a spring and a setInterval) with the same words and links:
   "<name> — Hanzo" (to /home), this product's sidebar links, the four example projects and their state, the api line
   and "Open in the console ↗". Every sidebar label is visible text (no tooltip floats over anything); deck greys only;
   14px floor; 44px targets; status is a shape (filled ink = Ready, a hollow ring = Building), never a colour.
   The building project finishes its build once while it is seen, then rests (reduced motion: built from the start).
   Usage: <ExampleConsole name="Authz" api="/v1/authz" side={[['Authz', '/authz'], ['IAM', '/iam'], …]} /> */
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { A } from '../../kit';
import './ExampleConsole.css';

const ROWS = (cap: string) => [['gateway', 'Ready', cap], ['payments-api', 'Ready'], ['checkout-web', 'Building', 'A build is running from the last commit on main.'], ['docs-site', 'Ready', 'Static, published by the same pipeline as the rest.']];
const ICONS = ['M8 2v4M8 6 4 10M8 6l4 4M4 10v4M12 10v4', 'M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM1.5 8h13M8 1.5c2 2 2 11 0 13M8 1.5c-2 2-2 11 0 13', 'M3 3h3v3H3zM10 10h3v3h-3zM6 4.5h3.5v5.5', 'M2.5 3h11v4h-11zM2.5 9h11v4h-11z', 'M8 2 2.5 5v6L8 14l5.5-3V5zM2.5 5 8 8l5.5-3M8 8v6', 'M2 12l4-4 3 3 5-6', 'M5 2.5h6M3.5 6h9M2 9.5h12v4H2z', 'M8 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM2.5 14c.8-2.6 3-4 5.5-4s4.7 1.4 5.5 4'];

interface ExampleConsoleProps {
  name: string;
  side: string[][];
  api: string;
  cap?: string | React.JSX.Element;
  className?: string;
}
export default function ExampleConsole({ name, side, api, cap = 'Every request enters here, so the limiter does too.', className = '' }: ExampleConsoleProps) {
  const rows = ROWS(cap);
  const [at, setAt] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const seen = useInView(ref, { amount: 0.4 });
  const calm = useReducedMotion();
  const [built, setBuilt] = useState(false);
  useEffect(() => {
    if (calm) { setBuilt(true); return; }
    if (!seen || built) return;
    const t = setTimeout(() => setBuilt(true), 4200);
    return () => clearTimeout(t);
  }, [seen, built, calm]);
  const move = (i: number) => {
    const n = (i + rows.length) % rows.length;
    setAt(n);
    list.current?.children[n]?.focus();
  };
  const key = (e: React.KeyboardEvent<HTMLLIElement>, i: number) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(i + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(i - 1); }
    else if (e.key === 'Home') { e.preventDefault(); move(0); }
    else if (e.key === 'End') { e.preventDefault(); move(rows.length - 1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setAt(i); }
  };
  return (
    <div className={'exc ' + className} ref={ref}>
      <div className="exc-bar"><i /><i /><i /><A to="/home" className="exc-title">{name} — Hanzo</A></div>
      <div className="exc-body">
        <nav className="exc-side" aria-label="Products">
          {side.map(([t, to], i) => (
            <A key={t} to={to} className="exc-nav" aria-current={i === 0 ? 'page' : undefined}>
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d={ICONS[i % ICONS.length]} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
              <span>{t}</span>
            </A>
          ))}
        </nav>
        <div className="exc-main">
          <ul ref={list} role="listbox" aria-label="Projects" className="exc-rows">
            {rows.map(([n, st], i) => {
              const s = n === 'checkout-web' && built ? 'Ready' : st;
              return (
                <li key={n} role="option" aria-selected={at === i} tabIndex={at === i ? 0 : -1} onClick={() => setAt(i)} onKeyDown={(e) => key(e, i)}>
                  <i className={'exc-dot' + (s === 'Building' ? ' b' : '')} aria-hidden="true" />
                  <span className="exc-name">{n}</span>
                  <span className="exc-st">{s}</span>
                </li>
              );
            })}
          </ul>
          <div className="exc-cap" aria-live="polite">
            {rows.filter((p) => p[2]).map(([n, , c]) => <p key={n} hidden={rows[at][0] !== n}>{c}</p>)}
            {!rows[at][2] && <p className="exc-none">{rows[at][0]} · {rows[at][1]}</p>}
          </div>
        </div>
      </div>
      <div className="exc-foot">
        <span>api.hanzo.ai<b>{api}</b></span>
        <A to="https://hanzo.team/" className="exc-open">Open in the console ↗</A>
      </div>
    </div>
  );
}
