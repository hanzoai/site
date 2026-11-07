'use client';
/* Crawl.
   V2: 8/10 Apple-style launch: the reader starts huge and settles, then one pinned scene is scrubbed by scroll (a page stripped to its content, rendered as Markdown, then the crawl spreading link by link), a spec sheet, a plan finder, one dark close.
   Signature: the crawl, scrubbed. One pinned object tells "Three steps, and a boundary" as you scroll: the page in
   hand loses its chrome until only the readable subtree is outlined; most pages drop into the fetch-and-parse lane and
   one SPA escalates to Headless Chromium; the subtree is written out as Markdown with its title, description and
   canonical URL; then the camera pulls back and the crawl spreads through the site link by link, a link toward
   169.254.169.254 refused, a 302 toward metadata cut at the hop, and the pages leaving over HTTP and MCP. One scroll
   value drives every part through CSS (no per-frame React); phones play the same scene by tap, or by itself while seen.
   Supporting: the Stage hero (the reader starts huge and settles, crawling three example pages by itself), the plan
   ring that slides to the plan that covers you, and the closing dark room that opens out to full width.
   Beyond: "Which plan covers it" - drag or type the pages you crawl a month; the plan whose allowance covers it is
   ringed and a bar shows how much of that allowance you would use, from Hanzo's own allowances and prices.
   Accent: crawl teal, the colour of the outline drawn round the readable part. Every word, price and link is
   Hanzo's; example.com and its pages are an example. */
import { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { EASE } from '../../ui';
import { A } from '../../kit';
import { Console, Related, useLive, useSteps } from './Frame';
import KeynoteStage from '../../v2/KeynoteStage';
import KeynoteSpec, { Fig } from '../../v2/KeynoteSpec';
import KeynoteClose from '../../v2/KeynoteClose';
import KeynoteLines from '../../v2/KeynoteLines';
import { useWide } from '../../v2/KeynoteChapters';
import './Crawl.css';

const DOCS = 'https://docs.hanzo.ai/docs/openapi/crawl/';
const GH = 'https://github.com/hanzoai';
const pad = (n) => String(n).padStart(2, '0');

/* ---------- the hero: the reader, crawling three example pages by itself ---------- */
const SAMPLES = [
  { path: '/docs/api', md: [['h', '# API'], ['h', '## Authentication'], ['l', '- [Keys](/docs/api/auth)'], ['l', '- [Errors](/docs/api/errors)']], title: 'API' },
  { path: '/blog/launch', md: [['h', '# Launch'], ['q', '> canonical: /blog/launch'], ['p', 'The first paragraph, without the chrome.']], title: 'Launch' },
  { path: '/pricing/faq', md: [['h', '# Pricing FAQ'], ['h', '## Plans'], ['p', '1. Build'], ['p', '2. Scale']], title: 'Pricing FAQ' },
];

function Wire({ big }) {
  return (
    <div className={'cr-wf' + (big ? ' big' : '')}>
      <div className="cr-wf-nav cr-chrome"><b /><i /><i /><i /><i /></div>
      <div className="cr-wf-g">
        <div className="cr-wf-side cr-chrome">{[64, 80, 52, 72, 58, 70].map((w, i) => <i key={i} style={{ width: w + '%' }} />)}</div>
        <div className="cr-wf-art">
          <span className="cr-wf-ring" />
          <span className="cr-wf-tag">content</span>
          <b className="cr-wf-h" />
          {[96, 88, 92, 60].map((w, i) => <i key={i} style={{ width: w + '%' }} />)}
          <span className="cr-wf-code" />
          {[90, 74].map((w, i) => <i key={'b' + i} style={{ width: w + '%' }} />)}
        </div>
        <div className="cr-wf-ad cr-chrome"><span /><span /></div>
      </div>
      <div className="cr-wf-foot cr-chrome"><i /><i /><i /></div>
    </div>
  );
}

function Reader() {
  const [ref, live] = useLive(0.25);
  const [at, choose] = useSteps(SAMPLES.length, 5600, live);
  const s = SAMPLES[at];
  return (
    <div className="kn-obj cr-rd" ref={ref}>
      <div className="cr-rd-bar">
        <span className="cr-dots" aria-hidden="true"><i /><i /><i /></span>
        <p className="cr-rd-url" aria-hidden="true"><b>POST</b><span>/v1/crawl</span><em key={s.path}>https://example.com<u>{s.path}</u></em></p>
        <div className="cr-rd-tabs" role="tablist" aria-label="Example pages">
          {SAMPLES.map((x, i) => { const j = x.path.lastIndexOf('/'); return <button key={x.path} type="button" role="tab" aria-selected={at === i} onClick={() => choose(i)}><span className="cr-tab-d">{x.path.slice(0, j)}</span>{x.path.slice(j)}</button>; })}
        </div>
      </div>
      <div className="cr-rd-b" key={s.path} aria-hidden="true">
        <div className="cr-rd-page"><Wire /></div>
        <div className="cr-rd-pipe"><i /></div>
        <div className="cr-rd-md">
          <p className="cr-rd-k">Markdown <span>{s.path}</span></p>
          <pre>{s.md.map(([k, t], i) => <span key={i} className={'cr-ml ' + k} style={{ animationDelay: 1.15 + i * 0.16 + 's' }}>{t}</span>)}</pre>
          <dl className="cr-rd-meta" style={{ animationDelay: 1.3 + s.md.length * 0.16 + 's' }}>
            <div><dt>title</dt><dd>{s.title}</dd></div>
            <div><dt>canonical</dt><dd>example.com{s.path}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  );
}

/* ---------- the signature: three steps and a boundary, one pinned object scrubbed by scroll ---------- */
const BEATS = [
  ['The readable part, not the page', 'Deciding which subtree is the article is the hard problem, and it is the one this solves. You get the content and what the page says about itself, without the chrome around it.'],
  ['A browser only when needed', 'Most pages are a fetch and a parse. Headless Chromium is a separate service it escalates to for the ones that genuinely need rendering, so you do not pay browser cost for a documentation page.'],
  ['Markdown, and the metadata', 'Headings stay headings and links keep their targets, resolved against the page they came from. Title, description and canonical URL come back alongside — including the URL after redirects, which is the one worth citing.'],
  ['It cannot be pointed at your cluster', 'The caller supplies the URL, which makes any crawler a request-forgery primitive. Loopback, link-local and multicast are refused — including the cloud metadata endpoint on 169.254.169.254 that hands out credentials.'],
  ['Every redirect is checked too', 'Blocking the first address is not enough, because a public URL can redirect to a private one. The guard sits on the dialer, so a 302 toward metadata is refused at the hop that matters.'],
  ['A tool an agent can call', 'It answers on MCP as well as over HTTP, so a model can read a page mid-conversation without you building the plumbing for it.'],
];

// the example site, in a 400 x 300 box: [x, y, parent, path, when in the spread 0..1, minor]
const SITE = [
  [200, 34, -1, 'example.com', 0],
  [86, 104, 0, '/docs', 0.08], [200, 108, 0, '/blog', 0.14], [314, 104, 0, '/pricing', 0.2],
  [40, 178, 1, '/docs/start', 0.3, 1], [134, 184, 1, '/docs/api', 0.36], [222, 190, 2, '/blog/launch', 0.44], [330, 178, 3, '/pricing/faq', 0.5],
  [80, 252, 5, '/docs/api/auth', 0.6, 1], [170, 258, 5, '/docs/api/errors', 0.68, 1],
];
const META = [270, 280];
const LANES = [['/docs/start', 0], ['/docs/api', 0], ['/blog/launch', 0], ['/app', 1], ['/pricing', 0], ['/pricing/faq', 0]];

function CrawlMap({ beat }) {
  return (
    <div className="cr-map-in" data-beat={beat}>
      {/* 01: the page in hand loses its chrome */}
      <div className="cr-L cr-L0"><div className="cr-pg"><div className="cr-pg-bar"><i /><i /><i /><span>example.com/docs/api</span></div><Wire big /></div></div>

      {/* 02: a fetch and a parse, and the one page that needs a browser */}
      <div className="cr-L cr-L1">
        <div className="cr-lanes">
          <div className="cr-lane"><p className="cr-lane-k"><i />fetch + parse</p><ul>{LANES.map(([t, b], i) => !b && <li key={t} style={{ '--i': i }}>{t}</li>)}</ul></div>
          <div className="cr-lane br"><p className="cr-lane-k"><svg viewBox="0 0 16 16" width="14" height="14"><rect x="1.5" y="2.5" width="13" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M1.5 5.5h13" stroke="currentColor" strokeWidth="1.4" /></svg>Headless Chromium</p><ul><li style={{ '--i': 3 }}>/app <em>SPA</em></li></ul></div>
        </div>
      </div>

      {/* 03: Markdown, and the metadata */}
      <div className="cr-L cr-L2">
        <div className="cr-doc">
          <p className="cr-doc-k">example.com/docs/api <span>Markdown</span></p>
          <pre>
            {[['h', '# API'], ['p', 'Keys, errors and limits for the example API.'], ['h', '## Authentication'], ['l', '- [Keys](https://example.com/docs/api/auth)'], ['l', '- [Errors](https://example.com/docs/api/errors)'], ['c', '```bash'], ['c', 'export API_KEY=…'], ['c', '```']].map(([k, t], i) => <span key={i} className={'cr-ml ' + k} style={{ '--i': i }}>{t}</span>)}
          </pre>
          <dl className="cr-doc-meta">
            <div style={{ '--i': 0 }}><dt>title</dt><dd>API</dd></div>
            <div style={{ '--i': 1 }}><dt>description</dt><dd>Keys, errors and limits</dd></div>
            <div style={{ '--i': 2 }}><dt>canonical</dt><dd>https://example.com/docs/api</dd></div>
          </dl>
        </div>
      </div>

      {/* 04-06: the camera pulls back and the crawl spreads */}
      <div className="cr-L cr-L3">
        <div className="cr-site">
          <svg viewBox="0 0 400 300" className="cr-edges">
            {SITE.map(([x, y, pa, , t], i) => pa >= 0 && <line key={i} x1={SITE[pa][0]} y1={SITE[pa][1]} x2={x} y2={y} pathLength="1" style={{ '--t': t }} />)}
            <line className="bad" x1={SITE[6][0]} y1={SITE[6][1]} x2={META[0] - 14} y2={META[1] - 12} pathLength="1" style={{ '--t': 0.78 }} />
            <path className="hop" d="M330 178 C 380 190, 392 222, 362 240" pathLength="1" />
          </svg>
          {SITE.map(([x, y, , path, t, minor]) => (
            <span key={path} className={'cr-n' + (minor ? ' minor' : '') + (t === 0 ? ' root' : '')} style={{ left: x / 4 + '%', top: y / 3 + '%', '--t': t }}><i /><span>{t > 0.1 && <span className="cr-tab-d">{path.slice(0, path.lastIndexOf('/'))}</span>}{t > 0.1 ? path.slice(path.lastIndexOf('/')) : path}</span></span>
          ))}
          <span className="cr-n bad" style={{ left: META[0] / 4 + '%', top: META[1] / 3 + '%', '--t': 0.86 }}><i />169.254.169.254<b>refused</b></span>
          <span className="cr-guard" style={{ left: 362 / 4 + '%', top: 240 / 3 + '%' }}><b>302</b><span>refused at the hop</span></span>
        </div>
        <div className="cr-ports">
          <p><b>HTTP</b><span>/v1/crawl</span></p>
          <span className="cr-flow"><i /><i /><i /></span>
          <p><b>MCP</b><span>a model is asking</span></p>
        </div>
      </div>
    </div>
  );
}

function Scene() {
  const run = useRef(null);
  const box = useRef(null);
  const wide = useWide();
  const calm = useReducedMotion();
  const p = useMotionValue(0);
  const p6 = useTransform(p, (v) => v * 6);
  const [beat, setBeat] = useState(0);
  const { scrollYProgress } = useScroll({ target: run, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => { if (wide) p.set(v); });
  useMotionValueEvent(p, 'change', (v) => setBeat(Math.min(5, Math.max(0, Math.floor(v * 6 * 0.9999)))));
  useEffect(() => { if (wide) p.set(scrollYProgress.get()); }, [wide]); // eslint-disable-line react-hooks/exhaustive-deps

  // phones: the same scene by tap, or by itself while it is seen
  const seen = useInView(box, { amount: 0.4 });
  const [k, setK] = useState(0);
  const [mine, setMine] = useState(false);
  useEffect(() => {
    if (wide) return;
    if (calm) { p.set((k + 0.999) / 6); return; }
    p.set(k / 6);
    const c = animate(p, (k + 0.97) / 6, { duration: 2.4, ease: EASE });
    return () => c.stop();
  }, [k, wide, calm]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (wide || !seen || mine || calm) return;
    const t = setTimeout(() => setK((x) => (x + 1) % 6), 4200);
    return () => clearTimeout(t);
  }, [k, wide, seen, mine, calm]);

  const go = (i) => {
    if (!wide) { setMine(true); setK(i); return; }
    const el = run.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + ((el.offsetHeight - window.innerHeight) * (i + 0.8)) / 6;
    window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.2 }) : window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <section className="cr-sc" aria-labelledby="cr-sc-h">
      <div className="kn-wrap kn-grid cr-sc-head">
        <KeynoteLines id="cr-sc-h" className="kn-display sm cr-sc-h" lines={['Three steps,', 'and a boundary']} />
        <p className="kn-lede cr-sc-lede">Fetch, extract, render. Then the part that matters when the URL comes from a stranger.</p>
      </div>
      <div className="cr-run" ref={run}>
        <div className="cr-pin">
          <div className="kn-wrap kn-grid cr-sc-g" ref={box}>
            <div className="cr-sc-l">
              <div className="cr-steps" role="group" aria-label="Three steps, and a boundary">
                {BEATS.map(([t], i) => <button key={t} type="button" aria-label={t} aria-current={beat === i ? 'step' : undefined} onClick={() => go(i)}><span className="kn-fig">{pad(i + 1)}</span></button>)}
              </div>
              <ol className="cr-toc">
                {BEATS.map(([t], i) => (
                  <li key={t} className={(i === 3 ? 'gap' : '') + (beat === i ? ' on' : '')}>
                    <h3>
                      <button type="button" aria-current={beat === i ? 'step' : undefined} onClick={() => go(i)}>
                        <span className="kn-fig">{pad(i + 1)}</span><span className="cr-toc-t">{t}</span>
                      </button>
                    </h3>
                  </li>
                ))}
              </ol>
              <div className="cr-sc-body">
                {BEATS.map(([t, d], i) => <p key={t} className="kn-body" data-on={beat === i ? '' : undefined}>{d}</p>)}
              </div>
            </div>
            <motion.div className="kn-obj cr-map" style={{ '--p': p6 }} aria-hidden="true">
              <CrawlMap beat={beat} />
              <span className="cr-map-bar"><i style={{ '--k': 0 }} /><i style={{ '--k': 1 }} /><i style={{ '--k': 2 }} /><i style={{ '--k': 3 }} /><i style={{ '--k': 4 }} /><i style={{ '--k': 5 }} /></span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Beyond: which plan covers it ---------- */
const PLANS = [
  ['Build', '$49', ['50,000 pages/month', '5 concurrent crawlers', 'JavaScript rendering', 'Markdown + structured output', 'REST API access'], 'Read the docs', DOCS],
  ['Scale', '$499', ['500,000 pages/month', '25 concurrent crawlers', 'Priority JS rendering', 'LLM-based extraction', 'Direct Search + Vector integration'], 'Read the docs', DOCS],
  ['Enterprise', 'Custom', ['Unlimited pages', 'Unlimited concurrent crawlers', 'Dedicated rendering pool', 'Custom extraction schemas', 'Dedicated support + SLA'], 'Contact Sales', '/contact-sales'],
];
const CAP = [50000, 500000, Infinity];
const LO = 3, HI = 6.3; // the slider runs from 1,000 to about 2,000,000 pages a month, on a log scale
const toS = (v) => Math.round(((Math.log10(Math.max(1000, v)) - LO) / (HI - LO)) * 1000);
const fromS = (s) => { const v = 10 ** (LO + (s / 1000) * (HI - LO)); const m = 10 ** Math.floor(Math.log10(v) - 1); return Math.round(v / m) * m; };

function Plans() {
  const [raw, setRaw] = useState('50,000');
  const v = Number(raw.replace(/[^\d]/g, ''));
  const at = v > 0 ? CAP.findIndex((c) => v <= c) : -1;
  const use = at >= 0 && at < 2 ? Math.min(1, v / CAP[at]) : 0;
  return (
    <section className="kn-sec cr-price" aria-labelledby="cr-price-h">
      <div className="kn-wrap">
        <div className="kn-grid cr-price-top">
          <div className="cr-price-l">
            <p className="kn-kick ac">Which plan covers it</p>
            <KeynoteLines id="cr-price-h" className="kn-display sm" lines="Pricing" />
            <p className="kn-lede">You are paying for the hosted API and the browsers behind it, not for the code.</p>
          </div>
          <div className="cr-fit">
            <label className="cr-fit-in">
              <span className="kn-kick">pages/month</span>
              <input className="kn-fig" type="text" inputMode="numeric" value={raw} onChange={(e) => setRaw(e.target.value)} onBlur={() => v > 0 && setRaw(v.toLocaleString('en-US'))} aria-describedby="cr-fit-a" />
            </label>
            <input className="cr-fit-r" type="range" min="0" max="1000" step="1" value={toS(v || 1000)} onChange={(e) => setRaw(fromS(Number(e.target.value)).toLocaleString('en-US'))} aria-label="pages/month" />
            <div className="cr-fit-a" id="cr-fit-a" aria-live="polite">
              {at < 0 ? <p>Type a number of pages</p> : (
                <>
                  <p><b>{PLANS[at][0]}</b> — {PLANS[at][2][0]} · {PLANS[at][2][1]}</p>
                  <div className="cr-use" aria-hidden="true"><i style={{ transform: `scaleX(${at === 2 ? 1 : use})` }} className={at === 2 ? 'inf' : ''} /></div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="cr-plans">
          {PLANS.map(([n, pr, pts, cta, to], i) => (
            <div key={n} className={'cr-plan' + (at === i ? ' fit' : '')}>
              {at === i && <motion.span layoutId="cr-ring" className="cr-ring" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
              <h3 className="kn-title">{n}</h3>
              <p className="cr-plan-p kn-fig">{pr}{pr.startsWith('$') && <span>mo</span>}</p>
              <ul>{pts.map((x) => <li key={x}>{x}</li>)}</ul>
              <A to={to} className={'kn-btn' + (i === 1 ? ' solid' : '')}>{cta}</A>
            </div>
          ))}
        </div>
        <p className="kn-body cr-oss">The crawler is open source, and so is the headless-browser image it escalates to. Run both yourself for nothing. The plans buy you somebody else operating them.</p>
      </div>
    </section>
  );
}

/* ---------- send it a URL: the console, and where to go next ---------- */
function Send() {
  return (
    <section className="kn-sec cr-send">
      <div className="kn-wrap kn-grid cr-send-g">
        <div className="cr-send-l">
          <KeynoteLines className="kn-headline" lines="Send it a URL" />
          <p className="kn-lede">One call, and the page comes back as Markdown.</p>
          <p className="kn-body">From your code over HTTP, or from a model over MCP.</p>
          <div className="kn-acts"><A to={DOCS} className="kn-btn solid">Read the docs</A><A to={GH} className="kn-btn">View on GitHub</A></div>
        </div>
        <div className="cr-send-r">
          <Console light name="Crawl" api="/v1/crawl" session={['hanzo', 'deploy the gateway to staging', 'reading the project', 'gateway is on staging']} side={[['Crawl', '/crawl'], ['Chat', '/cloud/chat'], ['Bot', '/bot'], ['Search', '/search'], ['Studio', '/studio'], ['Console', '/console'], ['Referrals', '/cloud/referrals'], ['Marketplace', '/cloud/marketplace']]} />
          <p className="cr-note">Example project. Every name in it is one you would give your own.</p>
        </div>
      </div>
      <div className="kn-wrap"><Related className="cr-rel" items={[['Chat', '/cloud/chat', 'Conversational AI'], ['Bot', '/bot', 'Multi-agent platform'], ['Search', '/search', 'Retrieval & answers']]} /></div>
    </section>
  );
}

export default function Crawl() {
  return (
    <main className="kn cr" style={{ '--ac': '#a3a3a3' }}>
      <KeynoteStage
        kick="AI-Ready Web Crawler"
        title={['Hanzo Crawl']}
        lede="Give it a URL, get back Markdown"
        acts={[['Read the docs', DOCS], ['GitHub', GH]]}
        meta={<span>Apache-2.0 · /v1/crawl · MCP</span>}
        from={1.15}
      >
        <Reader />
      </KeynoteStage>

      <Scene />

      <KeynoteSpec
        kick="Fetch, extract, render"
        title="How it works"
        aside={<p className="kn-lede">Each step is its own file and can be tested without the other two.</p>}
        rows={[
          ['Step 01', <><p className="kn-title cr-st">Fetch</p><p>One guarded HTTP request. The dialer refuses private and link-local addresses on every hop, so a URL that redirects somewhere it should not reach is stopped there rather than after the fact.</p></>],
          ['Step 02', <><p className="kn-title cr-st">Extract</p><p>The document is reduced to the subtree a reader would call the content, plus the title, description and canonical URL the page claims for itself. If the HTML alone is not enough, this is where a headless browser gets involved.</p></>],
          ['Step 03', <><p className="kn-title cr-st">Render</p><p>That subtree becomes Markdown with its structure intact — headings, lists, code and links, with relative URLs resolved against the page. It is the format a model reads best and a person can still diff.</p></>],
          ['Two ways to call it', <><Fig n="2" u="HTTP · MCP" /><p>Over HTTP at /v1/crawl when your code is doing the asking, or over MCP when a model is.</p></>],
          ['Reads', <ul className="cr-kinds">{['Static Sites', 'SPAs', 'Documentation', 'E-Commerce', 'Forums', 'REST API'].map((t) => <li key={t}>{t}</li>)}</ul>],
          ['Returns', <div className="cr-figs">{[['JS', 'Full rendering'], ['Parallel', 'High throughput'], ['LLM', 'Structured extraction'], ['MD', 'Clean Markdown']].map(([a, b]) => <Fig key={a} n={a} u={b} />)}</div>],
        ]}
      />

      <Plans />
      <Send />

      <KeynoteClose
        name="Crawl"
        tag="Crawl, scrape, and embed"
        api="/v1/crawl"
        prompt="Read https://hanzo.ai/skill.md and use Hanzo Crawl in my project. Start with: hanzo crawl create"
      />
    </main>
  );
}
