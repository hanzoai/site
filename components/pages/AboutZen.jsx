'use client';
/* About, part 5: the Zen of Hanzo as the page's one pinned scene (apple.com). The section is a track six steps long; its
   stage holds still while the scroll turns the six principles one at a time on the plate (the old one leaves before the
   new one rises), and a thin bar under the plate fills with the scroll. A hand, a key or a tap can still pick any of
   them; a click also moves the scroll to that principle's place, so the scroll and the plate agree. Styles in About.css. */
import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { Cta } from '../kit';

const Link2 = ({ to, children }) => <Cta to={to} kind="link">{children}</Cta>;
const pad = (n) => String(n).padStart(2, '0');

/* ---------- 5. the Zen of Hanzo: an index and its plate ---------- */
const ZEN = [
  ['Enable the Underdog', 'Enable others to win. Democratize technology so small businesses and startups can compete with industry giants.'],
  ['Data-Driven Everything', 'Let data be your guide. Embrace analytics and AI as the foundation of decision-making.'],
  ['Open Innovation', 'Be open, share often. Openness accelerates growth—both for the company and its community.'],
  ['Adaptability', 'Pivot with purpose. There is no failure, only feedback. Move quickly and strike in new directions when opportunity calls.'],
  ['Customer-Centric Growth', 'Treat each client as a long-term partner and guide them to success.'],
  ['First Principles Thinking', 'See the invisible, do the impossible. Boil problems down to their essence and solve them in fundamentally better ways.'],
];

export default function Zen() {
  // a pinned scene (apple.com): the section holds still while the scroll turns its six principles one at a time,
  // the old one leaving before the new one rises; a hand or a key can still pick any of them (last input wins)
  const [at, setAt] = useState(0);
  const track = useRef(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const stepOf = (v) => Math.min(ZEN.length - 1, Math.max(0, Math.floor(v * ZEN.length)));
  const last = useRef(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => { const s = stepOf(v); if (s !== last.current) { last.current = s; setAt(s); } });
  const pick = (i) => setAt(i);
  // a click also moves the scroll to that principle's place in the scene, so the scroll and the plate agree
  const go = (i) => {
    setAt(i);
    const t = track.current;
    if (!t || t.offsetHeight <= innerHeight + 4) return;
    last.current = i;
    const y = t.getBoundingClientRect().top + scrollY + ((i + 0.5) / ZEN.length) * (t.offsetHeight - innerHeight);
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 0.9 }); else scrollTo({ top: y, behavior: 'smooth' });
  };
  return (
    <section className="v2s-sec xab-zen" id="zen" aria-labelledby="xab-zen-h" ref={track}>
      <div className="xab-zen-pin">
        <div className="v2s-wrap">
          <div className="v2s-head side xab-zen-head">
            <h2 id="xab-zen-h" className="v2s-display xab-zen-h">The Zen of Hanzo</h2>
            <p className="v2s-cap">Operating Principles</p>
            <div className="xab-zen-l">
              <p className="v2s-lede">The principles the company argues from when a decision is close.</p>
              <Link2 to="/philosophy">Explore the full Zen manifesto</Link2>
            </div>
          </div>
          <div className="v2s-grid xab-zen-g">
            <ol className="v2s-c-1-6 xab-zen-list">
              {ZEN.map(([t, d], i) => (
                <li key={t} className={i === at ? 'on' : ''}>
                  <button type="button" aria-pressed={i === at} onClick={() => go(i)} onPointerEnter={(e) => e.pointerType === 'mouse' && pick(i)} onFocus={() => pick(i)}>
                    <span className="v2s-num" aria-hidden="true">{pad(i + 1)}</span>
                    <b>{t}</b>
                  </button>
                  <p className="xab-zen-d">{d}</p>
                </li>
              ))}
            </ol>
            <div className="v2s-c-7-12 xab-zen-plate" aria-hidden="true">
              {ZEN.map(([t, d], i) => (
                <div key={t} className={'xab-zen-card' + (i === at ? ' on' : '')}>
                  <span className="xab-zen-n v2s-num">{pad(i + 1)}</span>
                  <b className="v2s-title">{t}</b>
                  <p className="v2s-lede">{d}</p>
                </div>
              ))}
              <span className="xab-zen-bar"><motion.i style={{ scaleX: bar }} /></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

