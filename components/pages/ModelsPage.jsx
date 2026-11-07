'use client';
// Signature: the stage that opens. Enso's film fills the first screen, then pulls back as you scroll into a wall of all nine flagship films; every film and every card opens into its own page (the WebGL opener for flagships, the morph for model sheets).
// Beyond: the compare tray. Pin up to three models from anywhere in the catalogue and a tray rises with their context window and their rates side by side, from Hanzo's own price list.
/* Models, v2 (docs/VISION.md, archetype C: catalogue), chaptered so one idea holds the screen at a time:
   1 Stage. Enso's film, huge, settles into the wall of nine as you scroll (phones: a swipe rail).
   2 Three families, the page's one dark room. The words pin; the film changes under a clip wipe (Apple chapters).
   3 Enso vs Zen as a calm two-column spec.
   4 Kai's decision benchmarks as hero figures (the anthropic.com launch reference).
   5 The catalogue. Chips re-flow the families, each family's head pins while its cards pass, every card opens.
   6 Every model priced, ten rows until you open the rest.
   7 Try any model: the request swaps its model string by itself until you choose.
   8 Your first request, in four languages.   9 Related, as an editorial index.
   Motion: the signature (stage + open), a clip wipe, chip re-flow and count-up. No fade-ups.
   Every word, id, rate and link is Hanzo's (rates refresh from api.hanzo.ai when it answers). */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { EASE, Count, Copy } from '../ui';
import { A } from '../kit';
import { useOpener } from '../Opener';
import { media, bySlug } from '../../lib/models';
import './ModelsPage.css';

const SPRING = { type: 'spring', stiffness: 300, damping: 30 };

/* A link with its arrow as text, the way Hanzo writes them. */
const Lk = ({ to, children, className = '', ...r }) => {
  const inner = <><span>{children}</span><i aria-hidden="true">→</i></>;
  return to.startsWith('#')
    ? <a href={to} className={'xmo-lk ' + className} {...r}>{inner}</a>
    : <A to={to} className={'xmo-lk ' + className} {...r}>{inner}</A>;
};
const Btn = ({ to, children, solid }) => <A to={to} className={'x-btn xmo-btn' + (solid ? ' solid' : '')}>{children}</A>;

/* Opens a flagship's own page with the lifted-picture transition; its close button flies back to this card. */
function useOpen() {
  const opener = useOpener();
  return (e, el, slug) => opener.open(e, { el, src: media(slug, 'webp'), href: '/' + slug, key: slug });
}

/* Desktop gets the pinned scenes; phones get plain scroll and rails (decided in CSS, read here only for films). */
function useWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const q = matchMedia('(min-width: 901px)');
    const on = () => setWide(q.matches);
    on(); q.addEventListener('change', on);
    return () => q.removeEventListener('change', on);
  }, []);
  return wide;
}

/* A model's film: the still is there at once; the film plays only while asked to and on screen. */
function Film({ slug, play = true, className = '' }) {
  const v = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = v.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const el = v.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (play && seen) { if (el.preload === 'none') el.preload = 'auto'; el.play().catch(() => {}); } else el.pause();
  }, [play, seen]);
  return (
    <span className={'xmo-film ' + className} aria-hidden="true">
      <img src={media(slug, 'webp')} alt="" loading="lazy" decoding="async" />
      <video ref={v} src={media(slug, 'webm')} muted loop playsInline preload="none" onPlaying={(e) => e.currentTarget.classList.add('on')} />
    </span>
  );
}

/* Left and right arrows move through a row of tabs. */
const arrows = (n, set) => (e) => {
  const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
  if (!d) return;
  e.preventDefault();
  const to = e.currentTarget.closest('[role=tablist]').querySelectorAll('[role=tab]');
  const i = [...to].indexOf(document.activeElement);
  const j = (i + d + n) % n;
  to[j].focus(); set(j);
};

/* The line-masked headline: each line rises once out of its own mask. */
const Lines = ({ lines, delay = 0, as: T = 'span' }) => lines.map((t, i) => (
  <T key={t} className="x-line"><motion.span className="x-line-in" initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: delay + i * 0.08 }}>{t}</motion.span></T>
));

/* ---------- 1. stage: one film, then the wall of nine ---------- */
const WALL = ['kai', 'zen', 'iro', 'koma', 'enso', 'oto', 'koe', 'uta', 'mori']; // Enso holds the middle
const K = 1 / 3; // the wall settles at a third of its first-screen size
const eio = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v) => Math.min(1, Math.max(0, v));
const scaleAt = (v) => Math.pow(K, eio(clamp(v / 0.72)));

