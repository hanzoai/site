'use client';
/* useCalm (v2; owned by the Platform + Cloud chat). "Does the visitor ask for reduced motion?", answered only after the
   page has mounted, so the server's HTML and the browser's first render always match (no hydration mismatch).
   Use it wherever reduced motion changes what is rendered; inside effects, motion's useReducedMotion is fine. */
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

export default function useCalm() {
  const calm = useReducedMotion();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready && !!calm;
}
