'use client';
/* Hanzo Cloud products (/cloud/<slug>, 42 pages, one template), v3. Archetype A, Launch: stage hero, chapters, a spec
   sheet, a compare, one action. Pages in the family differ by their own console, their own Sigil (seeded by the slug
   and the product's own figures) and their own words; never by a hue (JAMES 7: greys, silvers, ink and white only).
   Persona: Developer, with the enterprise buyer (PLAN-COMPONENTS 1.1).
   Goal: contact_sales_submit (the product's first action, "Talk to us"; /cloud/local: "Run it locally").
   CTA: the product's own first action: hero (solid, data-thumb), the site's sticky ask bar after the hero, the closing Band.
   One solid per screen.
   Signature: the session runs in the console. The product's console is the hero object on a stage (it starts tipped
   back like a lid and settles flat as you scroll) while the agent prompt from "Paste and ship" types itself into its
   session bar and the example plays: the request walks the project's services, or the conversation with the agent
   arrives turn by turn, or the CLI session prints line by line. Click a service and the walk holds on it; the pause
   control in the window's bar stops the whole session (WCAG 2.2.2).
   Scale rhythm (MASTER 3.1): the product's name is the hero's moment, 112px (84 for longer names) settling to 52px as
   the stage settles; headings rest at 26px; figures 64px; Hanzo's genesis line starts small and light and grows to
   44px Book once you reach it. The finder's black room rises as a rounded card and opens to full width.
   Motion mix (scroll is 2 of 6 kinds): scroll (the stage settles and the name shrinks; the black room opens), time
   (the session types and plays; the prompt's request travels from skill.md to the endpoint; the genesis line grows),
   pointer (the Sigil fields lean to the pointer, related cards drift their field), state (the lit service glides, the
   finder re-flows as you type), arrival (the stage).
   Beyond: Google Cloud to Hanzo, in one lookup. A dark-room finder over every cloud page that names its Google Cloud
   counterpart (18 of them): type the Google Cloud service you use now and its Hanzo product and endpoint come forward,
   each a link. Built only from those pages' own "Google Cloud" and "API" lines.
   Every section holds an object: the console; the prompt's route; the product's Sigil; Hanzo's mark; the spec card;
   the finder; the related cards; the endpoint in the Band. Coverage: docs/coverage/cloud-family.md. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { EASE, Copy, Mark } from '../../ui';
import { A, Band, Cta } from '../../kit';
import Sigil from '../../Sigil';
import StageSettle from '../../v2/StageSettle';
import './cloudfam.css';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const size = (name) => (name.length <= 9 ? 'xl' : name.length <= 14 ? 'l' : 'm'); // 112 · 84 · 64px while they are the moment
const Arrow = ({ s = 14 }) => <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Check = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
/* status told by shape, not colour: Generally available is a filled dot, Beta a half dot, a family name a ring */
const shape = (label) => (/^Generally available$/i.test(label) ? 'ga' : /^Beta$/i.test(label) ? 'beta' : 'fam');

/* the typing: text goes into a text node a character at a time (no React state per character); resolves when done */
function typing(el, text, cps, alive) {
  return new Promise((done) => {
    let i = 0;
    el.textContent = '';
    const step = () => {
      if (!alive()) return done(false);
      el.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(step, 1000 / cps); else done(true);
    };
    setTimeout(step, 1000 / cps);
  });
}

