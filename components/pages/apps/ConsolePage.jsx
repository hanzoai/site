'use client';
/* Console (v2, archetype A "Launch"): one admin for everything you run, shown as the shell itself.
   Persona: a developer or operator running Hanzo services for an organization (keys, usage, apps, models)
   Goal: watch the console's modules open one by one, find anything by typing, then open the console
   CTA: Open Console -> https://platform.hanzo.ai (hero, the site's sticky ask bar at every width, close; data-thumb, data-cta)
   Signature: the shell, driving itself. The console window fills the dark hero: its command palette types a module's
   name, the module opens in the shell (projects, keys, usage, apps, models, organization) and plays its own moment (a
   build finishes, a key is revoked, usage records land, an app gets an identity and a store, your own provider
   connects, the organization switches the whole page), and the palette comes back for the next one. A Pause sits on
   the window; tapping a module also takes over.
   Beyond: "Find it by typing it", for real. Click the palette (or press / anywhere) and type: every module and every
   product in the sidebar answers as you type, the letters marked where they match; Enter opens a module in the shell
   beside it, or takes you to the product's page.
   Not only scroll: the shell runs by itself (idle) and types (time); the palette and the fact cards answer the hand
   (state); Stage and chapters are the scroll half.
   Motion: the shell (signature) + Stage (it settles as you scroll) + sticky chapters + cards that open into their page.
V2: 8/10 the dark-room hero is the shell, huge under the title and driving itself, with a Pause; six sticky chapters pin it on each module; the palette is real and wide; four facts open into their page; Get Console, then a close with one ask; greys only, nothing above a headline
   The v1 drag-to-reorder sidebar is gone (its words stay, with the palette). Every word and link is Hanzo's. */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { EASE_OUT_EXPO as EASE, SPRING as SP } from '../../../lib/motion';
import { A, Go, More } from '../../kit';
import { href } from '../../../lib/route';
import { Code, useLive } from '../cloud/Frame';
import BizPaste from '../../v2/BizPaste';
import BizStage from '../../v2/BizStage';
import BizChapters from '../../v2/BizChapters';
import BizOpen from '../../v2/BizOpen';
import './ConsolePage.css';

const APP = 'https://platform.hanzo.ai';
const DOCS = 'https://docs.hanzo.ai/docs/console';
const GH = 'https://github.com/hanzoai';
const DEPLOY = 'https://platform.hanzo.ai/deploy';
const TEAM = 'https://hanzo.team/';
const SPRING = SP.sheet;

/* the sidebar: Hanzo's products, as the console shows them */
const SIDE = [['Chat', '/cloud/chat', 'Conversational AI'], ['Bot', '/bot', 'Multi-agent platform'], ['Search', '/search', 'Retrieval & answers'], ['Crawl', '/crawl'], ['Studio', '/studio'], ['Console', '/console'], ['Referrals', '/cloud/referrals'], ['Marketplace', '/cloud/marketplace']];
const PICON = ['M2.5 4.5h11v7h-6l-3 2.5v-2.5h-2z', 'M5 5h6v6H5zM8 2v3M8 11v3M2 8h3M11 8h3', 'M7 2.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9ZM10.5 10.5 14 14', 'M2 8h12M8 2c2.5 2 2.5 10 0 12M8 2c-2.5 2-2.5 10 0 12', 'M2.5 4h11v8h-11zM6.5 6.5l3 1.5-3 1.5z', 'M2.5 3h11v10h-11zM2.5 6h11M5 9h3', 'M5 6a2 2 0 1 0 0-.01M11 10a2 2 0 1 0 0-.01M6.6 6.8l2.8 2.4', 'M2.5 6h11l-1 7h-9zM5 6V4.5a3 3 0 0 1 6 0V6'];

