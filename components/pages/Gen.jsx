'use client';
// Signature: The agent is a flag: Gen's four rails frame one split-flap board, and the flag flips through all 23 agents, each letter tile clattering through the alphabet until the next agent's name lands in place
// Beyond: A command builder: pick the agent, switch Gen's rails on or off, and copy the exact gen command and its hanzo dev twin
/* Hanzo Gen, v2 (Archetype F, developer: the agent is a flag).
   V2: 8/10 a 4/8 first screen: a small copy column beside one huge object, a departure board framed by Gen's four rails whose tiles flip from one agent to the next; install is one tabbed code window where every line copies; the agents are keys that drive the builder; one dark room for the source
   Motion: signature = the split-flap board (tiles written through refs, stopped off screen). Supporting: the line-masked
   headline, the tab underline that glides (layoutId), a magnetic primary button. Accent: signal red, the rails' beacons.
   Every word and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Copy, Magnetic } from '../ui';
import { A } from '../kit';
import Lines from '../v2/AppLines';
import '../v2/AppType.css';
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
const n23 = (i) => String(i + 1).padStart(2, '0') + ' / ' + AGENTS.length;
const flagOf = (f) => (f === 'dev' ? '' : '--' + f);
const capOf = (name, f) => (f === 'dev' ? 'no agent named: Hanzo Dev' : `--${f}: ${name}`);

/* ---------- the board: twelve tiles a row, two rows; a name breaks between words ---------- */
const COLS = 12;
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-';
function rows(name) {
  const out = [''];
  name.split(' ').forEach((w) => {
    const cur = out[out.length - 1];
    if (!cur) out[out.length - 1] = w;
    else if ((cur + ' ' + w).length <= COLS) out[out.length - 1] = cur + ' ' + w;
    else out.push(w);
  });
  while (out.length < 2) out.push('');
  return out.map((r) => r.padEnd(COLS, ' ')).join('');
}

