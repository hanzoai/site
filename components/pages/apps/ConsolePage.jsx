'use client';
/* Console. Signature: the shell, driving itself. The hero is the console window at full width: a command palette types
   a module's name, the module opens in the shell (projects, keys, usage, apps, models, organization), and the palette
   comes back for the next one; switching organization switches the whole page.
   Beyond: "Find it by typing it", for real. Click the palette (or press /) and type: every module and every product in
   the sidebar answers as you type, Enter opens it. Also: the six modules as a sidebar you can drag to reorder and
   prune, as Hanzo says yours is. Every word and link is Hanzo's. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'motion/react';
import { useRouter } from 'next/navigation';
import { EASE, Rise } from '../../ui';
import { A, Go } from '../../kit';
import { Paste, Code, Related, Get, useLive } from '../cloud/Frame';
import './ConsolePage.css';

const DOCS = 'https://docs.hanzo.ai/docs/console';
const up = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
const SIDE = [['Chat', '/cloud/chat'], ['Bot', '/bot'], ['Search', '/search'], ['Crawl', '/crawl'], ['Studio', '/studio'], ['Console', '/console'], ['Referrals', '/cloud/referrals'], ['Marketplace', '/cloud/marketplace']];
const ICON = ['M2.5 4.5h11v7h-6l-3 2.5v-2.5h-2z', 'M5 5h6v6H5zM8 2v3M8 11v3M2 8h3M11 8h3', 'M7 2.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9ZM10.5 10.5 14 14', 'M2 8h12M8 2c2.5 2 2.5 10 0 12M8 2c-2.5 2-2.5 10 0 12', 'M2.5 4h11v8h-11zM6.5 6.5l3 1.5-3 1.5z', 'M2.5 3h11v10h-11zM2.5 6h11M5 9h3', 'M5 6a2 2 0 1 0 0-.01M11 10a2 2 0 1 0 0-.01M6.6 6.8l2.8 2.4', 'M2.5 6h11l-1 7h-9zM5 6V4.5a3 3 0 0 1 6 0V6'];
const PROJECTS = [['gateway', 'Ready'], ['payments-api', 'Ready'], ['checkout-web', 'Building'], ['docs-site', 'Ready']];
const MODS = [
  ['projects', 'Projects'],
  ['models', 'Providers and models'],
  ['usage', 'Usage and balance'],
  ['keys', 'Keys'],
  ['apps', 'Applications and stores'],
  ['org', 'Scoped to the org on your token'],
];
const DEMO = ['keys', 'usage', 'apps', 'org', 'models', 'projects'];

function View({ id, org, revoked, setRevoked, live }) {
  const [n, setN] = useState(3);
  useEffect(() => { if (id !== 'usage' || !live) return; const t = setInterval(() => setN((v) => (v >= 7 ? 3 : v + 1)), 700); return () => clearInterval(t); }, [id, live]);
  if (id === 'projects') return (
    <div className="cs-v">
      <ul className="cs-proj">
        {PROJECTS.map(([p, s], i) => <li key={p} className={i === 0 ? 'on' : ''}><i className={s === 'Building' ? 'b' : ''} /><span className="x-mono">{p}</span><em>{s}</em></li>)}
      </ul>
      <p className="cs-cap">Every request enters here, so the limiter does too.</p>
    </div>
  );
  if (id === 'keys') return (
    <div className="cs-v">
      <p className="cs-vk">Issue an API key, scope it, revoke it.</p>
      <div className={'cs-key' + (revoked ? ' off' : '')}>
        <span className="x-mono">sk-...</span><em>{revoked ? 'revoked: it stops working' : `scoped to ${org}`}</em>
        <button type="button" className="x-btn sm" onClick={() => setRevoked(!revoked)}>{revoked ? 'Issue again' : 'Revoke'}</button>
      </div>
    </div>
  );
  if (id === 'usage') return (
    <div className="cs-v">
      <p className="cs-vk">A usage record per call, one balance per organization.</p>
      <ol className="cs-usage">{Array.from({ length: n }).map((_, i) => <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}><span className="x-mono">post_v1_chat_completions</span><em>usage recorded · {org}</em></motion.li>)}</ol>
    </div>
  );
  if (id === 'apps') return (
    <div className="cs-v">
      <p className="cs-vk">Register an app, hand it an identity, give it a store.</p>
      <div className="cs-chain">{['app', 'identity', 'store'].map((t, i) => <motion.span key={t} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.25, type: 'spring', stiffness: 380, damping: 22 }}>{t}</motion.span>)}</div>
    </div>
  );
  if (id === 'models') return (
    <div className="cs-v">
      <p className="cs-vk">Every model your organization can call, and which provider serves it.</p>
      <div className="cs-prov"><span><b>ones we run</b><em>Hanzo</em></span><span className="yours"><b>an account of your own</b><em>its models appear beside them</em></span></div>
    </div>
  );
  return (
    <div className="cs-v">
      <p className="cs-vk">Switching organization switches the whole page.</p>
      <div className="cs-org"><span className="x-mono">OIDC</span><b>{org}</b><em>what your organization owns</em></div>
    </div>
  );
}

/* The palette: types by itself while idle; click it (or press /) and it is yours. */
function Shell() {
  const [ref, live] = useLive(0.3);
  const [view, setView] = useState('projects');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [mine, setMine] = useState(false);
  const [org, setOrg] = useState('acme');
  const [revoked, setRevoked] = useState(false);
  const [hi, setHi] = useState(0);
  const inp = useRef(null);
  const step = useRef(0);
  const first = useRef(true);
  const router = useRouter();
  const ALL = useMemo(() => [...MODS.map(([id, t]) => ({ id, t, k: 'module' })), ...SIDE.map(([t, to]) => ({ id: to, t, k: 'product', to }))], []);
  const hits = q ? ALL.filter((x) => x.t.toLowerCase().includes(q.toLowerCase())).slice(0, 6) : ALL.slice(0, 6);
  const go = (x) => {
    if (!x) return;
    if (x.k === 'product') { router.push(x.to); return; }
    setView(x.id); if (x.id === 'org') setOrg((o) => (o === 'acme' ? 'globex' : 'acme')); setOpen(false); setQ('');
  };
  // the demo: open the palette, type a module's name a letter at a time (into the input's own value), open it, wait
  useEffect(() => {
    if (!live || mine) return;
    let t, i = 0;
    const target = MODS.find((m) => m[0] === DEMO[step.current % DEMO.length]);
    const word = target[1].split(' ')[0].toLowerCase();
    const type = () => {
      i += 1; setQ(word.slice(0, i));
      if (i < word.length) t = setTimeout(type, 110);
      else t = setTimeout(() => { go({ id: target[0], k: 'module' }); step.current += 1; }, 650);
    };
    t = setTimeout(() => { setOpen(true); t = setTimeout(type, 500); }, first.current ? 1100 : 2600);
    first.current = false;
    return () => clearTimeout(t);
  }, [live, mine, view]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const k = (e) => { if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && ref.current?.getBoundingClientRect().top < innerHeight) { e.preventDefault(); take(); } };
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  }); // eslint-disable-line react-hooks/exhaustive-deps
  const take = () => { setMine(true); setOpen(true); setQ(''); setHi(0); setTimeout(() => inp.current?.focus(), 30); };
  const cur = MODS.find((m) => m[0] === view);
  return (
    <div className="cs-win" ref={ref}>
      <div className="cs-bar"><i /><i /><i /><span className="x-mono">platform.hanzo.ai</span><A to="/home" className="cs-title">Console — Hanzo</A></div>
      <div className="cs-body">
        <nav className="cs-side" aria-label="Products">
          {SIDE.map(([t, to], i) => (
            <A key={t} to={to} className={'cs-ico' + (t === 'Console' ? ' on' : '')} aria-label={t}>
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d={ICON[i]} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" /></svg>
              <span className="cs-tip">{t}</span>
            </A>
          ))}
        </nav>
        <div className="cs-main">
          <div className="cs-head">
            <AnimatePresence mode="wait" initial={false}>
              <motion.h3 key={view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3, ease: EASE }}>{cur[1]}</motion.h3>
            </AnimatePresence>
            <button type="button" className="cs-k" onClick={take} aria-label="Open the command palette"><span>Find it by typing it</span><kbd>/</kbd></button>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={view + org} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.4, ease: EASE }}>
              <View id={view} org={org} revoked={revoked} setRevoked={setRevoked} live={live} />
            </motion.div>
          </AnimatePresence>
          <AnimatePresence>
            {open && (
              <motion.div className="cs-pal" initial={{ opacity: 0, y: -10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.15 } }} transition={{ duration: 0.3, ease: EASE }}>
                <div className="cs-pal-in">
                  <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  <input ref={inp} value={q} placeholder="Type a module or a product" aria-label="Command palette" onFocus={() => setMine(true)}
                    onChange={(e) => { setMine(true); setQ(e.target.value); setHi(0); }}
                    onKeyDown={(e) => { if (e.key === 'ArrowDown') { e.preventDefault(); setHi((h) => Math.min(hits.length - 1, h + 1)); } else if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => Math.max(0, h - 1)); } else if (e.key === 'Enter') go(hits[hi]); else if (e.key === 'Escape') setOpen(false); }} />
                  {mine && <button type="button" className="cs-x" onClick={() => setOpen(false)} aria-label="Close">esc</button>}
                </div>
                <ul className="cs-hits" role="listbox" aria-label="Results">
                  {hits.map((x, i) => (
                    <li key={x.k + x.t} role="option" aria-selected={i === hi} className={i === hi ? 'on' : ''} onMouseEnter={() => setHi(i)} onMouseDown={(e) => { e.preventDefault(); go(x); }}>
                      <span>{x.t}</span><em className="x-mono">{x.k}</em>
                    </li>
                  ))}
                  {!hits.length && <li className="none">Nothing matches “{q}”</li>}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="cs-foot"><span className="x-mono">api.hanzo.ai<b>/v1</b></span><A to="https://hanzo.team/" className="cs-open">Open in the console ↗</A></div>
    </div>
  );
}

