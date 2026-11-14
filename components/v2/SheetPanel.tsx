'use client';
/* SheetPanel (v2; owned by the Platform + Cloud chat). A detail sheet that opens over the page: from the right on
   desktop, from the bottom on phones. It lets a page keep one idea per screen and still hold every detail.
   The scrim, Esc and the close button shut it; focus moves in and goes back to whatever opened it; the page behind
   stops scrolling. Closed, it is inert and off screen but still in the HTML, so nothing is lost.

   Usage:
     <SheetPanel open={open} onClose={() => setOpen(false)} label="Layer inspector" head={<b>03 / 11</b>} tone="light">
       {content}
     </SheetPanel>
   - head: what sits in the bar beside the close button; tone: 'light' (white sheet) or 'dark'. Styles: SheetPanel.css. */
import { useEffect, useRef, type ReactNode } from 'react';
import './SheetPanel.css';

interface SheetPanelProps {
  open: boolean;
  onClose: () => void;
  label: string;
  head?: ReactNode;
  children?: ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
}

export default function SheetPanel({ open, onClose, label, head, children, tone = 'light', className = '' }: SheetPanelProps) {
  const box = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const back = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;
    back.current = document.activeElement as HTMLElement | null;
    window.__lenis?.stop();
    document.documentElement.classList.add('x-lock');
    const t = setTimeout(() => close.current?.focus({ preventScroll: true }), 60);
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      if (e.key === 'Tab' && box.current) { // keep focus inside the sheet
        const f = [...box.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,[tabindex]:not([tabindex="-1"])')].filter((el) => !el.closest('[hidden],[inert]'));
        if (!f.length) return;
        const [a, z] = [f[0], f[f.length - 1]];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    };
    addEventListener('keydown', key);
    return () => {
      clearTimeout(t);
      removeEventListener('keydown', key);
      window.__lenis?.start();
      document.documentElement.classList.remove('x-lock');
      back.current?.focus?.({ preventScroll: true });
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={'v2s ' + tone + ' ' + className} data-open={open} inert={!open} aria-hidden={!open}>
      <div className="v2s-scrim" onClick={onClose} aria-hidden="true" />
      <div ref={box} className="v2s-panel" role="dialog" aria-modal="true" aria-label={label} data-lenis-prevent>
        <div className="v2s-bar">
          <span className="v2s-label">{label}</span>
          {head}
          <button ref={close} type="button" className="v2s-x" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="v2s-body">{children}</div>
      </div>
    </div>
  );
}
