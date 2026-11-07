'use client';
/* Models. Its idea is the catalogue: the model families as one grid you filter with chips; the cards re-flow with a
   layout animation, every flagship opens into its own page with the WebGL transition, and "Enso routes. Kai decides.
   Zen reasons." plays on its own as a triptych. The request card at the top swaps the model string by itself.
   Every word, id, rate and link is Hanzo's (rates are Hanzo's live catalogue, refreshed from api.hanzo.ai when it answers). */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Rise, Count, Copy } from '../ui';
import { A, SecHead, Tick } from '../kit';
import { useOpener } from '../Opener';
import { media } from '../../lib/models';
import './ModelsPage.css';

/* A link with its arrow as text, the way Hanzo writes them. */
const Lk = ({ to, children, className = '', ...r }) => {
  const inner = <><span>{children}</span><i aria-hidden="true">→</i></>;
  return to.startsWith('#')
    ? <a href={to} className={'x-arrow ' + className} {...r}>{inner}</a>
    : <A to={to} className={'x-arrow ' + className} {...r}>{inner}</A>;
};
const Btn = ({ to, children, solid }) => <A to={to} className={'x-btn' + (solid ? ' solid' : '')}>{children}</A>;

/* Opens a flagship's own page with the lifted-picture transition; its close button flies back to this card. */
function useOpen() {
  const opener = useOpener();
  return (e, el, slug) => opener.open(e, { el, src: media(slug, 'webp'), href: '/' + slug, key: slug });
}

