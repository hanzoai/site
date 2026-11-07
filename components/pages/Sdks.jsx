'use client';
// Signature: peel the layers: the OpenAPI document, the generated Cloud SDK, the hand-written AI + Agents library and your application lift apart in 3D on the second screen and close again; drag across to peel it by hand, pick a layer and it rises out and explains itself.
// Beyond: the hero console flips one request OpenAI ⇄ Anthropic, re-typing only the lines that differ; pick your language and its install line, registry, docs and org line up in one place; and a Go import path you can type to find.
/* SDKs.
   V2: 8/10 code as the hero: the console flips OpenAI ⇄ Anthropic re-setting only the lines that differ and fits the phone column; the peel stack; the org rows draw in as the dark room opens; the flagship Python card leads with Node and Rust stacked beside it; the Go finder's idle typing lights its modules in the wall.
   Persona: a developer choosing a client library. Goal: call the API from their language. CTA: API reference (sdks.hero).
   Metric: cta_click on sdks.hero and sdks.close (data-cta; the event layer is the conductor's).
   SDKs. The first screen is the gateway's own request, written three ways and spoken two ways: the console flips
   between the OpenAI and Anthropic dialects by itself (until you take over), and only the lines that change between
   them are re-set, so the difference reads at a glance (base URL, header, max_tokens). Every sample is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, animate, useInView, useMotionValue, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { EASE, Copy } from '../ui';
import { A, Cta, More } from '../kit';
import A2Paste from '../v2/A2Paste';
import NoJs from '../NoJs';
import '../v2/A2.css';
import './Sdks.css';

/* The h1's line mask, a page-local copy of v2/A2Lines that reads reduced motion only after hydration (so the server
   and client markup match); with JS off the NoJs rule sets every line in place. */
function H1Lines({ lines, id, className }) {
  const rm = useReducedMotion();
  const [calm, setCalm] = useState(false);
  useEffect(() => setCalm(!!rm), [rm]);
  return (
    <>
      <NoJs css={'.a2-ln-in{transform:none!important}.a2 [style*="opacity:0"]{opacity:1!important;transform:none!important}'} />
      <h1 className={className} id={id}>
        {lines.map((l, i) => (
          <span className="a2-ln" key={i}>
            <motion.span className="a2-ln-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={calm ? { duration: 0 } : { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}>{l}</motion.span>
            {i < lines.length - 1 ? ' ' : null}
          </span>
        ))}
      </h1>
    </>
  );
}

/* A section head in the v2 grammar. */
function Head({ kicker, title, lede, id, dark }) {
  return (
    <header className={'xsd-head' + (dark ? ' dark' : '')}>
      <p className="a2-kick">{kicker}</p>
      <h2 id={id} className="a2-display s">{title}</h2>
      {lede && <p className="a2-lede">{lede}</p>}
    </header>
  );
}

