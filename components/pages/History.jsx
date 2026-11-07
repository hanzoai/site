'use client';
/* History. Its idea is the long road, travelled. The hero rolls the year from 2014 to 2026 and lights each era as it
   passes. The track record is laid out as press clippings, each with its source. Signature moment: the full history as
   a horizontal journey — the page holds while your scroll carries you sideways from 2014 to today, a year-line fills
   beneath, and each year's photograph develops in as it reaches the centre (its figure, where there is no photograph).
   Then the operating principles and how Hanzo FDE works. Beyond: "Your year" - type the year you started (your
   company, your job, your first line of code) and the split-flap board turns to it, with what Hanzo was building that
   year and its posts. Every word, figure and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { EASE, Rise } from '../ui';
import { A, Go, SecHead, Flap } from '../kit';
import { YEARS, ERAS } from './historyData';
import './History.css';

/* ---------- hero: the year rolls, the eras light ---------- */
function Hero() {
  const [i, setI] = useState(YEARS.length - 1);
  const calm = useReducedMotion();
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.3 });
  useEffect(() => { if (!calm) setI(0); }, [calm]);
  useEffect(() => {
    if (calm || !live) return;
    const t = setTimeout(() => setI((v) => (v + 1) % YEARS.length), i === YEARS.length - 1 ? 3200 : 900);
    return () => clearTimeout(t);
  }, [i, calm, live]);
  const era = ERAS.reduce((a, e, k) => (i >= e[3] ? k : a), 0);
  const line = (t, d) => <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>;
  return (
    <section className="xhi-hero" ref={ref} aria-labelledby="xhi-h1">
      <div className="x-wrap">
        <div className="xhi-hero-g">
          <div>
            <motion.p className="xhi-badge" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Techstars ’17</motion.p>
            <h1 id="xhi-h1" className="xhi-h1">{line('Sovereign intelligence', 0.05)}{line('since 2014.', 0.15)}</h1>
            <motion.p className="xhi-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>From open-source commerce and early AI head-up displays with SKULLY in 2014, through Techstars ’17 and over $1B in venture-backed client revenue, to 1,600+ repositories and sovereign intelligence today.</motion.p>
            <motion.div className="xhi-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}>
              <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><a href="#timeline" className="x-btn solid">Explore Our History</a></motion.span>
              <Go to="/about">About Hanzo</Go>
              <Go to="/open-source">Open Source</Go>
            </motion.div>
          </div>
          <div className="xhi-odo" aria-hidden="true">
            <span className="xhi-odo-k">Year</span>
            <div className="xhi-odo-n">
              {YEARS[i].year.split('').map((d, k) => (
                <span key={k} className="xhi-dig">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span key={d + '-' + k} initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30, delay: (3 - k) * 0.03 }}>{d}</motion.span>
                  </AnimatePresence>
                </span>
              ))}
            </div>
            <span className="xhi-odo-t">{YEARS[i].htitle}</span>
          </div>
        </div>
        <ol className="xhi-eras">
          {ERAS.map(([span, t, d], k) => (
            <motion.li key={span} className={k === era ? 'on' : k < era ? 'past' : ''} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.6 + k * 0.07 }}>
              <i className="xhi-era-bar" aria-hidden="true"><motion.b initial={false} animate={{ scaleX: k < era ? 1 : k === era ? (i - ERAS[k][3] + 1) / ((ERAS[k + 1]?.[3] ?? YEARS.length) - ERAS[k][3]) : 0 }} transition={{ duration: 0.6, ease: EASE }} /></i>
              <span className="xhi-era-s x-mono">{span}</span>
              <h2>{t}</h2>
              <p>{d}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- track record: clippings ---------- */
const CLIPS = [
  ['2014', 'Building business software since 2014, with AI and machine learning in commercial use from the start and GPT models in production by 2019. Founded as Crowdstart and renamed Hanzo in 2016. The first customer, SKULLY, raised $1M in about 45 hours, the fastest fully funded campaign on Indiegogo.', [['TechCrunch, 2014', 'https://techcrunch.com/2014/08/14/the-skully-smart-helmet-is-the-fastest-funded-indiegogo-campaign-to-hit-1m/'], ['SKULLY', '/customers#skully']]],
  ['120,000 ETH', 'The first blockchain-native commerce platform, 2017: the Unikrn ICO raised over 120,000 ETH across regulated jurisdictions.', [['Crunchbase News, 2017', 'https://news.crunchbase.com/startups/found-ico-makes-sense/'], ['Unikrn on Hanzo', '/customers#unikrn']]],
  ['2 went public', 'Damon Motorcycles and Triller, two of the companies Hanzo built with, listed on Nasdaq in 2024.', [['Damon (DMN)', 'https://www.nortonrosefulbright.com/en/news/95a8e26f/norton-rose-fulbright-advises-grafiti-holding-inc-in-its-business-combination-with-damon-motors-inc'], ['Triller (ILLR)', 'https://www.nasdaq.com/press-release/agba-completes-merger-triller-2024-10-15'], ['Case studies', '/customers#damon-motorcycles']]],
  ['Hundreds', 'Hundreds of venture-funded startups, backed by Y Combinator, 500 Startups, Techstars and other tier-1 firms: billions in client revenue, and two companies taken past 100 million users.', [['Customers', '/customers']]],
  ['Techstars ’17', 'Selected for Techstars in 2017 to build intelligent commerce: analytics, marketing and commerce on one learning engine.', [['hanzo.blog, 2017', 'https://hanzo.blog/2017-06-08-techstars-17/'], ['Startland News, 2017', 'https://startlandnews.com/2017/10/techstars-spotlight-hanzos-e-commerce-tools-designed-to-make-you-money/']]],
  ['1700+ repos', 'Open-source from the start: hanzoai/commerce in 2014, followed by 1700+ public repositories across C/CUDA/Metal runtimes, MCP servers, agent SDKs, and HIP standards.', [['github.com/hanzoai', 'https://github.com/hanzoai'], ['Open Source', '/open-source']]],
];

function Record() {
  return (
    <section className="x-sec xhi-rec">
      <div className="x-wrap">
        <SecHead kicker="Track record" title="Shipping for venture-funded companies since 2014" />
        <div className="xhi-clips">
          {CLIPS.map(([fig, t, src], i) => (
            <Rise key={fig} delay={(i % 3) * 0.08} className="xhi-clip" style={{ '--r': [-1.2, 0.8, -0.4, 1, -0.8, 0.5][i] + 'deg' }}>
              <b className="xhi-clip-f">{fig}</b>
              <p>{t}</p>
              <span className="xhi-clip-s">{src.map(([l, to]) => <A key={to} to={to}>{l} ↗</A>)}</span>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- the journey: scroll carries you sideways, 2014 to now ---------- */
function Panel({ y, i, active }) {
  const p = y.pic;
  return (
    <article className={'xhi-yr' + (active ? ' on' : '')} aria-labelledby={'xhi-y' + y.year}>
      <div className={'xhi-pic' + (p.photo ? ' photo' : p.logo ? ' logo' : ' fig')} aria-hidden="true">
        {p.photo && <img src={p.photo} alt="" loading="lazy" />}
        {p.video && active && <video src={p.video} autoPlay muted loop playsInline />}
        {!p.photo && p.logo && <span className="xhi-logos"><img src={p.logo} alt="" />{p.logo2 && <img src={p.logo2} alt="" />}</span>}
        {!p.photo && !p.logo && <span className="xhi-figure">{y.metric}</span>}
        <span className="xhi-pic-y x-mono">{y.year}</span>
      </div>
      <div className="xhi-yr-t">
        <p className="xhi-yr-n x-mono">{y.year}</p>
        <span className="xhi-badge2">{y.badge}</span>
        <h3 id={'xhi-y' + y.year}>{y.title}</h3>
        {y.lines.map((l) => <p key={l} className="xhi-yr-l">{l}</p>)}
        <div className="xhi-hl">
          <span className="x-mono">{y.tag}</span>
          <b>{y.metric}</b>
          <strong>{y.htitle}</strong>
          <span>{y.desc}</span>
        </div>
        <p className="xhi-posts">{(y.posts || []).map(([l, to]) => <A key={l + to} to={to}>{l} →</A>)}</p>
      </div>
    </article>
  );
}

function Journey() {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const n = YEARS.length;
  const x = useTransform(p, [0.02, 0.98], ['0%', `-${((n - 1) / n) * 100}%`]);
  const bar = useSpring(p, { stiffness: 200, damping: 30 });
  const [at, setAt] = useState(0);
  useMotionValueEvent(p, 'change', (v) => setAt(Math.max(0, Math.min(n - 1, Math.round(((v - 0.02) / 0.96) * (n - 1))))));
  return (
    <section className="xhi-journey" id="timeline" ref={ref} style={{ '--n': n }} aria-labelledby="xhi-tl">
      <div className="xhi-pin">
        <div className="x-wrap xhi-j-h">
          <div>
            <p className="x-kick">Full History</p>
            <h2 id="xhi-tl" className="xhi-h2">Year by year: 2014 to today</h2>
          </div>
          <p className="xhi-j-l">Built with hundreds of venture-funded startups: billions in client revenue and two that went public on Nasdaq in 2024, from our first customer SKULLY to the sovereign AI cloud today.</p>
        </div>
        <div className="xhi-track-w">
          <motion.ol className="xhi-track" style={{ x, width: `calc(var(--panel) * ${n})` }}>
            {YEARS.map((y, i) => <li key={y.year}><Panel y={y} i={i} active={at === i} /></li>)}
          </motion.ol>
        </div>
        <div className="x-wrap xhi-line">
          <i className="xhi-line-b" aria-hidden="true"><motion.b style={{ scaleX: bar }} /></i>
          <ol className="xhi-ticks" aria-hidden="true">{YEARS.map((y, i) => <li key={y.year} className={i === at ? 'on' : i < at ? 'past' : ''}>{y.year}</li>)}</ol>
        </div>
      </div>
    </section>
  );
}

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
    <section className="x-sec xhi-prin">
      <div className="x-wrap xhi-prin-g">
        <div className="xhi-sticky">
          <SecHead kicker="Operating Principles" title="The Zen of Hanzo" lede="The principles the company argues from when a decision is close." />
          <A to="/philosophy" className="x-arrow"><span>Explore the full Zen manifesto</span><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></A>
        </div>
        <ol className="xhi-prin-l">
          {PRINCIPLES.map(([t, d], i) => (
            <Rise as="li" key={t} y={18}>
              <span className="x-mono">{String(i + 1).padStart(2, '0')}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Rise>
          ))}
        </ol>
      </div>
    </section>
  );
}

const FDE = [['Embedded', 'Engineers join your team, in your tools and on your cadence.'], ['On your data', 'They build against your real systems, inside your security boundary.'], ['Shipped', 'Every engagement ends in working software in production.'], ['Handed over', 'Your team owns the code, the runbooks and the platform.']];

function Fde() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  return (
    <section className="x-sec xhi-fde" data-room="dark" ref={ref}>
      <div className="x-wrap">
        <SecHead dark title="Hanzo FDE" lede="Forward deployed engineers who work from inside your team: your people, your systems, your data, on Hanzo’s platform." />
        <ol className="xhi-fde-l">
          <i className="xhi-fde-line" aria-hidden="true"><motion.b initial={{ scaleX: 0 }} animate={seen ? { scaleX: 1 } : {}} transition={{ duration: 1.8, ease: EASE, delay: 0.2 }} /></i>
          {FDE.map(([t, d], i) => (
            <motion.li key={t} initial={{ opacity: 0, y: 20 }} animate={seen ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE, delay: 0.3 + i * 0.35 }}>
              <span className="xhi-fde-n x-mono">{String(i + 1).padStart(2, '0')}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </motion.li>
          ))}
        </ol>
        <div className="xhi-fde-a"><Go to="/contact-sales" solid>Talk to Hanzo FDE</Go></div>
      </div>
    </section>
  );
}

const FIRST = +YEARS[0].year, LAST = +YEARS[YEARS.length - 1].year;

/* Your year: what Hanzo was building the year you started. */
function Yours() {
  const [raw, setRaw] = useState('2019');
  const n = parseInt(raw, 10);
  const y = YEARS.find((x) => +x.year === n);
  const say = !raw ? 'Type a year.' : Number.isNaN(n) ? 'Type a year, like 2019.' : n < FIRST ? `Building business software since ${FIRST}.` : n > LAST ? 'Not written yet.' : '';
  const step = (d) => setRaw(String(Math.min(LAST, Math.max(FIRST, (Number.isNaN(n) ? LAST : n) + d))));
  return (
    <section className="x-sec xhi-you">
      <div className="x-wrap xhi-you-grid">
        <div>
          <p className="x-kick">Your year</p>
          <h2>When did you start?</h2>
          <div className="xhi-you-in">
            <button type="button" aria-label="Year before" onClick={() => step(-1)}>−</button>
            <input value={raw} onChange={(e) => setRaw(e.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" aria-label="Year" />
            <button type="button" aria-label="Year after" onClick={() => step(1)}>+</button>
          </div>
        </div>
        <div className="xhi-you-a" aria-live="polite">
          {y ? (
            <>
              <Flap value={y.year} className="xhi-you-y" />
              <h3>{y.title}</h3>
              <p className="xhi-you-b x-mono">{y.badge}</p>
              <p>{y.lines[0]}</p>
              <div className="xhi-you-p">{(y.posts || []).map(([t, to]) => <A key={t} to={to}>{t} →</A>)}</div>
            </>
          ) : <p className="xhi-you-none">{say}</p>}
        </div>
      </div>
    </section>
  );
}

export default function History() {
  return (
    <main className="xhi">
      <Hero />
      <Record />
      <Journey />
      <Yours />
      <Principles />
      <Fde />
      <section className="xhi-back">
        <div className="x-wrap">
          <p>Want to learn more about our current leadership, research, and models?</p>
          <A to="/about" className="xhi-back-a">Return to About Hanzo <span aria-hidden="true">→</span></A>
        </div>
      </section>
    </main>
  );
}
