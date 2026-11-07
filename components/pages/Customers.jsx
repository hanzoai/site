'use client';
/* /customers. V2: 8/10 (v3 pass, JAMES.md): no hues and no eyebrows. A two-line kinetic headline with its one ask, over
   one big case plate whose colour is the case's own picture; every launch as an editorial index whose rows hand a
   preview to the pointer; a still wall of the builders behind Hanzo; one dark closing room with a living Sigil.
   Persona: enterprise buyer in the Buy journey, checking what Hanzo has launched before talking to it (PLAN 1.1).
   Goal: see what Hanzo built and what each launch sold, then talk to Hanzo.
   CTA: "Talk to us" (/contact), hero, the shared sticky ask bar (data-thumb) and close; data-cta customers.hero / customers.close; metric contact_sales_submit.
   Signature: the case plate. One case fills a 28px plate (its cover, logo and its own figure as the hero numeral); it
   wipes to the other case once by itself and rests; click it and the picture opens into its story (Morph).
   Supporting (3): masked headline cut-in, once; the index preview that follows the pointer on a spring; the year pill
   gliding between years (layoutId). Ambient: the closing room's Sigil drifts from the launch figures.
   Beyond: a year index over Hanzo's own launch list: each year shows its launches as dots, and a tap narrows the index
   to that year (tap it again for every launch).
   Deletes: the 32s logo marquee (now a still wall), the teal accent, the invented "Read the case study" pill and the
   "All"/"Undated" chips, the plate's scroll scaling, the kickers above the h1 and the plate, opacity:0 arrival states. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useSpring } from 'motion/react';
import { A, Img } from '../kit';
import Sigil from '../Sigil';
import MaskLines from './company/MaskLines';
import '../v2/vc-type.css';
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

// years exactly as the case copy prints them; launches without one keep Hanzo's order at the end of the index
const YEARS = [...new Set(LAUNCHES.map((l) => l.year).filter(Boolean))].sort();
const ORDER = [...YEARS.flatMap((y) => LAUNCHES.filter((l) => l.year === y)), ...LAUNCHES.filter((l) => !l.year)];

const BACKERS = [
  ['https://aws.amazon.com', 'amazon', 'Amazon'], ['https://www.digitalocean.com', 'digitalocean', 'DigitalOcean'], ['https://cloud.google.com', 'google', 'Google'],
  ['https://azure.microsoft.com', 'microsoft', 'Microsoft'], ['https://www.nvidia.com', 'nvidia', 'NVIDIA'], ['https://nebius.com', 'nebius', 'Nebius'],
];
// every figure the launch list prints, as plain numbers, for the closing room's Sigil (the heights of its hills)
const FIGURES = [8.4, 7, 2.5, 3.3, 250000, 135, 70000, 120000, 500, 650, 150, 169, 82];

/* A picture from Hanzo's media that steps aside for its fallback when it cannot load (PLAN 2.17 media failure). */
function Pic({ fallback = null, ...p }) {
  const [bad, setBad] = useState(false);
  const ref = useRef(null);
  useEffect(() => { const i = ref.current; if (i && i.complete && !i.naturalWidth) setBad(true); }, []);
  if (bad) return fallback;
  return <Img ref={ref} {...p} onError={() => setBad(true)} />;
}