function Stage() {
  const ref = useRef(null);
  const open = useOpen();
  const calm = useReducedMotion();
  const wide = useWide();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const s = useTransform(p, scaleAt);
  const near = useTransform(p, (v) => clamp((0.56 - scaleAt(v)) / 0.16));
  const far = useTransform(p, (v) => clamp((0.48 - scaleAt(v)) / 0.12));
  const [settled, setSettled] = useState(false);
  const [lit, setLit] = useState(4);
  const [held, setHeld] = useState(false);
  useMotionValueEvent(p, 'change', (v) => setSettled(v > 0.7));
  const live = !wide || settled;
  // once the wall has settled, the light moves through the nine films by itself; a hovered film keeps it
  useEffect(() => {
    if (calm || held || !live) return;
    const t = setInterval(() => setLit((i) => (i + 1) % WALL.length), 2800);
    return () => clearInterval(t);
  }, [calm, held, live]);
  const at = wide && !settled ? 4 : lit;
  return (
    <section className="xmo-stage" ref={ref} aria-labelledby="xmo-h1">
      <div className="xmo-pin">
        <div className="x-wrap xmo-stage-g">
          <div className="xmo-intro">
            <motion.p className="xmo-kick" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: EASE }}>Models</motion.p>
            <h1 id="xmo-h1" className="xmo-display"><Lines lines={['Frontier AI', 'families']} delay={0.05} /></h1>
            <motion.p className="xmo-lede" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>
              Proprietary and open weight models for text, decisions, video, image, and more — one account, one API key.
            </motion.p>
            <motion.div className="xmo-acts" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.48 }}>
              <Btn to="https://platform.hanzo.ai/api-keys" solid>Get API key</Btn>
              <a className="x-btn xmo-btn" href="#families">Every model</a>
            </motion.div>
          </div>
          <div className="xmo-area">
            <motion.ul className="xmo-wall" style={{ scale: s }} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.15 }} data-swipe-own>
              {WALL.map((slug, i) => {
                const m = bySlug[slug];
                const ring = i === 4 ? null : i % 2 ? near : far; // edges arrive first, corners after
                return (
                  <motion.li key={slug} className={'xmo-tile' + (i === 4 ? ' c' : '') + (at === i ? ' lit' : '')} style={ring ? { opacity: ring } : undefined}>
                    <a
                      href={'/' + slug}
                      data-card={slug}
                      data-cursor="Open"
                      aria-label={`${m.name}: ${m.desc}`}
                      onClick={(e) => open(e, e.currentTarget, slug)}
                      onPointerEnter={(e) => { if (e.pointerType === 'mouse') { setLit(i); setHeld(true); } }}
                      onPointerLeave={() => setHeld(false)}
                      onFocus={() => { setLit(i); setHeld(true); }}
                      onBlur={() => setHeld(false)}
                    >
                      <Film slug={slug} play={at === i} />
                      <span className="xmo-tile-shade" aria-hidden="true" />
                      <span className="xmo-tile-t" aria-hidden="true">
                        {m.kicker && <em>{m.kicker}</em>}
                        <b>{m.name}</b>
                        <span>{m.desc}</span>
                      </span>
                    </a>
                  </motion.li>
                );
              })}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 2. three families: the dark room ---------- */
const FAM = [
  { slug: 'enso', verb: 'routes', name: 'Enso', d: 'Picks the model for every call, in every modality.', to: '/enso' },
  { slug: 'kai', verb: 'decides', name: 'Kai', d: 'Answers a choice, a score or a yes/no, with the probability of each.', to: '/kai', stat: 11 },
  { slug: 'zen', verb: 'reasons', name: 'Zen', d: 'Open weights for the code, the copy, the images and the voice.', to: '/zen', foot: 'Zen 6 and Zen 6 Flash now · Zen 7 in research preview' },
];

