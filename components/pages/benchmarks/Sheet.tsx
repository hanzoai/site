'use client';
/* The benchmarks page's own (+) sheet: the same button and sheet as v2/DetailSheet, fixed to the viewport.
   Closed, the sheet is visibility:hidden and inert (after its slide-out), so nothing in it can take focus or be
   scrolled to, and its shadow never shows; open, it sits position:fixed over the page. Esc, the scrim and the close
   button shut it, Tab stays inside, and focus goes back to its (+) without scrolling. The page never moves: the
   scroll is held with overflow on <html>, and every focus call uses preventScroll.
   The sheet's contents stay in the server HTML (parity). Once mounted it lives in a portal on <body>. */
import type { ReactNode } from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import NoJs from '../../NoJs';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
const NOJS = '.xbm-sh{position:static!important;visibility:visible!important;pointer-events:auto!important;margin:24px 0}.xbm-sh-scrim,.xbm-sh-x,.xbm-plus{display:none!important}.xbm-sh-panel{position:static!important;transform:none!important;width:auto!important;max-height:none!important;box-shadow:none!important;border:1px solid rgba(0,0,0,.08)}';

interface SheetProps {
  label: string;
  kicker?: string;
  title: string;
  children: ReactNode;
  ghost?: boolean;
  wide?: boolean;
  id?: string;
}
export default function Sheet({ label, kicker, title, children, ghost = false, wide = false, id: bid }: SheetProps) {
  const [open, setOpen] = useState(false);
  const [host, setHost] = useState<Element | null>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const x = useRef<HTMLButtonElement>(null);
  const id = useId();

  // the sheet lives inside <main> (fixed to the viewport all the same), so its words stay part of the page; on the
  // benchmarks page it goes in main's one sheet tray (display: contents), so the overlays never read as sections
  useEffect(() => setHost(document.querySelector('main .xbm-sheets') || document.querySelector('main') || document.body), []);
  useEffect(() => {
    if (!open) return;
    const sx = scrollX, sy = scrollY;
    const l = window.__lenis;
    l?.stop();
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    const t = setTimeout(() => x.current?.focus({ preventScroll: true }), 40);
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); setOpen(false); return; }
      if (e.key !== 'Tab' || !panel.current) return;
      const f = [...panel.current.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
      if (!f.length) return;
      const a = document.activeElement;
      if (e.shiftKey && (a === f[0] || !panel.current.contains(a))) { e.preventDefault(); f[f.length - 1].focus({ preventScroll: true }); }
      else if (!e.shiftKey && (a === f[f.length - 1] || !panel.current.contains(a))) { e.preventDefault(); f[0].focus({ preventScroll: true }); }
    };
    addEventListener('keydown', key, true);
    return () => {
      clearTimeout(t);
      removeEventListener('keydown', key, true);
      html.style.overflow = prev;
      l?.start();
      if (btn.current?.isConnected) {
        if (scrollX !== sx || scrollY !== sy) scrollTo(sx, sy);
        btn.current.focus({ preventScroll: true });
      }
    };
  }, [open]);

  const shut = () => setOpen(false);

  const sheet = (
    <div className={'xbm-sh' + (wide ? ' wide' : '')} data-open={open} aria-hidden={!open} inert={!open}>
      <div className="xbm-sh-scrim" onClick={shut} />
      <div ref={panel} className="xbm-sh-panel" role="dialog" aria-modal="true" aria-labelledby={id} data-lenis-prevent>
        <div className="xbm-sh-top">
          <div>
            <h2 className="pf-title" id={id}>{title}</h2>
            {kicker && <p className="pf-kick xbm-sh-cap">{kicker}</p>}
          </div>
          <button ref={x} type="button" className="xbm-sh-x" onClick={shut} aria-label="Close">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="xbm-sh-body">{children}</div>
      </div>
    </div>
  );

  return (
    <>
      <NoJs css={NOJS} />
      <button ref={btn} id={bid} type="button" className={'pf-plus xbm-plus' + (ghost ? ' ghost' : '')} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
        <i aria-hidden="true">
          <svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </i>
        <span>{label}</span>
      </button>
      {host ? createPortal(sheet, host) : sheet}
    </>
  );
}
