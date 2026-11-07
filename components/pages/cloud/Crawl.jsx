'use client';
// Crawl.
// V2: 8/10 Launch page on the deck: a 52px title over the reader (the one big thing, crawling an example page by CSS from first paint, pausable); one pinned scene scrubbed by scroll tells "Three steps, and a boundary"; a spec sheet; the plans as one sheet with a stop slider on Hanzo's own allowances; a console; one graphite close.
// Persona: Developer whose code or agent needs to read web pages.
// Goal: call Hanzo Crawl (read the docs, then deploy it).
// CTA: "Read the docs" → https://docs.hanzo.ai/docs/openapi/crawl/ (solid: data-cta crawl.hero with data-thumb for the
//   ask bar, again crawl.send); "Deploy to Cloud" → https://platform.hanzo.ai/deploy (crawl.close, the close's one solid).
//   Quiet: GitHub (crawl.hero-2), the plan buttons (crawl.plan-build, crawl.plan-scale, crawl.plan-enterprise),
//   View on GitHub (crawl.send-gh).
// Metric: api_key_created (proxy on this page: the crawl.hero click).
// Signature: the crawl, scrubbed. One pinned object tells "Three steps, and a boundary" as you scroll: the page in hand
//   loses its chrome until only the readable subtree is outlined; most pages drop into the fetch-and-parse lane and one
//   SPA escalates to Headless Chromium; the subtree is written out as Markdown with its title, description and canonical
//   URL; then the camera pulls back and the crawl spreads through the site link by link, a link toward 169.254.169.254
//   refused, a 302 toward metadata cut at the hop, and the pages leaving over HTTP and MCP. One scroll value drives every
//   part through CSS (no per-frame React); phones play the same scene once by itself while seen (pausable), or by tap.
// Supporting: the Stage hero (the reader starts big and settles), the line-mask titles, the plan ring gliding to the plan
//   whose allowance you chose, the graphite close opening to full width.
// Motion kinds: arrival (title cut-in, the stage), idle (the reader crawling by itself), scroll (stage settle and the
//   scene only), state (the stop slider, its figure changing by mask, the ring), time (the console's run), pointer
//   (magnetic ask, dragging the slider).
// Beyond: "Which plan covers it": slide between Hanzo's three allowances (50,000 pages/month, 500,000 pages/month,
//   Unlimited pages); the plan whose allowance that is gets ringed in the sheet and its crawlers and price read out.
//   Only Hanzo's numbers ever show: the slider has three stops and nothing in between.
// Every word, price and link is Hanzo's; example.com and its pages are an example.
import { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { A, Cta } from '../../kit';
import { useCalm } from '../../ui';
import { scrollToY } from '../../../lib/scroll';
import KeynoteStage, { useStagePause } from '../../v2/KeynoteStage';
import KeynoteSpec, { Fig } from '../../v2/KeynoteSpec';
import KeynoteClose from '../../v2/KeynoteClose';
import KeynoteLines from '../../v2/KeynoteLines';
import { useWide } from '../../v2/KeynoteChapters';
import './Crawl.css';

const DOCS = 'https://docs.hanzo.ai/docs/openapi/crawl/';
const GH = 'https://github.com/hanzoai';
const pad = (n) => String(n).padStart(2, '0');
const MOVE = [0.4, 0, 0.2, 1];

const PauseIcon = ({ on }) => on
  ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4.5 3v10l8.5-5z" fill="currentColor" /></svg>
  : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="4" y="3" width="2.6" height="10" rx="1" fill="currentColor" /><rect x="9.4" y="3" width="2.6" height="10" rx="1" fill="currentColor" /></svg>;

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
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.25 });
  const calm = useCalm();
  const paused = useStagePause();
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  // the next example page every 5.6 s, only while seen, not paused and not chosen by hand
  useEffect(() => {
    if (!seen || calm || paused || mine) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % SAMPLES.length), 5600);
    return () => clearTimeout(t);
  }, [at, seen, calm, paused, mine]);
  const s = SAMPLES[at];
  return (
    <div className="kn-obj cr-rd" ref={ref}>
      <div className="cr-rd-bar">
        <span className="cr-dots" aria-hidden="true"><i /><i /><i /></span>
        <p className="cr-rd-url" aria-hidden="true"><b>POST</b><span>/v1/crawl</span><em key={s.path}>https://example.com<u>{s.path}</u></em></p>
        <div className="cr-rd-tabs" role="group" aria-label="Example pages">
          {SAMPLES.map((x, i) => {
            const j = x.path.lastIndexOf('/');
            return <button key={x.path} type="button" aria-pressed={at === i} onClick={() => { setAt(i); setMine(true); }}><span className="cr-tab-d">{x.path.slice(0, j)}</span>{x.path.slice(j)}</button>;
          })}
        </div>
      </div>
      <div className="cr-rd-b" key={s.path} aria-hidden="true">
        <div className="cr-rd-page"><Wire /></div>
        <div className="cr-rd-pipe"><i /></div>
        <div className="cr-rd-md">
          <p className="cr-rd-k">Markdown <span>{s.path}</span></p>
          <pre>{s.md.map(([k, t], i) => <span key={i} className={'cr-ml ' + k} style={{ animationDelay: 1.15 + i * 0.15 + 's' }}>{t}</span>)}</pre>
          <dl className="cr-rd-meta" style={{ animationDelay: 1.3 + s.md.length * 0.15 + 's' }}>
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
const META = [262, 282];
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
            <line className="bad" x1={SITE[6][0]} y1={SITE[6][1]} x2={META[0] - 4} y2={META[1] - 14} pathLength="1" style={{ '--t': 0.78 }} />
            <path className="hop" d="M330 178 C 378 188, 390 214, 366 232" pathLength="1" />
          </svg>
          {SITE.map(([x, y, , path, t, minor]) => (
            <span key={path} className={'cr-n' + (minor ? ' minor' : '') + (t === 0 ? ' root' : '')} style={{ left: x / 4 + '%', top: y / 3 + '%', '--t': t === 0 ? -0.15 : t }}><i /><span>{t > 0.1 && <span className="cr-tab-d">{path.slice(0, path.lastIndexOf('/'))}</span>}{t > 0.1 ? path.slice(path.lastIndexOf('/')) : path}</span></span>
          ))}
          <span className="cr-n bad" style={{ left: META[0] / 4 + '%', top: META[1] / 3 + '%', '--t': 0.86 }}><i />169.254.169.254<b>refused</b></span>
          <span className="cr-guard" style={{ left: 366 / 4 + '%', top: 232 / 3 + '%' }}><b>302</b><span>refused at the hop</span></span>
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
  const calm = useCalm();
  const p = useMotionValue(0);
  const p6 = useTransform(p, (v) => v * 6);
  const [beat, setBeat] = useState(0);
  const { scrollYProgress } = useScroll({ target: run, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => { if (wide) p.set(v); });
  useMotionValueEvent(p, 'change', (v) => setBeat(Math.min(5, Math.max(0, Math.floor(v * 6 * 0.9999)))));
  useEffect(() => { if (wide) p.set(scrollYProgress.get()); }, [wide]); // eslint-disable-line react-hooks/exhaustive-deps

  // phones: the same scene, once through by itself while it is seen (pausable), or by tap
  const seen = useInView(box, { amount: 0.4 });
  const [k, setK] = useState(0);
  const [mine, setMine] = useState(false);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (wide) return;
    if (calm) { p.set((k + 0.999) / 6); return; }
    p.set(k / 6);
    const c = animate(p, (k + 0.97) / 6, { duration: 2.4, ease: MOVE });
    return () => c.stop();
  }, [k, wide, calm]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (wide || !seen || mine || calm || hold || k >= 5) return;
    const t = setTimeout(() => setK((x) => x + 1), 4200);
    return () => clearTimeout(t);
  }, [k, wide, seen, mine, calm, hold]);

  const go = (i) => {
    if (!wide) { setMine(true); setK(i); return; }
    const el = run.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    scrollToY(top + ((el.offsetHeight - window.innerHeight) * (i + 0.8)) / 6, { duration: 1.2 });
  };

  return (
    <section className="cr-sc" aria-labelledby="cr-sc-h" data-paused={hold ? '' : undefined}>
      <div className="kn-wrap kn-grid cr-sc-head">
        <KeynoteLines id="cr-sc-h" className="kn-headline cr-sc-h" lines={['Three steps,', 'and a boundary']} />
        <p className="kn-lede cr-sc-lede">Fetch, extract, render. Then the part that matters when the URL comes from a stranger.</p>
      </div>
      <div className="cr-run" ref={run}>
        <div className="cr-pin">
          <div className="kn-wrap kn-grid cr-sc-g" ref={box}>
            <div className="cr-sc-l">
              {/* phones: the pause control first, then a step for each chapter (shown after the map) */}
              <div className="cr-ctl">
                <button type="button" className="kn-pause" aria-pressed={hold} aria-label="Pause" onClick={() => setHold((v) => !v)}><PauseIcon on={hold} /></button>
                <div className="cr-steps" role="group" aria-label="Three steps, and a boundary">
                  {BEATS.map(([t], i) => <button key={t} type="button" aria-label={t} aria-current={beat === i ? 'step' : undefined} onClick={() => go(i)}><span className="kn-fig">{pad(i + 1)}</span></button>)}
                </div>
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

/* ---------- Beyond: which plan covers it (three stops, Hanzo's three allowances, nothing in between) ---------- */
const PLANS = [
  ['Build', '$49', ['50,000 pages/month', '5 concurrent crawlers', 'JavaScript rendering', 'Markdown + structured output', 'REST API access'], 'Read the docs', DOCS],
  ['Scale', '$499', ['500,000 pages/month', '25 concurrent crawlers', 'Priority JS rendering', 'LLM-based extraction', 'Direct Search + Vector integration'], 'Read the docs', DOCS],
  ['Enterprise', 'Custom', ['Unlimited pages', 'Unlimited concurrent crawlers', 'Dedicated rendering pool', 'Custom extraction schemas', 'Dedicated support + SLA'], 'Contact Sales', '/contact-sales'],
];
// each plan's first line, split into its figure and its unit (the same words, in the same order)
const STOPS = PLANS.map(([, , pts]) => { const i = pts[0].indexOf(' '); return [pts[0].slice(0, i), pts[0].slice(i + 1)]; });

function Fit({ at, set }) {
  const track = useRef(null);
  const thumb = useRef(null);
  const pick = (x) => {
    const r = track.current.getBoundingClientRect();
    set(Math.max(0, Math.min(2, Math.round(((x - r.left) / r.width) * 2))));
  };
  const key = (e) => {
    const k = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
    if (k) { e.preventDefault(); set(Math.max(0, Math.min(2, at + k))); }
    else if (e.key === 'Home') { e.preventDefault(); set(0); }
    else if (e.key === 'End') { e.preventDefault(); set(2); }
  };
  const [n, u] = STOPS[at];
  const [name, price, pts] = PLANS[at];
  return (
    <div className="cr-fit">
      <p className="kn-kick" id="cr-fit-k">Which plan covers it</p>
      <div className="cr-fit-out" aria-live="polite">
        <p className="cr-fit-fig"><span className="cr-fit-m"><b className="kn-fig" key={n}>{n}</b></span><span className="cr-fit-u">{u}</span></p>
        <p className="cr-fit-a"><b>{name}</b> · {price}{price.startsWith('$') && <>/mo</>} · {pts[1]}</p>
      </div>
      <div
        className="cr-fit-r" ref={track} style={{ '--at': at }}
        onPointerDown={(e) => { pick(e.clientX); thumb.current?.focus({ preventScroll: true }); }}
        onPointerMove={(e) => { if (e.buttons & 1) pick(e.clientX); }}
      >
        <span className="cr-fit-line" aria-hidden="true"><i /></span>
        {STOPS.map(([s], i) => <span key={s} className="cr-fit-stop" data-on={i <= at ? '' : undefined} style={{ '--s': i }} aria-hidden="true" />)}
        <span
          ref={thumb} className="cr-fit-th" role="slider" tabIndex={0} aria-labelledby="cr-fit-k"
          aria-valuemin={0} aria-valuemax={2} aria-valuenow={at} aria-valuetext={pts[0]} onKeyDown={key}
        />
      </div>
      <div className="cr-fit-ticks" aria-hidden="true">
        {STOPS.map(([s], i) => <button key={s} type="button" tabIndex={-1} data-on={at === i ? '' : undefined} onClick={() => set(i)}>{s}</button>)}
      </div>
    </div>
  );
}

function Plans() {
  const [at, setAt] = useState(0);
  return (
    <section className="kn-sec cr-price" aria-labelledby="cr-price-h">
      <div className="kn-wrap">
        <div className="kn-grid cr-price-top">
          <div className="cr-price-l">
            <KeynoteLines id="cr-price-h" className="kn-headline" lines="Pricing" />
            <p className="kn-lede">You are paying for the hosted API and the browsers behind it, not for the code.</p>
          </div>
          <Fit at={at} set={setAt} />
        </div>
        <div className="cr-sheet">
          {PLANS.map(([n, pr, pts, cta, to], i) => (
            <div key={n} className="cr-plan" data-fit={at === i ? '' : undefined}>
              {at === i && <motion.span layoutId="cr-ring" className="cr-ring" transition={{ duration: 0.4, ease: MOVE }} aria-hidden="true" />}
              <h3 className="cr-plan-n">{n}</h3>
              <p className="cr-plan-p kn-fig">{pr}{pr.startsWith('$') && <span>mo</span>}</p>
              <ul>{pts.map((x) => <li key={x}>{x}</li>)}</ul>
              <Cta to={to} kind="quiet" id={'crawl.plan-' + n.toLowerCase()} className="cr-plan-go">{cta}</Cta>
            </div>
          ))}
        </div>
        <p className="kn-body cr-oss">The crawler is open source, and so is the headless-browser image it escalates to. Run both yourself for nothing. The plans buy you somebody else operating them.</p>
      </div>
    </section>
  );
}

/* ---------- send it a URL: the console (page-local; Frame's Console is retired) and where to go next ---------- */
const SIDE = [['Crawl', '/crawl'], ['Chat', '/cloud/chat'], ['Bot', '/bot'], ['Search', '/search'], ['Studio', '/studio'], ['Console', '/console'], ['Referrals', '/cloud/referrals'], ['Marketplace', '/cloud/marketplace']];
const ICONS = ['M8 2v4M8 6 4 10M8 6l4 4M4 10v4M12 10v4', 'M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM1.5 8h13M8 1.5c2 2 2 11 0 13M8 1.5c-2 2-2 11 0 13', 'M3 3h3v3H3zM10 10h3v3h-3zM6 4.5h3.5v5.5', 'M2.5 3h11v4h-11zM2.5 9h11v4h-11z', 'M8 2 2.5 5v6L8 14l5.5-3V5zM2.5 5 8 8l5.5-3M8 8v6', 'M2 12l4-4 3 3 5-6', 'M5 2.5h6M3.5 6h9M2 9.5h12v4H2z', 'M8 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM2.5 14c.8-2.6 3-4 5.5-4s4.7 1.4 5.5 4'];
const REL = [['Chat', '/cloud/chat', 'Conversational AI'], ['Bot', '/bot', 'Multi-agent platform'], ['Search', '/search', 'Retrieval & answers']];

function Desk() {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.5, once: true });
  const calm = useCalm();
  const [done, setDone] = useState(false);
  // the session runs once when it is first seen: the step reads the project, then the gateway lands on staging
  useEffect(() => {
    if (!seen) return;
    if (calm) { setDone(true); return; }
    const t = setTimeout(() => setDone(true), 2400);
    return () => clearTimeout(t);
  }, [seen, calm]);
  return (
    <div className="cr-con" ref={ref} data-run={seen ? '' : undefined} data-done={done ? '' : undefined}>
      <div className="cr-con-bar"><span className="cr-dots" aria-hidden="true"><i /><i /><i /></span><A to="/home" className="cr-con-t">Crawl — Hanzo</A></div>
      <div className="cr-con-b">
        <nav className="cr-con-side" aria-label="Products">
          {SIDE.map(([t, to], i) => (
            <A key={t} to={to} className="cr-con-l" aria-current={i === 0 ? 'page' : undefined}>
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d={ICONS[i]} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
              <span>{t}</span>
            </A>
          ))}
        </nav>
        <div className="cr-con-main">
          <p className="cr-con-me">deploy the gateway to staging</p>
          <p className="cr-con-who">hanzo</p>
          <p className="cr-con-step"><i aria-hidden="true" />reading the project</p>
          <span className="cr-con-bar2" aria-hidden="true"><i /></span>
          <p className="cr-con-done" aria-live="polite"><i aria-hidden="true" />gateway is on staging</p>
        </div>
      </div>
      <div className="cr-con-foot"><span>api.hanzo.ai<b>/v1/crawl</b></span><A to="https://hanzo.team/" className="cr-con-open">Open in the console ↗</A></div>
    </div>
  );
}

