'use client';
/* Customers. Signature: a full-bleed gallery of the case studies that you drag (it drifts by itself until you do); each
   case opens into its story. Then every launch on one timeline, a big year that turns as you read down it.
   Beyond: a year scrubber over 2015–2020 that counts the launches of each year from Hanzo's own list; drag or tap a year
   to jump to it. Every word, figure and link is Hanzo's; the two case figures come from their own case studies. */
import { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useReducedMotion } from 'motion/react';
import { EASE, Rise, Words } from '../ui';
import { A } from '../kit';
import './Customers.css';

const CASES = [
  { name: 'Damon Motorcycles', year: '2020', d: 'Ran the CES reveal and the preorder campaign: AI-written ad sets, show-floor targeting, video and email.', to: '/customers/damon-motorcycles', img: '/customers/damon-motorcycles/cover.webp', alt: 'The Damon Hypersport', logo: '/logos/customers/damon-motorcycles.svg', n: '$8.4M', w: 'in bikes sold in 30 days' },
  { name: 'KANOA', year: '2015', d: 'Built the site and store, then ran paid acquisition, email and the preorder campaign.', to: '/customers/kanoa', img: '/customers/kanoa/athlete.webp', alt: 'An athlete wearing KANOA earphones', logo: '/logos/customers/kanoa.png', n: '$7M+', w: 'raised in preorders' },
];

const LAUNCHES = [
  { id: 'skully', name: 'SKULLY', kind: 'Crowdfunding', d: "Built the Indiegogo campaign into SKULLY's own store and ran its AI ad campaigns.", f: [['$2.5M', 'raised on Indiegogo'], ['$3.3M', 'more through the Hanzo store']], logo: 'skully.png' },
  { id: 'bellabeat', name: 'Bellabeat', year: '2015', kind: 'Preorders', d: 'Ran prelaunch marketing and audience targeting for LEAF.', f: [['250,000', 'email signups']], logo: 'bellabeat.svg' },
  { id: 'stoned', name: 'STONED Audio', year: '2016', kind: 'Social commerce launch', d: 'Grew a wireless audio brand from zero on a small budget.', f: [['$135K', 'in sales from a $20K budget'], ['70,000', 'social followers']], logo: 'stoned.svg' },
  { id: 'unikoin-gold', name: 'Unikrn', year: '2017', kind: 'Token sale', d: 'Launched UnikoinGold, the first regulated esports bookmaker token.', f: [['120,000 ETH', 'raised from the public']], logo: 'unikoin-gold.svg' },
  { id: 'arca', name: 'Arca', year: '2018', kind: 'Stablecoin launch', d: 'Launched an interest-bearing stablecoin.', f: [['$500M', 'under management by 2021']], logo: 'arca.png' },
  { id: 'casper-blockchain', name: 'Casper Labs', year: '2018', kind: 'Network launch', d: 'Launched the Casper network and co-founded the DEVxDAO association.', f: [['$650M', 'CSPR peak market value']], logo: 'casper-blockchain.svg' },
  { id: 'palladium', name: 'Palladium', year: '2018', kind: 'Token offering', d: 'Ran the digital fundraise and investor outreach.', f: [['€150M', 'raised']] },
  { id: 'trillerfest', name: 'Triller', year: '2020', kind: 'Growth marketing', d: 'Ran user acquisition and growth for the app and TrillerFest.', f: [['169M', 'people watched TrillerFest'], ['82M', 'monthly active users']], logo: 'trillerfest.png' },
  { id: 'cover-build', name: 'Cover Build', kind: 'Product site', d: 'Built the site and 3D configurator for precision-made prefab homes.', f: [], logo: 'cover-build.svg' },
  { id: 'myle-tap', name: 'Myle Tap', kind: 'Hardware launch', d: 'Built the companion app and ran the launch for a voice-activated wearable.', f: [], logo: 'myle-tap.png' },
  { id: 'keek-social', name: 'Personas Social', kind: 'AI platform', d: 'Built the recommendation, moderation and creator tools inside Keek.', f: [], logo: 'keek-social.svg' },
];

// the timeline reads in years; launches the page gives no year sit together at the end, in Hanzo's order
const UNDATED = 'Undated';
const GROUPS = [...new Set(LAUNCHES.map((l) => l.year || UNDATED))].sort((a, b) => (a === UNDATED) - (b === UNDATED) || a.localeCompare(b));
const BY = Object.fromEntries(GROUPS.map((g) => [g, LAUNCHES.filter((l) => (l.year || UNDATED) === g)]));

