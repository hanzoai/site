'use client';
/* Enterprise, v2 (VISION archetype B, System: a map you travel; the calm trust of chatgpt.com/business/enterprise;
   PLAN-COMPONENTS 5.3).
   V2: 8/10 where it runs as a scrolled zoom over Hanzo's live audit log; trust strip in the first screen; GPU detail in a drawer; one dark room, the Band; greys only
   Persona: an IT, security or platform lead choosing where Hanzo runs. Goal: see it runs where you need it, and that
   you can verify it. CTA: "Get Enterprise plan" (data-cta enterprise.hero, the page's ask) and one "Talk to sales" in
   the closing Band; metric: cta_click on enterprise.hero and the Band.
   Thesis: it runs where you need it, and you can verify it.
   Signature: the boundary zoom. The first screen is Hanzo's own workspace, open on its audit log and already writing
   (who acted, from where, what they called, the status it returned). As you scroll it settles inside four walls -
   Hanzo Cloud, your cloud, your servers, air-gapped - and the camera travels in one wall per chapter while the words for
   each place come in as the last go out (the apple.com sticky chapter). Phones, reduced motion and JS off get the same
   story by tap or as a list, without the pin.
   Supporting: results rising out of their own masks (never a number that is not Hanzo's), the GPU detail opening as a sheet out of its card, and the clouds Hanzo
   deploys on as a slow wall in motion. Everything else sits still and reads.
   Beyond: the prefill instrument. Pick a prompt size and read the prefill time and rate Hanzo measured for Zen 6 on one
   DGX Spark, against every other size on one bar chart.
   Removed (ledger): the repeated deployment block ("Which wall is yours"), the second sales button in it, the long dark
   GPU room (now a drawer), the kicker above the h1, and the second dark room (the Band is the one). Every word and
   figure is Hanzo's. */
// Persona: an IT, security or platform lead choosing where Hanzo runs
// Goal: see it runs where you need it, and that you can verify it
// CTA: Get Enterprise plan (hero, ask bar and Band); metric: cta_click on enterprise.hero and enterprise.band
// Signature: the boundary zoom: Hanzo's live audit log settles inside four walls and the camera travels in, one wall per scrolled chapter
// Beyond: the prefill instrument: pick a prompt size and read Hanzo's measured prefill time and rate for Zen 6 on one DGX Spark
import { useEffect, useRef, useState } from 'react';
import { useCallback } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { EASE } from '../ui';
import { A, More, Cta, Faq, Film, Img, DataTable, Band } from '../kit';
import Drawer from '../v2/x-cannon/Drawer';
import './Enterprise.css';

const Check = ({ size = 18 }) => <svg className="xe-ck" viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="none" strokeWidth="1.5" /><path d="M7.5 12.5l3 3 6-6.5" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;

const PLACES = [
  ['Hanzo Cloud', 'We run it for you', "Start today. On Hanzo Base, your organization's data is its own database."],
  ['Your cloud', 'Inside your VPC', 'Hanzo runs in your own cloud account, on your network.'],
  ['Your servers', 'On premises', 'On hardware in your data center, beside the systems you already run.'],
  ['Air-gapped', 'Fully offline', 'Sealed inside your network, with models served on machines you control.'],
];

/* ---------- the boundary: geometry ---------- */
// The map is built at its closest zoom and scaled down, so the workspace is crisp when the camera arrives.
const WIN = [640, 430], STEP = 64;
const MAP = [WIN[0] + STEP * 8, WIN[1] + STEP * 8];
const ring = (i) => [MAP[0] - STEP * 2 * i, MAP[1] - STEP * 2 * i];
const P0 = 0.15, L = (1 - P0) / 4; // the arrival, then four chapters
const startOf = (i) => P0 + i * L;

