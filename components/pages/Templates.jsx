'use client';
// Signature: a deck of live browser windows that riffles itself; pull one forward (drag, arrows or a dot) and its address bar types its .hanzo.app name.
// Beyond: the commands for the template in front, with its slug and its source repository filled in, ready to copy.
/* Persona: builders who want a finished product to start from. Goal: open a template in Hanzo. CTA: "Edit in Hanzo" → /chat?template=<slug>. Metric: first_chat.
   Templates. Hanzo's twelve products with previews, as a deck of browser windows: the one in front is the one you
   open, the next three wait behind it, the ones you passed fly off to the left. The chips re-deal the deck by kind.
   Under it, a dense wall of all twelve previews that open into sheets (the ring follows the deck); the setup room in
   the dark with the commands for the template in front; a closing band with the one ask. Deck greys only.
   Motion budget: signature = the riffling deck (drag); supporting = Settle, Open (wall sheets), magnetic. No springs. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { EASE, Copy, Magnetic } from '../ui';
import { A, Img } from '../kit';
import SetupMenu from '../SetupMenu';
import LineMask from '../v2/x-gauss/LineMask';
import Settle from '../v2/Settle';
import { OpenCards } from '../v2/OpenSheet';
import NoJs from '../v2/x-gauss/NoJs';
import { usePause } from '../v2/x-gauss/Pause';
import '../v2/Scale.css';
import '../v2/x-gauss/Rhythm.css';
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

/* A preview: Hanzo's own screenshot over a drawn page in greys (its name, nav, hero and blocks). If the screenshot
   fails to load, the drawn page stays, so a missing preview still reads as that site, never a broken image. */
function Ghost({ title, kind }) {
  return (
    <span className="xtp-ghost" data-k={kind} aria-hidden="true">
      <span className="xtp-ghost-nav"><b>{title}</b><i /><i /><i /></span>
      <span className="xtp-ghost-hero"><span className="x-mono">{kind}</span><strong>{title}</strong><i /><i /><em /></span>
      <span className="xtp-ghost-row"><i /><i /><i /><i /></span>
    </span>
  );
}
function Shot({ slug, title, kind, priority, alt }) {
  const ref = useRef(null);
  const [bad, setBad] = useState(false);
  useEffect(() => { const i = ref.current; if (i && i.complete && !i.naturalWidth) setBad(true); }, []);
  return (<>
    <Ghost title={title} kind={kind} />
    {/* data-t feeds the image's own ::before, which only paints when the image is broken: a blocked preview shows a
        drawn page with the template's name from the first paint, with or without JS, never a broken-image icon */}
    <Img ref={ref} src={`https://hanzo.ai/templates/${slug}.webp`} alt={alt} data-t={title} w={1280} h={800} draggable={false} priority={priority} className={bad ? 'xtp-bad' : ''} onError={() => setBad(true)} />
  </>);
}

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
      <div className="xtp-strip-l">
        {AGENTS.slice(0, 5).map(([n, h]) => <A key={n} to={D + h}>{n}<span className="x-sr"> (opens in a new tab)</span></A>)}
        <button type="button" aria-expanded={open} aria-controls="xtp-all" onClick={() => setOpen(!open)}>+{AGENTS.length - 5} more</button>
      </div>
      <div id="xtp-all" className="xtp-all" hidden={!open}>
        <input type="text" placeholder="Filter agents..." aria-label="Filter agents" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" spellCheck={false} />
        <ul>
          {rows.map(([n, h, mcp]) => <li key={n}><A to={D + h}><b>{n}</b>{mcp ? <span>MCP client</span> : null}<i className="x-sr"> (opens in a new tab)</i></A></li>)}
        </ul>
        {!rows.length && <p className="xtp-none">No agents match.</p>}
      </div>
    </div>
  );
}