const LANGS = [['python', '🐍', 'Python'], ['typescript', '📘', 'TypeScript'], ['curl', '🔗', 'cURL']];
const DIALECTS = {
  openai: {
    name: 'OpenAI', title: 'Use the OpenAI SDK', line: 'POST /v1/chat/completions — identical request/response to OpenAI Chat Completions.', url: 'POST https://api.hanzo.ai/v1/chat/completions',
    python: ['Point the official OpenAI SDK at the Hanzo gateway.', `from openai import OpenAI

client = OpenAI(
    base_url="https://api.hanzo.ai/v1",
    api_key="hk-...",  # your Hanzo API key
)

resp = client.chat.completions.create(
    model="zen5",  # any model on the gateway
    messages=[{"role": "user", "content": "Hello!"}],
)
print(resp.choices[0].message.content)`],
    typescript: ['The OpenAI JS SDK — just change baseURL.', `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.hanzo.ai/v1",
  apiKey: "hk-...",
});

const resp = await client.chat.completions.create({
  model: "zen5",
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(resp.choices[0].message.content);`],
    curl: ['OpenAI-style: Authorization: Bearer.', `curl https://api.hanzo.ai/v1/chat/completions \\
  -H "Authorization: Bearer $HANZO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "zen5",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`],
  },
  anthropic: {
    name: 'Anthropic', title: 'Use the Anthropic SDK', line: 'POST /v1/messages — the native Anthropic Messages API, x-api-key auth and content-block responses.', url: 'POST https://api.hanzo.ai/v1/messages',
    python: ['Point the official Anthropic SDK at the Hanzo gateway.', `from anthropic import Anthropic

client = Anthropic(
    base_url="https://api.hanzo.ai",
    api_key="hk-...",  # sent as the x-api-key header
)

msg = client.messages.create(
    model="zen5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}],
)
print(msg.content[0].text)`],
    typescript: ['The Anthropic JS SDK — just change baseURL.', `import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  baseURL: "https://api.hanzo.ai",
  apiKey: "hk-...",
});

const msg = await client.messages.create({
  model: "zen5",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(msg.content[0].text);`],
    curl: ['Anthropic-style: /v1/messages, x-api-key header.', `curl https://api.hanzo.ai/v1/messages \\
  -H "x-api-key: $HANZO_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "zen5",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`],
  },
};
const PROMPT = 'Read https://hanzo.ai/skill.md and use Hanzo SDKs in my project.';
const D = 'https://docs.hanzo.ai/docs/sdks';
// [name, registry, install, package, package link, docs]
const OFFICIAL = [
  ['Python', 'PyPI', 'pip install hanzoai', 'hanzoai', 'https://pypi.org/project/hanzoai/', D + '/python'],
  ['Go', 'Go Modules', 'go get github.com/hanzoai/go-sdk', 'github.com/hanzoai/go-sdk', 'https://pkg.go.dev/github.com/hanzoai/go-sdk', D + '/go'],
  ['TypeScript', 'npm', 'npm install @hanzo/sdk', '@hanzo/sdk', 'https://www.npmjs.com/package/@hanzo/sdk', null],
  ['Rust', 'crates.io', 'cargo add hanzo', 'hanzo', 'https://crates.io/crates/hanzo', D + '/rust'],
  ['Swift', 'SwiftPM', '.package(url: "https://github.com/hanzo-swift/sdk")', 'hanzo-swift/sdk', 'https://github.com/hanzo-swift', D + '/swift'],
  ['Kotlin', 'JitPack', 'implementation("com.github.hanzo-kt:sdk:v8.0.0")', 'hanzo-kt/sdk', 'https://github.com/hanzo-kt/sdk', D + '/kotlin'],
];
// [language, flagship, org, install, sdk repo, docs repo, ai library]
const ORGS = [
  ['Python', true, 'hanzo-py', 'pip install hanzoai', 'hanzo-py/sdk', 'hanzoai/python-sdk', 'hanzo'],
  ['Go', false, 'hanzo-go', 'go get github.com/hanzoai/go-sdk', 'hanzo-go/sdk', 'hanzoai/go-sdk', null],
  ['TypeScript', false, 'hanzo-js', 'npm install @hanzo/sdk', 'hanzo-js/sdk', 'hanzoai/js-sdk', '@hanzo/ai'],
  ['Rust', false, 'hanzo-rs', 'cargo add hanzo', 'hanzo-rs/sdk', 'hanzoai/rust-sdk', 'hanzo'],
  ['Swift', false, 'hanzo-swift', '.package(url: "https://github.com/hanzo-swift/sdk")', 'hanzo-swift/sdk', 'hanzoai/swift-sdk', null],
  ['Kotlin', false, 'hanzo-kt', 'implementation("com.github.hanzo-kt:sdk:v8.0.0")', 'hanzo-kt/sdk', 'hanzoai/kotlin-sdk', null],
];
const AI = [
  ['Python', 'hanzoai/python-sdk', 'pip install hanzo', 'Flagship — the most complete AI + agents library.'],
  ['Node', 'hanzo-js/ai', 'npm install @hanzo/ai', 'Models, agents, tools, memory, and MCP for TypeScript.'],
  ['Rust', 'hanzo-rs/sdk', 'cargo add hanzo', 'The AI + agents crate for Rust — crypto, DID, MCP, agents, embeddings, feature-gated.'],
];
const MODS = ['lz4/v4', 'openai', 'openrouter', 'sdk', 'sendgrid', 'age', 'agent', 'base-ha', 'builder', 'cd', 'cek', 'ci', 'cpy3', 'csqlite', 'dashscope-go-sdk', 'dashscopego', 'dbx', 'egress', 'finance', 'flags', 'framework', 'gochimp3', 'graph', 'grpc-web', 'ingress-parser', 'insights-go', 'kafka', 'kms-operator', 'livekit', 'log', 'ltx', 'namespace', 'notify', 'o11y-foundry', 'onnxgo', 'orm', 'otel-collector', 'pdf', 'proto', 'pubsub-go', 'replicate', 'search-go', 'sqlcipher', 'sqlite', 'sqlite-vec', 'tygoja', 'vfs', 'xorm', 'yaegi', 'zip'];