const PauseIcon = ({ on }) => (on
  ? <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
  : <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M5 3.5v9l7.5-4.5z" fill="currentColor" /></svg>);

function Console({ doc }) {
  const w = doc.window;
  const box = useRef(null);
  const typed = useRef(null);
  const seen = useInView(box, { amount: 0.12 }); // starts on the first screen, phones included, within a second
  const calm = useReducedMotion();
  const kind = w.rows.length ? 'rows' : w.turns.length ? 'turns' : 'lines';
  const count = w.rows.length || w.turns.length || w.lines.length;
  const prompt = (doc.ship && doc.ship.prompt) || '';
  const [phase, setPhase] = useState('idle'); // idle → typing → play (→ done for reduced motion or paused)
  const [run, setRun] = useState(true); // the pause control
  const typedOnce = useRef(false);
  const [at, setAt] = useState(kind === 'rows' ? 0 : count); // rows: the lit service; turns/lines: how many are shown
  const hold = useRef(0);
  const live = run && !calm;

  // type the prompt once, then play the example; it only runs while the console is on screen and not paused
  useEffect(() => {
    if (calm || !run) { setPhase('done'); setAt(kind === 'rows' ? 0 : count); if (typed.current) typed.current.textContent = prompt; return; }
    if (typedOnce.current) { setPhase('play'); return; }
    if (!seen) return;
    let alive = true;
    (async () => {
      setPhase('typing');
      if (kind !== 'rows') setAt(0);
      await wait(250);
      if (typed.current && prompt && !(await typing(typed.current, prompt, 44, () => alive))) return;
      if (!alive) return;
      typedOnce.current = true;
      setPhase('play');
    })();
    return () => { alive = false; if (!typedOnce.current && typed.current) typed.current.textContent = prompt; };
  }, [seen, calm, run]); // eslint-disable-line react-hooks/exhaustive-deps

  // the walk: rows light in turn; turns and lines arrive one by one, rest two beats, then the session replays
  useEffect(() => {
    if (!live || !seen || phase !== 'play') return;
    const id = setInterval(() => {
      if (Date.now() < hold.current) return;
      if (kind === 'rows') setAt((a) => (a + 1) % count);
      else setAt((a) => (a >= count + 2 ? 0 : a + 1));
    }, kind === 'rows' ? 1900 : 1400);
    return () => clearInterval(id);
  }, [seen, live, phase, kind, count]);

  const alt = doc.liveLinks[0];
  const title = w.title.map((t, i) => <span key={i} className={i ? 'xcf-wt-b' : ''}>{t}</span>);
  const pick = (i) => { hold.current = Date.now() + 9000; setAt(i); };
  const note = doc.live[0];
  return (
    <figure ref={box} className="xcf-con" data-ask-hide>
      <div className="xcf-win" data-room="dark">
        <div className="xcf-bar">
          <span className="xcf-dots" aria-hidden="true"><i /><i /><i /></span>
          {alt && w.console ? <A to={w.console.href} className="xcf-wt">{title}</A> : <span className="xcf-wt">{title}</span>}
          <button type="button" className="xcf-pause" onClick={() => setRun((r) => !r)} aria-pressed={live} aria-label={live ? 'Pause' : 'Play'}><PauseIcon on={live} /></button>
        </div>
        {prompt && (
          <div className={'xcf-sess' + (phase === 'typing' ? ' typing' : '')}>
            <span className="xcf-sess-g" aria-hidden="true">›</span>
            <p className="xcf-sess-t"><span className="xcf-ghost" aria-hidden="true">{prompt}<i className="xcf-caret" /></span><span className="xcf-typed"><span ref={typed}>{prompt}</span><i className="xcf-caret" aria-hidden="true" /></span></p>
            {note && <p className={'xcf-sess-n' + (phase === 'typing' ? '' : ' on')}>{note}</p>}
          </div>
        )}
        <div className="xcf-wbody">
          <nav className="xcf-sibs" aria-label={doc.crumb[1] ? doc.crumb[1].label : doc.name} data-swipe-own>
            {w.siblings.map((s) => (
              <A key={s.href} to={s.href} className={'xcf-sib' + (s.current ? ' on' : '')} aria-current={s.current ? 'page' : undefined}>
                <span>{s.label}</span><Arrow s={12} />
              </A>
            ))}
          </nav>
          <div className="xcf-main">
            {kind === 'rows' && (
              <ul className="xcf-rows">
                {w.rows.map((r, i) => (
                  <li key={r.name}>
                    <button type="button" className={'xcf-row' + (at === i ? ' on' : '')} aria-pressed={at === i} onClick={() => pick(i)}>
                      {at === i && <motion.span layoutId={'xcf-lit-' + doc.slug} className="xcf-lit" transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} />}
                      <span className="xcf-row-n">{r.name}</span>
                      <span className={'xcf-st ' + (/build/i.test(r.state) ? 'build' : 'ok')}><i aria-hidden="true" />{r.state}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {kind === 'turns' && (
              <ol className="xcf-turns">
                {w.turns.map((t, i) => <li key={i} className={(i % 2 ? 'agent' : 'you') + (at > i ? ' on' : '')}>{t}</li>)}
              </ol>
            )}
            {kind === 'lines' && (
              <ol className="xcf-lines">
                {w.lines.map((l, i) => <li key={i} className={at > i ? 'on' : ''}><b data-g={l.g}>{l.g}</b><span>{l.text}</span></li>)}
              </ol>
            )}
            {w.caption && <p className="xcf-cap">{w.caption}</p>}
          </div>
        </div>
        <div className="xcf-foot">
          <code className="xcf-host">{w.host.map((h, i) => <span key={i} className={i ? 'xcf-path' : ''}>{h}</span>)}<i className="xcf-pulse" aria-hidden="true" /></code>
          {w.console && <A to={alt || w.console.href} className="xcf-open">{w.console.label}<Arrow /></A>}
        </div>
      </div>
      {w.note && <figcaption className="xcf-note">{w.note}</figcaption>}
    </figure>
  );
}

/* /cloud/local: the boot, as a terminal session that replays itself */
function Boot({ boot }) {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const refs = useRef([]);
  const [shown, setShown] = useState(boot.lines.length);
  const [run, setRun] = useState(0);
  const [on, setOn] = useState(true);
  useEffect(() => {
    if (calm || !seen || !on) { setShown(boot.lines.length); return; }
    let live = true;
    (async () => {
      setShown(0);
      await wait(500);
      for (let i = 0; i < boot.lines.length && live; i++) {
        const l = boot.lines[i];
        setShown(i + 1);
        if (l.cmd && refs.current[i] && l.text) await typing(refs.current[i], l.text, 30, () => live);
        await wait(l.cmd ? 260 : 420);
      }
      if (!live) return;
      await wait(5200);
      if (live) setRun((r) => r + 1); // replay while it stays on screen
    })();
    return () => { live = false; boot.lines.forEach((l, i) => { if (refs.current[i]) refs.current[i].textContent = l.text; }); };
  }, [seen, calm, run, on]); // eslint-disable-line react-hooks/exhaustive-deps
  const going = on && !calm;
  return (
    <figure ref={box} className="xcf-con xcf-term">
      <div className="xcf-win" data-room="dark">
        <div className="xcf-bar">
          <span className="xcf-dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="xcf-wt xcf-mono">{boot.cwd}</span>
          <button type="button" className="xcf-pause" onClick={() => setOn((v) => !v)} aria-pressed={going} aria-label={going ? 'Pause' : 'Play'}><PauseIcon on={going} /></button>
        </div>
        <ol className="xcf-tlines">
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
    </figure>
  );
}

/* Beyond: the Google Cloud service you use now, and its Hanzo counterpart */
function Finder({ pairs, here }) {
  const [q, setQ] = useState('');
  const [lit, setLit] = useState(0);
  const [held, setHeld] = useState(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const list = useMemo(() => {
    const k = q.trim().toLowerCase();
    const all = [...pairs].sort((a, b) => (b.slug === here) - (a.slug === here));
    return k ? all.filter((p) => (p.google + ' ' + p.name + ' ' + p.api).toLowerCase().includes(k)) : all;
  }, [q, pairs, here]);
  // idle scan: the rows are read one after another until you type or point at the list
  useEffect(() => {
    if (calm || !seen || q || held) return;
    const id = setInterval(() => setLit((i) => (i + 1) % Math.max(1, list.length)), 1700);
    return () => clearInterval(id);
  }, [calm, seen, q, held, list.length]);
  // the black room (MASTER 3.1): a rounded card inside the gutters that opens past the edges as it is reached (transform only)
  const { scrollYProgress: rp } = useScroll({ target: box, offset: ['start end', 'start start'] });
  const roomS = useTransform(rp, (v) => 0.94 + 0.1 * Math.min(1, Math.max(0, (v - 0.35) / 0.55)));
  if (!pairs.length) return null;
  const head = 'Google Cloud';
  const clear = <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
  return (
    <section ref={box} className="xcf-gc" data-room="dark" data-ask-hide aria-labelledby="xcf-gc-h">
      <motion.span className="xcf-gc-bg" style={calm ? undefined : { scale: roomS }} aria-hidden="true" />
      <div className="xcf-wrap xcf-gc-g">
        <div className="xcf-gc-l">
          <h2 id="xcf-gc-h" className="xcf-gc-h"><span>{head}</span><svg viewBox="0 0 40 16" aria-hidden="true"><path d="M2 8h34M30 3l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg><span>Hanzo</span></h2>
          <label className="xcf-gc-in">
            <span className="x-sr">{head}</span>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M10.4 10.4 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={pairs[0].google} autoComplete="off" spellCheck={false} />
            {q && <button type="button" className="xcf-gc-x" onClick={() => setQ('')} aria-label="Clear">{clear}</button>}
          </label>
          <p className="xcf-gc-n" aria-live="polite"><b>{list.length}</b> / {pairs.length}</p>
        </div>
        <ul className="xcf-gc-list" onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)}>
          <AnimatePresence initial={false}>
            {list.map((p, i) => (
              <motion.li key={p.slug} layout={!calm} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.4, ease: EASE }}>
                <A to={'/cloud/' + p.slug} className={'xcf-gc-row' + (p.slug === here ? ' here' : '') + (!q && !held && i === lit ? ' lit' : '')} aria-current={p.slug === here ? 'page' : undefined}>
                  <span className="xcf-gc-from">{p.google}</span>
                  <i className="xcf-gc-ar" aria-hidden="true" />
                  <span className="xcf-gc-hz"><b>{p.name}</b><span>{p.api}</span></span>
                </A>
              </motion.li>
            ))}
          </AnimatePresence>
          {!list.length && (
            <li className="xcf-gc-none">
              <span>{q}</span>
              <button type="button" className="xcf-gc-x lg" onClick={() => setQ('')} aria-label="Clear">{clear}</button>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}

/* the one variable-weight moment: Hanzo's line starts small and light (Air) and grows to 44px Book, sentence by
   sentence, once, as you reach it (time, not scroll); its object is Hanzo's own mark, in silver */
function Motto({ text }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const parts = text.split(/(?<=\.)\s+/);
  return (
    <section ref={ref} className="xcf-motto" data-seen={seen}>
      <div className="xcf-wrap xcf-motto-g">
        <p className="xcf-motto-t">{parts.map((s, i) => <span key={i} style={{ '--i': i }}>{s}{i < parts.length - 1 ? ' ' : ''}</span>)}</p>
        <span className="xcf-mark" aria-hidden="true"><Mark size={200} /></span>
      </div>
    </section>
  );
}

/* the prompt's route, drawn from its own words: the skill manifest it reads, the agent, the endpoint it calls */
function Route({ ship }) {
  const url = (ship.prompt.match(/https?:\/\/\S+?\.md/) || [''])[0];
  const file = url.split('/').pop();
  return (
    <div className="xcf-route" aria-hidden="true">
      <span className="xcf-node"><i className="xcf-doc" />{file}</span>
      <span className="xcf-wire"><b /></span>
      <span className="xcf-node xcf-node-a"><Mark size={14} />{ship.label}</span>
      <span className="xcf-wire"><b /></span>
      <span className="xcf-node xcf-mono">{ship.api.join(' ')}</span>
    </div>
  );
}

function Prompt({ text }) {
  const at = text.indexOf('Start with: ');
  if (at < 0) return text;
  return <>{text.slice(0, at)}<span className="xcf-pr-k">Start with: </span><b>{text.slice(at + 12)}</b></>;
}

const Acts = ({ list }) => (
  <div className="xcf-acts">
    {list.map((a, i) => (i
      ? <Cta key={a.href} to={a.href} kind="quiet" id={'cloud.hero.' + i}>{a.label}</Cta>
      : <Cta key={a.href} to={a.href} id="cloud.hero" thumb>{a.label}</Cta>))}
  </div>
);

/* JS off: every line of every session shown, the genesis line at full weight (PLAN-COMPONENTS 2.3 and 2.17) */
const NOJS = '.xcf-turns li,.xcf-lines li,.xcf-tlines li{opacity:1!important;transform:none!important}.xcf-motto-t span{font-weight:497!important;opacity:1!important;transform:none!important}.xcf-sess-n{opacity:1!important;transform:none!important}.x-band .x-word,.x-band p,.x-band-act{opacity:1!important;transform:none!important;filter:none!important}[role=tabpanel][hidden]{display:block!important}';

/* the product's name is the hero's moment: it starts large and settles to 52px as the stage settles (scroll) */
function Name({ name }) {
  const calm = useReducedMotion();
  const { scrollY } = useScroll();
  const k = { xl: 52 / 112, l: 52 / 84, m: 52 / 64 }[size(name)];
  const s = useTransform(scrollY, (v) => 1 - (1 - k) * Math.min(1, Math.max(0, v / 560)));
  return <motion.h1 id="xcf-h1" className={'xcf-display s-' + size(name)} style={calm ? undefined : { scale: s }}>{name}</motion.h1>;
}

export default function CloudProduct({ doc, pairs, group, sigil, cards = {} }) {
  const isLocal = doc.kind === 'local';
  const kind = isLocal ? 'term' : doc.window ? (doc.window.rows.length ? 'rows' : doc.window.turns.length ? 'turns' : 'lines') : 'none';
  const sibs = doc.window ? doc.window.siblings : [];
  const source = !isLocal && doc.actions.find((a) => /github\.com/.test(a.href));
  const ask = isLocal ? doc.boot.actions[doc.boot.actions.length - 1] : doc.actions[0];
  const rest = isLocal ? doc.boot.actions.filter((a) => a !== ask) : doc.actions.slice(1);
  return (
    <main className={'xcf k-' + kind} data-ask-name={doc.name}>
      <noscript><style>{NOJS}</style></noscript>
      <section className="xcf-hero" aria-labelledby="xcf-h1">
        <div className="xcf-band" data-morph-target>
          <Sigil seed={sigil.seed} data={sigil.data} className="xcf-sigil" />
          <div className="xcf-wrap xcf-head">
            <Name name={doc.name} />
            <div className="xcf-head-r">
              {doc.lede && <p className="xcf-lede">{doc.lede}</p>}
              <Acts list={isLocal ? [ask, ...rest] : doc.actions} />
              <div className="xcf-meta">
                {!!(doc.crumb && doc.crumb.length) && (
                  <nav className="xcf-crumb" aria-label="Breadcrumb">
                    {doc.crumb.map((c, i) => <span key={i}>{i > 0 && <i aria-hidden="true">/</i>}{c.href ? <A to={c.href} className="x-link">{c.label}</A> : <span>{c.label}</span>}</span>)}
                  </nav>
                )}
                <p className={'xcf-label ' + shape(doc.label)}><i aria-hidden="true" />{doc.label}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="xcf-wrap xcf-stage-w">
          <StageSettle className="xcf-stage" over={620} from={{ rotateX: 24, scale: 1.04, y: 0 }}>
            {isLocal ? <Boot boot={doc.boot} /> : doc.window && <Console doc={doc} />}
          </StageSettle>
        </div>
      </section>

      {isLocal && (
        <section id={doc.boot.id} className="xcf-sec xcf-boot" aria-labelledby="xcf-boot-h">
          <div className="xcf-wrap">
            <div className="xcf-boot-head">
              <div>
                <h2 id="xcf-boot-h" className="xcf-h2">{doc.boot.title}</h2>
                <p className="xcf-tag">{doc.boot.eyebrow}</p>
              </div>
              <p className="xcf-body">{doc.boot.lede}</p>
            </div>
            <dl className="xcf-figs">
              {doc.boot.figures.map((f) => <div key={f.value}><dd>{f.value}</dd><dt>{f.label}</dt></div>)}
            </dl>
          </div>
        </section>
      )}

      {doc.ship && (
        <section className="xcf-sec xcf-ship" aria-labelledby="xcf-ship-h">
          <div className="xcf-wrap xcf-ship-g">
            <div className="xcf-ship-l">
              <h2 id="xcf-ship-h" className="xcf-h2">{doc.ship.eyebrow}</h2>
              <p className="xcf-body">{doc.ship.lede}</p>
              <p className="xcf-api"><span className="xcf-api-l">{doc.ship.label}</span><span className="xcf-mono">{doc.ship.api.map((t, i) => <span key={i} className={i ? '' : 'xcf-api-k'}>{t}</span>)}</span></p>
              <Copy text={doc.ship.prompt} className="xcf-copy" />
            </div>
            <div className="xcf-ship-r">
              <pre className="xcf-prompt"><Prompt text={doc.ship.prompt} /></pre>
              <Route ship={doc.ship} />
            </div>
          </div>
        </section>
      )}

      {!isLocal && (doc.desc.length > 0 || doc.features.length > 0) && (
        <section className="xcf-sec xcf-about">
          <div className="xcf-wrap xcf-about-g">
            <div>
              {doc.desc.map((p) => <p key={p} className="xcf-desc">{p}</p>)}
              {!!doc.features.length && (
                <ol className="xcf-feats">
                  {doc.features.map((f, i) => <li key={f}><span className="xcf-n">{String(i + 1).padStart(2, '0')}</span><b>{f}</b></li>)}
                </ol>
              )}
            </div>
            <div className="xcf-about-art" aria-hidden="true"><Sigil seed={sigil.seed + '/about'} data={sigil.data} className="xcf-about-sig" /></div>
          </div>
        </section>
      )}

      {!isLocal && doc.motto && <Motto text={doc.motto} />}

      {!isLocal && (
        <section className="xcf-sec xcf-specs" aria-labelledby="xcf-sp-h">
          <div className="xcf-wrap xcf-specs-g">
            <div className="xcf-specs-l">
              <h2 id="xcf-sp-h" className="xcf-h2">{doc.name}</h2>
              <p className="xcf-tag">{group}</p>
              <div className="xcf-chip" aria-hidden="true">
                <Sigil seed={sigil.seed} data={sigil.data} still className="xcf-chip-sig" />
                <span className="xcf-chip-m"><Mark size={16} /></span>
                {doc.window && <span className="xcf-chip-p">{doc.window.host.join('')}</span>}
              </div>
              {source && <A to={source.href} className="xcf-go"><span>{source.label}</span><Arrow /></A>}
            </div>
            <div className="xcf-specs-r">
              <dl className="xcf-dl">
                {doc.meta.map((m) => <div key={m.k}><dt>{m.k}</dt><dd className={m.k === 'API' ? 'xcf-mono' : ''}>{m.v}</dd></div>)}
                {sibs.length > 1 && doc.crumb[1] && (
                  <div><dt>{doc.crumb[1].label}</dt><dd><ul className="xcf-fam">{sibs.map((s) => <li key={s.href}><A to={s.href} className={s.current ? 'on' : ''} aria-current={s.current ? 'page' : undefined}>{s.label}</A></li>)}</ul></dd></div>
                )}
              </dl>
              {!!doc.badges.length && <ul className="xcf-badges">{doc.badges.map((b) => <li key={b}><Check />{b}</li>)}</ul>}
            </div>
          </div>
        </section>
      )}

      <Finder pairs={pairs} here={doc.slug} />

      {doc.related && (
        <section className="xcf-sec xcf-rel" aria-labelledby="xcf-rel-h">
          <div className="xcf-wrap">
            <div className="xcf-rel-top">
              <h2 id="xcf-rel-h" className="xcf-h2">{doc.related.eyebrow}</h2>
              {doc.related.more.map((m) => <A key={m.href} to={m.href} className="xcf-go"><span>{m.label}</span></A>)}
            </div>
            <ul className="xcf-cards">
              {doc.related.items.map((r, i) => {
                const sg = cards[r.href] || { seed: r.href, data: [] };
                return (
                  <li key={r.href} className={'c' + i}>
                    <A to={r.href} className="xcf-card">
                      <span className="xcf-card-art" data-morph><Sigil seed={sg.seed} data={sg.data} still className="xcf-card-sig" /></span>
                      <span className="xcf-card-n">{r.label}</span>
                      {r.desc && <span className="xcf-card-d">{r.desc}</span>}
                      <span className="xcf-card-go" aria-hidden="true"><Arrow s={18} /></span>
                    </A>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      <Band
        title={doc.name}
        lede={doc.lede || undefined}
        action={ask.label}
        to={ask.href}
        note={(
          <span className="xcf-band-n">
            {doc.window && <code className="xcf-band-host">{doc.window.host.map((h, i) => <span key={i} className={i ? 'xcf-path' : ''}>{h}</span>)}<i className="xcf-pulse" aria-hidden="true" /></code>}
            {rest.map((a) => <A key={a.href} to={a.href} className="x-link">{a.label}</A>)}
          </span>
        )}
      />
    </main>
  );
}