function Hero() {
  return (
    <section className="cs-hero" aria-labelledby="cs-h1">
      <div className="x-wrap">
        <div className="cs-top">
          <h1 id="cs-h1" className="cs-h1"><span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}>Hanzo Console</motion.span></span></h1>
          <div className="cs-top-r">
            <motion.p className="cs-lede" {...up(0.3)}>One admin for everything you run</motion.p>
            <motion.div className="cs-acts" {...up(0.42)}>
              <motion.span className="x-go" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}><A to="https://platform.hanzo.ai" className="x-btn solid" data-thumb>Open Console</A></motion.span>
              <Go to={DOCS}>Documentation</Go>
            </motion.div>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 40, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}>
          <Shell />
          <p className="cs-eg">Example project. Every name in it is one you would give your own.</p>
        </motion.div>
      </div>
    </section>
  );
}

const MODULES = [
  ['Providers and models', 'Every model your organization can call, and which provider serves it. Connect an account of your own and its models appear beside the ones we run.'],
  ['Usage and balance', 'A usage record per call and one balance per organization, so spend is attributed where it happened instead of totalled at the end of the month.'],
  ['Keys', 'Issue an API key, scope it, revoke it. The key you paste into a client is minted here, and revoking it here is what stops it working.'],
  ['Applications and stores', 'Register an app, hand it an identity, give it a store. The console writes the same resources the CLI does, because both are clients of the same API.'],
  ['Find it by typing it', 'A command palette reaches every module and every record without learning where anything lives. The sidebar is yours to reorder and prune.'],
  ['Scoped to the org on your token', 'Sign-in is OIDC against Hanzo IAM. What you see is what your organization owns, and switching organization switches the whole page — there is no global view to fall into by accident.'],
];

