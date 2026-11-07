'use client';
/* FamDrawer (Families A kit): "see the spec". One idea per screen, and the detail lives in a sheet you open: it slides
   in from the right on desktop and rises from the bottom on phones. Its contents are always in the HTML (closed, it is
   hidden and inert), so nothing is lost and search engines still read it.
   How to use it:
   - <FamDrawer label="See the full method" title="What is measured">{blocks}</FamDrawer>;
   - label: the button's words; title: the sheet's heading; children: the detail, as Hanzo wrote it;
   - Escape, the scrim and the close button shut it, and focus returns to the button. */
import { useEffect, useId, useRef, useState } from 'react';

export default function FamDrawer({ label, title, children, className = '' }) {
  const [open, setOpen] = useState(false);
  const btn = useRef(null);
  const close = useRef(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    html.classList.add('x-lock');
    window.__lenis && window.__lenis.stop();
    const t = setTimeout(() => close.current && close.current.focus({ preventScroll: true }), 60);
    const key = (e) => { if (e.key === 'Escape') setOpen(false); };
    addEventListener('keydown', key);
    return () => {
      clearTimeout(t);
      removeEventListener('keydown', key);
      html.classList.remove('x-lock');
      window.__lenis && window.__lenis.start();
      btn.current && btn.current.focus({ preventScroll: true });
    };
  }, [open]);
  return (
    <>
      <button ref={btn} type="button" className={'v2f-spec-btn ' + className} aria-haspopup="dialog" aria-expanded={open} aria-controls={id} onClick={() => setOpen(true)}>
        <i aria-hidden="true">+</i>{label}
      </button>
      <div id={id} className="v2f-sheet" data-open={open ? '' : undefined} inert={!open} data-swipe-own>
        <button type="button" className="v2f-sheet-scrim" tabIndex={-1} aria-hidden="true" onClick={() => setOpen(false)} />
        <div className="v2f-sheet-p" role="dialog" aria-modal="true" aria-label={title || label}>
          <header className="v2f-sheet-h">
            <h2>{title || label}</h2>
            <button ref={close} type="button" className="v2f-sheet-x" aria-label="Close" onClick={() => setOpen(false)}>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </header>
          <div className="v2f-sheet-b" data-lenis-prevent>{children}</div>
        </div>
      </div>
    </>
  );
}