// a light pass of colour: comments and strings, nothing that could change the text
function Code({ text }) {
  return text.split(/("(?:[^"\\]|\\.)*"|#[^\n]*|\/\/[^\n]*)/).map((p, i) => (p.startsWith('"') ? <span key={i} className="xsd-s">{p}</span> : /^(#|\/\/)/.test(p) ? <span key={i} className="xsd-c">{p}</span> : p));
}

/* The console. A line that is the same in both dialects stays put; a line that differs is set again. */
function Console() {
  const [dia, setDia] = useState('openai');
  const [lang, setLang] = useState('python');
  const [mine, setMine] = useState(false);
  const prev = useRef({ dia: 'openai', lang: 'python' });
  const first = useRef(true);
  const calm = useReducedMotion();
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.4 });
  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setTimeout(() => setDia((d) => (d === 'openai' ? 'anthropic' : 'openai')), first.current ? 900 : 4200); // moving within a second
    first.current = false;
    return () => clearTimeout(t);
  }, [dia, mine, calm, seen]);
  const was = new Set(DIALECTS[prev.current.dia][prev.current.lang][1].split('\n')); // a line counts as changed only if the other dialect never says it
  useEffect(() => { prev.current = { dia, lang }; }, [dia, lang]);
  const D0 = DIALECTS[dia];
  const [cap, code] = D0[lang];
  const sameLang = prev.current.lang === lang;
  return (
    <div className="xsd-con" ref={ref}>
      <div className="xsd-con-top">
        <div className="xsd-dia" role="tablist" aria-label="Dialect">
          {Object.entries(DIALECTS).map(([k, v]) => (
            <button key={k} type="button" role="tab" aria-selected={dia === k} onClick={() => { setDia(k); setMine(true); }}>
              {dia === k && <motion.span layoutId="xsd-dia" className="xsd-dia-bg" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />}
              <span>{v.name}</span>
            </button>
          ))}
        </div>
        <div className="xsd-langs" role="tablist" aria-label="Language">
          {LANGS.map(([k, ic, l]) => (
            <button key={k} type="button" role="tab" aria-selected={lang === k} onClick={() => { setLang(k); setMine(true); }}>
              <span aria-hidden="true">{ic}</span>{l}
            </button>
          ))}
        </div>
      </div>
      <div className="xsd-url x-mono">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={D0.url} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>{D0.url}</motion.span>
        </AnimatePresence>
        <Copy text={code} />
      </div>
      <pre key={lang} className="xsd-pre"><code>
        {code.split('\n').map((l, i) => {
          const changed = sameLang && !was.has(l);
          return <span key={changed ? dia + lang + i : 'k' + lang + i + l} className={'xsd-l' + (changed ? ' chg' : '')} style={{ '--d': (i % 6) * 0.03 + 's' }}><Code text={l || ' '} />{'\n'}</span>;
        })}
      </code></pre>
      <p className="xsd-cap">{cap}</p>
    </div>
  );
}

