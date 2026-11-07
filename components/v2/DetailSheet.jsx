'use client';
/* DetailSheet (components/v2, owned by the Wave 2 "Proof" chat). "Detail lives in things you open" (VISION.md): a
   (+) button that opens a sheet — from the right on desktop, from the bottom on phones — holding the detail a screen
   should not carry (a full table, the method, every row). The sheet's content is in the server HTML (parity), hidden
   and inert while closed. Esc, the scrim or the close button shut it; focus goes in and comes back.
   Usage:
     <DetailSheet label="See every suite" kicker="Kai vs Jev" title="All eleven suites">
       <table>…</table>
     </DetailSheet>
   Props: label (the button text), kicker, title, ghost (light button), className (on the button), wide (a wider
   sheet for tables), children (the sheet body), onOpen().
   Once mounted the sheet lives in a portal on <body>, so style its contents with their own classes, not ones nested
   under the page's section class. */
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './ProofScale.css';
import './DetailSheet.css';
import NoJs from '../NoJs';

export default function DetailSheet({ label, kicker, title, children, ghost = false, className = '', wide = false, onOpen }) {
  const [open, setOpen] = useState(false);
  const [host, setHost] = useState(null);
  const btn = useRef(null);
  const close = useRef(null);
  const id = useId();

  useEffect(() => setHost(document.body), []);
  useEffect(() => {
    if (!open) return;
    const l = window.__lenis;
    l?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const t = setTimeout(() => close.current?.focus(), 60);
    const key = (e) => { if (e.key === 'Escape') setOpen(false); };
    addEventListener('keydown', key);
    return () => { clearTimeout(t); removeEventListener('keydown', key); l?.start(); document.documentElement.style.overflow = prev; };
  }, [open]);

  const shut = () => { setOpen(false); setTimeout(() => btn.current?.focus(), 30); };

  const sheet = (
    <div className={'pf-sheet' + (wide ? ' wide' : '')} data-open={open} aria-hidden={!open}>
      <div className="pf-sheet-scrim" onClick={shut} />
      <div className="pf-sheet-panel" role="dialog" aria-modal="true" aria-labelledby={id} inert={!open} data-lenis-prevent>
        <div className="pf-sheet-top">
          <div>
            <h2 className="pf-title" id={id}>{title}</h2>
            {kicker && <p className="pf-kick pf-sheet-cap">{kicker}</p>}
          </div>
          <button ref={close} type="button" className="pf-sheet-x" onClick={shut} aria-label="Close">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="pf-sheet-body">{children}</div>
      </div>
    </div>
  );

  return (
    <>
      {/* JS off: no sheet to open, so the detail reads inline where the button would be */}
      <NoJs css={'<style>.pf-sheet{position:static!important;visibility:visible!important;pointer-events:auto!important;margin:24px 0}.pf-sheet-scrim,.pf-sheet-x,.pf-plus[aria-haspopup]{display:none!important}.pf-sheet-panel{position:static!important;transform:none!important;width:auto!important;box-shadow:none!important;border:1px solid rgba(0,0,0,.08)}</style>'} />
      <button ref={btn} type="button" className={'pf-plus' + (ghost ? ' ghost' : '') + (className ? ' ' + className : '')} aria-haspopup="dialog" aria-expanded={open} onClick={() => { setOpen(true); onOpen?.(); }}>
        <i aria-hidden="true">
          <svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </i>
        <span>{label}</span>
      </button>
      {host ? createPortal(sheet, host) : sheet}
    </>
  );
}
