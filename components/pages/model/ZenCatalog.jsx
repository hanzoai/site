'use client';
/* The Zen API catalog (/zen/models), archetype C: a catalogue you sort, filter and open.
   Chapters: the Zen film as the stage with the name over it; Quick Start, where the model line retypes itself (zen6,
   zen6-flash, zen5-coder: the names in Hanzo's own comment, written into a text node, no per-letter state); the five
   figures, one per screen, pinned while you scroll; the Zen5 shelf; a calm closing with the page's Sigil.
   Signature: the sort race. Pick Hanzo's order, size or context and the Zen5 cards re-flow into a new bento, the biggest
   slot going to the leader; filter by tier and the shelf closes up. Every card opens into its own model page (the whole
   card flies into the next page's hero through the site's morph layer).
   Beyond: the per-token meter. Each card draws its total parameters and the parameters that work per token on one
   shared scale (35B with 3B active, 230B with 10B active, 284B with 37B active, from Hanzo's rows), plus context on a log
   scale, so the mixture-of-experts trade is visible at a glance.
   V2: 8.5/10 Rebuilt as chapters (JAMES.md: no UI hues, nothing above the h1, one solid ask per screen): film stage hero, one-line Quick Start retype, pinned one-figure-per-screen scrub, a bento shelf that re-flows on sort and filter, cards that open into their model pages. */
// Signature: the sort race: Zen5 cards re-flow into a new bento on sort or tier filter, each card opening into its model page
// Beyond: the per-token meter: total vs active parameters and context on one shared scale for every Zen5 model
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useScroll, useMotionValueEvent } from 'motion/react';
import { EASE, Copy } from '../../ui';
import { A, More } from '../../kit';
import Sigil from '../../Sigil';
import './ZenCatalog.css';

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
// bento spans on the 12-column grid for however many cards are on the shelf
const SPANS = { 1: ['xl'], 2: ['l', 'm'], 3: ['l', 'm', 'xl'], 4: ['l', 'm', 'm', 'l'], 5: ['l', 'm', 's', 's', 's'] };
const MAXP = 284, ctxW = (k) => (Math.log2(k) - 4) / (Math.log2(1024) - 4);

/* desktop with motion allowed: the pinned chapters run; phones and reduced motion read the same content as a list */
function useStage() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const q = matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)');
    const f = () => setOn(q.matches);
    f(); q.addEventListener('change', f);
    return () => q.removeEventListener('change', f);
  }, []);
  return on;
}

