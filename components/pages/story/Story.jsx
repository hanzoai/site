'use client';
/* A customer story (/customers/<launch>, one template), told like a magazine feature on Hanzo's deck. The launch's own
   picture fills a black room that enters as a rounded card inside the gutters and opens to full width; the name cuts in
   at 84px, the moment of the first screen, and settles to the 52px rest as you leave. The lede reads at 21px beside the
   figures, which stand at 64px in Air weight on a hairline rule. Then each chapter of the campaign is one full screen,
   and the next chapter wipes up over the last like a sheet, bringing its own picture and words, numbered "02 / 06" in
   its own caption. The campaign's frames close on an asymmetric wall, and the page ends on Hanzo's closing links and the
   next launch, a card that opens into its page. Every word, figure and picture is Hanzo's. No UI hue (the deck's
   neutrals): colour comes only from the launch's pictures; each launch carries its own Sigil seed. When a picture cannot
   load, its frame shows Hanzo's caption on a silver plate. Nothing floats over the content.
   Motion is not only scroll: the room opens and the name cuts in on arrival, the Sigil drifts by itself and leans to the
   pointer, each figure's own characters rise into place (only Hanzo's figure is ever drawn, never an in-between
   number), a pressed figure travels to its sentence and marks it, the wall's frames wipe open on arrival. Deck motion
   tokens only (90/150/300/400/500 ms, ease-emphasis), no springs.
   V2: 8/10 on the deck: black room opening from a card (a graphite ledger of the launch's own figures holds the room when its picture cannot load; the contour stops under reduced motion), 84→52 name, 21px lede and 64px Air figures (never an in-between number), chapters as wiping 100svh scenes, frames wall, next-launch card; kit Img and Cta; nothing floating */
// Signature: the campaign as scene changes: each chapter a 100svh scene that wipes up over the last (scrubbed clip-path), its picture pushing in
// Beyond: where each figure comes from: press a headline figure, the page travels to the sentence that states it and marks it, else the case study PDF
// Persona: enterprise buyer or founder checking that Hanzo has delivered results for others (Buy journey)
// Goal: proof of a past launch, every headline figure traceable to its sentence or the PDF
// CTA: "The original case study (PDF)", Hanzo's label: data-cta customers.hero (thumb) and customers.close; "Every launch →" stays a text link
// Metric: contact_sales_submit (journey level)
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { useCalm } from '../../ui';
import { A, Cta, Img } from '../../kit';
import Sigil from '../../Sigil';
import { useArrival } from '../doorway';
import './Story.css';

const EM = [0.16, 1, 0.3, 1]; // the deck's ease-emphasis
const EASE_IO = [0.4, 0, 0.2, 1]; // the deck's ease-in-out: things that move and stay
const c01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
// with scripts off, everything that starts hidden or offset for its entrance is shown, and the chapters stand in a column
const NOJS = '.xst .x-line-in,.xst-h1-s,.xst-scene-t,.xst-scene-pic img,.xst-shot{transform:none!important;opacity:1!important}'
  + '.xst-cover{clip-path:none!important}.xst-scenes{height:auto!important}.xst-stage{position:relative!important;height:auto!important;overflow:visible!important}'
  + '.xst-scene{position:relative!important;inset:auto!important;display:block!important;clip-path:none!important;padding:clamp(72px,11vw,188px) 0!important}'
  + '.xst-scene-pic,.xst-tile .xst-pic{clip-path:none!important}';
const calmNow = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const travel = (y) => { if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.2 }); else window.scrollTo({ top: y, behavior: calmNow() ? 'auto' : 'smooth' }); };
const marked = (text, m) => {
  if (!m || !text.includes(m)) return text;
  const i = text.indexOf(m);
  return <>{text.slice(0, i)}<mark className="xst-mark">{m}</mark>{text.slice(i + m.length)}</>;
};

/* a picture (kit Img, its box reserved) over its own caption plate: if the file cannot load, the plate is what shows
   (quiet: the caption already sits under the frame, so the plate stays plain) */
const BOX = { hero: [1920, 1080], scene: [1200, 1500], tile: [1200, 1500], shot: [1600, 1000], next: [1600, 900] };
function Pic({ img, className = '', priority, style, n, box = 'tile', quiet, art, live = true }) {
  const [w, h] = BOX[box];
  const ref = useRef(null);
  const [bad, setBad] = useState(false);
  const calm = useCalm();
  // `art`: when the picture cannot load, the plate carries a slow contour seeded by the picture's own path (MASTER part
  // 10, media failure falls back to an aspect-ratio box with Sigil); it pauses off screen and stands still for reduced motion
  useEffect(() => {
    const i = art && ref.current && ref.current.querySelector('img');
    if (!i) return;
    const fail = () => setBad(true);
    if (i.complete && !i.naturalWidth) fail(); else i.addEventListener('error', fail, { once: true });
    return () => i.removeEventListener('error', fail);
  }, [art]);
  return (
    <span className={'xst-pic ' + className} data-plate ref={ref}>
      <span className="xst-plate" aria-hidden="true">{bad && <Sigil seed={img.src} className="xst-pic-sigil" still={calm || !live} />}{n && <b className="x-mono">{n}</b>}{!quiet && <span>{img.alt}</span>}</span>
      <motion.span className="xst-pic-in" style={style}><Img src={img.src} alt={img.alt} w={w} h={h} priority={priority} /></motion.span>
    </span>
  );
}

