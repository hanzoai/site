'use client';
// V2: 8/10 (own estimate; critic pending) the 11 on its own line; catalogue cards quiet until hover (phone: 72px rows with a thumb); Copy legible, 44px, announced; closing black room; no hero timer (pointer- and scroll-lit); SPEC grid 385/192; no hydration mismatch
// Persona: Developer choosing a model (and the buyer comparing labs). Goal: find the model, open its page. CTA: "Get API key" (platform.hanzo.ai/api-keys). Metric: api_key_created.
// Signature: a card opens into its page. The first screen is Hanzo's model grid exactly as live hanzo.ai draws it (SPEC.md); every card lifts into its model's page (the WebGL opener), every catalogue card's name flies into its sheet (morph).
// Beyond: every model reachable. One collapsed "Every model" list links all of Hanzo's model and maker pages from here, findable with Ctrl-F, so no page of the 544 is an orphan.
/* Models, v2 (docs/build-notes/_archive/VISION.md archetype C, docs/build-notes/DONE.md, docs/build-notes/PLAN-COMPONENTS.md 5.4 and 2.15), one idea per screen:
   1 Hanzo's model grid exactly (SPEC.md): Enso's film plays; the light follows the pointer, or walks the cards as
     the grid scrolls past (no timer).
   2 Three families, the one dark room: the words pin, the film changes under a clip wipe.
   3 Enso vs Zen as a two-column spec with each family's film.  4 Kai's benchmarks as hero figures.
   5 The catalogue: chips re-flow the families, each family's head pins beside its cards, every card opens; then the
     collapsed list of every model and maker.  6 Every model priced (ten rows, the rest a press away).
   7 Try any model: the request swaps its model by itself.  8 Your first request.  9 Related, over a drifting Sigil.
   Motion mix: idle (films, the self-switching request, the Sigil), scroll (the grid's light), pointer (hover plays a film,
   the Sigil leans to the cursor), state (chips re-flow, tabs, the open), arrival (headline cut-in, count-up), scroll
   (the fly-in and the pinned families). One pause stops everything that moves by itself.
   No UI hue: greys, black and white; colour arrives only through the films. Every word, id, rate and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { EASE } from '../ui';
import { A, Cta, Tabs, TabPanel, CodeBlock } from '../kit';
import { useOpener } from '../Opener';
import Sigil from '../Sigil';
import ModelFilm, { FilmPause, usePaused } from '../v2/ModelFilm';
import SpecCard, { useSpecTilt } from '../v2/SpecCard';
import MaskFig from '../v2/MaskFig';
import { media, bySlug } from '../../lib/models';
import { ROWS, OTHERS } from './models/rates';
import { BOARD } from './benchmarksData';
import { CopyStatus } from './models/parts';
import './ModelsPage.css';

/* Kai's suites won against Jev, counted from Hanzo's research runs (the rows /benchmarks reads, api.hanzo.ai/v1/research/runs),
   the way hanzo.ai prints it: one line, "11 · Suites won · Kai vs Jev". */
const WON = BOARD.filter((b) => b.k > b.j).length;
const SPRING = { duration: 0.3, ease: [0.16, 1, 0.3, 1] }; // the deck has no springs: ease-emphasis, 300 ms

/* A link with its arrow as text, the way Hanzo writes them. */
const Lk = ({ to, children, className = '', ...r }) => {
  // the arrow is in the label's own text (COPY-RULE, 8 Nov: "Explore Enso →" reads as one line, as Hanzo prints it)
  const inner = <span>{typeof children === 'string' ? `${children} →` : children}</span>;
  return to.startsWith('#')
    ? <a href={to} className={'xmo-lk ' + className} {...r}>{inner}</a>
    : <A to={to} className={'xmo-lk ' + className} {...r}>{inner}</A>;
};

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

/* A model's film in its box: the poster at once, the clip only while asked and on screen (two at most on the page). */
const Film = ({ slug, play = true, className = '' }) => <span className={'xmo-film ' + className} aria-hidden="true"><ModelFilm slug={slug} play={play} /></span>;

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
  <T key={t} className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: delay + i * 0.06 }}>{t}</motion.span></T>
));

