'use client';
/* /careers. V2: 8/10 Chaptered story: 4-line kinetic hero beside a live hiring card, perks as a still editorial
   list, roles as full sheets that stack as you scroll and open into their page, one dark closing room. Accent: ember.
   Signature: the open roles are a deck of sheets. Scroll and each role rises over the last one while the stack behind
   it settles back; click a sheet and it opens into its page (Morph, synchronized.studio).
   Supporting (3): masked kinetic headline, once; the How-we-hire card turning itself; the filter chips.
   Beyond: "Match what you know". Tap the skills you have, taken word for word from the role descriptions (LLVM,
   RLHF, zero-knowledge, data visualization…): the roles that ask for them stay lit with the words marked, the rest
   step back. Built only from Hanzo's own role text.
   The role pages (/careers/<slug>) keep Careers.css; this index has its own CareersBoard.css. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { A } from '../kit';
import MaskLines from './careers/MaskLines'; // careers' own variant; main's v2/MaskLines differs
import { useArrival } from './doorway';
import '../v2/vc-type.css';
import './CareersBoard.css';

const EASE = [0.16, 1, 0.3, 1];

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
        <span className="vc-kick">{how.title}</span>
        <span className="vc-kick vc-num" aria-hidden="true">{String(at + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
      </div>
      <div className="xcb-hire-stage">
        {how.steps.map(([t, d], i) => (
          <motion.div key={t} className="xcb-hire-s" initial={false} aria-hidden={i !== at}
            animate={i === at ? { opacity: 1, y: 0 } : { opacity: 0, y: i < at ? -26 : 26 }}
            transition={{ duration: i === at ? 0.7 : 0.35, ease: EASE, delay: i === at ? 0.1 : 0 }}>
            <span className="xcb-hire-i vc-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <b>{t}</b>
            <p>{d}</p>
          </motion.div>
        ))}
      </div>
      <ol className="xcb-hire-n">
        {how.steps.map(([t], i) => (
          <li key={t}>
            <button type="button" aria-expanded={i === at} onClick={() => { setMine(true); setAt(i); }}>
              <i>{i < at && <u className="done" />}{i === at && <u key={at + (mine ? 'm' : '')} className={mine || calm ? 'done' : 'run'} />}</i>
              <span>{t}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function CopyDirect({ id, title }) {
  const [ok, setOk] = useState(false);
  return (
    <button type="button" className="xcb-cp" title="Copy direct link to this position" aria-label={ok ? 'Link copied' : 'Copy direct link to ' + title}
      onClick={async () => {
        try { await navigator.clipboard.writeText(location.origin + '/careers#' + id); } catch { /* blocked */ }
        setOk(true); setTimeout(() => setOk(false), 1500);
      }}>
      {ok
        ? <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        : <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6.8 9.2a2.6 2.6 0 0 0 3.7 0l2-2a2.6 2.6 0 0 0-3.7-3.7l-.6.6M9.2 6.8a2.6 2.6 0 0 0-3.7 0l-2 2a2.6 2.6 0 0 0 3.7 3.7l.6-.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
      <span>{ok ? 'Copied' : 'Link'}</span>
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
        <A to={r.href} className="xcb-sheet-a" data-morph>
          <span className="xcb-sheet-top">
            <span className="vc-kick acc">{team}</span>
            <span className="xcb-sheet-no vc-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          </span>
          <span className="xcb-sheet-t">{r.title}</span>
          <span className="xcb-sheet-tags"><span>{where}</span><span>{kind}</span></span>
          <span className="xcb-sheet-d"><Marked text={r.desc} know={know} /></span>
        </A>
        <div className="xcb-sheet-act">
          <A to={r.acts[0].href} className="x-btn solid">{r.acts[0].text}</A>
          <A to={r.acts[1].href} className="x-arrow">
            <span>{r.acts[1].text}</span>
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </A>
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
          <span className="xcb-sheet-top"><span className="vc-kick">{dontA.text}</span></span>
          <p className="xcb-sheet-t">{dont}</p>
          <div className="xcb-sheet-act"><A to={dontA.href} className="x-btn solid" data-morph>{dontA.text}</A></div>
        </div>
      </li>
    </ul>
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
  return (
    <main className="vc xcb" style={{ '--acc': '#ff5b1f' }}>
      <section className="xcb-hero vc-scene" aria-labelledby="xcb-h1">
        <div className="vc-grid xcb-hero-g">
          <div className="xcb-hero-c">
            <motion.p className="vc-kick" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: EASE }}>{d.kicker}</motion.p>
            <MaskLines as="h1" id="xcb-h1" now delay={0.05} lines={lines} className="vc-display xcb-h1" />
            <motion.div className="xcb-hero-f" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease: EASE, delay: 0.7 }}>
              <p className="vc-lede">{d.lede}</p>
              <div className="xcb-acts">
                <a className="x-btn solid xcb-big" href={d.hacts[0].href} data-thumb={d.hacts[0].text}>{d.hacts[0].text}</a>
                <A to={d.hacts[1].href} className="x-arrow"><span>{d.hacts[1].text}</span><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></A>
              </div>
            </motion.div>
          </div>
          <motion.div className="xcb-hero-o" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.3, ease: EASE, delay: 0.25 }}>
            <Hire how={d.how} />
          </motion.div>
        </div>
      </section>

      <section className="vc-sec xcb-perks" aria-labelledby="xcb-perks-h">
        <div className="vc-grid">
          <header className="xcb-perks-h">
            <p className="vc-kick acc">{d.perks.title}</p>
            <MaskLines id="xcb-perks-h" lines={[d.perks.lede]} className="vc-headline" />
          </header>
          <ol className="xcb-perk-l">
            {d.perks.items.map(([t, p], i) => (
              <li key={t}>
                <span className="xcb-perk-n vc-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="vc-title">{t}</h3>
                <p className="vc-body">{p}</p>
              </li>
            ))}
          </ol>
        </div>
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
                <button key={t || 'all'} type="button" aria-pressed={team === t} onClick={() => setTeam(t)}>{t || 'All'}</button>
              ))}
            </div>
            <div className="xcb-know" role="group" aria-label="Match what you know">
              <span className="vc-kick">Match what you know</span>
              <div>
                {skills.map((k) => {
                  const on = know.includes(k);
                  return <button key={k} type="button" aria-pressed={on} onClick={() => setKnow((v) => (on ? v.filter((x) => x !== k) : [...v, k]))}>{k}</button>;
                })}
                {know.length > 0 && <button type="button" className="xcb-know-x" onClick={() => setKnow([])}>Clear</button>}
              </div>
            </div>
            <p className="xcb-count vc-kick vc-num" role="status">{shown.length} / {roles.length}{know.length > 0 && ` · ${hits} ask for it`}</p>
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
                <A to={l.acts[0].href} className="x-btn solid">{l.acts[0].text}</A>
                <A to={l.acts[1].href} className="x-btn">{l.acts[1].text}</A>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="xcb-close" data-room="dark" aria-labelledby="xcb-close-h">
        <div className="vc-grid">
          <MaskLines id="xcb-close-h" lines={[d.close.title]} className="vc-display m" />
          <div className="xcb-close-r">
            <p className="vc-lede">{d.close.lede}</p>
            <div className="xcb-acts">
              <a className="x-btn solid xcb-big" href={d.close.acts[0].href}>{d.close.acts[0].text}</a>
              <a className="xcb-mail" href={d.close.acts[1].href}>{d.close.acts[1].text}</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
