'use client';
/* FamChapters (Families A kit): the Apple product-page backbone. A sticky, scroll-driven scene: the chapter's words pin
   on the left (5 of 12 columns) while its picture changes on the right (6 of 12), one coming in as the last goes out;
   pictures change with a clip-path wipe. A row of chapter marks at the foot of the scene shows where you are and jumps
   to any chapter. Phones (≤ 900 px) read the same chapters as a plain vertical story; reduced motion keeps the swap but
   drops the movement. Everything is in the HTML.
   How to use it:
   - <FamChapters label="How it works" items={[{ key, text: <node>, visual: <node> }]} onStep={(i) => …} />;
   - text: your kicker, headline and a few lines (keep it to one idea; put the detail in a FamDrawer);
   - visual: a real product object; it fills a 70svh cell, so let it stretch (height: 100%);
   - onStep: the index of the chapter on screen, for a live object elsewhere to follow. */
import { useEffect, useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'motion/react';
import { ui } from './famUi';
import NoJs from '../NoJs';

/* with scripts off the chapters read as a plain stack (PLAN-COMPONENTS 2.3: JS off is legible) */
const NOJS = '.v2f-ch{height:auto}.v2f-ch-pin{position:static;height:auto;display:block;overflow:visible}.v2f-ch-g{display:flex;flex-direction:column;gap:96px}.v2f-ch-i{display:flex;flex-direction:column;gap:32px}.v2f-ch-t,.v2f-ch-v{opacity:1!important;transform:none!important;clip-path:none!important;pointer-events:auto!important}.v2f-ch-v{height:auto}.v2f-ch-nav{display:none}';

export default function FamChapters({ items, label, className = '', onStep, id }) {
  const ref = useRef(null);
  const [at, setAt] = useState(0);
  const n = items.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const k = Math.max(0, Math.min(n - 1, Math.floor(p * n * 0.999)));
    if (k !== at) setAt(k);
  });
  useEffect(() => { onStep && onStep(at); }, [at]); // eslint-disable-line react-hooks/exhaustive-deps
  const jump = (k) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + scrollY + ((el.offsetHeight - innerHeight) * (k + 0.5)) / n;
    window.__lenis ? window.__lenis.scrollTo(top, { duration: 1.1 }) : scrollTo({ top, behavior: 'smooth' });
  };
  // a keyboard reader tabbing into a chapter that is not on screen is taken to it
  const focusIn = (k) => () => { if (k !== at && matchMedia('(min-width: 901px)').matches) jump(k); };
  return (
    <section ref={ref} id={id} className={'v2f-ch ' + className} style={{ '--n': n }} aria-label={label}>
      <NoJs css={NOJS} />
      <div className="v2f-ch-pin">
        <div className="v2f-wrap v2f-grid v2f-ch-g">
          {items.map((it, k) => (
            <div key={it.key || k} className="v2f-ch-i">
              <div className="v2f-ch-t" data-on={k === at ? '' : undefined} style={{ '--dy': (k < at ? -48 : 48) + 'px' }} onFocus={focusIn(k)}>{it.text}</div>
              <div className="v2f-ch-v" data-on={k === at ? '' : undefined} style={{ '--cy': k < at ? '0 0 100% 0' : '100% 0 0 0' }} onFocus={focusIn(k)}>{it.visual}</div>
            </div>
          ))}
        </div>
        {n > 1 && (
          <nav className="v2f-ch-nav" aria-label={label || ui('chapter')}>
            {items.map((it, k) => (
              <button key={k} type="button" aria-label={(it.name ? it.name + ', ' : '') + ui('chapter') + ' ' + (k + 1) + ' ' + ui('of') + ' ' + n} aria-current={k === at ? 'step' : undefined} className={k < at ? 'past' : ''} onClick={() => jump(k)}><i><b /></i></button>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