function Hero() {
  return (
    <section className="xsd-hero" aria-labelledby="xsd-h1">
      {/* code first: the console takes the left of the first screen, the words sit beside it */}
      <div className="a2-wrap a2-grid xsd-first">
        <div className="xsd-words">
          <p className="a2-kick"><b>SDKs</b></p>
          <H1Lines id="xsd-h1" className="a2-display s xsd-h1" lines={['SDKs for', 'every language']} />
          <p className="a2-lede xsd-lede">A <b>full Cloud SDK</b> generated from the OpenAPI document the API itself serves, and a hand-written <b>AI + Agents</b> library.</p>
          <div className="x-row-links tight xsd-hero-links">
            <Cta to="https://docs.hanzo.ai/docs/openapi/" id="sdks.hero" thumb>API reference</Cta>
            <More to="https://github.com/hanzoai/sdk">hanzoai/sdk</More>
          </div>
          <p className="xsd-ex x-mono">Code Examples</p>
          <div className="xsd-dias">
            {Object.values(DIALECTS).map((v) => <div key={v.name}><b>{v.title}</b><span>{v.line}</span></div>)}
          </div>
        </div>
        <motion.div className="xsd-code-first" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}>
          <Console />
        </motion.div>
      </div>
      {/* every sample, in the page for search and find-in-page; the console shows one at a time */}
      <div className="x-sr" inert>{Object.values(DIALECTS).map((v) => LANGS.map(([k]) => <pre key={v.name + k}>{v[k][0]} {v[k][1]}</pre>))}</div>
    </section>
  );
}

/* The peel. Hanzo's stack, bottom to top: the OpenAPI document the API serves, the Cloud SDK generated from it, the
   hand-written AI + Agents library, and your application. It lifts apart into floating layers in 3D when it reaches
   the screen and closes again when it leaves; drag sideways across it (or swipe) to peel and close it by hand, and
   pick a layer to have it rise out of the stack and explain itself. */
const STACK = [
  { k: 'doc', name: 'OpenAPI', sub: 'operation ids', chips: ['models', 'agents', 'data', 'compute', 'network', 'security', 'platform', 'chain'] },
  { k: 'cloud', name: 'Full Cloud SDK', sub: 'hanzo-<lang>/sdk', glyph: '{ }', chips: ['Python', 'Go', 'TypeScript', 'Rust', 'Swift', 'Kotlin'] },
  { k: 'ai', name: 'AI + Agents', sub: 'hanzo · @hanzo/ai', glyph: '✦', chips: ['models', 'agents', 'tools', 'memory', 'MCP'] },
  { k: 'app', name: 'your application', sub: 'pip install hanzoai', chips: [] },
];
const PEEL_EASE = [0.4, 0, 0.2, 1];

