'use client';
/* The page's colour scheme as <html> carries it ('dark' | 'light'; docs/DARK-MODE.md). Canvas fields read their ink once,
   so the model pages key them on this and they redraw when the device switches. Used by /uta, /zen, /zen/models, /zen/7, /zen/zen6-max. */
import { useEffect, useState } from 'react';
export default function useScheme() {
  const [s, setS] = useState('light');
  useEffect(() => {
    const h = document.documentElement, read = () => setS(h.classList.contains('dark') ? 'dark' : 'light');
    read();
    const mo = new MutationObserver(read);
    mo.observe(h, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, []);
  return s;
}
