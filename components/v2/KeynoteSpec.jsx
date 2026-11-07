'use client';
/* KeynoteSpec: the apple.com "Tech Specs" sheet. Hairline rows: a mono label on the left three columns, the facts on
   the right, figures huge and tabular. Optional "See the full spec" opens a sheet that rises from the bottom.
   Owned by the Cloud 1 chat.
   Usage:
     <KeynoteSpec title="Tech specs" rows={[['Licence', <p>Apache-2.0</p>], ['Runs on', <Fig n="3" u="backends" />]]}
                  more={{ label: 'See the full spec', title: 'Everything it does', body: <…/> }} />
   - rows: [label, node]. Use <Fig n u /> for a hero figure (only Hanzo's own numbers).
   - more: optional; its body is always in the HTML (inert until opened). Esc, the backdrop and Close shut it.
   - kick: a small label set under the headline (never above it). */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { EASE } from '../ui';
import KeynoteLines from './KeynoteLines';
import './Keynote.css';
import './KeynoteSpec.css';

export function Fig({ n, u, note }) {
  return (
    <p className="kfs-fig">
      <b className="kn-fig">{n}</b>{u && <span>{u}</span>}
      {note && <em>{note}</em>}
    </p>
  );
}

export function KeynoteSheet({ label, title, children, className = '' }) {
  const [open, setOpen] = useState(false);
  const close = useRef(null);
  const btn = useRef(null);
  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', k);
    window.__lenis?.stop();
    close.current?.focus({ preventScroll: true });
    return () => { window.removeEventListener('keydown', k); window.__lenis?.start(); };
  }, [open]);
  const shut = () => { setOpen(false); btn.current?.focus({ preventScroll: true }); };
  return (
    <>
      <button ref={btn} type="button" className="kn-btn kfs-open" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
        {label}
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
      </button>
      <div className={'kfs-sheet-root ' + className} data-open={open ? '' : undefined}>
        <div className="kfs-back" onClick={shut} aria-hidden="true" />
        <div className="kfs-sheet" role="dialog" aria-modal={open ? 'true' : undefined} aria-hidden={open ? undefined : 'true'} aria-label={title} inert={!open} data-lenis-prevent="">
          <div className="kfs-grip" aria-hidden="true" />
          <div className="kfs-sheet-h">
            <p className="kn-title">{title}</p>
            <button ref={close} type="button" className="kfs-x" onClick={shut} aria-label="Close">
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </div>
          <div className="kfs-sheet-b">{children}</div>
        </div>
      </div>
    </>
  );
}

export default function KeynoteSpec({ kick, title = 'Tech specs', rows, more, aside, className = '' }) {
  return (
    <section className={'kn-sec kfs ' + className}>
      <div className="kn-wrap">
        <div className="kfs-h">
          <KeynoteLines className="kn-headline" lines={title} />
          {kick && <p className="kn-kick">{kick}</p>}
          {aside}
        </div>
        <dl className="kfs-rows">
          {rows.map(([k, v], i) => (
            <motion.div key={k} className="kfs-row kn-grid" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7, ease: EASE, delay: Math.min(i, 4) * 0.04 }}>
              <dt className="kn-kick">{k}</dt>
              <dd>{v}</dd>
            </motion.div>
          ))}
        </dl>
        {more && <div className="kfs-more"><KeynoteSheet label={more.label} title={more.title}>{more.body}</KeynoteSheet></div>}
      </div>
    </section>
  );
}
