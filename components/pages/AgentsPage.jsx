'use client';
// Persona: an agent, or the developer behind one, that must sign up and pay by itself (MASTER 1: machine agents).
// Goal: the headless sign-up. Metric: api_key_created (and the llms.txt fetch).
// CTA: "Sign up headless" -> #headless (hero, header ask bar, closing Band).
// Signature: the five steps as a numbered terminal; an agent signs itself up once, writing Hanzo's own requests, then rests.
// Beyond: agent.ts run by your scroll, each of the five steps lighting and growing on the index as the run reaches it.
/* Hanzo for agents (MASTER 4.1: hero, the literal sequence at #headless as a numbered code block, one AgentPrompt, Band;
   a terminal demo with pause and a static final frame).
     1. The black room: Koma's own film on the left, played once and resting on its last frame, the headline over a
        gradient; on the right the numbered terminal, a box of fixed height so nothing on the page moves while it plays.
     2. Install: one command, large, then the rest of Hanzo's install lines as quiet rows (not another dark box).
     3. Headless (#headless): agent.ts pinned on desktop; the scroll moves the run; the step it reaches grows on the index.
     4. The agent prompt, one block. 5. Questions, then the Band.
   Motion mix (JAMES.md 9): time (the sign-up writes itself, the install rows), arrival (h1 line mask, terminal entry),
   state (steps open at 300 ms ease-emphasis, ticks land, the active step grows), pointer (step and index previews),
   scroll (agent.ts only). Deck greys; colour only through Koma's film. Every word and line of code is Hanzo's. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { useDemo, DemoCtl } from '../v2/AppDemo';
import { EASE, Copy } from '../ui';
import { A, More, Faq, Film, Cta, Band } from '../kit';
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
const n2 = (i) => String(i + 1).padStart(2, '0') + ' / 05';
// the requests each step makes, exactly as Hanzo's agent prompt spells them out
const CALLS = [
  ['GET https://hanzo.id/v1/iam/web3/nonce?chain=evm&address=<address>', 'POST https://hanzo.id/v1/iam/web3/verify', 'POST https://hanzo.id/v1/iam/oauth/token'],
  ['POST https://api.hanzo.ai/v1/account/keys {"name":"agent","type":"secret"}'],
  ['POST https://api.hanzo.ai/v1/chat/completions {"model":"zen-free"}', 'GET https://api.hanzo.ai/v1/billing/tier'],
  ['GET https://api.hanzo.ai/v1/billing/crypto/options', 'POST https://api.hanzo.ai/v1/billing/crypto/deposit {"chain":"base","token":"usdc","amountCents":2000}', 'GET https://api.hanzo.ai/v1/billing/crypto/deposit/<id>'],
  ['GET /v1/pricing'],
];
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

/* 1. The agent at work: the five steps as a numbered terminal. The server HTML holds the final frame (every request
   written, every step ticked); in view it clears and writes itself once, then rests. */
