'use client';
/* Search (v2, Cloud 4 chat). Archetype A, Launch: Stage hero → four chapters → a dark "how it works" room → frameworks →
   pricing with a fit-finder → close. Accent: search-link blue.
   V2: 8/10 one query answered four ways in pinned scroll chapters, a Spotlight-size live search as the Stage hero, the plans as rows with a fit-finder
   Signature: one query, four answers. "Kubernets" types itself into a search bar the size of the screen, and as you scroll
   the same index answers it four ways: the typo fixed, the neighbours by meaning, the two lists fused by rank (the rows
   re-flow into one), then a streamed answer with its sources.
   Beyond: "Which plan fits?" Set your projects and docs per project and the plan whose limits cover them lights up, read
   straight from Hanzo's own plan limits.
   Motion: scroll-pinned chapters (signature) + typing + layout re-flow + magnetic primary. Every word, price and link is
   Hanzo's; the query and its results are examples. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { EASE } from '../../ui';
import { A } from '../../kit';
import { Console, useLive, useSteps } from './Frame';
import StageHero from '../../v2/StageHero';
import PinScenes from '../../v2/x-hamilton/PinScenes';
import Finale from '../../v2/Finale';
import './Search.css';

const DOCS = 'https://docs.hanzo.ai/docs/cli/search';
const GH = 'https://github.com/hanzoai';
const MODES = [['Text', 'Typos and facets'], ['Vector', 'Your embeddings'], ['RRF', 'One merged rank'], ['RAG', 'Answers with sources']];
const Q = 'Kubernets';
const TEXT = ['Deploy to Kubernetes', 'Kubernetes ingress', 'Cluster quotas'];
const VEC = ['Running containers in production', 'Deploy to Kubernetes', 'Scaling a service'];
const RRF = ['Deploy to Kubernetes', 'Kubernetes ingress', 'Running containers in production', 'Cluster quotas'];
const FROM = { 'Deploy to Kubernetes': 'text · vector', 'Kubernetes ingress': 'text', 'Running containers in production': 'vector', 'Cluster quotas': 'text' };
const SRC = ['Deploy to Kubernetes', 'Kubernetes ingress'];

/* The Stage object: a search bar the size of the screen. The query types itself (into a text node), then the four
   modes take turns over the same results; press a mode to hold it. */