function Board({ at, setAt, mine }) {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.35 });
  const calm = useReducedMotion();
  const cells = useRef([]);
  const flag = useRef(null);
  const [first] = useState(() => [rows(AGENTS[at][0]), flagOf(AGENTS[at][1])]); // the tiles are written by hand after this
  const live = seen && !calm;
  // the flip: every tile that changes clatters through a few letters, left to right and row by row, then settles
  useEffect(() => {
    const [name, f] = AGENTS[at];
    const to = rows(name), fl = flagOf(f);
    const els = cells.current;
    const settle = () => { els.forEach((el, i) => { if (el) el.textContent = to[i]; }); if (flag.current) flag.current.textContent = fl; };
    if (!live) { settle(); return; }
    const timers = [];
    els.forEach((el, i) => {
      if (!el || el.textContent === to[i]) return;
      const c = i % COLS, r = Math.floor(i / COLS);
      const n = 3 + ((i * 7 + at) % 4);
      for (let k = 1; k <= n; k++) {
        timers.push(setTimeout(() => {
          el.textContent = k === n ? to[i] : ABC[(i * 5 + k * 11 + at * 3) % ABC.length];
          el.animate?.([{ transform: 'rotateX(-78deg)', opacity: 0.35 }, { transform: 'rotateX(0deg)', opacity: 1 }], { duration: 90, easing: 'cubic-bezier(.16,1,.3,1)' });
        }, c * 26 + r * 80 + k * 62));
      }
    });
    const fe = flag.current;
    if (fe && fe.textContent !== fl) {
      for (let k = 1; k <= 6; k++) {
        timers.push(setTimeout(() => {
          fe.textContent = k === 6 ? fl : '--' + [...f].map((ch, j) => ABC[(j * 3 + k * 7 + at) % 52]).join('').toLowerCase();
        }, 120 + k * 60));
      }
    }
    return () => { timers.forEach(clearTimeout); settle(); };
  }, [at, live]);
  // it walks the 23 by itself until you take it
  useEffect(() => {
    if (mine || !live) return;
    const t = setTimeout(() => setAt((at + 1) % AGENTS.length, false), 2600);
    return () => clearTimeout(t);
  }, [at, mine, live, setAt]);
  const [name, f] = AGENTS[at];
  const step = (d) => setAt((at + d + AGENTS.length) % AGENTS.length, true);
  return (
    <div className="xgn-obj av-obj" ref={box} data-morph-target="">
      <div className="xgn-frame" aria-hidden="true">
        <i className="xgn-corner c0" /><i className="xgn-corner c1" /><i className="xgn-corner c2" /><i className="xgn-corner c3" />
      </div>
      {RAILS.map(([r, , fl], i) => (
        <span key={r} className={'xgn-rail r' + i}>
          <b key={live ? at : 'still'} className="xgn-beacon" style={{ '--d': i * 90 + 'ms' }} aria-hidden="true" />
          <span className="xgn-rail-n">{r}</span>
          <span className="xgn-rail-f">{fl}</span>
        </span>
      ))}
      <div className="xgn-in">
        <p className="xgn-k x-mono">gen runs</p>
        <button type="button" className="xgn-board" onClick={() => step(1)} aria-label={`${name}, ${capOf(name, f)}. Next agent`}>
          {[...first[0]].map((ch, i) => (
            <span key={i} className={'xgn-tile' + (i >= COLS ? ' r2' : '')} aria-hidden="true">
              <span ref={(el) => (cells.current[i] = el)}>{ch}</span>
            </span>
          ))}
        </button>
        <p className="xgn-line x-mono" aria-hidden="true">
          <span className="xgn-ps">$</span>gen <span className="xgn-fl" ref={flag}>{first[1]}</span><span className="xgn-cur" />
        </p>
        <div className="xgn-meta">
          <span className="xgn-cap x-mono" aria-live="polite">{capOf(name, f)}</span>
          <span className="xgn-ctl">
            <span className="xgn-count x-mono av-num">{n23(at)}</span>
            <button type="button" onClick={() => step(-1)} aria-label="Previous agent"><svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M10 3.5 5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            <button type="button" onClick={() => step(1)} aria-label="Next agent"><svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
          </span>
        </div>
      </div>
    </div>
  );
}

function Hero({ at, setAt, mine }) {
  return (
    <section className="xgn-hero" aria-labelledby="xgn-h1">
      <div className="av-wrap av-grid xgn-hero-g">
        <div className="xgn-copy">
          <p className="av-kick"><b>Hanzo Gen</b> · Self-upgrading harness</p>
          <Lines as="h1" id="xgn-h1" className="xgn-h1" lines={['Recursive agent harness.', 'Mod anything.']} now delay={0.1} />
          <p className="av-body">Gen is a recursively self-upgrading agentic harness that runs the coding agent you use — Hanzo Dev, Claude Code, Codex, and custom loops — with full hackability, MCP tools attached, and every session linked to your Hanzo account.</p>
          <div className="xgn-acts">
            <Magnetic strength={0.25}><A to="https://platform.hanzo.ai/keys" className="x-btn solid" data-thumb="Get API key">Get API key</A></Magnetic>
            <A to="https://github.com/hanzoai/gen" className="x-btn">Explore GitHub examples →</A>
            <A to="https://docs.hanzo.ai/docs/coding" className="xgn-doc">Read the docs →</A>
          </div>
        </div>
        <div className="xgn-stage"><Board at={at} setAt={setAt} mine={mine} /></div>
      </div>
    </section>
  );
}

