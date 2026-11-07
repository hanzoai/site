'use client';
/* /careers. Signature: the open roles are a board you filter by team: cards leave and the rest glide into the gap
   (Motion layout), and any card opens, ink first, into its brief. How we hire turns itself through its four steps in
   the hero, the page's one idle motion.
   Beyond: "Match what you know". Tap the skills you have, taken word for word from the role descriptions (LLVM,
   RLHF, zero-knowledge, data visualization…): the roles that ask for them stay lit with the words marked, the rest
   step back. Built only from Hanzo's own role text. */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { EASE, Rise, Words, Count } from '../ui';
import { A, Go } from '../kit';
import { href as hrefOf } from '../../lib/route';
import { openDoor, useArrival } from './doorway';
import './Careers.css';

function Hire({ how }) {
  const [at, setAt] = useState(0);
  const [mine, setMine] = useState(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.5 });
  const calm = useReducedMotion();
  useEffect(() => {
    if (mine || calm || !seen) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % how.steps.length), 3200);
    return () => clearTimeout(t);
  }, [at, mine, calm, seen, how.steps.length]);
  const n = how.steps.length;
  return (
    <div className="xcr-hire" ref={box}>
      <div className="xcr-hire-h">
        <span>{how.title}</span>
        <span className="x-mono" aria-hidden="true">{String(at + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
      </div>
      <div className="xcr-hire-stage">
        {how.steps.map(([t, d], i) => (
          <motion.div key={t} className="xcr-hire-s" initial={false} animate={i === at ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: i < at ? -14 : 14, filter: 'blur(6px)' }} transition={{ duration: 0.55, ease: EASE }} aria-hidden={i !== at}>
            <b>{t}</b>
            <p>{d}</p>
          </motion.div>
        ))}
      </div>
      <ol className="xcr-hire-n">
        {how.steps.map(([t], i) => (
          <li key={t}>
            <button type="button" aria-expanded={i === at} onClick={() => { setMine(true); setAt(i); }}>
              <i><motion.u initial={false} animate={{ scaleX: i < at ? 1 : 0 }} transition={{ duration: 0.5, ease: EASE }} />{i === at && !mine && !calm && <u className="xcr-fill" key={at} />}</i>
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
    <button
      type="button"
      className="xcr-cp"
      title="Copy direct link to this position"
      aria-label={ok ? 'Link copied' : 'Copy direct link to ' + title}
      onClick={async () => {
        try { await navigator.clipboard.writeText(location.origin + '/careers#' + id); } catch { /* blocked */ }
        setOk(true); setTimeout(() => setOk(false), 1500);
      }}
    >
      {ok
        ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M6.8 9.2a2.6 2.6 0 0 0 3.7 0l2-2a2.6 2.6 0 0 0-3.7-3.7l-.6.6M9.2 6.8a2.6 2.6 0 0 0-3.7 0l-2 2a2.6 2.6 0 0 0 3.7 3.7l.6-.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
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

function RoleCard({ r, show, know }) {
  const router = useRouter();
  const [gone, setGone] = useState(false);
  useEffect(() => { if (show) setGone(false); }, [show]);
  const [where, kind, team] = r.chips;
  const h = hrefOf(r.href);
  const miss = know.length > 0 && !know.some((k) => asks(r, k));
  return (
    <motion.li
      layout="position"
      id={r.id}
      className={'xcr-card' + (miss ? ' miss' : '')}
      hidden={gone}
      initial={false}
      animate={show ? { opacity: miss ? 0.32 : 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
      transition={{ layout: { type: 'spring', stiffness: 260, damping: 30 }, duration: 0.3, ease: EASE }}
      onAnimationComplete={() => { if (!show) setGone(true); }}
      onClick={(e) => { if (!e.target.closest('a,button')) openDoor(e, h, router); }}
      data-no-morph
    >
      <div className="xcr-card-top">
        <span className="xcr-team">{team}</span>
        <CopyDirect id={r.id} title={r.title} />
      </div>
      <h3><A to={r.href} onClick={(e) => openDoor(e, h, router)}>{r.title}</A></h3>
      <ul className="xcr-tags"><li>{where}</li><li>{kind}</li></ul>
      <p><Marked text={r.desc} know={know} /></p>
      <div className="xcr-card-act">
        <A to={r.acts[0].href} className="xcr-btn solid sm" onClick={(e) => openDoor(e, h, router)}>{r.acts[0].text}</A>
        <A to={r.acts[1].href} className="x-arrow" onClick={(e) => openDoor(e, h, router)}>
          <span>{r.acts[1].text}</span>
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </A>
      </div>
    </motion.li>
  );
}

function Perk({ t }) {
  const m = /^([\d,]+)\+\s+(.*)$/.exec(t);
  if (!m) return t;
  return <><Count to={+m[1].replace(/,/g, '')} suffix="+" /> {m[2]}</>;
}

export default function Careers({ d }) {
  useArrival();
  const teams = [...new Set(d.pos.leaves.map((l) => l.chips[2]))];
  const [team, setTeam] = useState(null);
  const shown = d.pos.leaves.filter((l) => !team || l.chips[2] === team).length;
  const [know, setKnow] = useState([]);
  const skills = SKILLS.filter((k) => d.pos.leaves.some((r) => asks(r, k)));
  const hits = d.pos.leaves.filter((r) => (!team || r.chips[2] === team) && know.some((k) => asks(r, k))).length;
  const line = (t, dl) => (
    <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: dl }}>{t}</motion.span></span>
  );
  return (
    <main className="xcr xcr-ix">
      <section className="xcr-hero" aria-labelledby="xcr-h1">
        <div className="x-wrap xcr-hero-g">
          <div>
            <motion.p className="x-kick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>{d.kicker}</motion.p>
            <h1 id="xcr-h1" className="xcr-h1 big">{d.lines.map((l, i) => <span key={i}>{line(l, 0.05 + i * 0.13)}</span>)}</h1>
            <motion.p className="xcr-lede dk" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}>{d.lede}</motion.p>
            <motion.div className="xcr-acts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}>
              <a className="x-btn solid" href={d.hacts[0].href} data-thumb>{d.hacts[0].text}</a>
              <Go to={d.hacts[1].href}>{d.hacts[1].text}</Go>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}><Hire how={d.how} /></motion.div>
        </div>
      </section>

      <section className="x-sec xcr-perks">
        <div className="x-wrap">
          <header className="x-head"><Words text={d.perks.title} /><p>{d.perks.lede}</p></header>
          <ul className="xcr-perk-g">
            {d.perks.items.map(([t, p], i) => (
              <Rise as="li" key={t} delay={i * 0.07} y={24}><span className="x-mono">{String(i + 1).padStart(2, '0')}</span><h3>{t}</h3><p>{p}</p></Rise>
            ))}
          </ul>
        </div>
      </section>

      <section className="x-sec xcr-pos" id="open-positions">
        <div className="x-wrap">
          <header className="x-head"><Words text={d.pos.title} /><p>{d.pos.lede}</p></header>
          <div className="xcr-filter" role="group" aria-label="Filter by team">
            {[null, ...teams].map((t) => (
              <button key={t || 'all'} type="button" aria-pressed={team === t} onClick={() => setTeam(t)}>
                {team === t && <motion.span layoutId="xcr-pill" className="xcr-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span>{t || 'All'}</span>
              </button>
            ))}
            <span className="xcr-count x-mono" role="status">{shown} / {d.pos.leaves.length}{know.length > 0 && ` · ${hits} ask for it`}</span>
          </div>
          <div className="xcr-know" role="group" aria-label="Match what you know">
            <span className="xcr-know-k">Match what you know</span>
            {skills.map((k) => {
              const on = know.includes(k);
              return <button key={k} type="button" aria-pressed={on} onClick={() => setKnow((v) => (on ? v.filter((x) => x !== k) : [...v, k]))}>{k}</button>;
            })}
            {know.length > 0 && <button type="button" className="xcr-know-x" onClick={() => setKnow([])}>Clear</button>}
          </div>
          <ul className="xcr-board">
            {d.pos.leaves.map((r) => <RoleCard key={r.id} r={r} know={know} show={!team || r.chips[2] === team} />)}
          </ul>
          <div className="xcr-dont"><p>{d.pos.dont}</p><Go to={d.pos.dontA.href}>{d.pos.dontA.text}</Go></div>
        </div>
      </section>

      <section className="x-sec xcr-int" id="internships">
        <div className="x-wrap">
          <header className="x-head"><Words text={d.intern.title} /><p>{d.intern.lede}</p></header>
          <div className="xcr-int-g">
            {d.intern.leaves.map((l, i) => (
              <Rise key={l.title} delay={i * 0.1} className="xcr-panel">
                <h3>{l.title}</h3>
                <ul className="xcr-perks-l">{l.perks.map((p) => <li key={p}><Perk t={p} /></li>)}</ul>
                <p>{l.desc}</p>
                <div className="xcr-card-act">
                  <Go to={l.acts[0].href} solid>{l.acts[0].text}</Go>
                  <Go to={l.acts[1].href}>{l.acts[1].text}</Go>
                </div>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      <section className="xcr-close" data-room="dark">
        <div className="x-wrap">
          <Words text={d.close.title} />
          <p>{d.close.lede}</p>
          <div className="xcr-close-a">
            <a className="x-btn solid" href={d.close.acts[0].href}>{d.close.acts[0].text}</a>
            <a className="xcr-mail" href={d.close.acts[1].href}>{d.close.acts[1].text}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
