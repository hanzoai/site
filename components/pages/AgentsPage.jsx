'use client';
// Persona: an agent, or the developer behind one, that must sign up and pay by itself (MASTER 1: machine agents).
// Goal: the headless sign-up. Metric: api_key_created (and the llms.txt fetch).
// CTA: "Sign up headless" -> #headless (hero, header ask bar, closing Band).
// Signature: the five steps as a numbered terminal; an agent signs itself up once, writing Hanzo's own requests, then rests.
// Beyond: agent.ts as a scene, each step bringing in its own lines and playing its request and answer once.
/* Hanzo for agents (MASTER 4.1: hero, the literal sequence at #headless as a numbered code block, one AgentPrompt, Band;
   a terminal demo with pause and a static final frame).
     1. The black room: Koma's film between the words and the terminal, feathered into the room, a gradient only under
        the words; the numbered terminal is a box of fixed height (the tallest step) so nothing moves while it plays.
        The h1 cuts in by CSS on the first paint (no wait for hydration); the run starts at 01 / 05.
     2. Install: Hanzo's first line writes itself once, large; the rest of its lines follow as quiet rows.
     3. Headless (#headless): agent.ts as a scene. Each step brings in its own lines, writes its requests and lands
        its answer, once. Pinned for about half a screen on desktop; unpinned and complete with JS off.
     4. The agent prompt streams into its card once, with a pause. 5. Questions. 6. Proof: figures already in the copy,
        counting once. 7. The Band, with the five ticks landing beside the ask.
   Motion mix (JAMES.md 9): time (the run, the install line, the prompt stream, the scene), arrival (h1 line mask),
   state (steps open, ticks land, answers rise), pointer (step previews, link underlines), scroll (the scene's pin only).
   Deck greys; colour only through Koma's film. Every word and line of code is Hanzo's. */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useMotionValueEvent, useScroll } from 'motion/react';
import { useDemo } from '../v2/AppDemo';
import { EASE, Copy, useCalm } from '../ui';
import { More, Faq, Film, Cta, Band, Stat } from '../kit';
import AppLines from '../v2/AppLines';
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
const STOP = Symbol('stop');

