'use client';
/* BizSheet: detail lives in something you open, not on the scroll (VISION: "see the spec" drawers).
   Owned by the Business 1 chat.
   Usage: <BizSheet label="See the request" kick="Numscript" title="One transaction, however many parties">…</BizSheet>
   A pill button opens a sheet: from the right on desktop, rising from the bottom on phones. Esc, the backdrop or Close
   shut it; focus moves in and comes back; the page behind stops scrolling. The content is always in the HTML (inert
   while shut), so nothing is lost. Put it outside any transformed or faded parent (position: fixed needs that).
   aria-modal is set only while it is open, so the site's ask bar (components/Ask.jsx) is not hidden by a shut sheet. */
import { useEffect, useId, useRef, useState } from 'react';
import './Biz.css';

const Plus = () => <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
export const Close = () => <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;

export default function BizSheet({ label, title, kick, children, className = '', btnClass = '' }) {
  const [open, setOpen] = useState(false);
  const btn = useRef(null);
  const panel = useRef(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    document.documentElement.classList.add('x-lock');
    const t = setTimeout(() => panel.current?.focus({ preventScroll: true }), 80);
    const key = (e) => { if (e.key === 'Escape') setOpen(false); };
    addEventListener('keydown', key);
    return () => {
      clearTimeout(t);
      removeEventListener('keydown', key);
      window.__lenis?.start();
      document.documentElement.classList.remove('x-lock');
      btn.current?.focus({ preventScroll: true });
    };
  }, [open]);
  return (
    <div className={'bz-sheet-wrap ' + className} data-open={open}>
      <button ref={btn} type="button" className={'bz-sheet-btn ' + btnClass} aria-expanded={open} aria-controls={id} onClick={() => setOpen(true)}>
        <Plus />{label}
      </button>
      <div className="bz-sheet-back" onClick={() => setOpen(false)} aria-hidden="true" />
      <div ref={panel} id={id} className="bz-sheet" role="dialog" aria-modal={open ? 'true' : undefined} aria-label={title} tabIndex={-1} inert={!open} data-lenis-prevent="">
        <div className="bz-sheet-top">
          <div>
            {kick && <p className="bz-kick">{kick}</p>}
            <h2>{title}</h2>
          </div>
          <button type="button" className="bz-sheet-x" aria-label="Close" onClick={() => setOpen(false)}><Close /></button>
        </div>
        <div className="bz-sheet-body">{children}</div>
      </div>
    </div>
  );
}
