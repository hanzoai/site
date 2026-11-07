'use client';
/* A2Pause — the pause control a moving thing carries (Apps 2 chat; MASTER.md part 12: "moving content has a pause
   control first in the DOM, 44px, aria-pressed").
   Usage: const [paused, setPaused] = useState(false);
          <div className="my-demo"><A2Pause paused={paused} onChange={setPaused} label="Pause the demo" /> … </div>
   Put it first inside the moving thing. It is a real button (Space and Enter), 44 px, and says what it does. A page
   stops its loop while paused; CSS loops inside the same box stop through the .a2-paused class the page sets. */
export default function A2Pause({ paused, onChange, label = 'Pause the demo', className = '' }) {
  return (
    <button type="button" className={'a2-pause ' + className} aria-pressed={paused} aria-label={label} onClick={() => onChange(!paused)}>
      {paused
        ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.2v9.6L12.6 8z" fill="currentColor" /></svg>
        : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4.5 3h2.4v10H4.5zM9.1 3h2.4v10H9.1z" fill="currentColor" /></svg>}
    </button>
  );
}
