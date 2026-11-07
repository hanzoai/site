'use client';
/* /agents/<page> (one template): agents taking turns. The first screen is the member's own stage, drawn over its Sigil:
   Crew seats its ten agents on a ring, the SDK runs its console conversation. All wording and links are Hanzo's.
   Signature: who has the turn. A baton passes by itself: around the ring from agent to agent (the one holding it says
   who they are), through the console from you to the agent and back, and down the SDK's pillars and parts, the way
   the router hands a network its turns. Hover, focus or press anything to take the baton.
   Beyond: start in one step. On Crew, type what you need and the baton goes to the agent whose own role matches;
   Enter opens the chat with them. On the SDK, its own install line for pip or cargo, ready to copy. */
// Signature: who has the turn: a baton passes by itself around the agents' ring, through the console turns, down the pillars and parts
// Beyond: start in one step: type a need and the agent whose own role matches takes the baton (Enter opens the chat); the SDK's own pip or cargo line, ready to copy
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useInView } from 'motion/react';
import { EASE, Copy } from '../../ui';
import { A } from '../../kit';
import Sigil from '../../Sigil';
import { href as route } from '../../../lib/route';
import './AgentRoom.css';

const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
/* the baton: an index that moves on by itself while its box is on screen and nobody holds it */
function useBaton(n, ms, box) {
  const live = useInView(box, { amount: 0.3 });
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState(false);
  useEffect(() => {
    if (!live || held || n < 2 || calm()) return;
    const id = setInterval(() => setAt((a) => (a + 1) % n), ms);
    return () => clearInterval(id);
  }, [live, held, n, ms]);
  return { at, take: (i) => { setAt(i); setHeld(true); }, free: () => setHeld(false), setHeld };
}

function Ring({ r }) {
  const box = useRef(null);
  const router = useRouter();
  const b = useBaton(r.agents.length, 1900, box);
  const [q, setQ] = useState('');
  const hit = useMemo(() => {
    const w = q.trim().toLowerCase();
    if (!w) return null;
    return r.agents.map((a, i) => ({ i, s: (a.name + ' ' + a.role).toLowerCase().split(/[^a-z]+/).some((t) => t.startsWith(w)) || (a.name + ' ' + a.role).toLowerCase().includes(w) })).filter((x) => x.s).map((x) => x.i);
  }, [q, r.agents]);
  useEffect(() => { if (hit && hit.length) b.take(hit[0]); else if (!q) b.free(); }, [hit]); // eslint-disable-line react-hooks/exhaustive-deps
  const cur = r.agents[b.at];
  const step = 360 / r.agents.length;
  return (
    <div className="xag-ringwrap">
      <div className="xag-ring" ref={box} onMouseLeave={() => !q && b.free()} style={{ '--n': r.agents.length }}>
        <motion.span className="xag-baton" aria-hidden="true" animate={{ rotate: b.at * step }} transition={{ type: 'spring', stiffness: 120, damping: 18 }}><i /></motion.span>
        {r.agents.map((a, i) => (
          <A key={a.name} to={a.href} className="xag-seat" style={{ '--a': i * step + 'deg' }} data-on={i === b.at || undefined} data-dim={hit && !hit.includes(i) ? '' : undefined}
            onMouseEnter={() => b.take(i)} onFocus={() => b.take(i)} onBlur={() => b.free()} data-cursor="Talk">
            <img src={a.img.src} alt="" width="64" height="64" loading="lazy" decoding="async" />
            <span className="x-sr">{a.name}{a.role ? ', ' + a.role : ''}</span>
          </A>
        ))}
        <div className="xag-hub" aria-live="polite">
          <b key={cur.name}>{cur.name}</b>
          <span key={cur.name + 'r'}>{cur.role}</span>
        </div>
      </div>
      <div className="xag-find">
        <label className="x-mono" htmlFor="xag-q">Find an agent</label>
        <input id="xag-q" type="search" value={q} autoComplete="off" spellCheck="false" onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && hit && hit.length) router.push(route(r.agents[hit[0]].href)); }} />
        <span className="xag-find-n x-mono" aria-live="polite">{hit ? (hit.length ? r.agents[hit[0]].name + (r.agents[hit[0]].role ? ' · ' + r.agents[hit[0]].role : '') + ' ↵' : '—') : ''}</span>
      </div>
    </div>
  );
}

