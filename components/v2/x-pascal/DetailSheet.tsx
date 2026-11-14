'use client';
/* DetailSheet (components/v2, owned by the Wave 2 "Proof" chat). "Detail lives in things you open" (VISION.md): a
   (+) button that opens a sheet — from the right on desktop, from the bottom on phones — holding the detail a screen
   should not carry (a full table, the method, every row). The sheet's content is in the server HTML (parity), hidden
   while closed. Esc, a click outside the panel or the close button shut it; focus goes in and comes back.
   Usage:
     <DetailSheet label="See every suite" kicker="Kai vs Jev" title="All eleven suites">
       <table>…</table>
     </DetailSheet>
   Props: label (the button text), kicker, title, ghost (light button), className (on the button), wide (a wider
   sheet for tables), children (the sheet body), onOpen().
   It is a native <dialog> opened with showModal() (MASTER part 8): the browser traps focus and puts it in the top
   layer above everything; Esc and a click outside the panel close it with the slide out, and focus returns to the
   button. Closed, the dialog is not rendered but its words stay in the server HTML (parity); with JS off they read
   inline where the button would be. */
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import '../ProofScale.css';
import './DetailSheet.css';

interface DetailSheetProps {
  label: ReactNode;
  kicker?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  ghost?: boolean;
  className?: string;
  wide?: boolean;
  onOpen?: () => void;
}

export default function DetailSheet({ label, kicker, title, children, ghost = false, className = '', wide = false, onOpen }: DetailSheetProps) {
  const [open, setOpen] = useState(false); // drives the slide (data-open); the dialog itself opens a frame earlier
  const dlg = useRef<HTMLDialogElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const l = window.__lenis;
    l?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { l?.start(); document.documentElement.style.overflow = prev; };
  }, [open]);

  const show = () => {
    const d = dlg.current;
    if (!d) return;
    if (!d.open) d.showModal();
    requestAnimationFrame(() => setOpen(true));
    onOpen?.();
  };
  const shut = () => {
    setOpen(false);
    const d = dlg.current;
    setTimeout(() => { if (d?.open) d.close(); btn.current?.focus(); }, 420);
  };

  return (
    <>
      {/* JS off: no sheet to open, so the detail reads inline where the button would be */}
      <noscript dangerouslySetInnerHTML={{ __html: '<style>dialog.pf-sheet{display:block!important;position:static!important;width:auto!important;height:auto!important;margin:24px 0!important;background:none!important}.pf-sheet-x,.pf-plus[aria-haspopup]{display:none!important}.pf-sheet-panel{position:static!important;transform:none!important;width:auto!important;box-shadow:none!important;border:1px solid rgba(0,0,0,.08)}</style>' }} />
      <button ref={btn} type="button" className={'pf-plus' + (ghost ? ' ghost' : '') + (className ? ' ' + className : '')} aria-haspopup="dialog" aria-expanded={open} onClick={show}>
        <i aria-hidden="true">
          <svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </i>
        <span>{label}</span>
      </button>
      <dialog
        ref={dlg}
        className={'pf-sheet' + (wide ? ' wide' : '')}
        data-open={open}
        aria-labelledby={id}
        onCancel={(e) => { e.preventDefault(); shut(); }}
        onClick={(e) => { if (e.target === dlg.current) shut(); }}
      >
        <div className="pf-sheet-panel" data-lenis-prevent>
          <div className="pf-sheet-top">
            <div>
              <h2 className="pf-title" id={id}>{title}</h2>
              {kicker && <p className="pf-kick pf-sheet-cap">{kicker}</p>}
            </div>
            <button type="button" className="pf-sheet-x" onClick={shut} aria-label="Close" autoFocus>
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </div>
          <div className="pf-sheet-body">{children}</div>
        </div>
      </dialog>
    </>
  );
}
