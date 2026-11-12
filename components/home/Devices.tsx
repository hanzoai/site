'use client';
/* The hero's three devices, each drawn as its own product draws itself (9 Nov: "each frame should look like that
   product, with its tabs and its copy"). Every word below is the product's, read from its source:
   - the desktop: hanzo.ai's app as @hanzo/app draws it in a window. The bar holds the sidebar's toggle, then Back and
     Forward; the rail down the window's edge is Chat, Dev, Design, Studio, Tabs, then Library, Scheduled tasks and
     Customize, More, and the account at its foot; beside it the sidebar of the lit place (Chat: New chat, Search,
     Recents. Dev: Work with New run, Projects, Issues, Templates. Studio: Create with New creation, Explore, Library,
     Activity. Tabs: New terminal, New desktop, New browser, New sandbox, Open tabs); the pane is inset in the window.
   - the terminal: `hanzo dev` as it prints, one tab for each of install, up and dev, the session's header, `▶` for
     what is asked, `• Explored`, `• Added`, `• Edited`, `• Ran` with `└` under them.
   - the phone: hanzo.app on a phone, @hanzo/app's mobile layout (what people use): the bar's round glass buttons, the
     conversation, the composer pinned above the home indicator. hanzo/mobile, the native app, is used only where it
     agrees with it.
   The day they play is hanzo.ai's own (hero-scenes.json); a scene lights the place it happens in. Every scene is in the
   page from the first paint (search engines, screen readers); one shows at a time. */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import AGENTS from '../../content/agents';
import { EASE, Mark } from '../ui';
import { Glyph } from './glyphs';
import { track } from '../../lib/track';
import SCENES from './hero-scenes.json';

const pic = (src) => src.replace('/images/models/', '/models/').replace(/^(\/models\/\w+)$/, '$1.webp');
const step = (s) => (Array.isArray(s) ? s[0].replace('{file}', s[1]) : s);

// scene 0 is the hero's own opening (the prompt, the answer, the install); the rest follow it
export const OPEN = SCENES[0];
export const MORE = SCENES.slice(1);
const TERM_TABS = ['install', 'cli', 'dev', 'mcp', 'up'];
const TERM_EXAMPLES = {
  install: [
    {
      cmd: 'curl -fsSL https://hanzo.sh | sh',
      lines: [
        ['out', '  ✓ hanzo (+ hanzo-node, same build)'],
        ['out', '  ✓ hanzo-mcp (+ mcp, same build)'],
        ['out', '  ✓ dev · gen · zt'],
        ['ok', 'ready → ~/.local/bin'],
      ],
    },
    {
      cmd: 'npm i -g hanzo',
      lines: [
        ['out', '  added 1 package in 1.1s'],
        ['out', '  ✓ hanzo · hanzo-mcp · dev'],
        ['ok', 'ready → hanzo auth login'],
      ],
    },
    {
      cmd: 'brew install hanzoai/tap/hanzo',
      lines: [
        ['out', '  ==> Pouring hanzo--arm64.tar.gz'],
        ['out', '  ✓ /opt/homebrew/bin/hanzo'],
        ['ok', 'ready → hanzo auth login'],
      ],
    },
  ],
  cli: [
    {
      cmd: 'hanzo auth login',
      lines: [
        ['out', '  ✓ Signed in as dev@hanzo.ai'],
        ['sub', '$ hanzo usage summary'],
        ['ok', '  today · 1.4M tokens · 0 errors'],
      ],
    },
    {
      cmd: 'hanzo share 3000 --name maxpower',
      lines: [
        ['out', '  ✓ https://maxpower.zt.hanzo.ai → :3000'],
        ['ok', '  zero-trust fabric · TLS ready'],
      ],
    },
    {
      cmd: 'hanzo engine serve zen6',
      lines: [
        ['out', '  ✓ zen6 at http://127.0.0.1:8080/v1'],
        ['ok', '  OpenAI-compatible · local GPU'],
      ],
    },
  ],
  dev: [
    {
      cmd: 'hanzo dev',
      lines: [
        ['ask', '▶ wire up Run all across every agent'],
        ['out', '• Explored app/agents.ts, app/page.tsx'],
        ['out', '• Edited app/page.tsx (+42 -6)'],
        ['ok', '• Ran pnpm test  └ pass'],
      ],
    },
    {
      cmd: 'hanzo dev --claude --codex',
      lines: [
        ['ask', '▶ add a leaderboard and offline cache'],
        ['out', '• Added app/board.tsx (+26 -0)'],
        ['out', '• Edited app/store.ts (+38 -4)'],
        ['ok', '• Ran pnpm test  └ 18 passed'],
      ],
    },
    {
      cmd: 'hanzo "tighten rate limits on /v1/chat"',
      lines: [
        ['out', '• Explored api/chat.ts, lib/limits.ts'],
        ['out', '• Edited api/chat.ts (+19 -3)'],
        ['ok', '• Ran pnpm typecheck  └ ok'],
      ],
    },
  ],
  mcp: [
    {
      cmd: 'npx -y hanzo mcp',
      lines: [
        ['out', '  ✓ hanzo-mcp ready on stdio'],
        ['out', '  13 unified tools · workspace + cloud'],
        ['ok', '  connected · ~/.hanzo/dev/config.toml'],
      ],
    },
    {
      cmd: 'claude mcp add hanzo -- npx -y hanzo mcp',
      lines: [
        ['out', '  Added stdio MCP server hanzo'],
        ['ok', '  ✓ Claude Code connected (13 tools)'],
      ],
    },
    {
      cmd: 'codex mcp add hanzo -- hanzo-mcp',
      lines: [
        ['out', '  Added global MCP server hanzo'],
        ['ok', '  ✓ https://api.hanzo.ai/v1/mcp'],
      ],
    },
  ],
  up: [
    {
      cmd: 'hanzo up',
      lines: [
        ['ok', '✓ k3s is up — API at https://127.0.0.1:6443'],
        ['console', ''],
      ],
    },
    {
      cmd: 'git push && hanzo status',
      lines: [
        ['out', '  To git.hanzo.ai/you/maxpower (main)'],
        ['out', '  applications — 1'],
        ['ok', '  ✓ Healthy / Synced  1'],
      ],
    },
    {
      cmd: 'hanzo serve cloud',
      lines: [
        ['out', '  ✓ iam · kms · gateway · storage · pubsub'],
        ['ok', '  listening on http://127.0.0.1:8000'],
      ],
    },
  ],
};