/* ---------- install: one code window, three tabs; every line copies ---------- */
const SESSION = [
  ['curl -fsSL https://hanzo.sh | sh -s gen', null],
  ['gen', 'no agent named: Hanzo Dev'],
  ['gen --claude', 'Claude Code, with the Hanzo toolset attached'],
  ['gen --codex "add a test"', 'Codex, run headless on the task'],
  ['gen --claude --cloud', 'its model calls on Hanzo’s, metered on your account'],
];
const TABS = [
  ['Install', [['curl -fsSL https://hanzo.sh | sh -s gen', '# gen alone'], ['curl -fsSL https://hanzo.sh | sh', '# or every Hanzo tool, gen included']]],
  ['Run', [['gen', '# Hanzo Dev, the default'], ['gen --claude', '# Claude Code; any agent is a flag'], ['gen --codex "add a test"', '# a task, run headless']]],
  ['terminal', SESSION],
];

function Lns({ lines, out }) {
  return (
    <ol className="xgn-lns">
      {lines.map(([c, n], i) => (
        <li key={i}>
          <code className="x-mono"><span className="xgn-ps" aria-hidden="true">$</span>{c}{n && (out ? <span className="xgn-out">{n}</span> : <span className="xgn-cm">{'  '}{n}</span>)}</code>
          <Copy text={c} className="xgn-cp" />
        </li>
      ))}
    </ol>
  );
}

