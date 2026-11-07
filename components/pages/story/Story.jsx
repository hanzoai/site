'use client';
/* A customer story (/customers/<launch>, one template): a reading room for a campaign. The launch's own photo fills the
   first screen with its Sigil drawn over it in light; the headline figures sit under it; the chapters read at 66ch.
   All wording, figures and pictures are Hanzo's.
   Signature: the campaign plays back. Chapters scroll on the left while a stage on the right holds that chapter's own
   picture, slowly pushing in, and dissolves to the next; a reel counter turns 01 / 06 as you read; the gallery
   spotlights one frame at a time. On a phone every chapter carries its picture inline.
   Beyond: where each figure comes from. Press a headline figure and the page goes to the chapter that states it and
   marks the words; a figure the page never states leads to Hanzo's original case study (PDF) instead. */
// Signature: the campaign plays back: a sticky stage holds each chapter's own picture, pushing in, dissolving to the next, a reel counter turning
// Beyond: where each figure comes from: press a headline figure, the page goes to the sentence that states it and marks it, else to the case study PDF
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useSpring } from 'motion/react';
import { EASE } from '../../ui';
import { A, Flap } from '../../kit';
import Sigil from '../../Sigil';
import { useArrival } from '../doorway';
import './Story.css';

const to = (el) => { if (!el) return; if (window.__lenis) window.__lenis.scrollTo(el, { offset: -140 }); else el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' }); };
const marked = (text, m) => {
  if (!m || !text.includes(m)) return text;
  const i = text.indexOf(m);
  return <>{text.slice(0, i)}<mark className="xst-mark">{m}</mark>{text.slice(i + m.length)}</>;
};

function Figures({ doc, mark, setMark }) {
  const where = (f) => (f.from.step !== undefined ? doc.how.steps[f.from.step].n + ' · ' + doc.how.steps[f.from.step].title : f.from.report ? doc.report.h2 : null);
  const press = (f) => {
    setMark(f.value);
    to(document.getElementById(f.from.step !== undefined ? 'xst-step-' + f.from.step : f.from.report ? 'xst-report' : 'xst-lede'));
  };
  return (
    <dl className="xst-figs">
      {doc.figures.map((f, i) => (
        <motion.div key={f.value} className="xst-fig" initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8, ease: EASE, delay: i * 0.06 }}>
          <dt className="x-sr">{f.label}</dt>
          <dd>
            {f.from && f.from.pdf ? (
              <A to={f.from.pdf} className="xst-fig-b" aria-label={f.value + ' ' + f.label}>
                <Flap value={f.value} className="xst-fig-v" /><span className="xst-fig-l" aria-hidden="true">{f.label}</span>
                <span className="xst-fig-w x-mono" aria-hidden="true">{doc.links.find((l) => l.href === f.from.pdf).label} ↗</span>
              </A>
            ) : (
              <button type="button" className="xst-fig-b" aria-pressed={mark === f.value} onClick={() => press(f)} disabled={!f.from}>
                <Flap value={f.value} className="xst-fig-v" /><span className="xst-fig-l">{f.label}</span>
                {where(f) && <span className="xst-fig-w x-mono" aria-hidden="true">↓ {where(f)}</span>}
              </button>
            )}
          </dd>
        </motion.div>
      ))}
    </dl>
  );
}

function Chapters({ how, mark }) {
  const list = useRef(null);
  const [at, setAt] = useState(0);
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 65%', 'end 55%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });
  useEffect(() => {
    const els = [...list.current.querySelectorAll('[data-step]')];
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setAt(+e.target.dataset.step); }), { rootMargin: '-42% 0px -48% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  // the stage keeps the last picture until a chapter brings its own
  let shown = -1;
  for (let i = 0; i <= at; i++) if (how.steps[i].img) shown = i;
  if (shown < 0) shown = how.steps.findIndex((s) => s.img);
  const last = how.steps[how.steps.length - 1].n;
  return (
    <div className="xst-play">
      <ol className="xst-steps" ref={list}>
        <span className="xst-rail" aria-hidden="true"><motion.i style={{ scaleY: fill }} /></span>
        {how.steps.map((s, i) => (
          <li key={s.n} id={'xst-step-' + i} data-step={i} data-on={i === at || undefined}>
            <p className="xst-n x-mono">{s.n}</p>
            <h3 className="xst-h3">{s.title}</h3>
            <p className="xst-t">{marked(s.text, mark)}</p>
            {s.img && <img className="xst-inline" src={s.img.src} alt={s.img.alt} loading="lazy" decoding="async" />}
          </li>
        ))}
      </ol>
      <div className="xst-stage" aria-hidden="true">
        <div className="xst-frame">
          {how.steps.map((s, i) => s.img && <img key={s.img.src} src={s.img.src} alt="" loading="lazy" decoding="async" data-on={i === shown || undefined} />)}
          <span className="xst-reel x-mono"><b key={at}>{how.steps[at].n}</b> / {last}</span>
          <span className="xst-cap">{how.steps[shown] && how.steps[shown].img ? how.steps[shown].img.alt : ''}</span>
        </div>
      </div>
    </div>
  );
}

