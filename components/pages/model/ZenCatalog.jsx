'use client';
/* The Zen API catalog (/zen/models). Page type: Catalogue (MASTER 4.3): open a card.
   Chapters: the Zen film as the stage, the name at rest size (52px) beside Hanzo's lede and the key ask; Quick Start,
   where the model line retypes itself (zen6, zen6-flash, zen5-coder, the names in Hanzo's own comment) and stops while
   you hover or focus it; the five figures, one per screen, pinned while you scroll (the moment grows to 112px Air, then
   the next one cuts in); the Zen5 shelf of model cards built to docs/refs/hanzo-model-cards/SPEC.md; the per-token sheet;
   a calm close.
   Signature: the sort race. Pick Hanzo's order, size or context, or a tier, and the Zen5 model cards re-flow (the leader
   takes the tall card) while the sheet below re-orders with them. Every card opens into its own model page (Morph).
   Beyond: the per-token sheet. Each Zen5 row draws total parameters against the parameters that work per token on one
   shared scale (35B with 3B active, 230B with 10B active, 284B with 37B active, from Hanzo's rows), plus context on a
   log scale; the row opens to Hanzo's own paragraph.
   V2: 8.5/10 MASTER rework: SPEC model cards (black, 20px, Sigil art, 3° tilt), deck sizes (52/26/112 Air), eased tweens only, 1152/13-col, film hero with the ask, sheet with inline detail. */
// Persona: Developer choosing a Zen model to call (MASTER 1: developers).
// Goal: pick a Zen5 model, open its page, then get a key.
// CTA: Get API key (Cta solid, data-cta zen-models.hero, data-thumb); close: Get Started (zen-models.close).
// Metric: api_key_created
// Signature: the sort race: Zen5 model cards re-flow on sort or tier, each card opening into its model page
// Beyond: the per-token sheet: total vs active parameters and context on one shared scale for every Zen5 model
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useScroll, useMotionValueEvent } from 'motion/react';
import { Copy } from '../../ui';
import { A, Cta, Film } from '../../kit';
import Sigil from '../../Sigil';
import './ZenCatalog.css';

// the deck's motion tokens (MASTER 3.1), in seconds; one emphasis curve; no springs
const T = { press: 0.09, fast: 0.15, base: 0.3, slow: 0.4, slower: 0.5, line: 0.7 };
const EMPH = [0.16, 1, 0.3, 1];
const EXIT = [0.4, 0, 0.2, 1];
const GLIDE = { duration: T.base, ease: EMPH };

const NAMES = ['zen6', 'zen6-flash', 'zen5-coder'];
const code = (m) => `from hanzoai import Hanzo

client = Hanzo()

# Use any Zen model
response = client.chat.completions.create(
    model="${m}",           # or zen6-flash, zen5-coder, etc.
    messages=[{"role": "user", "content": "Hello!"}],
)
print(response.choices[0].message.content)`;

