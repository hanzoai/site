'use client';
/* useNarrow — true on phone widths (≤ 900 px), for the Apps 2 pages whose scroll scenes take other values on phones
   (Apps 2 chat). Usage: const narrow = useNarrow(); It is false on the server and on the first paint. */
import { useEffect, useState } from 'react';

export default function useNarrow(q = '(max-width: 900px)') {
  const [n, setN] = useState(false);
  useEffect(() => {
    const m = matchMedia(q);
    const f = () => setN(m.matches);
    f();
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, [q]);
  return n;
}
