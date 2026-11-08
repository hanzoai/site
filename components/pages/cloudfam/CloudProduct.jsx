'use client';
/* Hanzo Cloud products (/cloud/<slug>, 42 pages, one template). Launch (MASTER 4.1) with the cloud anatomy of part 15:
   identity, console, a 3-fact strip from existing text, openable features, Band.
   Persona: Developer, with the enterprise buyer.
   Goal: contact_sales_submit (the product's first action, "Talk to us"; /cloud/local: "Run it locally").
   CTA: the product's own first action: hero (solid, data-cta "cloud.<slug>.hero", data-thumb), the site's sticky ask
   after the hero, the closing Band. One solid per screen; the console link and Copy are outlines.
   Signature: the product's own console. It is built only from the page's own data: its status chip, its place in its
   family as the one figure (01 / 08 Compute), its endpoint, its features (or its Start with command), its Google Cloud
   pair. The agent prompt types itself in the session bar while the body plays once (6 to 10 s) and settles. Pointing at
   a sibling in its sidebar shows that product's own endpoint and lede.
   Motion signature (docs/MOTION-MAP.md, `rows-open`): the family as a tight list whose rows open in place on hover or
   tap into that member's full detail panel (RowsOpen.jsx); this product's own row opens first, onto its console view
   (its features lit in turn, or its Start with command). No pinned scene: every section after the hero is a plain,
   quick section that arrives its own way (entrances.jsx: swing-door, opposite-drift, letter-cascade, iris,
   squash-land, in that order), and the order differs by group: stage and wide open with the rows, path with the
   endpoint (the Paste and ship prompt and its route), field with the genesis line.
   The shared example project Hanzo prints on most product pages (gateway, payments-api, ...) is not the hero: it sits
   behind its own note ("Example project. ...") and opens on demand, so every page leads with its own product.
   Each family group has its own first screen (MASTER 3.2 rule 7): stage (the console on a lid that settles flat:
   Compute, Infrastructure, Local), wide (the console edge to edge with a tab strip, its session in large type: AI, Apps,
   Observe, Dev), path (the product's own endpoint as the giant object, cut in letter by line, a terminal under it:
   Science, Web3, Data), field (the product's own Sigil as a tall stage the console rises out of: Security, Network).
   Scale rhythm: the name rests at 52 to 64px (64 settling to 52 on scroll); the console is the one big thing; the
   figure 64px; headings 26px; the close says the name at 52px. Never a hue: greys, ink and white only.
   Motion mix: time (typing, the session playing, the feature cycle), pointer (sidebar previews, rows that open, related
   rows), state (the lit row glides by layoutId), scroll (the stage settles, the name settles, opposite-drift),
   arrival (the name's line mask, the five entrances). Coverage: docs/coverage/cloud.md. */
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Copy, Mark } from '../../ui';
import { A, Band, Cta } from '../../kit';
import Sigil from '../../Sigil';
import StageSettle from '../../v2/StageSettle';
import useCalm from '../../v2/useCalm';
import RowsOpen, { useMounted } from './RowsOpen';
import { ENTRANCES, Enter, Letters } from './entrances';
import './cloudfam.css';
import './entrances.css';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const Arrow = ({ s = 14 }) => <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Check = () => <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const VARIANT = { Compute: 'stage', Infrastructure: 'stage', AI: 'wide', Apps: 'wide', Observe: 'wide', Dev: 'wide', Science: 'path', Web3: 'path', Data: 'path', Security: 'field', Network: 'field', Local: 'stage' };
const POSE = { stage: { rotateX: 12, scale: 1.04, y: 0 }, wide: { rotateX: 0, scale: 0.9, y: 0 }, path: { rotateX: 0, scale: 0.96, y: 0 }, field: { rotateX: 8, scale: 0.94, y: 0 } };

/* status told by shape, not colour: Generally available is a filled dot, Beta a half dot, a family name a ring */
const shape = (label) => (/^Generally available$/i.test(label) ? 'ga' : /^Beta$/i.test(label) ? 'beta' : 'fam');
const Chip = ({ label, className = '' }) => <span className={'xcf-chip ' + shape(label) + ' ' + className}><i aria-hidden="true" /><span>{label}</span></span>;

/* the product's place in its family, from its own console sidebar: the one figure every member has (01 / 08 Compute) */
function figureOf(doc) {
  const s = doc.window ? doc.window.siblings : [];
  const i = s.findIndex((x) => x.current);
  if (s.length < 2 || i < 0) return null;
  return { n: String(i + 1).padStart(2, '0'), of: String(s.length).padStart(2, '0'), label: (doc.crumb[1] && doc.crumb[1].label) || doc.label };
}
/* the command the product's own prompt starts with, else its own endpoint call */
const cmdOf = (doc) => (doc.ship ? (doc.ship.prompt.split('Start with: ')[1] || doc.ship.api.join(' ')) : '');