// the latest scene up to `sc` that has what `has` asks for, or -1
const last = (sc, has) => { for (let i = sc; i >= 0; i--) if (has(MORE[i])) return i; return -1; };
// the place of the app a scene happens in: the Beta scene is a chat
const placeOf = (sc) => (sc < 0 ? 'chat' : MORE[sc].place === 'beta' ? 'chat' : MORE[sc].place);

/* ---------- the desktop ---------- */

const PLACES = [['chat', 'Chat', 'message-square'], ['dev', 'Dev', 'code-xml'], ['design', 'Design', 'wand-sparkles'], ['studio', 'Studio', 'clapperboard'], ['tabs', 'Tabs', 'square-terminal']];
const MORE_PLACES = [['library', 'Library', 'library'], ['scheduled', 'Scheduled tasks', 'clock'], ['customize', 'Customize', 'puzzle'], ['more', 'More', 'ellipsis']];

const CHAT_SCENES = [-1, ...MORE.map((s, i) => (s.place === 'chat' ? i : -99)).filter((i) => i >= 0)];
const DEV_SCENES = MORE.map((s, i) => (s.place === 'dev' ? i : -1)).filter((i) => i >= 0);
const TABS_SCENES = MORE.map((s, i) => (s.place === 'tabs' ? i : -1)).filter((i) => i >= 0);
const PLACE_SCENES = {
  chat: CHAT_SCENES,
  dev: DEV_SCENES,
  design: [1, 4, 5, 19, 25],
  studio: [11, 12, 1, 4, 5, 19, 25],
  tabs: TABS_SCENES,
  beta: [32],
  library: [19, 4, 25],
  scheduled: [30, 14, 24],
  customize: [16, 20, 6],
  more: [32],
};

const Row = ({ icon, on, dot, onClick, children }) => (
  <button type="button" className="xw-row" data-on={on || undefined} onClick={onClick}>
    {icon ? <Glyph name={icon} size={12} /> : dot ? <i className="xw-dot" /> : null}
    <span>{children}</span>
  </button>
);

/* The rail's marks: what the products are, the lit one where the scene is; clicking any jumps straight to that app. */
function Rail({ at, onPick }) {
  const mark = ([id, label, icon]) => (
    <button
      key={id}
      type="button"
      className="xw-mark"
      data-on={id === at || undefined}
      title={label}
      aria-label={label}
      aria-pressed={id === at}
      aria-current={id === at ? 'page' : undefined}
      onClick={() => onPick(id)}
    >
      <Glyph name={icon} size={14} /><span className="xh-sr">{label}</span>
    </button>
  );
  return <nav className="xw-rail" aria-label="Products">{PLACES.map(mark)}<hr />{MORE_PLACES.map(mark)}<Account /></nav>;
}

