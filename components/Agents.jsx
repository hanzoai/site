'use client';
/* Home, the agents (v2). One idea: every agent you already use works with Hanzo. The agents stand as a wall that
   swells toward the pointer like a dock; the detail lives in one console you open by tab: start with the CLI, or let
   your agent sign itself up with no human in the loop. */
import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { Arrow, Copy, Mark } from './ui';
import { Tabs, TabPanel } from './kit';
import C from '../content';
import { SCRIPT } from '../lib/script';
import SetupMenu from './SetupMenu';
import Lines from './v2/Lines';

/* Every agent Hanzo works with, as a still wall of their own marks; pointing at (or focusing) one names it. */
function Ico({ a }) {
  return (
    <li>
      <a href={a.href} className="hv-ico" data-name={a.name} aria-label={a.name + ' docs'}>
        <span dangerouslySetInnerHTML={{ __html: a.icon }} />
      </a>
    </li>
  );
}

function Cmd({ bin, rest, copy }) {
  return (
    <div className="hv-cmd x-mono">
      <span className="x-dim">$</span>
      <span className="hv-cmd-t"><b>{bin}</b> {rest}</span>
      <Copy text={copy} />
    </div>
  );
}

const STEPS = [
  ['Sign up with a wallet', 'POST hanzo.id/v1/iam/web3/verify'],
  ['Get an API key', 'POST /v1/account/keys'],
  ['Use AI', 'POST /v1/chat/completions'],
  ['Top up in USDC or Card', 'POST /v1/billing/crypto/deposit · hanzo.ai/pay'],
];

// a few colours for the script, in the page's own words: comments, strings, keywords
const TOK = /(\/\/.*|`[^`]*`|'[^']*'|\b(?:const|await|new)\b)/;
function Code({ text }) {
  return text.split('\n').map((ln, i) => (
    <span className="x-code-l" key={i} style={{ '--i': i }}>
      {ln.split(TOK).map((t, k) => (k % 2 ? <span key={k} className={t[0] === '/' ? 'c' : /^[`']/.test(t) ? 's' : 'k'}>{t}</span> : t))}
    </span>
  ));
}

/* The agent's own sign-up, four calls. The active endpoint types itself; left alone, it walks all four steps. */
function Steps({ open }) {
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.5 });
  const calm = useReducedMotion();
  const [on, setOn] = useState(0);
  const [mine, setMine] = useState(false);
  const [code, setCode] = useState(false);
  const typed = useRef(null);
  useEffect(() => {
    const full = STEPS[on][1], el = typed.current;
    if (!el) return;
    if (calm || !open) { el.textContent = full; return; }
    let i = 0;
    el.textContent = '';
    const t = setInterval(() => { i++; el.textContent = full.slice(0, i); if (i >= full.length) clearInterval(t); }, 24);
    return () => clearInterval(t);
  }, [on, calm, open]);
  useEffect(() => {
    if (mine || !seen || calm || !open) return;
    const t = setTimeout(() => setOn((v) => (v + 1) % 4), 3200);
    return () => clearTimeout(t);
  }, [on, mine, seen, calm, open]);
  return (
    <div className="hv-steps" ref={ref}>
      <p className="hv-con-k">No human required</p>
      <ol className="hv-step-list">
        {STEPS.map(([t, e], i) => (
          <li key={t}>
            <button type="button" aria-pressed={on === i} onClick={() => { setMine(true); setOn(i); }}>
              <span className={'hv-step-n' + (i <= on ? ' done' : '')}>{i + 1}</span>
              <span className="hv-step-t"><b>{t}</b><span className="x-mono">{e}</span></span>
            </button>
          </li>
        ))}
      </ol>
      <div className="hv-script x-mono" aria-live="polite">
        <span className="x-dim">step {on + 1}/4 ›</span> <span ref={typed} /><span className="x-caret" aria-hidden="true" />
      </div>
      <button type="button" className="x-code-t hv-code-t" aria-expanded={code} aria-controls="agent-script" onClick={() => { setMine(true); setCode((c) => !c); }}>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5.5 4 2 8l3.5 4M10.5 4 14 8l-3.5 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span className="x-code-lbl">
          <span aria-hidden={code} data-on={!code}>{`Show step ${on + 1} of the script`}</span>
          <span aria-hidden={!code} data-on={code}>{`Hide step ${on + 1} of the script`}</span>
        </span>
      </button>
      {/* every step's script is in the page; the open one shows */}
      <div className="x-code hv-code" id="agent-script" data-open={code} inert={!code}>
        <div className="x-code-in">
          {SCRIPT.map((c, i) => (
            <pre className="x-code-blk x-mono" key={i} hidden={on !== i} tabIndex={0} aria-label={`Script for step ${i + 1}`}><code><Code text={c} /></code></pre>
          ))}
        </div>
      </div>
      <div className="hv-con-f">
        <Copy text={SCRIPT[on]} label="Copy this step" />
        <Copy text={SCRIPT.join('\n\n')} label="Copy the whole script" />
      </div>
      <div className="hv-con-links">
        <a className="hv-btn solid" href="/agents#headless">Start as an agent</a>
        <a className="hv-btn" href="https://hanzo.ai/llms.txt">Read llms.txt</a>
      </div>
    </div>
  );
}

