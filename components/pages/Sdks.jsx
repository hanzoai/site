'use client';
// Signature: one request in two dialects: flip OpenAI ⇄ Anthropic and only the lines that differ re-type, in Python, TypeScript or cURL.
// Beyond: pick your language and its install line, registry, docs and org line up in one place, ready to copy; and a Go import path you can type to find.
/* SDKs. The first screen is the gateway's own request, written three ways and spoken two ways: the console flips
   between the OpenAI and Anthropic dialects by itself (until you take over), and only the lines that change between
   them are re-set, so the difference reads at a glance (base URL, header, max_tokens). Every sample is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Rise, Copy } from '../ui';
import { A, More, SecHead } from '../kit';
import './Sdks.css';

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
  const calm = useReducedMotion();
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.4 });
  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setTimeout(() => setDia((d) => (d === 'openai' ? 'anthropic' : 'openai')), 4200);
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
              {dia === k && <motion.span layoutId="xsd-dia" className="xsd-dia-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
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
          <motion.span key={D0.url} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>{D0.url}</motion.span>
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
  const line = (t, d) => <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>;
  return (
    <section className="xsd-hero" aria-labelledby="xsd-h1">
      <div className="x-wrap xsd-grid">
        <div>
          <motion.p className="x-kick" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>SDKs</motion.p>
          <h1 id="xsd-h1" className="xsd-h1">{line('SDKs for', 0.05)}{line('every language', 0.16)}</h1>
          <motion.p className="xsd-lede" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>A <b>full Cloud SDK</b> generated from the OpenAPI document the API itself serves, and a hand-written <b>AI + Agents</b> library.</motion.p>
          <motion.div className="x-row-links tight xsd-hero-links" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
            <span data-thumb="API reference" data-href="https://docs.hanzo.ai/docs/openapi/"><More to="https://docs.hanzo.ai/docs/openapi/">API reference</More></span>
            <More to="https://github.com/hanzoai/sdk">hanzoai/sdk</More>
          </motion.div>
          <motion.p className="xsd-ex x-mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>Code Examples</motion.p>
          <div className="xsd-dias">
            {Object.values(DIALECTS).map((v) => <div key={v.name}><b>{v.title}</b><span>{v.line}</span></div>)}
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}><Console /></motion.div>
      </div>
      {/* every sample, in the page for search and find-in-page; the console shows one at a time */}
      <div className="x-sr">{Object.values(DIALECTS).map((v) => LANGS.map(([k]) => <pre key={v.name + k}>{v[k][0]} {v[k][1]}</pre>))}</div>
    </section>
  );
}

function Paste() {
  return (
    <section className="xsd-paste" aria-labelledby="xsd-paste-h">
      <div className="x-wrap">
        <div className="xsd-paste-in">
          <div><p id="xsd-paste-h" className="xsd-paste-k">Paste and ship</p><p>Paste this into any agent. It reads the skill manifest and calls SDKs from there.</p></div>
          <div className="xsd-prompt"><span className="x-mono xsd-prompt-k">Agent prompt</span><code>{PROMPT}</code><Copy text={PROMPT} /></div>
        </div>
      </div>
    </section>
  );
}

function Two() {
  return (
    <section className="x-sec xsd-two">
      <div className="x-wrap xsd-two-in">
        <div className="xsd-half">
          <span className="xsd-glyph" aria-hidden="true">{'{ }'}</span>
          <h2>Full Cloud SDK</h2>
          <p>Generated from one document and never edited by hand, so every route is reachable the day it ships — models, agents, data, compute, network, security, platform and chain. Method and class names are the document&apos;s operation ids, which is what makes a client checkable against a release instead of against somebody&apos;s memory. Real code lives in <code>hanzo-&lt;lang&gt;/sdk</code>.</p>
        </div>
        <div className="xsd-half dark">
          <span className="xsd-glyph" aria-hidden="true">✦</span>
          <h2>AI + Agents</h2>
          <p>The hand-crafted flagship: models, agents, tools, memory, and MCP. Python <code>hanzo</code> is the most complete; Node ships <code>@hanzo/ai</code>. Distinct from the generated cloud SDK — this is the &quot;we love this language&quot; library.</p>
        </div>
      </div>
    </section>
  );
}

