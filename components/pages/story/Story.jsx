'use client';
/* A customer story (/customers/<launch>, one template), told like a magazine feature. The launch's own picture fills a
   dark first screen and settles into a framed plate as you leave it; the lede reads as one large statement; the
   headline figures stand huge on a hairline rule; then each chapter of the campaign is one full screen, and the next
   chapter wipes up over the last like a sheet, bringing its own picture, its own tint and its own words, while a reel
   counts 01 / 06. The gallery is an asymmetric wall of the campaign's frames, and the page ends on the next launch,
   a card that opens into its page. Every word, figure and picture is Hanzo's. The UI has no hue of its own (greys,
   silver, ink): colour comes only from the launch's own pictures; each launch carries its own Sigil seed. When a
   picture cannot load, its frame shows Hanzo's own caption on a silver plate instead. One solid ask, Hanzo's
   "The original case study (PDF)", in the stage and at the close; everything else is a text link.
   Signature: the campaign as scene changes. Chapters are 100svh scenes; each new one wipes up over the last with a
   scroll-scrubbed clip-path, its picture pushing in and the outgoing words lifting away (phone: each scene's picture
   wipes open as it arrives).
   Beyond: where each figure comes from. Press a headline figure and the page travels to the chapter that states it and
   marks the words; a figure the page never states opens Hanzo's original case study (PDF) instead.
   Motion is not only scroll: the name cuts in, the Sigil drifts by itself and leans to the pointer, the figures spin
   to their value, a pressed figure travels and marks its words, tiles wipe open on arrival and answer the hover.
   V2: 8.5/10 rebuilt as an editorial feature: stage hero with one ask, statement lede, huge figures on a rule, chapters as wiping 100svh scenes, asymmetric media wall, next-launch card; no UI hues */
// Signature: the campaign as scene changes: each chapter a 100svh scene that wipes up over the last (scrubbed clip-path), picture pushing in, reel counting
// Beyond: where each figure comes from: press a headline figure, the page travels to the sentence that states it and marks it, else the case study PDF
// Persona: enterprise buyer or founder checking that Hanzo has delivered results for others (Buy journey)
// Goal: proof of a past launch, every headline figure traceable to its sentence or the PDF; metric contact_sales_submit (journey level, no event wired yet)
// CTA: "The original case study (PDF)", Hanzo's label, the one solid ask in the stage and at the close; "Every launch →" stays a text link
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { EASE } from '../../ui';
import { A, Flap } from '../../kit';
import Sigil from '../../Sigil';
import { useArrival } from '../doorway';
import './Story.css';

const c01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const travel = (y) => { if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.4 }); else window.scrollTo({ top: y, behavior: calm() ? 'auto' : 'smooth' }); };
const marked = (text, m) => {
  if (!m || !text.includes(m)) return text;
  const i = text.indexOf(m);
  return <>{text.slice(0, i)}<mark className="xst-mark">{m}</mark>{text.slice(i + m.length)}</>;
};

/* a picture over its own caption plate: if the file cannot load, the plate (Hanzo's caption on the accent) is what shows */
function Pic({ img, className = '', eager, style, n }) {
  return (
    <span className={'xst-pic ' + className} data-plate>
      <span className="xst-plate" aria-hidden="true">{n && <b className="x-mono">{n}</b>}<span>{img.alt}</span></span>
      <motion.img src={img.src} alt={img.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" style={style} {...(eager ? { fetchPriority: 'high' } : {})} />
    </span>
  );
}

/* hide pictures that fail (the plate under them carries the caption); checks ones that failed before hydration too */
function useMissing(root) {
  useEffect(() => {
    const imgs = [...root.current.querySelectorAll('img')];
    const miss = (i) => i.setAttribute('data-missing', '');
    imgs.forEach((i) => { if (i.complete && !i.naturalWidth) miss(i); else i.addEventListener('error', () => miss(i), { once: true }); });
  }, [root]);
}

function Hero({ doc, ask }) {
  const box = useRef(null);
  const [ready, setReady] = useState(false);
  const { scrollYProgress: p } = useScroll({ target: box, offset: ['start start', 'end start'] });
  // the stage settles: the full-bleed picture insets into a framed plate with 28px corners, the name drifts up slower
  const frame = useTransform(p, [0, 0.9], ['inset(0% 0% 0% 0% round 0px)', 'inset(7% 4% 12% 4% round 28px)']);
  const sink = useTransform(p, [0, 1], [1, 0.92]);
  const rise = useTransform(p, [0, 1], [0, -120]);
  const nums = doc.figures.map((f) => parseFloat(f.value.replace(/[^\d.]/g, ''))).filter(Number.isFinite);
  useEffect(() => {
    const el = box.current.querySelector('.xst-cover img');
    if (!el) return;
    const done = () => setReady(true);
    if (el.complete) (el.decode ? el.decode().then(done, done) : done()); else { el.addEventListener('load', done, { once: true }); el.addEventListener('error', done, { once: true }); }
  }, []);
  return (
    <section ref={box} className="xst-hero" data-room="dark" data-hero={doc.slug} data-ready={ready ? '' : undefined} aria-labelledby="xst-h1">
      <motion.div className="xst-cover" data-morph-target style={{ clipPath: frame, scale: sink }}>
        {doc.cover && (
          <motion.span className="xst-cover-in" initial={{ scale: 1.14 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease: EASE }}>
            <Pic img={doc.cover} eager />
          </motion.span>
        )}
        <span className="xst-scrim" aria-hidden="true" />
        <Sigil seed={doc.route} data={nums} className="xst-sigil" />
      </motion.div>
      <A to={doc.back.href} className="xst-back">{doc.back.label}</A>
      <motion.div className="xst-hero-t" style={{ y: rise }}>
        <h1 id="xst-h1" className="xst-h1">
          <span className="x-line"><motion.span className="x-line-in" initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1.15, ease: EASE, delay: 0.2 }}>{doc.name}</motion.span></span>
        </h1>
        <div className="xst-hero-b">
          <p className="xst-kick x-mono"><span>{doc.year}</span><i aria-hidden="true" /><span>{doc.kind}</span></p>
          {ask && <A to={ask.href} className="x-btn solid xst-ask">{ask.label}</A>}
        </div>
      </motion.div>
    </section>
  );
}