/* The case gallery: drag it sideways; idle, it drifts from one case to the next and back. A drag never opens a case. */
function Gallery() {
  const rail = useRef(null);
  const track = useRef(null);
  const x = useMotionValue(0);
  const [min, setMin] = useState(0);
  const [mine, setMine] = useState(false);
  const moved = useRef(false);
  const seen = useInView(rail, { amount: 0.3 });
  const calm = useReducedMotion();

  useEffect(() => {
    const m = () => setMin(Math.min(0, rail.current.clientWidth - track.current.scrollWidth));
    m();
    const ro = new ResizeObserver(m);
    ro.observe(rail.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (mine || calm || !seen || !min) return;
    let stop = false, c;
    const swing = async () => {
      while (!stop) {
        c = animate(x, min, { duration: 9, ease: [0.45, 0, 0.55, 1] }); await c; if (stop) break;
        c = animate(x, 0, { duration: 9, ease: [0.45, 0, 0.55, 1] }); await c;
      }
    };
    const t = setTimeout(swing, 1400);
    return () => { stop = true; clearTimeout(t); c && c.stop(); };
  }, [mine, calm, seen, min, x]);

  return (
    <div className="xcu-rail" ref={rail} data-drag="">
      <motion.ul className="xcu-track" ref={track} style={{ x }} drag="x" dragConstraints={{ left: min, right: 0 }} dragElastic={0.08}
        onPointerDown={() => { moved.current = false; setMine(true); }}
        onDragStart={() => { moved.current = true; rail.current.setAttribute('data-no-morph', ''); }} // the morph layer listens first; this keeps a drag from opening a case
        onClickCapture={(e) => { if (moved.current) { e.preventDefault(); e.stopPropagation(); } setTimeout(() => rail.current?.removeAttribute('data-no-morph'), 0); }}
        aria-label="Case studies">
        {CASES.map((c, i) => (
          <li key={c.name} className="xcu-case">
            <A to={c.to} className="xcu-case-a" draggable={false} data-cursor="Open">
              <span className="xcu-ph" data-morph>
                <img src={c.img} alt={c.alt} draggable={false} loading={i ? 'lazy' : 'eager'} />
              </span>
              <span className="xcu-case-top"><img className="xcu-mark" src={c.logo} alt="" draggable={false} /><span className="x-mono">{c.year}</span></span>
              <span className="xcu-case-in">
                <span className="xcu-fig"><b>{c.n}</b><span>{c.w}</span></span>
                <h3>{c.name}</h3>
                <span className="xcu-case-d">{c.d}</span>
                <span className="xcu-open">Read the case study<i aria-hidden="true">→</i></span>
              </span>
            </A>
          </li>
        ))}
        <li className="xcu-case xcu-more">
          <a href="#every" className="xcu-case-a" draggable={false}>
            <span className="xcu-more-n x-mono">{String(LAUNCHES.length + CASES.length).padStart(2, '0')}</span>
            <span className="xcu-more-t">Every launch</span>
            <i aria-hidden="true">↓</i>
          </a>
        </li>
      </motion.ul>
    </div>
  );
}

function Hero() {
  return (
    <section className="xcu-hero" aria-labelledby="xcu-h1">
      <div className="x-wrap">
        <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Customers</motion.p>
        <h1 id="xcu-h1" className="xcu-h1">
          {['Products Hanzo', 'built and launched'].map((t, i) => (
            <span className="x-line" key={t}><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 + i * 0.12 }}>{t}</motion.span></span>
          ))}
        </h1>
        <motion.p className="xcu-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>
          Hanzo built the store, ran the ads and found the audience for each of these launches. Here is what we did and what each one sold.
        </motion.p>
        <motion.h2 className="xcu-k2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}>Case studies</motion.h2>
      </div>
      <motion.div initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.3, ease: EASE, delay: 0.3 }}>
        <Gallery />
      </motion.div>
    </section>
  );
}

function Launch({ l, onSeen }) {
  const ref = useRef(null);
  const lit = useInView(ref, { margin: '-40% 0px -50% 0px' });
  useEffect(() => { if (lit) onSeen(l.year || UNDATED); }, [lit]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <article ref={ref} id={l.id} className={'xcu-launch' + (lit ? ' lit' : '')}>
      <div className="xcu-l-head">
        {l.logo ? <img className="xcu-mark" src={'/logos/customers/' + l.logo} alt="" loading="lazy" /> : <span className="xcu-mark-t" aria-hidden="true">{l.name}</span>}
        <span className="xcu-kind">{l.kind}</span>
      </div>
      <h3>{l.name}{l.year && <span className="x-mono">{l.year}</span>}</h3>
      <p>{l.d}</p>
      {l.f.length > 0 && (
        <dl>{l.f.map(([n, w]) => <div key={w}><dt>{n}</dt><dd>{w}</dd></div>)}</dl>
      )}
    </article>
  );
}

