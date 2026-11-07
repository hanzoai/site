'use client';
/* The Zen API catalog (/zen/models). Page type: Catalogue (MASTER 4.3): open a card.
   Chapters: the Zen5 field as the stage (a contour field drawn from the five Zen5 sizes, in a black room that opens
   from a rounded card to full width as you scroll; a 28svh band above the type on phone), the name at rest size (52px)
   beside Hanzo's lede and the key ask; Quick Start, where the model line retypes itself (zen6, zen6-flash, zen5-coder,
   the names in Hanzo's own comment), held in state so code, pressed name and copy always match; the five figures pinned
   over 200svh, each redrawing the stage's field from its own number as it cuts in at 112px Air; the Zen5 shelf of model
   cards built to docs/refs/hanzo-model-cards/SPEC.md (hover shows the model's size bars); the per-token sheet (row
   hover fills #f5f5f5 and lights its bars); a calm close whose field rises under the sheet.
   Signature: the sort race. Pick Hanzo's order, size or context, or a tier, and the Zen5 model cards re-flow (the leader
   takes the tall card) while the sheet below re-orders with them. Every card opens into its own model page (Morph).
   Beyond: the per-token sheet. Each Zen5 row draws total parameters against the parameters that work per token on one
   shared scale (35B with 3B active, 230B with 10B active, 284B with 37B active, from Hanzo's rows), plus context on a
   log scale; the row opens to Hanzo's own paragraph.
   V2: 8/10 review fixes: typed name in state (copy = display), own Zen5 field hero opening to full width, phone object band, 200svh figures with a per-figure field, empty tiers hidden, size-bar hovers. */
// Persona: Developer choosing a Zen model to call (MASTER 1: developers).
// Goal: pick a Zen5 model, open its page, then get a key.
// CTA: Get API key (Cta solid, data-cta zen-models.hero, data-thumb); close: Get Started (zen-models.close).
// Metric: api_key_created
// Signature: the sort race: Zen5 model cards re-flow on sort or tier, each card opening into its model page
// Beyond: the per-token sheet: total vs active parameters and context on one shared scale for every Zen5 model
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useScroll, useMotionValueEvent } from 'motion/react';
import { Copy } from '../../ui';
import { A, Cta } from '../../kit';
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

/* the stage: this page's own object, the Zen5 field (a Sigil seeded by the five Zen5 rows, total and active sizes),
   drifting and leaning toward the pointer on black; the black room enters as a rounded card inside the gutters and
   opens to full width as you scroll it away (clip-path only) */
const ZEN5 = ROWS.flatMap((r) => [r.tot, r.act || r.tot]);
function Stage() {
  const box = useRef(null), frame = useRef(null);
  const calm = useReducedMotion();
  const [held, setHeld] = useState(false); // the visitor paused the field
  const { scrollYProgress } = useScroll({ target: box, offset: ['start start', 'end start'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!calm && frame.current) frame.current.style.setProperty('--open', Math.min(1, Math.max(0, v * 2.4)).toFixed(3));
  });
  return (
    <section className="zc-stage" aria-labelledby="zc-h" ref={box}>
      <div className="zc-frame" data-room="dark" data-morph-target ref={frame}>
          <div className="zc-filmbox">
            <Sigil seed="/zen/models/zen5" data={ZEN5} still={held} className="zc-film" />
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
    </section>
  );
}

/* the model line retypes itself while on screen (a typing loop held in React state, so the code, the pressed name
   and the copied text are always the same string); a new cycle never starts while you hover or focus the block, a
   cycle already running finishes its name, and a press on a name switches to it */
function Quick() {
  const box = useRef(null), timer = useRef(0), now = useRef(NAMES[0]);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  const [m, setM] = useState(0); // the last name fully typed
  const [typed, setTyped] = useState(NAMES[0]); // exactly what the code shows
  const [pick, setPick] = useState(null); // once the visitor picks a name, the loop stops on it
  const [still, setStill] = useState(false); // hover or focus inside: hold
  const put = (s) => { now.current = s; setTyped(s); };
  const go = (toI) => {
    clearTimeout(timer.current);
    const to = NAMES[toI];
    const erase = () => { const s = now.current; if (s.length) { put(s.slice(0, -1)); timer.current = setTimeout(erase, 40); } else timer.current = setTimeout(type, 140); };
    const type = () => { const s = to.slice(0, now.current.length + 1); put(s); if (s.length < to.length) timer.current = setTimeout(type, 64); else { timer.current = 0; setM(toI); } };
    erase();
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (calm || pick !== null || !seen || still || timer.current) return;
    const t = setTimeout(() => go((m + 1) % NAMES.length), 2400);
    return () => clearTimeout(t);
  }, [seen, calm, m, pick, still]); // eslint-disable-line react-hooks/exhaustive-deps
  const choose = (i) => {
    setPick(i);
    if (calm) { clearTimeout(timer.current); timer.current = 0; put(NAMES[i]); setM(i); }
    else if (now.current !== NAMES[i] || timer.current) go(i);
  };
  const on = pick !== null ? pick : m;
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
            {NAMES.map((n, i) => <button key={n} type="button" aria-pressed={on === i} onClick={() => choose(i)}>{n}</button>)}
          </div>
        </div>
        <figure className="zc-term">
          <div className="zc-term-bar"><b>python</b><span className="zc-term-copy"><Copy text={code(typed)} /></span></div>
          <pre className="zc-code" tabIndex={0} data-lenis-prevent><code>{pre}<span className="zc-slot"><span>{typed}</span><i aria-hidden="true" /></span>{post}</code></pre>
        </figure>
      </div>
    </section>
  );
}

