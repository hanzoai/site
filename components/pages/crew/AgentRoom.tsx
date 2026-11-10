'use client';
/* /agents/<page> (one template). Each member carries its own data and Sigil seed: Crew is ten agents on a ring, its
   roll call and the Bots room; the SDK is a console that runs itself, its install line, three pillars, the code in the
   graphite room, the parts one at a time. All wording, figures and links are Hanzo's.
   Signature (docs/MOTION-MAP.md: `split`, Split screen): the live object holds still on one side while the words on the
   other side scroll past and change it. Crew: the ring stays; the headline step lets the baton run round by itself,
   the team step hands the turn to whoever the find field matches, and in the roll call each name that crosses the
   middle of the screen takes the turn on the ring. SDK: the console stays; the headline step lets it play, the install
   step turns it into the pip/cargo terminal, and each pillar puts one more turn of the conversation on screen
   (scrolling back takes it off). Phones: the headline reads first, then the object sticks under the header while the
   steps scroll beneath it. Supporting: an ink that slides between choices (layoutId); Sigil under the object.
   Beyond: start in one step. On Crew, type what you need and the agent whose own role matches takes the baton; Enter
   opens the chat with them. On the SDK, its own install line for pip or cargo, ready to copy.
   Persona: Developer (SDK) and team buyer (Crew). Goal: start building with agents. Metric: install_copy (SDK), signup_start (Crew).
   CTA: "Read the docs" (SDK), "Launch a bot" (Crew): one solid ask, hero to close; every other action a text link.
   V2: 8/10 split screen as the signature (ring / console hold still, scrolling steps change them, at both sizes); pinned two-chapter stage, stacked sheets and clip-open rooms removed; five entrances, one per main section; Bots room readable in Light and sized to its content; roll call in type instead of coins. */
// Persona: developer (SDK) and team buyer (Crew), from the Developer and Consumer rows of MASTER §1
// Goal: start building with agents. Metric: install_copy (agents-sdk), signup_start (agents-crew)
// CTA: "Read the docs" (agents-sdk.hero) and "Launch a bot" (agents-crew.hero): one solid ask, data-thumb, repeated at the close
// Signature: split (Split screen): the ring (Crew) or the console (SDK) holds still while the scrolling steps beside it change it: the roll call hands out the ring's turn; the install step turns the console into the terminal; each pillar adds a turn
// Entrances (MOTION-MAP row, in order): curtain-rise = the hero h1 (both); spring-snap = Crew team step / SDK install step; invert-flash = Crew roll call / SDK code room; inertia-drag = Crew Bots room window / SDK parts contour tile (draggable, springs home); count-roll = Crew "Or build your own." (the crew's 10) / SDK close (licence version)
// Order: Crew = split (headline, team + find, roll call) → Bots room → "Or build your own."; SDK = split (headline, install, three pillars) → code room → parts → close
// Beyond: start in one step: type a need and the agent whose own role matches takes the baton (Enter opens the chat); the SDK's own pip or cargo line, ready to copy
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useInView } from 'motion/react';
import { Copy } from '../../ui';
import { EASE_OUT_EXPO as EASE, DUR } from '../../../lib/motion';
import { A, Cta, CodeBlock } from '../../kit';
import Sigil from '../../Sigil';
import { href as route } from '../../../lib/route';
import './AgentRoom.css';

// Hanzo's own pictures, copied into public/agents/ (the faces keep their paths; the room's screenshots sit in agents/room/)
const ASSET = (p) => (p && p.startsWith('/shots/') ? '/agents/room/' + p.slice(7) : p);
const MOVE = [0.4, 0, 0.2, 1]; // the deck's ease-in-out, for things that move and stay (no springs)
const INK = { duration: DUR.fade, ease: EASE };
/* entrances (docs/MOTION-MAP.md rule 7): each main section arrives its own way, once, when it first comes into view.
   The server HTML is the final state; the start pose is CSS under html.js on [data-ent] without [data-in], and this
   hook sets data-in straight on the element (no React state, so nothing differs at hydration). Reduced motion: none. */
