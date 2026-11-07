'use client';
/* History, v4 (Story archetype, editorial; motion map, 7 Nov). Ink, greys and silvers only (JAMES.md 7); colour comes
   from Hanzo's own media.
   First screen: "Sovereign intelligence since 2014." at display size with the lede and one ask under it; beside it, the
   object: a giant year that runs from 2014 to 2026 by itself while the four eras' bars fill in turn.
   Second screen, the Signature (word-light): Hanzo's own statement of the history ("Built with hundreds of venture-funded
   startups ...") set large, lighting word by word as it is read (scroll, wheel, keys or touch; a press on a word lights
   it up to there). Under it the thirteen years as plain, quick rows (no pinned scene): each year's figure, plate, story,
   posts and the rest of its story one press away; the rail of years above them jumps to any year and marks the one in view.
   Then the press clippings (a rail you throw sideways), "Your year", the principles and the Hanzo FDE close.
   Entrances (history/enter.css, page-local): domino, cover-slide, page-curl, explode-gather, split-merge.
   Beyond: "Your year": type the year you started and the card cuts to what Hanzo was building then, with its posts.
   Every word, figure and link is Hanzo's (content/live/history.json). */
// Persona: a buyer or investor checking Hanzo's record (arrives from /about, the footer or search)
// Goal: see twelve years of shipped work, year by year, and trust it
// CTA: Explore Our History (#timeline) in the hero; Talk to Hanzo FDE in the sticky ask bar and the closing Band
// Metric: contact_sales_submit via the Band (data-cta="history.*")
// Signature: word-light: Hanzo's statement of its history lights word by word as it is read (second screen, over the years)
// Entrances: domino (the years and their rail), cover-slide (track record), page-curl (your year), explode-gather (the Zen of Hanzo principles), split-merge (Hanzo FDE steps)
// Beyond: your year: type the year you started and the card cuts to what Hanzo was building then, with its posts
// V2: 8 Nov round 4: real customer logos on the year plates over each year's figure (said once), years never blank on scroll (entrance marker is an attribute), h1 first, Your year keeps a dimmed plate, deck tokens. Motion map: the pinned 13-year scrub and its odometer year are gone (the years are plain rows, every word, link and plate kept, the rail stays as a jump index); the statement lights word by word; five page-local entrances; the years come straight after the hero, the clippings after them
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from 'motion/react';
import { A, Cta, Img, Film } from '../kit';
import UI from '../../content/ui-strings.json';
import StoryClose from './StoryClose';
import StoryPause from './StoryPause';
import Lines from '../v2/Lines';
import '../v2/system.css';
import { YEARS, ERAS } from './historyData';
import './story.css';
import usePhoneAsk from './usePhoneAsk';
import useHistoryEnter from './history/enter';
import './History.css';
import './history/enter.css';

const TL = ({ to, children }) => <Cta to={to} kind="link">{children}</Cta>;
const Arr = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const N = YEARS.length;

/* ---------- 1. the first screen ---------- */
function EraBar({ t, k }) {
  const sx = useTransform(t, [k / ERAS.length, (k + 1) / ERAS.length], [0, 1]);
  return <i className="xhi-era-bar" aria-hidden="true"><motion.b style={{ scaleX: sx }} /></i>;
}

