'use client';
// Signature: a deck of live browser windows that riffles itself; pull one forward (drag, arrows or a dot) and its address bar types its .hanzo.app name.
// Beyond: the commands for the template in front, with its slug and its source repository filled in, ready to copy.
/* Templates. Hanzo's twelve products with previews, as a deck of browser windows: the one in front is the one you
   open, the next three wait behind it, the ones you passed fly off to the left. The chips re-deal the deck by kind.
   Under it, Hanzo's own setup prompt is spelled out as the commands it runs, for whichever template is in front. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Rise, Copy } from '../ui';
import { A, SecHead } from '../kit';
import SetupMenu from '../SetupMenu';
import './Templates.css';

// [slug, title, kind, what it is] — Hanzo's list (GET api.hanzo.ai/v1/templates, the ones with previews), by kind then title
const ALL = [
  ['drive', 'Drive', 'Business', 'Electric-vehicle marketing site — models, technology, news and ordering.'],
  ['hygge', 'Hygge', 'E-commerce', 'Skincare storefront — category browsing, product pages and a slide-out cart.'],
  ['savor', 'Savor', 'E-commerce', 'Food-delivery storefront — menu, favourites and cart over a restaurant home page.'],
  ['oasis', 'Oasis', 'Hospitality', 'Resort site — accommodation, dining, spa, weddings and tour booking, in four languages.'],
  ['kinetic', 'Kinetic', 'Portfolio', 'Creative portfolio driven by GSAP and smooth scroll — a project reel over case-study pages.'],
  ['pixel', 'Pixel', 'Portfolio', 'Web-studio portfolio — work, expertise and a playground page.'],
  ['portfolio', 'Portfolio', 'Portfolio', 'Personal developer portfolio — intro, about, projects and contact on one page.'],
  ['prism', 'Prism', 'Portfolio', 'Creative-agency portfolio built on GSAP — one scroll through work, services and contact.'],
  ['studio', 'Studio', 'Portfolio', 'Digital-agency portfolio — expertise, projects and articles behind an animated wordmark.'],
  ['vault', 'Vault', 'Portfolio', 'Architecture-studio site — architecture, landscape and interior work with a studio profile.'],
  ['solo', 'Solo', 'SaaS', 'Productivity-app landing page — tasks, lists and reminders with pricing and downloads.'],
  ['loop', 'Loop', 'Web3', 'Crypto-card product site — virtual card, NFT and metaverse pages with light and dark blog.'],
];
const KINDS = ['All', 'Business', 'E-commerce', 'Hospitality', 'Portfolio', 'SaaS', 'Web3'];
const pad = (v) => String(v).padStart(2, '0');

const D = 'https://docs.hanzo.ai/docs/';
// the agent strip, as hanzo.ai lists it: [name, docs, works as an MCP client]
const AGENTS = [
  ['AI Agents CLI', 'cli/agent', 1], ['Anthropic SDK', 'guides/integrations/claude-agent-sdk', 0], ['Antigravity', 'apps/ides', 0], ['ChatGPT', 'mcp', 1], ['Claude', 'mcp', 1],
  ['Claude Code', 'coding', 0], ['Claude Cowork', 'mcp', 1], ['Claude Duet', 'mcp', 1], ['Codex', 'coding', 0], ['Cue', 'mcp', 1], ['Cursor', 'apps/ides', 0],
  ['DeepSeek', 'mcp', 1], ['Gemini', 'mcp', 1], ['Grok', 'mcp', 1], ['Grok Bot', 'mcp', 1], ['Grok Build', 'mcp', 1], ['Hanzo Dev', 'dev', 0], ['Hermes Agent', 'mcp', 1],
  ['Kimi', 'mcp', 1], ['Kimi K3', 'mcp', 1], ['Manus', 'mcp', 1], ['MCP Server', 'mcp', 0], ['Muse', 'mcp', 1], ['nanoclaw', 'mcp', 1],
  ['OpenAI SDK', 'guides/integrations/openai-agents', 0], ['OpenClaw', 'mcp', 1], ['Paperclip', 'mcp', 1], ['Perplexity Computer', 'mcp', 1], ['Qwen', 'mcp', 1], ['Universal SDKs', 'sdks', 0],
];

function Strip() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const rows = AGENTS.filter(([n]) => n.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div className="xtp-strip">
      <p className="xtp-strip-k x-mono">Drop into any agent</p>
      <div className="xtp-strip-l">
        {AGENTS.slice(0, 5).map(([n, h]) => <a key={n} href={D + h} target="_blank" rel="noreferrer">{n}</a>)}
        <button type="button" aria-expanded={open} aria-controls="xtp-all" onClick={() => setOpen(!open)}>+{AGENTS.length - 5} more</button>
      </div>
      <div id="xtp-all" className="xtp-all" hidden={!open}>
        <input type="text" placeholder="Filter agents..." aria-label="Filter agents" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" spellCheck={false} />
        <ul>
          {rows.map(([n, h, mcp]) => <li key={n}><a href={D + h} target="_blank" rel="noreferrer"><b>{n}</b>{mcp ? <span>MCP client</span> : null}</a></li>)}
        </ul>
        {!rows.length && <p className="xtp-none">No agents match.</p>}
      </div>
    </div>
  );
}

function Card({ t, d, onPrev, onNext, calm }) {
  const [slug, title, kind, what] = t;
  const front = d === 0;
  const gone = d < 0;
  const pose = gone ? { x: '-115%', y: 0, scale: 0.92, rotate: -8, opacity: 0 } : { x: d * 22, y: -d * 26, scale: 1 - d * 0.06, rotate: d * 1.2, opacity: d > 3 ? 0 : 1 - d * 0.18 };
  return (
    <motion.article
      className={'xtp-card' + (front ? ' front' : '')}
      style={{ zIndex: 50 - Math.abs(d) }}
      initial={false}
      animate={pose}
      transition={calm ? { duration: 0 } : { type: 'spring', stiffness: 170, damping: 24 }}
      drag={front ? 'x' : false}
      dragSnapToOrigin
      dragElastic={0.5}
      onDragEnd={(e, i) => { if (i.offset.x < -80 || i.velocity.x < -500) onNext(); else if (i.offset.x > 80 || i.velocity.x > 500) onPrev(); }}
      aria-hidden={!front}
      data-swipe-own
      data-cursor={front ? 'Drag' : undefined}
    >
      <div className="xtp-bar">
        <span className="xtp-lights" aria-hidden="true"><i /><i /><i /></span>
        <span className="xtp-url x-mono"><span key={front ? slug : 'x'} className={front ? 'typed' : ''}>{slug}</span>.hanzo.app</span>
        <span className="xtp-kind x-mono">{kind}</span>
      </div>
      <A to={'/chat?template=' + encodeURIComponent(slug)} className="xtp-shot" tabIndex={front ? 0 : -1} draggable={false}>
        <img src={`https://hanzo.ai/templates/${slug}.webp`} alt={`${title} template preview`} width="1280" height="800" loading={d >= 0 && d < 3 ? 'eager' : 'lazy'} decoding="async" draggable={false} />
      </A>
      <div className="xtp-foot">
        <div><h3>{title}</h3><p>{what}</p></div>
        <A to={'/chat?template=' + encodeURIComponent(slug)} className="x-btn solid xtp-edit" tabIndex={front ? 0 : -1}>Edit in Hanzo <span aria-hidden="true">→</span></A>
      </div>
    </motion.article>
  );
}

function Deck({ kind, setKind, at, setAt, list }) {
  const [mine, setMine] = useState(false);
  const calm = useReducedMotion();
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.35 });
  const go = (k) => { setMine(true); setAt((k + list.length) % list.length); };
  useEffect(() => {
    if (mine || calm || !seen || list.length < 2) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % list.length), 3600);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen, list.length, setAt]);
  return (
    <div className="xtp-deckwrap" ref={ref}>
      <div className="xtp-kinds" role="tablist" aria-label="Kind of template">
        {KINDS.map((k) => (
          <button key={k} type="button" role="tab" aria-selected={kind === k} onClick={() => { setKind(k); setAt(0); setMine(true); }}>
            {kind === k && <motion.span layoutId="xtp-kind" className="xtp-kind-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span>{k}<i className="x-mono">{pad(k === 'All' ? ALL.length : ALL.filter((t) => t[2] === k).length)}</i></span>
          </button>
        ))}
      </div>
      <div className="xtp-deck" role="region" aria-roledescription="carousel" aria-label="Templates" tabIndex={0} onKeyDown={(e) => { if (e.key === 'ArrowRight') go(at + 1); if (e.key === 'ArrowLeft') go(at - 1); }}>
        {ALL.map((t) => {
          const i = list.indexOf(t);
          const d = i < 0 ? 9 : i - at;
          return <div key={t[0]} hidden={i < 0} className="xtp-slot"><Card t={t} d={d} onNext={() => go(at + 1)} onPrev={() => go(at - 1)} calm={calm} /></div>;
        })}
      </div>
      <div className="xtp-nav">
        <button type="button" className="xtp-arrow" aria-label="Previous template" onClick={() => go(at - 1)}>←</button>
        <span className="x-mono xtp-count" aria-live="polite">{pad(at + 1)} / {pad(list.length)}</span>
        <div className="xtp-dots">
          {list.slice(0, 10).map((t, i) => (
            <button key={t[0]} type="button" aria-label={'Go to slide ' + (i + 1)} aria-current={i === at % 10 ? 'true' : undefined} onClick={() => go(i)}><i /></button>
          ))}
        </div>
        <button type="button" className="xtp-arrow" aria-label="Next template" onClick={() => go(at + 1)}>→</button>
      </div>
    </div>
  );
}

function Commands({ t }) {
  const [slug, title] = t;
  const lines = [
    ['hanzo login', 'register or sign in'],
    ['hanzo template list', 'pick a starter'],
    [`hanzo template get ${slug}`, 'names the repository to clone, in its source'],
    [`git clone https://github.com/hanzo-apps/template-${slug}`, null],
    ['hanzo dev', 'in it, to start building'],
  ];
  return (
    <section className="x-sec xtp-cmd" data-room="dark" aria-labelledby="xtp-cmd-h">
      <div className="x-wrap xtp-cmd-in">
        <div>
          <SecHead dark kicker="Setup" title="Open one. Edit it in Hanzo." id="xtp-cmd-h" />
          <div className="xtp-setup2"><SetupMenu inline up /></div>
          <Strip />
        </div>
        <Rise className="xtp-term">
          <div className="xtp-term-top">
            <span className="xtp-lights" aria-hidden="true"><i /><i /><i /></span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={slug} className="x-mono" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>{title}</motion.span>
            </AnimatePresence>
            <Copy text={lines.map((l) => l[0]).join('\n')} />
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.pre key={slug} className="xtp-pre" initial="h" animate="s" exit={{ opacity: 0, transition: { duration: 0.15 } }} variants={{ s: { transition: { staggerChildren: 0.08 } } }}>
              {lines.map(([c, note]) => (
                <motion.span key={c} className="xtp-l" variants={{ h: { opacity: 0, x: -8 }, s: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } } }}>
                  <span className="xtp-ps" aria-hidden="true">$ </span>{c}{note && <span className="xtp-note">  # {note}</span>}{'\n'}
                </motion.span>
              ))}
              <span className="xtp-caret" aria-hidden="true" />
            </motion.pre>
          </AnimatePresence>
        </Rise>
      </div>
    </section>
  );
}

export default function Templates() {
  const [kind, setKind] = useState('All');
  const [at, setAt] = useState(0);
  const list = useMemo(() => (kind === 'All' ? ALL : ALL.filter((t) => t[2] === kind)), [kind]);
  const front = list[Math.min(at, list.length - 1)];
  const line = (t, d) => <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: d }}>{t}</motion.span></span>;
  return (
    <main className="xtp">
      <section className="xtp-hero" aria-labelledby="xtp-h1">
        <div className="x-wrap xtp-grid">
          <div className="xtp-copy">
            <motion.p className="x-kick" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>Templates</motion.p>
            <h1 id="xtp-h1" className="xtp-h1">{line('Start from', 0.05)}{line('a product.', 0.16)}</h1>
            <motion.p className="xtp-lede" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>Open one. Edit it in Hanzo.</motion.p>
            <motion.div className="xtp-front" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p key={front[0]} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: EASE }}>
                  <span className="x-mono">{front[2]}</span><b>{front[1]}</b>
                </motion.p>
              </AnimatePresence>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}>
            <Deck kind={kind} setKind={setKind} at={Math.min(at, list.length - 1)} setAt={setAt} list={list} />
          </motion.div>
        </div>
      </section>
      <Commands t={front} />
    </main>
  );
}
