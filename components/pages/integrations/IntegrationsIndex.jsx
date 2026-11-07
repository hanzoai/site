'use client';
// Persona: a developer who already uses an SDK, framework or editor and wants Hanzo behind it (arrives from the header, docs or a guide)
// Goal: see that one base URL is all it takes, open their tool's guide, and get an API key
// CTA: Get an API key -> https://platform.hanzo.ai/api-keys (hero, closing dark room, phone thumb bar) · data-cta="integrations.hero", "integrations.band"
// Metric: api_key_created (MASTER §1, developers)
// Signature: cards that open. Nineteen numbered tool cards (01 / 19) behind family chips whose pill glides and whose grid re-flows; press one and its title flies into the guide's headline (Morph, data-morph on the title), the synchronized.studio move.
// Beyond: "Find your tool": type a tool, a language or a family; the chips' counts and the grid narrow as you type.
/* Integrations. Its idea is the hub: one base URL, and every tool Hanzo has a guide for already speaks to it.
   V2: 8/10 Catalogue on the MASTER rhythm: the count 19 as the one big figure inside a hub of badges turning around the base URL, a big grey editor that switches language on its own (with Pause), numbered cards that open into their guides, the agent prompt and the one ask in the closing dark room; deck timings, nothing floating.
   Supporting: the hub turning by itself (idle, pausable), the editor switching Python, TypeScript and Go on a timer
   (time, pausable), and the dark room arriving as a widening panel (SceneWipe).
   Every word, link and line of code is Hanzo's (hanzo.ai/integrations). */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { play } from '../../../lib/sound';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { Copy } from '../../ui';
import { A, More } from '../../kit';
import { Loose } from '../models/parts';
import Logo from './logos';
import SceneWipe from './Wipe';
import MaskLines from './Mask';
import '../../v2/ProofScale.css';
import '../../v2/ProofRhythm.css';
import './IntegrationsIndex.css';

const EASE = [0.16, 1, 0.3, 1];
const PILL = { duration: 0.3, ease: EASE };
/* a card leans toward the pointer, 2.5° at most (MASTER §3.1), fine pointers only */
const lean = (e) => {
  if (e.pointerType !== 'mouse') return;
  const el = e.currentTarget, r = el.getBoundingClientRect();
  el.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 5).toFixed(2) + 'deg');
  el.style.setProperty('--rx', ((0.5 - (e.clientY - r.top) / r.height) * 5).toFixed(2) + 'deg');
};
const rest = (e) => { e.currentTarget.style.setProperty('--rx', '0deg'); e.currentTarget.style.setProperty('--ry', '0deg'); };
const PauseIcon = ({ held }) => (held
  ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9l7-4.5z" fill="currentColor" /></svg>
  : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>);