/* The scrubber: one stop per year, its launch count from the list; drag along it or tap a year to go there. */
function Scrub({ at, go }) {
  const bar = useRef(null);
  const i = GROUPS.indexOf(at);
  const pick = (e) => {
    const r = bar.current.getBoundingClientRect();
    const k = Math.max(0, Math.min(GROUPS.length - 1, Math.round(((e.clientX - r.left) / r.width) * (GROUPS.length - 1))));
    go(GROUPS[k]);
  };
  return (
    <div className="xcu-scrub" ref={bar} onPointerDown={(e) => { if (e.pointerType !== 'mouse' || e.button === 0) { bar.current.setPointerCapture(e.pointerId); pick(e); } }}
      onPointerMove={(e) => { if (bar.current.hasPointerCapture(e.pointerId)) pick(e); }} data-drag="">
      <i className="xcu-scrub-line" aria-hidden="true"><motion.b animate={{ scaleX: i / (GROUPS.length - 1) }} transition={{ type: 'spring', stiffness: 220, damping: 30 }} /></i>
      {GROUPS.map((g, k) => (
        <button key={g} type="button" className={'xcu-stop' + (g === at ? ' on' : '')} style={{ left: (k / (GROUPS.length - 1)) * 100 + '%' }}
          onClick={() => go(g)} aria-label={`${g}: ${BY[g].length} ${BY[g].length === 1 ? 'launch' : 'launches'}`} aria-current={g === at ? 'step' : undefined}>
          <span className="xcu-stop-dots" aria-hidden="true">{BY[g].map((l) => <i key={l.id} />)}</span>
          <span className="xcu-stop-y x-mono">{g}</span>
          {g === at && <span className="xcu-stop-live" aria-hidden="true" />}
        </button>
      ))}
    </div>
  );
}

function Timeline() {
  const [at, setAt] = useState(GROUPS[0]);
  const go = (g) => {
    const el = document.getElementById('xcu-y-' + g);
    if (!el) return;
    const y = el.getBoundingClientRect().top + scrollY - 150;
    window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.1 }) : scrollTo({ top: y, behavior: 'smooth' });
  };
  return (
    <section className="x-sec xcu-every" id="every" aria-labelledby="xcu-every-h">
      <div className="x-wrap">
        <header className="xcu-every-head">
          <Words text="Every launch" as="h2" />
          <Scrub at={at} go={go} />
        </header>
        <div className="xcu-tl">
          <div className="xcu-year" aria-hidden="true">
            <div className="xcu-year-in">
              <span className="xcu-live" />
              {GROUPS.map((g) => (
                <motion.span key={g} className="xcu-year-n" initial={false} animate={g === at ? { y: 0, opacity: 1 } : { y: GROUPS.indexOf(g) < GROUPS.indexOf(at) ? '-60%' : '60%', opacity: 0 }} transition={{ duration: 0.6, ease: EASE }}>{g}</motion.span>
              ))}
            </div>
          </div>
          <div className="xcu-groups">
            {GROUPS.map((g) => (
              <div key={g} className="xcu-group" id={'xcu-y-' + g}>
                <p className="xcu-group-y x-mono">{g}</p>
                {BY[g].map((l) => <Launch key={l.id} l={l} onSeen={setAt} />)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const BACKERS = [
  ['https://aws.amazon.com', 'amazon', 'Amazon'], ['https://www.digitalocean.com', 'digitalocean', 'DigitalOcean'], ['https://cloud.google.com', 'google', 'Google'],
  ['https://azure.microsoft.com', 'microsoft', 'Microsoft'], ['https://www.nvidia.com', 'nvidia', 'NVIDIA'], ['https://nebius.com', 'nebius', 'Nebius'],
];

function Backers() {
  return (
    <section className="x-sec xcu-back" aria-labelledby="xcu-back-h">
      <div className="x-wrap xcu-back-grid">
        <div>
          <Words text="Backed by builders." as="h2" />
          <Rise className="xcu-ts">
            <A to="https://www.techstars.com" className="xcu-ts-a" aria-label="Techstars"><img src="/logos/partners/techstars.svg" alt="Techstars logo" /></A>
          </Rise>
        </div>
        <div className="xcu-belt" aria-label="Clouds">
          <ul className="xcu-belt-in">
            {[0, 1].map((k) => BACKERS.map(([u, f, n]) => (
              <li key={k + f} aria-hidden={k ? true : undefined}>
                <A to={u} tabIndex={k ? -1 : undefined}><img src={`/logos/partners/${f}.svg`} alt={k ? '' : n + ' logo'} /></A>
              </li>
            )))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function Customers() {
  return (
    <main className="xcu">
      <Hero />
      <Timeline />
      <Backers />
      <section className="xcu-close" data-room="dark">
        <div className="x-wrap xcu-close-in">
          <Words text="Launch with us" as="h2" />
          <Rise delay={0.15}><A to="/contact" className="xcu-close-a" data-thumb="Talk to us"><span>Talk to us</span><i aria-hidden="true">→</i></A></Rise>
        </div>
      </section>
    </main>
  );
}