const ROWS = [
  { n: 'Zen5 (Default)', slug: 'zen5', tier: 'pro', d: 'Canonical Zen5 default. a 35B frontier MoE (3B active) (35B total / 3B active per token, released Apr 2026, Apache-2.0). 256K context, agentic-trained, OpenAI + Anthropic API. The everyday Zen5 chat model.', big: '35B', small: '(3B active)', tot: 35, act: 3, ctx: '256K', ck: 256, arch: 'Zen frontier MoE' },
  { n: 'Zen5 Coder', slug: 'zen5-coder', tier: 'pro', d: 'Code-specialized Zen5 tier. 80B sparse MoE tuned for repo-scale code understanding, agentic refactoring, and tool-use coding loops.', big: '80B', small: '(MoE)', tot: 80, act: null, ctx: '256K', ck: 256, arch: 'Zen Coder MoE' },
  { n: 'Zen5 Flash', slug: 'zen5-flash', tier: 'starter', d: 'Smallest and cheapest text-only Zen5 chat tier. 4B-class dense, sub-100ms TTFT, 32K context. For high-volume routing and simple agent loops.', big: '4B', small: '', tot: 4, act: 4, ctx: '32K', ck: 32, arch: 'Zen dense' },
  { n: 'Zen5 Mini', slug: 'zen5-mini', tier: 'pro', d: 'Frontier agentic at the lowest cost in the family. Built on a 230B agentic MoE (10B active) (230B MoE / 10B active, released Feb 2026). 80.2% SWE-Bench Verified, 76.3% BrowseComp; trained on 200K+ real-world environments via large-scale RL.', big: '230B', small: '(10B active)', tot: 230, act: 10, ctx: '192K', ck: 192, arch: 'Zen MoE' },
  { n: 'Zen5 Pro', slug: 'zen5-pro', tier: 'ultra', d: 'Zen Flash IQ2_XXS-imatrix weights (81 GB GGUF on zenlm/zen-5-pro-gguf). 284B total / 37B active per token, 1M context, asymmetric routed-MoE quant. Fits a single 128 GB Apple Silicon / DGX Spark / H100 80 GB.', big: '284B', small: '(37B active)', tot: 284, act: 37, ctx: '1M', ck: 1024, arch: 'Zen Flash MoE' },
];
const TIERS = ['ultra max', 'ultra', 'pro max', 'pro', 'starter'];
const SORTS = [['hanzo', 'Hanzo’s order'], ['size', 'By size'], ['ctx', 'By context']];
const FIGS = [['18', 'Models'], ['2M', 'Max Context'], ['$0.01/MTok', 'From'], ['MoE + Dense', 'Architectures'], ['7', 'Modalities']];
const MAXP = 284, ctxW = (k) => (Math.log2(k) - 4) / (Math.log2(1024) - 4);

/* desktop with motion allowed: the pinned figures run; phones and reduced motion read the same content as a list */
function useStage() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const q = matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)');
    const f = () => setOn(q.matches);
    f(); q.addEventListener('change', f);
    return () => q.removeEventListener('change', f);
  }, []);
  return on;
}

function Stage() {
  const box = useRef(null);
  const [held, setHeld] = useState(false); // the visitor paused the film
  useEffect(() => {
    const v = box.current?.querySelector('video');
    if (!v) return;
    const keep = () => { if (held) v.pause(); };
    if (held) v.pause(); else if (v.currentSrc && !matchMedia('(prefers-reduced-motion: reduce)').matches) v.play?.().catch(() => {});
    v.addEventListener('play', keep);
    return () => v.removeEventListener('play', keep);
  }, [held]);
  return (
    <section className="zc-stage" aria-labelledby="zc-h">
      <div className="zc-wrap">
        <div className="zc-frame" data-room="dark" data-morph-target>
          <div className="zc-filmbox" ref={box}>
            <Film src="/models/zen.webm" poster="/models/zen.webp" w={1200} h={1500} className="zc-film" />
            <button type="button" className="zc-hold" aria-pressed={held} aria-label={held ? 'Play' : 'Pause'} onClick={() => setHeld((x) => !x)}>
              {held
                ? <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5 3.5v9l7.5-4.5z" fill="currentColor" /></svg>
                : <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5.5 3.5v9M10.5 3.5v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
            </button>
          </div>
          <div className="zc-frame-in">
            <h1 id="zc-h" className="zc-h1">
              <noscript><style>{'.zc-h1 .x-line-in,.zc-cell,.zc-li{transform:none!important;opacity:1!important}'}</style></noscript>
              <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: T.line, ease: EMPH, delay: 0.1 }}>Zen Models</motion.span></span>
              <span className="x-line zc-h1-2"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: T.line, ease: EMPH, delay: 0.16 }}>Complete API Catalog</motion.span></span>
            </h1>
            <p className="zc-badge"><i aria-hidden="true" />Zen 6 and Zen 6 Flash available now · Zen 7 in research preview</p>
            <p className="zc-lede">Built for agentic coding and multimodal work. <b>18</b> foundation models from <A to="https://zoo.industries">Zoo Labs Foundation</A> across language, code, vision, image, audio, and retrieval. Zen MoDE (Mixture of Diverse Experts) architecture. From $0.01/MTok.</p>
            <div className="zc-acts">
              <Cta to="https://platform.hanzo.ai/api-keys" id="zen-models.hero" thumb>Get API key</Cta>
              <a href="#zen5" className="x-arrow" data-cta="zen-models.hero-explore"><span>Explore Models</span><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 3v9M4.5 8.5 8 12l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
              <Cta to="/pricing" kind="link" id="zen-models.hero-pricing">Full Pricing</Cta>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* the model line retypes itself while on screen (a typing loop on one text node); it stops while you hover or focus
   the block, and a press on a name switches to it */
