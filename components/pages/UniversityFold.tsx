'use client';
/* The parts every Hanzo University page is made of: the first screen (trail, badge, h1, lede, asks, and beside them the
   steps card), a section with its head, a chip. The steps card is hanzo-inc/app's preview: a dark card over one of
   Hanzo's model films that walks the page's steps in turn (a course's weeks, the catalog's courses) and rests where a
   reader presses one. Every step and its words are in the page from the first frame, stacked in one cell with the open
   one seen, so the card never moves the page; with no JS or no motion the first step is open. */
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { Lines } from '../ui';
import { A, SecHead } from '../kit';
import ModelFilm, { FilmPause, usePaused } from '../v2/ModelFilm';
import './UniversityFold.css';

const BEAT = 2600; // how long a step stays under way before the next begins
const pad = (n: number) => String(n).padStart(2, '0');

export function Chip({ children, tone, className = '' }: { children?: ReactNode; tone?: string; className?: string }) {
  return <span className={'xuv-chip' + (tone ? ' ' + tone : '') + ' ' + className}>{children}</span>;
}

export interface Step {
  title: string;
  body?: string;
}

export function Steps({ title, steps, film }: { title: string; steps: Step[]; film: string }) {
  const box = useRef<HTMLDivElement>(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const stop = usePaused();
  const [{ at, held }, set] = useState({ at: 0, held: false });
  const n = steps.length;
  useEffect(() => {
    if (calm || stop || !seen || held || n < 2) return;
    const t = setInterval(() => set((s) => ({ ...s, at: (s.at + 1) % n })), BEAT);
    return () => clearInterval(t);
  }, [calm, stop, seen, held, n]);
  return (
    <div ref={box} className="xuv-steps" data-room="dark">
      <ModelFilm slug={film} play={seen} className="xuv-film" />
      <div className="xuv-scrim" aria-hidden="true" />
      <div className="xuv-steps-in">
        <div className="xuv-steps-top">
          <span className="xuv-steps-name">{title}</span>
          <span className="xuv-steps-ctl">
            {n > 1 && <span className="xuv-count" aria-hidden="true">{pad(at + 1)} / {pad(n)}</span>}
            <FilmPause className="dark" />
          </span>
        </div>
        <div className="xuv-stage">
          {steps.map((s, i) => (
            <div key={s.title} className="xuv-step" data-on={i === at ? '' : undefined} aria-hidden={i !== at}>
              <span className="xuv-step-t">{s.title}</span>
              {s.body && <p>{s.body}</p>}
            </div>
          ))}
        </div>
        <ol className="xuv-dots">
          {steps.map((s, i) => (
            <li key={s.title}>
              <button type="button" aria-expanded={i === at} onClick={() => set((p) => (p.held && p.at === i ? { at: i, held: false } : { at: i, held: true }))}>{s.title}</button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* The first screen. trail: [{ label, to? }]; actions: the asks (links and buttons) in order. */
export function Fold({ trail, badge, title, lede, actions, preview }: { trail: { label: string; to?: string }[]; badge: ReactNode; title: string; lede: ReactNode; actions: ReactNode; preview?: ReactNode }) {
  return (
    <section className="xuv-fold">
      <div className={'xuv-wrap xuv-fold-grid' + (preview ? ' has-side' : '')}>
        <div className="xuv-fold-copy">
          <nav className="xuv-crumbs" aria-label="Breadcrumb">
            {trail.map((t, i) => (
              <span key={t.label} className="xuv-crumb">
                {i > 0 && <span className="xuv-sep" aria-hidden="true">/</span>}
                {t.to ? <A to={t.to}>{t.label}</A> : <span aria-current="page">{t.label}</span>}
              </span>
            ))}
          </nav>
          <p className="xuv-badge"><i aria-hidden="true" /><span>{badge}</span></p>
          <Lines as="h1" play="load" lines={[title]} className="xuv-h1" />
          <p className="xuv-lede">{lede}</p>
          <div className="xuv-acts">{actions}</div>
        </div>
        {preview && <div className="xuv-fold-side">{preview}</div>}
      </div>
    </section>
  );
}

/* A section with its head: kicker, title, lede. tone="sunk" sets it on the recessed ground. */
export function Band({ id, kicker, title, lede, tone, narrow, center, children }: { id?: string; kicker?: string; title?: string; lede?: string; tone?: string; narrow?: boolean; center?: boolean; children?: ReactNode }) {
  return (
    <section id={id} className={'xuv-sec' + (tone ? ' ' + tone : '')}>
      <div className={'xuv-wrap' + (narrow ? ' narrow' : '')}>
        {title && <SecHead kicker={kicker} title={title} lede={lede} center={center} />}
        {children}
      </div>
    </section>
  );
}