/* The six modules as a sidebar of your own: drag to reorder, the eye to prune. */
/* One module row. It drags by its grip only, so a thumb scrolling the page past the list never picks one up;
   the grip also takes the arrow keys, so the order can be changed without a pointer. */
function Mod({ t, d, i, off, hide, move }) {
  const drag = useDragControls();
  return (
    <Reorder.Item as="li" value={t} dragListener={false} dragControls={drag} className={'cs-mod' + (off ? ' off' : '')} whileDrag={{ scale: 1.02, boxShadow: '0 30px 60px -30px rgba(0,0,0,.35)' }}>
      <button type="button" className="cs-grip" aria-label={'Move ' + t + ' with the arrow keys'} onPointerDown={(e) => drag.start(e)} onKeyDown={(e) => { const k = { ArrowUp: -1, ArrowDown: 1 }[e.key]; if (k) { e.preventDefault(); move(t, k); } }}><span aria-hidden="true">⋮⋮</span></button>
      <span className="cs-n x-mono">{String(i + 1).padStart(2, '0')}</span>
      <div><h3>{t}</h3><p>{d}</p></div>
      <button type="button" className="cs-eye" aria-pressed={off} aria-label={(off ? 'Show ' : 'Hide ') + t} onClick={hide}>{off ? 'Show' : 'Hide'}</button>
    </Reorder.Item>
  );
}

