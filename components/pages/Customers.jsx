'use client';
// Persona: enterprise buyer in the Buy journey, checking what Hanzo has launched before talking to it
// Goal: see what Hanzo built and what each launch sold, then talk to Hanzo
// CTA: "Talk to us" (/contact), data-cta customers.hero / customers.close; metric contact_sales_submit
// Signature: word-light (Words light up): Hanzo's lede, set as the page's long statement right under the headline, lights word by word as it is read
// Entrances: cursor-lens, underline-sweep, curtain-rise, magnet-gather, rack-focus
// Beyond: a year index over Hanzo's own launch list that narrows the index to one year
// V2: 8/10 motion map (7 Nov): the statement lights word by word, five sections arrive five ways (lens, sweep, curtain, gather, focus), the pinned stage and the sticky phone strip are gone (rows carry their own figures, which rise as they are read), scale rests at h1 52 / headings 26 / names 21
/* /customers (v4, MOTION-MAP). No hues, no eyebrows.
   Order: the headline and its ask (it opens out of a round lens; a lens then follows the cursor over it), the
   statement (Hanzo's lede, lit word by word as it is read: the signature), the case plate (its key words underlined in
   sequence on arrival; it still turns Damon, KANOA, Damon, then rests, and opens into its story), every launch (a year
   filter and rows that rise from below like curtains; each row's figures rise as the row reaches the middle), Hanzo's
   builders (scattered names pulled together), and the dark close (it pulls into focus; the launch figures slide by).
   Kept: every hover and press, the plate's turn and line, the year filter's gliding pill and layout glide, the figure
   rises, the close's sliding figures. Deleted: the pinned launch stage and the phone's sticky figure strip (the map
   gives this page no `split`), the line-mask cut-in on the close heading, the lede's and plate's fade-ups. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { useCalm } from '../ui';
import { useRouter } from 'next/navigation';
import { A, Img, Tabs } from '../kit';
import Sigil from '../Sigil';
import MaskLines from './company/MaskLines';
import useArrived from './company/useArrived';
import { openDoor } from './doorway';
import { useEnterAll, WordLight, Lens } from './customers/enter';
import '../v2/vc-type.css';
import './company/deck.css';
import './Customers.css';

const EASE = [0.16, 1, 0.3, 1];
const H1 = ['Products Hanzo', 'built and launched'];
const LEDE = 'Hanzo built the store, ran the ads and found the audience for each of these launches. Here is what we did and what each one sold.';
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

// years exactly as the case copy prints them; the index keeps Hanzo's own order (SKULLY first, as on hanzo.ai)
const YEARS = [...new Set(LAUNCHES.map((l) => l.year).filter(Boolean))].sort();
const ORDER = LAUNCHES;
// the doorway's hold is capped (MASTER part 9): if the case page has not lifted the ink by then, cut to it
const door = (e, to, router) => {
  openDoor(e, to, router, '#0a0a0a');
  setTimeout(() => document.querySelectorAll('[data-door]').forEach((d) => { if (!d.dataset.landing) d.remove(); }), 640 + 700);
};
// JS off: both cases show stacked and readable; the row figures stand in place
const NOJS = { __html: '<style>.xcu-plate{aspect-ratio:auto!important}.xcu-case{position:relative!important;clip-path:none!important;aspect-ratio:16/8.4}.xcu-case-txt{opacity:1!important}.xcu-row-f dt,.xcu-row-f dd{transform:none!important}.xcu-line{display:none}.xcu-mark{display:none}.xcu-ph img{color:transparent}@media (max-width:899px){.xcu-case{aspect-ratio:4/5.4}}</style>' };
const FIGS = LAUNCHES.flatMap((l) => l.f.map(([n]) => n));

// Hanzo's own list, as live shows it (the same names and links as /investors; a shared module is the Data chat's, PLAN 2.5)
const BACKERS = [
  ['https://aws.amazon.com', 'amazon', 'Amazon'], ['https://www.digitalocean.com', 'digitalocean', 'DigitalOcean'], ['https://cloud.google.com', 'google', 'Google'],
  ['https://azure.microsoft.com', 'microsoft', 'Microsoft'], ['https://www.nvidia.com', 'nvidia', 'NVIDIA'], ['https://nebius.com', 'nebius', 'Nebius'],
];
// magnet-gather: where each name starts, scattered (fixed values, so server and client agree)
const SCATTER = [[-160, -70, -9], [120, 90, 7], [-60, 120, 5], [200, -60, -6], [-220, 40, 8], [80, -110, -5], [160, 70, 9]];
const scatter = (k) => { const [x, y, r] = SCATTER[k % SCATTER.length]; return { '--k': k, '--mx': x + 'px', '--my': y + 'px', '--mr': r + 'deg' }; };

/* A picture from Hanzo's media that steps aside for its fallback when it cannot load (PLAN 2.17 media failure). */
function Pic({ fallback = null, ...p }) {
  const [bad, setBad] = useState(false);
  const ref = useRef(null);
  useEffect(() => { const i = ref.current; if (i && i.complete && !i.naturalWidth) setBad(true); }, []);
  if (bad) return fallback;
  return <Img ref={ref} {...p} onError={() => setBad(true)} />;
}