function Peel() {
  const ref = useRef(null);
  const scene = useRef(null);
  const seen = useInView(ref, { amount: 0.45 });
  const rm = useReducedMotion();
  const [calm, setCalm] = useState(false); // read after hydration, so server and client markup match
  useEffect(() => setCalm(!!rm), [rm]);
  const o = useMotionValue(0);
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(1);
  const [mine, setMine] = useState(false); // the first touch takes over for good
  const [step, setStep] = useState(0);
  const grab = useRef(null);
  useMotionValueEvent(o, 'change', (v) => setOpen(v > 0.5));
  const to = (v, d = 0.9) => (calm ? o.set(v) : animate(o, v, { duration: d, ease: PEEL_EASE }));
  // the stack lifts apart as it reaches the screen and closes again as it leaves, until the visitor takes over
  useEffect(() => { if (calm) { o.set(1); return; } if (!mine) to(seen ? 1 : 0); }, [seen, calm, mine]); // eslint-disable-line react-hooks/exhaustive-deps
  // once open, it walks its layers once from the bottom up, each rising out of the stack in turn
  useEffect(() => {
    if (!seen || mine || calm || step >= STACK.length) return;
    const t = setTimeout(() => { setSel(step); setStep(step + 1); }, step ? 1700 : 1000);
    return () => clearTimeout(t);
  }, [seen, mine, calm, step]);
  const pick = (i) => { setMine(true); setSel(i); if (o.get() < 0.5) to(1, 0.5); };
  const down = (e) => { if (e.button) return; grab.current = { x: e.clientX, o: o.get(), moved: false }; };
  const move = (e) => {
    const g = grab.current;
    if (!g) return;
    const dx = e.clientX - g.x;
    if (!g.moved && Math.abs(dx) < 6) return;
    if (!g.moved) { g.moved = true; setMine(true); o.stop(); scene.current?.setPointerCapture?.(e.pointerId); }
    o.set(Math.min(1, Math.max(0, g.o + dx / (scene.current?.offsetWidth * 0.55 || 300))));
  };
  const up = (e) => {
    const g = grab.current;
    grab.current = null;
    if (!g) return;
    if (g.moved) { to(o.get() > 0.5 ? 1 : 0, 0.4); return; }
    const hit = e.target.closest?.('[data-layer]');
    if (hit) pick(+hit.dataset.layer);
  };
  return (
    <section className="xsd-peel" aria-label="The SDK stack" ref={ref}>
      <NoJs css=".xsd-peel-stack{--o:1!important}.xsd-say{grid-area:auto!important;visibility:visible!important;opacity:1!important;transform:none!important}.xsd-peel-says{gap:28px}.xsd-peel-bar{display:none}" />
      <div className="a2-wrap a2-grid xsd-peel-grid">
        <div className="xsd-peel-stage">
          <div className={'xsd-peel-scene' + (calm ? ' calm' : '')} ref={scene} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={() => { grab.current = null; }} aria-hidden="true">
            <motion.div className="xsd-peel-stack" style={{ '--o': o }}>
              {STACK.map((l, i) => (
                <div key={l.k} className={'xsd-plate p' + i + (sel === i ? ' on' : '')} style={{ '--i': i }} data-layer={i}>
                  <div className="xsd-plate-f">
                    <span className="xsd-plate-n x-mono">{String(i + 1).padStart(2, '0')}</span>
                    {l.chips.length > 0 && <span className="xsd-plate-c">{l.chips.map((c) => <em key={c}>{c}</em>)}</span>}
                    <span className="xsd-plate-s x-mono">{l.sub}</span>
                    <b>{l.glyph && <i>{l.glyph}</i>}{l.name}</b>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
          <div className="xsd-peel-bar">
            <button type="button" className="xsd-peel-tog" aria-pressed={open} onClick={() => { setMine(true); to(open ? 0 : 1, 0.6); }}>
              <span className="xsd-peel-ic" aria-hidden="true"><i /><i /><i /></span>{open ? 'Close the stack' : 'Lift the layers'}
            </button>
            <span className="xsd-peel-hint x-mono" aria-hidden="true">drag across ⇄</span>
          </div>
        </div>
        <div className="xsd-peel-side">
          <ol className="xsd-peel-list" aria-label="Layers, top to bottom">
            {STACK.map((l, i) => ({ l, i })).reverse().map(({ l, i }) => (
              <li key={l.k}>
                <button type="button" aria-pressed={sel === i} onClick={() => pick(i)} onPointerEnter={(e) => { if (e.pointerType === 'mouse') pick(i); }}>
                  <span className="x-mono">{String(i + 1).padStart(2, '0')}</span><b>{l.name}</b>
                </button>
              </li>
            ))}
          </ol>
          <div className="xsd-peel-says">
            <div className={'xsd-say' + (sel === 0 ? ' on' : '')}>
              <h2>OpenAPI</h2>
              <p>A <b>full Cloud SDK</b> generated from the OpenAPI document the API itself serves.</p>
              <More to="https://docs.hanzo.ai/docs/openapi/">API reference</More>
            </div>
            <div className={'xsd-say' + (sel === 1 ? ' on' : '')}>
              <h2>Full Cloud SDK</h2>
              <p>Generated from one document and never edited by hand, so every route is reachable the day it ships — models, agents, data, compute, network, security, platform and chain. Method and class names are the document&apos;s operation ids, which is what makes a client checkable against a release instead of against somebody&apos;s memory. Real code lives in <code>hanzo-&lt;lang&gt;/sdk</code>.</p>
            </div>
            <div className={'xsd-say' + (sel === 2 ? ' on' : '')}>
              <h2>AI + Agents</h2>
              <p>The hand-crafted flagship: models, agents, tools, memory, and MCP. Python <code>hanzo</code> is the most complete; Node ships <code>@hanzo/ai</code>. Distinct from the generated cloud SDK — this is the &quot;we love this language&quot; library.</p>
            </div>
            <div className={'xsd-say' + (sel === 3 ? ' on' : '')}>
              <h2>your application</h2>
              <p>Use our official SDKs to integrate Cloud into your application</p>
              <div className="xsd-cmd"><code>pip install hanzoai</code><Copy text="pip install hanzoai" /></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Official() {
  const [k, setK0] = useState(0);
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.4 });
  const calm = useReducedMotion();
  const [mine, setMine] = useState(false); // the first touch takes over for good
  const setK = (v) => { setMine(true); setK0(v); };
  // once on arrival the picker walks Hanzo's six languages by itself (one lap, then rests on the first)
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!seen || mine || calm) return;
    const t = setTimeout(() => { const i = step + 1; setStep(i); setK0(i % 6); if (i >= 6) setMine(true); }, 1400);
    return () => clearTimeout(t);
  }, [seen, mine, calm, step]);
  return (
    <section className="a2-sec xsd-off" aria-labelledby="xsd-off-h" ref={ref}>
      <div className="a2-wrap">
        <Head kicker="SDKs & Libraries" title="Official Cloud SDKs" lede="Use our official SDKs to integrate Cloud into your application" id="xsd-off-h" />
        <div className="xsd-pick">
          <div className="xsd-pick-l" role="tablist" aria-label="Language" aria-orientation="vertical">
            {OFFICIAL.map(([n], i) => (
              <button key={n} type="button" role="tab" id={'xsd-ot' + i} aria-controls={'xsd-op' + i} aria-selected={k === i} onClick={() => setK(i)} onKeyDown={(e) => { if (e.key === 'ArrowDown') setK((k + 1) % 6); if (e.key === 'ArrowUp') setK((k + 5) % 6); }} onPointerEnter={() => setMine(true)}>
                {k === i && <motion.span layoutId="xsd-pick" className="xsd-pick-bg" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />}
                <span>{n}</span>
              </button>
            ))}
          </div>
          <div className="xsd-pick-p">
            {OFFICIAL.map(([n, reg, cmd, pkg, link, docs], i) => (
              <div key={n} id={'xsd-op' + i} role="tabpanel" aria-labelledby={'xsd-ot' + i} hidden={k !== i}>
                <motion.div key={k === i ? 'on' : 'off'} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: EASE }}>
                  <h3>Hanzo {n} SDK</h3>
                  <p className="xsd-reg x-mono">{reg}</p>
                  <div className="xsd-cmd"><code>{cmd}</code><Copy text={cmd} /></div>
                  <div className="xsd-pkg">
                    <A to={link} className="xsd-pkg-a x-mono">{pkg}</A>
                    {docs && <More to={docs}>Docs</More>}
                  </div>
                  <p className="xsd-lives">Real code lives in <code>{ORGS[i][4]}</code>{ORGS[i][6] ? <>; its AI + Agents library is <code>{ORGS[i][6]}</code></> : null}.</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Orgs() {
  // the rows draw in one by one, top to bottom, as the dark room opens
  const tab = useRef(null);
  const seen = useInView(tab, { amount: 0.25, once: true });
  return (
    <section className="a2-sec a2-dark xsd-orgs" data-room="dark" aria-labelledby="xsd-orgs-h">
      <NoJs css=".xsd-table .xsd-tr{opacity:1!important;transform:none!important}" />
      <div className="a2-wrap">
        <Head dark kicker="Per-language orgs" title="A home for every ecosystem" lede="Each language has its own org holding the generated cloud SDK, an AI + agents library and the split-out packages. Every one of them ships the same six runnable examples — prove the key works, one completion, balance and usage, a store round-trip, create and run an agent, list the tools — so knowing one language's set is enough to navigate another's." id="xsd-orgs-h" />
        <div className={'xsd-table' + (seen ? ' in' : '')} ref={tab} role="table" aria-label="Per-language orgs">
          <div className="xsd-tr xsd-th" role="row">{['Language', 'Org', 'Install', 'sdk', 'docs', 'ai'].map((h) => <span key={h} role="columnheader">{h}</span>)}</div>
          {ORGS.map(([l, flag, org, cmd, sdk, docs, ai], i) => (
            <div key={l} className="xsd-row" style={{ '--i': i }}>
              <a href={'https://github.com/' + org} target="_blank" rel="noopener noreferrer" className="xsd-tr" role="row">
                <span role="cell" className="xsd-lang"><b>{l}</b>{flag && <em>Flagship</em>}<em className="ga">GA</em></span>
                <span role="cell" className="x-mono">{org}</span>
                <span role="cell" className="x-mono xsd-inst">{cmd}</span>
                <span role="cell" className="x-mono"><i>sdk</i>{sdk}</span>
                <span role="cell" className="x-mono"><i>docs</i>{docs}</span>
                <span role="cell" className="x-mono">{ai ? <><i>ai</i>{ai}</> : '—'}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Flagship() {
  return (
    <section className="a2-sec xsd-ai" aria-labelledby="xsd-ai-h">
      <div className="a2-wrap">
        <Head kicker="AI + Agents SDK" title="The flagship AI library" lede="Models, agents, tools, memory, and MCP — hand-crafted, not generated. Python leads; Rust and Node follow." id="xsd-ai-h" />
        <div className="xsd-ai-grid">
          {AI.map(([l, repo, cmd, d], i) => (
            <div key={l} className={'xsd-lib' + (i === 0 ? ' lead' : '')}>
              <div className="xsd-lib-top"><h3>{l}</h3><em>GA</em></div>
              <p className="x-mono xsd-repo">{repo}</p>
              <div className="xsd-cmd"><code>{cmd}</code><Copy text={cmd} /></div>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Go modules served at hanzo.ai: type an import path; idle, the field types module names by itself. */
function Mods() {
  const [q, setQ] = useState('');
  const [ghost, setGhost] = useState(''); // the word the field has just typed by itself: its modules light in the wall
  const ph = useRef(null);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  useEffect(() => {
    if (!seen || calm || q) return;
    let i = 0, c = 0, dir = 1, t = 0;
    const tick = () => {
      const w = MODS[i];
      c += dir;
      if (ph.current) ph.current.textContent = w.slice(0, c);
      if (c >= w.length) { dir = -1; setGhost(w); t = setTimeout(tick, 1100); return; }
      if (c <= 0) { dir = 1; i = (i + 7) % MODS.length; setGhost(''); }
      t = setTimeout(tick, dir > 0 ? 80 : 35);
    };
    t = setTimeout(tick, 400);
    return () => { clearTimeout(t); setGhost(''); };
  }, [seen, calm, q]);
  const shown = MODS.filter((m) => m.includes(q.trim().toLowerCase()));
  return (
    <section className="a2-sec xsd-mods" aria-labelledby="xsd-mods-h" ref={box}>
      <div className="a2-wrap">
        <Head kicker="Go modules" title="Served at hanzo.ai" lede="Each module has a page at its import path, with its source and its reference." id="xsd-mods-h" />
        <label className="xsd-find">
          <span className="x-mono">hanzo.ai/</span>
          <span className="xsd-find-f">
            <input type="text" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Find a Go module by its import path" autoComplete="off" spellCheck={false} />
            {!q && <span className="xsd-ph x-mono" aria-hidden="true"><span ref={ph} /><i /></span>}
          </span>
          <span className="xsd-find-n x-mono" aria-live="polite">{shown.length} / {MODS.length}</span>
        </label>
        <ul className={'xsd-modlist' + (ghost && !q ? ' ghost' : '')}>
          {MODS.map((m) => (
            <li key={m} hidden={!shown.includes(m)}><A to={'/' + m} className={'xsd-mod' + (ghost && !q && m.includes(ghost) ? ' lit' : '')}><span>hanzo.ai/</span>{m}</A></li>
          ))}
        </ul>
        {!shown.length && <p className="xsd-none">No module at that path.</p>}
        <div className="x-row-links"><A to="https://docs.hanzo.ai/docs/sdks" className="x-arrow"><span>SDKs docs →</span></A></div>
      </div>
    </section>
  );
}

/* The close: one line, one ask (ink on paper; the orgs are the page's one dark room). */
function Close() {
  return (
    <section className="a2-sec xsd-close" aria-label="API reference">
      <div className="a2-wrap xsd-close-in">
        <p className="a2-display xsd-close-h" aria-hidden="true">SDKs for every language</p>
        <div className="a2-acts"><Cta to="https://docs.hanzo.ai/docs/openapi/" id="sdks.close">API reference</Cta><A to="https://docs.hanzo.ai/docs/sdks" className="x-arrow"><span>SDKs docs →</span></A></div>
      </div>
    </section>
  );
}

export default function Sdks() {
  return (
    <main className="a2 xsd">
      <Hero />
      <Peel />
      <A2Paste name="SDKs" text={PROMPT} />
      <Official />
      <Orgs />
      <Flagship />
      <Mods />
      <Close />
    </main>
  );
}