// camera keyframes for this window size: the workspace big under the headline, then each wall filling the stage
function shots(vw, vh, introBottom) {
  const gut = Math.min(32, Math.max(16, vw * 0.04));
  const wrap = Math.min(vw - 2 * gut, 1152), col = (wrap - 12 * 24) / 13;
  const stageW = 8 * col + 7 * 24 + gut, stageH = vh - 64 - 96;
  const fit = (i) => { const [w, h] = ring(i); return Math.min(stageW / w, stageH / h); };
  const x1 = 5 * (col + 24) + (8 * col + 7 * 24) / 2 - wrap / 2 + gut / 2;
  const y1 = 32;
  const s0 = Math.min(1.25, (wrap - 120) / WIN[0]);
  const top = introBottom + 40;
  const y0 = top + (WIN[1] * s0) / 2 - vh / 2;
  const ps = [0, P0], xs = [0, x1], ys = [y0, y1], ss = [s0, fit(0)];
  for (let i = 0; i < 3; i++) { ps.push(startOf(i) + L * 0.5, startOf(i + 1)); xs.push(x1, x1); ys.push(y1, y1); ss.push(fit(i), fit(i + 1)); }
  ps.push(1); xs.push(x1); ys.push(y1); ss.push(fit(3));
  return { ps, xs, ys, ss };
}
const ramp = (v, a, b) => Math.min(1, Math.max(0, (v - a) / (b - a)));
// piecewise, eased inside each segment
function seg(v, ps, vals) {
  if (v <= ps[0]) return vals[0];
  for (let k = 1; k < ps.length; k++) {
    if (v <= ps[k]) { const t = (v - ps[k - 1]) / (ps[k] - ps[k - 1] || 1); const e = t * t * (3 - 2 * t); return vals[k - 1] + (vals[k] - vals[k - 1]) * e; }
  }
  return vals[vals.length - 1];
}

/* ---------- the workspace: Hanzo's audit log, writing ---------- */
// Hanzo's audit log records who acted, from where, what they called and the status it returned
const LOG = [
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
const mod = (a, n) => ((a % n) + n) % n;

function Workspace({ at }) {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.15 });
  const calm = useReducedMotion();
  const [n, setN] = useState(7);
  useEffect(() => {
    if (!seen || calm) return;
    const ts = [900, 2300, 3700].map((ms) => setTimeout(() => setN((v) => v + 1), ms));
    return () => ts.forEach(clearTimeout);
  }, [seen, calm]);
  const rows = Array.from({ length: 8 }, (_, k) => ({ id: n - k, r: LOG[mod(n - k, LOG.length)] }));
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
              <div key={id} className={'xe-r' + (k === 0 && id > 7 ? ' new' : '') + (k > 6 ? ' gone' : '')} style={{ transform: `translateY(${k * ROW}px)` }}>
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

function Step({ p, i, on, label, go }) {
  const fill = useTransform(p, (v) => ramp(v, startOf(i), startOf(i + 1)));
  return (
    <button type="button" className={'xe-step' + (on ? ' on' : '')} aria-current={on ? 'step' : undefined} onClick={() => go(i)}>
      <i className="xe-step-bar"><motion.b style={{ scaleX: fill }} /></i>
      <span className="x-mono">{String(i + 1).padStart(2, '0')}</span>
      <span>{label}</span>
    </button>
  );
}

// four nested walls, the chosen one drawn solid (phones and the tiles use this small one)
const Glyph = ({ at, className = '' }) => (
  <span className={'xe-glyph ' + className} aria-hidden="true">
    {PLACES.map((_, k) => <i key={k} className={k === at ? 'on' : k < at ? 'out' : ''} style={{ inset: k * 12 + '%' }} />)}
    <b />
  </span>
);

