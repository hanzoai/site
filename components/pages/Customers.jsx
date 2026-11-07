'use client';
/* /customers. V2: 8/10 Story + catalogue: a two-line kinetic headline over one huge case plate that swaps Damon and
   KANOA by itself and opens into the case study; every launch as an editorial index; a calm logo belt; one dark room.
   Accent: Pacific teal.
   Signature: the case plate. One case fills a 28px plate (cover, logo, its figure as a hero numeral); left alone it wipes
   to the other case; click it and the picture opens into its story (Morph, synchronized.studio). The plate widens to
   the full grid as it reaches you.
   Supporting (3): masked kinetic headline, once; the plate's scroll-widening (stage); the logo belt.
   Beyond: a year index over Hanzo's own launch list: each year shows how many launches it holds, and a tap narrows the
   index to that year. Every word, figure and link is Hanzo's; the two case figures come from their own case studies. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { A } from '../kit';
import MaskLines from './company/MaskLines';
import '../v2/vc-type.css';
import './Customers.css';

const EASE = [0.16, 1, 0.3, 1];

const CASES = [
  { name: 'Damon Motorcycles', year: '2020', d: 'Ran the CES reveal and the preorder campaign: AI-written ad sets, show-floor targeting, video and email.', to: '/customers/damon-motorcycles', img: '/customers/damon-motorcycles/cover.webp', alt: 'The Damon Hypersport', logo: '/logos/customers/damon-motorcycles.svg', n: '$8.4M', w: 'in bikes sold in 30 days', tone: 'a' },
  { name: 'KANOA', year: '2015', d: 'Built the site and store, then ran paid acquisition, email and the preorder campaign.', to: '/customers/kanoa', img: '/customers/kanoa/athlete.webp', alt: 'An athlete wearing KANOA earphones', logo: '/logos/customers/kanoa.png', n: '$7M+', w: 'raised in preorders', tone: 'b' },
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

// the index reads in years; launches the page gives no year sit together at the end, in Hanzo's order
const UNDATED = 'Undated';
const GROUPS = [...new Set(LAUNCHES.map((l) => l.year || UNDATED))].sort((a, b) => (a === UNDATED) - (b === UNDATED) || a.localeCompare(b));
const BY = Object.fromEntries(GROUPS.map((g) => [g, LAUNCHES.filter((l) => (l.year || UNDATED) === g)]));
const ORDER = GROUPS.flatMap((g) => BY[g]);

const BACKERS = [
  ['https://aws.amazon.com', 'amazon', 'Amazon'], ['https://www.digitalocean.com', 'digitalocean', 'DigitalOcean'], ['https://cloud.google.com', 'google', 'Google'],
  ['https://azure.microsoft.com', 'microsoft', 'Microsoft'], ['https://www.nvidia.com', 'nvidia', 'NVIDIA'], ['https://nebius.com', 'nebius', 'Nebius'],
];

/* a picture that steps aside when it cannot load, so the tinted plate behind it reads as intended */
function Img({ className, fallback = null, ...p }) {
  const [bad, setBad] = useState(false);
  const ref = useRef(null);
  useEffect(() => { const i = ref.current; if (i && i.complete && !i.naturalWidth) setBad(true); }, []); // failed before hydration
  if (bad) return fallback;
  return <img ref={ref} className={className} {...p} onError={() => setBad(true)} />;
}

