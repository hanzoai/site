'use client';
/* A2Sheet — "see the spec": detail that lives in something you open (Apps 2 chat; styles in A2.css).
   Usage: <A2Sheet label="See every capability" title="Capabilities">…anything…</A2Sheet>
   A button opens a panel from the right (a sheet rising from the bottom on phones) over a soft scrim. The contents are
   always in the HTML (closed = hidden and inert), so nothing is lost. Escape, the scrim and the close button shut it,
   focus moves in on open and back to the button on close, and the smooth scroller pauses while it is open. */
import { useEffect, useId, useRef, useState } from 'react';

export default function A2Sheet({ label, title, children, className = '', btnClass = '' }) {
  const [open, setOpen] = useState(false);
  const btn = useRef(null);
  const x = useRef(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const l = window.__lenis;
    l?.stop?.();
    const t = setTimeout(() => x.current?.focus(), 60);
    const key = (e) => { if (e.key === 'Escape') setOpen(false); };
    addEventListener('keydown', key);
    return () => { clearTimeout(t); removeEventListener('keydown', key); l?.start?.(); btn.current?.focus({ preventScroll: true }); };
  }, [open]);
  return (
    <>
      <button ref={btn} type="button" className={'a2-sheet-btn ' + btnClass} aria-haspopup="dialog" aria-expanded={open} aria-controls={id} onClick={() => setOpen(true)}>
        {label}<i aria-hidden="true">+</i>
      </button>
      <div className={'a2-sheet ' + className} data-open={open} id={id}>
        <button type="button" className="a2-sheet-scrim" tabIndex={-1} aria-hidden="true" onClick={() => setOpen(false)} />
        <div className="a2-sheet-panel" role="dialog" aria-modal="true" aria-label={title} inert={!open} data-lenis-prevent="">
          <div className="a2-sheet-top">
            <h3 className="a2-title">{title}</h3>
            <button ref={x} type="button" className="a2-sheet-x" aria-label="Close" onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="a2-sheet-body">{children}</div>
        </div>
      </div>
    </>
  );
}
