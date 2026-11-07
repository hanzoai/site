'use client';
/* Search. Signature: a query answered as it is typed. "Kubernets" types itself into the box (typo and all); the text
   list and the vector list fill in side by side, Reciprocal Rank Fusion merges them into one rank, and RAG streams an
   answer with links to what it read. The four modes are tabs over the same index. Below: the example console, the
   three steps as a numbered spine, the docs frameworks, and the plans. Every word, price and link is Hanzo's; the
   query and results are examples. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A } from '../../kit';
import { Hero, Paste, Related, Get, Console, Head, useLive, useSteps } from './Frame';
import './Search.css';

const MODES = [['Text', 'Typos and facets'], ['Vector', 'Your embeddings'], ['RRF', 'One merged rank'], ['RAG', 'Answers with sources']];
const Q = 'Kubernets';
const TEXT = ['Deploy to Kubernetes', 'Kubernetes ingress', 'Cluster quotas'];
const VEC = ['Running containers in production', 'Deploy to Kubernetes', 'Scaling a service'];
const RRF = ['Deploy to Kubernetes', 'Kubernetes ingress', 'Running containers in production', 'Cluster quotas'];

function Ask() {
  const [ref, live, calm] = useLive(0.3);
  const [at, choose] = useSteps(4, 3800, live);
  const box = useRef(null);
  const [typed, setTyped] = useState(calm);
  // the query types into a text node, not React state per character
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
    }, 110);
    return () => clearInterval(t);
  }, [at, live, calm]);
  const list = (items, k) => (
    <ol className="se-list">
      {items.map((r, i) => (
        <motion.li key={r} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: typed ? 1 : 0.15, y: 0 }} transition={{ duration: 0.4, ease: EASE, delay: typed ? i * 0.07 : 0 }}>
          <span>{i + 1}</span>{r}{k === 'text' && i === 0 && <em>typo fixed</em>}
        </motion.li>
      ))}
    </ol>
  );
  return (
    <div className="se-ask" ref={ref}>
      <div className="se-box"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg><span ref={box} aria-hidden="true">{Q}</span><i className="se-caret" /></div>
      <div className="se-modes" role="tablist" aria-label="Search mode">
        {MODES.map(([m, d], i) => (
          <button key={m} type="button" role="tab" aria-selected={at === i} onClick={() => choose(i)}>
            {at === i && <motion.span layoutId="se-mode" className="se-mode-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <b>{m}</b><span>{d}</span>
          </button>
        ))}
      </div>
      <div className="se-out" aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={at} className="se-pane" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.35, ease: EASE }}>
            {at === 0 && list(TEXT, 'text')}
            {at === 1 && list(VEC, 'vec')}
            {at === 2 && <div className="se-rrf"><div><p>text</p>{list(TEXT, 'm')}</div><div><p>vector</p>{list(VEC, 'm')}</div><div className="merged"><p>one merged rank</p>{list(RRF, 'm')}</div></div>}
            {at === 3 && (
              <div className="se-rag">
                <p className="se-rag-q">How do I deploy to Kubernetes?</p>
                <div className="se-rag-a">{[96, 88, 92, 54].map((w, i) => <motion.i key={i} style={{ width: w + '%' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.3 + i * 0.35, ease: 'linear' }} />)}</div>
                <div className="se-src">{['Deploy to Kubernetes', 'Kubernetes ingress'].map((s, i) => <motion.span key={s} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 + i * 0.15 }}>[{i + 1}] {s}</motion.span>)}</div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
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
const STEPS = [
  ['Index your content', 'Push documents at build time or over the REST API. Text fields become searchable as they land; embeddings go to the vector store beside them. Adding a vector field later does not force a text reindex.'],
  ['Query it from anywhere', 'A React hook for search-as-you-type, the REST API for everything else, and an MCP tool so an agent can search the same index a user searches. One index, three callers.'],
  ['Let people ask instead', 'Turn on RAG chat and a question gets an answer built from the passages that were retrieved, each one linked. If the index has nothing, the answer says so rather than inventing one.'],
];
const PLANS = [
  ['Build', '$99', ['5 projects', '10k docs per project', '2,500 AI chat sessions', 'Unlimited searches', 'React hook + REST API'], 'Read the docs', 'https://docs.hanzo.ai/docs/cli/search'],
  ['Scale', '$1,450', ['25 projects', '100k docs per project', '50,000 AI chat sessions', 'Unlimited searches', 'Priority support'], 'Read the docs', 'https://docs.hanzo.ai/docs/cli/search'],
  ['Enterprise', 'Custom', ['Unlimited projects', 'Unlimited docs', 'Unlimited AI chat sessions', 'Dedicated support + SLA'], 'Contact Sales', '/contact-sales'],
];

export default function Search() {
  return (
    <main className="se">
      <Hero
        look="split"
        kick="Hybrid Search + RAG"
        title="Hanzo Search"
        sub="Keyword and meaning in the same query"
        acts={[['Read the docs', 'https://docs.hanzo.ai/docs/cli/search'], ['GitHub', 'https://github.com/hanzoai']]}
      >
        <Ask />
      </Hero>
      <section className="x-sec se-ways">
        <div className="x-wrap">
          <Head title="Four ways to ask, one index" lede="The same documents answer all four. Choose per query, not per deployment." />
          <div className="se-four">{WAYS.map(([t, d], i) => <Rise key={t} className="se-way" delay={i * 0.06}><span>{String(i + 1).padStart(2, '0')}</span><h3>{t}</h3><p>{d}</p></Rise>)}</div>
        </div>
      </section>
      <section className="x-sec se-how" data-room="dark">
        <div className="x-wrap se-how-grid">
          <div className="se-how-l">
            <Head dark title="How it works" lede="Content in, ranked results out, and a model over the top if you want one." />
            <Rise><Console name="Search" api="/v1/search" side={[['Search', '/search'], ['Chat', '/cloud/chat'], ['Bot', '/bot'], ['Crawl', '/crawl'], ['Studio', '/studio'], ['Console', '/console'], ['Referrals', '/cloud/referrals'], ['Marketplace', '/cloud/marketplace']]} /></Rise>
            <p className="se-note">Example project. Every name in it is one you would give your own.</p>
          </div>
          <ol className="se-spine">{STEPS.map(([t, d], i) => <Rise as="li" key={t} y={20}><span className="se-step">Step {String(i + 1).padStart(2, '0')}</span><h3>{t}</h3><p>{d}</p></Rise>)}</ol>
        </div>
      </section>
      <section className="se-fw">
        <div className="x-wrap se-fw-in">
          <div><Rise as="h2">Works with any docs framework</Rise><Rise as="p" delay={0.06}>Native support for Hanzo Docs, Fumadocs, Nextra, and Docusaurus. REST API for everything else.</Rise></div>
          <ul>{['Hanzo Docs', 'Fumadocs', 'Nextra', 'Docusaurus', 'REST API'].map((f, i) => <Rise as="li" key={f} delay={i * 0.05}>{f}</Rise>)}</ul>
        </div>
      </section>
      <section className="x-sec se-price">
        <div className="x-wrap">
          <Head center title="Pricing" lede="Pay for hosted search, vector, and AI. Self-host Meilisearch free forever." className="se-price-h" />
          <div className="se-plans">
            {PLANS.map(([n, p, pts, cta, to], i) => (
              <Rise key={n} className={'se-plan' + (i === 1 ? ' mid' : '')} delay={i * 0.06}>
                <h3>{n}</h3>
                <p className="se-amt">{p}{p.startsWith('$') && <span>mo</span>}</p>
                <ul>{pts.map((x) => <li key={x}>{x}</li>)}</ul>
                <A to={to} className={'x-btn' + (i === 1 ? ' solid' : '')}>{cta}</A>
              </Rise>
            ))}
          </div>
          <p className="se-meili">Meilisearch is open source. Self-host free forever. Pay only for our hosted API, vector search, and AI features.</p>
        </div>
      </section>
      <section className="x-sec se-end">
        <div className="x-wrap se-end-grid">
          <div>
            <Rise as="h2">Make your content searchable and conversational</Rise>
            <Rise as="p" delay={0.06}>Index once, search everywhere.</Rise>
            <Rise as="p" delay={0.1} className="se-end-s">Full-text, vector, hybrid, and RAG -- all from one API.</Rise>
            <Rise className="se-end-acts" delay={0.14}><A to="https://docs.hanzo.ai/docs/cli/search" className="x-btn solid">Read the docs</A><A to="https://github.com/hanzoai" className="x-btn">View on GitHub</A></Rise>
          </div>
          <Paste name="Search" prompt="Read https://hanzo.ai/skill.md and use Hanzo Search in my project. Start with: hanzo search create" className="se-paste" />
        </div>
        <div className="x-wrap"><Related className="se-rel" items={[['Chat', '/cloud/chat', 'Conversational AI'], ['Bot', '/bot', 'Multi-agent platform'], ['Crawl', '/crawl', 'Web crawler']]} /></div>
      </section>
      <Get name="Search" tag="AI-powered search" />
    </main>
  );
}
