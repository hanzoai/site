'use client';
/* The sound layer (mounted once in app/layout.jsx): wires lib/sound.js to the site's meaningful moments and puts the
   mute toggle in Hanzo's header (and in the phone menu sheet, via <SoundToggle />). Pages add nothing; to sound
   their own moment they call play('done') from lib/sound.js, or put data-sound="tick" on a control (data-sound=""
   silences one). Clicks and keys only: never hover, scroll or page load. */
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { play, isMuted, setMuted } from '../lib/sound';

const ASK = '.x-ask-a, .x-btn.solid, a.solid, button.solid, [data-cta], [data-thumb]';
const TICK = '[role=tab], [role=switch], [role=menuitemradio], [aria-pressed], input[type=checkbox], input[type=radio], .x-faq button';

export function SoundToggle({ className = '' }) {
  const [muted, setM] = useState(false);
  useEffect(() => {
    setM(isMuted());
    const on = (e) => setM(!!e.detail);
    addEventListener('hz-sound-mute', on);
    return () => removeEventListener('hz-sound-mute', on);
  }, []);
  return (
    <button type="button" className={'x-snd ' + className} aria-label="Sound" aria-pressed={!muted} data-sound="" onClick={() => { setMuted(!muted); if (muted) setTimeout(() => play('tick'), 30); }}>
      <svg viewBox="0 0 20 20" width="17" height="17" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.5 7.5h2.6L10 4.5v11l-3.9-3H3.5z" />
        {muted ? <path d="M13.5 8l4 4M17.5 8l-4 4" /> : <><path d="M13.2 7.6a3.4 3.4 0 0 1 0 4.8" /><path d="M15.4 5.6a6.3 6.3 0 0 1 0 8.8" /></>}
      </svg>
    </button>
  );
}

export default function Sound() {
  const [slot, setSlot] = useState(null);

  // the toggle's place in Hanzo's header: just before the language button (desktop; the phone sheet has its own)
  useEffect(() => {
    const lang = document.querySelector('header[data-slot=masthead] button[data-slot=language]');
    if (!lang) return;
    const host = document.createElement('span');
    host.className = 'x-snd-slot';
    lang.parentElement.insertBefore(host, lang);
    setSlot(host);
    return () => host.remove();
  }, []);

  useEffect(() => {
    const click = (e) => {
      if (!e.isTrusted) return;
      const t = e.target.closest?.('[data-sound], ' + ASK + ', ' + TICK);
      if (!t) return;
      const own = t.closest('[data-sound]');
      if (own) { const n = own.getAttribute('data-sound'); if (n) play(n); return; }
      if (t.matches(TICK)) play('tick');
      else if (t.matches(ASK)) play('tap');
    };
    const asked = (e) => play(e.detail);
    // Morph and the palette announce their moments; the click layer above stays silent for those (one sound at once)
    document.addEventListener('click', click, true);
    addEventListener('hz-sound', asked);
    return () => { document.removeEventListener('click', click, true); removeEventListener('hz-sound', asked); };
  }, []);

  return slot ? createPortal(<SoundToggle />, slot) : null;
}
