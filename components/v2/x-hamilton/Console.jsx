'use client';
/* Console (Cloud 4 chat): Hanzo's example console as the live pages print it (the product's sidebar, four example
   projects, "Every request enters here, so the limiter does too.", api.hanzo.ai/<api>, "Open in the console"), drawn in
   ink and greys with no native title= tooltips (labels are visible on hover/focus instead). Used inside a Drawer on
   /search and /billing. Usage: <Console name="Search" api="/v1/search" side={[[label, href], …]} /> */
import { useState } from 'react';
import { motion } from 'motion/react';
import { A } from '../../kit';

const ROWS = [
  ['gateway', 'Ready', 'Every request enters here, so the limiter does too.'],
  ['payments-api', 'Ready'],
  ['checkout-web', 'Building', 'A build is running from the last commit on main.'],
  ['docs-site', 'Ready'],
];
const ICONS = ['M8 2v4M8 6 4 10M8 6l4 4M4 10v4M12 10v4', 'M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM1.5 8h13M8 1.5c2 2 2 11 0 13M8 1.5c-2 2-2 11 0 13', 'M3 3h3v3H3zM10 10h3v3h-3zM6 4.5h3.5v5.5', 'M2.5 3h11v4h-11zM2.5 9h11v4h-11z', 'M8 2 2.5 5v6L8 14l5.5-3V5zM2.5 5 8 8l5.5-3M8 8v6', 'M2 12l4-4 3 3 5-6', 'M5 2.5h6M3.5 6h9M2 9.5h12v4H2z', 'M8 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM2.5 14c.8-2.6 3-4 5.5-4s4.7 1.4 5.5 4'];

export default function Console({ name, side, api }) {
  const [at, setAt] = useState(0);
  return (
    <div className="l2-con">
      <div className="l2-con-bar"><i /><i /><i /><A to="/home" className="l2-con-title">{name} — Hanzo</A></div>
      <div className="l2-con-body">
        <nav className="l2-con-side" aria-label="Products">
          {side.map(([t, to], i) => (
            <A key={t} to={to} className={'l2-con-ico' + (i === 0 ? ' on' : '')} aria-label={t}>
              <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d={ICONS[i % ICONS.length]} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
              <span className="l2-con-tip">{t}</span>
            </A>
          ))}
        </nav>
        <div className="l2-con-main">
          <ul role="listbox" aria-label="Projects">
            {ROWS.map(([n, st], i) => (
              <li key={n} role="option" aria-selected={at === i} tabIndex={0} onClick={() => setAt(i)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setAt(i))}>
                {at === i && <motion.span layoutId="l2-con-row" className="l2-con-row" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />}
                <i className={'l2-con-dot ' + (st === 'Building' ? 'b' : 'r')} aria-hidden="true" />
                <span className="l2-con-name">{n}</span>
                <span className="l2-con-st">{st}</span>
              </li>
            ))}
          </ul>
          <div className="l2-con-cap" aria-live="polite">
            {ROWS.filter((p) => p[2]).map(([n, , c]) => <p key={n} hidden={ROWS[at][0] !== n}>{c}</p>)}
            {!ROWS[at][2] && <p>{ROWS[at][0]} · {ROWS[at][1]}</p>}
          </div>
        </div>
      </div>
      <div className="l2-con-foot">
        <span>api.hanzo.ai<b>{api}</b></span>
        <A to="https://hanzo.team/" className="l2-con-open">Open in the console ↗</A>
      </div>
    </div>
  );
}
