'use client';
/* Crawl. Signature: a crawler spreading through a site, and the page it reads coming back as Markdown. From the root
   URL the crawl spreads link by link, each page lighting as it is fetched; the page in hand is rendered on the right
   as Markdown, headings and links intact; a link that points at 169.254.169.254 is refused at the hop. Below: the
   three steps and the boundary as two rows, the pipeline, the two ways to call it, the plans and the agent session.
   Beyond: "Which plan covers it". Type how many pages a month you crawl and the plan whose allowance covers it lights,
   from Hanzo's own allowances (50,000 on Build, 500,000 on Scale, unlimited on Enterprise).
   Every word, price and link is Hanzo's; the site is an example. */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE, Rise } from '../../ui';
import { A } from '../../kit';
import { Hero, Paste, Related, Get, Console, Head, useLive } from './Frame';
import './Crawl.css';

// [x, y, parent, path, refused]
const PAGES = [[50, 12, -1, '/'], [22, 38, 0, '/docs'], [50, 40, 0, '/blog'], [78, 36, 0, '/pricing'], [10, 66, 1, '/docs/start'], [30, 70, 1, '/docs/api'], [46, 72, 2, '/blog/launch'], [62, 70, 2, '→ 169.254.169.254', true], [82, 66, 3, '/pricing/faq'], [20, 92, 5, '/docs/api/auth']];
const MD = {
  '/docs/api': ['# API', '## Authentication', '- [Keys](/docs/api/auth)', '- [Errors](/docs/api/errors)'],
  '/blog/launch': ['# Launch', '> canonical: /blog/launch', 'The first paragraph, without the chrome.'],
  '/pricing/faq': ['# Pricing FAQ', '## Plans', '1. Build', '2. Scale'],
};

function Spread() {
  const [ref, live, calm] = useLive(0.3);
  const [n, setN] = useState(calm ? PAGES.length : 1);
  useEffect(() => {
    if (calm || !live) return;
    const t = setTimeout(() => setN((v) => (v >= PAGES.length + 3 ? 1 : v + 1)), n >= PAGES.length ? 1400 : 700);
    return () => clearTimeout(t);
  }, [n, live, calm]);
  const cur = PAGES[Math.min(n, PAGES.length) - 1];
  const md = MD[cur[3]] || MD['/docs/api'];
  return (
    <div className="cr-stage" ref={ref} aria-hidden="true">
      <div className="cr-graph">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          {PAGES.map(([x, y, p, , bad], i) => p >= 0 && <line key={i} x1={PAGES[p][0]} y1={PAGES[p][1]} x2={x} y2={y} className={(i < n ? 'on' : '') + (bad ? ' bad' : '')} />)}
        </svg>
        {PAGES.map(([x, y, , path, bad], i) => (
          <span key={path} className={'cr-node' + (i < n ? ' on' : '') + (bad && i < n ? ' bad' : '') + (i === n - 1 ? ' cur' : '')} style={{ left: x + '%', top: y + '%' }}>
            <i />{path}{bad && i < n && <b>refused</b>}
          </span>
        ))}
      </div>
      <div className="cr-md">
        <p className="cr-md-k">Markdown <span>{cur[4] ? 'not fetched' : cur[3]}</span></p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.pre key={cur[3]} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
            {cur[4] ? 'loopback, link-local and multicast are refused' : md.join('\n')}
          </motion.pre>
        </AnimatePresence>
        <div className="cr-figs">{[['JS', 'Full rendering'], ['Parallel', 'High throughput'], ['LLM', 'Structured extraction'], ['MD', 'Clean Markdown']].map(([a, b]) => <span key={a}><b>{a}</b>{b}</span>)}</div>
      </div>
    </div>
  );
}

