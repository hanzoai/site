'use client';
/* /agents/<page> (one template, Archetype A: Launch). Each member is a product launch told in chapters, carrying its own
   data and Sigil seed: Crew is ten agents on a ring and the Bots room; the SDK is a console that runs itself, three
   pillars on stacked sheets, a spec sheet, the code in the dark room. All wording, figures and links are Hanzo's.
   Signature: who has the turn. The member's live object is the hero and runs by itself: a baton passes around the
   crew's ring (the one holding it says who they are) and through the SDK console, from you to the agent and back,
   the way a router hands a network its turns. Hover, focus or press anything to take the baton.
   Supporting: the stage (the live object starts big and low, then settles beside the next chapter as the first
   chapter's words leave), an ink that slides between choices, a magnetic main action. Sigil sits under the object.
   The demos play through once each time they come into view, then rest; no colour but Hanzo's own pictures (v3 rules).
   Beyond: start in one step. On Crew, type what you need and the agent whose own role matches takes the baton; Enter
   opens the chat with them. On the SDK, its own install line for pip or cargo, ready to copy.
   Persona: Developer (SDK) and team buyer (Crew). Goal: start building with agents. Metric: install_copy (SDK), signup_start (Crew).
   CTA: "Read the docs" (SDK), "Launch a bot" (Crew): one solid ask, hero to close; every other action a text link.
   V2: 8.5/10 Apple-style launch: pinned stage where the live ring or console settles as chapter one hands over; greyscale, labels under every headline, one solid ask hero to close, every control answers hover and press, real objects in parts and both closes. */
// Signature: who has the turn: a baton passes by itself around the agents' ring and through the console turns, the hero object settling on a pinned stage
// Beyond: start in one step: type a need and the agent whose own role matches takes the baton (Enter opens the chat); the SDK's own pip or cargo line, ready to copy
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useInView, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { EASE, Copy, Magnetic } from '../../ui';
import { A } from '../../kit';
import Sigil from '../../Sigil';
import { href as route } from '../../../lib/route';
import './AgentRoom.css';

const ASSET = (p) => p; // Hanzo's own pictures, by their own paths (live dev fetches files this repo lacks from hanzo.ai)
const INK = { type: 'spring', stiffness: 300, damping: 30 };
/* JavaScript off: show what starts hidden for its entrance (line masks, ledes, code lines, the hub's name) and unpin the stage */
const NOJS = '.xag .x-line-in,.xag-lede,.xag-ln,.xag-hub b,.xag-hub span,.xag-shot{transform:none!important;opacity:1!important}'
  + '@media (min-width:901px){.xag-stage{height:auto!important}.xag-pin{position:relative!important;height:auto!important;display:block!important;overflow:visible!important}'
  + '.xag-stage-g{padding:150px 0 96px!important;row-gap:80px!important}.xag-one{grid-row:1!important}.xag-two{grid-row:2!important;opacity:1!important;transform:none!important}.xag-obj{grid-row:1/span 2!important;transform:none!important}}';
const fade = (v, from, to) => Math.min(1, Math.max(0, (v - from) / (to - from))); // 0 at `from`, 1 at `to`

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
    let k = 0;
    const id = setInterval(() => { setAt((a) => (a + 1) % n); k += 1; if (k >= n) clearInterval(id); }, ms);
    return () => clearInterval(id);
  }, [live, held, n, ms, calm]);
  return { at, take: (i) => { setAt(i); setHeld(true); }, free: () => setHeld(false) };
}

function Kick({ children, className = '' }) { return children ? <p className={'xag-kick x-mono ' + className}>{children}</p> : null; }