function Families() {
  const ref = useRef(null);
  const open = useOpen();
  const wide = useWide();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ['start end', 'start 60px'] });
  // the room arrives as a rounded panel and opens to full bleed as it reaches the top
  const clipPath = useTransform(enter, (v) => { const k = 1 - clamp(v); return `inset(0px ${(k * 3.2).toFixed(2)}vw round ${(k * 32).toFixed(1)}px)`; });
  const [on, setOn] = useState(0);
  useMotionValueEvent(p, 'change', (v) => setOn(Math.min(2, Math.floor(clamp(v) * 3.0001))));
  return (
    <section className="xmo-fam" ref={ref} data-room="dark" aria-labelledby="xmo-fam-h">
      <div className="xmo-fam-pin">
        <motion.div className="xmo-fam-bg" style={{ clipPath }} aria-hidden="true" />
        <div className="x-wrap xmo-fam-g">
          <header className="xmo-fam-head">
            <p className="xmo-kick">Three families</p>
            <h2 id="xmo-fam-h" className="xmo-fam-h">
              {FAM.map((f, i) => <span key={f.slug} className={on === i ? 'on' : ''}>{`${f.name} ${f.verb}. `}</span>)}
            </h2>
          </header>
          <ol className="xmo-fam-list">
            {FAM.map((f, i) => (
              <li key={f.slug} className={'xmo-fam-c' + (on === i ? ' on' : '') + (on > i ? ' past' : '')} data-card={f.slug + '-family'} aria-current={on === i ? 'step' : undefined}>
                <div className="xmo-fam-film">
                  <Film slug={f.slug} play={!wide || on === i} />
                  <span className="xmo-fam-n x-mono" aria-hidden="true">{`0${i + 1} / 03`}</span>
                </div>
                <div className="xmo-fam-t">
                  <p className="xmo-verb">{f.verb}</p>
                  <h3>{f.name}</h3>
                  <p className="xmo-fam-d">{f.d}</p>
                  {f.stat && <p className="xmo-fam-stat"><b className="x-mono"><Count to={f.stat} /></b><span>Suites won · Kai vs Jev</span></p>}
                  {f.foot && <p className="xmo-fam-foot">{f.foot}</p>}
                  <Lk to={f.to} onClick={(e) => open(e, e.currentTarget.closest('.xmo-fam-c').querySelector('.xmo-fam-film'), f.slug)}>{`Explore ${f.name}`}</Lk>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- 3. Enso vs Zen ---------- */
const VS = [
  { k: 'enso', name: 'Enso', tag: 'Proprietary · Hanzo Cloud only', items: ['Flash, Pro and Ultra presets', 'OpenAI- and Anthropic-compatible', 'Metered and audited per organization'], to: '/enso' },
  { k: 'zen', name: 'Zen', tag: 'Open weights · Zoo Labs Foundation', items: ['Free to download and self-host', 'Or call it on Hanzo Cloud', 'From a 501(c)(3) non-profit'], to: '/zen' },
];
function Versus() {
  return (
    <section className="xmo-sec xmo-vs" aria-labelledby="xmo-vs-h">
      <div className="x-wrap xmo-vs-g">
        <header>
          <p className="xmo-kick">Enso vs Zen</p>
          <h2 id="xmo-vs-h" className="xmo-headline">Proprietary orchestration, on open foundations</h2>
        </header>
        <div className="xmo-vs-t" role="table" aria-label="Enso and Zen compared">
          <div className="xmo-vs-r head" role="row">
            {VS.map((c) => (
              <div key={c.k} role="columnheader" className={'xmo-vs-c ' + c.k}>
                <h3>{c.name}</h3>
                <p>{c.tag}</p>
              </div>
            ))}
          </div>
          {[0, 1, 2].map((r) => (
            <div className="xmo-vs-r" role="row" key={r}>
              {VS.map((c) => <div key={c.k} role="cell" className={'xmo-vs-c ' + c.k}><i aria-hidden="true">✓</i>{c.items[r]}</div>)}
            </div>
          ))}
          <div className="xmo-vs-r foot" role="row">
            {VS.map((c) => <div key={c.k} role="cell" className={'xmo-vs-c ' + c.k}><Lk to={c.to}>{`Explore ${c.name}`}</Lk></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 4. Kai's decision benchmarks, as hero figures ---------- */
const SUITES = ['AG News', 'DAIR Emotion', 'Banking77', 'Support triage', 'Email spam', 'Phishing', 'Toxicity', 'RAG relevance', 'Model routing', 'Typed decisions', 'MASSIVE, 51 languages'];
const DUELS = [
  { kai: 84.4, jev: 76.6, say: 'mean accuracy across these 11 suites' },
  { kai: 100.0, jev: 44.2, say: 'of repeated requests answer identically' },
];
function Figures() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  return (
    <section className={'xmo-sec xmo-fig' + (seen ? ' on' : '')} ref={ref} aria-labelledby="xmo-fig-h">
      <div className="x-wrap xmo-fig-g">
        <header className="xmo-fig-head">
          <p className="xmo-kick">Decision Benchmarks</p>
          <h2 id="xmo-fig-h" className="xmo-headline">Ahead of Jev on 11 suites</h2>
          <ul className="xmo-suites">{SUITES.map((s) => <li key={s}>{s}</li>)}</ul>
          <Lk to="/kai#benchmarks">Kai: decisions and their benchmarks</Lk>
        </header>
        <div className="xmo-fig-big">
          <p className="xmo-num x-mono"><Count to={11} /></p>
          <p className="xmo-num-k">Suites won · Kai vs Jev</p>
        </div>
        {DUELS.map((d, i) => (
          <figure key={d.say} className="xmo-duel">
            <p className="xmo-duel-n x-mono"><Count to={d.kai} decimals={1} suffix="%" delay={0.15 + i * 0.1} /></p>
            <figcaption>{d.say}</figcaption>
            <div className="xmo-bars" aria-hidden="true">
              <span className="kai"><b>Kai</b><i style={{ '--v': d.kai / 100 }} /><em className="x-mono">{d.kai.toFixed(1)}%</em></span>
              <span className="jev"><b>Jev</b><i style={{ '--v': d.jev / 100 }} /><em className="x-mono">{d.jev.toFixed(1)}%</em></span>
            </div>
            <p className="xmo-duel-vs">{`against Jev's ${d.jev.toFixed(1)}%`}</p>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ---------- prices (used by the catalogue's cards, the compare tray and the price list) ---------- */
// id, name, in $/M, out $/M, context. Hanzo's catalogue as api.hanzo.ai lists it; refreshed in the browser when the gateway answers.
const ROWS = [
  ['enso', 'Enso', 0.33, 1.65, 900000], ['enso-auto', 'Enso', 0.33, 1.65, 900000], ['enso-flash', 'Enso Flash', 0.33, 1.65, 900000],
  ['enso-free', 'Enso Free', 0, 0, 1000000], ['enso-pro', 'Enso Pro', 4.4, 22, 1000000], ['enso-ultra', 'Enso Ultra', 5.5, 27.5, 1000000],
  ['zen6', 'Zen6', 0.6, 2.4, 1048576], ['zen6-flash', 'Zen6 Flash', 0.6, 2.4, 1048576], ['zen6-coder', 'Zen6 Coder', 1.65, 13, 1048576],
  ['zen6-free', 'Zen6 Free', 0, 0, 1000000], ['zen6-max', 'Zen6 Max', 28, 168, 1048576],
  ['zen5', 'Zen5', 0, 0, 1000000], ['zen5-pro', 'Zen5 Pro', 0, 0, 1000000], ['zen5-coder', 'Zen5 Coder', 0, 0, 1000000], ['zen5-flash', 'Zen5 Flash', 0, 0, 1000000],
  ['zen5-evo', 'Zen5 Evo', 0, 0, 1000000], ['zen5-mini', 'Zen5 Mini', 0, 0, 1000000], ['zen5-spark', 'Zen5 Spark', 0, 0, 1000000],
  ['zen-vl', 'Zen VL — Vision-Language', 0, 0, 1000000], ['zen-embedding', 'Zen Embedding', 0.01, 0.01, 32768], ['zen-embedding-3', 'Zen Embedding 3', 0.17, 0.17, 32768],
  ['zen-free', 'Zen Free', 0, 0, 1000000], ['zen-guard', 'Zen Guard — Content Safety', 0, 0, 128000], ['zen-scribe', 'Zen Scribe', null, null, null], ['zen-voice-mini', 'Zen Voice Mini', null, null, null],
  ['kai', 'Kai', 0.021, 0, 32768], ['hanzo/zen', 'Zen', 0, 0, 1000000],
];
const OTHERS = [
  ['anthropic/claude-fable-5', 'Claude Fable 5', 11.13025, 55.65125, 1000000], ['openai/gpt-3.5-turbo-0613', 'GPT-3.5 Turbo (older v0613)', 1.113025, 2.22605, 4095],
  ['google/gemini-2.5-pro', 'Gemini 2.5 Pro', 1.39128125, 11.13025, 1048576], ['deepseek/deepseek-chat', 'DeepSeek V3', 0.356168, 0.99059225, 163840],
  ['x-ai/grok-4.20', 'Grok 4.20', 1.39128125, 2.7825625, 2000000], ['meta/muse-glimmer-30b', 'Muse Glimmer 30B', 0.3339075, 1.33563, 131072], ['cohere/command-a', 'Command A', 2.7825625, 11.13025, 256000],
];
const dollars = (v) => (v == null ? '—' : '$' + (v > 0 && v < 1 ? v.toFixed(3) : v.toFixed(2)));
const cost = (r, i) => (r[2] === 0 && r[3] === 0 ? 'Free' : dollars(r[i]));
const ctxOf = (n) => (n == null ? '—' : n >= 950000 ? Math.round(n / 1e6) + 'M' : Math.round(n / 1000) + 'K');

/* api.hanzo.ai's live rates, asked once when the catalogue comes near; the printed rates stay when it is out of reach */
function useLive(go) {
  const [live, setLive] = useState({});
  useEffect(() => {
    if (!go) return;
    const ctl = new AbortController();
    fetch('https://api.hanzo.ai/v1/models', { signal: ctl.signal }).then((r) => r.json()).then((j) => {
      const m = {};
      (j.data || []).forEach((x) => { const p = x.pricing; if (p && p.input_per_million != null) m[x.id] = [p.input_per_million, p.output_per_million, x.context_window ?? null]; });
      setLive(m);
    }).catch(() => {});
    return () => ctl.abort();
  }, [go]);
  return (r) => (live[r[0]] ? [r[0], r[1], live[r[0]][0], live[r[0]][1], live[r[0]][2] ?? r[4]] : r);
}
const ALL = Object.fromEntries([...ROWS, ...OTHERS].map((r) => [r[0], r]));

/* ---------- 5. the catalogue ---------- */
const ENSO = [
  ['enso', 'Enso', '900K', "Hanzo's proprietary frontier model — Opus-class reasoning by default with 1M-context overflow.", ['text']],
  ['enso-flash', 'Enso Flash', '900K', 'Fast, economical Enso tier for high-volume, low-latency everyday work, with 1M-context overflow.', ['text']],
  ['enso-ultra', 'Enso Ultra', '1M', 'Adaptive fan-out — probes a task-appropriate model, escalates to a top-K panel only when needed, then verifies-then-selects the best answer.', ['text']],
];
const ZEN = [
  ['zen6', 'Zen6', '1M', null, ['text']],
  ['zen6-flash', 'Zen6 Flash', '1M', null, ['text']],
  ['zen5', 'Zen5 (Default)', '1M', 'Canonical Zen5 default. a 35B frontier MoE (3B active) (35B total / 3B active per token, released Apr 2026, Apache-2.0). 256K context, agentic-trained, OpenAI + Anthropic API. The everyday Zen5 chat model.', ['text']],
  ['zen5-pro', 'Zen5 Pro', '1M', 'Zen Flash IQ2_XXS-imatrix weights (81 GB GGUF on zenlm/zen-5-pro-gguf). 284B total / 37B active per token, 1M context, asymmetric routed-MoE quant. Fits a single 128 GB Apple Silicon / DGX Spark / H100 80 GB.', ['text']],
  ['zen5-coder', 'Zen5 Coder', '1M', 'Code-specialized Zen5 tier. 80B sparse MoE tuned for repo-scale code understanding, agentic refactoring, and tool-use coding loops.', ['text']],
  ['zen5-flash', 'Zen5 Flash', '1M', 'Smallest and cheapest text-only Zen5 chat tier. 4B-class dense, sub-100ms TTFT, 32K context. For high-volume routing and simple agent loops.', ['text']],
  ['zen-vl', 'Zen VL — Vision-Language', '1M', 'Reads images and reasons over them — visual Q&A, document and chart understanding, grounded captioning.', ['text']],
  ['zen-embedding', 'Zen Embedding', '33K', 'Dense text embeddings for semantic search, retrieval, and clustering.', ['embeddings']],
];
const KAI = [
  { to: '/models/hanzo/kai', name: 'Kai', id: 'kai', ctx: '33K', d: 'Hanzo Kai is a structured decision model answering typed questions at /v1/decisions with calibrated probabilities and zero output tokens. Full multimodal decision architecture (~850M parameters, 32K reach); native vision and audio towers: Kai-2 target.', tags: ['Text', 'State', 'Vision (Kai-2 target)'] },
  { to: '/kai#benchmarks', name: 'Decision Benchmarks', id: '11 suites won vs jev', d: "Ahead of Jev on 11 suites: AG News, DAIR Emotion, Banking77, Support triage, Email spam, Phishing, Toxicity, RAG relevance, Model routing, Typed decisions, MASSIVE, 51 languages. 84.4% mean accuracy across these 11 suites, against Jev's 76.6%. 100.0% of repeated requests answer identically, against Jev's 44.2%.", tags: ['benchmarks'] },
  { to: '/kai#types', name: 'Autonomous Agent Steering', id: 'decision-ready', d: "A choice, a score or a yes/no, each with its probabilities, for agent loops such as Hanzo Dev's.", tags: ['choice', 'score', 'noul'] },
];
const CREATIVE = [
  ['koma', 'Koma', 'koma-1', 'Cinematic video generation, character continuity, motion, animation, and shot-level creative control.', 'Video', 'api.hanzo.ai/v1/video'],
  ['iro', 'Iro', 'iro-1', 'High-fidelity image generation, creative direction, editing, character design and consistent visual assets.', 'Image', 'api.hanzo.ai/v1/images'],
  ['mori', 'Mori', 'mori-1', '3D assets, geometry, materials, environments and spatially consistent scenes.', '3D', 'api.hanzo.ai/v1/3d'],
  ['oto', 'Oto', 'oto-1', 'Film Foley, immersive sound effects, environmental audio and synchronized scene sound.', 'Foley', 'api.hanzo.ai/v1/foley'],
  ['koe', 'Koe', 'koe-1', 'Directable speech synthesis, character performances, dubbing and multilingual dialogue.', 'Voice', 'api.hanzo.ai/v1/audio/speech'],
  ['uta', 'Uta', 'uta-1', 'Soundtracks, original songs, musical ideas, cue-driven scoring and creative music production.', 'Music', 'api.hanzo.ai/v1/music'],
];
const LABS = [
  ['anthropic/claude-fable-5', 'Claude Fable 5', '1M', 'Claude Fable 5 is a Mythos-class model from Anthropic, built for autonomous knowledge work and coding. It supports text, image, and file inputs with text output, with reasoning support and...'],
  ['openai/gpt-3.5-turbo-0613', 'GPT-3.5 Turbo (older v0613)', '4K', "GPT-3.5 Turbo is OpenAI's fastest model. It can understand and generate natural language or code, and is optimized for chat and traditional completion tasks. Training data up to Sep 2021."],
  ['google/gemini-2.5-pro', 'Gemini 2.5 Pro', '1M', 'Gemini 2.5 Pro is Google’s state-of-the-art AI model designed for advanced reasoning, coding, mathematics, and scientific tasks. It employs “thinking” capabilities, enabling it to reason through responses with enhanced accuracy...'],
  ['deepseek/deepseek-chat', 'DeepSeek V3', '164K', 'DeepSeek-V3 is the latest model from the DeepSeek team, building upon the instruction following and coding abilities of the previous versions. Pre-trained on nearly 15 trillion tokens, the reported evaluations...'],
  ['x-ai/grok-4.20', 'Grok 4.20', '2M', 'Grok 4.20 is a reasoning model from SpaceXAI with industry-leading speed and agentic tool calling capabilities. It combines the lowest hallucination rate on the market with strict prompt adherance, delivering...'],
  ['meta/muse-glimmer-30b', 'Muse Glimmer 30B', '131K', 'Muse Glimmer 30B is a dense, open-weight multimodal model from Meta Superintelligence Labs, distilled from Muse Spark and optimized for autonomous agents on consumer hardware. It is suited for long-horizon...'],
  ['cohere/command-a', 'Command A', '256K', 'Command A is an open-weights 111B parameter model with a 256k context window focused on delivering great performance across agentic, multilingual, and coding use cases. Compared to other leading proprietary...'],
];
const CHIPS = [['all', 'All'], ['enso', 'Enso'], ['zen', 'Zen'], ['kai', 'Kai'], ['creative', 'Creative'], ['labs', 'Other labs']];
const COUNT = { enso: ENSO.length, zen: ZEN.length + 1, kai: KAI.length, creative: CREATIVE.length, labs: LABS.length };
COUNT.all = Object.values(COUNT).reduce((a, b) => a + b, 0);

/* A model card: its name is the link (and what flies into the model's page); its rate sits under it, and it can be
   pinned to the compare tray. */
function MCard({ to, name, id, ctx, d, tags, rate, cmp }) {
  const r = !rate || rate[2] == null ? null : rate[2] === 0 && rate[3] === 0 ? 'Free' : `${cost(rate, 2)} in · ${cost(rate, 3)} out`;
  return (
    <article className={'xmo-mc' + (cmp && cmp.on ? ' picked' : '')}>
      <div className="xmo-mc-top">
        <h3><A to={to} className="xmo-mc-a" data-morph>{name}</A></h3>
        {ctx && <b className="xmo-mc-ctx x-mono">{ctx}</b>}
      </div>
      <p className="xmo-mc-id x-mono">{id}</p>
      {d && <p className="xmo-mc-d">{d}</p>}
      <div className="xmo-mc-f">
        <span className="xmo-mc-tags">{tags.map((t) => <span key={t}>{t}</span>)}</span>
        {r && <span className="xmo-mc-rate x-mono" title="Per million tokens">{r}</span>}
        {cmp && (
          <button type="button" className="xmo-mc-cmp" aria-pressed={cmp.on} aria-label={`${cmp.on ? 'Remove' : 'Add'} ${name} ${cmp.on ? 'from' : 'to'} compare`} onClick={cmp.toggle} disabled={!cmp.on && cmp.full}>
            <i aria-hidden="true">{cmp.on ? '✓' : '+'}</i><span>Compare</span>
          </button>
        )}
      </div>
    </article>
  );
}

function Tile({ m }) {
  const open = useOpen();
  const [slug, name, id, d, kind, ep] = m;
  return (
    <a href={'/' + slug} className="xmo-ct" data-card={slug} data-cursor="Open" onClick={(e) => open(e, e.currentTarget, slug)}>
      <Film slug={slug} />
      <span className="xmo-ct-shade" aria-hidden="true" />
      <span className="xmo-ct-t">
        <span className="xmo-ct-top"><b>{name}</b><i className="x-mono">{id}</i></span>
        <em>Research preview</em>
        <span className="xmo-ct-d">{d}</span>
        <span className="xmo-ct-f"><span>{kind}</span><code>{ep}</code></span>
      </span>
    </a>
  );
}

/* A family's head pins beside its cards while they pass; flagships carry their film and open from it. */
function Head({ slug, title, children, link }) {
  return (
    <header className={'xmo-gh' + (slug ? ' film' : '')}>
      {slug && <span className="xmo-gh-film" data-card={slug + '-head'}><Film slug={slug} /></span>}
      <h2>{title}</h2>
      {children}
      {link}
    </header>
  );
}

function Catalogue({ at }) {
  const [fam, setFam] = useState('all');
  const sec = useRef(null);
  // a chip brings the catalogue's top back under the header, so the re-flowed family is what you see
  const choose = (k) => {
    setFam(k);
    const top = sec.current.getBoundingClientRect().top + scrollY - 60;
    if (scrollY > top + 4) (window.__lenis ? window.__lenis.scrollTo(top, { duration: 0.9 }) : scrollTo({ top, behavior: 'smooth' }));
  };
  const [picks, setPicks] = useState([]);
  const open = useOpen();
  const show = (f) => fam === 'all' || fam === f;
  const cmp = (id) => (ALL[id] ? {
    on: picks.includes(id),
    full: picks.length >= 3,
    toggle: () => setPicks((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length < 3 ? [...p, id] : p)),
  } : null);
  const card = (id, name, ctx, d, tags, to) => <li key={id}><MCard to={to} name={name} id={id} ctx={ctx} d={d} tags={tags} rate={ALL[id] && at(ALL[id])} cmp={cmp(id)} /></li>;
  const groups = [
    ['enso', <Head slug="enso" title="Enso models" link={<Lk to="/enso" onClick={(e) => open(e, e.currentTarget.closest('.xmo-gh').querySelector('.xmo-gh-film'), 'enso')}>Enso: the router, its presets and its runs</Lk>} />,
      <ul className="xmo-cards">{ENSO.map(([id, name, ctx, d, tags]) => card(id, name, ctx, d, tags, '/models/hanzo/' + id))}</ul>],
    ['zen', (
      <Head slug="zen" title="Zen models" link={<Lk to="https://docs.hanzo.ai/docs/models/zen">Run Zen: the docs</Lk>}>
        <p>Open weights, made with <A to="https://zoo.ngo">Zoo Labs Foundation</A>. Download every Zen model at <A to="https://huggingface.co/zenlm">huggingface.co/zenlm</A>, or call it here.</p>
      </Head>
    ), (
      <ul className="xmo-cards">
        {ZEN.map(([id, name, ctx, d, tags]) => card(id, name, ctx, d, tags, '/models/hanzo/' + id))}
        <li>
          <article className="xmo-mc soon">
            <div className="xmo-mc-top"><h3>Zen 7</h3></div>
            <p className="xmo-mc-id x-mono">zen7</p>
            <p className="xmo-mc-d">The next open-weight generation after Zen 6, in research preview.</p>
            <div className="xmo-mc-f"><span className="xmo-mc-tags"><span>Research preview</span></span><A to="/zen/7" className="x-btn sm xmo-soon-btn">Request access</A></div>
          </article>
        </li>
      </ul>
    )],
    ['kai', <Head slug="kai" title="Kai decision models" link={<Lk to="/kai" onClick={(e) => open(e, e.currentTarget.closest('.xmo-gh').querySelector('.xmo-gh-film'), 'kai')}>Kai: decisions and their benchmarks</Lk>} />,
      <ul className="xmo-cards">{KAI.map((k) => <li key={k.name}><MCard to={k.to} name={k.name} id={k.id} ctx={k.ctx} d={k.d} tags={k.tags} rate={ALL[k.id] && at(ALL[k.id])} cmp={cmp(k.id)} /></li>)}</ul>],
    ['creative', <Head title="Creative models" link={<Lk to="/design">Make something in Design</Lk>}><p>Video, images, 3D, sound effects, voice and music, each its own model, in research preview.</p></Head>,
      <ul className="xmo-cards tiles">{CREATIVE.map((m) => <li key={m[0]}><Tile m={m} /></li>)}</ul>],
    ['labs', <Head title="Flagships from other labs" link={<Lk to="#priced">Every model, priced</Lk>} />,
      <ul className="xmo-cards">{LABS.map(([id, name, ctx, d]) => card(id, name, ctx, d, ['text'], '/models/' + id))}</ul>],
  ];
  const picked = picks.map((id) => at(ALL[id]));
  return (
    <section className="xmo-sec xmo-cat" id="families" aria-label="The model catalogue" ref={sec}>
      <div className="xmo-chipbar">
        <div className="x-wrap xmo-chipbar-in">
          <div className="xmo-chips" role="group" aria-label="Filter the catalogue by family">
            {CHIPS.map(([k, t]) => (
              <button key={k} type="button" aria-pressed={fam === k} onClick={() => choose(k)}>
                {fam === k && <motion.span layoutId="xmo-chip" className="xmo-chip-bg" transition={SPRING} />}
                <span>{t}<sup className="x-mono">{COUNT[k]}</sup></span>
              </button>
            ))}
          </div>
          <p className="xmo-chip-n x-mono" aria-live="polite">{`${COUNT[fam]} models`}</p>
        </div>
      </div>
      <div className="x-wrap">
        <AnimatePresence mode="popLayout" initial={false}>
          {groups.filter(([k]) => show(k)).map(([k, head, body]) => (
            <motion.div
              key={k}
              layout="position"
              className={'xmo-group g-' + k}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24, transition: { duration: 0.22, ease: EASE } }}
              transition={{ duration: 0.6, ease: EASE, layout: SPRING }}
            >
              {head}
              {body}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <Tray picked={picked} drop={(id) => setPicks((p) => p.filter((x) => x !== id))} clear={() => setPicks([])} />
    </section>
  );
}

/* Beyond: the compare tray, rising from the bottom with up to three pinned models side by side. */
function Tray({ picked, drop, clear }) {
  const top = (i) => Math.max(...picked.map((r) => r[i] || 0)) || 1;
  const bar = (r, i) => <i className="xmo-tray-bar" aria-hidden="true"><b style={{ transform: `scaleX(${r[i] ? Math.max(0.02, r[i] / top(i)) : 0})` }} /></i>;
  return (
    <AnimatePresence>
      {picked.length > 0 && (
        <motion.aside className="xmo-tray" aria-label="Compare" initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '110%', transition: { duration: 0.3, ease: EASE } }} transition={SPRING} data-no-morph>
          <div className="xmo-tray-h">
            <b>Compare</b>
            <span className="x-mono">{`${picked.length} / 3`}</span>
            <button type="button" onClick={clear}>Clear</button>
          </div>
          <div className="xmo-tray-g" style={{ '--n': picked.length }}>
            <dl className="xmo-tray-k" aria-hidden="true"><dt>Model</dt><dd>Context</dd><dd>In $/M</dd><dd>Out $/M</dd></dl>
            {picked.map((r) => (
              <motion.dl key={r[0]} layout className="xmo-tray-c" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}>
                <dt><span>{r[1]}</span><code className="x-mono">{r[0]}</code><button type="button" aria-label={`Remove ${r[1]}`} onClick={() => drop(r[0])}>×</button></dt>
                <dd><b className="x-mono">{ctxOf(r[4])}</b>{bar(r, 4)}</dd>
                <dd><b className="x-mono">{cost(r, 2)}</b>{bar(r, 2)}</dd>
                <dd><b className="x-mono">{cost(r, 3)}</b>{bar(r, 3)}</dd>
              </motion.dl>
            ))}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

/* ---------- 6. every model, priced ---------- */
const LENS = [['all', 'Everything'], ['ours', 'Ours'], ['free', 'Free'], ['under', 'Under $1 / M out'], ['million', '1M context']];
const keep = {
  all: () => true, ours: () => true,
  free: (r) => r[2] === 0 && r[3] === 0,
  under: (r) => r[3] != null && r[3] < 1,
  million: (r) => r[4] != null && r[4] >= 950000,
};
const FOLD = 10;

function Priced({ at }) {
  const [lens, setLens] = useState('ours');
  const [all, setAll] = useState(false);
  const mine = ROWS.map(at).filter(keep[lens]);
  const theirs = lens === 'ours' ? [] : OTHERS.map(at).filter(keep[lens]);
  const n = mine.length + theirs.length;
  const topOut = Math.log10(Math.max(...[...mine, ...theirs].map((r) => r[3] || 0)) * 100 + 1) || 1;
  let k = 0;
  const row = (r, to) => {
    const fold = !all && k++ >= FOLD;
    return (
      <motion.tr key={r[0]} layout="position" hidden={fold} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
        <td><A to={to} className="xmo-row-n"><b>{r[1]}</b><code>{r[0]}</code></A></td>
        <td className="x-mono">{cost(r, 2)}</td>
        <td className="x-mono"><span className="xmo-out">{cost(r, 3)}<i className="xmo-bar" aria-hidden="true"><b style={{ transform: `scaleX(${r[3] ? Math.max(0.03, Math.log10(r[3] * 100 + 1) / topOut) : 0})` }} /></i></span></td>
        <td className="x-mono">{ctxOf(r[4])}</td>
      </motion.tr>
    );
  };
  return (
    <section className="xmo-sec xmo-priced" id="priced" aria-labelledby="xmo-pr-h">
      <div className="x-wrap">
        <div className="xmo-pr-g">
          <header>
            <p className="xmo-kick">Priced</p>
            <h2 id="xmo-pr-h" className="xmo-headline">Every model, and what it costs</h2>
            <p className="xmo-body">Dollars per million tokens, in and out, from the live catalog.</p>
            <Lk to="https://docs.hanzo.ai/docs/models">How models are called and billed</Lk>
          </header>
          <div className="xmo-pr-t">
            <div className="xmo-lens">
              <div className="xmo-chips flat" role="group" aria-label="Filter the price list">
                {LENS.map(([key, t]) => (
                  <button key={key} type="button" aria-pressed={lens === key} onClick={() => setLens(key)}>
                    {lens === key && <motion.span layoutId="xmo-lens" className="xmo-chip-bg" transition={SPRING} />}
                    <span>{t}</span>
                  </button>
                ))}
              </div>
              <p className="xmo-n x-mono" aria-live="polite">{`${n} models.`}</p>
            </div>
            <div className={'xmo-table' + (all ? ' all' : '')}>
              <table>
                <thead><tr><th scope="col">Model</th><th scope="col">In $/M</th><th scope="col">Out $/M</th><th scope="col">Context</th></tr></thead>
                <tbody>
                  <tr className="xmo-grp"><th scope="colgroup" colSpan={4}><A to="/models/hanzo">Hanzo</A><span>{`${mine.length} models`}</span></th></tr>
                  <AnimatePresence initial={false}>{mine.map((r) => row(r, '/models/hanzo/' + r[0].replace('hanzo/', '')))}</AnimatePresence>
                  {theirs.length > 0 && <tr className="xmo-grp" hidden={!all && k >= FOLD}><th scope="colgroup" colSpan={4}><span className="xmo-grp-n">Flagships from other labs</span><span>{`${theirs.length} models`}</span></th></tr>}
                  <AnimatePresence initial={false}>{theirs.map((r) => row(r, '/models/' + r[0]))}</AnimatePresence>
                </tbody>
              </table>
            </div>
            {n > FOLD && (
              <button type="button" className="xmo-more" aria-expanded={all} onClick={() => setAll((v) => !v)}>
                <span>{all ? 'Show fewer' : `Show all ${n}`}</span><i aria-hidden="true">{all ? '−' : '+'}</i>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 7. try any model: the request that changes its model by itself ---------- */
const REQ = [
  { tab: 'Enso', id: 'enso', d: "Hanzo's proprietary frontier model — Opus-class reasoning by default with 1M-context overflow.", ctx: '900K' },
  { tab: 'Zen 6', id: 'zen6', d: 'Open weights for the code, the copy, the images and the voice.', ctx: '1M' },
  { tab: 'Claude Fable 5', id: 'anthropic/claude-fable-5', d: 'Claude Fable 5 is a Mythos-class model from Anthropic, built for autonomous knowledge work and coding.', ctx: '1M' },
];

function Try() {
  const [k, setK] = useState(0);
  const [mine, setMine] = useState(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  const pick = (i) => { setK(i); setMine(true); };
  const r = REQ[k];
  return (
    <section className="xmo-sec xmo-try" aria-labelledby="xmo-try-h">
      <div className="x-wrap xmo-try-g">
        <header>
          <h2 id="xmo-try-h" className="xmo-headline">Try any model</h2>
          <p className="xmo-lede sm">Test any model directly on the gateway. Switch models by changing one string.</p>
          <p className="xmo-body">Sign in to chat with Enso, Zen, or any model on the endpoint. Pick a model, start a thread, billed to your account and kept private.</p>
          <div className="xmo-acts">
            <Btn to="https://platform.hanzo.ai/api-keys" solid>Get free API key</Btn>
            <Btn to="/chat">Open Hanzo Chat</Btn>
          </div>
        </header>
        <div className="xmo-req" ref={box}>
          <div className="xmo-req-bar">
            <span className="xmo-live"><i aria-hidden="true" />Live from api.hanzo.ai</span>
            <span className="x-mono">POST /v1/chat/completions</span>
            <span className="xmo-eg x-mono">example</span>
          </div>
          <pre className="xmo-json" aria-label="Request body"><code>
            <span>{'{ "model": '}</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={k} className="xmo-model" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>{`"${r.id}"`}</motion.span>
            </AnimatePresence>
            <span>{', "messages": [{ "role": "user", "content": "Who are you?" }] }'}</span>
            <i className="xmo-caret" aria-hidden="true" />
          </code></pre>
          <div className="xmo-tabs" role="tablist" aria-label="Model" onKeyDown={arrows(REQ.length, pick)}>
            {REQ.map((q, i) => (
              <button key={q.tab} type="button" role="tab" aria-selected={k === i} tabIndex={k === i ? 0 : -1} onClick={() => pick(i)}>
                {k === i && <motion.span layoutId="xmo-tab" className="xmo-tab-bg" transition={SPRING} />}
                <span>{q.tab}</span>
                {k === i && !mine && !calm && seen && <i className="xmo-tab-bar" aria-hidden="true" onAnimationEnd={() => setK((v) => (v + 1) % REQ.length)} />}
              </button>
            ))}
          </div>
          {/* all three descriptions are in the page; the chosen one is shown */}
          <div className="xmo-req-d" aria-live="polite">
            {REQ.map((q, i) => (
              <div key={q.tab} className={i === k ? 'on' : ''} aria-hidden={i !== k}>
                <p>{q.d}</p>
                <p className="xmo-ctx"><b className="x-mono">{q.ctx}</b><span className="x-mono">text</span></p>
              </div>
            ))}
          </div>
          <div className="xmo-compose" aria-disabled="true">
            <span className="xmo-effort">High</span>
            <span className="xmo-gate">
              <A to="/chat" className="x-btn sm">Log in</A>
              <A to="https://platform.hanzo.ai/api-keys" className="x-btn sm solid">Sign up for free</A>
            </span>
            <span className="xmo-send" aria-hidden="true">↑</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 8. your first request ---------- */
const CODE = [
  ['cURL', `curl https://api.hanzo.ai/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $HANZO_API_KEY" \\
  -d '{
    "model": "enso",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`],
  ['Python', `from openai import OpenAI

client = OpenAI(
    api_key=os.environ["HANZO_API_KEY"],
    base_url="https://api.hanzo.ai/v1",
)

response = client.chat.completions.create(
    model="enso",
    messages=[{"role": "user", "content": "Hello!"}],
)
print(response.choices[0].message.content)`],
  ['TypeScript', `import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.HANZO_API_KEY,
  baseURL: 'https://api.hanzo.ai/v1',
})

const response = await client.chat.completions.create({
  model: 'enso',
  messages: [{ role: 'user', content: 'Hello!' }],
})
console.log(response.choices[0].message.content)`],
  ['Go', `package main

import (
	"context"
	"fmt"
	"os"

	"github.com/sashabaranov/go-openai"
)

func main() {
	cfg := openai.DefaultConfig(os.Getenv("HANZO_API_KEY"))
	cfg.BaseURL = "https://api.hanzo.ai/v1"
	client := openai.NewClientWithConfig(cfg)
	resp, _ := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "enso",
			Messages: []openai.ChatCompletionMessage{
				{Role: openai.ChatMessageRoleUser, Content: "Hello!"},
			},
		},
	)
	fmt.Println(resp.Choices[0].Message.Content)
}`],
];
/* Strings pick up a colour; everything else stays plain. */
const hl = (code) => code.split(/("[^"\n]*"|'[^'\n]*')/).map((s, i) => (i % 2 ? <span key={i} className="s">{s}</span> : s));

function First() {
  const [k, setK] = useState(0);
  return (
    <section className="xmo-sec xmo-first" aria-labelledby="xmo-first-h">
      <div className="x-wrap xmo-first-g">
        <header>
          <h2 id="xmo-first-h" className="xmo-headline">Your first request</h2>
          <p className="xmo-body">The chat-completions shape you already send, at api.hanzo.ai/v1, in the language you write.</p>
          <div className="xmo-links">
            <Lk to="https://platform.hanzo.ai/api-keys">Get an API key</Lk>
            <Lk to="https://docs.hanzo.ai/docs/quickstart">The quickstart</Lk>
          </div>
        </header>
        <div className="xmo-code">
          <div className="xmo-code-top">
            <div className="xmo-tabs" role="tablist" aria-label="Language" onKeyDown={arrows(CODE.length, setK)}>
              {CODE.map(([t], i) => (
                <button key={t} type="button" role="tab" id={'xmo-tab-' + i} aria-controls={'xmo-sample-' + i} aria-selected={k === i} tabIndex={k === i ? 0 : -1} onClick={() => setK(i)}>
                  {k === i && <motion.span layoutId="xmo-lang" className="xmo-tab-bg" transition={SPRING} />}
                  <span>{t}</span>
                </button>
              ))}
            </div>
            <Copy text={CODE[k][1]} />
          </div>
          {CODE.map(([t, c], i) => (
            <div key={t} id={'xmo-sample-' + i} role="tabpanel" aria-labelledby={'xmo-tab-' + i} hidden={k !== i} className="xmo-pane">
              <pre tabIndex={0}><code>{hl(c)}</code></pre>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 9. related, as an editorial index ---------- */
const RELATED = [
  ['Agents', 'Build & run agents', '/agents'],
  ['Inference', null, '/engine'],
  ['Embeddings', 'Turn anything into vectors', '/cloud/embeddings'],
];
function Related() {
  return (
    <section className="xmo-sec xmo-rel" aria-labelledby="xmo-rel-h">
      <div className="x-wrap">
        <p className="xmo-kick" id="xmo-rel-h">Related capabilities</p>
        <ul>
          {RELATED.map(([t, d, to], i) => (
            <li key={t}>
              <A to={to}><span className="x-mono xmo-rel-n">{`0${i + 1}`}</span><b>{t}</b><span className="xmo-rel-d">{d}</span><i aria-hidden="true">→</i></A>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function ModelsPage() {
  const near = useRef(null);
  const go = useInView(near, { once: true, margin: '0px 0px 600px 0px' });
  const at = useLive(go);
  return (
    <main className="xmo">
      <Stage />
      <Families />
      <Versus />
      <Figures />
      <div ref={near} aria-hidden="true" />
      <Catalogue at={at} />
      <Priced at={at} />
      <Try />
      <First />
      <Related />
    </main>
  );
}