/* the six modules of the shell */
const MODS = [
  { id: 'projects', nav: 'Projects', t: 'Projects', w: 'projects', d: 'M2 4.5h4l1.5 1.5H14v6.5H2z' },
  { id: 'models', nav: 'Models', t: 'Providers and models', w: 'models providers', d: 'M8 2 2.5 5v6L8 14l5.5-3V5zM2.5 5 8 8l5.5-3M8 8v6' },
  { id: 'usage', nav: 'Usage', t: 'Usage and balance', w: 'usage balance', d: 'M3 13V9M6.5 13V5M10 13V7.5M13.5 13V3' },
  { id: 'keys', nav: 'Keys', t: 'Keys', w: 'keys', d: 'M5 8.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM6.8 9.2 13 3M11 5l1.6 1.6' },
  { id: 'apps', nav: 'Apps', t: 'Applications and stores', w: 'apps applications stores', d: 'M2.5 2.5h4.5v4.5H2.5zM9 2.5h4.5v4.5H9zM2.5 9h4.5v4.5H2.5zM9 9h4.5v4.5H9z' },
  { id: 'org', nav: 'Organization', t: 'Organization', w: 'organization org oidc', d: 'M3 14V3h6v11M9 6.5h4V14M2 14h12M5 5.5h2M5 8h2M5 10.5h2' },
];
// the film: the module it opens next and what the palette types for it
const DEMO = [['keys', 'keys'], ['usage', 'usage'], ['apps', 'apps'], ['models', 'models'], ['org', 'org'], ['projects', 'projects']];
const PROJECTS = [['gateway', 'Ready'], ['payments-api', 'Ready'], ['checkout-web', 'Building'], ['docs-site', 'Ready']];

const ITEMS = [
  ...MODS.map((m) => ({ id: m.id, name: m.nav, sub: m.t === m.nav ? 'Module' : m.t, kind: 'module', w: m.w, d: m.d })),
  ...SIDE.map(([t, to, s], i) => ({ id: to, name: t, sub: s || to, kind: 'product', to, w: t.toLowerCase(), d: PICON[i] })),
];
/* What answers a query: a name that starts with it first, then a word that does, then anything that contains it. */
function find(q) {
  const s = q.trim().toLowerCase();
  if (!s) return ITEMS.map((x) => ({ x, at: -1 }));
  const out = [];
  ITEMS.forEach((x, i) => {
    const n = x.name.toLowerCase(), at = n.indexOf(s);
    const score = at === 0 ? 4 : x.w.split(' ').some((w) => w.startsWith(s)) ? 3 : at > 0 ? 2 : x.sub.toLowerCase().includes(s) ? 1 : 0;
    if (score) out.push({ x, at, score, i });
  });
  return out.sort((a, b) => b.score - a.score || a.i - b.i);
}
const Hl = ({ name, at, n }) => (at < 0 || !n ? name : <>{name.slice(0, at)}<mark>{name.slice(at, at + n)}</mark>{name.slice(at + n)}</>);
const Ico = ({ d, s = 16 }) => <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden="true"><path d={d} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" /></svg>;
const Glass = () => <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;

/* "/" or the palette button, anywhere on the page: the real palette comes to you, ready to type. */
function focusFind() {
  const el = document.getElementById('cs-find-in');
  if (!el) return;
  const box = el.closest('.cs-find-obj');
  if (window.__lenis) window.__lenis.scrollTo(box, { offset: -120, duration: 1.1 });
  else box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.focus({ preventScroll: true });
}

/* A module's own moment: steps 0..n, played once each time it opens (on screen only); reduced motion shows the end. */
function usePlay(play, n, ms, first = 500) {
  const calm = useReducedMotion();
  const [k, setK] = useState(0);
  useEffect(() => {
    if (calm) { setK(n); return; }
    if (!play || k >= n) return;
    const t = setTimeout(() => setK((v) => v + 1), k ? ms : first);
    return () => clearTimeout(t);
  }, [play, k, n, ms, first, calm]);
  return k;
}

