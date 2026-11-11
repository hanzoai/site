'use client';
/* A product card's screen plays through Hanzo's examples for it, as the landing's cards did (hanzo-inc/app
   components/home/Products.tsx useScene): while the card is on screen, the next example every HOLD ms, its rows coming
   in one after another. The first example is the server's (the card's own screen, content/products.ts) and stands as
   drawn until the first step. The others (scenes.json, captured from hanzo.ai) load when the card comes near; off
   screen, in a hidden tab or under reduced motion nothing plays. */
import { useEffect, useRef, useState } from 'react';
import './scenes.css';

const HOLD = 5200;

const Shot = ({ html }) => <div className="xp-shot" dangerouslySetInnerHTML={{ __html: html }} />;

export default function Cycle({ i, html }) {
  const box = useRef(null);
  const [extra, setExtra] = useState([]);
  const [at, setAt] = useState({ k: 0, round: 0 });
  useEffect(() => {
    const el = box.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let t = 0, seen = false, list = null;
    const step = () => setAt(({ k, round }) => { const n = (k + 1) % (list.length + 1); return { k: n, round: n ? round : round + 1 }; });
    const run = () => { clearInterval(t); if (seen && !document.hidden && list?.length) t = setInterval(step, HOLD + i * 140); };
    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
      if (seen && !list) import('./scenes.json').then((m) => { list = m.default[i] || []; setExtra(list); run(); });
      else run();
    }, { threshold: 0.35 });
    io.observe(el);
    document.addEventListener('visibilitychange', run);
    return () => { io.disconnect(); clearInterval(t); document.removeEventListener('visibilitychange', run); };
  }, [i]);
  const { k, round } = at;
  return (
    <div className="xp-vis" ref={box}>
      <div key={`${k}-${round}`} className="xp-scene" data-play={k || round ? '' : undefined}>
        <Shot html={k ? extra[k - 1] : html} />
      </div>
    </div>
  );
}