function useEnter() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) { el.dataset.in = ''; return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.dataset.in = ''; io.disconnect(); } }, { rootMargin: '0px 0px -18% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
function Enter({ as: Tag = 'div', kind, className = '', children, ...rest }) {
  const ref = useEnter();
  return <Tag ref={ref} data-ent={kind} className={className} {...rest}>{children}</Tag>;
}
/* count-roll: each digit is a strip 0–9 that rolls up to its value as the section arrives (the real figure is in the
   accessible text beside it) */
function Roll9({ text, className = '' }) {
  return (
    <span className={'xag-roll ' + className}>
      <span className="x-sr">{text}</span>
      <span aria-hidden="true">{[...text].map((ch, i) => (/\d/.test(ch)
        ? <b key={i} style={{ '--d': +ch, '--k': i }}><span>{'0123456789'.split('').map((d) => <i key={d}>{d}</i>)}</span></b>
        : <em key={i}>{ch}</em>))}</span>
    </span>
  );
}

/* client-only facts, read after mount so the server HTML and the first client render agree */
function useMedia(q) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const m = matchMedia(q);
    const f = () => setOn(m.matches);
    f(); m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, [q]);
  return on;
}
const useCalm = () => useMedia('(prefers-reduced-motion: reduce)');

/* the baton: an index that moves on by itself while its box is on screen and nobody holds it */
function useBaton(n, ms, box, calm) {
  const live = useInView(box, { amount: 0.3 });
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState(false);
  useEffect(() => { // one full round each time it comes into view, then it rests where it started
    if (!live || held || n < 2 || calm) return;
    let k = 0, t = 0;
    const step = () => { setAt((a) => (a + 1) % n); k += 1; if (k < n) t = setTimeout(step, ms); }; // one round, then rest
    t = setTimeout(step, 650); // something moves within the first second
    return () => clearTimeout(t);
  }, [live, held, n, ms, calm]);
  return { at, take: (i) => { setAt(i); setHeld(true); }, free: () => setHeld(false) };
}

function Kick({ children, className = '' }) { return children ? <p className={'xag-kick x-mono ' + className}>{children}</p> : null; }

/* ---------- the signature, split screen: the live object holds still while the words beside it scroll and change it ----------
   Desktop: two columns, the object sticky in the right eight, the steps scrolling past in the left five. Phone: the first
   step (the headline) reads first, then the object sticks under the header while the other steps scroll up beneath it.
   The step whose middle crosses the screen's middle line is the one in charge; `still(step)` draws the object for it.
   No scroll scrub: each step is a state, changed by a short tween. Server HTML = step 0, so hydration moves nothing. */
