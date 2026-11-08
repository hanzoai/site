'use client';
// Persona: an agent, or the developer behind one, that must sign up and pay by itself (MASTER 1: machine agents).
// Goal: the headless sign-up. Metric: api_key_created (and the llms.txt fetch).
// CTA: "Sign up headless" -> #headless (hero, header ask bar, closing Band).
// Signature (docs/MOTION-MAP.md `live-chat`): Questions as a live conversation; the visitor picks a question and Hanzo
// answers on screen, word by word, in the page's own words (scripted, never a live call).
/* Hanzo for agents (MASTER 4.1: hero, the literal sequence at #headless as a numbered code block, one AgentPrompt, Band;
   a terminal demo with pause and a static final frame). Nothing pins; the order is its own:
     1. The black room: Koma's film between the words and the terminal; the numbered terminal runs the five steps once.
        The h1 cuts in by CSS on the first paint (the page's one reveal style).
     2. Questions, as the live conversation (enters by squash-land).
     3. The agent prompt streams into its card once (enters by ripple).
     4. Headless (#headless): agent.ts as a plain numbered code block; a step in the index marks its lines
        (enters by venetian-type, line by line from alternating sides).
     5. Install: Hanzo's first line writes itself once, large (enters by grow-from-point).
     6. Proof: figures already in the copy, counting once (enters by stretch-scroll). 7. The Band, with the five ticks.
   Deck greys; colour only through Koma's film. Every word and line of code is Hanzo's. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useMotionValueEvent } from 'motion/react';
import { useDemo } from '../v2/AppDemo';
import { EASE, Copy, useCalm } from '../ui';
import { More, Film, Cta, Band, Stat } from '../kit';
import { Enter, ven } from './agents-index/entrances';
import LiveChat from './agents-index/LiveChat';
import '../v2/AppLines.css';
import './AgentsPage.css';

const INSTALL = "npm i -g hanzo              # any OS; or: curl -fsSL https://hanzo.sh | sh\nhanzo auth login            # a person approves once; headless agents use a key\nhanzo                       # a coding session in this repo (fetches the agent)\nhanzo mcp                   # the MCP server over stdio (fetched on first run)\nhanzo engine serve <model>  # local inference (fetched on first run)\n\n# Register the MCP server with nothing installed first:\nclaude mcp add --scope user hanzo -- npx -y hanzo mcp";
const SCRIPT = "// No human required: sign up with a wallet, get a key, call the API, top up in USDC or USDT.\n// A first-seen wallet gets its own Hanzo account and organization, with a small free allowance to try it.\n// npm i @hanzo/ai viem   ·   node agent.ts   (Node 22.18+; set HANZO_WALLET_KEY to use your own wallet)\nimport { Hanzo } from '@hanzo/ai'\nimport { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'\nimport { createHash, randomBytes } from 'node:crypto'\n\nconst ID = 'https://hanzo.id'\nconst API = 'https://api.hanzo.ai'\nconst CLIENT = 'hanzo-ai'\n\n// Your agent's own wallet, or a fresh one. The key never leaves this process.\nconst account = privateKeyToAccount((process.env.HANZO_WALLET_KEY as `0x${string}`) ?? generatePrivateKey())\n\n// 1. Sign up with a wallet: get a challenge, sign it, verify (POST /v1/iam/web3/verify), exchange for a token.\nconst nonce = await fetch(`${ID}/v1/iam/web3/nonce?chain=evm&address=${account.address}`).then((r) => r.json())\nconst message = [`${nonce.data.domain} wants you to sign in with your Ethereum account:`, account.address, '', ...(nonce.data.statement ? [nonce.data.statement, ''] : []), `URI: ${nonce.data.uri}`, `Version: ${nonce.data.version}`, `Nonce: ${nonce.data.nonce}`, `Issued At: ${nonce.data.issuedAt}`].join('\\n')\nconst signature = await account.signMessage({ message })\n\n// Verify the signed challenge: a first-seen wallet gets an account and an organization of its own.\nconst verifier = randomBytes(32).toString('base64url')\nconst challenge = createHash('sha256').update(verifier).digest('base64url')\nconst { data: code } = await fetch(`${ID}/v1/iam/web3/verify`, {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ clientId: CLIENT, chain: 'evm', scheme: 'secp256k1-eip191', address: account.address, message, signature, type: 'code', redirectUri: 'http://localhost:3000/callback', scope: 'openid profile email', codeChallenge: challenge, codeChallengeMethod: 'S256' }),\n}).then((r) => r.json())\n\nconst token = await fetch(`${ID}/v1/iam/oauth/token`, {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },\n  body: new URLSearchParams({ grant_type: 'authorization_code', client_id: CLIENT, code, code_verifier: verifier, redirect_uri: 'http://localhost:3000/callback' }),\n}).then((r) => r.json())\n\n// 2. Get an API key (POST /v1/account/keys) that outlives the token. Shown once.\nconst hanzo = new Hanzo({ apiKey: token.access_token, baseURL: API })\nconst { key } = await hanzo.account.keys.create({ name: 'agent', type: 'secret' })\n\n// 3. Use AI (POST /v1/chat/completions) with the Hanzo SDK — OpenAI-compatible, one line.\nconst client = new Hanzo({ apiKey: key, baseURL: API })\nconst chat = await client.chat.completions.create({\n  model: 'zen-free',\n  messages: [{ role: 'user', content: 'Reply with the single word: ready' }],\n})\nconsole.log('chat', chat.choices[0]?.message?.content, 'free left today:', chat.headers?.get?.('x-ratelimit-remaining'))\n\n// Or make a Kai decision — typed, calibrated, zero output tokens.\nconst decision = await client.decisions.create({\n  model: 'kai',\n  state: { ticket: 'The export button throws a 500 error since this morning.' },\n  questions: { team: { type: 'choice', instructions: 'Which team should handle this ticket?', criteria: { billing: 'charges, invoices, refunds', tech: 'bugs, errors, outages', other: 'anything else' } } },\n})\nconsole.log('decision', decision.answers, 'input tokens:', decision.usage.input_tokens, 'latency:', decision.latency_ms + 'ms')\n\n// 4. Top up in USDC or Card (POST /v1/billing/crypto/deposit · GET /v1/billing/crypto/options · GET /v1/billing/tier).\nconst deposit = await client.billing.crypto.deposit({ chain: 'base', token: 'usdc', amountCents: 500 })\nconsole.log('send to', deposit.depositAddress, 'then poll', `${API}/v1/billing/crypto/deposit/${deposit.id}`)\n\nconsole.log('HANZO_API_KEY=' + key.slice(0, 12) + '…  (store the whole key; it is shown once)')";
const PROMPT = "Hanzo (https://hanzo.ai) is the AI operating system for business: one API for every model, Kai decisions and agents, with one key. Building business software since 2014. Techstars '17.\n\nSign up free with a wallet. Get an API key free. A small free allowance to try it. Top up in USDC or USDT over the API to raise your limits and pay as you go. No human required.\n\nBase URL: https://api.hanzo.ai/v1 (chat completions in the OpenAI shape). Discover: GET https://api.hanzo.ai/v1 lists every capability, GET https://api.hanzo.ai/v1/<capability> its operations, and https://api.hanzo.ai/v1/openapi.json is the whole spec. No key needed for any of the three.\n\n1. Sign up with a wallet: GET https://hanzo.id/v1/iam/web3/nonce?chain=evm&address=<address>, sign the CAIP-122 message it describes with EIP-191 personal_sign, POST https://hanzo.id/v1/iam/web3/verify (clientId \"hanzo-ai\", chain \"evm\", scheme \"secp256k1-eip191\", type \"code\" with a PKCE challenge), then exchange the code at https://hanzo.id/v1/iam/oauth/token. A first-seen wallet gets its own account and organization. A Solana wallet asks with chain=solana, writes \"Solana account\" in the message, and sends chain \"solana\", scheme \"ed25519\" and its signature as base64, never base58.\n2. Get a key: POST https://api.hanzo.ai/v1/account/keys {\"name\":\"agent\",\"type\":\"secret\"} with that token. The key is shown once.\n3. Read your allowance: GET https://api.hanzo.ai/v1/billing/tier with the key says your plan, what it allows and what is left; GET https://api.hanzo.ai/v1/billing/plans lists every plan and price.\n4. Top up: GET https://api.hanzo.ai/v1/billing/crypto/options, then POST https://api.hanzo.ai/v1/billing/crypto/deposit {\"chain\":\"base\",\"token\":\"usdc\",\"amountCents\":2000}. Send that token on that chain to the address it returns, and GET https://api.hanzo.ai/v1/billing/crypto/deposit/<id> until it says succeeded.\n5. Call: POST https://api.hanzo.ai/v1/chat/completions {\"model\":\"zen-free\",\"messages\":[{\"role\":\"user\",\"content\":\"Hello\"}]} with Authorization: Bearer <key>.\n\nThe whole path as one TypeScript file: https://hanzo.ai/agents#headless. Every request spelled out: https://docs.hanzo.ai/docs/agents. Talk to people at Hanzo: https://cal.com/hanzo.\n\nTools: `npm i -g hanzo` installs the whole native stack on any OS: `hanzo` (the CLI), `hanzo dev` (the coding agent), `hanzo mcp` (the MCP server over stdio) and `hanzo engine serve <model>` (local inference), each binary fetched on first use. To give yourself the MCP tools without installing anything: `npx -y hanzo mcp`.\n\nSkills index: https://hanzoskills.com/llms.txt (install with `npx skills add https://hanzoskills.com/hanzo.md`). Hanzo Improvement Proposals: https://hips.hanzo.ai/llms.txt.";

const STEPS = [
  ['Sign up with a wallet', 'Sign a one-time challenge from hanzo.id. A first-seen wallet gets its own account and organization.'],
  ['Get a key', 'POST /v1/account/keys with that token. It is shown once.'],
  ['Make a first call', 'POST /v1/chat/completions. GET /v1/billing/tier says what the free allowance has left.'],
  ['Top up in USDC or USDT', 'POST /v1/billing/crypto/deposit returns the address to send to; the balance is credited when the chain confirms.'],
  ['Pay as you go', 'Each call is billed from your balance at its model’s rate in GET /v1/pricing.'],
];
const LAST = STEPS.length - 1;
const n2 = (i) => String(i + 1).padStart(2, '0') + ' / 05';
// the requests each step makes, exactly as Hanzo's agent prompt spells them out
const CALLS = [
  ['GET https://hanzo.id/v1/iam/web3/nonce?chain=evm&address=<address>', 'POST https://hanzo.id/v1/iam/web3/verify', 'POST https://hanzo.id/v1/iam/oauth/token'],
  ['POST https://api.hanzo.ai/v1/account/keys {"name":"agent","type":"secret"}'],
  ['POST https://api.hanzo.ai/v1/chat/completions {"model":"zen-free"}', 'GET https://api.hanzo.ai/v1/billing/tier'],
  ['GET https://api.hanzo.ai/v1/billing/crypto/options', 'POST https://api.hanzo.ai/v1/billing/crypto/deposit {"chain":"base","token":"usdc","amountCents":2000}', 'GET https://api.hanzo.ai/v1/billing/crypto/deposit/<id>'],
  ['GET /v1/pricing'],
];
const split = (c) => { const at = c.indexOf(' '); return [c.slice(0, at), c.slice(at + 1)]; };
const RM = '(prefers-reduced-motion: reduce)';
const still = () => typeof matchMedia === 'function' && matchMedia(RM).matches;

/* The demo control (the same 44px icon button and register labels as AppDemo's DemoCtl), drawn the same on the server
   and on the first client render, so reduced motion never makes the two disagree; it steps aside once mounted. */