/* ---------- the stage: chapter one leaves, chapter two arrives, the live object settles (desktop); stacked on phones ---------- */
function Stage({ first, second, object, art, from = 1.12, low = '8%' }) {
  const box = useRef(null);
  const pin = useMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)'); // the same test the stylesheet pins with
  const { scrollYProgress: p } = useScroll({ target: box, offset: ['start start', 'end end'] });
  const outY = useTransform(p, [0.12, 0.46], [0, -90]);
  const outO = useTransform(p, (v) => fade(v, 0.4, 0.12)); // a function, so Motion keeps it on the main thread in step with Lenis
  const inY = useTransform(p, [0.4, 0.72], [70, 0]);
  const inO = useTransform(p, (v) => fade(v, 0.42, 0.68));
  const s = useTransform(p, [0, 0.72], [from, 1]); // starts a little big and low, settles; never wider than its six columns
  const y = useTransform(p, [0, 0.72], [low, '0%']);
  const [two, setTwo] = useState(false);
  useMotionValueEvent(p, 'change', (v) => setTwo(v > 0.42));
  const on = !pin || two;
  return (
    <section ref={box} className="xag-stage" data-two={on || undefined} aria-labelledby="xag-h1">
      <div className="xag-pin">
        <div className="xag-wrap xag-stage-g">
          <motion.div className="xag-one" style={pin ? { y: outY, opacity: outO } : undefined} inert={pin && two ? true : undefined}>{first}</motion.div>
          <motion.div className="xag-two" style={pin ? { y: inY, opacity: inO } : undefined} inert={pin && !two ? true : undefined}>{second}</motion.div>
          <motion.div className="xag-obj" style={pin ? { scale: s, y } : undefined}>
            <div className="xag-art" aria-hidden="true">{art}</div>
            {object}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Title({ f }) {
  return (
    <>
      <h1 id="xag-h1" className={'xag-h1' + (f.h1.length > 34 ? ' long' : '')} data-morph-target>
        <noscript><style>{NOJS}</style></noscript>
        <span className="x-line"><motion.span className="x-line-in" initial={{ y: '106%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}>{f.h1}</motion.span></span>
      </h1>
      {f.label && <p className="xag-meta">{f.label}</p>}
    </>
  );
}

const Chev = () => <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
/* one solid ask (the first, in Hanzo's words); every other action is a text link with an arrow */
function Acts({ list, big, solid = true }) {
  if (!list || !list.length) return null;
  return (
    <div className="xag-acts">
      {list.map((a, i) => (i === 0 && solid
        ? <Magnetic key={a.href + i} strength={0.25}><A to={a.href} className={'x-btn solid' + (big ? ' xag-big' : '')} data-thumb=""><span>{a.label}</span><Chev /></A></Magnetic>
        : <A key={a.href + i} to={a.href} className="xag-tl"><span>{a.label}</span><Chev /></A>))}
    </div>
  );
}

/* ---------- Crew: the ring ---------- */
function Face({ a, size }) {
  return (
    <span className="xag-face" style={{ width: size, height: size }} aria-hidden="true">
      <b>{a.name[0]}</b>
      {a.img && a.img.src && <i style={{ backgroundImage: `url(${ASSET(a.img.src)})` }} />}
    </span>
  );
}

function Ring({ r, b }) {
  const box = useRef(null);
  const cur = r.agents[b.at];
  const step = 360 / r.agents.length;
  return (
    <div className="xag-ring" ref={box} onMouseLeave={b.free} style={{ '--n': r.agents.length }}>
      <span className="xag-orbit" aria-hidden="true" />
      <motion.span className="xag-baton" aria-hidden="true" animate={{ rotate: b.at * step }} transition={{ type: 'spring', stiffness: 120, damping: 20 }}><i /></motion.span>
      {r.agents.map((a, i) => (
        <A key={a.name} to={a.href} className="xag-seat" style={{ '--a': i * step + 'deg' }} data-on={i === b.at || undefined} data-dim={b.hit && !b.hit.includes(i) ? '' : undefined}
          onMouseEnter={() => b.take(i)} onFocus={() => b.take(i)} onBlur={b.free} data-cursor="Talk">
          <Face a={a} />
          <span className="x-sr">{a.name}{a.role ? ', ' + a.role : ''}</span>
        </A>
      ))}
      <div className="xag-hub" aria-live="polite">
        <motion.b key={cur.name} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: EASE }}>{cur.name}</motion.b>
        <motion.span key={cur.name + 'r'} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}>{cur.role}</motion.span>
        <span className="xag-hub-n x-mono">{String(b.at + 1).padStart(2, '0')} / {String(r.agents.length).padStart(2, '0')}</span>
      </div>
    </div>
  );
}