function useLine(refs, n, set) {
  useEffect(() => {
    const els = refs.current.slice(0, n).filter(Boolean);
    if (!els.length || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((list) => {
      for (const e of list) if (e.isIntersecting) set(+e.target.dataset.k);
    }, { rootMargin: '-50% 0px -50% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [refs, n, set]);
}

function Split({ steps, still, art, step, setStep, kind }) {
  const refs = useRef([]);
  useLine(refs, steps.length, setStep);
  const [first, ...rest] = steps;
  return (
    <section className="xag-split" data-kind={kind} data-step={step} aria-labelledby="xag-h1">
      <div className="xag-wrap xag-split-g">
        <div className="xag-step xag-step-0" ref={(el) => { refs.current[0] = el; }} data-k={0} data-on={step === 0 || undefined}>{first}</div>
        <div className="xag-still">
          <div className="xag-still-i">
            <div className="xag-art" aria-hidden="true">{art}</div>
            {still}
            <ol className="xag-pips" aria-hidden="true">{steps.map((_, i) => <li key={i} data-on={i === step || undefined} />)}</ol>
          </div>
        </div>
        {rest.map((node, j) => (
          <div key={j + 1} className="xag-step" ref={(el) => { refs.current[j + 1] = el; }} data-k={j + 1} data-on={step === j + 1 || undefined}>{node}</div>
        ))}
      </div>
    </section>
  );
}

/* the headline cuts into its line on arrival. The server HTML carries it set (readable with JS off and before hydration);
   the masked start pose and the cut-in are CSS under html.js, so they run from the first paint, not after hydration */
function Title({ f }) {
  return (
    <>
      <h1 id="xag-h1" className="xag-h1" data-morph-target="">
        <span className="x-sr">{f.h1}</span>
        <span className="x-line" aria-hidden="true"><span className="x-line-in xag-cut">{f.h1}</span></span>
      </h1>
      {f.label && <p className="xag-meta">{f.label}</p>}
    </>
  );
}

const Chev = () => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
/* one solid ask (the first, in Hanzo's words); every other action is a text link with an arrow */
function Acts({ list, big, solid = true, thumb, id }) {
  if (!list || !list.length) return null;
  return (
    <div className="xag-acts" {...(solid && !thumb ? { 'data-ask-hide': '' } : {})}>
      {list.map((a, i) => (i === 0 && solid
        ? <Cta key={a.href + i} to={a.href} kind="solid" id={id} thumb={thumb} className="xag-ask" data-thumb={thumb ? a.label : undefined}><span>{a.label}</span><Chev /></Cta>
        : <A key={a.href + i} to={a.href} className="xag-tl"><span>{a.label}</span><Chev /></A>))}
    </div>
  );
}

/* ---------- Crew: the ring ---------- */
/* each agent's own mark on the ring, drawn under Hanzo's portrait (and in its place wherever the picture cannot load):
   the initial and a dot on a hairline orbit at the agent's own place on the ring, so no two marks are alike. The seat
   number lives only in the hub ("04 / 10"); the room list and the close use type, not a second set of coins */
function Face({ a, i = 0, n = 10 }) {
  const t = (i / n) * Math.PI * 2;
  return (
    <span className="xag-face" data-tone={i % 2 ? 'b' : 'a'} aria-hidden="true">
      <svg className="xag-face-m" viewBox="0 0 100 100" focusable="false">
        <circle cx="50" cy="50" r="42" />
        <circle className="xag-face-dot" cx={(50 + 42 * Math.sin(t)).toFixed(2)} cy={(50 - 42 * Math.cos(t)).toFixed(2)} r="5" />
      </svg>
      <b>{a.name[0]}</b>
      {a.img && a.img.src && <i style={{ backgroundImage: `url(${ASSET(a.img.src)})` }} />}
    </span>
  );
}

function Ring({ r, b }) {
  const box = useRef(null);
  const cur = r.agents[b.at];
  const step = 360 / r.agents.length;
  const moved = useRef(false); // the first name is drawn as it stands (server and first paint agree); later turns slide in
  useEffect(() => { if (b.at !== 0) moved.current = true; }, [b.at]);
  const come = (y) => (moved.current || b.at !== 0 ? { y, opacity: 0 } : false);
  return (
    <div className="xag-ring" ref={box} onMouseLeave={b.free} style={{ '--n': r.agents.length }}>
      <span className="xag-orbit" aria-hidden="true" />
      <motion.span className="xag-baton" aria-hidden="true" animate={{ rotate: b.at * step }} transition={{ duration: DUR.fade, ease: MOVE }}><i /></motion.span>
      {r.agents.map((a, i) => (
        <A key={a.name} to={a.href} className="xag-seat" style={{ '--a': i * step + 'deg' }} data-on={i === b.at || undefined} data-dim={b.hit && !b.hit.includes(i) ? '' : undefined}
          onMouseEnter={() => b.take(i)} onFocus={() => b.take(i)} onBlur={b.free}>
          <Face a={a} i={i} n={r.agents.length} />
          <span className="x-sr">{a.name}{a.role ? ', ' + a.role : ''}</span>
        </A>
      ))}
      <div className="xag-hub" aria-live="polite">
        <motion.b key={cur.name} initial={come(14)} animate={{ y: 0, opacity: 1 }} transition={{ duration: DUR.fade, ease: EASE }}>{cur.name}</motion.b>
        <motion.span key={cur.name + 'r'} initial={come(10)} animate={{ y: 0, opacity: 1 }} transition={{ duration: DUR.fade, ease: EASE, delay: 0.06 }}>{cur.role}</motion.span>
        <span className="xag-hub-n x-mono">{String(b.at + 1).padStart(2, '0')} / {String(r.agents.length).padStart(2, '0')}</span>
      </div>
    </div>
  );
}

function Find({ r, b, q, setQ }) {
  const router = useRouter();
  const top = b.hit && b.hit.length ? r.agents[b.hit[0]] : null;
  const inp = useRef(null);
  // the kit Field's markup and look, with a fixed id (its useId drifted between server and client here) and its own clear
  return (
    <div className="xag-find">
      <div className="x-field xag-find-f">
        <label htmlFor="xag-find-q">Find an agent</label>
        <div className="xag-find-box">
          <input ref={inp} id="xag-find-q" name="agent" type="search" className="x-input2" value={q} autoComplete="off" spellCheck="false" enterKeyHint="go"
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && top) router.push(route(top.href)); if (e.key === 'Escape' && q) { e.preventDefault(); setQ(''); } }} />
          <button type="button" className="xag-clear" aria-label="Clear" hidden={!q} onClick={() => { setQ(''); inp.current?.focus(); }}>
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>
      <div>
        <span className="xag-find-n" aria-live="polite">{b.hit ? (top ? <><Face a={top} i={b.hit[0]} n={r.agents.length} />{top.name}{top.role ? <em>{top.role}</em> : null}<kbd>↵</kbd></> : '—') : ''}</span>
      </div>
    </div>
  );
}

/* the roll call, the split's last step: the crew in type, each name a door to its chat with its role underneath. As each
   row crosses the middle of the screen it takes the turn on the ring that holds still beside it */
function Roll({ r, roll, setRoll, label }) {
  const refs = useRef([]);
  useLine(refs, r.agents.length, setRoll);
  return (
    <ul className="xag-mates" aria-label={label}>
      {r.agents.map((a, i) => (
        <li key={a.name} ref={(el) => { refs.current[i] = el; }} data-k={i} data-on={i === roll || undefined}>
          <A to={a.href} className="xag-mate" onMouseEnter={() => setRoll(i)} onFocus={() => setRoll(i)}>
            <span className="xag-mate-n">{a.name}<Chev /></span>
            {a.role && <span className="xag-mate-r">{a.role}</span>}
          </A>
        </li>
      ))}
    </ul>
  );
}

function Crew({ doc, roster, room, build }) {
  const f = doc.fold;
  const box = useRef(null);
  const calm = useCalm();
  const [step, setStep] = useState(0);
  const [roll, setRoll] = useState(-1);
  const baton = useBaton(roster.agents.length, 1900, box, calm);
  const base = step === 2 && roll >= 0 ? { ...baton, at: roll } : baton; // in the roll call the scrolling names hand out the turn
  const [q, setQ] = useState('');
  const hit = useMemo(() => {
    const w = q.trim().toLowerCase();
    if (!w) return null;
    return roster.agents.map((a, i) => ({ i, s: (a.name + ' ' + a.role).toLowerCase().split(/[^a-z]+/).some((t) => t.startsWith(w)) || (a.name + ' ' + a.role).toLowerCase().includes(w) })).filter((x) => x.s).map((x) => x.i);
  }, [q, roster.agents]);
  useEffect(() => { if (hit && hit.length) base.take(hit[0]); else if (!q) base.free(); }, [hit]); // eslint-disable-line react-hooks/exhaustive-deps
  const b = { ...base, hit };
  const nums = [roster.agents.length, ...roster.agents.map((a) => a.name.length), doc.sections.length];
  const ask = room && room.actions.length ? room.actions.slice(0, 1) : null; // the crew's one ask, in Hanzo's words
  return (
    <>
      {/* order: the split (headline, the team and its finder, the roll call) → "Or build your own." → the Bots room, last */}
      <Split kind="crew" step={step} setStep={setStep}
        art={<Sigil seed={doc.route} data={nums} className="xag-sigil" />}
        still={<div ref={box}><Ring r={roster} b={b} /></div>}
        steps={[
          <><Title f={f} />{f.lede.map((p, i) => <p key={i} className="xag-lede">{p}</p>)}<Acts list={ask} big thumb id="agents-crew.hero" /></>,
          <Enter kind="spring-snap"><h2 className="xag-h2">{roster.h2}</h2><Kick className="under">{roster.eyebrow}</Kick>{roster.lede && <p className="xag-lede">{roster.lede}</p>}<Find r={roster} b={b} q={q} setQ={setQ} /></Enter>,
          <Enter kind="invert-flash"><Roll r={roster} roll={roll} setRoll={setRoll} label={roster.h2} /></Enter>,
        ]}
      />
      {room && <Room s={room} agents={roster.agents} />}
      {build && (
        <section className="xag-sec xag-build">
          <Enter kind="count-roll" className="xag-wrap">
            {/* the crew's size, counted from the roster, rolls up beside the door to building your own */}
            <A to={build.href} className="xag-build-a" data-morph="">
              <span className="xag-build-n x-mono" aria-hidden="true"><Roll9 text={String(roster.agents.length).padStart(2, '0')} /></span>
              <span className="xag-build-t">{build.label}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M12.5 5.5 19 12l-6.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </A>
          </Enter>
        </section>
      )}
    </>
  );
}

/* the Bots room, the crew's one dark room: Hanzo's screenshot, light or dark; the room is drawn from its own description underneath */
function Room({ s, agents }) {
  const [night, setNight] = useState(true);
  const [dark, light] = s.shots.length > 1 ? s.shots : [s.shots[0], s.shots[0]];
  const shot = night ? dark : light;
  const to = s.sketch ? agents.findIndex((a) => a.name === s.sketch.to) : -1;
  const who = agents[to] || agents[0];
  // the window keeps the screenshot's shape only once Hanzo's picture has actually loaded; until then (or if it never
  // does) it is as tall as the room drawn from the picture's own description, so no empty pane
  const [pic, setPic] = useState(false);
  useEffect(() => {
    let live = true;
    const im = new Image();
    im.onload = () => { if (live) setPic(true); };
    im.src = ASSET(dark.src);
    return () => { live = false; };
  }, [dark.src]);
  return (
    <section className="xag-sec xag-room" data-room="dark">
      <div className="xag-wrap">
        <div className="xag-room-h">
          <div><h2 className="xag-h2 xag-room-t">{s.h2}</h2><Kick className="under">{s.eyebrow}</Kick></div>
          <div className="xag-room-r">{s.lede && <p className="xag-lede">{s.lede}</p>}<Acts list={s.actions} big id="agents-crew.room" /></div>
        </div>
        {/* inertia-drag: the window is thrown in from the right and settles; grab it and throw it sideways, it springs home */}
        <Enter kind="inertia-drag">
        <motion.figure className="xag-shot xag-throw" data-night={night || undefined} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.32} dragTransition={{ bounceStiffness: 260, bounceDamping: 22 }}>
          <div className="xag-shot-bar">
            <span className="xag-dots" aria-hidden="true"><i /><i /><i /></span>
            <span className="xag-url x-mono"><i className="xag-live" aria-hidden="true" /><span>{s.url}</span></span>
            <button type="button" className="xag-night" aria-pressed={night} onClick={() => setNight((v) => !v)}>
              <span aria-hidden="true">{night ? '☾' : '☀'}</span><span className="xag-night-t">{night ? 'Dark' : 'Light'}</span>
            </button>
          </div>
          <div className="xag-shot-i" data-pic={pic || undefined}>
            {s.sketch && (
              <div className="xag-sk" aria-hidden="true">
                <aside>{agents.slice(0, 7).map((a) => <span key={a.name} data-on={a.name === s.sketch.to || undefined}><i className="xag-sk-dot" />{a.name}</span>)}</aside>
                <div className="xag-sk-m">
                  <div className="xag-sk-h"><p>{s.sketch.to}</p>{who.role && <span>{who.role}</span>}</div>
                  <ul>{s.sketch.runs.map((r, i) => <li key={r} style={{ '--i': i }}><span>{r}</span><em className="x-mono">done</em></li>)}</ul>
                  <p className="xag-sk-box">{s.sketch.to}</p>
                </div>
              </div>
            )}
            <span className="xag-shot-p" role="img" aria-label={shot.alt} style={pic ? { backgroundImage: `url(${ASSET(shot.src)})` } : undefined} />
          </div>
        </motion.figure>
        </Enter>
        <p className="xag-cap x-mono">{s.caption}</p>
      </div>
    </section>
  );
}

/* ---------- SDK: the console ---------- */
/* drive: null = the conversation plays by itself (the hero step); a number = the split's scrolling step sets how many
   turns are on screen, forwards and back */
function Console({ c, drive = null }) {
  const box = useRef(null);
  const live = useInView(box, { amount: 0.15 }); // starts as soon as it shows, so the phone's first screen moves too
  const calm = useCalm();
  const [shown, setShown] = useState(c.turns.length);
  const [think, setThink] = useState(false);
  useEffect(() => {
    if (drive !== null) { setThink(false); setShown(Math.min(c.turns.length, drive)); return; }
    if (!live || calm) { setShown(c.turns.length); setThink(false); return; }
    let i = 0, t = 0;
    const next = () => {
      if (i >= c.turns.length) return; // the conversation settles; it plays again only when it comes back into view
      const agent = c.turns[i].who !== 'you';
      setThink(agent);
      t = setTimeout(() => { setThink(false); i += 1; setShown(i); t = setTimeout(next, agent ? 1700 : 900); }, agent ? 1300 : 500);
    };
    setShown(0);
    t = setTimeout(next, 600);
    return () => clearTimeout(t);
  }, [live, calm, c.turns, drive]);
  const holder = think ? 'enso' : shown ? c.turns[shown - 1].who : 'you';
  return (
    <figure className="xag-con" ref={box}>
      <div className="xag-win">
        <div className="xag-win-bar">
          <span className="xag-dots" aria-hidden="true"><i /><i /><i /></span>
          {c.home ? <A to={c.home} className="xag-win-t">{c.title}</A> : <span className="xag-win-t">{c.title}</span>}
          <span className="xag-turn x-mono" aria-hidden="true"><i data-on={holder === 'you' || undefined}>you</i><i data-on={holder !== 'you' || undefined}>agent</i></span>
        </div>
        <div className="xag-win-g">
          <nav aria-label="Agents in the console" className="xag-win-nav">
            {c.nav.map((n) => <A key={n.href} to={n.href} aria-current={n.current ? 'page' : undefined}><em>{n.label}</em></A>)}
          </nav>
          <ol className="xag-turns">
            {c.turns.map((t, i) => (
              <li key={i} data-who={t.who} data-seen={i < shown || undefined} data-on={i === shown - 1 || undefined}>
                <button type="button" onClick={() => setShown(i + 1)}>
                  {i === shown - 1 && <motion.i layoutId="xag-hold" className="xag-hold" transition={INK} aria-hidden="true" />}
                  <span className="xag-who x-mono" aria-hidden="true">{t.who === 'you' ? '›' : '◆'}</span><span className="xag-tt">{t.text}</span>
                </button>
              </li>
            ))}
            <li className="xag-think" data-on={think || undefined} aria-hidden="true"><i /><i /><i /></li>
          </ol>
        </div>
        <div className="xag-win-foot"><code className="x-mono">{c.endpoint}</code>{c.open && <A to={c.open.href} className="xag-open"><span>{c.open.label}</span> <i aria-hidden="true">↗</i></A>}</div>
      </div>
      <figcaption className="xag-cap x-mono">{c.caption}</figcaption>
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
            onKeyDown={(e) => { if (/Arrow(Right|Left|Up|Down)/.test(e.key)) { e.preventDefault(); const n = (at + 1) % lines.length; setAt(n); e.currentTarget.parentNode.children[n]?.focus(); } }}>
            {i === at && <motion.i layoutId="xag-inst-ink" transition={INK} />}<span>{tool(l)}</span>
          </button>
        ))}
      </div>
      <code className="xag-inst-c x-mono"><span aria-hidden="true">$ </span>{lines[at]}</code>
      <Copy text={lines[at]} />
    </div>
  );
}

