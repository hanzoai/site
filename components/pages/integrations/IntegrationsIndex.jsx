'use client';
/* Integrations. Its idea is the hub: one base URL, and every tool Hanzo has a guide for already speaks to it.
   V2: 8/10 Catalogue rebuilt: the hub turning by itself as the hero, the starter as a big editor that switches language on its own, 19 numbered tool cards behind family chips with a gliding pill, each opening into its guide, the agent prompt in the one dark room; greys only, one ask.
   Signature: cards that open. Nineteen numbered tool cards (01 / 19), filtered by family chips whose pill glides and
   whose grid re-flows; press one and its title flies into the guide's headline (Morph navigation, data-morph on the
   title), the synchronized.studio move.
   Supporting: the hub in the hero (19 badges circling https://api.hanzo.ai/v1 by themselves, holding still and naming
   the tool under your hand), the starter editor that switches Python, TypeScript and Go on its own, and the dark
   room arriving as a widening panel (SceneWipe).
   Beyond: "Find your tool": type a tool, a language or a family; the chips' counts and the grid narrow as you type.
   Every word, link and line of code is Hanzo's (hanzo.ai/integrations). */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { Copy } from '../../ui';
import { A, More } from '../../kit';
import { Loose } from '../models/parts';
import SceneWipe from '../../v2/SceneWipe';
import MaskLines from '../../v2/MaskLines';
import AskBar from '../../v2/AskBar';
import '../../v2/ProofScale.css';
import './IntegrationsIndex.css';

const EASE = [0.16, 1, 0.3, 1];