function Find({ r, b, q, setQ }) {
  const router = useRouter();
  const top = b.hit && b.hit.length ? r.agents[b.hit[0]] : null;
  return (
    <div className="xag-find">
      <label className="xag-find-l x-mono" htmlFor="xag-q">Find an agent</label>
      <div className="xag-find-f">
        <input id="xag-q" type="search" value={q} autoComplete="off" spellCheck="false" placeholder="design, legal, support…" onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && top) router.push(route(top.href)); }} />
        <span className="xag-find-n" aria-live="polite">{b.hit ? (top ? <><Face a={top} size={28} />{top.name}{top.role ? <em>{top.role}</em> : null}<kbd>↵</kbd></> : '—') : ''}</span>
      </div>
    </div>
  );
}

function Crew({ doc, roster, room, build }) {
  const f = doc.fold;
  const box = useRef(null);
  const calm = useCalm();
  const base = useBaton(roster.agents.length, 1900, box, calm);
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
      <Stage
        art={<Sigil seed={doc.route} data={nums} className="xag-sigil" />}
        first={<><Title f={f} />{f.lede.map((p, i) => <motion.p key={i} className="xag-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.35 + i * 0.08 }}>{p}</motion.p>)}<Acts list={ask} big /></>}
        second={<><h2 className="xag-h2">{roster.h2}</h2><Kick className="under">{roster.eyebrow}</Kick>{roster.lede && <p className="xag-lede">{roster.lede}</p>}<Find r={roster} b={b} q={q} setQ={setQ} /></>}
        object={<div ref={box}><Ring r={roster} b={b} /></div>}
      />
      {room && <Room s={room} agents={roster.agents} />}
      {build && (
        <section className="xag-sec xag-build">
          <div className="xag-wrap">
            <A to={build.href} className="xag-build-a" data-morph="">
              <span className="xag-build-t">{build.label}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M12.5 5.5 19 12l-6.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </A>
            <div className="xag-build-g">
              <ul className="xag-mates" aria-label={roster.h2}>
                {roster.agents.map((a, i) => (
                  <li key={a.name} style={{ '--i': i }}><A to={a.href} className="xag-mate" data-cursor="Talk"><Face a={a} /><span className="xag-mate-n">{a.name}</span></A></li>
                ))}
              </ul>
              {ask && <Acts list={ask} big />}
            </div>
          </div>
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
  const box = useRef(null);
  const calm = useCalm();
  const { scrollYProgress: p } = useScroll({ target: box, offset: ['start end', 'center center'] });
  const sc = useTransform(p, [0, 1], [0.86, 1]);
  const y = useTransform(p, [0, 1], [90, 0]);
  return (
    <section className="xag-sec xag-room" data-room="dark">
      <div className="xag-wrap">
        <div className="xag-room-h">
          <div><h2 className="xag-h2 xag-room-t">{s.h2}</h2><Kick className="under">{s.eyebrow}</Kick></div>
          <div className="xag-room-r">{s.lede && <p className="xag-lede">{s.lede}</p>}<Acts list={s.actions} big /></div>
        </div>
        <motion.figure ref={box} className="xag-shot" data-night={night || undefined} style={calm ? undefined : { scale: sc, y }}>
          <div className="xag-shot-bar">
            <span className="xag-dots" aria-hidden="true"><i /><i /><i /></span>
            <span className="xag-url x-mono"><i className="xag-live" aria-hidden="true" />{s.url}</span>
            <button type="button" className="xag-night" aria-pressed={night} onClick={() => setNight((v) => !v)}>
              <span aria-hidden="true">{night ? '☾' : '☀'}</span><span className="xag-night-t">{night ? 'Dark' : 'Light'}</span>
            </button>
          </div>
          <div className="xag-shot-i">
            {s.sketch && (
              <div className="xag-sk" aria-hidden="true">
                <aside>{agents.slice(0, 7).map((a) => <span key={a.name} data-on={a.name === s.sketch.to || undefined}><Face a={a} size={22} />{a.name}</span>)}</aside>
                <div className="xag-sk-m">
                  <p className="xag-sk-h"><Face a={agents.find((a) => a.name === s.sketch.to) || agents[0]} size={34} />{s.sketch.to}</p>
                  <ul>{s.sketch.runs.map((r, i) => <li key={r} style={{ '--i': i }}><span>{r}</span><em className="x-mono">done</em></li>)}</ul>
                  <p className="xag-sk-box">{s.sketch.to}</p>
                </div>
              </div>
            )}
            <span className="xag-shot-p" role="img" aria-label={shot.alt} style={{ backgroundImage: `url(${ASSET(shot.src)})` }} />
          </div>
        </motion.figure>
        <p className="xag-cap x-mono">{s.caption}</p>
      </div>
    </section>
  );
}

/* ---------- SDK: the console ---------- */
function Console({ c }) {
  const box = useRef(null);
  const live = useInView(box, { amount: 0.15 }); // starts as soon as it shows, so the phone's first screen moves too
  const calm = useCalm();
  const [shown, setShown] = useState(c.turns.length);
  const [think, setThink] = useState(false);
  useEffect(() => {
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
  }, [live, calm, c.turns]);
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
                  <span className="xag-who x-mono" aria-hidden="true">{t.who === 'you' ? '›' : '◆'}</span>{t.text}
                </button>
              </li>
            ))}
            <li className="xag-think" data-on={think || undefined} aria-hidden="true"><i /><i /><i /></li>
          </ol>
        </div>
        <div className="xag-win-foot"><code className="x-mono">{c.endpoint}</code>{c.open && <A to={c.open.href} className="xag-open">{c.open.label} <i aria-hidden="true">↗</i></A>}</div>
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

/* three pillars as sheets that stack over each other as you scroll */
function Sheets({ s }) {
  return (
    <section className="xag-sec xag-sheets">
      <div className="xag-wrap xag-sheets-g">
        <Head s={s} className="xag-sheets-h" />
        <ol className="xag-sheets-l">
          {s.cards.map((c, i) => (
            <li key={c.title} style={{ '--i': i }}>
              <span className="xag-sheet-n x-mono">{c.n}</span>
              <div><h3 className="xag-h3">{c.title}</h3><p className="xag-body">{c.text}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* the spec sheet: the parts, laid out like a product's tech specs */
function Spec({ s, seed }) {
  return (
    <section className="xag-sec xag-spec">
      <div className="xag-wrap xag-spec-g">
        <div className="xag-spec-h">
          <Head s={s} />
          <div className="xag-spec-art" aria-hidden="true"><Sigil seed={seed} data={s.cards.map((c) => c.text.length)} className="xag-sigil" /></div>
        </div>
        <dl className="xag-spec-l">
          {s.cards.map((c, i) => (
            <div key={c.title}>
              <dt><span className="x-mono">{String(i + 1).padStart(2, '0')}</span>{c.title}</dt>
              <dd className="xag-body">{c.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* the code, in the SDK's one dark room: lines land one after another when it arrives */
function Code({ s }) {
  const src = s.lines.map((l) => l.map((x) => x[1]).join('')).join('\n');
  return (
    <section className="xag-sec xag-code" data-room="dark">
      <div className="xag-wrap xag-code-g">
        <div className="xag-code-h"><Head s={s} /><Acts list={s.actions} /></div>
        <figure className="xag-pre">
          <div className="xag-pre-bar"><span className="xag-dots" aria-hidden="true"><i /><i /><i /></span><span className="x-mono">{s.lang}</span><Copy text={src} /></div>
          <motion.pre tabIndex={0} data-lenis-prevent initial="h" whileInView="s" viewport={{ once: true, amount: 0.3 }} variants={{ h: {}, s: { transition: { staggerChildren: 0.045 } } }}>
            <code>{s.lines.map((l, j) => (
              <motion.span key={j} className="xag-ln" variants={{ h: { opacity: 0, x: -14 }, s: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } } }}>
                {l.map(([k, t], i) => <span key={i} data-k={k}>{t}</span>)}{j === s.lines.length - 1 && <i className="xag-caret" aria-hidden="true" />}{'\n'}
              </motion.span>
            ))}</code>
          </motion.pre>
        </figure>
      </div>
    </section>
  );
}

function Close({ s, get, ask, install }) {
  return (
    <section className="xag-sec xag-close">
      <div className="xag-wrap">
        <h2 className="xag-close-t">{s.h2}</h2>
        <div className="xag-close-g">
          <div className="xag-close-l">
            {s.lede && <p className="xag-lede">{s.lede}</p>}
            <Acts list={[...(ask || []), ...s.actions]} big solid={!!(ask && ask.length)} />
          </div>
          {install && install.length > 1 && (
            <figure className="xag-term">
              <div className="xag-pre-bar"><span className="xag-dots" aria-hidden="true"><i /><i /><i /></span></div>
              <Install lines={install} />
            </figure>
          )}
        </div>
        {get && (
          <div className="xag-get">
            <div><h3 className="xag-get-t">{get.h2}</h3><p>{get.lede}</p></div>
            <div className="xag-get-c">
              {get.license && <span className="xag-chip x-mono"><span>{get.license[0]}</span> {get.license[1]}</span>}
              {get.github && <A to={get.github.href} className="xag-chip x-mono">{get.github.label} ↗</A>}
              {get.actions.map((a) => <A key={a.href} to={a.href} className="xag-tl"><span>{a.label}</span><Chev /></A>)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Sdk({ doc }) {
  const f = doc.fold;
  const by = (k) => doc.sections.filter((s) => s.k === k);
  const nums = [doc.sections.length, ...(f.console ? f.console.turns.map((t) => t.text.length) : []), f.through.length];
  const [lead, ...rest] = f.lede;
  return (
    <>
      <Stage from={1.03} low="6%"
        art={<Sigil seed={doc.route} data={nums} className="xag-sigil" />}
        first={<><Title f={f} />{lead && <motion.p className="xag-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}>{lead}</motion.p>}<Acts list={f.actions} big /></>}
        second={<>
          {rest.map((p) => <p key={p} className="xag-lede xag-lede-b">{p}</p>)}
          {f.install.length > 1 && <Install lines={f.install} />}
          {f.note && <p className="xag-note">{f.note}</p>}
          {f.through.length > 0 && <p className="xag-thru"><span className="x-mono">{f.through[0]}</span>{f.through.slice(1).map((t) => <span key={t} className="xag-thru-c">{t}</span>)}</p>}
        </>}
        object={f.console ? <Console c={f.console} /> : null}
      />
      {by('pillars').map((s, i) => <Sheets key={'p' + i} s={s} />)}
      {by('parts').map((s, i) => <Spec key={'s' + i} s={s} seed={doc.route + '#parts'} />)}
      {by('code').map((s, i) => <Code key={'c' + i} s={s} />)}
      {by('close').map((s, i) => <Close key={'x' + i} s={s} get={i === 0 ? by('get')[0] : null} ask={f.actions.slice(0, 1)} install={f.install} />)}
      {!by('close').length && by('get').map((g, i) => <Close key={'g' + i} s={{ h2: '', actions: [] }} get={g} />)}
    </>
  );
}

export default function AgentRoom({ doc }) {
  const roster = doc.sections.find((s) => s.k === 'roster');
  return (
    <main className="xag" data-kind={roster ? 'crew' : 'sdk'}>
      {roster
        ? <Crew doc={doc} roster={roster} room={doc.sections.find((s) => s.k === 'room')} build={roster.more} />
        : <Sdk doc={doc} />}
    </main>
  );
}
