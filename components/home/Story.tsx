'use client';
/* A product card's screen tells its story, as the landing's cards did (hanzo-inc/app components/home/Products.tsx
   useScene): a command types out, a call runs and ticks, the agent's cursor moves and clicks, the next page follows.
   stories.json is that landing's own scenes, recorded: each card's first screen and the timed changes that play it
   once through every page, then again. The server draws the first screen (content/products.ts); the story loads and
   starts when the card comes into view, and stops off screen, in a hidden tab and under reduced motion. Design's reel
   plays in CSS (platform.css) while its card is in view. */
import { useEffect, useRef } from 'react';
import './story.css';

// a node by its childNodes indices under the screen
const at = (el, path) => path.reduce((n, j) => n.childNodes[j], el);
const apply = (el, ops) => {
  for (const [op, path, a, b] of ops) {
    const n = at(el, path);
    if (!n) continue;
    if (op === 'a') (b === null ? n.removeAttribute(a) : n.setAttribute(a, b));
    else if (op === 't') n.data = a;
    else n.innerHTML = a;
  }
};

export default function Story({ i, html }) {
  const box = useRef(null);
  useEffect(() => {
    // the screen's root, as the old card's (the server's copy of it sits in .xp-shot)
    const vis = box.current, el = vis?.firstElementChild?.firstElementChild;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let story, k = 0, t = 0, seen = false, gone = false;
    const step = () => { const [wait, ops] = story.steps[k]; t = setTimeout(() => { apply(el, ops); k = (k + 1) % story.steps.length; step(); }, wait); };
    const run = () => {
      clearTimeout(t);
      const on = seen && !document.hidden;
      if (on) vis.setAttribute('data-on', ''); else vis.removeAttribute('data-on');
      if (on && story) step();
    };
    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
      if (seen && story === undefined) {
        story = null;
        import('./stories.json').then((m) => {
          if (gone) return;
          story = m.default[i];
          if (story) el.innerHTML = story.html;
          run();
        });
      }
      run();
    }, { threshold: 0.35 });
    io.observe(vis);
    document.addEventListener('visibilitychange', run);
    return () => { gone = true; io.disconnect(); clearTimeout(t); document.removeEventListener('visibilitychange', run); };
  }, [i]);
  return (
    <div className="xp-vis" ref={box}>
      <div className="xp-shot" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