const STEPS3 = [
  ['The readable part, not the page', 'Deciding which subtree is the article is the hard problem, and it is the one this solves. You get the content and what the page says about itself, without the chrome around it.'],
  ['A browser only when needed', 'Most pages are a fetch and a parse. Headless Chromium is a separate service it escalates to for the ones that genuinely need rendering, so you do not pay browser cost for a documentation page.'],
  ['Markdown, and the metadata', 'Headings stay headings and links keep their targets, resolved against the page they came from. Title, description and canonical URL come back alongside — including the URL after redirects, which is the one worth citing.'],
];
const BOUND = [
  ['It cannot be pointed at your cluster', 'The caller supplies the URL, which makes any crawler a request-forgery primitive. Loopback, link-local and multicast are refused — including the cloud metadata endpoint on 169.254.169.254 that hands out credentials.'],
  ['Every redirect is checked too', 'Blocking the first address is not enough, because a public URL can redirect to a private one. The guard sits on the dialer, so a 302 toward metadata is refused at the hop that matters.'],
  ['A tool an agent can call', 'It answers on MCP as well as over HTTP, so a model can read a page mid-conversation without you building the plumbing for it.'],
];
const PIPE = [
  ['Fetch', 'One guarded HTTP request. The dialer refuses private and link-local addresses on every hop, so a URL that redirects somewhere it should not reach is stopped there rather than after the fact.'],
  ['Extract', 'The document is reduced to the subtree a reader would call the content, plus the title, description and canonical URL the page claims for itself. If the HTML alone is not enough, this is where a headless browser gets involved.'],
  ['Render', 'That subtree becomes Markdown with its structure intact — headings, lists, code and links, with relative URLs resolved against the page. It is the format a model reads best and a person can still diff.'],
];
const PLANS = [
  ['Build', '$49', ['50,000 pages/month', '5 concurrent crawlers', 'JavaScript rendering', 'Markdown + structured output', 'REST API access'], 'Read the docs', 'https://docs.hanzo.ai/docs/openapi/crawl/'],
  ['Scale', '$499', ['500,000 pages/month', '25 concurrent crawlers', 'Priority JS rendering', 'LLM-based extraction', 'Direct Search + Vector integration'], 'Read the docs', 'https://docs.hanzo.ai/docs/openapi/crawl/'],
  ['Enterprise', 'Custom', ['Unlimited pages', 'Unlimited concurrent crawlers', 'Dedicated rendering pool', 'Custom extraction schemas', 'Dedicated support + SLA'], 'Contact Sales', '/contact-sales'],
];

/* Beyond: the plan whose monthly allowance covers the pages you type. */
const CAP = [50000, 500000, Infinity];
const fits = (v) => (v > 0 ? CAP.findIndex((c) => v <= c) : -1);

function Plans() {
  const [raw, setRaw] = useState('50000');
  const at = fits(Number(raw.replace(/[^\d]/g, '')));
  return (
    <>
      <label className="cr-fit">
        <span>pages/month</span>
        <input type="text" inputMode="numeric" value={raw} onChange={(e) => setRaw(e.target.value)} aria-describedby="cr-fit-a" />
        <em id="cr-fit-a" aria-live="polite">{at < 0 ? 'Type a number of pages' : PLANS[at][0] + ' — ' + PLANS[at][2][0]}</em>
      </label>
      <div className="cr-plans">
        {PLANS.map(([n, p, pts, cta, to], i) => (
          <div key={n} className={'cr-plan' + (at === i ? ' fit' : '')}>
            <div className="cr-plan-top"><h3>{n}</h3><p>{p}{p.startsWith('$') && <span>mo</span>}</p></div>
            <ul>{pts.map((x) => <li key={x}>{x}</li>)}</ul>
            <A to={to} className={'x-btn' + (i === 1 ? ' solid' : '')}>{cta}</A>
          </div>
        ))}
      </div>
    </>
  );
}