function Stage() {
  const film = useRef(null);
  useEffect(() => {
    const v = film.current;
    if (!v || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.1 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <section className="zc-stage" aria-labelledby="zc-h">
      <div className="zc-wrap">
        <div className="zc-frame" data-morph-target>
          <video ref={film} className="zc-film" src="/models/zen.webm" poster="/models/zen.webp" muted loop playsInline preload="metadata" aria-hidden="true" />
          <div className="zc-frame-in">
            <h1 id="zc-h" className="zc-h1">
              <span className="x-line"><motion.span className="x-line-in" initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}>Zen Models</motion.span></span>
              <span className="x-line zc-h1-2"><motion.span className="x-line-in" initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.22 }}>Complete API Catalog</motion.span></span>
            </h1>
            <p className="zc-badge"><i aria-hidden="true" />Zen 6 and Zen 6 Flash available now · Zen 7 in research preview</p>
            <div className="zc-frame-foot">
              <p className="zc-lede">Built for agentic coding and multimodal work. <b>18</b> foundation models from <A to="https://zoo.industries">Zoo Labs Foundation</A> across language, code, vision, image, audio, and retrieval. Zen MoDE (Mixture of Diverse Experts) architecture. From $0.01/MTok.</p>
              <div className="zc-acts">
                <A to="https://platform.hanzo.ai/api-keys" className="x-btn solid" data-thumb="Get API key">Get API key</A>
                <a href="#zen5" className="x-arrow"><span>Explore Models</span><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 3v9M4.5 8.5 8 12l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
                <More to="/pricing">Full Pricing</More>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* the model line retypes itself while on screen (a typing loop on one text node); press a name to switch to it */
function Quick() {
  const box = useRef(null), slot = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  const [m, setM] = useState(0);
  const [pick, setPick] = useState(null); // once the visitor picks a name, the loop stops on it
  useEffect(() => {
    const el = slot.current;
    if (calm) { if (pick !== null && pick !== m) { el.textContent = NAMES[pick]; setM(pick); } return; }
    if (!seen && pick === null) return;
    const toI = pick !== null ? pick : (m + 1) % NAMES.length;
    if (toI === m) return;
    let i = 0, t;
    const from = NAMES[m], to = NAMES[toI];
    const erase = () => { el.textContent = from.slice(0, from.length - ++i); if (i < from.length) t = setTimeout(erase, 40); else { i = 0; t = setTimeout(type, 140); } };
    const type = () => { el.textContent = to.slice(0, ++i); if (i < to.length) t = setTimeout(type, 64); else setM(toI); };
    t = setTimeout(erase, pick !== null ? 0 : 2400);
    return () => { clearTimeout(t); el.textContent = from; };
  }, [seen, calm, m, pick]);
  const [pre, post] = code('\u0000').split('\u0000');
  return (
    <section className="zc-quick" aria-labelledby="zc-q-h" ref={box}>
      <div className="zc-wrap zc-quick-g">
        <div className="zc-quick-t">
          <h2 id="zc-q-h" className="zc-h2">Quick Start</h2>
          <p className="zc-lede-d">Drop-in OpenAI-compatible API. Switch models with one line.</p>
          <div className="zc-picks" role="group" aria-label="model=">
            <span className="zc-mono" aria-hidden="true">model=</span>
            {NAMES.map((n, i) => <button key={n} type="button" aria-pressed={m === i} onClick={() => setPick(i)}>{n}</button>)}
          </div>
        </div>
        <figure className="zc-term">
          <div className="zc-term-bar"><i /><i /><i /><b>python</b><span className="zc-term-copy"><Copy text={code(NAMES[m])} /></span></div>
          <pre className="zc-code" tabIndex={0} data-lenis-prevent><code>{pre}<span className="zc-slot"><span ref={slot}>zen6</span><i aria-hidden="true" /></span>{post}</code></pre>
        </figure>
      </div>
    </section>
  );
}

/* five figures, one per screen: the scene pins and each figure comes in as the last one leaves */
function Figures() {
  const ref = useRef(null);
  const on = useStage();
  const [at, setAt] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => { if (on) setAt(Math.min(FIGS.length - 1, Math.max(0, Math.floor(v * FIGS.length)))); });
  return (
    <section className="zc-figs" ref={ref} data-live={on || undefined} aria-label="Zen at a glance">
      <div className="zc-figs-pin">
        <div className="zc-wrap zc-figs-g">
          <ol className="zc-figs-idx" aria-hidden="true">
            {FIGS.map(([, l], i) => <li key={l} data-on={!on || i === at || undefined}><span className="zc-mono">{String(i + 1).padStart(2, '0')}</span>{l}</li>)}
          </ol>
          <dl className="zc-figs-list">
            {FIGS.map(([v, l], i) => (
              <motion.div key={l} className="zc-fig" initial={false}
                animate={!on ? { opacity: 1, y: 0 } : i === at ? { opacity: 1, y: 0 } : { opacity: 0, y: i < at ? '-22%' : '22%' }}
                transition={{ duration: 0.75, ease: EASE }}>
                <dt>{l}</dt>
                <dd data-short={v.length < 4 || undefined}>{v}</dd>
              </motion.div>
            ))}
          </dl>
          {on && <motion.i className="zc-figs-line" aria-hidden="true" style={{ scaleY: scrollYProgress }} />}
        </div>
      </div>
    </section>
  );
}

