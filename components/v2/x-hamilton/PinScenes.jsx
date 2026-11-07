'use client';
/* PinScenes — Apple's sticky chapters (Cloud 4 chat; VISION.md motion 1, "Chapters").
   Usage:
     <PinScenes kick="How it works" head="Four ways to ask, one index" lede="…" items={[[title, body], …]}
                visual={(at, progress) => <YourVisual at={at} />} flip count="01 / 06" screens={0.9} />
   - Desktop: the track is one screen per chapter. Copy and visual pin; as you scroll, one chapter goes out (up, fast) while
     the next comes in (from below, slower), and the page draws its visual for the current chapter (progress is the track's
     scroll MotionValue, 0 → 1, for anything scrubbed). A rail of ticks shows where you are and jumps there on click.
   - Each chapter's number reads "01 / 06" (Hanzo's own counter), under its title; the kick sits under the head
     (JAMES.md: nothing above a headline). Every chapter's words stay in the HTML.
   - Phones and reduced motion: chapters stack, each with its own visual (visual(i) is drawn once per chapter), no pin.
   - before / after: optional nodes inside the section, above the track / below it. */
import { useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'motion/react';
import useCalm from '../useCalm';
import { useWide } from '../useWide';
import { scrollToY } from '../../../lib/scroll';
import './Launch.css';

const pad = (i) => String(i + 1).padStart(2, '0');

export default function PinScenes({ id, kick, head, lede, items, visual, flip, dark, screens = 0.9, before, after, className = '' }) {
  const track = useRef(null);
  const wide = useWide();
  const calm = useCalm();
  const pin = wide && !calm;
  const n = items.length;
  const [at, setAt] = useState(0);
  const { scrollYProgress: p } = useScroll({ target: track, offset: ['start start', 'end end'] });
  useMotionValueEvent(p, 'change', (v) => { const i = Math.min(n - 1, Math.max(0, Math.floor(v * n * 0.999 + 0.0005))); if (i !== at) setAt(i); });
  const jump = (i) => {
    const el = track.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + scrollY;
    const y = top + ((el.offsetHeight - innerHeight) * (i + 0.5)) / n;
    scrollToY(y);
  };
  const total = `/ ${pad(n - 1)}`;
  return (
    <section id={id} className={`l2-pin ${flip ? 'flip' : ''} ${pin ? '' : 'stack'} ${dark ? 'l2-dark' : ''} ${className}`} data-room={dark ? 'dark' : undefined}>
      {(kick || head || lede) && (
        <header className="l2-wrap l2-pin-head">
          {head && <h2 className="l2-head">{head}</h2>}
          {kick && <p className="l2-kick">{kick}</p>}
          {lede && <p className="l2-lede">{lede}</p>}
        </header>
      )}
      {before}
      <div className="l2-pin-track" ref={track} style={pin ? { height: `${n * screens * 100 + 10}svh` } : undefined}>
        <div className="l2-wrap l2-pin-stick">
          <div className="l2-pin-copy">
            {items.map(([t, d, extra], i) => (
              <article key={t} className={'l2-ch' + (!pin || i === at ? ' on' : '') + (pin && i < at ? ' past' : '')} aria-hidden={pin && i !== at ? true : undefined}>
                <h3 className="l2-title">{t}</h3>
                <p className="l2-ch-n">{pad(i)} {total}</p>
                {d && <p className="l2-body">{d}</p>}
                {extra}
                {!pin && <div className="l2-ch-vis" aria-hidden="true">{visual(i, null)}</div>}
              </article>
            ))}
          </div>
          {pin && <div className="l2-pin-vis" aria-hidden="true">{visual(at, p)}</div>}
          {pin && (
            <nav className="l2-rail" aria-label={(head || kick || 'Chapters') + ': chapters'}>
              {items.map(([t], i) => (
                <button key={t} type="button" aria-current={i === at ? 'step' : undefined} className={i < at ? 'done' : ''} onClick={() => jump(i)} aria-label={`${pad(i)} ${t}`}>
                  <span aria-hidden="true">{pad(i)}</span><i><b /></i>
                </button>
              ))}
            </nav>
          )}
        </div>
      </div>
      {after}
    </section>
  );
}
