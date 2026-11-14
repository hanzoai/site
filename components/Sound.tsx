'use client';
/* The sound layer (mounted once in app/layout.tsx): wires lib/sound.ts to the site's meaningful moments. Pages add nothing; to sound
   their own moment they call play('done') from lib/sound.ts, or put data-sound="tick" on a control (data-sound=""
   silences one). Clicks and keys only: never hover, scroll or page load. */
import { useEffect } from 'react';
import { play } from '../lib/sound';

const ASK = '.x-ask-a, .x-btn.solid, a.solid, button.solid, [data-cta], [data-thumb]';
const TICK = '[role=tab], [role=switch], [role=menuitemradio], [aria-pressed], input[type=checkbox], input[type=radio], .x-faq button';

export default function Sound() {
  useEffect(() => {
    const click = (e: MouseEvent) => {
      if (!e.isTrusted) return;
      const t = (e.target as Element).closest?.('[data-sound], ' + ASK + ', ' + TICK);
      if (!t) return;
      const own = t.closest('[data-sound]');
      if (own) { const n = own.getAttribute('data-sound'); if (n) play(n); return; }
      if (t.matches(TICK)) play('tick');
      else if (t.matches(ASK)) play('tap');
    };
    const asked = (e: Event) => play((e as CustomEvent<string>).detail);
    // Morph and the palette announce their moments; the click layer above stays silent for those (one sound at once)
    document.addEventListener('click', click, true);
    addEventListener('hz-sound', asked);
    return () => { document.removeEventListener('click', click, true); removeEventListener('hz-sound', asked); };
  }, []);

  return null;
}
