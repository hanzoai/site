'use client';
/* A customer story (/customers/<case>, one template). It opens from its card on /customers (the cover lifts into this
   hero), and its first screen is the launch's own cover and its own four figures.
   Signature: the story scrubs. Its steps scroll past on the left while the picture for the step you are reading holds
   still on the right and crossfades to the next; a line fills as you go.
   Beyond: every figure, gathered. Each number the story states sits in one row of chips; press one and the page goes
   to the step that says it and marks it. Nothing is added: the chips are the story's own figures. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { EASE } from '../../ui';
import { A, Flap } from '../../kit';
import Sigil from '../../Sigil';
import { useArrival } from '../doorway';
import './customers.css';

const FIG = /(?:[$€]\s?[\d.,]+\s?(?:[KMB]\+?|ETH)?|\b\d{1,3}(?:,\d{3})+\+?|\b\d+(?:\.\d+)?%|\b\d+(?:\.\d+)?[KM]\+?(?=\s|$|[.,;:])|\b\d+:\d+)/g;

export default function CaseStudy({ doc }) {
  useArrival();
  const [ready, setReady] = useState(false);
  const [at, setAt] = useState(0);
  const [mark, setMark] = useState(null);
  const steps = doc.how ? doc.how.steps : [];
  const list = useRef(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 60%', 'end 60%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });
  useEffect(() => {
    if (!list.current) return;
    const els = [...list.current.querySelectorAll('[data-step]')];
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setAt(+e.target.dataset.step); }), { rootMargin: '-45% 0px -45% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const figs = useMemo(() => steps.flatMap((s, i) => [...new Set(s.text.match(FIG) || [])].map((f) => ({ f: f.trim(), i }))), [steps]);
  const go = (f) => {
    setMark(f.f);
    const el = list.current && list.current.querySelector(`[data-step="${f.i}"]`);
    if (el) (window.__lenis ? window.__lenis.scrollTo(el, { offset: -140 }) : el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  };
  const hi = (t) => {
    if (!mark || !t.includes(mark)) return t;
    const [a, ...b] = t.split(mark);
    return <>{a}<mark>{mark}</mark>{b.join(mark)}</>;
  };
  const nums = doc.stats.map(([v]) => parseFloat(v.replace(/[^\d.]/g, ''))).filter(Number.isFinite);
  return (
    <main className="xcs">
      <section className="xcs-hero" data-hero={doc.slug} data-ready={ready ? '' : undefined} aria-labelledby="xcs-h1">
        {doc.cover && (
          <div className="xcs-cover">
            <motion.img src={doc.cover.src} alt={doc.cover.alt} initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 1.8, ease: EASE }}
              ref={(el) => { if (el && !ready) { if (el.complete) el.decode().then(() => setReady(true), () => setReady(true)); else el.onload = () => setReady(true); } }} />
            <span className="xcs-scrim" aria-hidden="true" />
          </div>
        )}
        <div className="x-wrap xcs-hero-t">
          {doc.back && <A to={doc.back.href} className="xcs-back">{doc.back.label}</A>}
          <p className="xcs-meta x-mono"><span>{doc.year}</span>{doc.kind && <> · <span>{doc.kind}</span></>}</p>
          <h1 id="xcs-h1" className="xcs-h1" data-morph-target>
            <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}>{doc.name}</motion.span></span>
          </h1>
        </div>
      </section>

      <section className="xcs-intro">
        <Sigil seed={doc.route} data={nums} className="xcs-sigil" />
        <div className="x-wrap xcs-intro-g">
          <p className="xcs-lede">{doc.lede}</p>
          <dl className="xcs-stats">
            {doc.stats.map(([v, l]) => <div key={l}><dd><Flap value={v} /></dd><dt>{l}</dt></div>)}
          </dl>
        </div>
      </section>

      {doc.report && (
        <section className="x-sec xcs-report">
          <div className="x-wrap xcs-report-g">
            <div><h2>{doc.report.h2}</h2><p>{doc.report.text}</p></div>
            {doc.report.img && <motion.figure className="xcs-shot" initial={{ opacity: 0, y: 40, rotateX: 10 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1, ease: EASE }}><img src={doc.report.img.src} alt={doc.report.img.alt} loading="lazy" /></motion.figure>}
          </div>
        </section>
      )}

      {doc.how && (
        <section className="x-sec xcs-how" id="how">
          <div className="x-wrap">
            <h2 className="xcs-h2">{doc.how.h2}</h2>
            {figs.length > 0 && (
              <div className="xcs-figs" role="group" aria-label="Every figure in the story">
                {figs.map((f, k) => <button key={f.f + k} type="button" aria-pressed={mark === f.f} onClick={() => go(f)}><b className="x-mono">{f.f}</b><i className="x-mono">{steps[f.i].n}</i></button>)}
              </div>
            )}
            <div className="xcs-story">
              <ol className="xcs-steps" ref={list}>
                <span className="xcs-rail" aria-hidden="true"><motion.i style={{ scaleY: fill }} /></span>
                {steps.map((s, i) => (
                  <li key={s.n} data-step={i} className={i === at ? 'on' : ''}>
                    <p className="xcs-n x-mono">{s.n}</p>
                    <h3>{s.title}</h3>
                    <p className="xcs-t">{hi(s.text)}</p>
                    {s.img && <img className="xcs-inline" src={s.img.src} alt={s.img.alt} loading="lazy" />}
                  </li>
                ))}
              </ol>
              <div className="xcs-stage" aria-hidden="true">
                <div className="xcs-frame">
                  {steps.map((s, i) => s.img && <img key={s.img.src} src={s.img.src} alt="" className={i === at ? 'on' : ''} loading="lazy" />)}
                  <span className="xcs-frame-n x-mono">{steps[at] ? steps[at].n : ''} / {steps.length ? steps[steps.length - 1].n : ''}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {doc.gallery && doc.gallery.imgs && doc.gallery.imgs.length > 0 && (
        <section className="x-sec xcs-gal">
          <div className="x-wrap"><h2 className="xcs-h2">{doc.gallery.h2}</h2></div>
          <ul className="xcs-rail-x" data-swipe-own data-drag>
            {doc.gallery.imgs.map((g, i) => (
              <motion.li key={g.src} initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}>
                <img src={g.src} alt={g.alt} loading="lazy" />
              </motion.li>
            ))}
          </ul>
        </section>
      )}

      {doc.links.length > 0 && (
        <section className="xcs-end">
          <div className="x-wrap xcs-end-g">
            {doc.links.map((l, i) => <A key={l.href} to={l.href} className={i ? 'x-arrow' : 'x-btn solid'} {...(i ? {} : { 'data-thumb': '' })}>{l.label}</A>)}
          </div>
        </section>
      )}
    </main>
  );
}