function Quick() {
  const box = useRef(null), slot = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  const [m, setM] = useState(0);
  const [pick, setPick] = useState(null); // once the visitor picks a name, the loop stops on it
  const [still, setStill] = useState(false); // hover or focus inside: hold
  useEffect(() => {
    const el = slot.current;
    if (calm) { if (pick !== null && pick !== m) { el.textContent = NAMES[pick]; setM(pick); } return; }
    if ((!seen || still) && pick === null) return;
    const toI = pick !== null ? pick : (m + 1) % NAMES.length;
    if (toI === m) return;
    let i = 0, t;
    const from = NAMES[m], to = NAMES[toI];
    const erase = () => { el.textContent = from.slice(0, from.length - ++i); if (i < from.length) t = setTimeout(erase, 40); else { i = 0; t = setTimeout(type, 140); } };
    const type = () => { el.textContent = to.slice(0, ++i); if (i < to.length) t = setTimeout(type, 64); else setM(toI); };
    t = setTimeout(erase, pick !== null ? 0 : 2400);
    return () => { clearTimeout(t); el.textContent = from; };
  }, [seen, calm, m, pick, still]);
  const [pre, post] = code('\u0000').split('\u0000');
  const hold = { onPointerEnter: () => setStill(true), onPointerLeave: () => setStill(false), onFocus: () => setStill(true), onBlur: () => setStill(false) };
  return (
    <section className="zc-quick zc-sec" aria-labelledby="zc-q-h" ref={box}>
      <div className="zc-wrap zc-quick-g" {...hold}>
        <div className="zc-quick-t">
          <h2 id="zc-q-h" className="zc-h2">Quick Start</h2>
          <p className="zc-lede-d">Drop-in OpenAI-compatible API. Switch models with one line.</p>
          <div className="zc-picks" role="group" aria-label="model=">
            <span className="zc-mono" aria-hidden="true">model=</span>
            {NAMES.map((n, i) => <button key={n} type="button" aria-pressed={m === i} onClick={() => setPick(i)}>{n}</button>)}
          </div>
        </div>
        <figure className="zc-term">
          <div className="zc-term-bar"><b>python</b><span className="zc-term-copy"><Copy text={code(NAMES[m])} /></span></div>
          <pre className="zc-code" tabIndex={0} data-lenis-prevent><code>{pre}<span className="zc-slot"><span ref={slot}>zen6</span><i aria-hidden="true" /></span>{post}</code></pre>
        </figure>
      </div>
    </section>
  );
}