function Card({ r, size, seen, i }) {
  return (
    <motion.li layout className="zc-cell" data-size={size}
      initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
      transition={{ layout: { type: 'spring', stiffness: 300, damping: 30 }, duration: 0.4, ease: EASE }}>
      <A to={'/models/hanzo/' + r.slug} className="zc-card" data-morph>
        <motion.span layout="position" className="zc-card-top">
          <em className="zc-tier" data-t={r.tier}>{r.tier.toUpperCase()}</em>
          <span className="zc-open" aria-hidden="true">Open<svg viewBox="0 0 16 16" width="14" height="14"><path d="M4 12 12 4M6 4h6v6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
        </motion.span>
        <motion.b layout="position" className="zc-name">{r.n}</motion.b>
        <motion.span layout="position" className="zc-p"><span className="zc-lab">Params</span><span className="zc-big">{r.big}</span> {r.small && <span className="zc-small">{r.small}</span>}</motion.span>
        <motion.span layout="position" className="zc-meter" aria-hidden="true">
          <span className="zc-bar"><i className="zc-tot" style={{ transform: `scaleX(${seen ? Math.max(0.015, r.tot / MAXP) : 0})`, transitionDelay: 0.1 + i * 0.06 + 's' }} />{r.act && <i className="zc-act" style={{ transform: `scaleX(${seen ? Math.max(0.012, r.act / MAXP) : 0})`, transitionDelay: 0.45 + i * 0.06 + 's' }} />}</span>
          <span className="zc-bar ctx"><i className="zc-ctx" style={{ transform: `scaleX(${seen ? ctxW(r.ck) : 0})`, transitionDelay: 0.25 + i * 0.06 + 's' }} /></span>
        </motion.span>
        <motion.span layout="position" className="zc-d">{r.d}</motion.span>
        <motion.dl layout="position" className="zc-spec">
          <div><dt>Context</dt><dd>{r.ctx}</dd></div>
          <div><dt>Arch</dt><dd>{r.arch}</dd></div>
          <div><dt>Availability</dt><dd>$0 / $0</dd></div>
        </motion.dl>
      </A>
    </motion.li>
  );
}

function Shelf() {
  const box = useRef(null);
  const seen = useInView(box, { once: true, amount: 0.15 });
  const [sort, setSort] = useState('hanzo');
  const [tier, setTier] = useState('all');
  const count = (t) => ROWS.filter((r) => r.tier === t).length;
  const shown = (sort === 'hanzo' ? ROWS : [...ROWS].sort(sort === 'size' ? (a, b) => b.tot - a.tot : (a, b) => b.ck - a.ck || b.tot - a.tot))
    .filter((r) => tier === 'all' || r.tier === tier);
  const spans = SPANS[shown.length] || [];
  const ink = { type: 'spring', stiffness: 300, damping: 30 };
  return (
    <section className="zc-shelf" id="zen5" ref={box} aria-labelledby="zc-cat-h">
      <div className="zc-wrap">
        <div className="zc-shelf-head">
          <div>
            <h2 id="zc-cat-h" className="zc-h2">Zen5 -- Agentic Frontier</h2>
          </div>
          <div className="zc-shelf-side">
            <p className="zc-kick">Zen5</p>
            <p className="zc-lede-d">Agentic frontier models trained on 10B+ tokens of real-world tool use and multi-step reasoning.</p>
          </div>
        </div>
        <div className="zc-ctl">
          <div className="zc-seg" role="group" aria-label="Tier">
            <button type="button" aria-pressed={tier === 'all'} onClick={() => setTier('all')}>{tier === 'all' && <motion.i layoutId="zc-tier-ink" className="zc-ink" transition={ink} />}<span>All</span><small>{ROWS.length}</small></button>
            {TIERS.map((t) => (
              <button key={t} type="button" aria-pressed={tier === t} disabled={!count(t)} data-t={t.replace(' ', '-')} onClick={() => setTier(t)}>
                {tier === t && <motion.i layoutId="zc-tier-ink" className="zc-ink" transition={ink} />}<span>{t}</span><small>{count(t)}</small>
              </button>
            ))}
          </div>
          <div className="zc-seg" role="group" aria-label="Order">
            {SORTS.map(([k, l]) => (
              <button key={k} type="button" aria-pressed={sort === k} onClick={() => setSort(k)}>
                {sort === k && <motion.i layoutId="zc-sort-ink" className="zc-ink" transition={ink} />}<span>{l}</span>
              </button>
            ))}
          </div>
          <p className="zc-key"><i className="zc-k-tot" />total params <i className="zc-k-act" />active per token <i className="zc-k-ctx" />context</p>
        </div>
        <ul className="zc-grid" aria-label="Zen5 models" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((r, i) => <Card key={r.slug} r={r} i={i} size={spans[i]} seen={seen} />)}
          </AnimatePresence>
        </ul>
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
      <section className="zc-end" aria-labelledby="zc-b">
        <Sigil seed="zen/models" data={[18, 2, 0.01, 7, 284, 37]} className="zc-sig" />
        <div className="zc-wrap zc-end-g">
          <h2 id="zc-b" className="zc-end-h">Ready to build with Zen?</h2>
          <div className="zc-end-r">
            <p className="zc-lede-d">All 18 Zen models available via OpenAI-compatible API. Start building today.</p>
            <div className="zc-acts">
              <A to="/signup" className="x-btn solid">Get Started</A>
              <More to="/dev">Try Hanzo Dev</More>
              <More to="/pricing">View Pricing</More>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
