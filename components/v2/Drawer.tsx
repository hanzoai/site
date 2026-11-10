'use client';
/* Drawer — "see the spec": detail lives in a sheet you open (Cloud 4 chat; VISION.md "one idea per screen").
   Usage: <Drawer label="See the console" title="Example console">…detail…</Drawer>
   A button opens a sheet from the right (from the bottom on phones). Escape, the scrim and × close it; focus moves into
   the sheet, Tab stays inside it, and focus returns to the button. The sheet's content is always in the HTML (inert while closed), so nothing is lost. */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './x-hamilton/Launch.css';

export default function Drawer({ label, title, children, className = '' }) {
  const [open, setOpen] = useState(false);
  const [host, setHost] = useState(null);
  const btn = useRef(null);
  const sheet = useRef(null);
  useEffect(() => setHost(document.body), []);
  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    const t = setTimeout(() => sheet.current?.querySelector('.l2-sheet-x')?.focus(), 60);
    const key = (e) => {
      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key !== 'Tab' || !sheet.current) return; // keep focus inside the sheet while it is open
      const f = [...sheet.current.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')];
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && (document.activeElement === f[f.length - 1] || !sheet.current.contains(document.activeElement))) { e.preventDefault(); f[0].focus(); }
    };
    addEventListener('keydown', key);
    return () => { clearTimeout(t); removeEventListener('keydown', key); window.__lenis?.start(); btn.current?.focus({ preventScroll: true }); };
  }, [open]);
  const panel = (
    <>
      <div className={'l2-scrim' + (open ? ' on' : '')} onClick={() => setOpen(false)} aria-hidden="true" />
      <div ref={sheet} className={'l2-sheet' + (open ? ' on' : '')} role="dialog" aria-modal={open ? 'true' : undefined} aria-label={title || label} aria-hidden={!open} inert={!open} data-lenis-prevent>
        <div className="l2-sheet-bar"><p>{title || label}</p><button type="button" className="l2-sheet-x" onClick={() => setOpen(false)} aria-label="Close">×</button></div>
        <div className="l2-sheet-body">{children}</div>
      </div>
    </>
  );
  return (
    <>
      <button ref={btn} type="button" className={'l2-drawer-btn ' + className} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
        {label}
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {host ? createPortal(panel, host) : <div hidden>{children}</div>}
    </>
  );
}
