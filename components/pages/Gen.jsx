'use client';
/* Gen. Signature: the agent is a flag. The hero is the harness itself: Gen's four rails (tools, models, sessions, fences)
   frame one agent, and the flag on the command line flips through every agent Gen runs, swapping it in place. Pick any of
   the 23 below and the harness swaps to it.
   Beyond: a command builder. Choose the agent and switch Gen's own rails on or off (--cloud, --model, --no-mcp, --no-link,
   --ask, --project-mcp); the exact gen command, and the same one as hanzo dev, is assembled to copy. Only Hanzo's flags.
   Every word and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Copy } from '../ui';
import { A, SecHead, Faq } from '../kit';
import Sigil from '../Sigil';
import './Gen.css';

const AGENTS = [
  ['Hanzo Dev', 'dev'], ['Claude Code', 'claude'], ['Codex', 'codex'], ['Cursor', 'cursor'], ['Antigravity', 'agy'], ['Gemini CLI', 'gemini'],
  ['OpenCode', 'opencode'], ['Kilo Code', 'kilo'], ['Crush', 'crush'], ['Pi', 'pi'], ['GitHub Copilot CLI', 'copilot'], ['Amp', 'amp'],
  ['Grok Build', 'grok'], ['Goose', 'goose'], ['Aider', 'aider'], ['Hermes Agent', 'hermes'], ['Cline', 'cline'], ['Continue CLI', 'continue'],
  ['Oh My Pi', 'omp'], ['Letta Code', 'letta'], ['Kode', 'kode'], ['OpenHands', 'openhands'], ['Open Interpreter', 'interpreter'],
];
const RAILS = [
  ['Tools', 'The Hanzo MCP toolset rides along on every agent that can take a server for one run.', '--no-mcp'],
  ['Models', 'Its model calls go to api.hanzo.ai, metered on your account, for an agent that can name another endpoint. Without the flag, an agent uses the account it is signed in to.', '--cloud --model'],
  ['Sessions', 'Signed in, a session is linked to your Hanzo account and streams to mission control as it runs, so it can be followed and picked back up.', '--resume --no-link'],
  ['Fences', 'Sessions are approved inside a sandbox; ask before each action instead. A repository’s own .mcp.json stays off until you trust it.', '--ask --project-mcp'],
];

/* A code block: each line is the command and its comment. */
function Code({ label = 'bash', lines }) {
  return (
    <div className="xgn-code">
      <div className="xgn-code-top"><span className="x-mono">{label}</span><Copy text={lines.map((l) => l[0]).join('\n')} /></div>
      <pre className="x-mono"><code>{lines.map(([c, n], i) => <span key={i} className="xgn-ln">{c}{n && <span className="xgn-cm">{'  '}{n}</span>}{'\n'}</span>)}</code></pre>
    </div>
  );
}

/* The harness: four rails around one agent; the flag flips through the agents by itself until you pick one. */
function Harness({ at, setAt, mine }) {
  const calm = useReducedMotion();
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setTimeout(() => setAt((at + 1) % AGENTS.length, false), 1700);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen, setAt]);
  const [name, flag] = AGENTS[at];
  return (
    <div className="xgn-harness" ref={box}>
      <div className="xgn-frame">
        {RAILS.map(([r], i) => <span key={r} className={'xgn-rail r' + i}><i />{r}</span>)}
        <span className="xgn-orbit" aria-hidden="true"><b /></span>
        <button type="button" className="xgn-core" onClick={() => setAt((at + 1) % AGENTS.length, true)} aria-label={`${name}, flag --${flag}. Next agent`}>
          <span className="xgn-core-k x-mono">gen runs</span>
          <span className="xgn-swap">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={name} className="xgn-name" initial={{ y: '70%', opacity: 0, rotateX: -50 }} animate={{ y: 0, opacity: 1, rotateX: 0 }} exit={{ y: '-70%', opacity: 0, rotateX: 50 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}>{name}</motion.span>
            </AnimatePresence>
          </span>
        </button>
      </div>
      <div className="xgn-cmd x-mono" aria-hidden="true">
        <span className="xgn-ps">$</span>gen
        <span className="xgn-flag">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={flag} initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -22, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>{flag === 'dev' ? '' : '--' + flag}</motion.span>
          </AnimatePresence>
        </span>
        <span className="xgn-cur" />
      </div>
      <p className="xgn-cap">{flag === 'dev' ? 'no agent named: Hanzo Dev' : `--${flag}: ${name}`}</p>
    </div>
  );
}