function Official() {
  const [k, setK] = useState(0);
  return (
    <section className="x-sec xsd-off" aria-labelledby="xsd-off-h">
      <div className="x-wrap">
        <SecHead kicker="SDKs & Libraries" title="Official Cloud SDKs" lede="Use our official SDKs to integrate Cloud into your application" id="xsd-off-h" />
        <div className="xsd-pick">
          <div className="xsd-pick-l" role="tablist" aria-label="Language" aria-orientation="vertical">
            {OFFICIAL.map(([n], i) => (
              <button key={n} type="button" role="tab" id={'xsd-ot' + i} aria-controls={'xsd-op' + i} aria-selected={k === i} onClick={() => setK(i)} onKeyDown={(e) => { if (e.key === 'ArrowDown') setK((k + 1) % 6); if (e.key === 'ArrowUp') setK((k + 5) % 6); }}>
                {k === i && <motion.span layoutId="xsd-pick" className="xsd-pick-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
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
  return (
    <section className="x-sec xsd-orgs" data-room="dark" aria-labelledby="xsd-orgs-h">
      <div className="x-wrap">
        <SecHead dark kicker="Per-language orgs" title="A home for every ecosystem" lede="Each language has its own org holding the generated cloud SDK, an AI + agents library and the split-out packages. Every one of them ships the same six runnable examples — prove the key works, one completion, balance and usage, a store round-trip, create and run an agent, list the tools — so knowing one language's set is enough to navigate another's." id="xsd-orgs-h" />
        <div className="xsd-table" role="table" aria-label="Per-language orgs">
          <div className="xsd-tr xsd-th" role="row">{['Language', 'Org', 'Install', 'sdk', 'docs', 'ai'].map((h) => <span key={h} role="columnheader">{h}</span>)}</div>
          {ORGS.map(([l, flag, org, cmd, sdk, docs, ai], i) => (
            <Rise key={l} delay={i * 0.05} y={12}>
              <a href={'https://github.com/' + org} target="_blank" rel="noopener noreferrer" className="xsd-tr" role="row">
                <span role="cell" className="xsd-lang"><b>{l}</b>{flag && <em>Flagship</em>}<em className="ga">GA</em></span>
                <span role="cell" className="x-mono">{org}</span>
                <span role="cell" className="x-mono xsd-inst">{cmd}</span>
                <span role="cell" className="x-mono"><i>sdk</i>{sdk}</span>
                <span role="cell" className="x-mono"><i>docs</i>{docs}</span>
                <span role="cell" className="x-mono">{ai ? <><i>ai</i>{ai}</> : '—'}</span>
              </a>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

function Flagship() {
  return (
    <section className="x-sec xsd-ai" aria-labelledby="xsd-ai-h">
      <div className="x-wrap">
        <SecHead kicker="AI + Agents SDK" title="The flagship AI library" lede="Models, agents, tools, memory, and MCP — hand-crafted, not generated. Python leads; Rust and Node follow." id="xsd-ai-h" />
        <div className="xsd-ai-grid">
          {AI.map(([l, repo, cmd, d], i) => (
            <Rise key={l} delay={i * 0.08} className={'xsd-lib' + (i === 0 ? ' lead' : '')}>
              <div className="xsd-lib-top"><h3>{l}</h3><em>GA</em></div>
              <p className="x-mono xsd-repo">{repo}</p>
              <div className="xsd-cmd"><code>{cmd}</code><Copy text={cmd} /></div>
              <p>{d}</p>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Go modules served at hanzo.ai: type an import path; idle, the field types module names by itself. */
function Mods() {
  const [q, setQ] = useState('');
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
      if (c >= w.length) { dir = -1; t = setTimeout(tick, 1100); return; }
      if (c <= 0) { dir = 1; i = (i + 7) % MODS.length; }
      t = setTimeout(tick, dir > 0 ? 80 : 35);
    };
    t = setTimeout(tick, 400);
    return () => clearTimeout(t);
  }, [seen, calm, q]);
  const shown = MODS.filter((m) => m.includes(q.trim().toLowerCase()));
  return (
    <section className="x-sec xsd-mods" aria-labelledby="xsd-mods-h" ref={box}>
      <div className="x-wrap">
        <SecHead kicker="Go modules" title="Served at hanzo.ai" lede="Each module has a page at its import path, with its source and its reference." id="xsd-mods-h" />
        <label className="xsd-find">
          <span className="x-mono">hanzo.ai/</span>
          <span className="xsd-find-f">
            <input type="text" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Find a Go module by its import path" autoComplete="off" spellCheck={false} />
            {!q && <span className="xsd-ph x-mono" aria-hidden="true"><span ref={ph} /><i /></span>}
          </span>
          <span className="xsd-find-n x-mono" aria-live="polite">{shown.length} / {MODS.length}</span>
        </label>
        <ul className="xsd-modlist">
          {MODS.map((m) => (
            <li key={m} hidden={!shown.includes(m)}><A to={'/' + m} className="xsd-mod"><span>hanzo.ai/</span>{m}</A></li>
          ))}
        </ul>
        {!shown.length && <p className="xsd-none">No module at that path.</p>}
        <div className="x-row-links"><More to="https://docs.hanzo.ai/docs/sdks">SDKs docs →</More></div>
      </div>
    </section>
  );
}

export default function Sdks() {
  return (
    <main className="xsd">
      <Hero />
      <Paste />
      <Two />
      <Official />
      <Orgs />
      <Flagship />
      <Mods />
    </main>
  );
}