/* The account at the rail's foot: a real button; the menu is always in the page and opens with a spring. */
function Account() {
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  const btn = useRef(null);
  useEffect(() => {
    if (!open) return;
    const away = (e) => { if (!box.current.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [open]);
  const shut = () => { setOpen(false); btn.current.focus(); };
  return (
    <div className="x-acct" ref={box} onKeyDown={(e) => { if (e.key === 'Escape' && open) shut(); }}>
      <button ref={btn} type="button" className="x-acct-b" aria-label="Account" aria-haspopup="true" aria-expanded={open} onClick={() => { track('hero_demo', { control: 'account' }); setOpen((o) => !o); }}>
        <Glyph name="user" size={13} />
      </button>
      <div className="x-acct-m" data-open={open} inert={!open}>
        <div className="x-acct-who"><b>Developer</b><span>dev@hanzo.ai</span></div>
        {['Profile', 'Personalization', 'Settings', 'Help', 'Log out'].map((t) => <button key={t} type="button" onClick={shut}>{t}</button>)}
      </div>
    </div>
  );
}

/* The sidebar of the lit place. Dev's Recents are the runs the day has made, the newest lit; Tabs lists the sessions open. */
function Side({ sc, onSelectScene }) {
  const [pickedRow, setPickedRow] = useState(null);
  const runs = MORE.slice(0, Math.max(0, sc) + 1).filter((s) => s.place === 'dev').map((s) => s.run).reverse().slice(0, 4);
  const t = last(sc, (s) => s.place === 'tabs');
  const open = (MORE[t] ?? MORE.find((s) => s.place === 'tabs')).panes.map((p) => p.name);
  const go = (key, targetSc, navId) => () => {
    track('hero_demo', { control: key });
    setPickedRow(key);
    onSelectScene?.(targetSc, navId);
  };
  return (
    <>
      <div className="xw-side" data-p="chat">
        <b className="xw-side-t">Chat</b>
        <Row icon="square-pen" on={pickedRow === 'chat-new'} onClick={go('chat-new', -1, 'chat')}>New chat</Row>
        <Row icon="search" on={pickedRow === 'chat-search'} onClick={go('chat-search', 6, 'chat')}>Search</Row>
        <small>Recents</small>
        <Row on={!pickedRow || pickedRow === 'chat-max'} onClick={go('chat-max', -1, 'chat')}>maxpower</Row>
        <Row on={pickedRow === 'chat-launch'} onClick={go('chat-launch', 13, 'chat')}>Launch plan</Row>
        <Row on={pickedRow === 'chat-weekly'} onClick={go('chat-weekly', 28, 'chat')}>Weekly report</Row>
      </div>
      <div className="xw-side" data-p="dev">
        <b className="xw-side-t">Dev</b>
        <Row icon="code-xml" on={pickedRow === 'dev-new'} onClick={go('dev-new', 0, 'dev')}>New run</Row>
        <Row icon="folder-git-2" on={pickedRow === 'dev-proj'} onClick={go('dev-proj', 3, 'dev')}>Projects</Row>
        <Row icon="circle-dot" on={pickedRow === 'dev-iss'} onClick={go('dev-iss', 9, 'dev')}>Issues</Row>
        <Row icon="layout-template" on={pickedRow === 'dev-tpl'} onClick={go('dev-tpl', 15, 'dev')}>Templates</Row>
        <small>Recents</small>
        {(runs.length ? runs : [MORE.find((s) => s.place === 'dev').run]).map((r, i) => {
          const runIdx = MORE.findIndex((s) => s.place === 'dev' && s.run === r);
          return <Row key={r} dot={i === 0} on={pickedRow ? pickedRow === `run-${r}` : i === 0} onClick={go(`run-${r}`, runIdx >= 0 ? runIdx : 0, 'dev')}>{r}</Row>;
        })}
      </div>
      <div className="xw-side" data-p="design">
        <b className="xw-side-t">Design</b>
        <Row icon="wand-sparkles" on={!pickedRow || pickedRow === 'des-new'} onClick={go('des-new', 1, 'design')}>New design</Row>
        <Row icon="layout-template" on={pickedRow === 'des-comp'} onClick={go('des-comp', 4, 'design')}>Components</Row>
        <Row icon="library" on={pickedRow === 'des-brand'} onClick={go('des-brand', 5, 'design')}>Brand kit</Row>
        <Row icon="activity" on={pickedRow === 'des-tok'} onClick={go('des-tok', 25, 'design')}>Tokens</Row>
      </div>
      <div className="xw-side" data-p="studio">
        <b className="xw-side-t">Studio</b>
        <Row icon="square-pen" on={!pickedRow || pickedRow === 'stu-new'} onClick={go('stu-new', 11, 'studio')}>New creation</Row>
        <Row icon="layout-template" on={pickedRow === 'stu-exp'} onClick={go('stu-exp', 12, 'studio')}>Explore</Row>
        <Row icon="library" on={pickedRow === 'stu-lib'} onClick={go('stu-lib', 19, 'studio')}>Library</Row>
        <Row icon="activity" on={pickedRow === 'stu-act'} onClick={go('stu-act', 25, 'studio')}>Activity</Row>
      </div>
      <div className="xw-side" data-p="tabs">
        <b className="xw-side-t">Tabs</b>
        <Row icon="square-terminal" on={pickedRow === 'tab-term'} onClick={go('tab-term', 2, 'tabs')}>New terminal</Row>
        <Row icon="monitor" on={pickedRow === 'tab-desk'} onClick={go('tab-desk', 7, 'tabs')}>New desktop</Row>
        <Row icon="globe" on={pickedRow === 'tab-web'} onClick={go('tab-web', 14, 'tabs')}>New browser</Row>
        <Row icon="cloud" on={pickedRow === 'tab-box'} onClick={go('tab-box', 21, 'tabs')}>New sandbox</Row>
        <small>Open tabs</small>
        {open.map((n, i) => <Row key={n} icon="square-terminal" on={pickedRow ? pickedRow === `open-${n}` : i === 0} onClick={go(`open-${n}`, TABS_SCENES[i % TABS_SCENES.length] ?? 2, 'tabs')}>{n}</Row>)}
      </div>
    </>
  );
}

// Every demo part is in the page from the first paint; the demo only reveals them.
function Bubble({ children, on = true }) {
  return (
    <motion.div className="x-bub me" initial={false} animate={on ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.96 }} aria-hidden={on ? undefined : true} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>
      {children}
    </motion.div>
  );
}

// the chat's app card: the app's artifact beside the chat, "App · desktop and mobile" with Preview (hanzo.ai, 8 Nov)
function AppCard({ on = true, onPreview }) {
  return (
    <motion.div className="x-appcard" initial={false} animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }} aria-hidden={on ? undefined : true} transition={{ duration: 0.6, ease: EASE }}>
      <span className="x-appicon"><Mark size={13} /></span>
      <span><b>maxpower</b><small>App · desktop and mobile</small></span>
      <button type="button" className="x-open" onClick={onPreview}>Preview</button>
    </motion.div>
  );
}