/* ---------- 1. the hero: Hanzo's model grid, exactly as live hanzo.ai draws it (docs/build-notes/refs/hanzo-model-cards/SPEC.md) ----
   Enso tall in column 1 over both rows, Kai Zen Iro Koma over Oto Koe Uta Mori; #000 cards, 20px radii, the measured
   tilt. Enso's film plays while it is on screen; the card under the pointer or focus plays too (two films at most).
   A click lifts the card into its page. */
const GRID = ['enso', 'kai', 'zen', 'iro', 'koma', 'oto', 'koe', 'uta', 'mori'];
const clamp = (v) => Math.min(1, Math.max(0, v));

function GridCard({ m, i, play, lit, open, setLit }) {
  const tilt = useSpecTilt();
  const big = i === 0;
  const price = rateLine(ALL[m.slug]);
  return (
    <li className={'xmo-cell' + (big ? ' big' : '') + (lit ? ' lit' : '')}>
      <a
        ref={tilt.ref}
        href={'/' + m.slug}
        className={'xmo-card' + (big ? ' big' : '')}
        data-card={m.slug}
        data-cursor=""
        aria-label={`${m.name}: ${m.desc}${price ? ` ${price} per million tokens.` : ''}`}
        onClick={(e) => open(e, e.currentTarget, m.slug)}
        onPointerEnter={(e) => { if (e.pointerType === 'mouse' && !big) setLit(i); }}
        onPointerMove={tilt.onPointerMove}
        onPointerLeave={() => { tilt.onPointerLeave(); setLit(0); }}
        onFocus={() => { if (!big) setLit(i); }}
        onBlur={() => setLit(0)}
      >
        <Film slug={m.slug} play={play} />
        <span className="xmo-card-top" aria-hidden="true">
          {big && m.kicker && <span className="xmo-pill flag">{m.kicker}</span>}
          <span className="xmo-card-t">{m.name}{' '}<span className="xmo-arr">→</span></span>
          <span className="xmo-card-d">{m.desc}</span>
        </span>
        <span className="xmo-card-tags" aria-hidden="true">{m.tags.map((t) => <span key={t} className="xmo-pill">{t}</span>)}{price && <span className="xmo-pill price">{price}</span>}</span>
      </a>
    </li>
  );
}

function Stage() {
  const open = useOpen();
  // no timer (MASTER 4.3): Enso's film is the first-second mover. The light is the reader's: the card under the pointer
  // or focus plays; with no pointer on the grid, scrolling walks the light through the cards (Kai to Mori) as the grid
  // passes. Two films at most.
  const [lit, setLit] = useState(0);
  const [walk, setWalk] = useState(0);
  const grid = useRef(null);
  const { scrollYProgress: gp } = useScroll({ target: grid, offset: ['start 85%', 'end 15%'] });
  useMotionValueEvent(gp, 'change', (v) => setWalk(v <= 0.02 || v >= 0.98 ? 0 : 1 + Math.min(7, Math.floor(v * 8))));
  const on = lit || walk;
  const go = 'https://platform.hanzo.ai/api-keys';
  return (
    <section className="xmo-stage" aria-labelledby="xmo-h1">
      <div className="x-wrap">
        <div className="xmo-intro">
          <h1 id="xmo-h1" className="xmo-display"><Lines lines={['Frontier AI families']} delay={0.05} /></h1>
          <div className="xmo-intro-r">
            <motion.p className="xmo-lede" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}>
              Proprietary and open weight models for text, decisions, video, image, and more — one account, one API key.
            </motion.p>
            <motion.div className="xmo-acts" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
              <Cta to={go} id="models.hero" thumb>Get API key</Cta>
              <Lk to="#families" className="quiet">Every model</Lk>
            </motion.div>
          </div>
        </div>
        <ul className="xmo-grid" data-swipe-own data-cursor="" ref={grid}>
          {GRID.map((slug, i) => (
            <GridCard key={slug} m={bySlug[slug]} i={i} play={i === 0 || on === i} lit={i > 0 && on === i} open={open} setLit={setLit} />
          ))}
        </ul>
        <div className="xmo-grid-cap"><span className="x-mono">Models</span><FilmPause /></div>
      </div>
    </section>
  );
}