const useWide = () => {
  const [w, setW] = useState(false);
  useEffect(() => {
    const m = matchMedia('(min-width: 901px)');
    const f = () => setW(m.matches);
    f(); m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  return w;
};

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
function Req({ c, shown }) {
  const [verb, body] = split(c);
  const full = shown === undefined;
  const part = full ? body : body.slice(0, shown);
  return (
    <p className={'agt-req' + (full ? ' full' : '') + (!full && shown > 0 ? ' on' : '')}>
      <span className="x-sr">{c}</span>
      <span className="agt-req-g" aria-hidden="true"><b>{verb}</b> {body}</span>
      <span className="agt-req-t" aria-hidden="true"><b>{verb}</b> {part}</span>
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
              {CALLS[i].map((c, j) => <Req key={j} c={c} shown={shownOf(i, j, at, done, cur)} />)}
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
    <section className="v2a-sec agt-install" aria-labelledby="agt-in-h">
      <div className="v2a-wrap v2a-grid agt-install-in">
        <div className="agt-install-l">
          <AppLines as="h2" view id="agt-in-h" className="v2a-head" lines={['One command installs the whole stack']} />
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
    </section>
  );
}

/* A small highlighter for the script: comments, strings, keywords, numbers. */
const TOK = /(\/\/.*$)|('(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(import|from|const|await|new|as)\b|\b(\d+)\b/g;
function hl(line) {
  const out = [];
  let last = 0;
  line.replace(TOK, (m, c, s, k, n, i) => {
    if (i > last) out.push(line.slice(last, i));
    out.push(<span key={i} className={c ? 'c' : s ? 's' : k ? 'k' : 'n'}>{m}</span>);
    last = i + m.length;
    return m;
  });
  out.push(line.slice(last));
  return out;
}

/* 3. Hanzo's agent.ts as a scene. Each step brings in its own lines of the file, writes the requests it makes and lands
   its answer (the step's own line), once, then the next. It starts as soon as the stage is reached; on desktop the
   stage pins for about half a screen and scrolling on hurries the run to where you are, scrolling back shows a step
   again. The index jumps to a step. The server HTML is the finished run (JS off and reduced motion read it whole). */
function Script() {
  const lines = useMemo(() => SCRIPT.split('\n'), []);
  const chunks = useMemo(() => {
    const f = (p) => lines.findIndex((l) => l.startsWith(p));
    const s = [0, f('// 2.'), f('// 3.'), f('// 4.'), lines.length - 1];
    return s.map((a, i) => [a, i < LAST ? s[i + 1] - 1 : lines.length - 1]);
  }, [lines]);
  const wide = useWide();
  const calm = useCalm();
  const [live, setLive] = useState(false);
  const scrub = wide && !calm && live;
  // the finished run is the first frame (server, JS off, reduced motion)
  const [ln, setLn] = useState(lines.length - 1);
  const [view, setView] = useState(LAST);
  const [done, setDone] = useState(LAST);
  const [playing, setPlaying] = useState(-1);
  const [cur, setCur] = useState({ j: 99, k: 0 });
  const [state, setState] = useState('idle');
  const [band, setBand] = useState({ y: 0, h: 0 });
  const track = useRef(null);
  const stage = useRef(null);
  const code = useRef(null);
  const rows = useRef([]);
  const seen = useInView(stage, { amount: 0.35 });
  const r = useRef({ want: -1, played: -1, auto: true, paused: false, away: true, token: 0 });
  const [run, setRun] = useState(0);

  useEffect(() => { if (!still()) { setLive(true); setLn(-1); setView(0); setDone(-1); setCur({ j: 0, k: 0 }); } }, []);
  useEffect(() => { if (calm && live) { r.current.token++; setLive(false); setLn(lines.length - 1); setView(LAST); setDone(LAST); setPlaying(-1); setCur({ j: 99, k: 0 }); setState('idle'); } }, [calm, live, lines.length]);
  useEffect(() => { r.current.away = !seen; }, [seen]);
  const [go, setGo] = useState(false);
  useEffect(() => { if (seen && live) setGo(true); }, [seen, live]);

  // the runner: plays steps one after another, each once; a later want hurries the step in hand
  useEffect(() => {
    if (!go || !live) return;
    const s = r.current;
    const id = ++s.token;
    const sleep = (ms) => new Promise((ok, no) => {
      let left = ms, last = performance.now();
      const tick = () => {
        if (s.token !== id) { no(STOP); return; }
        const now = performance.now();
        if (!(s.paused || s.away || document.hidden)) left -= now - last;
        last = now;
        if (left <= 0) ok(); else setTimeout(tick, Math.min(left, 50));
      };
      setTimeout(tick, Math.min(ms, 50));
    });
    (async () => {
      try {
        setState('play');
        for (;;) {
          const target = s.auto ? LAST : s.want;
          if (s.played >= target) { if (s.played >= LAST || !s.auto) break; }
          const i = s.played + 1;
          if (i > LAST) break;
          const hurry = () => s.want > i;
          const [a, b] = chunks[i];
          setView(i); setPlaying(i); setCur({ j: 0, k: 0 });
          for (let l = a; l <= b; l++) { if (hurry()) { setLn(b); break; } setLn(l); await sleep(lines[l].trim() ? 34 : 12); }
          if (!hurry()) await sleep(220);
          for (const [j, c] of CALLS[i].entries()) {
            const len = split(c)[1].length;
            for (let k = 3; k < len && !hurry(); k += 3) { setCur({ j, k }); await sleep(14); }
            setCur({ j: j + 1, k: 0 });
            if (!hurry()) await sleep(160);
          }
          setDone(i); setPlaying(-1);
          s.played = i;
          if (!hurry() && i < LAST && s.auto) await sleep(900);
        }
        setState('done');
      } catch (e) { if (e !== STOP) throw e; }
    })();
    return () => { s.token++; };
  }, [go, live, run, chunks, lines]);

  const toggle = useCallback(() => {
    const s = r.current;
    if (state === 'done' || state === 'idle') {
      Object.assign(s, { want: -1, played: -1, auto: true, paused: false });
      setLn(-1); setView(0); setDone(-1); setCur({ j: 0, k: 0 }); setGo(true); setRun((v) => v + 1);
      return;
    }
    s.paused = !s.paused;
    setState(s.paused ? 'pause' : 'play');
  }, [state]);

  // desktop: the scroll through the pin chooses the step; ahead hurries the run, behind shows a finished step again
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!scrub) return;
    const s = r.current;
    const at = Math.max(0, Math.min(LAST, Math.floor(v * STEPS.length)));
    if (at > s.played) { s.want = Math.max(s.want, at); if (state === 'done' && go) { s.auto = true; setRun((x) => x + 1); } }
    else if (playing < 0) setView(at);
  });

  const jump = (i) => {
    const s = r.current;
    if (live) {
      if (i <= s.played) { if (playing < 0) setView(i); }
      else {
        // a step ahead of the run: the run hurries there and stops on it
        s.want = Math.max(s.want, i); s.auto = false;
        if (state === 'play' || state === 'pause') { s.paused = false; setState('play'); }
        else { setGo(true); setRun((v) => v + 1); }
      }
    } else setView(i);
    if (!scrub) return;
    const t = track.current;
    const top = t.getBoundingClientRect().top + scrollY;
    const y = top + ((i + 0.5) / STEPS.length) * (t.offsetHeight - innerHeight);
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.2 }); else scrollTo({ top: y, behavior: 'smooth' });
  };

  // phones: the index is a row of pills; the step on stage slides into its view (the row scrolls, never the page)
  const index = useRef(null);
  useEffect(() => {
    const ol = index.current, li = ol?.children[view];
    if (!ol || !li || ol.scrollWidth <= ol.clientWidth) return;
    ol.scrollTo({ left: Math.max(0, li.offsetLeft - 16), behavior: calm ? 'auto' : 'smooth' });
  }, [view, calm]);

  const [va, vb] = chunks[view];
  const mark = playing >= 0 ? Math.max(ln, va) : va;
  useEffect(() => {
    const row = rows.current[mark], c = code.current;
    if (!row || !c) return;
    const end = playing >= 0 ? row : rows.current[vb];
    setBand({ y: rows.current[playing >= 0 ? mark : va].offsetTop, h: playing >= 0 ? row.offsetHeight : end.offsetTop + end.offsetHeight - rows.current[va].offsetTop });
    const want = Math.max(0, row.offsetTop - c.clientHeight * 0.3);
    const far = Math.abs(c.scrollTop - want);
    if (far > 4) c.scrollTo({ top: want, behavior: calm || far > c.clientHeight * 1.5 ? 'auto' : 'smooth' });
  }, [mark, va, vb, playing, calm]);

  return (
    <section className="agt-script" id="headless" aria-labelledby="agt-sc-h">
      <div className="v2a-wrap agt-script-head">
        <AppLines as="h2" view id="agt-sc-h" className="v2a-head" lines={['The five steps, as one script']} />
        <p className="v2a-lede agt-sc-lede">Every step is one request. This file makes them all, as it was run against production.</p>
        <p className="v2a-folio">Headless</p>
      </div>
      <div className="agt-track" ref={track}>
        <div className="agt-pin">
          <div className="v2a-wrap agt-ed" ref={stage}>
            <ol className="agt-index" ref={index} aria-label="The five steps in the script">
              {STEPS.map(([t], i) => (
                <li key={t} className={(view === i ? 'on' : '') + (done >= i ? ' done' : '') + (playing === i ? ' run' : '')}>
                  <button type="button" onClick={() => jump(i)} aria-pressed={view === i}>
                    <span className="agt-ix-n x-mono">{String(i + 1).padStart(2, '0')}</span>
                    <span className="agt-ix-t">{t}</span>
                    <span className="agt-ix-ln x-mono" aria-hidden="true">{chunks[i][0] === chunks[i][1] ? chunks[i][0] + 1 : `${chunks[i][0] + 1}–${chunks[i][1] + 1}`}</span>
                    <svg className="agt-ix-ok" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </li>
              ))}
            </ol>
            <div className="agt-file">
              <div className="agt-file-bar">
                <span className="x-mono">agent.ts</span>
                <span className="agt-file-n x-mono" aria-hidden="true">{n2(view)}</span>
                <Ctl state={state} onClick={toggle} dark className="agt-file-ctl" />
                <Copy text={SCRIPT} />
              </div>
              <div className="agt-code" ref={code} tabIndex={0} role="region" aria-label="agent.ts" data-lenis-prevent={scrub ? undefined : ''}>
                <i className="agt-band" style={{ transform: `translateY(${band.y}px)`, height: band.h, opacity: ln >= 0 ? 1 : 0 }} aria-hidden="true" />
                <pre><code>
                  {lines.map((l, i) => (
                    <span key={i} ref={(el) => (rows.current[i] = el)} className={'agt-ln' + (i <= ln ? ' ran' : '') + (i >= va && i <= vb ? ' cur' : '')}>
                      <span className="agt-num" aria-hidden="true">{i + 1}</span>
                      <span className="agt-src">{l ? hl(l) : ' '}</span>
                      {'\n'}
                    </span>
                  ))}
                </code></pre>
              </div>
              {/* each step's requests and its answer, stacked in one cell sized by the tallest */}
              <div className="agt-resp">
                {STEPS.map(([t, d], i) => (
                  <div key={t} className={'agt-resp-b' + (view === i ? ' on' : '') + (done >= i ? ' done' : '')} aria-hidden={view !== i}>
                    <div className="agt-out x-mono">
                      {CALLS[i].map((c, j) => <Req key={j} c={c} shown={i <= done ? undefined : i !== playing ? 0 : j < cur.j ? undefined : j > cur.j ? 0 : cur.k} />)}
                    </div>
                    <p className="agt-resp-a"><span>{d}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="v2a-wrap"><p className="agt-note">Keep the wallet key and the API key in your secret store: the wallet is the account, and the API key is shown once. A deposit address lasts 24 hours and is credited when the chain confirms; send only the token and chain it names.</p></div>
    </section>
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
    <section className="v2a-sec agt-prompt" aria-labelledby="agt-pr-h">
      <div className="v2a-wrap v2a-grid agt-prompt-in">
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
    </section>
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

/* 5. Questions. */
function Questions() {
  return (
    <section className="v2a-sec agt-faq" aria-labelledby="agt-qa-h">
      <div className="v2a-wrap v2a-grid agt-faq-in">
        <div className="agt-faq-l"><h2 className="v2a-head" id="agt-qa-h">Questions</h2></div>
        <div className="agt-faq-r"><Faq items={QA} multi /></div>
      </div>
    </section>
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
    <section className="agt-proof">
      <div className="v2a-wrap">
        <ul className="agt-proof-row">
          {PROOF.map((p) => (
            <li key={p.v}><Stat value={p.v} note={p.pre || undefined} label={p.post} className="agt-fig" /></li>
          ))}
        </ul>
      </div>
    </section>
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
      <Install />
      <Script />
      <Prompt />
      <Questions />
      <Proof />
      <Band title="No human required." action="Sign up headless" to="#headless" note={<><Ticks /><Docs id="agents.close-docs" /></>} />
    </main>
  );
}
