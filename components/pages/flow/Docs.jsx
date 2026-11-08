'use client';
/* /docs/quickstart and /docs/cli: the two docs pages people reach on hanzo.ai itself. Zack's ask: an API-key call to
   action on both, and make sure the CLI page renders.
   Persona: a developer with a terminal open. Goal: a key, then a first call (quickstart) or the CLI installed and
   signed in (cli). One primary action on both: "Get an API key, free" (Hanzo's own words, /api), to Hanzo's console
   (lib/handoff.js API_KEYS_URL). The full docs stay on docs.hanzo.ai, linked from each page.
   Copy: headings, ledes, commands and code are Hanzo's own (/api, /cli, /models: "Your first request"). New lines: the
   step titles (Set your key, Install, Sign in, Start a session), Full docs, On this site, and the key card's two
   lines. Listed in the PR.
   Motion: the language tabs glide (kit Tabs); nothing else moves. */
import { useState } from 'react';
import { Cta, A, Tabs, TabPanel, CodeBlock } from '../../kit';
import { Stage } from './Flow';
import { API_KEYS_URL, DOCS_QUICKSTART_URL, DOCS_CLI_URL } from '../../../lib/handoff';

const CODE = [
  ['cURL', `curl https://api.hanzo.ai/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $HANZO_API_KEY" \\
  -d '{
    "model": "enso-auto",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`],
  ['Python', `from openai import OpenAI

client = OpenAI(
    api_key=os.environ["HANZO_API_KEY"],
    base_url="https://api.hanzo.ai/v1",
)

response = client.chat.completions.create(
    model="enso-auto",
    messages=[{"role": "user", "content": "Hello!"}],
)
print(response.choices[0].message.content)`],
  ['TypeScript', `import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.HANZO_API_KEY,
  baseURL: 'https://api.hanzo.ai/v1',
})

const response = await client.chat.completions.create({
  model: 'enso-auto',
  messages: [{ role: 'user', content: 'Hello!' }],
})
console.log(response.choices[0].message.content)`],
];

const PAGES = [['/docs/quickstart', 'Quickstart'], ['/docs/cli', 'CLI']];

function KeyCard({ id }) {
  return (
    <aside className="fl-key" aria-label="API key">
      <p className="fl-key-t">One key for every model</p>
      <p className="fl-key-d">Keys are created and revoked in the console.</p>
      <Cta to={API_KEYS_URL} kind="solid" size="lg" id={id} thumb className="fl-pay">Get an API key, free</Cta>
    </aside>
  );
}

function Shell({ here, full, children }) {
  return (
    <Stage className="fl-docs" label="Docs" lit="right">
      <div className="fl-docs-grid">
        <nav className="fl-docs-nav" aria-label="Docs">
          <p className="fl-kick">Docs</p>
          <ul>
            {PAGES.map(([to, t]) => <li key={to}><A to={to} aria-current={to === here ? 'page' : undefined}>{t}</A></li>)}
          </ul>
          <p className="fl-kick">Full docs</p>
          <ul>
            <li><A to={full}>docs.hanzo.ai ↗</A></li>
          </ul>
        </nav>
        <article className="fl-docs-main">{children}</article>
      </div>
    </Stage>
  );
}

const Step = ({ n, title, children }) => (
  <section className="fl-dstep">
    <span className="fl-dstep-n x-mono" aria-hidden="true">{String(n).padStart(2, '0')}</span>
    <div><h2>{title}</h2>{children}</div>
  </section>
);

export function Quickstart() {
  const [k, setK] = useState(0);
  return (
    <Shell here="/docs/quickstart" full={DOCS_QUICKSTART_URL}>
      <header className="fl-docs-h">
        <div>
          <h1 className="fl-h1 docs">Getting started</h1>
          <p className="fl-lede">An empty project to a first call that works.</p>
        </div>
        <KeyCard id="docs.quickstart.key" />
      </header>
      <Step n={1} title="Set your key">
        <CodeBlock code={'export HANZO_API_KEY=<your key>'} label="Shell" prompt />
      </Step>
      <Step n={2} title="Your first request">
        <Tabs id="fl-lang" tabs={CODE.map(([t]) => t)} value={k} onChange={setK} label="Language" size="sm" />
        {CODE.map(([t, c], i) => <TabPanel key={t} id="fl-lang" i={i} value={k}><CodeBlock code={c} label={t} /></TabPanel>)}
      </Step>
    </Shell>
  );
}

export function Cli() {
  return (
    <Shell here="/docs/cli" full={DOCS_CLI_URL}>
      <header className="fl-docs-h">
        <div>
          <h1 className="fl-h1 docs">An AI engineer in your terminal</h1>
          <p className="fl-lede">Type hanzo in a repo and you get a coding session.</p>
        </div>
        <KeyCard id="docs.cli.key" />
      </header>
      <Step n={1} title="Install">
        <CodeBlock code={'curl -fsSL https://hanzo.sh | sh\nnpm i -g hanzo'} label="Install the CLI" prompt />
      </Step>
      <Step n={2} title="Sign in">
        <CodeBlock code={'# Sign in. Interactive picker, or name a provider.\nhanzo auth login'} label="Shell" prompt />
      </Step>
      <Step n={3} title="Start a session">
        <CodeBlock code={'# Bare hanzo IS a coding session in this repo\nhanzo\n\n# ...or hand it the task and let it run headless\nhanzo "add rate limiting to the /v1/chat endpoint"'} label="Shell" prompt />
      </Step>
    </Shell>
  );
}