const ICON = {
  pause: <path d="M5.5 3.5v9M10.5 3.5v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />,
  play: <path d="M5 3.2v9.6L12.6 8 5 3.2Z" fill="currentColor" />,
  replay: <path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
};
function Ctl({ state, onClick, dark, className = '' }) {
  const calm = useCalm();
  const done = state === 'done' || state === 'idle';
  const k = done ? 'replay' : state === 'pause' ? 'play' : 'pause';
  return (
    <button type="button" className={'v2a-demo-ctl agt-ctl ' + (dark ? 'dark ' : '') + className} onClick={onClick} aria-label={done ? 'Replay' : 'Pause'} aria-pressed={done ? undefined : state === 'pause'} hidden={calm || undefined}>
      <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">{ICON[k]}</svg>
    </button>
  );
}

/* A request line that writes itself: the whole line holds its place (so nothing grows), the written part lies over it. */
function Req({ c, shown, caret }) {
  const [verb, body] = split(c);
  const full = shown === undefined;
  const part = full ? body : body.slice(0, shown);
  return (
    <p className={'agt-req' + (full ? ' full' : '') + (!full && shown > 0 ? ' on' : '')}>
      <span className="x-sr">{c}</span>
      <span className="agt-req-g" aria-hidden="true"><b>{verb}</b> {body}</span>
      <span className="agt-req-t" aria-hidden="true"><b>{verb}</b> {part}{caret && <i className="agt-caret" />}</span>
    </p>
  );
}
// what a step's request j shows: undefined = all of it, a number = that many characters, 0 = not yet
const shownOf = (i, j, at, done, cur) => (i <= done || i < at ? undefined : i > at ? 0 : j < cur.j ? undefined : j > cur.j ? 0 : cur.k);