function Ask() {
  const [ref, live, calm] = useLive(0.25);
  const [at, choose] = useSteps(4, 3600, live);
  const box = useRef(null);
  const [typed, setTyped] = useState(true);
  useEffect(() => {
    if (calm || !live) { if (box.current) box.current.textContent = Q; setTyped(true); return; }
    if (at !== 0) return;
    let i = 0;
    setTyped(false);
    if (box.current) box.current.textContent = '';
    const t = setInterval(() => {
      i++;
      if (box.current) box.current.textContent = Q.slice(0, i);
      if (i >= Q.length) { clearInterval(t); setTyped(true); }
    }, 105);
    return () => clearInterval(t);
  }, [at, live, calm]);
  const rows = at === 0 ? TEXT : at === 1 ? VEC : RRF;
  return (
    <div className="l2-obj se2-ask" ref={ref}>
      <div className="se2-bar">
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        <span className="se2-q" ref={box} aria-hidden="true">{Q}</span><i className="se2-caret" aria-hidden="true" />
        <span className="se2-api l2-mono" aria-hidden="true">/v1/search</span>
      </div>
      <div className="se2-modes" role="tablist" aria-label="Search mode">
        {MODES.map(([m, d], i) => (
          <button key={m} type="button" role="tab" aria-selected={at === i} onClick={() => choose(i)}>
            {at === i && <motion.span layoutId="se2-mode" className="se2-mode-bg" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
            <b>{m}</b><span>{d}</span>
          </button>
        ))}
      </div>
      <div className="se2-out" aria-hidden="true">
        {at < 3 ? (
          <ol className="se2-rows">
            {rows.map((r, i) => (
              <motion.li key={r} layout="position" initial={{ opacity: 0, y: 10 }} animate={{ opacity: typed ? 1 : 0.12, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30, opacity: { duration: 0.3, delay: typed ? i * 0.05 : 0 } }}>
                <span className="se2-rk l2-mono">{i + 1}</span>
                <span className="se2-doc"><b>{r}</b><em>docs · {at === 2 ? FROM[r] : at === 0 ? 'text' : 'vector'}</em></span>
                {at === 0 && i === 0 && <span className="se2-fix l2-mono">typo fixed</span>}
                {at === 2 && <span className="se2-fused l2-mono">one merged rank</span>}
              </motion.li>
            ))}
          </ol>
        ) : (
          <div className="se2-rag">
            <p className="se2-rag-q">How do I deploy to Kubernetes?</p>
            <div className="se2-rag-a">{[94, 86, 91, 48].map((w, i) => <motion.i key={i} style={{ width: w + '%' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.45, delay: 0.15 + i * 0.32, ease: 'linear' }} />)}</div>
            <div className="se2-srcs">{SRC.map((s, i) => <motion.span key={s} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 + i * 0.12, duration: 0.3 }}>[{i + 1}] {s}</motion.span>)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

const WAYS = [
  ['Full text', "Typo tolerance, facets and filters. A user who types Kubernets still finds the page, and a user who wants only last quarter's docs can say so."],
  ['Vector', "Bring your own embedding model — ours or anyone's — and search by meaning. Useful exactly when the user does not know the word your document uses."],
  ['Hybrid', 'Reciprocal Rank Fusion merges the two lists by rank rather than by score, so a keyword hit and a semantic hit compete fairly without a threshold you have to tune.'],
  ['RAG chat', 'The retrieved passages go to a model and come back as an answer with links to what it read. Streamed, so the first sentence arrives before the last one is written.'],
];

// a fixed scatter of documents in embedding space; the query sits among its three nearest by meaning
const DOTS = Array.from({ length: 46 }, (_, i) => { const a = Math.sin(i * 12.9898) * 43758.5453, b = Math.sin(i * 78.233) * 12543.1; return [Math.round(60 + (a - Math.floor(a)) * 880) / 10, Math.round(80 + (b - Math.floor(b)) * 840) / 10]; });
const NEAR = [[60, 30, 'Running containers in production'], [70, 52, 'Deploy to Kubernetes'], [44, 58, 'Scaling a service']];

/* One chapter's picture, for the chapter reached. */
function Way({ at }) {
  const calm = useReducedMotion();
  const [fused, setFused] = useState(!!calm);
  useEffect(() => { if (at !== 2 || calm) return; setFused(false); const t = setTimeout(() => setFused(true), 900); return () => clearTimeout(t); }, [at, calm]);
  return (
    <div className="l2-obj se2-way">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={at} className="se2-way-in" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }} transition={{ duration: 0.55, ease: EASE }}>
          {at === 0 && (
            <div className="se2-w0">
              <p className="se2-w0-q">Kubern<mark>e</mark>tes</p>
              <div className="se2-w0-f l2-mono"><span>docs</span><span className="on">last quarter</span></div>
              <ol>{TEXT.map((r, i) => <li key={r}><span className="l2-mono">{i + 1}</span>{r}{i === 0 && <em className="l2-mono">typo fixed</em>}</li>)}</ol>
            </div>
          )}
          {at === 1 && (
            <svg className="se2-w1" viewBox="0 0 100 100" preserveAspectRatio="none">
              {DOTS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="0.9" />)}
              {NEAR.map(([x, y], i) => <line key={i} x1="58" y1="46" x2={x} y2={y} style={{ animationDelay: 0.2 + i * 0.12 + 's' }} />)}
              {NEAR.map(([x, y], i) => <circle key={'n' + i} className="near" cx={x} cy={y} r="1.6" />)}
              <circle className="q" cx="58" cy="46" r="2.4" />
            </svg>
          )}
          {at === 1 && <ul className="se2-w1-l">{NEAR.map(([x, y, t]) => <li key={t} className={x >= 60 ? 'r' : ''} style={{ left: x + '%', top: y + '%' }}>{t}</li>)}<li className="q" style={{ left: '58%', top: '46%' }}>{Q}</li></ul>}
          {at === 2 && (
            <div className={'se2-w2' + (fused ? ' fused' : '')}>
              {!fused && <ol className="a">{TEXT.map((r) => <motion.li key={r} layoutId={'f-' + r}>{r}</motion.li>)}</ol>}
              {!fused && <ol className="b">{VEC.filter((r) => !TEXT.includes(r)).map((r) => <motion.li key={r} layoutId={'f-' + r}>{r}</motion.li>)}</ol>}
              {fused && <ol className="m">{RRF.map((r, i) => <motion.li key={r} layoutId={'f-' + r} transition={{ type: 'spring', stiffness: 300, damping: 30, delay: i * 0.04 }}><span className="l2-mono">{i + 1}</span>{r}<em className="l2-mono">{FROM[r]}</em></motion.li>)}</ol>}
            </div>
          )}
          {at === 3 && (
            <div className="se2-w3">
              <p className="se2-rag-q">How do I deploy to Kubernetes?</p>
              <div className="se2-rag-a big">{[96, 90, 93, 88, 52].map((w, i) => <motion.i key={i} style={{ width: w + '%' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.4, delay: 0.2 + i * 0.28, ease: 'linear' }} />)}</div>
              <div className="se2-srcs">{SRC.map((s, i) => <motion.span key={s} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 + i * 0.12 }}>[{i + 1}] {s}</motion.span>)}</div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const STEPS = [
  ['Index your content', 'Push documents at build time or over the REST API. Text fields become searchable as they land; embeddings go to the vector store beside them. Adding a vector field later does not force a text reindex.'],
  ['Query it from anywhere', 'A React hook for search-as-you-type, the REST API for everything else, and an MCP tool so an agent can search the same index a user searches. One index, three callers.'],
  ['Let people ask instead', 'Turn on RAG chat and a question gets an answer built from the passages that were retrieved, each one linked. If the index has nothing, the answer says so rather than inventing one.'],
];

function How() {
  return (
    <section className="l2-sec l2-dark se2-how" data-room="dark">
      <div className="l2-wrap l2-grid">
        <div className="se2-how-l">
          <p className="l2-kick">/v1/search</p>
          <h2 className="l2-head">How it works</h2>
          <p className="l2-lede">Content in, ranked results out, and a model over the top if you want one.</p>
          <div className="se2-con">
            <Console name="Search" api="/v1/search" side={[['Search', '/search'], ['Chat', '/cloud/chat'], ['Bot', '/bot'], ['Crawl', '/crawl'], ['Studio', '/studio'], ['Console', '/console'], ['Referrals', '/cloud/referrals'], ['Marketplace', '/cloud/marketplace']]} />
            <p className="se2-note">Example project. Every name in it is one you would give your own.</p>
          </div>
        </div>
        <ol className="se2-steps">
          {STEPS.map(([t, d], i) => (
            <li key={t}>
              <span className="se2-step l2-mono">Step {String(i + 1).padStart(2, '0')}</span>
              <h3 className="l2-title">{t}</h3>
              <p className="l2-body">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const FW = ['Hanzo Docs', 'Fumadocs', 'Nextra', 'Docusaurus', 'REST API'];

function Frameworks() {
  return (
    <section className="l2-sec tight se2-fw">
      <div className="l2-wrap l2-grid">
        <div className="se2-fw-h">
          <h2 className="l2-head">Works with any docs framework</h2>
          <p className="l2-body">Native support for Hanzo Docs, Fumadocs, Nextra, and Docusaurus. REST API for everything else.</p>
        </div>
        <ul className="se2-fw-l">
          {FW.map((f, i) => <li key={f} className={i === 4 ? 'rest' : ''}><span>{f}</span><em className="l2-mono">{i === 4 ? 'everything else' : 'native'}</em></li>)}
        </ul>
      </div>
    </section>
  );
}

const PLANS = [
  ['Build', '$99', ['5 projects', '10k docs per project', '2,500 AI chat sessions', 'Unlimited searches', 'React hook + REST API'], 'Read the docs', DOCS, [5, 10000]],
  ['Scale', '$1,450', ['25 projects', '100k docs per project', '50,000 AI chat sessions', 'Unlimited searches', 'Priority support'], 'Read the docs', DOCS, [25, 100000]],
  ['Enterprise', 'Custom', ['Unlimited projects', 'Unlimited docs', 'Unlimited AI chat sessions', 'Dedicated support + SLA'], 'Contact Sales', '/contact-sales', [Infinity, Infinity]],
];
const PROJ = [1, 2, 3, 5, 8, 12, 25, 40, 80];
const DOCN = [1000, 5000, 10000, 25000, 50000, 100000, 250000, 1000000];
const k = (n) => (n >= 1000000 ? n / 1000000 + 'M' : n >= 1000 ? n / 1000 + 'k' : String(n));

/* Beyond: set projects and docs per project; the plan whose limits cover both lights up. */
function Pricing() {
  const [p, setP] = useState(3);
  const [d, setD] = useState(2);
  const proj = PROJ[p], docs = DOCN[d];
  const fit = PLANS.findIndex(([, , , , , [mp, md]]) => proj <= mp && docs <= md);
  return (
    <section className="l2-sec se2-price" id="pricing">
      <div className="l2-wrap l2-grid">
        <div className="se2-price-h">
          <h2 className="l2-head">Pricing</h2>
          <p className="l2-body">Pay for hosted search, vector, and AI. Self-host Meilisearch free forever.</p>
          <div className="se2-fit" role="group" aria-label="Which plan fits">
            <p className="l2-kick ac">Which plan fits</p>
            <label><span>Projects</span><b className="l2-mono">{proj}</b><input type="range" min="0" max={PROJ.length - 1} value={p} onChange={(e) => setP(+e.target.value)} aria-valuetext={proj + ' projects'} /></label>
            <label><span>Docs per project</span><b className="l2-mono">{k(docs)}</b><input type="range" min="0" max={DOCN.length - 1} value={d} onChange={(e) => setD(+e.target.value)} aria-valuetext={k(docs) + ' docs per project'} /></label>
            <p className="se2-fit-r" aria-live="polite"><span className="l2-mono">fits</span> <b>{PLANS[fit][0]}</b></p>
          </div>
        </div>
        <ol className="se2-plans">
          {PLANS.map(([n, pr, pts, cta, to], i) => (
            <li key={n} className={'se2-plan' + (i === fit ? ' fit' : '')}>
              <div className="se2-plan-n">
                <h3 className="l2-title">{n}</h3>
                <p className="se2-amt l2-fig">{pr}{pr.startsWith('$') && <span>mo</span>}</p>
              </div>
              <ul>{pts.map((x) => <li key={x}>{x}</li>)}</ul>
              <A to={to} className={'x-btn' + (i === fit ? ' solid' : '')}>{cta}</A>
            </li>
          ))}
        </ol>
        <p className="se2-meili">Meilisearch is open source. Self-host free forever. Pay only for our hosted API, vector search, and AI features.</p>
      </div>
    </section>
  );
}

export default function Search() {
  return (
    <main className="l2-page se2" style={{ '--ac': '#0066ff' }}>
      <StageHero look="rise" kick="Hybrid Search + RAG" title="Hanzo Search" sub="Keyword and meaning in the same query" acts={[['Read the docs', DOCS], ['GitHub', GH]]}>
        <Ask />
      </StageHero>
      <PinScenes head="Four ways to ask, one index" lede="The same documents answer all four. Choose per query, not per deployment." items={WAYS} visual={(at) => <Way at={at} />} />
      <How />
      <Frameworks />
      <Pricing />
      <Finale
        name="Search"
        head="Make your content searchable and conversational"
        lede="Index once, search everywhere."
        small="Full-text, vector, hybrid, and RAG -- all from one API."
        acts={[['Read the docs', DOCS], ['View on GitHub', GH]]}
        prompt="Read https://hanzo.ai/skill.md and use Hanzo Search in my project. Start with: hanzo search create"
        api="/v1/search"
        related={[['Chat', '/cloud/chat', 'Conversational AI'], ['Bot', '/bot', 'Multi-agent platform'], ['Crawl', '/crawl', 'Web crawler']]}
        tag="AI-powered search"
      />
    </main>
  );
}