function Gallery({ g }) {
  const box = useRef(null);
  const live = useInView(box, { amount: 0.4 });
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState(false);
  useEffect(() => {
    if (!live || held || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setAt((a) => (a + 1) % g.imgs.length), 2800);
    return () => clearInterval(id);
  }, [live, held, g.imgs.length]);
  return (
    <ul className="xst-gal" ref={box} data-swipe-own onPointerLeave={() => setHeld(false)} aria-label={g.h2}>
      {g.imgs.map((p, i) => (
        <li key={p.src} data-on={i === at || undefined}>
          <button type="button" aria-pressed={i === at} onClick={() => { setAt(i); setHeld(true); }} onFocus={() => { setAt(i); setHeld(true); }}>
            <img src={p.src} alt={p.alt} loading="lazy" decoding="async" />
            <span className="xst-gal-c" aria-hidden="true">{p.alt}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function Story({ doc }) {
  useArrival();
  const [ready, setReady] = useState(false);
  const [mark, setMark] = useState(null);
  const nums = doc.figures.map((f) => parseFloat(f.value.replace(/[^\d.]/g, ''))).filter(Number.isFinite);
  const cover = (el) => { if (!el || ready) return; const done = () => setReady(true); if (el.complete) (el.decode ? el.decode().then(done, done) : done()); else el.onload = done; };
  return (
    <main className="xst">
      <section className="xst-hero" data-room="dark" data-hero={doc.slug} data-ready={ready ? '' : undefined} aria-labelledby="xst-h1">
        <div className="xst-cover" data-morph-target>
          {doc.cover && <motion.img ref={cover} src={doc.cover.src} alt={doc.cover.alt} fetchPriority="high" initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 2, ease: EASE }} />}
          <span className="xst-scrim" aria-hidden="true" />
          <Sigil seed={doc.route} data={nums} className="xst-sigil" />
        </div>
        <div className="x-wrap xst-hero-t">
          <A to={doc.back.href} className="xst-back">{doc.back.label}</A>
          <p className="xst-meta x-mono"><span>{doc.year}</span><span aria-hidden="true">·</span><span>{doc.kind}</span></p>
          <h1 id="xst-h1" className="xst-h1"><span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}>{doc.name}</motion.span></span></h1>
        </div>
      </section>

      <section className="xst-intro">
        <div className="x-wrap xst-intro-g">
          <p className="xst-lede" id="xst-lede">{marked(doc.lede, mark)}</p>
          <Figures doc={doc} mark={mark} setMark={setMark} />
        </div>
      </section>

      {doc.report && (
        <section className="xst-report" id="xst-report">
          <div className="x-wrap xst-report-g">
            <div className="xst-report-t">
              <h2 className="xst-h2">{doc.report.h2}</h2>
              <p className="xst-t">{doc.report.text}</p>
            </div>
            <motion.figure className="xst-shot" initial={{ opacity: 0, y: 48, rotateX: 12 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1.1, ease: EASE }}>
              <img src={doc.report.img.src} alt={doc.report.img.alt} loading="lazy" decoding="async" />
            </motion.figure>
          </div>
        </section>
      )}

      {doc.how && (
        <section className="xst-how">
          <div className="x-wrap">
            <h2 className="xst-h2">{doc.how.h2}</h2>
            <Chapters how={doc.how} mark={mark} />
          </div>
        </section>
      )}

      {doc.gallery && doc.gallery.imgs.length > 0 && (
        <section className="xst-more">
          <div className="x-wrap"><h2 className="xst-h2">{doc.gallery.h2}</h2></div>
          <Gallery g={doc.gallery} />
        </section>
      )}

      <section className="xst-end">
        <div className="x-wrap xst-end-g">
          {doc.links.map((l, i) => (i === 0
            ? <A key={l.href} to={l.href} className="x-btn solid" data-thumb="">{l.label}</A>
            : <A key={l.href} to={l.href} className="xst-all">{l.label}</A>))}
        </div>
      </section>
    </main>
  );
}
