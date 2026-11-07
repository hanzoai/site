'use client';
/* History, v3 (Story archetype, editorial). Ink, greys and silvers only (JAMES.md 7); colour comes from Hanzo's own media.
   First screen: "Sovereign intelligence since 2014." at display size with the lede and one ask under it; beside it, the
   object: a giant year that runs from 2014 to 2026 by itself while the four eras' bars fill in turn.
   Signature: the timeline scrub. The year-by-year history is one pinned scene: your scroll cuts a giant year into its
   line (the old year rises out, the new one rises in), and each year's story comes in as the last one goes out, its
   plate (the customer's picture or logo, or its figure where Hanzo has none) beside it. A rail of thirteen years tracks
   where you are; any year is one click away. On a phone the years simply stack.
   Supporting (three): the hero's years run by themselves, each era's bar filling as the giant year is cut in (time);
   the press clippings as a rail you throw sideways (pointer, drag with inertia); "Your year" cuts its year in (state).
   Beyond: "Your year": type the year you started and the card cuts to what Hanzo was building then, with its posts.
   Every word, figure and link is Hanzo's (content/live/history.json). */
// Persona: a buyer or investor checking Hanzo's record (arrives from /about, the footer or search)
// Goal: see twelve years of shipped work, year by year, and trust it
// CTA: Explore Our History (#timeline) in the hero; Talk to Hanzo FDE in the sticky ask bar and the closing Band
// Metric: contact_sales_submit via the Band (data-cta="history.*")
// Signature: the timeline scrub: one pinned scene where your scroll cuts a giant year into its line as each year's story comes in and the last goes out
// Beyond: your year: type the year you started and the card cuts to what Hanzo was building then, with its posts
// V2: 7/10 critic round 3: wordmark plates for the years whose pictures are not mirrored, a lighter first screen (one era's line at a time), your year never jumps, 26px year figures, FDE steps as captions (no numeral run), 44px links
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { A, Cta, Img, Film } from '../kit';
import UI from '../../content/ui-strings.json';
import StoryClose from './StoryClose';
import StoryPause from './StoryPause';
import Lines from '../v2/Lines';
import '../v2/system.css';
import { YEARS, ERAS } from './historyData';
import './story.css';
import usePhoneAsk from './usePhoneAsk';
import './History.css';

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
          <motion.div className="xhi-hero-side" initial={{ y: 12 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}>
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

/* ---------- 2. track record: press clippings on a rail you throw ---------- */
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
    <section className="v2s-sec xhi-rec" aria-labelledby="xhi-rec-h">
      <div className="v2s-wrap v2s-head xhi-rec-head">
        <h2 id="xhi-rec-h" className="v2s-headline">Shipping for venture-funded companies since 2014</h2>
        <p className="v2s-cap">Track record</p>
      </div>
      <div className={'xhi-rail' + (hand ? ' hand' : '')} ref={rail} data-swipe-own="" onFocusCapture={reveal}>
        <motion.ol className="xhi-clips" style={{ x }} drag={hand ? 'x' : false} dragConstraints={rail} dragElastic={0.06} dragTransition={{ power: 0.3, timeConstant: 280 }} onDragStart={() => { moved.current = Date.now(); }} onClickCapture={(e) => { if (Date.now() - moved.current < 250) e.preventDefault(); }}>
          {CLIPS.map(([fig, t, src], i) => (
            <li key={fig} style={{ '--r': TILT[i] + 'deg' }}>
              <article className="xhi-clip">
                <span className="xhi-clip-k">{String(i + 1).padStart(2, '0')} / {String(CLIPS.length).padStart(2, '0')}</span>
                <b className="xhi-clip-f">{fig}</b>
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

/* ---------- 3. the journey: one pinned scene, scrubbed year by year (Signature) ---------- */
/* the year, cut into its line: the old year rises out of the mask as the new one rises in (no rolling digits) */
function YearCut({ at, className = '' }) {
  return (
    <span className={'xhi-cut ' + className} aria-hidden="true">
      {YEARS.map((y, i) => <span key={y.year} className={i === at ? 'on' : i < at ? 'past' : ''}>{y.year}</span>)}
    </span>
  );
}

function Plate({ y, on }) {
  const p = y.pic;
  const img = useRef(null);
  const [ok, setOk] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => { const el = img.current; if (el?.complete) { if (el.naturalWidth) setOk(true); else setFailed(true); } }, []);
  const src = p.photo || p.logo;
  return (
    <div className={'xhi-plate' + (p.photo ? ' photo' : p.logo ? ' logo' : ' fig') + (ok ? ' ok' : '')} aria-hidden="true">
      {/* no picture to hand (or it failed): the year's own customer set as a wordmark plate, never the same grey squiggle */}
      {(!src || failed) && <span className="xhi-plate-word"><b>{y.title}</b><span className="x-mono">{y.badge}</span></span>}
      {src && <Img ref={img} src={src} alt="" w={1200} h={750} onLoad={() => setOk(true)} onError={() => setFailed(true)} />}
      {p.logo2 && ok && <Img className="two" src={p.logo2} alt="" w={480} h={160} />}
      {p.video && on && <Film src={p.video} poster={p.photo} w={1200} h={750} />}
    </div>
  );
}

function Year({ y, i, at }) {
  const on = i === at;
  return (
    <article className={'xhi-yr' + (on ? ' on' : i < at ? ' past' : '')} aria-labelledby={'xhi-y' + y.year} inert={!on ? true : undefined} data-y={i}>
      <p className="xhi-yr-n v2s-num">{y.year}</p>
      <Plate y={y} on={on} />
      <div className="xhi-yr-t">
        <h3 id={'xhi-y' + y.year} className="v2s-headline">{y.title}</h3>
        <span className="xhi-yr-b">{y.badge}</span>
        <b className="xhi-yr-fig">{y.metric}</b>
        <p className="xhi-yr-l">{y.lines[0]}</p>
        <p className="xhi-posts">{(y.posts || []).map(([l, to]) => <A key={l + to} to={to}>{l} →</A>)}</p>
        <details className="xhi-more">
          <summary aria-label={UI.strings.more.string}><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></summary>
          {y.lines.slice(1).map((l) => <p key={l} className="xhi-yr-l">{l}</p>)}
          <div className="xhi-hl">
            <strong>{y.htitle}</strong>
            <span>{y.desc}</span>
            <span className="xhi-hl-tag">{y.tag}</span>
          </div>
        </details>
      </div>
    </article>
  );
}

function Journey() {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [at, setAt] = useState(0);
  const [pinned, setPinned] = useState(true);
  useEffect(() => { const m = matchMedia('(max-width: 900px)'); const f = () => setPinned(!m.matches); f(); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);
  useMotionValueEvent(p, 'change', (v) => { const k = Math.max(0, Math.min(N - 1, Math.floor(v * N * 0.999))); setAt((a) => (a === k ? a : k)); });
  const era = ERAS.reduce((a, e, k) => (at >= e[3] ? k : a), 0);
  const jump = (i) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + scrollY;
    const y = top + ((i + 0.5) / N) * (el.offsetHeight - innerHeight);
    window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.2 }) : scrollTo({ top: y, behavior: 'smooth' });
  };
  return (
    <>
      <section className="v2s-sec tight xhi-j-intro" aria-labelledby="xhi-tl">
        <div className="v2s-wrap v2s-head side">
          <h2 id="xhi-tl" className="v2s-headline">Year by year: 2014 to today</h2>
          <p className="v2s-cap">Full History</p>
          <p className="v2s-lede xhi-j-l">Built with hundreds of venture-funded startups: billions in client revenue and two that went public on Nasdaq in 2024, from our first customer SKULLY to the sovereign AI cloud today.</p>
        </div>
      </section>
      <section className="xhi-scrub" id="timeline" ref={ref} style={{ '--n': N }} aria-label="Year by year">
        <div className="xhi-stage">
          <div className="v2s-wrap xhi-stage-g">
            {pinned && (
              <div className="xhi-odo-w">
                <YearCut at={at} />
                <span className="xhi-odo-era">{ERAS[era][1]}</span>
              </div>
            )}
            <div className="xhi-years">
              {YEARS.map((y, i) => <Year key={y.year} y={y} i={i} at={pinned ? at : i} />)}
            </div>
          </div>
          <div className="v2s-wrap xhi-rail2">
            <i className="xhi-rail2-l" aria-hidden="true"><motion.b style={{ scaleX: p }} /></i>
            <ol>
              {YEARS.map((y, i) => (
                <li key={y.year}><button type="button" className={i === at ? 'on' : i < at ? 'past' : ''} aria-current={i === at ? 'step' : undefined} onClick={() => jump(i)}>{y.year}</button></li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
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
            <input value={raw} onChange={(e) => setRaw(e.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" aria-label="Year" />
            <button type="button" aria-label="Year after" onClick={() => step(1)}>+</button>
          </div>
        </div>
        <div className="v2s-c-8-12 xhi-you-a" aria-live="polite">
          {y ? (
            <>
              <Plate key={y.year} y={y} on />
              <span className="xhi-you-y v2s-num">{y.year}</span>
              <h3 className="v2s-title">{y.title}</h3>
              <p className="xhi-you-b">{y.badge}</p>
              <p className="v2s-body">{y.lines[0]}</p>
              <div className="xhi-you-p">{(y.posts || []).map(([t, to]) => <A key={t} to={to}>{t} →</A>)}</div>
            </>
          ) : <p className="xhi-you-none v2s-title">{say}</p>}
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
        <ol className="v2s-c-6-12 xhi-prin-l">
          {PRINCIPLES.map(([t, d], i) => (
            <li key={t}>
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
          <ol className="xhi-fde-l">
            {FDE.map(([t, d], i) => (
              <li key={t}>
                <span className="v2s-num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="v2s-title">{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
          <p className="xhi-back">Want to learn more about our current leadership, research, and models? <A to="/about" className="xhi-back-a"><span data-morph>Return to About Hanzo</span> <span aria-hidden="true">→</span></A></p>
        </>
      }
    />
  );
}

export default function History() {
  usePhoneAsk();
  return (
    <main id="main" className="xhi v2s">
      {/* JavaScript off: every line shows at rest, and the years stack */}
      <noscript><style>{'.xhi .v2-line>span,.xhi-hero-side{transform:none!important;opacity:1!important}.xhi-era-bar b{transform:none!important}.xhi-scrub{height:auto!important}.xhi-stage{position:static!important;height:auto!important;overflow:visible!important;display:block!important}.xhi-years{gap:96px}.xhi-yr{grid-area:auto!important}.xhi-yr .xhi-yr-t,.xhi-yr .xhi-plate{opacity:1!important;transform:none!important}.xhi-yr-n{display:block!important}.xhi-odo-w,.xhi-rail2{display:none!important}'}</style></noscript>
      <Hero />
      <Record />
      <Journey />
      <Yours />
      <Principles />
      <Fde />
    </main>
  );
}