/* the typing: the whole prompt is always in flow (faint), and each character moves from the faint part into the
   white part, so the lines wrap the same from first paint to last character (no React state per character) */
function typing(el, rest, text, cps, alive) {
  return new Promise((done) => {
    let i = 0;
    el.textContent = '';
    if (rest) rest.textContent = text;
    const step = () => {
      if (!alive()) return done(false);
      el.textContent = text.slice(0, ++i);
      if (rest) rest.textContent = text.slice(i);
      if (i < text.length) setTimeout(step, 1000 / cps); else done(true);
    };
    setTimeout(step, 1000 / cps);
  });
}

const PauseIcon = ({ on }) => (on
  ? <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
  : <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M5 3.5v9l7.5-4.5z" fill="currentColor" /></svg>);

const Fig = ({ fig, sibs, peek, label }) => (
  <div className="xcf-fig">
    <Chip label={label} />
    <p className="xcf-fig-n"><b>{fig.n}</b><span>/ {fig.of}</span></p>
    <p className="xcf-fig-l">{fig.label}</p>
    <span className="xcf-ticks" aria-hidden="true">{sibs.map((s) => <i key={s.href} className={s.current ? 'on' : peek === s.href ? 'pk' : ''} />)}</span>
  </div>
);

/* a neighbour's own words, shown while you point at it */
const Peek = ({ s, p }) => (
  <div className="xcf-peek" aria-hidden="true">
    {p && p.label && <Chip label={p.label} />}
    <p className="xcf-peek-n">{p ? p.name : s.label}</p>
    {p && p.lede && <p className="xcf-peek-d">{p.lede}</p>}
    <p className="xcf-peek-p"><span>{p && p.api ? 'api.hanzo.ai' : 'hanzo.ai'}</span><b>{p && p.api ? p.api : s.href}</b></p>
  </div>
);

function Console({ doc, v, fig, previews, sigil }) {
  const w = doc.window;
  const box = useRef(null);
  const typed = useRef(null);
  const ghost = useRef(null);
  const seen = useInView(box, { amount: 0.12 }); // starts on the first screen, phones included, within a second
  const calm = useCalm();
  const prompt = (doc.ship && doc.ship.prompt) || '';
  const cmd = cmdOf(doc);
  const google = (doc.meta.find((m) => m.k === 'Google Cloud') || {}).v;
  // the shared example project (services, or the CLI deploying it) is never the hero: it opens from its own note
  const hasEx = !!(w.rows.length || w.lines.length);
  const body = w.turns.length ? 'turns' : doc.features.length && v !== 'path' ? 'feats' : 'bare';
  const n = body === 'turns' ? w.turns.length : body === 'lines' ? w.lines.length : body === 'feats' ? doc.features.length : google ? 3 : 2;
  // the session, played once: turns and lines arrive, lines are then searched one by one, features and the terminal light in turn
  const tl = useMemo(() => {
    const r = (k) => Array.from({ length: k }, (_, i) => i);
    if (body === 'turns') return r(n).map((i) => ({ shown: i + 1, lit: -1 }));
    if (body === 'lines') return [...r(n).map((i) => ({ shown: i + 1, lit: -1 })), ...r(n).map((i) => ({ shown: n, lit: i })), { shown: n, lit: -1 }];
    if (body === 'feats') return [...r(n).map((i) => ({ shown: n, lit: i })), { shown: n, lit: 0 }];
    return [...r(n).map((i) => ({ shown: n, lit: i })), { shown: n, lit: 0 }];
  }, [body, n]);
  const [step, setStep] = useState(tl.length - 1); // first paint: the settled session, every line there (no black void)
  const [run, setRun] = useState(true); // the pause control
  const [peek, setPeek] = useState(null);
  const [ex, setEx] = useState(false); // the example project, open on demand
  const [lit, setLit] = useState(0); // the example project's picked service
  const played = useRef(false);
  const gen = useRef(0); // the running session's id: pausing or leaving the page ends it; scrolling away does not
  const live = run && !calm;
  useEffect(() => () => { gen.current++; }, []);

  useEffect(() => {
    if (!live) { gen.current++; setStep(tl.length - 1); if (typed.current) typed.current.textContent = prompt; if (ghost.current) ghost.current.textContent = ''; return; }
    if (!seen || played.current) return;
    played.current = true;
    const my = ++gen.current;
    const alive = () => gen.current === my;
    setStep(0);
    if (typed.current && ghost.current && prompt) typing(typed.current, ghost.current, prompt, 44, alive);
    (async () => {
      const beat = body === 'turns' ? 1700 : body === 'lines' ? 900 : 1500;
      for (let k = 1; k < tl.length && alive(); k++) { await wait(beat); if (alive()) setStep(k); }
    })();
  }, [seen, live]); // eslint-disable-line react-hooks/exhaustive-deps

  const st = tl[Math.min(step, tl.length - 1)];
  const alt = doc.liveLinks[0];
  const title = w.title.map((t, i) => <span key={i} className={i ? 'xcf-wt-b' : ''}>{t}</span>);
  const ps = peek && w.siblings.find((s) => s.href === peek);
  const exId = 'xcf-ex-' + doc.slug;
  return (
    <figure ref={box} className={'xcf-con b-' + body}>
      <div className="xcf-win" data-room="dark">
        <div className="xcf-bar">
          <span className="xcf-dots" aria-hidden="true"><i /><i /><i /></span>
          {alt && w.console ? <A to={w.console.href} className="xcf-wt">{title}</A> : <span className="xcf-wt">{title}</span>}
          <button type="button" className="xcf-pause" onClick={() => setRun((r) => !r)} aria-pressed={live} aria-label={live ? 'Pause' : 'Play'}><PauseIcon on={live} /></button>
        </div>
        {prompt && (
          <div className="xcf-sess">
            <span className="xcf-sess-g" aria-hidden="true">›</span>
            <p className="xcf-sess-t"><span ref={typed} className="xcf-typed">{prompt}</span>{live && <i className="xcf-caret" aria-hidden="true" />}<span ref={ghost} className="xcf-ghost" /></p>
            {/* hanzo.ai draws this note under the running session in the browser (our server snapshots caught it on only some members) */}
            <p className="xcf-sess-n">{doc.live[0] || 'The service the session above is changing.'}</p>
          </div>
        )}
        <div className="xcf-wbody">
          <nav className="xcf-sibs" aria-label={doc.crumb[1] ? doc.crumb[1].label : doc.name} data-swipe-own onPointerLeave={() => setPeek(null)}>
            {w.siblings.map((s) => (
              <A key={s.href} to={s.href} className={'xcf-sib' + (s.current ? ' on' : '') + (peek === s.href ? ' pk' : '')} aria-current={s.current ? 'page' : undefined}
                onPointerEnter={() => setPeek(s.current ? null : s.href)} onFocus={() => setPeek(s.current ? null : s.href)} onBlur={() => setPeek(null)}>
                <span>{s.label}</span><Arrow s={12} />
              </A>
            ))}
          </nav>
          <div className="xcf-main">
            {body === 'bare' && <Sigil seed={sigil.seed + '/console'} data={sigil.data} className="xcf-con-sig" />}
            {fig && v !== 'path' && <Fig fig={fig} sibs={w.siblings} peek={peek} label={doc.label} />}
            <div className="xcf-out" hidden={ex || undefined}>
              {body === 'feats' && (
                <ol className="xcf-feat-rows">
                  {doc.features.map((f, i) => (
                    <li key={f} className={st.lit === i ? 'on' : ''}>
                      {st.lit === i && <motion.span layoutId={'xcf-lit-' + doc.slug} className="xcf-lit" transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} />}
                      <span className="xcf-n">{String(i + 1).padStart(2, '0')}</span><span className="xcf-fr-t">{f}</span><i className="xcf-dot" aria-hidden="true" />
                    </li>
                  ))}
                </ol>
              )}
              {body === 'bare' && (
                <ol className="xcf-term1">
                  <li className={st.lit === 0 ? 'on' : ''}><b aria-hidden="true">$</b><span className="xcf-cmd">{cmd}</span></li>
                  <li className={st.lit === 1 ? 'on' : ''}><b aria-hidden="true">→</b><span>{w.host[0]}<span className="xcf-path">{w.host[1]}</span></span><i className="xcf-pulse" aria-hidden="true" /></li>
                  {google && <li className={st.lit === 2 ? 'on' : ''}><b aria-hidden="true">≈</b><span>{google}</span></li>}
                </ol>
              )}
              {body === 'turns' && (
                <ol className="xcf-turns">
                  {w.turns.map((t, i) => <li key={i} className={(i % 2 ? 'agent' : 'you') + (st.shown > i ? ' on' : '')}>{t}</li>)}
                </ol>
              )}
            </div>
            {hasEx && (
              <div className="xcf-ex" id={exId} hidden={!ex || undefined}>
                {!!w.lines.length && (
                  <ol className="xcf-lines">
                    {w.lines.map((l, i) => <li key={i} className="on"><span className="xcf-ln">{String(i + 1).padStart(2, '0')}</span><b data-g={l.g}>{l.g}</b><span>{l.text}</span></li>)}
                  </ol>
                )}
                {!!w.rows.length && <ul className="xcf-rows">
                  {w.rows.map((r, i) => (
                    <li key={r.name}>
                      <button type="button" className={'xcf-row' + (lit === i ? ' on' : '')} aria-pressed={lit === i} onClick={() => setLit((l) => (l === i ? -1 : i))}>
                        <span className="xcf-row-n">{r.name}</span>
                        <span className={'xcf-st ' + (/build/i.test(r.state) ? 'build' : 'ok')}><i aria-hidden="true" /><span>{r.state}</span></span>
                      </button>
                    </li>
                  ))}
                </ul>}
                {/* the picked service's own note (hanzo.ai's), else the window's caption */}
                <div className="xcf-caps" aria-live="polite">
                  {w.caption && <p className="xcf-cap" hidden={!!w.rows[lit]?.note || undefined}>{w.caption}</p>}
                  {w.rows.filter((r) => r.note).map((r) => <p key={r.name} className="xcf-cap" hidden={w.rows[lit]?.name !== r.name || undefined}>{r.note}</p>)}
                </div>
              </div>
            )}
            <AnimatePresence>
              {ps && (
                <motion.div key={ps.href} className="xcf-peek-w" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                  <Peek s={ps} p={previews[ps.href]} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="xcf-foot">
          <code className="xcf-host">{w.host.map((h, i) => <span key={i} className={i ? 'xcf-path' : ''}>{h}</span>)}<i className="xcf-pulse" aria-hidden="true" /></code>
          {w.console && <A to={alt || w.console.href} className="xcf-open">{w.console.label}<Arrow /></A>}
        </div>
      </div>
      {w.note && (hasEx
        ? <button type="button" className={'xcf-note' + (ex ? ' on' : '')} aria-expanded={ex} aria-controls={exId} onClick={() => setEx((e) => !e)}><span>{w.note}</span><i aria-hidden="true" /></button>
        : <figcaption className="xcf-note">{w.note}</figcaption>)}
    </figure>
  );
}

/* /cloud/local: the boot, as a terminal session that plays once on screen and settles */
function Boot({ boot }) {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useCalm();
  const refs = useRef([]);
  const [shown, setShown] = useState(boot.lines.length);
  const [on, setOn] = useState(true);
  const played = useRef(false);
  const gen = useRef(0); // the running boot's id: pausing or leaving ends it; scrolling away does not
  const settle = () => { setShown(boot.lines.length); boot.lines.forEach((l, i) => { if (refs.current[i]) refs.current[i].textContent = l.text; }); };
  useEffect(() => () => { gen.current++; }, []);
  useEffect(() => {
    if (calm || !on) { gen.current++; settle(); return; }
    if (!seen || played.current) return;
    played.current = true;
    const my = ++gen.current;
    const live = () => gen.current === my;
    (async () => {
      for (let i = 0; i < boot.lines.length && live(); i++) {
        const l = boot.lines[i];
        setShown(i + 1);
        if (l.cmd && refs.current[i] && l.text) await typing(refs.current[i], null, l.text, 30, live);
        await wait(l.cmd ? 260 : 420);
      }
    })();
  }, [seen, calm, on]); // eslint-disable-line react-hooks/exhaustive-deps
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
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}

/* Beyond: the Google Cloud service you use now, and its Hanzo counterpart */
function Finder({ pairs, here, e }) {
  const [q, setQ] = useState('');
  const [lit, setLit] = useState(0);
  const [held, setHeld] = useState(false);
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  const calm = useReducedMotion();
  const still = useCalm();
  const list = useMemo(() => {
    const k = q.trim().toLowerCase();
    const all = [...pairs].sort((a, b) => (b.slug === here) - (a.slug === here));
    return k ? all.filter((p) => (p.google + ' ' + p.name + ' ' + p.api).toLowerCase().includes(k)) : all;
  }, [q, pairs, here]);
  const SHOWN = 6; // with no query: this page's pair and five more; every row stays in the HTML, the rest hidden
  useEffect(() => {
    if (calm || !seen || q || held) return;
    // the light walks the pairs while the room is in view, rests a breath on the last, then starts again from the top
    const end = lit >= Math.min(SHOWN, list.length) - 1;
    const id = setTimeout(() => setLit((i) => (end ? 0 : i + 1)), end ? 2400 : 1100);
    return () => clearTimeout(id);
  }, [calm, seen, q, held, list.length, lit]);
  if (!pairs.length) return null;
  const head = 'Google Cloud';
  const lc = e === 'letter-cascade';
  const clear = <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
  // the black room (MASTER 3.1): a rounded card inside the gutters; it arrives by the page's entrance, not by scroll
  return (
    <Enter kind={e} className="xcf-gc" data-room="dark" aria-labelledby="xcf-gc-h">
      <span className="xcf-gc-bg" aria-hidden="true" />
      <div ref={box} className="xcf-wrap xcf-gc-g">
        <div className="xcf-gc-l" data-half="l">
          <h2 id="xcf-gc-h" className="xcf-gc-h"><span><Letters text={head} on={lc} /></span><svg viewBox="0 0 40 16" aria-hidden="true"><path d="M2 8h34M30 3l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg><span><Letters text="Hanzo" on={lc} /></span></h2>
          <label className="xcf-gc-in">
            <span className="x-sr">{head}</span>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M10.4 10.4 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={pairs[0].google} autoComplete="off" spellCheck={false} />
            {q && <button type="button" className="xcf-gc-x" onClick={() => setQ('')} aria-label="Clear">{clear}</button>}
          </label>
          <p className="xcf-gc-n" aria-live="polite"><b>{list.length}</b> / {pairs.length}</p>
        </div>
        <ul className="xcf-gc-list" data-half="r" onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)}>
          <AnimatePresence initial={false}>
            {list.map((p, i) => (
              <motion.li key={p.slug} layout={!still} hidden={!q && i >= SHOWN} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}>
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
    </Enter>
  );
}

/* Hanzo's genesis line, a quiet strip: its two sentences move from Air to Book weight once */
function Motto({ text, e }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const parts = text.split(/(?<=\.)\s+/);
  return (
    <Enter kind={e} className={'xcf-motto' + (seen ? ' seen' : '')}>
      <div ref={ref} className="xcf-wrap xcf-motto-g">
        <span className="xcf-mark" aria-hidden="true" data-half="l"><Mark size={28} /></span>
        <p className="xcf-motto-t" data-half="r">{parts.map((s, i) => <span key={i} style={{ '--i': i }}><Letters text={s} on={e === 'letter-cascade'} />{i < parts.length - 1 ? ' ' : ''}</span>)}</p>
      </div>
    </Enter>
  );
}

function Prompt({ text }) {
  const at = text.indexOf('Start with: ');
  if (at < 0) return text;
  return <>{text.slice(0, at)}<span className="xcf-pr-k">Start with: </span><b>{text.slice(at + 12)}</b></>;
}

/* the prompt's route, drawn from its own words (the skill manifest it reads, the agent, the endpoint) */
const Route = ({ ship }) => {
  const url = (ship.prompt.match(/https?:\/\/\S+?\.md/) || [''])[0];
  return (
    <div className="xcf-route">
      <span className="xcf-node"><i className="xcf-doc" />{url.split('/').pop()}</span>
      <span className="xcf-wire"><b /></span>
      <span className="xcf-node xcf-node-a"><Mark size={14} />{ship.label}</span>
      <span className="xcf-wire"><b /></span>
      <span className="xcf-node xcf-mono">{ship.api.join(' ')}</span>
    </div>
  );
};
/* the endpoint: the Paste and ship prompt on the left, its route as the object on the right */
function Ship({ doc, e }) {
  const s = doc.ship;
  return (
    <Enter kind={e} className="xcf-sec xcf-ship" aria-labelledby="xcf-ship-h">
      <div className="xcf-wrap xcf-ship-g">
        <div className="xcf-ship-l" data-half="l">
          <h2 id="xcf-ship-h" className="xcf-h2"><Letters text={s.eyebrow} on={e === 'letter-cascade'} /></h2>
          <p className="xcf-body">{s.lede}</p>
          <pre className="xcf-prompt"><Prompt text={s.prompt} /></pre>
          <div className="xcf-ship-a">
            <p className="xcf-api"><span className="xcf-api-l">{s.label}</span><span className="xcf-mono">{s.api.map((t, k) => <span key={k} className={k ? '' : 'xcf-api-k'}>{t}</span>)}</span></p>
            <Copy text={s.prompt} className="xcf-copy" />
          </div>
        </div>
        <div className="xcf-ship-r" data-half="r" aria-hidden="true">
          <div className="xcf-win xcf-ship-win" data-room="dark"><Route ship={s} /></div>
        </div>
      </div>
    </Enter>
  );
}

/* the signature's section: the family's name and this product's own words on the left, the rows that open on the right */
function Family({ doc, previews, e }) {
  const sibs = doc.window ? doc.window.siblings : [];
  if (sibs.length < 2) return null;
  const fam = doc.crumb[1] ? doc.crumb[1].label : doc.label;
  const source = doc.actions.find((a) => /github\.com/.test(a.href));
  const api = (doc.meta.find((m) => m.k === 'API') || {}).v || '';
  const google = (doc.meta.find((m) => m.k === 'Google Cloud') || {}).v || '';
  const own = {
    preview: { name: doc.name, label: doc.label, lede: doc.lede, api, google },
    features: doc.features, cmd: cmdOf(doc), console: doc.window.console && { label: doc.window.console.label, href: doc.liveLinks[0] || doc.window.console.href },
  };
  return (
    <Enter kind={e} className="xcf-sec xcf-famsec" aria-labelledby="xcf-fam-h">
      <div className="xcf-wrap xcf-fam-g">
        <div className="xcf-fam-l" data-half="l">
          <h2 id="xcf-fam-h" className="xcf-h2 xcf-fam-h"><Letters text={fam} on={e === 'letter-cascade'} /></h2>
          {doc.desc.map((p) => <p key={p} className="xcf-desc">{p}</p>)}
          {source && <A to={source.href} className="xcf-go"><span>{source.label}</span><Arrow /></A>}
        </div>
        <div className="xcf-fam-r" data-half="r">
          <RowsOpen doc={doc} previews={previews} own={own} />
        </div>
      </div>
    </Enter>
  );
}

/* the hero's three facts, every one Hanzo's own line: the endpoint, the Google Cloud pair (else the Start with
   command), and the two badges */
function Facts({ doc }) {
  const api = doc.meta.find((m) => m.k === 'API');
  const g = doc.meta.find((m) => m.k === 'Google Cloud');
  const cmd = cmdOf(doc);
  return (
    <dl className="xcf-facts">
      {api && <div><dt>{api.k}</dt><dd className="xcf-mono">{api.v}</dd></div>}
      {g ? <div><dt>{g.k}</dt><dd>{g.v}</dd></div> : doc.ship && cmd && <div><dt>{doc.ship.label}</dt><dd className="xcf-mono">{cmd}</dd></div>}
      {!!doc.badges.length && <div><dt className="x-sr">{doc.name}</dt><dd><ul className="xcf-badges">{doc.badges.map((b) => <li key={b}><Check />{b}</li>)}</ul></dd></div>}
    </dl>
  );
}

const Acts = ({ list, slug }) => (
  <div className="xcf-acts">
    {list.map((a, i) => (i
      ? <Cta key={a.href} to={a.href} kind="quiet" id={'cloud.' + slug + '.hero-' + i}>{a.label}</Cta>
      : <Cta key={a.href} to={a.href} id={'cloud.' + slug + '.hero'} thumb>{a.label}</Cta>))}
  </div>
);

/* JS off: every line of every session shown, every row open, the genesis line at full weight (PLAN-COMPONENTS 2.3 and 2.17) */
const NOJS = '.xcf-turns li,.xcf-lines li,.xcf-tlines li{opacity:1!important;transform:none!important}.xcf-motto-t span{font-weight:497!important}.xcf-mask>span{animation:none!important}.xro-p{grid-template-rows:1fr!important}.xro-pi{opacity:1!important;transform:none!important}.x-band .x-word,.x-band p,.x-band-act{opacity:1!important;transform:none!important;filter:none!important}';

/* the name rests at 52 to 64px (MASTER 3.1): a short name arrives at 64 and settles to 52 as the stage settles */
function Name({ name, small }) {
  const calm = useCalm();
  const { scrollY } = useScroll();
  const big = !small && name.length <= 12;
  const s = useTransform(scrollY, (v) => 1 - (1 - 52 / 64) * Math.min(1, Math.max(0, v / 480)));
  return <motion.h1 id="xcf-h1" className={'xcf-display' + (big ? ' s-l' : '')} style={calm || !big ? undefined : { scale: s }}><span className="xcf-mask"><span>{name}</span></span></motion.h1>;
}

/* related: a rail of rows; pointing at one previews that product (its endpoint, status, lede) without moving the rows */
function Related({ rel, cards, previews, e }) {
  const [at, setAt] = useState(0);
  const it = rel.items[at];
  const p = previews[it.href];
  const sg = cards[it.href] || { seed: it.href, data: [] };
  return (
    <Enter kind={e} className="xcf-sec xcf-rel" aria-labelledby="xcf-rel-h">
      <div className="xcf-wrap xcf-rel-g">
        <div className="xcf-rel-l" data-half="l">
          <div className="xcf-rel-top">
            <h2 id="xcf-rel-h" className="xcf-h2"><Letters text={rel.eyebrow} on={e === 'letter-cascade'} /></h2>
            {rel.more.map((m) => <A key={m.href} to={m.href} className="xcf-go"><span>{m.label}</span></A>)}
          </div>
          <ol className="xcf-rr">
            {rel.items.map((r, i) => (
              <li key={r.href}>
                <A to={r.href} className={'xcf-rr-a' + (at === i ? ' on' : '')} onPointerEnter={() => setAt(i)} onFocus={() => setAt(i)}>
                  <span className="xcf-n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="xcf-rr-n" data-morph>{r.label}</span>
                  <span className="xcf-rr-d">{r.desc}</span>
                  <span className="xcf-rr-go" aria-hidden="true"><Arrow s={16} /></span>
                </A>
              </li>
            ))}
          </ol>
        </div>
        <div className="xcf-rel-r" data-half="r" aria-hidden="true">
          <div className="xcf-rp">
            <Sigil seed={sg.seed} data={sg.data} className="xcf-rp-sig" />
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={it.href} className="xcf-rp-t" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }} transition={{ duration: 0.35, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
                {p && p.label && <Chip label={p.label} />}
                <p className="xcf-rp-n">{it.label}</p>
                {(p && p.lede) || it.desc ? <p className="xcf-rp-d">{(p && p.lede) || it.desc}</p> : null}
                <p className="xcf-rp-p">{p && p.api ? <><span>api.hanzo.ai</span><b>{p.api}</b></> : <><span>hanzo.ai</span><b>{it.href}</b></>}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Enter>
  );
}

/* /cloud/local's boot story: its heading block, then its three figures as rows that open onto the boot lines that
   prove them (the figure's own line, and the commands and output up to the one whose time it is) */
function BootHead({ boot, e }) {
  return (
    <Enter kind={e} id={boot.id} className="xcf-sec xcf-boot" aria-labelledby="xcf-boot-h">
      <div className="xcf-wrap xcf-boot-head">
        <div data-half="l">
          <h2 id="xcf-boot-h" className="xcf-h2"><Letters text={boot.title} on={e === 'letter-cascade'} /></h2>
          <p className="xcf-tag">{boot.eyebrow}</p>
        </div>
        <p className="xcf-body" data-half="r">{boot.lede}</p>
      </div>
    </Enter>
  );
}
const lead = (s) => { const m = /^\d+(?:\.\d+)?/.exec(s || ''); return m ? Math.floor(Number(m[0])) : null; };
function proofOf(boot, f) {
  const L = boot.lines.filter((l) => l.text);
  const n = lead(f.value);
  const hit = n === null ? -1 : L.findIndex((l) => l.time && lead(l.time) === n);
  if (hit < 0) return L.slice(0, L.findIndex((l, i) => i > 0 && l.cmd));
  let from = hit;
  while (from > 0 && !L[from].cmd) from--;
  return L.slice(from, hit + 1);
}
function BootRows({ boot, e }) {
  const [at, setAt] = useState(0);
  const dwell = useRef(0);
  const mounted = useMounted();
  useEffect(() => () => clearTimeout(dwell.current), []);
  const lc = e === 'letter-cascade';
  return (
    <Enter kind={e} className="xcf-sec xcf-bootrows" aria-labelledby="xcf-boot-h">
      <div className="xcf-wrap">
        <ol className="xro xro-figs" data-half="r" onPointerLeave={() => clearTimeout(dwell.current)}>
          {boot.figures.map((f, i) => {
            const open = at === i;
            return (
              <li key={f.value} className={'xro-r' + (open ? ' open' : '')}>
                <h3 className="xro-h">
                  <button type="button" id={'xro-boot-h' + i} className="xro-head" aria-expanded={open} aria-controls={'xro-boot-p' + i}
                    onClick={() => setAt(i)} onFocus={() => setAt(i)}
                    onPointerEnter={(ev) => { if (ev.pointerType !== 'mouse') return; clearTimeout(dwell.current); dwell.current = setTimeout(() => setAt(i), 110); }}
                    onPointerLeave={() => clearTimeout(dwell.current)}>
                    <span className="xcf-n">{String(i + 1).padStart(2, '0')}</span>
                    <span className="xro-l xro-fv"><Letters text={f.value} on={lc} /></span>
                    <i className="xro-x" aria-hidden="true" />
                  </button>
                </h3>
                <div id={'xro-boot-p' + i} role="region" aria-labelledby={'xro-boot-h' + i} className="xro-p" inert={(mounted && !open) || undefined}>
                  <div className="xro-pi">
                    <div className="xro-win" data-room="dark">
                      <div className="xro-body xro-boot">
                        <p className="xro-lede">{f.label}</p>
                        <ol className="xro-tl" aria-hidden="true">
                          {proofOf(boot, f).map((l, k) => <li key={k} className={l.cmd ? 'cmd' : 'out'}>{l.cmd && <b>$</b>}<span>{l.text}</span>{l.time && <em>{l.time}</em>}</li>)}
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Enter>
  );
}

/* the order of the sections after the hero, by first screen (MOTION-MAP rule 2: no fixed sequence) */
const ORDER = {
  stage: ['family', 'ship', 'finder', 'related', 'motto'],
  wide: ['family', 'finder', 'related', 'ship', 'motto'],
  path: ['ship', 'family', 'related', 'finder', 'motto'],
  field: ['motto', 'family', 'ship', 'related', 'finder'],
  local: ['boothead', 'bootrows'],
};

export default function CloudProduct({ doc, pairs, group, sigil, cards = {}, previews = {} }) {
  const isLocal = doc.kind === 'local';
  const ask = isLocal ? doc.boot.actions[doc.boot.actions.length - 1] : doc.actions[0];
  const v = VARIANT[group] || 'stage';
  const rest = isLocal ? doc.boot.actions.filter((a) => a !== ask) : doc.actions.slice(1);
  const fig = isLocal ? null : figureOf(doc);
  // the sections after the hero, in this group's order, each with its entrance in the map's order (on /cloud/local
  // the hero's terminal takes the first); the closing Band takes the next one when there are fewer than five
  const SEC = {
    family: (e) => <Family doc={doc} previews={previews} e={e} />,
    ship: (e) => doc.ship && <Ship doc={doc} e={e} />,
    finder: (e) => <Finder pairs={pairs} here={doc.slug} e={e} />,
    related: (e) => <Related rel={doc.related} cards={cards} previews={previews} e={e} />,
    motto: (e) => <Motto text={doc.motto} e={e} />,
    boothead: (e) => <BootHead boot={doc.boot} e={e} />,
    bootrows: (e) => <BootRows boot={doc.boot} e={e} />,
  };
  const has = {
    family: !!(doc.window && doc.window.siblings.length > 1), ship: !!doc.ship, finder: pairs.some((p) => p.slug === doc.slug),
    related: !!doc.related, motto: !!doc.motto, boothead: isLocal, bootrows: isLocal,
  };
  const secs = ORDER[isLocal ? 'local' : v].filter((k) => has[k]);
  const E = isLocal ? ENTRANCES.slice(1) : ENTRANCES;
  const bandE = E[secs.length] && E[secs.length] !== 'letter-cascade' ? E[secs.length] : undefined;
  return (
    <main className={'xcf v-' + v + (isLocal ? ' k-local' : '')} data-ask-name={doc.name}>
      <noscript><style>{NOJS}</style></noscript>
      <section className="xcf-hero" aria-labelledby="xcf-h1">
        <div className="xcf-band">
          <Sigil seed={sigil.seed} data={sigil.data} className="xcf-sigil" />
          <div className="xcf-wrap xcf-head" data-morph-target>
            <Name name={doc.name} small={v === 'path'} />
            <div className="xcf-head-r">
              {doc.lede && <p className="xcf-lede">{doc.lede}</p>}
              <Acts list={isLocal ? [ask, ...rest] : doc.actions} slug={doc.slug} />
              {!!(doc.crumb && doc.crumb.length) && (
                <nav className="xcf-crumb" aria-label="Breadcrumb">
                  {doc.crumb.map((c, i) => <span key={i}>{i > 0 && <i aria-hidden="true">/</i>}{c.href ? <A to={c.href} className="x-link">{c.label}</A> : <span>{c.label}</span>}</span>)}
                </nav>
              )}
              {isLocal && <Chip label={doc.label} />}
            </div>
          </div>
        </div>
        {v === 'path' && doc.window && (
          <div className="xcf-wrap xcf-path-w">
            <p className="xcf-path-hero" aria-hidden="true"><span className="xcf-mask"><span>{doc.window.host[0]}</span></span><span className="xcf-mask b"><span>{doc.window.host[1]}</span></span><i className="xcf-pulse" /></p>
            {fig && <Fig fig={fig} sibs={doc.window.siblings} peek={null} label={doc.label} />}
          </div>
        )}
        <div className="xcf-wrap xcf-stage-w">
          {v === 'path' && <Facts doc={doc} />}
          <StageSettle className="xcf-stage" over={560} from={POSE[v]}>
            {isLocal ? <Enter as="div" kind={ENTRANCES[0]}><Boot boot={doc.boot} /></Enter> : doc.window && <Console doc={doc} v={v} fig={fig} previews={previews} sigil={sigil} />}
          </StageSettle>
        </div>
        {!isLocal && v !== 'path' && <div className="xcf-wrap"><Facts doc={doc} /></div>}
      </section>

      {secs.map((k, i) => <Fragment key={k}>{SEC[k](E[i])}</Fragment>)}

      <Enter as="div" kind={bandE} className="xcf-bandw">
      <Band
        title={doc.name}
        lede={doc.lede || undefined}
        action={ask.label}
        to={ask.href}
        note={(
          <span className="xcf-band-n">
            {doc.window && <code className="xcf-band-host">{doc.window.host.map((h, i) => <span key={i} className={i ? 'xcf-path' : ''}>{h}</span>)}<i className="xcf-pulse" aria-hidden="true" /></code>}
            {rest.map((a) => <A key={a.href} to={a.href} className="x-link xcf-band-l">{a.label}<Arrow /></A>)}
          </span>
        )}
      />
      </Enter>
    </main>
  );
}
