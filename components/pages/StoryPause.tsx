'use client';
/* The Story pages' pause control (page-owned): one 44px icon button, first in the DOM of the thing that moves by itself,
   for WCAG 2.2.2 (MASTER part 12). Its accessible name is the register's "Pause" (content/ui-strings.json), so it shows
   an icon only until James approves the word. Usage: <StoryPause paused={p} onToggle={() => setP(!p)} className="…" /> */
import UI from '../../content/ui-strings.json';

interface StoryPauseProps { paused: boolean; onToggle: () => void; className?: string }

export default function StoryPause({ paused, onToggle, className = '' }: StoryPauseProps) {
  return (
    <button type="button" className={'xst-pause ' + className} aria-pressed={paused} aria-label={UI.strings.pause.string} onClick={onToggle}>
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        {paused ? <path d="M5 3.5v9l7.5-4.5z" fill="currentColor" /> : <path d="M4.5 3.5h2.5v9H4.5zM9 3.5h2.5v9H9z" fill="currentColor" />}
      </svg>
    </button>
  );
}
