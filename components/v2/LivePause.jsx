'use client';
/* LivePause: the pause control every self-running demo needs (WCAG 2.2.2, PLAN-COMPONENTS 2.12). A 44px round button,
   first in the demo's DOM, that stops and restarts the loop; icon only, named by aria-label (the "Pause"/"Play"
   strings wait on James's register, so they are never shown as text). Pressed state is aria-pressed.
   Usage:
     const [paused, pause] = usePause();
     const [ref, live] = useLive(); const run = live && !paused;
     <div className="my-demo"><LivePause paused={paused} onToggle={pause} className="my-pause" /> …</div>
   Position it with your own class (it is absolutely positioned top-right by default). Owned by Cloud 3. */
import { useCallback, useState } from 'react';
import './LivePause.css';

export function usePause() {
  const [paused, setPaused] = useState(false);
  return [paused, useCallback(() => setPaused((p) => !p), [])];
}

export default function LivePause({ paused, onToggle, dark, className = '' }) {
  return (
    <button type="button" className={`lx-pause ${dark ? 'dark' : ''} ${className}`} aria-pressed={paused} aria-label={paused ? 'Play' : 'Pause'} onClick={onToggle}>
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        {paused ? <path d="M5 3.5v9l7.5-4.5z" fill="currentColor" /> : <path d="M5 3.5h2v9H5zM9 3.5h2v9H9z" fill="currentColor" />}
      </svg>
    </button>
  );
}