function Run() {
  const box = useRef(null);
  const reqs = useRef([]);
  const [at, setAt] = useState(STEPS.length - 1);
  const [done, setDone] = useState(STEPS.length - 1);
  const [peek, setPeek] = useState(null);
  const demo = useDemo(box, async (sleep) => {
    setPeek(null); setDone(-1); setAt(0);
    const all = reqs.current.flat().filter(Boolean);
    all.forEach((el) => { el.textContent = ''; el.parentElement.classList.remove('on'); });
    await sleep(400);
    for (let i = 0; i < STEPS.length; i++) {
      setAt(i);
      await sleep(420);
      for (const [j, text] of CALLS[i].entries()) {
        const el = reqs.current[i]?.[j];
        if (!el) continue;
        el.parentElement.classList.add('on');
        const body = text.slice(text.indexOf(' ') + 1); // the verb is its own <b>; write the rest
        for (let k = 1; k <= body.length; k += 2) { el.textContent = body.slice(0, k); await sleep(12); }
        el.textContent = body;
        await sleep(220);
      }
      await sleep(320);
      setDone(i);
    }
  }, { amount: 0.35 });
  const open = peek ?? at;
  return (
    <div className="agt-run" ref={box}>
      <div className="agt-run-h">
        <span className="agt-run-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="agt-run-k x-mono">For agents</span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={open} className="agt-run-n x-mono" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>{n2(open)}</motion.span>
        </AnimatePresence>
        <DemoCtl demo={demo} className="dark agt-ctl" />
      </div>
      <ol className="agt-steps" aria-label="Headless">
        {STEPS.map(([title], i) => (
          <li key={title} className={(i === open ? 'on' : '') + (i <= done ? ' done' : '')}>
            <button type="button" aria-pressed={i === open} aria-controls="agt-detail" onClick={() => setPeek(i)}>
              <span className="agt-step-n x-mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="agt-step-t">{title}</span>
              <svg className="agt-step-ok" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <span className="x-sr">{n2(i)}</span>
          </li>
        ))}
      </ol>
      {/* every step's line and requests stay in the HTML, stacked in one cell of fixed size: one shows, nothing moves */}
      <div className="agt-detail" id="agt-detail" aria-live="polite">
        {STEPS.map(([title, d], i) => (
          <div key={title} className={'agt-step-b' + (i === open ? ' on' : '')} aria-hidden={i !== open}>
            <p className="agt-step-d">{d}</p>
            <div className="agt-out x-mono">
              {CALLS[i].map((c, j) => {
                const [verb, ...rest] = c.split(' ');
                return <p key={j} className="agt-req on"><b>{verb}</b> <span ref={(el) => { (reqs.current[i] ||= [])[j] = el; }}>{rest.join(' ')}</span></p>;
              })}
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
          <AppLines as="h1" id="agt-h1" className="v2a-display agt-h1" lines={['Hanzo for agents:', 'free to start, pay as you go']} />
          <motion.p className="agt-lede" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>Sign up free with a wallet. Get an API key free. A small free allowance to try it. Top up in USDC or USDT over the API to raise your limits and pay as you go. No human required.</motion.p>
          <motion.div className="agt-acts" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.4 }}>
            <Cta to="#headless" id="agents.hero" thumb size="lg">Sign up headless</Cta>
            <Docs id="agents.docs" />
          </motion.div>
        </div>
        <motion.div className="agt-hero-run" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}>
          <Run />
        </motion.div>
      </div>
    </section>
  );
}

const Docs = ({ id }) => <Cta to="https://docs.hanzo.ai/docs/agents" kind="link" id={id}>Read the docs</Cta>;

/* 2. Install: Hanzo's first line large, with Copy; the rest of its lines as quiet rows that write themselves in, once. */
function Install() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  const calm = useReducedMotion();
  const lines = INSTALL.split('\n');
  const [first, ...rest] = lines;
  const [cmd0, note0] = first.split(/(?=#)/);
  const [shown, setShown] = useState(rest.length);
  useEffect(() => { if (!calm) setShown(0); }, [calm]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!seen || calm || shown >= rest.length) return;
    const tm = setTimeout(() => setShown((v) => v + 1), shown === 0 ? 400 : 160);
    return () => clearTimeout(tm);
  }, [seen, calm, shown, rest.length]);
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
            <code className="x-mono"><span aria-hidden="true" className="agt-one-p">$ </span>{cmd0.trim()}</code>
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

/* 3. Hanzo's agent.ts, run by your scroll: on desktop the file pins and the scroll moves the run down its lines,
   lighting each step on the index as it is reached. On phones (and for reduced motion) it plays by itself once. */