/* ---------- 2. three families: the dark room ---------- */
const FAM = [
  { slug: 'enso', verb: 'routes', name: 'Enso', d: 'Picks the model for every call, in every modality.', to: '/enso' },
  { slug: 'kai', verb: 'decides', name: 'Kai', d: 'Answers a choice, a score or a yes/no, with the probability of each.', to: '/kai', stat: WON },
  { slug: 'zen', verb: 'reasons', name: 'Zen', d: 'Open weights for the code, the copy, the images and the voice.', to: '/zen', foot: 'Zen 6 and Zen 6 Flash now · Zen 7 in research preview' },
];

function Families() {
  const ref = useRef(null);
  const open = useOpen();
  const wide = useWide();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ['start end', 'start 60px'] });
  // the deck's black room: it arrives as a rounded card inside the gutters and opens to full width as it is reached
  const clipPath = useTransform(enter, (v) => { const k = 1 - clamp(v); return `inset(0px ${(k * 32).toFixed(1)}px round ${(k * 24).toFixed(1)}px)`; });
  const [on, setOn] = useState(0);
  useMotionValueEvent(p, 'change', (v) => setOn(Math.min(2, Math.floor(clamp(v) * 3.0001))));
  return (
    <section className="xmo-fam" ref={ref} data-room="dark" aria-labelledby="xmo-fam-h">
      <div className="xmo-fam-pin">
        <motion.div className="xmo-fam-bg" style={{ clipPath }} aria-hidden="true" />
        <div className="x-wrap xmo-fam-g">
          <header className="xmo-fam-head">
            <h2 id="xmo-fam-h" className="xmo-fam-h">
              {FAM.map((f, i) => <span key={f.slug} className={on === i ? 'on' : ''}>{`${f.name} ${f.verb}. `}</span>)}
            </h2>
            <p className="xmo-tag">Three families</p>
          </header>
          <ol className="xmo-fam-list">
            {FAM.map((f, i) => (
              <li key={f.slug} className={'xmo-fam-c' + (on === i ? ' on' : '') + (on > i ? ' past' : '')} data-card={f.slug + '-family'} data-cursor="" aria-current={on === i ? 'step' : undefined}>
                <div className="xmo-fam-film">
                  <Film slug={f.slug} play={!wide || on === i} />
                  <span className="xmo-fam-n x-mono" aria-hidden="true">{`0${i + 1} / 03`}</span>
                </div>
                <div className="xmo-fam-t">
                  <p className="xmo-verb">{f.verb}</p>
                  <h3>{f.name}</h3>
                  <p className="xmo-fam-d">{f.d}</p>
                  {f.stat && <p className="xmo-fam-stat">{`${f.stat} · Suites won · Kai vs Jev`}</p>}
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
  const [hot, setHot] = useState(null);
  return (
    <section className="xmo-sec xmo-vs" aria-labelledby="xmo-vs-h">
      <div className="x-wrap xmo-vs-g">
        <header>
          <h2 id="xmo-vs-h" className="xmo-headline">Proprietary orchestration, on open foundations</h2>
          <p className="xmo-tag">Enso vs Zen</p>
        </header>
        <div className="xmo-vs-t" role="table" aria-label="Enso and Zen compared">
          <div className="xmo-vs-r head" role="row">
            {VS.map((c) => (
              <div key={c.k} role="columnheader" className={'xmo-vs-c ' + c.k} onPointerEnter={() => setHot(c.k)} onPointerLeave={() => setHot(null)}>
                {/* each family's own film: still until the pointer (or a tap) asks it to play */}
                <A to={c.to} className="xmo-vs-film" data-cursor="" tabIndex={-1} aria-hidden="true" onFocus={() => setHot(c.k)}><Film slug={c.k} play={hot === c.k} /></A>
                <h3>{c.name}</h3>
                <p>{c.tag}</p>
              </div>
            ))}
          </div>
          {[0, 1, 2].map((r) => (
            <div className="xmo-vs-r" role="row" key={r}>
              {VS.map((c) => <div key={c.k} role="cell" className={'xmo-vs-c ' + c.k}><i aria-hidden="true">✓</i><span>{c.items[r]}</span></div>)}
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
  const big = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  // scale with rhythm: the figure rests at 64px and grows only while it is the moment (centred on screen), then settles
  const { scrollYProgress: f } = useScroll({ target: big, offset: ['start end', 'end start'] });
  const grow = useTransform(f, [0.2, 0.5, 0.8], [1, 1.75, 1]);
  return (
    <section className={'xmo-sec xmo-fig' + (seen ? ' on' : '')} ref={ref} aria-labelledby="xmo-fig-h">
      <div className="x-wrap xmo-fig-g">
        <header className="xmo-fig-head">
          <h2 id="xmo-fig-h" className="xmo-headline">Ahead of Jev on 11 suites</h2>
          <p className="xmo-tag">Decision Benchmarks</p>
          <ul className="xmo-suites">{SUITES.map((s) => <li key={s}>{s}</li>)}</ul>
          <Lk to="/kai#benchmarks">Kai: decisions and their benchmarks</Lk>
        </header>
        {/* the figure has its own box (room for its ×1.75 peak above it); the label sits on the line below, never beside */}
        <div className="xmo-fig-big" ref={big}>
          <div className="xmo-num-box"><motion.p className="xmo-num x-mono" style={{ scale: grow }}><MaskFig>{WON}</MaskFig></motion.p></div>
          <p className="xmo-num-k">Suites won · Kai vs Jev</p>
        </div>
        {DUELS.map((d, i) => (
          <figure key={d.say} className="xmo-duel">
            <p className="xmo-duel-n x-mono"><MaskFig delay={0.12 + i * 0.1}>{`${d.kai.toFixed(1)}%`}</MaskFig></p>
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

/* ---------- prices (used by the catalogue's cards and the price list) ---------- */
const dollars = (v) => (v == null ? '—' : '$' + (v > 0 && v < 1 ? v.toFixed(3) : v.toFixed(2)));
/* GA item 15: the models whose price Hanzo itself prints, checked against the snapshots (7 Nov):
   content/live/models/hanzo/<id>.json ("$0.330 in · $1.65 out, per million tokens"), the maker pages under
   content/live/models/<lab>/, content/live/models.json's price list and /pricing's API tab. Zen6, Zen6 Flash,
   Claude Fable 5, GPT-3.5 Turbo 0613, Grok 4.20, the rest of the Zen6 family, Zen Embedding 3, the creative models and
   Zen 7 print no price of their own, so the cards and the price list show none ("—"). Never a guessed price. */
const PRICED = new Set(['enso', 'enso-flash', 'enso-pro', 'enso-ultra', 'zen5', 'zen5-pro', 'zen5-coder', 'zen5-flash', 'zen5-mini',
  'zen-vl', 'zen-embedding', 'zen-guard', 'kai', 'google/gemini-2.5-pro', 'deepseek/deepseek-chat', 'meta/muse-glimmer-30b', 'cohere/command-a']);
const cost = (r, i) => (!PRICED.has(r[0]) || r[2] == null ? '—' : r[2] === 0 && r[3] === 0 ? 'Free' : dollars(r[i]));
const side = (v) => (v === 0 ? 'Free' : dollars(v));
// a model's own rate as one line, the way Hanzo's model pages print it ("$0.021 in · Free out"); null without a source
const rateLine = (r) => (!r || !PRICED.has(r[0]) || r[2] == null ? null : r[2] === 0 && r[3] === 0 ? 'Free' : `${side(r[2])} in · ${side(r[3])} out`);
/* Each catalogue model's "Use it now": /chat, where Hanzo's own model pages send "Try in Chat". A sibling of the
   card (never inside its link), set on the card's foot by CSS. */
const CHAT = '/chat';
const Use = ({ id, name }) => <Cta to={CHAT} kind="quiet" size="sm" id={'models.use.' + id} className="xmo-use" aria-label={`Use ${name} now in Hanzo Chat`}>Use it now</Cta>;
const ctxOf = (n) => (n == null ? '—' : n >= 950000 ? Math.round(n / 1e6) + 'M' : Math.round(n / 1000) + 'K');

const ALL = Object.fromEntries([...ROWS, ...OTHERS].map((r) => [r[0], r]));

/* ---------- 5. the catalogue ---------- */
const ENSO = [
  ['enso', 'Enso', '900K', "Hanzo's proprietary frontier model — Opus-class reasoning by default with 1M-context overflow.", ['text']],
  ['enso-auto', 'Enso', '900K', "Routes each request to one tier by the reasoning depth it asks for: enso-flash at off, none, minimal, low, default; enso-pro at medium, high; enso-ultra at xhigh, max. It bills at the price of the tier that answers; the price shown is a request's that states no depth. When nothing pays for that tier it answers on enso-free, at no charge, and says so.", ['text']],
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

/* A catalogue card: Hanzo's model card (SpecCard). Its name flies into the model page's h1 (morph); the id and Hanzo's
   rate are its mono line, the context window and modalities its pills. */
/* ids and endpoints break only after a "/" (never mid-word) */
const slashes = (t) => <><span aria-hidden="true">{String(t).split('/').flatMap((x, i) => (i ? [<wbr key={i} />, '/' + x] : [x]))}</span><span className="x-sr">{t}</span></>;
function MCard({ to, name, id, ctx, d, tags, rate }) {
  const r = rateLine(rate);
  return <SpecCard hush to={to} title={name} desc={d} meta={<><span>{slashes(id)}</span>{r && <><br /><b>{r}</b></>}</>} tags={[...(ctx ? [ctx] : []), ...tags]} />;
}

/* Phones: each catalogue row carries a small thumb, the family's own poster (Hanzo's media), or for another lab's model a
   still frame of its Sigil. Hidden on wide screens, where the card itself is the object. */
function Thumb({ fam, seed }) {
  return (
    <span className="xmo-thumb" aria-hidden="true" style={fam ? { backgroundImage: `url(${media(fam, 'webp')})` } : undefined}>
      {!fam && <Sigil seed={'/models/' + seed} className="xmo-thumb-s" still />}
    </span>
  );
}

/* A creative model's card: its film waits as a still and plays while the pointer (or focus) is on it; it opens into
   the model's page with the WebGL opener. */
function Tile({ m }) {
  const open = useOpen();
  const [on, setOn] = useState(false);
  const [slug, name, id, d, kind, ep] = m;
  return (
    <SpecCard to={'/' + slug} slug={slug} play={on} onHot={setOn} card={slug} onOpen={(e, el) => open(e, el, slug)}
      title={name} desc={d} meta={<><span>{id}</span><br /><span>{slashes(ep)}</span></>} tags={['Research preview', kind]} />
  );
}

/* A family's head pins beside its cards while they pass; flagships carry their film and open from it. */
function Head({ slug, title, children, link, art }) {
  return (
    <header className={'xmo-gh' + (slug ? ' film' : '')}>
      {slug && <span className="xmo-gh-film" data-card={slug + '-head'} data-cursor=""><Film slug={slug} /></span>}
      {/* other labs have no Hanzo film: their head carries a drifting contour field instead */}
      {art && <span className="xmo-gh-film art" aria-hidden="true">{art}</span>}
      <h2>{title}</h2>
      {children}
      {link}
    </header>
  );
}

/* Beyond: every model page and every maker page, one press away. Collapsed by default under Hanzo's own "Every model",
   a native disclosure, so find-in-page opens it and the links are in the HTML for crawlers and agents. */
function Every({ makers }) {
  if (!makers || !makers.length) return null;
  return (
    <details className="xmo-every" id="every">
      <summary data-sound="tick">
        <span className="xmo-every-t">Every model</span>
        <i aria-hidden="true" />
      </summary>
      <div className="xmo-every-g">
        {makers.map((m) => (
          <section key={m.slug} className="xmo-every-m" aria-label={m.name}>
            <A to={m.href} className="xmo-every-h">{m.name}</A>
            {m.models.length > 0 && <ul>{m.models.map((x) => <li key={x.href}><A to={x.href}>{x.name}</A></li>)}</ul>}
          </section>
        ))}
      </div>
    </details>
  );
}

function Catalogue({ makers }) {
  const [fam, setFam] = useState('all');
  const sec = useRef(null);
  // a chip brings the catalogue's top back under the header, so the re-flowed family is what you see
  const choose = (k) => {
    setFam(k);
    const top = sec.current.getBoundingClientRect().top + scrollY - 60;
    if (scrollY > top + 4) (window.__lenis ? window.__lenis.scrollTo(top, { duration: 0.5 }) : scrollTo({ top, behavior: 'smooth' }));
  };
  const open = useOpen();
  const paused = usePaused();
  const show = (f) => fam === 'all' || fam === f;
  const card = (id, name, ctx, d, tags, to, f) => <li key={id}><Thumb fam={f} seed={id} /><MCard to={to} name={name} id={id} ctx={ctx} d={d} tags={tags} rate={ALL[id]} /><Use id={id} name={name} /></li>;
  const groups = [
    ['enso', <Head slug="enso" title="Enso models" link={<Lk to="/enso" onClick={(e) => open(e, e.currentTarget.closest('.xmo-gh').querySelector('.xmo-gh-film'), 'enso')}>Enso: the router, its presets and its runs</Lk>} />,
      <ul className="xmo-cards">{ENSO.map(([id, name, ctx, d, tags]) => card(id, name, ctx, d, tags, '/models/hanzo/' + id, 'enso'))}</ul>],
    ['zen', (
      <Head slug="zen" title="Zen models" link={<Lk to="https://docs.hanzo.ai/docs/models/zen">Run Zen: the docs</Lk>}>
        <p><span>Open weights, made with </span><A to="https://zoo.ngo">Zoo Labs Foundation</A><span>. Download every Zen model at </span><A to="https://huggingface.co/zenlm">huggingface.co/zenlm</A><span>, or call it here.</span></p>
      </Head>
    ), (
      <ul className="xmo-cards">
        {ZEN.map(([id, name, ctx, d, tags]) => card(id, name, ctx, d, tags, '/models/hanzo/' + id, 'zen'))}
        <li><Thumb fam="zen" /><SpecCard hush to="/zen/7" title="Zen 7" meta={<><span>zen7</span><br /><b><span>Request access</span></b></>} desc="The next open-weight generation after Zen 6, in research preview." tags={['Research preview']} /></li>
      </ul>
    )],
    ['kai', <Head slug="kai" title="Kai decision models" link={<Lk to="/kai" onClick={(e) => open(e, e.currentTarget.closest('.xmo-gh').querySelector('.xmo-gh-film'), 'kai')}>Kai: decisions and their benchmarks</Lk>} />,
      <ul className="xmo-cards">{KAI.map((k) => <li key={k.name}><Thumb fam="kai" /><MCard to={k.to} name={k.name} id={k.id} ctx={k.ctx} d={k.d} tags={k.tags} rate={ALL[k.id]} />{ALL[k.id] && <Use id={k.id} name={k.name} />}</li>)}</ul>],
    ['creative', <Head title="Creative models" link={<Lk to="/design">Make something in Design</Lk>}><p>Video, images, 3D, sound effects, voice and music, each its own model, in research preview.</p></Head>,
      <ul className="xmo-cards tiles">{CREATIVE.map((m) => <li key={m[0]}><Tile m={m} /><Use id={m[0]} name={m[1]} /></li>)}</ul>],
    ['labs', <Head title="Flagships from other labs" art={<Sigil seed="/models#labs" data={[LABS.length, 2e6, 164e3]} className="xmo-gh-sigil" still={paused} />} link={<Lk to="#priced">Every model, priced</Lk>} />,
      <ul className="xmo-cards">{LABS.map(([id, name, ctx, d]) => card(id, name, ctx, d, ['text'], '/models/' + id, null))}</ul>],
  ];
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
              transition={{ duration: 0.4, ease: EASE, layout: SPRING }}
            >
              {head}
              {body}
            </motion.div>
          ))}
        </AnimatePresence>
        <Every makers={makers} />
      </div>
    </section>
  );
}

/* ---------- 6. every model, priced ---------- */
const LENS = [['all', 'Everything'], ['ours', 'Ours'], ['free', 'Free'], ['under', 'Under $1 / M out'], ['million', '1M context']];
const keep = {
  all: () => true, ours: () => true,
  free: (r) => PRICED.has(r[0]) && r[2] === 0 && r[3] === 0,
  under: (r) => PRICED.has(r[0]) && r[3] != null && r[3] < 1,
  million: (r) => r[4] != null && r[4] >= 950000,
};
const FOLD = 10;

function Priced({ at }) {
  const [lens, setLens] = useState('ours');
  const [all, setAll] = useState(false);
  const mine = ROWS.map(at).filter(keep[lens]);
  const theirs = lens === 'ours' ? [] : OTHERS.map(at).filter(keep[lens]);
  const n = mine.length + theirs.length;
  const topOut = Math.log10(Math.max(...[...mine, ...theirs].map((r) => (PRICED.has(r[0]) && r[3]) || 0)) * 100 + 1) || 1;
  let k = 0;
  const row = (r, to) => {
    const fold = !all && k++ >= FOLD;
    return (
      <motion.tr key={r[0]} layout="position" hidden={fold} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
        <td><A to={to} className="xmo-row-n"><b><span>{r[1]}</span></b><code><span>{r[0]}</span></code></A></td>
        <td className="x-mono" data-label="In $/M">{cost(r, 2)}</td>
        <td className="x-mono" data-label="Out $/M"><span className="xmo-out">{cost(r, 3)}<i className="xmo-bar" aria-hidden="true"><b style={{ transform: `scaleX(${PRICED.has(r[0]) && r[3] ? Math.max(0.03, Math.log10(r[3] * 100 + 1) / topOut) : 0})` }} /></i></span></td>
        <td className="x-mono" data-label="Context">{ctxOf(r[4])}</td>
      </motion.tr>
    );
  };
  return (
    <section className="xmo-sec xmo-priced" id="priced" aria-labelledby="xmo-pr-h">
      <div className="x-wrap">
        <div className="xmo-pr-g">
          <header>
            <h2 id="xmo-pr-h" className="xmo-headline">Every model, and what it costs</h2>
            <p className="xmo-tag">Priced</p>
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
              <p className="xmo-n x-mono" aria-live="polite"><i className="xmo-n-dot" aria-hidden="true" />{`${n} models.`}</p>
            </div>
            <div className={'xmo-table' + (all ? ' all' : '')} id="xmo-prices">
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
              <button type="button" className="xmo-more" aria-expanded={all} aria-controls="xmo-prices" aria-label={all ? `Show ${FOLD}` : `Show all (${n})`} onClick={() => setAll((v) => !v)}>
                <i aria-hidden="true" className={all ? 'on' : ''} />
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
  const stop = usePaused();
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
            <Cta to="https://platform.hanzo.ai/api-keys" id="models.try">Get free API key</Cta>
            <Cta to="/chat" kind="link" id="models.try.chat">Open Hanzo Chat</Cta>
          </div>
        </header>
        <div className="xmo-req" ref={box}>
          <div className="xmo-req-bar">
            <span className="xmo-live"><i aria-hidden="true" /><span>Live from api.hanzo.ai</span></span>
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
                {k === i && !mine && !calm && !stop && seen && <i className="xmo-tab-bar" aria-hidden="true" onAnimationEnd={() => setK((v) => (v + 1) % REQ.length)} />}
              </button>
            ))}
          </div>
          {/* all three descriptions are in the page; the chosen one is shown */}
          <div className="xmo-req-d" aria-live={mine ? 'polite' : 'off'}>
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
              <Cta to="/chat" kind="quiet" size="sm" id="models.try.login">Log in</Cta>
              <Cta to="https://platform.hanzo.ai/api-keys" kind="quiet" size="sm" id="models.try.signup">Sign up for free</Cta>
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
    "model": "enso-auto",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`],
  ['Python', `from openai import OpenAI

client = OpenAI(
    api_key=os.environ["HANZO_API_KEY"],
    base_url="https://api.hanzo.ai/v1",
)

response = client.chat.completions.create(
    model="enso-auto",
    messages=[{"role": "user", "content": "Hello!"}],
)
print(response.choices[0].message.content)`],
  ['TypeScript', `import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.HANZO_API_KEY,
  baseURL: 'https://api.hanzo.ai/v1',
})

const response = await client.chat.completions.create({
  model: 'enso-auto',
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
			Model: "enso-auto",
			Messages: []openai.ChatCompletionMessage{
				{Role: openai.ChatMessageRoleUser, Content: "Hello!"},
			},
		},
	)
	fmt.Println(resp.Choices[0].Message.Content)
}`],
];

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
        <div className="xmo-code" data-caret="">
          <Tabs id="xmo-lang" tabs={CODE.map(([t]) => t)} value={k} onChange={setK} label="Language" />
          {CODE.map(([t, c], i) => (
            <TabPanel key={t} id="xmo-lang" i={i} value={k} className="xmo-pane">
              <CodeBlock code={c} label={t} />
            </TabPanel>
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
  const paused = usePaused();
  return (
    <section className="xmo-sec xmo-rel" aria-labelledby="xmo-rel-h">
      {/* the page's own contour field drifts behind the index and leans toward the pointer */}
      <Sigil seed="/models#related" data={[RELATED.length, COUNT.all]} className="xmo-rel-sigil" still={paused} />
      <div className="x-wrap">
        <h2 className="xmo-headline" id="xmo-rel-h">Related capabilities</h2>
        <ul>
          {RELATED.map(([t, d, to], i) => (
            <li key={t}>
              <A to={to} data-cursor=""><span className="x-mono xmo-rel-n">{`0${i + 1}`}</span><b>{t}</b><span className="xmo-rel-d">{d}</span><i aria-hidden="true">→</i></A>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- 10. the close: the page's own words and its one ask, in a black room with Enso's film ---------- */
function Close() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.3 });
  return (
    <section className="xmo-close" data-room="dark" aria-labelledby="xmo-close-h" ref={ref}>
      <div className="x-wrap xmo-close-g">
        <div className="xmo-close-t">
          <h2 id="xmo-close-h">Frontier AI families</h2>
          <p>Proprietary and open weight models for text, decisions, video, image, and more — one account, one API key.</p>
          <div className="xmo-acts"><Cta to="https://platform.hanzo.ai/api-keys" id="models.close">Get API key</Cta></div>
        </div>
        <A to="/enso" className="xmo-close-film" data-cursor="" tabIndex={-1} aria-hidden="true"><Film slug="enso" play={seen} /></A>
      </div>
    </section>
  );
}

export default function ModelsPage({ makers }) {
  const at = (r) => r; // the snapshot's own rates (GA item 15: no live or guessed price)
  return (
    <main className="xmo">
      <CopyStatus />
      <Stage />
      <Families />
      <Versus />
      <Figures />
      <Catalogue makers={makers} />
      <Priced at={at} />
      <Try />
      <First />
      <Related />
      <Close />
    </main>
  );
}