/* 1. The agent at work: the five steps as a numbered terminal. It starts at 01 / 05 and writes itself once, then rests.
   JS off shows the final frame (every step ticked, the last one open) by CSS. */
function Run() {
  const box = useRef(null);
  const [at, setAt] = useState(0);
  const [done, setDone] = useState(-1);
  const [cur, setCur] = useState({ j: 0, k: 0 });
  const from = useRef(0);
  const demo = useDemo(box, async (sleep) => {
    const f = from.current;
    from.current = 0;
    setDone(f - 1); setAt(f); setCur({ j: 0, k: 0 });
    await sleep(f ? 200 : 400);
    for (let i = f; i < STEPS.length; i++) {
      setAt(i); setCur({ j: 0, k: 0 });
      await sleep(420);
      for (const [j, c] of CALLS[i].entries()) {
        const len = split(c)[1].length;
        for (let k = 2; k < len; k += 2) { setCur({ j, k }); await sleep(12); }
        setCur({ j: j + 1, k: 0 });
        await sleep(220);
      }
      await sleep(320);
      setDone(i);
    }
  }, { amount: 0.35 });
  // reduced motion: the final frame, at once
  useEffect(() => { if (demo.calm) { setAt(LAST); setDone(LAST); setCur({ j: 99, k: 0 }); } }, [demo.calm]);
  // the cursor sits where the run is writing, and rests blinking after the open step's last request
  const caretAt = (i) => {
    const n = CALLS[i].length;
    if (i <= done || cur.j >= n) return n - 1;
    return cur.k > 0 ? cur.j : cur.j - 1;
  };
  // a step chosen by hand: the run goes on from there (the steps before it ticked, the ones after it not yet);
  // under reduced motion it simply opens that step
  const pick = (i) => {
    if (demo.calm) { setAt(i); setDone(i - 1); setCur({ j: 99, k: 0 }); return; }
    from.current = i; setAt(i); setDone(i - 1); setCur({ j: 0, k: 0 }); demo.replay();
  };
  return (
    <div className="agt-run" ref={box}>
      <div className="agt-run-h">
        <span className="agt-run-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="agt-run-k x-mono">For agents</span>
        <span className="agt-run-n x-mono" aria-hidden="true">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={at} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>{n2(at)}</motion.span>
          </AnimatePresence>
        </span>
        <span className="agt-run-nf x-mono" aria-hidden="true">{n2(LAST)}</span>
        <Ctl state={demo.state} onClick={demo.toggle} dark />
      </div>
      <ol className="agt-steps" aria-label="Headless">
        {STEPS.map(([title], i) => (
          <li key={title} className={(i === at ? 'on' : '') + (i <= done ? ' done' : '')}>
            <button type="button" aria-pressed={i === at} aria-controls="agt-detail" onClick={() => pick(i)}>
              <span className="agt-step-n x-mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="agt-step-t">{title}</span>
              <svg className="agt-step-ok" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <span className="x-sr">{n2(i)}</span>
          </li>
        ))}
      </ol>
      {/* every step's line and requests stay in the HTML, stacked in one cell sized by the tallest: one shows, nothing moves */}
      <div className="agt-detail" id="agt-detail">
        {STEPS.map(([title, d], i) => (
          <div key={title} className={'agt-step-b' + (i === at ? ' on' : '')} aria-hidden={i !== at}>
            <p className="agt-step-d">{d}</p>
            <div className="agt-out x-mono">
              {CALLS[i].map((c, j) => <Req key={j} c={c} shown={shownOf(i, j, at, done, cur)} caret={i === at && j === caretAt(i)} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="agt-hero" data-room="dark" aria-labelledby="agt-h1" data-morph-target data-ask-name="For agents">
      <div className="agt-bg" aria-hidden="true">
        <Film src="/models/koma.webm" poster="/models/koma.webp" w={1200} h={1500} loop={false} className="agt-film" />
      </div>
      <div className="v2a-wrap v2a-grid agt-hero-in">
        <div className="agt-hero-copy">
          {/* the same line masks as AppLines, run by CSS so the words are there on the first paint */}
          <h1 className="v2a-lines v2a-display agt-h1" id="agt-h1">
            <span className="v2a-line"><span className="v2a-line-in agt-cut">Hanzo for agents:</span></span>{' '}
            <span className="v2a-line"><span className="v2a-line-in agt-cut" style={{ '--i': 1 }}>free to start, pay as you go</span></span>
          </h1>
          <p className="agt-lede agt-rise">Sign up free with a wallet. Get an API key free. A small free allowance to try it. Top up in USDC or USDT over the API to raise your limits and pay as you go. No human required.</p>
          <div className="agt-acts agt-rise" style={{ '--d': '.36s' }}>
            <Cta to="#headless" id="agents.hero" thumb size="lg">Sign up headless</Cta>
            <Docs id="agents.docs" />
          </div>
        </div>
        <div className="agt-hero-run agt-rise" style={{ '--d': '.2s', '--y': '24px' }}>
          <Run />
        </div>
      </div>
    </section>
  );
}

const Docs = ({ id }) => <Cta to="https://docs.hanzo.ai/docs/agents" kind="link" id={id}>Read the docs</Cta>;

/* 2. Install: Hanzo's first line writes itself once, large, with Copy; then the rest of its lines arrive as quiet rows. */
function Install() {
  const ref = useRef(null);
  const lines = INSTALL.split('\n');
  const [first, ...rest] = lines;
  const [cmd0, note0] = first.split(/(?=#)/);
  const cmd = cmd0.trim();
  const [k, setK] = useState(cmd.length);
  const [shown, setShown] = useState(rest.length);
  const [writing, setWriting] = useState(false);
  // the server HTML has every line; a moving browser rewinds them before they are reached (this sits below the fold)
  useEffect(() => { if (!still()) { setK(0); setShown(0); } }, []);
  useDemo(ref, async (sleep) => {
    setK(0); setShown(0); setWriting(true);
    await sleep(300);
    for (let i = 1; i <= cmd.length; i++) { setK(i); await sleep(i === 3 || i === 6 || i === 9 ? 140 : 70); }
    await sleep(260);
    setWriting(false);
    for (let r = 1; r <= rest.length; r++) { setShown(r); await sleep(r === 1 ? 300 : 150); }
  }, { amount: 0.4 });
  return (
    <Enter as="section" move="grow-from-point" className="v2a-sec agt-install" aria-labelledby="agt-in-h">
      <div className="v2a-wrap v2a-grid agt-install-in agx-g">
        <div className="agt-install-l">
          <h2 className="v2a-head" id="agt-in-h">One command installs the whole stack</h2>
          <p className="v2a-folio">Install</p>
          <p className="v2a-body agt-in-lede">The CLI, the coding agent, the MCP server and the inference engine are native Rust binaries. npm installs a small launcher; each binary downloads, checksum-verified, the first time it runs. Any OS, Windows included.</p>
        </div>
        <div className="agt-install-r" ref={ref}>
          <div className="agt-one">
            <code className="x-mono">
              <span aria-hidden="true" className="agt-one-p">$ </span>
              <span className="agt-one-c">
                <span className="agt-one-g">{cmd}</span>
                <span className="agt-one-t" aria-hidden="true">{cmd.slice(0, k)}{writing && <i className="agt-caret" />}</span>
              </span>
            </code>
            <Copy text={INSTALL} />
          </div>
          <p className="agt-one-n x-mono">{note0}</p>
          <pre className="x-sr">{INSTALL}</pre>
          <ul className="agt-rows x-mono" aria-hidden="true">
            {rest.map((l, i) => {
              if (!l.trim()) return <li key={i} className="agt-gap" aria-hidden="true" />;
              const [c, ...n] = l.split(/(?=#)/);
              return (
                <li key={i} className={'agt-row' + (i < shown ? ' on' : '')}>
                  {l.startsWith('#') ? <span className="agt-c">{l}</span> : <><span className="agt-cmd">{c.trim()}</span>{n.length > 0 && <span className="agt-c">{n.join('')}</span>}</>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Enter>
  );
}

/* A small highlighter for the script: comments, strings, keywords, numbers. */
const TOK = /(\/\/.*$)|('(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(import|from|const|await|new|as)\b|\b(\d+)\b/g;
function hl(line) {
  const out = [];
  let last = 0;
  line.replace(TOK, (m, c, s, k, n, i) => {
    if (i > last) out.push(<span key={'p' + i}>{line.slice(last, i)}</span>); // plain runs are spans too (one text run each)
    out.push(<span key={i} className={c ? 'c' : s ? 's' : k ? 'k' : 'n'}>{m}</span>);
    last = i + m.length;
    return m;
  });
  if (last < line.length) out.push(<span key="end">{line.slice(last)}</span>);
  return out;
}

/* 4. Hanzo's agent.ts as a plain numbered code block (no pin, no scrub). The index marks a step's lines in the file
   and shows the requests it makes and its answer. It enters by venetian-type: each line of type slides in from
   alternating sides. JS off lists every step's requests and answer under the file. */
function Script() {
  const lines = useMemo(() => SCRIPT.split('\n'), []);
  const chunks = useMemo(() => {
    const f = (p) => lines.findIndex((l) => l.startsWith(p));
    const s = [0, f('// 2.'), f('// 3.'), f('// 4.'), lines.length - 1];
    return s.map((a, i) => [a, i < LAST ? s[i + 1] - 1 : lines.length - 1]);
  }, [lines]);
  const calm = useCalm();
  const [view, setView] = useState(0);
  const [band, setBand] = useState(null);
  const code = useRef(null);
  const rows = useRef([]);
  const [va, vb] = chunks[view];

  useEffect(() => {
    const a = rows.current[va], b = rows.current[vb];
    if (a && b) setBand({ y: a.offsetTop, h: b.offsetTop + b.offsetHeight - a.offsetTop });
  }, [va, vb]);

  const jump = (i) => {
    setView(i); setTyp({ j: 0, k: 0 });
    const c = code.current, row = rows.current[chunks[i][0]];
    if (c && row) c.scrollTo({ top: Math.max(0, row.offsetTop - 18), behavior: calm ? 'auto' : 'smooth' });
  };

  // the scene follows the scroll (no pin): as the file passes, each step takes the stage in turn; a click holds a
  // step until the scroll crosses into the next one
  const ed = useRef(null);
  const last = useRef(0);
  const { scrollYProgress } = useScroll({ target: ed, offset: ['start 0.7', 'end 0.4'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const i = Math.max(0, Math.min(LAST, Math.floor(p * STEPS.length)));
    if (i !== last.current) { last.current = i; jump(i); }
  });

  // the step's requests write themselves under the code, then its answer lands (the server HTML has them whole)
  const seen = useInView(ed, { once: true, amount: 0.3 });
  const [typ, setTyp] = useState({ j: 99, k: 0 });
  useEffect(() => { if (!still()) setTyp({ j: 0, k: 0 }); }, []);
  useEffect(() => {
    if (!seen || calm) { if (calm) setTyp({ j: 99, k: 0 }); return; }
    const calls = CALLS[view];
    let j = 0, k = 0, t;
    const tick = () => {
      k += 3;
      if (k >= split(calls[j])[1].length) { j += 1; k = 0; if (j >= calls.length) { setTyp({ j: 99, k: 0 }); return; } setTyp({ j, k }); t = setTimeout(tick, 160); return; }
      setTyp({ j, k }); t = setTimeout(tick, 14);
    };
    t = setTimeout(tick, 220);
    return () => clearTimeout(t);
  }, [view, seen, calm]);
  const typed = typ.j >= 99;

  // phones: the index is a row of pills; the chosen step slides into its view (the row scrolls, never the page)
  const index = useRef(null);
  useEffect(() => {
    const ol = index.current, li = ol?.children[view];
    if (!ol || !li || ol.scrollWidth <= ol.clientWidth) return;
    ol.scrollTo({ left: Math.max(0, li.offsetLeft - 16), behavior: calm ? 'auto' : 'smooth' });
  }, [view, calm]);

  return (
    <Enter as="section" move="venetian-type" className="agt-script" id="headless" aria-labelledby="agt-sc-h">
      <div className="v2a-wrap agt-script-head">
        <h2 className="v2a-head agx-v" id="agt-sc-h" style={ven(0, 90)}>The five steps, as one script</h2>
        <p className="v2a-lede agt-sc-lede agx-v" style={ven(1, 90)}>Every step is one request. This file makes them all, as it was run against production.</p>
        <p className="v2a-folio agx-v" style={ven(2, 90)}>Headless</p>
      </div>
      <div className="v2a-wrap agt-ed" ref={ed}>
        <ol className="agt-index" ref={index} aria-label="The five steps in the script">
          {STEPS.map(([t], i) => (
            <li key={t} className={'agx-v' + (view === i ? ' on' : '')} style={ven(i + 3, 70)}>
              <button type="button" onClick={() => jump(i)} aria-pressed={view === i} aria-controls="agt-resp">
                <span className="agt-ix-n x-mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="agt-ix-t">{t}</span>
                <span className="agt-ix-ln x-mono" aria-hidden="true">{chunks[i][0] === chunks[i][1] ? chunks[i][0] + 1 : `${chunks[i][0] + 1}–${chunks[i][1] + 1}`}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="agt-file">
          <div className="agt-file-bar">
            <span className="x-mono">agent.ts</span>
            <span className="agt-file-n x-mono" aria-hidden="true">{n2(view)}</span>
            <Copy text={SCRIPT} />
          </div>
          <div className="agt-code" ref={code} tabIndex={0} role="region" aria-label="agent.ts" data-lenis-prevent>
            <i className="agt-band" style={band ? { transform: `translateY(${band.y}px)`, height: band.h, opacity: 1 } : { opacity: 0 }} aria-hidden="true" />
            <pre><code>
              {lines.map((l, i) => (
                <span key={i} ref={(el) => (rows.current[i] = el)} className={'agt-ln agx-v' + (i >= va && i <= vb ? ' cur' : '')} style={ven(i + 4, 26, 24)}>
                  <span className="agt-num" aria-hidden="true">{i + 1}</span>
                  <span className="agt-src">{l ? hl(l) : ' '}</span>
                  {'\n'}
                </span>
              ))}
            </code></pre>
          </div>
          {/* each step's requests and its answer, stacked in one cell sized by the tallest */}
          <div className="agt-resp" id="agt-resp">
            {STEPS.map(([t, d], i) => (
              <div key={t} className={'agt-resp-b' + (view === i ? ' on' : '') + (view !== i || typed ? ' ok' : '')} aria-hidden={view !== i}>
                <div className="agt-out x-mono">
                  {CALLS[i].map((c, j) => <Req key={j} c={c} shown={view !== i || typed || j < typ.j ? undefined : j > typ.j ? 0 : typ.k} caret={view === i && !typed && j === typ.j} />)}
                </div>
                <p className="agt-resp-a">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="v2a-wrap"><p className="agt-note agx-v" style={ven(9, 90)}>Keep the wallet key and the API key in your secret store: the wallet is the account, and the API key is shown once. A deposit address lasts 24 hours and is credited when the chain confirms; send only the token and chain it names.</p></div>
    </Enter>
  );
}

/* 4. The agent prompt, as one block an agent keeps: it streams into its card once (with a pause), then rests whole in
   a scroll region you can read with the keys. Copy always copies all of it. */
function Prompt() {
  const paper = useRef(null);
  const body = useRef(null);
  const caret = useRef(null);
  const follow = useRef(true);
  const [n, setN] = useState(PROMPT.length);
  useEffect(() => { if (!still()) setN(0); }, []);
  const demo = useDemo(paper, async (sleep) => {
    follow.current = true;
    setN(0);
    if (body.current) body.current.scrollTop = 0;
    await sleep(300);
    for (let i = 0; i < PROMPT.length;) {
      const nl = PROMPT.indexOf(' ', i + 12);
      i = nl < 0 ? PROMPT.length : nl + 1;
      setN(i);
      await sleep(PROMPT[i - 2] === '.' ? 90 : 26);
    }
  }, { amount: 0.4 });
  // the card follows the stream until the reader scrolls it themself
  useEffect(() => {
    const b = body.current, c = caret.current;
    if (!b || !c || !follow.current || n >= PROMPT.length || n === 0) return;
    const want = c.offsetTop - b.clientHeight * 0.6;
    if (want > b.scrollTop) b.scrollTop = want;
  }, [n]);
  const stop = () => { follow.current = false; };
  const streaming = n < PROMPT.length && demo.state !== 'done';
  return (
    <Enter as="section" move="ripple" className="v2a-sec agt-prompt" aria-labelledby="agt-pr-h">
      <span className="agx-rings" aria-hidden="true"><i /><i style={{ '--i': 1 }} /><i style={{ '--i': 2 }} /></span>
      <div className="v2a-wrap v2a-grid agt-prompt-in agx-rip">
        <div className="agt-prompt-l">
          <h2 className="v2a-head" id="agt-pr-h">Paste this into your agent</h2>
          <p className="v2a-body agt-pr-lede">What Hanzo is, the base URL, how to discover the API and the headless path, in one block an agent keeps in its context.</p>
          <div className="x-row-links tight agt-links">
            <More to="/agents/sdk">Agents SDK</More>
            <More to="/llms.txt">llms.txt</More>
            <More to="https://cal.com/hanzo">Book a call</More>
          </div>
        </div>
        <div className="agt-paper" ref={paper}>
          <div className="agt-paper-bar">
            <span className="x-mono" id="agt-pr-l">Agent prompt</span>
            <span className="agt-paper-acts">
              <Ctl state={demo.state} onClick={demo.toggle} />
              <Copy text={PROMPT} />
            </span>
          </div>
          <div className="agt-paper-body" ref={body} tabIndex={0} role="region" aria-labelledby="agt-pr-l" data-lenis-prevent onWheel={stop} onTouchStart={stop} onKeyDown={stop}>
            <pre>{PROMPT.slice(0, n)}<i ref={caret} className={'agt-caret' + (streaming && n > 0 ? '' : ' off')} aria-hidden="true" /><span className="agt-rest" aria-hidden="true">{PROMPT.slice(n)}</span></pre>
          </div>
        </div>
      </div>
    </Enter>
  );
}

const QA = [
  ['What is free?', 'Signing up, the API key and a small free allowance to try it. GET /v1/billing/tier, with your key, says what your account allows and what is left, and every answer carries X-RateLimit-Remaining. A person on the Free plan gets free model requests and Kai decisions; the request after the allowance answers 429 until its window resets.'],
  ['What does it cost after that?', 'You pay as you go from the balance you top up: each call is billed at its model’s rate in GET /v1/pricing. Kai is $0.021 per million input tokens, and its output is free. Plans for people start at $8 a month, and GET /v1/billing/plans lists every one.'],
  ['Can an agent sign up without a person?', 'Yes. With a wallet it needs no inbox and no person: it signs a one-time challenge from hanzo.id, a first-seen wallet gets its own account and organization, and it mints a key with the token it gets back. The whole flow is the script above. An agent with an inbox can sign up by email code instead, and one with neither has its person approve a device code once.'],
  ['How does an agent pay?', 'Over the API in stablecoins: GET /v1/billing/crypto/options lists the chains (today Base, Ethereum and Solana) and the tokens (USDC and USDT) the rail accepts, POST /v1/billing/crypto/deposit returns the address to send to, and GET /v1/billing/crypto/deposit/{id} says when it is credited. Cards, Apple Pay and Google Pay go through the checkout at hanzo.ai/pay, which needs a browser.'],
  ['How do I keep an agent from overspending?', 'Give each agent its own key with a monthly budget in cents and a rate in requests a minute: past the budget a call answers 402, past the rate 429. A session can carry its own cap, set with POST /v1/agent/sessions/{id}/budget, and a session that reaches it pauses until the cap is raised.'],
  ['Which tools can my agent use?', 'The native Hanzo MCP server, over stdio from one line in Claude Code, Codex, Cursor and Zed: npx -y hanzo mcp. It carries the Kai decision tools beside files, shell, git, code search, the browser and the computer.'],
];

/* 2. Questions, as the live conversation (the signature): it lands by squash-land, window first, then the chips. */
function Questions() {
  return (
    <Enter as="section" move="squash-land" className="v2a-sec agt-ask" aria-labelledby="agt-qa-h">
      <LiveChat items={QA} head={<h2 className="v2a-head" id="agt-qa-h">Questions</h2>} />
    </Enter>
  );
}

/* 6. Proof (MASTER 4.1): one quiet row of figures this page already states, each counting once as it arrives.
   The words around each figure are the page's own (the run's counter, the script lede, the FAQ, the note). */
const PROOF = [
  { pre: '', v: '05 / 05', post: 'Every step is one request.' },
  { pre: 'Kai is', v: '$0.021', post: 'per million input tokens, and its output is free.' },
  { pre: 'A deposit address lasts', v: '24 hours', post: 'and is credited when the chain confirms' },
  { pre: 'Plans for people start at', v: '$8', post: 'a month' },
];
function Proof() {
  return (
    <Enter as="section" move="stretch-scroll" className="agt-proof">
      <div className="v2a-wrap">
        <ul className="agt-proof-row">
          {PROOF.map((p, i) => (
            <li key={p.v} className="agx-st" style={{ '--i': i }}><Stat value={p.v} note={p.pre || undefined} label={p.post} className="agt-fig" /></li>
          ))}
        </ul>
      </div>
    </Enter>
  );
}

/* 7. The Band's live thing: the five steps tick once more beside the ask as it arrives. */
function Ticks() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.8 });
  const [n, setN] = useState(STEPS.length);
  useEffect(() => { if (!still()) setN(0); }, []);
  useEffect(() => {
    if (!seen || n >= STEPS.length || still()) return;
    const t = setTimeout(() => setN((v) => v + 1), n === 0 ? 500 : 220);
    return () => clearTimeout(t);
  }, [seen, n]);
  return (
    <span className="agt-ticks" ref={ref} aria-hidden="true">
      {STEPS.map(([t], i) => (
        <i key={t} className={i < n ? 'on' : ''}>
          <svg viewBox="0 0 16 16" width="12" height="12"><path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </i>
      ))}
    </span>
  );
}

export default function AgentsPage() {
  return (
    <main className="agt">
      <Hero />
      <Questions />
      <Prompt />
      <Script />
      <Install />
      <Proof />
      <Band title="No human required." action="Sign up headless" to="#headless" note={<><Ticks /><Docs id="agents.close-docs" /></>} />
    </main>
  );
}
