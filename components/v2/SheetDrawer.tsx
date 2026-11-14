'use client';
/* SheetDrawer (owner: Cloud 2 chat). "See the spec": detail lives in a sheet you open, so the page can say one thing
   per screen (VISION.md "chapters it"). A side sheet on desktop, a bottom sheet on phones.
   Usage: <SheetDrawer label="See the spec" title="Gateway, in detail" className="btn classes">…content…</SheetDrawer>
   - The content is always in the HTML (closed = off screen and inert), so nothing is lost and search still finds it.
   - Esc, the scrim and the close button shut it; focus moves in on open and back to the button on close.
   Styles: SheetDrawer.css (prefix sd-); set --acc on an ancestor for the accent. */
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import './SheetDrawer.css';

interface SheetDrawerProps {
  label: ReactNode;
  title: string;
  kick?: ReactNode;
  children?: ReactNode;
  className?: string;
  icon?: boolean;
}

export default function SheetDrawer({ label, title, kick, children, className = 'v2-btn', icon = true }: SheetDrawerProps) {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    document.documentElement.classList.add('sd-lock');
    const t = setTimeout(() => panel.current?.querySelector<HTMLElement>('.sd-x')?.focus(), 60);
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    addEventListener('keydown', key);
    return () => {
      clearTimeout(t);
      removeEventListener('keydown', key);
      window.__lenis?.start();
      document.documentElement.classList.remove('sd-lock');
      btn.current?.focus({ preventScroll: true });
    };
  }, [open]);
  return (
    <>
      <button ref={btn} type="button" className={className} aria-expanded={open} aria-controls={id} onClick={() => setOpen(true)}>
        {label}
        {icon && <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>}
      </button>
      <div className="sd" data-open={open ? '' : undefined}>
        <div className="sd-scrim" onClick={() => setOpen(false)} aria-hidden="true" />
        <aside ref={panel} id={id} className="sd-panel" role="dialog" aria-modal="true" aria-label={title} inert={!open ? true : undefined} data-lenis-prevent="">
          <header className="sd-h">
            <div>
              {kick && <p className="v2-kick acc">{kick}</p>}
              <p className="sd-t">{title}</p>
            </div>
            <button type="button" className="sd-x" aria-label="Close" onClick={() => setOpen(false)}>
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </header>
          <div className="sd-body">{children}</div>
        </aside>
      </div>
    </>
  );
}
