'use client';
/* /careers. V2: 8/10 v3 to JAMES.md: no labels over headlines, ink and greys only, the hero and its one ask fit
   1470×801, one solid per screen with the ask sticky after the hero (the site's Ask bar, from data-thumb), every section holds an object, perks pinned.
   Persona: an engineer or researcher deciding whether to apply (PLAN 1.1 "one contact click").
   Goal: open a role and apply.  CTA: "View Open Positions" (careers.hero), the same ask in the site Ask bar (data-thumb) and the close.
   Metric: cta_click careers.* leading to a role page.
   Signature: the open roles are a deck of sheets. Scroll and each role rises over the last while the stack behind it
   settles back; click a sheet and its title flies into the role page's headline (Morph, synchronized.studio).
   Supporting (3): masked kinetic headline, once; the How-we-hire card sliding its steps by itself; the perks pinned,
   one in as the last goes out, each with its giant numeral and a Sigil field.
   Beyond: match what you know. Tap the skills you have, taken word for word from the role descriptions (LLVM, RLHF,
   zero-knowledge, data visualization…): the roles that ask for them stay lit with the words marked, the rest step back.
   Deletes: the orange accent, the kicker over the h1 and over every headline, "Link" / "Copied" / "Clear" / "Match what
   you know" / "ask for it" as visible words (icons with aria-labels now), native title= tooltips, the cross-fade in the
   hiring card, the second solid button in Academic, solid "Apply" on every sheet.
   The role pages (/careers/<slug>) keep Careers.css; this index has its own CareersBoard.css. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { A } from '../kit';
import Sigil from '../Sigil';
import MaskLines from './careers/MaskLines'; // careers' own variant; main's v2/MaskLines differs
import PinScenes from './company/PinScenes';
import useArrived from './company/useArrived';
import { useArrival } from './doorway';
import '../v2/vc-type.css';
import './CareersBoard.css';

const EASE = [0.16, 1, 0.3, 1];
const NOJS = { __html: '<style>.xcb-hero-f,.xcb-hero-o{opacity:1!important;transform:none!important}</style>' }; // JS off: the hero is legible
const ARROW = <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* How we hire: the four steps slide through a mask by themselves (never two titles at once); tap a step to hold it. */
function Hire({ how }) {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.5 });
  const calm = useReducedMotion();
  const n = how.steps.length;
  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % n), 3400);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen, n]);
  return (
    <div className="xcb-hire vc-obj" ref={box}>
      <div className="xcb-hire-h">
        <span className="xcb-hire-k">{how.title}</span>
        <span className="xcb-hire-k vc-num" aria-hidden="true">{String(at + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
      </div>
      <div className="xcb-hire-stage">
        {how.steps.map(([t, d], i) => (
          <motion.div key={t} className="xcb-hire-s" initial={false} aria-hidden={i !== at}
            animate={{ y: i === at ? '0%' : i < at ? '-104%' : '104%' }}
            transition={{ duration: 0.8, ease: EASE }}>
            <span className="xcb-hire-i vc-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <b>{t}</b>
            <p>{d}</p>
          </motion.div>
        ))}
      </div>
      <ol className="xcb-hire-n">
        {how.steps.map(([t], i) => (
          <li key={t}>
            <button type="button" aria-pressed={i === at} onClick={() => { setMine(true); setAt(i); }}>
              <i>{i < at && <u className="done" />}{i === at && <u key={at + (mine ? 'm' : '')} className={mine || calm ? 'done' : 'run'} />}</i>
              <span>{t}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* Copy the role's direct link. An icon only: a link glyph that turns into a drawn tick (the words live in aria). */
function CopyDirect({ id, title }) {
  const [ok, setOk] = useState(false);
  return (
    <button type="button" className={'xcb-cp' + (ok ? ' ok' : '')} aria-label={ok ? 'Link copied' : 'Copy direct link to ' + title}
      onClick={async () => {
        let done = true;
        try { await navigator.clipboard.writeText(location.origin + '/careers#' + id); } catch { done = false; }
        if (!done) return;
        setOk(true); setTimeout(() => setOk(false), 1600);
      }}>
      {ok
        ? <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><motion.path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, ease: EASE }} /></svg>
        : <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M6.8 9.2a2.6 2.6 0 0 0 3.7 0l2-2a2.6 2.6 0 0 0-3.7-3.7l-.6.6M9.2 6.8a2.6 2.6 0 0 0-3.7 0l-2 2a2.6 2.6 0 0 0 3.7 3.7l.6-.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
      <span className="x-sr" role="status">{ok ? 'Link copied' : ''}</span>
    </button>
  );
}

// skills as Hanzo's role descriptions write them; a chip is shown only if some role asks for it
const SKILLS = ['transformers', 'RLHF', 'distributed', 'LLVM', 'MLIR', 'compilers', 'Model Context Protocol', 'agents', 'zero-knowledge', 'cryptography', 'Go/Rust', 'developer tools', 'data visualization'];
const stem = (t) => t.toLowerCase().replace(/s$/, ''); // "agents" also finds "agent infrastructure"
const asks = (r, k) => (r.title + ' ' + r.desc).toLowerCase().includes(stem(k));
const esc = (t) => t.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
function Marked({ text, know }) {
  if (!know.length) return text;
  const re = new RegExp('(' + know.map((k) => esc(stem(k)) + '\\w*').join('|') + ')', 'gi');
  return text.split(re).map((p, i) => (i % 2 ? <mark key={i}>{p}</mark> : p));
}

/* One role, one sheet. It sticks a little lower than the one before, and settles back as later sheets cover it. */
function Sheet({ r, i, n, know, progress }) {
  const [where, kind, team] = r.chips;
  const miss = know.length > 0 && !know.some((k) => asks(r, k));
  const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.028]);
  return (
    <li id={r.id} className={'xcb-sheet' + (miss ? ' miss' : '')} style={{ '--i': i }}>
      <motion.div className="xcb-sheet-in" style={{ scale }}>
        <A to={r.href} className="xcb-sheet-a">
          <span className="xcb-sheet-no vc-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          <span className="xcb-sheet-t" data-morph>{r.title}</span>
          <span className="xcb-sheet-tags"><span>{team}</span><span>{where}</span><span>{kind}</span></span>
          <span className="xcb-sheet-d"><Marked text={r.desc} know={know} /></span>
        </A>
        <div className="xcb-sheet-act">
          <A to={r.acts[0].href} className="x-btn xcb-big" data-cta={'careers.role.' + r.id}>{r.acts[0].text}</A>
          <A to={r.acts[1].href} className="x-arrow xcb-tap"><span>{r.acts[1].text}</span>{ARROW}</A>
          <CopyDirect id={r.id} title={r.title} />
        </div>
      </motion.div>
    </li>
  );
}

function Deck({ roles, know, dont, dontA }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const n = roles.length + 1;
  return (
    <ul className="xcb-deck" ref={ref}>
      {roles.map((r, i) => <Sheet key={r.id} r={r} i={i} n={n} know={know} progress={scrollYProgress} />)}
      <li className="xcb-sheet last" style={{ '--i': roles.length }}>
        <div className="xcb-sheet-in">
          <span className="xcb-sheet-sig" aria-hidden="true"><Sigil seed="careers/open" data={[n]} /></span>
          <p className="xcb-sheet-t">{dont}</p>
          <div className="xcb-sheet-act"><A to={dontA.href} className="x-btn solid xcb-big" data-morph data-cta="careers.open">{dontA.text}</A></div>
        </div>
      </li>
    </ul>
  );
}

/* A perk's object: its giant numeral over a Sigil field drawn from its own words. */
function PerkArt({ i, t, p }) {
  return (
    <div className="xcb-perk-v">
      <Sigil seed={'careers/' + t} data={[t.length, p.length, i + 1]} className="xcb-perk-sig" />
      <span className="xcb-perk-big vc-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
    </div>
  );
}

const fig = (t) => /^([\d,]+\+)\s+(.*)$/.exec(t);

export default function Careers({ d }) {
  useArrival();
  const roles = d.pos.leaves;
  const teams = [...new Set(roles.map((l) => l.chips[2]))];
  const [team, setTeam] = useState(null);
  const [know, setKnow] = useState([]);
  const shown = roles.filter((l) => !team || l.chips[2] === team);
  const skills = SKILLS.filter((k) => roles.some((r) => asks(r, k)));
  const hits = shown.filter((r) => know.some((k) => asks(r, k))).length;
  const words = d.lines.join(' ').split(' ');
  // four short lines that break where the sentence breaks: Compilers, / cryptography, / and the cloud / they run on.
  const lines = [words[0], words[1], words.slice(2, 5).join(' '), words.slice(5).join(' ')];
  const [intA, intB] = d.intern.leaves;
  const ask = d.hacts[0];
  const arrived = useArrived();
  return (
    <main className="vc xcb" style={{ '--acc': '#1d1d1f' }}>
      <noscript dangerouslySetInnerHTML={NOJS} />
      <section className="xcb-hero vc-scene" aria-label={d.kicker} data-ask-name={d.kicker}>
        <div className="vc-grid xcb-hero-g">
          <div className="xcb-hero-c">
            <MaskLines as="h1" id="xcb-h1" now delay={0.05} lines={lines} className="vc-display xcb-h1" />
            <motion.div className="xcb-hero-f" initial={{ opacity: 0, y: 12 }} animate={arrived ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}>
              <p className="vc-lede">{d.lede}</p>
              <div className="xcb-acts">
                <a className="x-btn solid xcb-big" href={ask.href} data-thumb={ask.text} data-cta="careers.hero">{ask.text}</a>
                <A to={d.hacts[1].href} className="x-arrow xcb-tap"><span>{d.hacts[1].text}</span>{ARROW}</A>
              </div>
            </motion.div>
          </div>
          <motion.div className="xcb-hero-o" initial={{ opacity: 0, y: 48 }} animate={arrived ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}>
            <Hire how={d.how} />
          </motion.div>
        </div>
      </section>

      <section className="xcb-perks" aria-labelledby="xcb-perks-h">
        <div className="vc-grid xcb-perks-hd">
          <MaskLines id="xcb-perks-h" lines={[d.perks.lede]} className="vc-display s" />
          <p className="xcb-meta">{d.perks.title}</p>
        </div>
        <PinScenes label={d.perks.title} scenes={d.perks.items.map(([t, p], i) => ({
          key: t,
          title: <h3 className="vc-headline">{t}</h3>,
          body: <p className="vc-body">{p}</p>,
          visual: <PerkArt i={i} t={t} p={p} />,
        }))} />
      </section>

      <section className="xcb-pos" id="open-positions" aria-labelledby="xcb-pos-h">
        <div className="vc-grid xcb-pos-g">
          <div className="xcb-pos-h">
            <h2 id="xcb-pos-h" className="vc-display s">{d.pos.title}</h2>
            <p className="vc-lede">{d.pos.lede}</p>
          </div>
          <div className="xcb-tools">
            <div className="xcb-filter" role="group" aria-label="Filter by team">
              {[null, ...teams].map((t) => (
                <button key={t || 'all'} type="button" aria-pressed={team === t} onClick={() => setTeam(t)}>
                  {team === t && <motion.span layoutId="xcb-pill" className="xcb-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                  <span>{t || 'All'}</span>
                </button>
              ))}
            </div>
            <div className="xcb-know" role="group" aria-label="Match what you know">
              <span className="xcb-know-i" aria-hidden="true"><svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="7.2" fill="none" stroke="currentColor" strokeWidth="1.4" /><circle cx="10" cy="10" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.4" /><circle cx="10" cy="10" r=".9" fill="currentColor" /></svg></span>
              {skills.map((k) => {
                const on = know.includes(k);
                return <button key={k} type="button" aria-pressed={on} onClick={() => setKnow((v) => (on ? v.filter((x) => x !== k) : [...v, k]))}>{k}</button>;
              })}
              {know.length > 0 && (
                <button type="button" className="xcb-know-x" aria-label="Clear" onClick={() => setKnow([])}>
                  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                </button>
              )}
            </div>
            <p className="xcb-count vc-num" role="status" aria-label={`${shown.length} of ${roles.length} roles${know.length ? `, ${hits} ask for what you know` : ''}`}>
              <b>{know.length ? hits : shown.length}</b> / {know.length ? shown.length : roles.length}
            </p>
          </div>
        </div>
        <div className="vc-wrap">
          <Deck key={team || 'all'} roles={shown} know={know} dont={d.pos.dont} dontA={d.pos.dontA} />
        </div>
      </section>

      <section className="vc-sec xcb-int" id="internships" aria-labelledby="xcb-int-h">
        <div className="vc-grid">
          <header className="xcb-int-h">
            <MaskLines id="xcb-int-h" lines={[d.intern.title]} className="vc-headline" />
            <p className="vc-body">{d.intern.lede}</p>
          </header>
          {[intA, intB].map((l, k) => (
            <article key={l.title} className={'xcb-panel ' + (k ? 'b' : 'a')}>
              {k === 0 && <span className="xcb-panel-sig" aria-hidden="true"><Sigil seed={'careers/' + l.title} data={[l.desc.length]} /></span>}
              <ul className="xcb-panel-p">
                {l.perks.map((p) => {
                  const m = fig(p);
                  return m
                    ? <li key={p} className="xcb-fig"><b className="vc-num">{m[1]}</b><span>{m[2]}</span></li>
                    : <li key={p}>{p}</li>;
                })}
              </ul>
              <h3 className="vc-title">{l.title}</h3>
              <p className="vc-body">{l.desc}</p>
              <div className="xcb-panel-a">
                <A to={l.acts[0].href} className={'x-btn xcb-big' + (k ? '' : ' solid')} data-cta={'careers.' + (k ? 'grant' : 'intern')}>{l.acts[0].text}</A>
                <A to={l.acts[1].href} className="x-arrow xcb-tap"><span>{l.acts[1].text}</span>{ARROW}</A>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="xcb-close" data-room="dark" aria-labelledby="xcb-close-h">
        <div className="vc-grid">
          <div className="xcb-close-l">
            <MaskLines id="xcb-close-h" lines={[d.close.title]} className="vc-display m" />
            <p className="vc-lede">{d.close.lede}</p>
            <div className="xcb-acts">
              <a className="x-btn solid xcb-big" href={d.close.acts[0].href} data-cta="careers.close">{d.close.acts[0].text}</a>
              <a className="xcb-mail" href={d.close.acts[1].href}>{d.close.acts[1].text}</a>
            </div>
          </div>
          <div className="xcb-close-sig" aria-hidden="true"><Sigil seed="/careers" data={[2137, 122, roles.length]} /></div>
        </div>
      </section>

    </main>
  );
}