function Boundary() {
  const ref = useRef(null);
  const intro = useRef(null);
  const calm = useReducedMotion();
  const [scrub, setScrub] = useState(false);
  const [ready, setReady] = useState(false);
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const g = useMotionValue(0);
  const geo = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useEffect(() => {
    const mq = matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)');
    const on = () => {
      const b = intro.current ? intro.current.offsetTop + intro.current.offsetHeight : 520; // layout box, not the moved one
      geo.current = shots(document.documentElement.clientWidth, innerHeight, b);
      setScrub(mq.matches);
      g.set(g.get() + 1);
    };
    on();
    setReady(true);
    mq.addEventListener('change', on);
    addEventListener('resize', on);
    return () => { mq.removeEventListener('change', on); removeEventListener('resize', on); };
  }, [g]);

  const cam = (k, d) => ([v]) => (geo.current ? seg(v, geo.current.ps, geo.current[k]) : d);
  const x = useTransform([p, g], cam('xs', 0));
  const y = useTransform([p, g], cam('ys', 0));
  const scale = useTransform([p, g], cam('ss', 1));
  // function transforms on purpose: they run on the main thread in step with the camera (a range transform of opacity
  // would be handed to the browser's scroll timeline, which measures this pinned section differently)
  // the walls arrive only once the headline has fully left (no line drawn through words)
  const walls = useTransform(p, (v) => ramp(v, 0.07, 0.14));
  const introO = useTransform(p, (v) => 1 - ramp(v, 0, 0.06));
  const introY = useTransform(p, (v) => -90 * ramp(v, 0, 0.1));
  const chO = useTransform(p, (v) => ramp(v, 0.1, 0.15));
  const chY = useTransform(p, (v) => 36 * (1 - ramp(v, 0.1, 0.16)));

  useMotionValueEvent(p, 'change', (v) => {
    if (!scrub) return;
    setAt(Math.max(0, Math.min(3, Math.floor((v - P0) / L + 0.25))));
  });

  // phones and calm screens: the places turn by themselves until a hand takes over
  const seen = useInView(ref, { amount: 0.25 });
  useEffect(() => {
    if (scrub || mine || calm || !seen) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % 4), 3600);
    return () => clearTimeout(t);
  }, [at, scrub, mine, calm, seen]);

  const go = (i) => {
    setMine(true);
    if (!scrub) { setAt(i); return; }
    const el = ref.current;
    const top = el.getBoundingClientRect().top + scrollY;
    const to = top + (startOf(i) + L * 0.2) * (el.offsetHeight - innerHeight);
    if (window.__lenis) window.__lenis.scrollTo(to, { duration: 1.4 });
    else scrollTo({ top: to, behavior: 'smooth' });
  };

  const line = (t, d) => (
    <span className="xe-line"><span style={{ animationDelay: d + 's' }}>{t}</span></span>
  );

  return (
    <section className="xe-stage" ref={ref} aria-labelledby="xe-h1">
      <div className="xe-pin">
        <motion.div className="xe-intro xe-w" ref={intro} style={{ opacity: introO, y: introY }}>
          <h1 id="xe-h1" className="xe-d">{line('Give every team AI.', 0)}{line('Run it where you choose.', 0.06)}</h1>
          <div className="xe-intro-row">
            <p className="xe-lede">
              Models, agents and one shared workspace for everyone in your company, in your cloud, on your servers or fully offline.
            </p>
            <div className="xe-acts">
              <Cta to="/enterprise/start" size="lg" id="enterprise.hero" thumb>Get Enterprise plan</Cta>
              <Cta to="https://platform.hanzo.ai" kind="link" id="enterprise.platform">Build on Hanzo Platform</Cta>
            </div>
          </div>
          {/* the trust strip, in the first screen (brief 5.3): Hanzo's three promises and where to verify them */}
          <div className="xe-trust">
            <ul className="xe-pills">
              {['Unlimited members', '24/7 engineering support', 'Runs fully offline'].map((t) => <li key={t}><Check size={15} />{t}</li>)}
            </ul>
            <div className="xe-trust-l"><More to="/security">How Hanzo is secured</More><More to="/trust">Trust center</More></div>
          </div>
        </motion.div>

        <motion.div className={'xe-cam' + (ready ? ' ready' : '')} style={{ x, y, scale }}>
          <div className="xe-map" data-at={at}>
            <motion.div className="xe-rings" style={{ opacity: walls }}>
              {PLACES.map((pl, i) => (
                <div key={pl[0]} className={'xe-ring' + (i === at ? ' on' : i < at ? ' out' : '')} style={{ inset: i * STEP + 'px' }}>
                  <span className="xe-ring-l">{pl[0]}</span>
                </div>
              ))}
            </motion.div>
            <div className="xe-seat"><Workspace at={at} /></div>
          </div>
        </motion.div>

        <motion.div className="xe-ch" style={{ opacity: chO, y: chY }} data-ask-hide>
          <h2 className="xe-h">Run it where your data lives.</h2>
          <p className="xe-b xe-soft">One platform, four places to run it. Choose one, or start in our cloud and move when you are ready.</p>
          <p className="xe-k xe-tag">Deployment</p>
          <div className="xe-steps" role="group" aria-label="Where it runs">
            {PLACES.map((pl, i) => <Step key={pl[0]} p={p} i={i} on={at === i} label={pl[0]} go={go} />)}
          </div>
          <div className="xe-scale" aria-hidden="true"><span>Fastest start</span><span>Most control</span></div>
          <div className="xe-caps" aria-live="polite">
            <Glyph at={at} className="xe-caps-g" />
            {PLACES.map((pl, i) => (
              <div key={pl[0]} className={'xe-cap' + (i === at ? ' on' : i < at ? ' gone' : '')} aria-hidden={i !== at}>
                <h3>{pl[0]}</h3>
                <p><b>{pl[1]}.</b> {pl[2]}</p>
                <p className="xe-cap-n"><span>Where it runs</span><span className="x-mono">{String(i + 1).padStart(2, '0')} / 04</span></p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// a pause control for a looping film (first in reading order of its tile, 44px, aria-pressed)
function PauseFilm() {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const [off, setOff] = useState(false);
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
  if (calm) return null; // under reduced motion the film never plays: its poster stands
  return (
    <button ref={ref} type="button" className="xe-pause" aria-pressed={off} aria-label="Pause" onClick={() => setOff((o) => !o)}>
      {off ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9l7.5-4.5z" fill="currentColor" /></svg>
        : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>}
    </button>
  );
}

/* ---------- what Enterprise includes: a tile grid, one idea a tile ---------- */
function Includes() {
  return (
    <section className="xe-sec xe-inc" aria-labelledby="xe-inc-h">
      <div className="xe-w">
        <header className="xe-head">
          <h2 id="xe-inc-h" className="xe-h">What Enterprise includes.</h2>
          <p className="xe-l xe-soft">Your own infrastructure, dedicated compute, and engineering support around the clock.</p>
          <p className="xe-k xe-tag">What you get</p>
        </header>
        <div className="xe-tiles">
          <article className="xe-tile t-infra">
            <div className="xe-tile-walls" aria-hidden="true">
              {PLACES.map((pl, i) => <span key={pl[0]} style={{ inset: `${i * 10}% ${i * 8}%` }}><em>{pl[0]}</em></span>)}
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
        </div>
      </div>
    </section>
  );
}

/* ---------- the dark room: your own GPUs ---------- */
const PREFILL = [['512 tokens', 1.9, 270], ['2,048 tokens', 0.8, 2658], ['8,192 tokens', 4.5, 1835], ['16,384 tokens', 9.6, 1701], ['32,768 tokens', 23.2, 1414]];
const TOP = 2658;

function Roll({ k, children }) {
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
  const [, t, r] = PREFILL[k];
  return (
    <div className="xe-pf">
      <div className="xe-pf-read">
        <p className="xe-k">Zen 6 on one DGX Spark, as Hanzo measured it</p>
        <div className="xe-pf-figs" aria-live="polite">
          <div><span className="xe-pf-l">Prefill time</span><Roll k={'t' + k}>{t} s</Roll></div>
          <div><span className="xe-pf-l">Prefill rate</span><Roll k={'r' + k}>{r.toLocaleString('en-US')}</Roll><span className="xe-pf-u">tokens a second</span></div>
        </div>
      </div>
      <div className="xe-pf-chart" role="radiogroup" aria-label="Prompt">
        {PREFILL.map(([s, , rate], i) => (
          <button key={s} type="button" role="radio" aria-checked={k === i} onClick={() => setK(i)} onPointerEnter={(e) => e.pointerType === 'mouse' && setK(i)} data-cursor="">
            <span className="xe-pf-s">{s}</span>
            <i className="xe-pf-bar"><b style={{ transform: `scaleX(${rate / TOP})` }} /></i>
            <span className="xe-pf-v x-mono">{rate.toLocaleString('en-US')}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Rack({ name, total, specs, guide, to }) {
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

/* Your own GPUs: the measurement in the open, the rack detail in a drawer that grows out of its card */
function Gpus() {
  const [src, setSrc] = useState(null);
  const open = useCallback((e) => setSrc(e.currentTarget), []);
  const close = useCallback(() => setSrc(null), []);
  return (
    <section className="xe-sec xe-gpu" aria-labelledby="xe-gpu-h">
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
                  <li key={tt}><span className="x-mono">{String(i + 1).padStart(2, '0')}</span><b>{tt}</b><span>{d}</span></li>
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
    </section>
  );
}

/* ---------- proof, on a split-flap board ---------- */
// a figure that rises out of its own mask once, showing only Hanzo's own value at every frame
function Fig({ value, className = '' }) {
  return (
    // the frame is watched (the moving figure starts clipped, so it can never be "seen" itself)
    <motion.span className={'xe-fig ' + className} initial="h" whileInView="s" viewport={{ once: true, amount: 0.6 }}>
      <motion.span variants={{ h: { y: '105%' }, s: { y: '0%', transition: { duration: 0.5, ease: EASE } } }}>{value}</motion.span>
    </motion.span>
  );
}

const PROOF = [
  ['$8.4M', 'in bikes sold in 30 days', 'Damon Motorcycles', 'CES launch and preorders', '/customers/damon-motorcycles', '/logos/customers/damon-motorcycles.svg'],
  ['$7M+', 'raised in preorders', 'KANOA', 'Crowdfunding and preorders', '/customers/kanoa', '/logos/customers/kanoa.png'],
  ['169M', 'people watched TrillerFest', 'Triller', 'Growth marketing', '/customers#trillerfest', '/logos/customers/trillerfest.png'],
  ['$2.5M', 'raised on Indiegogo', 'SKULLY', 'Crowdfunding', '/customers#skully', '/logos/customers/skully.png'],
  ['$650M', 'CSPR peak market value', 'Casper Labs', 'Network launch', '/customers#casper-blockchain', '/logos/customers/casper-blockchain.svg'],
  ['250,000', 'email signups', 'Bellabeat', 'Preorders', '/customers#bellabeat', '/logos/customers/bellabeat.svg'],
];

// a cloud's logo, or its name set in type if the logo cannot load
function CloudMark({ name, src }) {
  const ref = useRef(null);
  const [bad, setBad] = useState(false);
  useEffect(() => { const i = ref.current; if (i && i.complete && !i.naturalWidth) setBad(true); }, []);
  return bad ? <span className="xe-cloudname">{name}</span> : <Img ref={ref} src={src} alt={name} w={132} h={32} onError={() => setBad(true)} />;
}

// a logo that hides itself if it cannot load (the name beside it carries on)
function Mark({ src }) {
  const ref = useRef(null);
  const [bad, setBad] = useState(false);
  useEffect(() => { const i = ref.current; if (i && i.complete && !i.naturalWidth) setBad(true); }, []);
  return bad ? null : <Img ref={ref} src={src} alt="" w={96} h={20} onError={() => setBad(true)} />;
}

function Proof() {
  return (
    <section className="xe-sec xe-proof" aria-labelledby="xe-proof-h">
      <div className="xe-w xe-g">
        <header className="xe-head xe-proof-head">
          <h2 id="xe-proof-h" className="xe-h">Results on the record.</h2>
          <p className="xe-b xe-soft">Our models&apos; scores come from research runs anyone can open. Customer results come from the case studies of launches Hanzo ran.</p>
          <p className="xe-k xe-tag">Proof</p>
        </header>
        <A to="/benchmarks#decision-suite" className="xe-hero-fig">
          <Fig value="16 of 16" className="big" />
          <span className="xe-what">Decision Suite tasks won · Kai vs Jev</span>
          <span className="xe-soft">Every task of the suite, its row linking its runs and how to re-run it.</span>
          <span className="xe-go">See the runs →</span>
        </A>
      </div>
      <div className="xe-w">
        <ol className="xe-ledger">
          {PROOF.map(([fig, what, who, how, to, logo]) => (
            <li key={who}>
              <A to={to} className="xe-led">
                <Fig value={fig} />
                <span className="xe-what">{what}</span>
                <span className="xe-who"><Mark src={logo} /><b>{who}</b><span className="xe-dot">·</span><span>{how}</span></span>
                <span className="xe-led-go" aria-hidden="true">→</span>
              </A>
            </li>
          ))}
        </ol>
        <div className="xe-links"><More to="/customers">All customer stories</More></div>
      </div>
    </section>
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
const PANEL = [
  ['Single sign-on', ['OpenID Connect', 'SCIM 2.0']],
  ['Your data, apart', ['Hanzo Base', 'its own database file']],
  ['Audit log', ['who acted', 'from where', 'what they called', 'status']],
  ['Roles and second factors', ['organization', 'workspace', 'project', 'authenticator app', 'SMS', 'email']],
];

function SecPanel({ at }) {
  return (
    <div className="xe-panel" aria-hidden="true">
      <div className="xe-panel-bar"><i /><i /><i /><span>Hanzo Enterprise · Your company</span></div>
      <ul>
        {PANEL.map(([t, chips], i) => (
          <li key={t} className={i === at ? 'on' : undefined}>
            <span className="xe-panel-t"><b />{t}</span>
            <span className="xe-panel-c">{chips.map((c) => <em key={c}>{c}</em>)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Security() {
  const list = useRef(null);
  const [at, setAt] = useState(0);
  useEffect(() => {
    const items = [...(list.current?.children || [])];
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setAt(items.indexOf(e.target)); }), { rootMargin: '-40% 0px -50% 0px' });
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <section className="xe-sec xe-secu" aria-labelledby="xe-sec-h">
      <div className="xe-w">
        <header className="xe-head">
          <h2 id="xe-sec-h" className="xe-h">Ready for your security review.</h2>
          <p className="xe-l xe-soft">A security review is part of every Enterprise contract. We answer your questionnaire against the code, and the engineers who wrote it walk your reviewers through it.</p>
          <p className="xe-k xe-tag">Security</p>
        </header>
        <div className="xe-g xe-sec-g">
          <div className="xe-stick xe-sec-obj">
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
    </section>
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
            <h3>White-label: resell under your brand</h3>
            <p className="xe-offer-fig">$999 a month</p>
            <p>Your own AI agency, under your brand, on your domain.</p>
            <span className="xe-go">Ask about White-label →</span>
          </A>
          <A to="https://hanzo.agency" className="xe-offer">
            <h3>Have Hanzo build it</h3>
            <p className="xe-offer-fig sm">From $4,999 a month</p>
            <p>Agency, Forward Deployed, Embedded Pod: Hanzo’s agency ships the work with you, from one workstream to an embedded team.</p>
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
const QA = [
  ['How is Enterprise priced?', <>Each contract is priced for your organization: where Hanzo runs and the compute you need. Members are unlimited. <A to="/contact-sales">Talk to sales</A> for a quote.</>],
  ['Where do the savings figures come from?', 'Every rate is read from our price list and our plan list when the page opens; the volumes, the people and the GPUs are yours. The figure for your own GPUs counts them on all month at an hourly rate and leaves out the Enterprise agreement, which our team prices with you.'],
  ['Can Hanzo run fully offline?', 'Yes. Hanzo runs air-gapped on your own servers, with models served on machines you control.'],
  ['How is our data used?', <>Your data is used to run your service. Training Hanzo models on it takes your administrator&apos;s choice or a written agreement. <A to="/privacy">Read the Privacy Policy</A>.</>],
  ['Which identity providers work?', 'Your own OpenID Connect provider, for single sign-on. SCIM 2.0 creates, updates and removes accounts as your directory changes.'],
  ['Can we start on Team and move up?', <>Yes. Team covers 2 to 100 people today, with single sign-on, roles and an audit log. Move to Enterprise when you want your own infrastructure, dedicated compute or more people. <A to="/pricing">Compare plans</A>.</>],
];

function Questions() {
  return (
    <section className="xe-sec xe-qa" aria-labelledby="xe-qa-h">
      <div className="xe-w xe-g">
        <header className="xe-head xe-stick"><h2 id="xe-qa-h" className="xe-h">Questions</h2></header>
        <div className="xe-qa-list"><Faq items={QA} first={0} multi /></div>
      </div>
    </section>
  );
}

export default function Enterprise() {
  return (
    <main className="xe">
      <Boundary />
      <Security />
      <Includes />
      <Proof />
      <Gpus />
      <Partners />
      <Questions />
      <Band
        title="Tell us what you want to build."
        lede="Share a few details about your company. We come back with a plan: where Hanzo runs, what it costs and how you start."
        action="Get Enterprise plan"
        to="/enterprise/start"
        note={<p className="x-band-note"><A to="/contact-sales">Talk to sales</A> · Or email <a href="mailto:enterprise@hanzo.ai">enterprise@hanzo.ai</a></p>}
      />
    </main>
  );
}
