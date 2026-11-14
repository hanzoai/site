'use client';
// Persona: a visitor who opened a flagship card (developer or creative). Goal: meet the model, then try it. CTA: the model body's own first action, in Hanzo's words. Metric: api_key_created.
/* A model's page. Its hero is the card's film at full bleed, exactly where the open transition lands, so the card
   and the page are one continuous object. Close runs the transition back into the card. The body below is the
   model's own rebuilt page (passed as children by app/<slug>/page.jsx); a route without one falls back to the port.
   The page ends on the next model, whose film is already playing.
   v2: the hero settles as you scroll: the full-bleed film draws in to a rounded card (clip only), the way it arrived,
   and an index (01 / 09) places the model among Hanzo's nine.
   Signature: the open. The card's film lands as this hero (WebGL opener), Close runs it back into the card, and the
   next model's card opens the same way; on phones a sideways swipe turns to the neighbouring model.
   Beyond: carried by each model's own body (passed as children); this shell adds none of its own. */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { EASE } from './ui';
import { useOpener } from './Opener';
import Ported from './Ported';
import { bySlug, media, MODELS } from '../lib/models';
import { useFilms } from './pages/model/live';
import { Img } from './kit';
import ModelFilm from './v2/ModelFilm';
import './pages/model/Model.css';

export default function ModelPage({ slug, html, children }: { slug: string; html?: string; children?: ReactNode }) {
  const m = bySlug[slug];
  const opener = useOpener();
  const hero = useRef<HTMLElement>(null), root = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const { scrollYProgress: p } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  const y = useTransform(p, [0, 1], ['0%', '18%']);
  const textY = useTransform(p, [0, 1], [0, -80]);
  const fade = useTransform(p, [0, 0.7], [1, 0]);
  // scale has rhythm: the name is the moment on arrival and shrinks back as the page takes over
  const shrink = useTransform(p, [0, 0.8], [1, 0.62]);
  const clipPath = useTransform(p, [0, 0.9], ['inset(0% 0% 0% 0% round 0px)', 'inset(5% 4% 20% 4% round 28px)']);
  const i = MODELS.findIndex((x) => x.slug === slug);
  const next = MODELS[(i + 1) % MODELS.length];

  useEffect(() => {
    const img = hero.current!.querySelector('img')!;
    const done = () => setReady(true);
    if (img.complete) img.decode().then(done, done); else { img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true }); }
  }, []);
  useFilms(root);

  const rise = (d: number) => ({ initial: { opacity: 0, y: 30 }, animate: ready ? { opacity: 1, y: 0 } : {}, transition: { duration: 1, ease: EASE, delay: d } });

  return (
    <main className="x-model" ref={root}>
      <section className="x-mhero" ref={hero} data-hero={slug} data-ready={ready ? '' : undefined} aria-labelledby="mh">
        <motion.div className="x-mhero-media" style={{ y, clipPath }}>
          <Img src={media(slug, 'webp')} alt="" w={1200} h={1500} priority />
          <ModelFilm slug={slug} />
        </motion.div>
        <motion.div className="x-mhero-copy x-wrap" style={{ y: textY, opacity: fade }}>
          <motion.h1 id="mh" className="x-mhero-name" style={{ scale: shrink }}>
            <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={ready ? { y: 0 } : {}} transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}>{m.name}</motion.span></span>
          </motion.h1>
          <motion.p className="x-mhero-desc" {...rise(0.3)}>{m.desc}</motion.p>
          {/* Hanzo's kicker and the index among the nine sit under the name, never over it */}
          <motion.p className="x-mindex" {...rise(0.35)}>{m.kicker && <b>{m.kicker} · </b>}<span>{String(i + 1).padStart(2, '0')}</span>{` / ${String(MODELS.length).padStart(2, '0')}`}</motion.p>
          <motion.p className="x-mtags static" {...rise(0.4)}>{m.tags.map((t) => <span key={t}>{t}</span>)}</motion.p>
        </motion.div>
        <motion.a
          href="/"
          className="x-mclose"
          aria-label="Close and return to all models"
          onClick={(e) => opener?.close(e, { key: slug, src: media(slug, 'webp') })}
          initial={{ opacity: 0, scale: 0.6 }} animate={ready ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
          whileHover={{ rotate: 90 }} whileTap={{ scale: 0.9 }}
        >
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </motion.a>
        <motion.span className="x-scrollcue" {...rise(0.7)} aria-hidden="true">Scroll</motion.span>
      </section>
      <div className="x-model-body">{children || <Ported html={html} />}</div>
      <a href={'/' + next.slug} className="x-next" data-card={next.slug} onClick={(e) => opener?.open(e, { el: e.currentTarget, src: media(next.slug, 'webp'), href: '/' + next.slug, key: next.slug })}>
        <Img src={media(next.slug, 'webp')} alt="" w={1200} h={1500} />
        <ModelFilm slug={next.slug} className="mb-next-film" />
        <span className="x-next-k">Next model</span>
        <span className="x-next-n">{next.name}</span>
        <span className="x-next-d">{next.desc}</span>
      </a>
    </main>
  );
}