/* A model's film: the still is there at once, the film plays only while it is on screen. */
function Film({ slug, className = '' }) {
  const v = useRef(null);
  useEffect(() => {
    const el = v.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.play().catch(() => {}); else el.pause(); }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
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

/* ---------- 1. hero ---------- */
const REQ = [
  { tab: 'Enso', id: 'enso', d: "Hanzo's proprietary frontier model — Opus-class reasoning by default with 1M-context overflow.", ctx: '900K' },
  { tab: 'Zen 6', id: 'zen6', d: 'Open weights for the code, the copy, the images and the voice.', ctx: '1M' },
  { tab: 'Claude Fable 5', id: 'anthropic/claude-fable-5', d: 'Claude Fable 5 is a Mythos-class model from Anthropic, built for autonomous knowledge work and coding.', ctx: '1M' },
];
const FLAG = ['enso', 'kai', 'zen', 'iro', 'koma', 'oto', 'koe', 'uta', 'mori'];

function Hero() {
  const [k, setK] = useState(0);
  const [mine, setMine] = useState(false);
  const calm = useReducedMotion();
  const pick = (i) => { setK(i); setMine(true); };
  const line = (t, d) => (
    <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>
  );
  const r = REQ[k];
  return (
    <section className="xmo-hero" aria-labelledby="xmo-h1">
      <div className="x-wrap xmo-hero-grid">
        <div>
          <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Models</motion.p>
          <h1 id="xmo-h1" className="xmo-h1">{line('Frontier AI families', 0.05)}</h1>
          <motion.p className="xmo-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}>
            Proprietary and open weight models for text, decisions, video, image, and more — one account, one API key.
          </motion.p>
          <motion.div className="xmo-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}>
            <Btn to="https://platform.hanzo.ai/api-keys" solid>Get API key</Btn>
            <a className="x-btn" href="#families">Every model</a>
          </motion.div>
        </div>
        <motion.div className="xmo-req" initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}>
          <div className="xmo-req-bar">
            <span className="xmo-live"><i aria-hidden="true" />Live from api.hanzo.ai</span>
            <span className="x-mono">POST /v1/chat/completions</span>
            <span className="xmo-eg">example</span>
          </div>
          <pre className="xmo-json" aria-label="Request body"><code>
            <span>{'{ "model": '}</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={k} className="xmo-model" initial={{ y: 14, opacity: 0, filter: 'blur(6px)' }} animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }} exit={{ y: -14, opacity: 0, filter: 'blur(6px)' }} transition={{ duration: 0.3, ease: EASE }}>{`"${r.id}"`}</motion.span>
            </AnimatePresence>
            <span>{', "messages": [{ "role": "user", "content": "Who are you?" }] }'}</span>
            <i className="xmo-caret" aria-hidden="true" />
          </code></pre>
          <div className="xmo-tabs" role="tablist" aria-label="Model" onKeyDown={arrows(REQ.length, pick)}>
            {REQ.map((q, i) => (
              <button key={q.tab} type="button" role="tab" aria-selected={k === i} tabIndex={k === i ? 0 : -1} onClick={() => pick(i)}>
                {k === i && <motion.span layoutId="xmo-tab" className="xmo-tab-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span>{q.tab}</span>
                {k === i && !mine && !calm && <i className="xmo-tab-bar" aria-hidden="true" onAnimationEnd={() => setK((v) => (v + 1) % REQ.length)} />}
              </button>
            ))}
          </div>
          {/* all three descriptions are in the page; the chosen one is shown */}
          <div className="xmo-req-d" aria-live="polite">
            {REQ.map((q, i) => (
              <motion.div key={q.tab} initial={false} animate={i === k ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }} transition={{ duration: 0.4, ease: EASE }} aria-hidden={i !== k}>
                <p>{q.d}</p>
                <p className="xmo-ctx"><b>{q.ctx}</b><span>text</span></p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <div className="xmo-strip" aria-hidden="true">
        <div>
          {[...FLAG, ...FLAG].map((s, i) => <img key={i} src={media(s, 'webp')} alt="" loading="lazy" decoding="async" />)}
        </div>
      </div>
    </section>
  );
}

/* ---------- 2. three families ---------- */
const FAM = [
  { slug: 'enso', verb: 'routes', name: 'Enso', d: 'Picks the model for every call, in every modality.', to: '/enso' },
  { slug: 'kai', verb: 'decides', name: 'Kai', d: 'Answers a choice, a score or a yes/no, with the probability of each.', to: '/kai', stat: 11 },
  { slug: 'zen', verb: 'reasons', name: 'Zen', d: 'Open weights for the code, the copy, the images and the voice.', to: '/zen', foot: 'Zen 6 and Zen 6 Flash now · Zen 7 in research preview' },
];

/* One family is lit at a time and the light moves on by itself (the bar is the clock; it ends, the next one lights). */
function Triptych() {
  const [on, setOn] = useState(0);
  const [mine, setMine] = useState(false);
  const calm = useReducedMotion();
  const open = useOpen();
  const set = (i) => { setOn(i); setMine(true); };
  return (
    <section className="x-sec xmo-tri" data-room="dark" aria-labelledby="xmo-fam">
      <div className="x-wrap">
        <SecHead dark kicker="Three families" title="Enso routes. Kai decides. Zen reasons." id="xmo-fam" />
        <ul className="xmo-tri-row">
          {FAM.map((f, i) => (
            <li key={f.slug} className={'xmo-tri-p' + (on === i ? ' on' : '')} onPointerEnter={(e) => { if (e.pointerType === 'mouse') set(i); }} onFocus={() => set(i)} data-card={f.slug + '-family'}>
              <Film slug={f.slug} />
              <span className="xmo-tri-shade" aria-hidden="true" />
              <div className="xmo-tri-txt">
                <p className="xmo-verb">{f.verb}</p>
                <h3>{f.name}</h3>
                <p>{f.d}</p>
                {f.stat && <p className="xmo-tri-stat"><b><Count to={f.stat} /></b><span>Suites won · Kai vs Jev</span></p>}
                {f.foot && <p className="xmo-tri-foot">{f.foot}</p>}
                <Lk to={f.to} onClick={(e) => open(e, e.currentTarget.closest('.xmo-tri-p'), f.slug)}>{`Explore ${f.name}`}</Lk>
              </div>
              <i className="xmo-tri-bar" aria-hidden="true">
                {on === i && <b className={mine || calm ? 'full' : ''} onAnimationEnd={() => setOn((v) => (v + 1) % FAM.length)} />}
              </i>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- 3. Enso vs Zen ---------- */
function Versus() {
  const col = (cls, name, tag, items, foot) => (
    <Rise className={'xmo-vs-c ' + cls}>
      <h3>{name}</h3>
      <p className="xmo-vs-tag">{tag}</p>
      <ul>{items.map((t, i) => <li key={t}><Tick size={20} delay={0.15 + i * 0.12} />{t}</li>)}</ul>
      {foot}
    </Rise>
  );
  return (
    <section className="x-sec xmo-vs">
      <div className="x-wrap">
        <SecHead kicker="Enso vs Zen" title="Proprietary orchestration, on open foundations" />
        <div className="xmo-vs-grid">
          {col('enso', 'Enso', 'Proprietary · Hanzo Cloud only', ['Flash, Pro and Ultra presets', 'OpenAI- and Anthropic-compatible', 'Metered and audited per organization'], <Lk to="/enso">Explore Enso</Lk>)}
          <svg className="xmo-vs-flow" viewBox="0 0 80 240" aria-hidden="true" preserveAspectRatio="none">
            <path d="M70 120 H10" /><path d="M10 120 l12 -9 M10 120 l12 9" className="head" />
            <circle cx="40" cy="120" r="4" />
          </svg>
          {col('zen', 'Zen', 'Open weights · Zoo Labs Foundation', ['Free to download and self-host', 'Or call it on Hanzo Cloud', 'From a 501(c)(3) non-profit'], <Lk to="/zen">Explore Zen</Lk>)}
        </div>
      </div>
    </section>
  );
}

/* ---------- 4-8. the catalogue ---------- */
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

/* A family's header: its film behind its name, or plain type when it has no film of its own. */
function Head({ slug, title, children, link }) {
  return (
    <header className={'xmo-gh' + (slug ? ' film' : '')} data-card={slug ? slug + '-head' : undefined}>
      {slug && <><Film slug={slug} /><span className="xmo-gh-shade" aria-hidden="true" /></>}
      <div>
        <h2>{title}</h2>
        {children}
        {link}
      </div>
    </header>
  );
}

function MCard({ to, name, id, ctx, d, tags, badge }) {
  return (
    <A to={to} className="xmo-mc">
      <span className="xmo-mc-top"><b>{name}</b>{ctx && <i>{ctx}</i>}</span>
      <span className="xmo-mc-id x-mono">{id}</span>
      {badge && <span className="xmo-mc-badge">{badge}</span>}
      {d && <span className="xmo-mc-d">{d}</span>}
      <span className="xmo-mc-tags">{tags.map((t) => <span key={t}>{t}</span>)}</span>
    </A>
  );
}

function Tile({ m, i }) {
  const open = useOpen();
  const [slug, name, id, d, kind, ep] = m;
  return (
    <a href={'/' + slug} className="xmo-tile" data-card={slug} onClick={(e) => open(e, e.currentTarget, slug)}>
      <Film slug={slug} />
      <span className="xmo-tile-shade" aria-hidden="true" />
      <span className="xmo-tile-t">
        <span className="xmo-tile-top"><b>{name}</b><i>{id}</i></span>
        <em>Research preview</em>
        <span className="xmo-tile-d">{d}</span>
        <span className="xmo-tile-f"><span>{kind}</span><code>{ep}</code></span>
      </span>
    </a>
  );
}

function Catalogue() {
  const [fam, setFam] = useState('all');
  const open = useOpen();
  const show = (f) => fam === 'all' || fam === f;
  const item = (key, f, span, node) => show(f) && (
    <motion.li
      key={key}
      layout="position"
      className={'xmo-it s' + span}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
      transition={{ duration: 0.8, ease: EASE, layout: { type: 'spring', stiffness: 260, damping: 32 } }}
    >{node}</motion.li>
  );
  const flat = [
    item('h-enso', 'enso', 6, (
      <Head slug="enso" title="Enso models" link={<Lk to="/enso" onClick={(e) => open(e, e.currentTarget.closest('.xmo-gh'), 'enso')}>Enso: the router, its presets and its runs</Lk>} />
    )),
    ...ENSO.map(([id, name, ctx, d, tags]) => item('m-' + id, 'enso', 2, <MCard to={'/models/hanzo/' + id} name={name} id={id} ctx={ctx} d={d} tags={tags} />)),
    item('h-zen', 'zen', 6, (
      <Head slug="zen" title="Zen models" link={<Lk to="https://docs.hanzo.ai/docs/models/zen">Run Zen: the docs</Lk>}>
        <p>Open weights, made with <A to="https://zoo.ngo">Zoo Labs Foundation</A>. Download every Zen model at <A to="https://huggingface.co/zenlm">huggingface.co/zenlm</A>, or call it here.</p>
      </Head>
    )),
    ...ZEN.map(([id, name, ctx, d, tags]) => item('m-' + id, 'zen', 2, <MCard to={'/models/hanzo/' + id} name={name} id={id} ctx={ctx} d={d} tags={tags} />)),
    item('m-zen7', 'zen', 2, (
      <div className="xmo-mc soon">
        <span className="xmo-mc-top"><b>Zen 7</b></span>
        <span className="xmo-mc-id x-mono">zen7</span>
        <span className="xmo-mc-d">The next open-weight generation after Zen 6, in research preview.</span>
        <span className="xmo-mc-tags"><span>Research preview</span></span>
        <A to="/zen/7" className="x-btn sm">Request access</A>
      </div>
    )),
    item('h-kai', 'kai', 6, (
      <Head slug="kai" title="Kai decision models" link={<Lk to="/kai" onClick={(e) => open(e, e.currentTarget.closest('.xmo-gh'), 'kai')}>Kai: decisions and their benchmarks</Lk>} />
    )),
    ...KAI.map((k) => item('m-' + k.name, 'kai', 2, <MCard to={k.to} name={k.name} id={k.id} ctx={k.ctx} d={k.d} tags={k.tags} />)),
    item('h-cr', 'creative', 6, (
      <Head title="Creative models"><p>Video, images, 3D, sound effects, voice and music, each its own model, in research preview.</p></Head>
    )),
    ...CREATIVE.map((m, i) => item('t-' + m[0], 'creative', 2, <Tile m={m} i={i} />)),
    item('l-design', 'creative', 6, <div className="xmo-foot"><Lk to="/design">Make something in Design</Lk></div>),
    item('h-labs', 'labs', 6, <Head title="Flagships from other labs" />),
    ...LABS.map(([id, name, ctx, d]) => item('m-' + id, 'labs', 3, <MCard to={'/models/' + id} name={name} id={id} ctx={ctx} d={d} tags={['text']} />)),
    item('l-priced', 'labs', 6, <div className="xmo-foot"><Lk to="#priced">Every model, priced</Lk></div>),
  ];
  return (
    <section className="x-sec xmo-cat" id="families" aria-label="The model catalogue">
      <div className="x-wrap">
        <div className="xmo-chips" role="group" aria-label="Filter the catalogue by family">
          {CHIPS.map(([k, t]) => (
            <button key={k} type="button" aria-pressed={fam === k} onClick={() => setFam(k)}>
              {fam === k && <motion.span layoutId="xmo-chip" className="xmo-chip-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <span>{t}<sup>{COUNT[k]}</sup></span>
            </button>
          ))}
        </div>
        <ul className="xmo-grid">
          <AnimatePresence mode="popLayout">{flat}</AnimatePresence>
        </ul>
      </div>
    </section>
  );
}

/* ---------- 9. every model, priced ---------- */
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
const LENS = [['all', 'Everything'], ['ours', 'Ours'], ['free', 'Free'], ['under', 'Under $1 / M out'], ['million', '1M context']];
const keep = {
  all: () => true, ours: () => true,
  free: (r) => r[2] === 0 && r[3] === 0,
  under: (r) => r[3] != null && r[3] < 1,
  million: (r) => r[4] != null && r[4] >= 950000,
};

function Priced() {
  const [lens, setLens] = useState('ours');
  const [live, setLive] = useState({});
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.1 });
  useEffect(() => {
    if (!seen) return;
    const ctl = new AbortController();
    fetch('https://api.hanzo.ai/v1/models', { signal: ctl.signal }).then((r) => r.json()).then((j) => {
      const m = {};
      (j.data || []).forEach((x) => { const p = x.pricing; if (p && p.input_per_million != null) m[x.id] = [p.input_per_million, p.output_per_million, x.context_window ?? null]; });
      setLive(m);
    }).catch(() => {}); // the printed rates stay when the gateway is out of reach
    return () => ctl.abort();
  }, [seen]);
  const at = (r) => (live[r[0]] ? [r[0], r[1], live[r[0]][0], live[r[0]][1], live[r[0]][2] ?? r[4]] : r);
  const mine = ROWS.map(at).filter(keep[lens]);
  const theirs = lens === 'ours' ? [] : OTHERS.map(at).filter(keep[lens]);
  const n = mine.length + theirs.length;
  const row = (r, to) => (
    <motion.tr key={r[0]} layout="position" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
      <td><A to={to} className="xmo-row-n"><b>{r[1]}</b><code>{r[0]}</code></A></td>
      <td className="x-mono">{cost(r, 2)}</td>
      <td className="x-mono">{cost(r, 3)}<i className="xmo-bar" aria-hidden="true"><b style={{ transform: `scaleX(${r[3] ? Math.min(1, Math.log10(r[3] * 100 + 1) / 4.3) : 0})` }} /></i></td>
      <td className="x-mono">{ctxOf(r[4])}</td>
    </motion.tr>
  );
  return (
    <section className="x-sec xmo-priced" id="priced" ref={ref}>
      <div className="x-wrap">
        <SecHead kicker="Priced" title="Every model, and what it costs" lede="Dollars per million tokens, in and out, from the live catalog." />
        <div className="xmo-lens">
          <div className="xmo-chips flat" role="group" aria-label="Filter the price list">
            {LENS.map(([k, t]) => (
              <button key={k} type="button" aria-pressed={lens === k} onClick={() => setLens(k)}>
                {lens === k && <motion.span layoutId="xmo-lens" className="xmo-chip-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span>{t}</span>
              </button>
            ))}
          </div>
          <p className="xmo-n x-mono" aria-live="polite">{`${n} models.`}</p>
        </div>
        <div className="xmo-table">
          <table>
            <thead><tr><th scope="col">Model</th><th scope="col">In $/M</th><th scope="col">Out $/M</th><th scope="col">Context</th></tr></thead>
            <tbody>
              <tr className="xmo-grp"><th scope="colgroup" colSpan={4}><A to="/models/hanzo">Hanzo</A><span>{`${mine.length} models`}</span></th></tr>
              <AnimatePresence initial={false}>{mine.map((r) => row(r, '/models/hanzo/' + r[0].replace('hanzo/', '')))}</AnimatePresence>
              {theirs.length > 0 && <tr className="xmo-grp"><th scope="colgroup" colSpan={4}><span className="xmo-grp-n">Flagships from other labs</span><span>{`${theirs.length} models`}</span></th></tr>}
              <AnimatePresence initial={false}>{theirs.map((r) => row(r, '/models/' + r[0]))}</AnimatePresence>
            </tbody>
          </table>
        </div>
        <div className="x-row-links"><Lk to="https://docs.hanzo.ai/docs/models">How models are called and billed</Lk></div>
      </div>
    </section>
  );
}

/* ---------- 10. try any model ---------- */
function Try() {
  const [k, setK] = useState(0);
  return (
    <section className="x-sec xmo-try">
      <div className="x-wrap xmo-try-grid">
        <div>
          <SecHead title="Try any model" lede="Test any model directly on the gateway. Switch models by changing one string." />
          <Rise as="p" className="xmo-try-p" delay={0.1}>Sign in to chat with Enso, Zen, or any model on the endpoint. Pick a model, start a thread, billed to your account and kept private.</Rise>
          <Rise className="xmo-acts" delay={0.2}>
            <Btn to="https://platform.hanzo.ai/api-keys" solid>Get free API key</Btn>
            <Btn to="/chat">Open Hanzo Chat</Btn>
          </Rise>
        </div>
        <Rise className="xmo-play" delay={0.15}>
          <div className="xmo-tabs" role="tablist" aria-label="Pick a model" onKeyDown={arrows(REQ.length, setK)}>
            {REQ.map((q, i) => (
              <button key={q.tab} type="button" role="tab" aria-selected={k === i} tabIndex={k === i ? 0 : -1} onClick={() => setK(i)}>
                {k === i && <motion.span layoutId="xmo-try" className="xmo-tab-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span>{q.tab}</span>
              </button>
            ))}
          </div>
          <p className="xmo-play-s x-mono"><span>model</span><AnimatePresence mode="popLayout" initial={false}><motion.b key={k} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.28, ease: EASE }}>{REQ[k].id}</motion.b></AnimatePresence></p>
          <div className="xmo-play-c" aria-disabled="true"><span className="xmo-effort">High</span><span className="xmo-send" aria-hidden="true">↑</span></div>
          <div className="xmo-gate">
            <A to="/chat" className="x-btn sm">Log in</A>
            <A to="https://platform.hanzo.ai/api-keys" className="x-btn sm solid">Sign up for free</A>
          </div>
        </Rise>
      </div>
    </section>
  );
}

/* ---------- 11. your first request ---------- */
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
/* Strings and comments pick up a colour; everything else stays plain. */
const hl = (code) => code.split(/("[^"\n]*"|'[^'\n]*')/).map((s, i) => (i % 2 ? <span key={i} className="s">{s}</span> : s));

function First() {
  const [k, setK] = useState(0);
  return (
    <section className="x-sec xmo-first">
      <div className="x-wrap xmo-first-w">
        <SecHead center title="Your first request" lede="The chat-completions shape you already send, at api.hanzo.ai/v1, in the language you write." />
        <Rise className="xmo-code">
          <div className="xmo-tabs" role="tablist" aria-label="Language" onKeyDown={arrows(CODE.length, setK)}>
            {CODE.map(([t], i) => (
              <button key={t} type="button" role="tab" id={'xmo-tab-' + i} aria-controls={'xmo-sample-' + i} aria-selected={k === i} tabIndex={k === i ? 0 : -1} onClick={() => setK(i)}>
                {k === i && <motion.span layoutId="xmo-lang" className="xmo-tab-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span>{t}</span>
              </button>
            ))}
          </div>
          {CODE.map(([t, c], i) => (
            <div key={t} id={'xmo-sample-' + i} role="tabpanel" aria-labelledby={'xmo-tab-' + i} hidden={k !== i} className="xmo-pane">
              <div className="xmo-pane-top"><span className="x-mono">{t}</span><Copy text={c} /></div>
              <pre tabIndex={0}><code>{hl(c)}</code></pre>
            </div>
          ))}
        </Rise>
        <div className="x-row-links center">
          <Lk to="https://platform.hanzo.ai/api-keys">Get an API key</Lk>
          <Lk to="https://docs.hanzo.ai/docs/quickstart">The quickstart</Lk>
        </div>
      </div>
    </section>
  );
}

/* ---------- 12. related ---------- */
const RELATED = [
  ['Agents', 'Build & run agents', '/agents'],
  ['Inference', null, '/engine'],
  ['Embeddings', 'Turn anything into vectors', '/cloud/embeddings'],
];

function Related() {
  return (
    <section className="x-sec xmo-rel">
      <div className="x-wrap">
        <Rise as="p" className="x-kick">Related capabilities</Rise>
        <ul>
          {RELATED.map(([t, d, to], i) => (
            <Rise as="li" key={t} delay={i * 0.08} y={16}>
              <A to={to}><b>{t}</b>{d && <span>{d}</span>}<i aria-hidden="true">→</i></A>
            </Rise>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function ModelsPage() {
  return (
    <main className="xmo">
      <Hero />
      <Triptych />
      <Versus />
      <Catalogue />
      <Priced />
      <Try />
      <First />
      <Related />
    </main>
  );
}