function Hero({ at, setAt, mine }) {
  const line = (t, d, c) => (
    <span className={'x-line ' + (c || '')}><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>
  );
  return (
    <section className="xgn-hero" aria-labelledby="xgn-h1">
      <div className="x-wrap xgn-hero-grid">
        <div>
          <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>Hanzo Gen · Self-upgrading harness</motion.p>
          <h1 id="xgn-h1" className="xgn-h1">{line('Recursive agent harness.', 0.05)}{line('Mod anything.', 0.18, 'xgn-soft')}</h1>
          <motion.p className="xgn-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>
            Gen is a recursively self-upgrading agentic harness that runs the coding agent you use — Hanzo Dev, Claude Code, Codex, and custom loops — with full hackability, MCP tools attached, and every session linked to your Hanzo account.
          </motion.p>
          <motion.div className="xgn-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}>
            <A to="https://platform.hanzo.ai/keys" className="x-btn solid" data-thumb="Get API key">Get API key</A>
            <A to="https://github.com/hanzoai/gen" className="x-btn">Explore GitHub examples →</A>
            <A to="https://docs.hanzo.ai/docs/coding" className="xgn-doc">Read the docs →</A>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}>
          <Harness at={at} setAt={setAt} mine={mine} />
        </motion.div>
      </div>
    </section>
  );
}

const SESSION = [
  ['curl -fsSL https://hanzo.sh | sh -s gen', null],
  ['gen', 'no agent named: Hanzo Dev'],
  ['gen --claude', 'Claude Code, with the Hanzo toolset attached'],
  ['gen --codex "add a test"', 'Codex, run headless on the task'],
  ['gen --claude --cloud', 'its model calls on Hanzo’s, metered on your account'],
];

/* The session types itself line by line, then starts again. */
function Session() {
  const [n, setN] = useState(SESSION.length); // the server shows every line
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  useEffect(() => { if (!calm) setN(0); }, [calm]);
  useEffect(() => {
    if (calm || !seen) return;
    const t = setTimeout(() => setN((v) => (v >= SESSION.length ? 0 : v + 1)), n >= SESSION.length ? 3200 : 1100);
    return () => clearTimeout(t);
  }, [n, seen, calm]);
  return (
    <div className="xgn-term" ref={box}>
      <div className="xgn-term-bar"><i /><i /><i /><span className="x-mono">terminal</span></div>
      <pre className="x-mono">
        {SESSION.map(([c, o], i) => (
          <motion.span key={c} className="xgn-tl" initial={false} animate={{ opacity: i < n ? 1 : 0, y: i < n ? 0 : 8 }} transition={{ duration: 0.45, ease: EASE }}>
            <span className="xgn-ps">$ </span>{c}{'\n'}{o && <span className="xgn-out">{o}{'\n'}</span>}
          </motion.span>
        ))}
        <span className="xgn-ps">$ </span><span className="xgn-cur" />
      </pre>
    </div>
  );
}

