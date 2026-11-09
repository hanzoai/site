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
import { EASE, Mark } from '../ui';
import { Glyph } from './glyphs';
import { track } from '../../lib/track';
import SCENES from './hero-scenes.json';

const pic = (src) => src.replace('/images/models/', '/models/').replace(/^(\/models\/\w+)$/, '$1.webp');
const step = (s) => (Array.isArray(s) ? s[0].replace('{file}', s[1]) : s);

// scene 0 is the hero's own opening (the prompt, the answer, the install); the rest follow it
export const OPEN = SCENES[0];
export const MORE = SCENES.slice(1);
const TABS = [...new Set(SCENES.flatMap((s) => (s.shell ? [s.shell.tab] : [])))];

// the latest scene up to `sc` that has what `has` asks for, or -1
const last = (sc, has) => { for (let i = sc; i >= 0; i--) if (has(MORE[i])) return i; return -1; };
// the place of the app a scene happens in: the Beta scene is a chat
const placeOf = (sc) => (sc < 0 ? 'chat' : MORE[sc].place === 'beta' ? 'chat' : MORE[sc].place);

/* ---------- the desktop ---------- */

const PLACES = [['chat', 'Chat', 'message-square'], ['dev', 'Dev', 'code-xml'], ['design', 'Design', 'wand-sparkles'], ['studio', 'Studio', 'clapperboard'], ['tabs', 'Tabs', 'square-terminal']];
const MORE_PLACES = [['library', 'Library', 'library'], ['scheduled', 'Scheduled tasks', 'clock'], ['customize', 'Customize', 'puzzle'], ['more', 'More', 'ellipsis']];

const Row = ({ icon, on, dot, children }) => (
  <div className="xw-row" data-on={on || undefined}>
    {icon ? <Glyph name={icon} size={12} /> : dot ? <i className="xw-dot" /> : null}
    <span>{children}</span>
  </div>
);

