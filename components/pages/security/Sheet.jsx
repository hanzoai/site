'use client';
/* Sheet (page-local to /security): the kit's DetailSheet as the native <dialog> its shared CSS expects.
   The shared components/v2/DetailSheet.jsx was reverted to a positioned <div> by merge d490cc53 while
   DetailSheet.css kept the dialog rules, so the closed panel drew over the page; see docs/requests/security.md.
   showModal() traps focus, Esc and the scrim close with the slide, focus returns to the button. The words stay in the
   server HTML, and read inline with JavaScript off. Same props as DetailSheet: label, kicker, title, children, wide. */
import { useEffect, useId, useRef, useState } from 'react';
import NoJs from '../../NoJs';
import '../../v2/ProofScale.css';
import '../../v2/DetailSheet.css';

export default function Sheet({ label, kicker, title, children, className = '', wide = false }) {
  const [open, setOpen] = useState(false);
  const dlg = useRef(null);
  const btn = useRef(null);
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
  };
  const shut = () => {
    setOpen(false);
    const d = dlg.current;
    setTimeout(() => { if (d?.open) d.close(); btn.current?.focus({ preventScroll: true }); }, 420);
  };

  return (
    <>
      <NoJs css={'dialog.pf-sheet{display:block!important;position:static!important;width:auto!important;height:auto!important;margin:24px 0!important;background:none!important}.pf-sheet-x,.pf-plus[aria-haspopup]{display:none!important}.pf-sheet-panel{position:static!important;transform:none!important;width:auto!important;box-shadow:none!important;border:1px solid rgba(0,0,0,.08)}'} />
      <button ref={btn} type="button" className={'pf-plus' + (className ? ' ' + className : '')} aria-haspopup="dialog" aria-expanded={open} onClick={show}>
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