function Send() {
  return (
    <section className="kn-sec cr-send">
      <div className="kn-wrap kn-grid cr-send-g">
        <div className="cr-send-l">
          <KeynoteLines className="kn-headline" lines="Send it a URL" />
          <p className="kn-lede">One call, and the page comes back as Markdown.</p>
          <p className="kn-body">From your code over HTTP, or from a model over MCP.</p>
          <div className="kn-acts"><Cta to={DOCS} id="crawl.send">Read the docs</Cta><Cta to={GH} kind="quiet" id="crawl.send-gh">View on GitHub</Cta></div>
        </div>
        <div className="cr-send-r">
          <Desk />
          <p className="cr-note">Example project. Every name in it is one you would give your own.</p>
        </div>
      </div>
      <div className="kn-wrap cr-rel">
        <p className="kn-kick">Related capabilities</p>
        <ul>
          {REL.map(([t, to, d]) => (
            <li key={t}>
              <A to={to} className="cr-rel-a">
                <b data-morph="">{t}</b><span>{d}</span>
                <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </A>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Crawl() {
  return (
    <main className="kn cr">
      <KeynoteStage
        kick="AI-Ready Web Crawler"
        title={['Hanzo Crawl']}
        lede="Give it a URL, get back Markdown"
        acts={[['Read the docs', DOCS], ['GitHub', GH]]}
        meta={<span>Apache-2.0 · /v1/crawl · MCP</span>}
        from={1.12}
        cta="crawl.hero"
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
          ['Two ways to call it', <><p className="cr-ways" aria-hidden="true"><span><b>HTTP</b>/v1/crawl</span><span><b>MCP</b></span></p><p>Over HTTP at /v1/crawl when your code is doing the asking, or over MCP when a model is.</p></>],
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
        cta="crawl.close"
        prompt="Read https://hanzo.ai/skill.md and use Hanzo Crawl in my project. Start with: hanzo crawl create"
      />
    </main>
  );
}
