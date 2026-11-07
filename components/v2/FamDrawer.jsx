'use client';
/* FamDrawer (Families A kit): "see the spec". One idea per screen, and the detail lives in a sheet you open: it slides
   in from the right on desktop and rises from the bottom on phones. Its contents are always in the HTML (closed, it is
   hidden and inert), so nothing is lost and search engines still read it.
   Copy is frozen (PLAN-COMPONENTS 0.6): the trigger is a "+" with its accessible name from the UI register, followed
   by a preview of the detail in Hanzo's own words (the first line of what the sheet holds), so no new label is needed.
   How to use it:
   - <FamDrawer preview="The right-hand column is not a competitor's measurement…" title={sectionTitle}>{blocks}</FamDrawer>;
   - title: the sheet's heading (Hanzo's section title); children: the detail, as Hanzo wrote it;
   - Escape, the scrim and the close button shut it, and focus returns to the trigger. */
import { useEffect, useId, useRef, useState } from 'react';
import { ui } from './famUi';

/* with scripts off the detail simply shows in place (PLAN-COMPONENTS 2.3: JS off is legible) */
const NOJS = '.v2f-sheet{position:static!important;visibility:visible!important;pointer-events:auto!important}.v2f-sheet-scrim,.v2f-sheet-x,.v2f-spec-btn{display:none!important}.v2f-sheet-p{position:static!important;transform:none!important;width:auto!important;max-height:none!important;box-shadow:none!important;border:1px solid rgba(0,0,0,.08)}';

export default function FamDrawer({ preview, title, children, className = '', label }) {
  const [open, setOpen] = useState(false);
  const [live, setLive] = useState(false); // inert only once scripts run, so a no-JS reader can still use the links
  useEffect(() => setLive(true), []);
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
      <noscript><style>{NOJS}</style></noscript>
      <button ref={btn} type="button" className={'v2f-spec-btn ' + className} aria-haspopup="dialog" aria-expanded={open} aria-controls={id} aria-label={(label || ui('more')) + (title ? ': ' + title : '')} onClick={() => setOpen(true)}>
        <i aria-hidden="true">+</i>{preview && <span aria-hidden="true">{preview}</span>}
      </button>
      <div id={id} className="v2f-sheet" data-open={open ? '' : undefined} inert={live && !open} data-swipe-own>
        <button type="button" className="v2f-sheet-scrim" tabIndex={-1} aria-hidden="true" onClick={() => setOpen(false)} />
        <div className="v2f-sheet-p" role="dialog" aria-modal="true" aria-label={title || ui('more')}>
          <header className="v2f-sheet-h">
            {title ? <h2>{title}</h2> : <span />}
            <button ref={close} type="button" className="v2f-sheet-x" aria-label={ui('close')} onClick={() => setOpen(false)}>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </header>
          <div className="v2f-sheet-b" data-lenis-prevent>{children}</div>
        </div>
      </div>
    </>
  );
}
