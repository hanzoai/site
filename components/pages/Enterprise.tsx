'use client';
/* Enterprise, v2 (VISION archetype B, System: a map you travel; the calm trust of chatgpt.com/business/enterprise;
   PLAN-COMPONENTS 5.3).
   V2: 7.5/10 MOTION-MAP pass: the pinned four-walls chapter is gone; the hero is Hanzo's workspace writing its audit log inside the four walls (unpinned); the four places are rows that open in place (signature); five entrances, one per section; review fixes kept (hero in server HTML, quiet ledger, figures rest small, 44px phone links, no 404 logos, no hydration mismatch)
   Persona: an IT, security or platform lead choosing where Hanzo runs. Goal: see it runs where you need it, and that
   you can verify it. CTA: "Get Enterprise plan" (data-cta enterprise.hero, the page's ask) and one "Talk to sales" in
   the closing Band; metric: cta_click on enterprise.hero and the Band.
   Thesis: it runs where you need it, and you can verify it.
   Hero object: Hanzo's own workspace, open on its audit log and writing (who acted, from where, what they called, the
   status it returned), inside four walls (Hanzo Cloud, your cloud, your servers, air-gapped) that turn while idle.
   Signature (rows-open, second screen): the four places as a tight list; a row opens in place on hover (fine pointers)
   or tap into its full detail (the walls with that place solid, what it means, where it sits); the rows below slide.
   Entrances (enterprise/enter.jsx, in page order): scramble (the places), snap-sections (results), inertia-drag
   (includes), diagonal-wipe (security), line-draw (your own GPUs).
   Beyond: the prefill instrument. Pick a prompt size and read the prefill time and rate Hanzo measured for Zen 6 on one
   DGX Spark, against every other size on one bar chart.
   Removed (ledger): the repeated deployment block ("Which wall is yours"), the second sales button in it, the long dark
   GPU room (now a drawer), the kicker above the h1, and the second dark room (the Band is the one). Every word and
   figure is Hanzo's. */
// Persona: an IT, security or platform lead choosing where Hanzo runs
// Goal: see it runs where you need it, and that you can verify it
// CTA: Get Enterprise plan (hero, then the header's solid ask on desktop / the phone ask bar, and the Band); metric: cta_click on enterprise.hero and enterprise.band
// Signature: rows-open (Rows that open): the four places, a tight list whose rows open in place on hover or tap into a full detail panel
// Entrances: scramble, snap-sections, inertia-drag, diagonal-wipe, line-draw
// Beyond: the prefill instrument: pick a prompt size and read Hanzo's measured prefill time and rate for Zen 6 on one DGX Spark
import { useEffect, useRef, useState } from 'react';
import { useCallback } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { motion, animate, AnimatePresence, LayoutGroup, useInView, useMotionValue, useReducedMotion } from 'motion/react';
import { Enter, useEnter, Scramble } from './enterprise/enter';
import { EASE } from '../ui';
import { A, More, Cta, Faq, Film, Img, DataTable, Band } from '../kit';
import Drawer from '../v2/x-cannon/Drawer';
import { press } from '../../lib/press';
import { capture } from '../../lib/track';
import { PARTNERS, usd } from '../../lib/plans';
import './Enterprise.css';

const Check = ({ size = 18 }) => <svg className="xe-ck" viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="none" strokeWidth="1.5" /><path d="M7.5 12.5l3 3 6-6.5" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;

const PLACES: string[][] = [
  ['Hanzo Cloud', 'We run it for you', "Start today. On Hanzo Base, your organization's data is its own database."],
  ['Your cloud', 'Inside your VPC', 'Hanzo runs in your own cloud account, on your network.'],
  ['Your servers', 'On premises', 'On hardware in your data center, beside the systems you already run.'],
  ['Air-gapped', 'Fully offline', 'Sealed inside your network, with models served on machines you control.'],
];

/* ---------- the workspace: Hanzo's audit log, writing ---------- */
// Hanzo's audit log records who acted, from where, what they called and the status it returned
const LOG: string[][] = [
  ['Member', 'Single sign-on', 'POST /v1/chat/completions', '200'],
  ['Service account', 'API key', 'POST /v1/decisions', '200'],
  ['SCIM 2.0', 'Your directory', 'Account created', '201'],
  ['Agent', 'Workspace', 'POST /v1/embeddings', '200'],
  ['Admin', 'Single sign-on', 'Project role granted', '200'],
  ['Service account', 'API key', 'POST /v1/chat/completions', '403'],
  ['SCIM 2.0', 'Your directory', 'Account updated', '200'],
  ['Member', 'Authenticator app', 'Second factor added', '200'],
  ['Agent', 'Workspace', 'POST /v1/chat/completions', '200'],
  ['SCIM 2.0', 'Your directory', 'Account removed', '204'],
];
const ROW = 44;
const mod = (a: number, n: number) => ((a % n) + n) % n;