function Scene({ s, on }) {
  const [pickedArt, setPickedArt] = useState(null);
  const ask = s.ask || s.prompt || s.run || s.title;
  const activeArt = pickedArt ?? (s.pick ?? -1);
  return (
    <div className={'xs-scene' + (on ? ' on' : '')} aria-hidden={on ? undefined : true}>
      {s.title && s.ask && <p className="xs-k">{s.title}</p>}
      {ask && <div className="xs-me"><span>{ask}</span></div>}
      {s.answer && <div className="xs-ai"><span>{s.answer}</span></div>}
      {s.steps && <ul className="xs-steps">{s.steps.map((x, i) => <li key={i}><Glyph name="check" size={11} /><span>{step(x)}</span></li>)}</ul>}
      {s.made && (
        <div className="xs-made">
          {s.made.map((m, i) => (
            <button key={i} type="button" className={i === activeArt ? 'on' : ''} aria-label={`Select variation ${i + 1}`} onClick={() => { track('hero_demo', { control: 'studio-art' }); setPickedArt(i); }}>
              <img src={pic(m.src)} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      )}
      {s.status && <p className="xs-status"><span>{s.status}</span></p>}
      {s.panes && (
        <div className="xs-panes x-mono">
          {s.panes.map((p) => (
            <div key={p.name + p.run} className="xs-pane">
              <p className="xs-run"><span>{p.name}</span></p>
              <p className="x-dim"><span>$ {p.run}</span></p>
              <p className="xs-ask"><span>▶ {p.ask}</span></p>
              {p.lines.map((l, i) => <p key={i}><span>{l}</span></p>)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// the composer: Ask Hanzo, the app's own placeholder; `ref` is where the opening's prompt types itself
function Composer({ phase, promptEl, full, typing, onSend }) {
  return (
    <div className="x-input">
      <Glyph name="plus" size={14} />
      <span className="x-input-t">
        {typing ? (
          <>
            <em hidden={phase < 1}>Ask Hanzo</em>
            <span hidden={phase >= 1}><span ref={promptEl} /><span className="x-caret" aria-hidden="true" /></span>
          </>
        ) : <em>Ask Hanzo</em>}
      </span>
      <Glyph name="mic" size={14} />
      <motion.button type="button" className="x-send" aria-label="Send" onClick={onSend} animate={{ scale: typing && full && phase === 0 ? [1, 1.18, 1] : 1 }} transition={{ duration: 0.4 }}><Glyph name="arrow-up" size={14} stroke={2.2} /></motion.button>
    </div>
  );
}

export function Desk({ sc, navPick, onSelectScene, phase, side, onSide, promptEl, full }) {
  const basePlace = placeOf(sc);
  const railAt = navPick || basePlace;
  const viewPlace = railAt === 'design' ? 'design' : basePlace;
  const pickRail = (id) => {
    track('hero_demo', { control: id });
    const list = PLACE_SCENES[id] || [-1];
    const nextSc = railAt === id ? list[(list.indexOf(sc) + 1) % list.length] : list[0];
    onSelectScene?.(nextSc, id);
  };
  const stepScene = (delta) => {
    track('hero_demo', { control: delta < 0 ? 'nav-prev' : 'nav-next' });
    const total = MORE.length + 1; // include -1
    const curIdx = sc + 1;
    const nextIdx = (curIdx + delta + total) % total;
    onSelectScene?.(nextIdx - 1, null);
  };
  const view = (p, children) => <section className="xw-view" data-p={p} aria-hidden={viewPlace === p ? undefined : true}>{children}</section>;
  const scenes = (p) => MORE.map((s, i) => (placeOf(i) === p ? <Scene key={i} s={s} on={i === sc} /> : null));
  return (
    <div className={'x-win' + (side ? '' : ' xs-noside')} data-place={viewPlace}>
      <div className="x-win-bar">
        <i /><i /><i />
        <button type="button" className="xs-sidet" aria-expanded={side} aria-label={side ? 'Close sidebar' : 'Open sidebar'} onClick={() => { track('hero_demo', { control: 'sidebar' }); onSide(); }}>
          <Glyph name="panel-left" size={14} />
          <span className="xs-tip"><span hidden={!side}>Close sidebar</span><span hidden={side}>Open sidebar</span></span>
        </button>
        <span className="xw-nav">
          <button type="button" className="xw-nav-b" aria-label="Previous scene" onClick={() => stepScene(-1)}><Glyph name="chevron-left" size={14} /></button>
          <button type="button" className="xw-nav-b" aria-label="Next scene" onClick={() => stepScene(1)}><Glyph name="chevron-right" size={14} /></button>
        </span>
        <a className="x-win-open" href="https://hanzo.app" data-cta="home.hero-open-app"><span>Open App</span><svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" /></svg></a>
      </div>
      <div className="x-win-body">
        <Rail at={railAt} onPick={pickRail} />
        <aside className="x-side"><Side sc={sc} onSelectScene={onSelectScene} /></aside>
        <div className="xw-pane" data-scene={sc >= 0 ? '' : undefined}>
          {view('chat', (
            <>
              <div className="xw-log">
                <div className="xw-open">
                  <Bubble on={phase >= 1}>{OPEN.ask}</Bubble>
                  <motion.div className="xs-ai" initial={false} animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }} aria-hidden={phase >= 2 ? undefined : true} transition={{ duration: 0.6, ease: EASE }}><span>{OPEN.answer}</span></motion.div>
                  <AppCard on={phase >= 2} onPreview={() => pickRail('dev')} />
                </div>
                {scenes('chat')}
              </div>
              <Composer phase={phase} promptEl={promptEl} full={full} typing onSend={() => pickRail('chat')} />
            </>
          ))}
          {view('dev', <div className="xw-log">{scenes('dev')}</div>)}
          {view('design', (<><div className="xw-log">{scenes('studio')}</div><Composer phase={phase} onSend={() => pickRail('design')} /></>))}
          {view('studio', (<><div className="xw-log">{scenes('studio')}</div><Composer phase={phase} onSend={() => pickRail('studio')} /></>))}
          {view('tabs', <div className="xw-log">{scenes('tabs')}</div>)}
        </div>
      </div>
    </div>
  );
}

/* ---------- the terminal ---------- */

/* A line as the terminal prints it. Each comes `after` the one before it: a scene's lines arrive one by one. */
function Lines({ lines }) {
  let t = 0;
  return lines.map(([after, kind, text], k) => {
    t += after;
    return (
      <p key={k} className={kind} style={{ '--d': t + 'ms' }}>
        <span>{kind === 'run' ? <><span className="x-dim">$ </span>{text}</> : kind === 'ask' ? <><span className="xt-ask">▶ </span>{text}</> : text}</span>
      </p>
    );
  });
}

/* What `hanzo up` leaves on screen: the Sandboxes console (hanzoai/cli src/commands/up/tui.rs), its views, the agents it
   runs in their own microVMs, and the hosts they reached. */
const SANDBOXES = [
  ['hanzo-dev-agent', 'Hanzo Dev', 'runc (native GPU)', '8%', '1h 14m'],
  ['claude-docs', 'Claude Code', 'microvm', '4%', '39s'],
];
function Console({ on }) {
  return (
    <div className="xt-con" data-shown={on || undefined}>
      <p className="xt-con-h"><b>Hanzo Sandboxes</b><span>● iam:3690</span></p>
      <p className="xt-con-v"><span>1: Compute</span><b>2: Sandboxes</b><span>3: Local Models</span><span>4: Cloud Services</span></p>
      {SANDBOXES.map((r) => <p key={r[0]} className="xt-con-r"><span>● {r[0]}</span>{r.slice(1).map((c, i) => <span key={i}>{c}</span>)}</p>)}
      <p className="xt-con-n"><span>github.com</span> Allowed · <span>api.anthropic.com</span> Allowed</p>
    </div>
  );
}

export function Term({ onSelectScene, calm, inView = true, copy, copied }) {
  const box = useRef(null);
  const live = useRef(true);
  live.current = inView;
  const hoverRef = useRef(false);
  const firstRun = useRef(true);
  const [pinned, setPinned] = useState(false);
  const [cursor, setCursor] = useState({ tabIdx: 0, exIdx: 0, round: 0, mode: 'auto', rem: 0, seq: 0 });
  const tab = TERM_TABS[cursor.tabIdx];
  const list = TERM_EXAMPLES[tab];
  const ex = list[cursor.exIdx % list.length];
  const [typedLen, setTypedLen] = useState(() => ex.cmd.length);
  const [shownOut, setShownOut] = useState(() => ex.lines.length);

  useEffect(() => {
    if (!pinned) return;
    const away = (e) => { if (box.current && !box.current.contains(e.target)) setPinned(false); };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [pinned]);

  useEffect(() => {
    if (calm) {
      setTypedLen(ex.cmd.length);
      setShownOut(ex.lines.length);
      return;
    }
    let dead = false;
    const nap = (ms) => new Promise((r) => setTimeout(r, ms));
    const opening = firstRun.current && cursor.seq === 0 && cursor.tabIdx === 0 && cursor.exIdx === 0;
    firstRun.current = false;
    if (opening) {
      setTypedLen(ex.cmd.length);
      setShownOut(ex.lines.length);
    } else {
      setTypedLen(0);
      setShownOut(0);
    }
    (async () => {
      if (!opening) {
        await nap(180);
        for (let i = 1; i <= ex.cmd.length; i++) {
          if (dead) return;
          setTypedLen(i);
          await nap(ex.cmd[i - 1] === ' ' ? 38 : 22);
        }
        await nap(240);
        for (let j = 1; j <= ex.lines.length; j++) {
          if (dead) return;
          setShownOut(j);
          await nap(165);
        }
      }
      await nap(opening ? 3800 : 2400);
      while (!dead && (!live.current || hoverRef.current)) await nap(250);
      if (dead) return;
      setCursor((prev) => {
        if (prev.mode === 'tab' && prev.rem > 0) {
          const curList = TERM_EXAMPLES[TERM_TABS[prev.tabIdx]];
          return { ...prev, exIdx: (prev.exIdx + 1) % curList.length, rem: prev.rem - 1, seq: prev.seq + 1 };
        }
        const nextTab = (prev.tabIdx + 1) % TERM_TABS.length;
        const nextRound = nextTab === 0 ? prev.round + 1 : prev.round;
        const nextList = TERM_EXAMPLES[TERM_TABS[nextTab]];
        return { tabIdx: nextTab, exIdx: nextRound % nextList.length, round: nextRound, mode: 'auto', rem: 0, seq: prev.seq + 1 };
      });
    })();
    return () => { dead = true; };
  }, [cursor.seq, calm]); // eslint-disable-line react-hooks/exhaustive-deps

  const pickTab = (i) => {
    const name = TERM_TABS[i];
    track('hero_demo', { control: `term-${name}` });
    setPinned(true);
    setCursor((prev) => {
      const targetList = TERM_EXAMPLES[name];
      const nextEx = prev.tabIdx === i ? (prev.exIdx + 1) % targetList.length : 0;
      return { ...prev, tabIdx: i, exIdx: nextEx, mode: 'tab', rem: targetList.length - 1, seq: prev.seq + 1 };
    });
    if (name === 'install') onSelectScene?.(-1, 'chat');
    else if (name === 'dev') onSelectScene?.(DEV_SCENES[0] ?? 0, 'dev');
    else if (name === 'mcp' || name === 'cli') onSelectScene?.(TABS_SCENES[0] ?? 2, 'tabs');
    else if (name === 'up') onSelectScene?.(3, 'dev');
  };

  const typing = !calm && typedLen < ex.cmd.length;

  return (
    <div
      ref={box}
      className="x-term"
      data-active={pinned || copied || undefined}
      onPointerEnter={() => { hoverRef.current = true; }}
      onPointerLeave={() => { hoverRef.current = false; }}
      onClick={() => setPinned(true)}
    >
      <div className="x-term-bar" role="tablist" aria-label="Terminal">
        <i /><i /><i />
        {TERM_TABS.map((t, i) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={i === cursor.tabIdx}
            className="xt-tab"
            onClick={(e) => { e.stopPropagation(); pickTab(i); }}
          >
            {t}
          </button>
        ))}
        <span className="xt-dots" aria-hidden="true">
          {list.map((_, idx) => <b key={idx} data-on={(cursor.exIdx % list.length) === idx || undefined} />)}
        </span>
      </div>
      <div className="x-term-body x-mono">
        <div key={`${tab}-${cursor.exIdx}-${cursor.seq}`} className="xs-sh on">
          <p className="run">
            <span>
              <span className="x-dim">$ </span>
              <span className="xh-cmd" data-cmd={ex.cmd}>{calm ? ex.cmd : ex.cmd.slice(0, typedLen)}</span>
              {typing && <span className="x-caret" aria-hidden="true" />}
            </span>
          </p>
          {/* every line of the example is laid out from the start and shown in turn, so nothing above it moves */}
          <div className="xt-out">
            {ex.lines.map(([kind, text], idx) => (kind === 'console'
              ? <Console key={idx} on={idx < shownOut} />
              : <p key={idx} className={kind} data-shown={idx < shownOut || undefined}><span>{text}</span></p>))}
          </div>
        </div>
      </div>
      <div className="x-term-f">
        <button type="button" className="x-term-copy xh-copy" onClick={(e) => { e.stopPropagation(); setPinned(true); copy(); }} data-cta="home.install_copy" data-on={copied || undefined}>{copied ? 'Copied' : 'Copy install CLI →'}</button>
        <span className="xh-sr" role="status">{copied ? 'Copied' : ''}</span>
      </div>
    </div>
  );
}

/* ---------- the phone ---------- */

// the app's two round glass buttons (@hanzo/app Bar): the drawer's mark, two strokes with the lower one shorter, and New chat's pen
const Drawer = () => <svg width="11" height="7" viewBox="0 0 19 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M1 1h17M1 10h10.5" /></svg>;
const Flask = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
    <path d="M8.5 2h7" />
    <path d="M7 16h10" />
  </svg>
);
const PHONE_PLACES = [
  ['chat', 'Chat', 'message-square'],
  ['dev', 'Dev', 'code-xml'],
  ['design', 'Design', 'wand-sparkles'],
  ['studio', 'Studio', 'clapperboard'],
  ['tabs', 'Tabs', 'square-terminal'],
  ['beta', 'Beta', 'flask'],
];
const OPEN_TRACE = [
  '• Connected 9 coding & frontier agents',
  '• Shared 1 unified Hanzo API key',
  '• Synced desktop, CLI & Duo live view',
  '  └ ready in 1.8s',
];
const AGENT_ICON = Object.fromEntries(AGENTS.map((a) => [a.name, a.icon]));
const DUO_AGENTS = [
  ['Hanzo Dev', 'Hanzo Dev', 164],
  ['Claude Code', 'Claude Code', 142],
  ['Codex', 'Codex', 118],
  ['Gemini CLI', 'Gemini', 96],
  ['Antigravity', 'Antigravity', 185],
  ['Cursor', 'Cursor', 156],
  ['ChatGPT', 'ChatGPT', 124],
  ['DeepSeek', 'DeepSeek', 172],
  ['Grok', 'Grok', 150],
];
const DUO_ROUTES = ['Zen6', 'Opus 4.8', 'GPT-5.6', 'Fable 5', 'Zen6 Max'];

function PhoneBar({ at, onPick, onNew }) {
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  const btn = useRef(null);
  useEffect(() => {
    if (!open) return;
    const away = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [open]);
  const shut = () => { setOpen(false); btn.current?.focus(); };
  const newIcon = at === 'dev' ? 'code-xml' : at === 'tabs' ? 'square-terminal' : at === 'design' ? 'wand-sparkles' : at === 'studio' ? 'clapperboard' : 'square-pen';
  return (
    <div className="xm-bar-glass" ref={box} onKeyDown={(e) => { if (e.key === 'Escape' && open) shut(); }}>
      <button
        ref={btn}
        type="button"
        className="xm-round"
        aria-label="Menu"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => { track('hero_demo', { control: 'phone-menu' }); setOpen((o) => !o); }}
      >
        <Drawer />
      </button>
      <button
        type="button"
        className="xm-round"
        aria-label="New chat"
        onClick={() => { track('hero_demo', { control: 'phone-new' }); setOpen(false); onNew(); }}
      >
        <Glyph name={newIcon} size={11} stroke={1.9} />
      </button>
      <div className="xm-menu" data-open={open} inert={!open}>
        {PHONE_PLACES.map(([id, label, icon]) => (
          <button
            key={id}
            type="button"
            className="xm-menu-b"
            data-on={id === at || undefined}
            onClick={() => {
              track('hero_demo', { control: `phone-${id}` });
              setOpen(false);
              onPick(id);
            }}
          >
            {icon === 'flask' ? <Flask /> : <Glyph name={icon} size={11} stroke={1.9} />}
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* One turn on the mobile / Duo left screen: what was asked, then the answer or agent output. */
function Turn({ ask, on, answer, children }) {
  return (
    <div className="xm-turn" data-on={on ? '' : undefined} aria-hidden={on ? undefined : true}>
      {ask && <div className="xm-me"><span>{ask}</span></div>}
      <div className="xm-ai" data-on={answer ? '' : undefined}>
        {children}
      </div>
    </div>
  );
}

function PhoneComposer({ id }) {
  const [draft, setDraft] = useState('');
  const submit = () => {
    const q = draft.trim();
    if (!q) return;
    track('hero_demo', { control: 'phone-ask' });
    setDraft('');
    if (typeof window !== 'undefined') {
      window.location.assign(`https://hanzo.app/chat?q=${encodeURIComponent(q)}&anon=true`);
    }
  };
  return (
    <div className="xm-pill-comp">
      <input
        id={id}
        type="text"
        value={draft}
        placeholder="Ask anything"
        aria-label="Ask anything"
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } }}
      />
      <button type="button" className="xm-pill-send" data-ready={draft.trim() ? '' : undefined} aria-label="Send" onClick={submit}>
        <Glyph name="arrow-up" size={10} stroke={2.4} />
      </button>
    </div>
  );
}

/* The phone is hanzo.app on an iPhone Duo / Fold (9:16 closed on its right half, turning open on its center hinge via
   3D rotateY(-180deg) into the 9:8 Duo split-screen with hanzo.app on the left half and live maxpower on the right half). */
export function Phone({ sc, navPick, onSelectScene, phase }) {
  const [foldPick, setFoldPick] = useState(null);
  const [pickedArt, setPickedArt] = useState(0);
  const [off, setOff] = useState(() => new Set());
  const [tick, setTick] = useState(0);
  const [pump, setPump] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { setPickedArt(0); }, [sc]);

  const cur = sc >= 0 ? MORE[sc] : null;
  const rawPlace = sc < 0 ? 'chat' : cur?.place || 'chat';
  const mobilePlace = navPick && PLACE_SCENES[navPick] ? navPick : rawPlace;
  // the Duo opens and closes at its hinge alone (the seam down the middle): never by the demo, never by another control
  const duo = foldPick ?? false;
  const flip = () => { track('hero_demo', { control: 'phone-duo' }); setFoldPick((v) => !v); };

  const pickMobilePlace = (id, advance = false) => {
    const list = PLACE_SCENES[id] || [-1];
    const nextSc = (advance || mobilePlace === id) ? list[(list.indexOf(sc) + 1) % list.length] : list[0];
    onSelectScene?.(nextSc, id === 'beta' ? 'chat' : id);
  };

  const shipped = new Set();
  for (let i = 0; i <= sc && i < MORE.length; i++) if (MORE[i]?.ships) shipped.add(MORE[i].ships);

  const allOn = off.size === 0;
  const toggleLane = (name) => {
    setOff((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };
  const toggleAll = () => setOff(allOn ? new Set(DUO_AGENTS.map(([n]) => n)) : new Set());
  const runAll = () => { setPump(true); setTimeout(() => setPump(false), 2600); };
  const flowing = DUO_AGENTS.length - off.size;
  const spent = ((tick + 4) * Math.max(1, flowing) * 0.0001).toFixed(4);

  const duoCard = (isInner) => (
    <div className="xm-duo-card">
      <span className="xm-duo-card-i"><Mark size={11} /></span>
      <span className="xm-duo-card-t"><b>maxpower</b><small>Mobile + Duo app</small></span>
      <span className="xm-duo-open" data-folded={!isInner || undefined}>
        {isInner ? (<><Glyph name="check" size={10} stroke={2.6} /><span>Fold</span></>) : 'Open'}
      </span>
    </div>
  );

  const renderSceneTurn = (s, i, isInner) => {
    const isOn = i === sc;
    const askText = s.phone?.ask || s.ask || s.prompt || s.run || s.title;
    if (s.place === 'beta') {
      const cells = isInner
        ? [...(s.phone?.cells || []), '• Early access to Zen6 & Enso', '• Cloud sandboxes + mobile Duo']
        : (s.phone?.cells || []).slice(0, 3);
      return (
        <Turn key={i} ask={s.title || askText} on={isOn} answer>
          {s.answer && <p>{s.answer}</p>}
          <pre className="xm-code x-mono">{cells.join('\n')}</pre>
          <a className="xm-beta-link" href="/beta">hanzo.ai/beta →</a>
          {isInner && duoCard(true)}
        </Turn>
      );
    }
    if (s.made) {
      const artIdx = pickedArt < s.made.length ? pickedArt : (s.pick ?? 0);
      return (
        <Turn key={i} ask={s.prompt} on={isOn} answer>
          {isInner ? (
            <>
              <div className="xm-made-grid">
                {s.made.slice(0, 3).map((m, idx) => (
                  <button key={idx} type="button" className={idx === artIdx ? 'on' : ''} aria-label={`Variation ${idx + 1}`} onClick={() => setPickedArt(idx)}>
                    <img src={pic(m.src)} alt="" loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
              <p className="xm-meta">{s.status || `${mobilePlace === 'design' ? 'Design' : 'Studio'} · 3 variations ready`}</p>
            </>
          ) : (
            <img className="xm-art" src={pic(s.made[artIdx].src)} alt="" loading="lazy" decoding="async" />
          )}
          {isInner && duoCard(true)}
        </Turn>
      );
    }
    if (s.panes) {
      const panes = isInner ? s.panes.slice(0, 2) : s.panes.slice(0, 1);
      const lines = panes.flatMap((p) => [
        `$ ${p.run}`,
        `▶ ${p.ask}`,
        ...p.lines.slice(0, isInner ? 3 : 2),
      ]);
      return (
        <Turn key={i} ask={s.phone?.ask || s.panes[0]?.ask} on={isOn} answer>
          <pre className="xm-code x-mono">{lines.join('\n')}</pre>
          {isInner && duoCard(true)}
        </Turn>
      );
    }
    if (s.steps || s.phone) {
      const stepLines = (s.steps || []).map((x) => `✓ ${step(x)}`);
      const cellLines = s.phone?.cells || [];
      const merged = isInner
        ? [...stepLines, ...cellLines.filter((c) => !stepLines.some((st) => c.includes(st.slice(2))))]
        : (cellLines.length ? cellLines : stepLines).slice(0, 3);
      return (
        <Turn key={i} ask={askText} on={isOn} answer>
          {s.answer && <p>{s.answer}</p>}
          <pre className="xm-code x-mono">{merged.join('\n')}</pre>
          {isInner && duoCard(true)}
        </Turn>
      );
    }
    const extraLines = isInner && s.shell?.lines
      ? s.shell.lines.slice(0, 4).map(([, kind, txt]) => (kind === 'run' ? `$ ${txt}` : kind === 'ask' ? `▶ ${txt}` : txt))
      : null;
    return (
      <Turn key={i} ask={askText} on={isOn} answer>
        {s.answer && <p>{s.answer}</p>}
        {extraLines && <pre className="xm-code x-mono">{extraLines.join('\n')}</pre>}
        {duoCard(isInner)}
      </Turn>
    );
  };

  const renderTurns = (isInner) => (
    <>
      <h2 className="xm-hi" data-on={!isInner && sc < 0 && phase < 1 ? '' : undefined}>What’s up?</h2>
      <Turn ask={OPEN.ask} on={sc < 0 && (isInner || phase >= 1)} answer={isInner || phase >= 2}>
        <p>{OPEN.answer}</p>
        {isInner && <pre className="xm-code x-mono">{OPEN_TRACE.join('\n')}</pre>}
        {duoCard(isInner)}
      </Turn>
      {MORE.map((s, i) => renderSceneTurn(s, i, isInner))}
    </>
  );

  return (
    <div className={'x-phone' + (duo ? ' duo' : '')}>
      <div className="xm-stage">
        {/* Stationary inner-right half: titanium frame + live maxpower app, revealed as the left leaf unfolds */}
        <div className="xm-base" aria-hidden={duo ? undefined : true}>
          <div className="xm-scr-r">
            <div className="xm-status-r" aria-hidden="true">
              <Glyph name="signal" size={10} stroke={2.1} />
              <Glyph name="wifi" size={10} stroke={2.1} />
              <Glyph name="battery-full" size={12} stroke={1.9} />
            </div>
            <div className="xm-duo-wrap">
              <div className="xm-duo">
                <div className="xm-duo-h">
                  <span className="xm-duo-brand">
                    <span className="xm-duo-icon"><Mark size={10} /></span>
                    <b>maxpower</b>
                  </span>
                  <span className="xm-duo-all">
                    <span>{allOn ? 'All on' : 'All off'}</span>
                    <button type="button" role="switch" aria-checked={allOn} aria-label="Toggle all agents" className="xm-sw" onClick={toggleAll}><i /></button>
                  </span>
                </div>
                <div className="xm-duo-lanes">
                  {DUO_AGENTS.map(([name, iconKey, rate], i) => {
                    const isOn = !off.has(name);
                    const model = DUO_ROUTES[(i + Math.floor(tick / 4)) % DUO_ROUTES.length];
                    const sway = 0.86 + 0.14 * Math.sin(tick * 0.65 + i * 1.7);
                    const tok = Math.round(rate * sway * (pump ? 1.65 : 1));
                    const svg = AGENT_ICON[iconKey];
                    return (
                      <div key={name} className="xm-lane" data-off={!isOn || undefined}>
                        <span className="xm-lane-i" aria-hidden="true">
                          {svg ? <span dangerouslySetInnerHTML={{ __html: svg }} /> : <Mark size={10} />}
                        </span>
                        <div className="xm-lane-t">
                          <span>{name}</span>
                          <div className="xm-lane-sub">
                            {isOn ? (<><b>{model}</b><code>{tok}/s</code></>) : <code>Off</code>}
                          </div>
                        </div>
                        <button type="button" role="switch" aria-checked={isOn} aria-label={name} className="xm-sw" onClick={() => toggleLane(name)}><i /></button>
                      </div>
                    );
                  })}
                </div>
                <div className="xm-meter" aria-hidden="true">
                  <div className="xm-bars">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((b) => {
                      const swing = Math.abs(Math.sin(tick * 1.1 + b * 0.8));
                      const level = 0.22 + (flowing / DUO_AGENTS.length) * (pump ? 0.75 : 0.42) * swing;
                      return <i key={b} style={{ transform: `scaleY(${level.toFixed(2)})`, opacity: (0.38 + 0.62 * swing).toFixed(2) }} />;
                    })}
                  </div>
                  <div className="xm-meter-f">
                    <span>{pump ? <b>MAX POWER</b> : `$${spent}`}</span>
                    <span>demo</span>
                  </div>
                </div>
                {(shipped.has('offline') || shipped.has('board')) && (
                  <div className="xm-duo-pills">
                    {shipped.has('offline') && <span className="xm-duo-pill">Works offline</span>}
                    {shipped.has('board') && <span className="xm-duo-pill">Leaderboard: you</span>}
                  </div>
                )}
                {(shipped.has('run') || sc < 0) && (
                  <button type="button" className="xm-duo-run" onClick={runAll}>Run all</button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3D book-folding leaf: front face = closed 9:16 cover iPhone; back face = inner-left 9:8 Duo screen */}
        <div className="xm-leaf">
          <div className="xm-face-front" aria-hidden={duo ? true : undefined}>
            <div className="xm-cover">
              <div className="xm-status-cover" aria-hidden="true">
                <b>9:41</b>
                <span className="x-island" />
                <span className="xm-sys">
                  <Glyph name="signal" size={10} stroke={2.1} />
                  <Glyph name="wifi" size={10} stroke={2.1} />
                  <Glyph name="battery-full" size={12} stroke={1.9} />
                </span>
              </div>
              <PhoneBar at={mobilePlace} onPick={(id) => pickMobilePlace(id, false)} onNew={() => pickMobilePlace(mobilePlace, true)} />
              <div className="xm-main">{renderTurns(false)}</div>
              <div className="xm-foot">{!duo ? <PhoneComposer id="xm-ask-cover" /> : <div className="xm-pill-comp" aria-hidden="true"><span>Ask anything</span><span className="xm-pill-send"><Glyph name="arrow-up" size={10} stroke={2.4} /></span></div>}</div>
              <i className="xm-home" aria-hidden="true" />
            </div>
          </div>

          <div className="xm-face-back" aria-hidden={duo ? undefined : true}>
            <div className="xm-scr-l">
              <div className="xm-status-l" aria-hidden="true"><b>9:41</b></div>
              <PhoneBar at={mobilePlace} onPick={(id) => pickMobilePlace(id, false)} onNew={() => pickMobilePlace(mobilePlace, true)} />
              <div className="xm-main">{renderTurns(true)}</div>
              <div className="xm-foot">{duo ? <PhoneComposer id="xm-ask-duo" /> : <div className="xm-pill-comp" aria-hidden="true"><span>Ask anything</span><span className="xm-pill-send"><Glyph name="arrow-up" size={10} stroke={2.4} /></span></div>}</div>
            </div>
          </div>
        </div>

        {/* Optical center fold crease + interactive hinge seam */}
        <i className="xm-crease" aria-hidden="true" />
        <button type="button" className="xm-hinge" data-cue="flip" title={duo ? 'Fold' : 'Unfold'} aria-label={duo ? 'Fold the phone' : 'Unfold the phone'} aria-pressed={duo} onClick={flip} />
      </div>
      <a className="x-phone-dl" href="/download"><span>Download App</span><svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" /></svg></a>
    </div>
  );
}
