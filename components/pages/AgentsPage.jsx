'use client';
/* Hanzo for agents, v2 (VISION.md archetype A, Launch, in the developer key). One idea per screen:
     1. In the page's one dark room, over Koma's own film: "free to start, pay as you go", and beside it an agent
        signing itself up, live: it walks the five steps and writes each request as it makes it.
     2. Install: one command, and a block that keeps only the lines your path needs.
     3. Headless: Hanzo's agent.ts, run by your scroll; each of the five steps lights on the index as the run reaches it.
     4. The agent prompt to paste. 5. Questions, then the one action.
   Signature: the five steps as one running agent, each step lighting as the agent reaches it, its requests written
   out exactly as Hanzo's agent prompt spells them. Tap any step to read its requests.
   Supporting: headlines rise out of masks; the script is scrubbed by the scroll on desktop (it plays once on phones);
   the install block writes itself line by line.
   Beyond: "Who is installing?" Pick a person, a headless agent, the MCP tools or local inference, and the install block
   keeps only the lines that path needs (and copies only those); a headless agent is pointed at the wallet path instead.
   Accent: the amber of the running step. Every word and line of code is Hanzo's. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { EASE, Copy } from '../ui';
import { Go, More, Faq } from '../kit';
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

/* 1. The agent at work: it walks the five steps by itself, writing each request as it makes it. */
function Run() {
  const box = useRef(null);
  const outs = useRef([]);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const [at, setAt] = useState(0);
  const [done, setDone] = useState(-1);
  const [mine, setMine] = useState(false);

  useEffect(() => {
    if (mine || calm || !seen) return;
    let live = true;
    const sleep = (ms) => new Promise((ok, no) => setTimeout(() => (live ? ok() : no(STOP)), ms));
    const write = async (el, text) => {
      const d = document.createElement('p'); d.className = 'agt-req'; el.appendChild(d);
      const [verb, ...rest] = text.split(' ');
      const v = document.createElement('b'); v.textContent = verb; d.append(v, ' ');
      const t = document.createElement('span'); d.appendChild(t);
      const caret = document.createElement('i'); d.appendChild(caret);
      const body = rest.join(' ');
      for (let i = 1; i <= body.length; i += 2) { t.textContent = body.slice(0, i); await sleep(14); }
      t.textContent = body; caret.remove();
    };
    (async () => {
      try {
        while (live) {
          outs.current.forEach((o) => { if (o) o.textContent = ''; });
          setDone(-1);
          for (let i = 0; i < STEPS.length; i++) {
            setAt(i);
            await sleep(520);
            for (const c of CALLS[i]) { await write(outs.current[i], c); await sleep(260); }
            await sleep(500);
            setDone(i);
            await sleep(420);
          }
          await sleep(3400);
        }
      } catch (e) { if (e !== STOP) throw e; }
    })();
    return () => { live = false; };
  }, [mine, calm, seen]);

  // reduced motion: the run is shown finished, its last step open with its request
  useEffect(() => { if (calm) pick(STEPS.length - 1, true); }, [calm]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (i, still) => {
    if (!still) setMine(true);
    setAt(i); setDone(still ? i : i - 1);
    outs.current.forEach((o, j) => { if (o) o.textContent = ''; });
    const el = outs.current[i];
    if (el) CALLS[i].forEach((c) => { const d = document.createElement('p'); d.className = 'agt-req'; const [verb, ...rest] = c.split(' '); const v = document.createElement('b'); v.textContent = verb; d.append(v, ' ' + rest.join(' ')); el.appendChild(d); });
  };

  return (
    <div className="agt-run" ref={box}>
      <div className="agt-run-h">
        <span className="agt-run-k x-mono"><i aria-hidden="true" />Headless</span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={at} className="agt-run-n x-mono" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>{n2(at)}</motion.span>
        </AnimatePresence>
      </div>
      <div className="agt-rail" aria-hidden="true"><b style={{ transform: `scaleX(${(Math.max(done, at - 0.5) + 1) / 5})` }} /></div>
      <ol className="agt-steps" role="tablist" aria-label="The headless path">
        {STEPS.map(([t, d], i) => (
          <li key={t} className={(i === at ? 'on' : '') + (i <= done ? ' done' : '')}>
            <button type="button" role="tab" aria-selected={i === at} onClick={() => pick(i)}>
              <span className="agt-step-n x-mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="agt-step-t">{t}</span>
              <svg className="agt-step-ok" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <div className="agt-step-b">
              <div>
                <p className="agt-step-d">{d}</p>
                <div className="agt-out x-mono" ref={(el) => (outs.current[i] = el)} aria-hidden="true" />
              </div>
            </div>
            <span className="x-sr">{n2(i)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Hero() {
  const calm = useReducedMotion();
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.2 });
  const vid = useRef(null);
  useEffect(() => { const v = vid.current; if (!v) return; if (seen && !calm) v.play().catch(() => {}); else v.pause(); }, [seen, calm]);
  return (
    <section className="agt-hero" ref={box} data-room="dark" aria-labelledby="agt-h1" data-morph-target>
      <div className="agt-bg" aria-hidden="true">
        <img src="/models/koma.webp" alt="" />
        <video ref={vid} src="/models/koma.webm" muted loop playsInline preload="metadata" />
      </div>
      <div className="v2a-wrap v2a-grid agt-hero-in">
        <div className="agt-hero-copy">
          <p className="v2a-kick">For agents</p>
          <AppLines as="h1" id="agt-h1" className="v2a-display agt-h1" lines={['Hanzo for agents:', 'free to start, pay as you go']} soft={[1]} />
          <motion.p className="agt-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>Sign up free with a wallet. Get an API key free. A small free allowance to try it. Top up in USDC or USDT over the API to raise your limits and pay as you go. No human required.</motion.p>
          <motion.div className="agt-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}>
            <Go to="#headless" solid>Sign up headless</Go><i hidden data-thumb="Sign up headless" data-href="#headless" />
            <Go to="https://docs.hanzo.ai/docs/agents">Read the docs</Go>
          </motion.div>
        </div>
        <motion.div className="agt-hero-run" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}>
          <Run />
        </motion.div>
      </div>
    </section>
  );
}

/* Beyond: the install lines each path needs (indexes into INSTALL); a headless agent needs none of them */
const PATHS = [['A person', [0, 1, 2]], ['Headless agent', []], ['MCP tools', [3, 6, 7]], ['Local inference', [0, 4]]];
const HEADLESS = 'npm i @hanzo/ai viem   ·   node agent.ts';

/* 2. The install block writes itself, one command at a time, and keeps only the lines your path needs. */
function Install() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const calm = useReducedMotion();
  const lines = INSTALL.split('\n');
  const [shown, setShown] = useState(lines.length);
  const [path, setPath] = useState(-1);
  const keep = path < 0 ? null : PATHS[path][1];
  useEffect(() => { if (!calm) setShown(0); }, [calm]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!seen || calm || shown >= lines.length) return;
    const t = setTimeout(() => setShown((v) => v + 1), shown === 0 ? 300 : 380);
    return () => clearTimeout(t);
  }, [seen, calm, shown, lines.length]);
  return (
    <section className="v2a-sec agt-install" aria-labelledby="agt-in-h">
      <div className="v2a-wrap v2a-grid agt-install-in">
        <div className="agt-install-l">
          <p className="v2a-kick">Install</p>
          <AppLines as="h2" view id="agt-in-h" className="v2a-head agt-in-h" lines={['One command installs', 'the whole stack']} />
          <p className="v2a-body agt-in-lede">The CLI, the coding agent, the MCP server and the inference engine are native Rust binaries. npm installs a small launcher; each binary downloads, checksum-verified, the first time it runs. Any OS, Windows included.</p>
          <p className="agt-paths-k x-mono" id="agt-who">Who is installing?</p>
          <div className="agt-paths" role="group" aria-labelledby="agt-who">
            {PATHS.map(([t], i) => <button key={t} type="button" aria-pressed={path === i} onClick={() => setPath(path === i ? -1 : i)}>{t}</button>)}
          </div>
        </div>
        <div className="agt-install-r">
          <div className="agt-term" ref={ref}>
            <div className="agt-term-bar"><span aria-hidden="true"><i /><i /><i /></span><span className="x-mono">Install</span><Copy text={keep ? (keep.length ? keep.map((i) => lines[i]).join('\n') : HEADLESS) : INSTALL} /></div>
            <pre className="agt-term-body"><code>
              {lines.map((l, i) => {
                const [cmd, ...c] = l.split(/(?=#)/);
                return (
                  <span key={i} className={'agt-tl' + (i < shown ? ' on' : '') + (keep && !keep.includes(i) ? ' dim' : '')}>
                    {l.startsWith('#') ? <span className="agt-c">{l}</span> : <>{cmd && <span className="agt-cmd">{cmd}</span>}{c.length > 0 && <span className="agt-c">{c.join('')}</span>}</>}
                    {'\n'}
                  </span>
                );
              })}
            </code></pre>
          </div>
          {path === 1 && (
            <p className="agt-headless">No human required: sign up with a wallet, get a key, call the API, top up in USDC or USDT. <code>{HEADLESS}</code> <a href="#headless">Sign up headless</a></p>
          )}
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
        <p className="v2a-kick">Headless</p>
        <AppLines as="h2" view id="agt-sc-h" className="v2a-display md" lines={['The five steps,', 'as one script']} soft={[1]} />
        <p className="v2a-lede agt-sc-lede">Every step is one request. This file makes them all, as it was run against production.</p>
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
              <div className="agt-file-bar"><span className="x-mono">agent.ts</span><span className="agt-file-ln x-mono" aria-hidden="true">{Math.max(0, ln) + 1} / {lines.length}</span><Copy text={SCRIPT} /></div>
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

/* 4. The agent prompt, as a page an agent keeps: folded, and opened to its full length on request. */
function Prompt() {
  const [open, setOpen] = useState(false);
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
        <div className={'agt-paper' + (open ? ' open' : '')}>
          <div className="agt-paper-bar"><span className="x-mono">Agent prompt</span><Copy text={PROMPT} /></div>
          <div className="agt-paper-body">
            <pre>{PROMPT}</pre>
          </div>
          <button type="button" className="agt-more" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Fold' : 'Show all'}</button>
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

/* 5. Questions, then the one action. */
function Questions() {
  return (
    <section className="v2a-sec agt-faq" aria-labelledby="agt-qa-h">
      <div className="v2a-wrap v2a-grid agt-faq-in">
        <div className="agt-faq-l"><h2 className="v2a-head" id="agt-qa-h">Questions</h2></div>
        <div className="agt-faq-r"><Faq items={QA} /></div>
      </div>
      <div className="v2a-wrap agt-end">
        <p className="agt-end-t">No human required.</p>
        <div className="agt-end-acts"><Go to="#headless" solid>Sign up headless</Go><Go to="https://docs.hanzo.ai/docs/agents">Read the docs</Go></div>
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
    </main>
  );
}