function Console({ c }) {
  const box = useRef(null);
  const live = useInView(box, { amount: 0.4 });
  const [shown, setShown] = useState(c.turns.length);
  const [think, setThink] = useState(false);
  useEffect(() => {
    if (!live || calm()) { setShown(c.turns.length); return; }
    let i = 0, t = 0;
    const next = () => {
      if (i >= c.turns.length) { t = setTimeout(() => { i = 0; setShown(0); t = setTimeout(next, 700); }, 4200); return; }
      const agent = c.turns[i].who !== 'you';
      setThink(agent);
      t = setTimeout(() => { setThink(false); i += 1; setShown(i); t = setTimeout(next, agent ? 1600 : 900); }, agent ? 1200 : 500);
    };
    setShown(0);
    t = setTimeout(next, 500);
    return () => clearTimeout(t);
  }, [live, c.turns]);
  return (
    <figure className="xag-con" ref={box}>
      <div className="xag-win">
        <div className="xag-win-bar"><span aria-hidden="true"><i /><i /><i /></span><span>{c.title}</span></div>
        <div className="xag-win-g">
          <nav aria-label="Agents in the console" className="xag-win-nav">
            {c.nav.map((n) => <A key={n.href} to={n.href} aria-current={n.current ? 'page' : undefined}><em>{n.label}</em></A>)}
          </nav>
          <ol className="xag-turns">
            {c.turns.map((t, i) => (
              <li key={i} data-who={t.who} data-seen={i < shown || undefined} data-on={i === shown - 1 || undefined}>
                <button type="button" onClick={() => setShown(i + 1)}><span className="xag-who x-mono" aria-hidden="true">{t.who === 'you' ? '›' : '◆'}</span>{t.text}</button>
              </li>
            ))}
            <li className="xag-think" data-on={think || undefined} aria-hidden="true"><i /><i /><i /></li>
          </ol>
        </div>
        <div className="xag-win-foot"><code className="x-mono">{c.endpoint}</code>{c.open && <A to={c.open.href} className="xag-open">{c.open.label} ↗</A>}</div>
      </div>
      <figcaption>{c.caption}</figcaption>
    </figure>
  );
}

