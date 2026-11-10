'use client';
/* /newsletter's five entrances (docs/MOTION-MAP.md), page-local, in page order:
   1 StretchScroll  the hero stretches vertically with scroll speed and relaxes (and once on arrival)
   2 ShrinkToCard   the statements section shrinks into a rounded card as you leave it
   3 NoiseDissolve  the opt-in envelope dissolves in out of grain, once, on entering view
   4 card-deal      the four steps are dealt from a deck onto their places (CSS in Newsletter.css, `.xnl-deal`)
   5 PixelResolve   the close resolves from coarse pixels to sharp, once, on entering view
   Each runs once, shows its final state under reduced motion and with JS off (no overlay is drawn before JS). */
import { useEffect, useId, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform, useVelocity, animate, useMotionValue } from 'motion/react';

export function StretchScroll({ children, className = '' }) {
  const calm = useReducedMotion();
  const { scrollY } = useScroll();
  const v = useVelocity(scrollY);
  const s = useSpring(useTransform(v, [-3000, 0, 3000], [1.14, 1, 1.14], { clamp: true }), { stiffness: 260, damping: 22 });
  const arrive = useMotionValue(calm ? 1 : 1.22);
  useEffect(() => { if (!calm) animate(arrive, 1, { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }); }, [calm, arrive]);
  const scaleY = useTransform([s, arrive], ([a, b]) => (calm ? 1 : a * b));
  return <motion.div className={className} style={{ scaleY, transformOrigin: '50% 0%' }}>{children}</motion.div>;
}

export function ShrinkToCard({ children, className = '', ...rest }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['end 0.9', 'end 0.2'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, calm ? 1 : 0.86]);
  const radius = useTransform(scrollYProgress, [0, 1], [0, calm ? 0 : 28]);
  const bg = useTransform(scrollYProgress, [0, 1], ['#ffffff', calm ? '#ffffff' : '#f5f5f5']);
  return (
    <motion.section ref={ref} className={className} style={{ scale, borderRadius: radius, backgroundColor: bg, transformOrigin: '50% 100%' }} {...rest}>
      {children}
    </motion.section>
  );
}

export function NoiseDissolve({ children, className = '', grain = [10, 38, 64] }) {
  const ref = useRef(null), cv = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.35 });
  const calm = useReducedMotion();
  const [done, setDone] = useState(false);
  // cover with grain as soon as JS runs, so the dissolve starts from noise
  useEffect(() => {
    const c = cv.current; if (!c || calm) { setDone(true); return; }
    const r = c.getBoundingClientRect(), S = 4;
    c.width = Math.ceil(r.width / S); c.height = Math.ceil(r.height / S);
    const x = c.getContext('2d'), img = x.createImageData(c.width, c.height);
    for (let i = 0; i < img.data.length; i += 4) { const g = grain[(Math.random() * grain.length) | 0]; img.data[i] = img.data[i + 1] = img.data[i + 2] = g; img.data[i + 3] = 255; }
    x.putImageData(img, 0, 0);
    c.dataset.t = '';
  }, [calm]);
  useEffect(() => {
    if (!seen || calm) return;
    const c = cv.current; if (!c) return;
    const x = c.getContext('2d'), n = c.width * c.height, order = new Uint32Array(n);
    for (let i = 0; i < n; i++) order[i] = i;
    for (let i = n - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; const t = order[i]; order[i] = order[j]; order[j] = t; }
    let k = 0, raf = 0; const t0 = performance.now(), D = 1100;
    const step = (t) => {
      const want = Math.min(n, Math.round(n * Math.pow(Math.min(1, (t - t0) / D), 0.8)));
      for (; k < want; k++) { const p = order[k]; x.clearRect(p % c.width, (p / c.width) | 0, 1, 1); }
      if (k < n) raf = requestAnimationFrame(step); else setDone(true);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, calm]);
  return (
    <div ref={ref} className={'xnl-noise ' + className}>
      {children}
      {!done && <canvas ref={cv} className="xnl-noise-cv" aria-hidden="true" />}
    </div>
  );
}

const SIZES = [36, 24, 16, 10, 6, 3];
export function PixelResolve({ children, className = '' }) {
  const ref = useRef(null);
  const id = 'px' + useId().replace(/:/g, '');
  const seen = useInView(ref, { once: true, amount: 0.4 });
  const calm = useReducedMotion();
  const [k, setK] = useState(0); // index into SIZES; SIZES.length = sharp
  const [js, setJs] = useState(false);
  useEffect(() => { setJs(true); if (calm) setK(SIZES.length); }, [calm]);
  useEffect(() => {
    if (!seen || calm || k >= SIZES.length) return;
    const t = setTimeout(() => setK((v) => v + 1), 110);
    return () => clearTimeout(t);
  }, [seen, k, calm]);
  const s = SIZES[k];
  const on = js && s;
  return (
    <div ref={ref} className={'xnl-px ' + className} style={on ? { filter: `url(#${id})` } : undefined}>
      {on ? (
        <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
          <filter id={id} x="0" y="0" width="100%" height="100%">
            <feFlood x={s / 2} y={s / 2} width="1" height="1" />
            <feComposite width={s} height={s} />
            <feTile result="a" />
            <feComposite in="SourceGraphic" in2="a" operator="in" />
            <feMorphology operator="dilate" radius={s / 2} />
          </filter>
        </svg>
      ) : null}
      {children}
    </div>
  );
}