/* ---------- the hub ---------- */
function Hub({ cards, base, held, setHeld }) {
  const [hot, setHot] = useState(null);
  const n = cards.length;
  return (
    <div className={'xii-hub' + (hot || held ? ' held' : '')} style={{ '--n': n }}>
      <button type="button" className="xii-pause" aria-label="Pause" aria-pressed={held} onClick={() => setHeld((v) => !v)}><PauseIcon held={held} /></button>
      <div className="xii-hub-c" aria-live="polite">
        <span className="pf-mono xii-hub-u">{base.replace(/^https:\/\//, '')}</span>
        {hot
          ? <><b className="xii-hub-n">{hot.name}</b><span className="pf-mono xii-hub-t">{hot.tag}</span></>
          : <b className="pf-moment xii-hub-k">{n}</b>}
      </div>
      <ul className="xii-ring" aria-label="Every integration">
        {cards.map((c, i) => (
          <li key={c.href} style={{ '--a': (i / n) * 360 + 'deg' }}>
            <A to={c.href} className="xii-sat" aria-label={c.name} onPointerEnter={() => setHot(c)} onPointerLeave={() => setHot(null)} onFocus={() => setHot(c)} onBlur={() => setHot(null)}>
              <Logo slug={c.slug} name={c.name} />
            </A>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- the sticky local band: the page's name, the hub in miniature (19 dots, paused with the hub), the ask (quiet) ---------- */
function Local({ n, label, ask, held }) {
  return (
    <div className="xii-local">
      <div className="pf-wrap xii-local-in">
        <span className={'xii-mini' + (held ? ' held' : '')} aria-hidden="true">{Array.from({ length: n }, (_, i) => <i key={i} style={{ '--a': (i / n) * 360 + 'deg' }} />)}</span>
        <span className="pf-mono xii-local-t">{label}</span>
        <span className="pf-mono xii-local-n" aria-hidden="true">{n}</span>
      </div>
    </div>
  );
}

/* ---------- the starter: code as the hero object ---------- */
function Starter({ samples, base }) {
  const [on, setOn] = useState(0);
  const [held, setHeld] = useState(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  const auto = seen && !calm && !held;
  // the editor switches language on its own until you pick one or press Pause (one timer per step, no interval)
  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(() => setOn((v) => (v + 1) % samples.length), 4200);
    return () => clearTimeout(t);
  }, [auto, on, samples.length]);
  const pick = (i) => { setHeld(true); setOn(i); };
  const keys = (e) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const j = (on + d + samples.length) % samples.length;
    pick(j);
    box.current.querySelectorAll('[role=tab]')[j].focus();
  };
  return (
    <div className="xii-win" ref={box}>
      <div className="xii-win-h">
        <button type="button" className="xii-pause dark" aria-label="Pause" aria-pressed={held} onClick={() => setHeld((v) => !v)}><PauseIcon held={held} /></button>
        <div className="xii-tabs" role="tablist" aria-label="Language" onKeyDown={keys}>
          {samples.map((s, i) => (
            <button key={s.lang} type="button" role="tab" id={'xii-s-' + i} aria-selected={on === i} aria-controls={'xii-sp-' + i} tabIndex={on === i ? 0 : -1} onClick={() => pick(i)}>
              <span>{s.lang}</span>
              {on === i && auto && <i className="xii-tab-t" aria-hidden="true" key={'t' + on} />}
            </button>
          ))}
        </div>
        <Copy text={samples[on].text} className="xii-copy" />
      </div>
      <div className="xii-win-b">
        {samples.map((s, i) => (
          <div key={s.lang} role="tabpanel" id={'xii-sp-' + i} aria-labelledby={'xii-s-' + i} hidden={on !== i}>
            <pre tabIndex={0} className="xii-code"><code>{s.lines.map((l, j) => {
              const hz = /hanzo/i.test(l.map((x) => x[1]).join(''));
              return (
                <span key={j + ':' + on} className={'xii-ln' + (hz ? ' hz' : '')} style={{ '--j': j }}>
                  <span className="xii-no" aria-hidden="true">{j + 1}</span>
                  {l.length ? l.map(([k, x], m) => <span key={m} className={'c-' + k}>{x}</span>) : ' '}{'\n'}
                </span>
              );
            })}</code></pre>
          </div>
        ))}
      </div>
      <div className="xii-win-f pf-mono"><span>{base}</span><span>{samples[on].lang}</span></div>
    </div>
  );
}

/* ---------- the open card: the card grows into a sheet with its guide's headline and first sample ---------- */
const OPEN = { duration: 0.6, ease: [0.4, 0, 0.2, 1] }; // MASTER: the open is 600 ms in-out, no spring
function Open({ c, p, onClose }) {
  const box = useRef(null);
  const close = useRef(null);
  useEffect(() => {
    const back = document.activeElement;
    document.documentElement.classList.add('x-lock');
    window.__lenis && window.__lenis.stop();
    close.current && close.current.focus({ preventScroll: true });
    const key = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !box.current) return;
      const f = [...box.current.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')];
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    };
    addEventListener('keydown', key);
    return () => {
      removeEventListener('keydown', key);
      document.documentElement.classList.remove('x-lock');
      window.__lenis && window.__lenis.start();
      back && back.focus && back.focus({ preventScroll: true });
    };
  }, [onClose]);
  return (
    <div className="xii-open" role="dialog" aria-modal="true" aria-labelledby="xii-open-h" data-swipe-own>
      <motion.button type="button" className="xii-open-scrim" aria-hidden="true" tabIndex={-1} onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} />
      <motion.article ref={box} className="xii-open-card" layoutId={'xii-o-' + c.slug} transition={OPEN} style={{ borderRadius: 24 }} data-lenis-prevent>
        <motion.div className="xii-open-in" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.3 } }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>
          <header className="xii-open-h">
            <span className="xii-open-e" aria-hidden="true"><Logo slug={c.slug} name={c.name} /></span>
            <div>
              <h3 id="xii-open-h">{c.name}</h3>
              <p className="pf-mono xii-open-k">{c.tag}</p>
            </div>
            <button type="button" ref={close} className="xii-open-x" onClick={onClose} aria-label="Close">
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </header>
          {c.desc && <p className="xii-open-d">{c.desc}</p>}
          {p && p.lines.length > 0 && (
            <div className="xii-open-code">
              <p className="pf-mono xii-open-cap"><span>{p.sample}</span><span>{p.lang}</span></p>
              <pre tabIndex={0} className="xii-code"><code>{p.lines.map((l, j) => {
                const hz = /hanzo/i.test(l.map((x) => x[1]).join(''));
                return <span key={j} className={'xii-ln' + (hz ? ' hz' : '')} style={{ '--j': j }}><span className="xii-no" aria-hidden="true">{j + 1}</span>{l.length ? l.map(([k, x], m) => <span key={m} className={'c-' + k}>{x}</span>) : ' '}{'\n'}</span>;
              })}</code></pre>
            </div>
          )}
          <A to={c.href} className="pf-btn solid xii-open-go" data-cta="integrations.open">
            <span>{p ? p.title : c.name}</span>
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </A>
        </motion.div>
      </motion.article>
    </div>
  );
}

/* ---------- the catalogue: chips that re-flow, cards that open ---------- */
function Catalogue({ groups, label, previews = {} }) {
  const [open, setOpen] = useState(null);
  const shut = useCallback(() => setOpen(null), []);
  const [fam, setFam] = useState('All');
  const [q, setQ] = useState('');
  const t = q.trim().toLowerCase();
  const cards = useMemo(() => groups.flatMap((g) => g.cards.map((c) => ({ ...c, fam: g.title }))), [groups]);
  const hit = (c) => !t || (c.name + ' ' + c.desc + ' ' + c.tag + ' ' + c.fam).toLowerCase().includes(t);
  const shown = cards.filter((c) => (fam === 'All' || c.fam === fam) && hit(c));
  const fams = [['All', cards.filter(hit).length], ...groups.map((g) => [g.title, g.cards.filter((c) => hit({ ...c, fam: g.title })).length])];
  const calm = useReducedMotion();
  const gridRef = useRef(null);
  const gridIn = useInView(gridRef, { once: true, amount: 0.05 });
  const keys = (e) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    const i = (fams.findIndex(([f]) => f === fam) + d + fams.length) % fams.length;
    setFam(fams[i][0]);
    document.getElementById('xii-f-' + i)?.focus();
  };
  return (
    <section className="pf-sec xii-cat" id="all" aria-labelledby="xii-cat-h">
      <div className="pf-wrap">
        <div className="xii-cat-top">
          <h2 className="pf-head" id="xii-cat-h">{fam === 'All' ? label : fam}</h2>
          <label className="xii-find">
            <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            {/* a search looks across every family, so typing returns the chips to All */}
            <input type="search" value={q} onChange={(e) => { setQ(e.target.value); if (e.target.value && fam !== 'All') setFam('All'); }} placeholder="Find your tool" aria-label="Find your tool" />
          </label>
        </div>
        <div className="xii-chips" role="tablist" aria-label="Family" onKeyDown={keys}>
          {fams.map(([f, k], i) => (
            <button key={f} id={'xii-f-' + i} type="button" role="tab" aria-selected={fam === f} tabIndex={fam === f ? 0 : -1} onClick={() => setFam(f)} disabled={!k && fam !== f}>
              {fam === f && <motion.span layoutId="xii-chip" className="xii-chip-bg" transition={PILL} />}
              <span>{f}</span><span className="pf-mono">{k}</span>
            </button>
          ))}
        </div>
        {!shown.length && (
          <div className="xii-none" role="status">
            <p>Nothing matches “{q}”.</p>
            <button type="button" className="xii-none-a" onClick={() => { setQ(''); setFam('All'); }}><span>All</span><span className="pf-mono">{cards.length}</span></button>
          </div>
        )}
        {/* the cards open in place (their own morph, so the site's page-turn stage stays out of it); the grid arrives
            as one list when it is reached */}
        <ul className="xii-grid" aria-live="polite" data-no-morph ref={gridRef} data-in={gridIn ? '' : undefined}>
          <AnimatePresence initial={false} mode="popLayout">
            {cards.map((c, i) => {
              const on = shown.includes(c);
              if (!on && !calm) return null;
              // each family's first guide is wide when the family has three or more (rows then fill in reading order);
              // if that would leave the last row one short, the last guide is wide too, so no row ends in a hole
              const lead = (k) => (k === 0 || cards[k - 1].fam !== cards[k].fam) && cards.filter((x) => x.fam === cards[k].fam).length >= 3;
              const slots = cards.length + cards.filter((_, k) => lead(k)).length;
              const wide = fam === 'All' && !t && (lead(i) || (i === cards.length - 1 && slots % 4 === 3));
              return (
                <motion.li key={c.href} layout={!calm} hidden={!on} className={wide ? 'wide' : undefined} style={{ '--k': Math.min(i, 12) }} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15, ease: [0, 0, 0.2, 1] } }} transition={PILL}>
                  {/* a plain press opens the card where it is (its guide is one press further); a modified click, a
                      middle click or no scripts follow the link straight to the guide */}
                  <A to={c.href} className="xii-card" onPointerMove={lean} onPointerLeave={rest} aria-haspopup="dialog"
                    onClick={(e) => { if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; e.preventDefault(); play('whoosh'); setOpen(c); }}>
                    <motion.span className="xii-card-bg" layoutId={'xii-o-' + c.slug} transition={OPEN} style={{ borderRadius: 24 }} aria-hidden="true" />
                    <span className="xii-card-e" aria-hidden="true"><Logo slug={c.slug} name={c.name} /></span>
                    <span className="xii-card-fam pf-mono" aria-hidden="true">{String(cards.indexOf(c) + 1).padStart(2, '0')} / {cards.length}</span>
                    <b className="xii-card-n" data-morph>{c.name}</b>
                    <span className="xii-card-d">{c.desc}</span>
                    <span className="xii-card-f">
                      <span className="pf-mono">{c.tag}</span>
                      <span className="xii-card-go" aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                    </span>
                  </A>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
        <AnimatePresence>{open && <Open key={open.slug} c={open} p={previews[open.slug]} onClose={shut} />}</AnimatePresence>
      </div>
    </section>
  );
}

export default function IntegrationsIndex({ doc, previews }) {
  const cards = doc.groups.flatMap((g) => g.cards);
  const [held, setHeld] = useState(false);
  return (
    <main className="xin xii pf-r">
      <section className="xii-hero" aria-labelledby="xin-h1">
        <div className="pf-wrap pf-grid xii-hero-g">
          <div className="xii-hero-a">
            {/* the h1 cuts in by line mask in plain CSS, so it plays from the first paint with no wait for scripts */}
            <div data-morph-target>
              <h1 id="xin-h1" className="pf-display xii-h1">
                {doc.title.split(/ (?=everything)/).map((l, i, a) => <span key={i} className="xii-h1-l"><span style={{ '--i': i }}>{l}</span>{i < a.length - 1 ? ' ' : null}</span>)}
              </h1>
            </div>
            <p className="pf-lede xii-lede xii-in" style={{ '--i': 2 }}><Loose nodes={doc.lede} /></p>
            <div className="xii-acts xii-in" style={{ '--i': 3 }}>
              {doc.actions.map((a, i) => (i
                ? <More key={a.label} to={a.href}>{a.label}</More>
                : <A key={a.label} to={a.href} className="pf-btn solid xii-ask" data-thumb={a.label} data-cta="integrations.hero">{a.label}</A>))}
            </div>
          </div>
          <div className="xii-hero-b">
            <Hub cards={cards} base={doc.base} held={held} setHeld={setHeld} />
          </div>
        </div>
      </section>

      <div className="xii-after">
      <Local n={cards.length} label={doc.label || 'Integrations'} ask={doc.actions[0]} held={held} />
      <section className="pf-sec tight xii-start" aria-label="Starter">
        <div className="pf-wrap">
          <Starter samples={doc.samples} base={doc.base} />
        </div>
      </section>

      <Catalogue groups={doc.groups} label={doc.label || 'Integrations'} previews={previews} />
      </div>

      {doc.paste && (
        <SceneWipe className="xii-paste" label={doc.paste.kicker}>
          <div className="pf-sec">
            <div className="pf-wrap pf-grid">
              <div className="xii-paste-a">
                <MaskLines as="h2" className="pf-head xii-paste-h" lines={[doc.paste.kicker]} />
                <p className="pf-lede xii-paste-l">{doc.paste.lede}</p>
                <A to={doc.actions[0].href} className="pf-btn xii-band-ask" data-cta="integrations.band">{doc.actions[0].label}</A>
              </div>
              <div className="xii-prompt">
                <div className="xii-prompt-h"><span className="pf-mono">{doc.paste.label}</span><Copy text={doc.paste.code} label="Copy the agent prompt" className="xii-copy" /></div>
                <pre tabIndex={0}><code><span className="xii-caret" aria-hidden="true">›</span>{doc.paste.code}</code></pre>
              </div>
            </div>
          </div>
        </SceneWipe>
      )}
    </main>
  );
}