/* One case at a time on a big plate. Once the curtain is up its line fills; it wipes to the other case once, then rests. */
function Plate() {
  const router = useRouter();
  const box = useRef(null);
  const ok = useArrived();
  const [at, setAt] = useState(0);
  const [steps, setSteps] = useState(0);
  const [mine, setMine] = useState(false);
  const seen = useInView(box, { amount: 0.12 });
  const calm = useCalm();
  const rest = mine || calm || steps >= CASES.length;
  const run = ok && seen && !rest;
  useEffect(() => {
    if (!run) return;
    const t = setTimeout(() => { setAt((v) => (v + 1) % CASES.length); setSteps((s) => s + 1); }, 5200);
    return () => clearTimeout(t);
  }, [at, run]);
  return (
    <div className="xcu-stage" ref={box}>
      <div className="xcu-plate">
        <span className="xcu-line" aria-hidden="true">
          {CASES.map((c, i) => <i key={c.name}>{(i < at || (i === at && rest)) && <u className="done" />}{i === at && run && <u key={at} className="run" />}</i>)}
        </span>
        {CASES.map((c, i) => (
          <motion.div key={c.name} className={'xcu-case t' + i} role="tabpanel" id={`xcu-case-panel-${i}`} aria-labelledby={`xcu-case-tab-${i}`}
            aria-hidden={i !== at ? true : undefined} inert={i !== at}
            initial={false}
            animate={{ clipPath: i === at ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 0% 100%)', zIndex: i === at ? 2 : 1 }}
            transition={{ clipPath: { duration: i === at ? 1.1 : 0.01, delay: i === at ? 0 : 1.1, ease: [0.76, 0, 0.24, 1] } }}>
            <A to={c.to} className="xcu-case-a" data-no-morph onClick={(e) => door(e, c.to, router)}>
              <span className="xcu-ph">
                <Pic src={c.img} alt={c.alt} w={1600} h={840} priority={i === 0}
                  fallback={<span className="xcu-ph-s"><Sigil seed={c.to} data={[parseFloat(c.n.replace(/[^\d.]/g, ''))]} /></span>} />
              </span>
              <motion.span className="xcu-case-txt" initial={false} animate={{ opacity: i === at ? 1 : 0 }}
                transition={i === at ? { duration: 0.4, delay: 0.25, ease: EASE } : { duration: 0.15 }}>
                <span className="xcu-case-top">
                  {/* a missing logo leaves the corner to the year: the h3 below already names the case, never twice */}
                  <Pic className="xcu-mark" src={c.logo} alt="" w={180} h={28} fallback={<span />} />
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
              </motion.span>
            </A>
          </motion.div>
        ))}
      </div>
      <div className="xcu-tabs">
        <h2 className="xcu-cs" id="xcu-cs">Case studies</h2>
        <Tabs id="xcu-case" tabs={CASES.map((c) => c.name)} value={at} onChange={(i) => { setMine(true); setAt(i); }} label="Case studies" />
      </div>
    </div>
  );
}

function Every() {
  const box = useRef(null);
  const [year, setYear] = useState(null);
  const shown = year ? ORDER.filter((l) => l.year === year) : ORDER;
  const [at, setAt] = useState(ORDER[0].id);
  const [read, setRead] = useState(() => new Set());
  const rows = useRef({});
  useEnterAll(box, '[data-e="curtain"]');
  useEffect(() => { setRead((r) => (r.has(at) ? r : new Set(r).add(at))); }, [at]);
  useEffect(() => { setAt(shown[0].id); }, [year]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    // the row crossing the middle of the screen is the one being read: its figures rise into place (once)
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setAt(e.target.id); }), { rootMargin: '-50% 0px -50% 0px' });
    shown.forEach((l) => rows.current[l.id] && io.observe(rows.current[l.id]));
    return () => io.disconnect();
  }, [year]); // eslint-disable-line react-hooks/exhaustive-deps
  const cur = shown.find((l) => l.id === at) || shown[0];
  const rail = useRef(null);
  useEffect(() => {
    // phones: the year rail keeps the year being read in view
    const r = rail.current, c = r && r.querySelector('button.here');
    if (c && r.scrollWidth > r.clientWidth) r.scrollTo({ left: Math.max(0, c.offsetLeft - 20), behavior: 'smooth' });
  }, [cur.year]);
  return (
    <section className="vc-sec xcu-every" id="every" aria-labelledby="xcu-every-h" ref={box}>
      <noscript dangerouslySetInnerHTML={NOJS} />
      <div className="vc-grid xcu-every-g">
        <h2 id="xcu-every-h" className="vc-headline" data-e="curtain">Every launch</h2>
        <div className="xcu-years" role="group" aria-labelledby="xcu-every-h" ref={rail} data-e="curtain">
          {YEARS.map((g) => {
            const n = LAUNCHES.filter((l) => l.year === g).length;
            const on = year === g;
            return (
              <button key={g} type="button" aria-pressed={on} className={cur.year === g ? 'here' : ''} onClick={() => setYear(on ? null : g)} aria-label={`${g}: ${n} ${n === 1 ? 'launch' : 'launches'}`}>
                {on && <motion.span layoutId="xcu-pill" className="xcu-pill" transition={{ duration: 0.3, ease: EASE }} />}
                <b className="vc-num">{g}</b>
                <span className="xcu-dots" aria-hidden="true">{Array.from({ length: n }, (_, k) => <i key={k} />)}</span>
              </button>
            );
          })}
        </div>
        <p className="x-sr" role="status">{year ? `${year}: ${shown.length} ${shown.length === 1 ? 'launch' : 'launches'}` : ''}</p>
        <ol className="xcu-index">
          {ORDER.map((l) => (
            <motion.li layout="position" transition={{ duration: 0.3, ease: EASE }} key={l.id} id={l.id} data-e="curtain"
              ref={(el) => { rows.current[l.id] = el; }} className={'xcu-row' + (l.id === cur.id ? ' on' : '') + (read.has(l.id) ? ' read' : '')}
              hidden={!!year && l.year !== year} onPointerEnter={(e) => { if (e.pointerType === 'mouse') setAt(l.id); }}>
              <span className="xcu-row-y vc-num">{l.year || <span aria-hidden="true">—</span>}</span>
              <div className="xcu-row-n">
                <h3>{l.name}</h3>
                <span className="xcu-kind">{l.kind}</span>
              </div>
              <p className="xcu-row-d">{l.d}</p>
              {l.f.length > 0 ? <dl className="xcu-row-f">{l.f.map(([n, w]) => <div key={w}><dt className="vc-num">{n}</dt><dd>{w}</dd></div>)}</dl> : <span className="xcu-row-f0" aria-hidden="true" />}
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* The close: Hanzo's launch figures in two rows that slide past each other as the room scrolls by. */
function Close() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const a = useTransform(scrollYProgress, [0, 1], ['0%', '-22%']);
  const b = useTransform(scrollYProgress, [0, 1], ['-22%', '0%']);
  const half = Math.ceil(FIGS.length / 2);
  return (
    <section className="xcu-close" data-room="dark" data-e="focus" aria-labelledby="xcu-close-h" ref={ref}>
      <div className="xcu-figs" aria-hidden="true">
        <motion.span style={{ x: a }}>{[...FIGS.slice(0, half), ...FIGS.slice(0, half)].map((n, i) => <b key={i}>{n}</b>)}</motion.span>
        <motion.span style={{ x: b }}>{[...FIGS.slice(half), ...FIGS.slice(half)].map((n, i) => <b key={i}>{n}</b>)}</motion.span>
      </div>
      <div className="vc-grid xcu-close-g">
        <h2 id="xcu-close-h" className="vc-display">Launch with us</h2>
        <A to="/contact" className="xcu-cta lt" data-thumb="Talk to us" data-cta="customers.close">Talk to us</A>
      </div>
    </section>
  );
}

export default function Customers() {
  const root = useRef(null);
  useEnterAll(root, '.xcu-cases, .xcu-wall, .xcu-close');
  return (
    <main className="vc xcu" style={{ '--acc': '#0a0a0a' }} ref={root}>
      <section className="xcu-hero" aria-label="Customers" data-ask-name="Customers">
        <div className="vc-grid xcu-hero-g">
          <MaskLines as="h1" id="xcu-h1" now delay={0.05} lines={H1} className="vc-display xcu-h1" />
          <Lens lines={H1} />
          <div className="xcu-hero-f">
            <A to="/contact" className="xcu-cta" data-thumb="Talk to us" data-cta="customers.hero">Talk to us</A>
          </div>
        </div>
      </section>

      <section className="xcu-say" aria-label="Customers">
        <div className="vc-grid"><WordLight text={LEDE} className="vc-lede xcu-lede" /></div>
      </section>

      <section className="xcu-cases" aria-labelledby="xcu-cs">
        <div className="vc-wrap"><Plate /></div>
      </section>

      <Every />

      <section className="vc-sec xcu-back" aria-labelledby="xcu-back-h">
        <div className="vc-grid xcu-back-g">
          <h2 id="xcu-back-h" className="vc-headline">Backed by builders.</h2>
          <ul className="xcu-wall">
            <li className="ts" style={scatter(0)}><A to="https://www.techstars.com" aria-label="Techstars"><Pic src="/logos/partners/techstars.svg" alt="Techstars logo" w={160} h={34} fallback={<span className="xcu-alt">Techstars</span>} /></A></li>
            {BACKERS.map(([u, f, n], k) => (
              <li key={f} style={scatter(k + 1)}><A to={u}><Pic src={`/logos/partners/${f}.svg`} alt={n + ' logo'} w={140} h={28} fallback={<span className="xcu-alt">{n}</span>} /></A></li>
            ))}
          </ul>
        </div>
      </section>

      <Close />
    </main>
  );
}