export default function Crawl() {
  return (
    <main className="cr">
      <Hero look="stack" kick="AI-Ready Web Crawler" title="Hanzo Crawl" sub="Give it a URL, get back Markdown" acts={[['Read the docs', 'https://docs.hanzo.ai/docs/openapi/crawl/'], ['GitHub', 'https://github.com/hanzoai']]}>
        <Spread />
      </Hero>
      <section className="x-sec cr-three">
        <div className="x-wrap">
          <Head title="Three steps, and a boundary" lede="Fetch, extract, render. Then the part that matters when the URL comes from a stranger." />
          <div className="cr-row">{STEPS3.map(([t, d], i) => <div key={t} className="cr-cell"><span>{String(i + 1).padStart(2, '0')}</span><h3>{t}</h3><p>{d}</p></div>)}</div>
          <div className="cr-row bound">{BOUND.map(([t, d], i) => <div key={t} className="cr-cell"><span>{String(i + 4).padStart(2, '0')}</span><h3>{t}</h3><p>{d}</p></div>)}</div>
        </div>
      </section>
      <section className="x-sec cr-how" data-room="dark">
        <div className="x-wrap">
          <Head dark title="How it works" lede="Each step is its own file and can be tested without the other two." />
          <ol className="cr-pipe">{PIPE.map(([t, d], i) => <Rise as="li" key={t} delay={i * 0.1}><span className="cr-step">Step {String(i + 1).padStart(2, '0')}</span><h3>{t}</h3><p>{d}</p></Rise>)}</ol>
          <div className="cr-two">
            <div><h3>Two ways to call it</h3><p>Over HTTP at /v1/crawl when your code is doing the asking, or over MCP when a model is.</p></div>
            <ul>{['Static Sites', 'SPAs', 'Documentation', 'E-Commerce', 'Forums', 'REST API'].map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        </div>
      </section>
      <section className="x-sec cr-price">
        <div className="x-wrap">
          <Head title="Pricing" lede="You are paying for the hosted API and the browsers behind it, not for the code." />
          <Plans />
          <p className="cr-oss">The crawler is open source, and so is the headless-browser image it escalates to. Run both yourself for nothing. The plans buy you somebody else operating them.</p>
        </div>
      </section>
      <section className="x-sec cr-send">
        <div className="x-wrap cr-send-grid">
          <div>
            <h2>Send it a URL</h2>
            <p>One call, and the page comes back as Markdown.</p>
            <p className="cr-send-s">From your code over HTTP, or from a model over MCP.</p>
            <div className="cr-acts"><A to="https://docs.hanzo.ai/docs/openapi/crawl/" className="x-btn solid">Read the docs</A><A to="https://github.com/hanzoai" className="x-btn">View on GitHub</A></div>
            <Paste name="Crawl" prompt="Read https://hanzo.ai/skill.md and use Hanzo Crawl in my project. Start with: hanzo crawl create" className="cr-paste" />
          </div>
          <div>
            <div><Console light name="Crawl" api="/v1/crawl" session={['hanzo', 'deploy the gateway to staging', 'reading the project', 'gateway is on staging']} side={[['Crawl', '/crawl'], ['Chat', '/cloud/chat'], ['Bot', '/bot'], ['Search', '/search'], ['Studio', '/studio'], ['Console', '/console'], ['Referrals', '/cloud/referrals'], ['Marketplace', '/cloud/marketplace']]} /></div>
            <p className="cr-note">Example project. Every name in it is one you would give your own.</p>
          </div>
        </div>
        <div className="x-wrap"><Related className="cr-rel" items={[['Chat', '/cloud/chat', 'Conversational AI'], ['Bot', '/bot', 'Multi-agent platform'], ['Search', '/search', 'Retrieval & answers']]} /></div>
      </section>
      <Get name="Crawl" tag="Crawl, scrape, and embed" />
      <i hidden data-thumb="Read the docs" data-href="https://docs.hanzo.ai/docs/openapi/crawl/" />
    </main>
  );
}