/* each figure draws its own number as data, under the figure, growing in as the figure cuts in and then idling:
   18 marks for the models (the five Zen5 in ink, the wave runs through them), the Zen5 contexts on a 2M ruler (a
   playhead sweeps it), one cent of a 100-cell dollar, the five Zen5 sizes (total against active per token), and
   seven rings for the modalities */
const BY_CTX = [...ROWS].sort((a, b) => b.ck - a.ck || b.tot - a.tot);
const grow = (k, prop = 'scaleX', step = 0.04) => ({
  initial: { [prop]: 0 }, animate: { [prop]: 1 }, transition: { duration: T.slower, ease: EMPH, delay: T.fast + k * step },
});
function FigArt({ i }) {
  if (i === 0) return (
    <div className="zc-fa zc-fa-18">{Array.from({ length: 18 }, (_, k) => <motion.i key={k} data-z={k < 5 || undefined} style={{ '--k': k }} {...grow(k, 'scaleY', 0.025)} />)}</div>
  );
  if (i === 1) return (
    <div className="zc-fa zc-fa-ctx">
      <span className="zc-fa-axis"><span className="zc-fa-ticks" /><b className="zc-mono">2M</b></span>
      {BY_CTX.map((r, k) => (
        <span key={r.slug} className="zc-fa-row"><span className="zc-mono">{r.ctx}</span><span className="zc-fa-track"><motion.i style={{ width: (r.ck / 2048) * 100 + '%' }} {...grow(k)} /></span></span>
      ))}
      <span className="zc-fa-head" />
    </div>
  );
  if (i === 2) return (
    <div className="zc-fa zc-fa-cents">{Array.from({ length: 100 }, (_, k) => <motion.i key={k} data-z={k === 0 || undefined} {...grow(k % 10 + Math.floor(k / 10), 'scale', 0.03)} />)}</div>
  );
  if (i === 3) return (
    <div className="zc-fa zc-fa-size">
      {ROWS.map((r, k) => (
        <span key={r.slug} className="zc-fa-srow" style={{ '--k': k }}>
          <span className="zc-fa-n">{r.n}</span>
          <span className="zc-fa-track"><motion.i className="zc-fa-tot" style={{ width: (r.tot / MAXP) * 100 + '%' }} {...grow(k)} />{r.act && <motion.i className="zc-fa-act" style={{ width: Math.max(1.2, (r.act / MAXP) * 100) + '%' }} {...grow(k + 4)} />}</span>
          <span className="zc-mono">{r.big}</span>
        </span>
      ))}
    </div>
  );
  return <div className="zc-fa zc-fa-7">{Array.from({ length: 7 }, (_, k) => <motion.i key={k} style={{ '--k': k }} {...grow(k, 'scale', 0.06)} />)}</div>;
}

/* five figures, one per screen: the scene pins; the old figure leaves before the new one cuts in through its mask,
   and its drawing crossfades to the new figure's drawing */
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
          <div className="zc-figs-r">
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
          {on && (
            <div className="zc-figs-art" aria-hidden="true">
              <AnimatePresence initial={false}>
                <motion.div key={at} className="zc-figs-draw"
                  initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: T.slower, ease: EMPH } }}
                  exit={{ opacity: 0, transition: { duration: T.base, ease: EXIT } }}>
                  <FigArt i={at} />
                </motion.div>
              </AnimatePresence>
            </div>
          )}
          </div>
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
        <span className="zc-mc-sz" aria-hidden="true">
          {/* the page's own --zc-w: the shared --w is a registered length, which would void scaleX() */}
          <span className="zc-mc-bar"><i className="zc-mc-tot" style={{ '--zc-w': Math.max(0.015, r.tot / MAXP).toFixed(3) }} />{r.act && <i className="zc-mc-act" style={{ '--zc-w': Math.max(0.012, r.act / MAXP).toFixed(3) }} />}</span>
          <span className="zc-mc-bar"><i className="zc-mc-ctx" style={{ '--zc-w': ctxW(r.ck).toFixed(3) }} /></span>
        </span>
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
  const ctl = useRef(null);
  // a rail that runs past the screen edge gets data-over: a right-edge peek (CSS) says there is more to swipe
  useEffect(() => {
    const segs = [...(ctl.current?.querySelectorAll('.zc-seg') || [])];
    const fit = () => segs.forEach((s) => { const pad = s.hasAttribute('data-over') ? 48 : 0; s.toggleAttribute('data-over', s.scrollWidth - pad > s.clientWidth + 1); });
    fit();
    const ro = new ResizeObserver(fit);
    segs.forEach((s) => ro.observe(s));
    return () => ro.disconnect();
  }, []);
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
        <div className="zc-ctl" ref={ctl}>
          <div className="zc-seg" role="group" aria-label="Tier">
            <button type="button" aria-pressed={tier === 'all'} onClick={() => setTier('all')}>{tier === 'all' && <motion.i layoutId="zc-tier-ink" className="zc-ink" transition={GLIDE} />}<span>All</span><small>{ROWS.length}</small></button>
            {/* a tier with no Zen5 model is not offered as a button; its name stays in the page as hidden text */}
            {TIERS.map((t) => count(t) ? (
              <button key={t} type="button" aria-pressed={tier === t} data-t={t.replace(' ', '-')} onClick={() => setTier(t)}>
                {tier === t && <motion.i layoutId="zc-tier-ink" className="zc-ink" transition={GLIDE} />}<span>{t}</span><small>{count(t)}</small>
              </button>
            ) : <span key={t} className="zc-vh">{t}</span>)}
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
        {/* the close's object: the figures' context ruler again, drifting slowly under the ask (no second field) */}
        <div className="zc-end-rule" aria-hidden="true"><span /></div>
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