function Modules() {
  const [order, setOrder] = useState(MODULES.map((m) => m[0]));
  const [hidden, setHidden] = useState({});
  const byT = Object.fromEntries(MODULES.map((m, i) => [m[0], [m[1], i]]));
  const move = (t, k) => setOrder((o) => { const a = [...o], i = a.indexOf(t), j = i + k; if (j < 0 || j >= a.length) return o; [a[i], a[j]] = [a[j], a[i]]; return a; });
  return (
    <section className="x-sec cs-mods">
      <div className="x-wrap cs-mods-grid">
        <div className="cs-mods-h">
          <Rise as="h2" y={20}>A module per product, one shell around them</Rise>
          <p>Add what you use. Hide what you don't. The shell stays the same.</p>
          <p className="cs-hint x-mono">Drag a module to reorder it. Hide one to prune it.</p>
        </div>
        <Reorder.Group as="ol" axis="y" values={order} onReorder={setOrder} className="cs-list">
          {order.map((t) => <Mod key={t} t={t} d={byT[t][0]} i={byT[t][1]} off={!!hidden[t]} move={move} hide={() => setHidden((h) => ({ ...h, [t]: !h[t] }))} />)}
        </Reorder.Group>
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

function Client() {
  return (
    <section className="x-sec cs-client" data-room="dark">
      <div className="x-wrap">
        <ul className="cs-facts">
          {[['/v1', 'One API behind it'], ['OIDC', 'Sign in with Hanzo IAM'], ['Per-org', 'Data scoped to your org'], ['OSS', 'MIT or Apache-2.0']].map(([k, d], i) => (
            <li key={k}><b>{k}</b><span>{d}</span></li>
          ))}
        </ul>
        <div className="cs-client-grid">
          <div>
            <h2>The console is a client. So is your code.</h2>
            <p>Everything on these screens is a call to api.hanzo.ai/v1, and the typed clients are generated from the same document.</p>
          </div>
          <Rise delay={0.1}><Code tabs={[{ k: 'app.py', code: CODE, lang: 'python' }]} mark="post_v1_chat_completions" /></Rise>
        </div>
      </div>
    </section>
  );
}

function Open() {
  return (
    <section className="x-sec cs-open-sec">
      <div className="x-wrap">
        <div className="cs-paste-wrap"><Paste name="Console" prompt="Read https://hanzo.ai/skill.md and use Hanzo Console in my project." /></div>
        <div className="cs-open-grid">
          <div className="cs-open-card">
            <h2>Open the console</h2>
            <p>Sign in with your Hanzo identity. The organization you land in is the one that gets billed, and everything on these screens belongs to it.</p>
            <div className="cs-acts"><A to="https://platform.hanzo.ai" className="x-btn solid">Open Console</A><A to="https://github.com/hanzoai" className="x-btn">View on GitHub</A></div>
          </div>
          <Related items={[['Console docs →', DOCS], ['Chat', '/cloud/chat', 'Conversational AI'], ['Bot', '/bot', 'Multi-agent platform'], ['Search', '/search', 'Retrieval & answers']]} />
        </div>
      </div>
    </section>
  );
}

export default function ConsolePage() {
  return (
    <main className="cs">
      <Hero />
      <Modules />
      <Client />
      <Open />
      <Get name="Console" tag="Operator console for the cloud" self={DOCS} />
    </main>
  );
}