function Script() {
  const lines = useMemo(() => SCRIPT.split('\n'), []);
  const starts = useMemo(() => {
    const f = (p) => lines.findIndex((l) => l.startsWith(p));
    return [f('// 1.'), f('// 2.'), f('// 3.'), f('// 4.'), lines.length - 1];
  }, [lines]);
  const wide = useWide();
  const calm = useReducedMotion();
  const scrub = wide && !calm;
  const [ln, setLn] = useState(-1);
  const [band, setBand] = useState({ y: 0, h: 0 });
  const track = useRef(null);
  const box = useRef(null);
  const code = useRef(null);
  const rows = useRef([]);
  const seen = useInView(box, { amount: 0.35 });
  const step = starts.reduce((a, s, i) => (ln >= s ? i : a), -1);
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => { if (scrub) setLn(Math.min(lines.length - 1, Math.floor(Math.max(0, v) * 1.04 * lines.length) - 1)); });

  // reduced motion: the whole file is shown as run
  useEffect(() => { if (calm) setLn(lines.length - 1); }, [calm, lines.length]);
  // phones: the file plays itself once when it is reached
  const [play, setPlay] = useState(false);
  useEffect(() => { if (!scrub && seen && !calm && ln === -1) setPlay(true); }, [scrub, seen, calm, ln]);
  useEffect(() => {
    if (scrub || !play) return;
    if (ln >= lines.length - 1) { setPlay(false); return; }
    const t = setTimeout(() => setLn((v) => v + 1), starts.includes(ln) ? 700 : lines[ln]?.trim() ? 70 : 24);
    return () => clearTimeout(t);
  }, [scrub, play, ln, lines, starts]);

  useEffect(() => {
    const r = rows.current[Math.max(0, ln)], c = code.current;
    if (!r || !c) return;
    setBand({ y: r.offsetTop, h: r.offsetHeight });
    const want = Math.max(0, r.offsetTop - c.clientHeight * 0.4);
    if (scrub) c.scrollTop = want;
    else if (Math.abs(c.scrollTop - want) > 40) c.scrollTo({ top: want, behavior: calm ? 'auto' : 'smooth' });
  }, [ln, scrub, calm]);

  const jump = (i) => {
    if (!scrub) { setPlay(false); setLn(starts[i]); return; }
    const t = track.current;
    const top = t.getBoundingClientRect().top + scrollY;
    const y = top + ((starts[i] + 1.5) / (1.04 * lines.length)) * (t.offsetHeight - innerHeight);
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.2 }); else scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <section className="agt-script" id="headless" ref={box} aria-labelledby="agt-sc-h">
      <div className="v2a-wrap agt-script-head">
        <AppLines as="h2" view id="agt-sc-h" className="v2a-head" lines={['The five steps, as one script']} />
        <p className="v2a-lede agt-sc-lede">Every step is one request. This file makes them all, as it was run against production.</p>
        <p className="v2a-folio">Headless</p>
      </div>
      <div className="agt-track" ref={track}>
        <div className="agt-pin">
          <div className="v2a-wrap agt-ed">
            <ol className="agt-index" aria-label="The five steps in the script">
              {STEPS.map(([t], i) => (
                <li key={t} className={(step === i ? 'on' : '') + (step > i ? ' done' : '')}>
                  <button type="button" onClick={() => jump(i)}>
                    <span className="agt-ix-n x-mono">{String(i + 1).padStart(2, '0')}</span>
                    <span>{t}</span>
                    <svg className="agt-ix-ok" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </li>
              ))}
            </ol>
            <div className="agt-file">
              <div className="agt-file-bar"><span className="x-mono">agent.ts</span><Copy text={SCRIPT} /></div>
              <div className="agt-code" ref={code} data-lenis-prevent={scrub ? undefined : ''}>
                <i className="agt-band" style={{ transform: `translateY(${band.y}px)`, height: band.h, opacity: ln >= 0 ? 1 : 0 }} aria-hidden="true" />
                <pre><code>
                  {lines.map((l, i) => (
                    <span key={i} ref={(el) => (rows.current[i] = el)} className={'agt-ln' + (i <= ln ? ' ran' : '')}>
                      <span className="agt-num" aria-hidden="true">{i + 1}</span>
                      <span className="agt-src">{l ? hl(l) : ' '}</span>
                      {'\n'}
                    </span>
                  ))}
                </code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="v2a-wrap"><p className="agt-note">Keep the wallet key and the API key in your secret store: the wallet is the account, and the API key is shown once. A deposit address lasts 24 hours and is credited when the chain confirms; send only the token and chain it names.</p></div>
    </section>
  );
}

/* 4. The agent prompt, as one block an agent keeps: the whole of it, in a scroll region you can read with the keys. */
function Prompt() {
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
        <div className="agt-paper">
          <div className="agt-paper-bar"><span className="x-mono" id="agt-pr-l">Agent prompt</span><Copy text={PROMPT} /></div>
          <div className="agt-paper-body" tabIndex={0} role="region" aria-labelledby="agt-pr-l" data-lenis-prevent>
            <pre>{PROMPT}</pre>
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

export default function AgentsPage() {
  return (
    <main className="agt">
      <Hero />
      <Install />
      <Script />
      <Prompt />
      <Questions />
      <Band title="No human required." action="Sign up headless" to="#headless" note={<Docs id="agents.close-docs" />} />
    </main>
  );
}
