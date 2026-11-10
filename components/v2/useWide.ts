'use client';
/* useWide (Cloud 4 chat). Usage: const wide = useWide(); true above 900px once mounted (false on the server and on phones),
   so pinned, scrubbed scenes only switch on where they can be read; phones get the stacked layout from CSS first. */
import { useEffect, useState } from 'react';

export function useWide(min = 901) {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const m = matchMedia(`(min-width: ${min}px)`);
    const on = () => setWide(m.matches);
    on();
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, [min]);
  return wide;
}