/* the hero's object: the twelve years run by themselves, the giant year cut in as each era's bar fills (time) */
function Hero() {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const t = useMotionValue(0); // the same on server and client; reduced motion jumps it to the end before first paint
  const [at, setAt] = useState(0);
  const [paused, setPaused] = useState(false);
  useLayoutEffect(() => { if (calm) { t.set(1); setAt(N - 1); } }, [calm, t]);
  useMotionValueEvent(t, 'change', (v) => { const k = Math.min(N - 1, Math.floor(v * N)); setAt((a) => (a === k ? a : k)); });
  // the years run by themselves (15 s, a rest, again) until paused; a pause holds the year on screen
  useEffect(() => {
    if (calm || !seen || paused) return;
    let c, tm;
    const run = () => {
      const from = t.get() >= 1 ? 0 : t.get();
      c = animate(t, [from, 1], { duration: 15 * (1 - from), ease: 'linear', onComplete: () => { tm = setTimeout(run, 1600); } });
    };
    run();
    return () => { c?.stop(); clearTimeout(tm); };
  }, [seen, calm, paused, t]);
  const era = ERAS.reduce((a, e, k) => (at >= e[3] ? k : a), 0);
  return (
    <section className="xhi-hero" aria-labelledby="xhi-h1" data-ask-name="History" ref={box} data-morph-target>
      <div className="v2s-wrap xhi-hero-g">
        <div className="xhi-hero-l">
          <Lines as="h1" id="xhi-h1" className="v2s-display xhi-h1" now delay={0.05} stagger={0.06} lines={['Sovereign', 'intelligence', 'since 2014.']} />
          <motion.div className="xhi-hero-side" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.42 }}>{/* after the h1's last line has landed, so the h1 is the first thing seen (JS off: the noscript rule shows it) */}
            <p className="v2s-lede">From open-source commerce and early AI head-up displays with SKULLY in 2014, through Techstars ’17 and over $1B in venture-backed client revenue, to 1,600+ repositories and sovereign intelligence today.</p>
            <div className="v2s-acts">
              <Cta to="/history#timeline" kind="link" id="history.hero">Explore Our History</Cta>
              <TL to="/about">About Hanzo</TL>
              <TL to="/open-source">Open Source</TL>
            </div>
          </motion.div>
        </div>
        <div className="xhi-hero-r">
          <StoryPause paused={paused} onToggle={() => setPaused((v) => !v)} />
          <YearCut at={at} className="hero" />
          <ol className="xhi-eras">
            {ERAS.map(([span, title, d], k) => (
              <li key={span} className={k === era ? 'on' : ''}>
                <EraBar t={t} k={k} />
                <h2 className="xhi-era-t">{title}</h2>
                <span className="xhi-era-s">{span}</span>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- 3. track record: press clippings on a rail you throw (after the years) ---------- */
const CLIPS = [
  ['2014', 'Building business software since 2014, with AI and machine learning in commercial use from the start and GPT models in production by 2019. Founded as Crowdstart and renamed Hanzo in 2016. The first customer, SKULLY, raised $1M in about 45 hours, the fastest fully funded campaign on Indiegogo.', [['TechCrunch, 2014', 'https://techcrunch.com/2014/08/14/the-skully-smart-helmet-is-the-fastest-funded-indiegogo-campaign-to-hit-1m/'], ['SKULLY', '/customers#skully']]],
  ['120,000 ETH', 'The first blockchain-native commerce platform, 2017: the Unikrn ICO raised over 120,000 ETH across regulated jurisdictions.', [['Crunchbase News, 2017', 'https://news.crunchbase.com/startups/found-ico-makes-sense/'], ['Unikrn on Hanzo', '/customers#unikrn']]],
  ['2 went public', 'Damon Motorcycles and Triller, two of the companies Hanzo built with, listed on Nasdaq in 2024.', [['Damon (DMN)', 'https://www.nortonrosefulbright.com/en/news/95a8e26f/norton-rose-fulbright-advises-grafiti-holding-inc-in-its-business-combination-with-damon-motors-inc'], ['Triller (ILLR)', 'https://www.nasdaq.com/press-release/agba-completes-merger-triller-2024-10-15'], ['Case studies', '/customers#damon-motorcycles']]],
  ['Hundreds', 'Hundreds of venture-funded startups, backed by Y Combinator, 500 Startups, Techstars and other tier-1 firms: billions in client revenue, and two companies taken past 100 million users.', [['Customers', '/customers']]],
  ['Techstars ’17', 'Selected for Techstars in 2017 to build intelligent commerce: analytics, marketing and commerce on one learning engine.', [['hanzo.blog, 2017', 'https://hanzo.blog/2017-06-08-techstars-17/'], ['Startland News, 2017', 'https://startlandnews.com/2017/10/techstars-spotlight-hanzos-e-commerce-tools-designed-to-make-you-money/']]],
  ['1700+ repos', 'Open-source from the start: hanzoai/commerce in 2014, followed by 1700+ public repositories across C/CUDA/Metal runtimes, MCP servers, agent SDKs, and HIP standards.', [['github.com/hanzoai', 'https://github.com/hanzoai'], ['Open Source', '/open-source']]],
];
const TILT = [-1.6, 1.1, -0.6, 1.4, -1.1, 0.7];

function Record() {
  const rail = useRef(null);
  const x = useMotionValue(0);
  const [hand, setHand] = useState(false);
  const moved = useRef(0);
  const seen = useInView(rail, { once: true, amount: 0.5 });
  const calm = useReducedMotion();
  useEffect(() => { setHand(matchMedia('(pointer: fine)').matches); }, []);
  // once, on arrival: the rail leans left and springs back, to say it moves
  useEffect(() => {
    if (!seen || !hand || calm) return;
    const c = animate(x, [0, -90, 0], { duration: 1.6, times: [0, 0.4, 1], ease: [0.16, 1, 0.3, 1], delay: 0.4 });
    return () => c.stop();
  }, [seen, hand, calm, x]);
  // a link reached by keyboard slides into view
  const reveal = (e) => {
    if (!hand) return;
    const card = e.target.closest('li'), box = rail.current;
    if (!card || !box) return;
    const min = Math.min(0, box.clientWidth - box.firstChild.scrollWidth);
    const want = Math.max(min, Math.min(0, -(card.offsetLeft - 40)));
    animate(x, want, { type: 'spring', stiffness: 300, damping: 30 });
  };
  return (
    <section className="v2s-sec xhi-rec" aria-labelledby="xhi-rec-h" data-enter="cover-slide">
      <div className="v2s-wrap v2s-head xhi-rec-head">
        <h2 id="xhi-rec-h" className="v2s-headline">Shipping for venture-funded companies since 2014</h2>
        <p className="v2s-cap">Track record</p>
      </div>
      <div className={'xhi-rail' + (hand ? ' hand' : '')} ref={rail} data-swipe-own="" onFocusCapture={reveal}>
        <motion.ol className="xhi-clips" style={{ x }} drag={hand ? 'x' : false} dragConstraints={rail} dragElastic={0.06} dragTransition={{ power: 0.3, timeConstant: 280 }} onDragStart={() => { moved.current = Date.now(); }} onClickCapture={(e) => { if (Date.now() - moved.current < 250) e.preventDefault(); }}>
          {CLIPS.map(([fig, t, src], i) => (
            <li key={fig} style={{ '--r': TILT[i] + 'deg' }}>
              <article className="xhi-clip">
                <span className="xhi-clip-f">{fig}</span>
                <span className="xhi-clip-k">{String(i + 1).padStart(2, '0')} / {String(CLIPS.length).padStart(2, '0')}</span>
                <p>{t}</p>
                <span className="xhi-clip-s">{src.map(([l, to]) => <A key={to} to={to} draggable={false}>{l} ↗</A>)}</span>
              </article>
            </li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

/* ---------- 2. the journey: the statement that lights as it is read (Signature), then the years as plain rows ---------- */
/* the year, cut into its line: the old year rises out of the mask as the new one rises in (no rolling digits) */
function YearCut({ at, className = '' }) {
  return (
    <span className={'xhi-cut ' + className} aria-hidden="true">
      {YEARS.map((y, i) => <span key={y.year} className={i === at ? 'on' : i < at ? 'past' : ''}>{y.year}</span>)}
    </span>
  );
}

function Plate({ y, on, dim = false }) {
  const p = y.pic || {};
  const img = useRef(null);
  const [ok, setOk] = useState(false);
  const [k, setK] = useState(0); // the photo first; if it is not there, Hanzo's logo for that year
  const list = [p.photo, p.logo].filter(Boolean);
  const src = list[k];
  const kind = src && src === p.photo ? 'photo' : src ? 'logo' : 'fig';
  useEffect(() => { const el = img.current; if (el?.complete) { if (el.naturalWidth) setOk(true); else if (k + 1 < list.length) setK(k + 1); } }, [k]); // eslint-disable-line react-hooks/exhaustive-deps
  const [big, ...rest] = y.metric.split(' · ');
  return (
    <div className={'xhi-plate ' + kind + (ok ? ' ok' : '') + (+y.year % 2 ? ' lt' : '') + (dim ? ' dim' : '')} aria-hidden="true">
      {/* the year's own figure set large, from the first paint; Hanzo's picture fades in over it once it has loaded */}
      <span className="xhi-plate-word"><b>{big}</b>{rest.length ? <span className="x-mono">{rest.join(' · ')}</span> : null}<i className="xhi-plate-y x-mono">{y.year}</i></span>
      {src && <Img key={src} ref={img} src={src} alt="" w={1200} h={750} onLoad={() => setOk(true)} onError={() => { if (k + 1 < list.length) setK(k + 1); }} />}
      {p.logo2 && ok && <Img className="two" src={p.logo2} alt="" w={480} h={160} />}
      {p.video && on && <Film src={p.video} poster={p.photo} w={1200} h={750} />}
    </div>
  );
}

function Year({ y, i, at }) {
  const on = i === at;
  return (
    <article className={'xhi-yr' + (on ? ' on' : '')} aria-labelledby={'xhi-y' + y.year} data-y={i} data-enter="domino">
      <p className="xhi-yr-n v2s-num">{y.year}</p>
      <Plate y={y} on={on} />
      <div className="xhi-yr-t">
        <h3 id={'xhi-y' + y.year} className="v2s-headline">{y.title}</h3>
        <span className={'xhi-yr-b' + (y.badge === y.metric ? ' x-sr' : '')}>{y.badge}</span>{/* when the badge is the plate's figure, it is said once, on the plate */}
        <span className="xhi-yr-fig x-sr">{y.metric}</span>{/* shown large on the plate; kept here for screen readers */}
        <p className="xhi-yr-l">{y.lines[0]}</p>
        <p className="xhi-posts">{(y.posts || []).map(([l, to]) => <A key={l + to} to={to}>{l} →</A>)}</p>
        <details className="xhi-more">
          <summary aria-label={UI.strings.more.string}><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></summary>
          {y.lines.slice(1).map((l) => <p key={l} className="xhi-yr-l">{l}</p>)}
          <div className="xhi-hl">
            <span className="xhi-hl-t">{y.htitle}</span>
            <span>{y.desc}</span>
            <span className="xhi-hl-tag">{y.tag}</span>
          </div>
        </details>
      </div>
    </article>
  );
}

/* Hanzo's statement of its history, one span per word (rendered here, the same on server and client) */
const STATEMENT = 'Built with hundreds of venture-funded startups: billions in client revenue and two that went public on Nasdaq in 2024, from our first customer SKULLY to the sovereign AI cloud today.';
const WORDS = STATEMENT.split(' ');

function Journey() {
  const ref = useRef(null);
  const [at, setAt] = useState(0);
  // the year nearest the middle of the screen is the one the rail marks
  useEffect(() => {
    const box = ref.current;
    if (!box) return undefined;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setAt(+e.target.dataset.y); }), { rootMargin: '-45% 0px -45% 0px' });
    box.querySelectorAll('.xhi-yr').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const jump = (i) => {
    const el = ref.current?.querySelector(`.xhi-yr[data-y="${i}"]`);
    if (!el) return;
    const y = el.getBoundingClientRect().top + scrollY - 96;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (window.__lenis && !still) window.__lenis.scrollTo(y, { duration: 1 });
    else scrollTo({ top: y, behavior: still ? 'auto' : 'smooth' });
  };
  return (
    <section className="v2s-sec xhi-j" id="timeline" ref={ref} style={{ '--n': N }} aria-labelledby="xhi-tl">
      <div className="v2s-wrap">
        <div className="xhi-j-head">
          <h2 id="xhi-tl" className="v2s-headline">Year by year: 2014 to today</h2>
          <p className="v2s-cap">Full History</p>
        </div>
        <p className="xhi-stmt" data-wl="">
          {WORDS.map((w, i) => <span key={i}><span className="xhi-w">{w}</span>{i < WORDS.length - 1 ? ' ' : ''}</span>)}
        </p>
        <nav className="xhi-rail2" aria-label="Year by year">
          <ol data-enter="domino">
            {YEARS.map((y, i) => (
              <li key={y.year} style={{ '--k': i }}><button type="button" className={i === at ? 'on' : i < at ? 'past' : ''} aria-current={i === at ? 'step' : undefined} onClick={() => jump(i)}>{y.year}</button></li>
            ))}
          </ol>
        </nav>
        <div className="xhi-years">
          {YEARS.map((y, i) => <Year key={y.year} y={y} i={i} at={at} />)}
        </div>
      </div>
    </section>
  );
}

/* ---------- 4. Your year (Beyond) ---------- */
const FIRST = +YEARS[0].year, LAST = +YEARS[N - 1].year;

function Yours() {
  const [raw, setRaw] = useState('2019');
  const n = parseInt(raw, 10);
  const found = YEARS.find((x) => +x.year === n);
  const last = useRef(YEARS.find((x) => x.year === '2019') || YEARS[0]);
  if (found) last.current = found;
  const y = found || (raw.length < 4 && raw ? last.current : null); // half-typed: the last year you saw stays in place
  const held = last.current; // out of range or empty: the last plate stays, dimmed, and the sentence takes the title's place
  const say = !raw ? 'Type a year.' : Number.isNaN(n) ? 'Type a year, like 2019.' : n < FIRST ? `Building business software since ${FIRST}.` : n > LAST ? 'Not written yet.' : '';
  const step = (d) => setRaw(String(Math.min(LAST, Math.max(FIRST, (Number.isNaN(n) ? LAST : n) + d))));
  return (
    <section className="v2s-sec xhi-you" aria-labelledby="xhi-you-h">
      <div className="v2s-wrap v2s-grid xhi-you-g">
        <div className="v2s-c-1-6">
          <h2 id="xhi-you-h" className="v2s-headline">When did you start?</h2>
          <p className="v2s-cap xhi-you-l">Your year</p>
          <div className="xhi-you-in">
            <button type="button" aria-label="Year before" onClick={() => step(-1)}>−</button>
            <input suppressHydrationWarning value={raw} onChange={(e) => setRaw(e.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" aria-label="Year" />
            <button type="button" aria-label="Year after" onClick={() => step(1)}>+</button>
          </div>
        </div>
        <div className="v2s-c-8-12 xhi-you-a" aria-live="polite" data-enter="page-curl">
          {y ? (
            <>
              <Plate key={y.year} y={y} on />
              <span className="xhi-you-y v2s-num">{y.year}</span>
              <h3 className="v2s-title">{y.title}</h3>
              <p className="xhi-you-b">{y.badge}</p>
              <p className="v2s-body">{y.lines[0]}</p>
              <div className="xhi-you-p">{(y.posts || []).map(([t, to]) => <A key={t} to={to}>{t} →</A>)}</div>
            </>
          ) : (
            <>
              <Plate key={'dim' + held.year} y={held} on={false} dim />
              <p className="xhi-you-none v2s-title">{say}</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- 5. the principles: a colophon ---------- */
const PRINCIPLES = [
  ['Enable the Underdog', 'Enable others to win. Democratize technology so small businesses and startups can compete with industry giants.'],
  ['Data-Driven Everything', 'Let data be your guide. Embrace analytics and AI as the foundation of decision-making.'],
  ['Open Innovation', 'Be open, share often. Openness accelerates growth—both for the company and its community.'],
  ['Adaptability', 'Pivot with purpose. There is no failure, only feedback. Move quickly and strike in new directions when opportunity calls.'],
  ['Customer-Centric Growth', 'Treat each client as a long-term partner and guide them to success.'],
  ['First Principles Thinking', 'See the invisible, do the impossible. Boil problems down to their essence and solve them in fundamentally better ways.'],
];

/* where each principle's fragments start (px, px, deg): flung outwards from the list's centre */
const SHARDS = [[-110, -70, -7], [120, -80, 6], [-140, 10, 5], [150, 20, -6], [-100, 90, 8], [110, 100, -5]];

function Principles() {
  return (
    <section className="v2s-sec xhi-prin" aria-labelledby="xhi-prin-h">
      <div className="v2s-wrap v2s-grid">
        <div className="v2s-c-1-5 xhi-prin-h">
          <h2 id="xhi-prin-h" className="v2s-headline">The Zen of Hanzo</h2>
          <p className="v2s-cap">Operating Principles</p>
          <p className="v2s-lede">The principles the company argues from when a decision is close.</p>
          <TL to="/philosophy">Explore the full Zen manifesto</TL>
        </div>
        <ol className="v2s-c-6-12 xhi-prin-l" data-enter="explode-gather">
          {PRINCIPLES.map(([t, d], i) => (
            <li key={t} style={{ '--k': i, '--dx': SHARDS[i][0] + 'px', '--dy': SHARDS[i][1] + 'px', '--dr': SHARDS[i][2] + 'deg' }}>
              <span className="v2s-num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="v2s-title">{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- 6. the dark room: Hanzo FDE ---------- */
const FDE = [['Embedded', 'Engineers join your team, in your tools and on your cadence.'], ['On your data', 'They build against your real systems, inside your security boundary.'], ['Shipped', 'Every engagement ends in working software in production.'], ['Handed over', 'Your team owns the code, the runbooks and the platform.']];

/* the close: Hanzo FDE, its four steps under the ask, and the way back to /about; it carries the page's sticky ask */
function Fde() {
  return (
    <StoryClose
      title="Hanzo FDE"
      lede="Forward deployed engineers who work from inside your team: your people, your systems, your data, on Hanzo’s platform."
      action="Talk to Hanzo FDE"
      to="/contact-sales"
      thumb
      cta="history.band"
      note={
        <>
          <ol className="xhi-fde-l" data-enter="split-merge">
            {FDE.map(([t, d], i) => (
              <li key={t}>
                <span className="v2s-num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="v2s-title">{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
          <p className="xhi-back"><span>Want to learn more about our current leadership, research, and models?</span> <A to="/about" className="xhi-back-a"><span data-morph>Return to About Hanzo</span> <span aria-hidden="true">→</span></A></p>
        </>
      }
    />
  );
}

export default function History() {
  usePhoneAsk();
  const root = useRef(null);
  useHistoryEnter(root);
  return (
    <main id="main" className="xhi v2s" ref={root}>
      {/* JavaScript off: every line shows at rest (entrance starts and unlit words exist only under html.js) */}
      <noscript><style>{'.xhi .v2-line>span,.xhi-hero-side{transform:none!important;opacity:1!important}.xhi-era-bar b{transform:none!important}'}</style></noscript>
      <Hero />
      <Journey />
      <Record />
      <Yours />
      <Principles />
      <Fde />
    </main>
  );
}
