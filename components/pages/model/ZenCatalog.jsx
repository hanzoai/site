'use client';
/* The Zen API catalog.
   Signature: switch models with one line, literally. The Quick Start code on the first screen retypes its model line by
   itself (zen6, zen6-flash, zen5-coder: the names in Hanzo's own comment), so the promise is shown, not told.
   Beyond: the Zen5 table shows how much of each mixture-of-experts model works per token (35B with 3B active,
   230B with 10B active, 284B with 37B active, from Hanzo's rows) on a shared scale, and re-sorts by size or context. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { EASE, Count, Copy } from '../../ui';
import { A, More } from '../../kit';
import Sigil from '../../Sigil';
import './Model.css';
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
  { n: 'Zen5 (Default)', tier: 'pro', d: 'Canonical Zen5 default. a 35B frontier MoE (3B active) (35B total / 3B active per token, released Apr 2026, Apache-2.0). 256K context, agentic-trained, OpenAI + Anthropic API. The everyday Zen5 chat model.', p: '35B (3B active)', tot: 35, act: 3, ctx: '256K', ck: 256, arch: 'Zen frontier MoE' },
  { n: 'Zen5 Coder', tier: 'pro', d: 'Code-specialized Zen5 tier. 80B sparse MoE tuned for repo-scale code understanding, agentic refactoring, and tool-use coding loops.', p: '80B (MoE)', tot: 80, act: null, ctx: '256K', ck: 256, arch: 'Zen Coder MoE' },
  { n: 'Zen5 Flash', tier: 'starter', d: 'Smallest and cheapest text-only Zen5 chat tier. 4B-class dense, sub-100ms TTFT, 32K context. For high-volume routing and simple agent loops.', p: '4B', tot: 4, act: 4, ctx: '32K', ck: 32, arch: 'Zen dense' },
  { n: 'Zen5 Mini', tier: 'pro', d: 'Frontier agentic at the lowest cost in the family. Built on a 230B agentic MoE (10B active) (230B MoE / 10B active, released Feb 2026). 80.2% SWE-Bench Verified, 76.3% BrowseComp; trained on 200K+ real-world environments via large-scale RL.', p: '230B (10B active)', tot: 230, act: 10, ctx: '192K', ck: 192, arch: 'Zen MoE' },
  { n: 'Zen5 Pro', tier: 'ultra', d: 'Zen Flash IQ2_XXS-imatrix weights (81 GB GGUF on zenlm/zen-5-pro-gguf). 284B total / 37B active per token, 1M context, asymmetric routed-MoE quant. Fits a single 128 GB Apple Silicon / DGX Spark / H100 80 GB.', p: '284B (37B active)', tot: 284, act: 37, ctx: '1M', ck: 1024, arch: 'Zen Flash MoE' },
];
const TIERS = ['ultra max', 'ultra', 'pro max', 'pro', 'starter'];

function Quick() {
  const box = useRef(null), slot = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  const [m, setM] = useState(0);
  // retype the model name: erase, then type the next one, one character at a time (into a text node, not state)
  useEffect(() => {
    if (!seen || calm) return;
    let i = 0, t;
    const from = NAMES[m], to = NAMES[(m + 1) % NAMES.length], el = slot.current;
    const erase = () => { el.textContent = from.slice(0, from.length - ++i); if (i < from.length) t = setTimeout(erase, 45); else { i = 0; t = setTimeout(type, 160); } };
    const type = () => { el.textContent = to.slice(0, ++i); if (i < to.length) t = setTimeout(type, 70); else setM((m + 1) % NAMES.length); };
    t = setTimeout(erase, 2600);
    return () => { clearTimeout(t); el.textContent = from; };
  }, [seen, calm, m]);
  const [pre, post] = code('\u0000').split('\u0000');
  return (
    <div className="zc-quick mb-panel" ref={box}>
      <div className="mb-bar"><i /><i /><i /><b>python</b><em className="zc-copy"><Copy text={code(NAMES[m])} /></em></div>
      <h2 className="zc-q-h">Quick Start</h2>
      <p className="zc-q-p">Drop-in OpenAI-compatible API. Switch models with one line.</p>
      <pre className="zc-code"><code>{pre}<span className="zc-slot"><span ref={slot}>zen6</span><i aria-hidden="true" /></span>{post}</code></pre>
    </div>
  );
}

function Catalog() {
  const box = useRef(null);
  const seen = useInView(box, { once: true, amount: 0.2 });
  const [sort, setSort] = useState('hanzo');
  const rows = sort === 'hanzo' ? ROWS : [...ROWS].sort(sort === 'size' ? (a, b) => b.tot - a.tot : (a, b) => b.ck - a.ck);
  const MAXP = 284, ctxW = (k) => (Math.log2(k) - 4) / (Math.log2(1024) - 4);
  return (
    <section className="zc-cat mb-sec" id="zen5" ref={box} aria-labelledby="zc-cat-h">
      <div className="x-wrap">
        <p className="mb-kick">Zen5</p>
        <h2 id="zc-cat-h" className="mb-h2">Zen5 -- Agentic Frontier</h2>
        <p className="mb-lede">Agentic frontier models trained on 10B+ tokens of real-world tool use and multi-step reasoning.</p>
        <div className="zc-sort" role="group" aria-label="Order">
          {[['hanzo', 'Hanzo’s order'], ['size', 'By size'], ['ctx', 'By context']].map(([k, l]) => <button key={k} type="button" className="zc-sortb" aria-pressed={sort === k} onClick={() => setSort(k)}>{l}</button>)}
          <span className="zc-key"><i className="zc-k-tot" />total params <i className="zc-k-act" />active per token</span>
        </div>
        <div className="zc-table" role="table" aria-label="Zen5 models">
          <div className="zc-tr zc-th" role="row">
            {['Model', 'Params', 'Context', 'Arch', 'Availability'].map((h) => <span key={h} role="columnheader">{h}</span>)}
          </div>
          {rows.map((r, i) => (
            <motion.div key={r.n} layout className="zc-tr" role="row" transition={{ duration: 0.55, ease: EASE }}>
              <span role="cell" className="zc-name"><b>{r.n}</b><em data-t={r.tier}>{r.tier.toUpperCase()}</em><small>{r.d}</small></span>
              <span role="cell" className="zc-p">
                <span className="mb-tnum">{r.p}</span>
                <span className="zc-bar"><motion.i className="zc-tot" initial={{ scaleX: 0 }} animate={seen ? { scaleX: Math.max(0.015, r.tot / MAXP) } : {}} transition={{ duration: 1, ease: EASE, delay: 0.1 + i * 0.06 }} />{r.act && <motion.i className="zc-act" initial={{ scaleX: 0 }} animate={seen ? { scaleX: Math.max(0.012, r.act / MAXP) } : {}} transition={{ duration: 1, ease: EASE, delay: 0.5 + i * 0.06 }} />}</span>
              </span>
              <span role="cell" className="zc-c">
                <span className="mb-tnum">{r.ctx}</span>
                <span className="zc-bar"><motion.i className="zc-ctx" initial={{ scaleX: 0 }} animate={seen ? { scaleX: ctxW(r.ck) } : {}} transition={{ duration: 1, ease: EASE, delay: 0.2 + i * 0.06 }} /></span>
              </span>
              <span role="cell" className="zc-a">{r.arch}</span>
              <span role="cell" className="zc-av mb-tnum">$0 / $0</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ZenCatalog() {
  return (
    <main className="zc">
      <section className="zc-hero" aria-labelledby="zc-h">
        <div className="x-wrap zc-hero-in">
          <div className="zc-copy">
            <p className="zc-badge"><i />Zen 6 and Zen 6 Flash available now · Zen 7 in research preview</p>
            <h1 id="zc-h" className="mb-h zc-h" data-morph-target>Zen Models<span className="mb-l2">Complete API Catalog</span></h1>
            <p className="mb-lede">Built for agentic coding and multimodal work. <b className="mb-tnum">18</b> foundation models from <A to="https://zoo.industries">Zoo Labs Foundation</A> across language, code, vision, image, audio, and retrieval. Zen MoDE (Mixture of Diverse Experts) architecture. From $0.01/MTok.</p>
            <dl className="zc-stats">
              <div><dt>Models</dt><dd><Count to={18} /></dd></div>
              <div><dt>Max Context</dt><dd><Count to={2} suffix="M" /></dd></div>
              <div><dt>From</dt><dd>$0.01/MTok</dd></div>
              <div><dt>Architectures</dt><dd>MoE + Dense</dd></div>
              <div><dt>Modalities</dt><dd><Count to={7} /></dd></div>
            </dl>
            <p className="zc-tiers">{TIERS.map((t) => <span key={t} data-t={t.replace(' ', '-')}>{t}</span>)}</p>
            <div className="mb-acts">
              <a href="#zen5" className="x-btn solid">Explore Models</a>
              <A to="/pricing" className="x-btn">Full Pricing</A>
              <More to="https://platform.hanzo.ai/api-keys">Get API key</More>
            </div>
          </div>
          <Quick />
        </div>
      </section>
      <Catalog />
      <section className="zc-band" data-room="dark" aria-labelledby="zc-b">
        <Sigil seed="zen/models" data={[18, 2, 0.01, 7, 284, 37]} className="zc-sig" />
        <div className="x-wrap">
          <h2 id="zc-b" className="mb-h2">Ready to build with Zen?</h2>
          <p className="mb-lede">All 18 Zen models available via OpenAI-compatible API. Start building today.</p>
          <div className="mb-acts">
            <A to="/signup" className="x-btn solid" data-thumb="Get Started">Get Started</A>
            <A to="/dev" className="x-btn">Try Hanzo Dev</A>
            <More to="/pricing">View Pricing</More>
          </div>
        </div>
      </section>
    </main>
  );
}
