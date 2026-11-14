'use client';
// Signature: Live terminal: the hero terminal types the page's own curl to https://api.hanzo.ai (only the path changes), streams back what that endpoint returns with the model that serves it playing beside, and the visitor picks the next command
// Beyond: Same host, same key: pick any endpoint and only the path wipes in; the host and the bearer header never change, which is the page's own claim (no second base URL) made visible, and it copies as curl
/* Hanzo API, v2 (Archetype F, developer: the request is the hero).
   V2: 8/10 motion map: signature `terminal` (the hero types the curl, streams its output, you pick the next command); entrances line-draw (Paste), underline-sweep (How it fits), invert-flash (Base URL), shutter (Core endpoints), swing-door (Band); pinned chapters replaced by four plain rows
   Persona: a developer who has used the OpenAI API and wants every Hanzo capability behind one key.
   Metric: api_key_created (data-cta api-hero-key, api-close-key).
   Goal: see that one base URL and one key reach every endpoint, then get a key.
   CTA: "Get an API key, free" (hero, desktop header via thumb, phone slim bar, the Band); "OpenAPI Reference" as the quiet second.
   Motion (MOTION-MAP): signature `terminal` = the hero terminal types the page's own curl (only the path changes),
   streams the endpoint's output back with the model film beside, and the row under it picks the next command (click, tap,
   arrow keys); pause holds it. Entrances, page-local in components/pages/api/: line-draw (Paste and ship card),
   underline-sweep (How it fits together), invert-flash (the black room), shutter (Core endpoints), swing-door (the Band).
   No pinned chapters. One other reveal: the h1's line rise at first paint. Tab pills glide (layoutId).
   Colour: greys only (Hanzo's deck); colour arrives only through the model films. Every word is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Copy, Magnetic } from '../ui';
import { A, Cta, Img, Film } from '../kit';
import { play } from '../../lib/sound';
import NoJs from '../NoJs';
import { useEnter, Draw } from './api/enter';
import '../v2/AppType.css';
import './ApiPage.css';
import './api/enter.css';

const DOCS = 'https://docs.hanzo.ai/docs/openapi/';
const HERO = [
  ['POST', '/v1/chat/completions', 'A completion from any model your organization can reach, streamed or buffered. Model ids come from the catalog, so the list is a request rather than a page in the docs.', 'ai/post-chat-completions', 'enso'],
  ['POST', '/v1/responses', 'Stateful multi-turn responses with built-in tool calling, structured outputs, reasoning traces, and server-managed conversation state.', 'ai/post-responses', 'zen'],
  ['POST', '/v1/decisions', 'Sub-10ms structured classification, routing, scoring, and guardrail decisions powered by Kai at a fraction of LLM cost.', 'ai/post-decisions', 'kai'],
  ['POST', '/v1/videos/generations', 'Generate cinematic video with synchronized audio and camera motion from text or reference frames via Koma.', 'ai/post-videos-generations', 'koma'],
  ['POST', '/v1/images/generations', 'Photorealistic image generation, inpainting, and layout-accurate typography rendering via Iro.', 'ai/post-images-generations', 'iro'],
  ['POST', '/v1/audio/speech · /v1/audio/music', 'Low-latency neural speech synthesis, voice cloning, transcription, foley sound effects, and full-track music generation via Koe, Oto, and Uta.', 'ai/post-audio-speech', 'koe'],
  ['POST', '/v1/3d/generations', 'Textured 3D meshes and spatial world assets generated from text prompts or multi-view images via Mori.', 'ai/post-3d-generations', 'mori'],
  ['POST', '/v1/embeddings', 'Vectors for search, retrieval and clustering, from the same key and the same bill as generation.', 'ai/post-embeddings', 'enso'],
];
const MORE = [
  ['GET', '/v1/models', 'What your organization may call right now — every model we serve plus any provider account you have connected, with their identifiers and pricing.', 'ai/get-models'],
  ['GET · POST', '/v1/agents', 'Define an agent once, run it by reference, and read its runs afterwards. The definition lives here, so everything that runs it runs the same one.', 'agent'],
  ['GET · POST', '/v1/code/search · /v1/code/ask', 'AST-indexed symbol search, repository context assembly, and semantic codebase Q&A across your organization’s repositories.', 'code/get-code-search'],
  ['POST', '/v1/sandbox', 'Lease isolated microVM sandboxes with filesystem, terminal WebSocket, headless browser screen streaming, and sub-second startup.', 'sandbox/post-sandbox'],
  ['POST', '/v1/crawl · /v1/search', 'Clean markdown extraction from any live web page and structured real-time web search for RAG and agent research.', 'crawl/read-page'],
  ['GET', '/v1/billing/balance · /v1/billing/usage', 'What is left, and what was spent. Usage is recorded per call and attributed to the organization on the token, so a bill can be traced back to the request that caused it.', 'billing/get-billing-usage'],
  ['GET', '/v1/tools', 'The tools your organization can call over REST or MCP. An agent picks from this list, and so can you — it is the same catalog either way.', 'tool'],
];
const ALL = [...HERO.map(([m, p, d, doc]) => [m, p, d, doc]), ...MORE];
const n8 = (i: number) => String(i + 1).padStart(2, '0') + ' / 08';
const LONGEST = HERO.reduce((a, h) => (h[2].length > a.length ? h[2] : a), '');
const KEY = 'Authorization: Bearer <your key>';

/* ---------- the hero console: the path types, the answer streams, the model plays ---------- */
function Console() {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const [held, setHeld] = useState(false); // the pause control
  const calm = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const seen = useInView(box, { amount: 0.25 });
  const path = useRef<HTMLSpanElement>(null);
  const desc = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(true);
  const first = useRef(true); // the first walk waits for the h1 to land (the words lead)
  const live = seen && !calm && !held;
  useEffect(() => {
    const [, full, d] = HERO[at];
    const p = full.split(' · ')[0]; // a curl calls one path
    if (!live) { if (path.current) path.current.textContent = p; if (desc.current) desc.current.textContent = d; setDone(true); return; }
    let alive = true, t = 0, i = 0, w = 0;
    const words = d.split(' ');
    setDone(false);
    const typeP = () => {
      if (!alive) return;
      if (i <= p.length) { path.current!.textContent = p.slice(0, i++); t = setTimeout(typeP, 30); return; }
      setDone(true);
      t = setTimeout(stream, 200);
    };
    // the card never blanks: the previous answer stays (dimmed) while the new path types, then the new one streams over it
    const stream = () => {
      if (!alive) return;
      if (w === 0) desc.current!.classList.remove('stale');
      if (w <= words.length) { desc.current!.textContent = words.slice(0, w++).join(' ') || ' '; t = setTimeout(stream, 34); }
    };
    // the first walk holds the server-painted request until the h1 has landed, then types
    const hold = first.current, clear = () => { path.current!.textContent = ''; desc.current!.classList.add('stale'); };
    first.current = false;
    if (!hold) clear();
    t = setTimeout(() => { if (!alive) return; if (hold) clear(); typeP(); }, hold ? 1000 : 240);
    return () => { alive = false; clearTimeout(t); if (desc.current) desc.current.classList.remove('stale'); };
  }, [at, live]);
  // the walk runs once through all eight, then rests on the first (MASTER: demos end at rest)
  const [walked, setWalked] = useState(false);
  useEffect(() => {
    if (mine || !live || walked) return;
    const t = setTimeout(() => { if (at === HERO.length - 1) { setWalked(true); setAt(0); play('done'); } else setAt(at + 1); }, 4600);
    return () => clearTimeout(t);
  }, [at, mine, live, walked]);
  const pick = (i: number) => { setAt(i); setMine(true); };
  const [m, p, d, doc] = HERO[at];
  // hover detail: pointing at a chip previews the model that serves it in the frame (fine pointers only)
  const [peek, setPeek] = useState(-1);
  const model = HERO[peek >= 0 ? peek : at][4];
  return (
    <div className={'api-con api-term av-obj' + (held ? ' held' : '')} ref={box}>
      <div className="api-term-bar">
        <span className="api-ret-k x-mono">{n8(at)}</span>
        <button type="button" className="api-pause" data-sound="tick" aria-pressed={held} aria-label={held ? 'Play' : 'Pause'} onClick={() => setHeld((h) => !h)}>
          {held
            ? <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5 3.5v9l7-4.5z" fill="currentColor" /></svg>
            : <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
        </button>
        <A to={DOCS + doc} className="api-send" aria-label={'Docs: ' + p}>
          <svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </A>
      </div>
      <div className="api-con-main">
        <div className="api-ret">
          {/* the command types itself: the same curl the black room copies, with only the path changing */}
          <p className="api-term-cmd x-mono">
            <span className="api-ln"><span className="api-term-ps" aria-hidden="true">$ </span>curl -X <span className="api-meth">{m}</span>{' \\'}</span>
            <span className="api-ln ind"><span className="api-host">https://api.hanzo.ai</span><wbr /><span className="api-url"><span className="api-path" ref={path}>{p.split(' · ')[0]}</span><span className={'api-caret' + (done ? ' idle' : '')} aria-hidden="true" />{' \\'}</span></span>
            <span className="api-ln ind">-H &quot;<span className="api-term-key">{KEY}</span>&quot;</span>
          </p>
          {/* and its output streams back */}
          <div className="api-desc-box">
            <p className="api-desc api-desc-size" aria-hidden="true">{LONGEST}</p>
            <p className="api-desc" aria-live="polite"><span ref={desc}>{d}</span></p>
          </div>
          <A to={DOCS + doc} className="api-doc">Docs <span aria-hidden="true">↗</span></A>
        </div>
        <div className="api-model">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={model} className="api-model-in" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: EASE }}>
              <Img src={`/models/${model}.webp`} alt="" w={1200} h={1500} />
              {!held && <Film src={`/models/${model}.webm`} poster={`/models/${model}.webp`} w={1200} h={1500} />}
            </motion.div>
          </AnimatePresence>
          <span className="api-model-k x-mono">{model}</span>
          <NoJs css=".api-model video{display:none!important}" />
        </div>
      </div>
      {/* pick the next command: click, tap, or arrow keys along the row */}
      <ol className="api-chips" role="tablist" aria-label="Endpoints" onPointerLeave={() => setPeek(-1)}
        onKeyDown={(e) => {
          const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
          if (!k) return;
          e.preventDefault();
          const n = (at + k + HERO.length) % HERO.length;
          pick(n);
          e.currentTarget.querySelectorAll('button')[n]?.focus();
        }}>
        {HERO.map(([mm, pp], i) => (
          <li key={pp}>
            <button type="button" role="tab" aria-selected={at === i} tabIndex={at === i ? 0 : -1} data-sound="tick" onClick={() => { setPeek(-1); pick(i); }}
              onPointerEnter={(e) => { if (e.pointerType === 'mouse') setPeek(i); }}>
              {at === i && <motion.span layoutId="api-chip" className="api-chip-bg" transition={{ duration: 0.3, ease: EASE }} />}
              <span className="x-mono">{mm + ' ' + pp}</span>
              {at === i && !mine && live && !walked && <i key={'t' + at} className="api-chip-t" aria-hidden="true" />}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Hero() {
  return (
    <section className="api-hero" aria-labelledby="api-h1">
      <div className="av-wrap av-grid api-top">
        <div className="api-top-l">
          <h1 id="api-h1" className="av-display api-h1">
            {['One API for', 'models, agents', 'and tools'].map((l, i, a) => (
              <span key={l} className="api-h1-ln"><span style={{ '--i': i }}>{l}{i < a.length - 1 ? ' ' : ''}</span></span>
            ))}
          </h1>
          <p className="av-lede">Every Hanzo capability answers under one base URL, behind one key.</p>
          <div className="av-acts api-acts">
            <Magnetic strength={0.25}><Cta to="https://platform.hanzo.ai/api-keys" kind="solid" size="lg" id="api-hero-key" thumb>Get an API key, free</Cta></Magnetic>
            <A to={DOCS} className="x-arrow api-ref" data-cta="api-hero-ref">OpenAPI Reference ↗</A>
          </div>
        </div>
        <div className="api-top-r" data-morph-target="">
          <Console />
        </div>
      </div>
    </section>
  );
}

/* ---------- paste and ship: copy one line into any agent ---------- */
function Paste() {
  const text = 'Read https://hanzo.ai/skill.md and use Hanzo API in my project.';
  return (
    <section className="api-paste">
      <div className="av-wrap av-grid">
        <div className="api-paste-l">
          <p className="av-title">Paste and ship</p>
          <p className="av-body">Paste this into any agent. It reads the skill manifest and calls API from there.</p>
        </div>
        <div className="api-prompt" data-enter="line-draw">
          <Draw />
          <span className="av-kick">Agent prompt</span>
          <code>{text}</code>
          <Copy text={text} />
        </div>
      </div>
    </section>
  );
}

/* ---------- How it fits together: four pinned chapters, each with its own live UI ---------- */
/* scene 1: not another route list. One key at the top, calls falling from it into one bill that fills. */
function KeyBill({ on }) {
  return (
    <div className={'api-vis api-bill' + (on ? ' on' : '')} aria-hidden="true">
      <div className="api-bill-key"><span className="x-mono">{KEY}</span></div>
      <div className="api-bill-flow">{[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ '--i': i }} />)}</div>
      <div className="api-bill-sum">
        <span className="x-mono">/v1/billing/balance · /v1/billing/usage</span>
        <p>What is left, and what was spent.</p>
        <b className="api-bill-m"><i /></b>
      </div>
    </div>
  );
}

function Identity({ on }) {
  return (
    <div className={'api-vis api-id' + (on ? ' on' : '')} aria-hidden="true">
      <div className="api-id-col">
        <span className="av-kick">Client</span>
        <div className="api-id-card">
          <span className="x-mono">{KEY}</span>
          <span className="x-mono api-id-drop">identity headers</span>
        </div>
      </div>
      <div className="api-id-gate"><span className="x-mono">https://api.hanzo.ai/v1</span><i className="api-id-pk" /></div>
      <div className="api-id-col">
        <span className="av-kick">Downstream</span>
        <div className="api-id-card">
          <span className="x-mono">verified token</span>
          <span className="x-mono api-id-new">identity headers</span>
        </div>
      </div>
    </div>
  );
}

/* scene 3: one row ticking through. The OpenAPI operation on the left, the client method named by its operation id
   on the right (the ids are the docs' own slugs); it walks six operations once and rests on the last. */
const OPS = HERO.slice(0, 6).map(([m, p, , doc]) => [m + ' ' + p.split(' · ')[0], doc.split('/').pop()]);
function Generated({ on }) {
  return (
    <div className={'api-vis api-gen' + (on ? ' on' : '')} aria-hidden="true">
      <div className="api-gen-h"><span className="av-kick">OpenAPI</span><span className="av-kick">Client</span></div>
      <ul style={{ '--n': OPS.length }}>
        {OPS.map(([op, id], i) => (
          <li key={id} style={{ '--i': i }} className={i === OPS.length - 1 ? 'last' : ''}>
            <span className="x-mono">{op}</span>
            <svg viewBox="0 0 16 16" width="16" height="16"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span className="x-mono">{id}</span>
          </li>
        ))}
      </ul>
      <div className="api-gen-dots">{OPS.map(([, id], i) => <i key={id} style={{ '--i': i }} />)}</div>
    </div>
  );
}

/* scene 4: the gateway fans out to the models behind it (short names, never truncated) */
const SERVICES = ['enso', 'zen', 'kai', 'koma', 'iro', 'mori'];
function Gateway({ on }) {
  return (
    <div className={'api-vis api-gw' + (on ? ' on' : '')} aria-hidden="true">
      <div className="api-gw-app"><b>Your app</b><span className="x-mono">{KEY}</span></div>
      <div className="api-gw-in"><i /><i /><i className="back" /><em className="x-mono">429 · Retry-After</em></div>
      <div className="api-gw-gate"><span className="x-mono">https://api.hanzo.ai/v1</span></div>
      <ul className="api-gw-out">
        {SERVICES.map((s, i) => (
          <li key={s} style={{ '--i': i }}><span className="api-wire"><i /></span><span className="api-svc x-mono">{s}</span></li>
        ))}
      </ul>
    </div>
  );
}

const FITS = [
  { title: 'One key, one bill', body: <p className="av-body">A single key authenticates every endpoint, and usage meters to the organization it belongs to. Spend is attributed in one place instead of once per service.</p>, visual: (on) => <KeyBill on={on} /> },
  { title: 'Identity is the gateway’s to state', body: <p className="av-body">Every request passes a gateway that throws away the identity headers a client sent and writes them again from the verified token. Nothing downstream has to wonder whether an org id came from a token or from a curl flag.</p>, visual: (on) => <Identity on={on} /> },
  { title: 'Generated, not hand-written', body: <p className="av-body">The clients come from the OpenAPI document this API serves, and their method names are its operation ids. A client is checkable against a release rather than against somebody’s memory.</p>, visual: (on) => <Generated on={on} /> },
  { title: 'Every route lives under /v1', body: <p className="av-body">Every route lives under <code>/v1</code>, and every service answers on the same host — there is no second base URL to configure and no v2 waiting to break the first one. Rate limits are applied per caller and across the edge as a whole; a rejected request comes back as a <code>429</code> with a <code>Retry-After</code> rather than a dropped connection.</p>, visual: (on) => <Gateway on={on} /> },
];

/* How it fits together: four plain rows (no pinned stage). Each visual plays once as its row arrives. */
function FitRow({ item, i }) {
  const ref = useRef<HTMLLIElement>(null);
  const on = useInView(ref, { once: true, amount: 0.35 });
  return (
    <li ref={ref} className={'api-fit' + (on ? ' on' : '')}>
      <div className="api-fit-t">
        <span className="api-fit-n x-mono" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
        <h3 className="av-head"><span className="api-sweep">{item.title}</span></h3>
        {item.body}
      </div>
      <div className="api-fit-v">{item.visual(on)}</div>
    </li>
  );
}

function Fits() {
  return (
    <section className="av-sec api-fits" data-enter="underline-sweep">
      <div className="av-wrap">
        <h2 className="av-display s api-fits-h">
          {['How', 'it', 'fits', 'together'].map((w, i, a) => <span key={w}><span className="api-sweep" style={{ '--i': i }}>{w}</span>{i < a.length - 1 ? ' ' : ''}</span>)}
        </h2>
        <ol className="api-fit-list">
          {FITS.map((it, i) => <FitRow key={it.title} item={it} i={i} />)}
        </ol>
      </div>
    </section>
  );
}

/* ---------- the dark room: the one base URL, and the Beyond request line ---------- */
function Call() {
  const [k, setK] = useState(0);
  const [m, p, , doc] = ALL[k];
  const method = m.split(' ')[0], path = p.split(' · ')[0];
  const curl = `curl -X ${method} https://api.hanzo.ai${path} \\\n  -H "Authorization: Bearer <your key>"`;
  return (
    <div className="api-call">
      <p className="api-call-k" id="api-call-k">Endpoint</p>
      <div className="api-call-list" role="listbox" aria-labelledby="api-call-k" data-lenis-prevent>
        {ALL.map(([mm, pp], i) => (
          <button key={pp} type="button" role="option" aria-selected={k === i} data-sound="tick" onClick={() => setK(i)}>
            <span className="x-mono api-call-lm">{mm.split(' ')[0]}</span><span className="x-mono">{pp.split(' · ')[0]}</span>
          </button>
        ))}
      </div>
      <pre className="api-call-line" tabIndex={0} aria-label="Request"><code><span className="api-call-host">curl -X </span><span className="api-call-m">{method}</span><span className="api-call-host"> https://api.hanzo.ai</span><motion.span key={path} className="api-call-path" initial={{ clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: 'inset(0 0% 0 0)' }} transition={{ duration: 0.4, ease: EASE }}>{path}</motion.span><span className="api-call-host">{' \\\n  -H "Authorization: Bearer <your key>"'}</span></code></pre>
      <div className="api-call-f"><Copy text={curl} label="Copy as curl" /><A to={DOCS + doc}>Body and parameters ↗</A></div>
    </div>
  );
}

function Base() {
  // the dark room arrives with an invert flash (components/pages/api/enter.css), not a scroll scrub
  return (
    <section className="av-sec api-dark av-dark" data-room="dark" data-enter="invert-flash">
      <div className="av-wrap">
        <h2 className="av-head api-base-h">Base URL</h2>
        <div className="api-big">
          <span className="x-mono api-big-url">https://api.hanzo.ai<wbr /><span className="av-ac">/v1</span></span>
          <Copy text="https://api.hanzo.ai/v1" />
        </div>
        <div className="av-grid api-base-g">
          <div className="api-base-l">
            <p className="av-lede">
              Authenticate with a bearer token: <code>Authorization: Bearer &lt;your key&gt;</code>. Keys are created and revoked in the <A to="https://platform.hanzo.ai/api-keys">console</A>, and revoking one there is what stops it working.
            </p>
          </div>
          <div className="api-base-r"><Call /></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- the core endpoints: a list you filter; each row opens to say what it does ---------- */
const FILTERS = ['All', 'POST', 'GET'];
const SHOW = 6;

function Table() {
  const [f, setF] = useState(0);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(0);
  const rows = ALL.filter(([m, p, d]) => (f === 0 || m.includes(FILTERS[f])) && (!q || (p + ' ' + d).toLowerCase().includes(q.toLowerCase())));
  // six rows first, the rest one tap away; every row stays in the HTML (hidden="until-found", so Find in page opens them)
  const [all, setAll] = useState(false);
  const full = all || f !== 0 || !!q;
  const list = useRef<HTMLUListElement>(null);
  // every row is set on every change (filter, search, Show all): a keyed row that moves into the first six loses `hidden`
  useEffect(() => {
    const els = [...list.current!.querySelectorAll(':scope > li')];
    const show = () => setAll(true);
    els.forEach((el) => {
      if (!full && el.hasAttribute('data-more')) el.setAttribute('hidden', 'until-found'); else el.removeAttribute('hidden');
      el.addEventListener('beforematch', show);
    });
    return () => els.forEach((el) => el.removeEventListener('beforematch', show));
  }, [full, f, q, rows.length]);
  return (
    <section className="av-sec api-core">
      <div className="av-wrap av-grid">
        <div className="api-core-l" data-enter="shutter">
          <h2 className="av-head">Core endpoints</h2>
          <p className="av-body">A few of the ones people reach for first. Every parameter and error shape is in the reference.</p>
          <div className="api-tools">
            <div className="api-seg" role="tablist" aria-label="Method">
              {FILTERS.map((x, i) => (
                <button key={x} type="button" role="tab" aria-selected={f === i} data-sound="tick" onClick={() => setF(i)}>
                  {f === i && <motion.span layoutId="api-seg" className="api-seg-bg" transition={{ duration: 0.3, ease: EASE }} />}
                  <span>{x}</span>
                </button>
              ))}
            </div>
            <label className="api-q">
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="/v1/…" aria-label="Filter endpoints" />
            </label>
            <span className="api-count x-mono av-num">{rows.length} / {ALL.length}</span>
          </div>
        </div>
        <ul className="api-rows" ref={list} data-enter="shutter">
          {rows.map(([m, p, d, doc], n) => {
            const k = ALL.findIndex((r) => r[1] === p);
            const isOpen = open === k;
            return (
              <li key={p} className={isOpen ? 'open' : ''} data-more={n >= SHOW ? '' : undefined}>
                <button type="button" className="api-row" aria-expanded={isOpen} data-sound="tick" onClick={() => setOpen(isOpen ? -1 : k)}>
                  <span className={'api-row-m x-mono m-' + m.split(' ')[0].toLowerCase()}>{m}</span>
                  <span className="api-row-p x-mono">{p}</span>
                  <span className="api-row-x" aria-hidden="true" />
                </button>
                <div className="api-row-d">
                  <p>{d}</p>
                  <A to={DOCS + doc} className="api-doc">Docs <span aria-hidden="true">↗</span></A>
                </div>
              </li>
            );
          })}
          {!full && rows.length > SHOW && (
            <li className="api-more">
              <button type="button" data-sound="tick" onClick={() => setAll(true)}>
                <span>Show all</span><span className="x-mono av-num">+{rows.length - SHOW}</span>
              </button>
            </li>
          )}
          {rows.length === 0 && <li className="api-none">No endpoint matches. <button type="button" onClick={() => { setQ(''); setF(0); }}>Show all</button></li>}
        </ul>
      </div>
    </section>
  );
}

/* ---------- the Band: the ask once more, with the two next doors folded under it as text rows ---------- */
const NEXT = [['API reference', 'Every endpoint, parameter and response shape.', DOCS], ['Getting started', 'An empty project to a first call that works.', 'https://docs.hanzo.ai/docs/quickstart']];
function Next() {
  return (
    <section className="av-sec tight api-next" data-enter="swing-door">
      <div className="av-wrap">
        <div className="api-close">
          <p className="av-display s api-close-t">Every Hanzo capability answers under one base URL, behind one key.</p>
          <div className="av-acts">
            <Magnetic strength={0.25}><Cta to="https://platform.hanzo.ai/api-keys" kind="solid" size="lg" id="api-close-key">Get an API key, free</Cta></Magnetic>
            <A to={DOCS} className="x-arrow api-ref" data-cta="api-close-ref">OpenAPI Reference ↗</A>
          </div>
        </div>
        <div className="api-next-g">
          <h2 className="api-next-h">Next</h2>
          <ul className="api-next-rows">
            {NEXT.map(([t, d, to]) => (
              <li key={t}>
                <A to={to} className="api-next-a" data-cta={'api-next-' + t.split(' ')[0].toLowerCase()}>
                  <span className="api-next-t">{t}</span>
                  <span className="api-next-d">{d}</span>
                  <span className="api-next-go" aria-hidden="true"><svg viewBox="0 0 16 16" width="16" height="16"><path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                </A>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* Phones keep Hanzo's "Try Hanzo" solid in the header; while this page's own solid ask (hero or Band) is on screen the
   header's button reads as an outline (the same html[data-ask=quiet] the shell sets on desktop), so one solid shows at a time.
   Same page-local move as /bounty. */
function useOneSolidOnPhone() {
  useEffect(() => {
    const H = document.documentElement;
    const mq = matchMedia('(max-width: 700px)');
    const els = [...document.querySelectorAll('main.api [data-cta="api-hero-key"], main.api [data-cta="api-close-key"]')];
    if (!els.length) return;
    const vis = new Set();
    let mine = false;
    const apply = () => {
      if (mq.matches && vis.size) { if (H.dataset.ask !== 'quiet') H.dataset.ask = 'quiet'; mine = true; }
      else if (mine && mq.matches) { delete H.dataset.ask; mine = false; }
    };
    // from first paint, ApiPage.css quiets the header on its own (html:not([data-api-ask])); once the flag is driven
    // (phones: our first observation; desktop: after the shell's own first pass) it hands over
    let handed = false;
    const hand = () => { if (!handed) { handed = true; H.dataset.apiAsk = ''; } };
    const io = new IntersectionObserver((es) => { es.forEach((e) => (e.isIntersecting ? vis.add(e.target) : vis.delete(e.target))); apply(); if (mq.matches) hand(); });
    els.forEach((el) => io.observe(el));
    // the shared header code clears the flag when it (re)starts: put it back while our ask is still on screen (the /affiliate move)
    const mo = new MutationObserver(() => { if (mq.matches && vis.size && H.dataset.ask !== 'quiet') apply(); });
    mo.observe(H, { attributes: true, attributeFilter: ['data-ask'] });
    const timers = [[300, apply], [600, hand], [1400, apply]].map(([ms, fn]) => setTimeout(fn, ms));
    mq.addEventListener('change', apply);
    return () => { io.disconnect(); mo.disconnect(); timers.forEach(clearTimeout); mq.removeEventListener('change', apply); delete H.dataset.apiAsk; if (mine) delete H.dataset.ask; };
  }, []);
}

export default function ApiPage() {
  useOneSolidOnPhone();
  useEnter('main.api');
  return (
    <main className="av api">
      <Hero />
      <Paste />
      <Fits />
      <Base />
      <Table />
      <Next />
    </main>
  );
}
