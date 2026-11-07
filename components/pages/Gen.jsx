'use client';
// Signature: The agent is a flag: Gen's four rails frame one split-flap board, and the flag flips through all 23 agents, each letter tile flipping in place until the next agent's name lands
// Beyond: A command builder: pick the agent, switch Gen's rails on or off, and copy the exact gen command and its hanzo dev twin
// Persona: a developer who already runs a coding agent and wants Hanzo's tools, models and sessions around it.
// Goal: get an API key, then run `gen --<agent>` with the exact flags built on the page.
// CTA: Get API key (platform.hanzo.ai/keys): hero solid + ask bar (data-thumb) + the closing band; everything else is a text link.
// Metric: api_key_created
/* Hanzo Gen (Archetype: Developer, the agent is a flag).
   V2: 8/10 round 2: kickers gone (their words became the page's own index under the hero); the h1 paints first (no mask holding it); no floating ask bar (data-ask="off"); Read and Paste moved above the FAQ; one solid ask in the hero and again in the one closing band with Read the docs beside it (the black "MIT, in the open." room, which now opens out of a rounded card); the board flips each tile once (no scrambled letters), walks the 23 once and rests, with Pause; deck scale (h1 52); kit Tabs and FAQ; the native select became Previous/Next; no springs
   Motion: signature = the split-flap board (tiles written through refs, stopped off screen, one pass then rest).
   Supporting: the line-masked headlines, the black room opening to full width as it arrives (clip, scroll-linked),
   the added rail switches. Colour: Hanzo's deck greys only. Every word and link is Hanzo's. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Copy } from '../ui';
import { A, Cta, Tabs, TabPanel, Faq } from '../kit';
import Lines from '../v2/x-edison/AppLines';
import '../v2/AppType.css';
import './Gen.css';

const KEYS = 'https://platform.hanzo.ai/keys';
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
const EASE = 'cubic-bezier(.16,1,.3,1)';

const IconPause = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5.5 3.5v9M10.5 3.5v9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
const IconPlay = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5 3.5v9l7-4.5z" fill="currentColor" /></svg>;
const IconPrev = () => <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M10 3.5 5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const IconNext = () => <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* ---------- the board: twelve tiles a row, two rows; a name breaks between words ---------- */
const COLS = 12;
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
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  const cells = useRef([]);
  const flag = useRef(null);
  const [first] = useState(() => [rows(AGENTS[at][0]), flagOf(AGENTS[at][1])]); // the tiles are written by hand after this
  const [paused, setPaused] = useState(false);
  const [walked, setWalked] = useState(0); // it walks the 23 once, then rests on the last
  const live = seen && !calm;
  // the flip: every tile that changes turns over once, in place, left to right and row by row; no letters it is not
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
      timers.push(setTimeout(() => {
        el.animate?.([{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(-90deg)' }], { duration: 90, easing: 'cubic-bezier(.4,0,1,1)' });
        timers.push(setTimeout(() => {
          el.textContent = to[i];
          el.animate?.([{ transform: 'rotateX(90deg)' }, { transform: 'rotateX(0deg)' }], { duration: 150, easing: EASE });
        }, 90));
      }, c * 30 + r * 60));
    });
    const fe = flag.current;
    if (fe && fe.textContent !== fl) {
      timers.push(setTimeout(() => {
        fe.textContent = fl;
        fe.animate?.([{ transform: 'translateY(60%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 300, easing: EASE });
      }, 120));
    }
    return () => { timers.forEach(clearTimeout); settle(); };
  }, [at, live]);
  useEffect(() => {
    if (mine || !live || paused || walked >= AGENTS.length - 1) return;
    const t = setTimeout(() => { setWalked((w) => w + 1); setAt((at + 1) % AGENTS.length, false); }, 2200);
    return () => clearTimeout(t);
  }, [at, mine, live, paused, walked, setAt]);
  const [name, f] = AGENTS[at];
  const step = (d) => setAt((at + d + AGENTS.length) % AGENTS.length, true);
  const walking = !mine && !calm && walked < AGENTS.length - 1;
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
        <div className="xgn-top">
          <p className="xgn-k x-mono">gen runs</p>
          <p className="xgn-who x-mono">Hanzo Gen · Self-upgrading harness</p>
          <button type="button" className="xgn-pause" onClick={() => setPaused((p) => !p)} aria-label="Pause" aria-pressed={paused} hidden={!walking}>{paused ? <IconPlay /> : <IconPause />}</button>
        </div>
        <button type="button" className="xgn-board" onClick={() => step(1)} aria-label={`${name}, ${capOf(name, f)}. Next`}>
          {[...first[0]].map((ch, i) => (
            <span key={i} className={'xgn-tile' + (i >= COLS ? ' r2' : '')} aria-hidden="true">
              <span ref={(el) => (cells.current[i] = el)}>{ch}</span>
            </span>
          ))}
        </button>
        <p className="xgn-line x-mono" aria-hidden="true">
          <span className="xgn-ps">$</span>gen <span className="xgn-fl-w"><span className="xgn-fl" ref={flag}>{first[1]}</span></span><span className="xgn-cur" />
        </p>
        <div className="xgn-meta">
          <span className="xgn-cap x-mono" aria-live="polite">{capOf(name, f)}</span>
          <span className="xgn-ctl">
            <span className="xgn-count x-mono av-num">{n23(at)}</span>
            <button type="button" onClick={() => step(-1)} aria-label="Previous"><IconPrev /></button>
            <button type="button" onClick={() => step(1)} aria-label="Next"><IconNext /></button>
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
          <h1 id="xgn-h1" className="av-display xgn-h1"><span>Recursive agent harness.</span> <span>Mod anything.</span></h1>
          <p className="av-body xgn-lede">Gen is a recursively self-upgrading agentic harness that runs the coding agent you use — Hanzo Dev, Claude Code, Codex, and custom loops — with full hackability, MCP tools attached, and every session linked to your Hanzo account.</p>
          <div className="xgn-acts">
            <Cta to={KEYS} id="gen.hero" thumb>Get API key</Cta>
            <A to="https://github.com/hanzoai/gen" className="xgn-arrow" data-cta="gen.hero-github">Explore GitHub examples →</A>
            <A to="https://docs.hanzo.ai/docs/coding" className="xgn-arrow" data-cta="gen.hero-docs">Read the docs →</A>
          </div>
        </div>
        <div className="xgn-stage"><Board at={at} setAt={setAt} mine={mine} /></div>
      </div>
    </section>
  );
}

