'use client';
/* Hanzo Cloud products (/cloud/<slug>, 42 pages, one template). The first screen is the product's own console, the
   example project Hanzo draws for it, at full size on a black card beside the name, over a contour field seeded from
   the product's slug and its own figures. Its sidebar is the product's family on hanzo.ai, so siblings are one click.
   Signature: the session runs in the console. The agent prompt from "Paste and ship" types itself into the window's
   session bar, and then the example plays: the request walks the project's services one by one (each row lights and
   its state shows), or the conversation with the agent arrives turn by turn, or the CLI session prints line by line,
   with the product's endpoint lit at the foot of the window. Click any service and the walk stops on it.
   Beyond: Google Cloud to Hanzo, in one lookup. A dark-room finder over every cloud page that names its Google Cloud
   counterpart (18 of them): type the Google Cloud service you use now and its Hanzo product and endpoint come forward,
   each a link. Built only from those pages' own "Google Cloud" and "API" lines. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { EASE, Copy } from '../../ui';
import { A, Tick } from '../../kit';
import Sigil from '../../Sigil';
import './cloudfam.css';

const up = (d) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } });
const nums = (s) => (String(s).match(/\d+(?:\.\d+)?/g) || []).map(Number);
const chip = (label) => (/^Generally available$/i.test(label) ? 'ga' : /^Beta$/i.test(label) ? 'beta' : '');

/* writes text into a text node a character at a time (no React state per character); resolves when done */
function typeInto(el, text, cps, alive) {
  return new Promise((done) => {
    let i = 0;
    el.textContent = '';
    const step = () => {
      if (!alive()) return done(false);
      i += 1;
      el.textContent = text.slice(0, i);
      if (i < text.length) setTimeout(step, 1000 / cps); else done(true);
    };
    setTimeout(step, 1000 / cps);
  });
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function Console({ doc }) {
  const w = doc.window;
  const box = useRef(null);
  const typed = useRef(null);
  const seen = useInView(box, { amount: 0.35 });
  const calm = useReducedMotion();
  const kind = w.rows.length ? 'rows' : w.turns.length ? 'turns' : 'lines';
  const count = w.rows.length || w.turns.length || w.lines.length;
  const prompt = (doc.ship && doc.ship.prompt) || '';
  const [phase, setPhase] = useState(calm ? 'done' : 'idle'); // idle → typing → play → done
  const typing = useRef(false); // set once the prompt has been typed in full
  const [at, setAt] = useState(kind === 'rows' ? 0 : count); // rows: the lit service; turns/lines: how many are shown
  const hold = useRef(0);

  // the session: type the prompt once, then play the example; it only runs while the window is on screen
  useEffect(() => {
    if (calm) { setPhase('done'); setAt(kind === 'rows' ? 0 : count); if (typed.current) typed.current.textContent = prompt; return; }
    if (!seen) return;
    let live = true;
    const alive = () => live;
    (async () => {
      if (typing.current) return;
      // (re)start the session; scrolled away mid-way, it starts again from the first character
      setPhase('typing');
      if (kind !== 'rows') setAt(0);
      if (typed.current && prompt && !(await typeInto(typed.current, prompt, 46, alive))) return;
      if (!live) return;
      typing.current = true;
      setPhase('play');
    })();
    return () => { live = false; };
  }, [seen, calm]); // eslint-disable-line react-hooks/exhaustive-deps

  // the walk: rows light in turn; turns and lines arrive one by one, then the session replays
  useEffect(() => {
    if (calm || !seen || (phase !== 'play' && phase !== 'done')) return;
    const id = setInterval(() => {
      if (Date.now() < hold.current) return;
      if (kind === 'rows') setAt((a) => (a + 1) % count);
      else setAt((a) => (a >= count + 2 ? 0 : a + 1)); // two beats of rest on the finished session
    }, kind === 'rows' ? 2100 : 1500);
    return () => clearInterval(id);
  }, [seen, calm, phase, kind, count]);

  const alt = doc.liveLinks[0];
  const title = w.title.map((t, i) => <span key={i} className={i ? 'xcf-wt-b' : ''}>{t}{i < w.title.length - 1 ? ' ' : ''}</span>);
  const pick = (i) => { hold.current = Date.now() + 9000; setAt(i); };
  const note = doc.live[0];
  return (
    <motion.figure ref={box} className="xcf-con" {...up(0.25)}>
      <div className="xcf-win">
        <div className="xcf-bar">
          <span className="xcf-dots" aria-hidden="true"><i /><i /><i /></span>
          {alt && w.console
            ? <A to={w.console.href} className="xcf-wt">{title}</A>
            : <span className="xcf-wt">{title}</span>}
        </div>
        {prompt && (
          <div className={'xcf-sess' + (phase === 'typing' ? ' typing' : '')}>
            <span className="xcf-sess-g" aria-hidden="true">›</span>
            <p className="xcf-sess-t x-mono"><span className="xcf-ghost" aria-hidden="true">{prompt}<i className="xcf-caret" /></span><span className="xcf-typed"><span ref={typed}>{prompt}</span><i className="xcf-caret" aria-hidden="true" /></span></p>
            {note && <p className={'xcf-sess-n' + (phase === 'typing' ? '' : ' on')}>{note}</p>}
          </div>
        )}
        <div className="xcf-body">
          <nav className="xcf-sibs" aria-label={doc.crumb[1] ? doc.crumb[1].label : doc.name} data-swipe-own>
            {w.siblings.map((s) => (
              <A key={s.href} to={s.href} className={'xcf-sib' + (s.current ? ' on' : '')} aria-current={s.current ? 'page' : undefined}>
                <span>{s.label}</span>
                <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M4 8h8M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </A>
            ))}
          </nav>
          <div className="xcf-main">
            {kind === 'rows' && (
              <ul className="xcf-rows">
                {w.rows.map((r, i) => (
                  <li key={r.name}>
                    <button type="button" className={'xcf-row' + (at === i ? ' on' : '')} aria-pressed={at === i} onClick={() => pick(i)}>
                      {at === i && <motion.span layoutId={'xcf-lit-' + doc.slug} className="xcf-lit" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />}
                      <span className="xcf-row-n x-mono">{r.name}</span>
                      <span className={'xcf-st ' + (/build/i.test(r.state) ? 'build' : 'ok')}><i aria-hidden="true" />{r.state}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {kind === 'turns' && (
              <ol className="xcf-turns">
                {w.turns.map((t, i) => (
                  <li key={i} className={(i % 2 ? 'agent' : 'you') + (at > i ? ' on' : '')} aria-hidden={false}>{t}</li>
                ))}
              </ol>
            )}
            {kind === 'lines' && (
              <ol className="xcf-lines x-mono">
                {w.lines.map((l, i) => (
                  <li key={i} className={at > i ? 'on' : ''}><b data-g={l.g}>{l.g}</b><span>{l.text}</span></li>
                ))}
              </ol>
            )}
            {w.caption && <p className="xcf-cap">{w.caption}</p>}
          </div>
        </div>
        <div className="xcf-foot">
          <code className="xcf-host x-mono">{w.host.map((h, i) => <span key={i} className={i ? 'xcf-path' : ''}>{h}</span>)}<i className="xcf-pulse" aria-hidden="true" /></code>
          {w.console && <A to={alt || w.console.href} className="xcf-open">{w.console.label}</A>}
        </div>
      </div>
      {w.note && <figcaption className="xcf-note">{w.note}</figcaption>}
    </motion.figure>
  );
}

/* /cloud/local: the boot, as a session that replays itself */
function Boot({ boot }) {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.4 });
  const calm = useReducedMotion();
  const refs = useRef([]);
  const [shown, setShown] = useState(boot.lines.length);
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (calm || !seen) return;
    let live = true;
    const alive = () => live;
    (async () => {
      setShown(0);
      await wait(300);
      for (let i = 0; i < boot.lines.length && live; i++) {
        const l = boot.lines[i];
        setShown(i + 1);
        if (l.cmd && refs.current[i] && l.text) await typeInto(refs.current[i], l.text, 30, alive);
        await wait(l.cmd ? 260 : 420);
      }
      if (!live) return;
      await wait(5200);
      if (live) setRun((r) => r + 1); // replay while it stays on screen
    })();
    return () => { live = false; };
  }, [seen, calm, run]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <motion.figure ref={box} className="xcf-con xcf-term" {...up(0.25)}>
      <div className="xcf-win">
        <div className="xcf-bar">
          <span className="xcf-dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="xcf-wt x-mono">{boot.cwd}</span>
        </div>
        <ol className="xcf-tlines x-mono">
          {boot.lines.map((l, i) => (
            <li key={i} className={(l.cmd ? 'cmd' : 'out') + (i < shown ? ' on' : '') + (i === shown - 1 ? ' cur' : '')}>
              {l.cmd && <b aria-hidden="true">$</b>}
              <span ref={(el) => { refs.current[i] = el; }}>{l.text}</span>
              {l.time && <em>{l.time}</em>}
              {l.cmd && !l.text && <i className="xcf-caret" aria-hidden="true" />}
            </li>
          ))}
        </ol>
      </div>
    </motion.figure>
  );
}

/* Beyond: the Google Cloud service you use now, and its Hanzo counterpart */
function Finder({ pairs, here }) {
  const [q, setQ] = useState('');
  const [lit, setLit] = useState(0);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const list = useMemo(() => {
    const k = q.trim().toLowerCase();
    const all = [...pairs].sort((a, b) => (b.slug === here) - (a.slug === here));
    return k ? all.filter((p) => (p.google + ' ' + p.name + ' ' + p.api).toLowerCase().includes(k)) : all;
  }, [q, pairs, here]);
  // idle scan: the rows are read one after another until you type
  useEffect(() => {
    if (calm || !seen || q) return;
    const id = setInterval(() => setLit((i) => (i + 1) % Math.max(1, list.length)), 1700);
    return () => clearInterval(id);
  }, [calm, seen, q, list.length]);
  if (!pairs.length) return null;
  const head = 'Google Cloud';
  return (
    <section ref={box} className="xcf-gc" data-room="dark" aria-labelledby="xcf-gc-h">
      <div className="x-wrap xcf-gc-g">
        <div className="xcf-gc-l">
          <h2 id="xcf-gc-h" className="xcf-gc-h"><span>{head}</span><svg viewBox="0 0 40 16" width="40" height="16" aria-hidden="true"><path d="M2 8h34M30 3l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg><span>Hanzo</span></h2>
          <label className="xcf-gc-in">
            <span className="x-sr">{head}</span>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M10.4 10.4 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={pairs[0].google} autoComplete="off" />
          </label>
          <p className="xcf-gc-n x-mono" aria-live="polite">{list.length} / {pairs.length}</p>
        </div>
        <ul className="xcf-gc-list">
          <AnimatePresence initial={false}>
            {list.map((p, i) => (
              <motion.li key={p.slug} layout={!calm} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.4, ease: EASE }}>
                <A to={'/cloud/' + p.slug} className={'xcf-gc-row' + (p.slug === here ? ' here' : '') + (!q && i === lit ? ' lit' : '')} aria-current={p.slug === here ? 'page' : undefined}>
                  <span className="xcf-gc-from">{p.google}</span>
                  <i className="xcf-gc-ar" aria-hidden="true" />
                  <span className="xcf-gc-hz"><b>{p.name}</b><span className="x-mono">{p.api}</span></span>
                </A>
              </motion.li>
            ))}
          </AnimatePresence>
          {!list.length && (
            <li className="xcf-gc-none">
              <span>{q}</span>
              <button type="button" className="x-btn sm" onClick={() => setQ('')}>Clear</button>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}

function Prompt({ text }) {
  const at = text.indexOf('Start with: ');
  if (at < 0) return text;
  return <>{text.slice(0, at)}<span className="xcf-pr-k">Start with: </span><b>{text.slice(at + 12)}</b></>;
}

export default function CloudProduct({ doc, pairs }) {
  const isLocal = doc.kind === 'local';
  const seed = 'cloud/' + doc.slug;
  const data = isLocal
    ? doc.boot.figures.flatMap((f) => nums(f.value))
    : [doc.window ? doc.window.siblings.length : 0, doc.features.length, ...nums([doc.lede, ...doc.desc, ...doc.features].join(' '))].slice(0, 6);
  const tone = chip(doc.label);
  return (
    <main className="xcf">
      <section className="xcf-hero" aria-labelledby="xcf-h1">
        <Sigil seed={seed} data={data} className="xcf-sigil" />
        <div className="x-wrap xcf-hero-g">
          <div className="xcf-hero-t">
            {!!(doc.crumb && doc.crumb.length) && (
              <motion.nav className="xcf-crumb" aria-label="Breadcrumb" {...up(0)}>
                {doc.crumb.map((c, i) => (
                  <span key={i}>{i > 0 && <i aria-hidden="true">/</i>}{c.href ? <A to={c.href}>{c.label}</A> : <span>{c.label}</span>}</span>
                ))}
              </motion.nav>
            )}
            <motion.p className={'xcf-label ' + tone} {...up(0.05)}><i aria-hidden="true" />{doc.label}</motion.p>
            <motion.h1 id="xcf-h1" className="xcf-h1" data-morph-target {...up(0.1)}>{doc.name}</motion.h1>
            <motion.p className="xcf-lede" {...up(0.18)}>{doc.lede}</motion.p>
            {!isLocal && (
              <>
                <motion.div className="xcf-acts" {...up(0.26)}>
                  {doc.actions.map((a, i) => <A key={a.href} to={a.href} className={'x-btn' + (i ? '' : ' solid')} {...(i ? {} : { 'data-thumb': '' })}>{a.label}</A>)}
                </motion.div>
                {!!doc.badges.length && <motion.ul className="xcf-badges" {...up(0.32)}>{doc.badges.map((b) => <li key={b}><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>{b}</li>)}</motion.ul>}
                {!!doc.meta.length && (
                  <motion.dl className="xcf-meta" {...up(0.38)}>
                    {doc.meta.map((m) => <div key={m.k}><dt>{m.k}</dt><dd className={m.k === 'API' ? 'x-mono' : ''}>{m.v}</dd></div>)}
                  </motion.dl>
                )}
              </>
            )}
          </div>
          {isLocal ? <Boot boot={doc.boot} /> : doc.window && <Console doc={doc} />}
        </div>
      </section>

      {isLocal && (
        <section id={doc.boot.id} className="xcf-boot x-sec" aria-labelledby="xcf-boot-h">
          <div className="x-wrap">
            <p className="xcf-kick x-mono">{doc.boot.eyebrow}</p>
            <h2 id="xcf-boot-h" className="xcf-h2">{doc.boot.title}</h2>
            <p className="xcf-sub">{doc.boot.lede}</p>
            <dl className="xcf-figs">
              {doc.boot.figures.map((f) => (
                <div key={f.value}><dt>{f.label}</dt><dd>{f.value}</dd></div>
              ))}
            </dl>
            <div className="xcf-acts">{doc.boot.actions.map((a, i) => <A key={a.href} to={a.href} className={'x-btn' + (i ? '' : ' solid')} {...(i ? {} : { 'data-thumb': '' })}>{a.label}</A>)}</div>
          </div>
        </section>
      )}

      {doc.ship && (
        <section className="xcf-ship" aria-labelledby="xcf-ship-h">
          <div className="x-wrap xcf-ship-g">
            <div>
              <p id="xcf-ship-h" className="xcf-kick x-mono">{doc.ship.eyebrow}</p>
              <p className="xcf-sub">{doc.ship.lede}</p>
            </div>
            <div className="xcf-card">
              <div className="xcf-card-h">
                <span>{doc.ship.label}</span>
                <span className="x-mono xcf-api">{doc.ship.api.map((t, i) => <span key={i} className={i ? '' : 'xcf-api-k'}>{t}</span>)}<i className="xcf-pulse" aria-hidden="true" /></span>
                <Copy text={doc.ship.prompt} />
              </div>
              <pre className="xcf-pre x-mono"><Prompt text={doc.ship.prompt} /></pre>
            </div>
          </div>
        </section>
      )}

      {!isLocal && (doc.desc.length || doc.features.length || doc.motto) && (
        <section className={'xcf-about' + (doc.desc.length || doc.features.length ? '' : ' only')}>
          <div className="x-wrap">
            {doc.desc.map((p) => <p key={p} className="xcf-desc">{p}</p>)}
            {!!doc.features.length && (
              <ul className="xcf-feats">
                {doc.features.map((f, i) => <li key={f}><Tick delay={i * 0.12} /><span>{f}</span></li>)}
              </ul>
            )}
            {doc.motto && <p className="xcf-motto">{doc.motto}</p>}
          </div>
        </section>
      )}

      <Finder pairs={pairs} here={doc.slug} />

      {doc.related && (
        <section className="xcf-rel" aria-labelledby="xcf-rel-h">
          <div className="x-wrap">
            <div className="xcf-rel-top">
              <p id="xcf-rel-h" className="xcf-kick x-mono">{doc.related.eyebrow}</p>
              {doc.related.more.map((m) => <A key={m.href} to={m.href} className="x-arrow xcf-rel-more"><span>{m.label}</span></A>)}
            </div>
            <ul className="xcf-rel-g">
              {doc.related.items.map((r) => (
                <li key={r.href}>
                  <A to={r.href} className="xcf-rel-c" data-morph>
                    <span className="xcf-rel-n">{r.label}</span>
                    {r.desc && <span className="xcf-rel-d">{r.desc}</span>}
                    <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </A>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