export default function Agents() {
  const [tab, setTab] = useState(0);
  return (
    <section className="hv-agents v2-sec" id="compatible" aria-labelledby="compatible-h">
      <div className="v2-wrap">
        <header className="hv-head v2-grid">
          <Lines as="h2" id="compatible-h" className="hv-h2 hv-head-t" lines={['Works with every agent, bot and CLI tool.']} />
          <div className="hv-head-r">
            <p className="hv-lead">Claude Code, Codex, Cursor and the rest, every model behind one key. Or let your agent sign itself up.</p>
          </div>
        </header>
        <ul className="hv-wall">
          {C.agents.map((a) => <Ico key={a.name} a={a} />)}
        </ul>
        <div className="hv-ag-grid v2-grid">
          <div className="hv-ag-side">
            <div className="hv-links col">
              <Arrow href="https://docs.hanzo.ai/docs/guides/coding">Integration guides</Arrow>
              <Arrow href="https://docs.hanzo.ai/docs/guides/migrate/coding-agents">Migrate &amp; conventions map</Arrow>
              <Arrow href="https://docs.hanzo.ai/docs/mcp">Hanzo MCP</Arrow>
              <Arrow href="https://github.com/hanzoai">Hanzo OSS</Arrow>
            </div>
          </div>
          <div className="hv-console v2-object">
            <span className="hv-con-mark" aria-hidden="true"><Mark size={14} /></span>
            <Tabs id="hv-con" tabs={['Hanzo.Start', 'Hanzo.Agents']} value={tab} onChange={setTab} label="Works with every agent, bot and CLI tool." className="hv-con-tabs" />
            <TabPanel id="hv-con" i={0} value={tab} className="hv-pan">
              <p className="hv-con-k">Install the Hanzo CLI</p>
              <Cmd bin="curl" rest="-fsSL https://hanzo.sh | sh" copy="curl -fsSL https://hanzo.sh | sh" />
              <div className="hv-or2"><span>or</span></div>
              <Cmd bin="npm" rest="i -g hanzo" copy="npm i -g hanzo" />
              <p className="hv-con-k">Accelerate Claude Code with Hanzo</p>
              <Cmd bin="hanzo" rest="dev --claude" copy="hanzo dev --claude" />
              <p className="hv-con-k">Set up Codex, Cursor and more</p>
              <SetupMenu inline />
            </TabPanel>
            <TabPanel id="hv-con" i={1} value={tab} className="hv-pan">
              <Steps open={tab === 1} />
            </TabPanel>
          </div>
        </div>
      </div>
    </section>
  );
}