function Install({ lines }) {
  const [at, setAt] = useState(0);
  const tool = (l) => l.split(' ')[0];
  return (
    <div className="xag-inst">
      <div role="radiogroup" aria-label="Install with" className="xag-inst-r">
        {lines.map((l, i) => (
          <button key={l} type="button" role="radio" aria-checked={i === at} tabIndex={i === at ? 0 : -1} onClick={() => setAt(i)}
            onKeyDown={(e) => { if (/Arrow(Right|Left|Up|Down)/.test(e.key)) { e.preventDefault(); setAt((at + 1) % lines.length); } }}>
            {tool(l)}{i === at && <motion.i layoutId="xag-inst-ink" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
          </button>
        ))}
      </div>
      <code className="xag-inst-c x-mono"><span aria-hidden="true">$ </span>{lines[at]}</code>
      <Copy text={lines[at]} />
    </div>
  );
}

function Head({ s }) {
  return (
    <div className="xag-head">
      {s.eyebrow && <p className="xag-eye x-mono">{s.eyebrow}</p>}
      {s.h2 && <h2 className="xag-h2">{s.h2}</h2>}
      {s.lede && <p className="xag-lede">{s.lede}</p>}
    </div>
  );
}

function Pillars({ s }) {
  const box = useRef(null);
  const b = useBaton(s.cards.length, 2600, box);
  return (
    <section className="xag-sec xag-pil">
      <div className="x-wrap">
        <Head s={s} />
        <ol className="xag-pil-g" ref={box} onMouseLeave={b.free}>
          {s.cards.map((c, i) => (
            <li key={c.title} data-on={i === b.at || undefined} onMouseEnter={() => b.take(i)}>
              {i === b.at && <motion.i layoutId="xag-pil-baton" className="xag-pil-b" transition={{ type: 'spring', stiffness: 220, damping: 26 }} aria-hidden="true" />}
              <span className="xag-pil-n x-mono">{c.n}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Parts({ s }) {
  const box = useRef(null);
  const b = useBaton(s.cards.length, 2100, box);
  return (
    <section className="xag-sec xag-parts">
      <div className="x-wrap xag-parts-g">
        <Head s={s} />
        <ul ref={box} onMouseLeave={b.free}>
          {s.cards.map((c, i) => (
            <li key={c.title} data-on={i === b.at || undefined} onMouseEnter={() => b.take(i)}>
              <h3><span className="xag-tick" aria-hidden="true" />{c.title}</h3>
              <p>{c.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Code({ s }) {
  const src = s.lines.map((l) => l.map((x) => x[1]).join('')).join('\n');
  return (
    <section className="xag-sec xag-code">
      <div className="x-wrap xag-code-g">
        <div><Head s={s} /><div className="xag-acts">{s.actions.map((a, i) => <A key={a.href + i} to={a.href} className={'x-btn' + (i ? '' : ' solid')}>{a.label}</A>)}</div></div>
        <motion.figure className="xag-pre" initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9, ease: EASE }}>
          <div className="xag-pre-bar"><span aria-hidden="true"><i /><i /><i /></span><span className="x-mono">{s.lang}</span><Copy text={src} /></div>
          <pre tabIndex={0} data-lenis-prevent><code>{s.lines.map((l, j) => <span key={j} className="xag-ln">{l.map(([k, t], i) => <span key={i} data-k={k}>{t}</span>)}{j === s.lines.length - 1 && <i className="xag-caret" aria-hidden="true" />}{'\n'}</span>)}</code></pre>
        </motion.figure>
      </div>
    </section>
  );
}

function Room({ s }) {
  const [night, setNight] = useState(false);
  const [dark, light] = s.shots.length > 1 ? s.shots : [s.shots[0], s.shots[0]];
  return (
    <section className="xag-sec xag-room">
      <div className="x-wrap">
        <div className="xag-room-h"><Head s={s} /><div className="xag-acts">{s.actions.map((a) => <A key={a.href} to={a.href} className="x-btn solid" data-thumb="">{a.label}</A>)}</div></div>
        <motion.figure className="xag-shot" data-night={night || undefined} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 1, ease: EASE }}>
          <div className="xag-shot-bar">
            <span aria-hidden="true"><i /><i /><i /></span>
            <span className="xag-url"><i className="xag-live" aria-hidden="true" />{s.url}</span>
            <button type="button" className="xag-night" aria-pressed={night} onClick={() => setNight((v) => !v)}>{night ? '☾' : '☀'}<span className="x-sr">Dark</span></button>
          </div>
          <div className="xag-shot-i">
            <img src={light.src} alt={light.alt} width="2304" height="1440" loading="lazy" decoding="async" />
            <img src={dark.src} alt={dark.alt === light.alt ? '' : dark.alt} width="2304" height="1440" loading="lazy" decoding="async" className="xag-dark" />
            <i className="xag-sheen" aria-hidden="true" />
          </div>
        </motion.figure>
        <p className="xag-cap x-mono">{s.caption}</p>
      </div>
    </section>
  );
}

function Close({ s }) {
  return (
    <section className="xag-sec xag-close">
      <div className="x-wrap"><div className="xag-band">
        <h2 className="xag-h2">{s.h2}</h2>
        {s.lede && <p className="xag-lede">{s.lede}</p>}
        <div className="xag-acts">{s.actions.map((a, i) => <A key={a.href + i} to={a.href} className={'x-btn' + (i ? '' : ' solid')}>{a.label}</A>)}</div>
      </div></div>
    </section>
  );
}

function Get({ s }) {
  return (
    <section className="xag-get">
      <div className="x-wrap xag-get-g">
        <div><h2 className="xag-get-h">{s.h2}</h2><p>{s.lede}</p></div>
        <div className="xag-get-c">
          {s.license && <span className="xag-chip x-mono"><span>{s.license[0]}</span> {s.license[1]}</span>}
          {s.github && <A to={s.github.href} className="xag-chip x-mono">{s.github.label} ↗</A>}
          {s.actions.map((a) => <A key={a.href} to={a.href} className="x-btn solid">{a.label}</A>)}
        </div>
      </div>
    </section>
  );
}

export default function AgentRoom({ doc }) {
  const f = doc.fold;
  const roster = doc.sections.find((s) => s.k === 'roster');
  const nums = [doc.sections.length, ...(roster ? roster.agents.map((a) => a.name.length) : []), ...(f.console ? f.console.turns.map((t) => t.text.length) : [])];
  const BODY = { pillars: Pillars, parts: Parts, code: Code, room: Room, close: Close, get: Get };
  return (
    <main className="xag" data-kind={roster ? 'crew' : 'sdk'}>
      <section className="xag-hero" aria-labelledby="xag-h1">
        <div className="x-wrap xag-hero-g">
          <div className="xag-hero-t">
            <p className="xag-eye x-mono">{f.label}</p>
            <h1 id="xag-h1" className="xag-h1" data-morph-target>
              <span className="x-line"><motion.span className="x-line-in" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.05, ease: EASE, delay: 0.1 }}>{f.h1}</motion.span></span>
            </h1>
            {f.lede.map((p, i) => <motion.p key={i} className="xag-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.3 + i * 0.08 }}>{p}</motion.p>)}
            {f.actions.length > 0 && <div className="xag-acts">{f.actions.map((a, i) => <A key={a.href} to={a.href} className={'x-btn' + (i ? '' : ' solid')} {...(i ? {} : { 'data-thumb': '' })}>{a.label}</A>)}</div>}
            {f.note && <p className="xag-note">{f.note}</p>}
            {f.install.length > 1 && <Install lines={f.install} />}
            {f.through.length > 0 && <p className="xag-thru"><span className="x-mono">{f.through[0]}</span>{f.through.slice(1).map((t) => <span key={t} className="xag-thru-c">{t}</span>)}</p>}
            {roster && <div className="xag-roster-h"><Head s={roster} />{roster.more && <A to={roster.more.href} className="xag-more">{roster.more.label}</A>}</div>}
          </div>
          <div className="xag-stage">
            <Sigil seed={doc.route} data={nums} className="xag-sigil" />
            {roster ? <Ring r={roster} /> : f.console ? <Console c={f.console} /> : null}
          </div>
        </div>
      </section>
      {doc.sections.filter((s) => s.k !== 'roster').map((s, i) => { const C = BODY[s.k]; return C ? <C key={s.k + i} s={s} /> : null; })}
    </main>
  );
}