/* a figure exactly as Hanzo prints it: its own characters rise into place, one after another, when it arrives */
function Figure({ value }) {
  return (
    <span className="xst-fig-v" aria-label={value}>
      {[...value].map((c, i) => <span key={i} className="xst-ch" style={{ '--k': i }} aria-hidden="true">{c}</span>)}
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
  const calm = useCalm(); // reduced motion: the room is simply open and nothing follows the scroll
  const [ready, setReady] = useState(false);
  const [bare, setBare] = useState(false); // the launch's picture could not load: the contour and Hanzo's caption carry the room
  const { scrollYProgress: p } = useScroll({ target: box, offset: ['start start', 'end start'] });
  // the name is the moment at 84px, then settles to the 52px rest as the room is left behind
  const settle = useTransform(p, [0, 0.55], [1, 52 / 84]);
  const nums = doc.figures.map((f) => parseFloat(f.value.replace(/[^\d.]/g, ''))).filter(Number.isFinite);
  useEffect(() => {
    const el = box.current.querySelector('.xst-cover img');
    if (!el) return;
    const done = () => setReady(true);
    const fail = () => { setBare(true); done(); };
    if (el.complete) { if (!el.naturalWidth) fail(); else (el.decode ? el.decode().then(done, done) : done()); } else { el.addEventListener('load', done, { once: true }); el.addEventListener('error', fail, { once: true }); }
  }, []);
  return (
    <section ref={box} className="xst-hero" data-room="dark" data-hero={doc.slug} data-ready={ready ? '' : undefined} data-bare={bare || undefined} aria-labelledby="xst-h1">
      {/* the black room enters as a rounded card inside the gutters and opens to full width */}
      <motion.div className="xst-cover" data-morph-target initial={calm ? false : { clipPath: 'inset(0px 32px 0px 32px round 24px)' }} animate={{ clipPath: 'inset(0px 0px 0px 0px round 0px)' }} transition={{ duration: 0.8, ease: EASE_IO, delay: 0.1 }}>
        {doc.cover && <span className="xst-cover-in"><Pic img={doc.cover} priority box="hero" /></span>}
        <span className="xst-scrim" aria-hidden="true" />
        {/* still={calm}: the contour stops (one frame) the moment reduced motion is on, also when it is switched on later */}
        <Sigil seed={doc.route} data={nums} className="xst-sigil" still={calm} />
      </motion.div>
      <div className="xst-hero-in">
        <nav className="xst-crumb" aria-label="Breadcrumb">
          <ol>
            <li><A to={doc.back.href}>{doc.back.label}</A></li>
            <li aria-current="page">{doc.name}</li>
          </ol>
        </nav>
        <div className="xst-hero-t">
          <motion.h1 id="xst-h1" className="xst-h1" style={calm ? undefined : { scale: settle }}>
            <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 0.7, ease: EM, delay: 0.2 }}>{doc.name}</motion.span></span>
          </motion.h1>
          <p className="xst-meta x-mono"><span>{doc.year}</span><i aria-hidden="true" /><span>{doc.kind}</span></p>
          {ask && <Cta to={ask.href} id="customers.hero" size="lg" thumb className="xst-ask">{ask.label}</Cta>}
        </div>
        {bare && doc.figures.length > 0 && <Ledger figures={doc.figures} calm={calm} />}
      </div>
    </section>
  );
}

/* when the launch's picture cannot load, the room still holds a real object: the launch's own figures on a graphite
   plate (Hanzo's values and labels, exactly as the header prints them; aria-hidden, the figures section below is the
   readable copy). It wipes open once, then each figure's characters rise into place, never an in-between number. */