/* ---------- the page's own index: the section names, as a row you can jump from ---------- */
const INDEX = [['#install', 'Install'], ['#two', 'Gen and Dev'], ['#agents', 'Agents'], ['#rails', 'Our rails'], ['#cli', 'In the Hanzo CLI'], ['#read', 'Read'], ['#qa', 'Questions'], ['#source', 'Open source']];
function Index() {
  return (
    <nav className="xgn-index" aria-label="Hanzo Gen">
      <div className="av-wrap">
        <ol>{INDEX.map(([h, t], i) => <li key={h}><a href={h}><span className="x-mono av-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>{t}</a></li>)}</ol>
      </div>
    </nav>
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
  const [tab, setTab] = useState(2); // the session tab first: the whole install-and-run story in one window
  return (
    <section className="av-sec xgn-install" id="install" aria-labelledby="xgn-inst-h">
      <div className="av-wrap av-grid">
        <div className="xgn-win av-obj">
          <div className="xgn-win-bar">
            <span className="xgn-dots" aria-hidden="true"><i /><i /><i /></span>
            <Tabs id="xgn-inst" label="Install and run" tabs={TABS.map(([t]) => t)} value={tab} onChange={setTab} />
            <span className="xgn-win-k x-mono">bash</span>
          </div>
          {/* fixed height: the longest tab (terminal) sets it, so switching never moves the page */}
          <div className="xgn-panels">
            {TABS.map(([t, lines], i) => (
              <TabPanel key={t} id="xgn-inst" i={i} value={tab} className="xgn-panel">
                <Lns lines={lines} out={i === 2} />
              </TabPanel>
            ))}
          </div>
        </div>
        <div className="xgn-inst-l">
          <Lines as="h2" id="xgn-inst-h" className="av-head" lines={['One line, then any agent.']} />
          <p className="av-body">Linux and macOS. hanzo.sh downloads gen’s native build and checks it: its checksum always, its provenance with a signed-in gh. Run it again to upgrade.</p>
          <p className="xgn-note">Sign in once with the Hanzo CLI, <code>hanzo auth login</code>, and every session is linked to your account.</p>
          <div className="xgn-rel">
            <A to="https://github.com/hanzoai/gen/releases/tag/v0.1.0" className="xgn-arrow" data-cta="gen.release">Latest release v0.1.0 →</A>
            <A to="https://github.com/hanzoai/gen/releases" className="xgn-arrow" data-cta="gen.builds">Every build →</A>
          </div>
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
        <Lines as="h2" id="xgn-two-h" className="av-display s xgn-two-h" lines={['One runs agents.', 'One is an agent.']} />
        <div className="xgn-pair">
          <div className="xgn-card gen">
            <span className="xgn-ring" aria-hidden="true">{RAILS.map(([r]) => <i key={r} />)}<b /></span>
            <h3 className="av-title">The recursive harness. Mod anything.</h3>
            <p className="av-body">A recursively self-upgrading agentic harness you can modify and remix. It launches any coding agent with Hanzo’s tools attached, routes model calls through Hanzo, and links the session to your account.</p>
            <A to="https://github.com/hanzoai/gen" className="xgn-arrow" data-cta="gen.repo">hanzoai/gen →</A>
          </div>
          <A to="/dev" className="xgn-card dev" data-cta="gen.dev">
            <span className="xgn-core-dot" aria-hidden="true" />
            <span className="av-title">Our agent.</span>
            <span className="av-body">The coding agent Hanzo builds, with Kai deciding each step. It is the agent Gen opens when none is named.</span>
            <span className="xgn-arrow">Hanzo Dev →</span>
          </A>
        </div>
      </div>
    </section>
  );
}

/* ---------- agents: twenty-three keys; the one you press is the flag the board and the builder use ---------- */
function Agents({ at, pick }) {
  return (
    <section className="av-sec xgn-agents" id="agents" aria-labelledby="xgn-ag-h">
      <div className="av-wrap av-grid">
        <div className="xgn-ag-l">
          <Lines as="h2" id="xgn-ag-h" className="av-head" lines={['The agent you use is a flag.']} />
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
  const step = (d) => pick((at + d + AGENTS.length) % AGENTS.length);
  return (
    <section className="av-sec xgn-rails" id="rails" aria-labelledby="xgn-rails-h">
      <div className="av-wrap av-grid">
        <div className="xgn-rails-l">
          <Lines as="h2" id="xgn-rails-h" className="av-head" lines={['What Gen puts around it.']} />
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
            <p className="xgn-build-k">Your command</p>
            <div className="xgn-pick">
              <button type="button" onClick={() => step(-1)} aria-label="Previous"><IconPrev /></button>
              <p className="xgn-build-a" aria-live="polite">{name}</p>
              <button type="button" onClick={() => step(1)} aria-label="Next"><IconNext /></button>
            </div>
            <div className="xgn-build-row">
              <code className="x-mono"><span className="xgn-ps" aria-hidden="true">$</span>{gen}</code>
              <Copy text={gen} label="Copy" />
            </div>
            <div className="xgn-build-row twin">
              <code className="x-mono"><span className="xgn-ps" aria-hidden="true">$</span>{dev}</code>
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
          <Lines as="h2" id="xgn-cli-h" className="av-head" lines={['The same harness, as hanzo dev.']} />
          <p className="av-body">The Hanzo CLI links Gen, so hanzo dev takes the same flags and runs the same session. Use whichever is on your path.</p>
          <A to="/cli" className="xgn-arrow" data-cta="gen.cli">The Hanzo CLI →</A>
        </div>
        <div className="xgn-code xgn-cli-r"><div className="xgn-code-top"><span className="x-mono">bash</span></div><Lns lines={[['hanzo dev', '# gen'], ['hanzo dev --claude', '# gen --claude'], ['hanzo dev --codex --cloud', '# gen --codex --cloud']]} /></div>
      </div>
    </section>
  );
}

/* ---------- questions (the kit FAQ: every answer in the HTML, each with its own address) ---------- */
const QA = [
  ['How do I install it?', <><code>curl -fsSL https://hanzo.sh | sh -s gen</code> installs gen alone; <code>curl -fsSL https://hanzo.sh | sh</code> installs every Hanzo tool, gen and the Hanzo CLI included. Run either again to upgrade. On Windows, take the build from the release page.</>],
  ['Is gen the same as hanzo dev?', 'The same harness. The Hanzo CLI links it, so gen --claude and hanzo dev --claude take the same flags and run the same session. Bare gen, like bare hanzo dev, opens Hanzo Dev.'],
  ['Does every agent run on Hanzo’s models?', 'Only when you pass --cloud, and only an agent that can name another endpoint. Without it, each agent keeps the account it is signed in to.'],
  ['What does Hanzo bill?', 'On --cloud, the agent’s model calls, on your Hanzo account. On the agent’s own account, only what Hanzo’s tools handled for it.'],
  ['Does Gen change the agent?', 'No. Each agent runs as itself — its own interface and its own commands — and anything after -- goes to it untouched.'],
  ['What license is it under?', 'MIT. The source is hanzoai/gen on GitHub.'],
];

function Questions() {
  return (
    <section className="av-sec xgn-qa" id="qa" aria-labelledby="xgn-qa-h">
      <div className="av-wrap av-grid">
        <div className="xgn-qa-l">
          <Lines as="h2" id="xgn-qa-h" className="av-head" lines={['Questions & Answers']} />
        </div>
        <div className="xgn-qs"><Faq items={QA} multi /></div>
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
    <section className="av-sec xgn-read" id="read" aria-labelledby="xgn-read-h">
      <div className="av-wrap">
        <div className="av-grid xgn-read-top">
          <Lines as="h2" id="xgn-read-h" className="av-head xgn-read-l" lines={['The harness, the agent, the CLI.']} />
          <p className="av-body xgn-read-r">Where to get Gen, what it runs, and the same harness in the CLI.</p>
        </div>
        <div className="xgn-cols">
          {READ.map(([h, items]) => (
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
        <div className="av-grid xgn-paste">
          <div className="xgn-paste-l">
            <p className="av-title">Paste and ship</p>
            <p className="av-body">Paste this into any agent. It reads the skill manifest and calls Gen from there.</p>
          </div>
          <div className="xgn-prompt">
            <pre className="x-mono">{PASTE}</pre>
            <div className="xgn-prompt-f"><span className="xgn-prompt-k x-mono">Agent prompt</span><Copy text={PASTE} label="Copy the agent prompt" /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- the one ending: the black room (the source), which opens out of a rounded card as it arrives ---------- */
function Source() {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.2'] });
  const clip = useTransform(scrollYProgress, [0, 1], ['inset(0% 3% 0% 3% round 24px)', 'inset(0% 0% 0% 0% round 0px)']);
  return (
    <motion.section ref={ref} className="x-band av-sec xgn-src av-dark" id="source" data-room="dark" aria-labelledby="xgn-src-h" style={calm ? undefined : { clipPath: clip }}>
      <div className="av-wrap av-grid">
        <div className="xgn-src-l">
          <Lines as="h2" id="xgn-src-h" className="av-display m" lines={['MIT, in the open.']} />
          <p className="av-lede">The harness, every agent's launcher and how its output is read are on GitHub, one file an agent.</p>
        </div>
        <div className="xgn-src-r">
          <Cta to={KEYS} id="gen.band" size="lg">Get API key</Cta>
          <div className="xgn-src-links">
            <A to="https://docs.hanzo.ai/docs/coding" className="xgn-arrow" data-cta="gen.band-docs">Read the docs →</A>
            <A to="https://github.com/hanzoai/gen" className="xgn-arrow" data-cta="gen.source">The source →</A>
          </div>
        </div>
      </div>
      <ul className="xgn-src-flags x-mono" aria-hidden="true">
        {AGENTS.map(([, f]) => <li key={f}>--{f}</li>)}
      </ul>
    </motion.section>
  );
}

export default function Gen() {
  const [at, setAtState] = useState(1);
  const [mine, setMine] = useState(false);
  const setAt = (i, byHand) => { setAtState(i); if (byHand) setMine(true); };
  const pick = (i) => setAt(i, true);
  return (
    <main className="av xgn" style={{ '--ac': '#737373' }} data-ask="off">
      <Hero at={at} setAt={setAt} mine={mine} />
      <Index />
      <Install />
      <Two />
      <Agents at={at} pick={pick} />
      <Rails at={at} pick={pick} />
      <Cli />
      <Read />
      <Questions />
      <Source />
    </main>
  );
}