function Install() {
  return (
    <section className="x-sec xgn-install" id="install">
      <div className="x-wrap xgn-install-grid">
        <div>
          <SecHead kicker="Install" title="One line, then any agent." lede="Linux and macOS. hanzo.sh downloads gen’s native build and checks it: its checksum always, its provenance with a signed-in gh. Run it again to upgrade." />
          <div><Code lines={[['curl -fsSL https://hanzo.sh | sh -s gen', '# gen alone'], ['curl -fsSL https://hanzo.sh | sh', '# or every Hanzo tool, gen included']]} /></div>
          <div><Code lines={[['gen', '# Hanzo Dev, the default'], ['gen --claude', '# Claude Code; any agent is a flag'], ['gen --codex "add a test"', '# a task, run headless']]} /></div>
          <p className="xgn-note">Sign in once with the Hanzo CLI, <code>hanzo auth login</code>, and every session is linked to your account.</p>
          <div className="x-row-links tight xgn-rel">
            <A to="https://github.com/hanzoai/gen/releases/tag/v0.1.0" className="xgn-arrow">Latest release v0.1.0 →</A>
            <A to="https://github.com/hanzoai/gen/releases" className="xgn-arrow">Every build →</A>
          </div>
        </div>
        <div className="xgn-install-term"><Session /></div>
      </div>
    </section>
  );
}

function Two() {
  return (
    <section className="x-sec xgn-two" id="two">
      <div className="x-wrap">
        <SecHead kicker="Gen and Dev" title="One runs agents. One is an agent." />
        <div className="xgn-pair">
          <div className="xgn-card xgn-card-gen">
            <span className="xgn-glyph ring" aria-hidden="true"><i /><b /></span>
            <p className="x-kick">Gen</p>
            <h3>The recursive harness. Mod anything.</h3>
            <p>A recursively self-upgrading agentic harness you can modify and remix. It launches any coding agent with Hanzo’s tools attached, routes model calls through Hanzo, and links the session to your account.</p>
            <A to="https://github.com/hanzoai/gen" className="xgn-arrow">hanzoai/gen →</A>
          </div>
          <div className="xgn-card">
            <span className="xgn-glyph core" aria-hidden="true"><b /></span>
            <p className="x-kick">Dev</p>
            <h3>Our agent.</h3>
            <p>The coding agent Hanzo builds, with Kai deciding each step. It is the agent Gen opens when none is named.</p>
            <A to="/dev" className="xgn-arrow">Hanzo Dev →</A>
          </div>
        </div>
      </div>
    </section>
  );
}

