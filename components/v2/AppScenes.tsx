'use client';
/* Chapters for the Apps 1 pages (owned by the Apps 1 chat): the Apple product-page backbone. A tall section pins one
   screen; as you scroll, one chapter's words come in from below as the last go out above, and its picture wipes up over
   the previous one (clip-path). A rail of numbered ticks shows where you are and jumps to a chapter.
   Usage:
     <Scenes label="How it works" items={[
       { title: 'One key', body: <p className="av-body">…</p>, visual: (on) => <MyUI live={on} /> },
       …]} flip={false} tone={['#fff', '#f5f5f7', …]} />
   - visual: a node, or (on) => node so its live demo runs only while its chapter is showing;
   - flip: picture on the left; tone: an optional background per chapter (the scene change).
   Phones (≤ 900 px) get no pin: the chapters stack, text then picture, and each one is live while it is on screen.
   Reduced motion: no wipes, the active chapter simply shows. Every chapter's words are always in the HTML, and without
   JS the chapters simply stack (the pin is scoped to html.js). No label sits over a chapter's headline: the rail numbers
   them. A chapter's `kick` (Hanzo's own label) is printed small under its text instead. */
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useScroll, useMotionValueEvent, useInView } from 'motion/react';
import './AppScenes.css';

type Visual = ReactNode | ((on: boolean) => ReactNode);

interface Scene {
  title: ReactNode;
  body?: ReactNode;
  kick?: string;
  visual: Visual;
}

function PhoneLive({ children }: { children?: Visual }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { amount: 0.45 });
  return <div ref={ref} className="av-sc-pl">{typeof children === 'function' ? children(on) : children}</div>;
}

interface ScenesProps {
  items: readonly Scene[];
  label?: string;
  flip?: boolean;
  tone?: readonly string[];
  className?: string;
  id?: string;
}

export default function Scenes({ items, label, flip = false, tone, className = '', id }: ScenesProps) {
  const ref = useRef<HTMLElement>(null);
  const [at, setAt] = useState(0);
  const [phone, setPhone] = useState(false);
  const pinned = useInView(ref, { amount: 0.05 });
  const n = items.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.max(0, Math.min(n - 1, Math.floor(v * n * 0.9999)));
    setAt((a) => (a === i ? a : i));
  });
  useEffect(() => {
    const m = matchMedia('(max-width: 900px)');
    const f = () => setPhone(m.matches);
    f(); m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  const jump = (i: number) => {
    const el = ref.current; if (!el) return;
    const top = el.getBoundingClientRect().top + scrollY;
    const span = el.offsetHeight - innerHeight;
    const y = top + (span * (i + 0.5)) / n;
    window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.1 }) : scrollTo({ top: y, behavior: 'smooth' });
  };
  const bg = tone ? tone[at % tone.length] : undefined;
  return (
    <section ref={ref} id={id} className={'av-sc' + (flip ? ' flip' : '') + ' ' + className} style={{ '--n': n } as CSSProperties} aria-label={label}>
      <div className="av-sc-pin" style={bg ? { background: bg } : undefined}>
        <div className="av-wrap av-sc-grid">
          {items.map((it, i) => {
            const st = i === at ? ' on' : i < at ? ' past' : '';
            return [
              <div key={'t' + i} className={'av-sc-t' + st} aria-current={i === at ? 'step' : undefined} onFocus={() => { if (!phone && i !== at) jump(i); }}>
                <h3 className="av-head">{it.title}</h3>
                {it.body}
                {it.kick ? <p className="av-sc-k">{it.kick}</p> : null}
              </div>,
              <div key={'v' + i} className={'av-sc-v' + st}>
                {phone
                  ? <PhoneLive>{it.visual}</PhoneLive>
                  : typeof it.visual === 'function' ? it.visual(i === at && pinned) : it.visual}
              </div>,
            ];
          })}
          <nav className="av-sc-rail" aria-label={(label || 'Chapters') + ': jump to'}>
            {items.map((it, i) => (
              <button key={i} type="button" className={i === at ? 'on' : ''} aria-label={'Chapter ' + (i + 1) + ': ' + (typeof it.title === 'string' ? it.title : it.kick || '')} aria-current={i === at ? 'step' : undefined} onClick={() => jump(i)}>
                <span className="av-num">{String(i + 1).padStart(2, '0')}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