/* The rail's marks: what the products are, the lit one where the scene is. */
function Rail({ at }) {
  const mark = ([id, label, icon]) => (
    <span key={id} className="xw-mark" data-on={id === at || undefined} title={label} aria-current={id === at ? 'page' : undefined}>
      <Glyph name={icon} size={14} /><span className="xh-sr">{label}</span>
    </span>
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
function Side({ sc }) {
  const runs = MORE.slice(0, sc + 1).filter((s) => s.place === 'dev').map((s) => s.run).reverse().slice(0, 4);
  const t = last(sc, (s) => s.place === 'tabs');
  const open = (MORE[t] ?? MORE.find((s) => s.place === 'tabs')).panes.map((p) => p.name);
  return (
    <>
      <div className="xw-side" data-p="chat">
        <Row icon="square-pen">New chat</Row>
        <Row icon="search">Search</Row>
        <small>Recents</small>
        <Row on>maxpower</Row><Row>Launch plan</Row><Row>Weekly report</Row>
      </div>
      <div className="xw-side" data-p="dev">
        <small>Work</small>
        <Row icon="code-xml">New run</Row>
        <Row icon="folder-git-2">Projects</Row>
        <Row icon="circle-dot">Issues</Row>
        <Row icon="layout-template">Templates</Row>
        <small>Recents</small>
        {(runs.length ? runs : [MORE.find((s) => s.place === 'dev').run]).map((r, i) => <Row key={r} dot={i === 0} on={i === 0}>{r}</Row>)}
      </div>
      <div className="xw-side" data-p="studio">
        <small>Create</small>
        <Row icon="square-pen">New creation</Row>
        <Row icon="layout-template">Explore</Row>
        <Row icon="library">Library</Row>
        <Row icon="activity">Activity</Row>
      </div>
      <div className="xw-side" data-p="tabs">
        <Row icon="square-terminal">New terminal</Row>
        <Row icon="monitor">New desktop</Row>
        <Row icon="globe">New browser</Row>
        <Row icon="cloud">New sandbox</Row>
        <small>Open tabs</small>
        {open.map((n, i) => <Row key={n} icon="square-terminal" on={i === 0}>{n}</Row>)}
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
function AppCard({ on = true }) {
  return (
    <motion.div className="x-appcard" initial={false} animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }} aria-hidden={on ? undefined : true} transition={{ duration: 0.6, ease: EASE }}>
      <span className="x-appicon"><Mark size={13} /></span>
      <span><b>maxpower</b><small>App · desktop and mobile</small></span>
      <span className="x-open">Preview</span>
    </motion.div>
  );
}

function Scene({ s, on }) {
  const ask = s.ask || s.prompt || s.run || s.title;
  return (
    <div className={'xs-scene' + (on ? ' on' : '')} aria-hidden={on ? undefined : true}>
      {s.title && s.ask && <p className="xs-k">{s.title}</p>}
      {ask && <div className="xs-me"><span>{ask}</span></div>}
      {s.answer && <div className="xs-ai"><span>{s.answer}</span></div>}
      {s.steps && <ul className="xs-steps">{s.steps.map((x, i) => <li key={i}><Glyph name="check" size={11} /><span>{step(x)}</span></li>)}</ul>}
      {s.made && (
        <div className="xs-made">
          {s.made.map((m, i) => <span key={i} className={i === (s.pick ?? -1) ? 'on' : ''}><img src={pic(m.src)} alt="" loading="lazy" decoding="async" /></span>)}
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
function Composer({ phase, promptEl, full, typing }) {
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
      <motion.span className="x-send" animate={{ scale: typing && full && phase === 0 ? [1, 1.18, 1] : 1 }} transition={{ duration: 0.4 }}><Glyph name="arrow-up" size={14} stroke={2.2} /></motion.span>
    </div>
  );
}

export function Desk({ sc, phase, side, onSide, promptEl, full }) {
  const at = placeOf(sc);
  const view = (p, children) => <section className="xw-view" data-p={p} aria-hidden={at === p ? undefined : true}>{children}</section>;
  const scenes = (p) => MORE.map((s, i) => (placeOf(i) === p ? <Scene key={i} s={s} on={i === sc} /> : null));
  return (
    <motion.div className={'x-win' + (side ? '' : ' xs-noside')} data-place={at} initial={{ opacity: 0, z: -260, y: 40 }} animate={{ opacity: 1, z: 0, y: 0 }} transition={{ duration: 1.3, ease: EASE, delay: 0.15 }}>
      <div className="x-win-bar">
        <i /><i /><i />
        <button type="button" className="xs-sidet" aria-expanded={side} aria-label={side ? 'Close sidebar' : 'Open sidebar'} onClick={() => { track('hero_demo', { control: 'sidebar' }); onSide(); }}>
          <Glyph name="panel-left" size={14} />
          <span className="xs-tip"><span hidden={!side}>Close sidebar</span><span hidden={side}>Open sidebar</span></span>
        </button>
        <span className="xw-nav" aria-hidden="true"><Glyph name="chevron-left" size={14} /><Glyph name="chevron-right" size={14} /></span>
      </div>
      <div className="x-win-body">
        <Rail at={at} />
        <aside className="x-side"><Side sc={sc} /></aside>
        <div className="xw-pane" data-scene={sc >= 0 ? '' : undefined}>
          {view('chat', (
            <>
              <div className="xw-log">
                <div className="xw-open">
                  <Bubble on={phase >= 1}>{OPEN.ask}</Bubble>
                  <motion.div className="xs-ai" initial={false} animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }} aria-hidden={phase >= 2 ? undefined : true} transition={{ duration: 0.6, ease: EASE }}><span>{OPEN.answer}</span></motion.div>
                  <AppCard on={phase >= 2} />
                </div>
                {scenes('chat')}
              </div>
              <Composer phase={phase} promptEl={promptEl} full={full} typing />
            </>
          ))}
          {view('dev', <div className="xw-log">{scenes('dev')}</div>)}
          {view('studio', (<><div className="xw-log">{scenes('studio')}</div><Composer phase={phase} /></>))}
          {view('tabs', <div className="xw-log">{scenes('tabs')}</div>)}
        </div>
      </div>
    </motion.div>
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

export function Term({ sc, cmdEl, done, copy, copied, cmd }) {
  // the terminal holds what the last session printed until the next one starts
  const at = last(sc, (s) => s.shell);
  const tab = at >= 0 ? MORE[at].shell.tab : TABS[0];
  return (
    <motion.div className="x-term" initial={{ opacity: 0, z: -120, y: 70 }} animate={{ opacity: 1, z: 70, y: 0 }} transition={{ duration: 1.3, ease: EASE, delay: 0.35 }}>
      <div className="x-term-bar" role="tablist" aria-label="Terminal">
        <i /><i /><i />
        {TABS.map((t) => <span key={t} role="tab" aria-selected={t === tab} className="xt-tab">{t}</span>)}
      </div>
      <div className="x-term-body x-mono">
        <div className={'xs-sh xt-open' + (at < 0 ? ' on' : '')} aria-hidden={at < 0 ? undefined : true}>
          <p className="run"><span><span className="x-dim">$ </span><span ref={cmdEl} className="xh-cmd" data-cmd={cmd} />{!done && <span className="x-caret" aria-hidden="true" />}</span></p>
          <div className="xt-out" data-on={done || undefined}><Lines lines={OPEN.shell.lines.slice(1)} /></div>
        </div>
        {MORE.map((s, i) => (s.shell ? <div key={i} className={'xs-sh' + (i === at ? ' on' : '')} aria-hidden={i === at ? undefined : true}><Lines lines={s.shell.lines} /></div> : null))}
      </div>
      <div className="x-term-f">
        <button type="button" className="x-term-copy xh-copy" onClick={copy} data-cta="home.install_copy" data-on={copied || undefined}>{copied ? 'Copied' : 'Copy'}</button>
        <span className="xh-sr" role="status">{copied ? 'Copied' : ''}</span>
        <a href="https://docs.hanzo.ai/docs/cli">Install CLI ↗</a>
      </div>
    </motion.div>
  );
}

/* ---------- the phone ---------- */

// the app's two round glass buttons (@hanzo/app Bar): the drawer's mark, two strokes with the lower one shorter, and New chat's pen
const Drawer = () => <svg width="15" height="9" viewBox="0 0 19 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M1 1h17M1 10h10.5" /></svg>;
// what sits under an answer: copy, rate, listen, share, regenerate
const REPLY = ['copy', 'thumbs-up', 'volume-2', 'share', 'refresh-cw'];

// the latest thing the phone was asked up to scene `sc`: an ask with its lines, or a piece made in Studio
const asked = (s) => s.phone || s.place === 'studio';

/* One turn: what was asked, then the answer in the app's words: prose, a code block for what an agent printed, or the
   piece Studio made, with the answer's five marks under it. */
function Turn({ ask, on, answer, children }) {
  return (
    <div className="xm-turn" data-on={on ? '' : undefined} aria-hidden={on ? undefined : true}>
      <div className="xm-me"><span>{ask}</span></div>
      <div className="xm-ai" data-on={answer ? '' : undefined}>
        {children}
        <div className="xm-reply" aria-hidden="true">{REPLY.map((g) => <span key={g}><Glyph name={g} size={20} stroke={1.5} /></span>)}</div>
      </div>
    </div>
  );
}

/* The phone is hanzo.app on a phone (@hanzo/app's mobile layout, which is what people use): the bar's two round buttons,
   the conversation, and the composer pinned above the home indicator, drawn at the phone's own 393 points and scaled to
   the bezel. An empty chat asks "What's up?"; the composer says "Type / for skills", with + for files, agents and skills,
   the mic and its menu, voice mode, and the effort, Auto, under it. */
export function Phone({ sc, phase }) {
  const now = last(sc, asked);
  const open = now < 0;
  return (
    <motion.div className="x-phone" initial={{ opacity: 0, z: -80, x: 80 }} animate={{ opacity: 1, z: 130, x: 0 }} transition={{ duration: 1.4, ease: EASE, delay: 0.5 }}>
      <div className="x-phone-scr">
        <div className="xm-ui">
          <div className="xm-status"><b>9:41</b><span className="x-island" /><span className="xm-sys"><Glyph name="signal" size={18} stroke={2} /><Glyph name="wifi" size={18} stroke={2} /><Glyph name="battery-full" size={22} stroke={1.75} /></span></div>
          <div className="xm-bar" aria-hidden="true"><span className="xm-round"><Drawer /></span><span className="xm-round"><Glyph name="square-pen" size={20} stroke={1.6} /></span></div>
          <div className="xm-main">
            <h2 className="xm-hi" data-on={open && phase < 1 ? '' : undefined}>What’s up?</h2>
            <Turn ask={OPEN.ask} on={open && phase >= 1} answer={phase >= 2}><p>{OPEN.answer}</p></Turn>
            {MORE.map((s, i) => (asked(s) ? (
              <Turn key={i} ask={s.phone ? s.phone.ask : s.prompt} on={i === now} answer>
                {s.phone ? <pre className="xm-code x-mono">{s.phone.cells.join('\n')}</pre> : <img className="xm-art" src={pic(s.made[s.pick ?? 0].src)} alt="" loading="lazy" decoding="async" />}
              </Turn>
            ) : null))}
          </div>
          <div className="xm-shell">
            <div className="xm-comp">
              <p>Type / for skills</p>
              <div><i><Glyph name="plus" size={22} stroke={1.5} /></i><span /><i><Glyph name="mic" size={20} stroke={1.6} /></i><i className="sm"><Glyph name="chevron-down" size={14} stroke={2} /></i><i><Glyph name="audio-lines" size={22} stroke={1.6} /></i></div>
            </div>
            <span className="xm-effort">Auto</span>
          </div>
          <i className="xm-home" />
        </div>
      </div>
      <a className="x-phone-dl" href="/download">Download App</a>
    </motion.div>
  );
}