/* The signature: one case at a time on a big plate. It wipes to the next once by itself, then rests. */
function Plate() {
  const box = useRef(null);
  const [at, setAt] = useState(0);
  const [steps, setSteps] = useState(0);
  const [mine, setMine] = useState(false);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const rest = mine || calm || steps >= CASES.length; // one full turn, then it rests on the first case
  useEffect(() => {
    if (rest || !seen) return;
    const t = setTimeout(() => { setAt((v) => (v + 1) % CASES.length); setSteps((s) => s + 1); }, 5200);
    return () => clearTimeout(t);
  }, [at, rest, seen]);
  return (
    <div className="xcu-stage" ref={box}>
      <div className="xcu-plate">
        {CASES.map((c, i) => (
          <motion.div key={c.name} className="xcu-case" aria-hidden={i !== at ? true : undefined} inert={i !== at}
            initial={false}
            animate={{ clipPath: i === at ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 0% 100%)', zIndex: i === at ? 2 : 1 }}
            transition={{ clipPath: { duration: i === at ? 1.1 : 0.01, delay: i === at ? 0 : 1.1, ease: [0.76, 0, 0.24, 1] } }}>
            <A to={c.to} className="xcu-case-a">
              <span className="xcu-ph" data-morph>
                <Pic src={c.img} alt={c.alt} w={1600} h={840} priority={i === 0}
                  fallback={<span className="xcu-ph-s"><Sigil seed={c.to} data={[parseFloat(c.n.replace(/[^\d.]/g, ''))]} /></span>} />
              </span>
              <span className="xcu-case-top">
                <Pic className="xcu-mark" src={c.logo} alt="" w={180} h={28} fallback={<span className="xcu-alt">{c.name}</span>} />
                <span className="vc-kick vc-num">{c.year}</span>
              </span>
              <span className="xcu-case-in">
                <span className="xcu-fig"><b className="vc-num">{c.n}</b><span>{c.w}</span></span>
                <span className="xcu-case-r">
                  <h3>{c.name}</h3>
                  <span className="xcu-case-d">{c.d}</span>
                </span>
                <span className="xcu-go" aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="20" height="20"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </span>
            </A>
          </motion.div>
        ))}
      </div>
      <div className="xcu-tabs">
        <h2 className="xcu-cs">Case studies</h2>
        <div role="tablist" aria-label="Case studies">
          {CASES.map((c, i) => (
            <button key={c.name} type="button" role="tab" aria-selected={i === at} onClick={() => { setMine(true); setAt(i); }}>
              <span className="vc-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <b>{c.name}</b>
              <i aria-hidden="true">{i === at && <u key={at + (mine ? 'm' : '')} className={rest ? 'done' : 'run'} />}</i>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ l, off, onLook }) {
  return (
    <li id={l.id} className="xcu-row" hidden={off} onPointerEnter={() => onLook(l)}>
      <span className="xcu-row-y vc-num">{l.year || '—'}</span>
      <div className="xcu-row-n">
        <h3>{l.name}</h3>
        <span className="xcu-kind">{l.kind}</span>
        {l.logo && <span className="xcu-row-logo" aria-hidden="true"><Pic src={'/logos/customers/' + l.logo} alt="" w={130} h={24} /></span>}
      </div>
      <p className="xcu-row-d">{l.d}</p>
      <div className="xcu-row-f">
        {l.f.length > 0 && <dl>{l.f.map(([n, w]) => <div key={w}><dt className="vc-num">{n}</dt><dd>{w}</dd></div>)}</dl>}
      </div>
    </li>
  );
}

/* The preview the pointer carries along the index: the launch's logo on a plate, and its first figure. */
function Preview({ l, x, y }) {
  return (
    <motion.div className="xcu-pv" style={{ x, y }} aria-hidden="true" data-on={!!l}>
      {l && (
        <motion.div key={l.id} className="xcu-pv-in" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
          <span className="xcu-pv-logo">{l.logo ? <Pic src={'/logos/customers/' + l.logo} alt="" w={200} h={48} fallback={<b>{l.name}</b>} /> : <b>{l.name}</b>}</span>
          {l.f[0] ? <span className="xcu-pv-f"><b className="vc-num">{l.f[0][0]}</b><span>{l.f[0][1]}</span></span> : <span className="xcu-pv-f"><span>{l.kind}</span></span>}
        </motion.div>
      )}
    </motion.div>
  );
}

function Every() {
  const [year, setYear] = useState(null);
  const [look, setLook] = useState(null);
  const wrap = useRef(null);
  const x = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });
  const move = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = wrap.current.getBoundingClientRect();
    x.set(Math.min(r.width - 300, Math.max(0, e.clientX - r.left + 28)));
    y.set(e.clientY - r.top - 90);
  };
  return (
    <section className="vc-sec xcu-every" id="every" aria-labelledby="xcu-every-h">
      <div className="vc-grid xcu-every-g">
        <h2 id="xcu-every-h" className="vc-display s">Every launch</h2>
        <div className="xcu-years" role="group" aria-labelledby="xcu-every-h">
          {YEARS.map((g) => {
            const n = LAUNCHES.filter((l) => l.year === g).length;
            const on = year === g;
            return (
              <button key={g} type="button" aria-pressed={on} onClick={() => setYear(on ? null : g)} aria-label={`${g}: ${n} ${n === 1 ? 'launch' : 'launches'}`}>
                {on && <motion.span layoutId="xcu-pill" className="xcu-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <b className="vc-num">{g}</b>
                <span className="xcu-dots" aria-hidden="true">{Array.from({ length: n }, (_, k) => <i key={k} />)}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="vc-wrap xcu-index-w" ref={wrap} onPointerMove={move} onPointerLeave={() => setLook(null)}>
        <ol className="xcu-index" aria-live="polite">
          {ORDER.map((l) => <Row key={l.id} l={l} off={!!year && l.year !== year} onLook={setLook} />)}
        </ol>
        <Preview l={look} x={x} y={y} />
      </div>
    </section>
  );
}

export default function Customers() {
  return (
    <main className="vc xcu" style={{ '--acc': '#1d1d1f' }}>
      <section className="xcu-hero" aria-label="Customers" data-ask-name="Customers">
        <div className="vc-grid xcu-hero-g">
          <MaskLines as="h1" id="xcu-h1" now delay={0.05} lines={['Products Hanzo', 'built and launched']} className="vc-display xcu-h1" />
          <p className="vc-lede xcu-lede xcu-in">Hanzo built the store, ran the ads and found the audience for each of these launches. Here is what we did and what each one sold.</p>
          <div className="xcu-hero-a xcu-in"><A to="/contact" className="xcu-cta" data-thumb="Talk to us" data-cta="customers.hero">Talk to us</A></div>
        </div>
        <div className="vc-wrap xcu-in2"><Plate /></div>
      </section>

      <Every />

      <section className="vc-sec xcu-back" aria-labelledby="xcu-back-h">
        <div className="vc-grid xcu-back-g">
          <h2 id="xcu-back-h" className="vc-headline">Backed by builders.</h2>
          <ul className="xcu-wall">
            <li className="ts"><A to="https://www.techstars.com" aria-label="Techstars"><Pic src="/logos/partners/techstars.svg" alt="Techstars logo" w={160} h={34} fallback={<span className="xcu-alt">Techstars</span>} /></A></li>
            {BACKERS.map(([u, f, n]) => (
              <li key={f}><A to={u}><Pic src={`/logos/partners/${f}.svg`} alt={n + ' logo'} w={140} h={28} fallback={<span className="xcu-alt">{n}</span>} /></A></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="xcu-close" data-room="dark" aria-labelledby="xcu-close-h">
        <div className="xcu-close-s" aria-hidden="true"><Sigil seed="/customers" data={FIGURES} /></div>
        <div className="vc-grid xcu-close-g">
          <MaskLines id="xcu-close-h" lines={['Launch with us']} className="vc-display" />
          <A to="/contact" className="xcu-cta lt" data-thumb="Talk to us" data-cta="customers.close">Talk to us</A>
        </div>
      </section>
    </main>
  );
}