function Workspace({ at }: { at: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { amount: 0.15 });
  const calm = useReducedMotion();
  const [n, setN] = useState(7);
  useEffect(() => {
    if (!seen || calm) return;
    // the first row lands at 0.9 s, then the log keeps writing at a calm pace while it is on screen
    let t = setTimeout(function tick() { setN((v) => v + 1); t = setTimeout(tick, 2600); }, 900);
    return () => clearTimeout(t);
  }, [seen, calm]);
  const rows = Array.from({ length: 9 }, (_, k) => ({ id: n - k, r: LOG[mod(n - k, LOG.length)] }));
  return (
    <div className="xe-win" ref={ref} aria-hidden="true">
      <div className="xe-win-bar">
        <i /><i /><i />
        <span className="xe-win-t">Hanzo Enterprise · Your company</span>
        <span className={'xe-where' + (at === 3 ? ' sealed' : '')}><b />{PLACES[at][0]}<em>{PLACES[at][1]}</em></span>
      </div>
      <div className="xe-win-body">
        <div className="xe-side">
          <span className="xe-org"><b>Y</b>Your company</span>
          {['Chat', 'Agents', 'Members', 'Audit log', 'Single sign-on'].map((t) => <span key={t} className={'xe-nav' + (t === 'Audit log' ? ' on' : '')}><i />{t}</span>)}
          <span className="xe-seats">Unlimited members</span>
        </div>
        <div className="xe-main">
          <div className="xe-main-h"><b>Audit log</b><span className="xe-live"><i />Live</span></div>
          <div className="xe-cols"><span>Who</span><span>From where</span><span>What</span><span>Status</span></div>
          <div className="xe-rows">
            {rows.map(({ id, r }, k) => (
              <div key={id} className={'xe-r' + (k === 0 && id > 7 ? ' new' : '') + (k > 7 ? ' gone' : '')} style={{ transform: `translateY(${k * ROW}px)` }}>
                <span className="xe-actor"><i>{r[0][0]}</i><span>{r[0]}</span></span>
                <span className="xe-from">{r[1]}</span>
                <code>{r[2]}</code>
                <span className={'xe-st s' + r[3][0]}>{r[3]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- the hero: the words, and Hanzo's workspace writing its audit log inside the four walls (unpinned) ---------- */
function Hero({ at: chosen, mine }: { at: number; mine: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const calm = useReducedMotion();
  // the walls turn by themselves while the hero is on screen; once a hand opens a place in the rows below, they show it
  const seen = useInView(ref, { amount: 0.3 });
  const [idle, setIdle] = useState(0);
  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setTimeout(() => setIdle((v) => (v + 1) % 4), 3600);
    return () => clearTimeout(t);
  }, [idle, mine, calm, seen]);
  const at = mine ? chosen : idle;

  const line = (t: string, d: number) => (
    <span className="xe-line"><span style={{ animationDelay: d + 's' }}>{t}</span></span>
  );

  return (
    <section className="xe-hero" ref={ref} aria-labelledby="xe-h1">
      <div className="xe-hero-g xe-w">
        <div className="xe-intro">
          <h1 id="xe-h1" className="xe-d">{line('Give every team AI.', 0)}{line('Run it where you choose.', 0.06)}</h1>
          <div className="xe-intro-row">
            <p className="xe-lede">
              Models, agents and one shared workspace for everyone in your company, in your cloud, on your servers or fully offline.
            </p>
            <div className="xe-acts">
              <Cta to="/enterprise/start" size="lg" id="enterprise.hero" thumb onClick={() => capture('enterprise_cta', { at: 'hero', to: 'start' })}>Get Enterprise plan</Cta>
              <Cta to="https://platform.hanzo.ai" kind="link" id="enterprise.platform" onClick={() => capture('enterprise_cta', { at: 'hero', to: 'platform' })}>Build on Hanzo Platform</Cta>
            </div>
          </div>
          {/* the trust strip, in the first screen (brief 5.3): Hanzo's three promises and where to verify them */}
          <div className="xe-trust">
            <ul className="xe-pills">
              {['Unlimited members', '24/7 engineering support', 'Runs fully offline'].map((t) => <li key={t}><Check size={15} />{t}</li>)}
            </ul>
            <div className="xe-trust-l"><More to="/security">How Hanzo is secured</More><More to="/trust">Trust center</More><More to="https://docs.hanzo.ai/docs/self-hosting">Self-hosting guide</More></div>
          </div>
        </div>

        <div className="xe-map" data-at={at}>
          <div className="xe-rings" aria-hidden="true">
            {PLACES.map((pl, i) => (
              <div key={pl[0]} className={'xe-ring' + (i === at ? ' on' : '')} style={{ '--i': i }}>
                <span className="xe-ring-l">{pl[0]}</span>
              </div>
            ))}
          </div>
          <div className="xe-seat"><Workspace at={at} /></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- the signature, rows that open: the four places as a tight list; a row opens in place on hover (fine
   pointers) or tap into its full detail: the walls with its own drawn solid, what it means, where it sits ---------- */
function Glyph({ at }: { at: number }) {
  return (
    <span className="xe-glyph" aria-hidden="true">
      {PLACES.map((pl, i) => <i key={pl[0]} className={i === at ? 'on' : i < at ? 'out' : undefined} style={{ inset: `${i * 12}%` }} />)}
      <b />
    </span>
  );
}

function Places({ at, open }: { at: number; open: (i: number) => void }) {
  const [ref, inn] = useEnter<HTMLElement>(0.25);
  const fine = useRef(false);
  useEffect(() => { fine.current = matchMedia('(hover: hover) and (pointer: fine)').matches; }, []);
  return (
    <section ref={ref} className={'xe-sec xe-places xe-en xe-en-scramble' + (inn ? ' in' : '')} aria-labelledby="xe-pl-h" data-ask-hide>
      <div className="xe-w">
        <header className="xe-head">
          <h2 id="xe-pl-h" className="xe-h"><Scramble text="Run it where your data lives." run={inn} /></h2>
          <p className="xe-l xe-soft">One platform, four places to run it. Choose one, or start in our cloud and move when you are ready.</p>
          <p className="xe-k xe-tag">Deployment</p>
        </header>
        <div className="xe-scale" aria-hidden="true"><span>Fastest start</span><span>Most control</span></div>
        <LayoutGroup>
          <ul className="xe-rows-l" role="list" aria-label="Where it runs">
            {PLACES.map((pl, i) => {
              const on = i === at;
              return (
                <motion.li key={pl[0]} layout="position" transition={{ layout: { duration: 0.4, ease: EASE } }} className={on ? 'on' : undefined} style={{ '--n': i }}
                  onPointerEnter={(e) => { if (e.pointerType === 'mouse' && fine.current) open(i); }}>
                  <h3 className="xe-row-h">
                    <button type="button" aria-expanded={on} aria-controls={'xe-pl-' + i} onClick={() => open(i)}>
                      <span className="x-mono">{String(i + 1).padStart(2, '0')}</span>
                      <span className="xe-row-n"><Scramble text={pl[0]} run={inn} delay={200 + i * 90} ms={500} /></span>
                      <span className="xe-row-s">{pl[1]}</span>
                      <span className="xe-row-x" aria-hidden="true" />
                    </button>
                  </h3>
                  <div className="xe-row-d" id={'xe-pl-' + i} hidden={!on}>
                    <Glyph at={i} />
                    <div className="xe-cap">
                      <p><b><span>{pl[1]}.</span></b> <span>{pl[2]}</span></p>
                      <p className="xe-cap-n"><span>Where it runs</span><span className="x-mono">{String(i + 1).padStart(2, '0')} / 04</span></p>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </LayoutGroup>
      </div>
    </section>
  );
}

// a pause control for a looping film (first in reading order of its tile, 44px, aria-pressed)
function PauseFilm() {
  const ref = useRef<HTMLButtonElement>(null);
  const calm = useReducedMotion();
  const [off, setOff] = useState(false);
  const [up, setUp] = useState(false); // the server cannot know reduced motion: decide after hydration, so both renders match
  useEffect(() => setUp(true), []);
  const first = useRef(true);
  useEffect(() => {
    const v = ref.current?.parentElement?.querySelector('video');
    if (!v) return;
    const hold = () => { if (off) v.pause(); };
    if (off) v.pause();
    else if (!first.current) v.play?.().catch(() => {});
    first.current = false;
    v.addEventListener('play', hold);
    return () => v.removeEventListener('play', hold);
  }, [off]);
  if (calm && up) return null; // under reduced motion the film never plays: its poster stands
  return (
    <button ref={ref} type="button" className="xe-pause" aria-pressed={off} aria-label="Pause" onClick={() => setOff((o) => !o)}>
      {off ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9l7.5-4.5z" fill="currentColor" /></svg>
        : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>}
    </button>
  );
}

/* ---------- what Enterprise includes: a tile grid, one idea a tile ---------- */
/* entrance 3, inertia-drag: the tiles are thrown in from the right and decay to rest; then they can be dragged and
   thrown (on phones a rail you fling through; on desktop the grid gives under the hand and settles back) */
function Includes() {
  const [ref, inn] = useEnter<HTMLElement>(0.15);
  const wrap = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  useEffect(() => {
    if (!inn || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    x.set(280);
    const a = animate(x, 0, { type: 'inertia', velocity: -1800, timeConstant: 320, modifyTarget: () => 0, restDelta: 0.5 });
    return () => a.stop();
  }, [inn, x]);
  return (
    <section ref={ref} className={'xe-sec xe-inc xe-en xe-en-inertia' + (inn ? ' in' : '')} aria-labelledby="xe-inc-h">
      <div className="xe-w">
        <header className="xe-head">
          <h2 id="xe-inc-h" className="xe-h">What Enterprise includes.</h2>
          <p className="xe-l xe-soft">Your own infrastructure, dedicated compute, and engineering support around the clock.</p>
          <p className="xe-k xe-tag">What you get</p>
        </header>
        <div className="xe-tiles-v" ref={wrap}>
        <motion.div className="xe-tiles" style={{ x }} drag="x" dragConstraints={wrap} dragElastic={0.25} dragTransition={{ power: 0.3, timeConstant: 320, bounceStiffness: 260, bounceDamping: 40 }}>
          <article className="xe-tile t-infra">
            <div className="xe-tile-walls" aria-hidden="true">
              {PLACES.map((pl, i) => <span key={pl[0]} style={{ inset: `${i * 10}% ${i * 8}%`, '--i': i }}><em>{pl[0]}</em></span>)}
              <b />
            </div>
            <h3>Your infrastructure</h3>
            <p>Run Hanzo in your cloud, on your own servers, or fully offline.</p>
          </article>
          <article className="xe-tile t-models">
            <Film className="xe-tile-m" src="/models/zen.webm" poster="/models/zen.webp" w={1200} h={1500} />
            <PauseFilm />
            <h3>Your own models</h3>
            <p>Train and host your own models, on your own data.</p>
          </article>
          <article className="xe-tile t-247">
            <p className="xe-tile-fig" aria-hidden="true">24/7</p>
            <h3>24/7 engineering support</h3>
            <p>Engineering support around the clock, and hands-on onboarding to get your teams started.</p>
          </article>
          <article className="xe-tile t-compute">
            <div className="xe-tile-gpus" aria-hidden="true">{Array.from({ length: 4 }).map((_, s) => <span key={s}>{Array.from({ length: 8 }).map((__, k) => <i key={k} />)}</span>)}</div>
            <h3>Dedicated compute</h3>
            <p>Compute set aside for your organization alone.</p>
          </article>
          <article className="xe-tile t-writing">
            <div className="xe-tile-doc" aria-hidden="true">
              <span><Check size={16} />Uptime guarantee</span>
              <span><Check size={16} />Security review</span>
              <i />
            </div>
            <h3>Commitments in writing</h3>
            <p>An uptime guarantee and a security review, both in your contract.</p>
          </article>
          <article className="xe-tile t-company">
            <div className="xe-tile-ui" aria-hidden="true">
              <span className="xe-chip">Single sign-on · OpenID Connect</span>
              <span className="xe-chip">SCIM 2.0</span>
              <span className="xe-chip">Organization</span><span className="xe-chip">Workspace</span><span className="xe-chip">Project</span>
              <span className="xe-chip on">Audit log</span>
            </div>
            <h3>Your whole company</h3>
            <p>Unlimited members, single sign-on, roles and an audit log.</p>
          </article>
        </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- the dark room: your own GPUs ---------- */
const PREFILL: [string, number, number][] = [['512 tokens', 1.9, 270], ['2,048 tokens', 0.8, 2658], ['8,192 tokens', 4.5, 1835], ['16,384 tokens', 9.6, 1701], ['32,768 tokens', 23.2, 1414]];
const TOP = 2658;

function Roll({ k, children }: { k: string; children?: ReactNode }) {
  return (
    <span className="xe-roll">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.b key={k} initial={{ y: '70%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-70%', opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>{children}</motion.b>
      </AnimatePresence>
    </span>
  );
}

function Prefill() {
  const [k, setK] = useState(1);
  const [hot, setHot] = useState(false); // the figures rest small and grow while a size is being picked
  const timer = useRef<ReturnType<typeof setTimeout> | 0>(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  const pick = (i: number) => { setMine(true); setK(i); setHot(true); clearTimeout(timer.current); timer.current = setTimeout(() => setHot(false), 1600); };
  // until a hand takes over, the instrument steps through the sizes by itself while it is on screen (figures at rest)
  const box = useRef<HTMLDivElement>(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  const [mine, setMine] = useState(false);
  useEffect(() => {
    if (!seen || mine || calm) return;
    const t = setTimeout(() => setK((v) => (v + 1) % PREFILL.length), 1800);
    return () => clearTimeout(t);
  }, [seen, mine, calm, k]);
  const [, t, r] = PREFILL[k];
  return (
    <div className={'xe-pf' + (hot ? ' hot' : '')} ref={box}>
      {/* entrance 5, line-draw: this outline draws itself, then the instrument fills (enterprise/enter.css) */}
      <svg className="xe-pf-line" aria-hidden="true"><rect x="1" y="1" rx="24" pathLength="1" /></svg>
      <div className="xe-pf-read">
        <p className="xe-k">Zen 6 on one DGX Spark, as Hanzo measured it</p>
        <div className="xe-pf-figs" aria-live={mine ? 'polite' : 'off'}>
          <div><span className="xe-pf-l">Prefill time</span><Roll k={'t' + k}>{t} s</Roll></div>
          <div><span className="xe-pf-l">Prefill rate</span><Roll k={'r' + k}>{r.toLocaleString('en-US')}</Roll><span className="xe-pf-u">tokens a second</span></div>
        </div>
      </div>
      <div className="xe-pf-chart" role="radiogroup" aria-label="Prompt">
        {PREFILL.map(([s, , rate], i) => (
          <button key={s} type="button" role="radio" aria-checked={k === i} onClick={() => pick(i)} onPointerEnter={(e) => e.pointerType === 'mouse' && pick(i)} data-cursor="">
            <span className="xe-pf-s">{s}</span>
            <i className="xe-pf-bar" style={{ '--n': i }}><b style={{ transform: `scaleX(${rate / TOP})` }} /></i>
            <span className="xe-pf-v x-mono">{rate.toLocaleString('en-US')}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Rack({ name, total, specs, guide, to }: { name: string; total: number; specs: [string, string][]; guide: string; to: string }) {
  return (
    <div className="xe-rack">
      <h3>{name}</h3>
      <p className="xe-rack-n">{total.toLocaleString('en-US')} GB</p>
      <p className="xe-rack-s">of GPU memory across four servers</p>
      <div className="xe-gpus" aria-hidden="true">{Array.from({ length: 4 }).map((_, s) => <span key={s}>{Array.from({ length: 8 }).map((__, k) => <i key={k} />)}</span>)}</div>
      <dl className="xe-specs">{specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      <More to={to}>{guide}</More>
    </div>
  );
}

// four 8-GPU servers, drawn: the 32 GPUs light one by one each time the card comes fully into view
function RackGlyph() {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { amount: 1, margin: '0px 0px -20% 0px' });
  return (
    <span ref={ref} className={'xe-rackglyph' + (seen ? ' on' : '')} aria-hidden="true">
      {Array.from({ length: 4 }, (_, s) => <span key={s}>{Array.from({ length: 8 }, (__, k) => <i key={k} style={{ '--k': s * 8 + k }} />)}</span>)}
    </span>
  );
}

/* Your own GPUs: the measurement in the open, the rack detail in a drawer that grows out of its card */
function Gpus() {
  const [src, setSrc] = useState<HTMLElement | null>(null);
  const open = useCallback((e: MouseEvent<HTMLElement>) => setSrc(e.currentTarget), []);
  const close = useCallback(() => setSrc(null), []);
  return (
    <Enter k="draw" className="xe-sec xe-gpu" amount={0.12} aria-labelledby="xe-gpu-h">
      <div className="xe-w">
        <header className="xe-head">
          <h2 id="xe-gpu-h" className="xe-h">Run the models on machines you own.</h2>
          <p className="xe-l xe-soft">Zen 6 runs on one DGX Spark. Zen 6 Max wants a rack of Blackwell servers. What we measured, and what a rack is made of.</p>
          <p className="xe-k xe-tag">Your own GPUs</p>
        </header>
        <Prefill />
        <p className="xe-note">A cold prompt of about that many tokens on a quiet box, measured Sep 20, 2026: NVIDIA DGX Spark (GB10), 121 GiB unified memory, shared with the benchmark&apos;s other jobs; zen6, NVFP4 with FP8 attention, weights 21.6 GiB (serve-spark-zen6.sh).</p>
        <div className="xe-links">
          <More to="https://www.nvidia.com/en-us/products/workstations/dgx-spark/">NVIDIA DGX Spark: GB10, 273 GB/s memory bandwidth</More>
          <More to="/benchmarks/zen-6">Zen 6 on three machines</More>
          <More to="/zen/zen6-max">Zen 6 Max</More>
        </div>
        <button type="button" className="xe-rackcard" onClick={open} aria-haspopup="dialog" data-cursor="">
          <span className="xe-rackcard-t">
            <span className="xe-rackcard-say">We recommend at least four 8-GPU NVIDIA Blackwell servers, B300 or B200, for Zen 6 Max on your own premises.</span>
            <span className="xe-k xe-tag">Zen 6 Max</span>
          </span>
          <RackGlyph />
          <span className="xe-rackcard-figs">
            <span><b>9,216 GB</b><small>DGX B300</small></span>
            <span><b>5,760 GB</b><small>DGX B200</small></span>
          </span>
          <span className="xe-rackcard-go" aria-hidden="true">+</span>
        </button>
      </div>
      <Drawer open={!!src} from={src} onClose={close} title="Run the models on machines you own." label="Your own GPUs">
        <div className="xe-drawer">
          <p className="xe-say">We recommend at least four 8-GPU NVIDIA Blackwell servers, B300 or B200, for Zen 6 Max on your own premises. Routing cuts the average inference work a request needs. It does not cut the memory needed to keep every specialist ready.</p>
          <div className="xe-racks">
            <Rack name="DGX B300" total={9216} specs={[['GPUs', '8 x B300'], ['GPU memory', '8 x 288 GB, 2,304 GB'], ['Cluster network', '8 x 800 Gb/s InfiniBand or Ethernet'], ['Data cache', '8 x 3.84 TB']]} guide="NVIDIA DGX B300 user guide: 8 x 288 GB GPU memory" to="https://docs.nvidia.com/dgx/dgxb300-user-guide/introduction-to-dgxb300.html" />
            <Rack name="DGX B200" total={5760} specs={[['GPUs', '8 x B200'], ['GPU memory', '1,440 GB'], ['Cluster network', '8 x ConnectX-7, up to 400 Gb/s'], ['Data cache', '8 x 3.84 TB']]} guide="NVIDIA DGX B200 user guide: 1,440 GB total GPU memory" to="https://docs.nvidia.com/dgx/dgxb200-user-guide/introduction-to-dgxb200.html" />
          </div>
          <p className="xe-note">Four B300 servers hold 9,216 GB of GPU memory; four B200 servers hold 5,760 GB.</p>
          <div className="xe-plan">
            <div>
              <h3>Planning range</h3>
              <ol className="xe-steps2">
                {[['Qualification', 'Four 8-GPU servers is where a qualification starts.'], ['Isolated production pools', 'One pool for each specialist, so a busy class of work never takes memory from another.'], ['Redundant pools', 'Two independent replicas of those pools across failure domains.']].map(([tt, d], i) => (
                  <li key={tt}><span className="x-mono">{String(i + 1).padStart(2, '0')}</span><b><span>{tt}.</span></b><span>{d}</span></li>
                ))}
              </ol>
            </div>
            <div>
              <h3>Around the servers</h3>
              <ul className="xe-around">
                {['NVLink and NVSwitch inside each server.', '400 or 800 Gb/s RDMA wherever a specialist spans servers.', 'About 31 TB of NVMe in each server (8 x 3.84 TB).', 'Separate sandbox workers for coding agents.', 'A high-availability control cluster.'].map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
          </div>
          <p className="xe-note">Final capacity and performance commitments come from qualifying your workload: context length, concurrency, routing mix, latency, and failover.</p>
          <DataTable caption="Zen 6 on one DGX Spark, as Hanzo measured it" cols={[{ key: 'p', label: 'Prompt' }, { key: 't', label: 'Prefill time', num: true }, { key: 'r', label: 'Prefill rate', num: true }]} rows={PREFILL.map(([pp, tt, rr]) => ({ p: pp, t: tt + ' s', r: rr.toLocaleString('en-US') + ' tokens a second' }))} className="xe-pf-table" />
        </div>
      </Drawer>
    </Enter>
  );
}

/* ---------- proof, on a split-flap board ---------- */
// a figure, Hanzo's own value, in place in the server HTML (the section's snap entrance carries it in)
function Fig({ value, className = '' }: { value: string; className?: string }) {
  return <span className={'xe-fig ' + className}><span>{value}</span></span>;
}

const PROOF: string[][] = [
  ['$8.4M', 'in bikes sold in 30 days', 'Damon Motorcycles', 'CES launch and preorders', '/customers/damon-motorcycles', '/logos/customers/damon-motorcycles.svg'],
  ['$7M+', 'raised in preorders', 'KANOA', 'Crowdfunding and preorders', '/customers/kanoa', '/logos/customers/kanoa.png'],
  ['169M', 'people watched TrillerFest', 'Triller', 'Growth marketing', '/customers#trillerfest', '/logos/customers/trillerfest.png'],
  ['$2.5M', 'raised on Indiegogo', 'SKULLY', 'Crowdfunding', '/customers#skully', '/logos/customers/skully.png'],
  ['$650M', 'CSPR peak market value', 'Casper Labs', 'Network launch', '/customers#casper-blockchain', '/logos/customers/casper-blockchain.svg'],
  ['250,000', 'email signups', 'Bellabeat', 'Preorders', '/customers#bellabeat', '/logos/customers/bellabeat.svg'],
];

// The logo files are not in public/ yet (requested in docs/build-notes/requests/enterprise.md), so nothing hot-links or 404s:
// a cloud is its name set in type, and a customer row carries its name. Once the files are vendored, set LOGOS true.
const LOGOS = true;
function CloudMark({ name, src }: { name: string; src: string }) {
  return LOGOS ? <Img src={src} alt={name} w={132} h={32} /> : <span className="xe-cloudname">{name}</span>;
}
function Mark({ src }: { src: string }) {
  return LOGOS ? <Img src={src} alt="" w={96} h={20} /> : null;
}

// sixteen marks, one per task of the suite, filled one by one the first time the figure is reached
function Tally({ n }: { n: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 1, margin: '0px 0px -25% 0px' });
  return (
    <span ref={ref} className={'xe-tally' + (seen ? ' on' : '')} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => <i key={i} style={{ '--k': i }} />)}
    </span>
  );
}

function Proof() {
  return (
    // entrance 2, snap-sections: each block snaps up into place a full step at a time (and on touch the section snaps
    // to the top of the screen as it is reached)
    <Enter k="snap" className="xe-sec xe-proof" amount={0.15} aria-labelledby="xe-proof-h">
      <div className="xe-w xe-g">
        <header className="xe-head xe-proof-head xe-snap-b" style={{ '--n': 0 }}>
          <h2 id="xe-proof-h" className="xe-h">Results on the record.</h2>
          <p className="xe-b xe-soft">Our models&apos; scores come from research runs anyone can open. Customer results come from the case studies of launches Hanzo ran.</p>
          <p className="xe-k xe-tag">Proof</p>
        </header>
        <A to="/benchmarks#decision-suite" className="xe-hero-fig xe-snap-b" style={{ '--n': 1 }}>
          <Fig value="16 of 16" className="big" />
          <Tally n={16} />
          <span className="xe-what">Decision Suite tasks won · Kai vs Jev</span>
          <span className="xe-soft">Every task of the suite, its row linking its runs and how to re-run it.</span>
          <span className="xe-go">See the runs →</span>
        </A>
      </div>
      <div className="xe-w">
        <ol className="xe-ledger">
          {PROOF.map(([fig, what, who, how, to, logo], i) => (
            <li key={who} className="xe-snap-b" style={{ '--n': i + 2 }}>
              <A to={to} className="xe-led">
                <Fig value={fig} />
                <span className="xe-what">{what}</span>
                <span className="xe-who"><Mark src={logo} /><b><span>{who}</span></b><span className="xe-dot">·</span><span>{how}</span></span>
                <span className="xe-led-go" aria-hidden="true">→</span>
              </A>
            </li>
          ))}
        </ol>
        <div className="xe-links"><More to="/customers">All customer stories</More></div>
      </div>
    </Enter>
  );
}

/* ---------- security: a calm list of proof ---------- */
const SEC = [
  ['Single sign-on', 'Sign in through your own OpenID Connect provider. SCIM 2.0 creates, updates and removes accounts from your directory.'],
  ['Your data, apart', "On Hanzo Base, each organization's data is its own database file, kept apart from every other organization. Identity comes only from a verified token."],
  ['Audit log', 'Every request is recorded: who acted, from where, what they called and the status it returned.'],
  ['Roles and second factors', 'Grant access by organization, workspace and project. Every account can add an authenticator app, or a code by SMS or email.'],
];

// the workspace's own security settings, drawn from the four lines below; the row you are reading lights
const PANEL: [string, string[]][] = [
  ['Single sign-on', ['OpenID Connect', 'SCIM 2.0']],
  ['Your data, apart', ['Hanzo Base', 'its own database file']],
  ['Audit log', ['who acted', 'from where', 'what they called', 'status']],
  ['Roles and second factors', ['organization', 'workspace', 'project', 'authenticator app', 'SMS', 'email']],
];

// the row each item lights: single sign-on shows a sign-in arriving, the audit log writes a new row while you read it
const SECROW: (string[] | null)[] = [LOG[0], null, null, LOG[7]];
function SecPanel({ at }: { at: number }) {
  const calm = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (at !== 2 || calm) return;
    let t = setTimeout(function tick() { setN((v) => v + 1); t = setTimeout(tick, 1800); }, 500);
    return () => clearTimeout(t);
  }, [at, calm]);
  const row = (r: string[], key: string) => (
    <span className="xe-panel-r" key={key}><span>{r[0]}</span><span>{r[1]}</span><code>{r[2]}</code><b className={'xe-st s' + r[3][0]}>{r[3]}</b></span>
  );
  return (
    <div className="xe-panel" aria-hidden="true">
      <div className="xe-panel-bar"><i /><i /><i /><span>Hanzo Enterprise · Your company</span></div>
      <ul>
        {PANEL.map(([t, chips], i) => {
          const lit = SECROW[i];
          return (
            <li key={t} className={i === at ? 'on' : undefined}>
              <span className="xe-panel-t"><b />{t}</span>
              <span className="xe-panel-c">{chips.map((c) => <em key={c}>{c}</em>)}</span>
              {i === 2 ? <span className="xe-panel-log">{row(LOG[mod(n, LOG.length)], 'r' + n)}</span>
                : lit ? <span className="xe-panel-log">{row(lit, 'r')}</span> : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Security() {
  const list = useRef<HTMLUListElement>(null);
  const [at, setAt] = useState(0);
  useEffect(() => {
    const items = [...(list.current?.children || [])];
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setAt(items.indexOf(e.target)); }), { rootMargin: '-40% 0px -50% 0px' });
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    // entrance 4, diagonal-wipe: a diagonal clip sweeps across the whole section, left to right
    <Enter k="wipe" className="xe-sec xe-secu" amount={0.15} aria-labelledby="xe-sec-h">
      <div className="xe-w xe-wipe">
        <header className="xe-head">
          <h2 id="xe-sec-h" className="xe-h">Ready for your security review.</h2>
          <p className="xe-l xe-soft">A security review is part of every Enterprise contract. We answer your questionnaire against the code, and the engineers who wrote it walk your reviewers through it.</p>
          <p className="xe-k xe-tag">Security</p>
        </header>
        <div className="xe-g xe-sec-g">
          <div className="xe-sec-obj">
            <SecPanel at={at} />
            <div className="xe-links"><More to="/security">How Hanzo is secured</More><More to="/trust">Trust center</More></div>
          </div>
          <ul className="xe-proofs" ref={list}>
            {SEC.map(([t, d], i) => (
              <li key={t} className={i === at ? 'on' : undefined}>
                <span className="x-mono">{String(i + 1).padStart(2, '0')}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Enter>
  );
}

/* ---------- partners, and the clouds Hanzo deploys on ---------- */
const CLOUDS = ['amazon', 'digitalocean', 'google', 'microsoft', 'nvidia', 'nebius'].map((l) => ({ name: l, src: `/logos/partners/${l}.svg` }));

function Partners() {
  return (
    <section className="xe-sec xe-part" aria-labelledby="xe-part-h">
      <div className="xe-w">
        <header className="xe-head">
          <h2 id="xe-part-h" className="xe-h">Work with Hanzo.</h2>
          <p className="xe-l xe-soft">Refer customers, resell Hanzo under your own brand, or have Hanzo’s agency build it with you.</p>
          <p className="xe-k xe-tag">Partners</p>
        </header>
        <div className="xe-offers">
          <A to="/contact-sales" className="xe-offer big">
            <h3>{`${PARTNERS.label.name}: resell under your brand`}</h3>
            <p className="xe-offer-fig">{`${usd(PARTNERS.label.price)} a month`}</p>
            <p>{PARTNERS.label.description}</p>
            <span className="xe-go">{`Ask about ${PARTNERS.label.name} →`}</span>
          </A>
          <A to="https://hanzo.agency" className="xe-offer">
            <h3>Have Hanzo build it</h3>
            <p className="xe-offer-fig sm">{`From ${usd(PARTNERS.agency.from)} a month`}</p>
            <p>{`${PARTNERS.agency.names.join(', ')}: Hanzo’s agency ships the work with you, from one workstream to an embedded team.`}</p>
            <span className="xe-go">Hanzo Agency →</span>
          </A>
          <A to="/affiliate" className="xe-offer">
            <h3>Refer customers</h3>
            <p>Apply to refer organizations to Hanzo. The terms are agreed with each affiliate we approve.</p>
            <span className="xe-go">The affiliate programme →</span>
          </A>
        </div>
      </div>
      <div className="xe-clouds">
        <p className="xe-w xe-clouds-k">Hanzo runs in your cloud and on these. They are the clouds and the silicon Hanzo deploys on, not partners or customers.</p>
        <ul className="xe-w xe-cloudrow" aria-label="The clouds and the silicon Hanzo deploys on">
          {CLOUDS.map((c) => <li key={c.name}><CloudMark {...c} /></li>)}
        </ul>
      </div>
    </section>
  );
}

/* ---------- questions, and the close ---------- */
const QA: [string, ReactNode][] = [
  ['How is Enterprise priced?', <>Each contract is priced for your organization: where Hanzo runs and the compute you need. Members are unlimited. <A to="/contact-sales">Talk to sales</A> for a quote.</>],
  ['What do we get with Enterprise?', 'All of Hanzo for your whole company: models, agents and one shared workspace, running in Hanzo Cloud, your cloud, your own servers or fully offline. Dedicated compute, unlimited members, engineering support around the clock with hands-on onboarding, and an uptime guarantee and a security review written into your contract.'],
  ['Can Hanzo run fully offline?', <>Yes. Hanzo runs air-gapped on your own servers, with models served on machines you control. <A to="https://docs.hanzo.ai/docs/self-hosting">Read the self-hosting &amp; air-gapped guide</A>.</>],
  ['How is our data used?', <>Your data is used to run your service. Training Hanzo models on it takes your administrator&apos;s choice or a written agreement. <A to="/privacy">Read the Privacy Policy</A>.</>],
  ['Which identity providers work?', 'Your own OpenID Connect provider, for single sign-on. SCIM 2.0 creates, updates and removes accounts as your directory changes.'],
  ['Can we start on Team and move up?', <>Yes. Team covers 2 to 100 people today, with single sign-on, roles and an audit log. Move to Enterprise when you want your own infrastructure, dedicated compute or more people. <A to="/pricing">Compare plans</A>.</>],
];

function Questions() {
  return (
    <section className="xe-sec xe-qa" aria-labelledby="xe-qa-h">
      <div className="xe-w xe-g">
        <header className="xe-head xe-stick"><h2 id="xe-qa-h" className="xe-h">Questions</h2></header>
        <div className="xe-qa-list"><Faq items={QA} first={0} onOpen={(q: ReactNode) => capture('faq_opened', { q, page: 'enterprise' })}
 /></div>
      </div>
    </section>
  );
}

// The hero ships in place in the server HTML (h1 lines and lede visible, nothing translated out). Once React has
// hydrated, a class plays the line-mask cut-in, so a slow load never shows a blank hero.
export default function Enterprise() {
  const [cut, setCut] = useState(false);
  useEffect(() => setCut(true), []);
  // the closing call to sales is a page of this site: its press is read where the page transition reads it
  useEffect(() => press('[data-cta="enterprise.talk"]', () => capture('enterprise_cta', { at: 'end' })), []);
  // one place in focus, shared by the hero's walls and the rows that open; a hand choosing a place stops the idle turn
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const open = useCallback((i: number) => { setMine(true); setAt(i); }, []);
  return (
    <main className={'xe' + (cut ? ' xe-cut' : '')}>
      <Hero at={at} mine={mine} />
      <Places at={at} open={open} />
      <Proof />
      <Includes />
      <Security />
      <Gpus />
      <Partners />
      <Questions />
      <Band
        title="Tell us what you want to build."
        lede="Share a few details about your company. We come back with a plan: where Hanzo runs, what it costs and how you start."
        action="Get Enterprise plan"
        to="/enterprise/start"
        note={<p className="x-band-note"><A to="/contact-sales" data-cta="enterprise.talk">Talk to sales</A> · Or email <a href="mailto:enterprise@hanzo.ai">enterprise@hanzo.ai</a></p>}
      />
    </main>
  );
}