/* ---------- the hub ---------- */
function Hub({ cards, base }) {
  const [hot, setHot] = useState(null);
  const n = cards.length;
  return (
    <div className={'xii-hub' + (hot ? ' held' : '')} style={{ '--n': n }}>
      <div className="xii-hub-c" aria-live="polite">
        <span className="pf-mono xii-hub-u">{base.replace(/^https:\/\//, '')}</span>
        <b>{hot ? hot.name : `${n} guides`}</b>
        <span className="pf-mono xii-hub-t">{hot ? hot.tag : 'one base URL'}</span>
      </div>
      <ul className="xii-ring" aria-label="Every integration">
        {cards.map((c, i) => (
          <li key={c.href} style={{ '--a': (i / n) * 360 + 'deg' }}>
            <A to={c.href} className="xii-sat" aria-label={c.name} data-cursor={c.name} onPointerEnter={() => setHot(c)} onPointerLeave={() => setHot(null)} onFocus={() => setHot(c)} onBlur={() => setHot(null)}>
              <span aria-hidden="true">{c.emoji}</span>
            </A>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- the starter: code as the hero object ---------- */
function Starter({ samples, base }) {
  const [on, setOn] = useState(0);
  const touched = useRef(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  useEffect(() => {
    if (!seen || calm || touched.current) return;
    const t = setInterval(() => { if (!touched.current) setOn((v) => (v + 1) % samples.length); }, 4200);
    return () => clearInterval(t);
  }, [seen, calm, samples.length]);
  const pick = (i) => { touched.current = true; setOn(i); };
  const keys = (e) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const j = (on + d + samples.length) % samples.length;
    pick(j);
    box.current.querySelectorAll('[role=tab]')[j].focus();
  };
  return (
    <div className="xii-win pf-obj" ref={box}>
      <div className="xii-win-h">
        <span className="xii-dots" aria-hidden="true"><i /><i /><i /></span>
        <div className="xii-tabs" role="tablist" aria-label="Language" onKeyDown={keys}>
          {samples.map((s, i) => (
            <button key={s.lang} type="button" role="tab" id={'xii-s-' + i} aria-selected={on === i} aria-controls={'xii-sp-' + i} tabIndex={on === i ? 0 : -1} onClick={() => pick(i)}>
              <span>{s.lang}</span>
              {on === i && !touched.current && !calm && <i className="xii-tab-t" aria-hidden="true" key={'t' + on} />}
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

/* ---------- the catalogue: chips that re-flow, cards that open ---------- */
function Catalogue({ groups }) {
  const [fam, setFam] = useState('All');
  const [q, setQ] = useState('');
  const t = q.trim().toLowerCase();
  const cards = useMemo(() => groups.flatMap((g) => g.cards.map((c) => ({ ...c, fam: g.title }))), [groups]);
  const hit = (c) => !t || (c.name + ' ' + c.desc + ' ' + c.tag + ' ' + c.fam).toLowerCase().includes(t);
  const shown = cards.filter((c) => (fam === 'All' || c.fam === fam) && hit(c));
  const fams = [['All', cards.filter(hit).length], ...groups.map((g) => [g.title, g.cards.filter((c) => hit({ ...c, fam: g.title })).length])];
  const calm = useReducedMotion();
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
          <h2 className="pf-display s" id="xii-cat-h">{fam === 'All' ? `${cards.length} guides` : fam}</h2>
          <label className="xii-find">
            <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find your tool" aria-label="Find your tool" />
          </label>
        </div>
        <div className="xii-chips" role="tablist" aria-label="Family" onKeyDown={keys}>
          {fams.map(([f, k], i) => (
            <button key={f} id={'xii-f-' + i} type="button" role="tab" aria-selected={fam === f} tabIndex={fam === f ? 0 : -1} onClick={() => setFam(f)} disabled={!k && fam !== f}>
              {fam === f && <motion.span layoutId="xii-chip" className="xii-chip-bg" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
              <span>{f}</span><span className="pf-mono">{k}</span>
            </button>
          ))}
        </div>
        {!shown.length && <p className="xii-none" role="status">Nothing matches “{q}”.</p>}
        <ul className="xii-grid" aria-live="polite">
          <AnimatePresence initial={false} mode="popLayout">
            {cards.map((c, i) => {
              const on = shown.includes(c);
              if (!on && !calm) return null;
              return (
                <motion.li key={c.href} layout={!calm} hidden={!on} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                  <A to={c.href} className="xii-card" data-cursor="Open">
                    <span className="xii-card-e" aria-hidden="true">{c.emoji}</span>
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
      </div>
    </section>
  );
}

export default function IntegrationsIndex({ doc }) {
  const cards = doc.groups.flatMap((g) => g.cards);
  return (
    <main className="xin xii">
      <section className="xii-hero" aria-labelledby="xin-h1">
        <div className="pf-wrap pf-grid xii-hero-g">
          <div className="xii-hero-a">
            <div data-morph-target><MaskLines as="h1" id="xin-h1" className="pf-display xii-h1" lines={doc.title.split(/ (?=everything)/)} delay={0.05} amount={0.1} /></div>
            <p className="pf-lede xii-lede xii-in" style={{ '--i': 2 }}><Loose nodes={doc.lede} /></p>
            <div className="xii-acts xii-in" style={{ '--i': 3 }}>
              {doc.actions.map((a, i) => (i
                ? <More key={a.label} to={a.href}>{a.label}</More>
                : <A key={a.label} to={a.href} className="pf-btn solid xii-ask" data-thumb={a.label}>{a.label}</A>))}
            </div>
          </div>
          <div className="xii-hero-b">
            <Hub cards={cards} base={doc.base} />
          </div>
        </div>
      </section>

      <section className="pf-sec tight xii-start" aria-label="Starter">
        <div className="pf-wrap">
          <Starter samples={doc.samples} base={doc.base} />
        </div>
      </section>

      <Catalogue groups={doc.groups} />

      {doc.paste && (
        <SceneWipe className="xii-paste" label={doc.paste.kicker}>
          <div className="pf-sec">
            <div className="pf-wrap pf-grid">
              <div className="xii-paste-a">
                <MaskLines as="h2" className="pf-display s xii-paste-h" lines={[doc.paste.kicker]} />
                <p className="pf-lede xii-paste-l">{doc.paste.lede}</p>
              </div>
              <div className="xii-prompt">
                <div className="xii-prompt-h"><span className="pf-mono">{doc.paste.label}</span><Copy text={doc.paste.code} label="Copy the agent prompt" className="xii-copy" /></div>
                <pre tabIndex={0}><code><span className="xii-caret" aria-hidden="true">›</span>{doc.paste.code}</code></pre>
              </div>
            </div>
          </div>
        </SceneWipe>
      )}
      <AskBar title={doc.label || 'Integrations'} label={doc.actions[0].label} to={doc.actions[0].href} />
    </main>
  );
}
