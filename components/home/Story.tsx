'use client';
/* A product card's screen tells its story, as the landing's cards did (hanzo-inc/app components/home/Products.tsx
   useScene): a command types out, a call runs and ticks, the agent's cursor moves and clicks, the next page follows.
   stories.json is that landing's own scenes, recorded: each card's first screen and the timed changes that play it
   once through every page, then again. The server draws the first screen (content/products.ts); the story loads and
   starts when the card comes into view, and stops off screen, in a hidden tab and under reduced motion. Design's reel
   plays in CSS (platform.css) while its card is in view. */
import { useEffect, useRef } from 'react';
import './story.css';

/** A change to a node: set or remove an attribute ('a'), set a text node's data ('t'), or set its markup. */
type Op = [op: string, path: number[], a: string, b?: string | null];
/** A card's recorded story: its first screen and the timed changes that play it. */
interface Scene { html: string; steps: [wait: number, ops: Op[]][] }

// a node by its childNodes indices under the screen
const at = (el: Node, path: number[]) => path.reduce<Node>((n, j) => n.childNodes[j], el);
const apply = (el: Node, ops: Op[]) => {
  for (const [op, path, a, b] of ops) {
    const n = at(el, path);
    if (!n) continue;
    // the recorded op names the kind of node it targets
    if (op === 'a') (b === null ? (n as Element).removeAttribute(a) : (n as Element).setAttribute(a, b!));
    else if (op === 't') (n as CharacterData).data = a;
    else (n as Element).innerHTML = a;
  }
};

export default function Story({ i, html }: { i: number; html: string }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // the screen's root, as the old card's (the server's copy of it sits in .xp-shot)
    const vis = box.current, el = vis?.firstElementChild?.firstElementChild;
    if (!vis || !el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let story: Scene | null | undefined, k = 0, t: ReturnType<typeof setTimeout> | 0 = 0, seen = false, gone = false;
    const step = () => { const s = story!; const [wait, ops] = s.steps[k]; t = setTimeout(() => { apply(el, ops); k = (k + 1) % s.steps.length; step(); }, wait); };
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
          story = (m.default as unknown as Scene[])[i]; // the JSON import types each step as a loose array
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