function Figures({ doc, mark, onPress }) {
  const where = (f) => (f.from.step !== undefined ? doc.how.steps[f.from.step].n + ' · ' + doc.how.steps[f.from.step].title : f.from.report ? doc.report.h2 : null);
  return (
    <dl className="xst-figs">
      {doc.figures.map((f) => (
        <div key={f.value} className="xst-fig">
          <dt className="x-sr">{f.label}</dt>
          <dd>
            {f.from && f.from.pdf ? (
              <A to={f.from.pdf} className="xst-fig-b" aria-label={f.value + ' ' + f.label}>
                <Flap value={f.value} className="xst-fig-v" /><span className="xst-fig-l" aria-hidden="true">{f.label}</span>
                <span className="xst-fig-w x-mono" aria-hidden="true"><i>↗</i>{doc.links.find((l) => l.href === f.from.pdf).label}</span>
              </A>
            ) : (
              <button type="button" className="xst-fig-b" aria-pressed={mark === f.value} onClick={() => onPress(f)} disabled={!f.from}>
                <Flap value={f.value} className="xst-fig-v" /><span className="xst-fig-l">{f.label}</span>
                {where(f) && <span className="xst-fig-w x-mono" aria-hidden="true"><i>↓</i>{where(f)}</span>}
              </button>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* one chapter: a full scene that wipes up over the one before it, then lifts its words away as the next arrives */
function Scene({ s, i, n, p, mark }) {
  const t = (v) => v * (n - 1);
  const enter = (v) => (i ? c01((t(v) - (i - 0.8)) / 0.55) : 1);
  const leave = (v) => c01((t(v) - (i + 0.2)) / 0.55);
  const clip = useTransform(p, (v) => `inset(${((1 - enter(v)) * 100).toFixed(2)}% 0% 0% 0%)`);
  const words = useTransform(p, (v) => (1 - enter(v)) * 90 - leave(v) * 70);
  const fade = useTransform(p, (v) => 1 - leave(v) * 0.85);
  const push = useTransform(p, (v) => 1 + (1 - enter(v)) * 0.16 + leave(v) * 0.04);
  return (
    <motion.article className={'xst-scene' + (s.img ? '' : ' bare')} id={'xst-step-' + i} data-step={i} data-tone={i % 2 ? 'b' : 'a'} style={i ? { clipPath: clip } : undefined} aria-labelledby={'xst-st-' + i}>
      <div className="xst-g xst-scene-g">
        <motion.div className="xst-scene-t" style={{ y: words, opacity: fade }}>
          <h3 id={'xst-st-' + i} className="xst-h3">{s.title}</h3>
          <p className="xst-t">{marked(s.text, mark)}</p>
        </motion.div>
        {s.img && <Pic img={s.img} className="xst-scene-pic" n={s.n} style={{ scale: push }} />}
      </div>
    </motion.article>
  );
}

function Chapters({ how, mark, box }) {
  const n = how.steps.length;
  const [at, setAt] = useState(0);
  const { scrollYProgress: p } = useScroll({ target: box, offset: ['start start', 'end end'] });
  useMotionValueEvent(p, 'change', (v) => { const k = Math.max(0, Math.min(n - 1, Math.floor(v * (n - 1) + 0.45))); setAt(k); });
  const last = how.steps[n - 1].n;
  return (
    <div className="xst-scenes" ref={box} style={{ '--n': n }}>
      <div className="xst-stage">
        {how.steps.map((s, i) => <Scene key={s.n} s={s} i={i} n={n} p={p} mark={mark} />)}
        <div className="xst-reel x-mono" aria-hidden="true">
          <span className="xst-reel-n"><b key={at}>{how.steps[at].n}</b> / {last}</span>
          <span className="xst-reel-bar">{how.steps.map((s, i) => <i key={s.n} data-on={i <= at || undefined} />)}</span>
        </div>
      </div>
    </div>
  );
}

function Wall({ g }) {
  return (
    <ul className="xst-wall" data-count={g.imgs.length} aria-label={g.h2}>
      {g.imgs.map((p, i) => (
        <li key={p.src} className="xst-tile" style={{ '--i': i }}>
          <figure>
            <Pic img={p} />
            <figcaption>{p.alt}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

export default function Story({ doc, next }) {
  useArrival();
  const root = useRef(null);
  const scenes = useRef(null);
  const [mark, setMark] = useState(null);
  const ask = doc.links[0]; // Hanzo's own first action on the page: the original case study
  useMissing(root);
  // scenes and wall tiles that have arrived (phones and the media wall wipe open once, on arrival)
  useEffect(() => {
    const els = [...root.current.querySelectorAll('.xst-scene, .xst-tile, .xst-shot')];
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.setAttribute('data-in', ''); io.unobserve(e.target); } }), { rootMargin: '0px 0px -18% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const press = (f) => {
    setMark(f.value);
    if (f.from.step !== undefined) {
      const sec = scenes.current;
      const pinned = getComputedStyle(sec).getPropertyValue('--pinned').trim() === '1';
      const n = doc.how.steps.length;
      const el = document.getElementById('xst-step-' + f.from.step);
      if (pinned) travel(sec.getBoundingClientRect().top + scrollY + (f.from.step / Math.max(1, n - 1)) * (sec.offsetHeight - innerHeight) + 2);
      else travel(el.getBoundingClientRect().top + scrollY - 96);
    } else {
      const el = document.getElementById(f.from.report ? 'xst-report' : 'xst-lede');
      travel(el.getBoundingClientRect().top + scrollY - innerHeight * 0.25);
    }
  };
  return (
    <main className="xst" ref={root}>
      <Hero doc={doc} ask={ask} />

      <section className="xst-intro" aria-label={doc.name}>
        <div className="xst-g">
          <p className="xst-lede" id="xst-lede">{marked(doc.lede, mark)}</p>
          <Figures doc={doc} mark={mark} onPress={press} />
        </div>
      </section>

      {doc.report && (
        <section className="xst-report" id="xst-report" aria-labelledby="xst-rep-h">
          <div className="xst-g">
            <div className="xst-report-t">
              <h2 id="xst-rep-h" className="xst-h2">{doc.report.h2}</h2>
              <p className="xst-t">{marked(doc.report.text, mark)}</p>
            </div>
            <figure className="xst-shot"><Pic img={doc.report.img} /></figure>
          </div>
        </section>
      )}

      {doc.how && (
        <section className="xst-how" aria-labelledby="xst-how-h">
          <div className="xst-g xst-how-head">
            <h2 id="xst-how-h" className="xst-h2">{doc.how.h2}</h2>
            <p className="xst-kicker x-mono">{doc.how.steps[0].n} – {doc.how.steps[doc.how.steps.length - 1].n}</p>
          </div>
          <Chapters how={doc.how} mark={mark} box={scenes} />
        </section>
      )}

      {doc.gallery && doc.gallery.imgs.length > 0 && (
        <section className="xst-more" aria-labelledby="xst-more-h">
          <div className="xst-g"><h2 id="xst-more-h" className="xst-h2">{doc.gallery.h2}</h2></div>
          <div className="xst-g"><Wall g={doc.gallery} /></div>
        </section>
      )}

      <section className="xst-end" aria-label={doc.links.map((l) => l.label).join(', ')}>
        <div className="xst-g xst-end-g">
          <div className="xst-end-a">
            {doc.links.map((l, i) => (i === 0
              ? <A key={l.href} to={l.href} className="x-btn solid xst-pdf" data-thumb="">{l.label}</A>
              : <A key={l.href} to={l.href} className="xst-all">{l.label}</A>))}
          </div>
          {next && (
            <A to={next.href} className="xst-next" aria-label={next.name + ', ' + next.year + ' · ' + next.kind}>
              <span className="xst-next-pic" data-morph>{next.cover && <Pic img={next.cover} />}</span>
              <span className="xst-next-t">
                <span className="xst-next-n">{next.name}</span>
                <span className="xst-kicker x-mono">{next.year} · {next.kind}</span>
                {next.figure && <span className="xst-next-f"><b>{next.figure.value}</b> {next.figure.label}</span>}
              </span>
              <span className="xst-next-go" aria-hidden="true"><svg viewBox="0 0 16 16" width="18" height="18"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            </A>
          )}
        </div>
      </section>
    </main>
  );
}