function Projects({ play }) {
  const k = usePlay(play, 1, 0, 2600);
  return (
    <div className="cs-v">
      <div className="cs-tbl">
        <p className="cs-tr cs-th"><span>Name</span><span>Status</span></p>
        {PROJECTS.map(([p, s], i) => {
          const st = p === 'checkout-web' && k ? 'Ready' : s;
          return <p key={p} className={'cs-tr' + (i === 0 ? ' on' : '')}><span className="x-mono"><i className={'cs-dot' + (st === 'Building' ? ' b' : '')} />{p}</span><em>{st}</em></p>;
        })}
      </div>
      <p className="cs-cap"><b className="x-mono">gateway</b>Every request enters here, so the limiter does too.</p>
    </div>
  );
}

function Keys({ org, play }) {
  const k = usePlay(play, 2, 480, 1500);
  const [hand, setHand] = useState(null);
  const off = hand ?? k >= 2;
  return (
    <div className="cs-v">
      <p className="cs-vk">Issue an API key, scope it, revoke it.</p>
      <div className={'cs-key' + (off ? ' off' : '')}>
        <span className="cs-key-i"><Ico d={MODS[3].d} s={20} /></span>
        <div className="cs-key-l"><b className="x-mono">sk-...</b><span>scoped to {org}</span></div>
        <span className={'cs-tag' + (off ? ' off' : '')}>{off ? 'revoked' : 'active'}</span>
        <button type="button" className={'cs-key-b' + (k === 1 && hand === null ? ' press' : '')} onClick={() => setHand(!off)}>{off ? 'Issue again' : 'Revoke'}</button>
      </div>
      <p className={'cs-key-n' + (off ? ' off' : '')}>{off ? 'revoked: it stops working' : 'The key you paste into a client is minted here'}</p>
    </div>
  );
}

