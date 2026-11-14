'use client';
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { motion } from 'motion/react';
import { Head, Arrow } from './ui';
import { useOpener } from './Opener';
import { MODELS, media } from '../lib/models';

/* A model card: its still at rest; its film loads and plays only under the pointer or focus (so a phone decodes none);
   a click lifts the picture off the page and opens it into the model's own page. */
function Card({ m, i, live, setLive }: { m: (typeof MODELS)[number]; i: number; live: string | null; setLive: Dispatch<SetStateAction<string | null>> }) {
  const vid = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLAnchorElement>(null);
  const opener = useOpener();
  const big = i === 0;
  const shouldPlay = live === m.slug;

  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    if (shouldPlay && !matchMedia('(prefers-reduced-motion: reduce)').matches) v.play().catch(() => {});
    else v.pause();
  }, [shouldPlay]);

  const enter = () => {
    setLive(m.slug);
    opener?.prefetch?.('/' + m.slug);
  };
  const leave = () => setLive((a) => (a === m.slug ? null : a));

  return (
    <li className={'x-mcard' + (big ? ' big' : '')}>
      <motion.a
        href={'/' + m.slug}
        className="x-mbtn"
        data-card={m.slug}
        ref={box}
        onPointerEnter={enter}
        onPointerLeave={leave}
        onFocus={enter}
        onBlur={leave}
        onClick={(e) => { opener?.open(e, { el: box.current!, src: media(m.slug, 'webp'), href: '/' + m.slug, key: m.slug }); }}
        whileTap={{ scale: 0.985 }}
        aria-label={`${m.name}: ${m.desc}`}
      >
        <span className="x-mtilt" data-tilt="">
          <span className="x-mmedia">
            <img src={media(m.slug, 'webp')} alt="" />
            <video ref={vid} src={media(m.slug, 'webm')} muted loop playsInline preload="none" aria-hidden="true" onPlaying={(e) => e.currentTarget.classList.add('on')} />
          </span>
          <span className="x-mtext">
            {m.kicker && <span className="x-mkick">{m.kicker}</span>}
            <span className="x-mname">{m.name}<svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            <span className="x-mdesc">{m.desc}</span>
          </span>
          <span className="x-mtags">{m.tags.map((t) => <span key={t}>{t}</span>)}</span>
        </span>
      </motion.a>
    </li>
  );
}

export default function Models() {
  const [live, setLive] = useState<string | null>(null);
  const opener = useOpener();
  const sec = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = sec.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      ['enso', 'kai', 'zen'].forEach((s) => opener?.prefetch?.('/' + s));
      io.disconnect();
    }, { rootMargin: '300px' });
    io.observe(el);
    return () => io.disconnect();
  }, [opener]);
  return (
    <section ref={sec} className="x-sec x-models" id="models" data-hz-view="models" aria-labelledby="models-h">
      <div className="x-wrap">
        <Head id="models-h" title="Frontier AI for everything you build." lede="Language, routing, decisions and creative models." />
        <ul className="x-mgrid">{MODELS.map((x, i) => <Card key={x.slug} m={x} i={i} live={live} setLive={setLive} />)}</ul>
        <div className="x-row-links">
          <Arrow href="/pricing">Explore model pricing</Arrow>
          <Arrow href="/models">View full model catalog</Arrow>
        </div>
      </div>
    </section>
  );
}