/* five figures, one per screen: the scene pins; the old figure leaves before the new one cuts in through its mask */
function Figures() {
  const ref = useRef(null);
  const on = useStage();
  const [at, setAt] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => { if (on) setAt(Math.min(FIGS.length - 1, Math.max(0, Math.floor(v * FIGS.length)))); });
  return (
    <section className="zc-figs" ref={ref} data-live={on || undefined} aria-label="Zen figures">
      <div className="zc-figs-pin">
        <div className="zc-wrap zc-figs-g">
          <ol className="zc-figs-idx" aria-hidden="true">
            {FIGS.map(([, l], i) => <li key={l} data-on={!on || i === at || undefined}><span className="zc-mono">{String(i + 1).padStart(2, '0')} / 05</span>{l}</li>)}
          </ol>
          <dl className="zc-figs-list">
            {FIGS.map(([v, l], i) => (
              <div key={l} className="zc-fig" data-on={!on || i === at || undefined}>
                <motion.div className="zc-fig-in" initial={false}
                  animate={!on || i === at ? { y: '0%' } : { y: i < at ? '-104%' : '104%' }}
                  transition={!on || i === at ? { duration: T.slower, ease: EMPH, delay: T.fast } : { duration: T.fast, ease: EXIT }}>
                  <dt>{l}</dt>
                  <dd>{v}</dd>
                </motion.div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* the model card of docs/refs/hanzo-model-cards/SPEC.md: black, 20px, art behind, title top left, tag pill bottom left,
   a pointer tilt up to 3 degrees that settles flat on leave (fine pointers, never under reduced motion) */
const tilt = (e) => {
  if (e.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const el = e.currentTarget, r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
  el.style.transform = `perspective(900px) rotateX(${((py - 0.5) * 5.4).toFixed(2)}deg) rotateY(${((0.5 - px) * 5.4).toFixed(2)}deg)`;
};
const flat = (e) => { e.currentTarget.style.transform = ''; };

function ModelCard({ r, big }) {
  return (
    <motion.li layout className="zc-cell" data-big={big || undefined}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: T.fast, ease: EXIT } }}
      transition={{ layout: GLIDE, duration: T.base, ease: EMPH }}>
      <A to={'/models/hanzo/' + r.slug} className="zc-mc" data-morph data-cursor="" data-cta={'zen-models.card-' + r.slug} onPointerMove={tilt} onPointerLeave={flat}>
        <Sigil seed={'/models/hanzo/' + r.slug} data={[r.tot, r.act || r.tot, r.ck]} className="zc-mc-art" />
        <span className="zc-mc-t">{r.n} <span aria-hidden="true">→</span></span>
        <span className="zc-mc-d">{r.big}{r.small ? ' ' + r.small : ''} · {r.ctx}</span>
        <span className="zc-mc-tag">{r.tier}</span>
      </A>
    </motion.li>
  );
}

function Row({ r, seen, i, open, onOpen }) {
  const body = 'zc-more-' + r.slug;
  return (
    <motion.li layout className="zc-li" data-open={open || undefined} transition={{ layout: GLIDE }}>
      <div className="zc-row">
        <b className="zc-row-n">{r.n}</b>
        <span className="zc-row-p"><span className="zc-row-big">{r.big}</span>{r.small && <span className="zc-row-s"> {r.small}</span>}</span>
        <span className="zc-meter" aria-hidden="true">
          <span className="zc-bar"><i className="zc-tot" style={{ transform: `scaleX(${seen ? Math.max(0.015, r.tot / MAXP) : 0})`, transitionDelay: 0.1 + i * 0.06 + 's' }} />{r.act && <i className="zc-act" style={{ transform: `scaleX(${seen ? Math.max(0.012, r.act / MAXP) : 0})`, transitionDelay: 0.4 + i * 0.06 + 's' }} />}</span>
          <span className="zc-bar"><i className="zc-ctx" style={{ transform: `scaleX(${seen ? ctxW(r.ck) : 0})`, transitionDelay: 0.25 + i * 0.06 + 's' }} /></span>
        </span>
        <span className="zc-row-c">{r.ctx}</span>
        <span className="zc-row-a">{r.arch}</span>
        <span className="zc-row-v">$0 / $0</span>
        <button type="button" className="zc-row-x" aria-expanded={!!open} aria-controls={body} aria-label={r.n} onClick={onOpen}>
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
      </div>
      <div id={body} className="zc-row-more"><p>{r.d}</p></div>
    </motion.li>
  );
}

function Shelf() {
  const box = useRef(null), sheet = useRef(null);
  const seen = useInView(sheet, { once: true, amount: 0.2 });
  const [sort, setSort] = useState('hanzo');
  const [tier, setTier] = useState('all');
  const [open, setOpen] = useState(null);
  const count = (t) => ROWS.filter((r) => r.tier === t).length;
  const shown = (sort === 'hanzo' ? ROWS : [...ROWS].sort(sort === 'size' ? (a, b) => b.tot - a.tot : (a, b) => b.ck - a.ck || b.tot - a.tot))
    .filter((r) => tier === 'all' || r.tier === tier);
  return (
    <section className="zc-shelf zc-sec" id="zen5" ref={box} aria-labelledby="zc-cat-h">
      <div className="zc-wrap">
        <div className="zc-head">
          <div><h2 id="zc-cat-h" className="zc-h2">Zen5 -- Agentic Frontier</h2></div>
          <div className="zc-side">
            <p className="zc-kick">Zen5</p>
            <p className="zc-lede-d">Agentic frontier models trained on 10B+ tokens of real-world tool use and multi-step reasoning.</p>
          </div>
        </div>
        <div className="zc-ctl">
          <div className="zc-seg" role="group" aria-label="Tier">
            <button type="button" aria-pressed={tier === 'all'} onClick={() => setTier('all')}>{tier === 'all' && <motion.i layoutId="zc-tier-ink" className="zc-ink" transition={GLIDE} />}<span>All</span><small>{ROWS.length}</small></button>
            {TIERS.map((t) => (
              <button key={t} type="button" aria-pressed={tier === t} disabled={!count(t)} data-t={t.replace(' ', '-')} onClick={() => setTier(t)}>
                {tier === t && <motion.i layoutId="zc-tier-ink" className="zc-ink" transition={GLIDE} />}<span>{t}</span><small>{count(t)}</small>
              </button>
            ))}
          </div>
          <div className="zc-seg" role="group" aria-label="Order">
            {SORTS.map(([k, l]) => (
              <button key={k} type="button" aria-pressed={sort === k} onClick={() => setSort(k)}>
                {sort === k && <motion.i layoutId="zc-sort-ink" className="zc-ink" transition={GLIDE} />}<span>{l}</span>
              </button>
            ))}
          </div>
        </div>
        <ul className="zc-grid" aria-label="Zen5 models" data-n={shown.length}>
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((r, i) => <ModelCard key={r.slug} r={r} big={i === 0} />)}
          </AnimatePresence>
        </ul>
        <div className="zc-sheet" ref={sheet}>
          <div className="zc-row zc-row-h">
            <span>Model</span><span>Params</span>
            <span className="zc-key"><i className="zc-k-tot" />total params <i className="zc-k-act" />active per token <i className="zc-k-ctx" />context</span>
            <span>Context</span><span>Arch</span><span>Availability</span><span />
          </div>
          <ol className="zc-rows" aria-label="Zen5 models, per token">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((r, i) => <Row key={r.slug} r={r} i={i} seen={seen} open={open === r.slug} onOpen={() => setOpen(open === r.slug ? null : r.slug)} />)}
            </AnimatePresence>
          </ol>
        </div>
      </div>
    </section>
  );
}

export default function ZenCatalog() {
  return (
    <main className="zc">
      <Stage />
      <Quick />
      <Figures />
      <Shelf />
      <section className="zc-end zc-sec" aria-labelledby="zc-b">
        <Sigil seed="zen/models" data={[18, 2, 0.01, 7, 284, 37]} className="zc-sig" />
        <div className="zc-wrap zc-end-in">
          <h2 id="zc-b" className="zc-end-h">Ready to build with Zen?</h2>
          <p className="zc-lede-d">All 18 Zen models available via OpenAI-compatible API. Start building today.</p>
          <div className="zc-acts">
            <Cta to="/signup" id="zen-models.close">Get Started</Cta>
            <Cta to="/dev" kind="link" id="zen-models.close-dev">Try Hanzo Dev</Cta>
            <Cta to="/pricing" kind="link" id="zen-models.close-pricing">View Pricing</Cta>
          </div>
        </div>
      </section>
    </main>
  );
}
