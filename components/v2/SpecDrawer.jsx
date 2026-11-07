'use client';
/* SpecDrawer: the spec sheet and its "see the spec" sheet (VISION: detail lives in things you open). A calm row of
   huge tabular figures; one button raises a sheet from the bottom with the long detail (code, full lists). The sheet's
   content is always in the HTML (inert while closed), so nothing is lost. Esc, the backdrop or Close shut it, focus
   returns to the button, and the page behind holds still while it is open.
   Usage:
     <SpecDrawer rows={[{ v: '4222', l: 'Client port' }, { v: 'Replay', l: 'From any point' }]}
                 open="See the code" sheetTitle="events.go">{<Code … />}</SpecDrawer>
   rows: Hanzo's own figures and words only. Without children there is no button. Owned by Cloud 3. */
import { useEffect, useId, useRef, useState } from 'react';
import './LaunchType.css';
import './SpecDrawer.css';

export function Sheet({ open, onClose, title, children, id }) {
  const close = useRef(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    const html = document.documentElement;
    html.classList.add('x-lock');
    window.__lenis?.stop();
    close.current?.focus({ preventScroll: true });
    const key = (e) => e.key === 'Escape' && onClose();
    addEventListener('keydown', key);
    return () => { removeEventListener('keydown', key); html.classList.remove('x-lock'); window.__lenis?.start(); prev?.focus?.({ preventScroll: true }); };
  }, [open, onClose]);
  return (
    <div className="lx-sheet" data-open={open ? '' : undefined} id={id}>
      <button type="button" className="lx-sheet-scrim" tabIndex={-1} aria-hidden="true" onClick={onClose} />
      <div className="lx-sheet-panel" role="dialog" aria-modal="true" aria-label={title} inert={!open} data-lenis-prevent>
        <div className="lx-sheet-bar">
          <p className="lx-kick">{title}</p>
          <button ref={close} type="button" className="lx-sheet-x" onClick={onClose}>Close</button>
        </div>
        <div className="lx-sheet-body">{children}</div>
      </div>
    </div>
  );
}

export default function SpecDrawer({ rows, open: openLabel = 'See the spec', sheetTitle, children, className = '', note }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className={'lx-spec ' + className}>
      <dl className="lx-spec-rows" style={{ '--cols': Math.min(rows.length, 4) }}>
        {rows.map((r, i) => (
          <div key={i} className="lx-spec-row">
            <dt className="lx-spec-l">{r.l}</dt>
            <dd className="lx-spec-v lx-num">{r.v}</dd>
          </div>
        ))}
      </dl>
      {(children || note) && (
        <div className="lx-spec-foot">
          {note && <p className="lx-body">{note}</p>}
          {children && <button type="button" className="lx-ghost lx-spec-open" aria-haspopup="dialog" aria-controls={id} aria-expanded={open} onClick={() => setOpen(true)}>{openLabel}<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></button>}
        </div>
      )}
      {children && <Sheet id={id} open={open} onClose={() => setOpen(false)} title={sheetTitle || openLabel}>{children}</Sheet>}
    </div>
  );
}