function Card({ t, d, onPrev, onNext, calm, narrow }) {
  const [slug, title, kind, what] = t;
  const front = d === 0;
  const gone = d < 0;
  const moved = useRef(false); // a drag flips the deck; it never also opens the card
  const pose = gone ? { x: '-115%', y: 0, scale: 0.92, rotate: -8, opacity: 0 } : { x: d * (narrow ? 12 : 48), y: -d * (narrow ? 14 : 30), scale: 1 - d * 0.035, rotate: 0, opacity: d > 3 ? 0 : 1 - d * 0.16 };
  return (
    <motion.article
      className={'xtp-card' + (front ? ' front' : '')}
      style={{ zIndex: 50 - Math.abs(d), transformOrigin: '100% 100%' }}
      initial={false}
      animate={pose}
      transition={calm ? { duration: 0 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      drag={front ? 'x' : false}
      dragSnapToOrigin
      dragElastic={0.5}
      onDragStart={() => { moved.current = true; }}
      onDragEnd={(e, i) => { if (i.offset.x < -80 || i.velocity.x < -500) onNext(); else if (i.offset.x > 80 || i.velocity.x > 500) onPrev(); setTimeout(() => { moved.current = false; }, 0); }}
      onClickCapture={(e) => { if (moved.current) { e.preventDefault(); e.stopPropagation(); } }}
      aria-hidden={!front}
      data-swipe-own
    >
      <div className="xtp-bar">
        <span className="xtp-lights" aria-hidden="true"><i /><i /><i /></span>
        <span className="xtp-url x-mono"><span key={front ? slug : 'x'} className={front ? 'typed' : ''}>{slug}</span>.hanzo.app</span>
        <span className="xtp-kind x-mono">{kind}</span>
      </div>
      <A to={'/chat?template=' + encodeURIComponent(slug)} className="xtp-shot" tabIndex={front ? 0 : -1} draggable={false}>
        <Shot slug={slug} title={title} kind={kind} priority={front} alt={`${title} template preview`} />
      </A>
      <div className="xtp-foot">
        <div><h3>{title}</h3><p>{what}</p></div>
        <A to={'/chat?template=' + encodeURIComponent(slug)} className="xtp-edit" tabIndex={front ? 0 : -1} data-cta="templates.card">Edit in Hanzo <span aria-hidden="true">→</span></A>
      </div>
    </motion.article>
  );
}

function Deck({ kind, setKind, at, setAt, list, front, wall }) {
  const [mine, setMine] = useState(false);
  const [paused, pauseBtn] = usePause({ position: 'relative', right: 'auto', top: 'auto' });
  const calm = useReducedMotion();
  const ref = useRef(null);
  const seen = useInView(ref, { amount: 0.35 });
  const [narrow, setNarrow] = useState(false); // phones peek the back cards less, so the front window keeps its width
  useEffect(() => { const m = matchMedia('(max-width: 899px)'); const f = () => setNarrow(m.matches); f(); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);
  const go = (k) => { setMine(true); setAt((k + list.length) % list.length); };
  useEffect(() => {
    if (mine || calm || !(seen || wall) || paused || list.length < 2) return; // it keeps dealing while the wall is in view, so the ring walks the wall
    const t = setTimeout(() => setAt((v) => (v + 1) % list.length), 3600);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen, wall, paused, list.length, setAt]);
  return (
    <div className={'xtp-deckwrap' + (paused ? ' paused' : '')} ref={ref}>
      <div className="xtp-kinds" role="group" aria-label="Kind of template">
        {KINDS.map((k) => (
          <button key={k} type="button" aria-pressed={kind === k} onClick={() => { setKind(k); setAt(0); setMine(true); }}>
            <span>{k}<i className="x-mono">{pad(k === 'All' ? ALL.length : ALL.filter((t) => t[2] === k).length)}</i></span>
          </button>
        ))}
      </div>
      <div className="xtp-deck" role="region" aria-roledescription="carousel" aria-label="Templates" tabIndex={0} onKeyDown={(e) => { if (e.key === 'ArrowRight') go(at + 1); if (e.key === 'ArrowLeft') go(at - 1); }}>
        {ALL.map((t) => {
          const i = list.indexOf(t);
          const d = i < 0 ? 9 : i - at;
          return <div key={t[0]} hidden={i < 0} className="xtp-slot"><Card t={t} d={d} onNext={() => go(at + 1)} onPrev={() => go(at - 1)} calm={calm} narrow={narrow} /></div>;
        })}
        {/* wide screens: the pause sits inside the deck, in the empty corner the fanned windows leave top left */}
        {!narrow && <span className="xtp-pause in">{pauseBtn}</span>}
      </div>
      <div className="xtp-nav">
        <p className="xtp-front"><span className="x-mono">{front[2]}</span><b>{front[1]}</b></p>
        <button type="button" className="xtp-arrow" aria-label="Previous template" onClick={() => go(at - 1)}>←</button>
        <span className="x-mono xtp-count" aria-live={mine ? 'polite' : 'off'}>{pad(at + 1)} / {pad(list.length)}</span>
        <div className="xtp-dots">
          {list.map((t, i) => (
            <button key={t[0]} type="button" aria-label={t[1]} aria-current={i === at ? 'true' : undefined} onClick={() => go(i)}><i /></button>
          ))}
        </div>
        <button type="button" className="xtp-arrow" aria-label="Next template" onClick={() => go(at + 1)}>→</button>
        {narrow && <span className="xtp-pause">{pauseBtn}</span>}
      </div>
    </div>
  );
}

/* The commands type themselves character by character (32 ms a key, one rAF loop) each time the room comes into view
   or the deck changes template. Every character is in the HTML from the server: the untyped rest is drawn in
   transparent ink, so the block never changes size, JS off and reduced motion show the finished block. */
function useTyped(total, key, seen) {
  const calm = useReducedMotion();
  const [n, setN] = useState(total);
  useEffect(() => {
    if (calm || !seen) { setN(total); return; }
    let raf, t0;
    const step = (t) => { t0 ??= t; const k = Math.min(total, Math.floor((t - t0) / 32)); setN(k); if (k < total) raf = requestAnimationFrame(step); };
    setN(0); raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [key, seen, total, calm]);
  return n;
}

function Commands({ t }) {
  const [slug, title] = t;
  const term = useRef(null);
  const seen = useInView(term, { amount: 0.5 }); // the commands type themselves again each time the room comes into view
  // the commands only: Copy gives exactly what the block shows (the "$ " prompt is drawn, not selectable)
  const lines = [['hanzo login'], ['hanzo template list'], [`hanzo template get ${slug}`], ['hanzo dev']];
  const total = lines.reduce((s, [c]) => s + c.length, 0);
  const n = useTyped(total, slug, seen);
  let left = n; // characters still to show, line by line; a line starts once the one before it is done
  return (
    <section className="w2-sec xtp-cmd w2-dark" data-room="dark" aria-labelledby="xtp-cmd-h">
      <div className="w2-wrap xtp-cmd-in">
        <div>
          <h2 id="xtp-cmd-h" className="w2-display s xtp-cmd-h">Drop into any agent</h2>
          <div className="xtp-setup2"><SetupMenu inline up /></div>
          <Strip />
        </div>
        <div className="xtp-term" ref={term}>
          <div className="xtp-term-top">
            <span className="xtp-lights" aria-hidden="true"><i /><i /><i /></span>
            <span key={slug} className="x-mono xtp-term-t">{title}</span>
            <Copy text={lines.map((l) => l[0]).join('\n')} />
          </div>
          <pre className="xtp-pre">
            {lines.map(([c], li) => {
              const k = Math.max(0, Math.min(c.length, left));
              const typing = left >= 0 && (k < c.length || li === lines.length - 1); // the line the caret is on (the last, once done)
              const wait = left < 0; // a line not reached yet: its prompt waits too
              left -= c.length;
              return (
                <span key={c} className="xtp-l" data-wait={wait ? '' : undefined}>
                  <span className="xtp-ps" aria-hidden="true">$ </span>{c.slice(0, k)}{typing && <span className="xtp-caret" aria-hidden="true" />}<span className="xtp-rest">{c.slice(k)}</span>{'\n'}
                </span>
              );
            })}
          </pre>
        </div>
      </div>
    </section>
  );
}

/* The shelf: all twelve as tiles; each opens into a sheet with its preview, what it is, and its commands. */
function Shelf({ cur, onSeen }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.15 });
  const here = useInView(ref, { amount: 0.25 });
  useEffect(() => { onSeen(here); }, [here, onSeen]);
  const calm = useReducedMotion();
  const [armed, setArmed] = useState(false); // the wall deals in only once JS runs; JS off and reduced motion show it whole
  useEffect(() => { if (!calm) setArmed(true); }, [calm]);
  // while the wall is in view every preview drifts down its own page, out of step with its neighbours (CSS, paused off screen)
  return (
    <section ref={ref} className={'w2-sec tight xtp-shelf' + (armed ? ' arm' : '') + (seen ? ' in' : '') + (here ? ' here' : '')} aria-labelledby="xtp-shelf-h">
      <div className="w2-wrap">
        <h2 id="xtp-shelf-h" className="x-sr">Templates</h2>
        <p className="xtp-shelf-k w2-kicker">All <span className="x-mono">{pad(ALL.length)}</span></p>
        <OpenCards cols={4} className="xtp-tiles" items={ALL.map(([slug, title, kind, what]) => ({
          id: 'xtp-' + slug, k: kind, t: title,
          art: <span className={'xtp-tile-img' + (slug === cur ? ' on' : '')}><Shot slug={slug} title={title} kind={kind} alt="" /><span className="x-mono">{slug}.hanzo.app</span></span>,
          body: (<>
            <p>{what}</p>
            <p><A to={'/chat?template=' + encodeURIComponent(slug)} className="w2-cta" data-cta="templates.sheet">Edit in Hanzo <i aria-hidden="true">→</i></A></p>
            <p className="xtp-sheet-cmd x-mono">hanzo template get {slug}</p>
          </>),
        }))} />
      </div>
    </section>
  );
}

export default function Templates() {
  const [kind, setKind] = useState('All');
  const [at, setAt] = useState(0);
  const [wall, setWall] = useState(false);
  const list = useMemo(() => (kind === 'All' ? ALL : ALL.filter((t) => t[2] === kind)), [kind]);
  const front = list[Math.min(at, list.length - 1)];
  return (
    <main id="main" className="xtp w2 gx">
      <NoJs />
      <section className="xtp-hero" aria-labelledby="xtp-h1" data-morph-target>
        <div className="w2-wrap xtp-hero-g">
          <div className="xtp-top">
            <div>
              <LineMask as="h1" id="xtp-h1" now className="w2-display xtp-h1" lines={['Start from', 'a product.']} />
              <p className="xtp-kick x-mono">Templates</p>
            </div>
            <motion.div className="xtp-top-r" initial={{ y: 14 }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}>
              <p className="w2-lede xtp-lede">Open one. Edit it in Hanzo.</p>
              <Magnetic strength={0.25}><A to={'/chat?template=' + encodeURIComponent(front[0])} className="w2-cta" data-thumb="Edit in Hanzo" data-cta="templates.hero">Edit in Hanzo <i aria-hidden="true">→</i></A></Magnetic>
            </motion.div>
          </div>
          <Settle from={1.02} lift={0}>
            <div className="xtp-stage">
              <Deck kind={kind} setKind={setKind} at={Math.min(at, list.length - 1)} setAt={setAt} list={list} front={front} wall={wall} />
            </div>
          </Settle>
        </div>
      </section>
      <Shelf cur={front[0]} onSeen={setWall} />
      <Commands t={front} />
      <section className="w2-sec tight xtp-band" aria-label="Edit in Hanzo">
        <div className="w2-wrap xtp-band-in">
          {/* the close carries the window in front, small: the thing the ask opens */}
          <A to={'/chat?template=' + encodeURIComponent(front[0])} className="xtp-band-win" tabIndex={-1} aria-hidden="true">
            <span className="xtp-bar"><span className="xtp-lights"><i /><i /><i /></span><span className="xtp-url x-mono"><span>{front[0]}</span>.hanzo.app</span></span>
            <span className="xtp-tile-img"><Shot slug={front[0]} title={front[1]} kind={front[2]} alt="" /></span>
          </A>
          <p className="xtp-band-t">{front[1]} <span className="x-mono">{front[0]}.hanzo.app</span></p>
          <Magnetic strength={0.25}><A to={'/chat?template=' + encodeURIComponent(front[0])} className="w2-cta" data-thumb="Edit in Hanzo" data-cta="templates.close">Edit in Hanzo <i aria-hidden="true">→</i></A></Magnetic>
        </div>
      </section>
    </main>
  );
}