/* The signature: one case at a time on a big plate; it wipes to the next by itself, and opens into its story. */
function Plate() {
  const box = useRef(null);
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const seen = useInView(box, { amount: 0.25 });
  const calm = useReducedMotion();
  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % CASES.length), 5200);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen]);
  const { scrollYProgress } = useScroll({ target: box, offset: ['start end', 'start 0.25'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  return (
    <div className="xcu-stage" ref={box}>
      <motion.div className="xcu-plate" style={{ scale }}>
        {CASES.map((c, i) => (
          <motion.div key={c.name} className={'xcu-case ' + c.tone} aria-hidden={i !== at ? true : undefined} inert={i !== at}
            initial={false}
            animate={{ clipPath: i === at ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 0% 100%)', zIndex: i === at ? 2 : 1 }}
            transition={{ clipPath: { duration: i === at ? 1.1 : 0.01, delay: i === at ? 0 : 1.1, ease: [0.76, 0, 0.24, 1] } }}>
            <A to={c.to} className="xcu-case-a">
              <span className="xcu-ph" data-morph><Img src={c.img} alt={c.alt} loading={i ? 'lazy' : 'eager'} /></span>
              <span className="xcu-case-top">
                <Img className="xcu-mark" src={c.logo} alt="" fallback={<span className="xcu-alt">{c.name}</span>} />
                <span className="vc-kick vc-num">{c.year}</span>
              </span>
              <span className="xcu-case-in">
                <span className="xcu-fig"><b className="vc-num">{c.n}</b><span>{c.w}</span></span>
                <span className="xcu-case-r">
                  <h3>{c.name}</h3>
                  <span className="xcu-case-d">{c.d}</span>
                  <span className="xcu-open">Read the case study<i aria-hidden="true">→</i></span>
                </span>
              </span>
            </A>
          </motion.div>
        ))}
      </motion.div>
      <div className="xcu-tabs" role="tablist" aria-label="Case studies">
        {CASES.map((c, i) => (
          <button key={c.name} type="button" role="tab" aria-selected={i === at} onClick={() => { setMine(true); setAt(i); }}>
            <span className="vc-num">{String(i + 1).padStart(2, '0')}</span>
            <b>{c.name}</b>
            <i aria-hidden="true">{i === at && <u key={at + (mine ? 'm' : '')} className={mine || calm ? 'done' : 'run'} />}</i>
          </button>
        ))}
      </div>
    </div>
  );
}

function Row({ l, off }) {
  return (
    <li id={l.id} className="xcu-row" hidden={off}>
      <span className="xcu-row-y vc-num">{l.year || '—'}</span>
      <div className="xcu-row-n">
        <h3>{l.name}</h3>
        <span className="vc-kick acc">{l.kind}</span>
        {l.logo && <span className="xcu-row-logo" aria-hidden="true"><Img src={'/logos/customers/' + l.logo} alt="" loading="lazy" /></span>}
      </div>
      <p className="xcu-row-d">{l.d}</p>
      <div className="xcu-row-f">
        {l.f.length > 0 && <dl>{l.f.map(([n, w]) => <div key={w}><dt className="vc-num">{n}</dt><dd>{w}</dd></div>)}</dl>}
      </div>
    </li>
  );
}

function Every() {
  const [year, setYear] = useState(null);
  const rows = year ? BY[year] : ORDER;
  return (
    <section className="vc-sec xcu-every" id="every" aria-labelledby="xcu-every-h">
      <div className="vc-grid xcu-every-g">
        <h2 id="xcu-every-h" className="vc-display s">Every launch</h2>
        <div className="xcu-years" role="group" aria-label="Launches by year">
          <button type="button" aria-pressed={!year} onClick={() => setYear(null)}><b>All</b><span className="vc-num">{LAUNCHES.length}</span></button>
          {GROUPS.map((g) => (
            <button key={g} type="button" aria-pressed={year === g} onClick={() => setYear(year === g ? null : g)}
              aria-label={`${g}: ${BY[g].length} ${BY[g].length === 1 ? 'launch' : 'launches'}`}>
              <b className="vc-num">{g}</b>
              <span className="xcu-dots" aria-hidden="true">{BY[g].map((l) => <i key={l.id} />)}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="vc-wrap">
        <ol className="xcu-index" aria-live="polite">
          {ORDER.map((l) => <Row key={l.id} l={l} off={!rows.includes(l)} />)}
        </ol>
      </div>
    </section>
  );
}

export default function Customers() {
  return (
    <main className="vc xcu" style={{ '--acc': '#0e9f8e' }}>
      <section className="xcu-hero" aria-labelledby="xcu-h1">
        <div className="vc-grid xcu-hero-g">
          <motion.p className="vc-kick xcu-k" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: EASE }}>Customers</motion.p>
          <MaskLines as="h1" id="xcu-h1" now delay={0.05} lines={['Products Hanzo', 'built and launched']} className="vc-display xcu-h1" />
          <motion.p className="vc-lede xcu-lede" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease: EASE, delay: 0.6 }}>
            Hanzo built the store, ran the ads and found the audience for each of these launches. Here is what we did and what each one sold.
          </motion.p>
          <motion.h2 className="vc-kick acc xcu-k2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease: EASE, delay: 0.75 }}>Case studies</motion.h2>
        </div>
        <motion.div className="vc-wrap" initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.3, ease: EASE, delay: 0.3 }}>
          <Plate />
        </motion.div>
      </section>

      <Every />

      <section className="vc-sec xcu-back" aria-labelledby="xcu-back-h">
        <div className="vc-grid xcu-back-g">
          <div className="xcu-back-h">
            <h2 id="xcu-back-h" className="vc-headline">Backed by builders.</h2>
            <A to="https://www.techstars.com" className="xcu-ts" aria-label="Techstars"><Img src="/logos/partners/techstars.svg" alt="Techstars logo" fallback={<span className="xcu-alt">Techstars</span>} /></A>
          </div>
          <div className="xcu-belt" aria-label="Clouds">
            <ul className="xcu-belt-in">
              {[0, 1].map((k) => BACKERS.map(([u, f, n]) => (
                <li key={k + f} aria-hidden={k ? true : undefined}>
                  <A to={u} tabIndex={k ? -1 : undefined}><Img src={`/logos/partners/${f}.svg`} alt={k ? '' : n + ' logo'} fallback={<span className="xcu-alt">{n}</span>} /></A>
                </li>
              )))}
            </ul>
          </div>
        </div>
      </section>

      <section className="xcu-close" data-room="dark" aria-labelledby="xcu-close-h">
        <div className="vc-grid xcu-close-g">
          <MaskLines id="xcu-close-h" lines={['Launch with us']} className="vc-display" />
          <A to="/contact" className="xcu-close-a" data-thumb="Talk to us"><span>Talk to us</span><i aria-hidden="true">→</i></A>
        </div>
      </section>
    </main>
  );
}