function Install() {
  const [tab, setTab] = useState(0);
  return (
    <section className="av-sec xgn-install" id="install" aria-labelledby="xgn-inst-h">
      <div className="av-wrap av-grid">
        <div className="xgn-inst-l">
          <p className="av-kick">Install</p>
          <h2 id="xgn-inst-h" className="av-head">One line, then any agent.</h2>
          <p className="av-body">Linux and macOS. hanzo.sh downloads gen’s native build and checks it: its checksum always, its provenance with a signed-in gh. Run it again to upgrade.</p>
          <p className="xgn-note">Sign in once with the Hanzo CLI, <code>hanzo auth login</code>, and every session is linked to your account.</p>
          <div className="xgn-rel">
            <A to="https://github.com/hanzoai/gen/releases/tag/v0.1.0" className="xgn-arrow">Latest release v0.1.0 →</A>
            <A to="https://github.com/hanzoai/gen/releases" className="xgn-arrow">Every build →</A>
          </div>
        </div>
        <div className="xgn-win av-obj">
          <div className="xgn-win-bar">
            <span className="xgn-dots" aria-hidden="true"><i /><i /><i /></span>
            <div className="xgn-tabs" role="tablist" aria-label="Install and run">
              {TABS.map(([t], i) => (
                <button key={t} type="button" role="tab" id={'xgn-t' + i} aria-controls={'xgn-p' + i} aria-selected={tab === i} onClick={() => setTab(i)}>
                  {tab === i && <motion.span layoutId="xgn-tab" className="xgn-tab-bg" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                  <span>{t}</span>
                </button>
              ))}
            </div>
            <span className="xgn-win-k x-mono">bash</span>
          </div>
          {TABS.map(([t, lines], i) => (
            <div key={t} id={'xgn-p' + i} role="tabpanel" aria-labelledby={'xgn-t' + i} hidden={tab !== i} className="xgn-panel">
              <Lns lines={lines} out={i === 2} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- gen and dev: one runs agents, one is an agent (7/5) ---------- */
function Two() {
  return (
    <section className="av-sec xgn-two" id="two" aria-labelledby="xgn-two-h">
      <div className="av-wrap">
        <p className="av-kick">Gen and Dev</p>
        <Lines as="h2" id="xgn-two-h" className="av-display s xgn-two-h" lines={['One runs agents.', 'One is an agent.']} />
        <div className="xgn-pair">
          <div className="xgn-card gen">
            <span className="xgn-ring" aria-hidden="true">{RAILS.map(([r]) => <i key={r} />)}<b /></span>
            <p className="av-kick">Gen</p>
            <h3 className="av-title">The recursive harness. Mod anything.</h3>
            <p className="av-body">A recursively self-upgrading agentic harness you can modify and remix. It launches any coding agent with Hanzo’s tools attached, routes model calls through Hanzo, and links the session to your account.</p>
            <A to="https://github.com/hanzoai/gen" className="xgn-arrow">hanzoai/gen →</A>
          </div>
          <A to="/dev" className="xgn-card dev">
            <span className="xgn-core-dot" aria-hidden="true" />
            <span className="av-kick">Dev</span>
            <span className="av-title">Our agent.</span>
            <span className="av-body">The coding agent Hanzo builds, with Kai deciding each step. It is the agent Gen opens when none is named.</span>
            <span className="xgn-arrow">Hanzo Dev →</span>
          </A>
        </div>
      </div>
    </section>
  );
}

/* ---------- agents: twenty-three keys; the one you press is the flag the builder uses ---------- */
function Agents({ at, pick }) {
  return (
    <section className="av-sec xgn-agents" id="agents" aria-labelledby="xgn-ag-h">
      <div className="av-wrap av-grid">
        <div className="xgn-ag-l">
          <p className="av-kick">Agents</p>
          <h2 id="xgn-ag-h" className="av-head">The agent you use is a flag.</h2>
          <p className="av-body">Each launches as itself, with its own interface and its own habits, and Gen around it. gen --help lists every one.</p>
        </div>
        <ul className="xgn-keys" role="list">
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

/* ---------- Beyond: the rails, each a switch, and the exact command they make ---------- */
const SWITCHES = [['cloud', '--cloud'], ['model', '--model enso-ultra'], ['nomcp', '--no-mcp'], ['nolink', '--no-link'], ['ask', '--ask'], ['pmcp', '--project-mcp']];
export function build(flag, on) {
  const parts = flag === 'dev' ? [] : ['--' + flag];
  SWITCHES.forEach(([k, f]) => { if (on[k] && (k !== 'model' || on.cloud)) parts.push(f); });
  return parts.join(' ');
}
const OWNS = { 0: ['nomcp'], 1: ['cloud', 'model'], 2: ['nolink'], 3: ['ask', 'pmcp'] };

function Rails({ at, pick }) {
  const [on, setOn] = useState({ cloud: true });
  const [name, flag] = AGENTS[at];
  const args = build(flag, on);
  const gen = ('gen ' + args).trim(), dev = ('hanzo dev ' + args).trim();
  const flip = (k) => setOn((o) => ({ ...o, [k]: !o[k] }));
  return (
    <section className="av-sec xgn-rails" id="rails" aria-labelledby="xgn-rails-h">
      <div className="av-wrap av-grid">
        <div className="xgn-rails-l">
          <p className="av-kick">Our rails</p>
          <h2 id="xgn-rails-h" className="av-head">What Gen puts around it.</h2>
          <p className="av-lede">Tools, models, sessions and fences, each set by a flag.</p>
          <ol className="xgn-rail-list">
            {RAILS.map(([t, d, f], i) => (
              <li key={t}>
                <div className="xgn-rail-h">
                  <span className="xgn-rail-i x-mono av-num">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="av-title">{t}</h3>
                  <span className="xgn-rail-f2 x-mono">{f}</span>
                </div>
                <p className="av-body">{d}</p>
                <span className="xgn-sw">
                  {OWNS[i].map((k) => {
                    const s = SWITCHES.find((x) => x[0] === k);
                    const off = k === 'model' && !on.cloud;
                    const lit = !!on[k] && !off;
                    return (
                      <button key={k} type="button" role="switch" aria-checked={lit} disabled={off} onClick={() => flip(k)} className={lit ? 'on' : ''}>
                        <i aria-hidden="true" /><span className="x-mono">{s[1]}</span>
                      </button>
                    );
                  })}
                </span>
              </li>
            ))}
          </ol>
          <div className="xgn-code">
            <div className="xgn-code-top"><span className="x-mono">bash</span></div>
            <Lns lines={[
              ['gen --claude --cloud', '# its model calls through api.hanzo.ai'],
              ['gen --claude --cloud --model enso-ultra', null],
              ['gen --codex --no-link', '# keep the session on this machine'],
              ['gen --resume <session-id>', '# pick a linked session back up'],
              ['gen --claude -- -c', "# after --, the agent's own arguments"],
            ]} />
          </div>
        </div>
        <div className="xgn-build-wrap">
          <div className="xgn-build av-obj">
            <div className="xgn-build-top">
              <span className="av-kick">Your command</span>
              <label className="xgn-pick">
                <span className="x-sr">Agent</span>
                <select value={at} onChange={(e) => pick(+e.target.value)}>
                  {AGENTS.map(([n], i) => <option key={n} value={i}>{n}</option>)}
                </select>
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </label>
            </div>
            <p className="xgn-build-a">{name}</p>
            <div className="xgn-build-row">
              <code className="x-mono" aria-live="polite"><span className="xgn-ps">$</span>{gen}</code>
              <Copy text={gen} label="Copy" />
            </div>
            <div className="xgn-build-row twin">
              <code className="x-mono"><span className="xgn-ps">$</span>{dev}</code>
              <Copy text={dev} label="Copy" />
            </div>
            <p className="xgn-build-n" hidden={!on.cloud}>Only when you pass --cloud, and only an agent that can name another endpoint. Without it, each agent keeps the account it is signed in to.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- the same harness in the CLI ---------- */
function Cli() {
  return (
    <section className="av-sec tight xgn-cli" id="cli" aria-labelledby="xgn-cli-h">
      <div className="av-wrap av-grid">
        <div className="xgn-cli-l">
          <p className="av-kick">In the Hanzo CLI</p>
          <h2 id="xgn-cli-h" className="av-head">The same harness, as hanzo dev.</h2>
          <p className="av-body">The Hanzo CLI links Gen, so hanzo dev takes the same flags and runs the same session. Use whichever is on your path.</p>
          <A to="/cli" className="xgn-arrow">The Hanzo CLI →</A>
        </div>
        <div className="xgn-code xgn-cli-r"><div className="xgn-code-top"><span className="x-mono">bash</span></div><Lns lines={[['hanzo dev', '# gen'], ['hanzo dev --claude', '# gen --claude'], ['hanzo dev --codex --cloud', '# gen --codex --cloud']]} /></div>
      </div>
    </section>
  );
}

/* ---------- the one dark room: the source ---------- */
function Source() {
  return (
    <section className="av-sec xgn-src av-dark" id="source" data-room="dark" aria-labelledby="xgn-src-h">
      <div className="av-wrap av-grid">
        <div className="xgn-src-l">
          <p className="av-kick">Open source</p>
          <h2 id="xgn-src-h" className="av-display m">MIT, in the open.</h2>
        </div>
        <div className="xgn-src-r">
          <p className="av-lede">The harness, every agent's launcher and how its output is read are on GitHub, one file an agent.</p>
          <A to="https://github.com/hanzoai/gen" className="x-btn solid xgn-src-btn">The source →</A>
        </div>
      </div>
      <ul className="xgn-src-flags x-mono" aria-hidden="true">
        {AGENTS.map(([, f]) => <li key={f}>--{f}</li>)}
      </ul>
    </section>
  );
}

/* ---------- questions: one opens at a time ---------- */
const QA = [
  ['How do I install it?', <><code>curl -fsSL https://hanzo.sh | sh -s gen</code> installs gen alone; <code>curl -fsSL https://hanzo.sh | sh</code> installs every Hanzo tool, gen and the Hanzo CLI included. Run either again to upgrade. On Windows, take the build from the release page.</>],
  ['Is gen the same as hanzo dev?', 'The same harness. The Hanzo CLI links it, so gen --claude and hanzo dev --claude take the same flags and run the same session. Bare gen, like bare hanzo dev, opens Hanzo Dev.'],
  ['Does every agent run on Hanzo’s models?', 'Only when you pass --cloud, and only an agent that can name another endpoint. Without it, each agent keeps the account it is signed in to.'],
  ['What does Hanzo bill?', 'On --cloud, the agent’s model calls, on your Hanzo account. On the agent’s own account, only what Hanzo’s tools handled for it.'],
  ['Does Gen change the agent?', 'No. Each agent runs as itself — its own interface and its own commands — and anything after -- goes to it untouched.'],
  ['What license is it under?', 'MIT. The source is hanzoai/gen on GitHub.'],
];

function Questions() {
  const [open, setOpen] = useState(0);
  return (
    <section className="av-sec xgn-qa" aria-labelledby="xgn-qa-h">
      <div className="av-wrap av-grid">
        <div className="xgn-qa-l">
          <p className="av-kick">Questions</p>
          <h2 id="xgn-qa-h" className="av-head">Questions &amp; Answers</h2>
        </div>
        <ul className="xgn-qs">
          {QA.map(([q, a], i) => (
            <li key={q} className={open === i ? 'open' : ''}>
              <button type="button" id={'xgn-q' + i} aria-expanded={open === i} aria-controls={'xgn-a' + i} onClick={() => setOpen(open === i ? -1 : i)}>
                <span className="av-title">{q}</span>
                <i aria-hidden="true" />
              </button>
              <div id={'xgn-a' + i} role="region" aria-labelledby={'xgn-q' + i} className="xgn-a" hidden={open !== i}>
                <p className="av-body">{a}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- read on, and paste and ship ---------- */
const READ = [
  ['Gen', [['https://github.com/hanzoai/gen', 'hanzoai/gen', 'MIT.'], ['#agents', 'The agents'], ['#install', 'Install', 'curl -fsSL https://hanzo.sh | sh -s gen'], ['https://github.com/hanzoai/gen/releases', 'Releases']]],
  ['Dev', [['/dev', 'Hanzo Dev', 'Our agent, Gen’s default.'], ['/kai', 'Kai', 'Dev’s controller.']]],
  ['Models', [['/enso', 'Enso'], ['/models', 'Every model'], ['/cli', 'Hanzo CLI']]],
];
const PASTE = 'Read https://hanzo.ai/skill.md and use Hanzo Gen in my project. Start with: gen';

function Read() {
  return (
    <section className="av-sec xgn-read" aria-labelledby="xgn-read-h">
      <div className="av-wrap">
        <div className="av-grid xgn-read-top">
          <div className="xgn-read-l">
            <p className="av-kick">Read</p>
            <h2 id="xgn-read-h" className="av-head">The harness, the agent, the CLI.</h2>
          </div>
          <p className="av-body xgn-read-r">Where to get Gen, what it runs, and the same harness in the CLI.</p>
        </div>
        <div className="xgn-cols">
          {READ.map(([h, items]) => (
            <div key={h}>
              <h3 className="xgn-col-h x-mono">{h}</h3>
              <ul className="xgn-links">
                {items.map(([to, t, d]) => {
                  const inner = <><span><b>{t}</b>{d && <span className={to === '#install' ? 'x-mono' : ''}>{d}</span>}</span><i aria-hidden="true">→</i></>;
                  return <li key={t}>{to.startsWith('#') ? <a href={to} className="xgn-link">{inner}</a> : <A to={to} className="xgn-link">{inner}</A>}</li>;
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="av-grid xgn-paste">
          <div className="xgn-paste-l">
            <p className="av-title">Paste and ship</p>
            <p className="av-body">Paste this into any agent. It reads the skill manifest and calls Gen from there.</p>
          </div>
          <div className="xgn-prompt">
            <div className="xgn-prompt-top"><span className="av-kick">Agent prompt</span><Copy text={PASTE} label="Copy the agent prompt" /></div>
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
    <main className="av xgn" style={{ '--ac': '#e5484d' }}>
      <Hero at={at} setAt={setAt} mine={mine} />
      <Install />
      <Two />
      <Agents at={at} pick={pick} />
      <Rails at={at} pick={pick} />
      <Cli />
      <Source />
      <Questions />
      <Read />
    </main>
  );
}