function Ledger({ figures, calm }) {
  const [first, ...rest] = figures;
  return (
    <motion.div className="xst-ledger" aria-hidden="true" data-in=""
      initial={calm ? false : { clipPath: 'inset(0% 0% 100% 0% round 20px)' }} animate={{ clipPath: 'inset(0% 0% 0% 0% round 20px)' }}
      transition={{ duration: 0.5, ease: EM, delay: 0.3 }}>
      <span className="xst-ledger-a"><Figure value={first.value} /><span>{first.label}</span></span>
      {rest.length > 0 && <span className="xst-ledger-r">{rest.map((f) => <span key={f.value}><b>{f.value}</b><span>{f.label}</span></span>)}</span>}
    </motion.div>
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
                <Figure value={f.value} /><span className="xst-fig-l" aria-hidden="true">{f.label}</span>
                <span className="xst-fig-w x-mono" aria-hidden="true"><i>↗</i>{doc.links.find((l) => l.href === f.from.pdf).label}</span>
              </A>
            ) : (
              <button type="button" className="xst-fig-b" aria-pressed={mark === f.value} onClick={() => onPress(f)} disabled={!f.from}>
                <Figure value={f.value} /><span className="xst-fig-l">{f.label}</span>
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
function Scene({ s, i, n, p, mark, calm, last, live }) {
  const t = (v) => v * (n - 1);
  const enter = (v) => (i ? c01((t(v) - (i - 0.8)) / 0.55) : 1);
  const leave = (v) => c01((t(v) - (i + 0.2)) / 0.55);
  const clip = useTransform(p, (v) => `inset(${((1 - enter(v)) * 100).toFixed(2)}% 0% 0% 0%)`);
  const words = useTransform(p, (v) => (1 - enter(v)) * 72 - leave(v) * 44);
  const fade = useTransform(p, (v) => 1 - leave(v) * 0.85);
  const push = useTransform(p, (v) => 1 + (1 - enter(v)) * 0.12 + leave(v) * 0.03);
  return (
    <motion.article className={'xst-scene' + (s.img ? '' : ' bare')} id={'xst-step-' + i} data-step={i} data-tone={i % 2 ? 'b' : 'a'} style={i && !calm ? { clipPath: clip } : undefined} aria-labelledby={'xst-st-' + i}>
      <div className="xst-g xst-scene-g">
        <motion.div className="xst-scene-t" style={calm ? undefined : { y: words, opacity: fade }}>
          <h3 id={'xst-st-' + i} className="xst-h3">{s.title}</h3>
          <p className="xst-t">{marked(s.text, mark)}</p>
          <p className="xst-n x-mono" aria-hidden="true">{s.n} / {last}</p>
        </motion.div>
        {s.img && <Pic img={s.img} className="xst-scene-pic" n={s.n} style={calm ? undefined : { scale: push }} box="scene" art live={live} />}
      </div>
    </motion.article>
  );
}

function Chapters({ how, mark, box }) {
  const n = how.steps.length;
  const { scrollYProgress: p } = useScroll({ target: box, offset: ['start start', 'end end'] });
  const calm = useCalm();
  const [at, setAt] = useState(0); // the chapter on stage: only its contour drifts (one mover in view)
  useMotionValueEvent(p, 'change', (v) => setAt(Math.max(0, Math.min(n - 1, Math.floor(v * (n - 1) + 0.45)))));
  const last = how.steps[n - 1].n;
  return (
    <div className="xst-scenes" ref={box} style={{ '--n': n }}>
      <div className="xst-stage">
        {how.steps.map((s, i) => <Scene key={s.n} s={s} i={i} n={n} p={p} mark={mark} calm={calm} last={last} live={i === at} />)}
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
            <Pic img={p} quiet art={i < 3} />
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
  // what has arrived: figures rise, frames wipe open, phone scenes open their picture (once each)
  useEffect(() => {
    const els = [...root.current.querySelectorAll('.xst-scene, .xst-tile, .xst-shot, .xst-fig')];
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
      <noscript><style>{NOJS}</style></noscript>
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
            <figure className="xst-shot"><Pic img={doc.report.img} box="shot" art /></figure>
          </div>
        </section>
      )}

      {doc.how && (
        <section className="xst-how" aria-labelledby="xst-how-h">
          <div className="xst-g xst-how-head">
            <h2 id="xst-how-h" className="xst-h2">{doc.how.h2}</h2>
            <p className="xst-cap x-mono">{doc.how.steps[0].n} – {doc.how.steps[doc.how.steps.length - 1].n}</p>
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
              ? <Cta key={l.href} to={l.href} id="customers.close" size="lg" className="xst-pdf">{l.label}</Cta>
              : <A key={l.href} to={l.href} className="xst-all">{l.label}</A>))}
          </div>
          {next && (
            <A to={next.href} className="xst-next" aria-label={next.name + ', ' + next.year + ' · ' + next.kind}>
              <span className="xst-next-pic" data-morph>{next.cover && <Pic img={next.cover} box="next" />}</span>
              <span className="xst-next-t">
                <span className="xst-next-n">{next.name}</span>
                <span className="xst-cap x-mono">{next.year} · {next.kind}</span>
                {next.figure && <span className="xst-next-f"><b>{next.figure.value}</b> {next.figure.label}</span>}
              </span>
              <span className="xst-next-go" aria-hidden="true"><svg viewBox="0 0 16 16" width="18" height="18"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            </A>
          )}
        </div>
      </section>
    </main>
  );
}
