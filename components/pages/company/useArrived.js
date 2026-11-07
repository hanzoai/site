'use client';
/* useArrived: true once the site's arrival curtain (components/arrival.js) has lifted, so a hero's entrance plays where
   people can see it, not behind the curtain (review/contact.md, 7 Nov). Return visits have no curtain: true at once.
   A failsafe opens it after 3.5s whatever happens (PLAN-COMPONENTS 2.17 "Arrival safety").
   Usage: const ok = useArrived();  <motion.div initial={{ opacity: 0 }} animate={ok ? { opacity: 1 } : undefined} />
   Page-local kit of the Wave 2 Company chat. */
import { useEffect, useState } from 'react';

const curtain = () => typeof document !== 'undefined' && document.documentElement.classList.contains('x-arriving');

export default function useArrived() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!curtain()) { setOk(true); return; }
    const go = () => setOk(true);
    addEventListener('hz-arrived', go, { once: true });
    const t = setTimeout(go, 3500);
    return () => { removeEventListener('hz-arrived', go); clearTimeout(t); };
  }, []);
  return ok;
}