function Head({ s, className = '' }) {
  return (
    <div className={'xag-head ' + className}>
      {s.h2 && <h2 className="xag-h2">{s.h2}</h2>}
      <Kick className="under">{s.eyebrow}</Kick>
      {s.lede && <p className="xag-lede">{s.lede}</p>}
    </div>
  );
}

/* the parts, one open at a time: the titles are the index, the open one shows its paragraph, and the contour beside it
   is redrawn from that part's own numbers (its place and its length), so the picture changes with the part */
function Spec({ s, seed }) {
  const [open, setOpen] = useState(0);
  const n = s.cards.length;
  const pad = (k) => String(k).padStart(2, '0');
  const key = (e, i) => {
    const to = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: n - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    const k = (to + n) % n;
    e.currentTarget.closest('ol').querySelectorAll('button')[k]?.focus();
  };
  return (
    <section className="xag-sec xag-spec">
      <div className="xag-wrap xag-spec-g">
        <div className="xag-spec-h">
          <Head s={s} />
          {/* inertia-drag: the contour tile is thrown in and settles; grab it and throw it, it springs back to its place */}
          <Enter kind="inertia-drag">
            <motion.div className="xag-spec-art xag-throw" aria-hidden="true" drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.32} dragTransition={{ bounceStiffness: 260, bounceDamping: 22 }}>
              <Sigil seed={seed + '#' + open} data={[s.cards[open].text.length, open + 1, n]} className="xag-sigil" />
              <span className="xag-spec-tag x-mono">{pad(open + 1)} / {pad(n)}</span>
            </motion.div>
          </Enter>
        </div>
        <ol className="xag-spec-l">
          {s.cards.map((c, i) => (
            <li key={c.title} data-open={i === open || undefined}>
              <h3 className="xag-spec-t">
                <button type="button" id={'xag-part-' + i} aria-expanded={i === open} aria-controls={'xag-part-p' + i} onClick={() => setOpen(i)} onKeyDown={(e) => key(e, i)}>
                  <span className="x-mono">{pad(i + 1)}</span><span className="xag-spec-tt">{c.title}</span><i aria-hidden="true" />
                </button>
              </h3>
              <div className="xag-spec-p" id={'xag-part-p' + i} role="region" aria-labelledby={'xag-part-' + i} inert={i !== open ? true : undefined}>
                <div><p className="xag-body">{c.text}</p></div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* the code, in the SDK's one dark room: lines land one after another when it arrives */
function Code({ s }) {
  const src = s.lines.map((l) => l.map((x) => x[1]).join('')).join('\n');
  return (
    // invert-flash: the graphite room arrives as its negative for a beat, then turns dark
    <Enter as="section" kind="invert-flash" className="xag-sec xag-code" data-room="dark">
      <div className="xag-wrap xag-code-g">
        <div className="xag-code-h"><Head s={s} /><Acts list={s.actions} id="agents-sdk.code" /></div>
        <CodeBlock code={src} label={s.lang} className="xag-pre" />
      </div>
    </Enter>
  );
}

function Close({ s, get, ask }) {
  return (
    // count-roll: as the close arrives, the licence's version rolls up to its figure
    <Enter as="section" kind="count-roll" className="xag-sec xag-close">
      <div className="xag-wrap">
        <h2 className="xag-close-t">{s.h2}</h2>
        <div className="xag-close-g">
          <div className="xag-close-l">
            {s.lede && <p className="xag-lede">{s.lede}</p>}
            <Acts list={[...(ask || []), ...s.actions]} big solid={!!(ask && ask.length)} id="agents-sdk.close" />
          </div>
        </div>
        {get && (
          <div className="xag-get">
            <div><h3 className="xag-get-t">{get.h2}</h3><p>{get.lede}</p></div>
            <div className="xag-get-c">
              {get.license && <span className="xag-chip x-mono"><span>{get.license[0]}</span> <Roll9 text={get.license[1]} /></span>}
              {get.github && <A to={get.github.href} className="xag-chip x-mono">{get.github.label} ↗</A>}
              {get.actions.map((a) => <A key={a.href} to={a.href} className="xag-tl"><span>{a.label}</span><Chev /></A>)}
            </div>
          </div>
        )}
      </div>
    </Enter>
  );
}

function Sdk({ doc }) {
  const f = doc.fold;
  const by = (k) => doc.sections.filter((s) => s.k === k);
  const nums = [doc.sections.length, ...(f.console ? f.console.turns.map((t) => t.text.length) : []), f.through.length];
  const [lead, ...rest] = f.lede;
  const [step, setStep] = useState(0);
  const pil = by('pillars')[0];
  const term = f.install.length > 1;
  // the steps: the headline (the console plays itself) · the install line (the still side turns into the terminal) ·
  // the three pillars (each one puts one more turn of the conversation on screen, and takes it off scrolling back)
  const steps = [
    <><Title f={f} />{lead && <p className="xag-lede">{lead}</p>}<Acts list={f.actions} big thumb id="agents-sdk.hero" /></>,
    <Enter kind="spring-snap">
      {rest.map((p) => <p key={p} className="xag-lede xag-lede-b">{p}</p>)}
      {f.note && <p className="xag-note">{f.note}</p>}
      {f.through.length > 0 && <p className="xag-thru"><span className="x-mono">{f.through[0]}</span>{f.through.slice(1).map((t) => <span key={t} className="xag-thru-c">{t}</span>)}</p>}
    </Enter>,
    ...(pil ? pil.cards.map((c, i) => (
      <>
        {i === 0 && <Head s={pil} className="xag-pil-h" />}
        <div className="xag-pil">
          <span className="xag-sheet-n x-mono">{c.n}</span>
          <h3 className="xag-h3">{c.title}</h3>
          <p className="xag-body">{c.text}</p>
        </div>
      </>
    )) : []),
  ];
  const view = step === 1 && term ? 'term' : 'con';
  const drive = step >= 2 ? step - 1 : null;
  return (
    <>
      {/* order: the split (headline, install, the three pillars) → the code room → the parts → the close */}
      <Split kind="sdk" step={step} setStep={setStep} steps={steps}
        art={<Sigil seed={doc.route} data={nums} className="xag-sigil" />}
        still={
          <div className="xag-views" data-view={view}>
            {f.console && <div className="xag-view xag-view-con" inert={view !== 'con' ? true : undefined}><Console c={f.console} drive={drive} /></div>}
            {term && (
              <div className="xag-view xag-view-term" inert={view !== 'term' ? true : undefined}>
                <figure className="xag-term">
                  <div className="xag-pre-bar"><span className="xag-dots" aria-hidden="true"><i /><i /><i /></span></div>
                  <Install lines={f.install} />
                </figure>
              </div>
            )}
          </div>
        }
      />
      {by('code').map((s, i) => <Code key={'c' + i} s={s} />)}
      {by('parts').map((s, i) => <Spec key={'s' + i} s={s} seed={doc.route + '#parts'} />)}
      {by('close').map((s, i) => <Close key={'x' + i} s={s} get={i === 0 ? by('get')[0] : null} ask={f.actions.slice(0, 1)} />)}
      {!by('close').length && by('get').map((g, i) => <Close key={'g' + i} s={{ h2: '', actions: [] }} get={g} />)}
    </>
  );
}

export default function AgentRoom({ doc }) {
  const roster = doc.sections.find((s) => s.k === 'roster');
  return (
    <main className="xag" data-kind={roster ? 'crew' : 'sdk'}>
      <div className="xag-first" aria-hidden="true" />
      {roster
        ? <Crew doc={doc} roster={roster} room={doc.sections.find((s) => s.k === 'room')} build={roster.more} />
        : <Sdk doc={doc} />}
    </main>
  );
}
