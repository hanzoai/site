'use client';
/* Pause: the control every self-running demo carries (WCAG 2.2.2), icon only with an aria-label, 44px.
   Usage: const [paused, pauseBtn] = usePause(); … run the loop only while live && !paused; render {pauseBtn} inside
   the demo's positioned box (top-right by default; pass a style to move it). Owned by the Business 2 chat. */
import { useState, type CSSProperties, type ReactElement } from 'react';

export function usePause(style?: CSSProperties): [boolean, ReactElement] {
  const [paused, setPaused] = useState(false);
  const btn = (
    <button type="button" className="w2-pause" style={style || { right: 16, top: 16 }} aria-pressed={paused} aria-label={paused ? 'Play' : 'Pause'} onClick={() => setPaused((p) => !p)}>
      {paused
        ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4.5 3v10l8.5-5z" fill="currentColor" /></svg>
        : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="4" y="3" width="2.6" height="10" rx="1" fill="currentColor" /><rect x="9.4" y="3" width="2.6" height="10" rx="1" fill="currentColor" /></svg>}
    </button>
  );
  return [paused, btn];
}