function Agents({ at, pick, setAt, mine }) {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  // the same flag flip as the hero, run here while the grid is the thing on screen
  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setTimeout(() => setAt((at + 1) % AGENTS.length, false), 1700);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen, setAt]);
  return (
    <section className="x-sec xgn-agents" id="agents" ref={box}>
      <div className="x-wrap">
        <SecHead kicker="Agents" title="The agent you use is a flag." lede="Each launches as itself, with its own interface and its own habits, and Gen around it. gen --help lists every one." />
        <ul className="xgn-flags" role="list">
          {AGENTS.map(([n, f], i) => (
            <li key={f}>
              <button type="button" className={'xgn-key' + (i === at ? ' on' : '')} aria-pressed={i === at} onClick={() => pick(i)}>
                <span className="xgn-key-n">{n}</span>
                <span className="xgn-key-f x-mono">--{f}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* The builder: one agent and Gen's own switches, assembled into the command (and its hanzo dev twin) to copy. */
const SWITCHES = [['cloud', '--cloud'], ['model', '--model enso-ultra'], ['nomcp', '--no-mcp'], ['nolink', '--no-link'], ['ask', '--ask'], ['pmcp', '--project-mcp']];
export function build(flag, on) {
  const parts = flag === 'dev' ? [] : ['--' + flag];
  SWITCHES.forEach(([k, f]) => { if (on[k] && (k !== 'model' || on.cloud)) parts.push(f); });
  return parts.join(' ');
}

function Rails({ at }) {
  const [on, setOn] = useState({ cloud: true });
  const flag = AGENTS[at][1];
  const args = build(flag, on);
  const gen = ('gen ' + args).trim(), dev = ('hanzo dev ' + args).trim();
  const flip = (k) => setOn((o) => ({ ...o, [k]: !o[k] }));
  const ownsRail = { 0: ['nomcp'], 1: ['cloud', 'model'], 2: ['nolink'], 3: ['ask', 'pmcp'] };
  return (
    <section className="x-sec xgn-rails" id="rails">
      <div className="x-wrap">
        <SecHead kicker="Our rails" title="What Gen puts around it." lede="Tools, models, sessions and fences, each set by a flag." />
        <div className="xgn-rail-grid">
          {RAILS.map(([t, d, f], i) => (
            <div key={t} className="xgn-rail-card">
              <h3>{t}</h3>
              <p>{d}</p>
              <span className="xgn-rail-f x-mono">{f}</span>
              <span className="xgn-sw">
                {ownsRail[i].map((k) => {
                  const s = SWITCHES.find((x) => x[0] === k);
                  const off = k === 'model' && !on.cloud;
                  return <button key={k} type="button" role="switch" aria-checked={!!on[k] && !off} disabled={off} onClick={() => flip(k)} className={on[k] && !off ? 'on' : ''}><i aria-hidden="true" />{s[1]}</button>;
                })}
              </span>
            </div>
          ))}
        </div>
        <div className="xgn-build">
          <div className="xgn-build-top"><span className="x-mono">Your command</span><span className="xgn-build-a">{AGENTS[at][0]}</span></div>
          <div className="xgn-build-row">
            <code className="x-mono"><span className="xgn-ps">$ </span>{gen}<span className="xgn-cur" /></code>
            <Copy text={gen} label="Copy" />
          </div>
          <div className="xgn-build-row twin">
            <code className="x-mono"><span className="xgn-ps">$ </span>{dev}</code>
            <Copy text={dev} label="Copy" />
          </div>
          {on.cloud && <p className="xgn-build-n">Only when you pass --cloud, and only an agent that can name another endpoint. Without it, each agent keeps the account it is signed in to.</p>}
        </div>
        <div className="xgn-rail-code"><Code lines={[
          ['gen --claude --cloud', '# its model calls through api.hanzo.ai'],
          ['gen --claude --cloud --model enso-ultra', null],
          ['gen --codex --no-link', '# keep the session on this machine'],
          ['gen --resume <session-id>', '# pick a linked session back up'],
          ['gen --claude -- -c', "# after --, the agent's own arguments"],
        ]} /></div>
      </div>
    </section>
  );
}

function Cli() {
  return (
    <section className="x-sec xgn-cli" id="cli">
      <div className="x-wrap xgn-cli-grid">
        <SecHead kicker="In the Hanzo CLI" title="The same harness, as hanzo dev." lede="The Hanzo CLI links Gen, so hanzo dev takes the same flags and runs the same session. Use whichever is on your path." />
        <div>
          <div><Code lines={[['hanzo dev', '# gen'], ['hanzo dev --claude', '# gen --claude'], ['hanzo dev --codex --cloud', '# gen --codex --cloud']]} /></div>
          <div className="x-row-links tight xgn-rel"><A to="/cli" className="xgn-arrow">The Hanzo CLI →</A></div>
        </div>
      </div>
    </section>
  );
}

function Source() {
  return (
    <section className="x-sec xgn-src" id="source" data-room="dark">
      <Sigil seed="hanzoai/gen" data={[AGENTS.length, RAILS.length, 0.1]} className="xgn-sigil" />
      <div className="x-wrap xgn-src-in">
        <SecHead dark kicker="Open source" title="MIT, in the open." lede="The harness, every agent's launcher and how its output is read are on GitHub, one file an agent." />
        <div><A to="https://github.com/hanzoai/gen" className="x-btn solid xgn-src-btn">The source →</A></div>
      </div>
    </section>
  );
}

const QA = [
  ['How do I install it?', <><code>curl -fsSL https://hanzo.sh | sh -s gen</code> installs gen alone; <code>curl -fsSL https://hanzo.sh | sh</code> installs every Hanzo tool, gen and the Hanzo CLI included. Run either again to upgrade. On Windows, take the build from the release page.</>],
  ['Is gen the same as hanzo dev?', 'The same harness. The Hanzo CLI links it, so gen --claude and hanzo dev --claude take the same flags and run the same session. Bare gen, like bare hanzo dev, opens Hanzo Dev.'],
  ['Does every agent run on Hanzo’s models?', 'Only when you pass --cloud, and only an agent that can name another endpoint. Without it, each agent keeps the account it is signed in to.'],
  ['What does Hanzo bill?', 'On --cloud, the agent’s model calls, on your Hanzo account. On the agent’s own account, only what Hanzo’s tools handled for it.'],
  ['Does Gen change the agent?', 'No. Each agent runs as itself — its own interface and its own commands — and anything after -- goes to it untouched.'],
  ['What license is it under?', 'MIT. The source is hanzoai/gen on GitHub.'],
];

const READ = [
  ['Gen', [['https://github.com/hanzoai/gen', 'hanzoai/gen', 'MIT.'], ['#agents', 'The agents'], ['#install', 'Install', 'curl -fsSL https://hanzo.sh | sh -s gen'], ['https://github.com/hanzoai/gen/releases', 'Releases']]],
  ['Dev', [['/dev', 'Hanzo Dev', 'Our agent, Gen’s default.'], ['/kai', 'Kai', 'Dev’s controller.']]],
  ['Models', [['/enso', 'Enso'], ['/models', 'Every model'], ['/cli', 'Hanzo CLI']]],
];
const PASTE = 'Read https://hanzo.ai/skill.md and use Hanzo Gen in my project. Start with: gen';

function Questions() {
  return (
    <section className="x-sec xgn-qa">
      <div className="x-wrap xgn-qa-grid">
        <div className="xgn-qa-head">
          <p className="xgn-help x-mono" aria-hidden="true"><span className="xgn-ps">$</span> gen --help<span className="xgn-cur" /></p>
          <SecHead kicker="Questions" title="Questions & Answers" />
        </div>
        <Faq items={QA} />
      </div>
    </section>
  );
}

function Read() {
  return (
    <section className="x-sec xgn-read">
      <div className="x-wrap">
        <SecHead kicker="Read" title="The harness, the agent, the CLI." lede="Where to get Gen, what it runs, and the same harness in the CLI." />
        <div className="xgn-cols">
          {READ.map(([h, items], c) => (
            <div key={h}>
              <h3 className="xgn-col-h">{h}</h3>
              <ul className="xgn-links">
                {items.map(([to, t, d]) => {
                  const inner = <><span><b>{t}</b>{d && <span className={to === '#install' ? 'x-mono' : ''}>{d}</span>}</span><i aria-hidden="true">→</i></>;
                  return <li key={t}>{to.startsWith('#') ? <a href={to} className="xgn-link">{inner}</a> : <A to={to} className="xgn-link">{inner}</A>}</li>;
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="xgn-paste">
          <div>
            <p className="x-kick">Paste and ship</p>
            <p className="xgn-paste-l">Paste this into any agent. It reads the skill manifest and calls Gen from there.</p>
          </div>
          <div className="xgn-prompt">
            <div className="xgn-prompt-top"><span className="x-mono">Agent prompt</span><Copy text={PASTE} label="Copy the agent prompt" /></div>
            <pre className="x-mono">{PASTE}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Gen() {
  const [at, setAtState] = useState(1);
  const [mine, setMine] = useState(false);
  const setAt = (i, byHand) => { setAtState(i); if (byHand) setMine(true); };
  const pick = (i) => setAt(i, true);
  return (
    <main className="xgn">
      <Hero at={at} setAt={setAt} mine={mine} />
      <Install />
      <Two />
      <Agents at={at} pick={pick} setAt={setAt} mine={mine} />
      <Rails at={at} />
      <Cli />
      <Source />
      <Questions />
      <Read />
    </main>
  );
}
