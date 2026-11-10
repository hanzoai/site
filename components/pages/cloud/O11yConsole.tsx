'use client';
/* /o11y's example console: a page-local copy of components/v2/LaunchConsole.jsx (same markup, classes and CSS) with
   one change: all four projects carry the line hanzo.ai's console gives them (payments-api and docs-site included),
   every line kept in the DOM and only the chosen one shown. Requested for the shared one in docs/build-notes/requests/o11y.md. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { A } from '../../kit';
import './Frame.css';
import '../../v2/LaunchType.css';
import '../../v2/LaunchConsole.css';

// every project carries its own line, as hanzo.ai's console does
const ROWS = (cap) => [
  ['gateway', 'Ready', cap],
  ['payments-api', 'Ready', 'The service the session above is changing.'],
  ['checkout-web', 'Building', 'A build is running from the last commit on main.'],
  ['docs-site', 'Ready', 'Static, published by the same pipeline as the rest.'],
];
const ICONS = ['M8 2v4M8 6 4 10M8 6l4 4M4 10v4M12 10v4', 'M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM1.5 8h13M8 1.5c2 2 2 11 0 13M8 1.5c-2 2-2 11 0 13', 'M3 3h3v3H3zM10 10h3v3h-3zM6 4.5h3.5v5.5', 'M2.5 3h11v4h-11zM2.5 9h11v4h-11z', 'M8 2 2.5 5v6L8 14l5.5-3V5zM2.5 5 8 8l5.5-3M8 8v6', 'M2 12l4-4 3 3 5-6', 'M5 2.5h6M3.5 6h9M2 9.5h12v4H2z', 'M8 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM2.5 14c.8-2.6 3-4 5.5-4s4.7 1.4 5.5 4'];

export default function O11yConsole({ name, side, api, cap = 'Every request enters here, so the limiter does too.', light, className = '' }) {
  const rows = ROWS(cap);
  const [at, setAt] = useState(0);
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.4 });
  const calm = useReducedMotion();
  const [built, setBuilt] = useState(false);
  useEffect(() => {
    if (calm) { setBuilt(true); return; }
    if (!seen) return;
    const t = setTimeout(() => setBuilt((b) => !b), 4200);
    return () => clearTimeout(t);
  }, [seen, built, calm]);
  return (
    <div className={'cf-con lx-con' + (light ? ' light' : '') + ' ' + className} ref={ref}>
      <div className="cf-con-bar"><i /><i /><i /><A to="/home" className="cf-con-title">{name} — Hanzo</A></div>
      <div className="cf-con-body">
        <nav className="cf-con-side" aria-label="Products">
          {side.map(([t, to], i) => (
            <A key={t} to={to} className={'cf-con-ico' + (i === 0 ? ' on' : '')} aria-label={t}>
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d={ICONS[i % ICONS.length]} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
              <span className="cf-tip">{t}</span>
            </A>
          ))}
        </nav>
        <div className="cf-con-main">
          <ul role="listbox" aria-label="Projects">
            {rows.map(([n, st], i) => {
              const s = n === 'checkout-web' && built ? 'Ready' : st;
              return (
                <li key={n} role="option" aria-selected={at === i} tabIndex={0} onClick={() => setAt(i)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setAt(i))} onMouseEnter={() => setAt(i)}>
                  {at === i && <motion.span layoutId={'lx-con-' + name} className="cf-row-bg" transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} />}
                  <i className={'cf-dot ' + (s === 'Building' ? 'b' : 'r')} />
                  <span className="cf-name">{n}</span>
                  <span className="cf-st">{s === 'Building' ? <><b className="lx-con-spin" aria-hidden="true" />{s}</> : s}</span>
                </li>
              );
            })}
          </ul>
          <div className="cf-cap" aria-live="polite">
            {rows.map(([n, , c]) => <p key={n} hidden={rows[at][0] !== n}>{c}</p>)}
          </div>
        </div>
      </div>
      <div className="cf-con-foot">
        <span>api.hanzo.ai<b>{api}</b></span>
        <A to="https://hanzo.team/" className="cf-con-open">Open in the console ↗</A>
      </div>
    </div>
  );
}