function Usage({ org, play }) {
  const n = usePlay(play, 6, 420, 450);
  const rows = Array.from({ length: Math.min(n, 5) }, (_, i) => n - i);
  return (
    <div className="cs-v">
      <p className="cs-vk">A usage record per call, one balance per organization.</p>
      <div className="cs-use">
        <div className="cs-use-fig">
          <span className="cs-roll">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.b key={n} className="bz-fig" initial={{ y: '70%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-70%', opacity: 0 }} transition={SPRING}>{n}</motion.b>
            </AnimatePresence>
          </span>
          <span className="cs-use-l">usage records</span>
          <span className="cs-use-b"><i />one balance · {org}</span>
        </div>
        <ol className="cs-use-list">
          <AnimatePresence initial={false}>
            {rows.map((id) => (
              <motion.li key={id} layout="position" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                <span className="x-mono">post_v1_chat_completions</span><em>usage recorded · {org}</em>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      </div>
    </div>
  );
}

const CHAIN = [['app', 'M2.5 2.5h4.5v4.5H2.5zM9 2.5h4.5v4.5H9zM2.5 9h4.5v4.5H2.5zM9 9h4.5v4.5H9z'], ['identity', 'M8 2.5a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6ZM2.8 14c.7-2.4 2.8-3.8 5.2-3.8s4.5 1.4 5.2 3.8'], ['store', 'M3 4c0-1 2.2-1.8 5-1.8s5 .8 5 1.8v8c0 1-2.2 1.8-5 1.8S3 13 3 12zM3 4c0 1 2.2 1.8 5 1.8S13 5 13 4M3 8c0 1 2.2 1.8 5 1.8s5-.8 5-1.8']];
function Apps({ play }) {
  const k = usePlay(play, 3, 520, 400);
  return (
    <div className="cs-v">
      <p className="cs-vk">Register an app, hand it an identity, give it a store.</p>
      <ol className="cs-chain">
        {CHAIN.map(([t, d], i) => (
          <li key={t} className={k > i ? 'on' : ''}>
            {i > 0 && <i className="cs-link" aria-hidden="true" />}
            <span className="cs-node"><Ico d={d} s={26} /></span>
            <b>{t}</b>
          </li>
        ))}
      </ol>
      <p className="cs-cap">The console writes the same resources the CLI does, because both are clients of the same API.</p>
    </div>
  );
}

function Models({ play }) {
  const k = usePlay(play, 1, 0, 1300);
  return (
    <div className="cs-v">
      <p className="cs-vk">Every model your organization can call, and which provider serves it.</p>
      <div className="cs-prov">
        <div className="cs-pv on"><span className="cs-pv-i x-mono">H</span><b>Hanzo</b><em>ones we run</em><span className="cs-tag">connected</span></div>
        <div className={'cs-pv yours' + (k ? ' on' : '')}><span className="cs-pv-i">+</span><b>an account of your own</b><em>its models appear beside them</em><span className={'cs-tag' + (k ? '' : ' off')}>{k ? 'connected' : 'connect'}</span></div>
      </div>
    </div>
  );
}

function Org({ org, play, flip }) {
  const k = usePlay(play, 1, 0, 1200);
  useEffect(() => { if (k) flip(); }, [k]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="cs-v">
      <p className="cs-vk">Switching organization switches the whole page.</p>
      <div className="cs-org">
        <span className="cs-oidc x-mono">OIDC</span>
        <span className="cs-org-n">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.b key={org} initial={{ y: '80%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-80%', opacity: 0 }} transition={SPRING}>{org}</motion.b>
          </AnimatePresence>
        </span>
        <em>what your organization owns</em>
      </div>
      <ul className="cs-orgs">
        {['acme', 'globex'].map((o) => <li key={o} className={o === org ? 'on' : ''}><span className="cs-ava">{o[0]}</span>{o}</li>)}
      </ul>
    </div>
  );
}

function View({ id, ...p }) {
  if (id === 'keys') return <Keys {...p} />;
  if (id === 'usage') return <Usage {...p} />;
  if (id === 'apps') return <Apps {...p} />;
  if (id === 'models') return <Models {...p} />;
  if (id === 'org') return <Org {...p} />;
  return <Projects {...p} />;
}

/* The film's palette: it opens, types, the answers narrow letter by letter, Enter lands. */
function Pal({ q, go }) {
  const hits = find(q).slice(0, 5);
  return (
    <motion.div className="cs-pal" aria-hidden="true" initial={{ opacity: 0, y: -14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.16 } }} transition={SPRING}>
      <div className="cs-pal-in">
        <Glass />
        <span className="cs-pal-q">{q || <em>Type a module or a product</em>}<i className="cs-caret" /></span>
        <kbd className={go ? 'on' : ''}>↵</kbd>
      </div>
      <ul className="cs-pal-hits">
        {hits.map((h, i) => (
          <li key={h.x.kind + h.x.name} className={(i === 0 ? 'hi' : '') + (i === 0 && go ? ' go' : '')}>
            <Ico d={h.x.d} /><span className="cs-pal-n"><Hl name={h.x.name} at={h.at} n={q.length} /></span><em>{h.x.sub}</em><span className="x-mono">{h.x.kind}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* The shell. auto: it drives itself (the hero). Otherwise it shows the module it is given (chapters, the palette). */
function Shell({ auto, view: want, size = 'lg' }) {
  const [ref, live] = useLive(0.25);
  const [view, setView] = useState(want || 'projects');
  const [org, setOrg] = useState('acme');
  const [pal, setPal] = useState(false);
  const [q, setQ] = useState('');
  const [go, setGo] = useState(false);
  const [mine, setMine] = useState(false);
  const step = useRef(0);
  const P = (k) => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">{k ? <path d="M5 3.2v9.6L12.6 8z" fill="currentColor" /> : <path d="M4.5 3h2.4v10H4.5zM9.1 3h2.4v10H9.1z" fill="currentColor" />}</svg>;
  const first = useRef(true);
  useEffect(() => { if (want) setView(want); }, [want]);
  useEffect(() => {
    if (!auto || !live || mine) return;
    const [next, word] = DEMO[step.current % DEMO.length];
    const ts = [];
    const at = (ms, fn) => ts.push(setTimeout(fn, ms));
    setPal(false); setGo(false);
    let t = first.current ? 1500 : 3600;
    first.current = false;
    at(t, () => { setQ(''); setPal(true); });
    t += 560;
    for (let i = 1; i <= word.length; i++) { t += 85 + (i % 3) * 35; const s = word.slice(0, i); at(t, () => setQ(s)); }
    t += 560; at(t, () => setGo(true));
    t += 300; at(t, () => { setPal(false); setGo(false); step.current += 1; setView(next); });
    return () => ts.forEach(clearTimeout);
  }, [auto, live, mine, view]);
  const flip = useCallback(() => setOrg((o) => (o === 'acme' ? 'globex' : 'acme')), []);
  const idx = MODS.findIndex((x) => x.id === view);
  const m = MODS[idx];
  const open = (id) => { setMine(true); setPal(false); setView(id); };
  return (
    <div ref={ref} className={'cs-win ' + size}>
      <div className="cs-bar">
        <span className="cs-lights" aria-hidden="true"><i /><i /><i /></span>
        <span className="cs-url x-mono">platform.hanzo.ai</span>
        <span className="cs-bar-r">
          {auto ? <A to="/home" className="cs-wt">Console — Hanzo</A> : <span className="cs-wt">Console — Hanzo</span>}
          {auto && <button type="button" className="cs-hold" onClick={() => { setMine(!mine); setPal(false); }} aria-pressed={mine} aria-label={mine ? 'Play the console film' : 'Pause the console film'}>{P(mine)}</button>}
        </span>
      </div>
      <div className="cs-body">
        {auto ? (
          <nav className="cs-rail" aria-label="Products">
            {SIDE.map(([t, to], i) => (
              <A key={t} to={to} className={'cs-ico' + (t === 'Console' ? ' on' : '')} aria-label={t}><Ico d={PICON[i]} /><span className="cs-tip" aria-hidden="true">{t}</span></A>
            ))}
          </nav>
        ) : (
          <div className="cs-rail" aria-hidden="true">{SIDE.map(([t], i) => <span key={t} className={'cs-ico' + (t === 'Console' ? ' on' : '')}><Ico d={PICON[i]} /></span>)}</div>
        )}
        <div className="cs-nav">
          <div className="cs-orgsw">
            <span className="cs-ava">{org[0]}</span>
            <span className="cs-orgsw-n">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.b key={org} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={SPRING}>{org}</motion.b>
              </AnimatePresence>
            </span>
            <span className="cs-oidc x-mono">OIDC</span>
          </div>
          <ul className="cs-mods" aria-label="Modules">
            <motion.i className="cs-pill" aria-hidden="true" initial={false} animate={{ y: idx * 44 }} transition={SPRING} />
            {MODS.map((x) => (
              <li key={x.id} className={x.id === view ? 'on' : ''}>
                {auto
                  ? <button type="button" onClick={() => open(x.id)} aria-pressed={x.id === view}><Ico d={x.d} />{x.nav}</button>
                  : <span><Ico d={x.d} />{x.nav}</span>}
              </li>
            ))}
          </ul>
        </div>
        <div className="cs-main">
          <div className="cs-head">
            <AnimatePresence mode="wait" initial={false}>
              <motion.h3 key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, transition: { duration: 0.14 } }} transition={{ duration: 0.4, ease: EASE }}>{m.t}</motion.h3>
            </AnimatePresence>
            <button type="button" className="cs-k" onClick={focusFind} aria-label="Find it by typing it: open the command palette"><Glass /><span>Find it by typing it</span><kbd>/</kbd></button>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={view} className="cs-vw" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.14 } }} transition={{ duration: 0.5, ease: EASE }}>
              <View id={view} org={org} play={live} flip={flip} />
            </motion.div>
          </AnimatePresence>
          {auto && <AnimatePresence>{pal && <Pal q={q} go={go} />}</AnimatePresence>}
        </div>
      </div>
      <div className="cs-foot">
        <span className="x-mono">api.hanzo.ai<b>/v1</b></span>
        {auto ? <A to={TEAM} className="cs-open">Open in the console ↗</A> : <span className="cs-open">Open in the console ↗</span>}
      </div>
    </div>
  );
}

/* The one dark room: the title, one line, the ask, and the shell huge under them, settling as you scroll. */
function Hero() {
  return (
    <section className="cs-hero" data-room="dark" aria-labelledby="cs-h1">
      <div className="bz-wrap cs-top">
        <h1 id="cs-h1" className="bz-display cs-h1">Hanzo Console</h1>
        <div className="cs-intro">
          <p className="bz-lede">One admin for everything you run</p>
          <div className="bz-acts">
            <span data-thumb="Open Console" data-cta="primary"><Go to={APP} solid>Open Console</Go></span>
            <More to={DOCS}>Documentation</More>
          </div>
        </div>
      </div>
      <BizStage from={1.035} over={720} lift={40} className="bz-wrap cs-stage"><Shell auto /></BizStage>
    </section>
  );
}

/* Chapters: the shell pinned, one module lit per chapter. */
const CH = [
  { id: 'projects', k: 'Projects', t: 'Add what you use. Hide what you don’t.', d: 'The shell stays the same.', x: <p className="cs-ch-note x-mono">Example project. Every name in it is one you would give your own.</p> },
  { id: 'models', k: 'Models', t: 'Providers and models', d: 'Every model your organization can call, and which provider serves it. Connect an account of your own and its models appear beside the ones we run.' },
  { id: 'usage', k: 'Usage', t: 'Usage and balance', d: 'A usage record per call and one balance per organization, so spend is attributed where it happened instead of totalled at the end of the month.' },
  { id: 'keys', k: 'Keys', t: 'Keys', d: 'Issue an API key, scope it, revoke it. The key you paste into a client is minted here, and revoking it here is what stops it working.' },
  { id: 'apps', k: 'Apps', t: 'Applications and stores', d: 'Register an app, hand it an identity, give it a store. The console writes the same resources the CLI does, because both are clients of the same API.' },
  { id: 'org', k: 'Organization', t: 'Scoped to the org on your token', d: 'Sign-in is OIDC against Hanzo IAM. What you see is what your organization owns, and switching organization switches the whole page — there is no global view to fall into by accident.' },
];

function Chapters() {
  return (
    <BizChapters label="A module per product, one shell around them" className="cs-ch" items={CH} stage={(at) => <div className="cs-ch-stage"><Shell view={CH[at].id} size="md" /></div>}>
      <header className="bz-wrap cs-ch-head">
        <h2 className="bz-display md">A module per product, one shell around them</h2>
      </header>
    </BizChapters>
  );
}

/* Beyond: the palette, for real. Type; every module and product answers; Enter opens it. */
function Find() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [hi, setHi] = useState(0);
  const [open, setOpen] = useState('projects');
  const [went, setWent] = useState('');
  const inp = useRef(null);
  const hits = useMemo(() => find(q), [q]);
  const h = Math.min(hi, hits.length - 1);
  const pick = (r) => {
    if (!r) return;
    setWent(r.x.kind + r.x.name);
    if (r.x.kind === 'product') { const to = href(r.x.to); if (to.startsWith('/')) router.push(to); else location.href = to; } else setOpen(r.x.id);
  };
  useEffect(() => {
    const k = (e) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const a = document.activeElement;
      if (a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.isContentEditable)) return;
      e.preventDefault();
      focusFind();
    };
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, []);
  const key = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHi(Math.min(hits.length - 1, h + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi(Math.max(0, h - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); pick(hits[h]); }
    else if (e.key === 'Escape') { setQ(''); setHi(0); }
  };
  return (
    <section className="bz-sec cs-find" aria-labelledby="cs-find-h">
      <div className="bz-wrap bz-grid cs-find-top">
        <h2 id="cs-find-h" className="bz-display md">Find it by typing it</h2>
        <p className="bz-body">A command palette reaches every module and every record without learning where anything lives. The sidebar is yours to reorder and prune.</p>
      </div>
      <div className="bz-wrap">
        <div className="cs-find-obj bz-obj">
          <div className="cs-find-in">
            <Glass />
            <input ref={inp} id="cs-find-in" type="text" role="combobox" aria-expanded="true" aria-controls="cs-find-list" aria-autocomplete="list" aria-activedescendant={hits[h] ? 'cs-o-' + h : undefined} aria-label="Find a module or a product" autoComplete="off" spellCheck="false" placeholder="Type a module or a product" value={q} onChange={(e) => { setQ(e.target.value); setHi(0); }} onKeyDown={key} />
            {q ? <button type="button" className="cs-find-x" onClick={() => { setQ(''); setHi(0); inp.current?.focus(); }}>esc</button> : <kbd aria-hidden="true">/</kbd>}
          </div>
          <div className="cs-find-body">
            <div className="cs-find-res" data-lenis-prevent="">
              <ul id="cs-find-list" role="listbox" aria-label="Modules and products">
                {hits.map((r, i) => (
                  <li key={r.x.kind + r.x.name} id={'cs-o-' + i} role="option" aria-selected={i === h} className={(i === h ? 'hi' : '') + (went === r.x.kind + r.x.name ? ' went' : '')} onMouseEnter={() => setHi(i)} onClick={() => { setHi(i); pick(r); }}>
                    <span className="cs-find-i"><Ico d={r.x.d} /></span>
                    <span className="cs-find-n"><Hl name={r.x.name} at={r.at} n={q.trim().length} /><em>{r.x.sub}</em></span>
                    <span className="cs-find-k x-mono">{i === h ? (r.x.kind === 'module' ? '↵ open' : '↵ go') : r.x.kind}</span>
                  </li>
                ))}
                {!hits.length && <li className="none">Nothing matches “{q}”</li>}
              </ul>
              <p className="cs-find-hint x-mono" aria-hidden="true"><kbd>↑</kbd><kbd>↓</kbd> choose <kbd>↵</kbd> open <kbd>esc</kbd> clear</p>
            </div>
            <div className="cs-find-shell"><Shell view={open} size="md" /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

const CODE = `from hanzoai.cloud import ApiClient, Configuration, ChatApi

# The key you issued in the console
config = Configuration(
    host="https://api.hanzo.ai",
    access_token="sk-...",
)

with ApiClient(config) as client:
    print(ChatApi(client).post_v1_chat_completions())

# The call, and what it cost, are on your
# organization's usage before it returns.`;

const Gh = () => <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;

/* The four facts, each a card that opens into its own page (synchronized.studio). */
const FACTS = [
  { id: 'v1', f: '/v1', t: 'One API behind it', d: 'Everything on these screens is a call to api.hanzo.ai/v1, and the typed clients are generated from the same document.', x: <Code tabs={[{ k: 'app.py', code: CODE, lang: 'python' }]} mark="post_v1_chat_completions" /> },
  { id: 'oidc', f: 'OIDC', t: 'Sign in with Hanzo IAM', d: 'Sign-in is OIDC against Hanzo IAM. What you see is what your organization owns, and switching organization switches the whole page — there is no global view to fall into by accident.' },
  { id: 'org', f: 'Per-org', t: 'Data scoped to your org', d: 'A usage record per call and one balance per organization, so spend is attributed where it happened instead of totalled at the end of the month.' },
  { id: 'oss', f: 'OSS', t: 'MIT or Apache-2.0', d: 'The console writes the same resources the CLI does, because both are clients of the same API.', x: <div className="cs-chips"><span className="cs-chip"><span>License:</span> Apache-2.0</span><A to={GH} className="cs-chip"><Gh />hanzoai</A></div> },
];

function Client() {
  return (
    <section className="bz-sec cs-client" aria-labelledby="cs-client-h">
      <div className="bz-wrap bz-grid">
        <div className="cs-client-copy">
          <h2 id="cs-client-h" className="bz-headline">The console is a client. So is your code.</h2>
          <p className="bz-body">Everything on these screens is a call to api.hanzo.ai/v1, and the typed clients are generated from the same document.</p>
        </div>
        <BizOpen label="What the console stands on" className="cs-facts" cardClass="cs-fact" items={FACTS.map((x) => ({
          id: x.id,
          label: x.t,
          card: <><b className="bz-fig">{x.f}</b><span className="cs-fact-t">{x.t}</span></>,
          panel: (
            <div className={'cs-fp' + (x.id === 'v1' ? ' wide' : '')}>
              <div className="cs-fp-copy">
                <b className="bz-fig">{x.f}</b>
                <h3 className="bz-title">{x.t}</h3>
                <p className="bz-body">{x.d}</p>
              </div>
              {x.x && <div className="cs-fp-x">{x.x}</div>}
            </div>
          ),
        }))} />
      </div>
    </section>
  );
}

/* Getting it: the licence, the ways to run it, the agent prompt and the related products. Text links only. */
function GetConsole() {
  return (
    <section className="bz-sec cs-get" aria-labelledby="cs-get-h">
      <div className="bz-wrap bz-grid">
        <div className="cs-get-main">
          <h2 id="cs-get-h" className="bz-headline">Get Console</h2>
          <p className="bz-lede">Operator console for the cloud</p>
          <div className="cs-chips"><span className="cs-chip"><span>License:</span> Apache-2.0</span><A to={GH} className="cs-chip"><Gh />hanzoai</A></div>
          <div className="cs-end-links"><More to={DEPLOY}>Deploy to Cloud</More><More to={DOCS}>Self-host</More></div>
        </div>
        <div className="cs-rel">
          <p className="bz-title">Related capabilities</p>
          <ul>
            <li><A to={DOCS}><b>Console docs →</b></A></li>
            {SIDE.slice(0, 3).map(([t, to, d]) => <li key={t}><A to={to}><b>{t}</b><span>{d}</span></A></li>)}
          </ul>
        </div>
      </div>
      <div className="bz-wrap cs-get-paste">
        <BizPaste name="Console" prompt="Read https://hanzo.ai/skill.md and use Hanzo Console in my project." className="cs-paste" />
      </div>
    </section>
  );
}

const Arrow = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* The close: one sentence at Display size, the one ask, one text row. */
function End() {
  return (
    <section className="bz-sec cs-end" aria-labelledby="cs-end-h">
      <div className="bz-wrap">
        <div className="cs-end-main">
          <h2 id="cs-end-h" className="bz-display md">Open the console</h2>
          <p className="bz-lede">Sign in with your Hanzo identity. The organization you land in is the one that gets billed, and everything on these screens belongs to it.</p>
          <div className="bz-acts"><span data-cta="primary"><Go to={APP} solid>Open Console</Go></span></div>
        </div>
        <A to={GH} className="cs-row"><span>View on GitHub</span><Arrow /></A>
      </div>
    </section>
  );
}

export default function ConsolePage() {
  return (
    <main className="bz cs" data-ask-name="Hanzo Console">
      <Hero />
      <Chapters />
      <Find />
      <Client />
      <GetConsole />
      <End />
    </main>
  );
}
